# External link monitoring

Canonical `externalRefs` and Source `resourceLinks` are the only URL inventory.
No parallel hand-authored link list is maintained.

Run the report locally with:

```sh
pnpm audit:external-links
```

The command writes JSON and Markdown reports under
`.artifacts/external-links/`.
It groups a shared URL into one respectful remote request while retaining every
owner ID and kind, field purpose, canonical authoring file, and recorded access
date.

The scheduled and manual GitHub workflow has read-only repository permission,
uses bounded concurrency, a ten-second request timeout, and one limited retry
for transient failures.
Requests to the same host are serialized, and a provider circuit breaker stops
that host's queue after three consecutive server, network, or rate-limit
failures while preserving
the remaining URLs as later-run signals.
The checker rejects credentialed URLs, localhost, and private, link-local,
unspecified, documentation, reserved, or multicast IP ranges.
It resolves and pins a public address immediately before each request, follows
redirects manually, and repeats the same validation at every hop so a redirect
or DNS change cannot reach internal infrastructure.
It publishes a readable job summary and a machine-readable artifact.
Remote results are report-only and do not run in pull-request or deployment
verification.

## Interpreting the report

`reachable` means only that a remote server responded.
It does not confirm bibliographic identity, source reliability, evidentiary
support, completeness, or permission to redistribute material.
Client errors, server errors, rate limits, unresolved redirects, unsafe targets,
and timeout or network failures likewise describe access, not scholarly
validity.

A material redirect changes the protocol, host, or path and requires editorial
review.
Never rewrite canonical records from the report.
Some providers or protocols require manual checks to avoid inappropriate
automated traffic.
Missing or old `checkedAt` metadata remains visible as never recorded or stale;
an automated request never manufactures a human access date.

## Remediation and archives

Confirm a persistent result across time and inspect the destination before
changing a record.
An editor decides whether to update a redirected URL, retain an unavailable
manifestation with context, supplement it, or remove it.
Prefer publisher permalinks and lawful archived snapshots.
Never bypass access controls or automatically archive copyrighted, paywalled,
restricted, personal, or community-controlled material.
An archive candidate is a review prompt, not permission to capture or publish.

Provider throttling, authentication walls, bot defenses, regional behavior,
and intermittent outages can all create false positives.
Escalate repeated failures with the affected owners and authoring files from the
report rather than treating a single run as a content defect.
