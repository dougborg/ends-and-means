import { describe, expect, it } from "vitest";
import {
  citationsFor,
  dossierForSubject,
  entitiesOfKind,
  entityById,
  researchObligationsForTarget,
  subjectGuideById,
} from "../../src/lib/domain/canonical";

const statementIds = [
  "tribe-not-universal-political-form",
  "tribe-colonial-evolutionary-history",
  "indian-act-band-administrative-definition",
  "indian-act-band-council-definition",
  "kahnawake-community-self-description",
  "kahnawake-cdmrp-2005-adoption",
  "kahnawake-cdmrp-consultative-development",
  "kahnawake-consensus-process-definition",
  "kahnawake-cdmrp-type-one-design",
  "kahnawake-cdmrp-2024-hearing-rule-change",
  "kahnawake-cdmrp-2024-revised-hearing-rule",
  "kahnawake-cdmrp-type-two-design",
  "kahnawake-cdmrp-hybrid-classification",
  "kahnawake-cdmrp-trust-contestation",
  "kahnawake-cdmrp-survey-attendance",
  "kahnawake-cdmrp-survey-concerns",
  "kahnawake-cdmrp-survey-sampling-limit",
  "kahnawake-case-not-tribal-embodiment",
];

describe("Kahnawà:ke community law-making case", () => {
  it("publishes a bounded ongoing Case with separate formal, practice, interaction, and outcome claims", () => {
    expect(entityById("kahnawake-community-lawmaking")).toMatchObject({
      kind: "case",
      startDate: { year: 2005, month: 10, day: 14, certainty: "exact" },
      asOf: "2026-09-05",
      freshness: "review-needed",
      episodeIds: ["kahnawake-cdmrp-2005-present"],
    });
    expect(entityById("kahnawake-cdmrp-2005-present")).toMatchObject({
      kind: "case-episode",
      formalRuleStatementIds: [
        "kahnawake-consensus-process-definition",
        "kahnawake-cdmrp-type-one-design",
        "kahnawake-cdmrp-2024-hearing-rule-change",
        "kahnawake-cdmrp-2024-revised-hearing-rule",
        "kahnawake-cdmrp-type-two-design",
      ],
      interactionStatementIds: ["kahnawake-cdmrp-trust-contestation"],
      outcomeStatementIds: [
        "kahnawake-cdmrp-survey-attendance",
        "kahnawake-cdmrp-survey-concerns",
        "kahnawake-cdmrp-survey-sampling-limit",
      ],
    });
  });

  it("keeps community self-description and Canadian administrative classification distinct", () => {
    expect(entityById("kahnawake-community-self-description")).toMatchObject({
      statementKind: "classification",
    });
    expect(entityById("indian-act-band-administrative-definition")).toMatchObject({
      statementKind: "definition",
    });
    const communitySource = entityById(
      "horn-miller-indigenous-participatory-democracy-source",
    );
    expect(communitySource).toMatchObject({
      kind: "source",
      contributorDisplay: ["Kahente Horn-Miller"],
    });
  });
});

describe("diverse political-organization model boundaries", () => {
  it("does not canonize broad search language as universal political types", () => {
    const forbiddenLabels = new Set([
      "band",
      "chiefdom",
      "clan",
      "confederacy",
      "customary law",
      "nomadic government",
      "pastoral government",
      "tribe",
      "tribal organization",
    ]);
    expect(
      entitiesOfKind("concept").filter(({ label }) =>
        forbiddenLabels.has(label.toLocaleLowerCase("en")),
      ),
    ).toEqual([]);
    expect(
      entitiesOfKind("collection").filter(({ label }) =>
        forbiddenLabels.has(label.toLocaleLowerCase("en")),
      ),
    ).toEqual([]);
  });

  it("answers broad learner queries through a bounded guide rather than a universal Concept", () => {
    const guide = subjectGuideById("guide-kahnawake-community-lawmaking");
    expect(guide?.primarySubject).toEqual({
      kind: "case",
      id: "kahnawake-community-lawmaking",
    });
    expect(guide).toMatchObject({
      label: "Kahnawà:ke community law-making",
      searchQueries: expect.arrayContaining([
        { query: "Kahnawà:ke community law-making" },
      ]),
      sections: expect.arrayContaining([
        expect.objectContaining({
          role: "short-answer",
          heading:
            "What is the Kahnawà:ke Community Decision Making and Review Process?",
        }),
      ]),
    });
    expect(
      guide?.searchQueries.find(({ query }) => query === "tribal organization"),
    ).toMatchObject({
      disambiguation: expect.stringContaining("not a universal"),
    });
    expect(
      guide?.searchQueries.find(({ query }) => query === "tribal government"),
    ).toMatchObject({
      disambiguation: expect.stringContaining("not a definition"),
    });
  });
});

