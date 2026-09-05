# Design Notes: Ends and Means

**Status:** design direction for the clean analytical model; ready for screen prototypes, not production implementation

Reader-facing Dossier pages follow the repository's
[plain-spoken analytical narrative style](narrative-style.md).
The visible reading path answers first; claim traces, definitions, external
orientation, and formal model detail remain available through contextual links
and native disclosures.
This hierarchy is progressive disclosure, not evidence removal.

## Product thesis

Ends and Means is a comparative instrument for examining political-economic
ideas, institutions, and historical practice. It gives a curious reader one
place to ask what people sought, what arrangements they built, what happened,
and which values shape an assessment.

It is not a campaign, newspaper, encyclopedia of ideologies, or ranking
dashboard. The interface should feel intellectually confident without
pretending to certainty. A reader can always distinguish a sourced observation,
an inference, and a value judgment—and can follow each one to its support.

The product has two equal modes. **Explore** helps readers understand systems,
ideas, institutions, Cases, People, and Works. **Compare** examines shared
Challenges, differences among selected subjects, political-economic dimensions,
and change over time. The core reading experience preserves the chain of
reasoning behind both descriptions and comparisons.

## Information architecture

The target interface reflects the clean model rather than the exploratory
matrix:

- **Topics** are broad, familiar discovery labels such as ownership, work,
  security, coordination, and power. They organize navigation but make no
  analytical claim.
- **Explore** is an entity-neutral entry point. “Systems & ideas” collects
  familiar terms while each result identifies whether it is a Concept,
  Approach, Means, Case, or another entity.
- **Compare** is a first-class product mode, not a report added after dossiers.
  It supports shared Questions, pairwise/small-set views, dimensions, and
  transitions.
- **Approaches** are recognizable configurations of Concepts, attributed Ends,
  and proposed Means—not a universal navigation bucket or ontology root.
- **Concepts** are reusable, contested ideas whose meaning and importance may
  differ among Approaches.
- **Collections** are overlapping browse views such as Socialist, Communist,
  Anarchist, or Democratic approaches. Qualified membership replaces a single
  parent hierarchy.
- **Challenges** are recurring open questions and the primary unit for
  comparison.
- **Ends** are attributed aims: declared, design-implied, or cautiously
  interpreted from practice.
- **Means** are concrete institutional arrangements: roles, rules, authority,
  information, incentives, and distributions of costs and benefits.
- **Cases** are bounded in place, time, participants, and institutional scope.
- **Criteria** are disclosed evaluative lenses with stated assumptions and
  evidence requirements.
- **Comparison Dimensions** are descriptive axes or category sets with explicit
  definitions, eligible subjects, methods, limitations, and placements.
- **Events** record sourced occurrences. **Transitions** connect bounded Case
  episodes; turning-point and causal significance remain attributed claims.
- **Statements, sources, and interpretations** form the evidence layer beneath
  every summary.

Political, economic, social, legal, and cultural spheres are overlapping
facets. More precise Domains drive filters and context labels. Neither spheres
nor Domains divide the catalogue into exclusive sections.

A **response trace** is a view across these entities, not another content type
that owns or duplicates them:

```text
Challenge → attributed End → Means → expected interaction
          → bounded case → observed outcome → Criterion → assessment
```

Coverage may be sparse. The product must never invent a rectangular comparison
or imply that every tradition has one coherent response to every Challenge.

A **placement trace** exposes why a subject appears where it does:

```text
subject + scope → Dimension definition → evidence / interpretation
                → value or range → uncertainty + rival placement
```

A Dimension is not a Criterion, and a placement never determines an assessment.

## Durable decisions from the exploratory UI

Carry these forward:

- a calm, cool “comparative instrument” character;
- asymmetrical Ends / Means / Practice / Criteria reading space;
- semantic comparison tables with deliberate horizontal scrolling;
- one focused Challenge on narrow screens instead of a generic card feed;
- claim-adjacent citations, uncertainty, disagreement, and correction actions;
- accessible, URL-addressable filters and pivots;
- bibliography-first source pages where library and reading access outrank
  disclosed purchase links;
- restrained motion, visible focus, and no political red/blue coding.

