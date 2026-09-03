# Roadmap

This backlog is ordered by dependency. Each checkbox is intended to become one
GitHub issue when the private remote is available.

## M1 — Content foundation

- [x] **M1.0 Choose the implementation stack.** Use Astro for static rendering
  and isolated matrix interactivity, with a framework-independent TypeScript
  content compiler. Record the decision and boundaries in an ADR.
- [x] **M1.1 Scaffold the chosen stack and CI.** Pin the runtime, add
  install/build checks, and document the clean-clone path.
- [x] **M1.2 Import the 8×14 matrix.** Parse systems, Challenges (stored under
  legacy crux IDs), comparison cells, and row
  verdicts without rewriting source prose. Acceptance: exactly 8 systems, 14
  Challenges, and 112 unique cells.
- [x] **M1.3 Import and classify the reading list.** Preserve section and note;
  assign every source a verification tier. Acceptance: stable IDs and no
  duplicate IDs.
- [x] **M1.4 Curate verdict and evidence mappings.** Replace importer heuristics
  with a reviewed override file. Acceptance: all 112 mappings reviewed in diff.
- [ ] **M1.5 Extract cases and citations.** Create case records and connect cells
  to cases/sources. Acceptance: every reference resolves and the uncited report
  is empty.
- [x] **M1.6 Enforce graph integrity.** Fail builds on missing pairs, duplicates,
  broken references, invalid enums, or unacknowledged missing citations.
- [ ] **M1.7 Model claims and resource links.** Give challengeable claims stable
  anchors. Extend sources with ISBN, DOI, Open Library, publisher, reading, and
  purchase links without making retailer URLs canonical identifiers.
- [ ] **M1.8 Validate external links.** Check links on a scheduled basis, report
  redirects and failures, and distinguish editorial links from purchase links.
- [ ] **M1.9 Formalize the analytical framework.** Review and encode the
  Ends/Means/Challenges/Criteria model before redesigning comparison views.
  Distinguish theoretical mechanisms, formal rules, rules-in-use, bounded
  context, interaction patterns, outcomes, and evaluative judgments; adapt IAD
  as a diagnostic lens without scoring whole societies or treating historical
  cases as universal blueprints.

## M2 — Reference pages

- [x] **M2.1 Shared layout and evidence language.** Establish typography,
  navigation, badges, and mobile behavior.
- [x] **M2.2 System, Challenge, and comparison routes.** Render all three pivots from the
  same cell records, including row/column neighbors.
- [ ] **M2.3 Source, case, and reading routes.** Add backlinks and verification
  filters, borrowing links, publisher links, and clearly labeled purchase links.
- [ ] **M2.4 About and contribution model.** Explain scope, verdicts, evidence
  tiers, editorial review, and how to propose changes.
- [ ] **M2.5 Claim-level correction links.** Add “Suggest a correction” actions
  that prefill the entity, claim anchor, and page URL in a structured GitHub
  issue form.

## M3 — Matrix

- [ ] **M3.1 Static accessible matrix.** Deliver a useful no-JavaScript table.
- [ ] **M3.2 Progressive filters and transpose.** Add evidence filtering,
  hide-untested, and transpose with keyboard and URL-state support.

## M4 — Release

- [ ] **M4.1 Accessibility and metadata pass.** Test keyboard navigation,
  contrast, reduced motion, Open Graph, sitemap, and structured metadata.
- [ ] **M4.2 Editorial release gate.** Clear missing citations and confirm the
  content/code licenses. Publish an affiliate disclosure and ensure commercial
  relationships cannot affect source selection or evaluation.
- [ ] **M4.3 Deploy with GitHub Pages.** Publish the static Astro build through
  the official GitHub Pages workflow, verify the Pages deployment, and connect
  the custom `endsandmeans.info` domain when its DNS is configured.
- [ ] **M4.4 Open contribution workflow.** Add `CONTRIBUTING.md`, correction,
  missing-source, broken-link, verdict-challenge, and new-case issue forms; decide
  when the repository becomes public.
- [x] **M4.5 Add an editorial research skill suite.** Provide a repo-local,
  routed skill for proposing new Challenges, systems, authors/sources, and cases.
  Require authoritative-source research, explicit provenance, neutral summaries,
  complete 14-Challenge system proposals, deduplication and cross-link checks, graph
  validation, a hard human-review boundary before canonical changes, and
  independent forward tests.

## M5 — Expansion (post-v1)

