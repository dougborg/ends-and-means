import { mkdtemp, mkdir, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { describe, expect, it } from "vitest";
import { auditSkillContracts, skillCapabilities } from "../../scripts/skill-contracts.ts";

const paths = [...new Set(skillCapabilities.flatMap((capability) => capability.paths))];

describe("repository skill contract", () => {
  it("covers the cross-skill delivery and research capabilities", () => {
    expect(auditSkillContracts(process.cwd())).toEqual([]);
  });

  it("detects deletion of every capability from its owning skill corpus", async () => {
    for (const capability of skillCapabilities) {
      const root = await mkdtemp(join(tmpdir(), "ends-means-skills-"));
      for (const path of paths) {
        const target = join(root, path);
        await mkdir(dirname(target), { recursive: true });
        await writeFile(target, await readFile(join(process.cwd(), path), "utf8"));
      }
      for (const path of capability.paths) await writeFile(join(root, path), "Capability intentionally deleted by fixture.\n");
      expect(auditSkillContracts(root)).toContainEqual({
        code: "SKILL_CAPABILITY",
        message: `${capability.owner} does not cover ${capability.name}.`,
      });
    }
  });
});
