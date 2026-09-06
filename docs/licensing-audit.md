# Asset, provenance, and licensing-boundary audit

This audit records facts and owner decisions; it is not legal advice and does
not select or apply a license.
The machine-checkable inventory is
[`provenance/inventory.json`](../provenance/inventory.json), and
`pnpm audit:provenance` checks it during `pnpm verify`.
The snapshot was reviewed on 2026-09-06.
Each tracked file inherits the material, kind, and distribution classification
of exactly one normalized directory prefix, or uses one exact root-file record.
The audit rejects missing, overlapping, traversal-shaped, and root-versus-prefix
classifications rather than choosing an implicit winner.

## Findings

The repository currently contains project-authored application code, canonical
records, narrative, documentation, tests, workflow files, and one segregated
legacy research archive.
It contains no bundled fonts, icons, flag files, logos, images, audio, video,
or copied datasets.
The wordmark is text styled with system font stacks.
Source records cite external works and datasets by metadata and URL; the cited
works are not copied into the repository merely because they are referenced.

The material provenance gap is `archive/legacy-research/`.
It contains earlier project notes, citations, paraphrases, imported metadata,
and an attributed short quotation, but it has no reliable per-passage
authorship or permission ledger.
The archive is outside the build and is already documented as non-canonical.
Until the owner resolves its history, it should remain expressly outside any
broad content-license grant and must not be published or used as source-ready
copy.

Build output (`dist/`), coverage, screenshots, caches, and installed packages
are generated and ignored.
They are not a separate authorship category: a distributed artifact carries
the applicable terms of its source inputs and any included third-party code.
The production dependencies are Astro and micromark, both declaring MIT terms;
the rest of the direct dependency inventory is development-only.
The lockfile controls the full transitive dependency graph.
The committed exact-lockfile inventory records all 525 package/version keys in
the lockfile `packages` table (not the separate importer or snapshot keys),
including origin and terms locators, available upstream source metadata, and
declared licenses for 396 packages observed in installed manifests on macOS or
captured from the exact-version npm registry manifests for Linux packages.
The remaining 129 unresolved entries were unavailable in the audit platform's installed
package store; their exact registry/terms locators are recorded and their
license metadata is explicitly unresolved rather than guessed. This count is
an observation about available manifest evidence, not a claim that every entry
has the same optional-dependency role in the lockfile graph.
`pnpm inventory:dependencies` deterministically regenerates this evidence from
the lockfile and installed package manifests, while `pnpm audit:provenance`
fails on lock/inventory drift, locator mutation, or a license/source value that
differs from an installed manifest.
Each resolved record also carries a deterministic digest of its observed
identity, license, source, and status so accidental metadata mutation fails.
The registry locators identify unavailable cross-platform packages but do not
substitute for their unobserved manifest metadata, which remains unresolved.
Before a release artifact is redistributed, resolve and review the entries for
the target platform and preserve every required license or notice text.

## Recommended boundaries for the owner's decision

| Boundary | Current paths | Decision boundary |
|---|---|---|
| Software | `src/`, `scripts/`, tests, configuration, workflows | Choose one code license and state whether examples and test fixtures follow it. |
| Canonical data | `content/domain/` typed entities, Statements, Sources, and relationships | Decide whether database-like reuse should follow the narrative license, a separate data license/tool, or both database and record-content terms. |
| Narrative | `content/domain/presentation/narratives/` and other authored explanatory prose | Choose a content license only after confirming the owner controls all included wording. |
| Documentation | `docs/`, `README.md`, `CONTRIBUTING.md`, and repository skills | Decide whether documentation follows code or narrative terms; say so rather than relying on inference. |
| Generated artifacts | deployed HTML, CSS, and JavaScript in `dist/` | State that outputs inherit the applicable input boundaries and preserve third-party notices. |
| Legacy archive | `archive/legacy-research/` | Exclude unless and until provenance is resolved item by item. |
| Future third-party assets | fonts, icons, flags, logos, images, media, datasets, quotations, imported metadata | Require an inventory record before commit or publication, including source, provider, terms, modifications, distribution, and attribution. |

