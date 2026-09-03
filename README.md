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

**Status:** the current reference shell is live while the accepted
approaches-first model is consolidated into one canonical graph. Astro, CI, the
portable graph validator, Topic and Challenge discovery, eight transitional
dossiers, and the source inventory are in place. The active work is classifying
those dossiers as Approaches, consolidating the content schemas, and connecting
independently citable Statements to bounded historical and ongoing Cases.

Approaches are the primary public entry point. Challenges and Topics provide
secondary ways to compare the same material without implying a ranking or
treating historical states as timeless embodiments of an Approach.

## Contents

| File | What it is |
|---|---|
| [`docs/website-brief.md`](docs/website-brief.md) | Superseded brief for the exploratory matrix site. |
| [`docs/analytical-framework.md`](docs/analytical-framework.md) | Accepted concepts and analytical boundaries. |
| [`prototypes/analytical-framework/`](prototypes/analytical-framework/) | Clean, non-canonical target-model prototype and migration notes. |
| [`content/framework/`](content/framework/) | Transitional framework data pending consolidation into the canonical graph tracked in issue #47. |
| [`docs/system-comparison-by-crux-v2.md`](docs/system-comparison-by-crux-v2.md) | Archived eight-by-fourteen comparison input retained for provenance and migration checks. |
| [`docs/political-economy-notes.md`](docs/political-economy-notes.md) | Part 1: narrative background on each topic. Part 2: reading list with verification status. Source of `sources`. |
| [`docs/system-comparison-by-crux-v1.md`](docs/system-comparison-by-crux-v1.md) | Superseded 5×10 version; for cross-checking only. |
| [`ROADMAP.md`](ROADMAP.md) | Milestones and issue-ready backlog, ordered by dependency. |
| [`docs/design-notes.md`](docs/design-notes.md) | Visual thesis, layout, typography, interaction, and accessibility direction. |
| [`docs/editorial-philosophy.md`](docs/editorial-philosophy.md) | Working principles for fairness, viewpoint, evidence, judgment, and correction. |
| [`docs/adr/0001-astro-and-portable-content-core.md`](docs/adr/0001-astro-and-portable-content-core.md) | Accepted architecture decision and boundaries. |
| [`docs/adr/0002-git-backed-canonical-content.md`](docs/adr/0002-git-backed-canonical-content.md) | Git-backed modular authoring, one compiled graph, and the database deferral. |
| [`.agents/skills/research-content-changes/SKILL.md`](.agents/skills/research-content-changes/SKILL.md) | Source-backed workflow for concrete content changes reviewed in pull requests. |

## Next step

Requires Node 24 (see `.node-version` and `.nvmrc`).

```sh
npm ci
npm run check
npm test
npm run build
```

`npm run import` parses the archived source documents into deterministic staging
records and an editorial report. It intentionally does not guess verdict
classes or citation mappings.

`npm run migrate:framework` rebuilds the exploratory graph and migrates every
comparison into the replacement draft structure. The generated coverage audit
proves that no input was silently dropped. Public replacement-model routes show
the migrated material with research warnings until its claims are reviewed and
sourced.

## Open decisions

See §8 of the brief. Defaults apply if unanswered: content CC BY-SA 4.0, code MIT (no license files committed yet — confirm before adding).
