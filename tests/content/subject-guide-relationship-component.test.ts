import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { describe, expect, it } from "vitest";
import type { DomainRelationship } from "../../src/lib/domain";
import SubjectGuideRelationshipDetails from "../../src/components/SubjectGuideRelationshipDetails.astro";

const common = {
  status: "contested" as const,
  statementIds: ["statement"] as string[],
  scope: {
    startDate: "1984",
    endDate: "1991",
    placeIds: ["sweden"] as string[],
    note: "Only the enacted regional program.",
  },
};

const relationships = [
  { ...common, id: "membership", predicate: "member-of", subject: { kind: "concept", id: "concept" }, object: { kind: "collection", id: "collection" }, membership: "widely-accepted" },
  { ...common, id: "implementation", predicate: "used-means", subject: { kind: "case", id: "case" }, object: { kind: "means", id: "means" }, implementation: "rules-in-use" },
  { ...common, id: "conclusion", predicate: "assessed-by", subject: { kind: "case", id: "case" }, object: { kind: "criterion", id: "criterion" }, conclusion: "mixed" },
  { ...common, id: "interpretation", predicate: "interprets-concept", subject: { kind: "approach", id: "approach" }, object: { kind: "concept", id: "concept" }, role: "contested", interpretation: "A bounded synthetic interpretation." },
  { ...common, id: "placement", predicate: "placed-on", subject: { kind: "case", id: "case" }, object: { kind: "comparison-dimension", id: "dimension" }, value: { kind: "range", fromCategoryId: "low", toCategoryId: "high" }, basis: "case-observation", uncertainty: "Evidence varies by period." },
] satisfies DomainRelationship[];

describe("SubjectGuide relationship detail component", () => {
  it("renders dense canonical qualifications through a native disclosure", async () => {
    const container = await AstroContainer.create();
    const rendered = await Promise.all(relationships.map((relationship) =>
      container.renderToString(SubjectGuideRelationshipDetails, {
        props: {
          relationship,
          entityLabel: (id: string) => id === "sweden" ? "Sweden" : undefined,
          placementValueLabel: () => "Low to high",
        },
      })
    ));
    const html = rendered.join("\n");

    expect(html.match(/<details/g)).toHaveLength(relationships.length);
    expect(html).toContain("How to read this connection");
    for (const value of [
      "contested",
      "Membership",
      "widely accepted",
      "1984–1991",
      "Sweden",
      "Only the enacted regional program.",
      "rules in use",
      "mixed",
      "A bounded synthetic interpretation.",
      "Low to high",
      "case observation",
      "Evidence varies by period.",
    ]) expect(html).toContain(value);
  });
});