This split keeps the live site canonical-only and prevents a repository-wide
license statement from accidentally claiming rights in unresolved archive or
future third-party material.

## Viable alternatives to decide between

These are decision candidates, not recommendations of legal sufficiency.

| Code | Canonical data and narrative | Practical tradeoff |
|---|---|---|
| MIT | CC BY 4.0 | Simple permissive reuse on both sides; content reuse requires attribution, while code distributions retain the MIT notice. It does not require adaptations to remain open. |
| Apache-2.0 | CC BY 4.0 | Similar permissive content boundary, with the code license's express patent terms and notice-handling obligations. More notice administration than MIT. |
| MIT or Apache-2.0 | CC BY-SA 4.0 | Keeps adapted content under the same license. The owner must decide whether that reciprocity is desirable and define clearly which database exports, page prose, and combined materials are adaptations. |
| MIT or Apache-2.0 | CC0 for canonical facts/data plus CC BY or CC BY-SA for narrative | Maximizes structured-data reuse while preserving attribution or reciprocity for authored prose. This adds boundary and export complexity, and CC0 should be used only for material the owner can validly dedicate. |
| MIT or Apache-2.0 | ODbL for a defined database plus a separate content license | Provides database-focused attribution/share-alike terms but creates the most operational complexity: database, individual contents, produced works, and code need distinct notices. |

Creative Commons says only a rights holder or someone with express permission
can apply its licenses or CC0, and that those grants are irrevocable.
Its official material also distinguishes attribution from ShareAlike, under
which modified material must use the same terms.
The ODbL separately distinguishes database rights, individual contents, and
produced works.
Those distinctions are why this audit does not collapse code, data, prose,
outputs, and archive material into one default.

## Existing third-party obligations and evidence

Direct package declarations are recorded individually in the main inventory;
every package/version in the lockfile `packages` table is recorded in
`provenance/pnpm-lock-packages.json`.
The relevant standard terms and upstream evidence are:

- [MIT license text](https://opensource.org/license/mit): retain its copyright
  and permission notice in copies or substantial portions.
- [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0): preserve
  the license and applicable attribution notices; inspect upstream `NOTICE`
  files for distributed dependencies.
- [ISC license text](https://opensource.org/license/isc-license-txt): used by
  development-only direct dependencies in this snapshot.
- [Creative Commons BY 4.0](https://creativecommons.org/licenses/by/4.0/),
  [BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/), and
  [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/): authoritative
  candidate terms and pre-licensing cautions for owner-authored content/data.
- [Open Data Commons ODbL 1.0](https://opendatacommons.org/licenses/odbl/1-0/):
  authoritative candidate terms if the owner chooses a database-specific
  boundary.

Orientation, identity, DOI, ISBN, library, and source URLs in canonical records
are locators, not evidence that the linked work's license transfers to this
repository.
If exact source wording, artwork, metadata dumps, or dataset rows are added in
the future, they become governed assets and need their own record.

## Owner decisions required before issue #16 can add licenses

1. Confirm the copyright holder(s) and whether past contributions or employment
   obligations affect authority to license repository-owned material.
2. Choose a code license, and decide whether documentation follows it.
3. Choose the canonical-data treatment, including any database-rights boundary.
4. Choose a narrative/content license and desired adaptation reciprocity.
5. Decide whether to retain, rewrite, remove, or separately reserve the legacy
   archive; do not include it in a blanket grant while provenance is unresolved.
6. Decide what notice and attribution surface deployed and downloadable output
   must expose, after reviewing an exact-lockfile third-party report.
7. Obtain qualified legal review if certainty is required for jurisdiction,
   database rights, quotations, contributor ownership, or compatibility.

No `LICENSE`, content-license notice, site footer notice, or package license
field is added by this audit.
