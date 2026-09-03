# Generated import artifacts

Run `node scripts/import-content.mjs` from the repository root. It writes:

- `content/import.json`: lossless matrix prose and reading-list candidates.
- `reports/import-report.json`: counts and all mappings still requiring review.

Files are deterministic and contain no run timestamps. Edit
`content/import-overrides/overrides.json`, never these generated files.
