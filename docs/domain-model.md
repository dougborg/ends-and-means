# Target domain model: a plural political-economy graph

**Status:** working implementation contract. Validate it with a small vertical
slice before treating the schema as settled.

Ends and Means needs to represent ideas that overlap, change meaning across
contexts, and appear in theory, institutional design, historical practice, and
fiction. The canonical model is therefore a **plural graph**, not a taxonomy of
systems and not an Approach-shaped tree.

Public navigation has two equal modes: **Explore** and **Compare**. Explore
provides entity-neutral paths through familiar systems and ideas, institutions,
Questions, Cases, People, and Works. Compare examines shared Challenges,
pairwise differences, and political-economic dimensions. Neither mode nor any
navigation label is an ontology root.

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

Presentation objects are compiled views. They do not own duplicate prose or
relationships.

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

### Challenge and Topic

A Challenge is a recurring open question about design or performance. A Topic
is a reader-facing subject area used for discovery. Neither classifies an
Approach as a whole, and neither requires complete coverage.

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
  valueType: "continuum" | "ordinal" | "categorical";
  polesOrCategories: DimensionValueDefinition[];
  eligibleSubjectTypes: EntityKind[];
  method: string;
  normativeChoices: string[];
  knownCorrelations: ComparisonDimensionId[];
  limitations: string[];
  statementIds: StatementId[];
}

interface Placement extends RelationshipBase {
  subjectRef: EntityRef;
  dimensionId: ComparisonDimensionId;
  value: DimensionValue | DimensionRange;
  basis: "declared-design" | "ideal-type-analysis" | "case-observation";
  uncertainty: string;
  lensId?: InterpretationLensId;
}
```

Placements are independently reviewable analytical claims. They must identify
the subject, scope, basis, evidence, and uncertainty. Broad Concepts and
internally diverse Collections ordinarily receive a range or no placement;
specific Approaches, Means, and dated Case episodes are more defensible units.
Ideal-type placements and empirical observations must never be shown as though
they were measured on the same basis.

Multiple sourced lenses may define different dimensions or place the same
subject differently. Placements do not determine a Criterion assessment,
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
outcome claim.

### Person, Organization, Work, Source, and Statement

People and Organizations participate through typed roles: author, advocate,
critic, designer, officeholder, participant, or interpreter. A Work is the
intellectual object; a Source is the edition, article, dataset, archival record,
or other citable manifestation used as evidence.

A Statement is one challengeable proposition. Statements distinguish empirical
observation, attributed value, definition, causal hypothesis, classification,
and editorial interpretation. Citations attach through locators rather than
only through page-level bibliographies.

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

## SKOS alignment

Use SKOS as the semantic contract for the vocabulary portion of the graph, not
as the complete application model and not necessarily as the authoring syntax.
This gives us established meanings and a future interoperability path without
forcing editors to maintain RDF triples.

| Ends and Means | SKOS alignment | Notes |
|---|---|---|
| Concept | `skos:Concept` | Stable URI/ID and independently addressable page |
| Preferred label | `skos:prefLabel` | At most one per language |
| Alternate/hidden label | `skos:altLabel` / `skos:hiddenLabel` | Synonyms, historical spellings, search aliases |
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

### Proposed source layout

```text
content/
  vocabulary/
    concepts/                 # one Concept per file
    schemes/                  # Concept Scheme definitions
    collections/              # editorial umbrellas and inclusion rules
    domains/                  # spheres and precise institutional domains
  approaches/                 # one Approach dossier core per file
  ends/                       # normalized End definitions
  means/                      # one institutional arrangement per file
  questions/
    topics/
    challenges/
    criteria/
  actors/
    people/
    organizations/
  works/                      # books, articles, constitutions, fictional works
  evidence/
    cases/
      <case-id>/
        case.json             # boundary, context, and selection rationale
        episodes/             # meaningful changes within a larger case
        observations/         # scoped empirical Statements
    events/                    # sourced occurrences, independently reusable
    transitions/               # bounded before/change/after analyses
    sources/                  # citable manifestations and access metadata
  depictions/                 # interpretations of fictional systems
  relationships/
    approach-concepts/        # subject-centered relationship sets
    approach-ends/
    approach-means/
    collection-memberships/
    case-approaches/
    case-means/
    statement-support/
