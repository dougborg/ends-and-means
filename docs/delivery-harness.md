# Delivery harness

The delivery harness makes repository gates and the private active-delivery Project inspectable without turning the Project into a second backlog.
Issues and milestones remain authoritative for scope and outcomes.

## Full verification

Install dependencies and the browser runtime once, then run the same verification path CI owns:

```sh
pnpm install --frozen-lockfile
pnpm exec playwright install chromium
pnpm verify
```

`pnpm verify` audits repository delivery configuration, skill coverage, and the
asset/provenance inventory, then runs linting, static analysis, dependency
audit, type checks, coverage, the `pnpm build` script, content-integrity audit,
rendered-route tests, and browser review.
The provenance gate classifies every tracked path, reconciles every direct and
optional manifest dependency plus every exact package/version key in the
`pnpm-lock.yaml` packages table, rejects unregistered governed asset types and stale asset
class states, and prevents unresolved third-party material from being marked
for site distribution.
See [the licensing audit](licensing-audit.md) for the inventory boundary and
owner decisions; the harness does not select a license.
Domain validation runs transitively through `pnpm build`, which is defined as `pnpm validate && astro build` in `package.json`.
The shared CI composite action invokes this command once; Pages consumes the resulting verified `dist` artifact.

Repository-only verification deliberately prints `Project state: UNAVAILABLE` because pull-request jobs do not receive credentials for the private user Project.
This is an explicit unavailable message, not evidence that Project state is clean; repository-only mode exits 0 when its repository and skill audits pass so credential-free CI can succeed.

## Project-state audit

An authenticated coordinator with read access can audit live execution state separately:

```sh
pnpm audit:delivery -- --live-project
```

The command is read-only and never changes Project visibility.
Live and snapshot modes exit 0 for a clean readable snapshot, 1 for policy findings, and 2 for `INVALID`, `UNAVAILABLE`, or `ERROR` results, including invalid input, credentials or API access failures, and unexpected execution errors.
Runtime schemas reject malformed API and snapshot data before policy analysis and distinguish invalid input, unavailable API access, and unexpected execution errors.
Tests use normalized fixtures for Ready eligibility, implementation WIP, workstream capacity, ownership, current-base and linear-history evidence, review evidence, staleness, blocked conditions, track labels, learner dependencies, and issue/PR/status reconciliation.
Ready reports are deterministically sorted by Priority (`Now`, `Next`, `Later`) and then issue number; they never infer order from GitHub's item-list response.
An active In-progress branch must have a successful base comparison, but `main` advancing during implementation is not a failure and does not trigger rebase churn.
Current-base evidence becomes blocking at In-review handoff and remains required for integration.

Review evidence is valid only for the pull request's exact current head.
Copilot must have submitted a review on that commit, and the independent reviewer must leave this machine-readable PR comment after completing review:

```text
Independent adversarial review: APPROVED
Reviewer: /root/<independent-agent-name>
Head: <full-40-character-commit-oid>
```

The pull-request template checkbox records human workflow completion but is deliberately not accepted as audit evidence by itself.
A rebase or remediation commit invalidates both head-bound signals and requires fresh reviews.
The implementation owner and reviewer must both use canonical, case-sensitive `/root/<segment>[/<segment>...]` identities, where every segment contains only lowercase ASCII letters, digits, or underscores.
The paths must differ; missing or malformed ownership fails closed.
Because local agents share the repository owner's GitHub authentication, this marker is auditable process evidence, not cryptographic proof of identity or independence.

For diagnosis or fixture development, pass a stored normalized snapshot:

```sh
pnpm audit:delivery -- --project-snapshot tests/fixtures/delivery/project-valid.json
```

## Owned signals

| Signal | Owner | Purpose |
|---|---|---|
| `verify` | CI shared verification action | pnpm-backed repository, skill, lint, analysis, dependency, type, coverage, build, route, and browser checks. |
| `dependency-review` | Security workflow | Reject vulnerable dependency changes in pull requests. |
| `codeql` | Security workflow | JavaScript and TypeScript static security analysis. |
| `workflow-analysis` | Security workflow | Pinned-action and GitHub Actions security analysis. |

The strict names are branch-protection interfaces and should not be renamed casually.
Workflows use least-privilege permissions, immutable action SHAs, frozen pnpm installs and cache keys, non-persistent checkout credentials, and no `pull_request_target` execution.
Workflow `run` scalars conservatively reject any unescaped `$(` sequence or backtick outside ordinary single-quoted or commented text, including arithmetic expansion and heredoc bodies.
Express dynamic operations as explicit steps so command ownership remains auditable without relying on a partial shell parser.
The audit likewise rejects any unquoted, unescaped verify-owned command token sequence anywhere in a run segment, including wrapper, environment-prefix, and control-flow forms; use the shared verification action instead.
The Pages deploy job receives write permissions only after the read-only verified build succeeds.

Copilot and an independent adversarial review remain process requirements even though branch protection does not require an approving review.
Conversation resolution, strict checks, and linear history remain repository gates.
