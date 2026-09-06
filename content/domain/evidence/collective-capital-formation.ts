import type { AuthoringDocument } from "../../../src/lib/domain";

const reviewed = {
  publicationStatus: "reviewed" as const,
  reviewedAt: "2026-09-05",
};

export const collectiveCapitalFormationEvidenceDocuments = [
  {
    documentType: "entity",
    entity: {
      id: "meidner-collective-asset-formation-work",
      kind: "work",
      label: "Collective asset formation through wage-earner funds",
      description:
        "Rudolf Meidner's account of the LO wage-earner-fund proposal and competing fund designs.",
      title: "Collective asset formation through wage-earner funds",
      workType: "article",
      originalPublicationYear: 1981,
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "meidner-collective-asset-formation-source",
      kind: "source",
      label: "Collective asset formation through wage-earner funds (1981)",
      description:
        "The peer-reviewed International Labour Review article consulted for the proposal's financing, collective-use, and governance distinctions.",
      title: "Collective asset formation through wage-earner funds",
      sourceType: "article",
      workId: "meidner-collective-asset-formation-work",
      contributorDisplay: ["Rudolf Meidner"],
      publicationYear: 1981,
      publisher: "International Labour Office",
      resourceLinks: [
        {
          purpose: "authorized-reading",
          url: "https://researchrepository.ilo.org/esploro/outputs/journalArticle/Collective-asset-formation-through-wage-earner-funds/995219245602676",
          label: "Read at the ILO Research Repository",
        },
      ],
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "furendal-oneill-collective-capital-work",
      kind: "work",
      label: "Work, Justice, and Collective Capital Institutions",
      description:
        "A philosophical reconstruction of wage-earner funds as collective capital institutions, including their constituency and governance problems.",
      title:
        "Work, Justice, and Collective Capital Institutions: Revisiting Rudolf Meidner and the Case for Wage-Earner Funds",
      workType: "article",
      originalPublicationYear: 2024,
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "furendal-oneill-collective-capital-source",
      kind: "source",
      label: "Work, Justice, and Collective Capital Institutions (2024)",
      description:
        "The peer-reviewed Journal of Applied Philosophy article consulted for institutional design, ownership, and constituency boundaries.",
      title:
        "Work, Justice, and Collective Capital Institutions: Revisiting Rudolf Meidner and the Case for Wage-Earner Funds",
      sourceType: "article",
      workId: "furendal-oneill-collective-capital-work",
      contributorDisplay: ["Markus Furendal", "Martin O'Neill"],
      publicationYear: 2024,
      publisher: "Wiley",
      identifiers: { doi: "10.1111/japp.12631" },
      resourceLinks: [
        {
          purpose: "publisher",
          url: "https://doi.org/10.1111/japp.12631",
          label: "Publisher record",
        },
      ],
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "oecd-understanding-national-accounts-work",
      kind: "work",
      label: "Understanding National Accounts",
      description:
        "The OECD manual defining gross fixed capital formation for statistical accounting.",
      title: "Understanding National Accounts",
      workType: "book",
      originalPublicationYear: 2014,
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "oecd-understanding-national-accounts-source",
      kind: "source",
      label: "Understanding National Accounts (2014)",
      description:
        "The OECD edition consulted to distinguish the national-accounts measure from an ownership or governance proposal.",
      title: "Understanding National Accounts",
      sourceType: "edition",
      workId: "oecd-understanding-national-accounts-work",
      contributorDisplay: ["François Lequiller", "Derek Blades"],
      publicationYear: 2014,
      publisher: "OECD Publishing",
      identifiers: { doi: "10.1787/9789264214637-en", isbn13: "9789264214637" },
      resourceLinks: [
        {
          purpose: "publisher",
          url: "https://doi.org/10.1787/9789264214637-en",
          label: "Publisher record",
        },
      ],
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "warner-asymmetric-mobilisation-work",
      kind: "work",
      label: "Asymmetric mobilisation and wage-earner funds",
      description:
        "Neil Warner's archival study of why Swedish wage-earner-fund proposals failed to mobilize many intended supporters.",
      title:
        "‘What is it actually about?’ Asymmetric mobilisation and the defeat of wage-earner fund policies in Sweden",
      workType: "article",
      originalPublicationYear: 2025,
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "warner-asymmetric-mobilisation-source",
      kind: "source",
      label: "Asymmetric mobilisation and wage-earner funds (2025)",
      description:
        "The open-access Economic and Industrial Democracy article consulted for the individual-benefit and political-mobilization objection.",
      title:
        "‘What is it actually about?’ Asymmetric mobilisation and the defeat of wage-earner fund policies in Sweden",
      sourceType: "article",
      workId: "warner-asymmetric-mobilisation-work",
      contributorDisplay: ["Neil Warner"],
      publicationYear: 2025,
      publisher: "SAGE Publications",
      identifiers: { doi: "10.1177/0143831X251336584" },
      resourceLinks: [
        {
          purpose: "publisher",
          url: "https://doi.org/10.1177/0143831X251336584",
          label: "Read at SAGE Journals",
        },
      ],
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "collective-capital-formation-working-definition",
      kind: "statement",
      label:
        "Collective capital formation requires an accumulating institution",
      description:
        "A working definition centered on recurring accumulation and collective governance.",
      statementKind: "editorial-interpretation",
      text: "Collective capital formation describes arrangements that place recurring contributions or asset transfers into an enduring institution that holds capital claims on behalf of a defined constituency and governs them collectively.",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "collective-capital-formation-national-accounts-boundary",
      kind: "statement",
      label: "National-accounts capital formation is a different concept",
      description:
        "A boundary between an institutional ownership proposal and a measured investment aggregate.",
      statementKind: "definition",
      text: "In national accounts, gross fixed capital formation measures net acquisitions of produced fixed assets used in production for more than one year; it does not identify who owns, governs, or benefits from those assets.",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "collective-capital-formation-individual-saving-boundary",
      kind: "statement",
      label: "Collective accumulation is not an individual savings account",
      description:
        "A boundary based on whether people receive divisible personal claims.",
      statementKind: "classification",
      text: "A fund does not form collective capital merely because many people contribute: the distinction turns on whether assets and returns remain collectively held or are divided into individual accounts that participants can claim personally.",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "swedish-1981-funds-cash-financing",
      kind: "statement",
      label: "The 1981 Swedish proposal used cash financing",
      description:
        "A sourced observation about the revised proposal's asset-acquisition mechanism.",
      statementKind: "observation",
      text: "The 1981 Swedish wage-earner-fund proposal replaced compulsory share issuance with a levy on excess profits that funds would use to buy shares.",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "collective-capital-formation-financing-governance-boundary",
      kind: "statement",
      label: "A financing method does not establish collective governance",
      description:
        "A boundary between how a fund acquires assets and how authority over them is allocated.",
      statementKind: "editorial-interpretation",
      text: "How a fund acquires assets does not establish who governs the resulting holdings.",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "collective-capital-formation-governing-constituency",
      kind: "statement",
      label: "A collective fund must identify its governing constituency",
      description:
        "A governance boundary showing that collective-capital designs can represent different groups.",
      statementKind: "attributed-proposal",
      text: "Furendal and O'Neill argue that a collective-capital institution can be designed to represent different constituencies, including workers within a firm or sector, citizens in a region, and other social stakeholders.",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "meidner-collective-funds-proposal",
      kind: "statement",
      label: "Meidner proposed collectively owned wage-earner funds",
      description:
        "The original Swedish proposal used recurring share transfers to pursue accumulation, ownership change, and employee influence together.",
      statementKind: "attributed-proposal",
      text: "Meidner's LO proposal required larger firms to transfer shares tied to profits into collectively owned funds administered by employees and their organizations, allowing the funds' holdings and voting claims to grow over time.",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "collective-capital-formation-rights-boundary",
      kind: "statement",
      label: "Accumulation does not establish democratic investment control",
      description:
        "A boundary separating the existence of a collective fund from democratic control over investment.",
      statementKind: "editorial-interpretation",
      text: "Evidence that a fund accumulates assets does not by itself establish democratic control over its investment decisions.",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "collective-capital-formation-swedish-case-classification",
      kind: "statement",
      label: "Sweden's enacted funds were one constrained design",
      description:
        "A non-embodiment boundary between the broad concept and one bounded Case.",
      statementKind: "classification",
      text: "Sweden's enacted wage-earner funds are one bounded case related to collective capital formation, not a definition or complete realization of the concept.",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "collective-capital-formation-supporter-distance",
      kind: "statement",
      label: "Collective funds can feel remote from intended beneficiaries",
      description:
        "A mass-support and accountability objection drawn from the Swedish fund debate.",
      statementKind: "observation",
      text: "Warner argues that most Social Democratic voters and union members treated wage-earner funds as distant from their everyday concerns.",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "collective-capital-formation-unclear-benefits-objection",
      kind: "statement",
      label: "Intended supporters could not identify tangible benefits",
      description:
        "A distinct objection about the proposal's material legibility to beneficiaries.",
      statementKind: "observation",
      text: "Warner reports recurring complaints that the tangible benefits of wage-earner funds were unclear to intended supporters.",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "collective-capital-formation-purpose-objection",
      kind: "statement",
      label:
        "Some activists objected to capital formation displacing worker influence",
      description:
        "A distinct objection about which purpose the proposal placed first.",
      statementKind: "observation",
      text: "Warner reports that objections to capital formation displacing worker power and influence recurred at the 1981 LO and Social Democratic congresses.",
      ...reviewed,
    },
  },
] satisfies AuthoringDocument[];
