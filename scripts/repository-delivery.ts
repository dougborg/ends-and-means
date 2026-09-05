import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { parse } from "yaml";

export interface RepositoryDeliveryFinding {
  code: string;
  message: string;
}

type Node = Record<string, unknown>;
const ownedCommands = ["pnpm lint", "pnpm static", "pnpm audit ", "pnpm check", "pnpm test:coverage", "pnpm build", "pnpm test:routes", "pnpm test:visual"];

function record(value: unknown): Node {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Node) : {};
}

function steps(job: unknown) {
  const value = record(job).steps;
  return Array.isArray(value) ? value.map(record) : [];
}

function hasTrigger(workflow: Node, trigger: string) {
  const value = workflow.on;
  if (typeof value === "string") return value === trigger;
  if (Array.isArray(value)) return value.includes(trigger);
  return Object.hasOwn(record(value), trigger);
}

function permissionWrites(value: unknown) {
  if (value === "write-all") return true;
  return Object.entries(record(value)).some(([, access]) => access === "write");
}

function parseYaml(path: string, findings: RepositoryDeliveryFinding[]) {
  try {
    return record(parse(readFileSync(path, "utf8")));
  } catch (error) {
    findings.push({ code: "YAML_INVALID", message: `${path}: ${error instanceof Error ? error.message : String(error)}` });
    return {};
  }
}

interface JobEntry {
  file: string;
  name: string;
  job: Node;
  workflow: Node;
}

interface StepEntry {
  file: string;
  name: string;
  step: Node;
}

function auditWorkflowPermissions(workflows: Map<string, Node>, allJobs: JobEntry[]) {
  const findings: RepositoryDeliveryFinding[] = [];
  for (const [file, workflow] of workflows) {
    if (hasTrigger(workflow, "pull_request_target")) findings.push({ code: "FORK_SAFETY", message: `${file} must not use pull_request_target.` });
    if (permissionWrites(workflow.permissions)) findings.push({ code: "WORKFLOW_PERMISSIONS", message: `${file} grants write permission to pull-request code at workflow scope.` });
    if (!hasTrigger(workflow, "pull_request")) continue;
    for (const { name, job } of allJobs.filter((candidate) => candidate.file === file)) {
      const writes = Object.entries(record(job.permissions)).filter(([, access]) => access === "write").map(([scope]) => scope);
      const allowed = ["codeql", "workflow-analysis"].includes(name) && writes.length === 1 && writes[0] === "security-events";
      if (writes.length && !allowed) findings.push({ code: "WORKFLOW_PERMISSIONS", message: `${file}:${name} grants write permission to pull-request code.` });
    }
  }
  return findings;
}

function auditActionPins(allSteps: StepEntry[]) {
  return allSteps.flatMap(({ file, name, step }): RepositoryDeliveryFinding[] => {
    if (typeof step.uses !== "string" || step.uses.startsWith("$/") || step.uses.startsWith("./")) return [];
    return /@[0-9a-f]{40}$/.test(step.uses)
      ? []
      : [{ code: "ACTION_PIN", message: `${file}:${name} uses a mutable action reference ${step.uses}.` }];
  });
}

function auditActionSetup(actionSteps: Node[]) {
  const findings: RepositoryDeliveryFinding[] = [];
  const checkout = actionSteps.find((step) => String(step.uses).startsWith("actions/checkout@"));
  const setupNode = actionSteps.find((step) => String(step.uses).startsWith("actions/setup-node@"));
  if (record(checkout?.with)["persist-credentials"] !== false) findings.push({ code: "CHECKOUT_CREDENTIALS", message: "Checkout credentials must not persist." });
  if (record(checkout?.with)["fetch-depth"] !== 0) findings.push({ code: "CURRENT_BASE_FETCH", message: "Verification checkout must fetch history for current-base and linear-history checks." });
  if (record(setupNode?.with).cache !== "pnpm") findings.push({ code: "PNPM_CACHE", message: "Node setup must use the pnpm lockfile-backed cache." });
  if (record(setupNode?.with)["cache-dependency-path"] !== "pnpm-lock.yaml") findings.push({ code: "PNPM_CACHE_KEY", message: "The pnpm cache key must derive from pnpm-lock.yaml." });
  if (!actionSteps.some((step) => step.run === "pnpm install --frozen-lockfile")) findings.push({ code: "FROZEN_INSTALL", message: "CI must use a frozen pnpm install." });
  return findings;
}

