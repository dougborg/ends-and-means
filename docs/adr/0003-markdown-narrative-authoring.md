# ADR 0003: Markdown narrative authoring with typed manifests

**Status:** accepted

## Context

Dossier prose was initially stored as TypeScript string literals.
That preserved type safety but made editorial diffs noisy, mixed prose with
graph metadata, and made sentence-level review harder.
The original architecture anticipated Markdown, but putting the full graph
record into weakly typed frontmatter would duplicate validation and make
relationships easier to mistype.

## Decision

Store each Dossier's standfirst and section prose in one Markdown file.
Keep stable identity, subject reference, publication state, review date,
section order, trace status, Statement IDs, and related entity references in an
adjacent TypeScript manifest.

The Markdown file begins with the standfirst and uses
`## stable-section-id` headings to associate prose with manifest sections.
Compilation rejects missing or unexpected section IDs.
Rendering uses a CommonMark parser with raw HTML disabled and unsafe link
protocols removed.

Use one semantic sentence per source line.
This improves sentence-level review, blame, merge behavior, and source-to-claim
verification without creating rendered hard breaks.
Do not impose a prose line-length cap.

Use `markdownlint-cli2` for maintained repository Markdown and
`markdownlint-sentences-per-line` for Dossier narrative files.
Archived research remains outside lint scope because it is immutable provenance,
not current authoring.

## Consequences

- Editors can review prose without parsing TypeScript syntax.
- The graph retains one typed metadata and relationship contract.
- Small factual changes produce focused sentence-level diffs.
- Markdown structure and sentence-per-line conventions are enforced in CI.
- Source similarity, accuracy, fairness, and prose quality still require human
  review; linting does not assign an editorial score.
- Adding a section requires coordinated Markdown and manifest changes, and the
  loader fails early when they diverge.
