import { describe, expect, it } from "vitest";
import {
  canonicalGraph,
  dossierForSubject,
  entityById,
  relationshipsFrom,
} from "../../src/lib/domain/canonical";

describe("South Carolina Reconstruction evidence boundaries", () => {
  it("keeps the four evidence windows and corrected Episode roles separate", () => {
    expect(entityById("south-carolina-reconstruction-political-membership")).toMatchObject({
      kind: "case",
      startDate: { year: 1868, month: 1, day: 14, certainty: "exact" },
      endDate: { year: 1877, month: 4, day: 11, certainty: "exact" },
      episodeIds: [
        "sc-constitution-formation-1868",
        "sc-black-legislative-participation-1868-1876",
        "sc-political-coercion-federal-enforcement-1871-1872",
        "sc-election-contest-office-transfer-1876-1877",
      ],
    });

    expect(entityById("sc-black-legislative-participation-1868-1876")).toMatchObject({
      ruleInUseStatementIds: [],
      interactionStatementIds: [],
      outcomeStatementIds: [
        "sc-house-black-majority-1868-1876",
        "sc-senate-black-majority-1872-1876",
      ],
    });
    expect(entityById("sc-political-coercion-federal-enforcement-1871-1872")).toMatchObject({
      ruleInUseStatementIds: [],
      interactionStatementIds: [
        "sc-hill-may-1871-assault-testimony",
        "sc-hill-political-renunciation-demands",
        "sc-grant-habeas-suspension-october-1871",
        "sc-federal-mass-arrests-1871",
      ],
      outcomeStatementIds: [
        "sc-klan-prosecution-results",
        "sc-klan-enforcement-short-term-assessment",
      ],
    });
    expect(entityById("sc-election-contest-office-transfer-1876-1877")).toMatchObject({
      ruleInUseStatementIds: [],
      interactionStatementIds: expect.arrayContaining([
        "sc-hamburg-red-shirt-militia-confrontation",
        "sc-rifle-club-organization-october-1876",
        "sc-rifle-club-intimidation-purpose",
        "sc-rifle-club-hampton-support-purpose",
        "sc-statehouse-troops-withdrawn-april-10",
      ]),
    });
  });

  it("preserves the constitution and testimony manifestation boundaries", () => {
    expect(entityById("sc-1868-constitution-work")).toMatchObject({
      kind: "work",
      workType: "constitution",
      originalPublicationYear: 1868,
    });
    const constitutionSource = entityById("sc-1868-constitution-later-compilation-source");
    expect(constitutionSource).toMatchObject({
      kind: "source",
      workId: "sc-1868-constitution-work",
    });
    expect(constitutionSource).not.toHaveProperty("publicationYear");
    expect(JSON.stringify(constitutionSource)).toContain("amendments through at least December 1884");

    expect(entityById("sc-elias-hill-testimony-reproduction-source")).toMatchObject({
      kind: "source",
      workId: "sc-joint-select-committee-testimony-work",
    });
    expect(entityById("sc-freedpeople-testimony-ldhi-selection-source")).toMatchObject({
      kind: "source",
      workId: "sc-joint-select-committee-testimony-work",
    });
  });

  it("keeps adoption, elector ratification, admission, withdrawal, and transfer distinct", () => {
    expect(entityById("sc-convention-adopted-constitution-event")).toMatchObject({
      startDate: { year: 1868, month: 3, day: 17, certainty: "exact" },
      descriptionStatementIds: ["sc-convention-adopted-constitution"],
    });
    expect(entityById("sc-elector-ratification-event")).toMatchObject({
      startDate: { year: 1868, month: 4, day: 14, certainty: "exact" },
      endDate: { year: 1868, month: 4, day: 16, certainty: "exact" },
      descriptionStatementIds: ["sc-electors-ratified-constitution"],
    });
    expect(entityById("sc-congressional-admission-event")).toMatchObject({
      startDate: { year: 1868, month: 6, day: 25, certainty: "exact" },
      descriptionStatementIds: ["sc-congress-admitted-representation"],
    });
    expect(entityById("sc-statehouse-troop-withdrawal-event")).toMatchObject({
      startDate: { year: 1877, month: 4, day: 10, certainty: "exact" },
    });
    expect(entityById("sc-executive-office-transfer-event")).toMatchObject({
      startDate: { year: 1877, month: 4, day: 11, certainty: "exact" },
    });
  });
});

describe("South Carolina Reconstruction public composition", () => {
  it("uses a qualified Case-to-Democracy relationship", () => {
    expect(
      relationshipsFrom("south-carolina-reconstruction-political-membership").find(
        ({ id }) => id === "south-carolina-reconstruction-applies-to-democracy",
      ),
    ).toMatchObject({
      predicate: "applies-to-case",
      object: { kind: "concept", id: "democracy" },
      status: "qualified",
      scope: {
        startDate: "1868-01-14",
        endDate: "1877-04-11",
        placeIds: ["south-carolina"],
      },
    });
    expect(
      canonicalGraph.relationships.some(
        ({ subject, predicate }) =>
          subject.id === "south-carolina-reconstruction-political-membership" &&
          predicate === "contested-in-case",
      ),
    ).toBe(false);
  });

  it("publishes nine Case sections and a distinct Democracy incoming path", () => {
    expect(
      dossierForSubject("case", "south-carolina-reconstruction-political-membership")?.sections.map(
        ({ id }) => id,
      ),
    ).toEqual([
      "changed-membership",
      "antecedent-demands",
      "eligibility-and-exclusion",
      "convention-arguments",
      "officeholding-practice",
      "political-coercion",
      "federal-enforcement",
      "contest-and-transfer",
      "comparisons-and-open-questions",
    ]);
    expect(
      dossierForSubject("concept", "democracy")?.sections.find(
        ({ id }) => id === "south-carolina-reconstruction",
      ),
    ).toMatchObject({
      relatedEntityRefs: [
        { kind: "case", id: "south-carolina-reconstruction-political-membership" },
      ],
    });
  });
});
