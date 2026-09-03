export type ClaimKind = "fact" | "inference" | "value-judgment";
export type Uncertainty = "low" | "moderate" | "high";
export interface Citation { sourceId: string; locator: string }
export interface Scope { caseIds: string[]; geography: string[]; period: { start: string; end: string } }
export interface Statement { id: string; text: string; kind: ClaimKind; uncertainty: Uncertainty; citations: Citation[] }
export interface EndAttribution extends Statement { type: "declared" | "design-implied" | "practice-interpreted"; attributedTo: string; reasoning: string; scope: Scope }
export interface Observation extends Statement { participantIds: string[] }
export interface FormalRule extends Statement { implementsMeansIds: string[] }
export interface AnalyticalPrototype {
  schemaVersion: "iad-prototype-1"; status: "non-canonical";
  tradition: { id: string; label: string; caveat: string };
  challenges: Array<{ id: string; question: string; rationale: string }>;
  sources: Array<{ id: string; title: string; authors: string[]; year: number; url: string }>;
  ends: Array<{ id: string; label: string; attributions: EndAttribution[] }>;
  means: Array<Statement & { ruleType: "position" | "boundary" | "authority" | "aggregation" | "scope" | "information" | "payoff"; level: "operational" | "collective-choice" | "constitutional" }>;
  criteria: Array<{ id: string; label: string; definition: string; appliesToChallengeIds: string[]; evidenceRequirements: string[]; normativeAssumptions: string[]; limitations: string[] }>;
  cases: Array<{
    id: string; name: string; location: string; period: { start: string; end: string }; boundary: string;
    traditionRelationship: { traditionId: string; relation: "partial" | "contested" | "influenced-by"; reasoning: string };
    context: { materialConditions: string[]; communityAttributes: string[] };
    participants: Array<{ id: string; label: string; role: string; resources: string[]; information: string[] }>;
    formalRules: FormalRule[]; rulesInUse: Statement[]; interactionPatterns: Observation[]; outcomes: Statement[];
  }>;
  interpretations: Array<Statement & { target: { type: "outcome" | "assessment"; id: string }; position: "supports" | "challenges" | "qualifies" | "alternative-cause"; attributedTo: string[]; reasoning: string; scope: Scope }>;
  traces: Array<{
    id: string; challengeId: string; endAttributionIds: string[]; meansIds: string[]; expectedInteractions: Observation[]; caseIds: string[]; outcomeIds: string[];
    assessments: Array<Statement & { criterionId: string; outcomeIds: string[]; interpretationIds: string[]; reasoning: string }>;
  }>;
}
