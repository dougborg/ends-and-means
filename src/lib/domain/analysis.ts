import type { EntityBase } from "./common";

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

export type AnalysisEntity = Challenge | Criterion;
