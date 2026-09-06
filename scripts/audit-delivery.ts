import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { z } from "zod";
import {
  auditDeliverySnapshot,
  deliverySnapshotSchema,
  githubComparePath,
  reviewEvidenceForHead,
  type DeliveryItem,
  type DeliverySnapshot,
} from "./delivery-state.ts";

const projectViewSchema = z.object({ number: z.number().int().positive(), title: z.string().min(1), public: z.boolean() }).passthrough();
const projectItemSchema = z
  .object({
    content: z.object({ number: z.number().int().positive(), title: z.string().min(1), type: z.enum(["Issue", "PullRequest"]) }).passthrough(),
    labels: z.array(z.string()).optional(),
    priority: z.enum(["Now", "Next", "Later"]).optional(),
    status: z.enum(["Backlog", "Ready", "In progress", "In review", "Blocked", "Done"]),
    workstream: z.enum(["Corpus", "Reader experience", "Platform/process"]).optional(),
    "linked pull requests": z.array(z.string().url()).optional(),
  })
  .passthrough();
const projectListSchema = z.object({ items: z.array(projectItemSchema) }).passthrough();
const issueViewSchema = z
  .object({
    state: z.enum(["OPEN", "CLOSED", "MERGED"]),
    updatedAt: z.string().datetime({ offset: true }),
    body: z.string(),
    comments: z.array(z.object({ body: z.string() }).passthrough()),
  })
  .passthrough();
const commitOidSchema = z.string().regex(/^[0-9a-f]{40}$/);
const actorSchema = z.object({ login: z.string().min(1) }).passthrough();
const prViewSchema = z
  .object({
    state: z.enum(["OPEN", "CLOSED", "MERGED"]),
    headRefName: z.string().min(1),
    headRefOid: commitOidSchema,
    author: actorSchema,
    reviews: z.array(z.object({ author: actorSchema, commit: z.object({ oid: commitOidSchema }), body: z.string().nullable().optional() }).passthrough()),
    comments: z.array(z.object({ author: actorSchema, body: z.string() }).passthrough()),
  })
  .passthrough();
const compareSchema = z.object({ merge_base_commit: z.object({ sha: z.string().min(1) }), commits: z.array(z.object({ parents: z.array(z.unknown()) }).passthrough()) }).passthrough();
const labelsSchema = z.array(z.object({ name: z.string().min(1) }).passthrough());

class InputInvalidError extends Error {}
class ApiUnavailableError extends Error {}
const repository = "dougborg/ends-and-means";

