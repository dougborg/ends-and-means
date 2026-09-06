import { describe, expect, it } from "vitest";
import {
  canonicalGraph,
  citationsFor,
  entityById,
  relationshipsFrom,
  subjectGuideById,
} from "../../src/lib/domain/canonical";

const feminismStatementIds = [
  "feminism-contested-family",
  "feminism-analysis-action-distinction",
  "feminism-public-private-boundary",
  "feminism-traditions-nonexhaustive",
  "liberal-feminism-autonomy",
  "radical-feminism-structural-boundary",
  "socialist-feminism-material-boundary",
  "formal-substantive-equality-boundary",
  "crenshaw-single-axis-limit",
  "mohanty-western-universal-limit",
  "moreton-robinson-indigenous-boundary",
  "koyama-transfeminist-self-description",
  "koyama-body-autonomy",
  "sex-gender-trans-boundary",
  "fraser-social-reproduction-definition",
  "fraser-care-capitalism-claim",
  "combahee-self-description",
  "combahee-organizing-practice",
  "combahee-case-boundary",
  "sewa-union-registration",
  "sewa-cooperative-bank",
  "sewa-quilt-cooperative",
  "sewa-case-boundary",
  "iceland-leave-enacted-design",
  "iceland-fathers-uptake",
  "iceland-care-work-outcomes",
  "iceland-causal-transfer-limit",
];

describe("foundational feminism guide", () => {
  it("publishes a substantive direct entry with the required evidence floor", () => {
    const guide = subjectGuideById("guide-feminism");
    expect(guide?.description).toContain("contested family");
    expect(guide?.description).not.toMatch(/learner|journey|path|workflow|pull request/i);
    expect(feminismStatementIds).toHaveLength(27);
    for (const id of feminismStatementIds) {
      expect(entityById(id)?.kind).toBe("statement");
      expect(citationsFor(id).length).toBeGreaterThan(0);
      expect(citationsFor(id).every(({ locator }) => locator.length > 0)).toBe(true);
    }
    const sourceIds = new Set(
      feminismStatementIds.flatMap((id) =>
        citationsFor(id).map(({ object }) => object.id),
      ),
    );
    expect(sourceIds.size).toBeGreaterThanOrEqual(10);
  });

  it("keeps traditions explicitly non-inheriting", () => {
    const traditionIds = [
      "liberal-feminism",
      "socialist-feminism",
      "marxist-feminism",
      "radical-feminism",
      "black-feminism",
      "postcolonial-decolonial-feminisms",
      "indigenous-feminisms",
      "transfeminism",
      "queer-feminisms",
    ];
    for (const id of traditionIds) {
      const relations = relationshipsFrom(id);
      expect(relations).toHaveLength(1);
      expect(relations[0]).toMatchObject({
        predicate: "member-of",
        object: { kind: "collection", id: "feminist-traditions" },
        status: "qualified",
      });
    }
    expect(JSON.stringify(relationshipsFrom("feminist-traditions"))).not.toMatch(
      /advances-end|advocates-means|applies-to-case/,
    );
  });

  it("keeps three cases bounded and distinguishes rule, use, and outcome slots", () => {
    const cases = [
      "combahee-river-collective-1974-1980",
      "sewa-ahmedabad-1972-1981",
      "iceland-parental-leave-2000-2013",
    ].map((id) => entityById(id));
    expect(cases.every((entry) => entry?.kind === "case")).toBe(true);
    expect(new Set(cases.flatMap((entry) => (entry?.kind === "case" ? entry.locationIds : []))).size).toBe(3);

    const iceland = entityById("iceland-parental-leave-outcomes-episode");
    expect(iceland).toMatchObject({
      kind: "case-episode",
      formalRuleStatementIds: ["iceland-leave-enacted-design"],
      ruleInUseStatementIds: ["iceland-fathers-uptake"],
      outcomeStatementIds: ["iceland-care-work-outcomes"],
    });
    expect(JSON.stringify(canonicalGraph.relationships)).not.toContain(
      '"predicate":"embodied"',
    );
  });

  it("publishes the four focused unresolved boundary questions", () => {
    const guide = subjectGuideById("guide-feminism");
    const open = guide?.sections.find(({ role }) => role === "open-questions");
    expect(open?.researchObligationIds).toEqual([
      "feminism-universal-subject-exclusion",
      "feminism-translation-nonwestern-naming",
      "feminism-sex-gender-trans-boundaries",
      "feminism-policy-attribution-causal-effects",
    ]);
  });
});
