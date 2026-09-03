# System proposal

A system is a coherent institutional arrangement, not a country, party,
temporary policy, or idealized slogan. Define its boundaries and meaningful
variants before evaluating it.

In `content`, include `description`, `boundaries`, and exactly one entry for each
canonical crux ID `c01` through `c14`:

```json
{
  "description": "Institutional definition",
  "boundaries": "Included and excluded variants",
  "cruxes": [{
    "cruxId": "c01",
    "ends": "Promised or valued ends",
    "means": "Institutional mechanism",
    "practice": "Observed record and conditions",
    "evidenceSummary": "Strength, gaps, and transfer limits",
    "claimIds": ["claim-id"]
  }]
}
```

All 14 entries are required even when evidence is untested; say so explicitly
instead of filling gaps by analogy. Cross-system comparisons require matching
definitions and conditions. Keep provisional evaluative language in claims,
not hidden inside system naming. Every crux must reference at least one bounded
claim, and the 14 entries need distinct claim coverage; one generic claim cannot
stand in for the complete comparison. Distinct IDs are not enough: empirical
claim text and the combined Ends/Means/Practice/evidence narrative must be
substantively specific to each crux. The validator rejects normalized exact
duplicates across rows; human review still judges shallower paraphrases.
