import { describe, expect, it } from "vitest";
import { editorialPrinciples } from "../../src/lib/editorial-principles";

describe("editorial principles", () => {
  it("maps every published promise to executable or named human responsibility", () => {
    expect(editorialPrinciples.map(({ id }) => id)).toEqual([
      "visible-judgment",
      "separate-claim-types",
      "source-fitness",
      "fair-disagreement",
      "bounded-conclusions",
      "independent-language",
      "accountable-revision",
    ]);
    for (const principle of editorialPrinciples) {
      const { automated, human } = principle.verification;
      expect(automated.length + human.length, principle.id).toBeGreaterThan(0);
      expect(human.length, principle.id).toBeGreaterThan(0);
      for (const review of human) {
        expect(["author", "independent reviewer", "project editor"]).toContain(
          review.owner,
        );
        expect(review.decides.length, principle.id).toBeGreaterThan(20);
      }
    }
  });

  it("describes executable enforcement as typed capabilities rather than editorial verdicts", () => {
    const independentLanguage = editorialPrinciples.find(
      ({ id }) => id === "independent-language",
    );
    expect(independentLanguage?.verification.automated).toEqual([
      {
        script: "audit:content-integrity",
        enforces: [
          "malformed-or-stale-overlap-acknowledgements",
          "narrative-line-violations",
          "publication-boundary-violations",
        ],
      },
    ]);
    expect(independentLanguage?.verification.human).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ owner: "author" }),
        expect.objectContaining({ owner: "independent reviewer" }),
      ]),
    );
  });

  it("does not pretend that machines can settle editorial judgments", () => {
    for (const id of ["visible-judgment", "fair-disagreement"]) {
      expect(
        editorialPrinciples.find((principle) => principle.id === id)
          ?.verification.automated,
      ).toEqual([]);
    }
  });
});
