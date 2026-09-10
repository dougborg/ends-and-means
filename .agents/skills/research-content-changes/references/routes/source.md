# Source change

Propose a source because it supports, challenges, or contextualizes specific
claims or entities—not merely because it belongs on a general reading list.

Use a Work for the intellectual work and a Source for the cited manifestation.
In canonical TypeScript authoring, these illustrative Source fields describe
the consulted manifestation; they are not a complete publishable record:

```json
{
  "workId": "stable-work-id",
  "contributorDisplay": ["Author Name"],
  "title": "Bibliographic title",
  "publicationYear": 2024,
  "sourceType": "edition",
  "resourceLinks": [
    { "purpose": "publisher", "url": "https://publisher.example/item", "label": "Publisher record" }
  ]
}
```

Verify bibliographic facts against the publisher, DOI registration record, or
library catalog. Prefer DOI/ISBN/Open Library identifiers over retailer URLs.
Identifiers are optional: omit them until verified for the exact manifestation,
and never copy placeholder DOI or ISBN values into canonical records.
Label purchase links and set their affiliate status explicitly; authorized
reading and publisher links take priority. Attach relevance through located
Statement citation relationships. Flag editions or title variants as duplicate
candidates.

The current Source page does not display affiliate metadata or group purchases
separately. Do not mistake schema acceptance for completed access/disclosure UI;
[source access #258](https://github.com/dougborg/ends-and-means/issues/258) and
[Source redesign #259](https://github.com/dougborg/ends-and-means/issues/259) own
those pending boundaries. Source metadata and reachable URLs do not establish
passage access or source fitness; inspect the exact material used.
