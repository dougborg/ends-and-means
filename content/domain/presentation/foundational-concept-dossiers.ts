import type { AuthoringDocument } from "../../../src/lib/domain";
import { attachNarrative } from "./load-narrative";

const socialDemocracy = attachNarrative("social-democracy.md", {
  id: "social-democracy-dossier",
  kind: "dossier" as const,
  label: "Social democracy dossier",
  description:
    "A concise orientation to social democracy's historical formation, common reform institutions, contested endpoint, and bounded Swedish examples.",
  subject: { kind: "concept" as const, id: "social-democracy" },
  standfirst: "",
  sections: [
    {
      id: "where-the-tradition-came-from",
      heading: "Where did the tradition come from?",
      body: "",
      traceStatus: "supported" as const,
      statementIds: ["social-democracy-democratic-revision"],
    },
    {
      id: "what-it-often-does",
      heading: "What does it often do in practice?",
      body: "",
      traceStatus: "qualified" as const,
      statementIds: ["social-democracy-reform-institutions"],
    },
    {
      id: "where-its-boundary-is-contested",
      heading: "Where is its boundary contested?",
      body: "",
      traceStatus: "qualified" as const,
      statementIds: ["social-democracy-contested-capitalism-boundary"],
    },
    {
      id: "how-the-swedish-material-fits",
      heading: "How does the Swedish material fit?",
      body: "",
      traceStatus: "qualified" as const,
      statementIds: [
        "rehn-meidner-social-democratic-context",
        "funds-partial-instantiation",
      ],
      relatedEntityRefs: [
        { kind: "approach" as const, id: "swedish-rehn-meidner-model" },
        { kind: "approach" as const, id: "swedish-wage-earner-fund-program" },
      ],
    },
  ],
  publicationStatus: "reviewed" as const,
  reviewedAt: "2026-09-05",
});

export const foundationalConceptDossierDocuments = [
  { documentType: "entity", entity: socialDemocracy },
] satisfies AuthoringDocument[];
