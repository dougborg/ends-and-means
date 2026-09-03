# Proposal format

Create two files in `proposals/<type>/<stable-id>/`.

## `proposal.json`

Use UTF-8 JSON with this common envelope:

```json
{
  "schemaVersion": 1,
  "proposalType": "crux",
  "id": "stable-kebab-case-id",
  "title": "Reader-facing title",
  "status": "draft",
  "summary": "What this adds and why it belongs.",
  "sources": [{
    "url": "https://example.org/source",
    "title": "Source title",
    "publisher": "Publishing institution",
    "publishedAt": "2024-05-01",
    "accessedAt": "2026-09-03",
    "sourceType": "official",
    "authorityNote": "Why this source is appropriate for these claims",
    "provenance": {
      "publisherUrl": "https://example.org/about",
      "identifier": "10.x/example",
      "identifierUrl": "https://doi.org/10.x/example"
    }
  }],
  "claims": [{
    "id": "stable-claim-id",
    "kind": "empirical",
    "text": "A bounded, checkable claim.",
    "sourceUrls": ["https://example.org/source"],
    "limitations": ["What this evidence cannot establish."]
  }],
  "conflictingEvidence": [{
    "summary": "A material counterfinding, or a precise account of the search when none was found.",
    "claimIds": ["stable-claim-id"],
    "sourceUrls": ["https://example.org/source"]
  }],
  "limitations": ["A proposal-level scope or evidence limitation."],
  "aliases": ["Known alternate name"],
  "identifiers": ["DOI, ISBN, or another stable external identifier"],
  "proposedRelationships": [{
    "type": "system",
    "id": "not-yet-canonical-system",
    "reason": "Why this unresolved relationship is proposed for human review."
  }],
  "duplicateCandidates": [{
    "type": "crux",
    "id": "possible-existing-id",
    "reason": "Why a reviewer should compare these records."
  }],
  "content": {}
}
```

Allowed proposal types are `crux`, `system`, `source`, and `case`. IDs and claim
IDs use lowercase letters, digits, and single hyphens. `sourceType` is one of
`primary`, `official`, `peer-reviewed`, `academic-book`, or
`reputable-secondary`. Every empirical claim cites at least one URL declared in
`sources`. A value judgment uses `kind: "value-judgment"`, includes a
`rationale`, and keeps factual support in separate empirical claims.

`duplicateCandidates` is required but may be empty only after running the
duplicate checker and finding no plausible match. Do not use it to resolve or
merge records. The checker considers IDs, aliases, identifiers, and meaningful
title-token similarity. It fails until every detected candidate ID is recorded.

Relationship IDs must resolve in the generated canonical graph. Put an unknown
ID in `proposedRelationships` only when it is intentionally part of the proposal;
this marks it for human review and does not make it canonical.

## `research.md`

Write a concise research memo that a human can audit:

- scope and inclusion rationale;
- findings organized around claims, using inline Markdown URL citations;
- conflicting evidence and alternative interpretations;
- limitations and unresolved questions;
- duplicate search notes;
- recommended editorial decision.

The JSON is the machine-checkable proposal; the memo explains reasoning. Keep
claim IDs consistent between both files.
