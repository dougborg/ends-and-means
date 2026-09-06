import { describe, expect, it } from "vitest";
import {
  discoverGraphChanges,
  formatContentSemanticPreflight,
  runCli,
  runContentSemanticPreflight,
} from "../../scripts/content-semantic-preflight";
import type {
  CompiledDomainGraph,
  DomainEntity,
  DomainRelationship,
  SubjectGuide,
} from "../../src/lib/domain";

const base = {
  publicationStatus: "reviewed" as const,
  description: "Direct substantive description.",
};

const fixtureEntities = [
  {
    id: "work",
    kind: "work",
    label: "Work",
    title: "Work",
    workType: "book",
    originalPublicationYear: 2000,
    ...base,
  },
  {
    id: "source",
    kind: "source",
    label: "Source",
    title: "Manifestation",
    sourceType: "edition",
    workId: "work",
    contributorDisplay: ["Author"],
    publicationYear: 2001,
    publisher: "Press",
    identifiers: { isbn13: "9780000000000" },
    resourceLinks: [
      { purpose: "publisher", url: "https://example.com", label: "Record" },
    ],
    ...base,
  },
  {
    id: "statement",
    kind: "statement",
    label: "Statement",
    statementKind: "observation",
    text: "One proposition.",
    ...base,
  },
  {
    id: "episode",
    kind: "case-episode",
    label: "Episode",
    caseId: "case",
    locationIds: [],
    startDate: { year: 2000, certainty: "exact" },
    scope: "Bounded.",
    conditionStatementIds: [],
    formalRuleStatementIds: ["statement"],
    ruleInUseStatementIds: [],
    interactionStatementIds: [],
    outcomeStatementIds: [],
    ...base,
  },
  {
    id: "case",
    kind: "case",
    label: "Case",
    locationIds: [],
    startDate: { year: 2000, certainty: "exact" },
    scope: "Bounded.",
    conditionStatementIds: ["statement"],
    selectionRationale: "Variation.",
    episodeIds: ["episode"],
    ...base,
  },
  {
    id: "dossier",
    kind: "dossier",
    label: "Dossier",
    subject: { kind: "case", id: "case" },
    standfirst: "Direct answer.",
    standfirstStatementIds: ["statement"],
    sections: [
      {
        id: "section",
        heading: "Evidence",
        body: "Direct account.",
        traceStatus: "supported",
        statementIds: ["statement"],
      },
    ],
    reviewedAt: "2026-09-06",
    ...base,
  },
  {
    id: "ro",
    kind: "research-obligation",
    label: "Open question",
    obligationType: "research-gap",
    question: "What remains unknown?",
    target: { kind: "case", id: "case" },
    addressedStatementIds: ["statement"],
    currentLimitation: "Evidence remains incomplete.",
    evidenceNeeded: "Additional records.",
    scope: "This case.",
    obligationStatus: "open",
    statementIds: [],
    reviewedAt: "2026-09-06",
    ...base,
  },
] as unknown as DomainEntity[];

const fixtureRelationships = [
  {
    id: "citation",
    predicate: "cites",
    subject: { kind: "statement", id: "statement" },
    object: { kind: "source", id: "source" },
    role: "supports",
    locator: "p. 1",
  },
  {
    id: "case-concept",
    predicate: "applies-to-case",
    subject: { kind: "case", id: "case" },
    object: { kind: "concept", id: "concept" },
    status: "qualified",
    statementIds: ["statement"],
  },
] as unknown as DomainRelationship[];

const fixtureGuides = [
  {
    id: "guide",
    slug: "case",
    label: "Case",
    description: "Direct subject summary.",
    publicationStatus: "reviewed",
    primarySubject: { kind: "case", id: "case" },
    searchQueries: [{ query: "case" }],
    sections: [
      {
        id: "short",
        role: "short-answer",
        heading: "Summary",
        narrativeRefs: [{ dossierId: "dossier" }],
      },
    ],
    reviewedAt: "2026-09-06",
  },
] as SubjectGuide[];

