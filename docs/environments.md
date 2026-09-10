# Supported environments

Run supported commands from the root of the task-owned Git worktree on macOS or Linux (including Linux WSL).
The exact build/test runtime comes from [`.node-version`](../.node-version); [`.nvmrc`](../.nvmrc) must agree.
The `engines.node` major range in [`package.json`](../package.json) expresses compatibility, while supported repository entries require the exact pin for comparable verification evidence.
`packageManager` in that same manifest is the authoritative pnpm version.
Entry guards resolve and execute Node and pnpm from PATH, compare actual versions, and check that the executing Node is the resolved executable.
They never select a developer-specific installation path or download another toolchain.

## Environment matrix

| Environment | Runtime and inputs | Configuration and capabilities | Commands, outputs, ownership |
| --- | --- | --- | --- |
| Local development / agent execution | Exact declared Node/pnpm; complete task-owned frozen dependencies; macOS/Linux; worktree root | Local profile; optional development host/port arguments; permission to bind for a server; no GitHub credentials required | `pnpm dev`; task owns server and `.astro`; stop its own server when done |
| Deterministic static build | Same toolchain, manifest, workspace policy and lock; canonical source and `astro.config.ts` | No dotenv/public environment inputs or build target arguments; Astro owns static output and production site | `pnpm build` validates then builds `dist`; task owns output; build alone is not verification |
| Unit / coverage / route testing | Same toolchain and installed graph; Vitest from lock; route tests consume built `dist` | Local maximum 3 Vitest workers; hosted automatic allowance resolved as available parallelism minus one (minimum 1); timeouts, isolation, retries and coverage floors unchanged | `pnpm test`, `pnpm test:coverage`, `pnpm test:routes`; task owns `coverage`; focused assertions cannot satisfy global coverage floors |
| Managed browser testing | Same toolchain; lock-governed Playwright and its Chromium revision; built `dist` | Owned `127.0.0.1` preview with worktree-derived port; foreground process; no server reuse and zero retries; loopback permission required | `pnpm test:visual` or `pnpm review:visual`; Playwright owns preview lifecycle and `.artifacts/visual-review`; browser cache is shared and is not task cleanup |
| Hosted verification | Shared [verify action](../.github/actions/verify/action.yml); Ubuntu runner; checkout source and full history; same pinned Node/pnpm; frozen install; Chromium with OS dependencies | `CI=true`; registry and browser installation network; advisory access; repository checks require no Project credentials; local sandbox restrictions do not describe hosted access | `pnpm verify`; full gate, coverage/browser evidence, environment evidence and verified `dist`; runner owns temporary checkout |
| Static production | [Pages workflow](../.github/workflows/pages.yml) consumes the successful main-commit verification job's Pages artifact | Production origin is `https://endsandmeans.info` from Astro configuration; no Node application server, package manager, runtime secrets, or preview port at the serving origin | Pages deploys the uploaded `dist` without checkout or rebuild; GitHub artifact/deployment identity links the verified commit to production |

The development server, managed test preview, and production origin have different lifetimes and purposes.
Changing an environment assumption requires updating its code authority and this matrix together.
Local three-worker and hosted automatic profiles are intentional: previous unchanged tests crossed the five-second deadline in some local runs, while a scoped three-worker full run and hosted runs passed.
Those observations do not prove a cause or a fixed flake; readiness cannot guarantee future timing.
No timeout, assertion, retry, isolation, or coverage gate is relaxed.

## Isolated setup, check, and run

Select the pinned Node and pnpm using your existing version manager or installation, then run:

```sh
node scripts/environment-entry.mjs command
pnpm install --frozen-lockfile
pnpm exec playwright install chromium
pnpm environment:check
pnpm dev
```

