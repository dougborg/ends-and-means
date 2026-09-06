import type { AuthoringDocument } from "../../../src/lib/domain";
import { attachNarrative } from "./load-narrative";

const reviewed = {
  publicationStatus: "reviewed" as const,
  reviewedAt: "2026-09-07",
};

const ruwalla = attachNarrative("ruwalla-borderland-organization.md", {
  id: "ruwalla-borderland-organization-dossier",
  kind: "dossier" as const,
  label: "Ruwalla borderland organization dossier",
  description:
    "From 1918 to 1936, Ruwalla organization joined mobile pastoral production, layered kin affiliation, Al Shaʿlan representation, and bargaining with rival states over cross-border access. The reviewed archive does not yet establish how Ruwalla women and non-elite pastoralists described those decisions.",
  subject: { kind: "case" as const, id: "ruwalla-borderland-organization" },
  standfirst: "",
  standfirstStatementIds: [
    "ruwalla-mobility-corridor",
    "ruwalla-case-transfer-limit",
  ],
  sections: [
    {
      id: "whose-terms-describe-the-formation",
      heading: "Whose terms describe this formation?",
      body: "",
      traceStatus: "qualified" as const,
      statementIds: [
        "ruwalla-scholarly-classification",
        "ruwalla-classification-limit",
        "ruwalla-anaza-affiliation",
      ],
    },
    {
      id: "how-did-leadership-work",
      heading: "How did leadership work?",
      body: "",
      traceStatus: "qualified" as const,
      statementIds: ["ruwalla-mashyakha", "regional-bedouin-shaykh-persuasion"],
    },
    {
      id: "why-did-mobility-and-territory-matter",
      heading: "Why did mobility and territory matter?",
      body: "",
      traceStatus: "supported" as const,
      statementIds: [
        "ruwalla-mobility-corridor",
        "ruwalla-dira-not-sovereignty",
      ],
    },
    {
      id: "how-did-new-states-change-the-relationship",
      heading: "How did new states change the relationship?",
      body: "",
      traceStatus: "qualified" as const,
      statementIds: ["ruwalla-border-bargaining", "ruwalla-border-concessions"],
    },
    {
      id: "what-can-the-sources-establish",
      heading: "What can the sources establish?",
      body: "",
      traceStatus: "qualified" as const,
      statementIds: [
        "ruwalla-archive-source-base",
        "ruwalla-archive-voice-limit",
      ],
    },
    {
      id: "how-should-this-case-be-compared",
      heading: "How should this case be compared?",
      body: "",
      traceStatus: "qualified" as const,
      statementIds: [
        "ruwalla-case-transfer-limit",
        "ruwalla-jinst-non-equivalence",
      ],
    },
  ],
  ...reviewed,
});

const jinst = attachNarrative("jinst-postcollective-pastoral-governance.md", {
  id: "jinst-postcollective-pastoral-governance-dossier",
  kind: "dossier" as const,
  label: "Jinst post-collective pastoral governance dossier",
  description:
    "After Mongolia dismantled collectives and privatized livestock in 1992, households assumed responsibility for movement, labor, transport, inputs, marketing, and risk while pasture remained state-owned. Jinst-specific observations from 1995 must remain separate from findings pooled across Jinst and Bayan-Ovoo and do not define a universal pastoral government.",
  subject: {
    kind: "case" as const,
    id: "jinst-postcollective-pastoral-governance",
  },
  standfirst: "",
  standfirstStatementIds: [
    "mongolia-postcollective-change",
    "jinst-case-transfer-limit",
  ],
  sections: [
    {
      id: "whose-terms-and-boundaries-apply",
      heading: "Whose terms and boundaries apply?",
      body: "",
      traceStatus: "qualified" as const,
      statementIds: [
        "mongolia-administrative-boundary",
        "study-sites-khot-ail",
        "study-sites-neg-nutgiinkhan-boundary",
      ],
    },
    {
      id: "what-changed-after-the-collectives",
      heading: "What changed after the collectives?",
      body: "",
      traceStatus: "supported" as const,
      statementIds: [
        "mongolia-postcollective-change",
        "jinst-bag-leader-election",
        "jinst-1995-campsite-use",
        "jinst-1995-winter-pasture-incursion",
        "study-sites-1998-campsite-certificates",
      ],
    },
    {
      id: "how-were-resources-coordinated",
      heading: "How were resources coordinated?",
      body: "",
      traceStatus: "supported" as const,
      statementIds: [
        "study-sites-khot-ail",
        "study-sites-campsite-rights",
        "study-sites-resource-rights-differed",
      ],
    },
    {
      id: "why-were-boundaries-permeable",
      heading: "Why were boundaries permeable?",
      body: "",
      traceStatus: "supported" as const,
      statementIds: ["study-sites-pasture-overlap", "mongolia-seasonal-norms"],
    },
    {
      id: "whose-access-was-secure",
      heading: "Whose access was secure?",
      body: "",
      traceStatus: "qualified" as const,
      statementIds: ["study-sites-inequality", "jinst-formalization-caution"],
    },
    {
      id: "what-does-the-evidence-not-show",
      heading: "What does the evidence not show?",
      body: "",
      traceStatus: "qualified" as const,
      statementIds: [
        "jinst-fieldwork-provenance",
        "fernandez-gimenez-seasonal-regulation-proposal",
        "jinst-formalization-caution",
        "mongolia-later-study-transfer",
      ],
    },
    {
      id: "how-should-this-case-be-compared",
      heading: "How should this case be compared?",
      body: "",
      traceStatus: "qualified" as const,
      statementIds: [
        "jinst-case-transfer-limit",
        "ruwalla-jinst-non-equivalence",
      ],
    },
  ],
  ...reviewed,
});

export const nomadicConfederatedOrganizationDossierDocuments = [
  { documentType: "entity", entity: ruwalla },
  { documentType: "entity", entity: jinst },
] satisfies AuthoringDocument[];
