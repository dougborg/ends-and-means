import type { AuthoringDocument } from "../../../src/lib/domain";

const approach = { kind: "approach" as const, id: "swedish-rehn-meidner-model" };
const episode = { kind: "case-episode" as const, id: "centralized-solidaristic-bargaining-1956-1983" };

export const rehnMeidnerRelationshipDocuments = [
  {
    documentType: "relationships",
    subject: approach,
    relationships: [
      { id: "rehn-meidner-interprets-social-democracy", predicate: "interprets-concept", subject: approach, object: { kind: "concept", id: "social-democracy" }, role: "core", interpretation: "A named Swedish trade-union policy model that became influential in social-democratic policymaking without defining the broader tradition.", status: "qualified", statementIds: ["rehn-meidner-social-democratic-context"] },
      { id: "rehn-meidner-advances-equality-with-employment", predicate: "advances-end", subject: approach, object: { kind: "end", id: "equality-with-employment" }, status: "asserted", statementIds: ["rehn-meidner-declared-objectives"] },
      { id: "rehn-meidner-advocates-solidaristic-bargaining", predicate: "advocates-means", subject: approach, object: { kind: "means", id: "solidaristic-wage-bargaining" }, status: "asserted", statementIds: ["rehn-meidner-policy-combination", "centralized-solidaristic-bargaining-form"] },
      { id: "rehn-meidner-advocates-active-adjustment", predicate: "advocates-means", subject: approach, object: { kind: "means", id: "active-labor-market-adjustment" }, status: "asserted", statementIds: ["rehn-meidner-policy-combination", "active-labor-market-adjustment-design"] },
      { id: "rehn-meidner-advocates-restrictive-macroeconomic-policy", predicate: "advocates-means", subject: approach, object: { kind: "means", id: "restrictive-macroeconomic-demand-management" }, status: "asserted", statementIds: ["rehn-meidner-policy-combination", "restrictive-macroeconomic-policy-design"] },
      { id: "rehn-meidner-responds-to-distribution", predicate: "responds-to", subject: approach, object: { kind: "challenge", id: "distribution-of-gains-and-ownership" }, status: "qualified", statementIds: ["rehn-meidner-declared-objectives", "rehn-meidner-policy-combination"] },
    ],
  },
  {
    documentType: "relationships",
    subject: episode,
    relationships: [
      { id: "solidaristic-bargaining-partially-instantiated-rehn-meidner", predicate: "partially-instantiated", subject: episode, object: approach, status: "qualified", statementIds: ["rehn-meidner-partial-swedish-application"] },
      { id: "solidaristic-episode-used-wage-bargaining", predicate: "used-means", subject: episode, object: { kind: "means", id: "solidaristic-wage-bargaining" }, implementation: "mixed", status: "qualified", statementIds: ["centralized-solidaristic-bargaining-form", "rehn-meidner-partial-swedish-application"] },
      { id: "solidaristic-episode-used-active-adjustment", predicate: "used-means", subject: episode, object: { kind: "means", id: "active-labor-market-adjustment" }, implementation: "mixed", status: "qualified", statementIds: ["swedish-active-labor-market-policy-expansion", "rehn-meidner-partial-swedish-application"] },
      { id: "solidaristic-episode-assessed-distribution", predicate: "assessed-by", subject: episode, object: { kind: "criterion", id: "distribution" }, conclusion: "mixed", status: "qualified", statementIds: ["rehn-meidner-distribution-assessment", "solidaristic-wage-compression-timing", "wage-compression-restructuring-qualification"] },
    ],
  },
  ...([
    ["rehn-meidner-declared-objectives", "erixon-rehn-meidner-model-source", "pp. 677–681", "supports"],
    ["rehn-meidner-policy-combination", "erixon-rehn-meidner-model-source", "pp. 677–682", "supports"],
    ["centralized-solidaristic-bargaining-form", "erixon-rehn-meidner-model-source", "pp. 681–684", "supports"],
    ["centralized-solidaristic-bargaining-form", "hibbs-locking-wage-dispersion-source", "pp. 755–758 and note 3", "qualifies"],
    ["active-labor-market-adjustment-design", "erixon-rehn-meidner-model-source", "pp. 680–683", "supports"],
    ["restrictive-macroeconomic-policy-design", "erixon-rehn-meidner-model-source", "pp. 679–681", "supports"],
    ["swedish-active-labor-market-policy-expansion", "erixon-rehn-meidner-model-source", "pp. 683–684", "supports"],
    ["rehn-meidner-partial-swedish-application", "erixon-rehn-meidner-model-source", "pp. 683–684 and 704–705", "supports"],
    ["rehn-meidner-social-democratic-context", "erixon-rehn-meidner-model-source", "pp. 677–684 and 704–705", "supports"],
    ["solidaristic-wage-compression-timing", "molinder-solidaristic-wage-policy-source", "abstract", "supports"],
    ["wage-compression-restructuring-qualification", "molinder-solidaristic-wage-policy-source", "abstract", "supports"],
    ["interindustry-compression-productivity-result", "hibbs-locking-wage-dispersion-source", "abstract", "supports"],
    ["rehn-meidner-distribution-assessment", "molinder-solidaristic-wage-policy-source", "abstract", "supports"],
  ] as const).map(([statementId, sourceId, locator, role], index) => ({
    documentType: "relationships" as const,
    subject: { kind: "statement" as const, id: statementId },
    relationships: [{ id: `${statementId}-citation-${index + 1}`, predicate: "cites" as const, subject: { kind: "statement" as const, id: statementId }, object: { kind: "source" as const, id: sourceId }, role, locator }],
  })),
] satisfies AuthoringDocument[];
