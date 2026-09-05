import type { EntityRef } from "./common";
import type { DomainEntity } from "./entities";
import type { SubjectGuide } from "./presentation";
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

export interface SubjectGuideDocument {
  documentType: "subject-guide";
  guide: SubjectGuide;
}

export type AuthoringDocument =
  | EntityDocument
  | RelationshipDocument
  | SubjectGuideDocument;

export interface CompiledDomainGraph {
  schemaVersion: "plural-graph-1";
  entities: DomainEntity[];
  relationships: DomainRelationship[];
  /** Reviewed/published guides safe for reader-facing consumers. */
  subjectGuides: SubjectGuide[];
  /** All validated guide records, including editorial workflow states. */
  subjectGuideRecords: SubjectGuide[];
  indexes: {
    entitiesById: Record<string, DomainEntity>;
    subjectGuidesById: Record<string, SubjectGuide>;
    subjectGuideIdsBySlug: Record<string, string>;
    subjectGuideRecordsById: Record<string, SubjectGuide>;
    subjectGuideRecordIdsBySlug: Record<string, string>;
    outgoingRelationshipIds: Record<string, string[]>;
    incomingRelationshipIds: Record<string, string[]>;
  };
}
