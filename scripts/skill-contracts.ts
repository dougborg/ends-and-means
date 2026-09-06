import { existsSync, readFileSync } from "node:fs";
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
  deletion: { path: string; pattern: RegExp };
}

const deliveryRoot = ".agents/skills/coordinate-project-delivery";
const researchRoot = ".agents/skills/research-content-changes";

export const skillCapabilities: SkillCapability[] = [
  {
    name: "isolated ownership",
    owner: "coordinate-project-delivery",
    paths: [`${deliveryRoot}/SKILL.md`],
    patterns: [/isolated worktree/i, /one owner|named owner/i],
    deletion: {
      path: `${deliveryRoot}/SKILL.md`,
      pattern: /isolated worktree/i,
    },
  },
  {
    name: "board flow",
    owner: "coordinate-project-delivery",
    paths: [
      `${deliveryRoot}/SKILL.md`,
      `${deliveryRoot}/references/delivery-policy.md`,
    ],
    patterns: [/three to five/i, /In progress/i, /In review/i, /Blocked/i],
    deletion: {
      path: `${deliveryRoot}/references/delivery-policy.md`,
      pattern: /three to five/i,
    },
  },
  {
    name: "review",
    owner: "coordinate-project-delivery",
    paths: [
      `${deliveryRoot}/SKILL.md`,
      `${deliveryRoot}/references/review-and-integration.md`,
    ],
    patterns: [
      /Copilot/i,
      /independent adversarial review/i,
      /privacy-safe exact-head/i,
      /process.+gate/is,
    ],
    deletion: {
      path: `${deliveryRoot}/references/review-and-integration.md`,
      pattern: /independent adversarial review/i,
    },
  },
  {
    name: "integration",
    owner: "coordinate-project-delivery",
    paths: [
      `${deliveryRoot}/SKILL.md`,
      `${deliveryRoot}/references/review-and-integration.md`,
    ],
    patterns: [/rebase-only|rebase rather than squash/i, /linear history/i],
    deletion: {
      path: `${deliveryRoot}/references/review-and-integration.md`,
      pattern: /linear history/i,
    },
  },
  {
    name: "verification",
    owner: "coordinate-project-delivery",
    paths: [
      `${deliveryRoot}/SKILL.md`,
      `${deliveryRoot}/references/review-and-integration.md`,
    ],
    patterns: [/pnpm verify/i, /tests.+documentation.+skills/is],
    deletion: {
      path: `${deliveryRoot}/references/review-and-integration.md`,
      pattern: /pnpm verify/i,
    },
  },
  {
    name: "continuous improvement",
    owner: "coordinate-project-delivery",
    paths: [`${deliveryRoot}/SKILL.md`],
    patterns: [/continuous improvement/i, /focused issue/i],
    deletion: {
      path: `${deliveryRoot}/SKILL.md`,
      pattern: /continuous improvement/i,
    },
  },
  {
    name: "learner composition",
    owner: "research-content-changes",
    paths: [`${researchRoot}/SKILL.md`],
    patterns: [
      /Subject Guides?.+presentation compositions?/is,
      /progressive disclosure/i,
    ],
    deletion: {
      path: `${researchRoot}/SKILL.md`,
      pattern: /progressive disclosure/i,
    },
  },
  {
    name: "canonical publication",
    owner: "research-content-changes",
    paths: [`${researchRoot}/SKILL.md`],
    patterns: [
      /canonical-only|only publishable content source/i,
      /archive\/legacy-research/i,
    ],
    deletion: {
      path: `${researchRoot}/SKILL.md`,
      pattern: /canonical-only|only publishable content source/i,
    },
  },
  {
    name: "research evidence",
    owner: "research-content-changes",
    paths: [
      `${researchRoot}/SKILL.md`,
      `${researchRoot}/references/editorial-policy.md`,
    ],
    patterns: [/precise locators/i, /authoritative/i, /atomic Statements/i],
    deletion: {
      path: `${researchRoot}/SKILL.md`,
      pattern: /atomic Statements/i,
    },
  },
  {
    name: "narrative integrity",
    owner: "research-content-changes",
    paths: [
      `${researchRoot}/SKILL.md`,
      `${researchRoot}/references/editorial-policy.md`,
    ],
    patterns: [
      /plagiarism|source[- ]similarity/i,
      /counterfactual/i,
      /counterevidence|counterargument/i,
    ],
    deletion: {
      path: `${researchRoot}/SKILL.md`,
      pattern: /source similarity/i,
    },
  },
  {
    name: "bounded cases",
    owner: "research-content-changes",
    paths: [`${researchRoot}/SKILL.md`],
    patterns: [
      /bounded.+Case|Case.+bounded/is,
      /pure.+embodiment|pure realization/is,
    ],
    deletion: { path: `${researchRoot}/SKILL.md`, pattern: /pure embodiment/i },
  },
  {
    name: "diverse organization",
    owner: "research-content-changes",
    paths: [`${researchRoot}/SKILL.md`],
    patterns: [
      /Indigenous/i,
      /nomadic/i,
      /oral-history|oral history/i,
      /community/i,
    ],
    deletion: { path: `${researchRoot}/SKILL.md`, pattern: /oral-history/i },
  },
];

export function auditSkillContracts(root: string): SkillContractFinding[] {
  const missingPaths = new Map<string, SkillCapability["owner"]>();
  for (const capability of skillCapabilities) {
    for (const path of capability.paths)
      if (!existsSync(join(root, path)))
        missingPaths.set(path, capability.owner);
  }
  const missingFindings = [...missingPaths].map(([path, owner]) => ({
    code: "SKILL_FILE_MISSING",
    message: `${owner} is missing ${path}.`,
  }));
  const capabilityFindings = skillCapabilities.flatMap((capability) => {
    if (capability.paths.some((path) => missingPaths.has(path))) return [];
    const corpus = capability.paths
      .map((path) => readFileSync(join(root, path), "utf8"))
      .join("\n");
    return capability.patterns.every((pattern) => pattern.test(corpus))
      ? []
      : [
          {
            code: "SKILL_CAPABILITY",
            message: `${capability.owner} does not cover ${capability.name}.`,
          },
        ];
  });
  return [...missingFindings, ...capabilityFindings];
}
