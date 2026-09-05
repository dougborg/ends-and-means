import type { AuthoringDocument } from "../../../src/lib/domain";

const reviewed = { publicationStatus: "reviewed" as const };

export const economicDemocracyEvidenceDocuments = [
  {
    documentType: "entity",
    entity: {
      id: "herzog-economic-democracy-work",
      kind: "work",
      label: "Economic Democracy",
      description:
        "Lisa Herzog's philosophical reference entry on the scope, institutions, arguments, and evidence associated with economic democracy.",
      title: "Economic Democracy",
      workType: "article",
      originalPublicationYear: 2026,
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "herzog-economic-democracy-source",
      kind: "source",
      label: "Economic Democracy, Stanford Encyclopedia of Philosophy (2026)",
      description:
        "The Stanford Encyclopedia of Philosophy entry consulted for the concept's scope, institutional variety, objections, and evidentiary limits.",
      title: "Economic Democracy",
      sourceType: "web-page",
      workId: "herzog-economic-democracy-work",
      contributorDisplay: ["Lisa Herzog"],
      publicationYear: 2026,
      publisher: "Metaphysics Research Lab, Stanford University",
      resourceLinks: [
        {
          purpose: "authorized-reading",
          url: "https://plato.stanford.edu/entries/economic-democracy/",
          label: "Read at the Stanford Encyclopedia of Philosophy",
        },
      ],
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "adamson-economic-democracy-work",
      kind: "work",
      label: "Economic Democracy and the Expediency of Worker Participation",
      description:
        "Walter L. Adamson's argument for a representative, multi-constituency model of firm governance.",
      title: "Economic Democracy and the Expediency of Worker Participation",
      workType: "article",
      originalPublicationYear: 1990,
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "adamson-economic-democracy-source",
      kind: "source",
      label: "Economic Democracy and the Expediency of Worker Participation (1990)",
      description:
        "The Political Studies article consulted as a narrower institutional interpretation of economic democracy.",
      title: "Economic Democracy and the Expediency of Worker Participation",
      sourceType: "article",
      workId: "adamson-economic-democracy-work",
      contributorDisplay: ["Walter L. Adamson"],
      publicationYear: 1990,
      publisher: "SAGE Publications on behalf of the Political Studies Association",
      identifiers: { doi: "10.1111/j.1467-9248.1990.tb00569.x" },
      resourceLinks: [
        {
          purpose: "publisher",
          url: "https://doi.org/10.1111/j.1467-9248.1990.tb00569.x",
          label: "Publisher record",
        },
      ],
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "economic-democracy-contested-scope",
      kind: "statement",
      label: "Contested scope of economic democracy",
      description:
        "A synthesis that defines the common democratic concern without imposing one institutional program.",
      statementKind: "editorial-interpretation",
      text: "Economic democracy asks how people subject to economic power can share in governing it, but the literature does not settle one constituency, level of decision-making, or ownership system.",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "economic-democracy-workplace-institutions",
      kind: "statement",
      label: "Workplace institutions associated with economic democracy",
      description:
        "A classification of distinct workplace arrangements discussed under the broad concept.",
      statementKind: "classification",
      text: "Workplace proposals associated with economic democracy include direct participation, elected worker representation, cooperatives, and codetermination.",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "economic-democracy-economy-wide-institutions",
      kind: "statement",
      label: "Economy-wide institutions associated with economic democracy",
      description:
        "A classification of arrangements that distribute economic authority beyond an individual workplace.",
      statementKind: "classification",
      text: "Economy-wide proposals associated with economic democracy include unions, democratic rules for markets, and public or shared control of investment and productive assets.",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "adamson-representative-firm-governance",
      kind: "statement",
      label: "Adamson's representative firm-governance model",
      description:
        "An attributed institutional proposal that illustrates one narrower use of economic democracy.",
      statementKind: "attributed-proposal",
      text: "Adamson proposes representative firm governance that balances shareholder, employee, and community interests while separating the authority of boards and management.",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "economic-democracy-beyond-workplace",
      kind: "statement",
      label: "Economic democracy beyond the workplace",
      description:
        "A statement separating firm governance from economy-wide authority and effects.",
      statementKind: "definition",
      text: "Workplace voice is one part of economic democracy, because firms also operate within systems of finance, labor law, market regulation, public investment, and obligations to people outside their workforces.",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "economic-democracy-ownership-is-not-control",
      kind: "statement",
      label: "Ownership does not establish democratic control",
      description:
        "A boundary statement about the institutional rights required to infer democratic authority.",
      statementKind: "definition",
      text: "A financial stake does not by itself establish democratic control; voting rights, representation, the size and structure of the holding, and actual decision authority must be examined separately.",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "economic-democracy-design-and-evidence-limits",
      kind: "statement",
      label: "Institutional design and evidence limits",
      description:
        "A qualified synthesis of objections and limits in the current literature.",
      statementKind: "editorial-interpretation",
      text: "Claims about economic democracy's effects depend on institutional design, participation in practice, and surrounding market and legal conditions; evidence from partially democratic institutions cannot establish the effects of every proposed model.",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "economic-democracy-property-rights-objection-statement",
      kind: "statement",
      label: "Property-rights objection to economic democracy",
      description:
        "An attributed classification of the property and market-choice objection surveyed by Herzog.",
      statementKind: "classification",
      text: "Herzog identifies an objection that workplace democracy can conflict with owners' property rights and choices made through markets.",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "economic-democracy-decision-cost-objection-statement",
      kind: "statement",
      label: "Decision-cost objection to economic democracy",
      description:
        "An attributed classification of the decision-cost and competence objection surveyed by Herzog.",
      statementKind: "classification",
      text: "Herzog identifies objections that democratic economic decisions can be costly and that participants may lack the information or competence required for specialized decisions.",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "economic-democracy-futility-objection-statement",
      kind: "statement",
      label: "Futility objection to economic democracy",
      description:
        "An attributed classification of objections concerning exclusion, informal domination, and wider constraints surveyed by Herzog.",
      statementKind: "classification",
      text: "Herzog identifies objections that formal participation can preserve exclusion or informal domination and that wider economic pressures can limit democratic decisions.",
      ...reviewed,
    },
  },
] satisfies AuthoringDocument[];
