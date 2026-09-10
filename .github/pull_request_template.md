## Purpose

<!-- What does this PR add or change? -->

## Change type

- [ ] Research-backed content change
- [ ] Application, tooling, or documentation change

## Review boundary

- [ ] I identified the claims or decisions that require human judgment.
- [ ] The concrete change, sources, and review decisions are contained in this PR; there is no parallel proposal artifact.
- [ ] Sources support the specific claims attached to them; contrary evidence and limitations are visible.
- [ ] I opened every cited URL and checked Source metadata, authority, claim support, and precise locators.
- [ ] I compared narrative prose with consulted source passages; automated similarity output was treated as a review signal, not a verdict.
- [ ] This change does not treat a country or historical Case as a pure or timeless instance of an Approach.

## Verification

<!-- Name focused checks and actual outcomes when useful; do not repeat every full-gate stage as a separate requirement. For rendering review, mark inapplicable with a reason when no public surface changed. -->

- [ ] I inspected the desktop, tablet, and mobile screenshots for hierarchy, readability, spacing, and empty/broken states.
- [ ] `pnpm verify` (the full local/CI path, including lint, static analysis, type checks, coverage, build, routes and browser tests)

## Review and integration

- [ ] Applicable Copilot findings are resolved, or an exact-head unavailable marker records that a normal request produced no review.
- [ ] An independent adversarial review covered the material risks, with a privacy-safe exact-head attestation recorded as described in `docs/delivery-harness.md`.
- [ ] The branch is rebased on its current declared base (`main`, or the lower layer of an intentional stack) and will use rebase integration.

## Human decisions requested

<!-- List scope, classification, interpretation, or promotion decisions. Write “None” only for mechanical changes. -->
