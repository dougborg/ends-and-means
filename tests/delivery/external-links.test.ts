import { describe, expect, it, vi } from "vitest";
import { canonicalDocuments } from "../../content/domain";
import {
  checkExternalLinks,
  extractExternalLinkInventory,
  renderExternalLinkMarkdown,
  summarizeExternalLinkChecks,
} from "../../scripts/external-links";
import type { AuthoringDocument } from "../../src/lib/domain";

const base = {
  label: "Fixture",
  description: "Synthetic external-link fixture.",
  publicationStatus: "research-needed" as const,
};

const documents: AuthoringDocument[] = [
  {
    documentType: "entity",
    entity: {
      id: "shared-work",
      kind: "work",
      title: "Shared work",
      workType: "article",
      externalRefs: [
        {
          system: "other",
          purpose: "access",
          url: "https://example.test/shared",
          checkedAt: "2026-01-01",
        },
      ],
      ...base,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "shared-source",
      kind: "source",
      title: "Shared source",
      sourceType: "article",
      resourceLinks: [
        {
          purpose: "publisher",
          url: "https://example.test/shared",
          label: "Publisher",
        },
      ],
      ...base,
    },
  },
];

const response = (status: number, url: string, redirected = false) =>
  ({ status, url, redirected }) as Response;

describe("canonical external-link inventory", () => {
  it("deduplicates requests while preserving every owner and check date", () => {
    const inventory = extractExternalLinkInventory(
      documents,
      new Map([
        ["shared-work", "content/domain/evidence/work.ts"],
        ["shared-source", "content/domain/evidence/source.ts"],
      ]),
      { now: new Date("2026-09-07T00:00:00Z"), staleAfterDays: 180 },
    );
    expect(inventory).toHaveLength(1);
    expect(inventory[0]?.owners).toEqual([
      expect.objectContaining({
        ownerId: "shared-source",
        field: "resourceLinks",
        checkedAt: null,
        freshness: "never-recorded",
        authoringLocation: "content/domain/evidence/source.ts",
      }),
      expect.objectContaining({
        ownerId: "shared-work",
        field: "externalRefs",
        checkedAt: "2026-01-01",
        freshness: "stale-but-unchecked",
      }),
    ]);
  });

  it("fails closed when an owner cannot be traced to its canonical file", () => {
    expect(() => extractExternalLinkInventory(documents, new Map())).toThrow(
      "shared-work: canonical authoring location is unavailable",
    );
  });

  it("points generated orientation references to their actual authoring ledger", () => {
    const inventory = extractExternalLinkInventory(
      documents,
      new Map([
        ["shared-work", "content/domain/evidence/work.ts"],
        ["shared-source", "content/domain/evidence/source.ts"],
      ]),
      {
        externalReferenceLocations: new Map([
          ["shared-work", "src/lib/domain/orientation-only-mappings.ts"],
        ]),
      },
    );
    expect(inventory[0]?.owners).toContainEqual(
      expect.objectContaining({
        ownerId: "shared-work",
        authoringLocation: "src/lib/domain/orientation-only-mappings.ts",
      }),
    );
  });

  it("resolves every URL owner in the real canonical corpus", async () => {
    const { discoverCanonicalAuthoringLocations } = await import(
      "../../scripts/external-links"
    );
    const locations = await discoverCanonicalAuthoringLocations(process.cwd());
    const inventory = extractExternalLinkInventory(
      canonicalDocuments,
      locations,
    );
    expect(inventory.length).toBeGreaterThan(0);
    expect(inventory.flatMap(({ owners }) => owners)).not.toContainEqual(
      expect.objectContaining({ authoringLocation: "" }),
    );
  });
});

describe("report-only remote checks", () => {
  const entry = {
    url: "https://example.test/item",
    owners: [
      {
        ownerId: "source",
        ownerKind: "source" as const,
        field: "resourceLinks" as const,
        purpose: "publisher" as const,
        authoringLocation: "content/domain/evidence/source.ts",
        checkedAt: null,
        freshness: "never-recorded" as const,
      },
    ],
  };

  it.each([
    [200, "reachable"],
    [404, "client-error"],
    [503, "server-error"],
  ] as const)("classifies HTTP %i as %s", async (status, availability) => {
    const checks = await checkExternalLinks([entry], {
      fetch: vi.fn(async () => response(status, entry.url)),
      retries: 0,
    });
    expect(checks[0]).toMatchObject({ availability, status, attempts: 1 });
  });

  it("reports material redirects without rewriting the owner", async () => {
    const checks = await checkExternalLinks([entry], {
      fetch: vi.fn(async () =>
        response(200, "https://publisher.test/replacement", true),
      ),
    });
    expect(checks[0]).toMatchObject({
      availability: "material-redirect",
      destination: "https://publisher.test/replacement",
      editorialReview: ["redirect"],
    });
    expect(entry.url).toBe("https://example.test/item");
  });

  it("retries one transient response but not client errors", async () => {
    const fetcher = vi
      .fn<typeof fetch>()
      .mockResolvedValueOnce(response(503, entry.url))
      .mockResolvedValueOnce(response(200, entry.url));
    const sleep = vi.fn(async () => undefined);
    const [check] = await checkExternalLinks([entry], {
      fetch: fetcher,
      retries: 1,
      retryDelayMs: 10,
      sleep,
    });
    expect(check).toMatchObject({ availability: "reachable", attempts: 2 });
    expect(fetcher).toHaveBeenCalledTimes(2);
    expect(sleep).toHaveBeenCalledWith(10);
  });
});