```

JSON remains appropriate for declarative content; executable repository code
remains TypeScript-only. Every file is validated against TypeScript types. If
author ergonomics later justify Markdown for long prose, structured frontmatter
must compile to exactly the same records rather than creating another model.

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

The main navigation begins with two peer actions:

```text
Explore   Compare   Cases   People & Works   Method
```

Explore is an entity-neutral discovery layer:

```text
Systems & ideas   Institutions   Questions   Cases   People   Works
```

“Systems & ideas” is a reader-facing Collection of familiar entry terms, not an
entity type. A result immediately identifies its actual kind and can appear in
more than one discovery path. Topics and Collections support browsing without
becoming ontology roots.

Compare supports three initial modes:

1. responses to a shared Challenge;
2. pairwise or small-set comparison across supported factual dimensions and
   response traces;
3. maps on independently defined Comparison Dimensions, with ranges,
   uncertainty, alternative lenses, and a complete nonvisual representation.

An Approach dossier should contain:

1. concise definition and scope;
2. terminology and classification disputes;
3. core, adjacent, and contested Concepts;
4. attributed Ends;
5. proposed, permitted, rejected, and disputed Means;
6. schools, variants, overlaps, and historical development;
7. bounded Cases with qualified relationship labels;
8. major criticisms and rival interpretations;
9. common questions and misconceptions;
10. sources, further reading, and external orientation links.

This borrows Wikipedia's useful progression from definition through history,
variants, practice, and criticism while exposing stronger provenance and
analytical distinctions.

## Implementation sequence

1. Define Concept, Collection, Domain, typed Relationship, and external-reference
   primitives alongside the existing evidence primitives. Document and test the
   SKOS mapping for the vocabulary subset.
2. Establish the modular authoring directories and compiler boundary. Move the
   current monolithic `content/framework/graph.json` to generated output; no
   route may treat it as hand-authored source.
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
8. Review the compiled graph and rendered dossiers. Only then migrate the other
   inherited records and retire remaining transitional fixtures.

## Research basis

- Michael Freeden, *Ideologies and Political Theory*, on ideologies as changing
  configurations of core, adjacent, and peripheral concepts:
  https://academic.oup.com/book/3196
- David Collier and James E. Mahon, “Conceptual ‘Stretching’ Revisited,” on
  classical, radial, and family-resemblance categories:
  https://papers.ssrn.com/sol3/papers.cfm?abstract_id=1747306
- W3C, *SKOS Simple Knowledge Organization System Reference*, on concept
  schemes, collections, labels, and cautious broader/narrower/related links:
  https://www.w3.org/TR/skos-reference/
- Margaret M. Polski and Elinor Ostrom, “An Institutional Framework for Policy
  Analysis and Design,” on rules-in-use, action situations, context, outcomes,
  and evaluative criteria:
  https://ostromworkshop.indiana.edu/doc/teaching/iad-for-policy-applications.pdf
- V-Dem, on electoral, liberal, participatory, deliberative, and egalitarian
  principles of democracy: https://v-dem.net/
- International IDEA, *Global State of Democracy Indices Methodology*, on
  principles, attributes, subattributes, and indicators:
  https://www.idea.int/publications/catalogue/html/global-state-democracy-indices-methodology-version-10-2026
- Stanford Encyclopedia of Philosophy, “Democracy,” on the plurality of
  democratic arrangements and the distinction between definition and normative
  evaluation: https://plato.stanford.edu/entries/democracy/
- Wikipedia's Democracy, Socialism, Anarchism, Communism, and Economic system
  articles are navigation and terminology touchstones, not claim authority:
  https://en.wikipedia.org/wiki/Democracy
