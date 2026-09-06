import { describe, expect, it } from "vitest";
import {
  canonicalGraph,
  citationsFor,
  entitiesOfKind,
  entityById,
  placementsForDimension,
  relationshipsFrom,
  relationshipsTo,
  requireEntityOfKind,
} from "../../src/lib/domain/canonical";

describe("canonical vertical slice", () => {
  it("compiles only the reviewed modular authoring records", () => {
    expect(
      canonicalGraph.entities.every(
        ({ publicationStatus }) => publicationStatus === "reviewed",
      ),
    ).toBe(true);
    expect(new Set(canonicalGraph.entities.map(({ id }) => id)).size).toBe(
      canonicalGraph.entities.length,
    );
    expect(canonicalGraph.relationships.map(({ id }) => id)).toContain(
      "enacted-funds-used-fund-boards",
    );
    expect(entitiesOfKind("approach").map(({ id }) => id)).toEqual([
      "anarcho-syndicalist-organizing",
      "neo-republican-nondomination",
      "representative-democratic-government",
      "swedish-rehn-meidner-model",
      "swedish-wage-earner-fund-program",
      "us-wartime-production-mobilization",
    ]);
    expect(entitiesOfKind("case").map(({ id }) => id)).toEqual([
      "kahnawake-community-lawmaking",
      "spanish-anarchist-initiatives-1936-1939",
      "swedish-solidaristic-bargaining",
      "swedish-wage-earner-funds",
      "tawantinsuyu-imperial-organization",
      "us-controlled-materials-plan",
      "zapatista-autonomy-chiapas-1994-present",
    ]);
  });

  it("publishes a sourced before/change/after sequence", () => {
    const transition = entitiesOfKind("transition").find(({ id }) => id === "wage-earner-funds-to-liquidation");
    expect(transition?.fromEpisodeIds).toEqual([
      "enacted-wage-earner-funds-1984-1991",
    ]);
    expect(transition?.toEpisodeIds).toEqual([
      "liquidation-board-period-1992",
    ]);
    expect(entitiesOfKind("event").map(({ id }) => id)).toEqual([
      "wage-earner-fund-board-abolition",
      "zapatista-autonomy-reorganization-2023",
      "zapatista-caracoles-jbg-formation-2003",
    ]);
  });

  it("keeps multiple evidence roles and locators on one Statement", () => {
    const citations = citationsFor("funds-partial-instantiation");
    expect(citations.map(({ role }) => role)).toEqual([
      "supports",
      "qualifies",
    ]);
    expect(citations.every(({ locator }) => locator.length > 0)).toBe(true);
  });

  it("connects the bounded episode without claiming it embodies an ideology", () => {
    const relations = relationshipsFrom("enacted-wage-earner-funds-1984-1991");
    expect(
      relations.some(({ predicate }) => predicate === "partially-instantiated"),
    ).toBe(true);
    expect(relations.some(({ predicate }) => predicate === "used-means")).toBe(
      true,
    );
    expect(JSON.stringify(relations)).not.toContain('"predicate":"embodied"');
  });
});

describe("canonical comparison and lookup helpers", () => {
  it("publishes a descriptive Dimension with scoped episode Placements", () => {
    expect(entitiesOfKind("comparison-dimension").map(({ id }) => id)).toEqual([
      "collective-wage-earner-shareholding-authority",
    ]);
    const placements = canonicalGraph.relationships.filter(
      ({ predicate }) => predicate === "placed-on",
    );
    expect(placements).toHaveLength(2);
    expect(placements.map(({ subject }) => subject.id)).toEqual([
      "enacted-wage-earner-funds-1984-1991",
      "liquidation-board-period-1992",
    ]);
  });

  it("looks up canonical entities and both sides of their indexed relationships", () => {
    expect(
      entityById("collective-wage-earner-shareholding-authority")?.kind,
    ).toBe("comparison-dimension");
    expect(entityById("missing-entity")).toBeUndefined();
    expect(relationshipsFrom("missing-entity")).toEqual([]);
    expect(relationshipsTo("missing-entity")).toEqual([]);

    const incoming = relationshipsTo("swedish-wage-earner-fund-program");
    expect(incoming.length).toBeGreaterThan(0);
    expect(
      incoming.every(
        ({ object }) => object.id === "swedish-wage-earner-fund-program",
      ),
    ).toBe(true);
  });

  it("returns only Placements on the requested Dimension", () => {
    const placements = placementsForDimension(
      "collective-wage-earner-shareholding-authority",
    );
    expect(placements).toHaveLength(2);
    expect(
      placements.every(
        ({ predicate, object }) =>
          predicate === "placed-on" &&
          object.id === "collective-wage-earner-shareholding-authority",
      ),
    ).toBe(true);
    expect(placementsForDimension("missing-dimension")).toEqual([]);
  });

  it("fails clearly when a route requests a missing or mistyped canonical entity", () => {
    expect(() =>
      requireEntityOfKind("missing-dimension", "comparison-dimension"),
    ).toThrow("Expected canonical comparison-dimension missing-dimension");
    expect(() =>
      requireEntityOfKind("distribution", "comparison-dimension"),
    ).toThrow("Expected canonical comparison-dimension distribution");
  });
});
