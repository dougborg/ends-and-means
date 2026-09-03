import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import graph from "../../content/framework/graph.json";
import report from "../../generated/reports/framework-migration.json";
import { validateApproachGraph } from "../../src/lib/framework/validate";

describe("clean framework migration", () => {
  it("accounts for every exploratory comparison exactly once", () => {
    expect(report.input.comparisons).toBe(112);
    expect(report.coverage).toEqual({ consumed: 112, missing: [] });
    expect(report.audit).toHaveLength(112);
    expect(new Set(report.audit.map(({ inputId }) => inputId)).size).toBe(112);
  });

  it("creates a sparse clean graph without inherited schema fields", () => {
    expect(graph.approaches).toHaveLength(8);
    expect(graph.topics).toHaveLength(5);
    expect(graph.challenges).toHaveLength(9);
    expect(graph.criteria).toHaveLength(3);
    expect(graph.responses).toHaveLength(72);
    expect(graph.researchNotes).toHaveLength(16);
    expect(graph.sources).toHaveLength(51);
    expect(graph.approaches.every(({ overview, distinctions, commonQuestions, domains }) => overview.length >= 2 && distinctions.length >= 3 && commonQuestions.length >= 3 && domains.length > 0)).toBe(true);
    const serialized = JSON.stringify(graph);
    expect(serialized).not.toMatch(/"(?:system|crux|cell|verdict|evidence|needsCitation)"\s*:/i);
    expect(validateApproachGraph(graph)).toEqual([]);
  });

  it("classifies unlike Approaches instead of presenting one false entity type", () => {
    expect(graph.approaches.find(({ id }) => id === "social-democratic-tradition")?.kind).toBe("tradition");
    expect(graph.approaches.find(({ id }) => id === "central-planning-tradition")?.kind).toBe("institutional-family");
    expect(graph.approaches.find(({ id }) => id === "participatory-economics")?.kind).toBe("named-model");
    expect(graph.approaches.every(({ domains }) => new Set(domains).size === domains.length)).toBe(true);
  });

  it("rejects unknown Approach kinds and institutional domains", () => {
    const malformed = structuredClone(graph) as typeof graph;
    malformed.approaches[0]!.kind = "ideology" as never;
    malformed.approaches[1]!.domains.push("everything" as never);
    expect(validateApproachGraph(malformed)).toEqual(expect.arrayContaining([
      expect.stringContaining("invalid Approach kind ideology"),
      expect.stringContaining("invalid institutional domain everything"),
    ]));
  });

  it("merges overlapping inputs without flattening their statements", () => {
    const distribution = graph.responses.find(({ id }) => id === "social-democratic-tradition--distribution-of-gains-and-ownership")!;
    const authority = graph.responses.find(({ id }) => id === "social-democratic-tradition--authority-accountability-and-abuse")!;
    expect(distribution.means).toHaveLength(2);
    expect(distribution.failureHypotheses).toHaveLength(2);
    expect(authority.means).toHaveLength(3);
    expect(authority.failureHypotheses).toHaveLength(3);
    expect(distribution.means.every(({ researchNeeded }) => researchNeeded)).toBe(true);
  });

  it("keeps migration-only terminology out of the target artifact", () => {
    const raw = readFileSync("content/framework/graph.json", "utf8");
    expect(raw).not.toMatch(/\bc0\d\b|\bc1[0-4]\b/i);
    expect(raw).not.toMatch(/\bcrux(?:es)?\b/i);
  });
});
