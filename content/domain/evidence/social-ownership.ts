import type { AuthoringDocument } from "../../../src/lib/domain";

const reviewed = { publicationStatus: "reviewed" as const };

export const socialOwnershipEvidenceDocuments = [
  {
    documentType: "entity",
    entity: {
      id: "schlager-ostrom-property-rights-work",
      kind: "work",
      label: "Property-Rights Regimes and Natural Resources",
      description:
        "Edella Schlager and Elinor Ostrom's framework for distinguishing access, use, management, exclusion, and alienation rights.",
      title: "Property-Rights Regimes and Natural Resources: A Conceptual Analysis",
      workType: "article",
      originalPublicationYear: 1992,
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "schlager-ostrom-property-rights-source",
      kind: "source",
      label: "Property-Rights Regimes and Natural Resources (1992)",
      description:
        "The peer-reviewed Land Economics article consulted for its separable bundle of use and collective-choice rights.",
      title: "Property-Rights Regimes and Natural Resources: A Conceptual Analysis",
      sourceType: "article",
      workId: "schlager-ostrom-property-rights-work",
      contributorDisplay: ["Edella Schlager", "Elinor Ostrom"],
      publicationYear: 1992,
      publisher: "University of Wisconsin Press",
      identifiers: { doi: "10.2307/3146375" },
      resourceLinks: [
        {
          purpose: "publisher",
          url: "https://www.jstor.org/stable/3146375",
          label: "Read at JSTOR",
        },
      ],
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "hmrc-beneficial-ownership-work",
      kind: "work",
      label: "Legal and beneficial ownership",
      description:
        "HM Revenue and Customs guidance distinguishing the legal holder of property from the person for whose benefit it is held.",
      title: "Ownership and income tax: legal background: ownership — beneficial owner",
      workType: "report",
      originalPublicationYear: 2016,
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "hmrc-beneficial-ownership-source",
      kind: "source",
      label: "HMRC guidance on beneficial ownership",
      description:
        "The official guidance page consulted for the legal distinction between title and beneficial interest.",
      title: "TSEM9130: Ownership — beneficial owner",
      sourceType: "web-page",
      workId: "hmrc-beneficial-ownership-work",
      contributorDisplay: ["HM Revenue & Customs"],
      publicationYear: 2016,
      publisher: "Government of the United Kingdom",
      resourceLinks: [
        {
          purpose: "authorized-reading",
          url: "https://www.gov.uk/hmrc-internal-manuals/trusts-settlements-and-estates-manual/tsem9130",
          label: "Read at GOV.UK",
        },
      ],
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "social-ownership-four-questions",
      kind: "statement",
      label: "Four questions for identifying social ownership",
      description:
        "An analytical definition that prevents one ownership label from standing in for several distinct institutional rights.",
      statementKind: "editorial-interpretation",
      text: "A claim of social ownership should identify who holds legal title, who is entitled to benefit, who can govern the asset, and who receives its income or surplus.",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "social-ownership-title-benefit-boundary",
      kind: "statement",
      label: "Legal title and beneficial ownership are distinct",
      description:
        "A legal boundary between the named holder of property and the beneficiary for whom it is held.",
      statementKind: "definition",
      text: "Legal title identifies the person or entity in whose name property is held, while beneficial ownership identifies the person for whose benefit it is held; the two can be separated.",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "social-ownership-rights-are-divisible",
      kind: "statement",
      label: "Property rights can be divided",
      description:
        "A property-rights boundary separating use, management, exclusion, and transfer authority.",
      statementKind: "definition",
      text: "Rights to use a resource, manage it, exclude others, and transfer governing rights can be held by different people or institutions rather than by one complete owner.",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "social-ownership-control-boundary",
      kind: "statement",
      label: "Control requires specified governing rights",
      description:
        "A boundary that prevents nominal ownership from proving practical authority.",
      statementKind: "definition",
      text: "Effective control depends on enforceable powers to set rules, choose or replace decision-makers, and determine access or use; a title or financial claim does not establish those powers by itself.",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "social-ownership-returns-boundary",
      kind: "statement",
      label: "Returns are a separate ownership dimension",
      description:
        "A boundary separating receipt of income or surplus from governance and title.",
      statementKind: "definition",
      text: "The right to receive an asset's income, output, or surplus can be separated from legal title and from the authority to govern the asset.",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "social-ownership-public-title-boundary",
      kind: "statement",
      label: "Public title is not sufficient for social ownership",
      description:
        "A classification separating state ownership from socially accountable control.",
      statementKind: "classification",
      text: "State ownership is not sufficient for social ownership when the people engaged in economic life lack democratic control over the state or the assets it holds.",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "social-ownership-market-socialism-relationship",
      kind: "statement",
      label: "Social ownership can coexist with markets",
      description:
        "A classification of social ownership within market-socialist institutional designs.",
      statementKind: "classification",
      text: "Market-socialist proposals combine social or democratic control of productive assets with extensive markets, so ownership and coordination must be classified separately.",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "social-ownership-economic-democracy-relationship",
      kind: "statement",
      label: "Social ownership and economic democracy overlap without being identical",
      description:
        "A classification separating an ownership arrangement from the broader distribution of democratic economic authority.",
      statementKind: "editorial-interpretation",
      text: "Social ownership can support economic democracy by redistributing authority over productive assets, but economic democracy also includes workplace voice, market rules, finance, and public decision-making beyond ownership.",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "rehn-meidner-social-ownership-boundary",
      kind: "statement",
      label: "The Rehn–Meidner model did not specify social ownership",
      description:
        "A sourced boundary between the named policy model and later ownership proposals.",
      statementKind: "editorial-interpretation",
      text: "The documented Rehn–Meidner policy package combined wage bargaining, labor-market adjustment, and restrictive macroeconomic policy; that account does not make a transfer of productive-asset ownership one of the model's defining means.",
      ...reviewed,
    },
  },
] satisfies AuthoringDocument[];
