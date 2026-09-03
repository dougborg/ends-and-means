# Canonical content graph

This directory is the framework-independent contract for curated site content.
It must not import Astro or assume how content is stored or rendered.

`validateContentGraph(input, options)` returns all diagnostics grouped by
shape, identity, coverage, references, and citations. It never throws.
`assertValidContentGraph` is the build-boundary convenience API and throws a
`ContentValidationError` containing that same report.

The importer output is a staging artifact, not a `ContentGraph`: it preserves
source-document names and unresolved editorial decisions. The M1 curation
adapter will map that artifact into the canonical IDs and fields defined here.
Until that adapter exists, `npm run validate` checks the staging import, while
the canonical graph contract is enforced by its unit tests.

Citation modes:

- `milestone` (default): an uncited cell is accepted only when it explicitly
  sets `needsCitation: true`.
- `release`: every cell needs a resolved source or case and must explicitly set
  `needsCitation: false`.
