import { describe, expect, it } from "vitest";
import { compileDomainGraph, validateAuthoringDocuments } from "../../src/lib/domain";
import type { AuthoringDocument, DomainEntity, DomainRelationship, EntityRef } from "../../src/lib/domain";

const entity = (value: DomainEntity): AuthoringDocument => ({ documentType: "entity", entity: value });
const relationships = (subject: EntityRef, values: DomainRelationship[]): AuthoringDocument => ({ documentType: "relationships", subject, relationships: values });
const base = { description: "A comparison-model fixture.", publicationStatus: "research-needed" as const };

const documents: AuthoringDocument[] = [
  entity({ id: "test-place", kind: "place", label: "Test place", placeType: "region", ...base }),
  entity({ id: "test-statement", kind: "statement", label: "Test statement", statementKind: "observation", text: "A fixture observation.", ...base }),
  entity({ id: "test-means", kind: "means", label: "Test means", institutionalForm: "A fixture mechanism.", ...base }),
  entity({
    id: "test-authority-dimension", kind: "comparison-dimension", label: "Test authority dimension",
    definition: "A bounded descriptive difference.", valueType: "ordinal",
    values: [
      { id: "absent", label: "Absent", description: "No authority.", order: 0 },
      { id: "limited", label: "Limited", description: "Limited authority.", order: 1 },
      { id: "substantial", label: "Substantial", description: "Substantial authority.", order: 2 },
    ],
    eligibleSubjectKinds: ["means"], method: "Read the formal rule and observed operation.",
    normativeChoices: ["Describe authority without judging it."], knownCorrelationIds: [],
    limitations: ["Does not measure outcomes."], statementIds: ["test-statement"], ...base,
  }),
  relationships({ kind: "means", id: "test-means" }, [{
    id: "test-means-authority-placement", predicate: "placed-on", subject: { kind: "means", id: "test-means" },
    object: { kind: "comparison-dimension", id: "test-authority-dimension" }, value: { kind: "range", fromCategoryId: "limited", toCategoryId: "substantial" },
    basis: "declared-design", uncertainty: "The fixture deliberately uses a range.", scope: { placeIds: ["test-place"], note: "A bounded fixture scope." },
    status: "qualified", statementIds: ["test-statement"],
  }]),
];

describe("Comparison Dimension and Placement model", () => {
  it("compiles a scoped range without creating an aggregate score", () => {
    const graph = compileDomainGraph(documents);
    const placement = graph.relationships.find((relationship): relationship is Extract<DomainRelationship, { predicate: "placed-on" }> => relationship.predicate === "placed-on");
    expect(placement?.value).toEqual({ kind: "range", fromCategoryId: "limited", toCategoryId: "substantial" });
    expect(JSON.stringify(graph)).not.toContain("score");
  });

  it("rejects ineligible subjects and unknown values", () => {
    const invalid = structuredClone(documents);
    const placementDocument = invalid[4];
    if (placementDocument?.documentType === "relationships") {
      const placement = placementDocument.relationships[0];
      if (placement?.predicate === "placed-on") placement.value = { kind: "category", categoryId: "midpoint" };
    }
    const dimensionDocument = invalid[3];
    if (dimensionDocument?.documentType === "entity" && dimensionDocument.entity.kind === "comparison-dimension") dimensionDocument.entity.eligibleSubjectKinds = ["approach"];
    const errors = validateAuthoringDocuments(invalid);
    expect(errors).toContain("test-means-authority-placement: subject kind means is not eligible for test-authority-dimension");
    expect(errors).toContain("test-means-authority-placement: unknown Dimension value midpoint");
  });

  it("requires explicit scope and uncertainty", () => {
    const invalid = structuredClone(documents);
    const placementDocument = invalid[4];
    if (placementDocument?.documentType === "relationships") {
      const placement = placementDocument.relationships[0];
      if (placement?.predicate === "placed-on") { placement.scope = {}; placement.uncertainty = " "; }
    }
    const errors = validateAuthoringDocuments(invalid);
    expect(errors).toContain("test-means-authority-placement: Placement uncertainty is empty");
    expect(errors).toContain("test-means-authority-placement: Placement requires an explicit scope");
  });

  it("reports a missing Placement scope instead of throwing", () => {
    const invalid = structuredClone(documents);
    const placementDocument = invalid[4];
    if (placementDocument?.documentType === "relationships") {
      const placement = placementDocument.relationships[0];
      if (placement?.predicate === "placed-on") delete (placement as unknown as { scope?: unknown }).scope;
    }
    expect(validateAuthoringDocuments(invalid)).toContain("test-means-authority-placement: Placement requires an explicit scope");
  });
});
