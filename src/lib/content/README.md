# Canonical content graph

This directory is the framework-independent contract for curated site content.
It must not import Astro or assume how content is stored or rendered.

`validateContentGraph(input, options)` returns all diagnostics grouped by
shape, identity, coverage, references, and citations. It never throws.
`assertValidContentGraph` is the build-boundary convenience API and throws a
`ContentValidationError` containing that same report.

The importer output is a staging artifact, not a `ContentGraph`: it preserves
source-document names and unresolved editorial decisions. The curation adapter
maps it into the canonical IDs and fields defined here. `npm run validate` runs
both stages and writes the canonical graph and its report under `generated/`.

## Evidence taxonomy

- `extensive`: substantial direct empirical evidence across relevant cases.
- `partial`: direct evidence exists, but coverage, duration, or transferability
  is limited.
- `contested`: empirical cases or their interpretation are materially disputed.
- `untested`: the proposal or mechanism has not been tested at relevant scale
  and duration, although indirect or small-scale evidence exists.
- `none`: no empirical case or evidence exists for the mechanism.

These labels describe the evidence base, not whether the verdict is favorable.
Anarcho-capitalism therefore uses `none` except for its explicitly contested
historical analogies in Crux 10; Parecon uses `untested` consistently because
small workplace experiments provide indirect evidence without testing the full
model at relevant scale or duration.

## Initial judgment review notes

The explicit override table follows the narrative rather than mechanically
translating the summary labels. Review corrections treat central planning on
capital concentration as `mixed` (private concentration is removed but becomes
political privilege), state capitalism there as `weak`, and social anarchism as
`contested` because long-run drift is unobserved. State capitalism on basic
needs is `moderate`: provision can be effective where prioritized but is not an
entitlement. Central planning on scale is `mixed`: it demonstrably scales
administratively while information degrades. Parecon on bad actors is `weak`
because the design addresses elite formation but leaves coercive actors
unanswered. Laissez-faire's track record remains `mixed`: the narrative records
both rapid growth and severe inequality and instability.

Citation modes:

- `milestone` (default): an uncited cell is accepted only when it explicitly
  sets `needsCitation: true`.
- `release`: every cell needs a resolved source or case and must explicitly set
  `needsCitation: false`.

A clean milestone validation means the graph is structurally coherent and all
gaps are acknowledged. It does **not** mean release-ready. The curation report
separately exposes `releaseReadiness`, whose release-mode validation remains
red until citations resolve and other editorial gaps, including missing crux
questions, are cleared.
