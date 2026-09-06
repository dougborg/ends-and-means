import type { AuthoringDocument } from "../../../src/lib/domain";

const reviewed = { publicationStatus: "reviewed" as const };
const work = (
  id: string,
  title: string,
  workType: "book" | "article" | "other",
  year?: number,
): AuthoringDocument => ({
  documentType: "entity",
  entity: {
    id: `${id}-work`,
    kind: "work",
    label: title,
    description: `The work underlying the cited ${title} manifestation.`,
    title,
    workType,
    ...(year ? { originalPublicationYear: year } : {}),
    ...reviewed,
  },
});
const source = (
  id: string,
  title: string,
  type: "article" | "edition" | "web-page" | "report",
  people: string[],
  year: number,
  publisher: string,
  url: string,
  purpose: "publisher" | "authorized-reading" = "publisher",
  doi?: string,
  extent?: string,
): AuthoringDocument => ({
  documentType: "entity",
  entity: {
    id: `${id}-source`,
    kind: "source",
    label: `${title} (${year})`,
    description: `The inspected ${publisher} manifestation${extent ? `, ${extent},` : ""} used for located evidence about the bounded Zapatista autonomy case.`,
    title,
    sourceType: type,
    workId: `${id}-work`,
    contributorDisplay: people,
    publicationYear: year,
    publisher,
    ...(doi ? { identifiers: { doi } } : {}),
    resourceLinks: [{ purpose, url, label: "Inspect the cited manifestation" }],
    ...reviewed,
  },
});
const statement = (
  id: string,
  label: string,
  text: string,
  statementKind:
    | "observation"
    | "attributed-value"
    | "attributed-proposal"
    | "classification"
    | "editorial-interpretation" = "observation",
): AuthoringDocument => ({
  documentType: "entity",
  entity: {
    id,
    kind: "statement",
    label,
    description: `An atomic ${statementKind.replaceAll("-", " ")} about the bounded Zapatista autonomy case.`,
    statementKind,
    text,
    ...reviewed,
  },
});

