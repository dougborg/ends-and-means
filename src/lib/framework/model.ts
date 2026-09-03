export type ReviewStatus = "unreviewed-migration" | "research-needed" | "reviewed";

export interface FrameworkSource {
  id: string;
  authors: string[];
  title: string;
  year?: number;
  kind: string;
  reviewStatus: string;
  section?: string;
  note?: string;
  links?: Array<{ kind: string; url: string; label?: string; vendor?: string; affiliate?: boolean }>;
  identifiers?: {
    isbn10?: string;
    isbn13?: string;
    doi?: string;
    openLibrary?: string;
  };
}

export interface Tradition {
  id: string;
  name: string;
  description: string;
  caveat: string;
  reviewStatus: ReviewStatus;
}

export interface FrameworkTopic {
  id: string;
  label: string;
  description: string;
}

export interface FrameworkChallenge {
  id: string;
  question: string;
  rationale: string;
  topicIds: string[];
  reviewStatus: ReviewStatus;
}

export interface FrameworkCriterion {
  id: string;
  label: string;
  definition: string;
  normativeAssumptions: string[];
  evidenceRequirements: string[];
  limitations: string[];
  reviewStatus: ReviewStatus;
}

export interface MigratedStatement {
  id: string;
  text: string;
  role: "proposed-means" | "failure-hypothesis";
  claimKind: "unreviewed-editorial-claim";
  citations: string[];
  researchNeeded: true;
}

export interface ResponseDraft {
  id: string;
  traditionId: string;
  challengeId: string;
  means: MigratedStatement[];
  failureHypotheses: MigratedStatement[];
  reviewStatus: "unreviewed-migration";
}

export interface ResearchNote {
  id: string;
  traditionId: string;
  kind: "historical-evidence-inventory" | "criterion-observation";
  criterionId?: string;
  text: string;
  researchNeeded: true;
}

export interface FrameworkDraftGraph {
  schemaVersion: "framework-draft-1";
  status: "migration-draft";
  traditions: Tradition[];
  topics: FrameworkTopic[];
  challenges: FrameworkChallenge[];
  criteria: FrameworkCriterion[];
  responses: ResponseDraft[];
  researchNotes: ResearchNote[];
  sources: FrameworkSource[];
}
