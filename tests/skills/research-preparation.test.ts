import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";
import { researchBriefContract } from "../../scripts/skill-contracts.ts";

const preparationRoot = new URL(
  "../../.agents/skills/research-preparation/",
  import.meta.url,
);

const markerValues = (text: string, prefix: string) =>
  [...text.matchAll(new RegExp(`<!-- ${prefix}:([^ ]+) -->`, "g"))].map(
    ([, value]) => value,
  );

describe("research-preparation skill", () => {
  it("routes research-only work through shared evidence policy and a brief", async () => {
    const skill = await readFile(new URL("SKILL.md", preparationRoot), "utf8");
    await expect(
      readFile(
        new URL(
          "../research-content-changes/references/editorial-policy.md",
          preparationRoot,
        ),
        "utf8",
      ),
    ).resolves.toContain("# Editorial policy");
    await expect(
      readFile(
        new URL("references/research-brief-template.md", preparationRoot),
        "utf8",
      ),
    ).resolves.toContain(`research-brief:v${researchBriefContract.version}`);
    expect(skill).toContain("references/research-brief-template.md");
    expect(skill).toContain(
      "../research-content-changes/references/editorial-policy.md",
    );
  });

  it("keeps the versioned brief structurally complete without pinning prose", async () => {
    const template = await readFile(
      new URL("references/research-brief-template.md", preparationRoot),
      "utf8",
    );
    expect(markerValues(template, "research-brief-section")).toEqual(
      researchBriefContract.sectionIds,
    );
    for (const value of [
      ...researchBriefContract.evidenceStates,
      ...researchBriefContract.dispositions,
      ...researchBriefContract.scales,
    ]) {
      expect(template).toContain(`\`${value}\``);
    }
  });

  it("scales corrections and prevents inaccessible leads from passing as evidence", async () => {
    const examples = await readFile(
      new URL("references/examples.md", preparationRoot),
      "utf8",
    );
    expect(examples).toContain("research-brief-example:short-correction");
    expect(examples).toContain(
      "research-brief-example:inaccessible-source disposition:needs-evidence",
    );
    expect(examples).not.toContain(
      "research-brief-example:inaccessible-source disposition:ready",
    );
  });
});
