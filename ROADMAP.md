# Ends and Means roadmap

This roadmap is ordered by product dependency, not by when an idea was first suggested. GitHub issues are the execution backlog; this document explains how the pieces fit together and what “next” means.

## Product direction

Ends and Means is an approaches-first reference experience backed by a plural
graph of political-economic ideas, institutions, arguments, and evidence.

- **Approaches are the primary reader entry point, not the ontology root.** Each
  dossier presents a recognizable configuration of Concepts, attributed Ends,
  proposed Means, internal disputes, and historical development.
- **Concepts are reusable and contested.** Democracy, socialism, liberty, social
  ownership, and similar ideas have scoped definitions and may be interpreted
  differently across Approaches.
- **Collections provide overlapping umbrellas.** Socialist, Communist,
  Anarchist, Democratic, or Stateless collections support discovery without
  forcing one exclusive hierarchy or treating membership as uncontested.
- **Challenges are the primary comparison unit.** They are open questions, not tests with predetermined winners.
- **Topics are discovery aids.** They group related Challenges in familiar language but do not make analytical claims.
- **Ends, Means, and Criteria expose the reasoning.** They distinguish goals, institutional arrangements, and evaluative judgments.
- **Political, economic, social, legal, and cultural are overlapping spheres.**
  More precise Domains are first-class vocabulary connected through qualified
  relationships, not a closed classification embedded on an Approach.
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

The analytical method is accepted, but the ontology is still being validated.
Its implementation is split across a shallow migration graph, a richer
prototype, and a dossier-specific evidence schema. The current Approach kind
and flat domain fields are transitional. Inherited prose also lacks claim-level
citations and bounded cases. The immediate prerequisite to responsible content
expansion is a vertical slice that proves the plural graph can distinguish
Concepts, Approaches, Means, Collections, Cases, and their sourced relationships.

## Recommended next implementation

Converge on one canonical graph, then build one complete, publishable reference
implementation before researching the inherited dossiers in parallel:

