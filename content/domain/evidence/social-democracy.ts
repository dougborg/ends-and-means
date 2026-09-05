import type { AuthoringDocument } from "../../../src/lib/domain";

const reviewed = { publicationStatus: "reviewed" as const };

export const socialDemocracyEvidenceDocuments = [
  {
    documentType: "entity",
    entity: {
      id: "berman-roots-social-democracy-work",
      kind: "work",
      label: "The Roots and Rationale of Social Democracy",
      description:
        "Sheri Berman's historical account of social democracy's emergence as an alternative to orthodox Marxism.",
      title: "The Roots and Rationale of Social Democracy",
      workType: "article",
      originalPublicationYear: 2003,
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "berman-roots-social-democracy-source",
      kind: "source",
      label: "The Roots and Rationale of Social Democracy (2003)",
      description:
        "The peer-reviewed Social Philosophy and Policy article consulted for the tradition's democratic-revisionist origins and political rationale.",
      title: "The Roots and Rationale of Social Democracy",
      sourceType: "article",
      workId: "berman-roots-social-democracy-work",
      contributorDisplay: ["Sheri Berman"],
      publicationYear: 2003,
      publisher: "Cambridge University Press",
      identifiers: { doi: "10.1017/S0265052503201060" },
      resourceLinks: [
        {
          purpose: "publisher",
          url: "https://doi.org/10.1017/S0265052503201060",
          label: "Publisher record",
        },
      ],
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "gilabert-oneill-socialism-work",
      kind: "work",
      label: "Socialism",
      description:
        "A philosophical reference entry distinguishing socialist system designs, piecemeal reforms, and strategies for transforming or constraining capitalism.",
      title: "Socialism",
      workType: "article",
      originalPublicationYear: 2019,
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "gilabert-oneill-socialism-source",
      kind: "source",
      label: "Socialism, Stanford Encyclopedia of Philosophy (2024)",
      description:
        "The Fall 2024 Stanford Encyclopedia of Philosophy entry consulted for the boundary between socialist system change and social-democratic reform strategies.",
      title: "Socialism",
      sourceType: "web-page",
      workId: "gilabert-oneill-socialism-work",
      contributorDisplay: ["Pablo Gilabert", "Martin O'Neill"],
      publicationYear: 2024,
      publisher: "Metaphysics Research Lab, Stanford University",
      resourceLinks: [
        {
          purpose: "authorized-reading",
          url: "https://plato.stanford.edu/archives/fall2024/entries/socialism/",
          label: "Read the archived entry",
        },
      ],
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "social-democracy-democratic-revision",
      kind: "statement",
      label: "Democratic-revisionist roots of social democracy",
      description:
        "A historical interpretation of social democracy's emergence within the socialist movement.",
      statementKind: "definition",
      text: "Berman traces social democracy to late-nineteenth-century revisionists who rejected orthodox Marxist historical determinism and argued that organized citizens could pursue change through democratic institutions and alliances broader than a single class.",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "social-democracy-reform-institutions",
      kind: "statement",
      label: "Common social-democratic reform institutions",
      description:
        "A sourced description of institutions commonly associated with social-democratic strategies inside market economies.",
      statementKind: "definition",
      text: "A prominent social-democratic strategy retains substantial private ownership and market allocation while using elections, social insurance, public services, regulation, and collective bargaining to reduce insecurity and constrain private economic power.",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "social-democracy-contested-capitalism-boundary",
      kind: "statement",
      label: "Contested boundary between reform and system change",
      description:
        "An editorial synthesis preserving disagreement about social democracy's relationship to capitalism and socialism.",
      statementKind: "editorial-interpretation",
      text: "Social democracy includes projects framed as reformist alternatives to orthodox Marxism and projects aimed at taming capitalism, so the label alone does not establish whether an advocate seeks to preserve, transform, or eventually replace capitalist ownership.",
      ...reviewed,
    },
  },
] satisfies AuthoringDocument[];
