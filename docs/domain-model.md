# Target domain model: a plural political-economy graph

**Status:** implementation contract.

Ends and Means needs to represent ideas that overlap, change meaning across
contexts, and appear in theory, institutional design, historical practice, and
fiction. The canonical model is therefore a **plural graph**, not a taxonomy of
systems and not an Approach-shaped tree.

Public navigation begins with familiar subjects and reader questions.
The [project vision](project-vision.md) defines that experience; no navigation
label is an ontology root.

## Design principles

1. **Identity before classification.** Give an idea, institution, case, or work
   a stable identity before deciding where it belongs.
2. **Kinds are not hierarchies.** Calling something an Approach, Means, or Case
   describes what sort of record it is; it does not determine its ideological
   family.
3. **Relationships carry the argument.** Membership, influence, advocacy,
   implementation, evaluation, and disagreement are independently addressable,
   scoped, and sourced.
4. **Classification may be plural and contested.** An entity may appear in
   several collections, and sources may disagree about a relationship.
5. **Theory, design, and practice stay separate.** A country is not an ideology;
   an observed institution is not identical to its advocates' design; an
   outcome does not establish intent.
6. **Time and place constrain evidence.** Empirical statements attach to bounded
   Cases or episodes, including an `asOf` date for ongoing cases.
7. **Values are attributed.** Ends belong to actors, texts, organizations, or
   cautiously reasoned editorial interpretations—not to labels by fiat.
8. **Sparse is honest.** Missing links are research gaps, not null positions in
   a required comparison matrix.
9. **The semantic core changes only for demonstrated failures.** Try
   presentation composition first. Change the canonical model only after
   researched content exposes a representational failure, boundary fixtures
   capture the required invariants, and an ADR records the decision.

### Society-specific political organization

Terms such as *tribe*, *band*, *clan*, *chiefdom*, *council*, *confederacy*,
*customary law*, *nomadic*, and *pastoral* do not form a canonical sequence or
name interchangeable political systems.
Model the people, place, period, authority, relationships, and institutions that
the evidence supports; keep community self-description separate from translated,
scholarly, colonial, and statutory classifications.
Common search language may route to a reviewed society-specific guide without
becoming a canonical Concept or alternate label.
See [ADR 0005](adr/0005-society-specific-political-organization.md).

## The layers

```text
VOCABULARY            ARGUMENTS                 EVIDENCE
Concept               Approach                  Case
Domain                End attribution           Observation
Collection            Means relationship        Source
Preferred/alt label   Challenge response        Locator
                      Criterion assessment

INTERPRETATION                                  PRESENTATION
Statement             Depiction                 Dossier
Typed relationship    Work                      Comparison
Rival interpretation  Interpretive claim        Timeline / reading path
```

Presentation objects are canonical reader-facing records derived from the
argument and evidence layers. They may own narrative synthesis, but never
duplicate factual claims or graph relationships: each supported or qualified
section traces to canonical Statements, while research gaps remain explicit.

A SubjectGuide composes a complete learning journey from several
canonical records and entity-owned Dossiers without becoming a graph entity or
duplicating claims.
The boundary is recorded in
[ADR 0004](adr/0004-subject-guides-as-presentation-compositions.md).

```ts
interface SubjectGuide {
  id: string;
  slug: string;
  label: string;
  description: string;
  publicationStatus: PublicationStatus;
  primarySubject: EntityRef & { kind: DossierSubjectKind };
  searchQueries: Array<{
    query: string;
    disambiguation?: string;
  }>;
  redirects?: Array<{ from: string; reviewedAt: string }>;
  sections: SubjectGuideSection[];
  reviewedAt: string;
}
```

