import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";

const skillRoot = new URL(
  "../../.agents/skills/research-content-changes/",
  import.meta.url,
);

describe("research-content-changes skill", () => {
  it("routes canonical Approach and Comparison Dimension work", async () => {
    const skill = await readFile(new URL("SKILL.md", skillRoot), "utf8");
    await expect(
      readFile(new URL("references/routes/approach.md", skillRoot), "utf8"),
    ).resolves.toContain("An Approach is");
    await expect(
      readFile(
        new URL("references/routes/dimension-placement.md", skillRoot),
        "utf8",
      ),
    ).resolves.toContain("Dimension, define the eligible subject kinds");
    expect(skill).toContain("Comparison Dimension and Placement");
    expect(skill).not.toMatch(
      /references\/routes\/tradition\.md|every tradition/,
    );
  });

  it("uses canonical Statement citation guidance", async () => {
    const statement = await readFile(
      new URL("references/routes/statement.md", skillRoot),
      "utf8",
    );
    expect(statement).toContain("through `cites` relationships");
    expect(statement).not.toContain("claimIds");
  });

  it("routes model boundaries and protects safe parallel work", async () => {
    const skill = await readFile(new URL("SKILL.md", skillRoot), "utf8");
    for (const route of [
      "concept",
      "collection",
      "event-transition",
      "depiction",
    ]) {
      await expect(
        readFile(new URL(`references/routes/${route}.md`, skillRoot), "utf8"),
      ).resolves.toBeTruthy();
      expect(skill).toContain(`references/routes/${route}.md`);
    }
    const boundaries = await readFile(
      new URL("references/testing-model-boundaries.md", skillRoot),
      "utf8",
    );
    expect(boundaries).toContain(
      "absence of inherited Ends, Means, domains, Placements, and assessments",
    );
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
    expect(skill).toContain("archive/legacy-research/");
    expect(skill).toContain("discovery lead only");
    expect(skill).toContain(
      "route unresolved fragments to the relevant backlog issue",
    );
    expect(skill).not.toContain("references/routes/topic.md");
  });

  it("preserves learner-first Subject Guide boundaries", async () => {
    const skill = await readFile(new URL("SKILL.md", skillRoot), "utf8");
    expect(skill).toMatch(/familiar subject or question/);
    expect(skill).toMatch(/Subject Guides.+presentation compositions/s);
    expect(skill).toMatch(/not graph superclasses.+factual claims/s);
    expect(skill).toMatch(/learner completeness.+graph coverage/s);
    expect(skill).toMatch(/Author them as `subject-guide` documents.+by ID/s);
    expect(skill).toMatch(
      /Do not add a guide `kind`, body prose, graph edges, or alternate labels/s,
    );
    expect(skill).toMatch(/searchQueries.+non-identifying entry phrases/s);
    expect(skill).toMatch(/representational failure.+boundary fixtures.+ADR/s);
    expect(skill).toMatch(
      /Indigenous.+stateless.+nomadic.+maritime.+city-state.+imperial.+colonial.+hybrid/s,
    );
  });

  it("uses the CI-parity integrity gate without automating editorial judgment", async () => {
    const skill = await readFile(new URL("SKILL.md", skillRoot), "utf8");
    expect(skill).toContain("pnpm audit:content-integrity");
    expect(skill).toContain("actual source passages");
    expect(skill).toContain("archive-exclusion");
    expect(skill).toContain("where absence may be legitimate");
  });

});

describe("editorial governance contract", () => {
  it("binds sensitive and AI-assisted work to public governance", async () => {
    const policy = await readFile(
      new URL("references/editorial-policy.md", skillRoot),
      "utf8",
    );
    expect(policy).toContain("src/pages/governance/index.astro");
    expect(policy).toContain("living person");
    expect(policy).toContain("restricted community knowledge");
    expect(policy).toContain("Do not send private submissions");
    expect(policy).toMatch(/automated structural and source-\s*similarity output/);
    expect(policy).toContain("a person remains accountable");
  });
});

describe("semantic preflight handoff", () => {
  it("runs focused remediation before one full handoff gate", async () => {
    const skill = await readFile(new URL("SKILL.md", skillRoot), "utf8");
    const handoffBlock = skill.match(
      /Run before handoff:\s+```bash\s+([\s\S]*?)```/,
    )?.[1];
    expect(new Set(handoffBlock?.trim().split("\n"))).toEqual(
      new Set(["pnpm audit:content-preflight", "pnpm verify"]),
    );
    expect(skill).toMatch(
      /focused affected checks.+single full handoff verification/s,
    );
  });
});

describe("public subject copy guidance", () => {
  it("keeps internal journey framing out of published identity copy", async () => {
    const skill = await readFile(new URL("SKILL.md", skillRoot), "utf8");
    expect(skill).toMatch(/audience\s+framing as internal\s+product language/);
    expect(skill).toMatch(
      /Public guide and Dossier identity text must describe the subject directly/,
    );
  });
});
