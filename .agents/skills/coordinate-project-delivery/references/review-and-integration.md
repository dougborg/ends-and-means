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
Then reconcile the issue and Project item and safely remove only the merged branch/worktree owned by the task.
