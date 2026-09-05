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

Publish the static build with GitHub Pages using the official Astro deployment
action. The canonical site URL is `https://endsandmeans.info`; because this is a
custom-domain root deployment, Astro does not use a repository-name `base`.
Deployment CI remains separate from the pull-request verification workflow.

Canonical content uses typed TypeScript records. ADR 0003 supersedes the earlier
plan to store every entity as one Markdown file with structured frontmatter:
Dossier prose is Markdown, while graph metadata and relationships remain in
typed manifests. Generated indexes and reports are build artifacts, never
hand-edited.

## Consequences

- The site can ship mostly static HTML and progressively enhance the matrix.
- Content integrity can be tested without booting Astro.
- A future renderer migration does not require migrating the knowledge model.
- We accept Astro as a build dependency and must pin upgrades deliberately.
- Hosting requires no application server; GitHub Actions produces and publishes
  the Pages artifact after pushes to `main`.
- Server-side participation features are out of the static core; initial
  contributions route through GitHub, with a small moderated endpoint possible
  later.