- [ ] **M5.1 Relate systems to historical states and regimes.** Model
  time-bounded, many-to-many classifications with citations and explicit
  contested or partial status; never reduce a country to a single system.
- [ ] **M5.2 Research historical systems and political formations.** Develop a
  sourced taxonomy for monarchy, feudalism, Greek democracy and poleis, the
  Roman Republic and Empire, and historically bounded Chinese and Japanese
  imperial formations. Distinguish political form from economic order and
  determine whether heterogeneous candidates belong as systems, state/regime
  periods, political forms, or other entities before testing any system proposal
  against the existing fourteen Challenges and considering canonical inclusion.
- [ ] **M5.3 Add fictional-system comparisons.** Create a clearly separated
  interpretive layer for systems depicted in literature, with primary-text
  provenance, spoiler controls, copyright-safe summaries, and links to real
  systems and Challenges that never count as empirical verdict evidence.
- [ ] **M5.4 Add a first-class People layer.** Replace the optional Thinker
  concept with stable Person records for relevant philosophers, authors,
  researchers, organizers, and political leaders. Model cited, typed, and
  time-bounded relationships to sources, claims, systems, cases, and state
  periods without implying endorsement, causation, sole responsibility, or a
  great-person account of history.
- [ ] **M5.5 Add multidimensional political-economic mapping.** Prototype the
  existing eight systems on independently defined, sourced axes rather than a
  universal left-right score. Support multiple scholarly lenses, ranges and
  uncertainty, change over time, and accessible nonvisual comparisons while
  keeping mapped positions independent from cell verdicts and evidence.
- [ ] **M5.6 Publish rigorous methods.** Define systems, cases, claims, verdicts,
  evidence, Ends, Means, Challenges, Criteria, context, rules-in-use, outcomes,
  classification, and proposal-to-canonical promotion rules before expanding
  the graph or presenting additional analytical views. Document where the IAD
  adaptation applies and where analysis of broad system ideal types exceeds its
  bounded action-situation scope.
- [ ] **M5.7 Establish a glossary and controlled vocabulary.** Disambiguate
  frequently conflated political-economic terms, manage aliases and deprecated
  labels, and backlink definitions throughout the graph.
- [ ] **M5.8 Model competing interpretations.** Preserve named scholarly lenses,
  disagreements, scope, and provenance without flattening disputes into false
  consensus; build on the methods and vocabulary foundations.
- [ ] **M5.9 Define editorial governance.** Document corrections, moderation,
  conflicts of interest, affiliate revenue, living people, contentious history,
  appeals, and final maintainer authority before opening broader contributions.
- [ ] **M5.10 Add historical timelines.** Visualize sourced state/regime
  transitions with interval uncertainty and accessible tabular equivalents,
  building on the time-bounded relationships from M5.1.
- [ ] **M5.11 Add pairwise comparison.** Generate an accessible “compare these
  two” view from canonical cells without creating duplicate comparison content.
- [ ] **M5.12 Add claim-level revision history.** Record reasons, evidence,
  changes, and privacy-safe contributor attribution for substantive claim edits.
- [ ] **M5.13 Publish machine-readable graph exports.** Provide versioned exports
  with schemas, licenses, provenance, and an explicit compatibility/stability
  policy after the expanded entity model settles.
- [ ] **M5.14 Curate reading paths.** Offer transparent “start here,” “strongest
  critique,” and “primary sources” paths independently of retailer or affiliate
  ranking, with disclosed selection criteria.
- [ ] **M5.15 Publish the editorial philosophy.** Explain the project’s
  commitment to fairness, transparency, and corrigibility; distinguish fact,
  inference, value judgment, analysis, and advocacy; disclose unavoidable
  editorial choices; and tie uncertainty, steelmanning, and revision commitments
  to the methods and governance policies.
- [ ] **M5.16 Add system value profiles.** Compare separately the values systems
  explicitly declare, priorities implied by institutional design, and cautious
  interpretations of dated practice. Use defined, sourced, lens-aware dimensions
  with uncertainty and accessible comparisons—never an aggregate score, proof
  of intent from outcomes, or an input to cell verdicts and evidence.

## Later

- [ ] Add changelog views only if git history proves insufficient.
- [ ] Evaluate additional systems or Challenges only after v1 is fully cited.
- [ ] Evaluate GitHub Discussions after issue-based feedback establishes a
  moderation pattern.
- [ ] Add private or no-GitHub-account feedback through a moderated serverless
  intake only if the GitHub workflow proves too restrictive.
