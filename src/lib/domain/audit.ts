import type { ResearchObligation, Source } from "./entities";
import type { CompiledDomainGraph } from "./graph";
import type { Dossier } from "./presentation";

const narratableKinds = ["approach", "case", "challenge", "concept"] as const;

export interface ContentAttentionReport {
  subjectGuides: {
    live: number;
    total: number;
    liveIds: string[];
  };
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
  openResearchObligations: Array<{
    id: string;
    obligationType: ResearchObligation["obligationType"];
    target: string;
    status: ResearchObligation["obligationStatus"];
  }>;
  researchEvidenceAwaitingResolution: string[];
  sourcesWithoutCitations: string[];
  entitiesWithoutRelationships: string[];
  dimensionsWithoutPlacements: string[];
  researchGapSectionsWithoutObligations: string[];
  sourcePreflight: Array<{
    id: string;
    missingMetadata: string[];
    urlsToVerify: string[];
  }>;
}

const fillerPatterns = [
  /\bcomplex interplay\b/i,
  /\bdelve(?:s|d)?\b/i,
  /\bit is (?:important to note|worth noting)\b/i,
  /\bmultifaceted\b/i,
  /\bserves as a reminder\b/i,
  /\bultimately\b/i,
];

function proseShingles(value: string) {
  const words = value.toLowerCase().match(/[a-z0-9]+/g) ?? [];
  return new Set(
    words
      .slice(0, -4)
      .map((_, index) => words.slice(index, index + 5).join(" ")),
  );
}

function overlap(left: string, right: string) {
  const a = proseShingles(left);
  const b = proseShingles(right);
  if (Math.min(a.size, b.size) < 3) return 0;
  const shared = [...a].filter((shingle) => b.has(shingle)).length;
  return shared / Math.min(a.size, b.size);
}

function narrativeFindings(dossiers: Dossier[]) {
  const passages = dossiers.flatMap((dossier) => {
    const prefix = `${dossier.subject.kind}:${dossier.subject.id}`;
    return [
      { location: `${prefix}#standfirst`, text: dossier.standfirst },
      ...dossier.sections.map(({ id, body }) => ({
        location: `${prefix}#${id}`,
        text: body,
      })),
    ];
  });
  const findings = passages.flatMap(({ location, text }) => {
    const reasons: string[] = [];
    if (fillerPatterns.some((pattern) => pattern.test(text)))
      reasons.push("generic filler phrase");
    if (text.split(/(?<=[.!?])\s+/).length > 5)
      reasons.push("dense passage: more than five sentences");
    if (text.length > 700)
      reasons.push("long passage: more than 700 characters");
    return reasons.map((reason) => ({ location, reason }));
  });
  for (let left = 0; left < passages.length; left += 1) {
    for (let right = left + 1; right < passages.length; right += 1) {
      const a = passages[left];
      const b = passages[right];
      if (a && b && overlap(a.text, b.text) >= 0.65) {
        findings.push({
          location: `${a.location} ↔ ${b.location}`,
          reason: "possible repeated phrasing",
        });
      }
    }
  }
  return findings;
}

