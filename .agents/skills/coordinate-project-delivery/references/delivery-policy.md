# Delivery policy

## Sources of truth

- Issues own scope, prerequisites, acceptance criteria, labels, and milestone membership.
- Milestones describe learner-visible outcomes.
- The delivery Project owns only execution status, coarse workstream, and near-term priority.
- Git, pull requests, checks, and review conversations prove implementation and integration state.
- An explicitly supplied, expiring private delivery-state JSON file owns active
  owner, branch, and worktree assignments. Its schema and remediation are
  documented in `docs/delivery-harness.md`.

Do not copy the full backlog into the Project.
Do not encode mutable issue or pull-request status in durable public documentation.
Do not publish internal owner identities or filesystem worktree paths in
issues, pull requests, comments, fixtures, or logs. Missing, unreadable,
expired, duplicate, or malformed private evidence never passes implicitly.

## State transitions

| Project status | Required evidence |
|---|---|
| Backlog | Valid issue, but not in the small execution queue. |
| Ready | Open, dependency-free issue with `status:ready`, a workstream, Priority, and executable acceptance criteria. |
| In progress | Named owner, current branch, and isolated worktree in fresh private state, plus an open workstream slot; remove `status:ready`. |
| In review | Coherent open pull request; implementation WIP slot is released. |
| Blocked | Open issue with `status:blocked` and a concrete named unblock condition. |
| Done | Merged or closed authoritative work, with post-merge state reconciled and its applicable owned cleanup checklist complete. |

Ready has no mandatory minimum or target floor. Audit output orders eligible items deterministically by Priority (`Now`, `Next`, `Later`) and issue number rather than trusting API response order.
The separate prepared-research buffer contains zero to three issues; it is not the Ready queue and does not authorize implementation.
In progress contains at most three implementation items and normally at most one per workstream.
Platform/process consumes its slot only for delivery-enabling work.

## Bounded selection and deliberate pauses

The current tranche contains at most three selected unfinished issues, including reserved selections that have not started. In review and selected Blocked items consume selection capacity even though review releases an implementation slot. Report selected occupancy, started-but-unmerged occupancy, and all known unfinished inventory separately. Missing classification is drift, not free capacity.

Parking requires an explicit grooming decision, preserved branch/evidence, and a next review condition. Keep parked inventory visible even outside the Project. Never automatically park, truncate, discard, or declare excess work complete to pass the cap. A concrete Project Blocked condition may coexist with deliberate parking; preserve the dependency while deferring execution. A parked open PR stays intact in Backlog and requires explicit reselection plus renewed applicable gates before integration. Do not revalidate every unrelated parked branch against today's base just to report its existence or age.

Private mode is explicitly `running` or `user-paused`; neither an empty queue nor missing credentials implies a pause. A pause blocks new starts and parked resumptions. Finishing already-started work depends on the actual user instruction; mode metadata cannot grant authorization or override a stop. Resume is explicit. Source, privacy, ownership, dependencies, review, verification, and cleanup rules remain enforced in both modes.

Use the version 2 private/snapshot contracts and migration procedure in `docs/delivery-harness.md`. Preserve historical timestamps and unknown starts. A fresh file timestamp cannot refresh old record evidence or reactivate expired owners. Report active process, local candidate, open PR, dependency block, approval/tool block, and deliberately parked work with observation age; absence of process evidence means unknown, not running. Durable execution history belongs to its separately scoped tooling work.

Snapshots enforce declared inventory against supplied authoritative issue/PR state; they cannot prove disclosure of every old branch, prior human authorization, or a merge from a private completion flag. Preserve cleanup-pending merged work visibly while excluding authoritative integrated work from the unmerged count. Review stale publication holds against actual authorization individually; do not copy them forward or universally remove them.

## Learner-first dependency flow

Coordinate dependencies from the learner-first vision through Subject Guide composition and prototype before downstream navigation, Explore, shell, heading, or on-page-navigation integration.
Corpus research may proceed in parallel, but public content must use the implemented presentation contract and canonical-only source.

Track labels distinguish product/IA, anchor guides, organizational diversity, bounded Cases, Compare/Questions, trust/evidence, visual design, Depictions, and platform/process work.
They classify issues; they do not create model inheritance.

## Audit interpretation

`pnpm audit:delivery -- --live-project --private-state /secure/path/delivery-state.json` exits 0 only for a clean readable Project and fresh private state, 1 for policy drift, and 2 when credentials, the API, private state, or input are unavailable or invalid.
The audit is read-only.
Fix state only when authorized, then rerun it.
