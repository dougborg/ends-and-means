# Source change

Propose a source because it supports, challenges, or contextualizes specific
claims or entities—not merely because it belongs on a general reading list.

Use a Work for the intellectual work and a Source for the cited manifestation.
In canonical TypeScript authoring, a typical Source includes:

```json
{
  "workId": "stable-work-id",
  "contributorDisplay": ["Author Name"],
  "title": "Bibliographic title",
  "publicationYear": 2024,
  "sourceType": "edition",
  "identifiers": { "doi": "10.x/example", "isbn13": "9780000000000" },
  "resourceLinks": [
    { "purpose": "publisher", "url": "https://publisher.example/item", "label": "Publisher record", "checkedAt": "2026-09-07" }
  ]
}
```

Verify bibliographic facts against the publisher, DOI registration record, or
library catalog. Prefer DOI/ISBN/Open Library identifiers over retailer URLs.
Label purchase links and set their affiliate status explicitly; authorized
reading and publisher links take priority. Attach relevance through located
Statement citation relationships. Flag editions or title variants as duplicate
candidates.

Record `checkedAt` only after a person opens and evaluates that exact resource
URL. Never bulk-fill access dates from commit time or an automated reachability
run. The scheduled `pnpm audit:external-links` report deduplicates remote
requests, preserves every canonical owner and authoring location, and surfaces
missing or stale dates; its operational result is not evidence that the Source
is reliable, bibliographically correct, or fit for a claim.
