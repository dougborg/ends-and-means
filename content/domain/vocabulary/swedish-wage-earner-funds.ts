import type { AuthoringDocument } from "../../../src/lib/domain";

const base = { publicationStatus: "reviewed" as const };

export const vocabularyDocuments = [
  { documentType: "entity", entity: { id: "political-economic-ideas", kind: "concept-scheme", label: "Political-economic ideas", description: "Concepts used to describe political and economic institutions.", scope: "A project vocabulary for contested political-economic ideas.", ...base } },
  { documentType: "entity", entity: { id: "institutional-domains", kind: "concept-scheme", label: "Institutional domains", description: "Domains in which authority, rules, and resources are organized.", scope: "Cross-cutting political, economic, social, legal, and cultural domains.", ...base } },
  { documentType: "entity", entity: { id: "social-democracy", kind: "concept", label: "Social democracy", description: "A contested family of approaches combining democratic politics with economic and social reform.", schemeIds: ["political-economic-ideas"], alternateLabels: ["social-democratic"], scopeNote: "Use for the broader contested concept; do not treat any government or policy as its complete embodiment.", ...base } },
  { documentType: "entity", entity: { id: "collective-capital-formation", kind: "concept", label: "Collective capital formation", description: "Institutional arrangements that accumulate capital through collectively governed funds.", schemeIds: ["political-economic-ideas"], scopeNote: "Distinguish collective accumulation from direct worker ownership or state ownership.", ...base } },
  { documentType: "entity", entity: { id: "institutional-abolition", kind: "concept", label: "Institutional abolition", description: "The legal termination of an institution or governing body.", schemeIds: ["political-economic-ideas"], scopeNote: "Use as an Event kind; it does not by itself explain why an institution ended or what replaced it.", ...base } },
  { documentType: "entity", entity: { id: "ownership-and-control", kind: "domain", label: "Ownership and control", description: "How claims over productive assets and decision authority are distributed.", sphere: "cross-cutting", schemeIds: ["institutional-domains"], ...base } },
] satisfies AuthoringDocument[];
