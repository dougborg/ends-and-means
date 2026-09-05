---
name: research-content-changes
description: Research and implement evidence-backed changes to the Ends and Means canonical graph and reader-facing narrative for review in a pull request. Use for additions or substantial revisions to Dossiers, vocabulary, Collections, Approaches, Ends, Means, Questions, Criteria, Statements, Sources, bounded Cases, Events, Transitions, Depictions, Comparison Dimensions, or Placements.
---

# Research Content Changes

Create the concrete candidate change on a focused branch. The pull request is
the proposal and review boundary; do not create a parallel proposal artifact or
staging tree.

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

Use authoritative sources and browse every cited URL. Preserve URL-level
provenance, distinguish observations from attributed values and editorial
interpretations, and document conflicting evidence and limitations. Search the
canonical graph, `archive/legacy-research/`, and open changes for duplicates
before writing. Archived material is a discovery lead only and must never be
imported, rendered, or cited as evidence. Record plausible candidates; do not
silently merge concepts.

For narrative prose, write plain-spoken analytical synthesis from the canonical
Statement ledger or closed-source notes rather than by editing source wording.
Verify every factual clause against its listed Statements, compare the draft
against consulted sources for suspiciously close phrasing, and remove repeated
explanations and generic filler. Treat automated prose findings as attention
signals; accuracy, fairness, source similarity, and publication require human
review.

When promoting transitional or legacy material:

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
require a rationale and closure date, while partial progress remains active.

Do not recreate a fixed comparison matrix or require every Approach to answer
every Challenge. Keep Dimensions descriptive and Criteria evaluative; never let
a Placement determine an assessment, Collection membership, or aggregate score.
Do not use retired entity names, abbreviated row IDs, verdicts, or evidence
grades. Missing relationships and placements are legitimate research gaps.

Fiction may support an interpretation of a Depiction, but it cannot support or
challenge an empirical observation, outcome, or assessment. Context and
qualifying citations remain permitted only when a Source tied to a resolved
non-fiction Work independently supports the empirical Statement.

Run before handoff:

```bash
pnpm validate
pnpm check
pnpm test
pnpm build
pnpm test:routes
pnpm audit:content
```

Use the repository pull-request template. The PR must name the concrete changes,
evidence conflicts, limitations, and human decisions required before merge.
Merging the reviewed PR is the acceptance and publication decision.