Guide sections have one typed learner-journey role and select existing Dossier
standfirsts or sections, Statements, entities, relationships, and Research
Obligations by ID.
They have no prose body and assert no graph edge.
The compiler emits all validated guide records beside `entities` and
`relationships`, then derives a reader-safe projection containing only reviewed
and published guides.
Raw and live records have explicitly named stable-ID and public-slug indexes.
Reader-facing code must use `subjectGuideById` or `subjectGuideBySlug`; raw
record lookup is reserved for editorial audits and must never drive a route.
The guide ID and primary-subject reference remain separate so composition does
not imply identity or inheritance.

The short-answer role selects one Dossier standfirst whose subject exactly
matches `primarySubject`.
Meanings and boundaries select traced narrative or Statements rather than bare
related-record links.
Live relationship selections require live endpoints and mature supporting
Statements, while citation labels preserve support, challenge, qualification,
and context roles in both reading directions.

### Dossier

A Dossier attaches readable narrative to one canonical subject without forcing
presentation prose into every entity type. It supplies the shared standfirst
used by directories and detail-page introductions, followed by ordered sections
that carry stable IDs and an evidence status. The standfirst has its own
Statement trace because concise summary prose still makes substantive claims.

```ts
interface Dossier {
  kind: "dossier";
  subject: EntityRef;
  standfirst: string;
  standfirstStatementIds: string[];
  sections: Array<{
    id: string;
    heading: string;
    body: string;
    traceStatus: "supported" | "qualified" | "research-gap";
    statementIds: string[];
    relatedEntityRefs?: EntityRef[];
  }>;
  reviewedAt: string;
}
```

Only one non-deprecated Dossier may describe a subject. Reviewed narrative may
only target reviewed or published subjects and Statements, including the
standfirst trace. A supported or qualified section
requires at least one Statement; a research-gap section cannot imply support by
citing one. Dossiers can reference related entities for navigation, but those
references do not assert canonical relationships.

## Core entities

### Concept

A reusable, contestable idea such as democracy, liberty, equality, social
ownership, markets, or popular sovereignty. A Concept has a preferred label,
alternate labels, a scoped definition, definitional disputes, external
identifiers, and broader/narrower/related links where research supports them.

Concepts are not assumed to have necessary and sufficient membership rules.
Some are classical categories; others work through prototypes, radial
structures, or family resemblance. Direct broader/narrower links are editorial
navigation claims, not automatic logical subclass assertions.

### Approach

A recognizable, historically or intellectually situated configuration of
concepts, Ends, diagnoses, and proposed Means. Examples include social
democracy, Marxism–Leninism, mutualism, and participatory economics.

An Approach can have a descriptive form—tradition, school, ideal type, named
model, or political program—but form is metadata, not a family tree. The same
Approach may belong to several editorial Collections.

An Approach's conceptual morphology records how it interprets and weights
Concepts:

```ts
type ConceptRole = "core" | "adjacent" | "peripheral" | "contested";

interface ApproachConceptRelation extends RelationshipBase {
  subjectId: ApproachId;
  objectId: ConceptId;
  role: ConceptRole;
  interpretation: string;
}
```

The roles are attributed analytical claims, not universal facts. They require
Statements and Sources and may vary by period, author, or variant.

### End

A normalized aim or valued condition, such as meaningful popular control,
material security, autonomy, or equality of status. An End is reusable, but an
Approach does not simply “have” it. An `EndAttribution` identifies who advances
the End, in which context, according to which evidence, and whether it is
declared, design-implied, or practice-interpreted.

Concept and End may share a label without being the same record. “Democracy” as
a disputed concept is distinct from “meaningful popular control” as an
attributed aim.

### Means

An institutional mechanism or arrangement specifying actors, positions,
resources, decision rules, information, oversight, enforcement, and allocation
of benefits and costs. Examples include competitive elections, sortition,
central planning, collective bargaining, worker councils, social insurance,
and market exchange.

A shorthand such as “planning” is a Concept until a record specifies enough of
the institutional form to be analyzed as a Means. Approaches may advocate,
permit, reject, qualify, or disagree internally about a Means.

