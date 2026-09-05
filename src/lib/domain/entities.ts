import type { EntityBase } from "./common";
import type { AnalysisEntity } from "./analysis";
import type { EvidenceEntity } from "./cases";
import type { VocabularyEntity } from "./vocabulary";
import type { PresentationEntity } from "./presentation";

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
  statementKind:
    | "observation"
    | "attributed-value"
    | "definition"
    | "causal-hypothesis"
    | "classification"
    | "editorial-interpretation";
  text: string;
}

export type WorkType =
  | "book"
  | "article"
  | "report"
  | "dataset"
  | "law"
  | "constitution"
  | "archival-work"
  | "fiction"
  | "other";

export interface Work extends EntityBase {
  kind: "work";
  title: string;
  workType: WorkType;
  originalPublicationYear?: number;
}

export interface Depiction extends EntityBase {
  kind: "depiction";
  workId: string;
  scope: string;
}

export interface SourceIdentifiers {
  doi?: string;
  isbn10?: string;
  isbn13?: string;
  openLibraryId?: string;
}

export interface ResourceLink {
  purpose:
    | "publisher"
    | "library"
    | "authorized-reading"
    | "purchase"
    | "archive"
    | "other";
  url: string;
  label: string;
  vendor?: string;
  affiliate?: boolean;
}

export interface Source extends EntityBase {
  kind: "source";
  sourceType:
    | "edition"
    | "article"
    | "report"
    | "dataset"
    | "legal-text"
    | "archival-record"
    | "web-page"
    | "other";
  title: string;
  workId?: string;
  contributorDisplay?: string[];
  publicationYear?: number;
  publisher?: string;
  identifiers?: SourceIdentifiers;
  resourceLinks?: ResourceLink[];
}

export type DomainEntity =
  | VocabularyEntity
  | EvidenceEntity
  | AnalysisEntity
  | PresentationEntity
  | Approach
  | End
  | Means
  | Statement
  | Work
  | Source
  | Depiction;
