---
name: research-content-proposals
description: Research and stage evidence-backed proposals for new Ends and Means cruxes, systems, sources, or cases. Use for researching additions or substantial revisions; do not use for directly editing canonical content.
---

# Research Content Proposals

Create a reviewable proposal, never a canonical-content change.

## Route the request

1. Read [references/editorial-policy.md](references/editorial-policy.md).
2. Read [references/proposal-format.md](references/proposal-format.md).
3. Read exactly one route matching the requested entity:
   - [references/routes/crux.md](references/routes/crux.md)
   - [references/routes/system.md](references/routes/system.md)
   - [references/routes/source.md](references/routes/source.md)
   - [references/routes/case.md](references/routes/case.md)

If the request spans entity types, make a separate proposal for each and read
only those routes.

## Required boundary

Write only to:

```text
proposals/<type>/<stable-id>/proposal.json
proposals/<type>/<stable-id>/research.md
```

Do not edit `content/`, `generated/`, source research documents, or application
code. A human promotes accepted proposals outside this skill.

Research with authoritative sources. Browse and verify every cited URL; scripts
can check metadata and links, but cannot prove that a source is authoritative.
Preserve URL-level provenance, distinguish
empirical claims from value judgments, and document conflicting evidence and
limitations. Search for duplicates before writing; record plausible duplicate
candidates rather than silently merging concepts.

Run both checks before handing off:

```bash
npm run validate
node .agents/skills/research-content-proposals/scripts/validate-proposal.mjs proposals/<type>/<stable-id>
node .agents/skills/research-content-proposals/scripts/check-duplicates.mjs proposals/<type>/<stable-id>
```

If the duplicate checker reports `unacknowledged` candidates, add each plausible
candidate to `duplicateCandidates` with a comparison reason, then rerun it.

Report validation results, duplicate candidates, and questions for human review.
