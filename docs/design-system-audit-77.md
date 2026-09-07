# Design-system and theme checkpoint

**Status:** approved direction; Light-theme foundations and the accessible
Light, Dark, and System behavior are implemented across the current corpus

This checkpoint proposes how to extract the existing editorial identity into a
small system and add Light, Dark, and System themes. It is grounded in the
learner-first product contract: the answer and narrative remain primary;
evidence, model distinctions, and open questions stay close at hand without
competing for first attention.

## Baseline reviewed

The post-corpus review rebased onto the current `main` and used the real
published corpus, not fixture copy.
The production build generated 245 pages.
The expanded visual suite covers desktop, tablet, and mobile checks for the
existing page families and representative additions from every completed corpus
tranche, including:

- Subject Guide: `/guides/economic-democracy/`
- newer ideological guides: `/guides/authoritarianism/`,
  `/guides/capitalism/`, `/guides/feminism/`, and `/guides/liberalism/`
- organizational-diversity guide: `/guides/matriliny-property-authority/`
- Case: `/cases/swedish-wage-earner-funds/`
- newer bounded cases: `/cases/bonjol-melayu-ulayat-governance/`,
  `/cases/iceland-parental-leave-2000-2018/`, and
  `/cases/italian-fascist-dictatorship-1925-1943/`
- Compare: `/compare/`
- Question: `/challenges/authority-and-accountability/`
- Method: `/framework/`
- Reading: `/reading/`
- sparse page: `/concepts/institutional-abolition/`

The original exact-base before screenshots are in `.artifacts/slice1-before/`;
matching initial Slice 1 screenshots are in `.artifacts/slice1-after/`.
The post-corpus pass additionally inspected the listed routes at 1440×1000,
820×1180, and 390×844.
Screenshot directories remain intentionally ignored review evidence rather than
product assets.

The capstone found two layout debts exposed by the larger corpus.
The desktop question rail was still consuming too much of an 820px tablet
viewport, and Subject Guide sections retained a legacy padding rule that could
reach 3rem on both edges despite already having ruled boundaries.
Slice 1 now collapses the rail to the native outline below 60rem, uses the shared
section rhythm, and normalizes repeated 68–72ch and 46–64rem widths to the prose
or apparatus roles.

## Inventory

### What is already coherent

- IBM Plex Sans for display/navigation, Literata for reading, and IBM Plex Mono
  for evidence apparatus establish a clear editorial hierarchy.
- The cool Atmosphere/Sheet ground, Night text, Cobalt interaction, Field teal
  evidence, and Signal amber qualification colors already encode the intended
  comparative-instrument character.
- The 90rem shell and named header, prose, standfirst, compact, and apparatus
  measures are an appropriate semantic foundation.
- Native `details` disclosures, semantic tables, a skip link, visible link and
  button focus, reduced-motion handling, forced-color affordances, and expanded
  print disclosures are valuable foundations.
- The argument trace on Method and the claim thread on Cases are the established
  signature. Their lines and nodes encode actual analytical sequence rather than
  ornamental progress.

### System debt

- `src/styles/global.css` contains 549 lines and 431 selector blocks. Shared
  primitives, semantic roles, components, page compositions, and responsive
  rules are interleaved, making parity review harder than it needs to be.
- The CSS uses 17 literal colors. Most derive from the intended palette, but
  `#794504`, `#075f57`, `#d8b77a`, `#f7fafb`, `#f8fbfb`, and repeated white
  values bypass the named roles. The layout also hard-codes the Light theme
  color in `BaseLayout.astro`.
- There are 288 margin, padding, and gap declarations. Common values recur, but
  only three section/page spacing tokens exist. This produces the loose vertical
  rhythm visible between some hero, section, apparatus, and footer regions.
- Content roles are partly tokenized, yet local widths still proliferate:
  62ch, 65ch, 68ch, 70ch, 72ch, 76ch, 46rem, 48rem, 58rem, 64rem, and route-
  specific heading caps. Some are legitimate line-balance constraints, but
  several duplicate the same reading or apparatus purpose.
- Shared visual structures recur under route-specific selectors: editorial
  headers, coordinate labels, ruled section headers, notices, bordered evidence
  surfaces, disclosure summaries/bodies, metadata definition lists, directories,
  and horizontally scrollable data regions.
- Component extraction is uneven. `CanonicalStatement`, `DossierStandfirst`,
  `NarrativeDossier`, `OnPageNavigation`, and `ComparisonGrid` are reusable;
  several pages still author long repeated structures directly. The 273-line
  `SubjectGuidePage` is the largest composition and should consume primitives,
  not be replaced by a generic page builder.

### Interface-guideline findings to include in implementation

- `src/styles/global.css:7` — `summary` lacks the explicit shared
  `:focus-visible` treatment applied to links, buttons, and tabindex targets.
- `src/layouts/BaseLayout.astro:16` — the fixed Light `theme-color` cannot match
  Dark or an explicit theme choice.
