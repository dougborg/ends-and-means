import type { AuthoringDocument } from "../../../src/lib/domain";
import { attachNarrative } from "./load-narrative";

const dossier = attachNarrative("tawantinsuyu.md", {
  id: "tawantinsuyu-imperial-organization-dossier",
  kind: "dossier" as const,
  label: "Tawantinsuyu imperial organization dossier",
  description:
    "A bounded account of authority, labor, resources, regional variation, and evidence during Tawantinsuyu’s expansion.",
  subject: { kind: "case" as const, id: "tawantinsuyu-imperial-organization" },
  standfirst: "",
  standfirstStatementIds: [
    "tawantinsuyu-chronology-boundary",
    "tawantinsuyu-non-embodiment",
  ],
  sections: [
    {
      id: "what-do-the-names-mean",
      heading: "What do Tawantinsuyu, Inka, and Inca mean?",
      body: "",
      traceStatus: "qualified" as const,
      statementIds: [
        "tawantinsuyu-name-boundary",
        "tawantinsuyu-chronology-boundary",
      ],
    },
    {
      id: "who-ruled",
      heading: "Who ruled, and through whom?",
      body: "",
      traceStatus: "qualified" as const,
      statementIds: [
        "tawantinsuyu-ruler-kin-authority",
        "tawantinsuyu-provincial-indirect-rule",
        "tawantinsuyu-warfare-incorporation",
      ],
    },
    {
      id: "how-were-labor-and-resources-organized",
      heading: "How were labor and resources organized?",
      body: "",
      traceStatus: "qualified" as const,
      statementIds: [
        "tawantinsuyu-mita-labor",
        "tawantinsuyu-land-resource-plurality",
        "tawantinsuyu-road-labor",
        "tawantinsuyu-road-power-limit",
        "tawantinsuyu-mitmaq-resettlement",
        "tawantinsuyu-gender-status-variation",
      ],
    },
    {
      id: "what-do-material-remains-show",
      heading: "What do material remains show?",
      body: "",
      traceStatus: "qualified" as const,
      statementIds: [
        "tawantinsuyu-storage-evidence",
        "tawantinsuyu-huanuco-material",
      ],
    },
    {
      id: "was-it-reciprocity-or-extraction",
      heading: "Was it reciprocity, redistribution, or extraction?",
      body: "",
      traceStatus: "qualified" as const,
      statementIds: [
        "tawantinsuyu-reciprocity-interpretation",
        "tawantinsuyu-extraction-rival",
        "tawantinsuyu-mita-labor",
        "tawantinsuyu-storage-evidence",
      ],
    },
    {
      id: "how-should-colonial-accounts-be-read",
      heading: "How should colonial accounts be read?",
      body: "",
      traceStatus: "qualified" as const,
      statementIds: [
        "tawantinsuyu-chronicle-mediation",
        "tawantinsuyu-guaman-poma-service",
        "tawantinsuyu-huanuco-material",
      ],
    },
    {
      id: "what-does-this-case-not-establish",
      heading: "What does this case not establish?",
      body: "",
      traceStatus: "qualified" as const,
      statementIds: [
        "tawantinsuyu-non-embodiment",
        "tawantinsuyu-land-resource-plurality",
        "tawantinsuyu-provincial-indirect-rule",
      ],
    },
  ],
  publicationStatus: "reviewed" as const,
  reviewedAt: "2026-09-06",
});

export const tawantinsuyuDossierDocuments = [
  { documentType: "entity", entity: dossier },
] satisfies AuthoringDocument[];
