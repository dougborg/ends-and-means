# Design system

Ends and Means uses a compact editorial system so a reader's question and its
plain answer stay visually primary while evidence remains adjacent and
inspectable. Page types keep distinct jobs; shared roles remove accidental
variation without turning the site into a universal page or card builder.

## CSS layers

The global stylesheet declares a stable cascade order:

1. `tokens.css` owns primitive values and semantic roles;
2. `base.css` owns document defaults, typography, and interaction foundations;
3. `layout.css` owns page shells, measures, rails, and stack rhythm;
4. `components.css` owns reusable content and interface primitives; and
5. `global.css` retains page compositions and responsive exceptions.

Route-specific production stylesheets also join the named `pages` layer. An
unlayered stylesheet would outrank every declared layer, so the design-system
tests discover all CSS under `src` and reject files that do not participate in
this architecture.

Components and page compositions consume semantic tokens such as `--canvas`,
`--surface`, `--text`, `--link`, `--evidence`, and `--caution`. Literal palette
values belong only in the token layer. Light and Dark map those same roles to
different values, so components never select a theme-specific primitive.
Permanent-surface shadows likewise use semantic shadow tokens; their color
functions remain centralized with the palette rather than bypassing it in page
CSS. The system keywords `currentColor` and `transparent` remain valid outside
the token layer when they derive from the active semantic foreground.

## Measures and rhythm

- `--measure-page`: the shared 90rem structural shell;
- `--measure-header`: the 78rem title and standfirst region;
- `--measure-prose`: the 70ch sustained-reading measure;
- `--measure-standfirst`: the 76ch short introductory measure;
- `--measure-compact`: the 48ch supporting-note measure;
- `--measure-apparatus`: the 64rem evidence and reference region; and
- `--measure-rail`: the 13–18rem on-page question rail.

Local `ch` widths may balance a heading.
They must not create a new page measure.
Structural grids may define minimum track widths according to their content.
The design-system test rejects recreations of the established prose and
apparatus widths in production stylesheets, so new page families use a named
role instead of accumulating route-specific near-duplicates.

Spacing follows a 4px base: 4, 8, 12, 16, 24, 32, 48, and 64px. Use
`section-stack` for learner sections, `apparatus-stack` for denser evidence, and
the named page/section spacing tokens for route compositions. Evidence may have
a tighter internal rhythm, but its boundary from the narrative must remain
clear.
Subject Guide sections use the section token rather than a larger viewport-based
padding value.
At tablet widths the question rail becomes a native compact outline, reserving
the available width for sustained reading without changing the document order.

## Shared components

### EditorialHeader

Use for a conventional coordinate, H1, and standfirst composition. The slot
accepts the route's real introductory content. Subject Guide and Dossier heroes
remain distinct compositions because they carry different learner structure.

### Notice

Use for bounded scope, cautions, and evidence notes. Its tones are
`information`, `caution`, and `evidence`; content must name the state in text, so
the border and surface color are redundant cues. `compact` removes the default
separation when a parent stack owns rhythm. A notice does not replace a research
obligation, canonical statement, or other domain-specific presentation.

### Existing evidence components

`CanonicalStatement`, `DossierStandfirst`, `NarrativeDossier`,
`ResearchObligationCard`, and `OnPageNavigation` retain their semantic APIs.
Their shared surfaces, measures, focus, and print behavior belong to the CSS
system; their data contracts must not be folded into a polymorphic card.

## Interaction and accessibility

Links, buttons, native disclosure summaries, and explicitly focusable data
regions share a 3px focus indicator. Native `details` semantics and specific
summary names remain authoritative. Color never carries evidence, caution,
selection, or open state alone. Reduced motion disables smooth fragment
scrolling; forced-color and print rules preserve structure without depending on
background fills.

## Appearance

System is the default and follows `prefers-color-scheme`, including changes made
while a page remains open. The footer Appearance fieldset offers System, Light,
and Dark as native radio choices. Light and Dark are the only values stored in
local storage; selecting System removes the stored preference. No preference is
sent to a server or included in analytics.

A minimal inline bootstrap runs in the document head before render-blocking
styles. Its exact bytes are authorized by a generated SHA-256 Content Security
Policy hash; the policy does not permit unsafe inline scripts. The bootstrap
accepts only the two explicit values and applies the root theme attribute before
paint. A normal deferred module owns controls, operating-system changes, and
browser theme color after parsing. Storage errors and invalid values fall back
to System on a new document, while a current-page choice remains in memory if
storage is denied, including across back-forward cache restoration.
With JavaScript disabled, the control is absent and the CSS media query follows
the operating system without hiding content. Print always uses a white canvas,
dark text, visible rules, and no Appearance control, regardless of screen mode.

## Signature

The argument trace is the sole signature element. Use its line and nodes only
for a real analytical sequence such as Challenge → End → Means → Case → Outcome
→ Criterion. Plain dividers serve ordinary lists and sections. Missing evidence
interrupts a trace; competing interpretations fork it rather than resolving to
an invented winner.