### Challenge

A Challenge is a recurring open question about design or performance.
It neither classifies an Approach as a whole nor requires complete coverage.

### Criterion

An explicit evaluative lens with a definition, normative assumptions, evidence
requirements, limits, and plausible reasons for weighting it differently. An
assessment applies one Criterion to a scoped object or outcome; Criteria are
never silently aggregated into a master score.

### Comparison Dimension and Placement

A Comparison Dimension is an explicitly defined descriptive continuum,
category set, or measurable property used to compare eligible subjects. It is
not a Criterion: a Dimension says where or how subjects differ; a Criterion
says how an evaluator judges an arrangement or outcome.

Examples include ownership of productive assets, allocation mechanism,
concentration of political authority, workplace governance, political
contestation, and degree of decommodification. “Left” and “right” are too
compound and context-dependent to serve as the canonical axis.

```ts
interface ComparisonDimension {
  id: ComparisonDimensionId;
  label: string;
  definition: string;
  valueType: "ordinal" | "categorical";
  values: DimensionValueDefinition[];
  eligibleSubjectKinds: ComparisonSubjectKind[];
  method: string;
  normativeChoices: string[];
  knownCorrelationIds: ComparisonDimensionId[];
  limitations: string[];
  statementIds: StatementId[];
}

interface Placement extends RelationshipBase {
  predicate: "placed-on";
  subject: EntityRef & { kind: ComparisonSubjectKind };
  object: EntityRef & { kind: "comparison-dimension" };
  value:
    | { kind: "category"; categoryId: string }
    | { kind: "range"; fromCategoryId: string; toCategoryId: string };
  basis: "declared-design" | "ideal-type-analysis" | "case-observation";
  uncertainty: string;
  scope: RelationshipScope;
}
```

Placements are independently reviewable analytical claims. They must identify
the subject, scope, basis, evidence, and uncertainty. Broad Concepts and
internally diverse Collections ordinarily receive a range or no placement;
specific Approaches, Means, and dated Case episodes are more defensible units.
Ideal-type placements and empirical observations must never be shown as though
they were measured on the same basis.

Multiple sourced analyses may define different Dimensions or place the same
subject differently. In the current schema, rival Placements remain separate
records with distinct supporting Statements and provenance; a dedicated lens
entity is deferred. Placements do not determine a Criterion assessment,
evidence quality, Collection membership, or any other relationship.

### Comparison specification

A comparison page is a derived query over canonical entities and relationships,
not another content owner. A saved or curated specification may select:

```ts
interface ComparisonSpec {
  id?: ComparisonSpecId;
  subjectRefs: EntityRef[];
  challengeIds?: ChallengeId[];
  dimensionIds?: ComparisonDimensionId[];
  criterionIds?: CriterionId[];
  caseScope?: CaseScope;
  lensIds?: InterpretationLensId[];
}
```

The compiler returns only genuinely comparable relationships and reports
missing, inapplicable, differently scoped, or unreviewed material explicitly.
It does not manufacture symmetric coverage or comparison prose.

### Case and episode

A Case is a bounded empirical setting. Large or changing Cases contain
episodes so that different institutional arrangements and outcomes are not
collapsed into one country label.

```ts
interface Case {
  id: CaseId;
  name: string;
  location: PlaceRef[];
  startDate: HistoricalDate;
  endDate?: HistoricalDate;
  asOf?: ISODate;
  scope: string;
  selectionRationale: string;
  conditions: StatementRef[];
  episodeIds: CaseEpisodeId[];
  externalRefs: ExternalReference[];
}
```

A Case-to-Approach relationship describes influence, self-identification,
partial instantiation, hybridization, contestation, or departure. A
Case-to-Means relationship identifies an evidenced institutional arrangement
in formal design or rules-in-use. Neither relationship turns a Case into proof
of an ideology.

### Event and Transition

