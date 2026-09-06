import { createHash } from "node:crypto";
import type { Source, Statement } from "./entities";
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
  fingerprint: string;
}

function stableJson(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stableJson).join(",")}]`;
  if (value && typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>)
      .filter(([, child]) => child !== undefined)
      .sort(([left], [right]) => left.localeCompare(right));
    return `{${entries.map(([key, child]) => `${JSON.stringify(key)}:${stableJson(child)}`).join(",")}}`;
  }
  return JSON.stringify(value);
}

export function reviewedOverlapFingerprint(input: {
  passage: { dossierId: string; passageId: string; text: string };
  statement: Pick<Statement, "id" | "text">;
  citation: StatementCitation;
  source: Source;
}) {
  const digest = createHash("sha256").update(stableJson(input)).digest("hex");
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
  return !Number.isNaN(parsed.valueOf()) && parsed.toISOString().startsWith(value);
}

function validateAcknowledgement(
  candidate: unknown,
  index: number,
  errors: string[],
): candidate is ReviewedOverlapAcknowledgement {
  const label = `reviewed overlap acknowledgement ${index}`;
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
  const records: ReviewedOverlapAcknowledgement[] = [];
  const errors: string[] = [];
  const targets = new Set<string>();
  for (const [index, candidate] of values.entries()) {
    if (!validateAcknowledgement(candidate, index, errors)) continue;
    const target = overlapTarget(candidate);
    if (targets.has(target)) {
      errors.push(
        `reviewed overlap acknowledgement ${index}: duplicate acknowledgement target ${target}`,
      );
      continue;
    }
    targets.add(target);
    records.push(candidate);
  }
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

export function narrativeOverlapSignals(
  graph: CompiledDomainGraph,
  dossiers: Dossier[],
  similarity: (left: string, right: string) => number,
) {
  const citations = citationsByStatement(graph);
  const signals: NarrativeOverlapSignal[] = [];
  for (const dossier of dossiers) {
    const passages = [
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
    for (const passage of passages) {
      for (const statementId of passage.statementIds) {
        const statement = graph.indexes.entitiesById[statementId];
        if (
          statement?.kind !== "statement" ||
          similarity(passage.text, statement.text) < 0.65
        )
          continue;
        for (const citation of citations.get(statementId) ?? []) {
          const source = graph.indexes.entitiesById[citation.object.id];
          if (source?.kind !== "source") continue;
          signals.push({
            location: `${dossier.subject.kind}:${dossier.subject.id}#${passage.passageId}`,
            dossierId: dossier.id,
            passageId: passage.passageId,
            statementId,
            citationId: citation.id,
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
          });
        }
      }
    }
  }
  return signals.sort((left, right) =>
    overlapTarget({
      passage: left,
      statementId: left.statementId,
      citationId: left.citationId,
    }).localeCompare(
      overlapTarget({
        passage: right,
        statementId: right.statementId,
        citationId: right.citationId,
      }),
    ),
  );
}
