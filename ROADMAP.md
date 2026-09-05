# Ends and Means roadmap

This roadmap is ordered by product dependency, not by when an idea was first suggested. GitHub issues are the execution backlog; this document explains how the pieces fit together and what “next” means.

## Product direction

Ends and Means is a comparative reference backed by a plural graph of
political-economic ideas, institutions, arguments, and evidence.

- **Explore and Compare are equal product modes.** Explore provides
  entity-neutral discovery across systems and ideas, institutions, Questions,
  Cases, People, and Works. Compare examines shared Challenges, selected
  subjects, Dimensions, and transitions.
- **Approaches are one useful entity type.** Each dossier presents a
  recognizable configuration of Concepts, attributed Ends, proposed Means,
  internal disputes, and historical development. Approaches are neither the
  universal entry point nor the ontology root.
- **Concepts are reusable and contested.** Democracy, socialism, liberty, social
  ownership, and similar ideas have scoped definitions and may be interpreted
  differently across Approaches.
- **Collections provide overlapping umbrellas.** Socialist, Communist,
  Anarchist, Democratic, or Stateless collections support discovery without
  forcing one exclusive hierarchy or treating membership as uncontested.
- **Challenges are the primary comparison unit.** They are open questions, not tests with predetermined winners.
- **Topics are discovery aids.** They group related Challenges in familiar language but do not make analytical claims.
- **Ends, Means, and Criteria expose the reasoning.** They distinguish goals, institutional arrangements, and evaluative judgments.
- **Comparison Dimensions describe differences without judging them.** Every
  axis, category set, and Placement exposes definition, scope, method,
  uncertainty, provenance, and alternative interpretations. Dimensions never
  silently become Criteria or aggregate political scores.
- **Political, economic, social, legal, and cultural are overlapping spheres.**
  More precise Domains are first-class vocabulary connected through qualified
  relationships, not a closed classification embedded on an Approach.
- **Statements, Sources, and bounded Cases carry the evidence.** Historical and ongoing Cases use typed relationships and explicit dates rather than treating countries as timeless examples of an Approach.
- **Events and Transitions make change inspectable.** Events record sourced
  occurrences; Transition analyses connect before/after Case episodes without
  presenting causal importance or clean system replacement as fact.
- **Fictional Depictions are a separate interpretive layer.** They may illuminate or criticize ideas but never count as empirical evidence about real-world outcomes.
- **People enrich provenance and history.** Relationships must be typed and sourced rather than implying endorsement or sole causation.

The original fixed comparison matrix and its source documents are research inputs only. They are not the target ontology, a coverage requirement, or a compatibility contract.

## Current state

