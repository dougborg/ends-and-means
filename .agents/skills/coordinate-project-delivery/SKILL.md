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
Record one owner, branch, and isolated worktree for active implementation in
the expiring private delivery-state file described by the delivery policy.
Never put owner identities or filesystem paths in public issue or pull-request
text. Pass the private file explicitly; do not infer it from public comments.
Do not mutate another owner's worktree or preserved paused work.
For In-progress work without an open pull request, use the harness's local Git
evidence; do not publish the branch merely to make it auditable. Once an open
pull request exists, its GitHub-declared base and head are authoritative.

Run the repository audit without credentials in normal verification:

```bash
pnpm audit:delivery -- --repository-only
```

When authenticated access to the private Project is available and the user has authorized external coordination, run:

```bash
pnpm audit:delivery -- --live-project --private-state /secure/path/delivery-state.json
```

`UNAVAILABLE` is not a clean Project result.
Do not weaken checks because credentials or API state are unavailable, and never change Project visibility as part of an audit.

## Coordinate work

- Select at most three unfinished issues, including reserved selections that have not started. Review and selected blocked work consume this cap; report started-but-unmerged work separately.
- Retain the implementation limit of three In progress items, normally one each for Corpus, Reader experience, and delivery-enabling Platform/process work. Promote only a selected executable issue when its implementation slot is open.
- Ready has no mandatory minimum. Preserve dependency-free eligibility and deterministic Priority ordering; keep the separate prepared-research buffer at zero to three issues.
- Park deliberately with preserved branch/evidence and a next review condition. Keep parked work visible in the full unfinished inventory, including work outside the Project; never automatically park, truncate, or drop excess work to satisfy capacity.
- Record running or user-paused mode explicitly in private state. A user-paused mode blocks starts and parked resumptions; completion of already-started work follows the actual user instruction, never permission invented from mode metadata. Resume and reselect explicitly.
- Give Blocked work a concrete named condition in its issue.
- Reconcile the affected issue, labels, linked PR, and Project item once per material transition, with targeted readback. Reserve complete live audits for grooming, integration batches, or evidence of wider drift.
- Treat Corpus research as separable from publication integration when the presentation contract is not ready; neither lane may weaken the evidence or canonical-only publication rules.
- Capture newly observed, independently reviewable work as a focused issue rather than silently widening the active change.

For substantive canonical or narrative changes, also use `research-content-changes` and follow its source, counterfactual, plagiarism, geographic and organizational diversity, and learner-first rules.
That review must take community self-description and oral-history provenance seriously where they are appropriate to the subject.
Continuous improvement means fixing safe in-scope findings or recording a focused issue without silently widening the active change.

## Verify and hand off

Use one implementation owner and one independent reviewer. An early representative evidence/model sample may precede expansion. Review a coherent final candidate with one consolidated finding list; subsequent review examines affected changes while renewing required exact-head evidence. Coordinator review addresses dependencies and contested findings instead of routinely duplicating independent review.

Use the [compact dispatch and handoff guidance](../../../docs/execution-records.md#compact-dispatch-and-handoff) when assigning or resuming work.
Keep one current private snapshot with evidence references; archive history separately instead of copying it into each assignment.

Use focused checks during authoring. For supported commands, use the
[execution recorder](../../../docs/execution-records.md) and provide its private
store/run identity at launch. The coordinator reads the actual terminal result
from durable status; do not require a second completion narrative before
accepting that command evidence. The author still owns tool-handle polling and
process cleanup. Provide one concise candidate handoff with commit, evidence
references, new findings or blocker, next action, and owned cleanup. Report active process, local candidate, open PR, dependency block, approval/tool block, and parked work with evidence age or unknown state. Assignments and PIDs alone do not prove an active process. Preserve unknown history and old evidence; do not refresh record ages by rewriting the file.

Use the [governed environment contract](../../../docs/environments.md) for exact toolchain selection, task-owned dependencies, readiness results and explicit probes.
Keep full verification free of global route/base/port overrides; record the actual environment fingerprint with handoff evidence.
A readiness result does not replace verification or authorize retrying a denied command unchanged.

Run the single local/CI verification path:

```bash
pnpm verify
```

For a changed canonical tranche, first run `pnpm audit:content-preflight` and
remediate with focused affected checks. Run the full `pnpm verify` once at final
handoff, and again after a later change or rebase only when it can affect the
verified surface. This efficiency rule never replaces exact-head hosted CI,
independent review, rebase-only integration, or post-merge verification.

Open a ready-for-review pull request from a completed, verified branch rebased on its current declared base (`main` for an unstacked pull request or the bottom stack layer).
Use a draft only for an explicitly experimental approach or a deliberate early-feedback checkpoint with substantial work remaining, and keep its issue `In progress` until the pull request is marked ready.
Use GitHub stacks selectively for true dependency chains, keep unrelated work parallel, merge the bottom layer first, and refresh exact-head evidence after automatic rebases or retargeting.
Use the repository template, identify human decisions, request applicable Copilot review, and obtain an independent adversarial review.
Record only the privacy-safe exact-head markers defined in the review reference; keep internal agent handles, worktree paths, quota state, and operational explanations in private coordination state.
These reviews are project-process gates even though GitHub does not require an approving review.
Resolve conversations and all strict checks, rebase again if the base moved, integrate with rebase rather than squash or merge commits, and verify main plus deployment after merge.

Treat post-merge cleanup as part of handoff and the definition of done. After
the authoritative merge and post-merge checks are verified, follow the
[post-merge cleanup checklist](references/review-and-integration.md#post-merge-cleanup).
Preserve dirty, unmerged, ambiguously mapped, or still-owned work and report
the exact remaining condition instead of forcing removal.

Never bypass a failed check, unresolved conversation, review finding, or branch rule merely to clear the queue.
