import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { citationsFor, entityById } from "../../src/lib/domain/canonical";
import {
  homepageStarts,
  homepageTrace,
  publicCommitments,
} from "../../src/lib/public-commitments";

const packageManifest = JSON.parse(readFileSync("package.json", "utf8")) as {
  scripts: Record<string, string>;
};

describe("public commitments", () => {
  it("names real publication scripts and keeps editorial decisions human-owned", () => {
    expect(publicCommitments.map(({ id }) => id)).toEqual([
      "traceable-evidence",
      "bounded-synthesis",
      "accountable-assistance",
    ]);
    for (const commitment of publicCommitments) {
      expect(commitment.verification.human.length, commitment.id).toBeGreaterThan(0);
      for (const check of commitment.verification.automated) {
        expect(packageManifest.scripts, `${commitment.id}: ${check.script}`).toHaveProperty(check.script);
        expect(check.rejects.length, commitment.id).toBeGreaterThan(20);
      }
      for (const review of commitment.verification.human) {
        expect(["author", "independent reviewer", "project editor"]).toContain(review.owner);
        expect(review.decides.length, commitment.id).toBeGreaterThan(20);
      }
    }
    expect(publicCommitments.find(({ id }) => id === "accountable-assistance")?.verification.automated).toEqual([]);
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
    expect(citations).toContainEqual(expect.objectContaining({
      id: "capitalism-marx-definition-citation-4",
      locator: "chapter 7, section 2, paragraphs beginning ‘Therefore, the value of labour-power’ and ‘This metamorphosis’",
      object: { kind: "source", id: "marx-capital-volume-one-source" },
      role: "supports",
    }));
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