The built-in guard runs before dependencies exist.
Use a real `node_modules` directory owned by this worktree, with pnpm's normal isolated linker and virtual store inside it.
Reuse pnpm's normal content-addressable store; do not symlink another task's mutable installation.
An existing complete store can support `pnpm install --offline --frozen-lockfile`; a missing cached package requires an explicitly authorized online installation, not a lock change or warning override.
CI adds `--with-deps` to Chromium installation on Ubuntu.
Neither default inspection nor entry guards install, delete, clear caches, stop foreign processes, or retry.

For focused authoring after setup:

```sh
pnpm build
pnpm test
pnpm test:routes
REVIEW_ROUTES=/cases/example/ pnpm review:visual
```

Replace the example test/route with the affected existing target.
The `test` command already selects the core test directories; for a single exact file use `node scripts/environment-entry.mjs command` followed by `pnpm exec vitest run tests/content/example.test.ts`.
Run the full gate once at final handoff, renewing affected evidence after changes:

```sh
pnpm verify
```

`verify:checks` is an internal stage containing the existing full chain; supported handoff evidence is produced by `pnpm verify`, which inspects readiness first, runs every gate, requires source stability, then fingerprints the actual output.
No additional full run is required merely because the diagnostic was added.
Exact-head hosted checks, independent review, browser tests and post-merge deployment verification remain required.
The preserved #324 candidate is the first existing-work pilot after the supporting tools land; this issue's isolated implementation checks do not replace that pilot.

## Configuration names, defaults, and precedence

| Name | Supported use and precedence |
| --- | --- |
| `PATH` | Select exact Node/pnpm before command entry; resolved paths remain private and are never fingerprinted |
| `CI` | Unset locally; `true` or `1` selects hosted resource/reporting/forbid-only behavior; other values fail |
| `VITEST_MAX_WORKERS`, `VITEST_MIN_WORKERS` | Ambient overrides fail; `vitest.config.ts` consumes the shared resource profile |
| `PLAYWRIGHT_TEST_PORT` | Unset by default; hash-derived worktree port in `browser-test-harness.ts`; scoped focused browser/preview commands may use an integer 1024–65535; global/full-gate use fails |
| `REVIEW_ROUTES` | Unset for full verification; a scoped comma-separated filter is allowed for focused browser review only |
| `CONTENT_PREFLIGHT_BASE` | Unset for full verification; focused preflight uses CLI `--base=` first, then nonempty environment value, then merge-base with `origin/main` |
| `ASTRO_PREVIEW_BACKGROUND` | Managed Playwright launch explicitly sets `0` to keep the server foreground; other explicit values fail |
| `NODE_ENV` | Unset for full verification and build; each underlying tool selects its normal environment |
| `NODE_OPTIONS` | Nonempty ambient values fail supported entry checks because loaders/options change execution |
| `PUBLIC_*`, `VITE_*`, `.env*` build/development files | No application environment inputs are supported; public-prefixed variables and standard dotenv files fail the guard; keep secrets out of browser inputs |
| Package-manager registry credentials | Only installation or explicit audit uses the normal pnpm credential resolution; values, registry URLs and raw audit errors are never diagnostic output |
| GitHub credentials | Not required by `pnpm verify`; an explicitly authorized `pnpm audit:delivery -- --live-project --private-state ...` uses the separate delivery access contract |
| Playwright cache configuration | `PLAYWRIGHT_BROWSERS_PATH` may locate the lock-governed installed executable; the diagnostic records revision and availability, never cache paths; browser installation is explicit |

Full verification accepts no scope or target arguments and rejects global base, route and port overrides.
`pnpm build` rejects target/configuration arguments so the verified artifact cannot silently move away from `dist`.
Raw `pnpm exec` commands are useful for intentionally scoped investigation but do not replace the supported entry guards or full gate.

## Readiness and explicit probes

