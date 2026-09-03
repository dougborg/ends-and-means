import type { EntityRef } from "./common";
import type { DomainEntity } from "./entities";
import type { DomainRelationship } from "./relationships";

export interface EntityDocument {
  documentType: "entity";
  entity: DomainEntity;
}

export interface RelationshipDocument {
  documentType: "relationships";
  subject: EntityRef;
  relationships: DomainRelationship[];
}

export type AuthoringDocument = EntityDocument | RelationshipDocument;

export interface CompiledDomainGraph {
  schemaVersion: "plural-graph-1";
  entities: DomainEntity[];
  relationships: DomainRelationship[];
  indexes: {
    entitiesById: Record<string, DomainEntity>;
    outgoingRelationshipIds: Record<string, string[]>;
    incomingRelationshipIds: Record<string, string[]>;
  };
}

