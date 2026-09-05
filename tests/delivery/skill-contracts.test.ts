import { mkdtemp, mkdir, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { describe, expect, it } from "vitest";
import { auditSkillContracts } from "../../scripts/skill-contracts.ts";

const paths = [
  ".agents/skills/coordinate-project-delivery/SKILL.md",
  ".agents/skills/coordinate-project-delivery/references/delivery-policy.md",
  ".agents/skills/coordinate-project-delivery/references/review-and-integration.md",
  ".agents/skills/research-content-changes/SKILL.md",
  ".agents/skills/research-content-changes/references/editorial-policy.md",
  "docs/project-vision.md",
  "docs/narrative-style.md",
  "CONTRIBUTING.md",
];

describe("repository skill contract", () => {
  it("covers the cross-skill delivery and research capabilities", () => {
    expect(auditSkillContracts(process.cwd())).toEqual([]);
  });

  it("reports a missing capability without depending on exact prose", async () => {
    const root = await mkdtemp(join(tmpdir(), "ends-means-skills-"));
    for (const path of paths) {
      const target = join(root, path);
      await mkdir(dirname(target), { recursive: true });
      const content = (await readFile(join(process.cwd(), path), "utf8")).replaceAll(/Copilot/gi, "automated reviewer");
      await writeFile(target, content);
    }
    expect(auditSkillContracts(root)).toContainEqual({
      code: "SKILL_CAPABILITY",
      message: "Repository skills and guidance do not cover review.",
    });
  });
});
