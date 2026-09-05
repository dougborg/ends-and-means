import type { EntityBase, EntityRef } from "./common";

export interface NarrativeSection {
  id: string;
  heading: string;
  body: string;
  traceStatus: "supported" | "qualified" | "research-gap";
  statementIds: string[];
  relatedEntityRefs?: EntityRef[];
}

export type DossierSubjectKind =
  | "concept"
  | "collection"
  | "approach"
  | "end"
  | "means"
  | "challenge"
  | "criterion"
  | "place"
  | "case"
  | "case-episode"
  | "event"
  | "transition"
  | "comparison-dimension"
  | "person"
  | "organization"
  | "depiction";

export interface Dossier extends EntityBase {
  kind: "dossier";
  subject: EntityRef & { kind: DossierSubjectKind };
  standfirst: string;
  sections: NarrativeSection[];
  reviewedAt: string;
}

export type PresentationEntity = Dossier;
