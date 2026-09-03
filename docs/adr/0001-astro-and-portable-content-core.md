# ADR 0001: Astro with a portable content core

**Status:** accepted

## Context

Ends and Means is primarily a statically generated reference graph. It needs
strict cross-entity validation, hundreds of generated routes, readable output
without JavaScript, and one meaningfully interactive surface: the matrix.

## Decision

Use Astro for routing and rendering. Keep parsing, normalization, graph
validation, backlink generation, and editorial reports in a framework-independent
TypeScript module. Use Astro islands only for interactions that cannot be
delivered well with HTML and CSS.

Canonical content will be Markdown with structured frontmatter, one file per
entity. Generated indexes and reports are build artifacts, never hand-edited.

## Consequences

- The site can ship mostly static HTML and progressively enhance the matrix.
- Content integrity can be tested without booting Astro.
- A future renderer migration does not require migrating the knowledge model.
- We accept Astro as a build dependency and must pin upgrades deliberately.
- Server-side participation features are out of the static core; initial
  contributions route through GitHub, with a small moderated endpoint possible
  later.
