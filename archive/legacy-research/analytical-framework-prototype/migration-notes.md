# Migration notes: legacy matrix to the analytical framework

**Status:** working hypotheses for review, not a migration specification.

The existing 8×14 matrix is valuable editorial material, but its rows and cells
mix several kinds of objects. A clean migration should decompose that material
before deciding what survives. URL stability is a delivery concern; it is not a
reason to preserve a weak conceptual boundary.

## What should not migrate one-for-one

| Legacy object | Likely target treatment |
| --- | --- |
| System row | Split an ideal type or tradition from its advocates, declared Ends, proposed Means, and historically bounded institutional configurations. |
| Crux row | Review individually: retain, split, merge, or reclassify as a Challenge, Criterion, context variable, or research question. |
| Comparison cell | Decompose prose into sourced statements and a trace through Ends, Means, expected interactions, cases, outcomes, Criteria, and interpretations. |
| Verdict | Do not migrate as a derived conclusion. Preserve only as attributed legacy editorial history until a human decides whether any qualitative assessment vocabulary remains useful. |
| Evidence tier | Replace the cell-wide label with claim-level citations, source fit, uncertainty, and explicit missing evidence. Evidence breadth must not imply evaluative success. |
| `breaks` field | Split into observed failure, hypothesized mechanism, boundary condition, counterevidence, or competing interpretation. |

## Challenge triage suggested by this prototype

The Swedish cases immediately cross old row boundaries:

- Distribution of gains and ownership spans legacy `c03` (ownership/control)
  and `c06` (inequality/concentrated capital). Treating these independently can
  hide how wage restraint, profits, ownership, and control interact.
- Coordination and accountability spans `c04` (voice), `c07` (state/capture),
  and `c14` (bad actors). Concentrated authority can sit in unions, employer
  associations, fund boards, firms, or government; a state-only framing misses
  much of the action situation.
- `c10` “Track record” is not presently an open institutional Challenge. It is
  better represented by bounded cases, outcomes, and evidence quality.
- `c11` “Scale sensitivity” may be a transferability question or Criterion,
  supported by context fields, rather than a standalone Challenge in every
  comparison.
- `c12` “Transition path” may remain a Challenge, but it requires a specified
  starting arrangement, sequence, participants, and transition costs.
- `c14` “Robustness to bad actors” may work better as a stress-test family
  applied across Means, with capture and abuse claims attached to particular
  positions and powers.

These are hypotheses to test on other systems and cases before adopting a new
canonical Challenge set.

## Proposed target distinctions

- **Topics** are reader-facing discovery labels. They may group many entities
  but carry no analytical conclusion.
- **Traditions or system ideal types** are contested conceptual families, not
  country labels or causal treatments.
- **Ends** are attributable aims or cautious interpretations. Declared,
  design-implied, and practice-interpreted Ends remain distinct.
- **Means** are concrete institutional arrangements at a stated rule level.
- **Challenges** are recurring open problems that make different responses
  comparable.
- **Criteria** are disclosed normative or performance lenses; they do not
  become weights in an aggregate score.
- **Cases** are bounded in place, time, participants, and institutional scope.
- **Statements and interpretations** carry provenance, uncertainty, and scope.

## Migration sequence

1. Test the vocabulary against several unlike cases before freezing IDs.
2. Inventory every legacy row and cell by the target object types above.
3. Draft a many-to-many migration map with `retain`, `split`, `merge`,
   `reclassify`, and `archive` decisions plus reasons.
4. Review the new Challenge and Criterion sets for overlap and missing cases.
5. Approve a versioned target schema and authoring workflow.
6. Migrate claim by claim; keep legacy pages available as clearly labeled
   archival views or redirects only after target coverage exists.
7. Remove compatibility fields only after route and provenance checks pass.

The prototype contains no compatibility IDs, aliases, or imports from the
current content model. Any one-time extraction map belongs in migration tooling
or an archival record, not in the new canonical schema.