1. Revise the canonical graph around first-class Concepts, Collections,
   Domains, and typed relationship records; retain Approaches as the primary
   route rather than the graph root. Align the vocabulary subset with SKOS
   semantics without adopting RDF as the authoring format (#47).
2. Correct inherited category errors: move central planning into Means and use
   Democracy and anarcho-communism as multiplicity and overlap tests (#47).
3. Move the complete social-democratic trace onto that graph and finish removal
   of remaining transitional schema/runtime code (#48).
4. Give substantive Statements stable anchors, locators, and Source
   relationships (#18).
5. Model the two bounded Swedish Cases with explicit context and uncertainty
   (#13).
6. Add Wikipedia and Wikidata orientation/identity references plus publisher,
   library, and reading links; validate them continuously (#41 and #19).
7. Review the complete Challenge → attributed End → Means → bounded evidence →
   Criterion → assessment trace. Then migrate only inherited material that fits
   the new entities and relationships (#39).

This implementation tests the content model, editorial workflow, temporal semantics, empirical/fictional boundary, and reader experience together. Once it survives review, use it as the template for researching the remaining valid dossiers and reclassifying inherited rows under #39.

## Phase 1 — Establish a trustworthy core

This is the active phase. Finish it before widening the catalogue.

- [x] **Approve the analytical method and PR review boundary** ([#38](https://github.com/dougborg/ends-and-means/issues/38)). The analytical boundaries and pull-request review workflow are accepted; the ontology remains subject to the Phase 1 model tests.
- [ ] **Validate and consolidate one plural canonical graph** ([#47](https://github.com/dougborg/ends-and-means/issues/47)). Add Concepts, Collections, Domains, external identities, and typed sourced relationships; prove the distinctions with Democracy, communism/socialism, central planning, anarcho-communism, and one complete evidence trace.
- [ ] **Remove retired matrix and prototype runtime cruft** ([#48](https://github.com/dougborg/ends-and-means/issues/48)). Route cleanup is complete; close the issue after transitional schemas, fixtures, generators, and vocabulary that fail the target model are removed or archived for provenance.
- [ ] **Complete sourced Approach dossiers** ([#39](https://github.com/dougborg/ends-and-means/issues/39)). After the vertical slice, review overview prose, scope, classification disputes, conceptual morphology, attributed Ends, Means relationships, variants, cases, FAQs, and misconceptions; do not preserve all eight inherited rows as Approaches when they belong to another entity type.
- [ ] **Model statements and resource links** ([#18](https://github.com/dougborg/ends-and-means/issues/18)). Give challengeable claims stable anchors. Support DOI, ISBN, publisher, library, reading, and clearly labeled purchase links without making a retailer a canonical identifier.
- [ ] **Extract bounded cases and connect citations** ([#13](https://github.com/dougborg/ends-and-means/issues/13)). Convert useful inherited examples into time- and place-bounded evidence with context, provenance, uncertainty, and carefully scoped relationships.
- [ ] **Add canonical external orientation and identity links** ([#41](https://github.com/dougborg/ends-and-means/issues/41)). Link applicable entities to reviewed Wikipedia articles and Wikidata identifiers while keeping orientation, identity reconciliation, and evidence distinct.
- [ ] **Validate external links continuously** ([#19](https://github.com/dougborg/ends-and-means/issues/19)). Check canonical, editorial, library, and commercial links on a schedule; report redirects and failures without making temporary outages block every build.

### Phase 1 exit criteria

- The replacement schema is canonical and contains no retired-model fields.
- Democracy can exist as a Concept, attributed End, family of Approaches,
  collection of Means, and measured feature of Cases without one overloaded
  record.
- Central planning is modeled as an institutional Means family, not retained as
  an Approach merely because it was an inherited matrix row.
- Anarcho-communism can have qualified membership in multiple Collections
  without an exclusive parent.
- Domains are extensible relationship-backed vocabulary, not a flat enum.
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
- [ ] **Add pairwise Approach comparison** ([#35](https://github.com/dougborg/ends-and-means/issues/35)). Generate “compare these two” views from canonical traces rather than duplicating comparison prose; direct Means, Case, or Concept comparisons use their own scopes.

## Phase 4 — Open and govern contributions

- [ ] **Open the contribution workflow** ([#17](https://github.com/dougborg/ends-and-means/issues/17)). Add contributor guidance and structured forms for corrections, missing sources, broken links, challenged assessments, and proposed cases. Decide separately when the repository itself should become public.
- [ ] **Define editorial governance** ([#32](https://github.com/dougborg/ends-and-means/issues/32)). Cover moderation, conflicts, affiliate revenue, contentious history, living people, appeals, privacy-safe attribution, and final maintainer authority.
- [ ] **Clear the editorial release gate** ([#16](https://github.com/dougborg/ends-and-means/issues/16)). Confirm code/content licenses, publish affiliate disclosure, and ensure commercial relationships cannot influence source selection or evaluation.
- [ ] **Add claim-level revision history** ([#33](https://github.com/dougborg/ends-and-means/issues/33)). Record substantive changes, reasons, supporting evidence, and privacy-safe contributor credit.

## Phase 5 — Expand the knowledge graph

These features become valuable after the core model and evidence workflow are stable.

### Interpretation and navigation

- [ ] **Publish a rigorous methods and classification guide** ([#27](https://github.com/dougborg/ends-and-means/issues/27)).
- [ ] **Expand the controlled Concept, Collection, and Domain vocabulary** ([#30](https://github.com/dougborg/ends-and-means/issues/30)). The core primitives move into Phase 1 under #47; this later work broadens coverage and reconciles external vocabularies.
- [ ] **Model competing scholarly interpretations** ([#31](https://github.com/dougborg/ends-and-means/issues/31)).
- [ ] **Publish the editorial philosophy as a first-class site section** ([#36](https://github.com/dougborg/ends-and-means/issues/36)).
- [ ] **Curate transparent reading paths** ([#28](https://github.com/dougborg/ends-and-means/issues/28)).

### History, people, and literature

- [ ] **Relate Approaches and Means to historical and ongoing Cases** ([#22](https://github.com/dougborg/ends-and-means/issues/22)). Use typed, sourced, many-to-many relationships with explicit periods; distinguish self-identification, influence, partial instantiation, departure, formal design, and rules-in-use; require freshness metadata for ongoing Cases.
- [ ] **Research historical political-economic formations** ([#23](https://github.com/dougborg/ends-and-means/issues/23)). Include monarchies, feudal arrangements, Greek democracy and poleis, the Roman Republic and Empire, and bounded Chinese and Japanese imperial forms.
- [ ] **Add sourced historical transition timelines** ([#29](https://github.com/dougborg/ends-and-means/issues/29)).
- [ ] **Add a first-class People layer** ([#25](https://github.com/dougborg/ends-and-means/issues/25)). Connect philosophers, authors, researchers, organizers, and leaders through typed, sourced relationships.
- [ ] **Add a separate fictional Depictions layer** ([#24](https://github.com/dougborg/ends-and-means/issues/24)). Use primary-text provenance, spoiler controls, and copyright-safe summaries; never treat fiction as empirical evidence.

### Additional analytical views

- [ ] **Explore multidimensional political-economic mapping** ([#26](https://github.com/dougborg/ends-and-means/issues/26)). Use independently defined axes, multiple scholarly lenses, uncertainty, and accessible nonvisual equivalents—never a single left/right score.
- [ ] **Add sourced value profiles** ([#37](https://github.com/dougborg/ends-and-means/issues/37)). Separate declared values, design-implied priorities, and cautiously interpreted practice without producing an aggregate score.
- [ ] **Publish stable machine-readable graph exports** ([#34](https://github.com/dougborg/ends-and-means/issues/34)). Include a deterministic JSON-LD/SKOS representation of the compatible vocabulary subset while preserving richer Ends and Means predicates in a documented namespace.

## Completed foundations

- [x] Selected Astro and a framework-independent TypeScript content core.
- [x] Added pinned runtime setup, clean-build documentation, CI, and graph tests.
- [x] Preserved the original eight-by-fourteen research matrix and reading list in deterministic staging records.
- [x] Added graph integrity checks and reviewed migration coverage.
- [x] Migrated all inherited comparisons into clean response drafts or explicit research notes without requiring rectangular target coverage.
- [x] Implemented Approach, Challenge, Topic, Reading, and Framework routes plus an analytical trace prototype.
- [x] Made the inherited dossiers the primary homepage entry point as a reader-experience experiment; their ontology remains transitional.
- [x] Added a research skill that implements source-backed content changes directly in reviewable pull requests.
- [x] Deployed the static site to GitHub Pages with the custom domain.

## Explicitly deferred

- Changelog views unless claim-level history proves insufficient.
- GitHub Discussions until issue-based feedback establishes a moderation model.
- Anonymous/private feedback until the GitHub workflow proves too restrictive.
- Broad catalogue expansion until the plural graph and one complete vertical
  slice are validated.
