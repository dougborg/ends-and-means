import type { AuthoringDocument } from "../../../src/lib/domain";

const means = { kind: "means" as const, id: "controlled-materials-allocation" };
const approach = { kind: "approach" as const, id: "us-wartime-production-mobilization" };
const episode = { kind: "case-episode" as const, id: "cmp-operation-1943-1945" };
const facets = [
  ["authority", "cmp-authority"], ["scope", "cmp-scope"], ["information", "cmp-information"], ["targets", "cmp-targets"], ["revision", "cmp-revision"], ["enforcement", "cmp-enforcement"], ["ownership", "cmp-ownership"],
] as const;
const citations = [
  ["central-planning-family-boundary", "landon-lane-rockoff-cmp-source", "pp. 1–4", "context"],
  ["cmp-authority", "wpb-controlled-materials-plan-source", "summary pp. II–III; sections 2–4", "supports"],
  ["cmp-scope", "wpb-controlled-materials-plan-source", "summary p. II; sections 1 and 5", "supports"],
  ["cmp-information", "wpb-controlled-materials-plan-source", "sections 3–8", "supports"],
  ["cmp-targets", "wpb-controlled-materials-plan-source", "summary pp. II–III; sections 9–14", "supports"],
  ["cmp-revision", "wpb-war-production-1944-source", "‘The Controlled Materials Plan in 1944’, pp. 1–5", "supports"],
  ["cmp-enforcement", "wpb-controlled-materials-plan-source", "summary p. III; sections 15–18", "supports"],
  ["cmp-ownership", "koistinen-arsenal-source", "chapters 12–13, pp. 302–369", "qualifies"],
  ["cmp-operating-period", "millett-army-service-forces-source", "chapter VI, pp. 108–113", "supports"],
  ["cmp-distributed-administration", "wpb-war-production-1944-source", "‘The Controlled Materials Plan in 1944’, pp. 1–5", "supports"],
  ["cmp-success-interpretation", "landon-lane-rockoff-cmp-source", "pp. 1–4 and 24–27", "supports"],
  ["cmp-power-rival", "koistinen-arsenal-source", "chapter 8, pp. 195–217; chapter 12, pp. 302–339", "supports"],
  ["cmp-correctability-assessment", "wpb-war-production-1944-source", "‘The Controlled Materials Plan in 1944’, pp. 1–5", "supports"],
] as const;

export const centralPlanningRelationshipDocuments = [
  { documentType: "relationships", subject: means, relationships: [
    { id: "cmp-member-central-planning", predicate: "member-of", subject: means, object: { kind: "collection", id: "central-planning-arrangements" }, membership: "qualified", status: "qualified", statementIds: ["central-planning-family-boundary"] },
    ...facets.map(([facet, id]) => ({ id: `cmp-specified-${facet}`, predicate: "specified-by" as const, subject: means, object: { kind: "statement" as const, id }, facet, status: "asserted" as const, statementIds: [] })),
  ] },
  { documentType: "relationships", subject: approach, relationships: [
    { id: "us-mobilization-advocates-cmp", predicate: "advocates-means", subject: approach, object: means, status: "qualified", statementIds: ["cmp-operating-period", "cmp-distributed-administration"] },
    { id: "us-mobilization-responds-information", predicate: "responds-to", subject: approach, object: { kind: "challenge", id: "planning-information-and-coordination" }, status: "qualified", statementIds: ["cmp-information", "cmp-revision"] },
    { id: "us-mobilization-responds-accountability", predicate: "responds-to", subject: approach, object: { kind: "challenge", id: "authority-and-accountability" }, status: "contested", statementIds: ["cmp-power-rival"] },
  ] },
  { documentType: "relationships", subject: episode, relationships: [
    { id: "cmp-episode-partially-instantiated-mobilization", predicate: "partially-instantiated", subject: episode, object: approach, status: "qualified", statementIds: ["cmp-operating-period"] },
    { id: "cmp-episode-used-controlled-materials", predicate: "used-means", subject: episode, object: means, implementation: "strong", status: "asserted", statementIds: ["cmp-authority", "cmp-enforcement", "cmp-distributed-administration"] },
    { id: "cmp-episode-assessed-correctability", predicate: "assessed-by", subject: episode, object: { kind: "criterion", id: "planning-correctability" }, conclusion: "mixed", status: "qualified", statementIds: ["cmp-revision", "cmp-correctability-assessment"] },
  ] },
  ...citations.map(([statementId, sourceId, locator, role], index) => ({ documentType: "relationships" as const, subject: { kind: "statement" as const, id: statementId }, relationships: [{ id: `${statementId}-citation-${index + 1}`, predicate: "cites" as const, subject: { kind: "statement" as const, id: statementId }, object: { kind: "source" as const, id: sourceId }, role, locator }] })),
] satisfies AuthoringDocument[];
