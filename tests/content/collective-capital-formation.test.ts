import { describe, expect, it } from "vitest";
import {
  citationsFor,
  dossierForSubject,
  entityById,
  researchObligationsForTarget,
} from "../../src/lib/domain/canonical";

const statementIds = [
  "collective-capital-formation-working-definition",
  "collective-capital-formation-national-accounts-boundary",
  "collective-capital-formation-individual-saving-boundary",
  "collective-capital-formation-financing-methods",
  "collective-capital-formation-governing-constituency",
  "meidner-collective-funds-proposal",
  "collective-capital-formation-rights-boundary",
  "collective-capital-formation-swedish-case-boundary",
  "collective-capital-formation-beneficiary-distance",
  "collective-capital-formation-activist-purpose-objection",
];

describe("collective capital formation dossier", () => {
  it("publishes a scoped Concept with an answer-first traced dossier", () => {
    expect(entityById("collective-capital-formation")).toMatchObject({
      kind: "concept",
      scopeNote: expect.stringContaining("not the national-accounts measure"),
    });
    const dossier = dossierForSubject(
      "concept",
      "collective-capital-formation",
    );
    expect(dossier?.standfirstStatementIds).toEqual([
      "collective-capital-formation-working-definition",
      "collective-capital-formation-rights-boundary",
    ]);
    expect(dossier?.sections.map(({ id }) => id)).toEqual([
      "what-does-collective-mean-here",
      "how-is-this-different-from-investment-statistics",
      "what-design-choices-matter",
      "what-does-the-swedish-case-show",
      "why-can-collective-funds-lose-support",
    ]);
  });

  it("locates at least six atomic claims across four authoritative sources", () => {
    expect(entityById("furendal-oneill-collective-capital-source")).toMatchObject({
      contributorDisplay: ["Markus Furendal", "Martin O'Neill"],
    });
    expect(statementIds.length).toBeGreaterThanOrEqual(6);
    expect(
      statementIds.every((id) => entityById(id)?.kind === "statement"),
    ).toBe(true);
    expect(statementIds.every((id) => citationsFor(id).length > 0)).toBe(true);
    expect(
      statementIds.every((id) =>
        citationsFor(id).every(({ locator }) => locator.trim().length > 0),
      ),
    ).toBe(true);
    expect(
      new Set(
        statementIds.flatMap((id) =>
          citationsFor(id).map(({ object }) => object.id),
        ),
      ).size,
    ).toBeGreaterThanOrEqual(4);
  });

  it("keeps the bounded Swedish case from embodying the Concept", () => {
    expect(
      entityById("collective-capital-formation-swedish-case-boundary"),
    ).toMatchObject({
      statementKind: "classification",
      text: expect.stringContaining(
        "one constrained instance rather than a complete realization",
      ),
    });
  });

  it("records a focused accountability counterargument", () => {
    expect(
      researchObligationsForTarget("concept", "collective-capital-formation"),
    ).toEqual([
      expect.objectContaining({
        id: "collective-capital-formation-accountability-design",
        obligationType: "counterargument",
        targetSectionId: "why-can-collective-funds-lose-support",
        addressedStatementIds: [
          "collective-capital-formation-beneficiary-distance",
          "collective-capital-formation-activist-purpose-objection",
        ],
        obligationStatus: "open",
      }),
    ]);
  });
});
