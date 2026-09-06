import { describe, expect, it } from "vitest";
import {
  canonicalGraph,
  citationsFor,
  entitiesOfKind,
  entityById,
  placementsForDimension,
  publicEntitiesOfKind,
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
      "historical-italian-fascism",
      "linz-regime-analysis",
      "neo-republican-nondomination",
      "representative-democratic-government",
      "swedish-rehn-meidner-model",
      "swedish-wage-earner-fund-program",
      "us-wartime-production-mobilization",
    ]);
    expect(entitiesOfKind("case").map(({ id }) => id)).toEqual([
      "bonjol-melayu-ulayat-governance",
      "china-dual-track-market-reforms",
      "combahee-river-collective-1974-1980",
      "english-agrarian-market-dependence",
      "gold-coast-cocoa-expansion",
      "iceland-parental-leave-2000-2018",
      "india-constitutional-rights-settlement-1946-1950",
      "italian-fascist-dictatorship-1925-1943",
      "japan-constitutional-rights-settlement-1946-1947",
      "jinst-postcollective-pastoral-governance",
      "kahnawake-community-lawmaking",
      "koto-tinggi-post-decentralization-governance",
      "nazi-consolidation-1933",
      "right-to-buy-england-wales-1980-1998",
      "ruwalla-borderland-organization",
      "sewa-ahmedabad-1972-1977",
      "spanish-anarchist-initiatives-1936-1939",
      "swatantra-opposition-organization-1959-1967",
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
      "zapatista-caracoles-jbg-formation-announced-2003",
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
  it("keeps nonlive entities out of public kind projections", () => {
    const reviewed = requireEntityOfKind("distribution", "criterion");
    const researchNeeded = {
      ...reviewed,
      id: "test-nonlive-criterion",
      publicationStatus: "research-needed" as const,
    };
    const graph = {
      ...canonicalGraph,
      entities: [...canonicalGraph.entities, researchNeeded],
    };

    expect(publicEntitiesOfKind("criterion", graph).map(({ id }) => id)).not.toContain(
      researchNeeded.id,
    );
  });

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
