import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { canonicalDocuments } from "../../content/domain";
import {
  loadPublicationFiles,
  normalizePublicationPath,
  walkRequiredFiles,
} from "../../scripts/content-integrity-files";
import {
  type AuthoringDocument,
  type CompiledDomainGraph,
  compareCodeUnits,
  formatIntegrityResult,
  publicationBoundaryFindings,
  runContentIntegrity,
  validationFindingLocation,
} from "../../src/lib/domain";
import { canonicalGraph } from "../../src/lib/domain/canonical";

function verify(
  overrides: Partial<Parameters<typeof runContentIntegrity>[0]> = {},
) {
  return runContentIntegrity({
    documents: canonicalDocuments,
    graph: canonicalGraph,
    narratives: [],
    runtimeFiles: [],
    ...overrides,
  });
}

describe("content-integrity harness", () => {
  it("accepts the canonical graph and reports research attention separately", () => {
    const result = verify();
    expect(
      result.findings.filter(({ severity }) => severity === "violation"),
    ).toEqual([]);
    expect(result.attention.dossierCoverage).not.toEqual([]);
    expect(result.attention).toHaveProperty("sourcesWithoutCitations");
    expect(result.attention).toHaveProperty("entitiesWithoutRelationships");
    expect(result.attention).toHaveProperty("dimensionsWithoutPlacements");
    expect(result.attention).toHaveProperty(
      "researchGapSectionsWithoutObligations",
    );
    expect(result.attention.sourcePreflight).not.toEqual([]);
  });

  it("turns unresolved canonical references into actionable violations", () => {
    const invalid: AuthoringDocument[] = [
      ...canonicalDocuments,
      {
        documentType: "relationships",
        subject: { kind: "concept", id: "missing-concept" },
        relationships: [],
      },
    ];
    const [finding] = verify({ documents: invalid }).findings;
    expect(finding).toMatchObject({
      category: "domain-validation",
      severity: "violation",
      location: `document ${invalid.length - 1}`,
      remediation: expect.stringContaining("reference"),
    });
    expect(finding?.message).toContain(
      "unresolved or mistyped document subject concept:missing-concept",
    );
    expect(
      validationFindingLocation("concept:missing-concept: unresolved owner"),
    ).toBe("concept:missing-concept");
  });

  it("reports uncited Sources and unplaced Dimensions as attention", () => {
    const graph = structuredClone(canonicalGraph);
    const source = graph.entities.find((entity) => entity.kind === "source");
    const dimension = graph.entities.find(
      (entity) => entity.kind === "comparison-dimension",
    );
    if (source?.kind !== "source" || dimension?.kind !== "comparison-dimension")
      throw new Error("Missing canonical attention fixtures");
    graph.entities.push(
      { ...source, id: "uncited-source-fixture" },
      { ...dimension, id: "unplaced-dimension-fixture" },
    );
    const attention = verify({ graph }).attention;
    expect(attention.sourcesWithoutCitations).toContain(
      "source:uncited-source-fixture",
    );
    expect(attention.dimensionsWithoutPlacements).toContain(
      "comparison-dimension:unplaced-dimension-fixture",
    );
  });

  it("reports sentence-per-line failures with their file and line", () => {
    const result = verify({
      narratives: [
        {
          path: "content/domain/presentation/narratives/example.md",
          content: "A sentence\ncontinued here.",
          lineErrors: [
            {
              line: 1,
              message: "prose lines must contain one complete sentence",
            },
          ],
        },
      ],
    });
    expect(result.findings).toContainEqual(
      expect.objectContaining({
        category: "narrative-lines",
        severity: "violation",
        location: "content/domain/presentation/narratives/example.md:1",
      }),
    );
  });
});

