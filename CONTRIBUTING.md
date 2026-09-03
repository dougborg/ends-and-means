# Contributing to Ends and Means

Ends and Means welcomes corrections, sources, and carefully bounded additions.
Because the project makes contestable political and historical claims, research
and publication are separate steps.

## Research proposals

1. Start from an up-to-date `main` branch with a clean worktree.
2. Create a focused branch named `research/<type>-<stable-id>`.
3. Put research only in `proposals/<type>/<stable-id>/proposal.json` and
   `research.md`. Do not change canonical content or application code in the
   same proposal.
4. Run `npm run validate`, `npm run validate:proposals`, `npm test`, and
   `npm run build`.
5. Open a draft pull request and select “Research proposal only” in the
   template. Identify all judgments the reviewer must make.
6. Revise the proposal in that PR. Merging is not automatic approval to publish
   it on the site.

The repo-local `research-content-proposals` skill provides the detailed entity
contracts and editorial evidence policy.

## Promotion

Promotion is a separate pull request created only after a maintainer records an
explicit acceptance decision. A promotion PR may reconcile accepted material
into canonical content and update rendering or tests, but it must link back to
the reviewed proposal and state what was accepted, revised, or declined.

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

## Small corrections and software changes

Corrections and implementation work also use branches and pull requests. Keep
unrelated changes separate and explain how the result was verified. Never push
directly to `main`; repository rules require a reviewed pull request.
