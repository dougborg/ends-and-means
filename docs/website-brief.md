# Implementation Brief: Comparative Political-Economy Website

**Working title:** Systems by Crux (rename freely)
**Status:** greenfield; content exists, no code yet
**Owner:** Doug

## 1. What this is

A static, evidence-forward reference site that compares economic and political systems by how each one handles a fixed set of core problems ("cruxes"). The content is a graph, not a set of articles: systems × cruxes produce cells, and every cell cites sources and historical cases. The site's job is to let a reader pivot through that graph — read one crux across all systems, walk one system through all cruxes, click any claim and see what it rests on, and filter the whole matrix by how much evidence actually exists.

The goal is understanding, not advocacy. The site takes positions only inside explicit, labeled "verdict" fields, and every verdict must be traceable to sources and cases.

## 2. Inputs you will be given

Three markdown files. Treat them as the content of record for v1; do not invent additional claims, sources, or cases beyond what they contain.

- `system-comparison-by-crux-v2.md` — 8 systems × 14 cruxes. Each crux is a section with a table (System | Mechanism | Where it breaks) and a **Verdict** line. Ends with a summary matrix and observations. This is the primary source of cells.
- `political-economy-notes.md` — Part 1 is thirteen narrative summaries (background for system and crux descriptions); Part 2 is the reading list, organized by section, with a verification-status note. This is the source of `sources`.
- `system-comparison-by-crux.md` — v1 of the matrix (5 systems × 10 cruxes). Superseded by v2; use only to cross-check.

