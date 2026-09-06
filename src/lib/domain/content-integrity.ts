import { auditContent, type ContentAttentionReport } from "./audit";
import { validateAuthoringDocuments } from "./compile";
import type { AuthoringDocument, CompiledDomainGraph } from "./graph";
import type { Dossier } from "./presentation";

export interface PublicationFile {
  path: string;
  content: string;
}

export interface NarrativeFile extends PublicationFile {
  lineErrors: Array<{ line: number; message: string }>;
}

export interface IntegrityFinding {
  category:
    | "archive-exclusion"
    | "domain-validation"
    | "narrative-lines"
    | "source-similarity";
  severity: "attention" | "violation";
  location: string;
  message: string;
  remediation: string;
}

export interface ContentIntegrityResult {
  findings: IntegrityFinding[];
  attention: ContentAttentionReport;
}

const forbiddenRuntimePath = /(?:^|\/)(?:archive|legacy|drafts?)(?:\/|$)/iu;
const moduleSpecifier = /(?:\bfrom\s*|\bimport\s*\(\s*)["']([^"']+)["']/gu;
const forbiddenBuildText =
  /archive\/legacy-research|content\/framework|(?:lib|routes?)\/(?:framework|prototype|legacy-content)/iu;

function compareFindings(left: IntegrityFinding, right: IntegrityFinding) {
  return (
    Number(right.severity === "violation") -
      Number(left.severity === "violation") ||
    left.category.localeCompare(right.category) ||
    left.location.localeCompare(right.location) ||
    left.message.localeCompare(right.message) ||
    left.remediation.localeCompare(right.remediation)
  );
}

function sortedFindings(findings: IntegrityFinding[]) {
  return [...findings].sort(compareFindings);
}

export function validationFindingLocation(message: string) {
  const delimiter = message.indexOf(": ");
  return delimiter >= 0 ? message.slice(0, delimiter) : "canonical graph";
}

function words(value: string) {
  return value.toLowerCase().match(/[\p{L}\p{N}]+/gu) ?? [];
}

function shingleOverlap(left: string, right: string, width = 5) {
  const make = (value: string) => {
    const tokens = words(value);
    return new Set(
      tokens
        .slice(0, Math.max(0, tokens.length - width + 1))
        .map((_, index) => tokens.slice(index, index + width).join(" ")),
    );
  };
  const a = make(left);
  const b = make(right);
  if (Math.min(a.size, b.size) < 2) return 0;
  return (
    [...a].filter((value) => b.has(value)).length / Math.min(a.size, b.size)
  );
}

export function publicationBoundaryFindings(
  runtimeFiles: PublicationFile[],
  builtFiles: PublicationFile[] = [],
): IntegrityFinding[] {
  const findings: IntegrityFinding[] = [];
  for (const file of runtimeFiles) {
    if (forbiddenRuntimePath.test(file.path)) {
      findings.push({
        category: "archive-exclusion",
        severity: "violation",
        location: file.path,
        message:
          "a publishable runtime file is stored under an archive, legacy, or draft path",
        remediation:
          "move discovery-only material outside runtime roots and author reviewed records under content/domain",
      });
    }
    for (const match of file.content.matchAll(moduleSpecifier)) {
      const specifier = match[1] ?? "";
      if (!forbiddenRuntimePath.test(specifier)) continue;
      findings.push({
        category: "archive-exclusion",
        severity: "violation",
        location: file.path,
        message: `runtime import reaches excluded material: ${specifier}`,
        remediation:
          "remove the import; archive and draft material may be used only as a discovery lead",
      });
    }
  }
  for (const file of builtFiles) {
    const match = file.content.match(forbiddenBuildText);
    if (!match) continue;
    findings.push({
      category: "archive-exclusion",
      severity: "violation",
      location: file.path,
      message: `public build contains an excluded runtime reference: ${match[0]}`,
      remediation:
        "trace the reference to its production import and remove the legacy or archived dependency",
    });
  }
  return sortedFindings(findings);
}

function sourceSimilarityFindings(graph: CompiledDomainGraph) {
  const statements = new Map(
    graph.entities
      .filter((entity) => entity.kind === "statement")
      .map((statement) => [statement.id, statement]),
  );
  const citationsByStatement = new Map<string, string[]>();
  for (const relationship of graph.relationships) {
    if (relationship.predicate !== "cites") continue;
    const sources = citationsByStatement.get(relationship.subject.id) ?? [];
    sources.push(relationship.object.id);
    citationsByStatement.set(relationship.subject.id, sources);
  }
  for (const sources of citationsByStatement.values()) sources.sort();
  const dossiers = graph.entities.filter(
    (entity): entity is Dossier =>
      entity.kind === "dossier" &&
      ["reviewed", "published"].includes(entity.publicationStatus),
  );
  return dossiers.flatMap((dossier) => {
    const passages = [
      {
        id: "standfirst",
        body: dossier.standfirst,
        statementIds: dossier.standfirstStatementIds,
      },
      ...dossier.sections,
    ];
    return passages.flatMap((passage) =>
      passage.statementIds.flatMap((statementId) => {
        const statement = statements.get(statementId);
        const sourceIds = citationsByStatement.get(statementId) ?? [];
        if (!statement || sourceIds.length === 0) return [];
        const score = shingleOverlap(passage.body, statement.text);
        if (score < 0.45) return [];
        return [
          {
            category: "source-similarity" as const,
            severity: "attention" as const,
            location: `${dossier.id}#${passage.id}`,
            message: `possible close phrasing with source-backed Statement ${statementId} (${Math.round(score * 100)}% five-word overlap); compare against Sources ${sourceIds.join(", ")}`,
            remediation:
              "review the narrative beside the cited source passages; quote and attribute necessary wording or rewrite independently",
          },
        ];
      }),
    );
  });
}

export function runContentIntegrity({
  documents,
  graph,
  narratives,
  runtimeFiles,
  builtFiles = [],
}: {
  documents: AuthoringDocument[];
  graph: CompiledDomainGraph;
  narratives: NarrativeFile[];
  runtimeFiles: PublicationFile[];
  builtFiles?: PublicationFile[];
}): ContentIntegrityResult {
  const findings: IntegrityFinding[] = validateAuthoringDocuments(
    documents,
  ).map((message) => {
    return {
      category: "domain-validation",
      severity: "violation",
      location: validationFindingLocation(message),
      message,
      remediation:
        "repair the named entity, reference, relationship, locator, dossier, or research-obligation contract",
    };
  });
  for (const narrative of narratives) {
    findings.push(
      ...narrative.lineErrors.map(({ line, message }) => ({
        category: "narrative-lines" as const,
        severity: "violation" as const,
        location: `${narrative.path}:${line}`,
        message,
        remediation:
          "put each complete semantic sentence on one source line without visual hard wrapping",
      })),
    );
  }
  findings.push(...publicationBoundaryFindings(runtimeFiles, builtFiles));
  findings.push(...sourceSimilarityFindings(graph));
  return { findings: sortedFindings(findings), attention: auditContent(graph) };
}

export function formatIntegrityResult(result: ContentIntegrityResult) {
  const findings = sortedFindings(result.findings);
  const violations = findings.filter(
    ({ severity }) => severity === "violation",
  );
  const signals = findings.filter(({ severity }) => severity === "attention");
  const lines = [
    "Content integrity verification",
    "",
    `Violations: ${violations.length}`,
    ...violations.map(
      ({ category, location, message, remediation }) =>
        `- [${category}] ${location}: ${message}\n  Fix: ${remediation}`,
    ),
    "",
    `Human-review signals: ${signals.length}`,
    ...signals.map(
      ({ category, location, message, remediation }) =>
        `- [${category}] ${location}: ${message}\n  Review: ${remediation}`,
    ),
    "",
    "Similarity and narrative signals identify review locations; they are not plagiarism findings.",
  ];
  return lines.join("\n");
}
