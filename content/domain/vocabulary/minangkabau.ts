import type { AuthoringDocument } from "../../../src/lib/domain";

const reviewed = { publicationStatus: "reviewed" as const };

export const minangkabauVocabularyDocuments = [
  {
    documentType: "entity",
    entity: {
      id: "matriliny",
      kind: "concept",
      label: "Matriliny",
      description:
        "A kinship principle that traces descent or group membership through a maternal line.",
      schemeIds: ["political-economic-ideas"],
      scopeNote:
        "Do not infer residence, ownership, practical control, political office, gender equality, or rule by women from maternal-line descent alone.",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "matrilocality",
      kind: "concept",
      label: "Matrilocality",
      description:
        "A postmarital residence pattern in which a couple lives with or near the wife’s maternal kin.",
      schemeIds: ["political-economic-ideas"],
      scopeNote:
        "Residence after marriage is analytically separate from maternal-line descent and does not by itself establish ownership or authority.",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "matriarchy",
      kind: "concept",
      label: "Matriarchy",
      description:
        "A disputed concept variously used for rule by women, maternal social centrality, or institutions organized around maternal meanings.",
      schemeIds: ["political-economic-ideas"],
      scopeNote:
        "Never use as an alias for matriliny; attribute the definition in use and keep symbolic centrality separate from authority in a bounded setting.",
      ...reviewed,
    },
  },
] satisfies AuthoringDocument[];
