---
name: coordinate-project-delivery
description: Audit and coordinate Ends and Means issues, pull requests, isolated worktrees, CI gates, and the active-delivery GitHub Project. Use when starting, handing off, reviewing, integrating, or reconciling project work; do not use it as a substitute for the research-content-changes skill when claims or canonical content change.
---

# Coordinate project delivery

Keep delivery state truthful while moving a small amount of independently owned work through review and rebase-only integration.
Issues and milestones are the canonical backlog; the delivery Project is a thin execution queue.

Before changing coordination state, read [delivery policy](references/delivery-policy.md).
Before opening, reviewing, or integrating a pull request, also read [review and integration](references/review-and-integration.md).

## Establish authoritative state

Inspect the current base, worktrees, issue, linked pull request, required checks, unresolved conversations, and Project item rather than relying on conversational status.
Record one owner, branch, and isolated worktree for active implementation.
Do not mutate another owner's worktree or preserved paused work.

Run the repository audit without credentials in normal verification:

```bash
pnpm audit:delivery -- --repository-only
```

When authenticated access to the private Project is available and the user has authorized external coordination, run:

```bash
pnpm audit:delivery -- --live-project
```

`UNAVAILABLE` is not a clean Project result.
Do not weaken checks because credentials or API state are unavailable, and never change Project visibility as part of an audit.

## Coordinate work

- Keep three to five independently executable Ready items, ordered by Priority.
- Count only In progress as implementation WIP; keep it at three or fewer and normally one each for Corpus, Reader experience, and delivery-enabling Platform/process work.
- In review does not consume implementation WIP, but must keep moving.
- Give Blocked work a concrete named condition in its issue.
- Promote only when both total capacity and the workstream slot are open.
- Reconcile issue labels, issue state, linked PR state, and Project status after each transition.
- Treat Corpus research as separable from publication integration when the presentation contract is not ready; neither lane may weaken the evidence or canonical-only publication rules.
- Capture newly observed, independently reviewable work as a focused issue rather than silently widening the active change.

For substantive canonical or narrative changes, also use `research-content-changes` and follow its source, counterfactual, plagiarism, geographic and organizational diversity, and learner-first rules.
That review must take community self-description and oral-history provenance seriously where they are appropriate to the subject.
Continuous improvement means fixing safe in-scope findings or recording a focused issue without silently widening the active change.

## Verify and hand off

Run the single local/CI verification path:

```bash
pnpm verify
```

Open a ready-for-review pull request from a completed, verified branch rebased on its current declared base (`main` for an unstacked pull request or the bottom stack layer).
Use a draft only for an explicitly experimental approach or a deliberate early-feedback checkpoint with substantial work remaining, and keep its issue `In progress` until the pull request is marked ready.
Use GitHub stacks selectively for true dependency chains, keep unrelated work parallel, merge the bottom layer first, and refresh exact-head evidence after automatic rebases or retargeting.
Use the repository template, identify human decisions, request applicable Copilot review, and obtain an independent adversarial review.
Record only the privacy-safe exact-head markers defined in the review reference; keep internal agent handles, worktree paths, quota state, and operational explanations in private coordination state.
These reviews are project-process gates even though GitHub does not require an approving review.
Resolve conversations and all strict checks, rebase again if the base moved, integrate with rebase rather than squash or merge commits, and verify main plus deployment after merge.

Never bypass a failed check, unresolved conversation, review finding, or branch rule merely to clear the queue.