An Event is a sourced occurrence with temporal and geographic bounds: an
election, enactment, coup, strike, war, institutional reform, court decision,
party split, publication, or other occurrence relevant to the graph. Events may
be nearly instantaneous or span an interval.

```ts
interface Event {
  id: EventId;
  name: string;
  eventKindIds: ConceptId[];
  startDate: HistoricalDate;
  endDate?: HistoricalDate;
  placeIds: PlaceId[];
  descriptionStatementIds: StatementId[];
  participantRelations: EventParticipantRelation[];
  externalRefs: ExternalReference[];
}
```

An Event records what occurred. “Turning point,” “trigger,” “cause,” and
“collapse” are interpretive claims about an Event and require Statements,
Sources, scope, and rival explanations.

A Transition is a bounded analytical sequence connecting a prior institutional
configuration to a later one. It may contain several Events, gradual changes,
overlapping institutions, reversals, or disputed boundaries:

```ts
interface Transition {
  id: TransitionId;
  name: string;
  caseId: CaseId;
  fromEpisodeRefs: CaseEpisodeId[];
  toEpisodeRefs: CaseEpisodeId[];
  eventIds: EventId[];
  changedRelationshipIds: RelationshipId[];
  boundaryStatus: "exact" | "approximate" | "disputed" | "open";
  explanationStatementIds: StatementId[];
  rivalInterpretationIds: StatementId[];
}
```

This prevents a timeline from implying that one monolithic “system” instantly
replaced another. Before/after descriptions come from bounded Case episodes and
their evidenced institutional relationships. The Transition identifies the
sequence being analyzed; causal significance remains in challengeable
Statements.

A timeline is a derived presentation joining Events, Case episodes, and
Transitions. It is not a fourth source of chronology.

### Depiction and Work

A Depiction describes a fictional political economy in a particular Work or
series. It may illustrate, combine, or criticize Concepts, Ends, Means, and
Approaches through attributed interpretation. It cannot support an empirical
outcome claim. A Depiction identifies its fictional Work and interpretive
scope; typed `depicts` relationships carry its readings of independently
addressable Concepts, Approaches, Ends, or Means.

A Source derived from a fictional Work may support an interpretation of that
Work or contextualize or qualify an empirical Statement. It cannot support or
challenge an empirical observation, Case outcome, or assessment; those claims
require at least one supporting Source whose `workId` resolves to an actual
non-fiction Work.

### Person, Organization, Work, Source, and Statement

People and Organizations participate through typed roles: author, advocate,
critic, designer, officeholder, participant, or interpreter. A Work is the
intellectual object; a Source is the edition, article, dataset, archival record,
or other citable manifestation used as evidence.

A Statement is one challengeable proposition. Statements distinguish empirical
observation, attributed value, attributed institutional proposal, definition,
causal hypothesis, classification, and editorial interpretation. An attributed
proposal records what an identifiable actor or source proposes without treating
that design as the project's recommendation or reducing it to an End. Citations
attach through locators rather than only through page-level bibliographies.

### Research obligations

A Research Obligation records one focused question that reviewed evidence does
not yet settle. It remains separate from a Statement because missing evidence is
not itself a claim. Each obligation targets a canonical entity or exact Dossier
section and records the current limitation, evidence needed, applicability
scope, lifecycle status, and any Statements produced as research arrives.
The `addressedStatementIds` field names the existing claims that create the
question; `statementIds` separately names new claims reconciled from research.
Those lists cannot overlap. An obligation must name at least one addressed
Statement or an exact Dossier section, and its target is limited to a
reader-facing Approach, Case, Challenge, or Concept so every target has a
stable route and can display its open questions. At target level, linked
Statements must belong to that target's Dossier; when a section is named, they
must belong to that exact section. Questions spanning multiple sections remain
target-level rather than claiming a misleading section owner.

