# Delivery harness

The delivery harness makes repository gates and the private active-delivery Project inspectable without turning the Project into a second backlog.
Issues and milestones remain authoritative for scope and outcomes.

## Full verification

Use [recorded executions](execution-records.md) for durable command outcomes and
read-only status; command success, full verification and hosted evidence stay distinct.

Follow the [environment matrix](environments.md) for toolchain selection, isolated dependency setup, configuration and explicit capability probes.
Install dependencies and the browser runtime once, then run the same verification path CI owns:

```sh
node scripts/environment-entry.mjs command
pnpm install --frozen-lockfile
pnpm exec playwright install chromium
pnpm environment:check
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
Domain validation runs transitively through the guarded `pnpm build` entry, followed by the fixed Astro static build.
The shared CI composite action invokes this command once; Pages consumes the resulting verified `dist` artifact.

`markdownlint-cli2` currently pins `smol-toml` to a release affected by
[GHSA-7w5x-hrqm-74c2](https://github.com/advisories/GHSA-7w5x-hrqm-74c2).
The root pnpm workspace configuration therefore overrides only the
`markdownlint-cli2>smol-toml` edge to
[version 1.8.0](https://github.com/squirrelchat/smol-toml/releases/tag/v1.8.0),
a patched version already used elsewhere in the dependency graph.
Remove the override when a maintained `markdownlint-cli2` release depends on a
patched `smol-toml` version, after regenerating and reviewing the lockfile and
exact dependency provenance inventory.

Repository-only verification deliberately prints `Project state: UNAVAILABLE` because pull-request jobs do not receive credentials for the private user Project.
This is an explicit unavailable message, not evidence that Project state is clean; repository-only mode exits 0 when its repository and skill audits pass so credential-free CI can succeed.
It likewise prints `Backlog integrity: UNAVAILABLE`: a repository checkout does
not contain authoritative issue bodies, so offline verification neither calls
GitHub nor claims the open backlog is clean.

## Project-state audit

An authenticated coordinator with read access can audit live execution state separately:

```sh
pnpm audit:delivery -- --live-project --private-state /secure/path/delivery-state.json
```

The command is read-only and never changes Project visibility.
Authenticated mode exhausts GitHub's REST pagination and retrieves every open
repository issue, excluding pull requests returned by the shared endpoint and
including issues outside the delivery Project. Any page or schema failure
fails the live audit closed. It reports literal escaped control
sequences, terminal formatting, likely pasted command/test transcripts,
implausibly large acceptance sections, and conservative likely-duplicate
active scope. Findings include issue numbers and remediation, but the audit
never edits or closes an issue. Long research context and fenced code examples
are ignored by the paste heuristics; duplicate detection excludes closed
issues and explicit umbrella, parent, child, subtask, and follow-up
relationships.
The explicitly supplied version 2 JSON file owns active assignments and explicit flow decisions. Generate it in private coordination storage; `.delivery-private-state.json` is ignored for local use. Never commit real owner identities, paths, instruction references, or operational evidence. The synthetic example is `tests/fixtures/delivery/private-state.example.json`; `scripts/delivery-private-state.ts` is the runtime schema.

The file contains the repository name, `generatedAt`, `expiresAt`, `coordination`, `researchBuffer`, `retained`, and `assignments`:

- `coordination` records `mode` (`running` or `user-paused`), `changedAt`, `instructionEvidence: true`, a private `instructionRef`, and `finishStarted` reflecting the actual user instruction. It never grants authorization itself.
- `researchBuffer` lists zero to three prepared open issues, separately from Ready and selected implementation. Ready has no mandatory minimum; executable eligibility and deterministic ordering remain enforced.
- Each `retained` record identifies an issue and its `selected`, `parked`, or `unclassified` disposition, decision timestamp/reference, whether work started (`true`, `false`, or `null` when unknown), nullable original start/resumption timestamps, preserved branch and evidence references, canonical public PR URLs for this repository (no credentials, query, or fragment), next review condition, and cleanup-pending state. See the example for exact fields. Record-level booleans are privacy-safe attestations backed by the private references, not substitutes for authoritative Git/PR evidence.
- `observation` records phase, observation time, and whether supporting evidence exists; `observationRef` retains that evidence privately. Supported observed phases are `active-process`, `local-candidate`, `dependency-block`, `approval-tool-block`, and `unknown`. An active-process observation requires a currently observed running command tied to the task and actual process identity/liveness, not an assignment or PID alone; the report treats process observations older than one minute as unknown. Local-candidate evidence identifies a concrete head/diff; block evidence identifies the dependency or actual tool/approval result. Do not freshly date an old observation merely because it was copied.
- Each current assignment has one `owner`, `branch`, `worktree`, `observedAt`, and `expiresAt`. Assignment validity is independent of the outer file timestamp. Historical owners stay in preserved evidence, never in current assignments unless explicitly reassigned after inspection.

The file's `generatedAt` cannot be future or more than 24 hours old. Its `expiresAt` must be later than both generation and audit time, at most 24 hours after generation. Each assignment likewise needs a nonfuture observation and unexpired validity interval of at most 24 hours. Rewriting the file does not renew an expired assignment. Missing ownership is a policy finding; unreadable input is `UNAVAILABLE`; malformed, duplicate, long-lived, future, or expired input is `INVALID`. All fail closed. Private schema diagnostics omit raw field values. PR reads send only the public numeric identity and redact downstream command/API error details.

### Grooming and capacity report

The normalized snapshot adds `flow` with privacy-safe coordination metadata, research issue numbers, and retained records. It excludes owner identities, filesystem paths, freeform operational conditions, and evidence references. The CLI reports mode, selected unfinished occupancy (maximum three, including reserved not-started selections), started-unmerged occupancy, unknown-start count, known unfinished inventory, parked count, and prepared-research occupancy. Per-issue rows show disposition, effective phase, underlying observed phase, open-PR presence, authoritative completion, cleanup state, evidence age, and start age. Missing historical dates display `unknown`. A preserved non-process classification may have unknown age; that does not claim its condition was freshly retried.

Project status cannot free selected capacity: review and selected blocked work count. Parking is explicit, preserves evidence and a next review condition, and remains visible outside the Project. A concrete Project Blocked condition may coexist with deliberate parking; parking is execution disposition, not deletion of the dependency. In progress and In review cannot simultaneously claim to be parked. Current ownership or live process evidence also contradicts unfinished parked disposition. Known post-pause starts and resumptions are rejected across every disposition; harmless parked PRs and unknown historical start dates do not require blanket revalidation. A parked open PR stays intact and requires explicit reselection and renewed applicable gates before integration. No blanket current-base comparison is performed for parked records.

The live loader rejects a Project item-list response unless its required nonnegative `totalCount` equals the returned item count; hitting the bounded read ceiling cannot produce a clean partial report. It reuses the complete bounded open-issue inventory for Project and retained issues. It performs targeted reads only for missing identities and explicitly linked PRs. Retained records outside the Project are included without adding Project cards. A missing classification remains a finding and blocks promotion; excess inventory is never automatically parked or truncated. Promotion requires explicit selection, running mode, an executable Ready issue, available selected capacity, and an open implementation workstream slot.

Snapshot evidence cannot establish that every historical branch was disclosed, prove a past human instruction, or turn a private completion flag into a merge. Closed implementation issues alone remain unfinished until linked authoritative merge evidence exists. Authoritatively merged work with cleanup pending stays visible and releases unmerged capacity; the existing cleanup and Done reconciliation obligations still apply. The report is a classification/count/age contract. The [execution recorder](execution-records.md) separately records actual child outcomes, heartbeats and bounded elapsed intervals; it does not infer historical waiting time or retry automatically.

### Explicit migration from version 1

Version 1 fails with an explicit migration-required result. Preserve the original file, historical evidence, and grooming decisions separately before preparing a candidate. `proposeDeliveryStateMigration` in `scripts/delivery-state-migration.ts` returns a private reviewable candidate and the unchanged historical data; it performs no writes. It retains every legacy issue as unclassified retained work with unknown start state and observation times, preserves an explicit historical reference, and leaves active assignments empty. It does not reactivate expired owners, infer authorized parking, or trim surplus work.

Reconcile that proposal against current assignments, authorized grooming manifests, retained worktree inventory, issue/PR state, and actual user instructions. Preserve issues, branches, acceptance criteria, research, review evidence, unknown dates, and ambiguous mappings. Apply only individually supported selected/parked decisions, with the original decision times where known. Review stale blanket publication holds against actual authorization individually; neither copy all holds forward nor universally remove them. Add current ownership only after inspection and explicit assignment; keep expired historical owners in the preserved original. Retain parked candidates even if absent from the Project, and preserve separately deferred work and cleanup-pending merged records.

Run the normalized candidate audit first and inspect all counts and findings. Resolve excess selected work through an explicit decision without silently moving or dropping records. A fresh candidate file is not fresh historical evidence. The coordinator activates the reviewed private candidate only after this reconciliation, then uses targeted readback for affected issue/Project transitions. The migration helper is a proposal builder, not an automatic active-state conversion or board writer.

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
For an active item with one open linked pull request, the live audit uses
GitHub's declared head and base as authoritative and requires the private
assignment branch to match the PR head. Without an open pull request, it does
not publish or query the private branch through GitHub. It instead checks the
assigned local worktree, checked-out branch and ref, expected `origin`, and
linear commits after the branch's unique merge base with a locally stored
`origin/main`. A 15-second, noninteractive `git ls-remote` network request proves
that local tracking ref is not stale; credential and terminal prompts are
disabled. Here, read-only means the audit mutates
neither the repository nor GitHub; live mode still requires network access.
If `main` advanced after implementation began, the audit reports the
branch as not current but does not fail In-progress work or require constant
rebases; current-base evidence becomes mandatory at review handoff.

The assigned path must be an exact registered worktree of the coordinator's
repository, proven through the shared Git directory and worktree inventory; a
separate clone with the same remote is rejected. Missing or mismatched
worktrees, branches, refs, and remotes; unavailable or
stale `origin/main`; unrelated or ambiguous histories; merge commits; and Git
command failures all fail closed with actionable classifications. Output names
only the issue and classification, never the assignment owner or worktree path.
Multiple open linked pull requests remain ambiguous and fail closed without
falling back to local evidence.
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

Generate review-marker body files with the repository emitter so the body has
the exact two lines accepted by the audit and no terminal newline. Set
`REVIEWED_HEAD_OID` to the exact commit that completed the independent review
or Copilot-request disposition, then confirm the pull request still has that
head immediately before generation:

```sh
(
  set -eu
  pr_number="${PR_NUMBER:?Set PR_NUMBER to the reviewed pull-request number}"
  expected_head="${REVIEWED_HEAD_OID:?Set REVIEWED_HEAD_OID to the reviewed 40-hex head}"
  current_head="$(gh pr view "$pr_number" --json headRefOid --jq .headRefOid)"
  test "$current_head" = "$expected_head"
  marker_dir="$(mktemp -d)"
  marker_file="$marker_dir/review-marker.txt"
  trap 'rm -f "$marker_file"; rmdir "$marker_dir"' EXIT
  pnpm emit:review-marker --kind independent-approved --head "$expected_head" --output "$marker_file"
  gh pr comment "$pr_number" --body-file "$marker_file"
)
```

Use `--kind copilot-unavailable` only after the normal Copilot request produces
no review. The emitter validates an exact lowercase 40-hex commit OID, refuses
to overwrite its output file, and never calls GitHub. A changed pull-request
head invalidates the marker; repeat the review or request disposition and
generate a new file for the new head.

For open pull requests created under the earlier contract, add the two-line adversarial marker for the exact current head after independent review.
When Copilot is known to be unavailable for the delivery window, do not repeat requests on every pull request; add the two-line unavailable marker instead.
Do not rewrite unrelated review history; after any rebase, repeat review and replace the stale evidence with new exact-head markers.

For diagnosis or fixture development, pass a stored normalized snapshot:

```sh
pnpm audit:delivery -- --project-snapshot tests/fixtures/delivery/project-valid.json
```

## Safe issue-body creation

Create issue bodies as Markdown files and pass the file directly instead of
embedding escaped newlines or command substitutions in a shell argument:

```sh
gh issue create --title "Focused outcome" --body-file /path/to/issue-body.md
```

Keep terminal output out of the body unless a short excerpt is essential; put
intentional examples in a fenced code block and summarize verification results
in prose. Before coordinating the issue, inspect the rendered body with
`gh issue view <number> --web` or the GitHub interface. Check that headings and
checkboxes render, inline-code operands remain present, no literal `\n` text or
terminal color sequences appear, and the scope is not already owned by another
open issue. API callers should send a JSON body value containing real newline
characters rather than pre-escaping Markdown and then escaping it a second
time.

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

## Browser-test isolation

Each Playwright invocation starts and owns its preview server. Its default port
is derived from the absolute worktree path, so concurrent branches do not share
the repository-wide Astro default; an occupied selected port fails closed
instead of reusing an unknown listener. Set `PLAYWRIGHT_TEST_PORT` to a valid
unoccupied port only for a scoped focused browser or preview entry, as defined
in the [environment contract](environments.md); full verification rejects the
override. The server remains
non-reusable in every environment, which proves the suite is exercising the
preview process started from the current worktree and its local `dist` build.

Static page navigation waits for the application-owned render boundary rather
than global network quiescence. `DOMContentLoaded` establishes that the HTML
response was committed, the document was parsed, and synchronous scripts ran;
the shared browser helper then requires the visible `main#main-content`
landmark.
Individual tests use web-first assertions for the exact content or geometry
they need. A pending analytics request, remote font download, or other
third-party connection therefore cannot redefine whether an application page
is ready. The suite rejects `waitUntil: "networkidle"` as a readiness signal.
Published pages also use deliberate local system sans, serif, and monospace
stacks and contain no externally hosted font resource. This keeps the rendered
site private, deterministic, and readable without a font provider; any future
webfont must first be locally hosted and pass licensing and provenance review.

