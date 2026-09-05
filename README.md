# Ends and Means

**Political and economic systems in theory and practice.**

An evidence-forward reference for comparing political-economic
Ends, institutional Means, recurring Challenges, and outcomes in bounded cases
under explicit Criteria.

Intended home: **[endsandmeans.info](https://endsandmeans.info)**

The static Astro build deploys through GitHub Pages only after the main-branch
CI verification job succeeds. DNS configuration for the custom domain is a
separate release step.

**Status:** the live site is generated exclusively from the plural canonical
graph. Published Approach, Case, Challenge, Concept, Compare, Source, and Reading
pages expose independently citable Statements and typed, sourced relationships.

Explore provides entity-neutral paths through systems and ideas, institutions,
Questions, Cases, People, and Works. Compare examines the same graph through
shared Challenges, pairwise views, and independently defined political-economic
dimensions without implying a universal ranking. No public navigation label is
the root type of the underlying ontology.

## Contents

| File | What it is |
|---|---|
| [`docs/analytical-framework.md`](docs/analytical-framework.md) | Accepted concepts and analytical boundaries. |
| [`docs/domain-model.md`](docs/domain-model.md) | Implementation contract for the plural graph and relationships. |
| [`content/domain/`](content/domain/) | The only publishable content source. |
| [`archive/legacy-research/`](archive/legacy-research/) | Non-runtime research provenance routed to migration issues. |
| [`ROADMAP.md`](ROADMAP.md) | Milestones and issue-ready backlog, ordered by dependency. |
| [`docs/design-notes.md`](docs/design-notes.md) | Visual thesis, layout, typography, interaction, and accessibility direction. |
| [`docs/editorial-philosophy.md`](docs/editorial-philosophy.md) | Working principles for fairness, viewpoint, evidence, judgment, and correction. |
| [`docs/adr/0001-astro-and-portable-content-core.md`](docs/adr/0001-astro-and-portable-content-core.md) | Accepted architecture decision and boundaries. |
| [`docs/adr/0002-git-backed-canonical-content.md`](docs/adr/0002-git-backed-canonical-content.md) | Git-backed modular authoring, one compiled graph, and the database deferral. |
| [`.agents/skills/research-content-changes/SKILL.md`](.agents/skills/research-content-changes/SKILL.md) | Source-backed workflow for concrete content changes reviewed in pull requests. |

## Next step

Requires Node 26 (currently 26.8.1; see `.node-version` and `.nvmrc`).

```sh
pnpm install --frozen-lockfile
pnpm lint
pnpm static
pnpm check
pnpm test
pnpm test:coverage
pnpm build
pnpm review:visual
```

`pnpm review:visual` performs the browser-based self-review required for
public rendering changes. It checks representative pages at desktop, tablet,
and mobile widths and writes screenshots to `.artifacts/visual-review`. Install
its Chromium runtime once with `npx playwright install chromium`; see
[`CONTRIBUTING.md`](CONTRIBUTING.md#rendered-page-review) for focused-route use
and the completion criteria.

## Open decisions

See §8 of the brief. Defaults apply if unanswered: content CC BY-SA 4.0, code MIT (no license files committed yet — confirm before adding).
