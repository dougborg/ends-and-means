import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";

const skillRoot = new URL("../../.agents/skills/research-content-changes/", import.meta.url);

describe("research-content-changes skill", () => {
  it("routes canonical Approach and Comparison Dimension work", async () => {
    const skill = await readFile(new URL("SKILL.md", skillRoot), "utf8");
    await expect(readFile(new URL("references/routes/approach.md", skillRoot), "utf8")).resolves.toContain("An Approach is");
    await expect(readFile(new URL("references/routes/dimension-placement.md", skillRoot), "utf8")).resolves.toContain("Dimension, define the eligible subject kinds");
    expect(skill).toContain("Comparison Dimension and Placement");
    expect(skill).not.toMatch(/references\/routes\/tradition\.md|every tradition/);
  });

  it("uses canonical Statement citation guidance", async () => {
    const statement = await readFile(new URL("references/routes/statement.md", skillRoot), "utf8");
    expect(statement).toContain("through `cites` relationships");
    expect(statement).not.toContain("claimIds");
  });

  it("routes model boundaries and protects safe parallel work", async () => {
    const skill = await readFile(new URL("SKILL.md", skillRoot), "utf8");
    for (const route of ["concept", "collection", "event-transition", "depiction"]) {
      await expect(readFile(new URL(`references/routes/${route}.md`, skillRoot), "utf8")).resolves.toBeTruthy();
      expect(skill).toContain(`references/routes/${route}.md`);
    }
    const boundaries = await readFile(new URL("references/testing-model-boundaries.md", skillRoot), "utf8");
    expect(boundaries).toContain("absence of inherited Ends, Means, domains, Placements, and assessments");
    expect(boundaries).toContain("equivalent permutations");
    expect(boundaries).toContain("`specified-by` relationships");
    expect(skill).toContain("dedicated branch and worktree");
    expect(skill).toMatch(/resolved\s+non-fiction Work/);
  });

  it("requires reconciliation rather than mechanical legacy promotion", async () => {
    const skill = await readFile(new URL("SKILL.md", skillRoot), "utf8");
    expect(skill).toContain("semantic duplicates");
    expect(skill).toContain("split compound Means");
    expect(skill).toContain("precise locators");
    expect(skill).toContain("gaps rather than manufacturing canonical coverage");
  });
});
