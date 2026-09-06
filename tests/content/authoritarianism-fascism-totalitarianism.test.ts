import { createHash } from "node:crypto";
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
  "dictatorship-roman-office-boundary": [
    "marquez-dictatorship-source",
    "pp. 79–80, section ‘Dictatorship and Sovereignty,’ paragraphs 1–2",
  ],
  "dictatorship-modern-legitimation-boundary": [
    "marquez-dictatorship-source",
    "pp. 68–69, introduction, paragraphs 3–5",
  ],
  "fascism-griffin-definition": [
    "griffin-nature-source",
    "introduction, p. 26",
  ],
  "fascism-self-description": [
    "mussolini-doctrine-source",
    "document paragraph 3 (‘complete opposite of Marxian Socialism’)",
  ],
  "fascism-rejects-liberal-democracy": [
    "mussolini-doctrine-source",
    "document paragraph 4 (‘denies that the majority ... can direct human society’)",
  ],
  "fascism-rejects-liberal-individualism": [
    "mussolini-doctrine-source",
    "document paragraph 6 (‘century of individualism’ through ‘century of the State’)",
  ],
  "fascism-state-organizes-nation": [
    "mussolini-doctrine-source",
    "document paragraphs 7–8 (‘foundation ... conception of the State’ through ‘organizes the nation’)",
  ],
  "italy-dictatorship-transition": [
    "ushmm-mussolini-source",
    "section ‘Italian Fascism,’ paragraph 6",
  ],
  "totalitarian-contested-category": [
    "bunce-totalitarianism-source",
    "p. 535, paragraphs 1–2",
  ],
  "totalitarian-label-history": [
    "marquez-dictatorship-source",
    "pp. 84–87, section ‘Totalitarianism and Authoritarianism’",
  ],
  "nazi-party-state-law": [
    "party-state-law-source",
    "GHDI reproduction, §§1–3; translation provenance note on PDF p. 2",
  ],
  "nazi-control-limit": [
    "ushmm-nazi-state-source",
    "section ‘The Gleichschaltung of German Society’",
  ],
} as const;

const statementIds = [
  "authoritarian-autocracy-nonsynonym",
  "authoritarian-linz-boundary",
  "authoritarian-not-totalitarian",
  "authoritarian-practice-boundary",
  "autocracy-operational-boundary",
  "dictatorship-modern-legitimation-boundary",
  "dictatorship-roman-office-boundary",
  "dictatorship-varied-institutions",
  "fascism-evidence-region-limit",
  "fascism-griffin-definition",
  "fascism-label-boundary",
  "fascism-paxton-rival",
  "fascism-rejects-liberal-democracy",
  "fascism-rejects-liberal-individualism",
  "fascism-self-description",
  "fascism-self-description-limit",
  "fascism-state-organizes-nation",
  "italy-coalition-government-1922",
  "italy-dictatorship-transition",
  "italy-movement-party-sequence",
  "italy-party-regime-boundary",
  "nazi-control-limit",
  "nazi-one-party-consolidation",
  "nazi-party-state-law",
  "totalitarian-arendt-boundary",
  "totalitarian-case-nonembodiment",
  "totalitarian-contested-category",
  "totalitarian-label-history",
  "totalitarian-linz-definition",
  "totalitarian-polemical-boundary",
] as const;
const exactLedgerDigest =
  "982d7425849511536e38ec1df3f7198386125a3d0fb5f5086c0237af239a448d";

// biome-ignore lint/complexity/noExcessiveLinesPerFunction: one exact tranche ledger and its model contracts belong together
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
    expect(trancheStatements.map(({ id }) => id)).toEqual(statementIds);
    for (const { id } of trancheStatements)
      expect(citationsFor(id).length, id).toBeGreaterThan(0);
    const ledger = statementIds.map((id) => {
      const statement = entityById(id);
      if (statement?.kind !== "statement")
        throw new Error(`${id} is not a Statement`);
      return [
        id,
        statement.statementKind,
        statement.text,
        citationsFor(id).map(({ object, locator, role }) => [
          object.id,
          locator,
          role,
        ]),
      ];
    });
    expect(
      createHash("sha256").update(JSON.stringify(ledger)).digest("hex"),
    ).toBe(exactLedgerDigest);
    expect(citationsFor("fascism-evidence-region-limit")).toContainEqual(
      expect.objectContaining({
        object: { kind: "source", id: "paxton-anatomy-source" },
        role: "context",
      }),
    );
  });

  it("keeps concepts, editorial collections, scholarly approaches, and cases distinct", () => {
    expect(entityById("party-state-law-source")).toMatchObject({
      sourceType: "web-page",
      workId: "party-state-law-work",
      publisher: "German Historical Institute Washington",
      contributorDisplay: expect.arrayContaining([
        "Nuremberg translation staff",
      ]),
      resourceLinks: [
        expect.objectContaining({
          purpose: "authorized-reading",
          url: "https://germanhistorydocs.org/en/nazi-germany-1933-1945/law-to-safeguard-the-unity-of-party-and-state-december-1-1933.pdf",
        }),
      ],
    });
    expect(entityById("party-state-law-source")).not.toHaveProperty(
      "publicationYear",
    );
    expect(entityById("ushmm-nazi-state-source")).not.toHaveProperty(
      "publicationYear",
    );
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
        ...(id === "authoritarianism" ? [] : ["bounded-practice" as const]),
        "variants-and-disputes",
        "comparisons-and-next-steps",
        "open-questions",
      ]);
      expect(researchObligationsForTarget("concept", id)).toHaveLength(1);
    }
  });
});