export function auditRepositoryDelivery(root: string): RepositoryDeliveryFinding[] {
  const findings: RepositoryDeliveryFinding[] = [];
  const requireRule = (condition: boolean, code: string, message: string) => {
    if (!condition) findings.push({ code, message });
  };
  const workflowFiles = readdirSync(join(root, ".github/workflows")).filter((file) => file.endsWith(".yml"));
  const workflows = new Map(workflowFiles.map((file) => [file, parseYaml(join(root, ".github/workflows", file), findings)]));
  const verifyAction = parseYaml(join(root, ".github/actions/verify/action.yml"), findings);
  const packageJson = JSON.parse(readFileSync(join(root, "package.json"), "utf8")) as { packageManager?: string; scripts?: Record<string, string> };

  requireRule(packageJson.packageManager?.startsWith("pnpm@") ?? false, "PNPM_MANAGER", "packageManager must pin pnpm.");
  requireRule(existsSync(join(root, "pnpm-lock.yaml")), "PNPM_LOCK", "pnpm-lock.yaml is required.");
  requireRule(
    packageJson.scripts?.verify ===
      "pnpm audit:delivery -- --repository-only && pnpm lint && pnpm static && pnpm audit --audit-level=moderate && pnpm check && pnpm test:coverage && pnpm build && pnpm test:routes && pnpm test:visual",
    "VERIFY_PATH",
    "pnpm verify must remain the single full local/CI verification path.",
  );

  const allJobs = [...workflows.entries()].flatMap(([file, workflow]) =>
    Object.entries(record(workflow.jobs)).map(([name, job]) => ({ file, name, job: record(job), workflow })),
  );
  const allSteps = [...allJobs.flatMap(({ file, name, job }) => steps(job).map((step) => ({ file, name, step }))), ...steps(record(verifyAction.runs)).map((step) => ({ file: ".github/actions/verify/action.yml", name: "composite", step }))];

  const verifyRuns = allSteps.filter(({ step }) => step.run === "pnpm verify");
  requireRule(verifyRuns.length === 1 && verifyRuns[0]?.file === ".github/actions/verify/action.yml", "VERIFY_OWNER", "The shared verify action must own exactly one pnpm verify invocation.");
  const duplicateCommands = allSteps.filter(({ step }) => typeof step.run === "string" && ownedCommands.some((command) => (step.run as string).startsWith(command)));
  requireRule(duplicateCommands.length === 0, "VERIFY_DUPLICATE", "Workflow steps must not duplicate commands owned by pnpm verify.");

  findings.push(...auditWorkflowPermissions(workflows, allJobs), ...auditActionPins(allSteps));

  const jobNames = allJobs.map(({ name }) => name);
  for (const name of ["verify", "dependency-review", "codeql", "workflow-analysis"]) {
    requireRule(jobNames.filter((candidate) => candidate === name).length === 1, "REQUIRED_CHECK_NAME", `Stable required job ${name} must exist exactly once.`);
  }

  const actionSteps = steps(record(verifyAction.runs));
  findings.push(...auditActionSetup(actionSteps));

  const pages = workflows.get("pages.yml") ?? {};
  const pagesJobs = record(pages.jobs);
  requireRule(record(pagesJobs.deploy).needs === "build-and-verify", "PAGES_ARTIFACT", "Pages deploy must depend on the verified build job.");
  requireRule(record(record(pagesJobs.deploy).permissions).pages === "write" && record(record(pagesJobs.deploy).permissions)["id-token"] === "write", "PAGES_PERMISSIONS", "Only Pages deploy should receive Pages and OIDC write permissions.");
  const artifactNames = allSteps.flatMap(({ step }) => (String(step.uses).startsWith("actions/upload-artifact@") ? [record(step.with).name] : []));
  requireRule(artifactNames.every((name) => typeof name === "string" && !name.includes("${{")), "ARTIFACT_NAME", "Artifact names must be deterministic.");
  return findings;
}
