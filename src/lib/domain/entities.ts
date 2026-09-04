import type { EntityBase } from "./common";
import type { VocabularyEntity } from "./vocabulary";

export interface Approach extends EntityBase {
  kind: "approach";
  scope: string;
}

export interface End extends EntityBase {
  kind: "end";
  scope: string;
}

export interface Means extends EntityBase {
  kind: "means";
  institutionalForm: string;
}

export interface Statement extends EntityBase {
  kind: "statement";
  statementKind: "observation" | "attributed-value" | "definition" | "causal-hypothesis" | "classification" | "editorial-interpretation";
  text: string;
}

export interface Source extends EntityBase {
  kind: "source";
  sourceType: string;
  title: string;
}

export type DomainEntity = VocabularyEntity | Approach | End | Means | Statement | Source;
