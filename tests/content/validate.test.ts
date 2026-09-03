import { describe, expect, it } from "vitest";
import {
  CRUX_IDS,
  SYSTEM_IDS,
  ContentValidationError,
  assertValidContentGraph,
  validateContentGraph,
  type ContentGraph,
} from "../../src/lib/content";

function validGraph(): ContentGraph {
  return {
    systems: SYSTEM_IDS.map((id) => ({ id, name: id.toUpperCase(), description: `${id} description` })),
    cruxes: CRUX_IDS.map((id) => ({ id, title: id, question: `${id}?` })),
    sources: [{
      id: "ostrom-1990",
      authors: ["Elinor Ostrom"],
      title: "Governing the Commons",
      year: 1990,
      type: "book",
      verified: "checked",
      identifiers: { isbn13: "9780521405997" },
      links: [
        { kind: "library", url: "https://openlibrary.org/", label: "Open Library" },
        { kind: "purchase", url: "https://bookshop.org/", vendor: "Bookshop", affiliate: false },
      ],
    }],
    cases: [{
      id: "commons",
      name: "Common-pool resources",
      summary: "Documented institutional cases.",
      systems: ["ms"],
      sources: ["ostrom-1990"],
    }],
    cells: SYSTEM_IDS.flatMap((system) => CRUX_IDS.map((crux) => ({
      id: `${system}-${crux}` as const,
      system,
      crux,
      mechanism: "A mechanism.",
      breaks: "A failure mode.",
      verdict: "mixed" as const,
      evidence: "partial" as const,
      sources: ["ostrom-1990"],
      cases: [],
      needsCitation: false,
    }))),
    claims: [{
      id: "ms-c01-local-knowledge",
      parent: { type: "cell", id: "ms-c01" },
      text: "Local knowledge affects coordination.",
      sources: ["ostrom-1990"],
      cases: ["commons"],
    }],
  };
}

describe("validateContentGraph", () => {
  it("accepts a complete graph in milestone and release modes", () => {
    expect(validateContentGraph(validGraph())).toMatchObject({ valid: true, count: 0 });
    expect(validateContentGraph(validGraph(), { citationMode: "release" }).valid).toBe(true);
  });

  it("reports all missing pairs together rather than failing fast", () => {
    const graph = validGraph();
    graph.cells = graph.cells.slice(2);

    const report = validateContentGraph(graph);

    expect(report.valid).toBe(false);
    expect(report.diagnostics.coverage.filter(({ code }) => code === "cell.pair.missing")).toHaveLength(2);
  });

  it("groups duplicates, broken references, bad enums, and verification errors", () => {
    const graph: any = validGraph();
    graph.sources.push({
      id: "ostrom-1990",
      authors: [],
      title: "Duplicate",
      type: "memoir",
      verified: "maybe",
      links: [{ kind: "purchase", url: "not a URL" }],
    });
    graph.cells[0].sources = ["missing-source"];
    graph.cells[0].cases = ["missing-case"];
    graph.cells[0].verdict = "excellent";
    graph.claims[0].parent = { type: "case", id: "missing-case" };

    const report = validateContentGraph(graph);
    const codes = Object.values(report.diagnostics).flat().map(({ code }) => code);

    expect(codes).toEqual(expect.arrayContaining([
      "id.duplicate",
      "source.unresolved",
      "case.unresolved",
      "cell.verdict.invalid",
      "source.type.invalid",
      "source.verified.invalid",
      "source.link.url.invalid",
      "source.link.affiliate.required",
      "claim.parent.unresolved",
      "cell.citation.unacknowledged",
    ]));
  });

  it("allows acknowledged citation gaps only before release", () => {
    const graph = validGraph();
    Object.assign(graph.cells[0]!, { sources: [], cases: [], needsCitation: true });

    expect(validateContentGraph(graph).diagnostics.citations).toHaveLength(0);
    expect(validateContentGraph(graph, { citationMode: "release" }).diagnostics.citations)
      .toEqual(expect.arrayContaining([expect.objectContaining({ code: "cell.citation.release" })]));
  });

  it("offers an assertion API with the complete report", () => {
    const graph = validGraph();
    graph.cells = [];

    expect(() => assertValidContentGraph(graph)).toThrow(ContentValidationError);
    try {
      assertValidContentGraph(graph);
    } catch (error) {
      expect((error as ContentValidationError).report.count).toBeGreaterThan(100);
    }
  });
});
