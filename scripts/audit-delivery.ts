import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { z } from "zod";
import {
  commitOidSchema,
  compareSchema,
  mainRefSchema,
} from "./delivery-api-schema.ts";
import {
  auditDeliverySnapshot,
  type DeliveryItem,
  type DeliverySnapshot,
  deliverySnapshotSchema,
  githubComparePath,
  parseAgentPath,
  reviewEvidenceForHead,
  selectRelevantPullRequest,
} from "./delivery-state.ts";

const projectViewSchema = z
  .object({
    number: z.number().int().positive(),
    title: z.string().min(1),
    public: z.boolean(),
  })
  .passthrough();
const projectItemSchema = z
  .object({
    content: z
      .object({
        number: z.number().int().positive(),
        title: z.string().min(1),
        type: z.enum(["Issue", "PullRequest"]),
      })
      .passthrough(),
    labels: z.array(z.string()).optional(),
    priority: z.enum(["Now", "Next", "Later"]).optional(),
    status: z.enum([
      "Backlog",
      "Ready",
      "In progress",
      "In review",
      "Blocked",
      "Done",
    ]),
    workstream: z
      .enum(["Corpus", "Reader experience", "Platform/process"])
      .optional(),
    "linked pull requests": z.array(z.string().url()).optional(),
  })
  .passthrough();
const projectListSchema = z
  .object({ items: z.array(projectItemSchema) })
  .passthrough();
const issueViewSchema = z
  .object({
    state: z.enum(["OPEN", "CLOSED", "MERGED"]),
    updatedAt: z.string().datetime({ offset: true }),
    body: z.string(),
    comments: z.array(z.object({ body: z.string() }).passthrough()),
  })
  .passthrough();
const actorSchema = z.object({ login: z.string().min(1) }).passthrough();
const prViewSchema = z
  .object({
    state: z.enum(["OPEN", "CLOSED", "MERGED"]),
    headRefName: z.string().min(1),
    headRefOid: commitOidSchema,
    author: actorSchema,
    reviews: z.array(
      z
        .object({
          author: actorSchema,
          commit: z.object({ oid: commitOidSchema }),
          body: z.string().nullable().optional(),
        })
        .passthrough(),
    ),
    comments: z.array(
      z
        .object({
          author: actorSchema,
          authorAssociation: z.string().min(1),
          body: z.string(),
        })
        .passthrough(),
    ),
  })
  .passthrough();
const labelsSchema = z.array(
  z.object({ name: z.string().min(1) }).passthrough(),
);

class InputInvalidError extends Error {}
class ApiUnavailableError extends Error {}
const repository = "dougborg/ends-and-means";