Historical cases (Mondragón, Spain 1936–39, the Meidner Plan, Fagor's 2013 bankruptcy, Singapore, the Great Leap Forward, etc.) are not yet in a structured file. They are mentioned throughout the cells. Extracting them into `cases` is part of the import work (see §5, M1).

## 3. Content model

Everything lives in the repo as structured content. No CMS, no database.

### Entities

| Entity | ID scheme | Notes |
|---|---|---|
| **System** | `lf`, `sd`, `ms`, `cp`, `sa`, `sc`, `ac`, `pe` | Eight in v1. See v2 file §"How to read this" for names and definitions. |
| **Crux** | `c01` … `c14` | Fourteen in v1. Each has a title, a one-line question, and an optional note on whether it is value-laden. |
| **Cell** | `{system}-{crux}` e.g. `sd-c07` | Exactly one per system × crux pair (112 in v1). Fields: `mechanism`, `breaks`, `verdict`, `evidence`, `sources[]`, `cases[]`. |
| **Source** | slug, e.g. `hayek-1945-use-of-knowledge` | From the reading list. Fields: author(s), title, year, type (book/article/paper), section, note, `verified` status, optional URL. |
| **Case** | slug, e.g. `mondragon`, `spain-1936` | A historical instance. Fields: name, dates, location, summary, which systems claim it, `sources[]`. |
| **Thinker** | slug, e.g. `kropotkin` | Optional in v1. Only if it falls out of the source import cheaply. |

### Enumerations

`verdict` (per cell): `strong` | `moderate` | `mixed` | `weak` | `worst` | `local` | `untested` | `contested` | `value-question`

`evidence` (per cell): `extensive` | `partial` | `contested` | `untested` | `none`

`verified` (per source): `checked` | `confirmed-earlier` | `from-knowledge` — matches the three tiers in the reading list's verification note.

### Format

Recommended: one YAML or Markdown-with-frontmatter file per entity, under `content/{systems,cruxes,cells,sources,cases}/`. Cell bodies can hold the mechanism/breaks prose as markdown; references are ID arrays in frontmatter.

Example cell (`content/cells/sd-c07.md`):

```yaml
---
system: sd
crux: c07
verdict: strong
evidence: extensive
sources: [stigler-1971-economic-regulation, acemoglu-robinson-2019-narrow-corridor]
cases: [nordic-model]
---
## Mechanism
Separation of powers, courts, free press, unions as counter-power, transparency. Taxation itself creates an accountability bargain.

## Where it breaks
Regulatory capture (Stigler); discretionary spending enables patronage; durability depends on continual re-contestation.
```

### Validation (build must fail on any violation)

1. Every system × crux pair has exactly one cell.
2. Every `sources[]` and `cases[]` ID resolves to an existing entity.
3. Every cell exposes citation status. During M1, an empty `sources[]` and
   `cases[]` is valid only when `needsCitation: true`; the importer emits a
   report. Before v1 release, every cell must have at least one resolved source
   or case and `needsCitation` must be false.
4. Enumerated fields use only the allowed values.
5. Every source has `verified` set.

## 4. Site structure

Static site. The stack is deliberately undecided; evaluate options against the
content graph, build-time validation, no-JavaScript reading experience, and the
small interactive matrix. Deploy target: **Vercel** (already connected on Doug's
account). Keep dependencies minimal — no component library unless it earns its
place.

### Pages

- `/` — the matrix. Systems as columns, cruxes as rows, each cell showing its verdict as a compact label. Hover/tap reveals the first line of mechanism. Click opens the cell page. Controls: filter rows by evidence level; toggle to hide untested systems; transpose (cruxes as columns).
- `/systems/{id}` — one system walked through all fourteen cruxes in order, each cell inline, with a sidebar listing every case and source the system relies on.
- `/cruxes/{id}` — one crux across all eight systems, side by side, with the verdict line at the top and the "value-laden" note if applicable.
- `/cells/{id}` — the full cell: mechanism, where it breaks, verdict, evidence, sources, cases, and links to its row and column neighbors.
- `/sources/{id}` — bibliographic entry, note, verification badge, and **backlinks**: every cell and case that cites it.
- `/cases/{id}` — summary, dates, which systems claim it as evidence and on which cruxes (Spain 1936 is evidence *for* anarchism on voice and *against* it on defense — the page should show both), sources.
- `/reading` — the reading list, filterable by section and verification status, each entry linking to its source page.
- `/about` — what the site is, how verdicts are made, the evidence tiers, how to propose a change (link to the repo).

### Cross-linking rules

- Every mention of a system, crux, source, or case inside prose should be a link if it can be resolved by ID. A remark-style plugin that turns `[[slug]]` into links is sufficient.
- Every page shows its backlinks ("referenced by").
- The matrix, system pages, and crux pages are three views of the same 112 cells. Do not duplicate content; render from the cell collection.

## 5. Milestones

**M1 — Schema and import.** Define a framework-independent content schema. Write
a repeatable, deterministic import script that parses
`system-comparison-by-crux-v2.md` into cells and `political-economy-notes.md`
Part 2 into sources. Preserve source prose exactly; keep interpretive mappings
(`verdict`, `evidence`, cases, and citations) explicit and reviewable. The chosen
build fails structural validation and prints a report of unresolved editorial
work. No UI yet beyond a diagnostic dump.

**M2 — Entity pages.** System, crux, cell, source, case, reading-list, and about pages. Backlinks working. Plain, readable, mobile-first. No matrix UI yet.

**M3 — Matrix.** The home-page matrix with filter, hide-untested, and transpose. This is the only interactive component; keep it small.

**M4 — Polish.** Typography, accessibility pass (keyboard nav on the matrix, contrast, semantic tables), OpenGraph, sitemap, a `CONTRIBUTING.md` explaining how to add a cell, source, or case and what validation will reject.

Ship M1 and M2 before any visual design work. The point of M1 is to find out whether the graph model holds up against the real content.

## 6. Design principles

- **Evidence-forward.** The evidence tier and verification status are always visible, never buried. "Untested" and "needs citation" are honest labels, not embarrassments.
- **Neutral surface, explicit verdicts.** Prose in `mechanism` and `breaks` describes; only the `verdict` field judges. Do not let the tone drift into advocacy for any column.
- **Pivotable.** From any cell, one click reaches its row, its column, its sources, and its cases.
- **Readable without JS.** Everything except the matrix filters must work with JavaScript disabled.
- **Small.** No accounts, no comments, no analytics beyond Vercel's defaults, no tracking.

## 7. Non-goals for v1

- Do not add systems, cruxes, sources, or cases beyond the input files. Adding a system means writing fourteen cells; that is a content task for later.
- Do not editorialize beyond the verdict field or rewrite the cell prose for style.
- Do not fabricate URLs or ISBNs for sources. Leave the URL field empty if the input does not supply one.
- No CMS, no auth, no server runtime.

## 8. Open decisions (Doug to confirm; proceed with defaults if unanswered)

1. Site name and domain — default: use the repo name; deploy to a Vercel preview URL.
2. Content license — default: CC BY-SA 4.0 for content, MIT for code.
3. Whether cells should carry a `confidence` field separate from `evidence` — default: no, `evidence` is enough for v1.
4. Whether to include a "changelog" page listing edits to cells — default: rely on git history and skip.

## 9. Definition of done for v1

- Repo builds from a clean clone with a single install and build command.
- All 112 cells, all sources, and all extracted cases render, with validation enforced at build time.
- Matrix, system, crux, cell, source, case, and reading pages exist and cross-link per §4.
- The uncited-cells report is either empty or surfaced on the site as "needs citation" badges.
- Deployed to Vercel with a shareable URL.
