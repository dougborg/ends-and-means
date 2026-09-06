# Subject Guide experience

Subject Guides are the primary learner journey for questions such as “What does
economic democracy mean?”
Canonical Concept, Approach, Case, Source, and other entity routes remain
precise secondary reference infrastructure.

## Public route contract

The `/guides/[slug]/` route is generated only from `canonicalGraph.subjectGuides`,
the reviewed/published projection.
It must never use `subjectGuideRecords` or its editorial indexes.
Explore likewise lists only the live projection and presents existing Approach
dossiers as distinct institutional paths, not incomplete Subject Guides.
Its subject search is a deterministic projection of guide labels,
descriptions, and guide-owned `searchQueries`; it has no separate alias index.
Fallback search requires complete normalized tokens rather than substring
fragments, and directory order uses normalized code-unit keys with the guide ID
as a stable tie-breaker.
Exact ambiguous phrases return every explicitly disambiguated owner.
Queries whose nearest guide leaves the general subject unsettled are visibly
marked as research gaps rather than silently conflated with that guide.
With scripting unavailable, the full reviewed directory and its entry phrases
remain readable and searchable with browser Find.

## Reading order

The page answers the guide's short-answer question first from its exact Dossier
standfirst.
The subject itself is the H1, and the standfirst follows it immediately without
an intervening heading.
The remaining authored section headings form both the visible narrative and a
compact on-page outline generated from the same ordered section contract.
Long Approach, Case, and Challenge pages use that component when their rendered
contract supplies at least three useful destinations.
Short pages omit it rather than adding navigation overhead.
Unsupported optional sections are omitted instead of leaving headings,
placeholders, status messages, or empty space.

The primary subject's canonical page is linked as a reference destination.
The learner guide does not replace or redirect that route.

## Evidence and relationships

Each selected narrative passage keeps its supporting canonical Statements in a
native `details` disclosure immediately after the passage.
Selected relationships use their public directional label and keep supporting
Statements in an adjacent disclosure.
Statements selected directly by a guide section likewise remain in a native
disclosure rather than entering the default narrative path.
Research Obligations appear as concrete open questions with their scope,
evidence need, and tested claims available on the same page.

Evidence disclosures work without JavaScript, open from the keyboard, expand
for printing, and retain exact citation roles and locators.
Their accessible names identify the exact overview, section, selected claim
set, or relationship they support; generic repeated labels such as “Check the
evidence” are not sufficient.

## Responsive behavior

The wide shell pairs a readable narrative measure with a sticky question rail.
At narrow widths the rail becomes a compact native `details` disclosure before
the narrative, preventing sticky overlap under mobile layouts and text zoom
while remaining usable without JavaScript.
Fragment targets follow source order and use scroll offsets without smooth
motion being required.
Native fragment navigation remains the no-JavaScript fallback, while a small
enhancement moves keyboard focus to the selected section when scripting is
available.
Repeated evidence disclosures do not repeat a Statement's fragment identifier;
the detailed reference presentation owns at most one anchor per Statement.
The page does not use fixed viewport heights or empty side columns.

Browser review covers desktop, tablet, mobile, text zoom, keyboard operation,
no-JavaScript behavior, overflow, contrast, and representative screenshots.