function gh(args: string[]) {
  try {
    return execFileSync("gh", args, {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    });
  } catch (error) {
    const commandError = error as Error & {
      code?: string;
      stderr?: string | Buffer;
    };
    const stderr = String(commandError.stderr ?? "").trim();
    const detail = stderr || commandError.message || String(error);
    if (
      commandError.code === "ENOENT" ||
      /auth login|not logged into|authentication required|error connecting|could not resolve|failed to connect/i.test(
        detail,
      )
    ) {
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
    throw new InputInvalidError(
      `${source}: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

function parseInput<T>(
  value: unknown,
  schema: z.ZodType<T>,
  source: string,
): T {
  try {
    return schema.parse(value);
  } catch (error) {
    throw new InputInvalidError(
      `${source}: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

function ownershipFrom(comments: Array<{ body: string }>) {
  for (const { body } of comments.toReversed()) {
    const match = body.match(
      /worktree `([^`]+)` on branch `([^`]+)`\. Ownership: ([^;\n.]+)/i,
    );
    if (match?.[1] && match[2] && match[3]) {
      const owner = parseAgentPath(match[3].trim());
      if (owner) return { worktree: match[1], branch: match[2], owner };
    }
  }
  return undefined;
}

function branchEvidence(branch: string) {
  const comparison = parseJson(
    gh(["api", githubComparePath("main", branch)]),
    compareSchema,
    `branch ${branch}`,
  );
  const main = parseJson(
    gh(["api", "repos/dougborg/ends-and-means/git/ref/heads/main"]),
    mainRefSchema,
    "main ref",
  );
  return {
    baseCurrent: comparison.merge_base_commit.sha === main.object.sha,
    historyLinear: comparison.commits.every(
      (commit) => commit.parents.length === 1,
    ),
  };
}

function prEvidence(url: string) {
  const pr = parseJson(
    gh([
      "pr",
      "view",
      url,
      "--repo",
      repository,
      "--json",
      "state,headRefName,headRefOid,author,reviews,comments",
    ]),
    prViewSchema,
    `pull request ${url}`,
  );
  return {
    state: pr.state,
    headRefName: pr.headRefName,
    reviewEvidence: reviewEvidenceForHead(
      pr.headRefOid,
      pr.reviews,
      pr.comments,
    ),
  };
}

function loadLiveItem(item: z.infer<typeof projectItemSchema>): DeliveryItem {
  const issue = parseJson(
    gh([
      "issue",
      "view",
      String(item.content.number),
      "--repo",
      repository,
      "--json",
      "state,updatedAt,body,comments",
    ]),
    issueViewSchema,
    `issue #${item.content.number}`,
  );
  const ownership = ownershipFrom(issue.comments);
  const links = item["linked pull requests"] ?? [];
  const prs = links.map((url) => prEvidence(url));
  const relevantPr = selectRelevantPullRequest(prs);
  const reviewBranch =
    item.status === "In review" && relevantPr.selected
      ? branchEvidence(relevantPr.selected.headRefName)
      : undefined;
  const branch =
    item.status === "In progress" && ownership
      ? branchEvidence(ownership.branch)
      : undefined;
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
    linkedPullRequestAmbiguous: relevantPr.ambiguous,
    ownership,
    baseCurrent: reviewBranch?.baseCurrent ?? branch?.baseCurrent,
    historyLinear: reviewBranch?.historyLinear ?? branch?.historyLinear,
    reviewEvidence: relevantPr.selected?.reviewEvidence,
  };
}

function loadLiveSnapshot(): DeliverySnapshot {
  const project = parseJson(
    gh(["project", "view", "7", "--owner", "dougborg", "--format", "json"]),
    projectViewSchema,
    "project view",
  );
  const list = parseJson(
    gh([
      "project",
      "item-list",
      "7",
      "--owner",
      "dougborg",
      "--format",
      "json",
      "--limit",
      "200",
    ]),
    projectListSchema,
    "project items",
  );
  const labels = parseJson(
    gh([
      "label",
      "list",
      "--repo",
      repository,
      "--limit",
      "200",
      "--json",
      "name",
    ]),
    labelsSchema,
    "repository labels",
  );
  return parseInput(
    {
      project: {
        number: project.number,
        title: project.title,
        public: project.public,
      },
      capturedAt: new Date().toISOString(),
      repositoryLabels: labels.map((label) => label.name),
      items: list.items.map(loadLiveItem),
    },
    deliverySnapshotSchema,
    "normalized live Project snapshot",
  );
}

function loadSnapshot(args: string[]) {
  const normalizedArgs = args.filter((arg) => arg !== "--");
  const modes = new Set([
    "--project-snapshot",
    "--live-project",
    "--repository-only",
  ]);
  const unknown = normalizedArgs.filter(
    (arg) => arg.startsWith("-") && !modes.has(arg),
  );
  if (unknown.length)
    throw new InputInvalidError(`Unknown option: ${unknown[0]}.`);
  const selectedModes = normalizedArgs.filter((arg) => modes.has(arg));
  if (selectedModes.length !== 1)
    throw new InputInvalidError("Select exactly one project-state mode.");
  const mode = selectedModes[0];
  if (mode === "--project-snapshot") {
    const pathIndex = normalizedArgs.indexOf(mode);
    const snapshotPath = normalizedArgs[pathIndex + 1];
    if (
      !snapshotPath ||
      snapshotPath.startsWith("-") ||
      normalizedArgs.length !== 2
    )
      throw new InputInvalidError(
        "--project-snapshot requires exactly one path.",
      );
    return parseJson(
      readFileSync(resolve(snapshotPath), "utf8"),
      deliverySnapshotSchema,
      snapshotPath,
    );
  }
  if (normalizedArgs.length !== 1)
    throw new InputInvalidError(`Unexpected argument: ${normalizedArgs[1]}.`);
  return mode === "--live-project" ? loadLiveSnapshot() : undefined;
}

try {
  const snapshot = loadSnapshot(process.argv.slice(2));
  if (!snapshot)
    console.log(
      "Project state: UNAVAILABLE (repository-only audit; no GitHub credentials requested)",
    );
  else {
    const findings = auditDeliverySnapshot(snapshot);
    if (findings.length === 0)
      console.log(
        `Project #${snapshot.project.number}: clean (${snapshot.items.length} delivery items checked)`,
      );
    else {
      for (const finding of findings)
        console.error(`${finding.code}: ${finding.message}`);
      process.exitCode = 1;
    }
  }
} catch (error) {
  if (error instanceof InputInvalidError)
    console.error(`Project state: INVALID (${error.message})`);
  else if (error instanceof ApiUnavailableError)
    console.error(`Project state: UNAVAILABLE (${error.message})`);
  else
    console.error(
      `Project state: ERROR (${error instanceof Error ? error.message : String(error)})`,
    );
  process.exitCode = 2;
}
