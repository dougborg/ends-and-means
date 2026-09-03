# ADR 0002: Git-backed modular content and a compiled canonical graph

**Status:** accepted

## Context

Ends and Means needs a reviewable source of truth for an evolving, strongly
typed knowledge model. Current experiments split content among a shallow
migration graph, a richer analytical prototype, and a dossier-specific evidence
file. The project does not yet require accounts, private submissions, live
collaborative editing, personalized state, or high-frequency writes.

## Decision

Keep canonical content in small, reviewable files in Git. Organize authoring
records by entity type and compile them deterministically into one validated
read graph consumed by Astro routes, tests, and future exports.

The canonical domain distinguishes four layers:

1. concepts: Approaches, Ends, Means, Challenges, Criteria, and Topics;
2. real-world evidence: bounded historical or ongoing Cases, participants,
   formal rules, rules-in-use, outcomes, Statements, and Sources;
3. interpretation: typed relationships, competing interpretations, response
   traces, and Criterion-specific assessments;
4. presentation: dossiers, comparisons, timelines, reading paths, and a
   separate fictional Depiction experience.

Approach is an umbrella, not a claim that every entry is the same kind of
thing. Each Approach records a kind such as tradition, ideal type,
institutional family, named model, or political program, plus the institutional
domains it addresses.

Real-world Approach–Case relationships are first-class, typed, sourced, scoped,
and uncertain where appropriate. Ongoing Cases carry `asOf`, review-date, and
update-state metadata. Fictional Depictions are tied to works and may relate to
concepts, but validation prevents them from supporting empirical outcome
claims.

Do not add a database now. Stable IDs, explicit lifecycle state, portable
TypeScript validation, and a documented compiled format preserve a future path
to PostgreSQL if interactive writes, private moderation, accounts, or scale
make file-backed authoring inadequate.

## Consequences

- Pull requests remain the proposal, review, and publication boundary.
- Git supplies attribution, discussion, history, rollback, and branching.
- Authors review focused records instead of one hand-edited graph document.
- The compiled graph is generated and never hand-edited.
- Publication state lives on entities or relationships rather than requiring a
  parallel schema.
- Runtime pages cannot introduce route-specific content models.
- Archive imports remain provenance inputs and leave the production build after
  canonical migration parity is demonstrated.
- Database adoption requires a new ADR tied to concrete interactive-write or
  scale requirements.
