# Ends and Means roadmap

This roadmap is ordered by product dependency, not by when an idea was first suggested. GitHub issues are the execution backlog; this document explains how the pieces fit together and what “next” means.

## Product direction

Ends and Means is an approaches-first reference for examining political economy in theory and practice.

- **Approaches are the primary entry point.** Each dossier identifies whether it is a tradition, ideal type, institutional family, or named model; explains its domains, Ends, Means, and internal variation; and shows how it responds to recurring Challenges.
- **Challenges are the primary comparison unit.** They are open questions, not tests with predetermined winners.
- **Topics are discovery aids.** They group related Challenges in familiar language but do not make analytical claims.
- **Ends, Means, and Criteria expose the reasoning.** They distinguish goals, institutional arrangements, and evaluative judgments.
- **Statements, Sources, and bounded Cases carry the evidence.** Historical and ongoing Cases use typed relationships and explicit dates rather than treating countries as timeless examples of an Approach.
- **Fictional Depictions are a separate interpretive layer.** They may illuminate or criticize ideas but never count as empirical evidence about real-world outcomes.
- **People enrich provenance and history.** Relationships must be typed and sourced rather than implying endorsement or sole causation.

The original fixed comparison matrix and its source documents are research inputs only. They are not the target ontology, a coverage requirement, or a compatibility contract.

## Current state

