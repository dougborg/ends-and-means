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

const response = (
  status: number,
  url: string,
  headers: Record<string, string> = {},
) => ({ status, url, headers: new Headers(headers), body: null }) as Response;

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
    const fetcher = vi
      .fn<typeof fetch>()
      .mockResolvedValueOnce(
        response(301, entry.url, {
          location: "https://publisher.test/replacement",
        }),
      )
      .mockResolvedValueOnce(
        response(200, "https://publisher.test/replacement"),
      );
    const checks = await checkExternalLinks([entry], {
      fetch: fetcher,
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

describe("redirect and provider responses", () => {
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

  it("preserves rate limiting as a transient provider failure and honors bounded Retry-After", async () => {
    const fetcher = vi.fn(async () =>
      response(429, entry.url, { "retry-after": "30" }),
    );
    const sleep = vi.fn(async () => undefined);
    const checks = await checkExternalLinks(
      [entry, { ...entry, url: "https://example.test/second" }],
      {
        fetch: fetcher,
        retries: 1,
        sleep,
        providerFailureLimit: 1,
      },
    );
    expect(checks[0]).toMatchObject({
      availability: "rate-limited",
      attempts: 2,
    });
    expect(checks[1]).toMatchObject({ attempts: 0 });
    expect(sleep).toHaveBeenCalledWith(5_000);
  });

  it("reports a redirect without a destination instead of treating it as reachable", async () => {
    const checks = await checkExternalLinks([entry], {
      fetch: vi.fn(async () => response(302, entry.url)),
    });
    expect(checks[0]).toMatchObject({
      availability: "unfollowable-redirect",
      editorialReview: ["redirect"],
    });
  });

  it("follows a non-material query redirect", async () => {
    const destination = `${entry.url}?view=full`;
    const fetcher = vi
      .fn<typeof fetch>()
      .mockResolvedValueOnce(
        response(302, entry.url, { location: destination }),
      )
      .mockResolvedValueOnce(response(200, destination));
    const checks = await checkExternalLinks([entry], { fetch: fetcher });
    expect(checks[0]).toMatchObject({
      availability: "reachable",
      destination,
    });
  });
});

describe("SSRF boundary", () => {
  const entry = { url: "https://public.test/item", owners: [] };
  const publicAddress = async () => [
    { address: "8.8.8.8", family: 4 as const },
  ];

  it.each([
    "http://127.0.0.1/item",
    "http://169.254.169.254/latest/meta-data",
    "http://10.0.0.1/item",
    "http://[::1]/item",
    "http://[fe80::1]/item",
    "http://[::ffff:127.0.0.1]/item",
    "https://user:secret@public.test/item",
  ])("rejects unsafe literal or credentialed target %s", async (url) => {
    const fetcher = vi.fn<typeof fetch>();
    const checks = await checkExternalLinks([{ ...entry, url }], {
      fetch: fetcher,
      resolveHost: publicAddress,
      retries: 0,
    });
    expect(checks[0]?.availability).toBe("unsafe-target");
    expect(fetcher).not.toHaveBeenCalled();
  });

  it("rejects a hostname when any answer is private", async () => {
    const fetcher = vi.fn<typeof fetch>();
    const checks = await checkExternalLinks([entry], {
      fetch: fetcher,
      resolveHost: async () => [
        { address: "8.8.8.8", family: 4 },
        { address: "192.168.1.1", family: 4 },
      ],
      retries: 0,
    });
    expect(checks[0]?.availability).toBe("unsafe-target");
    expect(fetcher).not.toHaveBeenCalled();
  });

  it("resolves and validates every redirect hop immediately before fetching it", async () => {
    const fetcher = vi
      .fn<typeof fetch>()
      .mockResolvedValueOnce(
        response(302, entry.url, { location: "https://private.test/item" }),
      );
    const resolver = vi.fn(async (hostname: string) => [
      {
        address: hostname === "private.test" ? "10.0.0.7" : "8.8.8.8",
        family: 4 as const,
      },
    ]);
    const checks = await checkExternalLinks([entry], {
      fetch: fetcher,
      resolveHost: resolver,
      retries: 0,
    });
    expect(checks[0]?.availability).toBe("unsafe-target");
    expect(resolver).toHaveBeenCalledTimes(2);
    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  it("revalidates DNS on retry and stops if a later answer becomes private", async () => {
    const fetcher = vi.fn(async () => response(503, entry.url));
    const resolver = vi
      .fn()
      .mockResolvedValueOnce([{ address: "8.8.8.8", family: 4 as const }])
      .mockResolvedValueOnce([{ address: "127.0.0.1", family: 4 as const }]);
    const checks = await checkExternalLinks([entry], {
      fetch: fetcher,
      resolveHost: resolver,
      retries: 1,
      sleep: async () => undefined,
    });
    expect(checks[0]?.availability).toBe("unsafe-target");
    expect(resolver).toHaveBeenCalledTimes(2);
    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  it("permits a public IPv6 answer", async () => {
    const fetcher = vi.fn(async () => response(200, entry.url));
    const checks = await checkExternalLinks([entry], {
      fetch: fetcher,
      resolveHost: async () => [{ address: "2606:4700:4700::1111", family: 6 }],
      retries: 0,
    });
    expect(checks[0]?.availability).toBe("reachable");
    expect(fetcher).toHaveBeenCalledOnce();
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
