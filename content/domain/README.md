# Canonical domain authoring

This directory contains the modular authoring records for the plural graph
defined in `docs/domain-model.md`. It is the sole publication content tree.
Research from `archive/legacy-research/` enters only after record-by-record
reconciliation, source review, and claim-level citation; archived IDs and
shapes are not canonical aliases or compatibility contracts.

Authoring is organized by entity type and relationship family. Entity files own
identity and intrinsic description; subject-centered relationship files own
substantive edges. The compiler in `src/lib/domain/` validates these records and
produces the read graph consumed by routes. Build products never become
authoring inputs.

Declarative records may use JSON. All executable repository code remains
TypeScript.

Works represent intellectual objects. Sources represent the particular edition,
article, dataset, legal text, archival record, or web manifestation actually
consulted. Statement-to-Source citation relationships own evidentiary roles and
locators. Publisher, library, authorized-reading, archive, and purchase links
are secondary resource metadata; purchase links must disclose affiliate status
and never serve as canonical identifiers.

Cases represent bounded empirical settings; Case Episodes separate materially
different institutional configurations within them. Places are referenced as
entities rather than embedded country labels. Dates support exact, approximate,
disputed, and unknown boundaries, including negative years for BCE material.
Ongoing Cases must expose an `asOf` date, last review date, and freshness state.
Episodes keep conditions, formal rules, rules-in-use, interactions, and outcomes
in separate Statement collections so observation and causal interpretation do
not collapse into one narrative field.

Collections are non-inheriting editorial groupings and may include concrete
Means when a label describes an institutional family. Depictions remain tied to
fictional Works. Fiction-derived Sources may provide context or qualification
but cannot support or challenge promoted empirical Statements. Eligible
support must resolve through the Source to an actual non-fiction Work. The
compiler emits entities, relationships, and indexes in stable ID order;
authoring-file order is not semantic.
