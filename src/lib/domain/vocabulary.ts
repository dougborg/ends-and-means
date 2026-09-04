import type { EntityBase } from "./common";

export interface ConceptScheme extends EntityBase {
  kind: "concept-scheme";
  scope: string;
}

export interface Concept extends EntityBase {
  kind: "concept";
  schemeIds: string[];
  alternateLabels?: string[];
  hiddenLabels?: string[];
  scopeNote: string;
}

export interface Collection extends EntityBase {
  kind: "collection";
  inclusionRule: string;
  editorialPurpose: string;
}

export interface Domain extends EntityBase {
  kind: "domain";
  sphere: "political" | "economic" | "social" | "legal" | "cultural" | "cross-cutting";
  schemeIds: string[];
}

export type VocabularyEntity = ConceptScheme | Concept | Collection | Domain;
