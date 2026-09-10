---
name: research-preparation
description: Research and prepare evidence-backed issue briefs for Ends and Means before canonical authoring. Use for source feasibility, claim mapping, bounded case planning, or a research-only handoff; do not use it to edit or approve canonical content.
---

# Research Preparation

Prepare a bounded, implementation-ready research brief in the issue that owns
the proposed content change. This phase inspects evidence and exposes decisions
before canonical authoring; it does not publish content, promote the issue to
Ready, or approve a later implementation.

Read the shared
[editorial and source policy](../research-content-changes/references/editorial-policy.md)
before inspecting sources. Use the
[research brief template](references/research-brief-template.md), scaling it as
described in the [examples](references/examples.md).

## Establish the research boundary

- Start from the issue's reader question, full scope, acceptance criteria, and
  dependencies. Preserve them when the evidence reveals a gap.
- Search current canonical IDs, active Research Obligations, open changes, and
  `archive/legacy-research/` for semantic overlap. Treat archived material as a
  lead, never as evidence or publishable content.
- Bound each proposed Case by place, period, institutions, and the actions or
  decisions the evidence can actually establish.
- Record meanings, disputed uses, comparison opportunities, candidate narrative
  structure, and optional visual candidates only when they help the scoped
  reader outcome.

Research preparation does not require a worktree or production verification.
Do not edit `content/domain/`, create a parallel canonical staging tree, or use
the brief as proof that a Project item is implementation-ready.

## Inspect and map evidence

For every material candidate claim, record the consulted Work and exact Source
manifestation, URL, author or institutional creator, date and edition when
available, precise locator, access date, supported proposition, evidentiary
role, and limits. Distinguish:

- an inspected passage from an unread discovery lead;
- an inaccessible source from one whose relevant passage was examined;
- actor self-description from observation or later analysis;
- legal design, announcement, implementation, interaction, and outcome;
- source assertions from local synthesis or derived interpretation; and
- access or publication permission from authority to speak for a community.

Apply the shared policy's community, oral-history, privacy, disagreement, and
source-similarity boundaries. A complete-looking row is not evidence. A lead or
inaccessible source cannot support a candidate claim until the relevant
manifestation and passage are inspected.

Split compound propositions and assign stable candidate IDs so the implementer
can reconcile each fact once. Map proposed Statement roles, citations,
relationships, bounded Cases or Episodes, Research Obligations, and narrative
sections without asserting that they have already entered the canonical graph.

## Make the disposition explicit

Classify the research handoff as:

- `ready`: the inspected evidence supports bounded authoring, with remaining
  limitations representable honestly;
- `needs-evidence`: a material claim or scope requirement lacks inspected
  support; or
- `deferred`: the candidate is intentionally parked, with the reason recorded.

Separate research gaps from implementation dependencies. Name targeted
follow-up questions that can close independently. Do not hide a blocking gap in
general caveat prose or turn a limitation into a claim of completeness.

For a small correction, use a short brief containing the exact affected claim,
old and corrected support, manifestation and locator, downstream projections,
and focused acceptance checks. Do not require the full substantial-tranche
outline when those sections would add no decision value.

## Hand off to implementation

The issue remains the specification. Put the dated, versioned brief in its body;
link supporting artifacts only when they help a reviewer reproduce the mapping.
The delivery coordinator separately decides Project readiness and status.

The `research-content-changes` skill is the implementation consumer. Its author
must inspect every passage actually used, validate the final claim-to-source
mapping, preserve the original issue scope, and request targeted follow-up for a
material gap instead of silently expanding the work or restarting discovery.
For a substantial tranche, hand the brief to an implementation agent who did
not prepare it, then use another agent for independent final review. A small
correction may use one agent and the proportionate short brief. Every content
change retains its own publication gates.
