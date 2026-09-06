# Editorial governance implementation notes

The public [editorial governance policy](https://endsandmeans.info/governance/)
is the plain-language authority for readers. Repository practice must not promise
less protection than that page.

## Reusable responsibility language

Use this concise summary when a page needs to explain responsibility without
repeating the full policy:

> People choose the questions, assess every source, and remain responsible for
> framing, interpretation, wording, fairness, and publication. AI and automated
> checks may assist discovery, synthesis, drafting, and error detection, but
> their output is never evidence and their signals never make editorial
> decisions.

Link “editorial decisions” or adjacent copy to `/governance/`. Do not shorten the
summary in a way that makes AI a source, implies automatic publication, or
removes human responsibility for source fitness.

## Repository enforcement

- `CODEOWNERS` requires the project owner to review repository changes.
- The pull-request template requires authors to identify human judgments,
  source review, similarity review, and exact-head independent review.
- Canonical publication states, source locators, workflow-language guards,
  structural validation, route checks, and browser checks fail closed in
  `pnpm verify`.
- The research-content skill governs evidence, community self-description,
  oral-history provenance, source similarity, and human publication judgment.
- The delivery skill governs accountable handoff, exact-head review, and
  rebase-only integration.

These controls can expose omissions and inconsistencies. They do not establish
truth, fairness, source quality, identity, consent, or acceptable harm; those
remain human decisions governed by the public policy.

## Policy maintenance

When the public policy changes, reviewers must inspect this file, the editorial
philosophy, both repository skills, public navigation, route tests, and browser
tests for drift. A temporary exception belongs in the same reviewable change as
the affected material and must record the rule, scope, reason, approver, and
review or end condition.
