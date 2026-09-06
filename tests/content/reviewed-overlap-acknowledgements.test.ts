import { describe, expect, it } from "vitest";
import {
  type NarrativeOverlapSignal,
  overlapTarget,
  type ReviewedOverlapAcknowledgement,
  resolveReviewedOverlapAcknowledgements,
  reviewedOverlapFingerprint,
} from "../../src/lib/domain/reviewed-overlaps";

const passage = {
  dossierId: "fixture-dossier",
  passageId: "answer",
  text: "Workers inspect public accounts before delegates decide.",
};
const statement = {
  id: "fixture-statement",
  text: "Workers inspect public accounts before delegates decide.",
};
const citation = {
  id: "fixture-citation",
  predicate: "cites" as const,
  subject: { kind: "statement" as const, id: statement.id },
  object: { kind: "source" as const, id: "fixture-source" },
  role: "supports" as const,
  locator: "p. 1",
  note: "Exact fixture passage.",
};
const source = {
  id: "fixture-source",
  kind: "source" as const,
  label: "Fixture source",
  description: "Synthetic fixture.",
  publicationStatus: "reviewed" as const,
  sourceType: "report" as const,
  title: "Fixture report",
  workId: "fixture-work",
  contributorDisplay: ["A. Researcher"],
  publisher: "Fixture press",
  publicationYear: 2026,
  identifiers: { doi: "10.0000/fixture" },
  externalRefs: [
    {
      system: "doi" as const,
      id: "10.0000/fixture",
      url: "https://doi.org/10.0000/fixture",
      purpose: "evidence" as const,
      checkedAt: "2026-09-05",
    },
  ],
  resourceLinks: [
    {
      purpose: "publisher" as const,
      url: "https://example.test/publisher",
      label: "Publisher page",
    },
  ],
};

function fingerprint(
  overrides: Partial<Parameters<typeof reviewedOverlapFingerprint>[0]> = {},
) {
  return reviewedOverlapFingerprint({
    passage,
    statement,
    citation,
    source,
    ...overrides,
  });
}

function signal(overrides: Partial<NarrativeOverlapSignal> = {}) {
  return {
    location: "concept:fixture#answer",
    dossierId: passage.dossierId,
    passageId: passage.passageId,
    statementId: statement.id,
    citationId: citation.id,
    sourceId: source.id,
    score: 1,
    fingerprint: fingerprint(),
    ...overrides,
  } satisfies NarrativeOverlapSignal;
}

function acknowledgement(
  overrides: Partial<ReviewedOverlapAcknowledgement> = {},
) {
  return {
    schemaVersion: "reviewed-overlap-1",
    fingerprint: fingerprint(),
    passage: { dossierId: passage.dossierId, passageId: passage.passageId },
    statementId: statement.id,
    citationId: citation.id,
    reviewer: "Fixture reviewer",
    reviewedAt: "2026-09-05",
    rationale: "The actual cited page was inspected.",
    disposition: "acknowledged-synthesis",
    ...overrides,
  } satisfies ReviewedOverlapAcknowledgement;
}

