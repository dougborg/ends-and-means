# Legacy research archive

These files preserve research and migration provenance from the retired fixed
comparison matrix and its intermediate framework/prototype models. Nothing in
this directory is a canonical graph record, production input, generated site
page, or compatibility contract.

Use the material only as a lead for fresh source review. Claims must be split,
scoped, checked against their cited URLs, reconciled with existing canonical
records, and proposed through the research-content pull-request workflow before
they can be published.

## Backlog routing

Use the Approach-dossier migration umbrella (#39) for research candidates and
the canonical-cleanup umbrella (#48) for archive or publication-boundary
questions. Milestones and their current umbrella issues determine subsequent
routing; durable archive documentation does not track leaf-issue status.

## Contents

- `content/framework/`: the complete intermediate migration draft and its
  social-democratic evidence experiment.
- `content/import-overrides/`: reconciliation choices used by the retired
  importer.
- `analytical-framework-prototype/`: a non-canonical schema experiment.
- `docs/`: the original matrices, research notes, reading list, and superseded
  website brief.
- `reports/`: the original per-input migration disposition audit and unresolved
  import inventory.

The archive is intentionally outside `src/`, `content/domain/`, and all build
scripts so it cannot silently become part of the live site.
