# Contributing to Ends and Means

Ends and Means welcomes corrections, sources, and carefully bounded additions.
Because the project makes contestable political and historical claims,
substantial changes receive pull-request review before publication.
The [project vision](docs/project-vision.md) defines the learner-first product,
work tracks, and delivery policy.

## Research and content changes

1. Start from an up-to-date `main` branch in a clean, isolated worktree.
2. Create a focused branch named `research/<type>-<stable-id>` and keep one
   owner responsible for its mutations.
3. Implement the concrete candidate in the canonical content model or its
   deterministic source generator, including rendering and tests when needed.
4. Run `pnpm validate`, `pnpm lint`, `pnpm static`, `pnpm check`,
   `pnpm test`, `pnpm build`, `pnpm test:routes`, and the rendered-page
   review described below, plus `pnpm audit:content` for canonical content or
   narrative changes.
5. Rebase onto the current base, open a pull request, and identify all claims,
   classifications, and judgments the reviewer must decide.
6. Resolve automated review and obtain an independent adversarial review of the
   material risks.
7. Rebase again when required, integrate without a merge or squash commit, and
   verify the resulting deployment when public output changes.

Do not maintain a parallel proposal artifact or staging tree. Git history and
the PR preserve the candidate, discussion, revisions, and decision.

The repo-local `research-content-changes` skill provides the detailed entity
contracts and editorial evidence policy.
The separate `coordinate-project-delivery` skill governs issue, Project,
pull-request, verification, review, and rebase-only integration state.

Subject Guides are learner-facing presentation compositions, not canonical
graph superclasses.
Until their contract is implemented, preserve entity-owned Dossiers and do not
manufacture a route-local substitute.

### Narrative prose

Read the [narrative style guide](docs/narrative-style.md) before adding or
substantially revising reader-facing summaries.
Draft from canonical Statements or closed-source notes, verify each factual
clause against its evidence, and compare the draft with consulted sources for
suspiciously close phrasing.
The content-integrity harness and audit report objective attention signals; they do not replace
human review for accuracy, fairness, plagiarism risk, focus, or publication.

Narrative prose lives in one Markdown file per Dossier under
`content/domain/presentation/narratives/`.
The adjacent typed manifest owns identity, publication state, section order,
trace status, Statement IDs, and related entities.
Use one semantic sentence per source line without visual hard breaks or a prose
line-length cap, then run `pnpm lint:markdown`.
Run `pnpm verify` before handoff for the fixture-backed publication gate and actionable missing-content report.
See the [content integrity harness](docs/content-integrity-harness.md) for the failure and attention boundary.

## Review standards

- Prefer primary records, official statistics, peer-reviewed work, academic
  books, and authoritative institutional publications.
- Attach sources to precise claims and do not imply more support than a source
  provides.
- Keep fact, attributed value, causal inference, editorial interpretation, and
  value judgment distinguishable.
- Include serious counterevidence, rival interpretations, limitations, and
  transfer constraints.
- Treat historical evidence as bounded by place, time, institutions, and
  context—not as proof about an entire tradition.
- Use Wikipedia for orientation, not as evidence for analytical claims.
- Record Wikipedia links as `orientation` references with a language and
  checked date. Link a specific article, not a search result, category, or
  disambiguation page.
- Record Wikidata links as `identity` references with the QID, checked date,
  and an `exact` or `close` match. A shared name is not enough: confirm that the
  item denotes the same entity. Do not import Wikidata classifications into the
  project graph.
- Keep absent and ambiguous matches absent. Redirects should be reviewed and
  updated to their stable target; a close match must never be presented as an
  exact identity.

## Small corrections and software changes

Corrections and implementation work also use branches and pull requests. Keep
unrelated changes separate and explain how the result was verified. Never push
directly to `main`; repository rules require a reviewed pull request.

If implementation exposes a small, clearly in-scope deficiency, address it in
the same review and add proportionate tests or documentation.
Record larger, uncertain, or independently reviewable improvements in the
backlog with the observed problem, desired outcome, dependencies, and
acceptance criteria rather than silently widening the pull request.

