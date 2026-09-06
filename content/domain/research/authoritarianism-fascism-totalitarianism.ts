import type { AuthoringDocument } from "../../../src/lib/domain";

const common = {
  publicationStatus: "reviewed" as const,
  obligationStatus: "open" as const,
  statementIds: [],
  reviewedAt: "2026-09-06",
};

export const authoritarianismFascismTotalitarianismResearchDocuments = [
  {
    documentType: "entity",
    entity: {
      id: "authoritarian-practice-regime-transfer",
      kind: "research-obligation",
      label: "Practices and regime classification",
      description: "A focused test of when practice-level evidence supports a regime-level inference.",
      obligationType: "counterevidence",
      question: "When do repeated authoritarian practices justify reclassifying a political regime, and what contrary evidence should prevent that inference?",
      target: { kind: "concept", id: "authoritarianism" },
      targetSectionId: "definitions",
      addressedStatementIds: ["authoritarian-practice-boundary"],
      currentLimitation: "The current evidence distinguishes practices from regime categories but does not establish a common threshold for moving between those levels.",
      evidenceNeeded: "Preselected longitudinal cases with practice-level records, explicit regime measures, uncertainty estimates, and evidence of restored accountability.",
      scope: "Named institutions and periods across more than one measured regime category; no timeless national labels.",
      ...common,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "fascism-crossregional-boundary",
      kind: "research-obligation",
      label: "Fascism beyond its European reference cases",
      description: "A focused boundary test for transferring fascism classifications across regions.",
      obligationType: "counterargument",
      question: "Which proposition-specific evidence is required before applying a fascism classification beyond interwar European movements?",
      target: { kind: "concept", id: "fascism" },
      targetSectionId: "variation",
      addressedStatementIds: ["fascism-label-boundary", "fascism-crossnational-variation"],
      currentLimitation: "The guide establishes rival definitions and variation within European reference cases but does not test transfer to a preselected cross-regional sample.",
      evidenceNeeded: "Movement-produced records, organizational histories, political-practice evidence, local-language scholarship, and rival classifications for a preselected sample.",
      scope: "Named movements in specified periods outside Europe; neither resemblance nor present-day polemic counts as classification evidence.",
      ...common,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "totalitarian-control-evidence",
      kind: "research-obligation",
      label: "Claimed and effective total control",
      description: "A focused counterevidence question about comprehensive-control claims.",
      obligationType: "counterevidence",
      question: "What institutional evidence distinguishes a project of total domination from effective control, evasion, bargaining, and organizational survival?",
      target: { kind: "concept", id: "totalitarianism" },
      targetSectionId: "bounded-practice",
      addressedStatementIds: ["nazi-control-limit", "totalitarian-case-nonembodiment"],
      currentLimitation: "The current German episode shows wide coordination and a documented limit but does not measure control across institutions or over time.",
      evidenceNeeded: "Institution-level directives, implementation records, participant evidence, and specialist studies of compliance, evasion, conflict, and institutional continuity.",
      scope: "Preselected institutions in Nazi Germany during specified periods, followed by separately justified comparisons; no inference from a regime label alone.",
      ...common,
    },
  },
] satisfies AuthoringDocument[];
