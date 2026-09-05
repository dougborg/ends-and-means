# ADR 0004: Subject guides are validated presentation compositions

**Status:** accepted

## Context

Readers arrive with familiar but ambiguous subjects such as communism,
socialism, democracy, or anarchism.
Those words can refer to concepts, traditions, movements, proposed social
orders, institutional arrangements, self-descriptions, or historical labels.
Requiring a reader to choose a canonical entity kind before learning would make
the graph's implementation structure the site's information architecture.

The existing Dossier contract intentionally gives one canonical subject a
standfirst and evidence-traced narrative.
It cannot by itself own a complete cross-entity learning journey without either
duplicating claims or overloading that subject as an ontology root.
An earlier incomplete Topic notion also implied a reader-facing grouping but
never established distinct identity, evidence ownership, or semantics beyond
discovery.

## Decision

Introduce **SubjectGuide** as the name of a future validated presentation
composition above entity-owned Dossiers and plural canonical records.
It is not a graph superclass, canonical subject kind, Collection, or replacement
for Dossiers.
This ADR defines the boundary but does not implement a schema.

A SubjectGuide may select and order material from several canonical subjects,
Dossiers, Statements, Sources, Research Obligations, and derived relationship
queries.
It owns the learner journey, non-identifying `searchQueries` and entry phrases,
section order, and editorial transitions between records.
It does not own duplicated factual claims or relationships.
Every substantive factual clause still resolves to canonical Statements, and
every relationship remains independently typed, scoped, and sourced.

An entity-owned Dossier remains the readable narrative for exactly one
canonical subject.
A SubjectGuide may use that narrative or link to it, but it cannot silently
merge a Concept, Approach, Means, movement, or Case into one identity.
Cases remain bounded evidence and never become pure embodiments of a guide's
subject.
Research Obligations remain attached to exact canonical targets or Dossier
sections and can be surfaced in a guide without changing ownership.

Do not implement `Topic` as a canonical contract.
Entity alternate and hidden labels name the same canonical identity.
Familiar discovery queries that do not assert identity belong to a future
SubjectGuide's `searchQueries`; Collections and Domains provide other browse
paths.
Query collisions require explicit disambiguation, and retired guide paths may
redirect only after review confirms that canonical identities are not being
silently merged.
Existing prose that uses “topic” in its ordinary-language sense is unaffected.

## Consequences

- Public navigation can begin with recognizable subjects while the graph keeps
  its plural boundaries.
- High-level guides can teach ambiguity instead of hiding it.
- Dossiers remain reusable, independently reviewable presentation records.
- Search queries and guide composition need a validated contract before
  implementation.
- Completeness checks must evaluate learner journeys as well as canonical graph
  coverage.
- Compare and discovery views remain derived from shared canonical records
  rather than owning duplicate prose.
- A future SubjectGuide schema requires its own implementation issue, fixtures,
  rendering tests, and model-boundary review.
- Presentation composition is the default response to a new learner need.
  A canonical model change requires a researched representational failure,
  boundary fixtures, and a new or superseding ADR.
