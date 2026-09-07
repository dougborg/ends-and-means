import { readdir } from "node:fs/promises";
import { relative, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import type {
  AuthoringDocument,
  DomainEntity,
  ExternalReference,
  ResourceLink,
} from "../src/lib/domain";

export type LinkField = "externalRefs" | "resourceLinks";
export type LinkFreshness =
  | "current"
  | "stale-but-unchecked"
  | "never-recorded";
export type LinkAvailability =
  | "reachable"
  | "material-redirect"
  | "client-error"
  | "server-error"
  | "timeout-network-failure"
  | "unsupported-manual-check";

export interface ExternalLinkOwner {
  ownerId: string;
  ownerKind: DomainEntity["kind"];
  field: LinkField;
  purpose: ExternalReference["purpose"] | ResourceLink["purpose"];
  authoringLocation: string;
  checkedAt: string | null;
  freshness: LinkFreshness;
}

export interface ExternalLinkInventoryEntry {
  url: string;
  owners: ExternalLinkOwner[];
}

export interface ExternalLinkCheck extends ExternalLinkInventoryEntry {
  availability: LinkAvailability;
  status: number | null;
  destination: string | null;
  attempts: number;
  detail: string;
  editorialReview: Array<"redirect" | "archive-candidate">;
}

export interface CheckOptions {
  fetch?: typeof fetch;
  now?: Date;
  staleAfterDays?: number;
  concurrency?: number;
  timeoutMs?: number;
  retries?: number;
  retryDelayMs?: number;
  sleep?: (milliseconds: number) => Promise<void>;
  manualHosts?: ReadonlySet<string>;
  providerFailureLimit?: number;
}

export interface InventoryOptions {
  now?: Date;
  staleAfterDays?: number;
  externalReferenceLocations?: ReadonlyMap<string, string>;
}

const defaultManualHosts = new Set(["books.google.com"]);
const userAgent =
  "EndsAndMeans-LinkAudit/1.0 (+https://github.com/dougborg/ends-and-means)";

function compare(left: string, right: string) {
  return left < right ? -1 : left > right ? 1 : 0;
}

function freshness(
  checkedAt: string | undefined,
  now: Date,
  staleAfterDays: number,
): LinkFreshness {
  if (!checkedAt) return "never-recorded";
  const age = now.getTime() - Date.parse(`${checkedAt}T00:00:00Z`);
  return age > staleAfterDays * 86_400_000 ? "stale-but-unchecked" : "current";
}

export function extractExternalLinkInventory(
  documents: AuthoringDocument[],
  authoringLocations: ReadonlyMap<string, string>,
  options: InventoryOptions = {},
) {
  const now = options.now ?? new Date();
  const staleAfterDays = options.staleAfterDays ?? 180;
  const byUrl = new Map<string, ExternalLinkOwner[]>();
  for (const document of documents.filter(
    (candidate) => candidate.documentType === "entity",
  )) {
    if (document.documentType !== "entity") throw new Error("unreachable");
    const entity = document.entity;
    const authoringLocation = authoringLocations.get(entity.id);
    if (!authoringLocation)
      throw new Error(
        `${entity.id}: canonical authoring location is unavailable`,
      );
    const add = (field: LinkField, link: ExternalReference | ResourceLink) => {
      const owners = byUrl.get(link.url) ?? [];
      owners.push({
        ownerId: entity.id,
        ownerKind: entity.kind,
        field,
        purpose: link.purpose,
        authoringLocation:
          field === "externalRefs"
            ? (options.externalReferenceLocations?.get(entity.id) ??
              authoringLocation)
            : authoringLocation,
        checkedAt: link.checkedAt ?? null,
        freshness: freshness(link.checkedAt, now, staleAfterDays),
      });
      byUrl.set(link.url, owners);
    };
    entity.externalRefs?.forEach((link) => {
      add("externalRefs", link);
    });
    if (entity.kind === "source")
      entity.resourceLinks?.forEach((link) => {
        add("resourceLinks", link);
      });
  }
  return [...byUrl]
    .sort(([left], [right]) => compare(left, right))
    .map(([url, owners]) => ({
      url,
      owners: owners.toSorted((left, right) =>
        compare(
          `${left.ownerKind}:${left.ownerId}:${left.field}:${left.purpose}`,
          `${right.ownerKind}:${right.ownerId}:${right.field}:${right.purpose}`,
        ),
      ),
    }));
}

async function walk(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const paths = await Promise.all(
    entries.map((entry) => {
      const pathname = resolve(directory, entry.name);
      return entry.isDirectory() ? walk(pathname) : [pathname];
    }),
  );
  return paths.flat().sort(compare);
}

function isAuthoringDocument(value: unknown): value is AuthoringDocument {
  return Boolean(
    value &&
      typeof value === "object" &&
      "documentType" in value &&
      ["entity", "relationships", "subject-guide"].includes(
        String((value as { documentType: unknown }).documentType),
      ),
  );
}

function collectModuleLocations(
  module: Record<string, unknown>,
  location: string,
  locations: Map<string, string>,
) {
  const documents = Object.values(module)
    .filter(Array.isArray)
    .flat()
    .filter(isAuthoringDocument);
  for (const document of documents) {
    if (document.documentType !== "entity") continue;
    const existing = locations.get(document.entity.id);
    if (existing && existing !== location)
      throw new Error(
        `${document.entity.id}: multiple authoring locations (${existing}, ${location})`,
      );
    locations.set(document.entity.id, location);
  }
}

export async function discoverCanonicalAuthoringLocations(root: string) {
  const domainRoot = resolve(root, "content/domain");
  const files = (await walk(domainRoot)).filter(
    (path) => path.endsWith(".ts") && path !== resolve(domainRoot, "index.ts"),
  );
  const locations = new Map<string, string>();
  for (const file of files) {
    const module = (await import(pathToFileURL(file).href)) as Record<
      string,
      unknown
    >;
    collectModuleLocations(
      module,
      relative(root, file).replaceAll("\\", "/"),
      locations,
    );
  }
  return locations;
}

function isRetryableStatus(status: number) {
  return status === 429 || status >= 500;
}

function isMaterialRedirect(from: string, to: string) {
  const source = new URL(from);
  const destination = new URL(to);
  return (
    source.protocol !== destination.protocol ||
    source.hostname !== destination.hostname ||
    source.pathname !== destination.pathname
  );
}

async function request(url: string, fetcher: typeof fetch, timeoutMs: number) {
  const requestWithMethod = async (method: "HEAD" | "GET") => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetcher(url, {
        method,
        redirect: "follow",
        signal: controller.signal,
        headers: {
          "user-agent": userAgent,
          ...(method === "GET" ? { range: "bytes=0-0" } : {}),
        },
      });
      if (method === "GET") await response.body?.cancel();
      return response;
    } finally {
      clearTimeout(timeout);
    }
  };
  const head = await requestWithMethod("HEAD");
  return [405, 501].includes(head.status) ? requestWithMethod("GET") : head;
}

