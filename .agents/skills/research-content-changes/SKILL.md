---
name: research-content-changes
description: Research and implement evidence-backed changes to the Ends and Means canonical graph and learner-facing narrative for review in a pull request. Use for additions or substantial revisions to Subject Guides, Dossiers, vocabulary, Collections, Approaches, Ends, Means, Questions, Criteria, Statements, Sources, bounded Cases, Events, Transitions, Depictions, Comparison Dimensions, or Placements.
---

# Research Content Changes

Create the concrete candidate change on a focused branch. The pull request is
the proposal and review boundary; do not create a parallel proposal artifact or
staging tree.

Begin with the reader's familiar subject or question.
The primary product is a clear learning and comparison journey; the graph and
evidence trace are its trust infrastructure.
Do not require readers to choose an entity kind before learning.
Treat “learner-first,” “learner path,” “learner journey,” “reader-first,”
“reader path,” “reader journey,” and similar audience framing as internal
product language, not published copy.
Public guide and Dossier identity text must describe the subject directly:
state what it can mean, identify important institutions or mechanisms, and name
a central boundary that the cited Statements support.

## Branch and review boundary

Before writing, run `git branch --show-current`. Never create or revise a
content on `main` or `master`. If the worktree is clean, create a focused branch
named `research/<type>-<stable-id>`; if it is not clean, stop and ask the user
how to preserve their work.

When parallel agents are explicitly requested, use shared worktrees only for
read-only audits. Give each mutating agent a dedicated branch and worktree with
an agreed file boundary. Never switch the branch of a worktree another agent is
using, edit another agent's dirty files, or merge on the agent's behalf. The
integrating agent reviews reported commits and reruns the complete suite.

Implement directly in the canonical content model or its deterministic source
generator. Research, rendering, and tests may change together when they form one
reviewable outcome. Push and open a draft pull request when authorized; do not
merge or publish without human approval.

Rebase onto the current base before final review and integration.
Resolve automated review findings and obtain an independent adversarial review
of the material content and model-boundary risks.
Integrate with rebase-only linear history, then verify public output after
deployment.

## Route the request

1. Read [references/editorial-policy.md](references/editorial-policy.md).
2. For Dossiers or other reader-facing narrative, read
   [the narrative style guide](../../../docs/narrative-style.md).
3. Read each relevant entity route:
   - [Concept](references/routes/concept.md)
   - [Collection](references/routes/collection.md)
   - [Approach](references/routes/approach.md)
   - [end](references/routes/end.md)
   - [means](references/routes/means.md)
   - [challenge](references/routes/challenge.md)
   - [criterion](references/routes/criterion.md)
   - [statement](references/routes/statement.md)
   - [source](references/routes/source.md)
   - [research obligation](references/routes/research-obligation.md)
   - [case](references/routes/case.md)
   - [Event and Transition](references/routes/event-transition.md)
   - [Depiction](references/routes/depiction.md)
   - [Comparison Dimension and Placement](references/routes/dimension-placement.md)

For schema, compiler, or model-boundary work, also read
[testing model boundaries](references/testing-model-boundaries.md).

For requests spanning entity types, keep entities independently addressable and
connect them through explicit relationships instead of embedding duplicates.
Subject Guides are validated presentation compositions above entity-owned
Dossiers and plural canonical records, not graph superclasses or new owners of
factual claims.
Author them as `subject-guide` documents that select existing Dossier narrative,
Statements, entities, relationships, and Research Obligations by ID.
Do not add a guide `kind`, body prose, graph edges, or alternate labels, and do
not revive the incomplete Topic contract.
Use evidence progressive disclosure so supporting claims remain close at hand
without displacing the learner narrative.
Keep each Case bounded by place, period, and institutions; never present it as
a pure embodiment of a subject or Approach.
Treat entity alternate and hidden labels as names for the same canonical
identity.
Treat SubjectGuide `searchQueries` as non-identifying entry phrases;
disambiguate collisions explicitly and never use a redirect to merge distinct
canonical identities.
Mark an entry phrase as `research-gap` only when its nearest reviewed guide does
not fully answer the broader query, and supply a plain reader-facing boundary.
Explore discovery must derive aliases from the reviewed/published guide
projection rather than maintaining a parallel index.
Require the short answer, meanings and boundaries, and comparisons and next
steps exactly once.
The short answer must select the primary subject's Dossier standfirst, and the
meanings section must select traced narrative or Statements rather than only
related records.
Omit unsupported conditional roles; a bounded-practice section must select a
Case or Case Episode, a depiction section a Depiction, and an open-question
section a Research Obligation.
Treat `subjectGuideRecords` as editorial input.
Reader-facing routes and discovery must use only the reviewed/published
`subjectGuides` projection or its public lookup helpers.
For a selected relationship, preserve its direction, status, scope, evidence,
and citation role; use perspective-aware public labels without rewriting the
canonical predicate.

Prefer presentation composition for new learner needs.
Propose a canonical model change only when researched content demonstrates a
representational failure, boundary fixtures capture the intended invariants,
and an ADR records the decision.

Use authoritative sources and browse every cited URL. Preserve URL-level
provenance, distinguish observations from attributed values and editorial
interpretations, and document conflicting evidence and limitations. Search the
canonical graph, `archive/legacy-research/`, and open changes for duplicates
before writing. Archived material is a discovery lead only and must never be
imported, rendered, or cited as evidence. Record plausible candidates; do not
silently merge concepts.
Keep substantive claims as atomic Statements with precise locators.

