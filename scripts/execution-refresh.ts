import { z } from "zod";
import { commitOidSchema } from "./delivery-api-schema.ts";
import { boundedGitHubRead } from "./delivery-github-read.ts";

const prSchema = z.object({
  number: z.number().int().positive(),
  state: z.enum(["open", "closed"]),
  merged: z.boolean(),
  head: z.object({ sha: commitOidSchema }),
  base: z.object({ sha: commitOidSchema }),
});
const checkSchema = z.object({
  total_count: z.number().int().nonnegative(),
  check_runs: z.array(
    z.object({
      id: z.number().int().positive(),
      head_sha: commitOidSchema,
      status: z.enum(["queued", "in_progress", "completed"]),
      conclusion: z.string().nullable(),
    }),
  ),
});
const commitSchema = z.object({
  sha: commitOidSchema,
  tree: z.object({ sha: commitOidSchema }),
  parents: z.array(z.object({ sha: commitOidSchema })).max(10),
});
export interface HostedObservation {
  source: "offline" | "github";
  observedAt: string;
  status: "unavailable" | "pending" | "failed" | "checks-passed";
  code: string;
  pullRequest?: number;
  head?: string;
  merged?: boolean;
  checks?: number;
  sourceMapping?:
    | "head"
    | "synthetic-merge-equivalent-tree"
    | "different-tree"
    | "unavailable";
  hostedSource?: string;
  deployment?: "unavailable";
}

type Read = (path: string, pages?: boolean) => unknown;
function completeChecks(read: Read, head: string) {
  const pages = z
    .array(checkSchema)
    .min(1)
    .parse(read(`commits/${head}/check-runs?per_page=100&filter=latest`, true));
  const checks = pages.flatMap((page) => page.check_runs);
  if (
    !checks.length ||
    new Set(checks.map((check) => check.id)).size !== checks.length ||
    pages.some((page) => page.total_count !== checks.length) ||
    checks.some((check) => check.head_sha !== head)
  )
    throw new Error("Incomplete or wrong-head checks");
  return checks;
}
function checkStatus(
  checks: z.infer<typeof checkSchema>["check_runs"],
): HostedObservation["status"] {
  if (checks.some((check) => check.status !== "completed")) return "pending";
  if (
    checks.some(
      (check) =>
        !["success", "neutral", "skipped"].includes(check.conclusion ?? ""),
    )
  )
    return "failed";
  return "checks-passed";
}
function mapSource(
  read: Read,
  pr: z.infer<typeof prSchema>,
  source?: string,
): NonNullable<HostedObservation["sourceMapping"]> {
  if (!source || source === pr.head.sha) return "head";
  const head = commitSchema.parse(read(`git/commits/${pr.head.sha}`));
  const hosted = commitSchema.parse(read(`git/commits/${source}`));
  if (head.sha !== pr.head.sha || hosted.sha !== source)
    throw new Error("Wrong source identity");
  const parents = new Set(hosted.parents.map((parent) => parent.sha));
  return hosted.tree.sha === head.tree.sha &&
    hosted.parents.length === 2 &&
    parents.has(pr.head.sha) &&
    parents.has(pr.base.sha)
    ? "synthetic-merge-equivalent-tree"
    : "different-tree";
}
function timedReader(reader: typeof boundedGitHubRead): Read {
  const deadline = Date.now() + 30_000;
  return (path, pages = false) => {
    const remaining = deadline - Date.now();
    if (remaining <= 0) throw new Error("Refresh deadline");
    return JSON.parse(
      reader(
        [
          "api",
          ...(pages ? ["--paginate", "--slurp"] : []),
          `repos/dougborg/ends-and-means/${path}`,
        ],
        remaining,
      ),
    );
  };
}
export function refreshExecutionEvidence(
  pullRequest: number | undefined,
  hostedSource?: string,
  reader = boundedGitHubRead,
): HostedObservation {
  const observation: HostedObservation = {
    source: "github",
    observedAt: new Date().toISOString(),
    status: "unavailable",
    code: "HOSTED_UNAVAILABLE",
    deployment: "unavailable",
  };
  if (!Number.isSafeInteger(pullRequest) || (pullRequest ?? 0) < 1)
    return observation;
  if (
    hostedSource !== undefined &&
    !commitOidSchema.safeParse(hostedSource).success
  )
    return observation;
  try {
    const read = timedReader(reader);
    const pr = prSchema.parse(read(`pulls/${pullRequest}`));
    if (pr.number !== pullRequest) throw new Error("Identity mismatch");
    const checks = completeChecks(read, pr.head.sha);
    const status = checkStatus(checks);
    const codes = {
      unavailable: "HOSTED_UNAVAILABLE",
      pending: "HOSTED_PENDING",
      failed: "HOSTED_FAILED",
      "checks-passed": "HOSTED_CHECKS_PASSED",
    };
    return {
      ...observation,
      pullRequest,
      head: pr.head.sha,
      merged: pr.merged,
      checks: checks.length,
      status,
      code: codes[status],
      sourceMapping: mapSource(read, pr, hostedSource),
      ...(hostedSource ? { hostedSource } : {}),
    };
  } catch {
    return observation;
  }
}
