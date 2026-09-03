import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";
import {
  canonicalCruxId,
  curateContent,
  type CurationOverrides,
  type StagingImport,
} from "../../src/lib/content";

const root = new URL("../../", import.meta.url);

async function fixture() {
  const [staging, overrides] = await Promise.all([
    readFile(new URL("generated/content/import.json", root), "utf8"),
    readFile(new URL("content/import-overrides/overrides.json", root), "utf8"),
  ]);
  return {
    staging: JSON.parse(staging) as StagingImport,
    overrides: JSON.parse(overrides) as CurationOverrides,
  };
}

describe("curateContent", () => {
  it("canonicalizes all IDs, preserves prose, and validates the 8 × 14 graph", async () => {
    const { staging, overrides } = await fixture();
    const result = curateContent(staging, overrides);

    expect(result.report.counts).toMatchObject({ systems: 8, cruxes: 14, cells: 112 });
    expect(result.report.validation).toMatchObject({ valid: true, count: 0 });
    expect(result.report.unresolved.missingJudgments).toEqual([]);
    expect(result.report.unresolved.unexpectedJudgments).toEqual([]);
    expect(result.graph.systems.map(({ id }) => id)).toEqual(["lf", "sd", "ms", "cp", "sa", "sc", "ac", "pe"]);
    expect(result.graph.cruxes.map(({ id }) => id)).toEqual(Array.from({ length: 14 }, (_, i) => `c${String(i + 1).padStart(2, "0")}`));
    expect(result.graph.cells[0]).toMatchObject({ id: "lf-c01", system: "lf", crux: "c01" });
    expect(result.graph.cells[0]?.mechanism).toBe(staging.cells[0]?.mechanism);
    expect(result.graph.cells[0]?.breaks).toBe(staging.cells[0]?.breaks);
  });

  it("takes judgments only from explicit cell overrides", async () => {
    const { staging, overrides } = await fixture();
    overrides.cellJudgments["lf-c01"] = { verdict: "worst", evidence: "contested" };
    const result = curateContent(staging, overrides);
    expect(result.graph.cells.find(({ id }) => id === "lf-c01")).toMatchObject(overrides.cellJudgments["lf-c01"]!);

    delete overrides.cellJudgments["sd-c01"];
    expect(curateContent(staging, overrides).report.unresolved.missingJudgments).toEqual(["sd-c01"]);
  });

  it("reports override keys outside the exact canonical cell set", async () => {
    const { staging, overrides } = await fixture();
    overrides.cellJudgments["bogus-c99"] = { verdict: "strong", evidence: "extensive" };

    const result = curateContent(staging, overrides);

    expect(result.report.unresolved.unexpectedJudgments).toEqual(["bogus-c99"]);
  });

  it("acknowledges all remaining citation gaps in milestone mode", async () => {
    const { staging, overrides } = await fixture();
    const result = curateContent(staging, overrides);
    expect(result.report.unresolved.needsCitation.length).toBeGreaterThan(0);
    expect(result.graph.cells.filter(({ needsCitation }) => needsCitation)).toHaveLength(result.report.unresolved.needsCitation.length);
    expect(result.report.validation.diagnostics.citations).toEqual([]);
    expect(result.report.releaseReadiness.ready).toBe(false);
    expect(result.report.releaseReadiness.validation.valid).toBe(false);
    expect(result.report.releaseReadiness.validation.diagnostics.citations).toHaveLength(112);
  });

  it("surfaces missing crux questions as unresolved editorial work", async () => {
    const { staging, overrides } = await fixture();
    const result = curateContent(staging, overrides);
    expect(result.report.unresolved.missingQuestions).toEqual(["c10"]);
    expect(result.graph.cruxes.find(({ id }) => id === "c10")?.question).toBe("Question pending editorial review.");
  });

  it("applies reviewed judgments and evidence semantics", async () => {
    const { staging, overrides } = await fixture();
    const result = curateContent(staging, overrides);
    const cells = Object.fromEntries(result.graph.cells.map((cell) => [cell.id, cell]));

    expect(cells["sc-c04"]?.verdict).toBe("weak");
    expect(cells["sd-c13"]?.verdict).toBe("moderate");
    expect(cells["ms-c13"]?.verdict).toBe("moderate");
    expect(cells["cp-c06"]?.verdict).toBe("mixed");
    expect(cells["sc-c06"]?.verdict).toBe("weak");
    expect(cells["sa-c06"]?.verdict).toBe("contested");
    expect(cells["sc-c09"]?.verdict).toBe("moderate");
    expect(cells["cp-c11"]?.verdict).toBe("mixed");
    expect(cells["pe-c14"]?.verdict).toBe("weak");
    expect(cells["lf-c10"]?.verdict).toBe("mixed");

    expect(result.graph.cells.filter(({ system }) => system === "pe").every(({ evidence }) => evidence === "untested")).toBe(true);
    expect(cells["ac-c10"]?.evidence).toBe("contested");
    expect(result.graph.cells.filter(({ system, crux }) => system === "ac" && crux !== "c10").every(({ evidence }) => evidence === "none")).toBe(true);
  });

  it("rejects unknown mechanical IDs and tiers instead of guessing", async () => {
    const { staging, overrides } = await fixture();
    staging.systems[0]!.id = "mystery-system";
    expect(() => curateContent(staging, overrides)).toThrow("Unknown staging system");

    const fresh = await fixture();
    fresh.staging.sourceCandidates[0]!.verificationTier = "probably-checked";
    expect(() => curateContent(fresh.staging, fresh.overrides)).toThrow("Unknown staging verification tier");
    expect(() => canonicalCruxId(15)).toThrow("Cannot canonicalize crux number");
  });
});
