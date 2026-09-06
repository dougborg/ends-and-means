import type { AuthoringDocument } from "../../../src/lib/domain";

const common = {
  publicationStatus: "reviewed" as const,
  obligationStatus: "open" as const,
  statementIds: [],
  reviewedAt: "2026-09-06",
};

export const capitalismMarketResearchDocuments = [
  {
    documentType: "entity",
    entity: {
      id: "capitalism-coerced-labor-boundary",
      kind: "research-obligation",
      label: "Coerced labor within capitalist accumulation",
      description:
        "A focused historical test of definitions that center formally free wage labor.",
      obligationType: "counterargument",
      question:
        "How should definitions centered on wage labor classify capitalist firms and financial networks that depended on enslaved, indentured, or otherwise coerced labor?",
      target: { kind: "concept", id: "capitalism" },
      targetSectionId: "what-defines-capitalism",
      addressedStatementIds: [
        "capitalism-marx-definition",
        "wage-labor-boundary",
      ],
      currentLimitation:
        "Definitions centered on formally free wage labor do not by themselves reconcile scholarship on the simultaneous use of wage and coerced labor within connected production and financial systems.",
      evidenceNeeded:
        "Preselected enterprise, plantation, merchant, and financial records paired with independent histories that trace ownership, labor control, contracts, credit, and profits without treating coerced labor as external by definition.",
      scope:
        "Named Atlantic production and finance networks between approximately 1780 and 1865; no inference that every capitalist enterprise used the same labor relation.",
      ...common,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "capitalism-household-reproduction-boundary",
      kind: "research-obligation",
      label: "Household labor and social reproduction",
      description:
        "A focused test of accounts that locate capitalism primarily in firms and paid employment.",
      obligationType: "counterargument",
      question:
        "Which unpaid household and care arrangements materially sustained wage labor in selected capitalist economies, and how did law and policy distribute that work?",
      target: { kind: "concept", id: "capitalism" },
      targetSectionId: "which-institutions-work-together",
      addressedStatementIds: ["wage-labor-boundary", "firm-market-boundary"],
      currentLimitation:
        "The institutional account separates households from firms but does not measure how unpaid work enabled employment or how those dependencies varied by gender, race, class, citizenship, and family law.",
      evidenceNeeded:
        "Time-use data, household and labor law, social-policy records, employer practices, and historically bounded feminist political-economy research for named populations and periods.",
      scope:
        "Selected economies and periods chosen before comparison; not a claim that one household form or gender division is universal.",
      ...common,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "capitalism-commodity-production-relation",
      kind: "research-obligation",
      label: "Commodity production in definitions of capitalism",
      description:
        "A focused test of whether production for exchange is necessary or sufficient in rival definitions of capitalism.",
      obligationType: "research-gap",
      question:
        "How do rival definitions relate capitalism to commodity production rather than to market exchange alone?",
      target: { kind: "concept", id: "capitalism" },
      targetSectionId: "what-defines-capitalism",
      addressedStatementIds: [
        "capitalism-market-boundary",
      ],
      currentLimitation:
        "The present evidence distinguishes production for exchange from ownership and establishes that markets predate modern capitalism, but it does not directly establish a capitalism–commodity-production relationship.",
      evidenceNeeded:
        "Precisely located rival definitions that state whether commodity production is necessary, sufficient, characteristic, or historically variable within capitalism.",
      scope:
        "Attributed definitions and bounded historical applications; not an inference from the presence of trade alone.",
      ...common,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "capitalism-business-firm-relation",
      kind: "research-obligation",
      label: "Business firms in definitions of capitalism",
      description:
        "A focused test of the place of firms in rival definitions of capitalism.",
      obligationType: "research-gap",
      question:
        "Which forms of business firm are necessary, characteristic, or incidental in rival definitions of capitalism?",
      target: { kind: "concept", id: "capitalism" },
      targetSectionId: "which-institutions-work-together",
      addressedStatementIds: [
        "firm-market-boundary",
      ],
      currentLimitation:
        "The present evidence distinguishes coordination inside firms from market exchange but does not directly establish a capitalism–business-firm relationship.",
      evidenceNeeded:
        "Precisely located definitions and comparative institutional research that distinguish firm type, ownership, governance, employment, and legal personality.",
      scope:
        "Named firm forms in attributed definitions and bounded cases; not every organization that produces goods or services.",
      ...common,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "china-tve-effective-control",
      kind: "research-obligation",
      label:
        "Effective ownership and control in township and village enterprises",
      description:
        "A bounded ownership test for enterprises whose formal labels may not reveal control in practice.",
      obligationType: "research-gap",
      question:
        "Who exercised appointment, investment, income, transfer, and residual-control rights in different Chinese township and village enterprises from 1978 through 1993?",
      target: { kind: "concept", id: "market-economy" },
      targetSectionId: "what-do-bounded-cases-show",
      addressedStatementIds: [
        "china-tve-ownership-boundary",
        "china-marketization-classification-limit",
      ],
      currentLimitation:
        "Naughton establishes non-state entry, but the present evidence does not compare ownership or effective control rights across enterprise forms and localities.",
      evidenceNeeded:
        "Enterprise charters, accounts, appointment and disposition records, local-government archives, worker testimony where available, and comparative scholarship covering a preselected set of provinces and sectors.",
      scope:
        "Selected township and village enterprises in the People’s Republic of China from 1978 through 1993; later privatization requires a separate period.",
      ...common,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "gold-coast-cocoa-labor-distribution",
      kind: "research-obligation",
      label: "Labor and gains in Gold Coast cocoa production",
      description:
        "A bounded distributional test of a producer-led commodity expansion.",
      obligationType: "counterevidence",
      question:
        "How were land access, labor obligations, risks, and gains distributed among cocoa farmers, family workers, tenants, migrants, and hired laborers in Asante and the Gold Coast from 1890 through 1936?",
      target: { kind: "concept", id: "market-economy" },
      targetSectionId: "what-do-bounded-cases-show",
      addressedStatementIds: [
        "ghana-cocoa-smallholder-expansion",
        "ghana-cocoa-classification-limit",
      ],
      currentLimitation:
        "The present source establishes producer-led expansion but does not disaggregate ownership, labor relations, control, or returns among differently situated participants.",
      evidenceNeeded:
        "Farm and household records, land and tenancy agreements, wage and migration evidence, colonial records read critically, oral histories where provenance permits, and locally grounded scholarship.",
      scope:
        "Cocoa-growing areas of Asante and the colonial Gold Coast from about 1890 through 1936; not every crop, household, or region in present-day Ghana.",
      ...common,
    },
  },
] satisfies AuthoringDocument[];