function fixture() {
  const entities = structuredClone(fixtureEntities);
  const relationships = structuredClone(fixtureRelationships);
  const guides = structuredClone(fixtureGuides);
  const entitiesById = Object.fromEntries(
    entities.map((entity) => [entity.id, entity]),
  );
  const graph = {
    schemaVersion: "plural-graph-1",
    entities,
    relationships,
    subjectGuides: guides,
    subjectGuideRecords: guides,
    indexes: {
      entitiesById,
      subjectGuidesById: { guide: guides[0] },
      subjectGuideRecordsById: { guide: guides[0] },
      subjectGuideIdsBySlug: { case: "guide" },
      subjectGuideRecordIdsBySlug: { case: "guide" },
      outgoingRelationshipIds: {},
      incomingRelationshipIds: {},
    },
  } as CompiledDomainGraph;
  return { graph, entities, relationships, guides };
}

describe("semantic content preflight inventory", () => {
  it("reports a deterministic complete changed-tranche inventory without inventing findings", () => {
    const { graph, entities, relationships, guides } = fixture();
    const result = runContentSemanticPreflight(
      {
        graph,
        changedEntityIds: entities.map(({ id }) => id),
        changedRelationshipIds: relationships.map(({ id }) => id),
        changedGuideIds: guides.map(({ id }) => id),
        changedFiles: [
          "content/domain/evidence/example.ts",
          "tests/content/example-ledger.test.ts",
        ],
        changedTestText:
          "work source statement episode case dossier ro citation case-concept guide mutation drift not.toEqual",
      },
      "base",
    );
    expect(result.findings).toEqual([]);
    expect(formatContentSemanticPreflight(result)).toContain(
      "Inventory: 7 entities; 2 relationships; 1 Subject Guides",
    );
    expect(formatContentSemanticPreflight(result)).toContain(
      "Statement statement: observation",
    );
    expect(formatContentSemanticPreflight(result)).toContain(
      "Citation statement → source; supports; p. 1",
    );
  });
});

describe("semantic content preflight enforcement", () => {
  it("separates safe violations from interpretive and coverage signals", () => {
    const { graph } = fixture();
    const source = graph.indexes.entitiesById.source;
    if (source?.kind !== "source") throw new Error("source fixture");
    source.workId = "missing";
    delete source.publisher;
    delete source.publicationYear;
    const statement = graph.indexes.entitiesById.statement;
    if (statement?.kind !== "statement") throw new Error("statement fixture");
    statement.description = "This guide explains the claim.";
    graph.relationships = [
      {
        id: "unsupported",
        predicate: "advances-end",
        subject: { kind: "approach", id: "approach" },
        object: { kind: "end", id: "end" },
        status: "asserted",
        statementIds: [],
      },
    ] as DomainRelationship[];
    const episode = graph.indexes.entitiesById.episode;
    if (episode?.kind !== "case-episode") throw new Error("episode fixture");
    episode.conditionStatementIds = ["statement"];
    episode.formalRuleStatementIds = ["statement", "missing", "missing"];
    const result = runContentSemanticPreflight(
      {
        graph,
        changedEntityIds: ["source", "statement", "episode"],
        changedRelationshipIds: ["unsupported"],
        changedGuideIds: [],
        changedFiles: ["content/domain/index.ts"],
        changedTestText: "",
      },
      "base",
    );
    const violations = result.findings
      .filter(({ severity }) => severity === "violation")
      .map(({ code }) => code);
    expect(violations).toEqual(
      expect.arrayContaining([
        "artifact-language",
        "source-work-resolution",
        "statement-citation",
        "duplicate-case-slot",
        "case-slot-eligibility",
        "cross-case-slot-duplicate",
        "relationship-support",
      ]),
    );
    expect(
      result.findings
        .filter(({ severity }) => severity === "human-review")
        .map(({ code }) => code),
    ).toEqual([
      "additive-inventory",
      "exact-ledger-coverage",
      "mutation-coverage",
      "source-manifestation-field",
      "source-manifestation-field",
    ]);
  });
});

