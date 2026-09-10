import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { z } from "zod";
import { backlogIssueSchema } from "./backlog-integrity.ts";
import {
  commitOidSchema,
  compareSchema,
  mainRefSchema,
} from "./delivery-api-schema.ts";
import { groomingReport } from "./delivery-flow.ts";
import {
  branchTargetForActiveItem,
  loadActiveBranchEvidence,
} from "./delivery-live-evidence.ts";
import { localGitEvidence } from "./delivery-local-git.ts";
import {
  assignmentForIssue,
  normalizedDeliveryFlow,
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
const repositoryIssueSchema = z
  .object({
    number: z.number().int().positive(),
    title: z.string().min(1),
    body: z.string().nullable(),
    state: z.enum(["open", "closed"]),
    labels: labelsSchema,
    pull_request: z.unknown().optional(),
    updated_at: z.string().datetime({ offset: true }).optional(),
  })
  .passthrough();

class InputInvalidError extends Error {}
class ApiUnavailableError extends Error {}
const repository = "dougborg/ends-and-means";
// Paginated issue bodies can exceed Node's default 1 MiB capture limit.
// Keep a finite ceiling and reject overflow rather than audit partial evidence.
const githubOutputLimitBytes = 16 * 1024 * 1024;

function gh(args: string[]) {
  try {
    return execFileSync("gh", args, {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
      maxBuffer: githubOutputLimitBytes,
    });
  } catch (error) {
    const commandError = error as Error & {
      code?: string;
      stderr?: string | Buffer;
    };
    if (commandError.code === "ENOBUFS") {
      throw new Error(
        `gh ${args[0] ?? "command"} exceeded the 16 MiB output limit; no partial response was audited`,
      );
    }
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
  inventory: Map<number, z.infer<typeof repositoryIssueSchema>>,
): DeliveryItem {
  const cached = inventory.get(item.content.number);
  const issue = cached
    ? {
        state: cached.state.toUpperCase() as "OPEN" | "CLOSED",
        body: cached.body ?? "",
        updatedAt: cached.updated_at,
      }
    : parseJson(
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
  const retained = privateState.retained.find(
    (record) => record.issue === item.content.number,
  );
  const links = [
    ...new Set([
      ...(item["linked pull requests"] ?? []),
      ...(retained?.pullRequests ?? []),
    ]),
  ];
  const prs = links.map((url) => prEvidence(url));
  const relevantPr = selectRelevantPullRequest(prs);
  const target = ["In progress", "In review"].includes(item.status)
    ? branchTargetForActiveItem(
        item.status as "In progress" | "In review",
        assignment?.branch,
        prs,
      )
    : undefined;
  const branch = target
    ? loadActiveBranchEvidence(
        target,
        assignment,
        branchEvidence,
        localGitEvidence,
      )
    : undefined;
  return {
    number: item.content.number,
    title: item.content.title,
    type: item.content.type,
    state: issue.state,
    status: item.status,
    workstream: item.workstream,
    priority: item.priority,
    labels: cached?.labels.map((label) => label.name) ?? item.labels ?? [],
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
    localGitFailure: branch && "failure" in branch ? branch.failure : undefined,
    reviewEvidence: relevantPr.selected?.reviewEvidence,
  };
}

function loadPrivateState(privateStatePath: string) {
  let privateState: PrivateDeliveryState;
  try {
    privateState = readPrivateDeliveryState(privateStatePath);
  } catch (error) {
    if (error instanceof PrivateDeliveryStateUnavailableError)
      throw new ApiUnavailableError(error.message);
    throw new InputInvalidError(
      `private delivery state: ${error instanceof z.ZodError ? "schema invalid; inspect the explicitly supplied file privately" : error instanceof Error ? error.message : "invalid state"}`,
    );
  }
  return privateState;
}

function loadLiveMetadata() {
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
  const repositoryIssues = parseJson(
    gh([
      "api",
      "--paginate",
      "--slurp",
      `repos/${repository}/issues?state=open&per_page=100`,
    ]),
    z.array(z.array(repositoryIssueSchema)),
    "open repository issues",
  );
  return { project, list, labels, repositoryIssues };
}

function loadLiveSnapshot(privateStatePath: string): DeliverySnapshot {
  const privateState = loadPrivateState(privateStatePath);
  const { project, list, labels, repositoryIssues } = loadLiveMetadata();
  const inventory = new Map(
    repositoryIssues
      .flat()
      .filter((issue) => issue.pull_request === undefined)
      .map((issue) => [issue.number, issue]),
  );
  const projectItems = [...list.items];
  for (const record of privateState.retained) {
    if (projectItems.some((item) => item.content.number === record.issue))
      continue;
    projectItems.push({
      content: {
        number: record.issue,
        title:
          inventory.get(record.issue)?.title ??
          `Retained issue #${record.issue}`,
        type: "Issue",
      },
      status: "Backlog",
    });
  }
  const items = projectItems.map((item) =>
    loadLiveItem(item, privateState, inventory),
  );
  // A retained closed issue outside Project has no Project status to reconcile.
  for (const item of items) {
    if (
      !list.items.some((entry) => entry.content.number === item.number) &&
      item.state !== "OPEN"
    )
      item.status = "Done";
  }
  return parseInput(
    {
      project: {
        number: project.number,
        title: project.title,
        public: project.public,
      },
      capturedAt: new Date().toISOString(),
      repositoryLabels: labels.map((label) => label.name),
      backlogIssues: repositoryIssues
        .flat()
        .filter((issue) => issue.pull_request === undefined)
        .map((issue) =>
          backlogIssueSchema.parse({
            number: issue.number,
            title: issue.title,
            body: issue.body ?? "",
            state: issue.state.toUpperCase(),
            labels: issue.labels.map((label) => label.name),
          }),
        ),
      items,
      flow: normalizedDeliveryFlow(privateState),
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
  if (!snapshot) {
    console.log(
      "Project state: UNAVAILABLE (repository-only audit; no GitHub credentials requested)",
    );
    console.log(
      "Backlog integrity: UNAVAILABLE (repository-only audit; no GitHub credentials requested)",
    );
  } else {
    const findings = auditDeliverySnapshot(snapshot);
    const report = groomingReport(snapshot);
    console.log(
      `Delivery flow: ${report.mode}; selected unfinished ${report.selectedUnfinished}/3; started unmerged ${report.startedUnmerged}; unknown start ${report.unknownStart}; known unfinished ${report.unfinished}; parked ${report.parked}; prepared research ${report.researchPrepared}/3`,
    );
    for (const row of report.inventory)
      console.log(
        `#${row.issue}: ${row.disposition}; ${row.phase}; observed ${row.evidencePhase}; open PR ${row.openPr === null ? "unknown" : row.openPr}; complete ${row.complete}; cleanup pending ${row.cleanupPending}; evidence age ${row.evidenceAgeMs === null ? "unknown" : `${row.evidenceAgeMs}ms`}; start age ${row.startedAgeMs === null ? "unknown" : `${row.startedAgeMs}ms`}`,
      );
    const backlogFindings = findings.filter(({ code }) =>
      code.startsWith("BACKLOG_"),
    );
    if (!snapshot.backlogIssues)
      console.log(
        "Backlog integrity: UNAVAILABLE (normalized snapshot contains no repository issues)",
      );
    else if (backlogFindings.length === 0)
      console.log(
        `Backlog integrity: clean (${snapshot.backlogIssues.length} open issues checked)`,
      );
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
