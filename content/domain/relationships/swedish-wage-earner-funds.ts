import type { AuthoringDocument } from "../../../src/lib/domain";

export const relationshipDocuments = [
  {
    documentType: "relationships",
    subject: { kind: "approach", id: "swedish-wage-earner-fund-program" },
    relationships: [
      { id: "wage-earner-program-interprets-social-democracy", predicate: "interprets-concept", subject: { kind: "approach", id: "swedish-wage-earner-fund-program" }, object: { kind: "concept", id: "social-democracy" }, role: "core", interpretation: "A bounded Swedish program within a broader and internally diverse social-democratic family.", status: "qualified", statementIds: ["funds-partial-instantiation"] },
      { id: "wage-earner-program-collective-capital", predicate: "interprets-concept", subject: { kind: "approach", id: "swedish-wage-earner-fund-program" }, object: { kind: "concept", id: "collective-capital-formation" }, role: "core", interpretation: "Collective funds accumulate capital claims without automatically granting direct worker control.", status: "qualified", statementIds: ["funds-statutory-design", "funds-limited-control"] },
      { id: "wage-earner-program-ownership-domain", predicate: "addresses-domain", subject: { kind: "approach", id: "swedish-wage-earner-fund-program" }, object: { kind: "domain", id: "ownership-and-control" }, centrality: "defining", status: "asserted", statementIds: ["funds-declared-ends"] },
      { id: "wage-earner-program-advances-influence", predicate: "advances-end", subject: { kind: "approach", id: "swedish-wage-earner-fund-program" }, object: { kind: "end", id: "wage-earner-influence" }, status: "qualified", statementIds: ["funds-declared-ends"] },
      { id: "wage-earner-program-advocates-fund-boards", predicate: "advocates-means", subject: { kind: "approach", id: "swedish-wage-earner-fund-program" }, object: { kind: "means", id: "regional-wage-earner-fund-boards" }, status: "asserted", statementIds: ["funds-statutory-design"] },
      { id: "wage-earner-program-distribution-challenge", predicate: "responds-to", subject: { kind: "approach", id: "swedish-wage-earner-fund-program" }, object: { kind: "challenge", id: "distribution-of-gains-and-ownership" }, status: "asserted", statementIds: ["funds-declared-ends"] },
      { id: "wage-earner-program-accountability-challenge", predicate: "responds-to", subject: { kind: "approach", id: "swedish-wage-earner-fund-program" }, object: { kind: "challenge", id: "authority-and-accountability" }, status: "qualified", statementIds: ["funds-accountability-assessment"] },
    ],
  },
  {
    documentType: "relationships",
    subject: { kind: "criterion", id: "distribution" },
    relationships: [{ id: "distribution-evaluates-distribution-challenge", predicate: "evaluates-response-to", subject: { kind: "criterion", id: "distribution" }, object: { kind: "challenge", id: "distribution-of-gains-and-ownership" }, status: "asserted", statementIds: ["funds-distribution-assessment"] }],
  },
  {
    documentType: "relationships",
    subject: { kind: "criterion", id: "accountability" },
    relationships: [{ id: "accountability-evaluates-authority-challenge", predicate: "evaluates-response-to", subject: { kind: "criterion", id: "accountability" }, object: { kind: "challenge", id: "authority-and-accountability" }, status: "asserted", statementIds: ["funds-accountability-assessment"] }],
  },
  {
    documentType: "relationships",
    subject: { kind: "case-episode", id: "enacted-wage-earner-funds-1984-1991" },
    relationships: [
      { id: "enacted-funds-partially-instantiated-program", predicate: "partially-instantiated", subject: { kind: "case-episode", id: "enacted-wage-earner-funds-1984-1991" }, object: { kind: "approach", id: "swedish-wage-earner-fund-program" }, status: "qualified", statementIds: ["funds-partial-instantiation"] },
      { id: "enacted-funds-used-fund-boards", predicate: "used-means", subject: { kind: "case-episode", id: "enacted-wage-earner-funds-1984-1991" }, object: { kind: "means", id: "regional-wage-earner-fund-boards" }, implementation: "mixed", status: "qualified", statementIds: ["funds-statutory-design", "funds-practice"] },
      { id: "enacted-funds-assessed-distribution", predicate: "assessed-by", subject: { kind: "case-episode", id: "enacted-wage-earner-funds-1984-1991" }, object: { kind: "criterion", id: "distribution" }, conclusion: "mixed", status: "qualified", statementIds: ["funds-distribution-assessment"] },
      { id: "enacted-funds-assessed-accountability", predicate: "assessed-by", subject: { kind: "case-episode", id: "enacted-wage-earner-funds-1984-1991" }, object: { kind: "criterion", id: "accountability" }, conclusion: "inconclusive", status: "qualified", statementIds: ["funds-accountability-assessment"] },
    ],
  },
  ...([
    ["funds-declared-ends", "swedish-wage-earner-funds-proposition", "sections 2.1–2.3", "supports"],
    ["funds-statutory-design", "swedish-wage-earner-funds-proposition", "sections 2.2–2.3 and proposed statutes", "supports"],
    ["funds-practice", "westerberg-marxist-venture-source", "pp. 1021–1030", "supports"],
    ["funds-limited-control", "westerberg-marxist-venture-source", "pp. 1025–1031", "supports"],
    ["funds-abolished", "abolition-wage-earner-funds-proposition", "proposal summary and sections 2–3", "supports"],
    ["funds-partial-instantiation", "swedish-wage-earner-funds-proposition", "sections 2.1–2.3", "supports"],
    ["funds-partial-instantiation", "westerberg-marxist-venture-source", "pp. 1014–1037", "qualifies"],
    ["funds-distribution-assessment", "swedish-wage-earner-funds-proposition", "sections 2.1–2.3", "context"],
    ["funds-distribution-assessment", "westerberg-marxist-venture-source", "pp. 1025–1031", "supports"],
    ["funds-accountability-assessment", "swedish-wage-earner-funds-proposition", "section 2.3.4", "supports"],
    ["funds-accountability-assessment", "abolition-wage-earner-funds-proposition", "proposal summary and sections 2–3", "qualifies"],
  ] as const).map(([statementId, sourceId, locator, role], index) => ({
    documentType: "relationships" as const,
    subject: { kind: "statement" as const, id: statementId },
    relationships: [{ id: `${statementId}-citation-${index + 1}`, predicate: "cites" as const, subject: { kind: "statement" as const, id: statementId }, object: { kind: "source" as const, id: sourceId }, role, locator }],
  })),
] satisfies AuthoringDocument[];
