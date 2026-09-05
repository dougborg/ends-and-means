import { describe, expect, it } from "vitest";
import {
  citationsFor,
  dossierForSubject,
  entityById,
  relationshipsFrom,
  researchObligationsForTarget,
} from "../../src/lib/domain/canonical";

const statementIds = [
  "socialism-contested-family",
  "socialism-democratic-control-minimum",
  "socialism-not-statism",
  "socialism-market-boundary",
  "socialism-three-distinct-questions",
  "socialism-values-newman",
  "socialism-global-historical-variation",
  "socialism-organizational-disagreement",
  "socialism-communism-overlap-boundary",
  "communism-multiple-referents",
  "manifesto-communist-immediate-aim",
  "manifesto-bourgeois-property-boundary",
  "manifesto-common-property-class-character",
  "marx-lower-communist-phase",
  "marx-higher-communist-phase",
  "lenin-transitional-state-claim",
  "lenin-state-withering-claim",
  "kropotkin-anarchist-communist-route",
  "kropotkin-nonparliamentary-route",
  "communism-early-global-variation",
  "communist-label-non-embodiment",
];

describe("socialism and communism canonical foundations", () => {
  it("publishes atomic located statements from primary texts and scholarship", () => {
    expect(statementIds).toHaveLength(21);
    expect(
      statementIds.every((id) => entityById(id)?.kind === "statement"),
    ).toBe(true);
    expect(statementIds.every((id) => citationsFor(id).length > 0)).toBe(true);
    expect(
      new Set(
        statementIds.flatMap((id) =>
          citationsFor(id).map(({ object }) => object.id),
        ),
      ).size,
    ).toBeGreaterThanOrEqual(6);
    expect(
      statementIds.every((id) =>
        citationsFor(id).every(({ locator }) => locator.trim().length > 0),
      ),
    ).toBe(true);
  });

  it("keeps the broad concepts distinct and relationships non-inheriting", () => {
    expect(entityById("socialism")).toMatchObject({ kind: "concept" });
    expect(entityById("communism")).toMatchObject({ kind: "concept" });
    expect(relationshipsFrom("socialism")).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: "socialism-related-to-communism",
          predicate: "related-to",
          status: "qualified",
        }),
        expect.objectContaining({
          id: "socialism-related-to-social-democracy",
          status: "contested",
        }),
        expect.objectContaining({
          id: "socialism-related-to-market-socialism",
          status: "qualified",
        }),
      ]),
    );
    expect(
      relationshipsFrom("socialism").some(({ predicate }) =>
        ["advances-end", "advocates-means", "member-of"].includes(predicate),
      ),
    ).toBe(false);
    expect(
      relationshipsFrom("communism").some(({ predicate }) =>
        ["advances-end", "advocates-means", "member-of"].includes(predicate),
      ),
    ).toBe(false);
  });
});

describe("socialism and communism narrative foundations", () => {
  it("provides traceable dossiers without publishing a SubjectGuide", () => {
    const socialism = dossierForSubject("concept", "socialism");
    const communism = dossierForSubject("concept", "communism");
    expect(socialism?.sections.map(({ id }) => id)).toEqual([
      "what-defines-socialism",
      "why-is-the-term-so-broad",
      "which-institutions-and-paths-are-disputed",
      "how-do-socialism-and-communism-relate",
    ]);
    expect(communism?.sections.map(({ id }) => id)).toEqual([
      "what-can-communism-mean",
      "what-did-marx-and-engels-propose",
      "did-communists-agree-on-the-path-or-destination",
      "was-communism-one-global-movement",
      "does-a-communist-label-settle-the-case",
    ]);
    expect(
      [socialism, communism].every((dossier) =>
        dossier?.sections.every(({ statementIds: ids }) => ids.length > 0),
      ),
    ).toBe(true);
    expect(entityById("socialism-guide")).toBeUndefined();
    expect(entityById("communism-guide")).toBeUndefined();
  });

  it("records focused open research questions against exact sections", () => {
    expect(researchObligationsForTarget("concept", "socialism")).toEqual([
      expect.objectContaining({
        id: "socialism-democratic-control-threshold",
        targetSectionId: "what-defines-socialism",
        addressedStatementIds: [
          "socialism-democratic-control-minimum",
          "socialism-not-statism",
        ],
      }),
    ]);
    expect(researchObligationsForTarget("concept", "communism")).toEqual([
      expect.objectContaining({
        id: "communism-claimed-identity-practice-gap",
        targetSectionId: "does-a-communist-label-settle-the-case",
        addressedStatementIds: ["communist-label-non-embodiment"],
      }),
    ]);
  });
});