The site is live at [endsandmeans.info](https://endsandmeans.info) as a static Astro build on GitHub Pages. It currently provides:

- an approaches-first direction currently rendered through eight transitional tradition dossiers;
- nine Challenges and five Topics as secondary discovery paths;
- migrated response drafts with visible research warnings;
- a reading catalogue containing 51 inherited bibliographic records;
- an accepted analytical framework and working editorial philosophy;
- a pull-request-based research skill for concrete content changes;
- CI, graph validation, route tests, and automated Pages deployment.

The conceptual model is accepted, but its implementation is split across a shallow migration graph, a richer prototype, and a dossier-specific evidence schema. Inherited prose also lacks claim-level citations and bounded cases. Consolidating those representations is the immediate prerequisite to responsible content expansion.

## Recommended next implementation

Converge on one canonical graph, remove retired runtime concepts, and then build one complete, publishable reference implementation before researching all eight current Approaches in parallel:

1. Consolidate the migration graph, analytical prototype, and dossier-specific evidence into one canonical TypeScript graph, using Approach as the umbrella with explicit kinds and domains (#47).
2. Move current routes and the complete social-democratic trace onto that graph, then remove retired matrix/prototype runtime code (#48).
3. Give substantive Statements stable anchors, locators, and Source relationships (#18).
4. Model the two bounded Swedish Cases with explicit context and uncertainty (#13).
5. Add and validate Wikipedia, publisher, library, and reading links (#41 and #19).
6. Add one historical Case, one ongoing Case with freshness metadata, and one fictional Depiction as boundary tests; review the complete Challenge → End → Means → bounded evidence → Criterion → assessment trace as the template for #39.

This implementation tests the content model, editorial workflow, temporal semantics, empirical/fictional boundary, and reader experience together. Once it survives review, use it as the template for researching the other seven dossiers under #39.

## Phase 1 — Establish a trustworthy core

This is the active phase. Finish it before widening the catalogue.

- [x] **Approve the analytical model and PR review boundary** ([#38](https://github.com/dougborg/ends-and-means/issues/38)). The conceptual entities, analytical boundaries, and pull-request-as-proposal workflow are accepted.
- [ ] **Consolidate one canonical typed graph** ([#47](https://github.com/dougborg/ends-and-means/issues/47)). Unify migrated research, the complete analytical trace, and published dossier evidence without parallel schemas.
- [ ] **Remove retired matrix and prototype runtime cruft** ([#48](https://github.com/dougborg/ends-and-means/issues/48)). Preserve archival provenance while deleting obsolete routes, models, validators, generated products, and tests after canonical parity.
- [ ] **Complete the eight sourced Approach dossiers** ([#39](https://github.com/dougborg/ends-and-means/issues/39)). Classify each kind and domain coverage; review the overview prose, boundaries, variants, Ends, Means, FAQs, and common misconceptions; attach claim-level evidence and explicitly mark unresolved disputes.
- [ ] **Model statements and resource links** ([#18](https://github.com/dougborg/ends-and-means/issues/18)). Give challengeable claims stable anchors. Support DOI, ISBN, publisher, library, reading, and clearly labeled purchase links without making a retailer a canonical identifier.
- [ ] **Extract bounded cases and connect citations** ([#13](https://github.com/dougborg/ends-and-means/issues/13)). Convert useful inherited examples into time- and place-bounded evidence with context, provenance, uncertainty, and carefully scoped relationships.
- [ ] **Add canonical Wikipedia orientation links** ([#41](https://github.com/dougborg/ends-and-means/issues/41)). Link applicable entities to a well-matched article while keeping Wikipedia distinct from evidence supporting analytical claims.
- [ ] **Validate external links continuously** ([#19](https://github.com/dougborg/ends-and-means/issues/19)). Check canonical, editorial, library, and commercial links on a schedule; report redirects and failures without making temporary outages block every build.

### Phase 1 exit criteria

- The replacement schema is canonical and contains no retired-model fields.
- Every published dossier clearly separates sourced fact, interpretation, uncertainty, and editorial judgment.
- Each substantive public claim has a source or a visible research-needed state.
- At least one complete trace demonstrates the full model from Challenge and End through Means, bounded evidence, Criterion, and assessment.

## Phase 2 — Complete the reference experience

- [ ] **Build complete Source, Case, and Reading views** ([#3](https://github.com/dougborg/ends-and-means/issues/3)). Add useful backlinks, verification and source-type filters, case context, and transparent library/publisher/purchase actions.
- [ ] **Publish the method and contribution model** ([#9](https://github.com/dougborg/ends-and-means/issues/9)). Explain scope, evidence breadth, assessments, uncertainty, editorial review, and the pull-request review boundary in reader-facing language.
- [ ] **Add statement-level correction links** ([#20](https://github.com/dougborg/ends-and-means/issues/20)). Prefill structured GitHub issue forms with the page, entity, and claim anchor.
- [ ] **Complete accessibility and metadata review** ([#12](https://github.com/dougborg/ends-and-means/issues/12)). Verify keyboard use, focus, landmarks, contrast, reduced motion, metadata, social cards, structured data, and sitemap behavior.

### Phase 2 exit criteria

- Readers can move from any important statement to its evidence and context.
- Readers can understand the method and challenge a precise assertion.
- Core routes meet the accessibility and metadata release checklist.

## Phase 3 — Build comparison tools

- [ ] **Build static, accessible comparisons** ([#4](https://github.com/dougborg/ends-and-means/issues/4)). Generate useful no-JavaScript views from response traces without assuming rectangular coverage or producing a universal score.
- [ ] **Add progressive filters and pivots** ([#6](https://github.com/dougborg/ends-and-means/issues/6)). Filter by Challenge, Approach kind/domain, Means, Case, evidence gap, and interpretation; preserve keyboard access and URL state.
- [ ] **Add pairwise Approach comparison** ([#35](https://github.com/dougborg/ends-and-means/issues/35)). Generate “compare these two” views from canonical traces rather than duplicating comparison prose.

## Phase 4 — Open and govern contributions

- [ ] **Open the contribution workflow** ([#17](https://github.com/dougborg/ends-and-means/issues/17)). Add contributor guidance and structured forms for corrections, missing sources, broken links, challenged assessments, and proposed cases. Decide separately when the repository itself should become public.
- [ ] **Define editorial governance** ([#32](https://github.com/dougborg/ends-and-means/issues/32)). Cover moderation, conflicts, affiliate revenue, contentious history, living people, appeals, privacy-safe attribution, and final maintainer authority.
- [ ] **Clear the editorial release gate** ([#16](https://github.com/dougborg/ends-and-means/issues/16)). Confirm code/content licenses, publish affiliate disclosure, and ensure commercial relationships cannot influence source selection or evaluation.
- [ ] **Add claim-level revision history** ([#33](https://github.com/dougborg/ends-and-means/issues/33)). Record substantive changes, reasons, supporting evidence, and privacy-safe contributor credit.

## Phase 5 — Expand the knowledge graph

These features become valuable after the core model and evidence workflow are stable.

### Interpretation and navigation

- [ ] **Publish a rigorous methods and classification guide** ([#27](https://github.com/dougborg/ends-and-means/issues/27)).
- [ ] **Establish a glossary and controlled vocabulary** ([#30](https://github.com/dougborg/ends-and-means/issues/30)).
- [ ] **Model competing scholarly interpretations** ([#31](https://github.com/dougborg/ends-and-means/issues/31)).
- [ ] **Publish the editorial philosophy as a first-class site section** ([#36](https://github.com/dougborg/ends-and-means/issues/36)).
- [ ] **Curate transparent reading paths** ([#28](https://github.com/dougborg/ends-and-means/issues/28)).

### History, people, and literature

- [ ] **Relate Approaches to historical and ongoing Cases** ([#22](https://github.com/dougborg/ends-and-means/issues/22)). Use typed, sourced, many-to-many classifications with explicit periods; require freshness metadata for ongoing Cases.
- [ ] **Research historical political-economic formations** ([#23](https://github.com/dougborg/ends-and-means/issues/23)). Include monarchies, feudal arrangements, Greek democracy and poleis, the Roman Republic and Empire, and bounded Chinese and Japanese imperial forms.
- [ ] **Add sourced historical transition timelines** ([#29](https://github.com/dougborg/ends-and-means/issues/29)).
- [ ] **Add a first-class People layer** ([#25](https://github.com/dougborg/ends-and-means/issues/25)). Connect philosophers, authors, researchers, organizers, and leaders through typed, sourced relationships.
- [ ] **Add a separate fictional Depictions layer** ([#24](https://github.com/dougborg/ends-and-means/issues/24)). Use primary-text provenance, spoiler controls, and copyright-safe summaries; never treat fiction as empirical evidence.

### Additional analytical views

- [ ] **Explore multidimensional political-economic mapping** ([#26](https://github.com/dougborg/ends-and-means/issues/26)). Use independently defined axes, multiple scholarly lenses, uncertainty, and accessible nonvisual equivalents—never a single left/right score.
- [ ] **Add sourced value profiles** ([#37](https://github.com/dougborg/ends-and-means/issues/37)). Separate declared values, design-implied priorities, and cautiously interpreted practice without producing an aggregate score.
- [ ] **Publish stable machine-readable graph exports** ([#34](https://github.com/dougborg/ends-and-means/issues/34)).

## Completed foundations

- [x] Selected Astro and a framework-independent TypeScript content core.
- [x] Added pinned runtime setup, clean-build documentation, CI, and graph tests.
- [x] Preserved the original eight-by-fourteen research matrix and reading list in deterministic staging records.
- [x] Added graph integrity checks and reviewed migration coverage.
- [x] Migrated all inherited comparisons into clean response drafts or explicit research notes without requiring rectangular target coverage.
- [x] Implemented Approach, Challenge, Topic, Reading, and Framework routes plus an analytical trace prototype.
- [x] Made the eight initial dossiers the primary homepage entry point; their Approach classification is the next canonical-model step.
- [x] Added a research skill that implements source-backed content changes directly in reviewable pull requests.
- [x] Deployed the static site to GitHub Pages with the custom domain.

## Explicitly deferred

- Changelog views unless claim-level history proves insufficient.
- GitHub Discussions until issue-based feedback establishes a moderation model.
- Anonymous/private feedback until the GitHub workflow proves too restrictive.
- Additional Approaches or Challenges until the initial eight dossiers and shared analytical model are properly sourced.
