# Contributing to Ends and Means

Ends and Means welcomes corrections, sources, and carefully bounded additions.
Because the project makes contestable political and historical claims,
substantial changes receive pull-request review before publication.

## Research and content changes

1. Start from an up-to-date `main` branch with a clean worktree.
2. Create a focused branch named `research/<type>-<stable-id>`.
3. Implement the concrete candidate in the canonical content model or its
   deterministic source generator, including rendering and tests when needed.
4. Run `npm run validate`, `npm run check`, `npm test`, `npm run build`, and
   `npm run test:routes`.
5. Open a draft pull request. The PR is the proposal: identify all claims,
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
