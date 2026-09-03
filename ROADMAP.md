# Roadmap

This backlog is ordered by dependency. Each checkbox is intended to become one
GitHub issue when the private remote is available.

## M1 — Content foundation

- [ ] **M1.0 Choose the implementation stack.** Time-box a comparison of a
  minimal static generator, Astro, and one React-based option against the graph
  model, validation, accessible no-JS output, matrix interactivity, maintenance,
  and Vercel deployment. Record the decision and rejected alternatives.
- [ ] **M1.1 Scaffold the chosen stack and CI.** Pin the runtime, add
  install/build checks, and document the clean-clone path.
- [ ] **M1.2 Import the 8×14 matrix.** Parse systems, cruxes, cells, and row
  verdicts without rewriting source prose. Acceptance: exactly 8 systems, 14
  cruxes, and 112 unique cells.
- [ ] **M1.3 Import and classify the reading list.** Preserve section and note;
  assign every source a verification tier. Acceptance: stable IDs and no
  duplicate IDs.
- [ ] **M1.4 Curate verdict and evidence mappings.** Replace importer heuristics
  with a reviewed override file. Acceptance: all 112 mappings reviewed in diff.
- [ ] **M1.5 Extract cases and citations.** Create case records and connect cells
  to cases/sources. Acceptance: every reference resolves and the uncited report
  is empty.
- [ ] **M1.6 Enforce graph integrity.** Fail builds on missing pairs, duplicates,
  broken references, invalid enums, or unacknowledged missing citations.

## M2 — Reference pages

- [ ] **M2.1 Shared layout and evidence language.** Establish typography,
  navigation, badges, and mobile behavior.
- [ ] **M2.2 System, crux, and cell routes.** Render all three pivots from the
  same cell records, including row/column neighbors.
- [ ] **M2.3 Source, case, and reading routes.** Add backlinks and verification
  filters.
- [ ] **M2.4 About and contribution model.** Explain scope, verdicts, evidence
  tiers, editorial review, and how to propose changes.

## M3 — Matrix

- [ ] **M3.1 Static accessible matrix.** Deliver a useful no-JavaScript table.
- [ ] **M3.2 Progressive filters and transpose.** Add evidence filtering,
  hide-untested, and transpose with keyboard and URL-state support.

## M4 — Release

- [ ] **M4.1 Accessibility and metadata pass.** Test keyboard navigation,
  contrast, reduced motion, Open Graph, sitemap, and structured metadata.
- [ ] **M4.2 Editorial release gate.** Clear missing citations and confirm the
  content/code licenses.
- [ ] **M4.3 Deploy a Vercel preview.** Verify a clean production build and
  publish a shareable preview URL.

## Later

- [ ] Add changelog views only if git history proves insufficient.
- [ ] Evaluate additional systems or cruxes only after v1 is fully cited.
