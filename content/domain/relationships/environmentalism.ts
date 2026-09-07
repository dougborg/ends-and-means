import type { AuthoringDocument } from "../../../src/lib/domain";

const citations = [
  [
    "environmentalism-contested-family",
    "sep-environmental-ethics-source",
    "introduction; sections 1 and 4",
    "supports",
  ],
  [
    "environmentalism-science-boundary",
    "sep-environmental-ethics-source",
    "introduction, paragraphs 1–5; section 5",
    "supports",
  ],
  [
    "environmentalism-conservation-boundary",
    "guha-environmentalism-global-history-source",
    "publisher description, paragraphs 1–2",
    "supports",
  ],
  [
    "environmentalism-sustainability-boundary",
    "brundtland-common-future-source",
    "chapter 2, paragraphs 1–27",
    "supports",
  ],
  [
    "environmentalism-climate-boundary",
    "sep-environmental-ethics-source",
    "sections 4.6 and 5",
    "context",
  ],
  [
    "environmentalism-party-policy-boundary",
    "sep-environmental-ethics-source",
    "sections 1–5",
    "context",
  ],
  [
    "environmentalism-global-history-plural",
    "guha-environmentalism-global-history-source",
    "publisher description, paragraphs 1–2",
    "supports",
  ],
  [
    "environmentalism-poor-attributed-classification",
    "martinez-alier-environmentalism-poor-source",
    "introduction, pp. 1–15",
    "supports",
  ],
  [
    "environmental-justice-three-dimensions",
    "schlosberg-environmental-justice-source",
    "abstract; pp. 397–401 and 405–413",
    "supports",
  ],
  [
    "indigenous-relations-boundary",
    "whyte-indigenous-climate-source",
    "pp. 599–604 and 611–614",
    "supports",
  ],
  [
    "colonial-conservation-displacement",
    "guha-unquiet-woods-source",
    "chapters 2–4, pp. 35–116",
    "supports",
  ],
  [
    "nuclear-environmental-policy-boundary",
    "sep-environmental-ethics-source",
    "sections 4.4–4.6 and 5",
    "context",
  ],
  [
    "chipko-commercial-forestry-conflict",
    "guha-unquiet-woods-source",
    "chapters 3–5, pp. 61–152",
    "supports",
  ],
  [
    "chipko-organized-tree-protection",
    "guha-unquiet-woods-source",
    "chapter 5, pp. 130–152",
    "supports",
  ],
  [
    "chipko-women-participation",
    "agarwal-gender-environment-debate-source",
    "pp. 119–125 and 145–154",
    "supports",
  ],
  [
    "chipko-ecofeminist-rival",
    "agarwal-gender-environment-debate-source",
    "pp. 119–126 and 145–154",
    "supports",
  ],
  [
    "chipko-state-community-rival",
    "rangan-contested-boundaries-source",
    "abstract; pp. 343–362",
    "supports",
  ],
  [
    "chipko-local-archive-provenance",
    "chandi-prasad-bhatt-papers-catalogue-source",
    "contents; section II(A), Subject Files 3–5; section II(B)",
    "supports",
  ],
  [
    "chipko-case-boundary",
    "rangan-contested-boundaries-source",
    "abstract; pp. 343–362",
    "qualifies",
  ],
  [
    "warren-county-landfill-siting",
    "gao-hazardous-landfills-source",
    "pp. 1–4 and appendix I",
    "supports",
  ],
  [
    "warren-county-protest",
    "ucc-toxic-wastes-race-source",
    "foreword, pp. x–xiii; pp. 17–20",
    "supports",
  ],
  [
    "warren-county-landfill-built",
    "gao-hazardous-landfills-source",
    "pp. 1–4 and appendix I",
    "supports",
  ],
  [
    "gao-siting-pattern",
    "gao-hazardous-landfills-source",
    "digest; pp. 1–4 and 14–16",
    "supports",
  ],
  [
    "ucc-national-race-finding",
    "ucc-toxic-wastes-race-source",
    "executive summary, pp. xiii–xvi; pp. 13–16",
    "supports",
  ],
  [
    "ej-summit-principles",
    "ej-principles-source",
    "Principles 1–17",
    "supports",
  ],
  [
    "warren-county-causal-boundary",
    "schlosberg-environmental-justice-source",
    "pp. 397–405",
    "qualifies",
  ],
  [
    "te-awa-legal-person",
    "te-awa-tupua-act-source",
    "sections 12 and 14–16",
    "supports",
  ],
  [
    "te-awa-living-whole",
    "te-awa-tupua-act-source",
    "sections 12–13",
    "supports",
  ],
  [
    "te-awa-tupua-kawa",
    "te-awa-tupua-act-source",
    "section 13 and sections 29–37",
    "supports",
  ],
  [
    "te-pou-tupua-representation",
    "te-awa-tupua-act-source",
    "sections 18–23",
    "supports",
  ],
  [
    "te-awa-iwi-provenance",
    "te-pou-tupua-te-awa-source",
    "Legal Recognition of Te Awa Tupua, paragraphs 1–10",
    "supports",
  ],
  [
    "te-awa-environmentalism-boundary",
    "te-pou-tupua-te-awa-source",
    "Legal Recognition of Te Awa Tupua, paragraphs 1–10; community account, paragraphs 1–8",
    "supports",
  ],
  [
    "te-awa-environmentalism-boundary",
    "te-awa-tupua-act-source",
    "long title; sections 3, 12–20, and 69–71",
    "supports",
  ],
] as const;

export const environmentalismRelationshipDocuments = [
  ...citations.map(([statementId, sourceId, locator, role], index) => ({
    documentType: "relationships" as const,
    subject: { kind: "statement" as const, id: statementId },
    relationships: [
      {
        id: `environmentalism-citation-${index + 1}`,
        predicate: "cites" as const,
        subject: { kind: "statement" as const, id: statementId },
        object: { kind: "source" as const, id: sourceId },
        role,
        locator,
      },
    ],
  })),
  ...(
    [
      ["chipko-garhwal-1973-1981", "chipko-case-boundary"],
      [
        "warren-county-environmental-justice-1982-1991",
        "warren-county-causal-boundary",
      ],
      [
        "te-awa-tupua-framework-2017-present",
        "te-awa-environmentalism-boundary",
      ],
    ] as const
  ).map(([caseId, statementId], index) => ({
    documentType: "relationships" as const,
    subject: { kind: "case" as const, id: caseId },
    relationships: [
      {
        id: `environmentalism-case-concept-${index + 1}`,
        predicate: "contested-in-case" as const,
        subject: { kind: "case" as const, id: caseId },
        object: { kind: "concept" as const, id: "environmentalism" },
        status: "contested" as const,
        statementIds: [statementId],
      },
    ],
  })),
] satisfies AuthoringDocument[];