describe("bounded and interpretable external-link reporting", () => {
  const entry = {
    url: "https://example.test/item",
    owners: [
      {
        ownerId: "source",
        ownerKind: "source" as const,
        field: "resourceLinks" as const,
        purpose: "publisher" as const,
        authoringLocation: "content/domain/evidence/source.ts",
        checkedAt: null,
        freshness: "never-recorded" as const,
      },
    ],
  };

  it("classifies a bounded abort as a network failure", async () => {
    vi.useFakeTimers();
    const fetcher = vi.fn<typeof fetch>(
      (_url, init) =>
        new Promise((_resolve, reject) => {
          init?.signal?.addEventListener("abort", () =>
            reject(new DOMException("Timed out", "AbortError")),
          );
        }),
    );
    const pending = checkExternalLinks([entry], {
      fetch: fetcher,
      retries: 0,
      timeoutMs: 100,
    });
    await vi.advanceTimersByTimeAsync(100);
    expect(await pending).toEqual([
      expect.objectContaining({
        availability: "timeout-network-failure",
        attempts: 1,
      }),
    ]);
    vi.useRealTimers();
  });

  it("keeps provider-constrained targets for manual review", async () => {
    const fetcher = vi.fn<typeof fetch>();
    const checks = await checkExternalLinks(
      [{ ...entry, url: "https://manual.test/item" }],
      { fetch: fetcher, manualHosts: new Set(["manual.test"]) },
    );
    expect(checks[0]).toMatchObject({
      availability: "unsupported-manual-check",
      attempts: 0,
    });
    expect(fetcher).not.toHaveBeenCalled();
  });
});

describe("request etiquette", () => {
  it("uses a stable identity and falls back from unsupported HEAD to a ranged GET", async () => {
    const entry = {
      url: "https://example.test/item",
      owners: [],
    };
    const fetcher = vi
      .fn<typeof fetch>()
      .mockResolvedValueOnce(response(405, entry.url))
      .mockResolvedValueOnce(response(206, entry.url));
    const checks = await checkExternalLinks([entry], { fetch: fetcher });
    expect(checks[0]?.availability).toBe("reachable");
    expect(fetcher).toHaveBeenNthCalledWith(
      1,
      entry.url,
      expect.objectContaining({
        method: "HEAD",
        headers: expect.objectContaining({
          "user-agent": expect.stringContaining("EndsAndMeans-LinkAudit"),
        }),
      }),
    );
    expect(fetcher).toHaveBeenNthCalledWith(
      2,
      entry.url,
      expect.objectContaining({
        method: "GET",
        headers: expect.objectContaining({ range: "bytes=0-0" }),
      }),
    );
  });
});

describe("provider restraint and report semantics", () => {
  const entry = {
    url: "https://example.test/item",
    owners: [
      {
        ownerId: "source",
        ownerKind: "source" as const,
        field: "resourceLinks" as const,
        purpose: "publisher" as const,
        authoringLocation: "content/domain/evidence/source.ts",
        checkedAt: null,
        freshness: "never-recorded" as const,
      },
    ],
  };

  it("marks a missing manifestation as an archive candidate for editorial review", async () => {
    const checks = await checkExternalLinks([entry], {
      fetch: vi.fn(async () => response(410, entry.url)),
      retries: 0,
    });
    expect(checks[0]).toMatchObject({
      availability: "client-error",
      editorialReview: ["archive-candidate"],
    });
    expect(renderExternalLinkMarkdown(checks)).toContain(
      "do not capture or rewrite automatically",
    );
  });

  it("serializes requests to one provider", async () => {
    let sameHostActive = 0;
    let sameHostMaximum = 0;
    const fetcher = vi.fn<typeof fetch>(async (input) => {
      const url = String(input);
      if (new URL(url).hostname === "example.test") {
        sameHostActive += 1;
        sameHostMaximum = Math.max(sameHostMaximum, sameHostActive);
        await Promise.resolve();
        sameHostActive -= 1;
      }
      return response(200, url);
    });
    await checkExternalLinks(
      [entry, { ...entry, url: "https://example.test/second" }],
      { fetch: fetcher, concurrency: 2 },
    );
    expect(sameHostMaximum).toBe(1);
    expect(fetcher).toHaveBeenCalledTimes(2);
  });

  it("bounds cross-provider concurrency and stops hammering a failing provider", async () => {
    let active = 0;
    let maximum = 0;
    const fetcher = vi.fn<typeof fetch>(async (input) => {
      active += 1;
      maximum = Math.max(maximum, active);
      await new Promise((resolve) => setTimeout(resolve, 1));
      active -= 1;
      return response(503, String(input));
    });
    const checks = await checkExternalLinks(
      [
        entry,
        { ...entry, url: "https://example.test/second" },
        { ...entry, url: "https://example.test/third" },
        { ...entry, url: "https://another.test/item" },
      ],
      {
        fetch: fetcher,
        concurrency: 2,
        retries: 0,
        providerFailureLimit: 2,
      },
    );
    expect(maximum).toBe(2);
    expect(fetcher).toHaveBeenCalledTimes(3);
    expect(checks[2]).toMatchObject({
      availability: "timeout-network-failure",
      attempts: 0,
    });
  });

  it("produces human and machine summaries without claiming source validity", async () => {
    const checks = await checkExternalLinks([entry], {
      fetch: vi.fn(async () => response(200, entry.url)),
    });
    expect(summarizeExternalLinkChecks(checks)).toMatchObject({
      uniqueUrls: 1,
      ownerRecords: 1,
      staleOwners: 1,
    });
    const markdown = renderExternalLinkMarkdown(checks);
    expect(markdown).toContain(
      "does not establish bibliographic identity, source reliability, or support for a claim",
    );
    expect(markdown).toContain("never recorded");
  });
});