Do not carry forward:

- fixed grid coverage;
- a single comparison cell as the owner of an argument;
- verdicts or cell-wide evidence grades;
- country-as-system presentation;
- compatibility terminology or identifiers in the new interface.

## Signature: the argument trace

The signature visual is an **argument trace**: a quiet line connecting the
actual stages of a claim. It behaves like an instrument readout, not a decorative
timeline. Each node corresponds to a real entity or statement and exposes its
scope and provenance.

```text
THE QUESTION
Who captures gains from productivity and ownership?

  END                MEANS                 PRACTICE              CRITERION
  Fair wages    ───  Central wage     ───  Sweden, 1951–83  ─── Distribution
  LO program         bargaining            wage compression     of gains
  declared           formal + in use       observed              disclosed lens
      [1]                 [2]                   [3][4]                 [5]
```

The line is interrupted when evidence or reasoning is missing. A fork represents
competing interpretations of the same evidence. It never visually resolves back
into a winner unless the content genuinely records agreement.

```text
Observed: funds acquired limited voting power
                         ├── diluted democratization
                         └── safeguard for pluralism
```

Selecting or focusing a node reveals a compact evidence drawer anchored to that
node. On desktop, the drawer may occupy a contextual side rail. On mobile, it
opens directly beneath the selected statement. Citations never live only in a
distant page-level bibliography.

This is the one deliberate aesthetic risk: the connective rule carries primary
information and becomes the project’s recognizable visual grammar. Everything
around it stays quiet.

## Visual character

Use the language of field instruments and scholarly apparatus without imitating
graph paper, newspapers, government forms, or academic PDFs. Surfaces are cool
and clear. Rules express relationships. Labels behave like coordinates because
they name actual analytical roles.

Avoid political red/blue coding, flags, ornamental portraits, marble columns,
voting-box imagery, gradients, glass effects, pill-heavy interfaces, rounded
card grids, and generic “serious publication” sepia.

### Color tokens

| Token | Value | Use |
|---|---:|---|
| Night | `#17232B` | Primary text and dark emphasis surfaces |
| Atmosphere | `#F1F6F7` | Cool page ground |
| Sheet | `#FFFFFF` | Reading surface |
| Cobalt | `#2556D8` | Links, focus, selected trace nodes |
| Signal amber | `#A85F08` | Contested, qualified, or needs-review states |
| Field teal | `#087E72` | Source-verified statements |
| Hairline | `#B9C8CD` | Structural rules and inactive trace segments |

Color describes provenance or state, never whether an institution is “good” or
“bad.” Every use is redundant with text, icon shape, or line treatment. Final
tokens require WCAG contrast testing in context.

### Typography

- **Display and navigation:** IBM Plex Sans, 500–600. Use for the wordmark,
  page questions, and major navigation. Its quieter proportions let the
  analytical structure carry the identity instead of oversized display type.
- **Reading:** Literata, 400–600. Use for explanations, historical accounts,
  interpretations, and longer statements.
- **Apparatus:** IBM Plex Mono, 400–500. Use for dates, scope labels, citation
  markers, evidence states, and compact control labels.

Suggested fluid scale:

| Role | Size | Line height |
|---|---:|---:|
| Display | `clamp(2rem, 3.2vw, 3.25rem)` | `1.06` |
| Page question | `clamp(1.9rem, 3vw, 3.2rem)` | `1.06` |
| Section | `clamp(1.35rem, 2vw, 1.8rem)` | `1.15` |
| Reading | `clamp(1rem, 0.4vw + .92rem, 1.16rem)` | `1.65` |
| Apparatus | `0.74rem` | `1.35` |

Self-host only required weights and subsets. Keep long-form measure between 60
and 72 characters. Do not use monospace for prose or identity labels.

### Spacing and structure

Use a 4px base unit with primary steps of 8, 12, 16, 24, 32, 48, 72, and 96px.
Major analytical stages need more separation than statements within a stage.

- content maximum: `90rem`;
- reading column: `38–45rem`;
- evidence rail: `18–22rem`;
- desktop gutter: `clamp(1.5rem, 4vw, 4rem)`;
- compact breakpoint: approximately `48rem`, determined by content stress;
- wide three-region dossier: approximately `72rem` and above.

