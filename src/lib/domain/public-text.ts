import type { PublicationStatus } from "./common";

const workflowPatterns = [
  {
    name: "repository issue or pull request",
    pattern:
      /(?:\bpull request\b|\b(?:issue|pr)\s*#?\d+\b|github\.com\/[^\s/]+\/[^\s/]+\/(?:issues|pull)\/\d+)/iu,
  },
  {
    name: "repository branch",
    pattern:
      /\b(?:chore|content|dependabot|docs|feature|fix|refactor|research)\/[a-z0-9._/-]+\b/iu,
  },
  {
    name: "migration or draft state",
    pattern:
      /\b(?:content migration|first canonical slice|migration status|research draft|transitional (?:content|material|page|site|state|status)|working (?:tree|branch|material)|work in progress)\b/iu,
  },
  {
    name: "internal canonical-model narration",
    pattern: /\bcanonical (?:catalogue|graph|model|sources)\b/iu,
  },
] as const;

export function workflowReferencesIn(value: string): string[] {
  return workflowPatterns
    .filter(({ pattern }) => pattern.test(value))
    .map(({ name }) => name);
}

export function claimPublicationLabel(status: PublicationStatus): string {
  return {
    deprecated: "Claim deprecated",
    "in-review": "Claim in review",
    published: "Claim published",
    "research-needed": "Research needed",
    reviewed: "Claim reviewed",
  }[status];
}
