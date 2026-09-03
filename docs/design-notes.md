# Design Notes: Ends and Means

**Status:** direction for exploration, not a finished visual specification

## Design thesis

Ends and Means should feel like a comparative instrument: a calm place to hold
competing institutional claims next to their mechanisms and records. It is not a
campaign, a newspaper, or a dashboard. The primary audience is a curious reader
who wants to test an intuition and follow the evidence. The home page has one
job: get that reader into a meaningful comparison immediately.

The interface should communicate intellectual confidence without pretending to
certainty. Evidence state is visible, disagreement has an address, and every
summary opens into its reasoning.

The information architecture follows the proposed
[Ends, Means, Challenges, and Criteria framework](analytical-framework.md).
“Challenges” is the public label for the current crux collection; stable
internal IDs may remain during migration. Ends and Means describe systems,
Challenges organize common questions, and Criteria disclose how responses are
being evaluated.

## Signature: the analytical reading frame

The name supplies the organizing device. Detailed comparisons use a persistent
analytical frame:

```text
ENDS                    MEANS                         PRACTICE
What is valued          Roles and rules               Bounded context
What is promised        Information and incentives    Rules-in-use
Legitimacy claims       Where mechanisms break        Outcomes and uncertainty
---------------------- evidence trace --------------------------
CRITERIA
The explicit lenses behind the assessment
```

On a comparison page this becomes an asymmetrical sequence, not equal cards.
Means gets more room because roles, rules, incentives, information, and failure
modes carry most of the causal analysis. Practice is never a placeless verdict:
it identifies a bounded case and separates institutional design from
rules-in-use and outcomes. The evidence trace connects assertions to sources,
cases, interpretations, and criteria. On small screens the frame remains a
labeled sequence: Ends, Means, Practice, Criteria.

The split is structural, never decorative. Do not force it onto pages where an
ends/means distinction is not present, such as a simple bibliography entry.

## Visual character

Use the language of field instruments and scholarly apparatus without imitating
graph paper, newspapers, government forms, or academic PDFs. Surfaces are cool
and clear. Rules show relationships. Labels behave like coordinates. Color
communicates status sparingly and is always redundant with text or shape.

Avoid political red/blue coding, flags, portraits of theorists as decoration,
marble columns, voting-box imagery, gradients, glass effects, rounded card
grids, and generic “serious publication” sepia.

## Color tokens

| Token | Value | Use |
|---|---:|---|
| Night | `#17232B` | Primary text and dark emphasis surfaces |
| Atmosphere | `#F1F6F7` | Cool page ground |
| Sheet | `#FFFFFF` | Reading surfaces |
| Cobalt | `#2556D8` | Links, focus, active navigation |
| Signal amber | `#C47712` | Contested and needs-review states |
| Field teal | `#087E72` | Verified and extensive-evidence states |

Weak, failed, or untested systems must not share a single alarm-red treatment.
Verdicts are semantic labels, not a traffic-light score. Color contrast must be
tested before these values become implementation tokens.

## Typography

- **Display and navigation:** Bricolage Grotesque, used for the wordmark, page
  theses, and major navigation. Its constructed shapes fit a project about
  designed systems without looking bureaucratic.
- **Reading:** Literata, used for mechanisms, cases, quotations, and long notes.
  It gives source material a different cadence from interface text.
- **Data and apparatus:** IBM Plex Mono, used sparingly for IDs, evidence labels,
  dates, coordinates, and citation markers.

Self-host only the weights and character sets used. If performance or licensing
changes the font choice, preserve the three roles: constructed display, highly
readable text, and compact apparatus.

## Layout

### Home: start with the instrument

Do not spend the first viewport on a slogan. Introduce the method in two short
sentences and show a useful portion of the real matrix immediately.

```text
┌ Ends and Means ────── Compare  Reading  Method  Contribute ┐
│ Political and economic systems in theory and practice.       │
│ Start with a problem, not an ideology.                        │
├──────────────────────────────────────────────────────────────┤
│ [Evidence ▾] [Hide untested] [Transpose]                   │
│ CRUX                 SOCIAL DEM.  MARKET SOC.  CENTRAL PLAN.  │
│ Information         STRONG       MIXED        WEAK           │
│ Innovation          STRONG       MIXED        LIMITED        │
│ Workplace voice     MODERATE     STRONG       WEAK           │
└─────────────────────────────────────────────────────────────┘
```

The matrix is a semantic table on wide screens. Freeze the Challenge column and
column headers. Use deliberate horizontal scrolling rather than compressing
eight systems into illegibility. On narrow screens, switch to one selected Challenge
across systems; never turn 112 cells into an endless generic card feed.

### Entity pages: comparison dossier

```text
┌ identity rail ────────┬ argument ─────────────┬ evidence rail ─────┐
│ System / Challenge │ Ends                 │ Evidence: partial   │
│ neighbor navigation│ Means                │ Criteria used       │
│                     │ Practice + outcomes  │ 3 sources / 2 cases│
│                     │ Uncertainty          │ Suggest correction │
└─────────────────────┴──────────────────────┴──────────────────┘
```

The central reading measure stays between 60 and 72 characters. The evidence
rail may stick on desktop but follows the relevant claim inline on mobile.

### Sources and books

Bibliographic facts lead; commerce follows. The primary actions are “Find at a
library,” “Read online,” and “Publisher.” A separate “Buy this book” region can
list Bookshop.org and other vendors, disclose affiliate status beside the links,
and never visually outrank access or citation information.

## Interaction and motion

- The one orchestrated motion is changing the matrix pivot: headers and the
  active axis move into their new roles so the reader retains spatial context.
- Hover and focus reveal a mechanism preview, but every preview is also
  reachable by keyboard and tap.
- Filters update a plain-language result count and the URL.
- Respect reduced motion by switching the pivot instantly.
- Do not animate article content on scroll.

## Feedback as interface

“Suggest a correction” appears beside the evidence state, not as a floating chat
bubble. It opens a prefilled GitHub issue containing the entity ID, claim anchor,
and page URL. Use specific actions such as “Challenge this verdict,” “Add a
source,” and “Report a broken link.” Avoid an undifferentiated comment box.

## Voice

Use plain, exact labels: “Evidence: partial,” “3 sources,” “Read the case,” and
“Suggest a correction.” Avoid marketing copy, claims of objectivity, and
gamified language such as scores, winners, or leaderboards.

The recurring invitation is: **Start with a problem, not an ideology.** It is a
navigation instruction and a concise expression of the method, not a hero
tagline repeated throughout the site.

## Accessibility baseline

- Preserve semantic table relationships in every matrix mode.
- Never encode verdict or evidence in color alone.
- Provide visible, high-contrast focus states.
- Keep filters operable without precision pointing.
- Announce filter result changes without moving keyboard focus.
- Keep source and purchase link purpose explicit out of context.
- Test at 200% zoom, narrow viewports, forced colors, and reduced motion.