describe("safe-publication boundary", () => {
  it("rejects runtime imports and build references to excluded material", () => {
    expect(
      publicationBoundaryFindings([
        {
          path: "src/example.ts",
          content: 'import data from "../archive/legacy-research/data";',
        },
      ]),
    ).toContainEqual(
      expect.objectContaining({
        category: "archive-exclusion",
        location: "src/example.ts",
      }),
    );
    expect(
      publicationBoundaryFindings(
        [],
        [
          {
            path: "dist/index.html",
            content: "archive/legacy-research/source.md",
          },
        ],
      ),
    ).toContainEqual(
      expect.objectContaining({
        category: "archive-exclusion",
        location: "dist/index.html",
      }),
    );
    expect(
      publicationBoundaryFindings(
        [
          {
            path: "src/example.ts",
            content: 'import data from "../content/domain";',
          },
        ],
        [{ path: "dist/index.html", content: "Reviewed public material" }],
      ),
    ).toEqual([]);
    expect(
      publicationBoundaryFindings([
        {
          path: "content/domain/presentation/narratives/example.md",
          content: 'A prose example says from "../archive/source".',
        },
      ]),
    ).toEqual([]);
  });

  it.each([
    'import "../archive/data";',
    'const data = require("../archive/data");',
    'const resolved = require.resolve("../archive/data");',
    'import data = require("../archive/data");',
    `const deferred = \`${"${"}require("../archive/data")}\`;`,
    `const nested = \`${"${"}flag ? { ok: true } : require("../archive/data")}\`;`,
    `const nestedTemplate = \`${"${"}\`value ${"${"}require("../archive/data")}\`}` +
      "`;",
    `const regexBrace = \`${"${"}/}/.test(value) ? require("../archive/data") : "ok"}\`;`,
    'const slashPattern = /[//]/; const data = require("../archive/data");',
  ])("rejects executable dependency syntax: %s", (content) => {
    expect(
      publicationBoundaryFindings([{ path: "src/example.ts", content }]),
    ).toContainEqual(
      expect.objectContaining({
        category: "archive-exclusion",
        message: expect.stringContaining("../archive/data"),
      }),
    );
  });

  it.each([
    '// import "../archive/data";',
    '/* const data = require("../archive/data"); */',
    "const example = 'import \"../archive/data\"';",
    'const example = `require("../archive/data")`;',
    'from = "../archive/data";',
    'const example = { from: "../archive/data" };',
    // biome-ignore lint/suspicious/noTemplateCurlyInString: literal scanner fixture
    'const example = `escaped \\${require("../archive/data")}`;',
    // biome-ignore lint/suspicious/noTemplateCurlyInString: literal scanner fixture
    'const example = `${"}"} remains ordinary text`;',
  ])("ignores non-executable dependency examples: %s", (content) => {
    expect(
      publicationBoundaryFindings([{ path: "src/example.ts", content }]),
    ).toEqual([]);
  });

  it("rejects publishable files stored inside excluded trees", () => {
    expect(
      publicationBoundaryFindings([
        { path: "src/archive/example.ts", content: "export const value = 1" },
      ]),
    ).toContainEqual(
      expect.objectContaining({
        category: "archive-exclusion",
        location: "src/archive/example.ts",
      }),
    );
  });
});

describe("parser-backed publication boundary", () => {
  it("fails closed when executable syntax cannot be parsed", () => {
    expect(
      publicationBoundaryFindings([
        { path: "src/example.ts", content: 'import value from "unterminated' },
      ]),
    ).toContainEqual(
      expect.objectContaining({
        category: "archive-exclusion",
        message: expect.stringContaining("could not prove a static boundary"),
      }),
    );
    expect(
      publicationBoundaryFindings([
        { path: "src/example.ts", content: "const data = require(variable);" },
      ]),
    ).toContainEqual(
      expect.objectContaining({
        message: expect.stringContaining("non-static module specifier"),
      }),
    );
  });

  it("scans Astro frontmatter and scripts but ignores HTML comments", () => {
    expect(
      publicationBoundaryFindings([
        {
          path: "src/pages/example.astro",
          content: [
            "---",
            'import data from "../archive/data";',
            'const example = `<script>require("../archive/frontmatter-string")</script>`;',
            "---",
            '<!-- <script>require("../archive/comment")</script> -->',
            '<script src="../archive/external"></script>',
            '<script>require("../archive/client")</script>',
          ].join("\n"),
        },
      ]).map(({ message }) => message),
    ).toEqual([
      expect.stringContaining("../archive/client"),
      expect.stringContaining("../archive/data"),
      expect.stringContaining("../archive/external"),
    ]);
  });
});

describe("editorial similarity signals", () => {
  it("flags close narrative/Statement wording only as a human-review signal", () => {
    const statement = {
      id: "fixture-statement",
      kind: "statement" as const,
      label: "Fixture statement",
      description: "Synthetic fixture.",
      publicationStatus: "reviewed" as const,
      statementKind: "observation" as const,
      text: "Workers repeatedly inspect the same public accounts before delegates make binding decisions.",
    };
    const source = {
      id: "fixture-source",
      kind: "source" as const,
      label: "Fixture source",
      description: "Synthetic fixture.",
      publicationStatus: "reviewed" as const,
      sourceType: "report" as const,
      title: "Fixture report",
    };
    const dossier = {
      id: "fixture-dossier",
      kind: "dossier" as const,
      label: "Fixture dossier",
      description: "Synthetic fixture.",
      publicationStatus: "reviewed" as const,
      subject: { kind: "concept" as const, id: "fixture-subject" },
      standfirst: "A synthetic standfirst.",
      standfirstStatementIds: [statement.id],
      reviewedAt: "2026-09-05",
      sections: [
        {
          id: "answer",
          heading: "What happens?",
          body: "Workers repeatedly inspect the same public accounts before delegates make binding decisions.",
          statementIds: [statement.id],
          traceStatus: "supported" as const,
        },
      ],
    };
    const graph: CompiledDomainGraph = {
      ...canonicalGraph,
      entities: [...canonicalGraph.entities, statement, source, dossier],
      relationships: [
        ...canonicalGraph.relationships,
        {
          id: "fixture-statement-cites-source",
          predicate: "cites",
          subject: { kind: "statement", id: statement.id },
          object: { kind: "source", id: source.id },
          role: "supports",
          locator: "p. 1",
        },
        {
          id: "fixture-statement-cites-source-again",
          predicate: "cites",
          subject: { kind: "statement", id: statement.id },
          object: { kind: "source", id: source.id },
          role: "supports",
          locator: "p. 2",
        },
      ],
    };
    const finding = verify({ graph }).findings.find(
      ({ location }) => location === "fixture-dossier#answer",
    );
    expect(finding).toEqual(
      expect.objectContaining({
        category: "source-similarity",
        severity: "attention",
        location: "fixture-dossier#answer",
        message: expect.stringContaining(
          "compare against Sources fixture-source",
        ),
      }),
    );
    expect(finding?.message.match(/fixture-source/gu)).toHaveLength(1);
  });
});