The obligation type keeps four questions distinct: a `counterargument`
challenges a reason or design; `counterevidence` could challenge an empirical
claim; a `counterfactual` specifies an alternative causal path; and a general
`research-gap` covers a focused unanswered question outside those categories.
A partially addressed obligation requires at least one reconciled Statement
but remains active. A resolved obligation requires reconciled Statements, a
rationale, and `closedAt`; a withdrawn obligation requires a rationale and
`closedAt` but does not manufacture evidence. An open obligation cannot carry a
reconciled Statement; adding one advances the obligation to
`partially-addressed` or `resolved`. Open and partially addressed obligations
cannot carry closure metadata. Reader-facing text must not contain issue or
pull-request references, branch names, or migration and draft status. The
compiler checks Research Obligation fields, and the rendered-route audit checks
the complete public text of every built page with the same focused patterns.

## Relationship model

Relationships are records rather than embedded ID arrays when they express a
substantive claim:

```ts
interface RelationshipBase {
  id: RelationshipId;
  status: "asserted" | "qualified" | "contested" | "research-needed";
  scope?: {
    startDate?: HistoricalDate;
    endDate?: HistoricalDate;
    placeIds?: PlaceId[];
    variantId?: ApproachId;
  };
  statementIds: StatementId[];
}
```

Initial relationship families:

| Family | Predicates |
|---|---|
| Concept organization | `broader-than`, `narrower-than`, `related-to`, `commonly-confused-with` |
| Approach history | `developed-from`, `influenced-by`, `reacted-against`, `overlaps-with` |
| Editorial grouping | `member-of`, with `widely-accepted`, `qualified`, or `contested` membership |
| Normative | `advances-end`, `rejects-end`, `internally-contests-end` |
| Institutional | `advocates-means`, `permits-means`, `rejects-means`, `internally-contests-means` |
| Empirical | `self-identified-with`, `influenced-by`, `partially-instantiated`, `departed-from`, `used-means` |
| Interpretation | `supports`, `challenges`, `qualifies`, `interprets`, `depicts` |

Only genuinely transitive relationships may be traversed transitively. In
particular, influence, overlap, collection membership, and `related-to` are not
transitive.

## Collections instead of umbrella types

“Socialist approaches,” “Anarchist approaches,” “Democratic approaches,” and
“Stateless approaches” are editorial Collections used for navigation. A
Collection may contain Concepts, Approaches, or nested Collections but does not
turn its label into a superclass.

Membership is many-to-many and may be contested. For example,
anarcho-communism can appear in Communist, Socialist, Anarchist, and Stateless
collections without choosing one exclusive parent. Collections must state
their inclusion rule and editorial purpose.

Collections may also group concrete institutional Means when a familiar label
denotes a family rather than one fully specified arrangement. For example, a
central-planning Collection can contain distinct Means records without making
their authority, scope, information, revision, enforcement, or ownership rules
inherit from the Collection. Each concrete Means carries those claims through
focused Statements attached with typed `specified-by` relationships whose
facets identify authority, scope, information, targets, revision, enforcement,
or ownership.

## SKOS alignment

Use SKOS as the semantic contract for the vocabulary portion of the graph, not
as the complete application model and not necessarily as the authoring syntax.
This gives us established meanings and a future interoperability path without
forcing editors to maintain RDF triples.

| Ends and Means | SKOS alignment | Notes |
|---|---|---|
| Concept | `skos:Concept` | Stable URI/ID and independently addressable page |
| Preferred label | `skos:prefLabel` | At most one per language |
| Alternate/hidden label | `skos:altLabel` / `skos:hiddenLabel` | Names for the same Concept identity, including synonyms and historical spellings |
| Definition and scope | `skos:definition` / `skos:scopeNote` | Sourced scope and usage guidance |
| Concept vocabulary | `skos:ConceptScheme` | Separate schemes may cover ideas, institutional domains, or other vocabularies |
| Editorial umbrella | `skos:Collection` | Grouping does not itself assert a broader Concept |
| Direct hierarchy | `skos:broader` / `skos:narrower` | Use only for immediate conceptual generality |
| Association | `skos:related` | Symmetric and non-transitive |
| External reconciliation | SKOS mapping properties | Exact, close, broad, and narrow matches require review |

