import type { AuthoringDocument } from "../../../src/lib/domain";

const common = {
  publicationStatus: "reviewed" as const,
  obligationStatus: "open" as const,
  statementIds: [],
  reviewedAt: "2026-09-07",
};

export const welfareStateResearchDocuments = [
  {
    documentType: "entity",
    entity: {
      id: "welfare-state-unpaid-care-distribution",
      kind: "research-obligation",
      label: "Unpaid care and social reproduction",
      description:
        "Measure how welfare arrangements redistribute care, time, income, and dependence within households.",
      obligationType: "counterevidence",
      question:
        "Who performs unpaid care under each selected arrangement, and how do services, cash benefits, leave, employment rules, and household eligibility change that work?",
      target: { kind: "concept", id: "welfare-state" },
      targetSectionId: "care",
      addressedStatementIds: [
        "care-social-reproduction-boundary",
        "social-care-welfare-mix",
      ],
      currentLimitation:
        "The comparative sources establish why care belongs in the analysis but do not measure time, dependency, service quality, or bargaining effects across the three bounded cases.",
      evidenceNeeded:
        "Time-use data, service and leave records, household-level benefit rules, care-worker evidence, and research disaggregated by gender, class, disability, age, residency status, and household form.",
      scope:
        "The three selected case periods and later separately bounded extensions; no universal household model.",
      ...common,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "welfare-state-formal-access-exclusion",
      kind: "research-obligation",
      label: "Formal entitlement and unequal access",
      description:
        "Test which people could claim benefits in law and obtain them in practice.",
      obligationType: "counterevidence",
      question:
        "How did citizenship, race, caste, class, disability, gender, region, employment, residency status, and colonial position affect eligibility, take-up, appeals, treatment, and benefit adequacy?",
      target: { kind: "concept", id: "welfare-state" },
      targetSectionId: "design",
      addressedStatementIds: [
        "welfare-outcome-boundary",
        "welfare-design-facets",
        "welfare-benefit-forms",
      ],
      currentLimitation:
        "Formal rules and aggregate coverage cannot show which eligible or excluded people received adequate support or encountered administrative barriers.",
      evidenceNeeded:
        "Disaggregated administrative and survey data, claim and appeal records, local implementation studies, and testimony from affected groups.",
      scope:
        "Named programs and populations within each bounded case; classifications must follow the categories and limits of the source data.",
      ...common,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "welfare-state-authoritarian-provision",
      kind: "research-obligation",
      label: "Authoritarian welfare provision and political incorporation",
      description:
        "Separate social provision from democratic accountability and test its political uses.",
      obligationType: "counterargument",
      question:
        "When have authoritarian governments expanded social provision, which groups did they include, and did provision support legitimation, surveillance, labor discipline, selective incorporation, or independent social rights?",
      target: { kind: "concept", id: "welfare-state" },
      addressedStatementIds: [
        "welfare-political-regime-boundary",
        "welfare-attributed-purposes",
        "korea-authoritarian-democratic-boundary",
      ],
      currentLimitation:
        "The Korean evidence rejects a simple regime binary but does not compare authoritarian provision across institutions, regions, or mechanisms of political control.",
      evidenceNeeded:
        "Program laws and budgets, beneficiary records, enforcement evidence, political histories, and comparisons across authoritarian and democratic periods with rival explanations.",
      scope:
        "Separately bounded governments and programs; welfare provision is not treated as proof of either consent or coercion.",
      ...common,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "welfare-state-nonstate-provision-boundary",
      kind: "research-obligation",
      label: "State-centered category limits",
      description:
        "Examine provision organized through kinship, mutual aid, customary authority, communities, and Indigenous institutions on their own terms.",
      obligationType: "research-gap",
      question:
        "Which institutions pool risks or organize care outside state-centered welfare categories, and when does interaction with taxation, law, colonial administration, employers, or markets make comparison useful?",
      target: { kind: "concept", id: "welfare-state" },
      targetSectionId: "definitions",
      addressedStatementIds: [
        "social-protection-category-boundary",
        "welfare-mixed-provision",
      ],
      currentLimitation:
        "The current guide identifies mixed provision but its bounded cases all center statutory state institutions.",
      evidenceNeeded:
        "Community-authored records, oral histories with appropriate provenance, institutional histories, and locally grounded scholarship that does not impose an evolutionary or residual category.",
      scope:
        "Named customary, kinship, mutual-aid, Indigenous, colonial, or community arrangements in specified places and periods.",
      ...common,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "welfare-state-institution-outcome-counterfactual",
      kind: "research-obligation",
      label: "Institution and outcome counterfactuals",
      description:
        "Test whether observed distributional or health changes were caused by selected welfare institutions.",
      obligationType: "counterfactual",
      question:
        "What would likely have happened to access, income security, health, employment, or inequality without the selected reform or under a plausible alternative design?",
      target: { kind: "concept", id: "welfare-state" },
      addressedStatementIds: [
        "welfare-outcome-boundary",
        "costa-rica-financing-access",
        "korea-reform-outcome-limit",
        "south-korea-welfare-case-limit",
      ],
      currentLimitation:
        "The selected institutional histories establish timing, design, and observed limits but do not isolate causal effects from economic change, demography, labor markets, public health, or political mobilization.",
      evidenceNeeded:
        "Credible comparative or quasi-experimental research, pre-reform trends, implementation variation, and outcomes disaggregated by affected population.",
      scope:
        "Exact programs and outcomes within the three bounded cases; separate designs require separate counterfactuals.",
      ...common,
    },
  },
] satisfies AuthoringDocument[];
