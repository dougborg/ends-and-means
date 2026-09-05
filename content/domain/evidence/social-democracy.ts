import type { AuthoringDocument } from "../../../src/lib/domain";

const reviewed = { publicationStatus: "reviewed" as const };

export const socialDemocracyEvidenceDocuments = [
  {
    documentType: "entity",
    entity: {
      id: "berman-social-democracy-work",
      kind: "work",
      label: "Social Democracy",
      description:
        "Sheri Berman's reference account of social democracy's intellectual formation.",
      title: "Social Democracy",
      workType: "article",
      originalPublicationYear: 2014,
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "berman-social-democracy-source",
      kind: "source",
      label: "Social Democracy (2014)",
      description:
        "The Encyclopedia of Political Thought entry consulted for Berman's account of social democracy's democratic-revisionist origins.",
      title: "Social Democracy",
      sourceType: "article",
      workId: "berman-social-democracy-work",
      contributorDisplay: ["Sheri Berman"],
      publicationYear: 2014,
      publisher: "Wiley",
      identifiers: { doi: "10.1002/9781118474396.wbept0951" },
      resourceLinks: [
        {
          purpose: "publisher",
          url: "https://doi.org/10.1002/9781118474396.wbept0951",
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
        "A philosophical reference entry distinguishing socialist system designs, piecemeal reforms, and strategies for changing capitalism.",
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
        "The Fall 2024 entry consulted for the boundary between socialist system change, welfare-state reforms, and social-democratic strategies.",
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
      id: "riley-bernsteins-heirs-work",
      kind: "work",
      label: "Bernstein's Heirs",
      description:
        "Dylan Riley's critical review of competing histories and assessments of social democracy.",
      title: "Bernstein's Heirs",
      workType: "article",
      originalPublicationYear: 2012,
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "riley-bernsteins-heirs-source",
      kind: "source",
      label: "Bernstein's Heirs (2012)",
      description:
        "The New Left Review article consulted as a counterreading of Berman's genealogy and of social democracy's achievements and decline.",
      title: "Bernstein's Heirs",
      sourceType: "article",
      workId: "riley-bernsteins-heirs-work",
      contributorDisplay: ["Dylan Riley"],
      publicationYear: 2012,
      publisher: "New Left Review",
      identifiers: { doi: "10.64590/hdw" },
      resourceLinks: [
        {
          purpose: "authorized-reading",
          url: "https://newleftreview.org/issues/ii76/articles/dylan-riley-bernstein-s-heirs",
          label: "Read at New Left Review",
        },
      ],
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "social-democracy-contested-definition",
      kind: "statement",
      label: "Contested definition of social democracy",
      description:
        "A synthesis of two established but differently framed uses of the term.",
      statementKind: "editorial-interpretation",
      text: "Sources describe social democracy both as a democratic-revisionist current within socialist history and as a strategy for constraining capitalism through democratic institutions, so the term does not specify one fixed ownership endpoint.",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "social-democracy-democratic-revision",
      kind: "statement",
      label: "Berman's democratic-revisionist genealogy",
      description:
        "One historical interpretation of social democracy's formation within the socialist movement.",
      statementKind: "classification",
      text: "Berman traces social democracy to late-nineteenth-century revisionists who rejected orthodox Marxist historical determinism and class struggle in favor of political agency and cooperation across classes.",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "social-democracy-genealogy-contested",
      kind: "statement",
      label: "Contested genealogy and record",
      description:
        "A published counterreading that prevents Berman's account from appearing as settled history.",
      statementKind: "classification",
      text: "Riley presents Berman's genealogy as one side of a dispute and contrasts it with an account that judges social democracy's achievements more modestly and ties its reform capacity to historically favorable economic conditions.",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "social-democracy-welfare-state-form",
      kind: "statement",
      label: "Welfare-state reform model",
      description:
        "A sourced institutional description of one prominent reform strategy associated with social-democratic parties.",
      statementKind: "definition",
      text: "Gilabert and O'Neill describe a welfare-state model that retains substantial private ownership and market allocation while pooling social risks, providing public goods, and strengthening workers through collective bargaining.",
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
        "An editorial synthesis of sources that classify social democracy from different historical and strategic perspectives.",
      statementKind: "editorial-interpretation",
      text: "Gilabert and O'Neill distinguish reforms that tame capitalism from socialist models intended to end its class division, while Berman presents social democracy as an alternative to orthodox Marxism; together these classifications leave social democracy's ownership endpoint contested.",
      ...reviewed,
    },
  },
] satisfies AuthoringDocument[];
