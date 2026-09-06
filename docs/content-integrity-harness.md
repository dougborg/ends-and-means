# Content integrity harness

Run the publication gate from an installed checkout with Playwright's Chromium runtime available:

```sh
pnpm verify
```

The same command runs in CI and invokes `pnpm audit:content-integrity` exactly once after the production build.
It validates the canonical graph, sentence-per-line narrative source, fixture-backed integrity rules, the production build, archive exclusion, the content-attention audit, every rendered route, and representative browser checks.
It also runs `pnpm audit:corpus-diversity` against the non-public research-candidate matrix before application checks.
That audit fails on malformed candidate scope or feasibility data and reports portfolio omissions or concentration as attention, without creating scores, quotas, rankings, or live records.

## Failures and attention signals

The gate fails on invalid or unresolved entities and references, missing citation locators, broken model boundaries, workflow language in public fields, malformed narrative lines, runtime imports from excluded trees, excluded references in the built site, broken routes, and browser-test failures.
Each failure names a file or entity and a concrete repair.

The content audit remains informational where absence can be legitimate.
It lists missing dossiers, research-needed entities, unused Sources, entities without typed relationships, Dimensions without Placements, open Research Obligations, and research-gap sections without exact obligation ownership.
Researchers should resolve a listed gap or document why the absence is analytically correct; the harness must not manufacture a relationship or turn missing data into a midpoint.

Close phrasing between a Dossier standfirst or section and its source-backed Statements is also an attention signal.
It tells a reviewer which cited Sources to compare, but it is not a plagiarism verdict.
Human review remains responsible for checking the actual source passages, attribution, quotation, fairness, and independent synthesis.
Signals remain open until that comparison is possible; matching internal trace prose alone is not evidence that source mimicry has been cleared.
The harness uses locale-independent code-unit sorting for scanned paths and findings so identical inputs produce stable output regardless of filesystem, locale, or caller ordering.
Dependency scanning uses the TypeScript compiler parser for JavaScript and TypeScript modules and for Astro frontmatter and script regions, so comments, regular-expression literals, and string or template examples do not masquerade as runtime imports.
The Astro compiler is a direct development dependency because the standalone audit must own and version its parser contract rather than rely on Astro's transitive dependency graph.
Parser-backed integrity modules are imported only by audit tooling and its tests, not re-exported from the site's runtime domain barrel.
Malformed executable syntax and non-static dynamic dependency calls fail closed because the scanner cannot prove their publication boundary.
Scanned filesystem paths are normalized to forward slashes before publication-boundary checks so the same exclusions apply on every supported platform.

## Source preflight

Before advancing a Statement beyond `research-needed`, verify every cited URL in a browser and confirm the Source metadata, authority, claim support, and precise locator.
Network availability and publisher behavior are not stable enough to make live URL requests a deterministic CI gate, so the automated validator checks recorded HTTP(S) form and evidence contracts while the pull-request checklist records the human verification.

Archive and draft material are discovery leads only.
Nothing under `archive/`, or any legacy or draft tree, may be imported by runtime source or appear in a public bundle.
