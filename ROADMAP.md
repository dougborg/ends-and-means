# Roadmap

This backlog is ordered by dependency. Each checkbox is intended to become one
GitHub issue when the private remote is available.

## M1 — Content foundation

- [x] **M1.0 Choose the implementation stack.** Use Astro for static rendering
  and isolated matrix interactivity, with a framework-independent TypeScript
  content compiler. Record the decision and boundaries in an ADR.
- [x] **M1.1 Scaffold the chosen stack and CI.** Pin the runtime, add
  install/build checks, and document the clean-clone path.
- [x] **M1.2 Import the 8×14 matrix.** Parse systems, cruxes, cells, and row
  verdicts without rewriting source prose. Acceptance: exactly 8 systems, 14
  cruxes, and 112 unique cells.
- [x] **M1.3 Import and classify the reading list.** Preserve section and note;
  assign every source a verification tier. Acceptance: stable IDs and no
  duplicate IDs.
- [ ] **M1.4 Curate verdict and evidence mappings.** Replace importer heuristics
  with a reviewed override file. Acceptance: all 112 mappings reviewed in diff.
- [ ] **M1.5 Extract cases and citations.** Create case records and connect cells
  to cases/sources. Acceptance: every reference resolves and the uncited report
  is empty.
- [ ] **M1.6 Enforce graph integrity.** Fail builds on missing pairs, duplicates,
  broken references, invalid enums, or unacknowledged missing citations.
- [ ] **M1.7 Model claims and resource links.** Give challengeable claims stable
  anchors. Extend sources with ISBN, DOI, Open Library, publisher, reading, and
  purchase links without making retailer URLs canonical identifiers.
- [ ] **M1.8 Validate external links.** Check links on a scheduled basis, report
  redirects and failures, and distinguish editorial links from purchase links.

## M2 — Reference pages

- [ ] **M2.1 Shared layout and evidence language.** Establish typography,
  navigation, badges, and mobile behavior.
- [ ] **M2.2 System, crux, and cell routes.** Render all three pivots from the
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
- [ ] **M4.3 Deploy a Vercel preview.** Verify a clean production build and
  publish a shareable preview URL.
- [ ] **M4.4 Open contribution workflow.** Add `CONTRIBUTING.md`, correction,
  missing-source, broken-link, verdict-challenge, and new-case issue forms; decide
  when the repository becomes public.

## Later

- [ ] Add changelog views only if git history proves insufficient.
- [ ] Evaluate additional systems or cruxes only after v1 is fully cited.
- [ ] Evaluate GitHub Discussions after issue-based feedback establishes a
  moderation pattern.
- [ ] Add private or no-GitHub-account feedback through a moderated serverless
  intake only if the GitHub workflow proves too restrictive.
