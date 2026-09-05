import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

export interface RepositoryDeliveryFinding {
  code: string;
  message: string;
}

export function auditRepositoryDelivery(root: string): RepositoryDeliveryFinding[] {
  const findings: RepositoryDeliveryFinding[] = [];
  const read = (path: string) => readFileSync(join(root, path), "utf8");
  const workflows = readdirSync(join(root, ".github/workflows")).filter((file) => file.endsWith(".yml"));
  const workflowText = workflows.map((file) => read(`.github/workflows/${file}`)).join("\n");
  const actionText = read(".github/actions/verify/action.yml");
  const automationText = `${workflowText}\n${actionText}`;
  const packageJson = JSON.parse(read("package.json")) as { packageManager?: string; scripts?: Record<string, string> };
  const requireRule = (condition: boolean, code: string, message: string) => {
    if (!condition) findings.push({ code, message });
  };

  requireRule(packageJson.packageManager?.startsWith("pnpm@") ?? false, "PNPM_MANAGER", "packageManager must pin pnpm.");
  requireRule(existsSync(join(root, "pnpm-lock.yaml")), "PNPM_LOCK", "pnpm-lock.yaml is required.");
  requireRule(
    packageJson.scripts?.verify ===
      "pnpm audit:delivery -- --repository-only && pnpm lint && pnpm static && pnpm audit --audit-level=moderate && pnpm check && pnpm test:coverage && pnpm build && pnpm test:routes && pnpm test:visual",
    "VERIFY_PATH",
    "pnpm verify must remain the single full local/CI verification path.",
  );
  requireRule((actionText.match(/run: pnpm verify/g) ?? []).length === 1, "VERIFY_OWNER", "The shared verify action must own exactly one pnpm verify invocation.");
  requireRule(
    !actionText.match(/run: pnpm (?:lint|static|audit |check|test:coverage|build|test:routes|test:visual)/),
    "VERIFY_DUPLICATE",
    "Composite action must not duplicate commands owned by pnpm verify.",
  );
  requireRule(!workflowText.includes("pull_request_target:"), "FORK_SAFETY", "pull_request_target is prohibited.");
  const externalUses = [...automationText.matchAll(/uses:\s+([^\s#]+)/g)]
    .flatMap((match) => (match[1] ? [match[1]] : []))
    .filter((use) => !use.startsWith("$/") && !use.startsWith("./"));
  requireRule(
    externalUses.every((use) => /@[0-9a-f]{40}$/.test(use)),
    "ACTION_PIN",
    "External actions must use full immutable SHAs.",
  );
  requireRule(workflowText.includes("permissions: {}") && workflowText.includes("contents: read"), "WORKFLOW_PERMISSIONS", "Workflows must default to no or read-only permissions.");
  requireRule(actionText.includes("persist-credentials: false"), "CHECKOUT_CREDENTIALS", "Checkout credentials must not persist.");
  for (const name of ["verify", "dependency-review", "codeql", "workflow-analysis"]) {
    requireRule(new RegExp(`^  ${name}:`, "m").test(workflowText), "REQUIRED_CHECK_NAME", `Stable required check ${name} is missing.`);
  }
  requireRule(actionText.includes("cache: pnpm"), "PNPM_CACHE", "Node setup must use the pnpm lockfile-backed cache.");
  requireRule(actionText.includes("pnpm install --frozen-lockfile"), "FROZEN_INSTALL", "CI must use a frozen pnpm install.");
  requireRule(read(".github/workflows/pages.yml").includes("needs: build-and-verify"), "PAGES_ARTIFACT", "Pages deploy must consume a verified build artifact.");
  return findings;
}