Issues and milestones are the authoritative backlog.
The GitHub Project contains active reviews, concrete blockers, and only
the next three to five implementation-ready items.
Keep no more than three implementation items active, normally one each in the
Corpus, Reader experience, and Platform/process tracks.
Use `pnpm audit:delivery -- --live-project` when authenticated Project access is
available; an unavailable API or credential result is not a clean audit.

## Automated quality and security gates

- Biome linting covers TypeScript, JavaScript, JSON, CSS, and Astro files. Its
  complexity rules cap cognitive complexity at 15 and function bodies at 80
  nonblank lines. Ratchet these limits downward as code is decomposed; do not
  add broad suppressions or raise the repository limit to admit a change.
  The CSS descending-specificity heuristic is disabled because the shared
  stylesheet intentionally composes selectors across independent components;
  rendered browser tests cover the resulting cascade.
- Knip rejects unused files, dependencies, unresolved imports, binaries, and
  dependency cycles while leaving the domain model's intentional public type
  exports alone. The two ignored `@emnapi` packages are explicit portability
  pins required for Linux clean installs of optional WASM dependencies.
- Astro's strict type check, canonical graph validation, unit tests, route
  tests, production build, and browser review remain required.
- CI invokes `pnpm verify`, which owns the content-integrity audit and rendered-publication checks once.
- V8 coverage is enforced for runtime TypeScript under `src/lib`: at least 88%
  statements, 87% branches, 100% functions, and 90% lines. Raise thresholds as
  coverage improves; do not lower them to accommodate a change.
- Dependabot checks npm and GitHub Actions weekly. The CI audit blocks
  moderate-or-higher known vulnerabilities, Dependency Review checks pull
  request changes, CodeQL scans JavaScript and TypeScript, and zizmor audits
  workflow definitions.
- GitHub Actions are pinned to immutable commit SHAs. Keep the release tag in
  the trailing comment so Dependabot updates remain readable.
- Production Pages build and deployment jobs depend on successful main-branch
  verification; pull requests cannot enter the deployment path.
- `pnpm verify` is the single full local and CI verification path. It includes
  repository/skill and asset-provenance drift checks, lint, static analysis, dependency audit, type
  checks, coverage, build, route tests, and browser review. See the
  [delivery harness](docs/delivery-harness.md).
- New bundled or published assets—including fonts, icons, flags, logos, images,
  media, datasets, quotations, and imported metadata—must be registered in
  `provenance/inventory.json` with their source, provider, license or terms
  locator, modification state, distribution path, and attribution requirement.
  `pnpm audit:provenance` fails on unregistered governed file types, stale asset
  states, direct/optional manifest drift, and exact-lockfile package drift.
  Regenerate lockfile evidence with `pnpm inventory:dependencies` after an
  intentional dependency change. Unresolved third-party material cannot enter
  the live site.
- Copilot and independent adversarial review are project-process requirements.
  Branch protection does not require an approving review, but strict checks,
  conversation resolution, and linear history remain enforced.

## Rendered-page review

An issue that changes public rendering is not implemented until its affected
pages have been evaluated in a browser. Build the site and run:

```sh
pnpm exec playwright install chromium
pnpm verify
```

The command builds and audits the content, then renders representative pages at desktop, tablet, and mobile widths;
saves full-page screenshots under `.artifacts/visual-review`; and fails on
browser errors, horizontal overflow, undefined CSS design tokens, or WCAG text
contrast failures. To focus the review on changed routes, provide a
comma-separated list:

```sh
REVIEW_ROUTES=/cases/example/,/concepts/example/ pnpm review:visual
```

Automated checks cannot judge composition or whether the page explains its
subject clearly. Inspect all generated screenshots for hierarchy, density,
spacing, readable prose, empty states, and responsive behavior. Record that
inspection in the pull-request checklist. CI repeats the automated portion and
uploads its screenshots as the `rendered-page-review` artifact.
