import type { AuthoringDocument } from "../../../src/lib/domain";

const reviewed = { publicationStatus: "reviewed" as const };

export const socialismCommunismVocabularyDocuments = [
  {
    documentType: "entity",
    entity: {
      id: "socialism",
      kind: "concept",
      label: "Socialism",
      description:
        "A contested family of ideas about overcoming capitalist class relations through social and democratic control of production.",
      schemeIds: ["political-economic-ideas"],
      scopeNote:
        "Use for the broad contested concept, not as a timeless label for a government, country, party, policy, or single institutional design.",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "communism",
      kind: "concept",
      label: "Communism",
      description:
        "A contested concept used for classless social ideals, revolutionary traditions and movements, political organizations, and claimed historical systems.",
      schemeIds: ["political-economic-ideas"],
      scopeNote:
        "Keep the ideal, tradition, movement, party identity, state or regime label, and institutions of every bounded case distinct.",
      ...reviewed,
    },
  },
] satisfies AuthoringDocument[];
