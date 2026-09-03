# Ends and Means

**Political and economic systems in theory and practice.**

An evidence-forward reference in development for comparing political-economic
Ends, institutional Means, recurring Challenges, and outcomes in bounded cases
under explicit Criteria. The deployed matrix is an early exploration and
research input, not the target ontology or a compatibility contract.

Intended home: **[endsandmeans.info](https://endsandmeans.info)**

The static Astro build deploys through GitHub Pages. Pull-request verification
and Pages deployment use separate GitHub Actions workflows; DNS configuration
for the custom domain is a separate release step.

**Status:** M1 implementation is underway. Astro, CI, the deterministic staging
importer, and the portable graph validator are in place.

## Contents

| File | What it is |
|---|---|
| [`docs/website-brief.md`](docs/website-brief.md) | Superseded brief for the exploratory matrix site. |
| [`docs/analytical-framework.md`](docs/analytical-framework.md) | Current target concepts and analytical boundaries. |
| [`prototypes/analytical-framework/`](prototypes/analytical-framework/) | Clean, non-canonical target-model prototype and migration notes. |
| [`content/framework/`](content/framework/) | Generated, non-canonical migration draft of all current comparison content. |
| [`docs/system-comparison-by-crux-v2.md`](docs/system-comparison-by-crux-v2.md) | Primary content: 8 systems × 14 cruxes, with verdicts and a summary matrix. Source of `cells`. |
| [`docs/political-economy-notes.md`](docs/political-economy-notes.md) | Part 1: narrative background on each topic. Part 2: reading list with verification status. Source of `sources`. |
| [`docs/system-comparison-by-crux-v1.md`](docs/system-comparison-by-crux-v1.md) | Superseded 5×10 version; for cross-checking only. |
| [`ROADMAP.md`](ROADMAP.md) | Milestones and issue-ready backlog, ordered by dependency. |
| [`docs/design-notes.md`](docs/design-notes.md) | Visual thesis, layout, typography, interaction, and accessibility direction. |
| [`docs/editorial-philosophy.md`](docs/editorial-philosophy.md) | Working principles for fairness, viewpoint, evidence, judgment, and correction. |
| [`docs/adr/0001-astro-and-portable-content-core.md`](docs/adr/0001-astro-and-portable-content-core.md) | Accepted architecture decision and boundaries. |
| [`.agents/skills/research-content-proposals/SKILL.md`](.agents/skills/research-content-proposals/SKILL.md) | Reusable, proposal-only research workflow for systems, cruxes, sources, and cases. |

## Next step

Requires Node 24 (see `.node-version` and `.nvmrc`).

```sh
npm ci
npm run check
npm test
npm run build
```

`npm run import` parses the source documents into deterministic staging records
and an editorial report. It intentionally does not guess verdict classes or
citation mappings. The next step is an explicit curation adapter from those
records into the canonical graph, followed by full build-time graph validation.

`npm run migrate:framework` rebuilds the exploratory graph and migrates every
comparison into the replacement draft structure. The generated coverage audit
proves that no input was silently dropped; the public routes continue to use the
exploratory graph until migrated claims have been researched and reviewed.

## Open decisions

See §8 of the brief. Defaults apply if unanswered: content CC BY-SA 4.0, code MIT (no license files committed yet — confirm before adding).
