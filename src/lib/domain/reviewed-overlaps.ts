import { createHash } from "node:crypto";
import type { DomainEntity, Source, Statement } from "./entities";
import type { CompiledDomainGraph } from "./graph";
import type { Dossier } from "./presentation";
import type { StatementCitation } from "./relationships";

export type ReviewedOverlapDisposition =
  | "acknowledged-synthesis"
  | "attributed-quotation";

export interface ReviewedOverlapAcknowledgement {
  schemaVersion: "reviewed-overlap-1";
  fingerprint: `sha256:${string}`;
  passage: { dossierId: string; passageId: string };
  statementId: string;
  citationId: string;
  reviewer: string;
  reviewedAt: string;
  rationale: string;
  disposition: ReviewedOverlapDisposition;
}

export interface NarrativeOverlapSignal {
  location: string;
  dossierId: string;
  passageId: string;
  statementId: string;
  citationId: string;
  sourceId: string;
  score: number;
  fingerprint: string;
}

export interface ReviewedOverlapResolution {
  openSignals: NarrativeOverlapSignal[];
  acknowledgedSignals: NarrativeOverlapSignal[];
  errors: string[];
}

function compareCodeUnits(left: string, right: string) {
  return left < right ? -1 : left > right ? 1 : 0;
}

function stableJson(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stableJson).join(",")}]`;
  if (value && typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>).sort(
      ([left], [right]) => compareCodeUnits(left, right),
    );
    return `{${entries.map(([key, child]) => `${JSON.stringify(key)}:${stableJson(child)}`).join(",")}}`;
  }
  const json = JSON.stringify(value);
  return json ?? JSON.stringify({ unsupportedType: typeof value });
}

export function reviewedOverlapFingerprint(input: {
  passage: { dossierId: string; passageId: string; text: string };
  statement: Pick<Statement, "id" | "text">;
  citation: StatementCitation;
  source: Source;
}): `sha256:${string}` {
  const governedInput = {
    ...input,
    statement: { id: input.statement.id, text: input.statement.text },
  };
  const digest = createHash("sha256")
    .update(stableJson(governedInput))
    .digest("hex");
  return `sha256:${digest}`;
}

export function overlapTarget(value: {
  passage: { dossierId: string; passageId: string };
  statementId: string;
  citationId: string;
}) {
  return `${value.passage.dossierId}#${value.passage.passageId}|${value.statementId}|${value.citationId}`;
}

function isIsoDate(value: unknown): value is string {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value))
    return false;
  const parsed = new Date(`${value}T00:00:00Z`);
  return (
    !Number.isNaN(parsed.valueOf()) && parsed.toISOString().startsWith(value)
  );
}

function validateAcknowledgement(
  candidate: unknown,
  errors: string[],
): candidate is ReviewedOverlapAcknowledgement {
  const label = "reviewed overlap acknowledgement";
  if (!candidate || typeof candidate !== "object" || Array.isArray(candidate)) {
    errors.push(`${label}: record must be an object`);
    return false;
  }
  const value = candidate as Partial<ReviewedOverlapAcknowledgement>;
  const fields = {
    dossierId: value.passage?.dossierId,
    passageId: value.passage?.passageId,
    statementId: value.statementId,
    citationId: value.citationId,
    reviewer: value.reviewer,
    rationale: value.rationale,
  };
  const start = errors.length;
  if (value.schemaVersion !== "reviewed-overlap-1")
    errors.push(`${label}: unsupported schemaVersion`);
  if (!/^sha256:[a-f0-9]{64}$/.test(value.fingerprint ?? ""))
    errors.push(`${label}: fingerprint must be a full lowercase SHA-256 value`);
  for (const [field, fieldValue] of Object.entries(fields))
    if (typeof fieldValue !== "string" || !fieldValue.trim())
      errors.push(`${label}: ${field} is empty or invalid`);
  if (!isIsoDate(value.reviewedAt))
    errors.push(`${label}: reviewedAt requires an ISO calendar date`);
  if (
    !["acknowledged-synthesis", "attributed-quotation"].includes(
      value.disposition ?? "",
    )
  )
    errors.push(`${label}: unsupported disposition`);
  return errors.length === start;
}

export function validateReviewedOverlapAcknowledgements(
  values: readonly unknown[],
) {
  const candidates: ReviewedOverlapAcknowledgement[] = [];
  const errors: string[] = [];
  for (const candidate of values) {
    if (!validateAcknowledgement(candidate, errors)) continue;
    candidates.push(candidate);
  }
  const targetCounts = new Map<string, number>();
  for (const candidate of candidates) {
    const target = overlapTarget(candidate);
    targetCounts.set(target, (targetCounts.get(target) ?? 0) + 1);
  }
  const duplicateTargets = [...targetCounts]
    .filter(([, count]) => count > 1)
    .map(([target]) => target)
    .sort();
  for (const target of duplicateTargets)
    errors.push(`duplicate reviewed overlap acknowledgement target ${target}`);
  const records = candidates.filter(
    (candidate) => targetCounts.get(overlapTarget(candidate)) === 1,
  );
  return { records, errors: errors.sort() };
}

