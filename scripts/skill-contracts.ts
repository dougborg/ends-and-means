import { readFileSync } from "node:fs";
import { join } from "node:path";

export interface SkillContractFinding {
  code: string;
  message: string;
}

interface Capability {
  name: string;
  patterns: RegExp[];
}

const capabilities: Capability[] = [
  { name: "isolated ownership", patterns: [/isolated worktree/i, /one owner|named owner/i] },
  { name: "board flow", patterns: [/three to five/i, /In progress/i, /In review/i, /Blocked/i] },
  { name: "learner composition", patterns: [/Subject Guides?.+presentation composition/is, /progressive disclosure/i] },
  { name: "canonical publication", patterns: [/canonical-only|sole publishable content source/i, /archive\/legacy-research/i] },
  { name: "research evidence", patterns: [/precise locators/i, /authoritative/i, /atomic Statements/i] },
  { name: "narrative integrity", patterns: [/plagiarism|source-similarity/i, /counterfactual/i, /counterevidence|counterargument/i] },
  { name: "bounded cases", patterns: [/Case.+bounded/is, /pure.+embodiment/is] },
  { name: "diverse organization", patterns: [/Indigenous/i, /nomadic/i, /oral-history|oral history/i, /community/i] },
  { name: "review", patterns: [/Copilot/i, /independent adversarial review/i, /process.+gate/is] },
  { name: "integration", patterns: [/rebase-only|rebase rather than squash/i, /linear history/i] },
  { name: "verification", patterns: [/pnpm verify/i, /tests.+documentation.+skills/is] },
  { name: "continuous improvement", patterns: [/continuous improvement/i, /focused issue/i] },
];

export function auditSkillContracts(root: string): SkillContractFinding[] {
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
  const corpus = paths.map((path) => readFileSync(join(root, path), "utf8")).join("\n");
  return capabilities.flatMap((capability) =>
    capability.patterns.every((pattern) => pattern.test(corpus))
      ? []
      : [{ code: "SKILL_CAPABILITY", message: `Repository skills and guidance do not cover ${capability.name}.` }],
  );
}
