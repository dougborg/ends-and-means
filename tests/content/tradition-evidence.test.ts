import { describe, expect, it } from "vitest";
import framework from "../../content/framework/draft.json";
import evidence from "../../content/framework/social-democratic-tradition-evidence.json";
import { validateTraditionEvidence } from "../../src/lib/framework/validate-tradition-evidence";

const context = {
  traditions: new Set(framework.traditions.map(({ id }) => id)),
  challenges: new Set(framework.challenges.map(({ id }) => id)),
  criteria: new Set(framework.criteria.map(({ id }) => id)),
};

describe("social-democratic tradition evidence", () => {
  it("is in the post-review state represented by this promotion", () => {
    expect(evidence.status).toBe("published");
  });

  it("resolves every canonical and internal relationship", () => {
    expect(validateTraditionEvidence(evidence, context)).toEqual([]);
  });

  it("references canonical Challenge and Criterion records without duplicating them", () => {
    expect(framework.challenges.some(({ id }) => id === evidence.trace.challengeId)).toBe(true);
    expect(framework.criteria.some(({ id }) => id === evidence.trace.criterionId)).toBe(true);
    expect(evidence.trace).not.toHaveProperty("question");
    expect(evidence.trace).not.toHaveProperty("criterion");
  });

  it("keeps cases bounded and statements qualified", () => {
    expect(evidence.cases).toHaveLength(2);
    expect(evidence.cases.every(({ period, boundary }) => period.length > 0 && boundary.length > 80)).toBe(true);
    expect(evidence.cases.flatMap(({ statements }) => statements).every(({ limitation, sourceIds }) => limitation.length > 0 && sourceIds.length > 0)).toBe(true);
  });
});
