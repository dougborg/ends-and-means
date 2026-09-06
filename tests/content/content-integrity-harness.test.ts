import { describe, expect, it } from "vitest";
import { canonicalDocuments } from "../../content/domain";
import {
  type AuthoringDocument,
  type CompiledDomainGraph,
  formatIntegrityResult,
  publicationBoundaryFindings,
  runContentIntegrity,
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
      location: expect.any(String),
      remediation: expect.stringContaining("reference"),
    });
    expect(finding?.message).toContain(
      "unresolved or mistyped document subject concept:missing-concept",
    );
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
      "uncited-source-fixture",
    );
    expect(attention.dimensionsWithoutPlacements).toContain(
      "unplaced-dimension-fixture",
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
      ],
    };
    expect(verify({ graph }).findings).toContainEqual(
      expect.objectContaining({
        category: "source-similarity",
        severity: "attention",
        location: "fixture-dossier#answer",
        message: expect.stringContaining(
          "compare against Sources fixture-source",
        ),
      }),
    );
  });

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
