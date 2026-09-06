# Ends and Means

**Understand political, economic, and social ideas in theory and practice.**

Ends and Means begins with familiar subjects and questions, then connects plain
explanations to proposed institutions, bounded implementations, comparisons,
disagreements, and evidence.
The typed canonical graph is trust infrastructure, not a prerequisite for
learning.

Intended home: **[endsandmeans.info](https://endsandmeans.info)**

Explore starts with recognizable ideas, ideologies, systems, and institutions.
Cases show what happened in a bounded place and period, while Compare answers
recognizable questions without implying a universal ranking.
Sources and Method remain close at hand as a quieter trust layer.

## Contents

| File | What it is |
|---|---|
| [`docs/project-vision.md`](docs/project-vision.md) | Learner-first purpose, organizing principles, work tracks, and delivery policy. |
| [`docs/analytical-framework.md`](docs/analytical-framework.md) | Accepted concepts and analytical boundaries. |
| [`docs/domain-model.md`](docs/domain-model.md) | Implementation contract for the plural graph and relationships. |
| [`content/domain/`](content/domain/) | The only publishable content source. |
| [`archive/legacy-research/`](archive/legacy-research/) | Non-runtime research provenance routed to migration issues. |
| [`ROADMAP.md`](ROADMAP.md) | Milestones and issue-ready backlog, ordered by dependency. |
| [`docs/design-notes.md`](docs/design-notes.md) | Visual thesis, layout, typography, interaction, and accessibility direction. |
| [`docs/subject-guide-experience.md`](docs/subject-guide-experience.md) | Learner-journey routes, evidence disclosure, omission, and responsive behavior. |
| [`docs/editorial-philosophy.md`](docs/editorial-philosophy.md) | Working principles for fairness, viewpoint, evidence, judgment, and correction. |
| [`docs/editorial-governance.md`](docs/editorial-governance.md) | Implementation notes and reusable responsibility language for the public governance policy. |
| [`docs/narrative-style.md`](docs/narrative-style.md) | Plain-spoken prose, attribution, source-similarity safeguards, and editorial review. |
| [`docs/delivery-harness.md`](docs/delivery-harness.md) | Local/CI verification, Project-state diagnostics, stable checks, and review/integration gates. |
| [`docs/content-integrity-harness.md`](docs/content-integrity-harness.md) | Deterministic publication checks, actionable research attention, and safe-publication boundaries. |
| [`docs/licensing-audit.md`](docs/licensing-audit.md) | Asset/provenance inventory, candidate licensing boundaries, and owner decisions; no license is selected. |
| [`docs/adr/0001-astro-and-portable-content-core.md`](docs/adr/0001-astro-and-portable-content-core.md) | Accepted architecture decision and boundaries. |
| [`docs/adr/0002-git-backed-canonical-content.md`](docs/adr/0002-git-backed-canonical-content.md) | Git-backed modular authoring, one compiled graph, and the database deferral. |
| [`docs/adr/0003-markdown-narrative-authoring.md`](docs/adr/0003-markdown-narrative-authoring.md) | Markdown prose, typed manifests, sentence-per-line linting, and safe rendering. |
| [`docs/adr/0004-subject-guides-as-presentation-compositions.md`](docs/adr/0004-subject-guides-as-presentation-compositions.md) | Subject Guides as presentation compositions above entity-owned Dossiers. |
| [`.agents/skills/research-content-changes/SKILL.md`](.agents/skills/research-content-changes/SKILL.md) | Source-backed workflow for concrete content changes reviewed in pull requests. |
| [`.agents/skills/coordinate-project-delivery/SKILL.md`](.agents/skills/coordinate-project-delivery/SKILL.md) | Project-state, pull-request, CI, and rebase-integration coordination. |

## Develop locally

Requires Node 26 (currently 26.8.1; see `.node-version` and `.nvmrc`).

```sh
pnpm install --frozen-lockfile
pnpm exec playwright install chromium
pnpm verify
```

`pnpm verify` already runs the browser test suite used by CI.
`pnpm review:visual` is the focused browser-based self-review command for
public rendering changes; use it while iterating on selected routes. It checks representative pages at desktop, tablet,
and mobile widths and writes screenshots to `.artifacts/visual-review`. Install
its Chromium runtime once with `pnpm exec playwright install chromium`; see
[`CONTRIBUTING.md`](CONTRIBUTING.md#rendered-page-review) for focused-route use
and the completion criteria.
