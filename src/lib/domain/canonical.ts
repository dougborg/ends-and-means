import { canonicalDocuments } from "../../../content/domain";
import { compileDomainGraph } from "./compile";
import type { DomainEntity, ResearchObligation } from "./entities";
import type { CompiledDomainGraph } from "./graph";
import type { DossierSubjectKind } from "./presentation";
import type { DomainRelationship } from "./relationships";
import { buildOrientationAudit, validateOrientationAudit } from "./orientation-audit";

export const canonicalGraph = compileDomainGraph(canonicalDocuments);
export const orientationAuditInventory = buildOrientationAudit(canonicalGraph);

const orientationAuditErrors = validateOrientationAudit(canonicalGraph);
if (orientationAuditErrors.length)
  throw new Error(`Orientation audit failed:\n${orientationAuditErrors.join("\n")}`);

export function entitiesOfKind<K extends DomainEntity["kind"]>(kind: K) {
  return canonicalGraph.entities.filter(
    (entity): entity is Extract<DomainEntity, { kind: K }> =>
      entity.kind === kind,
  );
}

export function publicEntitiesOfKind<K extends DomainEntity["kind"]>(
  kind: K,
  graph: CompiledDomainGraph = canonicalGraph,
) {
  return graph.entities.filter(
    (entity): entity is Extract<DomainEntity, { kind: K }> =>
      entity.kind === kind &&
      ["reviewed", "published"].includes(entity.publicationStatus),
  );
}

export function relationshipsFrom(id: string) {
  const ids = new Set(canonicalGraph.indexes.outgoingRelationshipIds[id] ?? []);
  return canonicalGraph.relationships.filter((relationship) =>
    ids.has(relationship.id),
  );
}

export function relationshipsTo(id: string) {
  const ids = new Set(canonicalGraph.indexes.incomingRelationshipIds[id] ?? []);
  return canonicalGraph.relationships.filter((relationship) =>
    ids.has(relationship.id),
  );
}

export function entityById<T extends DomainEntity = DomainEntity>(id: string) {
  return canonicalGraph.indexes.entitiesById[id] as T | undefined;
}

export function requireEntityOfKind<K extends DomainEntity["kind"]>(
  id: string,
  kind: K,
) {
  const entity = entityById(id);
  if (!entity || entity.kind !== kind)
    throw new Error(`Expected canonical ${kind} ${id}`);
  return entity as Extract<DomainEntity, { kind: K }>;
}

export function citationsFor(statementId: string) {
  return relationshipsFrom(statementId).filter(
    (
      relationship,
    ): relationship is Extract<DomainRelationship, { predicate: "cites" }> =>
      relationship.predicate === "cites",
  );
}

export function dossierForSubject(
  kind: DossierSubjectKind,
  id: string,
  graph: CompiledDomainGraph = canonicalGraph,
) {
  return graph.entities
    .filter(
      (entity): entity is Extract<DomainEntity, { kind: "dossier" }> =>
        entity.kind === "dossier",
    )
    .find(
      (dossier) =>
        ["reviewed", "published"].includes(dossier.publicationStatus) &&
        dossier.subject.kind === kind &&
        dossier.subject.id === id,
    );
}

export function subjectGuideById(
  id: string,
  graph: CompiledDomainGraph = canonicalGraph,
) {
  return graph.indexes.subjectGuidesById[id];
}

export function subjectGuideBySlug(
  slug: string,
  graph: CompiledDomainGraph = canonicalGraph,
) {
  const id = graph.indexes.subjectGuideIdsBySlug[slug];
  return id ? subjectGuideById(id, graph) : undefined;
}

export function subjectGuideRecordById(
  id: string,
  graph: CompiledDomainGraph = canonicalGraph,
) {
  return graph.indexes.subjectGuideRecordsById[id];
}

export function researchObligationsForTarget(
  kind: ResearchObligation["target"]["kind"],
  id: string,
) {
  return entitiesOfKind("research-obligation").filter(
    ({ target, obligationStatus, publicationStatus }) =>
      target.kind === kind &&
      target.id === id &&
      ["open", "partially-addressed"].includes(obligationStatus) &&
      ["reviewed", "published"].includes(publicationStatus),
  );
}

export function researchTargetHref({
  target,
  targetSectionId,
}: Pick<ResearchObligation, "target" | "targetSectionId">) {
  const base = {
    approach: `/explore/${target.id}/`,
    case: `/cases/${target.id}/`,
    challenge: `/challenges/${target.id}/`,
    concept: `/concepts/${target.id}/`,
  }[target.kind];
  return targetSectionId ? `${base}#${targetSectionId}` : base;
}

export function placementsForDimension(dimensionId: string) {
  return canonicalGraph.relationships.filter(
    (
      relationship,
    ): relationship is Extract<
      DomainRelationship,
      { predicate: "placed-on" }
    > =>
      relationship.predicate === "placed-on" &&
      relationship.object.id === dimensionId,
  );
}