describe("standfirst similarity signals", () => {
  it("checks a Dossier standfirst against its traced Statements", () => {
    const graph = structuredClone(canonicalGraph);
    const statement = graph.entities.find(
      (entity) => entity.kind === "statement",
    );
    const source = graph.entities.find((entity) => entity.kind === "source");
    if (statement?.kind !== "statement" || source?.kind !== "source")
      throw new Error("Missing canonical similarity fixtures");
    const fixtureStatement = {
      ...statement,
      id: "standfirst-similarity-statement",
      text: "Residents repeatedly inspect the same public accounts before delegates make binding decisions.",
    };
    graph.entities.push(fixtureStatement, {
      id: "standfirst-similarity-dossier",
      kind: "dossier",
      label: "Standfirst similarity dossier",
      description: "Synthetic fixture.",
      publicationStatus: "reviewed",
      subject: { kind: "concept", id: "fixture-subject" },
      standfirst:
        "Residents repeatedly inspect the same public accounts before delegates make binding decisions.",
      standfirstStatementIds: [fixtureStatement.id],
      reviewedAt: "2026-09-05",
      sections: [],
    });
    graph.relationships.push({
      id: "standfirst-similarity-citation",
      predicate: "cites",
      subject: { kind: "statement", id: fixtureStatement.id },
      object: { kind: "source", id: source.id },
      role: "supports",
      locator: "p. 1",
    });

    expect(verify({ graph }).findings).toContainEqual(
      expect.objectContaining({
        category: "source-similarity",
        location: "standfirst-similarity-dossier#standfirst",
      }),
    );

    const dossier = graph.entities.find(
      ({ id }) => id === "standfirst-similarity-dossier",
    );
    if (dossier?.kind !== "dossier")
      throw new Error("Missing standfirst Dossier fixture");
    dossier.standfirstStatementIds = [];
    expect(verify({ graph }).findings).not.toContainEqual(
      expect.objectContaining({
        location: "standfirst-similarity-dossier#standfirst",
      }),
    );
  });
});

describe("deterministic integrity output", () => {
  it("returns and formats findings deterministically for permuted inputs", () => {
    const runtimeFiles = [
      { path: "src/archive/z.ts", content: "export const z = 1" },
      { path: "src/archive/a.ts", content: "export const a = 1" },
    ];
    const forward = verify({ runtimeFiles });
    const reverse = verify({ runtimeFiles: runtimeFiles.toReversed() });

    expect(reverse.findings).toEqual(forward.findings);
    expect(
      formatIntegrityResult({
        ...forward,
        findings: forward.findings.toReversed(),
      }),
    ).toBe(formatIntegrityResult(forward));
    expect(["ä", "a", "Z"].toSorted(compareCodeUnits)).toEqual(["Z", "a", "ä"]);
  });

  it("sorts filesystem input and fails closed when a scan root is absent", async () => {
    const root = await mkdtemp(join(tmpdir(), "content-integrity-"));
    await mkdir(join(root, "nested"));
    await writeFile(join(root, "A.md"), "A.");
    await writeFile(join(root, "z.md"), "Z.");
    await writeFile(join(root, "nested", "a.md"), "A.");

    await expect(
      loadPublicationFiles(root, [".", "missing"], /\.md$/u),
    ).rejects.toThrow();
    await expect(walkRequiredFiles(root)).resolves.toEqual([
      join(root, "A.md"),
      join(root, "nested", "a.md"),
      join(root, "z.md"),
    ]);
  });

  it("normalizes platform-specific publication paths before boundary checks", () => {
    const pathname = normalizePublicationPath(
      "content\\archive\\legacy-research\\example.ts",
    );
    expect(pathname).toBe("content/archive/legacy-research/example.ts");
    expect(
      publicationBoundaryFindings([{ path: pathname, content: "" }]),
    ).toEqual([
      expect.objectContaining({
        category: "archive-exclusion",
        location: pathname,
      }),
    ]);
  });
});

describe("integrity result formatting", () => {
  it("formats violations and human-review signals distinctly", () => {
    const output = formatIntegrityResult({
      attention: verify().attention,
      findings: [
        {
          category: "domain-validation",
          severity: "violation",
          location: "concept:test",
          message: "invalid fixture",
          remediation: "repair fixture",
        },
        {
          category: "source-similarity",
          severity: "attention",
          location: "dossier:test",
          message: "compare phrasing",
          remediation: "inspect sources",
        },
      ],
    });
    expect(output).toContain("Fix: repair fixture");
    expect(output).toContain("Review: inspect sources");
  });
});
