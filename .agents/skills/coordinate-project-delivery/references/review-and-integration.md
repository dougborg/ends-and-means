# Review and integration

## Pull-request readiness

- Open completed, locally verified work as ready for review by default.
- Use a draft only when an experimental approach needs early feedback or substantial known work remains; keep the linked issue `In progress` and state the early decision sought.
- Move the issue to `In review` only after the pull request is marked ready.
- Rebase onto the pull request's current declared base; that base is `main` for an unstacked pull request or the bottom stack layer, and the directly lower branch for an upper layer.
- Keep the private assignment branch equal to the linked pull request head. The
  live audit compares the head with that pull request's declared base; it uses
  privacy-safe local worktree and Git evidence against a verified
  `origin/main` only when an In-progress assignment has no open linked pull
  request. The path must be a registered worktree of the coordinator
  repository; a same-origin standalone clone is not sufficient. Live
  verification makes a bounded, noninteractive network request but mutates
  neither Git nor GitHub. Do not publish a branch merely to make it inspectable.
- Treat an advancing `main` during active implementation as information, not a
  reason for continuous rebase churn. Current-base evidence becomes mandatory
  when handing completed work into review.
- Never merge the declared base into the branch.
- Confirm the diff stays inside the issue and ownership boundary.
- Synchronize tests, documentation, and applicable repository skills.
- Run `pnpm verify` and report any intentionally inapplicable public-route review.
- Complete the pull-request template and name the decisions requiring judgment.

Use a GitHub stack only when an upper change genuinely depends on a lower change.
Keep unrelated changes on parallel branches, even when a synthetic chain would reduce immediate rebase work.
Every layer remains a focused, ready-for-review pull request with its own tests and review boundary.
Order the stack from the shared foundation to its consumers, merge bottom-up, and refresh exact-head review evidence after GitHub rebases or retargets an upper layer.
Do not turn a cross-cutting audit into the top of every contributing stack.
Hold a corpus-, presentation-, navigation-, or delivery-wide capstone sweep until its input tranche lands, then rebase, rerun, and expand that sweep against the resulting baseline.

## Review gates

Copilot review and independent adversarial review are required by project process.
GitHub branch protection intentionally has no required approving-review gate, so absence of that setting is not permission to skip review.
Address or explicitly resolve every material finding, rerun affected checks, and resolve conversations.
Record approval only after both reviewers inspect the exact current head.
Copilot's GitHub review must be bound to that commit.
After a separately assigned review, a repository owner, member, or collaborator must add the privacy-safe PR comment `Independent adversarial review: APPROVED` and `Head: <full-40-character-commit-oid>` on two lines.
If a normal Copilot request produces no review, the same trusted association may record `Copilot review: UNAVAILABLE` and `Head: <full-40-character-commit-oid>` on two lines; absence alone never passes.
Do not publish internal agent handles, worktree paths, quota state, or operational explanations in review evidence.
Keep reviewer independence in private coordination state: GitHub verifies the trusted attestation and exact head, not which internal agent reviewed the change or why Copilot returned nothing.
The PR-author checkbox is not evidence by itself, and any new commit makes every earlier head-bound signal stale.

Strict branch checks retain stable names: `verify`, `workflow-analysis`, `dependency-review`, and `codeql`.
Do not duplicate their ownership across workflows or rename them casually.

## Integration

Do not continuously rebase active implementation merely because the base moves.
Rebase at review handoff and again before integration when necessary, then rerun the gates affected by the new base.
Use GitHub's rebase integration only—never squash, merge commits, force pushes to `main`, or admin bypasses.
For a stack, integrate from the bottom upward and verify each automatically rebased or retargeted layer against its declared base before continuing.
Confirm linear history before integration.
After merge, verify the commit on `main`, required main checks, and Pages deployment when public output or its build path changed.
Then reconcile the issue and Project item and complete the cleanup below.

## Post-merge cleanup

Cleanup is part of the final handoff and definition of done. Retire only the
worktree, branch, processes, and generated storage owned by the completed task.

1. For implementation work, confirm the pull request is authoritatively merged
   and identify its result on the declared base. A rebase merge rewrites commit
   IDs, so map the reviewed branch to the merged pull-request diff or commits
   instead of relying only on `git branch --merged` or ancestor checks. For an
   issue closed without implementation, confirm that it has no assigned branch,
   worktree, process, or generated storage to retire.
2. Inspect `git status --short --untracked-files=all` and
   `git status --short --ignored=matching`, the private assignment, and owned
   processes and listeners before removing anything. Check both dependency
   links inside the candidate worktree and links from retained worktrees into
   it; replace or preserve a still-used target first. Preserve a dirty or
   unmerged worktree, an uncertain merge mapping, or work still assigned to an
   active owner; record the exact remaining condition in the handoff.
3. Preserve required review evidence and any useful recovery history outside
   disposable build storage. Keep source notes, logs, screenshots, exact-head
   attestations, or a recovery ref when they remain necessary to audit or
   recover the merged work.
4. Stop previews, test servers, watchers, and other processes started for the
   task. Confirm their listeners have exited before another worktree reuses the
   affected tool or port.
5. From the coordinator repository, remove the clean registered worktree with
   `git worktree remove <path>`. If normal removal reports ignored outputs,
   inspect them, preserve required evidence, remove only reviewed disposable
   worktree-local installs, builds, coverage, test artifacts, or caches, and
   retry normal removal; do not use blind forced removal. Do not feed discovered
   paths directly into a deletion command, remove another owner's files, or
   purge shared/global package and browser caches as routine cleanup.
6. Delete the local task branch only when the authoritative merge mapping is
   established and the result remains recoverable from `main`, the merged pull
   request, or an intentionally preserved ref. Prefer normal branch deletion;
   after a verified rebase merge, use forced local branch deletion only when
   the rewritten mapping and recovery path have been recorded.
7. Run `git worktree list --porcelain` and inspect the affected paths,
   listeners, and disk usage. Confirm the retired worktree is absent, no owned
   process or dangling dependency link remains, and the expected space was
   reclaimed. Update or remove the private assignment, then include the cleanup
   result and any intentionally preserved artifact or ref in the final handoff.
