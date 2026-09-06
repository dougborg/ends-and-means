import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { z } from "zod";
import {
  commitOidSchema,
  compareSchema,
  mainRefSchema,
} from "./delivery-api-schema.ts";
import { branchTargetForActiveItem } from "./delivery-live-evidence.ts";
import {
  assignmentForIssue,
  type PrivateDeliveryState,
  PrivateDeliveryStateUnavailableError,
  readPrivateDeliveryState,
} from "./delivery-private-state.ts";
import {
  auditDeliverySnapshot,
  type DeliveryItem,
  type DeliverySnapshot,
  deliverySnapshotSchema,
  githubComparePath,
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
  })
  .passthrough();
const actorSchema = z.object({ login: z.string().min(1) }).passthrough();
const prViewSchema = z
  .object({
    state: z.enum(["OPEN", "CLOSED", "MERGED"]),
    baseRefName: z.string().min(1),
    headRefName: z.string().min(1),
    headRefOid: commitOidSchema,
    isDraft: z.boolean(),
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

function branchEvidence(base: string, branch: string) {
  const comparison = parseJson(
    gh(["api", githubComparePath(base, branch)]),
    compareSchema,
    `branch ${branch}`,
  );
  const baseRef = parseJson(
    gh(["api", `repos/dougborg/ends-and-means/git/ref/heads/${base}`]),
    mainRefSchema,
    `base ref ${base}`,
  );
  return {
    baseCurrent: comparison.merge_base_commit.sha === baseRef.object.sha,
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
      "state,baseRefName,headRefName,headRefOid,isDraft,author,reviews,comments",
    ]),
    prViewSchema,
    `pull request ${url}`,
  );
  return {
    state: pr.state,
    baseRefName: pr.baseRefName,
    headRefName: pr.headRefName,
    isDraft: pr.isDraft,
    reviewEvidence: reviewEvidenceForHead(
      pr.headRefOid,
      pr.reviews,
      pr.comments,
    ),
  };
}

function loadLiveItem(
  item: z.infer<typeof projectItemSchema>,
  privateState: PrivateDeliveryState,
): DeliveryItem {
  const issue = parseJson(
    gh([
      "issue",
      "view",
      String(item.content.number),
      "--repo",
      repository,
      "--json",
      "state,updatedAt,body",
    ]),
    issueViewSchema,
    `issue #${item.content.number}`,
  );
  const assignment = assignmentForIssue(privateState, item.content.number);
  const links = item["linked pull requests"] ?? [];
  const prs = links.map((url) => prEvidence(url));
  const relevantPr = selectRelevantPullRequest(prs);
  const target = ["In progress", "In review"].includes(item.status)
    ? branchTargetForActiveItem(
        item.status as "In progress" | "In review",
        assignment?.branch,
        prs,
      )
    : undefined;
  const branch =
    target?.base && target.head
      ? branchEvidence(target.base, target.head)
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
    linkedPullRequestDraft: relevantPr.selected?.isDraft,
    ownershipEvidence: assignment ? true : undefined,
    assignmentBranchMatches: target?.assignmentMatches,
    baseCurrent:
      target?.assignmentMatches === false ? false : branch?.baseCurrent,
    historyLinear: branch?.historyLinear,
    reviewEvidence: relevantPr.selected?.reviewEvidence,
  };
}

function loadLiveSnapshot(privateStatePath: string): DeliverySnapshot {
  let privateState: PrivateDeliveryState;
  try {
    privateState = readPrivateDeliveryState(privateStatePath);
  } catch (error) {
    if (error instanceof PrivateDeliveryStateUnavailableError)
      throw new ApiUnavailableError(error.message);
    throw new InputInvalidError(
      `private delivery state: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
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
      items: list.items.map((item) => loadLiveItem(item, privateState)),
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
    "--private-state",
  ]);
  const unknown = normalizedArgs.filter(
    (arg) => arg.startsWith("-") && !modes.has(arg),
  );
  if (unknown.length)
    throw new InputInvalidError(`Unknown option: ${unknown[0]}.`);
  const selectedModes = normalizedArgs.filter(
    (arg) => arg !== "--private-state" && modes.has(arg),
  );
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
  if (mode === "--live-project") {
    const privateIndex = normalizedArgs.indexOf("--private-state");
    const privatePath = normalizedArgs[privateIndex + 1];
    if (
      privateIndex === -1 ||
      !privatePath ||
      privatePath.startsWith("-") ||
      normalizedArgs.length !== 3
    )
      throw new InputInvalidError(
        "--live-project requires --private-state <path>.",
      );
    return loadLiveSnapshot(privatePath);
  }
  if (normalizedArgs.length !== 1)
    throw new InputInvalidError(`Unexpected argument: ${normalizedArgs[1]}.`);
  return undefined;
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
