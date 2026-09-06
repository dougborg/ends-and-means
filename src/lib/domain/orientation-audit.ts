import type { ExternalReference } from "./common";
import type { DomainEntity } from "./entities";
import type { CompiledDomainGraph } from "./graph";
import { reviewedOrientationLedger } from "./orientation-ledger";
import { reviewedOrientationLabels } from "./orientation-labels";
import {
  reviewedOrientationOnlyGuideSubjects,
  reviewedOrientationOnlyMappings,
} from "./orientation-only-mappings";
import { reviewedRejectedOrientationCandidates } from "./orientation-rejected-candidates";
import type { SubjectGuide } from "./presentation";

export type OrientationAuditEntry = {
  targetType: "entity" | "subject-guide";
  id: string;
  label: string;
  disposition: "mapped" | "intentionally-unmatched" | "not-applicable";
  reason?: string;
  orientationUrls: string[];
  identityIds: string[];
  references: ExternalReference[];
  consideredCandidates: Array<{
    title: string;
    url: string;
    boundary: string;
    resolution: {
      canonicalArticleTitle: string;
      canonicalArticleUrl: string;
      pageKind: "article";
      checkedAt: string;
      wikidataId?: string;
    };
  }>;
};

const live = ({ publicationStatus }: DomainEntity | SubjectGuide) =>
  ["reviewed", "published"].includes(publicationStatus);

const eligibleKinds = new Set<DomainEntity["kind"]>([
  "approach",
  "case",
  "case-episode",
  "challenge",
  "collection",
  "comparison-dimension",
  "concept",
  "criterion",
  "depiction",
  "end",
  "event",
  "means",
  "organization",
  "place",
  "transition",
]);

const reviewedDecisions = new Map(
  reviewedOrientationLedger.map((decision) => [
    `${decision.targetType}:${decision.id}`,
    decision,
  ]),
);

const notApplicableReasons: Partial<Record<DomainEntity["kind"], string>> = {
  "concept-scheme":
    "Internal vocabulary container, not an externally reconciled subject.",
  domain: "Internal browsing facet, not an externally reconciled subject.",
  dossier:
    "Presentation composition; identity remains with its canonical subject.",
  "research-obligation":
    "Editorial research question, not an external identity.",
  source: "Source identifiers and access links remain in source-owned fields.",
  statement: "Atomic project claim, not an external identity.",
  work: "Work identifiers remain in work- and source-owned fields.",
};

function entityEntry(entity: DomainEntity): OrientationAuditEntry {
  const references = entity.externalRefs ?? [];
  const orientationUrls = references
    .filter(({ purpose }) => purpose === "orientation")
    .map(({ url }) => url);
  const identityIds = references
    .filter(({ purpose }) => purpose === "identity")
    .flatMap(({ id }) => (id ? [id] : []));
  if (!eligibleKinds.has(entity.kind))
    return {
      targetType: "entity",
      id: entity.id,
      label: entity.label,
      disposition: "not-applicable",
      reason:
        notApplicableReasons[entity.kind] ??
        "This entity kind does not carry external orientation or identity mappings.",
      orientationUrls,
      identityIds,
      references,
      consideredCandidates: [],
    };
  const decision = reviewedDecisions.get(`entity:${entity.id}`);
  if (decision?.disposition === "mapped")
    return {
      targetType: "entity",
      id: entity.id,
      label: entity.label,
      disposition: "mapped",
      ...(decision.reason ? { reason: decision.reason } : {}),
      orientationUrls,
      identityIds,
      references,
      consideredCandidates: [],
    };
  return {
    targetType: "entity",
    id: entity.id,
    label: entity.label,
    disposition: "intentionally-unmatched",
    ...(decision?.reason ? { reason: decision.reason } : {}),
    orientationUrls,
    identityIds,
    references,
    consideredCandidates: decision?.consideredCandidates ?? [],
  };
}

function guideEntry(
  guide: SubjectGuide,
  graph: CompiledDomainGraph,
): OrientationAuditEntry {
  const subject = graph.indexes.entitiesById[guide.primarySubject.id];
  const mapped = subject ? entityEntry(subject) : undefined;
  const decision = reviewedDecisions.get(`subject-guide:${guide.id}`);
  if (decision?.disposition === "mapped" && mapped && subject)
    return {
      targetType: "subject-guide",
      id: guide.id,
      label: guide.label,
      disposition: "mapped",
      ...(decision.reason ? { reason: decision.reason } : {}),
      orientationUrls: mapped.orientationUrls,
      identityIds: mapped.identityIds,
      references: mapped.references,
      consideredCandidates: [],
    };
  return {
    targetType: "subject-guide",
    id: guide.id,
    label: guide.label,
    disposition: "intentionally-unmatched",
    ...(decision?.reason ? { reason: decision.reason } : {}),
    orientationUrls: [],
    identityIds: [],
    references: [],
    consideredCandidates: decision?.consideredCandidates ?? [],
  };
}