Use square or 2–4px corners on functional surfaces. Reserve shadows for
temporary overlays; use rules and background contrast for permanent structure.

## Screen 1: home, Explore, and Compare

The opening gives Explore and Compare equal visual weight. Search accepts
familiar terms without requiring the reader to know the ontology. A real
Challenge provides a direct comparison path rather than serving as decoration.

```text
┌ Ends and Means ─────── Explore  Compare  Cases  People & Works  Method ┐
│                                                                      │
│ Explore systems and ideas. Compare what they value, how they work,   │
│ and what happens in practice.                                       │
│                                                                      │
│ ┌ EXPLORE ─────────────────┐  ┌ COMPARE ──────────────────────────┐ │
│ │ Search systems, ideas,   │  │ Start with a shared question     │ │
│ │ institutions, people…   │  │ Who controls investment?      ▾ │ │
│ │ Systems & ideas          │  │ Compare selected subjects       │ │
│ │ Institutions · Cases    │  │ Explore dimensions and maps     │ │
│ └──────────────────────────┘  └────────────────────────────────────┘ │
├──────────────────────────────────────────────────────────────────────┤
│ FEATURED TRACE     End ── Means ── Case ── Criterion                 │
│ FEATURED MAP       Ownership × allocation · ranges + uncertainty     │
└──────────────────────────────────────────────────────────────────────┘
```

Rules:

- Explore and Compare are peer actions in navigation and hierarchy.
- Search results expose entity kind, scope, and relevant discovery paths.
- The selector label is always the complete Challenge question.
- Topic selection filters; it does not navigate to a presumed conclusion.
- Result count and active filters are announced and encoded in the URL.
- Results identify arrangements and bounded cases before Approach labels.
- Empty results explain whether research is missing, scope excludes a result,
  or no meaningful relationship has been proposed.

## Screen 2: analytical response trace

This is the signature reading experience. It answers one Challenge through one
or more connected Ends, Means, cases, outcomes, and Criteria.

```text
┌ Challenge ─────────────────────────────────────────── Share / correct ┐
│ Who captures gains from productivity and ownership?                  │
│                                                                      │
│ CONTEXT      Social-democratic tradition · relationship: contested   │
├──────────────┬───────────────────────────────────────┬───────────────┤
│ Trace map    │ Argument                              │ Evidence       │
│              │                                       │               │
│ ● End        │ Fair wages with full employment       │ Declared by   │
│ │            │ attributed to LO’s 1951 program  [1] │ LO program    │
│ ● Means      │ Central wage frames + adjustment [2] │ Source 2      │
│ │            │ formal rule / expected interaction    │ Scope         │
│ ● Practice   │ Sweden · 1951–1983                    │ 2 studies     │
│ ├ Outcome    │ Wage dispersion fell …          [3]  │ Uncertainty   │
│ └ Dispute    │ Union policy / alternative cause      │ Interpretations│
│ ● Criterion  │ Distribution of gains                 │ Assumptions   │
│              │ Assessment and limits                 │ Requirements  │
└──────────────┴───────────────────────────────────────┴───────────────┘
```

The left trace map is navigation, not a progress meter. The center is the
argument. The right rail changes with the focused statement. At compact widths,
the trace becomes a vertical line and evidence expands inline.

Every assessment names exactly one Criterion. If another Criterion changes the
interpretation, show another assessment beside it or behind an explicit
“Evaluate through another lens” control—never average them.

## Screen 3: bounded historical case

Case pages begin with the boundary because it controls what every observation
can support.

```text
┌ CASE ─ Sweden · 1984–1991 ───────────── Bounded / source reviewed ┐
│ Enacted Swedish wage-earner funds                                 │
│ Covers five AP-system boards through abolition. Does not represent│
│ the original ownership-transfer proposal or Swedish society.      │
├──────────────────────────────┬─────────────────────────────────────┤
│ CONTEXT + PARTICIPANTS       │ INSTITUTION IN PRACTICE             │
│ Market reversal              │ Formal rule                         │
│ Organized labor / business   │ Funding and voting caps       [1]  │
│ Fund boards / local unions   │            ↓ differed in use        │
│ Government / parliament      │ Rules-in-use                        │
│                              │ Diversified, non-controlling [2]    │
│                              │            ↓                        │
│                              │ Outcomes + uncertainties            │
├──────────────────────────────┴─────────────────────────────────────┤
│ RELATED CHALLENGES   Distribution · Coordination and accountability│
└────────────────────────────────────────────────────────────────────┘
```