function gh(args: string[]) {
  try {
    return execFileSync("gh", args, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
  } catch (error) {
    const commandError = error as Error & { code?: string; stderr?: string | Buffer };
    const stderr = String(commandError.stderr ?? "").trim();
    const detail = stderr || commandError.message || String(error);
    if (commandError.code === "ENOENT" || /auth login|not logged into|authentication required|error connecting|could not resolve|failed to connect/i.test(detail)) {
      throw new ApiUnavailableError(detail);
    }
    throw new Error(`gh ${args[0] ?? "command"} failed: ${detail}`);
  }
}

function parseJson<T>(raw: string, schema: z.ZodType<T>, source: string): T {
  try {
    return parseInput(JSON.parse(raw), schema, source);
  } catch (error) {
    if (error instanceof InputInvalidError) throw error;
    throw new InputInvalidError(`${source}: ${error instanceof Error ? error.message : String(error)}`);
  }
}

function parseInput<T>(value: unknown, schema: z.ZodType<T>, source: string): T {
  try {
    return schema.parse(value);
  } catch (error) {
    throw new InputInvalidError(`${source}: ${error instanceof Error ? error.message : String(error)}`);
  }
}

function ownershipFrom(comments: Array<{ body: string }>) {
  for (const { body } of comments.toReversed()) {
    const match = body.match(/worktree `([^`]+)` on branch `([^`]+)`\. Ownership: ([^;\n.]+)/i);
    if (match?.[1] && match[2] && match[3]) return { worktree: match[1], branch: match[2], owner: match[3].trim() };
  }
  return undefined;
}

function branchEvidence(branch: string) {
  const comparison = parseJson(gh(["api", githubComparePath("main", branch)]), compareSchema, `branch ${branch}`);
  const main = parseJson(gh(["api", "repos/dougborg/ends-and-means/git/ref/heads/main"]), z.object({ object: z.object({ sha: z.string() }) }), "main ref");
  return {
    baseCurrent: comparison.merge_base_commit.sha === main.object.sha,
    historyLinear: comparison.commits.every((commit) => commit.parents.length === 1),
  };
}

function prEvidence(url: string, analyzeBranch: boolean, implementationOwner: string | undefined) {
  const pr = parseJson(
    gh(["pr", "view", url, "--repo", repository, "--json", "state,headRefName,headRefOid,author,reviews,comments"]),
    prViewSchema,
    `pull request ${url}`,
  );
  const comparison = analyzeBranch ? branchEvidence(pr.headRefName) : undefined;
  return {
    state: pr.state,
    baseCurrent: comparison?.baseCurrent,
    historyLinear: comparison?.historyLinear,
    reviewEvidence: reviewEvidenceForHead(pr.headRefOid, implementationOwner, pr.reviews, pr.comments),
  };
}

function loadLiveItem(item: z.infer<typeof projectItemSchema>): DeliveryItem {
  const issue = parseJson(
    gh(["issue", "view", String(item.content.number), "--repo", repository, "--json", "state,updatedAt,body,comments"]),
    issueViewSchema,
    `issue #${item.content.number}`,
  );
  const ownership = ownershipFrom(issue.comments);
  const links = item["linked pull requests"] ?? [];
  const prs = links.map((url) => prEvidence(url, item.status === "In review", ownership?.owner));
  const branch = item.status === "In progress" && ownership ? branchEvidence(ownership.branch) : undefined;
  return {
    number: item.content.number,
    title: item.content.title,
    type: item.content.type,
    state: issue.state,
    status: item.status,
    workstream: item.workstream,
    priority: item.priority,
    labels: item.labels ?? [],
    body: issue.body,
    updatedAt: issue.updatedAt,
    linkedPullRequestStates: prs.map((pr) => pr.state),
    ownership,
    baseCurrent: prs[0]?.baseCurrent ?? branch?.baseCurrent,
    historyLinear: prs[0]?.historyLinear ?? branch?.historyLinear,
    reviewEvidence: prs[0]?.reviewEvidence,
  };
}

function loadLiveSnapshot(): DeliverySnapshot {
  const project = parseJson(gh(["project", "view", "7", "--owner", "dougborg", "--format", "json"]), projectViewSchema, "project view");
  const list = parseJson(gh(["project", "item-list", "7", "--owner", "dougborg", "--format", "json", "--limit", "200"]), projectListSchema, "project items");
  const labels = parseJson(gh(["label", "list", "--repo", repository, "--limit", "200", "--json", "name"]), labelsSchema, "repository labels");
  return parseInput({
    project: { number: project.number, title: project.title, public: project.public },
    capturedAt: new Date().toISOString(),
    repositoryLabels: labels.map((label) => label.name),
    items: list.items.map(loadLiveItem),
  }, deliverySnapshotSchema, "normalized live Project snapshot");
}

function loadSnapshot(args: string[]) {
  const pathIndex = args.indexOf("--project-snapshot");
  const snapshotPath = args[pathIndex + 1];
  if (pathIndex >= 0 && !snapshotPath) throw new InputInvalidError("--project-snapshot requires a path.");
  if (pathIndex >= 0 && snapshotPath) {
    return parseJson(readFileSync(resolve(snapshotPath), "utf8"), deliverySnapshotSchema, snapshotPath);
  }
  if (args.includes("--live-project")) return loadLiveSnapshot();
  if (args.includes("--repository-only")) return undefined;
  throw new InputInvalidError("Expected --project-snapshot <path>, --live-project, or --repository-only.");
}

try {
  const snapshot = loadSnapshot(process.argv.slice(2));
  if (!snapshot) console.log("Project state: UNAVAILABLE (repository-only audit; no GitHub credentials requested)");
  else {
    const findings = auditDeliverySnapshot(snapshot);
    if (findings.length === 0) console.log(`Project #${snapshot.project.number}: clean (${snapshot.items.length} delivery items checked)`);
    else {
      for (const finding of findings) console.error(`${finding.code}: ${finding.message}`);
      process.exitCode = 1;
    }
  }
} catch (error) {
  if (error instanceof InputInvalidError) console.error(`Project state: INVALID (${error.message})`);
  else if (error instanceof ApiUnavailableError) console.error(`Project state: UNAVAILABLE (${error.message})`);
  else console.error(`Project state: ERROR (${error instanceof Error ? error.message : String(error)})`);
  process.exitCode = 2;
}
