import type { PrivateAssignment } from "./delivery-private-state.ts";
import { selectRelevantPullRequest } from "./delivery-state.ts";

type PullRequest = {
  state: "OPEN" | "CLOSED" | "MERGED";
  baseRefName: string;
  headRefName: string;
};

export function branchTargetForActiveItem(
  status: "In progress" | "In review",
  assignmentBranch: string | undefined,
  pullRequests: PullRequest[],
) {
  const relevant = selectRelevantPullRequest(pullRequests);
  if (relevant.ambiguous) return { ambiguous: true as const };
  if (relevant.selected) {
    return {
      ambiguous: false as const,
      assignmentMatches:
        status !== "In progress" ||
        assignmentBranch === relevant.selected.headRefName,
      base: relevant.selected.baseRefName,
      head: relevant.selected.headRefName,
      source: "github" as const,
    };
  }
  if (status === "In progress" && assignmentBranch) {
    return {
      ambiguous: false as const,
      assignmentMatches: true,
      base: "main",
      head: assignmentBranch,
      source: "local" as const,
    };
  }
  return { ambiguous: false as const, assignmentMatches: true };
}

type BranchTarget = ReturnType<typeof branchTargetForActiveItem>;

export function loadActiveBranchEvidence<TGitHub, TLocal>(
  target: BranchTarget,
  assignment: PrivateAssignment | undefined,
  githubLoader: (base: string, head: string) => TGitHub,
  localLoader: (assignment: PrivateAssignment) => TLocal,
) {
  if (!("source" in target)) return undefined;
  if (target.source === "local" && assignment) return localLoader(assignment);
  if (target.source === "github" && target.base && target.head)
    return githubLoader(target.base, target.head);
  return undefined;
}
