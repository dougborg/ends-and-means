import { describe, expect, it } from "vitest";
import {
  branchTargetForActiveItem,
  loadActiveBranchEvidence,
} from "../../scripts/delivery-live-evidence.ts";

describe("active branch evidence routing", () => {
  it("routes unpublished In-progress work to local Git evidence", () => {
    expect(
      branchTargetForActiveItem("In progress", "private/local-branch", []),
    ).toEqual({
      ambiguous: false,
      assignmentMatches: true,
      base: "main",
      head: "private/local-branch",
      source: "local",
    });
  });

  it("reproduces the unpublished-branch 404 regression without calling GitHub compare", () => {
    const target = branchTargetForActiveItem(
      "In progress",
      "private/local-branch",
      [],
    );
    const assignment = {
      issue: 201,
      owner: "private-owner",
      branch: "private/local-branch",
      worktree: "/private/worktree",
    };
    let githubCompareCalls = 0;
    const result = loadActiveBranchEvidence(
      target,
      assignment,
      () => {
        githubCompareCalls += 1;
        throw new Error("Not Found (HTTP 404)");
      },
      () => ({ baseCurrent: false, historyLinear: true }),
    );
    expect(result).toEqual({ baseCurrent: false, historyLinear: true });
    expect(githubCompareCalls).toBe(0);
  });

  it("makes a sole open pull request authoritative", () => {
    expect(
      branchTargetForActiveItem("In progress", "feature/pr", [
        {
          state: "OPEN",
          baseRefName: "feature/foundation",
          headRefName: "feature/pr",
        },
      ]),
    ).toMatchObject({
      assignmentMatches: true,
      base: "feature/foundation",
      head: "feature/pr",
      source: "github",
    });
  });

  it("fails closed on multiple open pull requests without selecting local evidence", () => {
    expect(
      branchTargetForActiveItem("In progress", "feature/pr", [
        { state: "OPEN", baseRefName: "main", headRefName: "feature/pr" },
        { state: "OPEN", baseRefName: "main", headRefName: "feature/other" },
      ]),
    ).toEqual({ ambiguous: true });
  });
});