function citationsByStatement(graph: CompiledDomainGraph) {
  const result = new Map<string, StatementCitation[]>();
  for (const relationship of graph.relationships) {
    if (relationship.predicate !== "cites") continue;
    const existing = result.get(relationship.subject.id) ?? [];
    existing.push(relationship);
    result.set(relationship.subject.id, existing);
  }
  return result;
}

function dossierPassages(dossier: Dossier) {
  return [
    {
      passageId: "standfirst",
      text: dossier.standfirst,
      statementIds: dossier.standfirstStatementIds,
    },
    ...dossier.sections.map(({ id, body, statementIds }) => ({
      passageId: id,
      text: body,
      statementIds,
    })),
  ];
}

function signalsForPassage(
  dossier: Dossier,
  passage: ReturnType<typeof dossierPassages>[number],
  entitiesById: Map<string, DomainEntity>,
  citations: Map<string, StatementCitation[]>,
  similarity: (left: string, right: string) => number,
  threshold: number,
) {
  return passage.statementIds.flatMap((statementId) => {
    const statement = entitiesById.get(statementId);
    if (statement?.kind !== "statement") return [];
    const score = similarity(passage.text, statement.text);
    if (score < threshold) return [];
    return (citations.get(statementId) ?? []).flatMap((citation) => {
      const source = entitiesById.get(citation.object.id);
      if (source?.kind !== "source") return [];
      return [
        {
          location: `${dossier.subject.kind}:${dossier.subject.id}#${passage.passageId}`,
          dossierId: dossier.id,
          passageId: passage.passageId,
          statementId,
          citationId: citation.id,
          sourceId: source.id,
          score,
          fingerprint: reviewedOverlapFingerprint({
            passage: {
              dossierId: dossier.id,
              passageId: passage.passageId,
              text: passage.text,
            },
            statement,
            citation,
            source,
          }),
        } satisfies NarrativeOverlapSignal,
      ];
    });
  });
}

export function narrativeOverlapSignals(
  graph: CompiledDomainGraph,
  dossiers: Dossier[],
  similarity: (left: string, right: string) => number,
  threshold = 0.45,
) {
  const citations = citationsByStatement(graph);
  const entitiesById = new Map(
    graph.entities.map((entity) => [entity.id, entity]),
  );
  const signals = dossiers.flatMap((dossier) =>
    dossierPassages(dossier).flatMap((passage) =>
      signalsForPassage(
        dossier,
        passage,
        entitiesById,
        citations,
        similarity,
        threshold,
      ),
    ),
  );
  return signals.sort((left, right) => {
    const leftTarget = overlapTarget({
      passage: left,
      statementId: left.statementId,
      citationId: left.citationId,
    });
    const rightTarget = overlapTarget({
      passage: right,
      statementId: right.statementId,
      citationId: right.citationId,
    });
    return compareCodeUnits(leftTarget, rightTarget);
  });
}

export function resolveReviewedOverlapAcknowledgements(
  values: readonly unknown[],
  signals: NarrativeOverlapSignal[],
): ReviewedOverlapResolution {
  const { records, errors } = validateReviewedOverlapAcknowledgements(values);
  const signalByTarget = new Map(
    signals.map((signal) => [
      overlapTarget({
        passage: signal,
        statementId: signal.statementId,
        citationId: signal.citationId,
      }),
      signal,
    ]),
  );
  const acknowledgedTargets = new Set<string>();
  for (const record of records) {
    const target = overlapTarget(record);
    const signal = signalByTarget.get(target);
    if (!signal) {
      errors.push(
        `${target}: invalidated; no current overlap signal matches this acknowledgement`,
      );
      continue;
    }
    if (record.fingerprint !== signal.fingerprint) {
      errors.push(
        `${target}: invalidated; governed narrative, Statement, citation, or Source input changed`,
      );
      continue;
    }
    acknowledgedTargets.add(target);
  }
  const targetForSignal = (signal: NarrativeOverlapSignal) =>
    overlapTarget({
      passage: signal,
      statementId: signal.statementId,
      citationId: signal.citationId,
    });
  return {
    openSignals: signals.filter(
      (signal) => !acknowledgedTargets.has(targetForSignal(signal)),
    ),
    acknowledgedSignals: signals.filter((signal) =>
      acknowledgedTargets.has(targetForSignal(signal)),
    ),
    errors: errors.sort(),
  };
}
