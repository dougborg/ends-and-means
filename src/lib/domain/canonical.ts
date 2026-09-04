import { canonicalDocuments } from "../../../content/domain";
import { compileDomainGraph } from "./compile";
import type { DomainEntity } from "./entities";
import type { DomainRelationship } from "./relationships";

export const canonicalGraph = compileDomainGraph(canonicalDocuments);

export function entitiesOfKind<K extends DomainEntity["kind"]>(kind: K) {
  return canonicalGraph.entities.filter((entity): entity is Extract<DomainEntity, { kind: K }> => entity.kind === kind);
}

export function relationshipsFrom(id: string) {
  const ids = new Set(canonicalGraph.indexes.outgoingRelationshipIds[id] ?? []);
  return canonicalGraph.relationships.filter((relationship) => ids.has(relationship.id));
}

export function relationshipsTo(id: string) {
  const ids = new Set(canonicalGraph.indexes.incomingRelationshipIds[id] ?? []);
  return canonicalGraph.relationships.filter((relationship) => ids.has(relationship.id));
}

export function entityById<T extends DomainEntity = DomainEntity>(id: string) {
  return canonicalGraph.indexes.entitiesById[id] as T | undefined;
}

export function citationsFor(statementId: string) {
  return relationshipsFrom(statementId).filter((relationship): relationship is Extract<DomainRelationship, { predicate: "cites" }> => relationship.predicate === "cites");
}

export function placementsForDimension(dimensionId: string) {
  return canonicalGraph.relationships.filter((relationship): relationship is Extract<DomainRelationship, { predicate: "placed-on" }> =>
    relationship.predicate === "placed-on" && relationship.object.id === dimensionId,
  );
}
