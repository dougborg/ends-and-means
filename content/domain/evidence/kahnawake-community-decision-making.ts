import type { AuthoringDocument } from "../../../src/lib/domain";

const reviewed = { publicationStatus: "reviewed" as const };

export const kahnawakeCommunityDecisionMakingEvidenceDocuments = [
  {
    documentType: "entity",
    entity: {
      id: "kahnawake",
      kind: "place",
      label: "Kahnawà:ke",
      description:
        "The Kanien’kehá:ka community and territory on the south shore of the St. Lawrence River near Montréal.",
      placeType: "territory",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "horn-miller-indigenous-participatory-democracy-work",
      kind: "work",
      label: "What Does Indigenous Participatory Democracy Look Like?",
      description:
        "Kahente Horn-Miller’s community-situated analysis of Kahnawà:ke’s Community Decision Making Process.",
      title:
        "What Does Indigenous Participatory Democracy Look Like? Kahnawà:ke’s Community Decision Making Process",
      workType: "article",
      originalPublicationYear: 2013,
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "horn-miller-indigenous-participatory-democracy-source",
      kind: "source",
      label: "Kahnawà:ke’s Community Decision Making Process (2013)",
      description:
        "The peer-reviewed article by Kanien’kehá:ka scholar and then-Kahnawà:ke Legislative Coordinating Commission coordinator Kahente Horn-Miller.",
      title:
        "What Does Indigenous Participatory Democracy Look Like? Kahnawà:ke’s Community Decision Making Process",
      sourceType: "article",
      workId: "horn-miller-indigenous-participatory-democracy-work",
      contributorDisplay: ["Kahente Horn-Miller"],
      publicationYear: 2013,
      publisher: "Review of Constitutional Studies",
      resourceLinks: [
        {
          purpose: "authorized-reading",
          url: "https://www.constitutionalstudies.ca/wp-content/uploads/2022/05/18.1.1-FI.pdf",
          label: "Read the journal issue",
        },
      ],
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "kahnawake-cdmrp-public-description-work",
      kind: "work",
      label: "Kahnawà:ke Community Decision Making and Review Process",
      description:
        "The Kahnawà:ke Legislative Commission’s public description and revision record for the community law-making process.",
      title: "What is the Community Decision Making and Review Process?",
      workType: "other",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "kahnawake-cdmrp-public-description-source",
      kind: "source",
      label: "Community Decision Making and Review Process",
      description:
        "The Kahnawà:ke Legislative Commission’s living public account of the process, its history, and current revisions.",
      title: "What is the Community Decision Making and Review Process?",
      sourceType: "web-page",
      workId: "kahnawake-cdmrp-public-description-work",
      contributorDisplay: ["Kahnawà:ke Legislative Commission"],
      publisher: "Kahnawà:ke Legislative Commission",
      resourceLinks: [
        {
          purpose: "publisher",
          url: "https://www.kahnawakemakingdecisions.com/cdmp/",
          label: "Read the community process description",
        },
      ],
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "kahnawake-cdmrp-2024-hearing-modification-work",
      kind: "work",
      label: "Modification to Community Decision Making & Review Process Hearings",
      description:
        "The Kahnawà:ke Legislative Commission’s January 2024 notice changing attendance and continuation rules for community hearings.",
      title: "Modification to Community Decision Making & Review Process Hearings",
      workType: "other",
      originalPublicationYear: 2024,
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "kahnawake-cdmrp-2024-hearing-modification-source",
      kind: "source",
      label: "CDMRP hearing modification notice (2024)",
      description:
        "The Kahnawà:ke Legislative Commission’s dated public notice of revised hearing pre-registration, attendance, postponement, and continuation rules.",
      title: "Modification to Community Decision Making & Review Process Hearings",
      sourceType: "web-page",
      workId: "kahnawake-cdmrp-2024-hearing-modification-work",
      contributorDisplay: ["Kahnawà:ke Legislative Commission"],
      publicationYear: 2024,
      publisher: "Kahnawà:ke Legislative Commission",
      resourceLinks: [
        {
          purpose: "publisher",
          url: "https://www.kahnawakemakingdecisions.com/news/news_text.asp?ID=680",
          label: "Read the hearing modification notice",
        },
      ],
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "kahnawake-cdmrp-2024-revised-hearing-modification-work",
      kind: "work",
      label:
        "Revised Modification to Community Decision Making & Review Process Hearing",
      description:
        "The Kahnawà:ke Legislative Commission’s April 2024 clarification and revision of the January hearing-continuation rule.",
      title:
        "Revised Modification to Community Decision Making & Review Process (CDMRP) Hearing",
      workType: "other",
      originalPublicationYear: 2024,
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "kahnawake-cdmrp-2024-revised-hearing-modification-source",
      kind: "source",
      label: "Revised CDMRP hearing modification notice (2024)",
      description:
        "The Kahnawà:ke Legislative Commission’s April 18 notice replacing automatic advancement after two under-attended hearing attempts with a commission decision on next steps.",
      title:
        "Revised Modification to Community Decision Making & Review Process (CDMRP) Hearing",
      sourceType: "web-page",
      workId: "kahnawake-cdmrp-2024-revised-hearing-modification-work",
      contributorDisplay: ["Kahnawà:ke Legislative Commission"],
      publicationYear: 2024,
      publisher: "Kahnawà:ke Legislative Commission",
      resourceLinks: [
        {
          purpose: "publisher",
          url: "https://www.kahnawakemakingdecisions.com/news/news_text.asp?ID=702",
          label: "Read the revised hearing modification notice",
        },
      ],
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "kahnawake-cdmrp-2023-survey-analysis-work",
      kind: "work",
      label: "Analysis of 2023 CDMRP Evaluation Survey",
      description:
        "A commissioned analysis of 480 Kahnawà:ke community survey responses about the law-making process.",
      title: "Analysis of 2023 CDMRP Evaluation Survey",
      workType: "report",
      originalPublicationYear: 2024,
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "kahnawake-cdmrp-2023-survey-analysis-source",
      kind: "source",
      label: "Analysis of 2023 CDMRP Evaluation Survey (2024)",
      description:
        "The Kahnawà:ke Legislative Commission publication of Neil McComber’s qualitative survey analysis, including its sampling limitations.",
      title: "Analysis of 2023 CDMRP Evaluation Survey",
      sourceType: "report",
      workId: "kahnawake-cdmrp-2023-survey-analysis-work",
      contributorDisplay: [
        "Neil McComber",
        "Kahnawà:ke Legislative Commission",
      ],
      publicationYear: 2024,
      publisher: "Kahnawà:ke Legislative Commission",
      resourceLinks: [
        {
          purpose: "publisher",
          url: "https://kahnawakemakingdecisions.com/promo/2024-09-16-CDMRPfinal2024analysis.pdf",
          label: "Read the survey analysis",
        },
      ],
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "canada-indian-act-work",
      kind: "work",
      label: "Indian Act",
      description:
        "Canada’s federal statute defining the administrative categories of band and council of the band.",
      title: "Indian Act",
      workType: "law",
      originalPublicationYear: 1876,
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "canada-indian-act-1985-source",
      kind: "source",
      label: "Indian Act (R.S.C. 1985, c. I-5)",
      description:
        "The official consolidated federal legal text consulted for the Act’s current definitions and elected-council provisions.",
      title: "Indian Act",
      sourceType: "legal-text",
      workId: "canada-indian-act-work",
      contributorDisplay: ["Parliament of Canada"],
      publicationYear: 1985,
      publisher: "Justice Laws Website, Government of Canada",
      resourceLinks: [
        {
          purpose: "publisher",
          url: "https://laws-lois.justice.gc.ca/eng/acts/I-5/",
          label: "Read the consolidated Act",
        },
      ],
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "sneath-tribe-work",
      kind: "work",
      label: "Tribe",
      description:
        "David Sneath’s history and critique of tribe as an anthropological and colonial category.",
      title: "Tribe",
      workType: "article",
      originalPublicationYear: 2016,
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "sneath-tribe-source",
      kind: "source",
      label: "Tribe (Open Encyclopedia of Anthropology)",
      description:
        "The 2023 Open Encyclopedia of Anthropology facsimile of Sneath’s 2016 Cambridge Encyclopedia of Anthropology entry.",
      title: "Tribe",
      sourceType: "article",
      workId: "sneath-tribe-work",
      contributorDisplay: ["David Sneath"],
      publicationYear: 2023,
      publisher: "Open Encyclopedia of Anthropology",
      identifiers: { doi: "10.29164/16tribe" },
      resourceLinks: [
        {
          purpose: "publisher",
          url: "https://www.anthroencyclopedia.com/entry/tribe",
          label: "Read the encyclopedia entry",
        },
      ],
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "tribe-not-universal-political-form",
      kind: "statement",
      label: "Tribe does not identify one political form",
      description:
        "A scholarly boundary against treating tribe as a universal type of government.",
      statementKind: "definition",
      text: "Sneath reports that social and cultural anthropologists have largely abandoned tribe as a general sociological category because it does not reliably identify a society’s political organization or complexity.",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "tribe-colonial-evolutionary-history",
      kind: "statement",
      label: "Tribe carries colonial and evolutionary histories",
      description:
        "A historical reason not to encode band, tribe, chiefdom, and state as a universal sequence.",
      statementKind: "observation",
      text: "Sneath traces the modern analytical use of tribe to colonial classification and evolutionary accounts that treated non-European societies as earlier stages of political development.",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "indian-act-band-administrative-definition",
      kind: "statement",
      label: "Band is a Canadian statutory category",
      description:
        "A legal definition that does not claim one form of community identity or political organization.",
      statementKind: "definition",
      text: "Section 2 of Canada’s Indian Act defines a band through land, money, or a federal declaration for the Act’s purposes rather than through a universal form of kinship or government.",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "indian-act-band-council-definition",
      kind: "statement",
      label: "Band council has several statutory routes",
      description:
        "The Act’s scoped definition of a council of the band.",
      statementKind: "definition",
      text: "The current Indian Act definition of council of the band includes councils formed under section 74, councils governed by the First Nations Elections Act or a community election code, and councils or chiefs selected according to community custom.",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "kahnawake-community-self-description",
      kind: "statement",
      label: "Kahnawà:ke’s process begins from community self-description",
      description:
        "A community-authored identification kept distinct from federal administrative terminology.",
      statementKind: "classification",
      text: "The community-authored preamble to Kahnawà:ke’s decision-making process identifies Kahnawa’kehró:non as part of the Rotinonhsón:ni Confederacy and asserts responsibility for their own laws and affairs.",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "kahnawake-cdmrp-2005-adoption",
      kind: "statement",
      label: "Kahnawà:ke adopted the process in 2005",
      description:
        "The institutional starting boundary for the bounded case.",
      statementKind: "observation",
      text: "The Mohawk Council of Kahnawà:ke approved use of the Community Decision Making Process and its request-for-legislation form on October 14, 2005.",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "kahnawake-cdmrp-consultative-development",
      kind: "statement",
      label: "Community consultation changed the process design",
      description:
        "An observation about how the institutional design was revised before implementation.",
      statementKind: "observation",
      text: "Between 2005 and 2007, consultations with Kahnawà:ke organizations, interest groups, governmental bodies, and a Traditional Government Working Group reduced the proposed process from fourteen phases to three.",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "kahnawake-consensus-process-definition",
      kind: "statement",
      label: "Consensus requires access, deliberation, and consent",
      description:
        "Horn-Miller’s definition of consensus in this institutional setting.",
      statementKind: "definition",
      text: "Horn-Miller describes Kahnawà:ke consensus as a process in which participants have equal access to deliberation, proposals change in response to concerns, dissent is recorded, and consent does not require complete agreement.",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "kahnawake-cdmrp-type-one-design",
      kind: "statement",
      label: "Type I laws use community consensus hearings",
      description:
        "Horn-Miller’s 2013 account of the formal design for laws applying to the whole community.",
      statementKind: "observation",
      text: "In her 2013 account, Horn-Miller described Type I laws applying to the whole Kahnawà:ke community as using public hearings to establish the mandate and review drafts until participating groups consent, after which Council enacts the law in a legislative session.",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "kahnawake-cdmrp-2024-hearing-rule-change",
      kind: "statement",
      label: "Kahnawà:ke announced a hearing continuation rule in January 2024",
      description:
        "A dated formal change that was itself superseded by the Legislative Commission’s April 2024 revision.",
      statementKind: "observation",
      text: "On January 16, 2024, the Kahnawà:ke Legislative Commission announced a procedure requiring pre-registration and at least ten participants; after two under-attended attempts, it provided for no further hearing and for advancing the draft or amendments to the next step.",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "kahnawake-cdmrp-2024-revised-hearing-rule",
      kind: "statement",
      label: "Kahnawà:ke revised its hearing continuation rule in April 2024",
      description:
        "The Legislative Commission’s dated replacement for automatic advancement after two under-attended hearing attempts.",
      statementKind: "observation",
      text: "On April 18, 2024, the Kahnawà:ke Legislative Commission replaced the January rule’s automatic advancement after two under-attended hearing attempts: the Technical Drafting Committee instead forwards the draft or amendments with a recommendation, and the Commission decides whether they may advance or whether additional measures are needed, then informs the community of its decision and rationale.",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "kahnawake-cdmrp-type-two-design",
      kind: "statement",
      label: "Type II law development consults stakeholders in two stages",
      description:
        "A formal sequence for regulatory, financial, administrative, or sector-specific laws.",
      statementKind: "observation",
      text: "For a Type II law affecting a sector or specific group, initial stakeholder consultation helps develop the proposal before the chiefs or Council are asked to establish its mandate, scope, purpose, and intent; further community and stakeholder consultation follows as the draft proceeds toward public review and enactment.",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "kahnawake-cdmrp-hybrid-classification",
      kind: "statement",
      label: "The process is a contemporary institutional bridge",
      description:
        "A community-situated classification that rejects both timeless-tradition and simple colonial-administration labels.",
      statementKind: "classification",
      text: "Horn-Miller characterizes the Community Decision Making Process as a contemporary bridge that adapts Haudenosaunee principles within Kahnawà:ke’s elected-council and legislative institutions, not as an unchanged survival of a single traditional system.",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "kahnawake-cdmrp-trust-contestation",
      kind: "statement",
      label: "Authority and trust remain contested",
      description:
        "A community-situated account of rival views about who may govern.",
      statementKind: "observation",
      text: "Horn-Miller reports conflicting views within Kahnawà:ke about the governing authority of traditionalists and the elected council, with mistrust of the council reducing participation in a process it sponsors.",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "kahnawake-cdmrp-survey-attendance",
      kind: "statement",
      label: "One third of survey respondents reported attending",
      description:
        "A bounded participation observation from the 2023 community survey.",
      statementKind: "observation",
      text: "In the 2023 Kahnawà:ke survey, 161 of 480 respondents reported attending at least one Community Decision Making and Review Process session or activity.",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "kahnawake-cdmrp-survey-concerns",
      kind: "statement",
      label: "Time and participation were recurring survey concerns",
      description:
        "The commissioned analyst’s qualitative finding about the survey comments.",
      statementKind: "observation",
      text: "The commissioned analysis identified the time required by the process and limited attendance or participation as the two recurring concerns across the 2023 survey comments.",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "kahnawake-cdmrp-survey-sampling-limit",
      kind: "statement",
      label: "The survey cannot establish a representative participation rate",
      description:
        "A method limitation stated in the commissioned analysis.",
      statementKind: "observation",
      text: "The survey analyst could not assign a firm accuracy level because three surveyors used different collection methods, door-to-door work covered selected community sections, and responses were combined in one dataset.",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "kahnawake-case-not-tribal-embodiment",
      kind: "statement",
      label: "The case does not embody a universal tribal type",
      description:
        "An editorial boundary keeping the case from becoming a stage or system label.",
      statementKind: "editorial-interpretation",
      text: "Kahnawà:ke’s law-making process is evidence about named institutions under specific colonial, legal, and community conditions; it does not establish a universal tribal, clan, council, confederacy, or stateless form of government.",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "kahnawake-community-lawmaking",
      kind: "case",
      label: "Kahnawà:ke community law-making",
      description:
        "The ongoing Kahnawà:ke Community Decision Making and Review Process, bounded from its 2005 approval and kept distinct from universal labels for Indigenous government.",
      locationIds: ["kahnawake"],
      startDate: { year: 2005, month: 10, day: 14, certainty: "exact" },
      scope:
        "The Community Decision Making and Review Process approved in 2005 and its use in Kahnawà:ke law-making through the review date; excludes a general history of Kanien’kehá:ka or Haudenosaunee government and does not classify Indigenous societies as one political type.",
      selectionRationale:
        "This case shows how a named community combines its own political language and Haudenosaunee principles with elected-council, legislative, and Canadian legal institutions while openly debating participation and legitimacy.",
      conditionStatementIds: [
        "kahnawake-community-self-description",
        "indian-act-band-administrative-definition",
        "indian-act-band-council-definition",
        "kahnawake-cdmrp-hybrid-classification",
        "kahnawake-case-not-tribal-embodiment",
      ],
      episodeIds: ["kahnawake-cdmrp-2005-present"],
      asOf: "2026-09-05",
      lastReviewedAt: "2026-09-05",
      freshness: "review-needed",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "kahnawake-cdmrp-2005-present",
      kind: "case-episode",
      label: "Community decision-making process, 2005–present",
      description:
        "The ongoing institutional episode beginning with approval of Kahnawà:ke’s Community Decision Making Process in 2005.",
      caseId: "kahnawake-community-lawmaking",
      locationIds: ["kahnawake"],
      startDate: { year: 2005, month: 10, day: 14, certainty: "exact" },
      scope:
        "The design, use, and reported participation limits of the Community Decision Making and Review Process; other Kahnawà:ke political, legal, spiritual, and social institutions enter only where they condition this process.",
      conditionStatementIds: [
        "kahnawake-community-self-description",
        "kahnawake-cdmrp-hybrid-classification",
      ],
      formalRuleStatementIds: [
        "kahnawake-consensus-process-definition",
        "kahnawake-cdmrp-type-one-design",
        "kahnawake-cdmrp-2024-hearing-rule-change",
        "kahnawake-cdmrp-2024-revised-hearing-rule",
        "kahnawake-cdmrp-type-two-design",
      ],
      ruleInUseStatementIds: [
        "kahnawake-cdmrp-2005-adoption",
        "kahnawake-cdmrp-consultative-development",
      ],
      interactionStatementIds: ["kahnawake-cdmrp-trust-contestation"],
      outcomeStatementIds: [
        "kahnawake-cdmrp-survey-attendance",
        "kahnawake-cdmrp-survey-concerns",
        "kahnawake-cdmrp-survey-sampling-limit",
      ],
      ...reviewed,
    },
  },
] satisfies AuthoringDocument[];
