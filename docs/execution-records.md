# Recorded executions

The execution recorder binds one supported command to its issue, current private
assignment, source input and [governed environment](environments.md).
It records actual child-process completion without a second handwritten status
update.
GitHub remains the issue authority; the store neither edits Project fields nor
publishes review markers.

## Start and inspect a run

Choose an explicit absolute private store outside the worktree.
The parent directory must exist, and paths must use their canonical spelling
(for example, `/private/tmp`, rather than its macOS `/tmp` alias).
The recorder creates the store with mode 0700 and files with mode 0600.
Existing stores and the supplied assignment file must be owned by the current
user and inaccessible to other users.
Use the fresh version 2 assignment file described in the delivery policy.

```sh
pnpm --silent execution:run --store /private/tmp/task-executions \
  --private-state /private/tmp/task-ownership.json --issue 330 \
  --command readiness --authorization operator-confirmed
pnpm --silent execution:status --store /private/tmp/task-executions \
  --private-state /private/tmp/task-ownership.json --issue 330 --format markdown
```

The first command writes its own terminal event and JSON status.
Use `--silent` for the package-manager invocation to keep its command echo,
which can include private argument paths, out of the report stream.
Its exit status preserves a normal child's actual nonzero result; interruption
or launch failure returns nonzero, and unavailable recording returns 2.
Read the current record's `exitCode`, `signal`, `phase` and scope; an outer tool
observation timeout does not establish any child outcome or authorize a retry.
Status itself returns zero for a readable report even when that report describes
a failed command.
Malformed or inaccessible evidence returns a bounded, redacted unknown result.

Supported commands are `readiness`, `verify`, `build`, `test`, `coverage`,
`routes`, `browser`, `delivery`, `focused-test` and `focused-coverage`.
The catalogue in `scripts/execution-commands.ts` owns their direct argv arrays.
Both focused entries accept one to six repeated `--file tests/path/name.test.ts`
arguments; arbitrary flags, shell wrappers, external paths and script fragments
are rejected.
The coverage command preserves its actual exit status even if test assertions
passed before a coverage threshold failed.
No assertion-count inference from free-form logs changes that result.
The catalogue is intentionally bounded; extend it through reviewed source changes
when another command is needed.

The recorder reuses the environment entry rules before launching substantive
commands.
Readiness remains a diagnostic command capable of recording an unavailable
prerequisite.
Scoped results remain scoped even when their direct child exits zero.
The recorder does not install dependencies, request approval, probe the network,
reserve preview ports or automatically retry.
A selected command such as full verification retains its existing explicit
network and owned preview requirements.

## Evidence and publication

Every run records issue, UUID, assignment identity, starting and ending source,
command name and argv, observed timestamps, runtime/package-manager/browser
identity, environment fingerprint and its own private log reference.
It does not capture the process environment or accept arbitrary command secrets.
Output logs are private, bounded raw command output; do not publish them without
review, since a supported tool can still print private diagnostics.

Public JSON and Markdown contain only allowlisted phases, command scopes,
commit/digest identities, result codes, timings, blockers and next actions.
They exclude paths, owner identities, run UUIDs, PIDs, arbitrary errors, raw logs
and environment values.
`--private --format json` adds the validated private events and run identities;
use it only for local coordination.
Unknown timing intervals stay unknown, and the report claims no time savings.

A recent spawned/heartbeat observation means `active-process`, not perpetual
liveness.
After 30 seconds without a fresh heartbeat, the report becomes `unknown`.
Prepared-only history is also unknown: the runner could have died immediately
before or after attempting a spawn.
Explicit precondition failures and operator notes record `not-started`.
Actual spawn failure, success, nonzero completion and signal interruption remain
distinct terminal outcomes.
An authorization note is an operator assertion, never a tool permission grant:

```sh
pnpm --silent execution:note --store /private/tmp/task-executions \
  --private-state /private/tmp/task-ownership.json --issue 330 \
  --command verify --reason APPROVAL_REPORTED_DENIED \
  --authorization operator-confirmed
```

