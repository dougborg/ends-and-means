import { describe, expect, it } from "vitest";
import { canonicalGraph, citationsFor, entitiesOfKind, relationshipsFrom } from "../../src/lib/domain/canonical";

describe("canonical vertical slice", () => {
  it("compiles only the reviewed modular authoring records", () => {
    expect(canonicalGraph.entities.every(({ publicationStatus }) => publicationStatus === "reviewed")).toBe(true);
    expect(new Set(canonicalGraph.entities.map(({ id }) => id)).size).toBe(canonicalGraph.entities.length);
    expect(canonicalGraph.relationships.map(({ id }) => id)).toContain("enacted-funds-used-fund-boards");
    expect(entitiesOfKind("approach").map(({ id }) => id)).toEqual(["swedish-wage-earner-fund-program"]);
    expect(entitiesOfKind("case").map(({ id }) => id)).toEqual(["swedish-wage-earner-funds"]);
  });

  it("publishes a sourced before/change/after sequence", () => {
    const transitions = entitiesOfKind("transition");
    expect(transitions).toHaveLength(1);
    expect(transitions[0]?.fromEpisodeIds).toEqual(["enacted-wage-earner-funds-1984-1991"]);
    expect(transitions[0]?.toEpisodeIds).toEqual(["liquidation-board-period-1992"]);
    expect(entitiesOfKind("event").map(({ id }) => id)).toEqual(["wage-earner-fund-board-abolition"]);
  });

  it("keeps multiple evidence roles and locators on one Statement", () => {
    const citations = citationsFor("funds-partial-instantiation");
    expect(citations.map(({ role }) => role)).toEqual(["supports", "qualifies"]);
    expect(citations.every(({ locator }) => locator.length > 0)).toBe(true);
  });

  it("connects the bounded episode without claiming it embodies an ideology", () => {
    const relations = relationshipsFrom("enacted-wage-earner-funds-1984-1991");
    expect(relations.some(({ predicate }) => predicate === "partially-instantiated")).toBe(true);
    expect(relations.some(({ predicate }) => predicate === "used-means")).toBe(true);
    expect(JSON.stringify(relations)).not.toContain('"predicate":"embodied"');
  });
});