Do not map Approach, End attribution, Means, Case, Depiction, Statement, or
Criterion to `skos:Concept` merely to fit them into SKOS. They are domain
entities with behavior and evidentiary constraints that SKOS does not model.
Likewise, `advocates-means`, `used-means`, `supports`, and other analytical
predicates remain Ends and Means vocabulary.

Canonical files remain TypeScript-validated JSON-like records. Stable public
URIs and a deterministic JSON-LD export can expose the SKOS-aligned subset once
the internal graph stabilizes. RDF storage, a triplestore, OWL reasoning, and
automatic import of Wikipedia/Wikidata classifications are explicitly out of
scope.

## Domains and spheres

Political, economic, social, legal, and cultural are broad, overlapping
**spheres**, not exclusive entity types. More precise Domains sit beneath them:

```text
Political: authority, representation, participation, accountability
Economic: ownership, production, allocation, exchange, distribution
Social: welfare, status and hierarchy, family and community, association
Legal: rule-making, adjudication, enforcement, rights
Cultural: religion, education, information, identity
Cross-cutting: ecology, technology, external relations, transition
```

Domain assignment is a relationship with `defining`, `substantial`, or
`adjacent` centrality. It may attach to an entity or to a Statement; a flat enum
on Approach is insufficient. The vocabulary can grow without a schema change.

## Three required model tests

### Democracy

- Concept: democracy / rule by the people.
- Ends: popular control and political equality, when attributed.
- Means: elections, assemblies, sortition, deliberation, participation.
- Approaches: liberal democracy, participatory democracy, deliberative
  democracy, democratic socialism.
- Cases: bounded institutions in Athens, modern states, firms, or associations.
- Measurement: V-Dem and International IDEA dimensions attach to observations
  and indicators, not to the definition as an unquestioned score.

If one Democracy record must perform all these roles, the model has failed.

### Communism and socialism

- Concepts: communism, socialism, common ownership, classlessness.
- Collections: Communist approaches; Socialist approaches.
- Approaches: Marxism–Leninism, council communism, anarcho-communism, and other
  sourced schools or programs.
- Ends: classlessness, common ownership, production for need, statelessness,
  only where attributable.
- Means: party organization, revolution, councils, planning, common ownership
  arrangements, and distribution rules.

The model must permit qualified and contested membership and must not equate a
claimed end-state with governments that used the label.

### Central planning

Central planning is a Means family, not an Approach comparable to communism.
Concrete Means records distinguish planning authority, scope, information
flows, target formation, revision, enforcement, and ownership. Cases record
formal plans and rules-in-use. Multiple Approaches may advocate different
planning arrangements, and non-socialist cases may use planning mechanisms.

If central planning remains a peer dossier to socialism solely because both
were rows in the old matrix, the migration has preserved a category error.

## External references

Entities may carry orientation and reconciliation links:

```ts
interface ExternalReference {
  system: "wikipedia" | "wikidata" | "loc" | "viaf" | "doi" | "isbn" | "other";
  id?: string;
  url: string;
  purpose: "orientation" | "identity" | "access" | "evidence";
  language?: string;            // required for Wikipedia
  match?: "exact" | "close";   // required for Wikidata identity links
  checkedAt: ISODate;
}
```

Wikipedia links orient readers and supply familiar neighboring terminology.
Wikidata, VIAF, DOI, ISBN, and library identifiers help reconcile identity.
Neither Wikipedia categories nor Wikidata `subclass of` claims are imported as
editorial conclusions without review.

## Authoring and compilation

