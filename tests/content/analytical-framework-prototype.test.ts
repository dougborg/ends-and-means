import { describe, expect, it } from "vitest";
import prototype from "../../prototypes/analytical-framework/prototype.json";
import { validateAnalyticalPrototype } from "../../src/lib/prototype/validate";
import type { AnalyticalPrototype } from "../../src/lib/prototype/model";

const fixture = prototype as AnalyticalPrototype;

describe("analytical framework prototype", () => {
  it("connects one tradition, two Challenges, and two bounded cases", () => {
    expect(validateAnalyticalPrototype(fixture)).toEqual([]);
    expect(fixture.tradition.id).toBe("social-democratic-tradition");
    expect(fixture.challenges.map(({ id }) => id)).toEqual([
      "challenge-distribution-of-gains-and-ownership",
      "challenge-coordination-and-accountability",
    ]);
    expect(fixture.cases).toHaveLength(2);
  });

  it("preserves competing interpretations without deriving a score or verdict", () => {
    expect(fixture.interpretations.filter(({ target }) => target.id === "outcome-limited-control")).toHaveLength(2);
    expect(JSON.stringify(fixture)).not.toMatch(/"(score|weight|aggregate|verdict|derivedEvidence)"\s*:/i);
  });

  it("rejects scoring fields", () => {
    const scored = structuredClone(fixture) as AnalyticalPrototype & { score: number };
    scored.score = 8;
    expect(validateAnalyticalPrototype(scored).some((error) => error.includes("forbidden scoring"))).toBe(true);
  });

  it("rejects broken causal traces and unresolved interpretations", () => {
    const broken = structuredClone(fixture);
    broken.traces[0]!.outcomeIds = [];
    broken.interpretations[0]!.target.id = "missing-outcome";
    const errors = validateAnalyticalPrototype(broken);
    expect(errors).toContain("trace-sd-distribution-ownership: response trace has an empty causal link");
    expect(errors).toContain("interpretation-diluted: interpretation requires resolved target, attribution, and reasoning");
  });

  it("returns diagnostics for malformed JSON instead of throwing", () => {
    expect(validateAnalyticalPrototype(null)).toEqual(["prototype must be an object"]);
    expect(validateAnalyticalPrototype({})).toEqual(["prototype is missing required collections"]);
  });
});
