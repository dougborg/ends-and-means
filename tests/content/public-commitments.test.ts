import { describe, expect, it } from "vitest";
import { citationsFor, entityById } from "../../src/lib/domain/canonical";
import {
  homepageStarts,
  homepageTrace,
  publicCommitments,
} from "../../src/lib/public-commitments";

describe("public commitments", () => {
  it("maps every promise to an executable check and a named human owner", () => {
    expect(publicCommitments.map(({ id }) => id)).toEqual([
      "traceable-evidence",
      "bounded-synthesis",
      "accountable-assistance",
    ]);
    for (const commitment of publicCommitments) {
      expect(commitment.accountability.some(({ kind }) => kind === "check"), commitment.id).toBe(true);
      expect(commitment.accountability.some(({ kind }) => kind === "human-review"), commitment.id).toBe(true);
      for (const responsibility of commitment.accountability) {
        expect(responsibility.owner.length, commitment.id).toBeGreaterThan(3);
        expect(responsibility.evidence.length, commitment.id).toBeGreaterThan(20);
      }
    }
  });

  it("builds the homepage example from a real reviewed evidence trail", () => {
    const statement = entityById(homepageTrace.statementId);
    const obligation = entityById(homepageTrace.obligationId);
    expect(statement).toMatchObject({ kind: "statement", publicationStatus: "reviewed" });
    expect(obligation).toMatchObject({
      kind: "research-obligation",
      obligationStatus: "open",
      publicationStatus: "reviewed",
    });
    if (obligation?.kind !== "research-obligation") throw new Error("Expected research obligation");
    expect(obligation.addressedStatementIds).toContain(homepageTrace.statementId);
    const citations = citationsFor(homepageTrace.statementId);
    expect(citations.length).toBeGreaterThan(0);
    for (const citation of citations) {
      expect(citation.locator.length).toBeGreaterThan(8);
      expect(["supports", "challenges", "qualifies", "contextualizes"]).toContain(citation.role);
      expect(entityById(citation.object.id)).toMatchObject({ kind: "source", publicationStatus: "reviewed" });
    }
  });

  it("uses explicit selected starts rather than collection order", () => {
    expect(homepageStarts.subjects.map(({ href }) => href)).toEqual([
      "/guides/democracy/",
      "/guides/capitalism/",
      "/guides/kahnawake-community-lawmaking/",
    ]);
    expect(homepageStarts.cases).toHaveLength(2);
    expect(homepageStarts.questions).toHaveLength(2);
  });
});