Formal rules and rules-in-use receive parallel but visibly different labels.
Never present an enacted institution as identical to a proposal, or a case as
an embodiment of a tradition. Dates, exclusions, and relationship qualifiers
remain visible near the title.

## Screen 4: comparison and competing interpretations

Comparison begins with a common question and common scope—not with a scorecard.
Rows are response traces or bounded cases; columns are factual dimensions that
can actually be compared.

```text
┌ Compare responses ──────────────────────────────────────────────────┐
│ Challenge: Coordination and accountability                          │
│ Criterion: Accountability ▾     Scope: Sweden · 1951–1991            │
├────────────────────┬──────────────────────┬──────────────────────────┤
│                    │ Central bargaining   │ Wage-earner funds        │
│ Delegated authority│ Peak organizations   │ Five appointed boards    │
│ Contestability     │ Affiliate defection  │ Electoral abolition      │
│ Evidence gaps      │ Outsider voice       │ Effective local voice    │
├────────────────────┴──────────────────────┴──────────────────────────┤
│ SAME OBSERVATION, DIFFERENT INTERPRETATIONS                          │
│ Limited fund control                                                 │
│ ├ Challenges: dilution prevented meaningful economic democracy [1]  │
│ └ Qualifies: caps limited a new concentration of delegated power [2] │
└──────────────────────────────────────────────────────────────────────┘
```

Interpretation branches name the source or editorial lens and use verbs such as
supports, challenges, qualifies, or proposes an alternative cause. Difference
is structural, not reduced to amber “controversy” styling.

On mobile, compare one dimension at a time with a persistent two-column identity
header. Preserve table semantics in the underlying markup and provide a linear
reading view.

## Screen 5: dimensional map

A map compares eligible subjects on one or two independently defined Dimensions.
It is an evidence interface, not a political-compass quiz. Broad or uncertain
placements render as ranges; dated Cases and ideal-type Approaches use visibly
different marks.

```text
┌ Map ─ Ownership × allocation ───────── Lens: editorial synthesis ▾ ┐
│                                                                   │
│ SOCIAL OWNERSHIP                                                  │
│      market socialism ━━━━━━━                                     │
│                              participatory economics ━━━━━        │
│                    Sweden, 1984–91 ●                               │
│                                                                   │
│      laissez-faire ○                                              │
│ PRIVATE OWNERSHIP                                                 │
│      MARKET ALLOCATION ───────────── ADMINISTRATIVE ALLOCATION    │
├───────────────────────────────────────────────────────────────────┤
│ Selected: market socialism                                        │
│ Range basis · scope · uncertainty · sources · rival placement     │
│ View as accessible table                                          │
└───────────────────────────────────────────────────────────────────┘
```

Rules:

- Every axis links to its definition, method, normative choices, and limits.
- A placement identifies subject kind, time/place scope, basis, uncertainty,
  Statements, and Sources.
- Concepts and Collections normally receive ranges or remain unplaced.
- Alternative lenses are separate placements, never averaged silently.
- Missing placement means absent or inapplicable evidence, not a midpoint.
- The complete table/text equivalent is available without JavaScript and does
  not rely on color, position, or shape alone.

## Evidence and uncertainty

Evidence belongs to statements, not pages or response traces as a whole.

Each statement can expose:

- claim kind: sourced observation, inference, or value judgment;
- exact citation and locator;
- bounded scope;
- uncertainty with a written basis;
- counterevidence or competing interpretations;
- what evidence is still needed; and
- “Suggest a correction” anchored to that statement.

Use status labels such as “Source checked,” “Inference,” “Scope limited,” and
“Evidence needed.” Avoid global labels like “Evidence: partial,” which hide what
is known and unknown inside a larger argument.

