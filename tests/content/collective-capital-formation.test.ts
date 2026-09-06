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
  "swedish-1981-funds-cash-financing",
  "collective-capital-formation-financing-governance-boundary",
  "collective-capital-formation-governing-constituency",
  "meidner-collective-funds-proposal",
  "collective-capital-formation-rights-boundary",
  "collective-capital-formation-swedish-case-classification",
  "collective-capital-formation-supporter-distance",
  "collective-capital-formation-unclear-benefits-objection",
  "collective-capital-formation-purpose-objection",
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
      "collective-capital-formation-national-accounts-boundary",
      "collective-capital-formation-rights-boundary",
    ]);
    expect(dossier?.sections.map(({ id }) => id)).toEqual([
      "what-does-collective-mean-here",
      "how-is-this-different-from-investment-statistics",
      "what-design-choices-matter",
      "what-does-the-swedish-case-show",
      "why-can-collective-funds-lose-support",
    ]);
    expect(dossier?.sections[0]?.statementIds).toEqual([
      "collective-capital-formation-working-definition",
      "collective-capital-formation-individual-saving-boundary",
      "collective-capital-formation-governing-constituency",
      "collective-capital-formation-rights-boundary",
    ]);
  });

  it("locates at least six atomic claims across four authoritative sources", () => {
    expect(
      entityById("furendal-oneill-collective-capital-source"),
    ).toMatchObject({
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
      entityById("collective-capital-formation-swedish-case-classification"),
    ).toMatchObject({
      statementKind: "classification",
      text: expect.stringContaining("not a definition or complete realization"),
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
          "collective-capital-formation-supporter-distance",
          "collective-capital-formation-unclear-benefits-objection",
          "collective-capital-formation-purpose-objection",
        ],
        obligationStatus: "open",
      }),
    ]);
  });
});

describe("collective capital formation locator precision", () => {
  it("keeps design and supporter objections tied to the exact supporting passages", () => {
    expect(
      citationsFor("collective-capital-formation-governing-constituency"),
    ).toEqual([
      expect.objectContaining({ locator: "section 5, pp. 319–320" }),
    ]);
    expect(
      citationsFor("collective-capital-formation-rights-boundary"),
    ).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ locator: "section 5, pp. 319–320" }),
      ]),
    );
    expect(
      citationsFor("collective-capital-formation-unclear-benefits-objection"),
    ).toEqual([
      expect.objectContaining({
        locator:
          "section ‘1978–1981: Muted support, vigorous opposition and the watering down of wage-earner funds’, pp. 513–514",
      }),
    ]);
  });
});
