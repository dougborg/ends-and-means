import { describe, expect, it } from "vitest";
import { localGitEvidence } from "../../scripts/delivery-local-git.ts";

const main = "1".repeat(40);
const base = "2".repeat(40);
const head = "3".repeat(40);
const parent = "4".repeat(40);
const assignment = {
  issue: 201,
  owner: "private-owner",
  branch: "chore/local-branch-audit-201",
  worktree: "/private/worktree",
};
const coordinator = "/private/coordinator";

function evidence(overrides: Record<string, string | Error> = {}) {
  const responses: Record<string, string | Error> = {
    [`${assignment.worktree}|rev-parse --show-toplevel`]: assignment.worktree,
    [`${assignment.worktree}|remote get-url origin`]:
      "git@github.com:dougborg/ends-and-means.git",
    [`${assignment.worktree}|symbolic-ref --quiet --short HEAD`]:
      assignment.branch,
    [`${assignment.worktree}|rev-parse --verify HEAD^{commit}`]: head,
    [`${assignment.worktree}|rev-parse --verify refs/heads/${assignment.branch}^{commit}`]:
      head,
    [`${assignment.worktree}|rev-parse --git-common-dir`]: "/private/git",
    [`${coordinator}|rev-parse --git-common-dir`]: "/private/git",
    [`${coordinator}|worktree list --porcelain -z`]: `worktree ${assignment.worktree}\0HEAD ${head}\0branch refs/heads/${assignment.branch}\0\0`,
    [`${assignment.worktree}|rev-parse --verify refs/remotes/origin/main^{commit}`]:
      main,
    [`${assignment.worktree}|ls-remote --exit-code origin refs/heads/main`]: `${main}\trefs/heads/main`,
    [`${assignment.worktree}|merge-base --all ${main} ${head}`]: base,
    [`${assignment.worktree}|rev-list --parents ${base}..${head}`]: `${head} ${parent}`,
    ...overrides,
  };
  return localGitEvidence(assignment, {
    runner: (worktree, args) => {
      const response = responses[`${worktree}|${args.join(" ")}`];
      if (response instanceof Error) throw response;
      if (response === undefined) throw new Error("unexpected git command");
      return response;
    },
    canonicalPath: (path) => path,
    coordinatorWorktree: coordinator,
  });
}

describe("local unpublished-branch evidence", () => {
  it("accepts a linear branch when origin/main advanced after work began", () => {
    expect(evidence()).toEqual({ baseCurrent: false, historyLinear: true });
  });

  it("reports a branch already based on current origin/main", () => {
    expect(
      evidence({
        [`${assignment.worktree}|merge-base --all ${main} ${head}`]: main,
        [`${assignment.worktree}|rev-list --parents ${main}..${head}`]: `${head} ${main}`,
      }),
    ).toEqual({ baseCurrent: true, historyLinear: true });
  });

  it.each([
    [
      `${assignment.worktree}|rev-parse --show-toplevel`,
      new Error("private path"),
      "WORKTREE_UNAVAILABLE",
    ],
    [
      `${assignment.worktree}|symbolic-ref --quiet --short HEAD`,
      "another-branch",
      "WORKTREE_BRANCH_MISMATCH",
    ],
    [
      `${assignment.worktree}|rev-parse --verify refs/heads/${assignment.branch}^{commit}`,
      parent,
      "BRANCH_REF_MISMATCH",
    ],
    [
      `${assignment.worktree}|remote get-url origin`,
      "https://example.test/not-this-repo",
      "ORIGIN_REMOTE_MISMATCH",
    ],
    [
      `${assignment.worktree}|ls-remote --exit-code origin refs/heads/main`,
      new Error("offline"),
      "ORIGIN_MAIN_UNAVAILABLE",
    ],
    [
      `${assignment.worktree}|ls-remote --exit-code origin refs/heads/main`,
      `${parent}\trefs/heads/main`,
      "ORIGIN_MAIN_STALE",
    ],
    [
      `${assignment.worktree}|merge-base --all ${main} ${head}`,
      new Error("unrelated"),
      "HISTORY_UNRELATED",
    ],
    [
      `${assignment.worktree}|rev-list --parents ${base}..${head}`,
      new Error("broken"),
      "GIT_COMMAND_FAILED",
    ],
  ])(
    "classifies %s failures without exposing command details",
    (command, value, failure) => {
      expect(evidence({ [command]: value })).toEqual({ failure });
    },
  );

  it("rejects merge commits in work added after the common ancestor", () => {
    expect(
      evidence({
        [`${assignment.worktree}|rev-list --parents ${base}..${head}`]: `${head} ${parent} ${main}`,
      }),
    ).toEqual({ baseCurrent: false, historyLinear: false });
  });

  it("rejects multiple merge bases rather than choosing one", () => {
    expect(
      evidence({
        [`${assignment.worktree}|merge-base --all ${main} ${head}`]: `${base}\n${parent}`,
      }),
    ).toEqual({ failure: "HISTORY_UNRELATED" });
  });

  it.each([
    new Error("authentication failed at /private/secret"),
    Object.assign(new Error("timed out at /private/secret"), {
      code: "ETIMEDOUT",
    }),
  ])(
    "classifies remote authentication and timeout failures without details",
    (error) => {
      const result = evidence({
        [`${assignment.worktree}|ls-remote --exit-code origin refs/heads/main`]:
          error,
      });
      expect(result).toEqual({ failure: "ORIGIN_MAIN_UNAVAILABLE" });
      expect(JSON.stringify(result)).not.toContain("private");
    },
  );
});