Canonical authoring remains small TypeScript-validated records in Git, grouped
by entity type. “One canonical graph” means one logical schema and one compiled
read model—not one hand-edited file.

### Source layout

```text
content/domain/
  vocabulary/                 # Concepts, schemes, Collections, and Domains
  approaches/                 # Approaches, attributed Ends, and proposed Means
  evidence/                   # Statements, Works, Sources, Cases, and episodes
  analysis/                   # Challenges, Criteria, Dimensions, and Placements
  relationships/              # subject-centered typed relationship sets
```

Structured records remain appropriate for canonical entities and relationships;
executable repository code remains TypeScript-only.
Long-form Dossier prose lives in Markdown beside an adjacent typed manifest and
compiles to exactly the same records rather than creating another model.
Markdown changes authoring ergonomics, review precision, and rendering—not the
canonical publication boundary.
Prose uses one semantic sentence per source line without inserting rendered
hard breaks or imposing a prose line-length cap.
The accepted rationale and safety boundary are recorded in
[ADR 0003](adr/0003-markdown-narrative-authoring.md).

Use one file per independently reviewed entity. For high-volume relationships,
use one subject-centered relationship-set file rather than one tiny file per
edge. This keeps related editorial decisions reviewable together without
embedding them in either endpoint or producing thousands of fragments.

### Ownership rules

- Entity files own identity, labels, scope, and intrinsic descriptive fields.
- Relationship files own claims about how independently addressable entities
  relate; endpoint files do not duplicate those edges.
- Statement files or case observation files own challengeable prose.
- Event files own chronology and participants; Transition files own the bounded
  before/change/after sequence, not an uncontested causal verdict.
- Sources own bibliographic identity; citation links own locators and the exact
  Statements they support.
- Dossiers, comparisons, navigation trees, backlinks, and counts are derived
  views and never canonical authoring files.

### Build products

The compiler reads the modular sources, validates each record, resolves
references, validates graph-wide invariants, and emits:

```text
generated/
  graph.json                  # complete internal read model
  indexes/                    # route/search/backlink indexes if needed
  reports/                    # coverage, freshness, and research diagnostics
  exports/                    # later JSON-LD/SKOS and public data products
```

Generated products must never live beside authoring records or be edited by
hand. Astro pages consume the compiled graph or deterministic indexes; they do
not scan and reinterpret source directories independently.

Compiled entities, relationships, and relationship-ID indexes are ordered by
stable ID. Authoring-file discovery order and relationship order carry no
semantic meaning, so equivalent input permutations must serialize identically.

This structure allows a single coherent graph at runtime while keeping pull
requests small, ownership obvious, and merge conflicts localized.

Validation must enforce:

- unique stable IDs and resolvable references;
- allowed subject/object types for each predicate;
- Statement and Source support for published substantive relationships;
- temporal bounds and freshness metadata for empirical claims;
- valid Event chronology and resolvable Transition episode boundaries;
- no empirical-evidence edges originating from Depictions;
- no circular direct broader/narrower paths;
- no automatic inheritance of Ends, Means, domains, or assessments through
  collection membership;
- no duplicate prose owned by compiled views.

A database remains unnecessary while Git pull requests are the authoring and
review boundary. The compiled format should remain portable enough to load into
a database later without changing content identity.

## Reader-facing information architecture

Explore is the main subject directory.
It accepts familiar terms and entry phrases without asking readers to choose an
entity kind first.
Cases, Compare, and Questions are primary task-oriented destinations; Sources
and Method form a quieter trust layer.
Collections, Domains, entity labels, and SubjectGuide `searchQueries`
support discovery without becoming ontology roots.

An entity's preferred, alternate, and hidden labels name that same canonical
identity.
They must not absorb a broader learner question merely to improve search.
A SubjectGuide's `searchQueries` are non-identifying entry phrases that route a
question to a guide; they do not become entity labels or assert equivalence.
Colliding entry phrases require explicit editorial disambiguation rather than
first-match routing.
Queries and active guide slugs share one resolution namespace: another guide's
slug cannot become a query without explicit disambiguation.
Retired guide paths require reviewed redirects to a stable guide or an explicit
gone state; a redirect must not silently merge canonical identities.

