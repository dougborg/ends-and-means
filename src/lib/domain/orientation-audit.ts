import type { DomainEntity } from "./entities";
import type { CompiledDomainGraph } from "./graph";
import type { SubjectGuide } from "./presentation";
import type { ExternalReference } from "./common";

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

const notApplicableReasons: Partial<Record<DomainEntity["kind"], string>> = {
  "concept-scheme": "Internal vocabulary container, not an externally reconciled subject.",
  domain: "Internal browsing facet, not an externally reconciled subject.",
  dossier: "Presentation composition; identity remains with its canonical subject.",
  "research-obligation": "Editorial research question, not an external identity.",
  source: "Source identifiers and access links remain in source-owned fields.",
  statement: "Atomic project claim, not an external identity.",
  work: "Work identifiers remain in work- and source-owned fields.",
};

const unmatchedReasons: Partial<Record<DomainEntity["kind"], string>> = {
  approach: "No reviewed external page matches this scoped project approach closely enough.",
  case: "No reviewed external page matches this bounded case and period closely enough.",
  "case-episode": "No reviewed external page matches this bounded episode closely enough.",
  challenge: "Project-defined analytical question; no external identity is asserted.",
  collection: "Project-defined non-inheriting collection; no external identity is asserted.",
  "comparison-dimension": "Project-defined comparison lens; no external identity is asserted.",
  concept: "No reviewed external page matches this concept's authored boundary closely enough.",
  criterion: "Project-defined evaluative criterion; no external identity is asserted.",
  depiction: "No reviewed external page matches this project-owned interpretation.",
  end: "Attributed project record; no external identity is asserted.",
  event: "No reviewed external page matches this bounded event closely enough.",
  means: "No reviewed external page matches this specified institutional arrangement closely enough.",
  organization: "No reviewed external page matches this scoped organization closely enough.",
  place: "No reviewed external page matches this authored place boundary closely enough.",
  transition: "Project-defined before/change/after sequence; no external identity is asserted.",
};

function entityEntry(entity: DomainEntity): OrientationAuditEntry {
  const references = entity.externalRefs ?? [];
  const orientationUrls = references
    .filter(({ purpose }) => purpose === "orientation")
    .map(({ url }) => url);
  const identityIds = references
    .filter(({ purpose }) => purpose === "identity")
    .flatMap(({ id }) => (id ? [id] : []));
  if (orientationUrls.length || identityIds.length)
    return {
      targetType: "entity",
      id: entity.id,
      label: entity.label,
      disposition: "mapped",
      orientationUrls,
      identityIds,
      references,
    };
  if (eligibleKinds.has(entity.kind))
    return {
      targetType: "entity",
      id: entity.id,
      label: entity.label,
      disposition: "intentionally-unmatched",
      reason:
        unmatchedReasons[entity.kind] ??
        "No reviewed external page matches this canonical boundary closely enough.",
      orientationUrls,
      identityIds,
      references,
    };
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
}

function guideEntry(
  guide: SubjectGuide,
  graph: CompiledDomainGraph,
): OrientationAuditEntry {
  const subject = graph.indexes.entitiesById[guide.primarySubject.id];
  const mapped = subject ? entityEntry(subject) : undefined;
  if (mapped?.disposition === "mapped" && subject)
    return {
      targetType: "subject-guide",
      id: guide.id,
      label: guide.label,
      disposition: "mapped",
      reason: `Uses the reviewed mapping owned by ${subject.id}.`,
      orientationUrls: mapped.orientationUrls,
      identityIds: mapped.identityIds,
      references: mapped.references,
    };
  return {
    targetType: "subject-guide",
    id: guide.id,
    label: guide.label,
    disposition: "intentionally-unmatched",
    reason: `Its primary subject ${guide.primarySubject.id} has no defensible reviewed mapping.`,
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

export function validateOrientationAudit(
  graph: CompiledDomainGraph,
  inventory: OrientationAuditEntry[] = buildOrientationAudit(graph),
): string[] {
  const errors: string[] = [];
  const expected = buildOrientationAudit(graph);
  const expectedKeys = new Set(expected.map(({ targetType, id }) => `${targetType}:${id}`));
  const seen = new Set<string>();
  for (const entry of inventory)
    errors.push(...validateEntry(entry, expectedKeys, seen));
  for (const key of expectedKeys)
    if (!seen.has(key)) errors.push(`${key}: missing audit entry`);
  return errors;
}
