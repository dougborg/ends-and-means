# Review and integration

## Pull-request readiness

- Rebase onto current `main`; never merge `main` into the branch.
- Confirm the diff stays inside the issue and ownership boundary.
- Synchronize tests, documentation, and applicable repository skills.
- Run `pnpm verify` and report any intentionally inapplicable public-route review.
- Complete the pull-request template and name the decisions requiring judgment.

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
Confirm linear history before integration.
After merge, verify the commit on `main`, required main checks, and Pages deployment when public output or its build path changed.
Then reconcile the issue and Project item and safely remove only the merged branch/worktree owned by the task.
