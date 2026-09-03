import { describe, expect, it } from "vitest";
import framework from "../../content/framework/draft.json";
import slice from "../../content/framework/social-democratic-slice.json";
import { validateEvidenceSlice } from "../../src/lib/framework/validate-slice";

const context = {
  traditions: new Set(framework.traditions.map(({ id }) => id)),
  challenges: new Set(framework.challenges.map(({ id }) => id)),
  criteria: new Set(framework.criteria.map(({ id }) => id)),
};

describe("social-democratic evidence slice", () => {
  it("resolves every canonical and internal relationship", () => {
    expect(validateEvidenceSlice(slice, context)).toEqual([]);
  });

  it("keeps cases bounded and statements qualified", () => {
    expect(slice.cases).toHaveLength(2);
    expect(slice.cases.every(({ period, boundary }) => period.length > 0 && boundary.length > 80)).toBe(true);
    expect(slice.cases.flatMap(({ statements }) => statements).every(({ limitation, sourceIds }) => limitation.length > 0 && sourceIds.length > 0)).toBe(true);
  });
});
