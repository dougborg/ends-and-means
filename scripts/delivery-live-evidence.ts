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
    };
  }
  if (status === "In progress" && assignmentBranch) {
    return {
      ambiguous: false as const,
      assignmentMatches: true,
      base: "main",
      head: assignmentBranch,
    };
  }
  return { ambiguous: false as const, assignmentMatches: true };
}
