export type PublicationStatus = "research-needed" | "in-review" | "reviewed" | "published" | "deprecated";
export type RelationshipStatus = "asserted" | "qualified" | "contested" | "research-needed";

export type EntityKind =
  | "concept-scheme" | "concept" | "collection" | "domain"
  | "approach" | "end" | "means" | "topic" | "challenge" | "criterion"
  | "case" | "case-episode" | "event" | "transition" | "comparison-dimension"
  | "statement" | "source" | "work" | "person" | "organization" | "depiction";

export interface EntityRef {
  kind: EntityKind;
  id: string;
}

export interface ExternalReference {
  system: "wikipedia" | "wikidata" | "loc" | "viaf" | "doi" | "isbn" | "other";
  id?: string;
  url: string;
  purpose: "orientation" | "identity" | "access" | "evidence";
  checkedAt: string;
}

export interface EntityBase {
  id: string;
  kind: EntityKind;
  label: string;
  description: string;
  publicationStatus: PublicationStatus;
  externalRefs?: ExternalReference[];
}

