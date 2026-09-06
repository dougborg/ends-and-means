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

Components and page compositions consume semantic tokens such as `--canvas`,
`--surface`, `--text`, `--link`, `--evidence`, and `--caution`. Literal palette
values belong only in the token layer. Theme mappings will be added separately;
the current semantic map intentionally preserves the established Light design.

## Measures and rhythm

- `--measure-page`: the shared 90rem structural shell;
- `--measure-header`: the 78rem title and standfirst region;
- `--measure-prose`: the 70ch sustained-reading measure;
- `--measure-standfirst`: the 76ch short introductory measure;
- `--measure-compact`: the 48ch supporting-note measure;
- `--measure-apparatus`: the 64rem evidence and reference region; and
- `--measure-rail`: the 13–18rem on-page question rail.

Local `ch` widths may balance a heading. They must not create a new page measure.
Structural grids may define minimum track widths according to their content.

Spacing follows a 4px base: 4, 8, 12, 16, 24, 32, 48, and 64px. Use
`section-stack` for learner sections, `apparatus-stack` for denser evidence, and
the named page/section spacing tokens for route compositions. Evidence may have
a tighter internal rhythm, but its boundary from the narrative must remain
clear.

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

## Signature

The argument trace is the sole signature element. Use its line and nodes only
for a real analytical sequence such as Challenge → End → Means → Case → Outcome
→ Criterion. Plain dividers serve ordinary lists and sections. Missing evidence
interrupts a trace; competing interpretations fork it rather than resolving to
an invented winner.
