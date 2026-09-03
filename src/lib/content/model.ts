export const SYSTEM_IDS = ["lf", "sd", "ms", "cp", "sa", "sc", "ac", "pe"] as const;
export const CRUX_IDS = [
  "c01", "c02", "c03", "c04", "c05", "c06", "c07",
  "c08", "c09", "c10", "c11", "c12", "c13", "c14",
] as const;
export const VERDICTS = [
  "strong", "moderate", "mixed", "weak", "worst", "local", "untested",
  "contested", "value-question",
] as const;
export const EVIDENCE_LEVELS = ["extensive", "partial", "contested", "untested", "none"] as const;
export const VERIFICATION_STATUSES = ["checked", "confirmed-earlier", "from-knowledge"] as const;
export const SOURCE_TYPES = ["book", "article", "paper", "chapter", "report", "website", "other"] as const;
export const EXTERNAL_LINK_KINDS = ["publisher", "author", "read", "library", "purchase", "archive", "other"] as const;

export type SystemId = (typeof SYSTEM_IDS)[number];
export type CruxId = (typeof CRUX_IDS)[number];
export type Verdict = (typeof VERDICTS)[number];
export type EvidenceLevel = (typeof EVIDENCE_LEVELS)[number];
export type VerificationStatus = (typeof VERIFICATION_STATUSES)[number];
export type SourceType = (typeof SOURCE_TYPES)[number];
export type ExternalLinkKind = (typeof EXTERNAL_LINK_KINDS)[number];

export interface System {
  id: SystemId;
  name: string;
  description: string;
}

export interface Crux {
  id: CruxId;
  title: string;
  question: string;
  valueLaden?: boolean;
  note?: string;
}

export interface Cell {
  id: `${SystemId}-${CruxId}`;
  system: SystemId;
  crux: CruxId;
  mechanism: string;
  breaks: string;
  verdict: Verdict;
  evidence: EvidenceLevel;
  sources: string[];
  cases: string[];
  needsCitation: boolean;
}

export interface SourceIdentifiers {
  isbn10?: string;
  isbn13?: string;
  doi?: string;
  openLibrary?: string;
}

export interface ExternalLink {
  kind: ExternalLinkKind;
  url: string;
  label?: string;
  vendor?: string;
  affiliate?: boolean;
}

export interface Source {
  id: string;
  authors: string[];
  title: string;
  year?: number;
  type: SourceType;
  section?: string;
  note?: string;
  verified: VerificationStatus;
  identifiers?: SourceIdentifiers;
  links?: ExternalLink[];
}

export interface Case {
  id: string;
  name: string;
  dates?: string;
  location?: string;
  summary: string;
  systems: SystemId[];
  sources: string[];
}

export interface Claim {
  id: string;
  parent: { type: "cell" | "case"; id: string };
  text: string;
  context?: string;
  sources: string[];
  cases: string[];
}

export interface ContentGraph {
  systems: System[];
  cruxes: Crux[];
  cells: Cell[];
  sources: Source[];
  cases: Case[];
  claims: Claim[];
}
