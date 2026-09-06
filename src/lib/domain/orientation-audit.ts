import type { DomainEntity } from "./entities";
import type { CompiledDomainGraph } from "./graph";
import type { SubjectGuide } from "./presentation";
import type { ExternalReference } from "./common";
import { reviewedOrientationLedger } from "./orientation-ledger";

export type OrientationAuditEntry = {
  targetType: "entity" | "subject-guide";
  id: string;
  label: string;
  disposition: "mapped" | "intentionally-unmatched" | "not-applicable";
  reason?: string;
  orientationUrls: string[];
  identityIds: string[];
  references: ExternalReference[];
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
  "concept-scheme": "Internal vocabulary container, not an externally reconciled subject.",
  domain: "Internal browsing facet, not an externally reconciled subject.",
  dossier: "Presentation composition; identity remains with its canonical subject.",
  "research-obligation": "Editorial research question, not an external identity.",
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
    };
  const decision = reviewedDecisions.get(`entity:${entity.id}`);
  if (decision?.disposition === "mapped")
    return {
      targetType: "entity",
      id: entity.id,
      label: entity.label,
      disposition: "mapped",
      orientationUrls,
      identityIds,
      references,
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
  };
}

export function buildOrientationAudit(
  graph: CompiledDomainGraph,
): OrientationAuditEntry[] {
  return [
    ...graph.entities.filter(live).map(entityEntry),
    ...graph.subjectGuides.filter(live).map((guide) => guideEntry(guide, graph)),
  ].sort((left, right) =>
    `${left.targetType}:${left.id}`.localeCompare(`${right.targetType}:${right.id}`),
  );
}

function validateEntry(
  entry: OrientationAuditEntry,
  expectedKeys: Set<string>,
  seen: Set<string>,
) {
  const errors: string[] = [];
  const key = `${entry.targetType}:${entry.id}`;
  if (seen.has(key)) errors.push(`${key}: duplicate audit entry`);
  seen.add(key);
  if (!expectedKeys.has(key)) errors.push(`${key}: target is not published`);
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
  if (
    entry.disposition !== "mapped" &&
    (entry.orientationUrls.length > 0 || entry.identityIds.length > 0)
  )
    errors.push(`${entry.targetType} ${entry.id}: absent entry contains a mapping`);
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
    decision?.disposition === "mapped" &&
    decision.resolution !== "direct-canonical-target"
  )
    errors.push(`${key}: canonical-target resolution is not reviewed`);
  return errors;
}

export function validateOrientationAudit(
  graph: CompiledDomainGraph,
  inventory: OrientationAuditEntry[] = buildOrientationAudit(graph),
): string[] {
  const errors: string[] = [];
  const expected = buildOrientationAudit(graph);
  const expectedKeys = new Set(expected.map(({ targetType, id }) => `${targetType}:${id}`));
  const expectedReviewedKeys = new Set(
    expected
      .filter((entry) => {
        if (entry.targetType === "subject-guide") return true;
        const entity = graph.indexes.entitiesById[entry.id];
        return Boolean(entity && eligibleKinds.has(entity.kind));
      })
      .map(({ targetType, id }) => `${targetType}:${id}`),
  );
  if (reviewedDecisions.size !== reviewedOrientationLedger.length)
    errors.push("reviewed orientation ledger contains duplicate targets");
  for (const key of reviewedDecisions.keys())
    if (!expectedReviewedKeys.has(key))
      errors.push(`${key}: stale reviewed decision`);
  const seen = new Set<string>();
  for (const entry of inventory)
    errors.push(...validateEntry(entry, expectedKeys, seen));
  for (const key of expectedKeys)
    if (!seen.has(key)) errors.push(`${key}: missing audit entry`);
  return errors;
}
