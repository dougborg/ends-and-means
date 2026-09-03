# Analytical framework prototype

**Status:** non-canonical research prototype for GitHub issue #38.

This directory tests the proposed Ends / Means / Challenges / Criteria model
against one political tradition, two newly framed Challenges, and two bounded
Swedish cases. It
is intentionally outside the content import pipeline. Nothing here appears on
the public site or changes the current published content.

The prototype asks how Swedish social-democratic institutions responded to two
newly framed Challenges:

- distribution of gains and ownership; and
- coordination and accountability.

These are newly modeled questions, not renamed rows from the current site.
The prototype has no compatibility fields or dependencies on the current
content types. This tests a clean target model instead of forcing new analysis
into inherited boundaries.

The cases are distinct. The Rehn–Meidner policy complex (1951–1983, with a
stable centralized-bargaining implementation window of 1956–1982) was a
bundle of wage, macroeconomic, and labor-market institutions. The enacted
wage-earner funds (1984–1991) were a later, capped public-pension investment
arrangement—not the original 1975 Meidner ownership-transfer proposal.

`prototype.json` is executable design research, not a completed historical
account. Its validator requires explicit boundaries, exact citations,
fact/inference/value labels, separate formal rules and rules-in-use, textual
uncertainty, and multiple interpretations. It rejects aggregate scores,
weights, rankings, verdicts, and derived evidence labels.

Run the prototype checks with `npm test`.

The visual sketch generated from this fixture is available at `/prototype/`
in local and deployed builds. It is intentionally omitted from primary
navigation and marked `noindex` while the interaction and vocabulary are under
review.

See `migration-notes.md` for an analysis of how to extract useful research from
the current matrix without carrying its ontology into the replacement.