describe("semantic content preflight graph discovery", () => {
  it("detects modifications and deletions independently of changed source paths", () => {
    const { graph } = fixture();
    const baseGraph = structuredClone(graph);
    const statement = graph.indexes.entitiesById.statement;
    if (statement?.kind !== "statement") throw new Error("statement fixture");
    statement.text =
      "Changed through a shared helper or Markdown-backed projection.";
    graph.entities = graph.entities.filter(({ id }) => id !== "source");
    graph.relationships = graph.relationships.filter(
      ({ id }) => id !== "citation",
    );
    graph.subjectGuideRecords = [];
    expect(discoverGraphChanges(baseGraph, graph)).toEqual({
      changedEntityIds: ["statement"],
      changedRelationshipIds: [],
      changedGuideIds: [],
      removedEntityIds: ["source"],
      removedRelationshipIds: ["citation"],
      removedGuideIds: ["guide"],
    });
  });

  it("uses serialized graph discovery in the CLI path", async () => {
    const { graph } = fixture();
    const baseGraph = structuredClone(graph);
    const statement = graph.indexes.entitiesById.statement;
    if (statement?.kind !== "statement") throw new Error("statement fixture");
    statement.text = "Changed through Markdown or a shared helper.";
    const output: string[] = [];
    await runCli(["--base=fixture"], {
      baseGraph,
      headGraph: graph,
      files: ["content/domain/presentation/narratives/example.md"],
      changedTestText: "statement mutation",
      log: (message) => output.push(message),
    });
    expect(output.join("\n")).toContain("Statement statement: observation");
  });

  it("handles a deleted test while reporting a removal-only graph change", async () => {
    const { graph: baseGraph } = fixture();
    const headGraph = structuredClone(baseGraph);
    headGraph.entities = headGraph.entities.filter(({ id }) => id !== "source");
    headGraph.indexes.entitiesById = Object.fromEntries(
      Object.entries(headGraph.indexes.entitiesById).filter(
        ([id]) => id !== "source",
      ),
    );
    const output: string[] = [];
    await runCli(["--base=fixture"], {
      baseGraph,
      headGraph,
      files: ["tests/content/deleted-ledger.test.ts"],
      log: (message) => output.push(message),
    });
    const report = output.join("\n");
    expect(report).toContain("Removed entity source");
    expect(report).toContain("[exact-ledger-coverage] source:");
    expect(report).toContain("[mutation-coverage]");
  });

  it("covers broad artifact language in complete public identity prose", () => {
    const { graph } = fixture();
    const dossier = graph.indexes.entitiesById.dossier;
    if (dossier?.kind !== "dossier") throw new Error("dossier fixture");
    dossier.description = "A dossier about institutions.";
    const guide = graph.subjectGuideRecords[0];
    if (!guide) throw new Error("guide fixture");
    const section = guide.sections[0];
    if (!section) throw new Error("guide section fixture");
    section.heading = "Reader journeys";
    const result = runContentSemanticPreflight(
      {
        graph,
        changedEntityIds: ["dossier"],
        changedRelationshipIds: [],
        changedGuideIds: ["guide"],
        changedFiles: ["content/domain/presentation/narratives/example.md"],
        changedTestText: "dossier guide exact mutation",
      },
      "base",
    );
    expect(
      result.findings.filter(({ code }) => code === "artifact-language"),
    ).toHaveLength(2);
  });
});

describe("semantic content preflight judgment boundary", () => {
  it("flags proposition support semantics for human judgment rather than rejecting them", () => {
    const { graph } = fixture();
    const statement = graph.indexes.entitiesById.statement;
    if (statement?.kind !== "statement") throw new Error("statement fixture");
    statement.statementKind = "editorial-interpretation";
    graph.relationships.push({
      id: "strong",
      predicate: "advances-end",
      subject: { kind: "approach", id: "approach" },
      object: { kind: "end", id: "end" },
      status: "qualified",
      statementIds: ["statement"],
    } as DomainRelationship);
    const result = runContentSemanticPreflight(
      {
        graph,
        changedEntityIds: [],
        changedRelationshipIds: ["strong"],
        changedGuideIds: [],
        changedFiles: ["content/domain/relationships/example.ts"],
        changedTestText: "strong mutation",
      },
      "base",
    );
    expect(result.findings).toEqual([
      expect.objectContaining({
        severity: "human-review",
        code: "relationship-support-semantics",
        subject: "strong",
      }),
    ]);
  });
});
