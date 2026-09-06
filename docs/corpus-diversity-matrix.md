# Corpus diversity and source feasibility

The candidate matrix is a private research-grooming aid, not a catalogue of societies or a publication queue.
Each row begins with a specifically named people or community, place, period, and learner question.
The broad context tags make omissions inspectable, but they do not describe regional essences and never count as evidence that a context is covered.

## Selection rule

Groom a possibility only when the matrix can keep community self-description distinct from external classification and can name realistic community-authored, oral, primary, and independent sources.
Record unavailable material honestly.
`viable` and `partial` are evidence-bearing states and require at least one source lead with an authority, URL, and check date.
`not-found` and `not-assessed` retain no source leads; change the state to `partial` or `viable` once a lead has actually been checked.
Access, permission, translation, freshness, power, colonial disruption, and focused research needs are part of feasibility rather than cleanup after selection.
The seed rows in `research/corpus-diversity/candidates.json` are possibilities only; they are not ranked, selected, canonical, or approved for publication.

The matrix deliberately has no total, score, quota, weight, midpoint, maturity level, or evolutionary sequence.
Portfolio findings are prompts for editorial inspection.
A missing context asks for a bounded, source-feasible candidate rather than a regional placeholder.
A relationship shared by more than 60 percent of a pool of at least four candidates is reported as possible material concentration, not as an instruction to add a token counterexample.

## Evidence workflow

Open every recorded lead before grooming.
Confirm how the people or community describe themselves, whether the source is authored or controlled by them, and whether independent scholarship is genuinely independent.
For living communities, refresh community pages and permission conditions before research begins.
For translated or oral material, name who translated, recorded, curated, or authorized access.
Turn unresolved claim-level questions into canonical Research Obligations only when a candidate is selected for actual research; matrix questions do not enter the live graph.

Run `pnpm audit:corpus-diversity` to validate the checked-in seed.
The full `pnpm verify` gate runs the same audit.
Schema failures are violations; missing-context and concentration findings remain visible attention because absence can be analytically legitimate.

## Publication boundary

The matrix lives under `research/`, outside `content/domain/` and every page or runtime import; the content-integrity gate scans Astro and other runtime modules and fails an import from `research/corpus-diversity`.
It cannot create a public entity, Dossier, Subject Guide, route, or search result.
Moving a candidate into canonical research requires a separate evidence-backed pull request under the normal source and model contracts.
