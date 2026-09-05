import { canonicalDocuments } from "../../../content/domain";
import { compileDomainGraph } from "./compile";
import type { DomainEntity, ResearchObligation } from "./entities";
import type { DomainRelationship } from "./relationships";
import type { DossierSubjectKind } from "./presentation";
import type { CompiledDomainGraph } from "./graph";

export const canonicalGraph = compileDomainGraph(canonicalDocuments);

export function entitiesOfKind<K extends DomainEntity["kind"]>(kind: K) {
  return canonicalGraph.entities.filter(
    (entity): entity is Extract<DomainEntity, { kind: K }> =>
      entity.kind === kind,
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
