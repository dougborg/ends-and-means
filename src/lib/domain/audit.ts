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
  return { dossierCoverage, researchGapSections, researchNeededEntities };
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
  return lines.join("\n");
}
