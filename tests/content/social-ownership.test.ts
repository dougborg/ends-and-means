import { describe, expect, it } from "vitest";
import {
  canonicalGraph,
  citationsFor,
  entityById,
  relationshipsFrom,
  relationshipsTo,
  researchObligationsForTarget,
} from "../../src/lib/domain/canonical";

const statementIds = [
  "wright-social-ownership-definition",
  "social-ownership-four-questions",
  "social-ownership-title-benefit-boundary",
  "social-ownership-rights-are-divisible",
  "social-ownership-control-boundary",
  "social-ownership-returns-boundary",
  "social-ownership-public-title-boundary",
  "social-ownership-market-socialism-relationship",
  "social-ownership-economic-democracy-relationship",
  "rehn-meidner-original-ownership-boundary",
  "meidner-1976-wage-earner-fund-connection",
];

describe("social-ownership corpus slice", () => {
  it("publishes atomic, located claims from several authoritative sources", () => {
    expect(statementIds.every((id) => entityById(id)?.kind === "statement")).toBe(true);
    expect(statementIds.every((id) => citationsFor(id).length > 0)).toBe(true);
    expect(
      new Set(statementIds.flatMap((id) => citationsFor(id).map(({ object }) => object.id))).size,
    ).toBeGreaterThanOrEqual(3);
  });

  it("connects neighboring concepts and both bounded Swedish lines", () => {
    expect(relationshipsFrom("social-ownership").map(({ id }) => id)).toEqual(
      expect.arrayContaining([
        "social-ownership-related-to-economic-democracy",
        "social-ownership-related-to-market-socialism",
      ]),
    );
    expect(relationshipsTo("social-ownership").map(({ id }) => id)).toEqual(
      expect.arrayContaining([
        "wage-earner-program-interprets-social-ownership",
        "rehn-meidner-contested-social-ownership",
        "wage-earner-funds-contested-social-ownership",
      ]),
    );
  });

  it("keeps the unresolved delegation objection attached to the exact section", () => {
    expect(researchObligationsForTarget("concept", "social-ownership")).toEqual([
      expect.objectContaining({
        id: "social-ownership-delegation-accountability-gap",
        targetSectionId: "which-rights-must-be-separated",
        obligationStatus: "open",
      }),
    ]);
    expect(canonicalGraph.indexes.entitiesById.accountability?.kind).toBe("criterion");
  });
});
