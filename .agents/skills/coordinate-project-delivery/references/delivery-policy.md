# Delivery policy

## Sources of truth

- Issues own scope, prerequisites, acceptance criteria, labels, and milestone membership.
- Milestones describe learner-visible outcomes.
- The delivery Project owns only execution status, coarse workstream, and near-term priority.
- Git, pull requests, checks, and review conversations prove implementation and integration state.

Do not copy the full backlog into the Project.
Do not encode mutable issue or pull-request status in durable public documentation.

## State transitions

| Project status | Required evidence |
|---|---|
| Backlog | Valid issue, but not in the small execution queue. |
| Ready | Open, dependency-free issue with `status:ready`, a workstream, Priority, and executable acceptance criteria. |
| In progress | Named owner, current branch, isolated worktree, and an open workstream slot; remove `status:ready`. |
| In review | Coherent open pull request; implementation WIP slot is released. |
| Blocked | Open issue with `status:blocked` and a concrete named unblock condition. |
| Done | Merged or closed authoritative work, with post-merge state reconciled. |

Ready contains three to five items; audit output orders them deterministically by Priority (`Now`, `Next`, `Later`) and issue number rather than trusting API response order.
In progress contains at most three implementation items and normally at most one per workstream.
Platform/process consumes its slot only for delivery-enabling work.

## Learner-first dependency flow

Coordinate dependencies from the learner-first vision through Subject Guide composition and prototype before downstream navigation, Explore, shell, heading, or on-page-navigation integration.
Corpus research may proceed in parallel, but public content must use the implemented presentation contract and canonical-only source.

Track labels distinguish product/IA, anchor guides, organizational diversity, bounded Cases, Compare/Questions, trust/evidence, visual design, Depictions, and platform/process work.
They classify issues; they do not create model inheritance.

## Audit interpretation

`pnpm audit:delivery -- --live-project` exits 0 only for a clean readable Project, 1 for policy drift, and 2 when credentials, the API, or input are unavailable.
The audit is read-only.
Fix state only when authorized, then rerun it.
