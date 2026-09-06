import type { AuthoringDocument } from "../../../src/lib/domain";

const episode = { kind: "case-episode" as const, id: "zapatista-caracol-jbg-episode-2003-2023" };
const citations = [
  ["zapatista-autonomy-indigenous-context", "forbis-exercising-rights-source", "chapter 4, pp. 163–170", "supports"],
  ["jbg-formation-declaration", "ezln-thirteenth-stele-source", "paragraphs 30–31", "supports"],
  ["jbg-formal-delegation", "ezln-thirteenth-stele-source", "paragraph 31", "supports"],
  ["jbg-formal-division-of-functions", "ezln-thirteenth-stele-source", "paragraphs 24–33", "supports"],
  ["jbg-declared-ezln-oversight", "ezln-thirteenth-stele-source", "paragraph 34", "supports"],
  ["jbg-rotation-rules-in-use", "zapatista-autonomous-government-one-source", "pp. 11–18, 38–42, 55–56", "supports"],
  ["jbg-gender-participation-limit", "zapatista-autonomous-government-one-source", "pp. 54–56", "supports"],
  ["jbg-external-project-control", "andrews-political-autonomy-source", "pp. 101–107", "supports"],
  ["jbg-civil-military-authority-limit", "ross-autonomist-critique-source", "pp. 542–544", "supports"],
  ["zapatista-reach-limit", "forbis-exercising-rights-source", "chapter 4, pp. 171–183", "supports"],
  ["zapatista-reach-limit", "stahler-sholk-autonomies-source", "‘Indigenous and Campesino Autonomies in Mexico’, paragraphs 3–7", "qualifies"],
  ["zapatista-2023-reorganization-declaration", "ezln-new-autonomy-structure-source", "paragraphs 20–28", "supports"],
  ["zapatista-2023-caracoles-continuity", "ezln-new-autonomy-structure-source", "paragraph 28", "supports"],
  ["zapatista-2023-practice-open", "ezln-new-autonomy-structure-source", "paragraphs 18–19 and 28", "supports"],
  ["zapatista-anarchism-boundary", "ross-autonomist-critique-source", "pp. 529–535 and 542–544", "context"],
  ["zapatista-anarchism-boundary", "forbis-exercising-rights-source", "chapter 4, pp. 163–192", "supports"],
  ["zapatista-accountability-assessment", "zapatista-autonomous-government-one-source", "pp. 38–42 and 54–56", "supports"],
  ["zapatista-accountability-assessment", "ross-autonomist-critique-source", "pp. 542–544", "qualifies"],
] as const;

export const zapatistaCaracolesRelationshipDocuments = [
  { documentType: "relationships", subject: episode, relationships: [
    { id: "zapatista-jbg-episode-used-rotation", predicate: "used-means", subject: episode, object: { kind: "means", id: "rotating-municipal-delegation" }, implementation: "mixed", status: "qualified", statementIds: ["jbg-formal-delegation", "jbg-rotation-rules-in-use", "jbg-gender-participation-limit"] },
    { id: "zapatista-jbg-episode-assessed-accountability", predicate: "assessed-by", subject: episode, object: { kind: "criterion", id: "affected-community-accountability" }, conclusion: "mixed", status: "qualified", statementIds: ["zapatista-accountability-assessment"] },
    { id: "zapatista-jbg-episode-applies-indigenous-autonomy", predicate: "applies-to-case", subject: episode, object: { kind: "concept", id: "indigenous-autonomy" }, status: "asserted", statementIds: ["zapatista-autonomy-indigenous-context"] },
    { id: "zapatista-jbg-episode-contested-anarchism", predicate: "contested-in-case", subject: episode, object: { kind: "concept", id: "anarchism" }, status: "qualified", statementIds: ["zapatista-anarchism-boundary"] },
  ] },
  { documentType: "relationships", subject: { kind: "criterion", id: "affected-community-accountability" }, relationships: [{ id: "affected-community-accountability-evaluates-authority", predicate: "evaluates-response-to", subject: { kind: "criterion", id: "affected-community-accountability" }, object: { kind: "challenge", id: "authority-and-accountability" }, status: "qualified", statementIds: ["zapatista-accountability-assessment"] }] },
  ...citations.map(([statementId, sourceId, locator, role], index): AuthoringDocument => ({ documentType: "relationships", subject: { kind: "statement", id: statementId }, relationships: [{ id: `${statementId}-zapatista-citation-${index + 1}`, predicate: "cites", subject: { kind: "statement", id: statementId }, object: { kind: "source", id: sourceId }, role, locator }] })),
] satisfies AuthoringDocument[];
