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
  forbiddenPatterns?: RegExp[];
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
    name: "research review delivery",
    owner: "research-content-changes",
    paths: [`${researchRoot}/SKILL.md`],
    patterns: [
      /completed, verified work.+ready\s+pull request.+default/is,
      /draft only when substantial work remains.+either.+explicitly experimental.+or.+deliberate early-feedback/is,
      /issue `In progress`.+marked ready/is,
      /stacked pull requests only for genuine dependency chains/i,
      /bottom-up.+rebase-only linear history/is,
      /exact-head evidence.+automatic rebase.+retargeting/is,
    ],
    forbiddenPatterns: [
      /Push and open a draft pull request when authorized/i,
      /\b(?:open|create|submit|push|start)\b[^.\n]{0,100}\b(?:draft pull requests?|pull requests? as drafts?)\b[^.\n]{0,40}\b(?:by default|as the default|normally)\b/i,
      /\bpull requests?\b[^.\n]{0,40}\b(?:are|should be|must be)\b[^.\n]{0,20}\bdrafts?\b[^.\n]{0,40}\b(?:by default|as the default|normally)\b/i,
      /\bdefault\b[^.\n]{0,100}\bpull requests?\b[^.\n]{0,30}\b(?:to|as)\b[^.\n]{0,10}\bdrafts?\b/i,
    ],
    deletion: {
      path: `${researchRoot}/SKILL.md`,
      pattern: /stacked pull requests only for genuine dependency chains/i,
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
      pattern: /plagiarism|source[-\s]similarity/i,
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

function containsUnnegatedMatch(text: string, pattern: RegExp): boolean {
  return text.split(/[.\n]+/).some((sentence) => {
    const matcher = new RegExp(
      pattern.source,
      pattern.flags.includes("g") ? pattern.flags : `${pattern.flags}g`,
    );
    return [...sentence.matchAll(matcher)].some((match) => {
      const prefix = sentence.slice(0, match.index);
      return !/\b(?:never|do not|don't|must not|should not|cannot|can't)\s*$/i.test(
        prefix,
      );
    });
  });
}

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
    const coversRequired = capability.patterns.every((pattern) =>
      pattern.test(corpus),
    );
    const containsForbidden = capability.forbiddenPatterns?.some((pattern) =>
      containsUnnegatedMatch(corpus, pattern),
    );
    return coversRequired && !containsForbidden
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
