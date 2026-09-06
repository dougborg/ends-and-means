import { describe, expect, it } from "vitest";
import {
  citationsFor,
  dossierForSubject,
  entitiesOfKind,
  entityById,
  relationshipsFrom,
  researchObligationsForTarget,
  subjectGuideById,
} from "../../src/lib/domain/canonical";

const exactEvidence = {
  "authoritarian-practice-boundary": [
    "glasius-practices-source",
    "pp. 529–531, ‘Authoritarian practices,’ definition and qualification",
  ],
  "autocracy-operational-boundary": [
    "vdem-regimes-source",
    "pp. 60–62, Table 1",
  ],
  "dictatorship-history-boundary": [
    "marquez-dictatorship-source",
    "pp. 67–70, 82–91",
  ],
  "fascism-griffin-definition": [
    "griffin-nature-source",
    "introduction, p. 26",
  ],
  "fascism-self-description": [
    "mussolini-doctrine-source",
    "sections ‘Political and Social Doctrine’ and ‘The Fascist State’",
  ],
  "italy-dictatorship-transition": [
    "ushmm-mussolini-source",
    "section ‘Rise to Power’, paragraphs 4–6",
  ],
  "totalitarian-contested-category": [
    "bunce-totalitarianism-source",
    "p. 535, paragraphs 1–2",
  ],
  "totalitarian-label-history": [
    "marquez-dictatorship-source",
    "pp. 84–87, section ‘Totalitarianism and Authoritarianism’",
  ],
  "nazi-party-state-law": ["party-state-law-source", "articles 1–3"],
  "nazi-control-limit": [
    "ushmm-nazi-state-source",
    "section ‘The Gleichschaltung of German Society’",
  ],
} as const;

describe("authoritarianism, fascism, and totalitarianism tranche", () => {
  it("pins boundary propositions to exact source manifestations and locators", () => {
    for (const [statementId, [sourceId, locator]] of Object.entries(
      exactEvidence,
    )) {
      expect(citationsFor(statementId), statementId).toContainEqual(
        expect.objectContaining({
          object: { kind: "source", id: sourceId },
          locator,
        }),
      );
    }
    const trancheStatements = entitiesOfKind("statement").filter(({ id }) =>
      /^(authoritarian|autocracy|dictatorship|fascism|italy|totalitarian|nazi)/u.test(
        id,
      ),
    );
    expect(trancheStatements.length).toBeGreaterThanOrEqual(18);
    for (const { id } of trancheStatements)
      expect(citationsFor(id).length, id).toBeGreaterThan(0);
  });

  it("keeps concepts, editorial collections, scholarly approaches, and cases distinct", () => {
    for (const id of [
      "authoritarianism",
      "fascism",
      "totalitarianism",
      "autocracy",
      "dictatorship",
    ]) {
      expect(entityById(id)).toMatchObject({ kind: "concept" });
    }
    expect(entityById("fascist-movements")).toMatchObject({
      kind: "collection",
    });
    expect(entityById("totalitarianism-analyses")).toMatchObject({
      kind: "collection",
    });
    expect(entityById("historical-italian-fascism")).toMatchObject({
      kind: "approach",
    });
    expect(entityById("linz-regime-analysis")).toMatchObject({
      kind: "approach",
    });
    expect(entityById("italian-fascist-dictatorship-1925-1943")).toMatchObject({
      kind: "case",
    });
    expect(entityById("nazi-consolidation-1933")).toMatchObject({
      kind: "case",
    });
    expect(
      relationshipsFrom("italian-fascist-dictatorship-1925-1943"),
    ).toContainEqual(
      expect.objectContaining({
        predicate: "partially-instantiated",
        status: "qualified",
      }),
    );
  });

  it("publishes three traced learner journeys with focused unresolved questions", () => {
    for (const id of [
      "authoritarianism",
      "fascism",
      "totalitarianism",
    ] as const) {
      const dossier = dossierForSubject("concept", id);
      const guide = subjectGuideById(`guide-${id}`);
      expect(
        dossier?.sections.every(({ statementIds }) => statementIds.length >= 2),
      ).toBe(true);
      expect(guide?.sections.map(({ role }) => role)).toEqual([
        "short-answer",
        "meanings-and-boundaries",
        "bounded-practice",
        "variants-and-disputes",
        "comparisons-and-next-steps",
        "open-questions",
      ]);
      expect(researchObligationsForTarget("concept", id)).toHaveLength(1);
    }
  });
});
