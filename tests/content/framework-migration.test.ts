import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import draft from "../../content/framework/draft.json";
import report from "../../generated/reports/framework-migration.json";
import { validateFrameworkDraft } from "../../src/lib/framework/validate";

describe("clean framework migration", () => {
  it("accounts for every exploratory comparison exactly once", () => {
    expect(report.input.comparisons).toBe(112);
    expect(report.coverage).toEqual({ consumed: 112, missing: [] });
    expect(report.audit).toHaveLength(112);
    expect(new Set(report.audit.map(({ inputId }) => inputId)).size).toBe(112);
  });

  it("creates a sparse clean graph without inherited schema fields", () => {
    expect(draft.traditions).toHaveLength(8);
    expect(draft.challenges).toHaveLength(9);
    expect(draft.criteria).toHaveLength(3);
    expect(draft.responses).toHaveLength(72);
    expect(draft.researchNotes).toHaveLength(16);
    expect(draft.sources).toHaveLength(51);
    const serialized = JSON.stringify(draft);
    expect(serialized).not.toMatch(/"(?:system|crux|cell|verdict|evidence|needsCitation)"\s*:/i);
    expect(validateFrameworkDraft(draft)).toEqual([]);
  });

  it("merges overlapping inputs without flattening their statements", () => {
    const distribution = draft.responses.find(({ id }) => id === "social-democratic-tradition--distribution-of-gains-and-ownership")!;
    const authority = draft.responses.find(({ id }) => id === "social-democratic-tradition--authority-accountability-and-abuse")!;
    expect(distribution.means).toHaveLength(2);
    expect(distribution.failureHypotheses).toHaveLength(2);
    expect(authority.means).toHaveLength(3);
    expect(authority.failureHypotheses).toHaveLength(3);
    expect(distribution.means.every(({ researchNeeded }) => researchNeeded)).toBe(true);
  });

  it("keeps migration-only terminology out of the target artifact", () => {
    const raw = readFileSync("content/framework/draft.json", "utf8");
    expect(raw).not.toMatch(/\bc0\d\b|\bc1[0-4]\b/i);
    expect(raw).not.toMatch(/\bcrux(?:es)?\b/i);
  });
});
