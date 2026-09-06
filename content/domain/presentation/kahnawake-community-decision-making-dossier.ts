import type { AuthoringDocument } from "../../../src/lib/domain";
import { attachNarrative } from "./load-narrative";

const dossier = attachNarrative("kahnawake-community-lawmaking.md", {
  id: "kahnawake-community-lawmaking-dossier",
  kind: "dossier" as const,
  label: "Kahnawà:ke community law-making dossier",
  description:
    "Kahnawà:ke’s Community Decision Making and Review Process adapts Haudenosaunee principles within elected-council and legislative institutions. Its specific colonial, legal, and community conditions limit broader claims about Indigenous government.",
  subject: { kind: "case" as const, id: "kahnawake-community-lawmaking" },
  standfirst: "",
  standfirstStatementIds: [
    "kahnawake-cdmrp-hybrid-classification",
    "kahnawake-case-not-tribal-embodiment",
  ],
  sections: [
    {
      id: "whose-terms-describe-the-community",
      heading: "Whose terms describe the community?",
      body: "",
      traceStatus: "qualified" as const,
      statementIds: [
        "kahnawake-community-self-description",
        "indian-act-band-administrative-definition",
        "tribe-not-universal-political-form",
      ],
    },
    {
      id: "how-does-the-process-work",
      heading: "How does the process work?",
      body: "",
      traceStatus: "supported" as const,
      statementIds: [
        "kahnawake-cdmrp-2005-adoption",
        "kahnawake-consensus-process-definition",
        "kahnawake-cdmrp-type-one-design",
        "kahnawake-cdmrp-2024-hearing-rule-change",
        "kahnawake-cdmrp-2024-revised-hearing-rule",
        "kahnawake-cdmrp-type-two-design",
      ],
    },
    {
      id: "is-this-simply-traditional-government",
      heading: "Is this simply traditional government?",
      body: "",
      traceStatus: "qualified" as const,
      statementIds: [
        "kahnawake-cdmrp-hybrid-classification",
        "indian-act-band-council-definition",
        "kahnawake-cdmrp-trust-contestation",
      ],
    },
    {
      id: "what-do-we-know-about-practice",
      heading: "What do we know about practice?",
      body: "",
      traceStatus: "qualified" as const,
      statementIds: [
        "kahnawake-cdmrp-type-one-design",
        "kahnawake-cdmrp-survey-attendance",
        "kahnawake-cdmrp-survey-concerns",
        "kahnawake-cdmrp-survey-sampling-limit",
      ],
    },
    {
      id: "what-does-this-case-establish",
      heading: "What does this case establish?",
      body: "",
      traceStatus: "qualified" as const,
      statementIds: [
        "kahnawake-cdmrp-consultative-development",
        "kahnawake-cdmrp-2024-hearing-rule-change",
        "kahnawake-cdmrp-2024-revised-hearing-rule",
        "kahnawake-case-not-tribal-embodiment",
        "tribe-colonial-evolutionary-history",
      ],
    },
  ],
  publicationStatus: "reviewed" as const,
  reviewedAt: "2026-09-05",
});

export const kahnawakeCommunityDecisionMakingDossierDocuments = [
  { documentType: "entity", entity: dossier },
] satisfies AuthoringDocument[];
