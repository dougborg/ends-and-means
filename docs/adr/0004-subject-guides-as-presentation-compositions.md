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

Introduce **SubjectGuide** as a validated presentation
composition above entity-owned Dossiers and plural canonical records.
It is not a graph superclass, canonical subject kind, Collection, or replacement
for Dossiers.
The compiler stores every validated record in the separate ordered
`subjectGuideRecords` collection, not in `entities`.
Only reviewed and published records enter the reader-safe `subjectGuides`
projection and its stable-ID and public-slug indexes.
Editorial tooling may inspect the raw record collection; routes and discovery
must use the live projection or its public lookup helpers.

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
Familiar discovery queries that do not assert identity belong to a
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
- A guide has a stable internal ID, a unique public slug, one primary subject,
  ordered typed sections, owned search queries, optional reviewed redirects,
  and a substantive review date.
- `short-answer`, `meanings-and-boundaries`, and
  `comparisons-and-next-steps` are required exactly once.
  Purpose, institution, bounded-practice, dispute, depiction, and open-question
  sections are conditional and omitted when canonical material is not ready.
- A short answer selects exactly one Dossier standfirst.
  That Dossier must belong to the guide's `primarySubject`.
  Other sections select Dossier passages, Statements, entities, relationships,
  or Research Obligations; no guide section owns a free-standing prose body.
- Meanings and boundaries must select traced Dossier narrative or a Statement;
  bare related-record links cannot substitute for an explanation.
- Live guides may select only reviewed or published canonical material.
  Bounded-practice sections must select a Case or Case Episode, depiction
  sections must select a Depiction, and open-question sections must select a
  Research Obligation.
- A relationship selected by a live guide must have reviewed or published
  endpoints and supporting Statements wherever its predicate requires evidence.
  Citation selections retain their exact support, challenge, qualification, or
  context role and precise locator.
- Relationship labels are derived for the subject or object reading direction.
  They do not rename predicates or erase citation roles.
- Search-query collisions require an explicit disambiguation from every guide
  involved.
  A query that matches another live guide's normalized slug also requires
  disambiguation; a guide may own the direct query matching its own slug.
  Redirects are reviewed aliases for retired guide slugs, not identity claims,
  and cannot collide with an active slug or search query.
- Completeness checks must evaluate learner journeys as well as canonical graph
  coverage.
- Compare and discovery views remain derived from shared canonical records
  rather than owning duplicate prose.
- The first reviewed composition is the Economic democracy guide.
  A compiled structural Communism fixture owns synthetic test-local canonical
  records and remains outside the live projection until real claims and
  narrative have independent research review.
- Presentation composition is the default response to a new learner need.
  A canonical model change requires a researched representational failure,
  boundary fixtures, and a new or superseding ADR.
