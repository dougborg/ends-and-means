import type { AuthoringDocument } from "../../../src/lib/domain";

const base = {
  target: { kind: "case" as const, id: "tawantinsuyu-imperial-organization" },
  statementIds: [],
  obligationStatus: "open" as const,
  publicationStatus: "reviewed" as const,
  reviewedAt: "2026-09-06",
};

export const tawantinsuyuResearchDocuments = [
  {
    documentType: "entity",
    entity: {
      id: "tawantinsuyu-provincial-variation",
      kind: "research-obligation",
      label: "Provincial and social variation in Tawantinsuyu",
      description:
        "A focused test of how imperial institutions varied across incorporated populations.",
      obligationType: "counterevidence",
      question:
        "How did labor burdens, local authority, access to provisions, and resettlement differ by province, mode of incorporation, status, and gender between about 1438 and 1533?",
      targetSectionId: "who-ruled",
      addressedStatementIds: [
        "tawantinsuyu-provincial-indirect-rule",
        "tawantinsuyu-warfare-incorporation",
      ],
      currentLimitation:
        "Regional syntheses establish variation but the present evidence does not support a commensurable population-level distribution of burdens and benefits across the empire.",
      evidenceNeeded:
        "Preselected provincial comparisons combining settlement archaeology, storage and production evidence, local documentary testimony, bioarchaeology, and explicit sampling limits.",
      scope:
        "Named provinces and populations during the bounded imperial period; no inference from one administrative center to all Tawantinsuyu.",
      ...base,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "tawantinsuyu-colonial-translation",
      kind: "research-obligation",
      label: "Colonial translation and Andean categories",
      description:
        "A focused source-critical question about colonial terms used to describe Andean institutions.",
      obligationType: "research-gap",
      question:
        "Where do colonial Spanish terms for tribute, lordship, property, and service distort or incompletely translate Quechua and Aymara categories in accounts of Tawantinsuyu?",
      targetSectionId: "how-should-colonial-accounts-be-read",
      addressedStatementIds: [
        "tawantinsuyu-chronicle-mediation",
        "tawantinsuyu-guaman-poma-service",
      ],
      currentLimitation:
        "The chronicles preserve Indigenous terms inside colonial genres, but the current ledger does not compare manuscript variants, original-language usage, or modern community interpretation term by term.",
      evidenceNeeded:
        "Critical editions, manuscript images, historical-linguistic analysis, and Quechua- and Aymara-led scholarship or community review with provenance for translation choices.",
      scope:
        "Terms used for imperial institutions in sixteenth- and early-seventeenth-century records; not a claim that modern speakers share one interpretation.",
      ...base,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "tawantinsuyu-reciprocity-extraction-test",
      kind: "research-obligation",
      label: "Reciprocity and extraction across Tawantinsuyu",
      description:
        "A serious rival-interpretation test of reciprocal provision and compulsory extraction.",
      obligationType: "counterargument",
      question:
        "Which observations would distinguish reciprocal obligation with material return from compulsory extraction in particular Tawantinsuyu labor and provisioning settings?",
      targetSectionId: "was-it-reciprocity-or-extraction",
      addressedStatementIds: [
        "tawantinsuyu-reciprocity-interpretation",
        "tawantinsuyu-extraction-rival",
        "tawantinsuyu-storage-evidence",
      ],
      currentLimitation:
        "The rival interpretations identify compatible mechanisms, while storage totals and chroniclers’ normative language do not by themselves measure who contributed, received, consented, or resisted.",
      evidenceNeeded:
        "Local labor schedules, consumption and distribution evidence, household effects, testimony about obligation and refusal, and comparisons across state, shrine, estate, and community claims.",
      scope:
        "Specified labor and provisioning settings within Tawantinsuyu before 1533; excludes using modern ideological labels as outcomes.",
      ...base,
    },
  },
] satisfies AuthoringDocument[];