describe("Kahnawà:ke evidence and narrative", () => {
  it("attributes the January 2024 rule without converting procedure into community assent", () => {
    const ruleChange = entityById("kahnawake-cdmrp-2024-hearing-rule-change");
    if (ruleChange?.kind !== "statement")
      throw new Error("Missing January 2024 rule-change Statement");
    const normalized = ruleChange.text
      .normalize("NFKD")
      .replace(/\p{M}/gu, "")
      .toLocaleLowerCase("en")
      .replace(/[^a-z0-9]+/g, " ")
      .trim();

    expect(normalized).toContain("kahnawa ke legislative commission announced");
    expect(normalized).toContain("after two under attended attempts");
    expect(normalized).toContain("no further hearing");
    expect(normalized).toMatch(/advanc\w* the draft or amendments to the next step/);
    expect(normalized).not.toMatch(
      /community (accepted|approved|consented|agreed|endorsed)/,
    );
    expect(normalized).not.toMatch(/acceptable to (the )?community/);
  });

  it("records the April successor rule and leaves current-rule freshness open", () => {
    expect(entityById("kahnawake-cdmrp-2024-revised-hearing-rule")).toMatchObject({
      kind: "statement",
      text: expect.stringContaining(
        "the Commission decides whether they may advance or whether additional measures are needed",
      ),
    });
    expect(
      researchObligationsForTarget("case", "kahnawake-community-lawmaking").map(
        ({ id }) => id,
      ),
    ).toContain("kahnawake-cdmrp-current-hearing-rules");
  });

  it("locates every atomic claim and includes community, legal, and external analytical sources", () => {
    expect(statementIds).toHaveLength(18);
    expect(statementIds.every((id) => entityById(id)?.kind === "statement")).toBe(
      true,
    );
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
      ),
    ).toEqual(
      new Set([
        "canada-indian-act-1985-source",
        "horn-miller-indigenous-participatory-democracy-source",
        "kahnawake-cdmrp-2023-survey-analysis-source",
        "kahnawake-cdmrp-2024-hearing-modification-source",
        "kahnawake-cdmrp-2024-revised-hearing-modification-source",
        "kahnawake-cdmrp-public-description-source",
        "sneath-tribe-source",
      ]),
    );
  });

  it("provides a reader-first narrative and focused unresolved questions", () => {
    const dossier = dossierForSubject("case", "kahnawake-community-lawmaking");
    expect(dossier?.sections.map(({ id }) => id)).toEqual([
      "whose-terms-describe-the-community",
      "how-does-the-process-work",
      "is-this-simply-traditional-government",
      "what-do-we-know-about-practice",
      "what-does-this-case-establish",
    ]);
    expect(
      researchObligationsForTarget("case", "kahnawake-community-lawmaking").map(
        ({ id }) => id,
      ),
    ).toEqual([
      "kahnawake-cdmrp-current-hearing-rules",
      "kahnawake-cdmrp-jurisdiction-enforcement",
      "kahnawake-cdmrp-participation-representativeness",
      "kahnawake-governing-authority-legitimacy",
    ]);
  });
});
