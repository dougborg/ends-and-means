import { readFileSync } from "node:fs";
import { join } from "node:path";

export interface SkillContractFinding {
  code: string;
  message: string;
}

export interface SkillCapability {
  name: string;
  owner: "coordinate-project-delivery" | "research-content-changes";
  paths: string[];
  patterns: RegExp[];
}

const deliveryRoot = ".agents/skills/coordinate-project-delivery";
const researchRoot = ".agents/skills/research-content-changes";

export const skillCapabilities: SkillCapability[] = [
  { name: "isolated ownership", owner: "coordinate-project-delivery", paths: [`${deliveryRoot}/SKILL.md`], patterns: [/isolated worktree/i, /one owner|named owner/i] },
  { name: "board flow", owner: "coordinate-project-delivery", paths: [`${deliveryRoot}/SKILL.md`, `${deliveryRoot}/references/delivery-policy.md`], patterns: [/three to five/i, /In progress/i, /In review/i, /Blocked/i] },
  { name: "review", owner: "coordinate-project-delivery", paths: [`${deliveryRoot}/SKILL.md`, `${deliveryRoot}/references/review-and-integration.md`], patterns: [/Copilot/i, /independent adversarial review/i, /process.+gate/is] },
  { name: "integration", owner: "coordinate-project-delivery", paths: [`${deliveryRoot}/SKILL.md`, `${deliveryRoot}/references/review-and-integration.md`], patterns: [/rebase-only|rebase rather than squash/i, /linear history/i] },
  { name: "verification", owner: "coordinate-project-delivery", paths: [`${deliveryRoot}/SKILL.md`, `${deliveryRoot}/references/review-and-integration.md`], patterns: [/pnpm verify/i, /tests.+documentation.+skills/is] },
  { name: "continuous improvement", owner: "coordinate-project-delivery", paths: [`${deliveryRoot}/SKILL.md`], patterns: [/continuous improvement/i, /focused issue/i] },
  { name: "learner composition", owner: "research-content-changes", paths: [`${researchRoot}/SKILL.md`], patterns: [/Subject Guides?.+presentation compositions?/is, /progressive disclosure/i] },
  { name: "canonical publication", owner: "research-content-changes", paths: [`${researchRoot}/SKILL.md`], patterns: [/canonical-only|only publishable content source/i, /archive\/legacy-research/i] },
  { name: "research evidence", owner: "research-content-changes", paths: [`${researchRoot}/SKILL.md`, `${researchRoot}/references/editorial-policy.md`], patterns: [/precise locators/i, /authoritative/i, /atomic Statements/i] },
  { name: "narrative integrity", owner: "research-content-changes", paths: [`${researchRoot}/SKILL.md`, `${researchRoot}/references/editorial-policy.md`], patterns: [/plagiarism|source[- ]similarity/i, /counterfactual/i, /counterevidence|counterargument/i] },
  { name: "bounded cases", owner: "research-content-changes", paths: [`${researchRoot}/SKILL.md`], patterns: [/bounded.+Case|Case.+bounded/is, /pure.+embodiment|pure realization/is] },
  { name: "diverse organization", owner: "research-content-changes", paths: [`${researchRoot}/SKILL.md`], patterns: [/Indigenous/i, /nomadic/i, /oral-history|oral history/i, /community/i] },
];

export function auditSkillContracts(root: string): SkillContractFinding[] {
  return skillCapabilities.flatMap((capability) => {
    const corpus = capability.paths.map((path) => readFileSync(join(root, path), "utf8")).join("\n");
    return capability.patterns.every((pattern) => pattern.test(corpus))
      ? []
      : [{ code: "SKILL_CAPABILITY", message: `${capability.owner} does not cover ${capability.name}.` }];
  });
}