- `src/styles/global.css:1` — only `color-scheme: light` is declared, so native
  controls and browser chrome cannot follow Dark.
- `src/styles/global.css:473` — a one-off amber text literal bypasses semantic
  caution tokens.

## Pass 1: compact design plan

### Color

Keep the existing six-color family rather than inventing a new brand:

| Primitive | Hex | Purpose |
|---|---:|---|
| Night | `#17232B` | editorial ink and inverse surface |
| Atmosphere | `#F1F6F7` | cool canvas |
| Sheet | `#FFFFFF` | reading and evidence surface |
| Cobalt | `#2556D8` | links, selection, focus, trace |
| Field teal | `#087E72` | reviewed evidence and bounded practice |
| Signal amber | `#9B5A08` | qualification, caution, unsettled evidence |

Create ramps only where semantic contrast requires them; components never use a
primitive directly. Semantic roles are `canvas`, `surface`, `surface-raised`,
`text`, `text-muted`, `text-inverse`, `rule`, `rule-strong`, `link`,
`link-hover`, `focus`, `evidence`, `evidence-surface`, `caution`, and
`caution-surface`.

The provisional exact mappings are:

| Role | Light | Dark |
|---|---:|---:|
| canvas | `#F1F6F7` | `#0F1A20` |
| surface | `#FFFFFF` | `#17252C` |
| surface-raised | `#F8FBFB` | `#1D2E36` |
| text | `#17232B` | `#E8F0F2` |
| text-muted | `#52666F` | `#A8BAC0` |
| text-inverse | `#FFFFFF` | `#0F1A20` |
| rule | `#BFD0D5` | `#40545D` |
| rule-strong | `#17232B` | `#C8D6DA` |
| link | `#173DA5` | `#A9BEFF` |
| link-hover / focus | `#2556D8` | `#7FA2FF` |
| evidence | `#087E72` | `#66D6C7` |
| evidence-surface | `#E6F5F2` | `#143631` |
| caution | `#794504` | `#F1B968` |
| caution-surface | `#FFF5DE` | `#3B2B17` |

These are candidates, not accepted contrast values. Implementation must test
every foreground/background pair, including visited links, focus, table headers,
marks, selected navigation, and native controls before the values are frozen.

### Type

Retain all three established families and currently loaded weights. Define
semantic roles rather than a larger type scale:

- display: IBM Plex Sans 600 for page questions and major headings;
- interface: IBM Plex Sans 500–600 for navigation and controls;
- reading: Literata 400–600 at a 1.6–1.72 line height for answers and narrative;
- apparatus: IBM Plex Mono 400–500 for coordinates, dates, citation roles, and
  compact data—not for ordinary body copy.

Keep the current fluid page-title and Subject Guide hero scales. Normalize the
remaining sizes into `step--1`, `step-0`, `step-1`, `step-2`, and `step-3`, with
local heading caps retained only for line balance.

### Layout and rhythm

Preserve the shared 90rem shell. Normalize role-based widths to:

- header: 78rem;
- prose: 70ch;
- standfirst: 76ch;
- compact: 48ch;
- apparatus: 64rem;
- rail: 13–18rem.

Use a 4px base with named steps `1` 4px, `2` 8px, `3` 12px, `4` 16px, `6`
24px, `8` 32px, `12` 48px, and `16` 64px. A `flow` role governs sibling prose;
a `section-stack` role governs learner sections; a tighter `apparatus-stack`
governs evidence. The first implementation target is to shorten default hero →
body, section → section, and last section → footer distances without crowding
reading paragraphs.

```text
Wide learner page
┌──────────────────────────── shared 90rem shell ────────────────────────────┐
│ breadcrumb                                                                │
│ subject / question                                                        │
│ short answer (70ch)                                                        │
├──────── 13–18rem rail ───────┬──────── narrative / apparatus ≤64rem ───────┤
│ real section questions       │ answer first                                │
│                              │ evidence disclosure directly after answer   │
│                              │ next answer                                 │
└──────────────────────────────┴───────────────────────────────────────────────┘

Narrow learner page
┌──────────────────────────────────────────┐
│ breadcrumb                               │
│ subject / question                       │
│ short answer                             │
│ [On this page ▾]                         │
│ answer                                   │
│ [Sources for this answer ▾]              │
└──────────────────────────────────────────┘
```

### Signature

Use one signature element: the existing **argument trace**. Formalize its line,
node, interruption, fork, and selected states as a component family, but render
it only where content has a real Challenge → End → Means → Case → Outcome →
Criterion sequence. Elsewhere, ordinary rules remain quiet dividers.

### Components to extract

Keep the set small and semantic:

1. `PageShell`/CSS layout roles: wide shell, editorial header, prose,
   standfirst, compact, apparatus, rail + content.
2. `SectionHeader`: coordinate, question/title, optional explanation, rule tone.
3. `Disclosure`: evidence, apparatus, outline-mobile variants using native
   `details`; shared focus, marker, body, print, and forced-color behavior.