For external orientation and identity mappings, browse the final target after
resolving redirects and disambiguation. Record Wikipedia only as an orientation
link with its language, canonical article URL, and check date; record Wikidata
only as an identity link with canonical QID/URL, check date, and exact or close
confidence. Exact means the same authored identity; broader, narrower, or
differently bounded items are close or remain intentionally unmatched. Keep a
reason for every intentional absence, reuse an entity-owned mapping for its
Subject Guide, and never treat these links or imported taxonomy as evidence.

For narrative prose, write plain-spoken analytical synthesis from the canonical
Statement ledger or closed-source notes rather than by editing source wording.
Verify every factual clause against its listed Statements, compare the draft
against consulted sources for suspiciously close phrasing, and remove repeated
explanations and generic filler. Treat automated prose findings as attention
signals; accuracy, fairness, source similarity, and publication require human
review.
Apply the same standard to short metadata.
Do not substitute framework labels such as “a guide,” “an orientation,” or “an
account” for a substantive description of the subject.
The `pnpm audit:content-integrity` stage inside `pnpm verify` surfaces close
phrasing with source-backed Statements and the cited Sources that require comparison. Treat that output
only as a review location: inspect the actual source passages before judging
quotation, attribution, or improper copying risk.

When the content audit reports narrative–Statement overlap, inspect the actual
cited passage before adding a reviewed-overlap acknowledgement. Follow
`docs/reviewed-overlap-acknowledgements.md`; never use an acknowledgement as
proof of independent authorship, copy a fingerprint without source review, or
replace its exact governed-input hash with a broad suppression.

For a high-level subject, assess learner completeness as well as graph coverage:
a short answer and scope; important meanings and disputed uses; attributed
purposes; proposed institutions; bounded practice; serious disagreements and
limits; comparisons and related paths; relevant Depictions kept separate from
empirical evidence; sources; and focused open questions.
Do not manufacture a section to satisfy this sequence; record an exact research
gap when evidence is not ready.

Treat geographic and organizational diversity as foundational coverage.
Use the non-public candidate matrix described in
`docs/corpus-diversity-matrix.md` to inspect multidimensional source feasibility;
never turn its context tags into quotas, rankings, regional essences, or live
canonical records.
Research bounded, society-specific formations, including Indigenous,
kinship-based, stateless, nomadic or pastoral, maritime or island, city-state,
imperial, colonial, and hybrid institutions, using the evidence traditions
appropriate to each subject.
Use community self-description and oral-history provenance where appropriate;
distinguish them from imposed administrative names and external analysis.
Do not impose universal “tribal,” “primitive,” or evolutionary-stage categories.

When reconciling archived material:

Treat `content/domain/` as the only publishable content source and preserve the
canonical-only publication boundary.

- search for semantic duplicates as well as exact ID collisions;
- split compound Means and multi-proposition claims into independently
  addressable records;
- treat legacy prose and IDs as provenance, not aliases or canonical contracts;
- require verified source metadata and precise locators before advancing a
  Statement beyond `research-needed`; and
- route unresolved fragments to the relevant backlog issue, with an archive
  path when useful, rather than manufacturing canonical coverage or restoring
  an archive file to the production content tree.

Search active Research Obligations for the subject before starting substantive
research. Resolve or partially address an obligation only after new evidence is
reconciled into the Statement ledger. When reviewed work exposes a material
counterargument, counterevidence need, causal counterfactual, or other focused
gap, record it as a Research Obligation rather than hiding it in vague caveat
language or internal workflow notes.
Name the exact existing Statements the obligation tests in
`addressedStatementIds`, or attach it to an exact Dossier section when no
Statement yet owns the limitation. Keep those triggers separate from result
`statementIds`. Split questions whose outcomes can be researched or closed
independently. Record and render lifecycle status; resolution and withdrawal
require a rationale and closure date, while partial progress remains active as
`partially-addressed`; an obligation with reconciled Statements cannot remain
`open`.

Do not recreate a fixed comparison matrix or require every Approach to answer
every Challenge. Keep Dimensions descriptive and Criteria evaluative; never let
a Placement determine an assessment, Collection membership, or aggregate score.
Do not use retired entity names, abbreviated row IDs, verdicts, or evidence
grades. Missing relationships and placements are legitimate research gaps.

Fiction may support an interpretation of a Depiction, but it cannot support or
challenge an empirical observation, outcome, or assessment. Context and
qualifying citations remain permitted only when a Source tied to a resolved
non-fiction Work independently supports the empirical Statement.

Install Playwright's Chromium runtime once.
Run before handoff:

```bash
pnpm audit:content-preflight
pnpm verify
```

Use focused affected checks while authoring and remediating findings, then run
the semantic preflight before the single full handoff verification. Rerun the
full gate after a later change or rebase only when it can affect the verified
surface; exact-head hosted CI, independent review, and post-merge verification
remain mandatory.
The preflight uses a deletion-safe base-versus-head compiled-graph comparison,
so shared helpers, Markdown narrative, and registry changes cannot rely on file
export discovery. Treat optional Source metadata and coarse ledger/mutation
coverage as review signals; they are not evidence of semantic completeness.
The final command is the CI-parity publication gate. It rejects structural,
narrative-line, workflow-language, route, browser, and archive-exclusion
violations while reporting missing dossiers, entities, references,
relationships, Placements, and Research Obligations as actionable attention
where absence may be legitimate.

Use the repository pull-request template. The PR must name the concrete changes,
evidence conflicts, limitations, and human decisions required before merge.
Merging the reviewed PR is the acceptance and publication decision.