Citation markers use apparatus typography and stable numbering within the
current view. Their accessible name includes author and shortened title; opening
one moves focus to the anchored evidence drawer and returning restores focus.

## Empty, incomplete, and disputed states

Absence is part of the analysis and must not look like an application error.

- **No documented response:** “No response within this scope has been reviewed.”
- **Missing evidence:** name the exact statement or relationship needing support.
- **No historical case:** distinguish an untested design from a failed one.
- **Competing interpretations:** show parallel attributed branches.
- **Unresolved attribution:** do not promote an inferred End to a tradition-wide
  claim; show who has made the claim and what remains uncertain.

Each state offers the relevant next action: review scope, add a source, propose
a case, or offer another interpretation.

## Sources, books, and people

Bibliographic facts lead; commerce follows. Primary actions are “Find at a
library,” “Read online,” and “Publisher.” A separate “Buy this book” region may
list vendors with affiliate status disclosed beside each link. Purchase links
never affect ordering or visually outrank access and citation information.

People pages show typed relationships: author of, advocate of, critic of,
participant in, officeholder during, or subject of a claim. Portraits are useful
only when they aid identification, never as ideological decoration.

## Interaction and motion

- The one orchestrated motion is changing focus along the argument trace. The
  evidence rail and connective line update together so the reader retains
  causal and spatial context.
- Comparison filters update a plain-language result count and the URL.
- Hover may preview a statement, but the identical content is available through
  focus and tap.
- Reduced-motion mode switches trace focus instantly.
- Do not animate article content on scroll.
- Do not use motion to suggest causal certainty.

## Feedback as interface

“Suggest a correction” sits beside the statement’s evidence state. It opens a
prefilled GitHub issue containing the entity, statement anchor, page URL, and
requested action. Use precise actions:

- Correct this statement
- Add a source
- Challenge this assessment
- Offer another interpretation
- Clarify this case boundary
- Report a broken link

Avoid an undifferentiated comment box or floating chat bubble.

## Voice

Use plain, exact labels: “Source checked,” “Inference,” “2 interpretations,”
“Read the case,” and “Suggest a correction.” Avoid claims of objectivity and
gamified language such as scores, winners, or leaderboards.

The recurring invitation is **Start with a question.** It is a navigation
instruction, not a hero slogan repeated across the site. “Start with a problem,
not an ideology” may still appear in explanatory copy, but “question” is less
prescriptive and matches the Challenge model more precisely.

## Content-counted comparison grids

Use the shared comparison-grid primitive when peer records need equal visual
weight. The grid derives its desktop and tablet column count from the records
actually rendered, up to an explicit maximum, instead of reserving empty tracks
for hypothetical content. At narrow widths it becomes one linear column. This
keeps sparse comparisons compact while preserving source order and equal card
widths; sequences, tables, and intentionally asymmetric layouts remain separate
patterns.

## Accessibility baseline

- Use semantic headings, lists, figures, tables, and disclosure controls.
- Preserve header relationships in every comparison mode.
- Provide a linear alternative for visual argument traces.
- Never encode provenance, uncertainty, or interpretation in color alone.
- Keep citations and interpretation branches keyboard reachable.
- Maintain visible, high-contrast focus states.
- Announce filter changes without moving keyboard focus.
- Restore focus after closing an evidence drawer.
- Keep source and purchase-link purpose explicit out of context.
- Support 200% zoom, narrow viewports, forced colors, reduced motion, and print.
- In print, expand evidence drawers and render source locators beside statements.

## Prototype sequence

Build and evaluate the five screens in this order:

1. the analytical response trace, because it tests the core information model;
2. the case page, because it tests scope and formal rules versus rules-in-use;
3. shared-Challenge and pairwise comparison, because they test Criteria,
   comparability, and competing interpretations;
4. one-dimensional mapping, because it tests definitions, placements, scope,
   uncertainty, and nonvisual equivalence before a two-axis chart;
5. home/Explore/Compare, after the useful entry paths are known.

Use the Swedish analytical-framework fixture for the first three screens. Test
the design with a second, substantially unlike case before treating any layout
as a reusable production component.