describe("reviewed overlap fingerprints", () => {
  it("governs every narrative, Statement, citation, and Source input", () => {
    const mutations = [
      fingerprint({ passage: { ...passage, dossierId: "changed" } }),
      fingerprint({ passage: { ...passage, passageId: "changed" } }),
      fingerprint({ passage: { ...passage, text: "Changed narrative." } }),
      fingerprint({ statement: { ...statement, id: "changed" } }),
      fingerprint({ statement: { ...statement, text: "Changed claim." } }),
      fingerprint({ citation: { ...citation, id: "changed" } }),
      fingerprint({ citation: { ...citation, locator: "p. 2" } }),
      fingerprint({ citation: { ...citation, role: "qualifies" } }),
      fingerprint({ citation: { ...citation, note: "Changed note." } }),
      fingerprint({
        citation: {
          ...citation,
          subject: { ...citation.subject, id: "changed-statement" },
        },
      }),
      fingerprint({
        citation: {
          ...citation,
          object: { ...citation.object, id: "changed-source" },
        },
      }),
      fingerprint({ source: { ...source, id: "changed-source" } }),
      fingerprint({ source: { ...source, label: "Changed label" } }),
      fingerprint({
        source: { ...source, description: "Changed description." },
      }),
      fingerprint({
        source: { ...source, publicationStatus: "published" },
      }),
      fingerprint({ source: { ...source, sourceType: "article" } }),
      fingerprint({ source: { ...source, title: "Changed title" } }),
      fingerprint({ source: { ...source, workId: "changed-work" } }),
      fingerprint({ source: { ...source, publisher: "Changed press" } }),
      fingerprint({ source: { ...source, publicationYear: 2025 } }),
      fingerprint({
        source: { ...source, contributorDisplay: ["B. Researcher"] },
      }),
      fingerprint({
        source: { ...source, identifiers: { doi: "10.0000/changed" } },
      }),
      fingerprint({
        source: {
          ...source,
          externalRefs: [
            {
              system: "doi",
              id: "10.0000/fixture",
              url: "https://doi.org/10.0000/fixture",
              purpose: "evidence",
              checkedAt: "2026-09-06",
            },
          ],
        },
      }),
      fingerprint({
        source: {
          ...source,
          resourceLinks: [
            {
              purpose: "publisher",
              url: "https://example.test/changed-link",
              label: "Publisher page",
            },
          ],
        },
      }),
    ];
    expect(new Set(mutations)).toHaveLength(mutations.length);
    expect(mutations).not.toContain(fingerprint());
    for (const changedFingerprint of mutations) {
      const changedSignal = signal({ fingerprint: changedFingerprint });
      const result = resolveReviewedOverlapAcknowledgements(
        [acknowledgement()],
        [changedSignal],
      );
      expect(result.openSignals).toEqual([changedSignal]);
      expect(result.acknowledgedSignals).toEqual([]);
      expect(result.errors).toEqual([
        expect.stringContaining(
          "governed narrative, Statement, citation, or Source input changed",
        ),
      ]);
    }
    const statementWithDisplayMetadata = {
      ...statement,
      label: "Non-governed display metadata",
    };
    expect(fingerprint({ statement: statementWithDisplayMetadata })).toBe(
      fingerprint(),
    );
  });
});

describe("reviewed overlap resolution", () => {
  it("recognizes unchanged reviewed input", () => {
    const result = resolveReviewedOverlapAcknowledgements(
      [acknowledgement()],
      [signal()],
    );
    expect(result).toMatchObject({
      errors: [],
      openSignals: [],
      acknowledgedSignals: [signal()],
    });
  });

  it("reopens a signal when its governed fingerprint changes", () => {
    const current = signal({
      fingerprint: fingerprint({ source: { ...source, title: "Changed" } }),
    });
    const result = resolveReviewedOverlapAcknowledgements(
      [acknowledgement()],
      [current],
    );
    expect(result.openSignals).toEqual([current]);
    expect(result.acknowledgedSignals).toEqual([]);
    expect(result.errors).toEqual([
      expect.stringContaining(
        "governed narrative, Statement, citation, or Source input changed",
      ),
    ]);
  });

  it("fails closed for stale, missing, malformed, and duplicate records", () => {
    const current = signal({
      fingerprint: fingerprint({ source: { ...source, title: "Changed" } }),
    });
    const duplicate = acknowledgement();
    const result = resolveReviewedOverlapAcknowledgements(
      [
        acknowledgement({ fingerprint: `sha256:${"0".repeat(64)}` }),
        { ...duplicate, rationale: "Second review." },
        { ...duplicate, rationale: "Third review." },
        { ...duplicate, citationId: "missing-citation" },
        { ...duplicate, reviewer: "" },
      ],
      [current],
    );
    expect(result.openSignals).toEqual([current]);
    expect(result.acknowledgedSignals).toEqual([]);
    expect(result.errors).toEqual([...result.errors].sort());
    expect(result.errors.join("\n")).toMatch(/duplicate|invalidated|reviewer/u);
  });

  it("sorts targets with stable code-unit keys", () => {
    expect(overlapTarget(acknowledgement())).toBe(
      "fixture-dossier#answer|fixture-statement|fixture-citation",
    );
  });

  it("reports the same errors when acknowledgement input is permuted", () => {
    const values = [
      acknowledgement({ reviewer: "" }),
      acknowledgement({ reviewedAt: "not-a-date" }),
      acknowledgement({ citationId: "missing" }),
    ];
    const forward = resolveReviewedOverlapAcknowledgements(values, [signal()]);
    const reverse = resolveReviewedOverlapAcknowledgements(
      values.toReversed(),
      [signal()],
    );
    expect(reverse).toEqual(forward);
  });

  it("handles unsupported malformed values without throwing", () => {
    const values = [undefined, Symbol("invalid"), () => "invalid"];
    expect(() =>
      resolveReviewedOverlapAcknowledgements(values, [signal()]),
    ).not.toThrow();
    expect(
      resolveReviewedOverlapAcknowledgements(values, [signal()]).openSignals,
    ).toEqual([signal()]);
  });
});
