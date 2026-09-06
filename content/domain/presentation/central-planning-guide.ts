import type { AuthoringDocument } from "../../../src/lib/domain";
import { attachNarrative } from "./load-narrative";

const dossier = attachNarrative("central-planning.md", {
  id: "central-planning-dossier",
  kind: "dossier" as const,
  label: "Central planning dossier",
  description:
    "A bounded guide to planning design choices and the United States Controlled Materials Plan.",
  subject: { kind: "case" as const, id: "us-controlled-materials-plan" },
  standfirst: "",
  standfirstStatementIds: ["central-planning-family-boundary", "cmp-operating-period"],
  sections: [
    {
      id: "what-does-central-planning-name",
      heading: "What does central planning name?",
      body: "",
      traceStatus: "qualified" as const,
      statementIds: ["central-planning-family-boundary"],
      relatedEntityRefs: [{ kind: "means" as const, id: "controlled-materials-allocation" }],
    },
    {
      id: "how-did-the-plan-work",
      heading: "How did the plan work?",
      body: "",
      traceStatus: "supported" as const,
      statementIds: ["cmp-authority", "cmp-scope", "cmp-information", "cmp-targets", "cmp-enforcement"],
      relatedEntityRefs: [
        { kind: "organization" as const, id: "war-production-board" },
        { kind: "organization" as const, id: "wpb-requirements-committee" },
        { kind: "organization" as const, id: "cmp-claimant-agencies" },
        { kind: "organization" as const, id: "cmp-prime-contractors" },
        { kind: "organization" as const, id: "cmp-controlled-material-producers" },
      ],
    },
    {
      id: "who-held-which-authority",
      heading: "Who held which authority?",
      body: "",
      traceStatus: "qualified" as const,
      statementIds: ["cmp-authority", "cmp-distributed-administration", "cmp-ownership", "cmp-power-rival"],
    },
    {
      id: "how-could-the-plan-change",
      heading: "How could the plan change?",
      body: "",
      traceStatus: "qualified" as const,
      statementIds: ["cmp-revision", "cmp-correctability-assessment"],
      relatedEntityRefs: [
        { kind: "challenge" as const, id: "planning-information-and-coordination" },
        { kind: "challenge" as const, id: "authority-and-accountability" },
        { kind: "criterion" as const, id: "planning-correctability" },
      ],
    },
    {
      id: "what-can-the-episode-show",
      heading: "What can the episode show?",
      body: "",
      traceStatus: "qualified" as const,
      statementIds: ["cmp-official-performance-account", "cmp-performance-rival", "cmp-power-rival"],
      relatedEntityRefs: [
        { kind: "case" as const, id: "us-controlled-materials-plan" },
        { kind: "case-episode" as const, id: "cmp-operation-1943-1945" },
      ],
    },
    {
      id: "where-does-the-boundary-end",
      heading: "Where does the boundary end?",
      body: "",
      traceStatus: "qualified" as const,
      statementIds: ["cmp-scope", "cmp-ownership", "cmp-operating-period"],
      relatedEntityRefs: [{ kind: "approach" as const, id: "us-wartime-production-mobilization" }],
    },
  ],
  publicationStatus: "reviewed" as const,
  reviewedAt: "2026-09-06",
});

const approachDossier = attachNarrative("us-wartime-production-mobilization.md", {
  id: "us-wartime-production-mobilization-dossier",
  kind: "dossier" as const,
  label: "United States wartime production mobilization dossier",
  description: "A boundary note separating CMP from the wider wartime mobilization approach.",
  subject: { kind: "approach" as const, id: "us-wartime-production-mobilization" },
  standfirst: "",
  standfirstStatementIds: ["cmp-operating-period", "cmp-scope", "cmp-ownership"],
  sections: [
    { id: "how-did-materials-allocation-fit", heading: "How did materials allocation fit?", body: "", traceStatus: "qualified" as const, statementIds: ["cmp-scope", "cmp-distributed-administration", "cmp-operating-period"] },
    { id: "what-does-the-approach-not-prove", heading: "What does the approach not prove?", body: "", traceStatus: "qualified" as const, statementIds: ["cmp-ownership", "cmp-official-performance-account", "cmp-performance-rival", "cmp-power-rival"] },
  ],
  publicationStatus: "reviewed" as const,
  reviewedAt: "2026-09-06",
});

export const centralPlanningGuideDocuments = [
  { documentType: "entity", entity: dossier },
  { documentType: "entity", entity: approachDossier },
  {
    documentType: "subject-guide",
    guide: {
      id: "guide-central-planning",
      slug: "central-planning",
      label: "Central planning",
      description: "A learner path through planning authority, information, revision, ownership boundaries, and one bounded wartime episode.",
      publicationStatus: "reviewed",
      primarySubject: { kind: "case", id: "us-controlled-materials-plan" },
      searchQueries: [
        { query: "central planning" },
        { query: "planned economy", disambiguation: "This guide covers one bounded materials-allocation design, not every institution described as a planned economy." },
        { query: "economic planning" },
        { query: "Controlled Materials Plan" },
      ],
      sections: [
        { id: "short-answer", role: "short-answer", heading: "What is central planning?", narrativeRefs: [{ dossierId: "central-planning-dossier" }] },
        { id: "meanings-and-boundaries", role: "meanings-and-boundaries", heading: "Which design choices does the label leave open?", narrativeRefs: [{ dossierId: "central-planning-dossier", sectionId: "what-does-central-planning-name" }, { dossierId: "central-planning-dossier", sectionId: "where-does-the-boundary-end" }] },
        { id: "institutions-and-mechanisms", role: "institutions-and-mechanisms", heading: "How did one materials plan coordinate production?", narrativeRefs: [{ dossierId: "central-planning-dossier", sectionId: "how-did-the-plan-work" }, { dossierId: "central-planning-dossier", sectionId: "who-held-which-authority" }], entityRefs: [{ kind: "means", id: "controlled-materials-allocation" }, { kind: "approach", id: "us-wartime-production-mobilization" }], relationshipIds: ["us-mobilization-advocates-cmp"] },
        { id: "bounded-practice", role: "bounded-practice", heading: "What happened from April 1943 through September 1945?", entityRefs: [{ kind: "case", id: "us-controlled-materials-plan" }, { kind: "case-episode", id: "cmp-operation-1943-1945" }], relationshipIds: ["cmp-episode-used-controlled-materials"] },
        { id: "variants-disputes-and-limits", role: "variants-and-disputes", heading: "What is disputed about performance and power?", narrativeRefs: [{ dossierId: "central-planning-dossier", sectionId: "how-could-the-plan-change" }, { dossierId: "central-planning-dossier", sectionId: "what-can-the-episode-show" }] },
        { id: "comparisons-and-next-steps", role: "comparisons-and-next-steps", heading: "Which questions make planning systems comparable?", entityRefs: [{ kind: "challenge", id: "planning-information-and-coordination" }, { kind: "challenge", id: "authority-and-accountability" }, { kind: "criterion", id: "planning-correctability" }] },
        { id: "open-questions", role: "open-questions", heading: "What remains unresolved?", researchObligationIds: ["cmp-civilian-priority-counterevidence", "cmp-causal-performance-counterfactual"] },
      ],
      reviewedAt: "2026-09-06",
    },
  },
] satisfies AuthoringDocument[];
