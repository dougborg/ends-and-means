import { mkdir, mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  auditSkillContracts,
  skillCapabilities,
} from "../../scripts/skill-contracts.ts";

const paths = [
  ...new Set(skillCapabilities.flatMap((capability) => capability.paths)),
];

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
        await writeFile(
          target,
          await readFile(join(process.cwd(), path), "utf8"),
        );
      }
      const deletion = new RegExp(
        capability.deletion.pattern.source,
        `${capability.deletion.pattern.flags.replace("g", "")}g`,
      );
      let replacements = 0;
      for (const path of capability.paths) {
        const target = join(root, path);
        const original = await readFile(target, "utf8");
        const mutated = original.replace(deletion, () => {
          replacements += 1;
          return "capability intentionally deleted";
        });
        await writeFile(target, mutated);
      }
      expect(replacements).toBeGreaterThan(0);
      const findings = auditSkillContracts(root);
      expect(findings).toContainEqual({
        code: "SKILL_CAPABILITY",
        message: `${capability.owner} does not cover ${capability.name}.`,
      });
      expect(auditSkillContracts(root)).toEqual(findings);
      const legitimateMessages = new Set(
        skillCapabilities.map(
          ({ owner, name }) => `${owner} does not cover ${name}.`,
        ),
      );
      for (const finding of findings) {
        expect(finding.code).toBe("SKILL_CAPABILITY");
        expect(legitimateMessages).toContain(finding.message);
      }
    }
  });

  it("reports missing owner files as structured drift", async () => {
    const root = await mkdtemp(join(tmpdir(), "ends-means-skills-"));
    const findings = auditSkillContracts(root);
    expect(findings).toContainEqual({
      code: "SKILL_FILE_MISSING",
      message:
        "coordinate-project-delivery is missing .agents/skills/coordinate-project-delivery/SKILL.md.",
    });
    expect(
      findings
        .filter(({ message }) => message.endsWith("/SKILL.md."))
        .map(({ message }) => message),
    ).toEqual([
      "coordinate-project-delivery is missing .agents/skills/coordinate-project-delivery/SKILL.md.",
      "research-content-changes is missing .agents/skills/research-content-changes/SKILL.md.",
    ]);
  });
});
