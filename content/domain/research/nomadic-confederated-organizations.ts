import type { AuthoringDocument } from "../../../src/lib/domain";

const shared = { statementIds: [], obligationStatus: "open" as const, publicationStatus: "reviewed" as const, reviewedAt: "2026-09-07" };

export const nomadicConfederatedOrganizationResearchDocuments = [
  {
    documentType: "entity", entity: {
      id: "ruwalla-nonelite-oral-perspectives", kind: "research-obligation", label: "Ruwalla non-elite and women’s perspectives",
      description: "A focused source-provenance gap in an archive-led historical case.", obligationType: "research-gap",
      question: "How did Ruwalla women and non-elite pastoralists describe leadership, affiliation, mobility, and state bargaining during 1918–1936?",
      target: { kind: "case", id: "ruwalla-borderland-organization" }, targetSectionId: "what-can-the-sources-establish",
      addressedStatementIds: ["ruwalla-archive-mediation"],
      currentLimitation: "Colonial archives and later syntheses preserve elite male negotiations more fully than contemporaneous non-elite and women’s accounts.",
      evidenceNeeded: "Provenanced Arabic oral histories, family papers, poetry or testimony with named recorders, dates, translation history, consent, and an explicit account of retrospective memory.",
      scope: "Ruwalla participants in the southwestern Syrian Desert–Wadi Sirhan corridor during 1918–1936; later memories must be dated and cannot establish unchanged practice.", ...shared,
    },
  },
  {
    documentType: "entity", entity: {
      id: "ruwalla-shaykh-authority-variation", kind: "research-obligation", label: "Variation in Ruwalla shaykhly authority",
      description: "A counterevidence question about representation and consent below the paramount shaykh.", obligationType: "counterevidence",
      question: "When did Ruwalla sections accept, redirect, or refuse Al Shaʿlan leadership in negotiations with states between 1918 and 1936?",
      target: { kind: "case", id: "ruwalla-borderland-organization" }, targetSectionId: "how-did-leadership-work",
      addressedStatementIds: ["ruwalla-mashyakha", "ruwalla-shaykh-consent-limit"],
      currentLimitation: "The evidence establishes representative office and a need for persuasion but does not measure authority uniformly across sections or decisions.",
      evidenceNeeded: "Decision-level correspondence and accounts from multiple Ruwalla sections that distinguish announced positions, bargaining, compliance, dissent, and exit.",
      scope: "Named Ruwalla sections and decisions in the case corridor and period; no inference to all ʿAnaza-affiliated groups.", ...shared,
    },
  },
  {
    documentType: "entity", entity: {
      id: "ruwalla-border-distribution", kind: "research-obligation", label: "Distribution of border bargains",
      description: "A counterargument about who gained and bore costs from trans-border arrangements.", obligationType: "counterargument",
      question: "How were the gains and burdens of cross-border pasture access, security agreements, trade, taxation, and coercion distributed among Ruwalla households and sections?",
      target: { kind: "case", id: "ruwalla-borderland-organization" }, targetSectionId: "how-did-new-states-change-the-relationship",
      addressedStatementIds: ["ruwalla-border-bargaining", "ruwalla-border-concessions"],
      currentLimitation: "Diplomatic outcomes show collective agency without establishing that benefits, payments, risks, or violence were shared evenly.",
      evidenceNeeded: "Household- and section-level records of levies, subsidies, market access, grazing access, losses, and enforcement across several border decisions.",
      scope: "Ruwalla households affected by named border arrangements between 1918 and 1936.", ...shared,
    },
  },
  {
    documentType: "entity", entity: {
      id: "jinst-translation-oral-provenance", kind: "research-obligation", label: "Jinst interview language and translation provenance",
      description: "A focused provenance question for field-based terminology and reported norms.", obligationType: "research-gap",
      question: "In which languages were Jinst interviews conducted and recorded, who interpreted or translated them, and how did those choices affect the published English terms for groups, rights, and norms?",
      target: { kind: "case", id: "jinst-postcollective-pastoral-governance" },
      addressedStatementIds: ["jinst-fieldwork-provenance", "jinst-neg-nutgiinkhan-boundary"],
      currentLimitation: "The article describes interview methods and assistance but does not supply a full language-by-language translation and consent trail for each reported term.",
      evidenceNeeded: "Field protocols, language and interpreter records, consent terms, original-language excerpts where authorized, and review by Jinst participants or qualified Mongolian scholars.",
      scope: "Interviews and participant observation in the Jinst study community during 1994–1995.", ...shared,
    },
  },
  {
    documentType: "entity", entity: {
      id: "jinst-access-inequality", kind: "research-obligation", label: "Distribution of Jinst resource access",
      description: "A counterevidence question about gender, wealth, seniority, and secondary claims.", obligationType: "counterevidence",
      question: "How did gender, wealth, age, camp seniority, new-herder status, and absentee ownership affect access to Jinst campsites, wells, labor, transport, and seasonal pasture during 1990–1997?",
      target: { kind: "case", id: "jinst-postcollective-pastoral-governance" },
      addressedStatementIds: ["jinst-campsite-rights", "jinst-inequality", "jinst-tenure-proposal-limit"],
      currentLimitation: "The study identifies wealth and newcomer differences, but its pooled tables and household categories do not establish every distributional mechanism within Jinst.",
      evidenceNeeded: "Jinst-specific disaggregated interviews and resource histories linking claim basis, decision voice, labor, mobility, and exclusion across seasons.",
      scope: "Households using the sampled Jinst bag during 1990–1997; separate Jinst findings from pooled two-district results.", ...shared,
    },
  },
  {
    documentType: "entity", entity: {
      id: "jinst-post-1997-continuity", kind: "research-obligation", label: "Jinst institutional change after 1997",
      description: "A transfer-limit question about later tenure and pasture-user institutions.", obligationType: "research-gap",
      question: "Which 1990s Jinst pasture practices persisted, changed, or ended after 1997 as certificates, pasture-user groups, markets, and climate pressures developed?",
      target: { kind: "case", id: "jinst-postcollective-pastoral-governance" },
      addressedStatementIds: ["jinst-mobility-coordination", "jinst-tenure-proposal-limit", "mongolia-later-study-transfer"],
      currentLimitation: "Later national and multi-ecozone studies do not identify Jinst continuity, and later formal pasture-user organizations cannot be projected into the 1990s episode.",
      evidenceNeeded: "A dated Jinst institutional history combining herder accounts, local rules, certificates and agreements, membership records, movement histories, and ecological observations.",
      scope: "Jinst sum after 1997, analyzed as a later episode rather than an extension assumed from the present case.", ...shared,
    },
  },
] satisfies AuthoringDocument[];
