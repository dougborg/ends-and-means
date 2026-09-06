# Glyph system

Glyphs are presentation aids that help readers scan recurring kinds of material.
Adjacent text remains authoritative, and a glyph never asserts identity, classification, evidence, or a graph relationship.

## Strategy and provenance

The site uses selected components from `@lucide/astro` rather than copying SVG markup into the repository.
Lucide provides a coherent 24-pixel, two-stroke grammar, direct Astro components, side-effect-free modules for tree shaking, and maintained accessibility behavior.
Version and integrity are locked by `pnpm-lock.yaml`; the declared range remains open to compatible updates.
Lucide is distributed under the ISC license, recorded in the dependency inventory and upstream at <https://lucide.dev/license>.
Because the selected Target shape is Feather-derived, the deployed `public/third-party-notices.txt` preserves both the Lucide ISC notice and Feather MIT notice; the footer links to it from every page.

A local SVG set would avoid a runtime package dependency, but would make this project responsible for drawing consistency, sanitization, provenance per file, and ongoing maintenance.
The library package is the smaller maintenance surface because the registry imports only selected components and Astro emits static SVG with no client runtime.
Flags and organization marks remain outside this system because they need separate provenance and must not imply that a place or organization stands for an ideology.

## Reader roles

| Role | Shape | Purpose | Text fallback |
| --- | --- | --- | --- |
| Idea or definition | Open book | Starting point or definition | Definition |
| Proposed aim | Target | Stated aim or diagnosed problem | Aim |
| Institution or mechanism | Network | Arrangement connecting actors | Institution or mechanism |
| Bounded practice | Map pin | Evidence limited by place and time | Bounded case |
| Question or disagreement | Question in a circle | Unresolved question, disagreement, or limit | Question or disagreement |
| Evidence or source | Library | Inspectable claim, evidence, or source | Evidence or source |
| Change over time | Opposing arrows | Material change between arrangements | Change over time |

Meaning, comparison, variant, and depiction shapes extend those roles only in stable reader-facing contexts.
Their exact mappings and fallbacks live in `src/lib/presentation-glyphs.ts`.

## Use rules

- Keep authoritative text beside decorative glyphs and hide those glyphs from assistive technology.
- Use an informative glyph only when no adjacent text names it; provide an accessible label, which also becomes the missing-glyph fallback.
- Omit a glyph when it repeats a stronger structural cue or competes with narrative or evidence.
- Keep shape legible at 12 pixels, in Light and Dark themes, forced colors, monochrome, and print; color may reinforce but never carry meaning alone.
- Keep glyph styling in the shared `components` cascade layer.
  Production Astro style blocks must not bypass the named cascade architecture.
- Accept only registry keys in the shared component.
  Never accept or render caller-provided SVG or HTML.
- Treat entity-kind mappings as optional presentation metadata.
  Unmapped kinds render their existing text without substitution, and the mapping cannot modify canonical records.
