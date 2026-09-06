import { describe, expect, it } from "vitest";
import { validateAuthoringDocuments } from "../../src/lib/domain";
import type { AuthoringDocument } from "../../src/lib/domain";

const base = { label: "Example", description: "External-reference fixture.", publicationStatus: "research-needed" as const };

describe("external references", () => {
  it("accepts reviewed orientation and identity forms", () => {
    const documents: AuthoringDocument[] = [{ documentType: "entity", entity: { id: "example", kind: "concept-scheme", scope: "Fixture.", externalRefs: [
      { system: "wikipedia", url: "https://en.wikipedia.org/wiki/Example", purpose: "orientation", language: "en", checkedAt: "2026-09-04" },
      { system: "wikidata", id: "Q123", url: "https://www.wikidata.org/wiki/Q123", purpose: "identity", match: "exact", checkedAt: "2026-09-04" },
    ], ...base } }];
    expect(validateAuthoringDocuments(documents)).toEqual([]);
  });

  it("rejects malformed roles, URLs, dates, and duplicate identities", () => {
    const documents: AuthoringDocument[] = [
      { documentType: "entity", entity: { id: "first", kind: "concept-scheme", scope: "Fixture.", externalRefs: [
        { system: "wikipedia", url: "https://fr.wikipedia.org/wiki/Example", purpose: "evidence", language: "en", checkedAt: "not-a-date" },
        { system: "wikidata", id: "123", url: "https://wikidata.org/wiki/Q123", purpose: "orientation", checkedAt: "2026-09-04" },
      ], ...base } },
      { documentType: "entity", entity: { id: "second", kind: "concept-scheme", scope: "Fixture.", externalRefs: [
        { system: "wikidata", id: "123", url: "https://www.wikidata.org/wiki/123", purpose: "identity", match: "close", checkedAt: "2026-09-04" },
      ], ...base } },
    ];
    const errors = validateAuthoringDocuments(documents);
    expect(errors).toContain("first: Wikipedia references must be orientation links");
    expect(errors).toContain("first: Wikipedia reference 0 does not match its language and canonical article form");
    expect(errors).toContain("first: external reference 0 checkedAt requires an ISO calendar date");
    expect(errors).toContain("first: Wikidata references require a QID");
    expect(errors).toContain("first: Wikidata references must be identity links");
    expect(errors).toContain("first: Wikidata references require exact or close match confidence");
    expect(errors).toContain("first: Wikidata reference 1 requires the canonical host");
    expect(errors.some((error) => error.includes("external identity wikidata:undefined"))).toBe(false);
    expect(errors.some((error) => error.includes("external identity wikidata:123"))).toBe(false);
  });

  it("rejects redirects, disambiguation forms, and noncanonical identity URLs", () => {
    const documents: AuthoringDocument[] = [{ documentType: "entity", entity: {
      id: "example", kind: "concept-scheme", scope: "Fixture.", externalRefs: [
        { system: "wikipedia", url: "https://en.wikipedia.org/wiki/Example_(disambiguation)", purpose: "orientation", language: "en", checkedAt: "2026-09-06" },
        { system: "wikipedia", url: "https://en.wikipedia.org/wiki/Example?redirect=no", purpose: "orientation", language: "en", checkedAt: "2026-09-06" },
        { system: "wikipedia", url: "https://en.wikipedia.org/wiki/Special:Search", purpose: "orientation", language: "en", checkedAt: "2026-09-06" },
        { system: "wikipedia", url: "https://en.wikipedia.org/wiki/Category:Examples", purpose: "orientation", language: "en", checkedAt: "2026-09-06" },
        { system: "wikidata", id: "Q123", url: "https://www.wikidata.org/wiki/Q123#claims", purpose: "identity", match: "close", checkedAt: "2026-09-06" },
      ], ...base,
    } }];
    const errors = validateAuthoringDocuments(documents);
    expect(errors.filter((error) => error.includes("canonical article form"))).toHaveLength(4);
    expect(errors).toContain("example: Wikidata reference 4 requires the canonical host");
  });

  it("rejects duplicate well-formed external identities", () => {
    const documents: AuthoringDocument[] = ["first", "second"].map((id) => ({ documentType: "entity", entity: {
      id, kind: "concept-scheme", scope: "Fixture.", externalRefs: [
        { system: "wikidata", id: "Q123", url: "https://www.wikidata.org/wiki/Q123", purpose: "identity", match: "exact", checkedAt: "2026-09-04" },
      ], ...base,
    } }));
    expect(validateAuthoringDocuments(documents)).toContain("second: external identity wikidata:Q123 already maps to first");
  });
});