export function buildOrientationAudit(
  graph: CompiledDomainGraph,
): OrientationAuditEntry[] {
  return [
    ...graph.entities.filter(live).map(entityEntry),
    ...graph.subjectGuides
      .filter(live)
      .map((guide) => guideEntry(guide, graph)),
  ].sort((left, right) =>
    `${left.targetType}:${left.id}`.localeCompare(
      `${right.targetType}:${right.id}`,
    ),
  );
}

function validateEntry(
  entry: OrientationAuditEntry,
  expected: OrientationAuditEntry | undefined,
  expectedKeys: Set<string>,
  seen: Set<string>,
) {
  const errors: string[] = [];
  const key = `${entry.targetType}:${entry.id}`;
  if (seen.has(key)) errors.push(`${key}: duplicate audit entry`);
  seen.add(key);
  if (!expectedKeys.has(key)) errors.push(`${key}: target is not published`);
  if (expected && entry.label !== expected.label)
    errors.push(`${key}: projected label changed`);
  if (
    expected &&
    JSON.stringify(entry.orientationUrls) !==
      JSON.stringify(expected.orientationUrls)
  )
    errors.push(`${key}: projected orientation URLs changed`);
  if (
    expected &&
    JSON.stringify(entry.identityIds) !== JSON.stringify(expected.identityIds)
  )
    errors.push(`${key}: projected identity IDs changed`);
  const decision = reviewedDecisions.get(key);
  errors.push(...validateReviewedDecision(key, entry, decision));
  if (entry.disposition !== "mapped" && !entry.reason?.trim())
    errors.push(`${entry.targetType} ${entry.id}: absence requires a reason`);
  if (
    entry.disposition === "mapped" &&
    entry.orientationUrls.length === 0 &&
    entry.identityIds.length === 0
  )
    errors.push(`${entry.targetType} ${entry.id}: mapped entry has no mapping`);
  errors.push(...validateOrientationOnlyBoundary(key, entry));
  if (
    entry.disposition !== "mapped" &&
    (entry.orientationUrls.length > 0 || entry.identityIds.length > 0)
  )
    errors.push(
      `${entry.targetType} ${entry.id}: absent entry contains a mapping`,
    );
  errors.push(...validateCandidateReview(key, entry));
  return errors;
}

function validateOrientationOnlyBoundary(
  key: string,
  entry: OrientationAuditEntry,
) {
  const isReviewedOrientationOnly =
    entry.id in reviewedOrientationOnlyMappings ||
    entry.id in reviewedOrientationOnlyGuideSubjects;
  const hasBoundary =
    entry.reason?.includes("directly") ||
    entry.reason?.startsWith("Uses the reviewed orientation-only mapping");
  if (
    entry.disposition !== "mapped" ||
    entry.orientationUrls.length === 0 ||
    entry.identityIds.length > 0 ||
    !isReviewedOrientationOnly ||
    hasBoundary
  )
    return [];
  return [
    `${key}: orientation-only mapping lacks the reviewed explanatory-target boundary`,
  ];
}

function validateCandidateReview(key: string, entry: OrientationAuditEntry) {
  const errors: string[] = [];
  const placeholderTitles = new Set([
    "Case study",
    "Concept",
    "Event",
    "Ideology",
    "Institution",
    "Organization",
    "Place",
    "Political philosophy",
  ]);
  if (
    entry.disposition === "intentionally-unmatched" &&
    entry.consideredCandidates.length === 0
  )
    errors.push(`${key}: unmatched decision lacks a reviewed candidate`);
  for (const candidate of entry.consideredCandidates) {
    if (placeholderTitles.has(candidate.title))
      errors.push(`${key}: rejected candidate is a category placeholder`);
    if (!candidate.title.trim() || !candidate.boundary.includes(entry.label))
      errors.push(
        `${key}: rejected candidate lacks a target-specific boundary`,
      );
    if (
      !/^https:\/\/en\.wikipedia\.org\/wiki\/[A-Za-z0-9%_'()\-.]+$/.test(
        candidate.url,
      )
    )
      errors.push(`${key}: rejected candidate is not a canonical article URL`);
    if (
      candidate.resolution.pageKind !== "article" ||
      candidate.resolution.checkedAt !== "2026-09-06" ||
      candidate.resolution.canonicalArticleTitle !== candidate.title ||
      candidate.resolution.canonicalArticleUrl !== candidate.url
    )
      errors.push(
        `${key}: rejected candidate lacks checked canonical resolution`,
      );
    if (
      /\/wiki\/(?:Category:|List_of_|.*\(disambiguation\)$)/.test(candidate.url)
    )
      errors.push(`${key}: rejected candidate resolves to a non-article page`);
  }
  return errors;
}

