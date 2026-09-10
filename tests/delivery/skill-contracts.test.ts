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

interface ResearchDeliveryFixture {
  name: string;
  append?: string;
  remove?: string;
  valid?: boolean;
}

const researchSkillPath = ".agents/skills/research-content-changes/SKILL.md";

async function copySkillCorpus(root: string): Promise<void> {
  for (const path of paths) {
    const target = join(root, path);
    await mkdir(dirname(target), { recursive: true });
    await writeFile(target, await readFile(join(process.cwd(), path), "utf8"));
  }
}

describe("repository skill contract", () => {
  it("covers the cross-skill delivery and research capabilities", () => {
    expect(auditSkillContracts(process.cwd())).toEqual([]);
  });

  it("detects deletion of every capability from its owning skill corpus", async () => {
    for (const capability of skillCapabilities) {
      const root = await mkdtemp(join(tmpdir(), "ends-means-skills-"));
      await copySkillCorpus(root);
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

  it("rejects research pull-request policy regressions from fixtures", async () => {
    const fixtures = JSON.parse(
      await readFile(
        join(
          process.cwd(),
          "tests/fixtures/skill-contracts/research-review-delivery.json",
        ),
        "utf8",
      ),
    ) as ResearchDeliveryFixture[];

    for (const fixture of fixtures) {
      const root = await mkdtemp(join(tmpdir(), "ends-means-skills-"));
      await copySkillCorpus(root);
      const target = join(root, researchSkillPath);
      let skill = await readFile(target, "utf8");
      if (fixture.remove) {
        expect(skill, fixture.name).toContain(fixture.remove);
        skill = skill.replace(fixture.remove, "");
      }
      if (fixture.append) skill += fixture.append;
      await writeFile(target, skill);

      const expectedFinding = {
        code: "SKILL_CAPABILITY",
        message:
          "research-content-changes does not cover research review delivery.",
      };
      if (fixture.valid) {
        expect(auditSkillContracts(root), fixture.name).not.toContainEqual(
          expectedFinding,
        );
      } else {
        expect(auditSkillContracts(root), fixture.name).toContainEqual(
          expectedFinding,
        );
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
      "research-preparation is missing .agents/skills/research-preparation/SKILL.md.",
      "research-content-changes is missing .agents/skills/research-content-changes/SKILL.md.",
    ]);
  });
});

describe("cleanup capability wording and routing", () => {
  it("accepts equivalent cleanup wording routed through an existing policy reference", async () => {
    const root = await mkdtemp(join(tmpdir(), "ends-means-skills-"));
    await copySkillCorpus(root);
    const reference = join(
      root,
      ".agents/skills/coordinate-project-delivery/references/review-and-integration.md",
    );
    const policy = join(
      root,
      ".agents/skills/coordinate-project-delivery/references/delivery-policy.md",
    );
    const review = await readFile(reference, "utf8");
    const boundary = review.indexOf("## Post-merge cleanup");
    expect(boundary).toBeGreaterThan(0);
    const routed = review
      .slice(boundary)
      .replace(
        "rebase merge rewrites commit\n   IDs",
        "rebasing changes commit identifiers",
      )
      .replace(
        "registered worktrees, standalone review clones, and exported review copies",
        "registered worktrees, independent review clones and exported source copies",
      )
      .replace(
        "retry normal removal; do not use blind forced removal",
        "repeat ordinary removal; never force unreviewed deletion",
      );
    expect(routed).toContain("rebasing changes commit identifiers");
    await writeFile(
      reference,
      review.slice(0, boundary) +
        "See [post-merge cleanup](delivery-policy.md#post-merge-cleanup).\n",
    );
    await writeFile(policy, `${await readFile(policy, "utf8")}\n${routed}`);
    expect(auditSkillContracts(root)).toEqual([]);
    await writeFile(
      policy,
      (await readFile(policy, "utf8")).replace(
        "rebasing changes commit identifiers",
        "mapping safeguard removed",
      ),
    );
    expect(auditSkillContracts(root)).toContainEqual({
      code: "SKILL_CAPABILITY",
      message: "coordinate-project-delivery does not cover post-merge cleanup.",
    });
  });
});

describe("research brief capability audit", () => {
  it("audits stable structure without fixing editorial sentences", async () => {
    const root = await mkdtemp(join(tmpdir(), "ends-means-skills-"));
    await copySkillCorpus(root);
    const preparationPath = join(
      root,
      ".agents/skills/research-preparation/SKILL.md",
    );
    const original = await readFile(preparationPath, "utf8");
    await writeFile(
      preparationPath,
      original
        .replace(
          "Prepare a bounded, implementation-ready research brief",
          "Create a scoped research handoff",
        )
        .replace(
          "Research preparation does not require a worktree",
          "A worktree is unnecessary for research preparation",
        ),
    );
    const examplesPath = join(
      root,
      ".agents/skills/research-preparation/references/examples.md",
    );
    const examples = await readFile(examplesPath, "utf8");
    const paraphrasedExamples = examples.replace(
      "keep the dependent claim out\nof the evidence-complete set",
      "exclude the dependent claim from evidence-complete claims",
    );
    expect(paraphrasedExamples).not.toBe(examples);
    await writeFile(examplesPath, paraphrasedExamples);
    expect(auditSkillContracts(root)).toEqual([]);
  });

  it("rejects an evidence-complete disposition for the inaccessible example", async () => {
    const root = await mkdtemp(join(tmpdir(), "ends-means-skills-"));
    await copySkillCorpus(root);
    const examplesPath = join(
      root,
      ".agents/skills/research-preparation/references/examples.md",
    );
    const examples = await readFile(examplesPath, "utf8");
    await writeFile(
      examplesPath,
      examples.replace(
        "research-brief-example:inaccessible-source disposition:needs-evidence",
        "research-brief-example:inaccessible-source disposition:ready",
      ),
    );
    expect(auditSkillContracts(root)).toContainEqual({
      code: "SKILL_CAPABILITY",
      message: "research-preparation does not cover research brief structure.",
    });
  });

  it("rejects removal of an implementation handoff obligation", async () => {
    const root = await mkdtemp(join(tmpdir(), "ends-means-skills-"));
    await copySkillCorpus(root);
    const consumerPath = join(
      root,
      ".agents/skills/research-content-changes/SKILL.md",
    );
    const consumer = await readFile(consumerPath, "utf8");
    await writeFile(
      consumerPath,
      consumer.replace("<!-- research-handoff:inspect-used-passages -->", ""),
    );
    expect(auditSkillContracts(root)).toContainEqual({
      code: "SKILL_CAPABILITY",
      message:
        "research-content-changes does not cover research handoff consumption.",
    });
  });
});
