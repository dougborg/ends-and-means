# Ends and Means

**Political and economic systems in theory and practice.**

An evidence-forward reference comparing systems by how each handles a fixed set
of core problems ("cruxes"). The content is a graph: systems × cruxes produce
cells, and every cell cites sources and historical cases.

Intended home: **[endsandmeans.info](https://endsandmeans.info)**

**Status:** architecture and design direction chosen; implementation has not yet
started. Astro will render a portable TypeScript content core.

## Contents

| File | What it is |
|---|---|
| [`docs/website-brief.md`](docs/website-brief.md) | Implementation brief — content model, validation rules, pages, milestones. Read this first. |
| [`docs/system-comparison-by-crux-v2.md`](docs/system-comparison-by-crux-v2.md) | Primary content: 8 systems × 14 cruxes, with verdicts and a summary matrix. Source of `cells`. |
| [`docs/political-economy-notes.md`](docs/political-economy-notes.md) | Part 1: narrative background on each topic. Part 2: reading list with verification status. Source of `sources`. |
| [`docs/system-comparison-by-crux-v1.md`](docs/system-comparison-by-crux-v1.md) | Superseded 5×10 version; for cross-checking only. |
| [`ROADMAP.md`](ROADMAP.md) | Milestones and issue-ready backlog, ordered by dependency. |
| [`docs/design-notes.md`](docs/design-notes.md) | Visual thesis, layout, typography, interaction, and accessibility direction. |
| [`docs/adr/0001-astro-and-portable-content-core.md`](docs/adr/0001-astro-and-portable-content-core.md) | Accepted architecture decision and boundaries. |

## Next step

Next, scaffold Astro and the framework-independent content compiler, then import
the matrix and enforce graph integrity before building product UI.

## Open decisions

See §8 of the brief. Defaults apply if unanswered: content CC BY-SA 4.0, code MIT (no license files committed yet — confirm before adding).
