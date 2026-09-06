import { execFileSync } from "node:child_process";
import { realpathSync } from "node:fs";
import { resolve } from "node:path";
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

export type GitRunner = (worktree: string, args: string[]) => string;
type CanonicalPath = (path: string) => string;
type RemoteMatcher = (remote: string) => boolean;

interface LocalGitEvidenceOptions {
  runner?: GitRunner;
  canonicalPath?: CanonicalPath;
  coordinatorWorktree?: string;
  expectedRemote?: RemoteMatcher;
}

const gitTimeoutMs = 15_000;

export function createGitRunner(
  timeoutMs = gitTimeoutMs,
  environment: NodeJS.ProcessEnv = process.env,
): GitRunner {
  return (worktree, args) =>
    execFileSync("git", ["-C", worktree, ...args], {
      encoding: "utf8",
      env: {
        ...environment,
        GCM_INTERACTIVE: "Never",
        GIT_ASKPASS: "/usr/bin/false",
        GIT_SSH_COMMAND: "ssh -oBatchMode=yes",
        GIT_TERMINAL_PROMPT: "0",
        SSH_ASKPASS: "/usr/bin/false",
        SSH_ASKPASS_REQUIRE: "never",
      },
      stdio: ["ignore", "pipe", "pipe"],
      timeout: timeoutMs,
    }).trim();
}

const defaultGitRunner = createGitRunner();

function attempt(runner: GitRunner, worktree: string, args: string[]) {
  try {
    return runner(worktree, args).trim();
  } catch {
    return undefined;
  }
}

export function isExpectedRemote(remote: string) {
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

interface WorktreeRecord {
  path: string;
  head: string | undefined;
  branch: string | undefined;
}

function worktreeRecords(raw: string): WorktreeRecord[] {
  return raw
    .split("\0\0")
    .filter(Boolean)
    .map((block) => {
      const fields = new Map(
        block
          .split("\0")
          .filter(Boolean)
          .map((field) => {
            const separator = field.indexOf(" ");
            return separator === -1
              ? [field, ""]
              : [field.slice(0, separator), field.slice(separator + 1)];
          }),
      );
      return {
        path: fields.get("worktree") ?? "",
        head: fields.get("HEAD"),
        branch: fields.get("branch"),
      };
    });
}

function canonicalGitDirectory(
  worktree: string,
  runner: GitRunner,
  canonicalPath: CanonicalPath,
) {
  const gitDirectory = attempt(runner, worktree, [
    "rev-parse",
    "--git-common-dir",
  ]);
  if (!gitDirectory) return undefined;
  try {
    return canonicalPath(resolve(worktree, gitDirectory));
  } catch {
    return undefined;
  }
}

function isRegisteredWorktree(
  assignment: PrivateAssignment,
  headOid: string,
  runner: GitRunner,
  canonicalPath: CanonicalPath,
  coordinatorWorktree: string,
) {
  try {
    const repositoryRoot = attempt(runner, assignment.worktree, [
      "rev-parse",
      "--show-toplevel",
    ]);
    const assignedPath = canonicalPath(assignment.worktree);
    const coordinatorCommonDir = canonicalGitDirectory(
      coordinatorWorktree,
      runner,
      canonicalPath,
    );
    const assignedCommonDir = canonicalGitDirectory(
      assignment.worktree,
      runner,
      canonicalPath,
    );
    const records = attempt(runner, coordinatorWorktree, [
      "worktree",
      "list",
      "--porcelain",
      "-z",
    ]);
    return (
      repositoryRoot !== undefined &&
      canonicalPath(repositoryRoot) === assignedPath &&
      coordinatorCommonDir !== undefined &&
      coordinatorCommonDir === assignedCommonDir &&
      records !== undefined &&
      worktreeRecords(records).some(
        (record) =>
          canonicalPath(record.path) === assignedPath &&
          record.branch === `refs/heads/${assignment.branch}` &&
          record.head === headOid,
      )
    );
  } catch {
    return false;
  }
}

function verifiedOriginMain(
  assignment: PrivateAssignment,
  runner: GitRunner,
  expectedRemote: RemoteMatcher,
): string | LocalGitEvidence {
  const remote = attempt(runner, assignment.worktree, [
    "remote",
    "get-url",
    "origin",
  ]);
  if (!remote || !expectedRemote(remote))
    return { failure: "ORIGIN_REMOTE_MISMATCH" };
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
  return localMainOid === currentMainOid
    ? localMainOid
    : { failure: "ORIGIN_MAIN_STALE" };
}

function branchHistoryEvidence(
  worktree: string,
  mainOid: string,
  headOid: string,
  runner: GitRunner,
): LocalGitEvidence {
  const mergeBases = attempt(runner, worktree, [
    "merge-base",
    "--all",
    mainOid,
    headOid,
  ])
    ?.split(/\r?\n/u)
    .filter(Boolean);
  if (mergeBases?.length !== 1) return { failure: "HISTORY_UNRELATED" };
  const mergeBase = mergeBases[0];
  if (!mergeBase) return { failure: "HISTORY_UNRELATED" };
  const uniqueHistory = attempt(runner, worktree, [
    "rev-list",
    "--parents",
    `${mergeBase}..${headOid}`,
  ]);
  if (uniqueHistory === undefined) return { failure: "GIT_COMMAND_FAILED" };
  return {
    baseCurrent: mergeBase === mainOid,
    historyLinear: uniqueHistory
      .split(/\r?\n/u)
      .filter(Boolean)
      .every((line) => line.trim().split(/\s+/u).length === 2),
  };
}

/** Validate unpublished work without sending a private branch name to GitHub. */
export function localGitEvidence(
  assignment: PrivateAssignment,
  options: LocalGitEvidenceOptions = {},
): LocalGitEvidence {
  const {
    runner = defaultGitRunner,
    canonicalPath = realpathSync,
    coordinatorWorktree = process.cwd(),
    expectedRemote = isExpectedRemote,
  } = options;
  try {
    canonicalPath(assignment.worktree);
  } catch {
    return { failure: "WORKTREE_UNAVAILABLE" };
  }
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
  if (
    !isRegisteredWorktree(
      assignment,
      headOid,
      runner,
      canonicalPath,
      coordinatorWorktree,
    )
  )
    return { failure: "WORKTREE_UNAVAILABLE" };
  const mainEvidence = verifiedOriginMain(assignment, runner, expectedRemote);
  return typeof mainEvidence === "string"
    ? branchHistoryEvidence(assignment.worktree, mainEvidence, headOid, runner)
    : mainEvidence;
}
