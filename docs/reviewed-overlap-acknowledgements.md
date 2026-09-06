# Reviewed narrative–Statement overlap acknowledgements

The content audit compares each reviewed Dossier passage with the Statements
that the passage cites. A similarity finding is an attention signal: a human
must inspect the actual cited pages before deciding whether the overlap is a
legitimate synthesis or a properly attributed quotation.

An acknowledgement records that review. It is process evidence, not proof of
independent authorship and not a plagiarism verdict. New findings remain open;
the initial ledger is intentionally empty because the current cited pages have
not been inspected as part of this implementation.

## Schema

Acknowledgements live in
`content/domain/reviewed-overlap-acknowledgements.ts` and have this shape:

```ts
interface ReviewedOverlapAcknowledgement {
  schemaVersion: "reviewed-overlap-1";
  fingerprint: `sha256:${string}`;
  passage: { dossierId: string; passageId: "standfirst" | string };
  statementId: string;
  citationId: string;
  reviewer: string;
  reviewedAt: string; // ISO calendar date
  rationale: string;
  disposition: "acknowledged-synthesis" | "attributed-quotation";
}
```

The fingerprint is SHA-256 over deterministic JSON containing:

1. the Dossier ID, stable passage ID, and exact narrative text;
2. the Statement ID and exact Statement text;
3. every authored field of the exact `cites` relationship, including its
   Source ID, role, locator, and optional note; and
4. every authored field of the cited Source, including identifiers and links.

Other Statement metadata is deliberately outside the fingerprint; the selected
Statement identity and claim text are the governed Statement inputs.

Values use a type-tagged canonical encoding and object keys are sorted
recursively before hashing, so an absent optional value cannot collide with an
authored lookalike object. Array order remains authored order because changing
ordered evidence metadata is a governed input. Values outside the governed
JSON-compatible domain, such as functions, symbols, or non-finite numbers,
fail closed instead of receiving a fallback fingerprint.
The audit exposes the fingerprint for each open finding so a reviewer can
create a record only after inspecting the cited material.

## Fail-closed invalidation

An acknowledgement applies only when its passage, Statement, and citation
references select a current overlap signal and its fingerprint exactly matches
that signal. Changing the narrative, Statement text, any citation field, the
locator, the cited Source, or the selected IDs changes the fingerprint and
reopens the finding as `invalidated`. Deleting or mistyping a governed record
also leaves the finding open.

Malformed records, duplicate acknowledgement targets, unsupported schema or
disposition values, invalid dates, empty review metadata, and fingerprints
other than a full lowercase SHA-256 value are reported as acknowledgement
errors and never clear a signal. Output is sorted by stable target and message
so local and CI runs agree.

Do not add threshold changes, path exclusions, wildcard records, permanent
finding IDs, or any other broad suppression. If prose or evidence changes,
review the actual cited passage again and replace the stale acknowledgement
with one for the new fingerprint. If review concludes that the prose should be
revised, revise it; do not acknowledge the old overlap.
