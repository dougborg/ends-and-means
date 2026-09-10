import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

export interface SkillContractFinding {
  code: string;
  message: string;
}

export interface SkillCapability {
  name: string;
  owner:
    | "coordinate-project-delivery"
    | "research-preparation"
    | "research-content-changes";
  paths: string[];
  patterns: RegExp[];
  forbiddenPatterns?: RegExp[];
  deletion: { path: string; pattern: RegExp };
}

const deliveryRoot = ".agents/skills/coordinate-project-delivery";
const preparationRoot = ".agents/skills/research-preparation";
const researchRoot = ".agents/skills/research-content-changes";

export const researchBriefContract = {
  version: 1,
  sectionIds: [
    "reader-outcome",
    "scope-boundaries",
    "existing-records-dependencies",
    "evidence-ledger",
    "candidate-claims",
    "disagreements-comparisons",
    "cases-narrative-visuals",
    "gaps-disposition",
    "implementation-acceptance",
  ],
  evidenceStates: ["inspected", "lead", "inaccessible"],
  dispositions: ["ready", "needs-evidence", "deferred"],
  scales: ["substantial", "short-correction"],
  consumerObligationIds: [
    "brief-not-evidence",
    "preserve-scope",
    "inspect-used-passages",
    "targeted-follow-up",
    "independent-review",
  ],
} as const;

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
    name: "post-merge cleanup",
    owner: "coordinate-project-delivery",
    paths: [
      `${deliveryRoot}/SKILL.md`,
      `${deliveryRoot}/references/delivery-policy.md`,
      `${deliveryRoot}/references/review-and-integration.md`,
    ],
    patterns: [
      /post-merge cleanup/i,
      /rebase merge rewrites commit/i,
      /registered worktrees, standalone review clones, and exported review copies/i,
      /processes and listeners before removing/i,
      /dependency links both inside each candidate/i,
      /review evidence and any useful recovery history/i,
      /retry normal removal; do not use blind forced removal/i,
      /preserve a dirty or/i,
      /git worktree list --porcelain/i,
      /only after these checks/i,
      /reconcile the final Project `Done` state/i,
      /shared\/global package and browser caches/i,
    ],
    deletion: {
      path: `${deliveryRoot}/references/review-and-integration.md`,
      pattern: /rebase merge rewrites commit/i,
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
    name: "research preparation routing",
    owner: "research-preparation",
    paths: [
      `${preparationRoot}/SKILL.md`,
      `${preparationRoot}/references/research-brief-template.md`,
      `${preparationRoot}/references/examples.md`,
    ],
    patterns: [
      /references\/research-brief-template\.md/i,
      /research-content-changes\/references\/editorial-policy\.md/i,
    ],
    deletion: {
      path: `${preparationRoot}/SKILL.md`,
      pattern: /references\/research-brief-template\.md/i,
    },
  },
  {
    name: "research handoff consumption",
    owner: "research-content-changes",
    paths: [`${researchRoot}/SKILL.md`],
    patterns: [
      /research-preparation\/references\/research-brief-template\.md/i,
      /research-brief:v1/i,
    ],
    deletion: {
      path: `${researchRoot}/SKILL.md`,
      pattern: /research-preparation\/references\/research-brief-template\.md/i,
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

function researchBriefStructureFindings(root: string): SkillContractFinding[] {
  const templatePath = join(
    root,
    preparationRoot,
    "references/research-brief-template.md",
  );
  const examplesPath = join(root, preparationRoot, "references/examples.md");
  const consumerPath = join(root, researchRoot, "SKILL.md");
  if (
    !existsSync(templatePath) ||
    !existsSync(examplesPath) ||
    !existsSync(consumerPath)
  )
    return [];

  const template = readFileSync(templatePath, "utf8");
  const examples = readFileSync(examplesPath, "utf8");
  const consumer = readFileSync(consumerPath, "utf8");
  const requiredMarkers = [
    `research-brief:v${researchBriefContract.version}`,
    ...researchBriefContract.sectionIds.map(
      (section) => `research-brief-section:${section}`,
    ),
  ];
  const missingMarker = requiredMarkers.some(
    (marker) => !template.includes(marker),
  );
  const missingValue = [
    ...researchBriefContract.evidenceStates,
    ...researchBriefContract.dispositions,
    ...researchBriefContract.scales,
  ].some((value) => !template.includes(`\`${value}\``));
  const invalidExamples =
    !examples.includes("research-brief-example:short-correction") ||
    !examples.includes(
      "research-brief-example:inaccessible-source disposition:needs-evidence",
    );
  const missingConsumerObligation =
    researchBriefContract.consumerObligationIds.some(
      (obligation) => !consumer.includes(`research-handoff:${obligation}`),
    );

  const findings: SkillContractFinding[] = [];
  if (missingMarker || missingValue || invalidExamples)
    findings.push({
      code: "SKILL_CAPABILITY",
      message: "research-preparation does not cover research brief structure.",
    });
  if (missingConsumerObligation)
    findings.push({
      code: "SKILL_CAPABILITY",
      message:
        "research-content-changes does not cover research handoff consumption.",
    });
  return findings;
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
  return [
    ...missingFindings,
    ...capabilityFindings,
    ...researchBriefStructureFindings(root),
  ];
}
