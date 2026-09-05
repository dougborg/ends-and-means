# Contributing to Ends and Means

Ends and Means welcomes corrections, sources, and carefully bounded additions.
Because the project makes contestable political and historical claims,
substantial changes receive pull-request review before publication.

## Research and content changes

1. Start from an up-to-date `main` branch with a clean worktree.
2. Create a focused branch named `research/<type>-<stable-id>`.
3. Implement the concrete candidate in the canonical content model or its
   deterministic source generator, including rendering and tests when needed.
4. Run `npm run validate`, `npm run lint`, `npm run static`, `npm run check`,
   `npm test`, `npm run build`, `npm run test:routes`, and the rendered-page
   review described below.
5. Open a pull request. The PR is the proposal: identify all claims,
   classifications, and judgments the reviewer must decide.
6. Revise the concrete change in that PR. Merging records acceptance and
   publishes the result through the normal deployment workflow.

Do not maintain a parallel proposal artifact or staging tree. Git history and
the PR preserve the candidate, discussion, revisions, and decision.

The repo-local `research-content-changes` skill provides the detailed entity
contracts and editorial evidence policy.

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

## Automated quality and security gates

- Biome linting covers TypeScript, JavaScript, JSON, CSS, and Astro files. Its
  complexity rules cap cognitive complexity at 15 and function bodies at 80
  nonblank lines. Existing hotspots use narrow, documented suppressions that
  should be removed incrementally rather than raising the repository limit.
  The CSS descending-specificity heuristic is disabled because the shared
  stylesheet intentionally composes selectors across independent components;
  rendered browser tests cover the resulting cascade.
- Knip rejects unused files, dependencies, unresolved imports, binaries, and
  dependency cycles while leaving the domain model's intentional public type
  exports alone.
- Astro's strict type check, canonical graph validation, unit tests, route
  tests, production build, and browser review remain required.
- Dependabot checks npm and GitHub Actions weekly. Dependency Review blocks new
  moderate-or-higher known vulnerabilities; CodeQL scans JavaScript and
  TypeScript; zizmor audits workflow definitions.
- GitHub Actions are pinned to immutable commit SHAs. Keep the release tag in
  the trailing comment so Dependabot updates remain readable.
- Production Pages build and deployment jobs depend on successful main-branch
  verification; pull requests cannot enter the deployment path.

## Rendered-page review

An issue that changes public rendering is not implemented until its affected
pages have been evaluated in a browser. Build the site and run:

```sh
npx playwright install chromium
npm run review:visual
```

The review renders representative pages at desktop, tablet, and mobile widths;
saves full-page screenshots under `.artifacts/visual-review`; and fails on
browser errors, horizontal overflow, undefined CSS design tokens, or WCAG text
contrast failures. To focus the review on changed routes, provide a
comma-separated list:

```sh
REVIEW_ROUTES=/cases/example/,/concepts/example/ npm run review:visual
```

Automated checks cannot judge composition or whether the page explains its
subject clearly. Inspect all generated screenshots for hierarchy, density,
spacing, readable prose, empty states, and responsive behavior. Record that
inspection in the pull-request checklist. CI repeats the automated portion and
uploads its screenshots as the `rendered-page-review` artifact.
