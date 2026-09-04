# ADR 0002: Git-backed modular content and a compiled canonical graph

**Status:** accepted

## Context

Ends and Means needs a reviewable source of truth for an evolving, strongly
typed knowledge model. Earlier matrix, migration-graph, and prototype
experiments demonstrated why one publication model is necessary; they now live
only in the non-runtime research archive. The project does not require accounts, private submissions, live
collaborative editing, personalized state, or high-frequency writes.

## Decision

Keep canonical content in small, reviewable files in Git. Organize authoring
records by entity type and relationship family and compile them deterministically
into one validated read graph consumed by Astro routes, tests, and future
exports. “One graph” is a logical/runtime guarantee, not a single authoring
document.

The canonical domain distinguishes five layers:

1. vocabulary: Concepts, Domains, Collections, labels, and external identities;
2. arguments: Approaches, attributed Ends, Means, Challenges, and Criteria;
3. real-world evidence: bounded historical or ongoing Cases, participants,
   formal rules, rules-in-use, outcomes, Statements, and Sources;
4. interpretation: typed relationships, competing interpretations, response
   traces, and Criterion-specific assessments;
5. presentation: dossiers, comparisons, timelines, reading paths, and a
   separate fictional Depiction experience.

Approach is one domain entity within entity-neutral Explore and Compare views,
not the graph's root type or universal public bucket. An Approach is a
recognizable configuration of Concepts, attributed Ends, and proposed Means.
Broad ideological or thematic umbrellas are overlapping
Collections with qualified membership, not Approach kinds. Domains are
first-class vocabulary records connected through sourced relationships rather
than a closed enum embedded on an Approach.

The vocabulary subset follows SKOS semantics for Concepts, labels, Concept
Schemes, Collections, mappings, and broader/narrower/related links. Canonical
authoring remains TypeScript-validated records rather than RDF; a deterministic
JSON-LD export may expose the compatible subset later. Domain entities and
analytical predicates are not flattened into `skos:Concept` merely for
standards conformance.

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
- The compiled graph is derived in memory and never hand-edited.
- Future generated exports must remain outside canonical authoring directories.
- Entity files own intrinsic fields; subject-centered relationship files own
  substantive edges; rendered dossiers and backlinks are derived views.
- Publication state lives on entities or relationships rather than requiring a
  parallel schema.
- Runtime pages cannot introduce route-specific content models.
- Archived research is a discovery aid, never a production or import input.
- Database adoption requires a new ADR tied to concrete interactive-write or
  scale requirements.
