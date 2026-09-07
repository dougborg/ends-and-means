import { describe, expect, it } from "vitest";
import {
  canonicalGraph,
  citationsFor,
  entityById,
  subjectGuideById,
} from "../../src/lib/domain/canonical";

const statementIds = [
  "welfare-state-institutional-category",
  "welfare-regime-analytical-category",
  "social-protection-category-boundary",
  "public-spending-insufficient",
  "welfare-political-regime-boundary",
  "welfare-economic-order-boundary",
  "welfare-outcome-boundary",
  "welfare-design-facets",
  "welfare-benefit-forms",
  "social-insurance-assistance-boundary",
  "universal-categorical-boundary",
  "welfare-mixed-provision",
  "welfare-provider-boundaries",
  "esping-welfare-regime-typology",
  "esping-typology-boundary",
  "care-social-reproduction-boundary",
  "esping-decommodification-purpose",
  "orloff-decommodification-limit",
  "social-care-welfare-mix",
  "welfare-attributed-purposes",
  "beveridge-proposal-boundary",
  "beveridge-population-policy",
  "uk-national-insurance-formal-rule",
  "uk-nhs-formal-rule",
  "uk-nhs-scotland-formal-rule",
  "uk-assistance-formal-rule",
  "britain-welfare-case-limit",
  "costa-rica-ccss-formation",
  "costa-rica-universalization-mandate",
  "costa-rica-1973-hospital-transfer",
  "costa-rica-1973-health-right",
  "costa-rica-financing-access",
  "costa-rica-welfare-case-limit",
  "korea-democratization-expansion",
  "korea-labor-discipline-purpose",
  "korea-crisis-coverage-gap",
  "korea-employment-insurance-expansion",
  "korea-public-works-response",
  "korea-assistance-response",
  "korea-2008-coverage-gap",
  "korea-reform-outcome-limit",
  "korea-authoritarian-democratic-boundary",
  "korea-selective-political-provision",
  "south-korea-welfare-case-limit",
] as const;

const caseIds = [
  "britain-welfare-state-formation-1942-1951",
  "costa-rica-social-insurance-health-1941-1973",
  "south-korea-welfare-expansion-1988-2008",
] as const;

const obligationIds = [
  "welfare-state-unpaid-care-distribution",
  "welfare-state-formal-access-exclusion",
  "welfare-state-authoritarian-provision",
  "welfare-state-nonstate-provision-boundary",
  "costa-rica-health-counterfactual",
  "south-korea-distribution-counterfactual",
] as const;

describe("foundational Welfare State guide", () => {
  it("publishes the required evidence, case, and open-question floor", () => {
    expect(statementIds.length).toBeGreaterThanOrEqual(18);
    const sources = new Set<string>();
    for (const id of statementIds) {
      expect(entityById(id)?.kind).toBe("statement");
      const citations = citationsFor(id);
      expect(citations.length).toBeGreaterThan(0);
      expect(citations.every(({ locator }) => locator.length > 0)).toBe(true);
      citations.forEach(({ object }) => {
        sources.add(object.id);
      });
    }
    expect(sources.size).toBeGreaterThanOrEqual(9);
    for (const id of caseIds) expect(entityById(id)?.kind).toBe("case");
    for (const id of obligationIds)
      expect(entityById(id)?.kind).toBe("research-obligation");
  });

  it("keeps proposals, formal rules, interactions, and outcomes separate", () => {
    expect(entityById("britain-welfare-state-formation-episode")).toMatchObject({
      kind: "case-episode",
      conditionStatementIds: ["beveridge-proposal-boundary"],
      formalRuleStatementIds: [
        "uk-national-insurance-formal-rule",
        "uk-nhs-formal-rule",
        "uk-nhs-scotland-formal-rule",
        "uk-assistance-formal-rule",
      ],
      ruleInUseStatementIds: [],
      interactionStatementIds: [],
      outcomeStatementIds: [],
    });
    expect(entityById("south-korea-welfare-expansion-episode")).toMatchObject({
      kind: "case-episode",
      formalRuleStatementIds: ["korea-employment-insurance-expansion"],
      ruleInUseStatementIds: [],
      interactionStatementIds: [
        "korea-public-works-response",
        "korea-assistance-response",
        "korea-2008-coverage-gap",
      ],
      outcomeStatementIds: ["korea-reform-outcome-limit"],
    });
  });

  it("keeps Welfare State independent from ideology and political regime", () => {
    const concept = entityById("welfare-state");
    expect(concept).toMatchObject({ kind: "concept" });
    expect(concept).not.toHaveProperty("value");
    for (const id of caseIds) {
      expect(
        canonicalGraph.relationships.some(
          ({ subject, object }) =>
            subject.id === id && object.id === "welfare-state",
        ),
      ).toBe(false);
    }
    expect(
      canonicalGraph.relationships
        .filter(({ subject }) => subject.id === "welfare-state")
        .map(({ object }) => object.id),
    ).toEqual(["capitalism", "social-democracy", "socialism"]);
  });

  it("composes a substantive guide without public workflow language", () => {
    const guide = subjectGuideById("guide-welfare-state");
    expect(guide?.description).toContain("pooling social risks");
    expect(guide?.description).not.toMatch(
      /learner|journey|path|workflow|pull request/i,
    );
    expect(guide?.sections.map(({ role }) => role)).toEqual([
      "short-answer",
      "meanings-and-boundaries",
      "institutions-and-mechanisms",
      "purposes-and-diagnoses",
      "bounded-practice",
      "variants-and-disputes",
      "comparisons-and-next-steps",
      "open-questions",
    ]);
  });
});
