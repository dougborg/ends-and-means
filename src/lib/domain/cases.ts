import type { EntityBase } from "./common";

export interface HistoricalDate {
  year?: number;
  month?: number;
  day?: number;
  certainty: "exact" | "approximate" | "disputed" | "unknown";
  note?: string;
}

export interface Place extends EntityBase {
  kind: "place";
  placeType: "country" | "region" | "city" | "settlement" | "territory" | "institutional-jurisdiction" | "other";
}

interface CaseBase extends EntityBase {
  locationIds: string[];
  startDate: HistoricalDate;
  endDate?: HistoricalDate;
  scope: string;
  conditionStatementIds: string[];
}

export interface Case extends CaseBase {
  kind: "case";
  overview: Array<{
    heading: string;
    text: string;
    statementIds: string[];
  }>;
  selectionRationale: string;
  episodeIds: string[];
  asOf?: string;
  lastReviewedAt?: string;
  freshness?: "current" | "stale" | "review-needed";
}

export interface CaseEpisode extends CaseBase {
  kind: "case-episode";
  caseId: string;
  formalRuleStatementIds: string[];
  ruleInUseStatementIds: string[];
  interactionStatementIds: string[];
  outcomeStatementIds: string[];
}

export interface Event extends EntityBase {
  kind: "event";
  eventKindIds: string[];
  placeIds: string[];
  startDate: HistoricalDate;
  endDate?: HistoricalDate;
  descriptionStatementIds: string[];
}

export interface Transition extends EntityBase {
  kind: "transition";
  caseId: string;
  fromEpisodeIds: string[];
  toEpisodeIds: string[];
  eventIds: string[];
  changedRelationshipIds: string[];
  boundaryStatus: "exact" | "approximate" | "disputed" | "open";
  explanationStatementIds: string[];
  rivalInterpretationStatementIds: string[];
}

export type EvidenceEntity = Place | Case | CaseEpisode | Event | Transition;