The wordmark is the only Home link in the primary landmark.
One typed route registry supplies both global navigation and the compact footer
site map, including descendant-route current-section mapping.
Subject Guides and Concept reference pages both map to Explore while remaining
distinct destinations within it.
New public areas must define their reader-facing label and descendant route
prefixes in that registry rather than editing the landmarks independently.

Compare supports three initial modes:

1. responses to a shared Challenge;
2. pairwise or small-set comparison across supported factual dimensions and
   response traces;
3. maps on independently defined Comparison Dimensions, with ranges,
   uncertainty, alternative lenses, and a complete nonvisual representation.

The [project vision's learner journey](project-vision.md#the-learner-journey)
is the authoritative completeness guide.
SubjectGuide selects entity-owned narrative and derived graph material but
never owns duplicate factual claims or relationships.
The learner-first prototype in #130 must consume only the live SubjectGuide
projection and public helpers; sparse and immature states belong in test or
preview fixtures, not production route generation.

## Implementation sequence

1. Define Concept, Collection, Domain, typed Relationship, and external-reference
   primitives alongside the existing evidence primitives. Document and test the
   SKOS mapping for the vocabulary subset.
2. Keep modular authoring under `content/domain/` as the sole publication
   source; no route may read archived research or hand-edited generated data.
3. Convert central planning from an Approach to a Means family and preserve its
   old material only where it maps cleanly.
4. Build a vertical slice around social democracy, democratic Concepts,
   solidaristic bargaining, and the two bounded Swedish Cases. It must render
   both an Explore dossier and one evidence-backed comparison.
5. Add one Event and Transition spanning two Case episodes without encoding its
   causal importance as an intrinsic property.
6. Add one overlap stress test: anarcho-communism in several Collections.
7. Add one Comparison Dimension and Placement stress test using selected V-Dem
   or International IDEA dimensions without importing a universal democracy
   score.
8. Review the compiled graph and rendered dossiers. Research additional records
   from their backlog issues; archived inputs remain discovery leads only.

## Research basis

- Michael Freeden, *Ideologies and Political Theory*, on ideologies as changing
  [configurations of core, adjacent, and peripheral concepts](https://academic.oup.com/book/3196).
- David Collier and James E. Mahon, “Conceptual ‘Stretching’ Revisited,” on
  [classical, radial, and family-resemblance categories](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=1747306).
- W3C, *SKOS Simple Knowledge Organization System Reference*, on concept
  [schemes, collections, labels, and cautious broader/narrower/related links](https://www.w3.org/TR/skos-reference/).
- Margaret M. Polski and Elinor Ostrom, “An Institutional Framework for Policy
  Analysis and Design,” on rules-in-use, action situations, context, outcomes,
  and [evaluative criteria](https://ostromworkshop.indiana.edu/doc/teaching/iad-for-policy-applications.pdf).
- V-Dem, on electoral, liberal, participatory, deliberative, and egalitarian
  [principles of democracy](https://v-dem.net/).
- International IDEA, *Global State of Democracy Indices Methodology*, on
  [principles, attributes, subattributes, and indicators](https://www.idea.int/publications/catalogue/html/global-state-democracy-indices-methodology-version-10-2026).
- Stanford Encyclopedia of Philosophy, “Democracy,” on the plurality of
  democratic arrangements and the distinction between definition and normative
  [evaluation](https://plato.stanford.edu/entries/democracy/).
- Wikipedia's Democracy, Socialism, Anarchism, Communism, and Economic system
  [articles](https://en.wikipedia.org/wiki/Democracy) are navigation and
  terminology touchstones, not claim authority.