`pnpm environment:check` emits versioned JSON using local reads and bounded executable-version queries only.
It checks declarations, actual executables, effective direct and transitive dependency resolution, installed-lock equality, the current repository's dependency policy, output ownership/access metadata, browser executable availability, and incompatible full-gate configuration.
It parses YAML rather than relying on `.modules.yaml` serialization style.
Script-only manifest edits do not invalidate installation; dependency specifier changes, installed lock drift, broken resolution or relocated shared modules do.
New dependency-policy fields outside the current repository contract fail explicitly rather than being silently ignored.
This is a readiness check, not a package-content integrity audit.

Only request capability probes when needed and already authorized:

```sh
pnpm environment:check -- --preview
pnpm environment:check -- --advisory
```

The preview probe owns one short-lived loopback socket, releases it on success/error/interruption and never connects to or terminates another listener.
It is not an Astro/browser launch and cannot reserve the test port.
The actual Playwright isolation guard remains authoritative.
The advisory probe runs the real `pnpm audit --audit-level=moderate --json` with no retries and a bounded timeout; a connectivity ping never passes it.
Unavailable registry access is distinct from a moderate-or-higher vulnerability finding.
The normal full audit remains unchanged.

| Result family | Meaning and next action |
| --- | --- |
| `NODE_MISMATCH`, `PNPM_MISMATCH`, `TOOLCHAIN_*` | Select or reconcile declared executable sources, then inspect again |
| `DEPENDENCY_*` | Inspect manifest/lock/policy, missing packages or relocation; explicitly perform the task-owned frozen setup when appropriate |
| `OUTPUT_ACCESS`, `BROWSER_MISSING` | Inspect ownership/access or explicitly install the governed browser; no automatic deletion or permission changes |
| `CONFIG_*` | Remove conflicting global configuration or use a supported focused command |
| `PREVIEW_DENIED`, `PREVIEW_COLLISION`, `PREVIEW_UNAVAILABLE`, `PREVIEW_TIMEOUT` | Record the actual binding result; obtain the required enforcement capability or change the owned port condition without touching foreign listeners |
| `ADVISORY_UNAVAILABLE`, `ADVISORY_VULNERABILITY` | Record unavailable access separately from findings; resolve capability or dependency remediation through its owner |
| `*_INTERRUPTED` | Preserve the interrupted outcome and establish a changed condition before another attempt |

Existing authorization and an actual tool/sandbox rejection are separate facts.
A denied command is not permission to retry unchanged, bypass a restriction, or ask again for authorization already supplied.
Record the concrete changed capability or configuration before retrying; no automatic retry loop is provided.

## Evidence interface and artifact boundary

The exported `inspectEnvironment` interface in `scripts/environment-readiness.ts` and the CLI share `schemaVersion: 1`, observation/completion times, allowlisted findings, probe outcomes, limits, a fingerprint, and its SHA-256 digest.
The fingerprint records actual non-secret toolchain/platform/browser identities, resolved timezone/locale and worker profile, full-gate configuration flags, source commit/dirty state and a source-input digest.
It excludes environment values, executable paths, credentials, registry metadata and arbitrary error text.
A matching commit alone is insufficient when environment fingerprints differ; the digest is not a hermetic reproducibility claim.

After every full gate passes, `pnpm verify` emits `kind: verified-static-artifact` and writes an exclusively created JSON file under owned `.artifacts/environment/`.
It includes the start fingerprint, source stability check, artifact file count and SHA-256 over sorted relative names and bytes in `dist`.
CI uploads that evidence alongside coverage/browser evidence and uploads that same `dist` as the Pages artifact.
The deployment job consumes the artifact from its verified build job without rebuilding.
Diagnostic output alone never asserts that deployment succeeded.

Issue #330 can consume these versioned objects instead of duplicating toolchain/configuration rules; it owns durable command/history recording.
Task cleanup may remove owned generated outputs after evidence is preserved and integration is verified, following the [delivery cleanup contract](../.agents/skills/coordinate-project-delivery/references/review-and-integration.md#post-merge-cleanup).
Never purge shared pnpm or browser caches as task cleanup.
