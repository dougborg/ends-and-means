import type {
  Cell, ContentGraph, Crux, CruxId, EvidenceLevel, Source, System, SystemId,
  Verdict, VerificationStatus,
} from "./model";
import { validateContentGraph, type ValidationReport } from "./validate";

export const STAGING_SYSTEM_IDS: Record<string, SystemId> = {
  "laissez-faire-capitalism": "lf",
  "social-democratic-capitalism": "sd",
  "market-socialism-economic-democracy": "ms",
  "central-planning": "cp",
  "social-anarchism": "sa",
  "state-capitalism-developmental-state": "sc",
  "anarcho-capitalism": "ac",
  "participatory-economics-parecon": "pe",
};

export interface StagingImport {
  systems: Array<{ id: string; name: string; description: string }>;
  cruxes: Array<{ id: string; number: number; title: string; prompt: string | null }>;
  cells: Array<{
    id: string;
    systemId: string;
    cruxId: string;
    mechanism: string;
    breaks: string;
    sourceIds: string[];
  }>;
  sourceCandidates: Array<{
    id: string;
    author: string;
    title: string;
    year: string | null;
    section?: string;
    rawMarkdown?: string;
    verificationTier: string;
  }>;
}

export interface CellJudgment {
  verdict: Verdict;
  evidence: EvidenceLevel;
}

export interface CurationOverrides {
  cellJudgments: Record<string, CellJudgment>;
}

export interface CurationReport {
  validation: ValidationReport;
  releaseReadiness: {
    ready: boolean;
    validation: ValidationReport;
  };
  unresolved: {
    missingJudgments: string[];
    unexpectedJudgments: string[];
    missingQuestions: CruxId[];
    needsCitation: string[];
  };
  counts: {
    systems: number;
    cruxes: number;
    cells: number;
    sources: number;
    cases: number;
    claims: number;
  };
}

export interface CurationResult {
  graph: ContentGraph;
  report: CurationReport;
}

const verificationStatuses: Record<string, VerificationStatus> = {
  "publisher-or-library-checked": "checked",
  "previously-confirmed": "confirmed-earlier",
  "not-rechecked": "from-knowledge",
};

export function canonicalCruxId(number: number): CruxId {
  if (!Number.isInteger(number) || number < 1 || number > 14)
    throw new Error(`Cannot canonicalize crux number '${number}'.`);
  return `c${String(number).padStart(2, "0")}` as CruxId;
}

/**
 * Converts reproducible staging data to the canonical graph. ID and verification
 * translations are mechanical. Cell judgments are accepted only from explicit,
 * reviewable overrides.
 */
export function curateContent(staging: StagingImport, overrides: CurationOverrides): CurationResult {
  const systems = staging.systems.map<System>((item) => ({
    id: requireSystemId(item.id),
    name: item.name,
    description: item.description,
  }));
  const cruxIdByStaging = new Map(staging.cruxes.map((item) => [item.id, canonicalCruxId(item.number)]));
  const cruxes = staging.cruxes.map<Crux>((item) => ({
    id: canonicalCruxId(item.number),
    title: item.title,
    question: item.prompt ?? "Question pending editorial review.",
    ...([3, 6, 9].includes(item.number) ? { valueLaden: true } : {}),
  }));
  const missingQuestions = staging.cruxes
    .filter((item) => !item.prompt)
    .map((item) => canonicalCruxId(item.number));
  const sources = staging.sourceCandidates.map<Source>((item) => {
    const year = parseYear(item.year);
    return {
      id: item.id,
      authors: [item.author],
      title: item.title,
      ...(year !== undefined ? { year } : {}),
      type: "other",
      ...(item.section ? { section: item.section } : {}),
      ...(item.rawMarkdown ? { note: item.rawMarkdown } : {}),
      verified: requireVerificationStatus(item.verificationTier),
    };
  });

  const missingJudgments: string[] = [];
  const expectedJudgments = new Set<string>();
  const cells = staging.cells.map<Cell>((item) => {
    const system = requireSystemId(item.systemId);
    const crux = cruxIdByStaging.get(item.cruxId);
    if (!crux) throw new Error(`Unknown staging crux '${item.cruxId}'.`);
    const id = `${system}-${crux}` as const;
    expectedJudgments.add(id);
    const judgment = overrides.cellJudgments[id];
    if (!judgment) missingJudgments.push(id);
    return {
      id,
      system,
      crux,
      mechanism: item.mechanism,
      breaks: item.breaks,
      verdict: judgment?.verdict ?? "untested",
      evidence: judgment?.evidence ?? "none",
      sources: item.sourceIds,
      cases: [],
      needsCitation: item.sourceIds.length === 0,
    };
  });
  const graph: ContentGraph = { systems, cruxes, cells, sources, cases: [], claims: [] };
  const validation = validateContentGraph(graph, { citationMode: "milestone" });
  const releaseValidation = validateContentGraph(graph, { citationMode: "release" });
  const needsCitation = cells.filter((cell) => cell.needsCitation).map((cell) => cell.id);
  const unexpectedJudgments = Object.keys(overrides.cellJudgments)
    .filter((id) => !expectedJudgments.has(id))
    .sort();
  const releaseReady = releaseValidation.valid
    && missingJudgments.length === 0
    && unexpectedJudgments.length === 0
    && missingQuestions.length === 0;
  return {
    graph,
    report: {
      validation,
      releaseReadiness: { ready: releaseReady, validation: releaseValidation },
      unresolved: { missingJudgments, unexpectedJudgments, missingQuestions, needsCitation },
      counts: {
        systems: systems.length,
        cruxes: cruxes.length,
        cells: cells.length,
        sources: sources.length,
        cases: 0,
        claims: 0,
      },
    },
  };
}

function requireSystemId(stagingId: string): SystemId {
  const id = STAGING_SYSTEM_IDS[stagingId];
  if (!id) throw new Error(`Unknown staging system '${stagingId}'.`);
  return id;
}

function requireVerificationStatus(tier: string): VerificationStatus {
  const status = verificationStatuses[tier];
  if (!status) throw new Error(`Unknown staging verification tier '${tier}'.`);
  return status;
}

function parseYear(year: string | null): number | undefined {
  const match = year?.match(/^\d{4}/);
  return match ? Number(match[0]) : undefined;
}
