import type { AuthoringDocument } from "../../../src/lib/domain";

const common = {
  publicationStatus: "reviewed" as const,
  obligationStatus: "open" as const,
  statementIds: [],
  reviewedAt: "2026-09-06",
};
export const feminismResearchDocuments = [
  {
    documentType: "entity",
    entity: {
      id: "feminism-universal-subject-exclusion",
      kind: "research-obligation",
      label: "Exclusion by universal feminist subjects",
      description:
        "A focused comparison of who universal claims exclude and through which institutions.",
      obligationType: "counterargument",
      question:
        "When feminist programs claim a common subject, whose interests, authority, or experience do their categories exclude?",
      target: { kind: "concept", id: "feminism" },
      targetSectionId: "coalition-and-boundaries",
      addressedStatementIds: [
        "crenshaw-single-axis-limit",
        "mohanty-western-universal-limit",
        "moreton-robinson-indigenous-boundary",
      ],
      currentLimitation:
        "The current evidence establishes three serious critiques but does not compare how exclusion operates across legal claims, transnational representation, Indigenous sovereignty, disability, citizenship, and caste.",
      evidenceNeeded:
        "Located self-descriptions and independent studies of specific organizations or policy disputes, including participants who contested their categories.",
      scope:
        "Selected organizations and texts in their named places and periods; no universal hierarchy of exclusions.",
      ...common,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "feminism-translation-nonwestern-naming",
      kind: "research-obligation",
      label: "Translation and non-Western naming",
      description:
        "A focused question about self-description across languages and political histories.",
      obligationType: "research-gap",
      question:
        "How do movements outside English-language Western genealogies translate, reject, or rework names rendered as feminism?",
      target: { kind: "concept", id: "feminism" },
      addressedStatementIds: [
        "mohanty-western-universal-limit",
        "moreton-robinson-indigenous-boundary",
        "sewa-case-boundary",
      ],
      currentLimitation:
        "English-language sources cannot establish which translated labels or genealogies actors in other settings claim for themselves.",
      evidenceNeeded:
        "Primary records in original languages, named translators and editions, oral histories where appropriate, and scholarship on local political vocabulary.",
      scope:
        "Bounded organizations and language communities; no presumption that an English family label travels unchanged.",
      ...common,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "feminism-sex-gender-trans-boundaries",
      kind: "research-obligation",
      label: "Sex, gender, and trans boundaries",
      description:
        "A focused dispute over political subjects and institutional consequences.",
      obligationType: "counterargument",
      question:
        "How do rival feminist accounts of sex, gender, sexuality, and trans membership change proposed rules for bodily autonomy, safety, care, and association?",
      target: { kind: "concept", id: "feminism" },
      targetSectionId: "traditions",
      addressedStatementIds: [
        "sex-gender-trans-boundary",
        "koyama-transfeminist-self-description",
        "koyama-body-autonomy",
        "radical-feminism-structural-boundary",
      ],
      currentLimitation:
        "One transfeminist manifesto and an overview of radical-feminist disputes do not represent the strongest rival positions or their institutional effects.",
      evidenceNeeded:
        "Located primary arguments from trans-inclusive and critical positions, testimony from affected groups, and policy-specific evidence that distinguishes claims from outcomes.",
      scope:
        "Named debates and institutions rather than a binary verdict about all feminists or trans people.",
      ...common,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "feminism-policy-attribution-causal-effects",
      kind: "research-obligation",
      label: "Feminist policy attribution and causal effects",
      description:
        "A causal question separating feminist advocacy, enacted design, use, and outcomes.",
      obligationType: "counterfactual",
      question:
        "Which actors attributed a policy to feminist aims, and what would likely have happened to its distributional outcomes without the policy?",
      target: { kind: "concept", id: "feminism" },
      addressedStatementIds: [
        "formal-substantive-equality-boundary",
        "iceland-leave-enacted-design",
        "iceland-fathers-uptake",
        "iceland-care-work-outcomes",
        "iceland-causal-transfer-limit",
      ],
      currentLimitation:
        "The Iceland evidence documents design, take-up, and longitudinal change but does not make feminism the sole author or isolate every causal pathway.",
      evidenceNeeded:
        "Legislative histories that identify advocates, quasi-experimental or comparative designs, distributional results by income and family form, and rival explanations.",
      scope:
        "The Iceland 2000 reform and separately selected policies with comparable institutional and outcome data.",
      ...common,
    },
  },
] satisfies AuthoringDocument[];
