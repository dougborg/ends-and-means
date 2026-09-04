import type { EntityRef, RelationshipStatus } from "./common";

export interface RelationshipScope {
  startDate?: string;
  endDate?: string;
  placeIds?: string[];
  note?: string;
}

export interface RelationshipBase {
  id: string;
  subject: EntityRef;
  object: EntityRef;
  status: RelationshipStatus;
  statementIds: string[];
  scope?: RelationshipScope;
}

export interface ConceptRelationship extends RelationshipBase {
  predicate: "broader-than" | "narrower-than" | "related-to" | "commonly-confused-with";
  subject: EntityRef & { kind: "concept" };
  object: EntityRef & { kind: "concept" };
}

export interface CollectionMembership extends RelationshipBase {
  predicate: "member-of";
  subject: EntityRef & { kind: "concept" | "approach" | "collection" };
  object: EntityRef & { kind: "collection" };
  membership: "widely-accepted" | "qualified" | "contested";
}

export interface DomainAssignment extends RelationshipBase {
  predicate: "addresses-domain";
  object: EntityRef & { kind: "domain" };
  centrality: "defining" | "substantial" | "adjacent";
}

export interface ApproachConceptRelationship extends RelationshipBase {
  predicate: "interprets-concept";
  subject: EntityRef & { kind: "approach" };
  object: EntityRef & { kind: "concept" };
  role: "core" | "adjacent" | "peripheral" | "contested";
  interpretation: string;
}

export interface ApproachEndRelationship extends RelationshipBase {
  predicate: "advances-end" | "rejects-end" | "internally-contests-end";
  subject: EntityRef & { kind: "approach" };
  object: EntityRef & { kind: "end" };
}

export interface ApproachMeansRelationship extends RelationshipBase {
  predicate: "advocates-means" | "permits-means" | "rejects-means" | "internally-contests-means";
  subject: EntityRef & { kind: "approach" };
  object: EntityRef & { kind: "means" };
}

export interface ConceptCaseRelationship extends RelationshipBase {
  predicate: "applies-to-case" | "contested-in-case";
  subject: EntityRef & { kind: "case" | "case-episode" };
  object: EntityRef & { kind: "concept" };
}

export interface CaseApproachRelationship extends RelationshipBase {
  predicate: "self-identified-with" | "influenced-by" | "partially-instantiated" | "hybridized-with" | "departed-from";
  subject: EntityRef & { kind: "case" | "case-episode" };
  object: EntityRef & { kind: "approach" };
}

export interface CaseMeansRelationship extends RelationshipBase {
  predicate: "used-means";
  subject: EntityRef & { kind: "case" | "case-episode" };
  object: EntityRef & { kind: "means" };
  implementation: "formal-design" | "rules-in-use" | "mixed" | "contested";
}

export interface StatementCitation {
  id: string;
  predicate: "cites";
  subject: EntityRef & { kind: "statement" };
  object: EntityRef & { kind: "source" };
  role: "supports" | "challenges" | "qualifies" | "context";
  locator: string;
  note?: string;
}

export type DomainRelationship = ConceptRelationship | CollectionMembership | DomainAssignment | ApproachConceptRelationship | ApproachEndRelationship | ApproachMeansRelationship | ConceptCaseRelationship | CaseApproachRelationship | CaseMeansRelationship | StatementCitation;