4. `Notice`: information, evidence, caution, and scope variants with visible
   label/icon/text so color is never the only signal.
5. `EvidenceCard`: reviewed/qualified/open state, statement, citations, and
   metadata slots; `CanonicalStatement` becomes its canonical adapter.
6. `MetadataList`: compact `dl` rows for boundaries, provenance, and source
   records.
7. `DataSurface`: responsive table/scroll region with keyboard affordance,
   numeric alignment, edge cue, and mobile mode selected by content needs.
8. `ArgumentTrace`: the one signature family, shared by Method and genuine
   case/claim sequences.

Directories, Subject Guides, Cases, Questions, Method, and Reading remain
compositions. Extraction must not erase their different learner jobs.

## Pass 2: critique and revision

The first plan risked turning every ruled list or relationship into an argument
trace. That would make a meaningful evidence sequence decorative and would
reproduce a generic “data pipeline” motif. The revision reserves trace nodes for
real analytical stages; ordinary section and directory structure uses plain
rules.

The initial component list also risked a universal card abstraction. That would
flatten the exact distinction the product teaches between narrative, evidence,
qualification, source record, and open question. The revision uses shared
surface and spacing roles underneath four semantically named components rather
than one polymorphic card with many flags.

A broad visual refresh would be generic and contrary to the brief. The revised
direction retains the typography, cool palette, square geometry, asymmetric
rail, and editorial rules. Its aesthetic change is deliberately narrow: a more
controlled rhythm and a dark palette tuned as an evening reading instrument,
not a black/inverted developer theme.

Finally, tightening rhythm could make evidence feel equal to the narrative by
packing more apparatus above the fold. The revision gives apparatus a tighter
internal stack while keeping a clear, but smaller, section boundary before it.
Narrative type size, measure, and source order remain primary.

## Theme behavior and control

- `System` is the default and is represented by the absence of an explicit
  theme override. CSS `prefers-color-scheme` supplies the initial palette.
- A native fieldset with three radios—System, Light, Dark—appears in the footer
  trust/settings region. The visible label is “Appearance”; each target is at
  least 44px, receives the shared focus ring, and exposes checked state without
  color. A compact header shortcut is out of scope unless usability testing
  proves the footer control is undiscoverable.
- Explicit Light or Dark choices persist in `localStorage`. System removes that
  override and responds live to operating-system changes.
- An inline head bootstrap, before render-blocking styles, reads only the known
  values `light` and `dark`, sets `data-theme` and `color-scheme`, and fails
  closed to System. Its exact bytes are authorized by a generated SHA-256 CSP
  hash without `unsafe-inline`; all normal interaction remains in a deferred
  same-origin module. It does not hide the document.
- Theme-specific `meta[name="theme-color"]` values use media queries for System;
  the module updates the active value for explicit choices.
- With JavaScript disabled, the site follows System, remains fully readable,
  and all native disclosures/navigation continue to work. The appearance
  fieldset is hidden in a `noscript`-safe way because it cannot persist a choice.

## Accessibility, print, and resilience plan

- Test semantic pairs to WCAG AA, including ordinary and large text; test
  focus indicators by component and background. Preserve redundant text/shape
  for evidence, caution, open, and selected states.
- Add `summary:focus-visible`, preserve native semantics, and keep every
  disclosure name specific. Do not animate disclosure height.
- Set `color-scheme` on the root and explicit background/text on form controls.
  Preserve browser zoom, 200% text-spacing/reflow, minimum 44px navigation and
  theme targets, scroll margins, and sticky-to-static rail behavior.
- Under forced colors, let system colors carry text/surface/rules; retain
  underline, border style, labels, and open/checked state. Never force brand
  colors except where a non-color shape would otherwise disappear.
- Under reduced motion, retain the existing instant fragment navigation and add
  no theme-transition animation. Theme changes are immediate.
- Print uses a deliberate white canvas, black text, visible rules, expanded
  disclosures, full link destinations where useful, no theme control, and no
  reliance on background fills. Argument traces print as solid/dashed line
  semantics in monochrome.
- Test failed storage access, invalid stored values, OS theme changes, page
  navigation, back/forward cache, and external font failure. The system font
  stacks already provide a readable fallback.

## Proposed implementation slices after approval

1. Freeze screenshot baselines and add token/contrast/theme behavior tests.
2. Split primitive, semantic-theme, base, layout-role, and component layers
   while preserving rendered Light parity.
3. Migrate repeated structures route by route; remove one-offs only after the
   seven-page viewport matrix passes.
4. Add Dark/System bootstrap and Appearance control, then test persistence,
   first paint, OS changes, no-JavaScript, forced colors, print, zoom, text
   spacing, and all representative pages.
5. Document component variants and content constraints, run full verification,
   and perform final visual self-critique before review handoff.

Material decisions awaiting review are the dark semantic palette, the footer-only
Appearance control, the normalized width set, the tighter rhythm scale, and the
strictly limited use of the argument trace.