function validateReviewedLabel(key: string, entry: OrientationAuditEntry) {
  const errors: string[] = [];
  const reviewedLabel =
    reviewedOrientationLabels[key as keyof typeof reviewedOrientationLabels];
  if (reviewedLabel === undefined)
    errors.push(`${key}: missing immutable reviewed label`);
  else if (entry.label !== reviewedLabel)
    errors.push(`${key}: canonical label changed from reviewed ledger`);
  return errors;
}

function validateReviewedDecision(
  key: string,
  entry: OrientationAuditEntry,
  decision: (typeof reviewedOrientationLedger)[number] | undefined,
) {
  const errors: string[] = [];
  if (entry.disposition !== "not-applicable" && !decision)
    errors.push(`${key}: missing target-specific reviewed decision`);
  if (decision) errors.push(...validateReviewedLabel(key, entry));
  if (decision && entry.disposition !== decision.disposition)
    errors.push(`${key}: reviewed disposition changed`);
  if (decision && entry.reason !== decision.reason)
    errors.push(`${key}: reviewed reason changed`);
  if (
    decision &&
    JSON.stringify(entry.references) !== JSON.stringify(decision.references)
  )
    errors.push(`${key}: reviewed reference tuple changed`);
  if (
    decision &&
    JSON.stringify(entry.consideredCandidates) !==
      JSON.stringify(decision.consideredCandidates ?? [])
  )
    errors.push(`${key}: reviewed rejected-candidate decision changed`);
  if (
    decision?.disposition === "mapped" &&
    (!decision.resolution ||
      typeof decision.resolution === "string" ||
      decision.resolution.pageKind !== "article" ||
      decision.resolution.checkedAt !== "2026-09-06" ||
      decision.resolution.canonicalArticleUrl !== entry.orientationUrls[0] ||
      decision.resolution.wikidataId !== entry.identityIds[0])
  )
    errors.push(`${key}: canonical-target resolution is not reviewed or stale`);
  return errors;
}

export function validateOrientationAudit(
  graph: CompiledDomainGraph,
  inventory: OrientationAuditEntry[] = buildOrientationAudit(graph),
): string[] {
  const errors: string[] = [];
  const expected = buildOrientationAudit(graph);
  const expectedEntries = new Map(
    expected.map((entry) => [`${entry.targetType}:${entry.id}`, entry]),
  );
  const expectedKeys = new Set(
    expected.map(({ targetType, id }) => `${targetType}:${id}`),
  );
  const expectedReviewedKeys = new Set(
    expected
      .filter((entry) => {
        if (entry.targetType === "subject-guide") return true;
        const entity = graph.indexes.entitiesById[entry.id];
        return Boolean(entity && eligibleKinds.has(entity.kind));
      })
      .map(({ targetType, id }) => `${targetType}:${id}`),
  );
  const expectedUnmatchedKeys = new Set(
    expected
      .filter(({ disposition }) => disposition === "intentionally-unmatched")
      .map(({ targetType, id }) => `${targetType}:${id}`),
  );
  if (reviewedDecisions.size !== reviewedOrientationLedger.length)
    errors.push("reviewed orientation ledger contains duplicate targets");
  for (const key of reviewedDecisions.keys())
    if (!expectedReviewedKeys.has(key))
      errors.push(`${key}: stale reviewed decision`);
  for (const key of Object.keys(reviewedOrientationLabels))
    if (!expectedReviewedKeys.has(key))
      errors.push(`${key}: stale immutable reviewed label`);
  for (const key of Object.keys(reviewedRejectedOrientationCandidates))
    if (!expectedUnmatchedKeys.has(key))
      errors.push(`${key}: stale rejected-candidate review`);
  const seen = new Set<string>();
  for (const entry of inventory)
    errors.push(
      ...validateEntry(
        entry,
        expectedEntries.get(`${entry.targetType}:${entry.id}`),
        expectedKeys,
        seen,
      ),
    );
  for (const key of expectedKeys)
    if (!seen.has(key)) errors.push(`${key}: missing audit entry`);
  return errors;
}
