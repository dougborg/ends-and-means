# Target domain model: a plural political-economy graph

**Status:** working implementation contract. Validate it with a small vertical
slice before treating the schema as settled.

Ends and Means needs to represent ideas that overlap, change meaning across
contexts, and appear in theory, institutional design, historical practice, and
fiction. The canonical model is therefore a **plural graph**, not a taxonomy of
systems and not an Approach-shaped tree.

“Approaches” remains the primary reader entry point because people commonly
begin with names such as social democracy, Marxism–Leninism, or mutualism. It
is not the root type from which every other entity derives.

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
  checkedAt: ISODate;
}
```

Wikipedia links orient readers and supply familiar neighboring terminology.
Wikidata, VIAF, DOI, ISBN, and library identifiers help reconcile identity.
Neither Wikipedia categories nor Wikidata `subclass of` claims are imported as
editorial conclusions without review.

## Authoring and compilation

Canonical authoring remains small TypeScript-validated records in Git, grouped
by entity type. The build compiles them into one graph and derived indexes.
Astro pages consume only that compiled graph.

Validation must enforce:

- unique stable IDs and resolvable references;
- allowed subject/object types for each predicate;
- Statement and Source support for published substantive relationships;
- temporal bounds and freshness metadata for empirical claims;
- no empirical-evidence edges originating from Depictions;
- no circular direct broader/narrower paths;
- no automatic inheritance of Ends, Means, domains, or assessments through
  collection membership;
- no duplicate prose owned by compiled views.

A database remains unnecessary while Git pull requests are the authoring and
review boundary. The compiled format should remain portable enough to load into
a database later without changing content identity.

## Reader-facing information architecture

The main navigation should begin with **Approaches**, followed by **Questions**
(Challenges), **Institutions** (Means), **Cases**, and **Ideas** (Concepts and
Ends). Topics and Collections support browse pages rather than becoming global
ontology roots.

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
2. Convert central planning from an Approach to a Means family and preserve its
   old material only where it maps cleanly.
3. Build a vertical slice around social democracy, democratic Concepts,
   solidaristic bargaining, and the two bounded Swedish Cases.
4. Add one overlap stress test: anarcho-communism in several Collections.
5. Add one measurement stress test using selected V-Dem or International IDEA
   dimensions without importing a universal democracy score.
6. Review the compiled graph and rendered dossiers. Only then migrate the other
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
