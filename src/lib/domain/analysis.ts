import type { EntityBase } from "./common";

export type ComparisonSubjectKind = "concept" | "collection" | "approach" | "means" | "case" | "case-episode";

export interface DimensionValueDefinition {
  id: string;
  label: string;
  description: string;
  order: number;
}

export interface ComparisonDimension extends EntityBase {
  kind: "comparison-dimension";
  definition: string;
  valueType: "ordinal" | "categorical";
  values: DimensionValueDefinition[];
  eligibleSubjectKinds: ComparisonSubjectKind[];
  method: string;
  normativeChoices: string[];
  knownCorrelationIds: string[];
  limitations: string[];
  statementIds: string[];
}

export interface Challenge extends EntityBase {
  kind: "challenge";
  question: string;
  rationale: string;
}

export interface Criterion extends EntityBase {
  kind: "criterion";
  definition: string;
  evidenceRequirements: string[];
  normativeAssumptions: string[];
  limitations: string[];
}

export type AnalysisEntity = Challenge | Criterion | ComparisonDimension;
