import type { AuthoringDocument } from "../../../src/lib/domain";
import { attachNarrative } from "./load-narrative";

const dossier = attachNarrative("zapatista-caracoles.md", {
  id: "zapatista-caracoles-dossier",
  kind: "dossier" as const,
  label: "Zapatista caracoles and Good Government Councils dossier",
  description: "A bounded account of Zapatista civilian autonomy from the 2003 regional council design through its 2023 reorganization.",
  subject: { kind: "case" as const, id: "zapatista-autonomy-chiapas-1994-present" },
  standfirst: "",
  standfirstStatementIds: ["zapatista-autonomy-indigenous-context", "zapatista-2023-reorganization-declaration", "zapatista-2023-practice-open"],
  sections: [
    { id: "what-is-bounded", heading: "What is this case about?", body: "", traceStatus: "qualified" as const, statementIds: ["zapatista-autonomy-indigenous-context", "zapatista-european-theory-boundary", "zapatista-reach-limit", "zapatista-anarchist-resemblance", "zapatista-anarchism-boundary"], relatedEntityRefs: [{ kind: "concept" as const, id: "indigenous-autonomy" }, { kind: "organization" as const, id: "zapatista-army-national-liberation" }, { kind: "organization" as const, id: "zapatista-support-base-communities" }] },
    { id: "what-changed-in-2003", heading: "What changed in 2003?", body: "", traceStatus: "supported" as const, statementIds: ["jbg-formation-declaration", "jbg-formal-delegation", "jbg-formal-regional-functions", "jbg-formal-municipal-functions", "jbg-declared-ezln-oversight"], relatedEntityRefs: [{ kind: "event" as const, id: "zapatista-caracoles-jbg-formation-announced-2003" }, { kind: "organization" as const, id: "zapatista-caracoles" }, { kind: "organization" as const, id: "zapatista-good-government-councils" }] },
    { id: "how-did-it-work", heading: "How did the councils work in practice?", body: "", traceStatus: "qualified" as const, statementIds: ["jbg-rotation-rules-in-use", "jbg-rotation-learning-purpose", "jbg-reporting-practice", "jbg-accounting-practice", "jbg-external-project-control", "jbg-gender-participation-limit", "jbg-civil-military-authority-limit", "zapatista-hybrid-authority-interpretation", "zapatista-accountability-assessment"], relatedEntityRefs: [{ kind: "means" as const, id: "rotating-municipal-delegation" }, { kind: "challenge" as const, id: "authority-and-accountability" }, { kind: "criterion" as const, id: "affected-community-accountability" }] },
    { id: "what-changed-in-2023", heading: "What changed in 2023?", body: "", traceStatus: "qualified" as const, statementIds: ["zapatista-2023-reorganization-declaration", "zapatista-2023-caracoles-continuity", "zapatista-2023-practice-open"], relatedEntityRefs: [{ kind: "transition" as const, id: "zapatista-jbg-to-gal-transition-2023" }, { kind: "organization" as const, id: "zapatista-local-autonomous-governments" }, { kind: "challenge" as const, id: "zapatista-external-coercion" }] },
  ],
  publicationStatus: "reviewed" as const,
  reviewedAt: "2026-09-06",
});

export const zapatistaCaracolesDossierDocuments = [{ documentType: "entity", entity: dossier }] satisfies AuthoringDocument[];