function manualCheck(
  entry: ExternalLinkInventoryEntry,
  manualHosts: ReadonlySet<string>,
): ExternalLinkCheck | undefined {
  let parsed: URL;
  try {
    parsed = new URL(entry.url);
  } catch {
    return {
      ...entry,
      availability: "unsupported-manual-check",
      status: null,
      destination: null,
      attempts: 0,
      detail:
        "Malformed URL; canonical validation must be repaired before remote checking.",
      editorialReview: [],
    };
  }
  if (
    ["http:", "https:"].includes(parsed.protocol) &&
    !manualHosts.has(parsed.hostname)
  )
    return undefined;
  return {
    ...entry,
    availability: "unsupported-manual-check",
    status: null,
    destination: null,
    attempts: 0,
    detail: "Provider or protocol requires respectful manual review.",
    editorialReview: [],
  };
}

function classifyResponse(
  entry: ExternalLinkInventoryEntry,
  response: Response,
  attempt: number,
): ExternalLinkCheck {
  const destination = response.url || entry.url;
  if (response.redirected && isMaterialRedirect(entry.url, destination))
    return {
      ...entry,
      availability: "material-redirect",
      status: response.status,
      destination,
      attempts: attempt,
      detail: "Destination changed materially; editorial review is required.",
      editorialReview: ["redirect"],
    };
  const availability: LinkAvailability =
    response.status >= 500
      ? "server-error"
      : response.status >= 400
        ? "client-error"
        : "reachable";
  return {
    ...entry,
    availability,
    status: response.status,
    destination,
    attempts: attempt,
    detail:
      availability === "reachable"
        ? "Remote target responded. This does not validate bibliographic or evidentiary fitness."
        : "Remote availability failed; review persistence before changing the canonical record.",
    editorialReview:
      response.status === 404 || response.status === 410
        ? ["archive-candidate"]
        : [],
  };
}

