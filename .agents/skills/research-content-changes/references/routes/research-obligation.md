# Research obligation change

A Research Obligation is one focused question that the reviewed evidence does
not yet settle. Search existing obligations before beginning research. Create or
update one when work identifies a material limitation that should remain visible
after publication.

Choose the type precisely:

- `counterargument` records a serious conceptual, normative, feasibility, or
  institutional objection;
- `counterevidence` records the need for observations that could challenge an
  empirical Statement;
- `counterfactual` asks what would likely happen under a specified causal
  alternative; and
- `research-gap` covers a focused unanswered question that is not one of the
  three types above.

Target a reader-facing Approach, Case, Challenge, or Concept and, when possible,
the exact Dossier section that owns the limitation. Link the existing Statement
IDs whose claims or limits prompted the question in `addressedStatementIds`.
Keep those triggers distinct from `statementIds`, which records new claims
reconciled from the research. Every linked Statement must appear in the
target's Dossier; if `targetSectionId` is set, it must appear in that exact
section. Leave a question at target level when its trigger or result Statements
span more than one section.
State why current evidence is insufficient, what evidence or research design
would address it, and its place, period, population, institution, or other
applicability bounds. Split different outcomes into separate obligations when
they can be investigated or closed independently. Do not manufacture opposition
or use generic uncertainty language.

When evidence arrives, reconcile it into independently sourced Statements and
link those Statement IDs. An obligation with a reconciled Statement can no
longer remain `open`: use `partially-addressed` when the question remains active
or `resolved` when the evidence closes it. A partially addressed obligation
must name at least one reconciled Statement and remains active. Mark an obligation resolved only
with reconciled Statements, a reviewable rationale, and a closure date.
Withdrawal also requires a rationale and closure date but need not manufacture
a result Statement. Render status, addressed claims, reconciled claims, closure
date, and rationale so the public record does not hide lifecycle state.
Do not publish issue numbers, pull-request status, or migration workflow as
reader-facing research content. The compiler checks every Research Obligation
text field, and the rendered-route audit applies the same focused patterns to
the complete public text of every built page. Ordinary numbered prose is not a
workflow reference merely because it contains a number sign.
