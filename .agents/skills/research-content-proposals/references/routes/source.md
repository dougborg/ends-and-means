# Source proposal

Propose a source because it supports, challenges, or contextualizes a specific
part of the graph—not merely because it belongs on a general reading list.

In `content`, include:

```json
{
  "authors": ["Author Name"],
  "title": "Bibliographic title",
  "year": 2024,
  "sourceType": "book",
  "identifiers": { "doi": "10.x/example", "isbn13": "9780000000000" },
  "relevance": "Which entities or claims this source informs",
  "accessUrls": ["https://publisher.example/item"]
}
```

Verify bibliographic facts against the publisher, DOI registration record, or
library catalog. Prefer DOI/ISBN/Open Library identifiers over retailer URLs.
Label purchase links and affiliate status; access and publisher links take
priority. Flag editions or title variants as duplicate candidates.