async function checkOne(
  entry: ExternalLinkInventoryEntry,
  options: Required<
    Pick<
      CheckOptions,
      | "fetch"
      | "timeoutMs"
      | "retries"
      | "retryDelayMs"
      | "sleep"
      | "manualHosts"
    >
  >,
): Promise<ExternalLinkCheck> {
  const manual = manualCheck(entry, options.manualHosts);
  if (manual) return manual;

  for (let attempt = 1; attempt <= options.retries + 1; attempt += 1) {
    try {
      const response = await request(
        entry.url,
        options.fetch,
        options.timeoutMs,
      );
      if (isRetryableStatus(response.status) && attempt <= options.retries) {
        await options.sleep(options.retryDelayMs);
        continue;
      }
      return classifyResponse(entry, response, attempt);
    } catch (error) {
      if (attempt <= options.retries) {
        await options.sleep(options.retryDelayMs);
        continue;
      }
      return {
        ...entry,
        availability: "timeout-network-failure",
        status: null,
        destination: null,
        attempts: attempt,
        detail:
          error instanceof Error ? error.message : "Unknown network failure",
        editorialReview: [],
      };
    }
  }
  throw new Error("unreachable retry state");
}

function boundedInteger(
  value: number | undefined,
  fallback: number,
  maximum: number,
) {
  return Number.isFinite(value)
    ? Math.max(0, Math.min(maximum, Math.trunc(value ?? fallback)))
    : fallback;
}

function skippedAfterProviderFailures(
  entry: ExternalLinkInventoryEntry,
): ExternalLinkCheck {
  return {
    ...entry,
    availability: "timeout-network-failure",
    status: null,
    destination: null,
    attempts: 0,
    detail:
      "Skipped after repeated transient failures from this provider; retry on a later run.",
    editorialReview: [],
  };
}

type ResolvedCheckOptions = Required<
  Pick<
    CheckOptions,
    "fetch" | "timeoutMs" | "retries" | "retryDelayMs" | "sleep" | "manualHosts"
  >
>;

async function checkProviderQueue(
  queue: number[],
  inventory: ExternalLinkInventoryEntry[],
  results: ExternalLinkCheck[],
  options: ResolvedCheckOptions,
  failureLimit: number,
) {
  let consecutiveFailures = 0;
  for (const index of queue) {
    const entry = inventory[index];
    if (!entry) continue;
    if (consecutiveFailures >= failureLimit) {
      results[index] = skippedAfterProviderFailures(entry);
      continue;
    }
    const result = await checkOne(entry, options);
    results[index] = result;
    consecutiveFailures = ["server-error", "timeout-network-failure"].includes(
      result.availability,
    )
      ? consecutiveFailures + 1
      : 0;
  }
}

