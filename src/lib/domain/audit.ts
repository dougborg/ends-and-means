import type { CompiledDomainGraph } from "./graph";
import type { Dossier } from "./presentation";
const narratableKinds = ["approach", "case", "challenge", "concept"] as const;

export interface ContentAttentionReport {
  dossierCoverage: Array<{
    kind: (typeof narratableKinds)[number];
    covered: number;
    total: number;
    missingIds: string[];
  }>;
  researchGapSections: string[];
  researchNeededEntities: string[];
  narrativeAttention: Array<{
    location: string;
    reason: string;
  }>;
}

const fillerPatterns = [
  /\bcomplex interplay\b/i,
  /\bdelve(?:s|d)?\b/i,
  /\bit is (?:important|worth) to note\b/i,
  /\bmultifaceted\b/i,
  /\bserves as a reminder\b/i,
  /\bultimately\b/i,
];

function proseTokens(value: string) {
  return new Set(value.toLowerCase().match(/[a-z0-9]+/g) ?? []);
}

function overlap(left: string, right: string) {
  const a = proseTokens(left);
  const b = proseTokens(right);
  if (Math.min(a.size, b.size) < 8) return 0;
  const shared = [...a].filter((token) => b.has(token)).length;
  return shared / Math.min(a.size, b.size);
}

function narrativeFindings(dossiers: Dossier[]) {
  return dossiers.flatMap((dossier) => {
    const prefix = `${dossier.subject.kind}:${dossier.subject.id}`;
    const passages = [
      { location: `${prefix}#standfirst`, text: dossier.standfirst },
      ...dossier.sections.map(({ id, body }) => ({ location: `${prefix}#${id}`, text: body })),
    ];
    const findings = passages.flatMap(({ location, text }) => {
      const reasons: string[] = [];
      if (fillerPatterns.some((pattern) => pattern.test(text))) reasons.push("generic filler phrase");
      if (text.split(/(?<=[.!?])\s+/).length > 5) reasons.push("dense passage: more than five sentences");
      if (text.length > 700) reasons.push("long passage: more than 700 characters");
      return reasons.map((reason) => ({ location, reason }));
    });
    for (let left = 0; left < passages.length; left += 1) {
      for (let right = left + 1; right < passages.length; right += 1) {
        const a = passages[left];
        const b = passages[right];
        if (a && b && overlap(a.text, b.text) >= 0.8) findings.push({ location: `${a.location} ↔ ${b.location}`, reason: "high-confidence repeated vocabulary" });
      }
    }
    return findings;
  });
}

export function auditContent(
  graph: CompiledDomainGraph,
): ContentAttentionReport {
  const dossiers = graph.entities.filter(
    (entity): entity is Dossier =>
      entity.kind === "dossier" &&
      ["reviewed", "published"].includes(entity.publicationStatus),
  );
  const dossierSubjects = new Set(
    dossiers.map(({ subject }) => `${subject.kind}:${subject.id}`),
  );
  const dossierCoverage = narratableKinds.map((kind) => {
    const subjects = graph.entities.filter(
      (entity) =>
        entity.kind === kind && entity.publicationStatus !== "deprecated",
    );
    const missingIds = subjects
      .filter(({ id }) => !dossierSubjects.has(`${kind}:${id}`))
      .map(({ id }) => id);
    return {
      kind,
      covered: subjects.length - missingIds.length,
      total: subjects.length,
      missingIds,
    };
  });
  const researchGapSections = dossiers.flatMap((dossier) =>
    dossier.sections
      .filter(({ traceStatus }) => traceStatus === "research-gap")
      .map(({ id }) => `${dossier.subject.kind}:${dossier.subject.id}#${id}`),
  );
  const researchNeededEntities = graph.entities
    .filter(({ publicationStatus }) => publicationStatus === "research-needed")
    .map(({ kind, id }) => `${kind}:${id}`);
  return { dossierCoverage, researchGapSections, researchNeededEntities, narrativeAttention: narrativeFindings(dossiers) };
}

export function formatContentAttentionReport(report: ContentAttentionReport) {
  const lines = ["Content attention report", "", "Dossier coverage:"];
  for (const row of report.dossierCoverage) {
    lines.push(`- ${row.kind}: ${row.covered}/${row.total}`);
    for (const id of row.missingIds) lines.push(`  - missing: ${id}`);
  }
  lines.push(
    "",
    `Explicit research gaps: ${report.researchGapSections.length}`,
  );
  for (const section of report.researchGapSections) lines.push(`- ${section}`);
  lines.push(
    "",
    `Research-needed entities: ${report.researchNeededEntities.length}`,
  );
  for (const entity of report.researchNeededEntities) lines.push(`- ${entity}`);
  lines.push("", `Narrative attention: ${report.narrativeAttention.length}`);
  for (const finding of report.narrativeAttention) lines.push(`- ${finding.location}: ${finding.reason}`);
  return lines.join("\n");
}
