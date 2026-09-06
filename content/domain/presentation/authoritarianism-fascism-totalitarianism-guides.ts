import type { AuthoringDocument } from "../../../src/lib/domain";
import { attachNarrative } from "./load-narrative";

const reviewed = { publicationStatus: "reviewed" as const, reviewedAt: "2026-09-06" };
const dossier = (
  id: "authoritarianism" | "fascism" | "totalitarianism",
  standfirstStatementIds: string[],
  sections: Extract<AuthoringDocument, { documentType: "entity" }>["entity"] extends infer _T ? any[] : never,
) => attachNarrative(`${id}.md`, {
  id: `${id}-dossier`, kind: "dossier" as const, label: `${id[0]?.toUpperCase()}${id.slice(1)} dossier`,
  description: `A learner-first guide to the meanings and boundaries of ${id}.`,
  subject: { kind: "concept" as const, id }, standfirst: "", standfirstStatementIds, sections, ...reviewed,
});

const authoritarianism = dossier("authoritarianism", ["authoritarian-linz-boundary", "authoritarian-practice-boundary", "authoritarian-autocracy-nonsynonym"], [
  { id: "definitions", heading: "Which definition is being used?", body: "", traceStatus: "qualified", statementIds: ["authoritarian-linz-boundary", "authoritarian-practice-boundary"] },
  { id: "neighbors", heading: "How do autocracy and dictatorship differ?", body: "", traceStatus: "qualified", statementIds: ["autocracy-operational-boundary", "dictatorship-varied-institutions", "dictatorship-history-boundary", "authoritarian-autocracy-nonsynonym"], relatedEntityRefs: [{ kind: "concept", id: "autocracy" }, { kind: "concept", id: "dictatorship" }] },
  { id: "totalitarian-boundary", heading: "Why is totalitarianism not just stronger authoritarianism?", body: "", traceStatus: "qualified", statementIds: ["authoritarian-not-totalitarian", "totalitarian-linz-definition"], relatedEntityRefs: [{ kind: "concept", id: "totalitarianism" }] },
  { id: "disputes", heading: "What remains disputed?", body: "", traceStatus: "qualified", statementIds: ["dictatorship-history-boundary", "authoritarian-practice-boundary", "authoritarian-autocracy-nonsynonym"] },
]);
const fascism = dossier("fascism", ["fascism-griffin-definition", "fascism-paxton-rival", "fascism-label-boundary"], [
  { id: "definitions", heading: "What makes a definition specifically fascist?", body: "", traceStatus: "qualified", statementIds: ["fascism-griffin-definition", "fascism-paxton-rival", "fascism-label-boundary"] },
  { id: "self-description", heading: "What did Italian Fascists claim?", body: "", traceStatus: "qualified", statementIds: ["fascism-self-description", "fascism-self-description-limit"], relatedEntityRefs: [{ kind: "approach", id: "historical-italian-fascism" }] },
  { id: "bounded-practice", heading: "When did movement become dictatorship in Italy?", body: "", traceStatus: "qualified", statementIds: ["italy-party-regime-boundary", "italy-dictatorship-transition"], relatedEntityRefs: [{ kind: "case", id: "italian-fascist-dictatorship-1925-1943" }] },
  { id: "variation", heading: "Can one definition erase variation?", body: "", traceStatus: "qualified", statementIds: ["fascism-crossnational-variation", "fascism-label-boundary"] },
]);
const totalitarianism = dossier("totalitarianism", ["totalitarian-linz-definition", "totalitarian-contested-category", "totalitarian-polemical-boundary"], [
  { id: "definitions", heading: "What does the classic regime type claim?", body: "", traceStatus: "qualified", statementIds: ["totalitarian-linz-definition", "totalitarian-arendt-boundary", "authoritarian-not-totalitarian"] },
  { id: "disputes", heading: "Why do scholars dispute the category?", body: "", traceStatus: "qualified", statementIds: ["totalitarian-contested-category", "totalitarian-polemical-boundary"] },
  { id: "label-history", heading: "How did the label travel?", body: "", traceStatus: "qualified", statementIds: ["totalitarian-label-history", "totalitarian-polemical-boundary"] },
  { id: "bounded-practice", heading: "What can the 1933 German case establish?", body: "", traceStatus: "qualified", statementIds: ["nazi-one-party-consolidation", "nazi-party-state-law", "nazi-control-limit", "totalitarian-case-nonembodiment"], relatedEntityRefs: [{ kind: "case", id: "nazi-consolidation-1933" }] },
]);

type Guide = Extract<AuthoringDocument, { documentType: "subject-guide" }>;
const guide = (id: "authoritarianism" | "fascism" | "totalitarianism", sections: Guide["guide"]["sections"]): Guide => ({
  documentType: "subject-guide",
  guide: {
    id: `guide-${id}`, slug: id, label: id[0]!.toUpperCase() + id.slice(1),
    description: `Distinguish the scholarly, historical, organizational, and polemical uses of ${id}.`,
    publicationStatus: "reviewed", primarySubject: { kind: "concept", id },
    searchQueries: [id, `${id} definition`, `${id} meaning`], disambiguation: [], sections, reviewedAt: "2026-09-06",
  },
});
const guideSections = (id: string): Guide["guide"]["sections"] => [
  { role: "short-answer", label: "Start with the short answer", dossierId: `${id}-dossier`, passageId: "standfirst" },
  { role: "meanings-and-boundaries", label: "Separate the meanings and boundaries", dossierId: `${id}-dossier`, passageId: "definitions" },
  { role: "bounded-practice", label: "Test the label against bounded practice", dossierId: `${id}-dossier`, passageId: id === "authoritarianism" ? "neighbors" : "bounded-practice" },
  { role: "open-question", label: "Keep the unresolved question visible", researchObligationIds: [id === "authoritarianism" ? "authoritarian-practice-regime-transfer" : id === "fascism" ? "fascism-crossregional-boundary" : "totalitarian-control-evidence"] },
  { role: "comparisons-and-next-steps", label: "Compare neighboring terms", dossierId: `${id}-dossier`, passageId: id === "fascism" ? "variation" : "disputes" },
];

export const authoritarianismFascismTotalitarianismGuideDocuments: AuthoringDocument[] = [
  authoritarianism, fascism, totalitarianism,
  guide("authoritarianism", guideSections("authoritarianism")),
  guide("fascism", guideSections("fascism")),
  guide("totalitarianism", guideSections("totalitarianism")),
];
