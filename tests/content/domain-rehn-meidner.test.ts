import { describe, expect, it } from "vitest";
import { canonicalGraph, citationsFor, relationshipsFrom, requireEntityOfKind } from "../../src/lib/domain/canonical";

describe("canonical Rehn–Meidner conversion", () => {
  it("keeps the proposed model, institutional Means, and bounded Case distinct", () => {
    expect(requireEntityOfKind("swedish-rehn-meidner-model", "approach").kind).toBe("approach");
    expect(requireEntityOfKind("solidaristic-wage-bargaining", "means").kind).toBe("means");
    expect(requireEntityOfKind("active-labor-market-adjustment", "means").kind).toBe("means");
    expect(requireEntityOfKind("restrictive-macroeconomic-demand-management", "means").kind).toBe("means");
    expect(requireEntityOfKind("swedish-solidaristic-bargaining", "case").kind).toBe("case");
    expect(relationshipsFrom("swedish-rehn-meidner-model").filter(({ predicate }) => predicate === "advocates-means").map(({ object }) => object.id)).toEqual([
      "active-labor-market-adjustment",
      "restrictive-macroeconomic-demand-management",
      "solidaristic-wage-bargaining",
    ]);
  });

  it("represents Swedish practice as a qualified partial instantiation", () => {
    const relationships = relationshipsFrom("centralized-solidaristic-bargaining-1956-1983");
    const instantiation = relationships.find(({ predicate }) => predicate === "partially-instantiated");
    expect(instantiation?.object.id).toBe("swedish-rehn-meidner-model");
    expect(instantiation).toMatchObject({ status: "qualified" });
    expect(relationships.filter(({ predicate }) => predicate === "used-means")).toHaveLength(2);
  });

  it("keeps each Means independent rather than carrying the legacy compound record", () => {
    const meansIds = canonicalGraph.entities.filter(({ kind }) => kind === "means").map(({ id }) => id);
    expect(meansIds).toContain("solidaristic-wage-bargaining");
    expect(meansIds).toContain("active-labor-market-adjustment");
    expect(meansIds).toContain("restrictive-macroeconomic-demand-management");
    expect(meansIds).not.toContain("solidaristic-bargaining-and-adjustment");
  });

  it("provides located evidence for each promoted Rehn–Meidner Statement", () => {
    // Select by the IDs owned by this conversion rather than relying on file order.
    const ids = [
      "rehn-meidner-declared-objectives",
      "rehn-meidner-policy-combination",
      "centralized-solidaristic-bargaining-form",
      "active-labor-market-adjustment-design",
      "restrictive-macroeconomic-policy-design",
      "swedish-active-labor-market-policy-expansion",
      "rehn-meidner-partial-swedish-application",
      "rehn-meidner-social-democratic-context",
      "solidaristic-wage-compression-timing",
      "wage-compression-restructuring-qualification",
      "interindustry-compression-productivity-result",
      "rehn-meidner-distribution-assessment",
    ];
    for (const id of ids) {
      const citations = citationsFor(id);
      expect(citations.length, id).toBeGreaterThan(0);
      expect(citations.every(({ locator }) => locator.trim().length > 0), id).toBe(true);
    }
  });
});
