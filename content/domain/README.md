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
They may identify the Event that triggered the latest review with sorted, unique `materialChangeEventIds`; this is editorial freshness metadata, not a turning-point or causal claim, and the Event must have cited description evidence.
Episodes keep conditions, formal rules, rules-in-use, interactions, and outcomes
in separate Statement collections so observation and causal interpretation do
not collapse into one narrative field.
Broad labels for political organization do not override those bounds.
Keep community self-description, translations, scholarly categories, and
colonial or administrative classifications distinct; do not encode a universal
band–tribe–chiefdom–state sequence.
Living-community research should include appropriately authorized community
records or oral histories where available, with the speaker, capacity,
publication context, permissions, and limits kept visible.

Dossiers are the canonical presentation layer for readable, subject-led prose.
Each active Dossier belongs to exactly one canonical subject and supplies one
standfirst plus ordered narrative sections. Supported and qualified sections
must cite canonical Statements; an explicit `research-gap` section must cite
none. Related entity references provide navigation without duplicating graph
relationships. Do not add overview or explainer prose to the subject entity:
the same Dossier should drive listing summaries, page introductions, and—where
the route exposes narrative detail—its prose sections. Record the date of the
latest substantive review in `reviewedAt`.
Write each Dossier's standfirst and section bodies in one matching file under
`presentation/narratives/`.
The first paragraph is the standfirst; each `## stable-section-id` begins the
body for the section with that ID in the adjacent typed manifest.
The loader rejects missing and unexpected sections.
Markdown may use ordinary emphasis and links, but raw HTML is escaped and unsafe
link protocols are removed during rendering.
Write one semantic sentence per source line and do not add hard breaks merely
to control source width.
Run `pnpm lint:markdown` before review.
Run `pnpm audit:content` to see live-ready Dossier coverage for the primary
page kinds currently in scope (Approach, Case, Challenge, and Concept), the exact
subjects still missing narrative, explicit research-gap sections, and entities
that remain in `research-needed` status. Graph validation still fails the build
for unresolved or mistyped entity, Statement, Source, and relationship
references.

A SubjectGuide may compose several Dossiers and canonical record kinds
into one learner journey.

“Learner journey” is internal design language.
Published Subject Guide and live Dossier identity fields describe the subject,
its material mechanisms, and an evidence-backed boundary directly; they do not
advertise a learner path or narrate the site’s presentation framework.
It is a validated presentation composition, not a canonical graph superclass or
a new owner of factual claims and relationships.
Author guides as `subject-guide` documents under `presentation/`.
Every guide section selects existing traced narrative or canonical records by
ID; it never owns a prose body, entity aliases, graph relationships, or Research
Obligations.
Only the short answer, meanings and boundaries, and comparisons and next steps
are structurally required.
Omit other roles cleanly unless reviewed material supports them.
Use `searchQueries` for familiar non-identifying entry phrases, add explicit
disambiguation when a normalized query reaches several guides, and reserve
entity `alternateLabels` for true lexical identity.
The compiler's closed typed references make `content/domain/` the only possible
guide input; archived research cannot be selected or rendered.
The compiled `subjectGuideRecords` collection includes editorial states for
audits, while `subjectGuides` and the public lookup helpers contain only reviewed
or published records.
Production routes and discovery must never consume the raw record collection.
The short answer must use the primary subject's Dossier standfirst, and meanings
and boundaries must select traced narrative or Statements.
Selected live relationships require live endpoints and mature evidence.
See `docs/adr/0004-subject-guides-as-presentation-compositions.md`.

Collections are non-inheriting editorial groupings and may include concrete
Means when a label describes an institutional family. Depictions remain tied to
fictional Works. Fiction-derived Sources may provide context or qualification
but cannot support or challenge promoted empirical Statements. Eligible
support must resolve through the Source to an actual non-fiction Work. The
compiler emits entities, relationships, and indexes in stable ID order;
authoring-file order is not semantic.

Concept relationships are likewise non-inheriting. For example, Democracy and
Republic are related Concepts, while representative government is an Approach,
electoral representation and sortition are Means, and equal political standing
and non-domination are attributed Ends. A constitutional label, institutional
procedure, or related political tradition must not silently transfer those
claims to another record.