The site is live at [endsandmeans.info](https://endsandmeans.info) as a static
Astro build on GitHub Pages. Its public routes are generated only from the
canonical graph and currently include reviewed Swedish wage-earner-fund and
Rehn–Meidner Approach/Case traces, reusable Concepts and Challenges, a sourced
Comparison Dimension, canonical Source/Reading views, and the public method.

The retired matrix, intermediate framework, and analytical prototype are kept
only in `archive/legacy-research/` as issue-routed research provenance. They are
not production inputs and do not generate routes. CI covers graph validation,
route integrity, responsive rendered-page review, and Pages deployment.

## Recommended next implementation

Finish the canonical-only publication boundary, then expand the catalogue from
reviewed research rather than restoring inherited dossiers wholesale:

1. Complete the model-boundary contracts and second canonical Swedish trace
   tracked by #47 and #39.
2. Complete #48 by removing retired public routes and runtime code and keeping
   useful previous research only in the non-runtime archive.
3. Complete the canonical external-reference audit and continuous link report
   (#41 and #19).
4. Expand sourced Approach dossiers from issue-routed research (#39), followed
   by the bounded Zapatista and Spanish Revolution cases (#55 and #56).
5. Continue comparison and reference work only from canonical records (#3, #4,
   #26, and #35).

This implementation tests the content model, editorial workflow, temporal semantics, empirical/fictional boundary, and reader experience together. Once it survives review, use it as the template for researching the remaining valid dossiers and reclassifying inherited rows under #39.

**Current checkpoint:** the model-boundary contracts and two Swedish evidence
traces establish the canonical publication surface. The #48 cleanup makes graph
membership the public-content boundary and keeps earlier research solely in a
non-runtime archive. Shared responsive dossier refinement is active. Before
another researched Dossier is added, narrative authoring moves to typed, linted
Markdown with sentence-per-line source formatting. Design-system and theme work
follows the shared dossier rhythm.

## Milestone 1 — [Plural graph foundation](https://github.com/dougborg/ends-and-means/milestone/1)

This is the active phase. Finish it before widening the catalogue.

**Execution order:** complete the model-boundary and second-trace work → #48
canonical-only publication cleanup → #41 canonical-entity external-reference audit/backfill → #19 scheduled link
reports. The Statement,
bounded-Case, Event/Transition, external-reference, and Comparison
Dimension/Placement foundations have landed; their broader content expansion
remains tracked in #18, #13, #22, #41, and #26. #48 closes only after parity is
demonstrated.

- [x] **Approve the analytical method and PR review boundary** ([#38](https://github.com/dougborg/ends-and-means/issues/38)). The analytical boundaries and pull-request review workflow are accepted; the ontology remains subject to the Milestone 1 model tests.
- [ ] **Validate and consolidate one plural canonical graph** ([#47](https://github.com/dougborg/ends-and-means/issues/47)). Add Concepts, Collections, Domains, external identities, and typed sourced relationships; replace the monolithic authoring JSON with modular entity and relationship sources plus a generated read graph; prove the distinctions with Democracy, communism/socialism, central planning, anarcho-communism, and one complete evidence trace.
- [ ] **Remove retired matrix and prototype runtime cruft** ([#48](https://github.com/dougborg/ends-and-means/issues/48)). Publish only canonical graph records; remove retired routes, schemas, generators, and fixtures, and retain useful research solely in the non-runtime archive.
- [ ] **Complete sourced Approach dossiers** ([#39](https://github.com/dougborg/ends-and-means/issues/39)). After the vertical slice, review overview prose, scope, classification disputes, conceptual morphology, attributed Ends, Means relationships, variants, cases, FAQs, and misconceptions; do not preserve all eight inherited rows as Approaches when they belong to another entity type.
- [ ] **Model statements and resource links** ([#18](https://github.com/dougborg/ends-and-means/issues/18)). Give challengeable claims stable anchors. Support DOI, ISBN, publisher, library, reading, and clearly labeled purchase links without making a retailer a canonical identifier.
- [ ] **Extract bounded cases and connect citations** ([#13](https://github.com/dougborg/ends-and-means/issues/13)). Convert useful inherited examples into time- and place-bounded evidence with context, provenance, uncertainty, and carefully scoped relationships.
- [ ] **Add canonical external orientation and identity links** ([#41](https://github.com/dougborg/ends-and-means/issues/41)). Link applicable entities to reviewed Wikipedia articles and Wikidata identifiers while keeping orientation, identity reconciliation, and evidence distinct.
- [ ] **Validate external links continuously** ([#19](https://github.com/dougborg/ends-and-means/issues/19)). Check canonical, editorial, library, and commercial links on a schedule; report redirects and failures without making temporary outages block every build.

### Milestone 1 exit criteria

- The replacement schema is canonical and contains no retired-model fields.
- Canonical authoring is modular; the full graph is a deterministic generated
  artifact outside the authoring directories.
- Democracy can exist as a Concept, attributed End, family of Approaches,
  collection of Means, and measured feature of Cases without one overloaded
  record.
- Central planning is modeled as an institutional Means family, not retained as
  an Approach merely because it was an inherited matrix row.
- Anarcho-communism can have qualified membership in multiple Collections
  without an exclusive parent.
- Events preserve sourced chronology while turning-point and causal significance
  remain attributed Statements; Transitions support gradual, overlapping, and
  disputed change between bounded Case episodes.
- Domains are extensible relationship-backed vocabulary, not a flat enum.
- Comparison Dimensions and Placements are first-class, sourced analytical
  records distinct from Criteria and generated comparison views.
- Every published dossier clearly separates sourced fact, interpretation, uncertainty, and editorial judgment.
- Each substantive public claim has a source or a visible research-needed state.
- At least one complete trace demonstrates the full model from Challenge and End through Means, bounded evidence, Criterion, and assessment.
- The same vertical slice renders an Explore dossier, a shared-Challenge
  comparison, and one dimensional placement without duplicated canonical prose.

## Milestone 2 — [Explore and Compare core](https://github.com/dougborg/ends-and-means/milestone/2)

**Execution order:** complete shared dossier presentation → move narrative
authoring to typed, linted Markdown → #39 valid dossiers → #55 and #56 priority anarchism Cases →
#59 gendered-power/social-reproduction graph coverage → #61 reusable FAQs and
misconception corrections → #3 evidence/reference routes → #4 static comparison
core → remaining #26 mapping work → #35 entity-neutral pairwise comparison → #9
public method → #20 correction links → #67 shared dossier presentation
refinement → #12 accessibility and metadata release review.

- [ ] **Develop the Zapatistas as a principal anarchism Case** ([#55](https://github.com/dougborg/ends-and-means/issues/55)). Distinguish the EZLN, civilian communities, governance institutions, and bounded episodes of institutional change; retain Indigenous context, competing classifications, and ongoing-case freshness.
- [ ] **Develop bounded Spanish Revolution anarchism Cases** ([#56](https://github.com/dougborg/ends-and-means/issues/56)). Distinguish the CNT, FAI, workplace and rural collectives, federations, militias, committees, regions, and wartime periods rather than treating Spain from 1936–1939 as one system.
- [ ] **Model gendered power and social reproduction across the graph** ([#59](https://github.com/dougborg/ends-and-means/issues/59)). Ensure questions, Ends, Means, evidence, and assessments can represent unpaid care, household authority, dependency, and gendered distributions rather than treating them as an afterthought.
- [ ] **Model reusable FAQs and misconception corrections** ([#61](https://github.com/dougborg/ends-and-means/issues/61)). Replace dossier-embedded FAQ prose with independently reviewable, reusable, sourced records after the canonical entity and Statement patterns stabilize.
- [ ] **Build complete Source, Case, and Reading views** ([#3](https://github.com/dougborg/ends-and-means/issues/3)). Add useful backlinks, verification and source-type filters, case context, and transparent library/publisher/purchase actions.
- [ ] **Build static, accessible comparisons** ([#4](https://github.com/dougborg/ends-and-means/issues/4)). Support shared-Challenge and factual-dimension comparisons generated from the graph, with sparse coverage and no aggregate winner.
- [ ] **Build entity-neutral pairwise comparison** ([#35](https://github.com/dougborg/ends-and-means/issues/35)). Compare eligible Concepts, Approaches, Means, or Case episodes through only the relationships and dimensions they genuinely share.
- [ ] **Define and prototype multidimensional mapping** ([#26](https://github.com/dougborg/ends-and-means/issues/26)). Establish Comparison Dimension and Placement records, then test one dimension before attempting a two-axis visualization.
- [ ] **Publish the method and contribution model** ([#9](https://github.com/dougborg/ends-and-means/issues/9)). Explain scope, evidence breadth, assessments, uncertainty, editorial review, and the pull-request review boundary in reader-facing language.
- [ ] **Add statement-level correction links** ([#20](https://github.com/dougborg/ends-and-means/issues/20)). Prefill structured GitHub issue forms with the page, entity, and claim anchor.
- [ ] **Refine dossier hierarchy and responsive evidence scanning** ([#67](https://github.com/dougborg/ends-and-means/issues/67)). Use the rendered-page workflow to reduce excessive spacing, improve dense evidence scanning, and unify related-idea and external-reference treatments across representative sparse and dense pages.
- [ ] **Move narrative authoring to linted Markdown** ([#91](https://github.com/dougborg/ends-and-means/issues/91)). Preserve typed metadata
  and canonical claim references while adding sentence-per-line linting, safe
  rendering, contributor guidance, and objective prose-attention checks. This
  gates further Dossier expansion.
- [ ] **Complete accessibility and metadata review** ([#12](https://github.com/dougborg/ends-and-means/issues/12)). Verify keyboard use, focus, landmarks, contrast, reduced motion, metadata, social cards, structured data, and sitemap behavior.

### Milestone 2 exit criteria

- Readers can move from any important statement to its evidence and context.
- Readers can compare responses and eligible subjects without false symmetry,
  universal scores, or hidden changes of scope.
- Every Placement exposes its Dimension, basis, scope, uncertainty, evidence,
  and alternative interpretations through an equivalent nonvisual view.
- Readers can understand the method and challenge a precise assertion.
- Changed public routes pass automated rendering checks and receive explicit
  desktop, tablet, and mobile screenshot review before implementation is called
  complete.
- Core routes meet the accessibility and metadata release checklist.

## Milestone 3 — [Advanced comparison and change over time](https://github.com/dougborg/ends-and-means/milestone/3)

**Execution order:** #6 progressive filters and pivots → #29 expanded Event,
Transition, timeline, and temporal-comparison views. Two-axis maps under #26
proceed only after the one-dimensional model and accessibility fallback survive
Milestone 2 review.

- [ ] **Add progressive filters and pivots** ([#6](https://github.com/dougborg/ends-and-means/issues/6)). Filter by Question, entity kind, Collection, Domain, Means, Case, Dimension, evidence gap, and interpretation; preserve keyboard access and URL state.
- [ ] **Add two-dimensional and temporal maps** ([#26](https://github.com/dougborg/ends-and-means/issues/26)). Extend the reviewed one-dimensional model to paired axes and change over time only where comparability and accessibility remain defensible.
- [ ] **Compare transition sequences** ([#29](https://github.com/dougborg/ends-and-means/issues/29)). Compare before/change/after institutional relationships while retaining disputed chronology and rival causal accounts.

## Milestone 4 — [Contribution and editorial governance](https://github.com/dougborg/ends-and-means/milestone/4)

**Execution order:** #32 governance and appeals → #16 licensing, disclosure,
and release gate → #17 contribution workflow → #33 claim-level revision
history.

- [ ] **Open the contribution workflow** ([#17](https://github.com/dougborg/ends-and-means/issues/17)). Add contributor guidance and structured forms for corrections, missing sources, broken links, challenged assessments, and proposed cases. Decide separately when the repository itself should become public.
- [ ] **Define editorial governance** ([#32](https://github.com/dougborg/ends-and-means/issues/32)). Cover moderation, conflicts, affiliate revenue, contentious history, living people, appeals, privacy-safe attribution, and final maintainer authority.
- [ ] **Clear the editorial release gate** ([#16](https://github.com/dougborg/ends-and-means/issues/16)). Confirm code/content licenses, publish affiliate disclosure, and ensure commercial relationships cannot influence source selection or evaluation.
- [ ] **Add claim-level revision history** ([#33](https://github.com/dougborg/ends-and-means/issues/33)). Record substantive changes, reasons, supporting evidence, and privacy-safe contributor credit.

## Milestone 5 — [Knowledge graph expansion](https://github.com/dougborg/ends-and-means/milestone/5)

These features become valuable after the core model and evidence workflow are stable.

**Execution order:** #27 classification method → #30 vocabulary expansion →
#31 competing interpretations. Historical formations, People, Depictions,
reading paths, value profiles, and exports can then proceed in bounded slices
according to research readiness rather than as one bulk migration.

### Interpretation and navigation

- [ ] **Publish a rigorous methods and classification guide** ([#27](https://github.com/dougborg/ends-and-means/issues/27)).
- [ ] **Expand the controlled Concept, Collection, and Domain vocabulary** ([#30](https://github.com/dougborg/ends-and-means/issues/30)). The core primitives belong to Milestone 1 under #47; this later work broadens coverage and reconciles external vocabularies.
- [ ] **Model competing scholarly interpretations** ([#31](https://github.com/dougborg/ends-and-means/issues/31)).
- [ ] **Publish the editorial philosophy as a first-class site section** ([#36](https://github.com/dougborg/ends-and-means/issues/36)).
- [ ] **Curate transparent reading paths** ([#28](https://github.com/dougborg/ends-and-means/issues/28)).

### History, people, and literature

- [ ] **Research historical political-economic formations** ([#23](https://github.com/dougborg/ends-and-means/issues/23)). Include monarchies, feudal arrangements, Greek democracy and poleis, the Roman Republic and Empire, and bounded Chinese and Japanese imperial forms.
- [ ] **Add a first-class People layer** ([#25](https://github.com/dougborg/ends-and-means/issues/25)). Connect philosophers, authors, researchers, organizers, and leaders through typed, sourced relationships.
- [ ] **Add a separate fictional Depictions layer** ([#24](https://github.com/dougborg/ends-and-means/issues/24)).
  Use primary-text provenance, spoiler controls, and copyright-safe summaries;
  never treat fiction as empirical evidence. Model a fictional universe as
  context containing bounded Depictions connected by Events and Transitions,
  just as historical states contain changing Cases rather than one timeless
  system. Begin with a deliberately varied cohort—*1984*, *The Dispossessed*,
  *Snow Crash*, *The Handmaid's Tale*, *Dune*, and bounded *Star Wars* eras—before
  using larger settings such as *Foundation*, the Mars trilogy, *Red Rising*, and
  *Warhammer 40,000* as stress tests.

### Additional analytical views

- [ ] **Add sourced value profiles** ([#37](https://github.com/dougborg/ends-and-means/issues/37)). Separate declared values, design-implied priorities, and cautiously interpreted practice without producing an aggregate score.
- [ ] **Publish stable machine-readable graph exports** ([#34](https://github.com/dougborg/ends-and-means/issues/34)). Include a deterministic JSON-LD/SKOS representation of the compatible vocabulary subset while preserving richer Ends and Means predicates in a documented namespace.

## Completed foundations

- [x] Selected Astro and a framework-independent TypeScript content core.
- [x] Added pinned runtime setup, clean-build documentation, CI, and graph tests.
- [x] Preserved the original eight-by-fourteen research matrix and reading list in deterministic staging records.
- [x] Added graph integrity checks and reviewed migration coverage.
- [x] Migrated all inherited comparisons into clean response drafts or explicit research notes without requiring rectangular target coverage.
- [x] Implemented transitional Tradition, Challenge, Topic, Reading, and
  Framework routes plus an analytical trace prototype.
- [x] Tested inherited dossiers as the primary homepage entry point; the target
  information architecture now replaces that experiment with Explore and
  Compare.
- [x] Added a research skill that implements source-backed content changes directly in reviewable pull requests.
- [x] Added a rendered-page completion gate with desktop, tablet, and mobile
  screenshots plus automated checks for contrast, undefined design tokens,
  overflow, and browser errors; used it to repair the Case overview contrast
  defect through the rendered-page review workflow.
- [x] Deployed the static site to GitHub Pages with the custom domain.

## Explicitly deferred

- Changelog views unless claim-level history proves insufficient.
- GitHub Discussions until issue-based feedback establishes a moderation model.
- Anonymous/private feedback until the GitHub workflow proves too restrictive.
- Broad catalogue expansion until the plural graph and one complete vertical
  slice are validated.