export async function checkExternalLinks(
  inventory: ExternalLinkInventoryEntry[],
  options: CheckOptions = {},
) {
  const concurrency = Math.max(1, boundedInteger(options.concurrency, 6, 16));
  const resolved = {
    fetch: options.fetch ?? fetch,
    timeoutMs: Math.max(100, boundedInteger(options.timeoutMs, 10_000, 60_000)),
    retries: boundedInteger(options.retries, 1, 2),
    retryDelayMs: boundedInteger(options.retryDelayMs, 500, 5_000),
    sleep:
      options.sleep ??
      ((milliseconds: number) =>
        new Promise<void>((resolvePromise) =>
          setTimeout(resolvePromise, milliseconds),
        )),
    manualHosts: options.manualHosts ?? defaultManualHosts,
  };
  const results = new Array<ExternalLinkCheck>(inventory.length);
  const groups = new Map<string, number[]>();
  inventory.forEach((entry, index) => {
    let key = entry.url;
    try {
      key = new URL(entry.url).hostname;
    } catch {
      /* Malformed canonical URLs retain a unique manual-check queue. */
    }
    groups.set(key, [...(groups.get(key) ?? []), index]);
  });
  const queues = [...groups.values()];
  const providerFailureLimit = Math.max(
    1,
    boundedInteger(options.providerFailureLimit, 3, 10),
  );
  let next = 0;
  await Promise.all(
    Array.from({ length: Math.min(concurrency, queues.length) }, async () => {
      while (next < queues.length) {
        const queue = queues[next];
        next += 1;
        if (queue)
          await checkProviderQueue(
            queue,
            inventory,
            results,
            resolved,
            providerFailureLimit,
          );
      }
    }),
  );
  return results;
}

export function summarizeExternalLinkChecks(checks: ExternalLinkCheck[]) {
  const counts = Object.fromEntries(
    [
      "reachable",
      "material-redirect",
      "client-error",
      "server-error",
      "timeout-network-failure",
      "unsupported-manual-check",
    ].map((state) => [
      state,
      checks.filter(({ availability }) => availability === state).length,
    ]),
  );
  const staleOwners = checks
    .flatMap(({ owners }) => owners)
    .filter(({ freshness: state }) => state !== "current").length;
  return {
    uniqueUrls: checks.length,
    ownerRecords: checks.flatMap(({ owners }) => owners).length,
    staleOwners,
    counts,
  };
}

export function renderExternalLinkMarkdown(checks: ExternalLinkCheck[]) {
  const summary = summarizeExternalLinkChecks(checks);
  const lines = [
    "# External link report",
    "",
    `Checked ${summary.uniqueUrls} unique URLs representing ${summary.ownerRecords} canonical owner records.`,
    `Canonical check metadata is stale or unrecorded for ${summary.staleOwners} owner records.`,
    "",
    "Remote reachability is operational evidence only; it does not establish bibliographic identity, source reliability, or support for a claim.",
    "",
    "| Result | Count |",
    "| --- | ---: |",
    ...Object.entries(summary.counts).map(
      ([state, count]) => `| ${state} | ${count} |`,
    ),
    "",
    "## Attention",
    "",
  ];
  const attention = checks.filter(
    ({ availability, owners }) =>
      availability !== "reachable" ||
      owners.some(({ freshness: state }) => state !== "current"),
  );
  if (attention.length === 0) lines.push("No operational attention signals.");
  for (const check of attention) {
    lines.push(`- **${check.availability}** — ${check.url}`);
    if (check.destination && check.destination !== check.url)
      lines.push(`  Destination: ${check.destination}`);
    if (check.editorialReview.includes("archive-candidate"))
      lines.push(
        "  Editorial review: consider whether a lawful archived snapshot is appropriate; do not capture or rewrite automatically.",
      );
    for (const owner of check.owners)
      lines.push(
        `  - ${owner.ownerKind} \`${owner.ownerId}\`: ${owner.field}/${owner.purpose}; ${owner.authoringLocation}; checked ${owner.checkedAt ?? "never recorded"} (${owner.freshness})`,
      );
  }
  return `${lines.join("\n")}\n`;
}