function relationshipAttention(
  graph: CompiledDomainGraph,
  obligations: ResearchObligation[],
  researchGapSections: string[],
) {
  const citedSourceIds = new Set(
    graph.relationships
      .filter(({ predicate }) => predicate === "cites")
      .map(({ object }) => object.id),
  );
  const sourcesWithoutCitations = graph.entities
    .filter(
      ({ kind, id, publicationStatus }) =>
        kind === "source" &&
        publicationStatus !== "deprecated" &&
        !citedSourceIds.has(id),
    )
    .map(({ id }) => `source:${id}`);
  const relatedIds = new Set(
    graph.relationships.flatMap(({ subject, object }) => [
      subject.id,
      object.id,
    ]),
  );
  const relationshipExpectedKinds = new Set([
    "approach",
    "case",
    "case-episode",
    "challenge",
    "comparison-dimension",
    "concept",
    "criterion",
    "end",
    "means",
  ]);
  const entitiesWithoutRelationships = graph.entities
    .filter(
      ({ kind, id, publicationStatus }) =>
        relationshipExpectedKinds.has(kind) &&
        publicationStatus !== "deprecated" &&
        !relatedIds.has(id),
    )
    .map(({ kind, id }) => `${kind}:${id}`);
  const placedDimensionIds = new Set(
    graph.relationships
      .filter(({ predicate }) => predicate === "placed-on")
      .map(({ object }) => object.id),
  );
  const dimensionsWithoutPlacements = graph.entities
    .filter(
      ({ kind, id, publicationStatus }) =>
        kind === "comparison-dimension" &&
        publicationStatus !== "deprecated" &&
        !placedDimensionIds.has(id),
    )
    .map(({ id }) => `comparison-dimension:${id}`);
  const obligationTargets = new Set(
    obligations
      .filter(({ obligationStatus }) =>
        ["open", "partially-addressed"].includes(obligationStatus),
      )
      .map(
        ({ target, targetSectionId }) =>
          `${target.kind}:${target.id}${targetSectionId ? `#${targetSectionId}` : ""}`,
      ),
  );
  const researchGapSectionsWithoutObligations = researchGapSections.filter(
    (section) => !obligationTargets.has(section),
  );
  return {
    sourcesWithoutCitations,
    entitiesWithoutRelationships,
    dimensionsWithoutPlacements,
    researchGapSectionsWithoutObligations,
  };
}

function sourcePreflight(graph: CompiledDomainGraph) {
  return graph.entities
    .filter(
      (entity): entity is Source =>
        entity.kind === "source" && entity.publicationStatus !== "deprecated",
    )
    .map((source) => {
      const missingMetadata: string[] = [];
      if (!source.contributorDisplay?.length)
        missingMetadata.push("contributors");
      if (!source.publicationYear) missingMetadata.push("publication year");
      if (!source.publisher) missingMetadata.push("publisher");
      const hasIdentifier = Object.values(source.identifiers ?? {}).some(
        (value) => typeof value === "string" && value.trim().length > 0,
      );
      if (!hasIdentifier && !source.resourceLinks?.length)
        missingMetadata.push("identifier or access link");
      return {
        id: source.id,
        missingMetadata,
        urlsToVerify: (source.resourceLinks ?? []).map(({ url }) => url),
      };
    })
    .filter(
      ({ missingMetadata, urlsToVerify }) =>
        missingMetadata.length > 0 || urlsToVerify.length > 0,
    );
}

export function auditContent(
  graph: CompiledDomainGraph,
): ContentAttentionReport {
  const dossiers = graph.entities.filter(
    (entity): entity is Dossier =>
      entity.kind === "dossier" &&
      ["reviewed", "published"].includes(entity.publicationStatus),
  );
  const liveGuides = graph.subjectGuides;
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
  const obligations = graph.entities.filter(
    (entity): entity is ResearchObligation =>
      entity.kind === "research-obligation" &&
      entity.publicationStatus !== "deprecated",
  );
  const openResearchObligations = obligations
    .filter(({ obligationStatus }) =>
      ["open", "partially-addressed"].includes(obligationStatus),
    )
    .map(
      ({ id, obligationType, target, targetSectionId, obligationStatus }) => ({
        id,
        obligationType,
        target: `${target.kind}:${target.id}${targetSectionId ? `#${targetSectionId}` : ""}`,
        status: obligationStatus,
      }),
    );
  const researchEvidenceAwaitingResolution = obligations
    .filter(
      ({ obligationStatus, statementIds }) =>
        ["open", "partially-addressed"].includes(obligationStatus) &&
        statementIds.length > 0,
    )
    .map(({ id }) => id);
  const relationshipFindings = relationshipAttention(
    graph,
    obligations,
    researchGapSections,
  );
  return {
    subjectGuides: {
      live: liveGuides.length,
      total: graph.subjectGuideRecords.length,
      liveIds: liveGuides.map(({ id }) => id),
    },
    dossierCoverage,
    researchGapSections,
    researchNeededEntities,
    narrativeAttention: narrativeFindings(dossiers),
    openResearchObligations,
    researchEvidenceAwaitingResolution,
    ...relationshipFindings,
    sourcePreflight: sourcePreflight(graph),
  };
}