Playwright retries are disabled locally and in CI. A retry is actionable flake
evidence, not a successful result: diagnose whether the assertion belongs to
the application, browser engine, or an external dependency, then repair that
boundary. Stress repetitions use `--repeat-each` with `--retries 0` so every
iteration remains visible.

Browser engines own modifier- and middle-button tab creation and document
commit. Hosted headless Chromium does not expose those lifecycle events
reliably, so the suite stops at the product-owned boundary: the rendered value
must be a real anchor with its exact `href` and no forced `target`, and neither
its cancelable modifier `click` nor button-1 `auxclick` event may be prevented.
After application load, the test installs a terminal window listener that
records cancellation after target and document handlers, then prevents the
synthetic default navigation itself. The anchor remains unchanged throughout,
so delegated `a[href]` handlers and synchronous attribute mutations remain
observable. Negative tests install `preventDefault()` independently for each
event path and through a delegated document handler, proving the contract check
fails. The modifier assertion
selects `Meta` on macOS and `Control` elsewhere rather than relying on an
environment-dependent alias.
No-JavaScript anchors use focused Enter activation and wait for their exact URL
condition; forced activation is not an acceptable substitute for native
navigation. To repeat the two regression cohorts without diagnostic retries:

```sh
pnpm review:visual tests/visual/rendered-pages.spec.ts \
  --grep "mobile links preserve|subject guide works without JavaScript" \
  --repeat-each 50 --retries 0
```
