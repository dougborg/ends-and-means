---
name: research-content-proposals
description: Research and stage evidence-backed proposals for Ends and Means traditions, Ends, institutional Means, Topics, Challenges, Criteria, statements or interpretations, sources, and bounded cases. Use for additions or substantial revisions; never use it to publish canonical content.
---

# Research Content Proposals

Create a reviewable proposal, never a canonical-content change.

## Route the request

1. Read [references/editorial-policy.md](references/editorial-policy.md).
2. Read [references/proposal-format.md](references/proposal-format.md).
3. Read each relevant entity route:
   - [tradition](references/routes/tradition.md)
   - [end](references/routes/end.md)
   - [means](references/routes/means.md)
   - [topic](references/routes/topic.md)
   - [challenge](references/routes/challenge.md)
   - [criterion](references/routes/criterion.md)
   - [statement](references/routes/statement.md)
   - [source](references/routes/source.md)
   - [case](references/routes/case.md)

For requests spanning entity types, make a separate proposal for each and
connect them through proposed relationships instead of embedding entities.

## Required boundary

Write only to:

```text
proposals/<type>/<stable-id>/proposal.json
proposals/<type>/<stable-id>/research.md
```

Do not edit `content/`, `generated/`, source research documents, or application
code. A human reconciles and promotes accepted proposals outside this skill.

Use authoritative sources and browse every cited URL. Preserve URL-level
provenance, distinguish observations from attributed values and editorial
interpretations, and document conflicting evidence and limitations. Search the
current framework and staged proposals for duplicates before writing. Record
plausible candidates; do not silently merge concepts.

Do not recreate a fixed comparison matrix or require every tradition to answer
every Challenge. Do not use retired entity names, abbreviated row IDs, verdicts,
or evidence grades. Missing relationships are legitimate research gaps.

Run before handoff:

```bash
npm run validate
node .agents/skills/research-content-proposals/scripts/validate-proposal.mjs proposals/<type>/<stable-id>
node .agents/skills/research-content-proposals/scripts/check-duplicates.mjs proposals/<type>/<stable-id>
```

If duplicate checking reports `unacknowledged` candidates, add each plausible
candidate with a comparison reason and rerun it. Report validation, duplicate
candidates, evidence conflicts, limitations, and human-review questions.