Other supported reasons are `CAPABILITY_REPORTED_UNAVAILABLE` and `USER_PAUSED`.
A failed local precondition uses a separate enforcement category.

An exact full local PASS additionally requires the recognized `pnpm verify`
command, clean unchanged starting/ending/current input, matching current
assignment and environment, and one new #329 verified static artifact receipt.
The receipt must match the ending fingerprint, actual `dist` file digest and
the UUID supplied by this live recorder to its owned child.
The optional `executionRunId` is private correlation metadata outside both
fingerprint and content digest; schema version 1 standalone receipts without
it remain valid #329 artifacts but cannot establish #330 run attribution.
Missing, malformed, wrong-run or multiple newly observed receipts remain
unavailable for this association.
This records an observed association, not protection against a malicious writer
with the same filesystem privileges.
An old receipt, missing receipt, changed input or incompatible environment cannot
satisfy this boundary.
A build result is build evidence; test success is test evidence.
Neither substitutes for full verification, independent review, hosted CI,
merge or static Pages deployment.
Fingerprint equality is diagnostic evidence, not hermetic reproducibility.

## Offline and bounded refresh

Status is read-only and offline by default, including no Git fetch or `gh` call.
It inspects current local Git and environment evidence and timestamps unavailable
ownership or identity instead of treating it as clean.
Explicit refresh reuses the shared bounded GitHub transport:

```sh
pnpm --silent execution:status --store /private/tmp/task-executions \
  --private-state /private/tmp/task-ownership.json --issue 330 \
  --refresh --pr 335 --hosted-source 0123456789012345678901234567890123456789
```

Refresh has a 30-second overall deadline and the existing 16 MiB response bound.
It requires complete paginated check counts, unique check identities and the
reported PR head; unavailable reads remain unavailable.
A separate failing security check prevents a checks-passed observation.
The optional hosted source is an explicitly supplied receipt commit, not a
claim that the recorder fetched or validated a hosted artifact.
A synthetic PR merge maps to the branch input only when GitHub returns equal
source trees and the exact base/head parent pair.
Hosted checks, merge state and this source mapping are reported separately;
production deployment stays unavailable here.
Use the existing integration and Pages artifact review for those remaining gates.

## Atomicity, concurrency and recovery

Schema version 1 uses immutable, numbered events with predecessor hashes.
An event is written and fsynced privately, then published with an exclusive hard
link and directory fsync.
Competing writers using the same predecessor cannot overwrite the winner;
a loser reports an explicit conflict and performs no automatic retry.
Allocation uses a short exclusive directory lock so concurrent run creation
cannot silently exceed the store limit.
Different runs retain separate history and log files.

Stores are bounded to 256 runs, 256 events per run, 32 KiB per event, 4 MiB per
log and 1 MiB per rendered report; private assignment input is bounded to 1 MiB.
Logs drain after their cap and set `logTruncated` rather than filling the disk.
The runner records heartbeats every 10 seconds and enforces a 15-minute command
limit.
Interruption and timeout forward termination only to the process group actually
spawned by that live runner, with a five-second kill fallback.
Historical PIDs are never used to recover, adopt or terminate processes.

A crash may leave a prepared run, a stale heartbeat, an unpublished `.pending-*`
file or the `.allocation` lock.
Readers ignore unpublished events and report incomplete allocation observations;
they never repair or invent completion.
A retained allocation lock blocks new runs explicitly.
After inspecting preserved evidence and confirming the former recorder has
ended, an operator can archive that store and select a fresh private store.
No automated deletion, lock breaking, history rewriting or migration occurs.
Unknown schema versions and invalid chains fail closed.
Keep version 1 stores with their matching reader; a future migration requires an
explicit reviewed converter into a separate store.

Retention is explicit: preserve the private store with task evidence until its
coordinator approves owned cleanup, then archive or delete only that owned store.
Never infer cleanup authority from a stored PID or stale assignment.
The small recorder demonstration establishes this interface; #324 remains the
first existing-work pilot and measures whether coordination effort improves.