export const zapatistaCaracolesEvidenceDocuments = [
  {
    documentType: "entity",
    entity: {
      id: "chiapas-zapatista-regions",
      kind: "place",
      label: "Zapatista regions of Chiapas",
      description:
        "The discontinuous communities and regional institutions in Chiapas identified in Zapatista sources; not a continuous sovereign territory.",
      placeType: "institutional-jurisdiction",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "indigenous-autonomy",
      kind: "concept",
      label: "Indigenous autonomy",
      description:
        "Collective self-government by Indigenous peoples under their own institutions and historical conditions.",
      schemeIds: ["political-economic-ideas"],
      scopeNote:
        "A plural and contested concept; it does not imply state recognition, territorial exclusivity, or one universal institutional form.",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "institutional-formation",
      kind: "concept",
      label: "Institutional formation",
      description: "The sourced establishment of a named institution.",
      schemeIds: ["political-economic-ideas"],
      scopeNote:
        "Use as an Event kind without implying that formation was a turning point or caused later outcomes.",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "institutional-reorganization",
      kind: "concept",
      label: "Institutional reorganization",
      description: "A sourced change in the structure of named institutions.",
      schemeIds: ["political-economic-ideas"],
      scopeNote:
        "Use as an Event kind without assigning historical importance or causal effect.",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "zapatista-army-national-liberation",
      kind: "organization",
      label: "Zapatista Army of National Liberation (EZLN)",
      description:
        "The political-military organization whose command issued public communiqués and remained distinct from civilian autonomous government.",
      scope:
        "The EZLN and its CCRI-CG command; not a synonym for every Zapatista support-base community or civilian authority.",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "zapatista-support-base-communities",
      kind: "organization",
      label: "Zapatista support-base communities",
      description:
        "Indigenous civilian communities whose assemblies and members formed the social base of autonomous government.",
      scope:
        "Communities participating as Zapatista support bases; neither all Indigenous communities in Chiapas nor the EZLN military structure.",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "zapatista-caracoles",
      kind: "organization",
      label: "Zapatista caracoles",
      description:
        "Regional meeting and administrative centers that housed Good Government Councils during the bounded episode.",
      scope:
        "The caracol centers created in 2003; physical and coordinating sites rather than a synonym for the councils, communities, or EZLN.",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "zapatista-good-government-councils",
      kind: "organization",
      label: "Zapatista Good Government Councils",
      description:
        "Regional civilian councils composed of delegates from autonomous municipal councils during 2003–2023.",
      scope:
        "The Juntas de Buen Gobierno in the caracol structure during the bounded episode; not the EZLN command or the post-2023 GAL/CGAZ/ACGAZ structure.",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "zapatista-local-autonomous-governments",
      kind: "organization",
      label: "Zapatista Local Autonomous Governments",
      description:
        "The community-level GAL bodies declared in the 2023 reorganization.",
      scope:
        "The post-2023 GAL layer described by Zapatista sources; rules in use and reach remain under review.",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "rotating-municipal-delegation",
      kind: "means",
      label: "Rotating municipal delegation",
      description:
        "Autonomous municipalities sent rotating delegates to regional civilian councils.",
      institutionalForm:
        "Delegates selected through autonomous municipal and community processes served time-limited turns in regional Good Government Councils and reported through lower-level bodies.",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "zapatista-participation-and-inclusion",
      kind: "challenge",
      label: "Participation and inclusion",
      description:
        "How rotating civilian institutions distribute opportunities to serve and exercise authority.",
      question:
        "Who can serve in autonomous government, and who participates less consistently despite formal inclusion rules?",
      rationale:
        "Participant accounts describe both broad community service and persistent gaps in women's participation in some councils.",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "affected-community-accountability",
      kind: "criterion",
      label: "Affected-community accountability",
      description: "An evaluative lens for delegated civilian authority.",
      definition:
        "Can affected community members inspect decisions, demand accounts, contest officeholders, and replace delegates?",
      evidenceRequirements: [
        "Formal selection and removal rules, located accounts of practice, participation evidence, and counterevidence about military or informal authority.",
      ],
      normativeAssumptions: [
        "People subject to governing decisions should have effective means to contest and replace decision-makers.",
      ],
      limitations: [
        "Rotation and declared accountability do not alone establish equal participation or civilian control in practice.",
      ],
      ...reviewed,
    },
  },

  work(
    "ezln-thirteenth-stele",
    "Chiapas: The Thirteenth Stele, sixth part",
    "other",
    2003,
  ),
  source(
    "ezln-thirteenth-stele",
    "Chiapas: The Thirteenth Stele, sixth part: A good government",
    "web-page",
    ["EZLN", "Subcomandante Insurgente Marcos"],
    2003,
    "Enlace Zapatista",
    "https://enlacezapatista.ezln.org.mx/2003/07/21/chiapas-la-treceava-estela-sexta-parte-un-buen-gobierno/",
  ),
  work(
    "zapatista-autonomous-government-one",
    "Autonomous Government I",
    "other",
    2013,
  ),
  source(
    "zapatista-autonomous-government-one",
    "Autonomous Government I",
    "report",
    ["Zapatista support-base teachers"],
    2013,
    "Escuelita Zapatista / Radio Zapatista",
    "https://radiozapatista.org/pdf/libros/Autonomous_Government_I.pdf",
    "authorized-reading",
  ),
  work(
    "ezln-new-autonomy-structure",
    "Ninth Part: The New Structure of Zapatista Autonomy",
    "other",
    2023,
  ),
  source(
    "ezln-new-autonomy-structure",
    "Ninth Part: The New Structure of Zapatista Autonomy",
    "web-page",
    ["EZLN", "Subcomandante Insurgente Moisés"],
    2023,
    "Enlace Zapatista",
    "https://enlacezapatista.ezln.org.mx/2023/11/13/ninth-part-the-new-structure-of-zapastista-autonomy/",
  ),
  work(
    "speed-exercising-rights",
    "Exercising rights and reconfiguring resistance in the Zapatista Juntas de Buen Gobierno",
    "other",
    2007,
  ),
  source(
    "speed-exercising-rights",
    "Exercising rights and reconfiguring resistance in the Zapatista Juntas de Buen Gobierno",
    "edition",
    ["Shannon Speed"],
    2007,
    "Cambridge University Press",
    "https://doi.org/10.1017/CBO9780511819193.007",
    "publisher",
    "10.1017/CBO9780511819193.007",
    "chapter 4, pp. 163–192",
  ),
  work(
    "andrews-political-autonomy",
    "Downward Accountability in Unequal Alliances: Explaining NGO Responses to Zapatista Demands",
    "article",
    2014,
  ),
  source(
    "andrews-political-autonomy",
    "Downward Accountability in Unequal Alliances: Explaining NGO Responses to Zapatista Demands",
    "article",
    ["Abigail Andrews"],
    2014,
    "World Development",
    "https://escholarship.org/content/qt5244x9z1/qt5244x9z1_noSplash_c2f003b0b06aa74eb66c5496aa085aa3.pdf",
    "authorized-reading",
    "10.1016/j.worlddev.2013.07.009",
  ),
  work(
    "gunderson-autonomist-critique",
    "Autonomist Marxist Interpretations of the Zapatista Uprising: A Critique",
    "article",
    2018,
  ),
  source(
    "gunderson-autonomist-critique",
    "Autonomist Marxist Interpretations of the Zapatista Uprising: A Critique",
    "article",
    ["Christopher Gunderson"],
    2018,
    "SAGE Publications",
    "https://doi.org/10.1521/siso.2018.82.4.531",
    "publisher",
    "10.1521/siso.2018.82.4.531",
    "pp. 531–554",
  ),
  work(
    "stahler-sholk-autonomies",
    "Indigenous and Black Autonomies and Resistance",
    "article",
    2024,
  ),
  source(
    "stahler-sholk-autonomies",
    "Indigenous and Black Autonomies and Resistance",
    "article",
    ["Richard Stahler-Sholk"],
    2024,
    "Latin American Research Review",
    "https://www.cambridge.org/core/journals/latin-american-research-review/article/indigenous-and-black-autonomies-and-resistance/E1390A32D34611A1480FAED60D002F8E",
    "publisher",
  ),

  statement(
    "zapatista-autonomy-indigenous-context",
    "Autonomy is rooted in Indigenous community practice",
    "Speed analyzes the councils as an exercise of Indigenous collective autonomy shaped by local histories and a failed effort to secure state recognition.",
    "classification",
  ),
  statement(
    "zapatista-european-theory-boundary",
    "European theory does not own the case",
    "This case should be interpreted first through Zapatista and Indigenous self-description rather than used as a test of whether a European political theory works.",
    "editorial-interpretation",
  ),
  statement(
    "jbg-formation-declaration",
    "Good Government Councils were declared for August 2003",
    "The EZLN announced that Good Government Councils would be constituted on August 9, 2003, one in each rebel zone and seated in caracoles.",
    "attributed-proposal",
  ),
  statement(
    "jbg-formal-delegation",
    "Councils formally joined municipal delegates",
    "The EZLN's 2003 design assigned each Good Government Council one or two delegates from every autonomous municipal council in its zone.",
    "attributed-proposal",
  ),
  statement(
    "jbg-formal-regional-functions",
    "Regional council functions were declared",
    "The EZLN's 2003 declaration assigned project oversight, intermunicipal coordination, outside relations, and resource balancing to the Good Government Councils.",
    "attributed-proposal",
  ),
  statement(
    "jbg-formal-municipal-functions",
    "Municipal functions were reserved",
    "The EZLN's 2003 declaration reserved justice, health, education, housing, land, work, food, commerce, information, culture, and local transit to autonomous municipalities.",
    "attributed-proposal",
  ),
  statement(
    "jbg-declared-ezln-oversight",
    "EZLN command retained a declared oversight role",
    "The EZLN's 2003 declaration assigned each zone's CCRI a monitoring role over the Good Government Council to deter corruption, arbitrariness, injustice, and departures from governing by obeying.",
    "attributed-proposal",
  ),
  statement(
    "jbg-rotation-rules-in-use",
    "Council service rotated in practice",
    "Participants in the 2013 autonomy course described Good Government Council service as rotating among groups of delegates.",
  ),
  statement(
    "jbg-rotation-learning-purpose",
    "Rotation was described as political learning",
    "Zapatista participants described rotating authority as a way for support-base members to learn autonomous government by doing its work.",
  ),
  statement(
    "jbg-reporting-practice",
    "Officeholders reported their work",
    "Zapatista participants described outgoing authorities presenting reports to incoming authorities and to the communities that selected them.",
  ),
  statement(
    "jbg-accounting-practice",
    "Council accounts used receipts and collective checks",
    "Zapatista participants described recording income and spending with receipts and checking accounts jointly across administrative, vigilance, and information roles.",
  ),
  statement(
    "jbg-gender-participation-limit",
    "Women's council participation remained uneven",
    "Participants in the 2013 autonomy course reported that women worked widely in health, education, and agroecology but participated less consistently in some municipal councils and Good Government Councils despite parity rules in one municipality.",
  ),
  statement(
    "jbg-external-project-control",
    "Councils changed relations with outside organizations",
    "Andrews found that Good Government Councils required outside solidarity organizations to seek permission and accept community control over projects and resource allocation.",
  ),
  statement(
    "jbg-civil-military-authority-limit",
    "Civilian rotation did not establish an authority vacuum",
    "Gunderson argues that rotating civilian councils coexisted with continuing political-military authority in the EZLN's CCRI-CG, challenging interpretations that treat council rotation as proof that central authority disappeared.",
  ),
  statement(
    "zapatista-hybrid-authority-interpretation",
    "Authority combined horizontal and vertical forms",
    "Gunderson interprets Zapatista organization as a hybrid of distributed community institutions and vertical political-military authority.",
    "classification",
  ),
  statement(
    "zapatista-reach-limit",
    "Institutional reach was not territorially uniform",
    "Independent scholarship describes Zapatista authorities as overlapping state municipalities and primarily governing people who accepted their legitimacy, so the case does not establish exclusive control over a continuous territory.",
  ),
  statement(
    "zapatista-2023-reorganization-declaration",
    "The EZLN declared a new autonomy structure in 2023",
    "In November 2023 the EZLN declared that command and coordination of autonomy had moved from the Good Government Councils and autonomous municipalities to community-level Local Autonomous Governments, with regional collectives and zone assemblies above them.",
    "attributed-proposal",
  ),
  statement(
    "zapatista-2023-caracoles-continuity",
    "Caracoles continued under a changed role",
    "The EZLN's 2023 declaration retained the caracoles as bases for mobile zone assemblies while stating that those assemblies depended on regional collectives and community-level governments.",
    "attributed-proposal",
  ),
  statement(
    "zapatista-2023-practice-open",
    "The new structure's operation remained unverified",
    "The 2023 communiqué presented a declared design and deferred fuller evaluation of the former institutions, so it cannot by itself establish participation, accountability, reach, or outcomes under the successor structure.",
  ),
  statement(
    "zapatista-anarchist-resemblance",
    "Some institutions resemble anarchist proposals",
    "Assemblies, rotating delegates, and decentralized coordination create a limited analytical resemblance between the council episode and some anarchist institutional proposals.",
    "classification",
  ),
  statement(
    "zapatista-anarchism-boundary",
    "Resemblance does not determine anarchist classification",
    "Institutional resemblance alone does not justify classifying the bounded Zapatista episode as anarchist.",
    "editorial-interpretation",
  ),
  statement(
    "zapatista-accountability-assessment",
    "Accountability evidence is mixed",
    "Rotation, reporting, and community assemblies support an accountability claim at the level of declared design and participant account, while uneven gender participation and continuing EZLN command authority prevent a general conclusion that all affected people held equal effective control.",
    "editorial-interpretation",
  ),

  {
    documentType: "entity",
    entity: {
      id: "zapatista-autonomy-chiapas-1994-present",
      kind: "case",
      label: "Zapatista autonomy in Chiapas, 1994–present",
      description:
        "An ongoing bounded case of civilian self-government among Zapatista support-base communities under changing institutions and external pressure.",
      locationIds: ["chiapas-zapatista-regions"],
      startDate: {
        year: 1994,
        month: 12,
        certainty: "approximate",
        note: "Autonomous municipalities were publicly declared in December 1994, while local institution-building varied.",
      },
      scope:
        "Civilian autonomous institutions among Zapatista support-base communities in discontinuous parts of Chiapas from 1994 through the review date; excludes treating the EZLN, all Indigenous communities, or a continuous territory as one government.",
      selectionRationale:
        "The case permits comparison across a clearly bounded council episode and a declared successor structure while keeping military organization, civilian communities, sites, and governing bodies distinct.",
      conditionStatementIds: [
        "zapatista-autonomy-indigenous-context",
        "zapatista-reach-limit",
      ],
      episodeIds: [
        "zapatista-caracol-jbg-episode-2003-2023",
        "zapatista-gal-successor-episode-2023-present",
      ],
      asOf: "2026-09-06",
      lastReviewedAt: "2026-09-06",
      freshness: "review-needed",
      materialChangeEventIds: ["zapatista-autonomy-reorganization-2023"],
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "zapatista-caracol-jbg-episode-2003-2023",
      kind: "case-episode",
      label: "Caracol and Good Government Council episode, 2003–2023",
      description:
        "The institutional interval from the announced August 2003 council start to the declared 2023 reorganization.",
      caseId: "zapatista-autonomy-chiapas-1994-present",
      locationIds: ["chiapas-zapatista-regions"],
      startDate: {
        year: 2003,
        month: 8,
        certainty: "approximate",
        note: "The declaration scheduled constitution for August 9; the inspected evidence does not prove one uniform operational start across zones.",
      },
      endDate: {
        year: 2023,
        month: 11,
        certainty: "approximate",
        note: "The November communiqués declared a successor structure without one verified implementation date for every community.",
      },
      scope:
        "The five original caracol/JBG zones and later expansions insofar as the cited evidence addresses council design and practice; excludes post-2023 successor practice and claims of uniform participation or territorial control.",
      conditionStatementIds: [
        "zapatista-autonomy-indigenous-context",
        "zapatista-reach-limit",
      ],
      formalRuleStatementIds: [
        "jbg-formal-delegation",
        "jbg-formal-regional-functions",
        "jbg-formal-municipal-functions",
        "jbg-declared-ezln-oversight",
      ],
      ruleInUseStatementIds: [
        "jbg-rotation-rules-in-use",
        "jbg-rotation-learning-purpose",
        "jbg-reporting-practice",
        "jbg-accounting-practice",
        "jbg-gender-participation-limit",
      ],
      interactionStatementIds: [
        "jbg-external-project-control",
        "jbg-civil-military-authority-limit",
      ],
      outcomeStatementIds: ["zapatista-accountability-assessment"],
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "zapatista-gal-successor-episode-2023-present",
      kind: "case-episode",
      label: "Declared GAL successor structure, 2023–present",
      description:
        "The post-2023 interval whose declared design is documented but whose rules in use and outcomes remain open.",
      caseId: "zapatista-autonomy-chiapas-1994-present",
      locationIds: ["chiapas-zapatista-regions"],
      startDate: {
        year: 2023,
        month: 11,
        certainty: "approximate",
        note: "The communiqués announced the design during November without establishing a uniform operational date.",
      },
      scope:
        "The GAL, CGAZ, and ACGAZ structure declared in November 2023 through the review date; evidence here establishes declared design, not comprehensive implementation or outcomes.",
      conditionStatementIds: ["zapatista-2023-practice-open"],
      formalRuleStatementIds: [
        "zapatista-2023-reorganization-declaration",
        "zapatista-2023-caracoles-continuity",
      ],
      ruleInUseStatementIds: [],
      interactionStatementIds: [],
      outcomeStatementIds: [],
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "zapatista-caracoles-jbg-formation-announced-2003",
      kind: "event",
      label: "Caracol and Good Government Council formation announced",
      description:
        "The July 2003 announcement scheduling council constitution for August 9, recorded without presuming a uniform operational start or causal importance.",
      eventKindIds: ["institutional-formation"],
      placeIds: ["chiapas-zapatista-regions"],
      startDate: { year: 2003, month: 7, day: 21, certainty: "exact" },
      descriptionStatementIds: ["jbg-formation-declaration"],
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "zapatista-autonomy-reorganization-2023",
      kind: "event",
      label: "Zapatista autonomy structure reorganized",
      description:
        "The November 2023 declaration of a successor structure, recorded without assigning causal or turning-point significance.",
      eventKindIds: ["institutional-reorganization"],
      placeIds: ["chiapas-zapatista-regions"],
      startDate: {
        year: 2023,
        month: 11,
        certainty: "approximate",
        note: "The public communiqués span November 2023 and do not give a single implementation day.",
      },
      descriptionStatementIds: [
        "zapatista-2023-reorganization-declaration",
        "zapatista-2023-caracoles-continuity",
      ],
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "zapatista-jbg-to-gal-transition-2023",
      kind: "transition",
      label:
        "From regional Good Government Councils to the declared GAL structure",
      description:
        "A declared institutional boundary that does not itself assert why the change occurred or what effects it produced.",
      caseId: "zapatista-autonomy-chiapas-1994-present",
      fromEpisodeIds: ["zapatista-caracol-jbg-episode-2003-2023"],
      toEpisodeIds: ["zapatista-gal-successor-episode-2023-present"],
      eventIds: ["zapatista-autonomy-reorganization-2023"],
      changedRelationshipIds: ["zapatista-jbg-episode-used-rotation"],
      boundaryStatus: "approximate",
      explanationStatementIds: [
        "zapatista-2023-reorganization-declaration",
        "zapatista-2023-caracoles-continuity",
      ],
      rivalInterpretationStatementIds: [],
      ...reviewed,
    },
  },
] satisfies AuthoringDocument[];