const addedAttentionKeys = [
  "sourcesWithoutCitations",
  "entitiesWithoutRelationships",
  "dimensionsWithoutPlacements",
  "researchGapSectionsWithoutObligations",
  "sourcePreflight",
] as const;

type FormattableAttentionReport = Omit<
  ContentAttentionReport,
  (typeof addedAttentionKeys)[number]
> &
  Partial<Pick<ContentAttentionReport, (typeof addedAttentionKeys)[number]>>;

function formatSourcePreflight(report: FormattableAttentionReport) {
  return (report.sourcePreflight ?? []).map((source) => {
    const missing = source.missingMetadata.length
      ? `add or confirm ${source.missingMetadata.join(", ")}`
      : "metadata recorded";
    const urls = source.urlsToVerify.length
      ? `; browse ${source.urlsToVerify.join(", ")}`
      : "";
    return `- ${source.id} — ${missing}${urls}; verify authority, claim support, and locators before review`;
  });
}

function formatRelationshipAttention(report: FormattableAttentionReport) {
  const sources = report.sourcesWithoutCitations ?? [];
  const entities = report.entitiesWithoutRelationships ?? [];
  const dimensions = report.dimensionsWithoutPlacements ?? [];
  const gaps = report.researchGapSectionsWithoutObligations ?? [];
  return [
    "",
    `Sources without citations: ${sources.length}`,
    ...sources.map(
      (id) => `- ${id} — cite it from a Statement or remove the unused Source`,
    ),
    "",
    `Entities without relationships: ${entities.length}`,
    ...entities.map(
      (id) =>
        `- ${id} — research an explicit typed relationship or confirm that absence is intentional`,
    ),
    "",
    `Dimensions without Placements: ${dimensions.length}`,
    ...dimensions.map(
      (id) =>
        `- ${id} — add a scoped evidence-backed Placement or retain as an explicit research gap`,
    ),
    "",
    `Research-gap sections without an active obligation: ${gaps.length}`,
    ...gaps.map(
      (id) =>
        `- ${id} — add an exact-section Research Obligation or revise the trace status`,
    ),
  ];
}

export function formatContentAttentionReport(
  report: FormattableAttentionReport,
) {
  const lines = [
    "Content attention report",
    "",
    `Subject Guides: ${report.subjectGuides.live}/${report.subjectGuides.total} live`,
    ...report.subjectGuides.liveIds.map((id) => `- ${id}`),
    "",
    "Dossier coverage:",
  ];
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
  for (const finding of report.narrativeAttention)
    lines.push(`- ${finding.location}: ${finding.reason}`);
  lines.push(
    "",
    `Open research obligations: ${report.openResearchObligations.length}`,
  );
  for (const obligation of report.openResearchObligations)
    lines.push(
      `- ${obligation.id}: ${obligation.obligationType}; ${obligation.target}; ${obligation.status}`,
    );
  lines.push(
    "",
    `Evidence awaiting resolution: ${report.researchEvidenceAwaitingResolution.length}`,
  );
  for (const id of report.researchEvidenceAwaitingResolution)
    lines.push(`- ${id}`);
  lines.push(...formatRelationshipAttention(report));
  lines.push("", `Source preflight: ${report.sourcePreflight?.length ?? 0}`);
  lines.push(...formatSourcePreflight(report));
  return lines.join("\n");
}
