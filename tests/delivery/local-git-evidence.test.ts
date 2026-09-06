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

function evidence(overrides: Record<string, string | Error> = {}) {
  const responses: Record<string, string | Error> = {
    "rev-parse --show-toplevel": assignment.worktree,
    "remote get-url origin": "git@github.com:dougborg/ends-and-means.git",
    "symbolic-ref --quiet --short HEAD": assignment.branch,
    "rev-parse --verify HEAD^{commit}": head,
    [`rev-parse --verify refs/heads/${assignment.branch}^{commit}`]: head,
    "rev-parse --verify refs/remotes/origin/main^{commit}": main,
    "ls-remote --exit-code origin refs/heads/main": `${main}\trefs/heads/main`,
    [`merge-base --all ${main} ${head}`]: base,
    [`rev-list --parents ${base}..${head}`]: `${head} ${parent}`,
    ...overrides,
  };
  return localGitEvidence(
    assignment,
    (_worktree, args) => {
      const response = responses[args.join(" ")];
      if (response instanceof Error) throw response;
      if (response === undefined) throw new Error("unexpected git command");
      return response;
    },
    (path) => path,
  );
}

describe("local unpublished-branch evidence", () => {
  it("accepts a linear branch when origin/main advanced after work began", () => {
    expect(evidence()).toEqual({ baseCurrent: false, historyLinear: true });
  });

  it("reports a branch already based on current origin/main", () => {
    expect(
      evidence({
        [`merge-base --all ${main} ${head}`]: main,
        [`rev-list --parents ${main}..${head}`]: `${head} ${main}`,
      }),
    ).toEqual({ baseCurrent: true, historyLinear: true });
  });

  it.each([
    [
      "rev-parse --show-toplevel",
      new Error("private path"),
      "WORKTREE_UNAVAILABLE",
    ],
    [
      "symbolic-ref --quiet --short HEAD",
      "another-branch",
      "WORKTREE_BRANCH_MISMATCH",
    ],
    [
      `rev-parse --verify refs/heads/${assignment.branch}^{commit}`,
      parent,
      "BRANCH_REF_MISMATCH",
    ],
    [
      "remote get-url origin",
      "https://example.test/not-this-repo",
      "ORIGIN_REMOTE_MISMATCH",
    ],
    [
      "ls-remote --exit-code origin refs/heads/main",
      new Error("offline"),
      "ORIGIN_MAIN_UNAVAILABLE",
    ],
    [
      "ls-remote --exit-code origin refs/heads/main",
      `${parent}\trefs/heads/main`,
      "ORIGIN_MAIN_STALE",
    ],
    [
      `merge-base --all ${main} ${head}`,
      new Error("unrelated"),
      "HISTORY_UNRELATED",
    ],
    [
      `rev-list --parents ${base}..${head}`,
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
        [`rev-list --parents ${base}..${head}`]: `${head} ${parent} ${main}`,
      }),
    ).toEqual({ baseCurrent: false, historyLinear: false });
  });

  it("rejects multiple merge bases rather than choosing one", () => {
    expect(
      evidence({ [`merge-base --all ${main} ${head}`]: `${base}\n${parent}` }),
    ).toEqual({ failure: "HISTORY_UNRELATED" });
  });
});
