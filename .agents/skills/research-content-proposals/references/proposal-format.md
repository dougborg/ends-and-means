# Proposal format

Create `proposal.json` and `research.md` in
`proposals/<type>/<stable-id>/`. The JSON uses this envelope:

```json
{
  "schemaVersion": 2,
  "proposalType": "tradition",
  "id": "stable-semantic-id",
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
    "authorityNote": "Why this source is appropriate",
    "provenance": { "publisherUrl": "https://example.org/about" }
  }],
  "claims": [{
    "id": "stable-claim-id",
    "kind": "empirical",
    "text": "A bounded, checkable claim.",
    "sourceUrls": ["https://example.org/source"],
    "limitations": ["What this evidence cannot establish."]
  }],
  "conflictingEvidence": [{
    "summary": "A counterfinding, or the search performed when none was found.",
    "claimIds": ["stable-claim-id"],
    "sourceUrls": ["https://example.org/source"]
  }],
  "limitations": ["A proposal-level boundary or uncertainty."],
  "aliases": ["Known alternate name"],
  "identifiers": ["A stable external identifier"],
  "relationships": [{
    "type": "challenge",
    "id": "existing-challenge-id",
    "reason": "Why the relationship belongs."
  }],
  "proposedRelationships": [{
    "type": "means",
    "id": "not-yet-canonical-means",
    "reason": "Why this unresolved relationship needs human review."
  }],
  "duplicateCandidates": [],
  "content": {}
}
```

Types are `tradition`, `end`, `means`, `topic`, `challenge`, `criterion`,
`statement`, `source`, and `case`. IDs are semantic lowercase kebab-case.
`sourceType` is `primary`, `official`, `peer-reviewed`, `academic-book`, or
`reputable-secondary`.

Every empirical claim cites a declared source URL. An `attributed-value` claim
names its holder and cites the source where the value is expressed. An
`editorial-interpretation` claim supplies a rationale and keeps supporting facts
in separate empirical claims. Every claim states limitations.

Use `relationships` only for IDs already in the current framework. Put an
unknown companion entity in `proposedRelationships`; this exposes a review gap
without pretending it is canonical. Neither collection implies complete graph
coverage. `duplicateCandidates` may be empty only after duplicate checking; it
records comparisons, never merge decisions.

The memo explains scope, findings by claim ID, counterevidence, rival
interpretations, limitations, duplicate search, and recommended editorial
decision with inline URL citations.
