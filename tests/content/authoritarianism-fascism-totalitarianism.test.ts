import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";
import {
  canonicalGraph,
  citationsFor,
  dossierForSubject,
  entitiesOfKind,
  entityById,
  relationshipsFrom,
  researchObligationsForTarget,
  subjectGuideById,
} from "../../src/lib/domain/canonical";

const digest = (value: unknown) =>
  createHash("sha256").update(JSON.stringify(value)).digest("hex");

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
  "fascism-authoritarianism-distinction": [
    "paxton-anatomy-source",
    "chapter 8, p. 207, paragraph beginning ‘Considering fascism simply’",
  ],
  "fascism-totalitarianism-classification-dispute": [
    "paxton-anatomy-source",
    "chapter 8, p. 210, paragraphs beginning ‘A multitude of observers’",
  ],
  "italian-fascism-external-classification": [
    "paxton-anatomy-source",
    "chapter 1, p. 14, paragraph beginning ‘I propose to set aside’",
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
  "nazi-democratic-destruction": [
    "ushmm-nazi-state-source",
    "opening summary and critical-thinking question 1",
  ],
  "nazi-one-party-state-july-1933": [
    "ushmm-nazi-state-source",
    "section ‘Creating the Führer State,’ paragraph beginning ‘With the passage’",
  ],
  "nazi-coordination-scope": [
    "ushmm-nazi-state-source",
    "section ‘The Gleichschaltung of German Society’",
  ],
  "nazi-christian-coordination-limit": [
    "ushmm-nazi-state-source",
    "section ‘The Gleichschaltung of German Society,’ final sentence",
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
  "fascism-authoritarianism-distinction",
  "fascism-evidence-region-limit",
  "fascism-griffin-definition",
  "fascism-label-boundary",
  "fascism-paxton-rival",
  "fascism-rejects-liberal-democracy",
  "fascism-rejects-liberal-individualism",
  "fascism-self-description",
  "fascism-self-description-limit",
  "fascism-state-organizes-nation",
  "fascism-totalitarianism-classification-dispute",
  "italian-fascism-external-classification",
  "italy-coalition-government-1922",
  "italy-dictatorship-transition",
  "italy-movement-party-sequence",
  "italy-party-regime-boundary",
  "nazi-christian-coordination-limit",
  "nazi-coordination-scope",
  "nazi-democratic-destruction",
  "nazi-one-party-state-july-1933",
  "nazi-party-state-law",
  "totalitarian-arendt-boundary",
  "totalitarian-case-nonembodiment",
  "totalitarian-contested-category",
  "totalitarian-label-history",
  "totalitarian-linz-definition",
  "totalitarian-polemical-boundary",
] as const;
const exactLedgerDigest =
  "68be66ee40b952c105018684dd8ebdd91c515c698a62668e38b27634dd32b71c";
const sourceIds = [
  "arendt-origins-source",
  "bunce-totalitarianism-source",
  "geddes-dictatorships-source",
  "glasius-practices-source",
  "griffin-nature-source",
  "linz-regimes-source",
  "marquez-dictatorship-source",
  "mussolini-doctrine-source",
  "party-state-law-source",
  "paxton-anatomy-source",
  "ushmm-mussolini-source",
  "ushmm-nazi-state-source",
  "vdem-regimes-source",
] as const;
const semanticSubjectIds = [
  "authoritarianism",
  "fascism",
  "historical-italian-fascism",
  "linz-regime-analysis",
] as const;
const boundedEvidenceIds = [
  "italian-fascist-dictatorship-1925-1943",
  "italian-fascist-consolidated-rule",
  "nazi-consolidation-1933",
  "nazi-party-state-consolidation-1933",
] as const;
const exactSourceDigest =
  "51742bdb1591adbf7fa58d1fa81db1104421399c9b26d1d03d1d3d9ee374ea32";
const exactSemanticRelationshipDigest =
  "0f38e44e48b874f2858e6cfe1dccd9e0a7019867a03a5676f7f68a0566d39fc1";
const exactPresentationDigest =
  "2e8afc648fceeea6d66211d86c63ad6a57f839a78f2a7a08335b8a5c129f668c";
const exactBoundedEvidenceDigest =
  "b4190588290d955a7a606c890ef4200d14afcda40995ba0eb55e350715428fe3";
const exactResearchDigest =
  "e3b192e8555c849d37493cfd68c51b3a311a9ad5437153a9c1448df2d3f59400";

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
      /^(authoritarian|autocracy|dictatorship|fascism|italian|italy|totalitarian|nazi)/u.test(
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
    expect(relationshipsFrom("italian-fascist-dictatorship-1925-1943")).toEqual(
      [],
    );
  });

  it("pins source, relationship, presentation, case, and research semantics", () => {
    expect
      .soft(digest(sourceIds.map((id) => entityById(id))))
      .toBe(exactSourceDigest);
    expect
      .soft(digest(semanticSubjectIds.flatMap((id) => relationshipsFrom(id))))
      .toBe(exactSemanticRelationshipDigest);
    expect
      .soft(
        digest(
          ["authoritarianism", "fascism", "totalitarianism"].map((id) => ({
            dossier: dossierForSubject("concept", id),
            guide: subjectGuideById(`guide-${id}`),
          })),
        ),
      )
      .toBe(exactPresentationDigest);
    expect
      .soft(digest(boundedEvidenceIds.map((id) => entityById(id))))
      .toBe(exactBoundedEvidenceDigest);
    expect
      .soft(
        digest(
          ["authoritarianism", "fascism", "totalitarianism"].flatMap((id) =>
            researchObligationsForTarget("concept", id),
          ),
        ),
      )
      .toBe(exactResearchDigest);
    expect(
      canonicalGraph.relationships.some(
        ({ id }) => id === "italian-fascist-case-partial",
      ),
    ).toBe(false);
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
