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

Completed, locally verified work opens as ready for review by default.
Draft pull requests are reserved for explicitly experimental approaches or deliberate early-feedback checkpoints with substantial known work remaining.
Their linked issues remain `In progress`; the live audit rejects both a non-draft open pull request left `In progress` and a draft pull request represented as `In review`.
Mark the pull request ready before moving its issue to `In review`.

Stack pull requests only for a real dependency chain in the same repository.
The bottom layer targets `main`; each upper layer targets the branch directly below it and stays independently reviewable.
Unrelated work remains parallel.
The live audit verifies a pull request against its declared base branch rather than assuming every reviewed branch targets `main`.
Merge stacks bottom-up with rebase integration, and repeat exact-head checks and attestations whenever GitHub automatically rebases or retargets an upper layer.
Cross-cutting audits are capstone sweeps rather than default stack layers.
After a contributing content or interface tranche lands, rebase and rerun the applicable corpus-integrity, presentation-consistency, navigation, accessibility, and delivery audits over the combined baseline before integrating their findings.

Review evidence is valid only for the pull request's exact current head.
An actual Copilot review is accepted only when GitHub reports the trusted bot identity and that exact reviewed commit.
After a separately assigned review, a repository owner, member, or collaborator records this machine-readable, privacy-safe PR comment:

```text
Independent adversarial review: APPROVED
Head: <full-40-character-commit-oid>
```

If a normal Copilot request produces no review, absence alone never passes.
A trusted repository association must explicitly record the fallback:

```text
Copilot review: UNAVAILABLE
Head: <full-40-character-commit-oid>
```

The harness reports Copilot as `reviewed`, `unavailable`, or `missing`.
An actual exact-head review takes precedence over the fallback.
The pull-request template checkbox records workflow completion but is deliberately not accepted as audit evidence by itself.
A rebase or remediation commit invalidates every head-bound signal and requires fresh review and attestation.

GitHub can verify the current head, Copilot review identity and commit, comment text, and whether an attester is an owner, member, or collaborator.
It cannot prove which internal agent performed the independent review or why Copilot returned nothing.
The public marker is therefore the repository coordinator's accountable assertion that a separately assigned review occurred, not cryptographic proof of internal-agent independence.
Keep internal agent handles, assignments, worktree paths, quota state, and operational explanations in private coordination state rather than public review evidence.

For open pull requests created under the earlier contract, add the two-line adversarial marker for the exact current head after independent review.
When Copilot is known to be unavailable for the delivery window, do not repeat requests on every pull request; add the two-line unavailable marker instead.
Do not rewrite unrelated review history; after any rebase, repeat review and replace the stale evidence with new exact-head markers.

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

Copilot, or its explicit unavailable status after a normal request, and an independent adversarial review remain process requirements even though branch protection does not require an approving review.
Conversation resolution, strict checks, and linear history remain repository gates.
