# Analytical Framework: Ends, Means, Challenges, and Criteria

**Status:** accepted analytical method. The domain ontology remains under
validation in the [target domain model](domain-model.md) and is tracked in
[#47](https://github.com/dougborg/ends-and-means/issues/47).

Ends and Means compares political-economic approaches by tracing the relationship
between what they seek, how they organize action, and what happens in bounded
historical settings. The framework adapts concepts from Institutional Analysis
and Development (IAD), especially Polski and Ostrom's *An Institutional
Framework for Policy Analysis and Design*, without treating IAD as a scoring
formula for whole societies.

## Analytical trace

```text
QUESTION / CHALLENGE
├── ATTRIBUTED END: who seeks what, and in which context
├── PROPOSED MEANS: institutions, rules, incentives, and authority
└── RESPONSE TRACE
    ├── relevant Concepts and Approach context
    ├── expected patterns of interaction
    ├── bounded Case, observed practice, and outcomes
    └── assessment under an explicit Criterion
```

**Criteria** are not a replacement name for Challenges: a challenge is the
problem being examined; criteria are the declared lenses used to assess
responses. The replacement schema should be modeled cleanly without aliases or
compatibility fields from the exploratory matrix. One-time extraction and any
necessary archival redirects belong outside the new content model.

## Ends

Ends describe what an approach, advocate, or institution claims to
value or produce. Record three attribution types separately:

1. **Declared:** stated in an attributable text, platform, constitution, or
   other primary source.
2. **Design-implied:** cautiously inferred from the priorities embedded in an
   ideal type's institutional design.
3. **Practice-interpreted:** cautiously inferred from outcomes in a bounded
   historical case.

An observed outcome is not proof of intent. An author's claim is not the only
valid definition of a diverse tradition. Conflicting interpretations can
coexist when their sources, scopes, and reasoning are visible.

## Means

Means are institutional arrangements rather than labels such as “markets” or
“planning” alone. Describe both formal rules and rules-in-use through seven IAD
questions:

| Rule type | Question |
|---|---|
| Position | What roles exist? |
| Boundary | Who may enter or leave those roles, and how? |
| Authority | What may each role do? |
| Aggregation | How are individual actions combined into decisions? |
| Scope | Which outcomes and jurisdictions can decisions affect? |
| Information | Who knows what, when, and with what reliability? |
| Payoff | Who receives benefits, bears costs, or faces sanctions? |

Analyze these rules at operational, collective-choice, and constitutional
levels where the distinction matters. An approach's proposed institutions may be decentralized in daily
operation while centralizing authority over who can change the rules.

## Challenges

Challenges are recurring political-economic problems against which different
institutional arrangements can be examined. Each challenge is framed as an
open question, not a neutral test with one predetermined answer. Examples
include coordinating information, providing public goods, constraining power,
meeting basic needs, adapting to change, and resisting bad actors.

A response should identify the relevant participants, their resources and
information, the actions available to them, expected incentives, and plausible
patterns of cooperation, bargaining, capture, evasion, or conflict.

## Context, practice, and outcomes

Never infer an approach's universal performance directly from a country label.
Historical evidence belongs to a bounded Case or state/regime period and should
record material conditions, community attributes, formal rules, rules-in-use,
participants, and time period where sources allow.

The analysis must distinguish:

- the theoretical mechanism;
- the institutional design on paper;
- behavior under rules-in-use;
- observed outcomes;
- causal inference and its uncertainty.

This protects against the “blueprint” error: assuming an arrangement that
worked in one setting will transfer unchanged to another.

## Criteria

Criteria are explicit editorial lenses for evaluating outcomes. Candidate
families include effectiveness, efficiency, proportionality, distributional
equity, accountability, adaptability, resilience, liberty, participation,
security, sustainability, and conformance to stated or disclosed moral
commitments.

Every adopted criterion needs a plain-language definition, scope, normative
assumptions, evidence requirements, and known limitations. Criteria must never
be silently combined into a universal score. When conclusions change because
readers prioritize criteria differently, the dependency should be visible.

## Claim structure

A comparison claim should be able to expose this trace:

```text
challenge → end implicated → institutional means → expected interaction
          → bounded evidence → observed outcome → criterion → assessment
```

Not every claim needs every field, but absent links must remain visibly absent.
Evidence breadth and evaluative judgment remain independent: extensive
evidence can support a contested conclusion, while an intuitively plausible
assessment can still need citation.

## Product implications

- Approach dossiers open with an explicit kind, domains, and distinct Ends and Means sections.
- Challenge pages ask one common question across approaches.
- Comparison pages use an Ends / Means / Practice frame and name the criteria
  behind any assessment.
- Case pages carry context and rules-in-use rather than serving as timeless
  examples of an ideology.
- Evidence traces link individual claims to sources, cases, interpretations,
  and criteria.
- The matrix provides navigation and comparison, not an aggregate ranking.
- Feedback actions attach to the precise claim, attribution, mechanism,
  evidence link, or criterion being challenged.

## Limits of the adaptation

IAD is strongest when applied to a bounded action situation. Ends and Means
must not imply that large, internally diverse traditions can be mechanically
encoded or predicted. The framework is a checklist for asking better questions
and exposing assumptions; it is not a scientific score generator or a claim
that all political disagreement can be resolved empirically.

## Concepts, Approaches, Cases, and fictional Depictions

**Concepts** are reusable but contested ideas. **Approaches** are recognizable
configurations of Concepts, attributed Ends, diagnoses, and proposed Means.
Approaches remain the primary reader-facing entry point, but are not the root
type of the graph. Editorial Collections provide overlapping umbrella views;
typed and sourced relationships represent membership, influence, advocacy, and
disagreement. Political, economic, social, legal, and cultural spheres are
overlapping facets rather than exclusive kinds.

Real-world practice belongs in a **Case** with geographic and temporal bounds.
Cases may be historical or ongoing. Ongoing Cases require an explicit
`as of` date, review date, and update state so current conditions are never
presented as timeless. A typed, sourced relationship describes whether a Case
was influenced by, partially instantiates, contests, hybridizes, or departs
from an Approach. A country or government is never itself proof of an Approach.

Fictional political economies belong in separate **Depictions** tied to their
works and editions. They may illuminate or criticize an Approach, End, Means,
or Challenge, but cannot serve as empirical evidence for real-world outcomes.
Interpretive relationships require attribution, primary-text locations,
spoiler scope, and copyright-safe summaries.

## Foundational source

Margaret M. Polski and Elinor Ostrom, “An Institutional Framework for Policy
Analysis and Design,” hosted by the Indiana University Ostrom Workshop:
https://ostromworkshop.indiana.edu/pdf/teaching/iad-for-policy-applications.pdf
