# Case proposal

A case is a bounded historical or contemporary episode that tests a mechanism.
Avoid treating a whole country or century as one undifferentiated observation.

In `content`, include:

```json
{
  "name": "Case name",
  "dates": "Bounded period",
  "location": "Relevant location",
  "summary": "Why this episode matters",
  "systems": ["existing-or-proposed-system-id"],
  "claimIds": ["claim-id"]
}
```

Explain case-selection limits, rival causal accounts, and how far findings can
travel beyond the place and period. Each listed system must be justified; a
country is rarely evidence of one pure system.

Every system ID must already exist in the canonical graph. If the case depends
on a system being proposed at the same time, declare that ID in
`proposedRelationships` with a reason so a human can review the cross-link.
