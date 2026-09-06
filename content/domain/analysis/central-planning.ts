import type { AuthoringDocument } from "../../../src/lib/domain";

const reviewed = { publicationStatus: "reviewed" as const };

export const centralPlanningAnalysisDocuments = [
  { documentType: "entity", entity: { id: "planning-information-and-coordination", kind: "challenge", label: "Planning information and coordination", description: "How a planning process obtains, reconciles, and updates dispersed requirements and supply information.", question: "How can planners coordinate interdependent production when requirements, capacity, inventories, and priorities change?", rationale: "Plans depend on information supplied by differently situated agencies and producers, and errors can propagate through linked schedules.", ...reviewed } },
  { documentType: "entity", entity: { id: "planning-correctability", kind: "criterion", label: "Planning correctability", description: "An evaluative lens for detecting and revising material planning errors without hiding their costs.", definition: "Can affected institutions identify shortages or excess claims, revise allocations in time, and document who bears the adjustment?", evidenceRequirements: ["Formal revision rules and timing.", "Records of changed requirements, allotments, shortages, and resulting production adjustments."], normativeAssumptions: ["Institutions exercising binding allocation power should make consequential errors detectable and corrigible."], limitations: ["Fast revision does not establish democratic accountability, distributive fairness, or efficient outcomes."], ...reviewed } },
] satisfies AuthoringDocument[];
