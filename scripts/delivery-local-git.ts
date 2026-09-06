import { execFileSync } from "node:child_process";
import { realpathSync } from "node:fs";
import type { PrivateAssignment } from "./delivery-private-state.ts";

export const localGitFailureCodes = [
  "WORKTREE_UNAVAILABLE",
  "WORKTREE_BRANCH_MISMATCH",
  "BRANCH_REF_MISMATCH",
  "ORIGIN_REMOTE_MISMATCH",
  "ORIGIN_MAIN_UNAVAILABLE",
  "ORIGIN_MAIN_STALE",
  "HISTORY_UNRELATED",
  "GIT_COMMAND_FAILED",
] as const;

export type LocalGitFailureCode = (typeof localGitFailureCodes)[number];
export type LocalGitEvidence =
  | { failure?: never; baseCurrent: boolean; historyLinear: boolean }
  | {
      failure: LocalGitFailureCode;
      baseCurrent?: never;
      historyLinear?: never;
    };

type GitRunner = (worktree: string, args: string[]) => string;
type CanonicalPath = (path: string) => string;

function defaultGitRunner(worktree: string, args: string[]) {
  return execFileSync("git", ["-C", worktree, ...args], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  }).trim();
}

function attempt(runner: GitRunner, worktree: string, args: string[]) {
  try {
    return runner(worktree, args).trim();
  } catch {
    return undefined;
  }
}

function isExpectedRemote(remote: string) {
  return /^(?:https:\/\/github\.com\/|git@github\.com:|ssh:\/\/git@github\.com\/|git:\/\/github\.com\/)dougborg\/ends-and-means(?:\.git)?\/?$/u.test(
    remote,
  );
}

function remoteMainOid(raw: string) {
  const lines = raw
    .split(/\r?\n/u)
    .map((line) => line.trim())
    .filter(Boolean);
  if (lines.length !== 1) return undefined;
  const [oid, ref, ...rest] = lines[0]?.split(/\s+/u) ?? [];
  return rest.length === 0 &&
    ref === "refs/heads/main" &&
    /^[0-9a-f]{40}$/u.test(oid ?? "")
    ? oid
    : undefined;
}

function isAssignedWorktree(
  assignment: PrivateAssignment,
  runner: GitRunner,
  canonicalPath: CanonicalPath,
) {
  try {
    const repositoryRoot = attempt(runner, assignment.worktree, [
      "rev-parse",
      "--show-toplevel",
    ]);
    return (
      repositoryRoot !== undefined &&
      canonicalPath(repositoryRoot) === canonicalPath(assignment.worktree)
    );
  } catch {
    return false;
  }
}

/** Validate unpublished work without sending a private branch name to GitHub. */
export function localGitEvidence(
  assignment: PrivateAssignment,
  runner: GitRunner = defaultGitRunner,
  canonicalPath: CanonicalPath = realpathSync,
): LocalGitEvidence {
  if (!isAssignedWorktree(assignment, runner, canonicalPath))
    return { failure: "WORKTREE_UNAVAILABLE" };
  const remote = attempt(runner, assignment.worktree, [
    "remote",
    "get-url",
    "origin",
  ]);
  if (!remote || !isExpectedRemote(remote))
    return { failure: "ORIGIN_REMOTE_MISMATCH" };
  const checkedOutBranch = attempt(runner, assignment.worktree, [
    "symbolic-ref",
    "--quiet",
    "--short",
    "HEAD",
  ]);
  if (checkedOutBranch !== assignment.branch)
    return { failure: "WORKTREE_BRANCH_MISMATCH" };
  const headOid = attempt(runner, assignment.worktree, [
    "rev-parse",
    "--verify",
    "HEAD^{commit}",
  ]);
  const branchOid = attempt(runner, assignment.worktree, [
    "rev-parse",
    "--verify",
    `refs/heads/${assignment.branch}^{commit}`,
  ]);
  if (!headOid || !branchOid || headOid !== branchOid)
    return { failure: "BRANCH_REF_MISMATCH" };
  const localMainOid = attempt(runner, assignment.worktree, [
    "rev-parse",
    "--verify",
    "refs/remotes/origin/main^{commit}",
  ]);
  const advertisedMain = attempt(runner, assignment.worktree, [
    "ls-remote",
    "--exit-code",
    "origin",
    "refs/heads/main",
  ]);
  const currentMainOid = advertisedMain
    ? remoteMainOid(advertisedMain)
    : undefined;
  if (!localMainOid || !currentMainOid)
    return { failure: "ORIGIN_MAIN_UNAVAILABLE" };
  if (localMainOid !== currentMainOid) return { failure: "ORIGIN_MAIN_STALE" };
  const mergeBases = attempt(runner, assignment.worktree, [
    "merge-base",
    "--all",
    localMainOid,
    headOid,
  ])
    ?.split(/\r?\n/u)
    .filter(Boolean);
  if (mergeBases?.length !== 1) return { failure: "HISTORY_UNRELATED" };
  const mergeBase = mergeBases[0];
  if (!mergeBase) return { failure: "HISTORY_UNRELATED" };
  const uniqueHistory = attempt(runner, assignment.worktree, [
    "rev-list",
    "--parents",
    `${mergeBase}..${headOid}`,
  ]);
  if (uniqueHistory === undefined) return { failure: "GIT_COMMAND_FAILED" };
  return {
    baseCurrent: mergeBase === localMainOid,
    historyLinear: uniqueHistory
      .split(/\r?\n/u)
      .filter(Boolean)
      .every((line) => line.trim().split(/\s+/u).length === 2),
  };
}
