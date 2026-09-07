import type { AuthoringDocument } from "../../../src/lib/domain";

const reviewed = {
  publicationStatus: "reviewed" as const,
  reviewedAt: "2026-09-06",
};

type SourceType =
  | "web-page"
  | "article"
  | "edition"
  | "report"
  | "legal-text"
  | "archival-record";
type WorkType = "book" | "article" | "report" | "law" | "other";

const source = (
  id: string,
  title: string,
  contributors: string[],
  workYear: number | undefined,
  sourceYear: number | undefined,
  publisher: string,
  url: string,
  workType: WorkType,
  sourceType: SourceType,
  identifiers?: { doi?: string; isbn13?: string },
  purpose: "publisher" | "authorized-reading" | "archive" = "publisher",
): AuthoringDocument[] => [
  {
    documentType: "entity",
    entity: {
      id: `${id}-work`,
      kind: "work",
      label: title,
      description: `The non-fiction work used for evidence about environmentalism and its bounded contexts: ${title}.`,
      title,
      workType,
      ...(workYear === undefined ? {} : { originalPublicationYear: workYear }),
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: `${id}-source`,
      kind: "source",
      label: title,
      description: `The consulted ${publisher} manifestation of ${title}.`,
      title,
      sourceType,
      workId: `${id}-work`,
      contributorDisplay: contributors,
      ...(sourceYear === undefined ? {} : { publicationYear: sourceYear }),
      publisher,
      ...(identifiers ? { identifiers } : {}),
      resourceLinks: [{ purpose, url, label: "Open the consulted source" }],
      ...reviewed,
    },
  },
];

const statement = (
  id: string,
  label: string,
  text: string,
  statementKind:
    | "definition"
    | "observation"
    | "attributed-value"
    | "attributed-proposal"
    | "causal-hypothesis"
    | "classification"
    | "editorial-interpretation" = "observation",
): AuthoringDocument => ({
  documentType: "entity",
  entity: {
    id,
    kind: "statement",
    label,
    description: label,
    statementKind,
    text,
    ...reviewed,
  },
});

export const environmentalismEvidenceDocuments = [
  ...source(
    "sep-environmental-ethics",
    "Environmental Ethics",
    ["Andrew Brennan", "Yeuk-Sze Lo"],
    2002,
    2021,
    "Stanford Encyclopedia of Philosophy",
    "https://plato.stanford.edu/entries/ethics-environmental/",
    "article",
    "web-page",
  ),
  ...source(
    "guha-environmentalism-global-history",
    "Environmentalism: A Global History",
    ["Ramachandra Guha"],
    2000,
    2014,
    "Penguin Random House India",
    "https://www.penguin.co.in/book/environmentalism/",
    "book",
    "edition",
    { isbn13: "9780143427674" },
  ),
  ...source(
    "martinez-alier-environmentalism-poor",
    "The Environmentalism of the Poor",
    ["Joan Martínez-Alier"],
    2002,
    2002,
    "Edward Elgar Publishing",
    "https://www.e-elgar.com/shop/gbp/the-environmentalism-of-the-poor-9781840649093.html",
    "book",
    "edition",
    { isbn13: "9781840649093" },
  ),
  ...source(
    "brundtland-common-future",
    "Our Common Future",
    ["World Commission on Environment and Development"],
    1987,
    1987,
    "United Nations",
    "https://digitallibrary.un.org/record/139811?ln=en",
    "report",
    "report",
    undefined,
    "authorized-reading",
  ),
  ...source(
    "guha-unquiet-woods",
    "The Unquiet Woods: Ecological Change and Peasant Resistance in the Himalaya",
    ["Ramachandra Guha"],
    1989,
    2000,
    "University of California Press",
    "https://www.ucpress.edu/book/9780520222359/the-unquiet-woods",
    "book",
    "edition",
    { isbn13: "9780520222359" },
  ),
  ...source(
    "agarwal-gender-environment-debate",
    "The Gender and Environment Debate: Lessons from India",
    ["Bina Agarwal"],
    1992,
    1992,
    "Feminist Studies",
    "https://doi.org/10.2307/3178217",
    "article",
    "article",
    { doi: "10.2307/3178217" },
  ),
  ...source(
    "rangan-contested-boundaries",
    "Contested Boundaries: State Policies, Forest Classifications, and Deforestation in the Garhwal Himalayas",
    ["Haripriya Rangan"],
    1995,
    1995,
    "Antipode",
    "https://doi.org/10.1111/j.1467-8330.1995.tb00284.x",
    "article",
    "article",
    { doi: "10.1111/j.1467-8330.1995.tb00284.x" },
  ),
  ...source(
    "chandi-prasad-bhatt-papers-catalogue",
    "Catalogue of the Papers of Chandi Prasad Bhatt",
    ["Archives of Contemporary India"],
    2019,
    2019,
    "Archives of Contemporary India, Ashoka University",
    "https://ashoka.edu.in/static/doc_uploads/file_1566362275.pdf",
    "other",
    "archival-record",
    undefined,
    "archive",
  ),
  ...source(
    "gao-hazardous-landfills",
    "Siting of Hazardous Waste Landfills and Their Correlation With Racial and Economic Status of Surrounding Communities",
    ["United States General Accounting Office"],
    1983,
    1983,
    "United States General Accounting Office",
    "https://www.gao.gov/assets/rced-83-168.pdf",
    "report",
    "report",
    undefined,
    "authorized-reading",
  ),
  ...source(
    "ucc-toxic-wastes-race",
    "Toxic Wastes and Race in the United States",
    ["United Church of Christ Commission for Racial Justice"],
    1987,
    1987,
    "United Church of Christ Commission for Racial Justice",
    "https://new.uccfiles.com/pdf/ToxicWastes%26Race.pdf",
    "report",
    "report",
    undefined,
    "authorized-reading",
  ),
  ...source(
    "ej-principles",
    "Principles of Environmental Justice",
    ["First National People of Color Environmental Leadership Summit"],
    1991,
    1991,
    "University of Michigan",
    "https://mleead.umich.edu/files/Principles_of_Environmental_Justice_1991.pdf",
    "other",
    "web-page",
    undefined,
    "authorized-reading",
  ),
  ...source(
    "schlosberg-environmental-justice",
    "Environmental Justice",
    ["David Schlosberg"],
    2009,
    2009,
    "Annual Review of Environment and Resources",
    "https://doi.org/10.1146/annurev-environ-082508-094348",
    "article",
    "article",
    { doi: "10.1146/annurev-environ-082508-094348" },
  ),
  ...source(
    "whyte-indigenous-climate",
    "Indigenous Women, Climate Change Impacts, and Collective Action",
    ["Kyle Powys Whyte"],
    2014,
    2014,
    "Hypatia",
    "https://doi.org/10.1111/hypa.12089",
    "article",
    "article",
    { doi: "10.1111/hypa.12089" },
  ),
  ...source(
    "te-awa-tupua-act",
    "Te Awa Tupua (Whanganui River Claims Settlement) Act 2017",
    ["New Zealand Parliament"],
    2017,
    2025,
    "New Zealand Legislation",
    "https://www.legislation.govt.nz/act/public/2017/7/en/latest/whole.html",
    "law",
    "legal-text",
    undefined,
    "authorized-reading",
  ),
  ...source(
    "te-pou-tupua-te-awa",
    "Te Awa Tupua",
    ["Te Pou Tupua"],
    undefined,
    undefined,
    "Te Pou Tupua",
    "https://www.tepoutupua.nz/teawatupua",
    "other",
    "web-page",
    undefined,
    "authorized-reading",
  ),

  {
    documentType: "entity",
    entity: {
      id: "environmentalism",
      kind: "concept",
      label: "Environmentalism",
      description:
        "A contested family of ethical commitments, social movements, and political projects concerned with human relations to environments and nonhuman life.",
      schemeIds: ["political-economic-ideas"],
      scopeNote:
        "Environmentalism is not ecology or environmental science, and it does not make every conservation policy, climate policy, green party, or Indigenous land relation an instance of one ideology.",
      externalRefs: [
        {
          system: "wikipedia",
          url: "https://en.wikipedia.org/wiki/Environmentalism",
          purpose: "orientation",
          language: "en",
          checkedAt: "2026-09-06",
        },
        {
          system: "wikidata",
          id: "Q2855609",
          url: "https://www.wikidata.org/wiki/Q2855609",
          purpose: "identity",
          match: "exact",
          checkedAt: "2026-09-06",
        },
      ],
      ...reviewed,
    },
  },

  statement(
    "environmentalism-contested-family",
    "Environmentalism is a contested family",
    "Environmentalism names multiple ethical positions, movements, and political projects rather than one doctrine, organization, or policy program.",
    "definition",
  ),
  statement(
    "environmentalism-science-boundary",
    "Environmental science and environmentalism are distinct",
    "Ecology and environmental science investigate relationships and conditions, while environmentalism makes ethical or political claims about what people and institutions should do.",
    "editorial-interpretation",
  ),
  statement(
    "environmentalism-conservation-boundary",
    "Conservation and preservation do not exhaust environmentalism",
    "Conservation and preservation are historically important but disputed projects within a wider field that also addresses pollution, health, livelihood, justice, technology, and political authority.",
    "editorial-interpretation",
  ),
  statement(
    "environmentalism-sustainability-boundary",
    "Sustainability is a distinct normative formula",
    "The Brundtland Commission defined sustainable development around meeting present needs without compromising future generations, a formulation that neither defines all environmentalism nor resolves disputes over needs and distribution.",
    "definition",
  ),
  statement(
    "environmentalism-climate-boundary",
    "Climate politics and environmentalism overlap without coinciding",
    "Climate mitigation and adaptation are policy fields that may be supported, opposed, or interpreted differently within environmental movements, while environmentalism also concerns harms and relations not reducible to climate change.",
    "editorial-interpretation",
  ),
  statement(
    "environmentalism-party-policy-boundary",
    "A party or policy does not define the family",
    "A green party, environmental agency, protected area, pollution rule, or energy policy requires its own actors, design, operation, and outcomes; its label alone does not establish environmentalist purposes or effects.",
    "editorial-interpretation",
  ),
  statement(
    "environmentalism-global-history-plural",
    "Environmental movements arose through plural histories",
    "Guha distinguishes multiple histories and social bases of environmental action rather than treating environmentalism as a single movement exported unchanged from one region.",
    "classification",
  ),
  statement(
    "environmentalism-poor-attributed-classification",
    "Martínez-Alier attributes an environmentalism of the poor",
    "Martínez-Alier uses environmentalism of the poor for conflicts in which livelihood and unequal exposure motivate resistance to environmental damage; the category is an attributed interpretation, not a self-description inherited by every affected community.",
    "classification",
  ),
  statement(
    "environmental-justice-three-dimensions",
    "Environmental justice includes several dimensions",
    "Schlosberg distinguishes distribution, participation or procedure, and recognition as related dimensions of environmental justice rather than one interchangeable measure.",
    "definition",
  ),
  statement(
    "indigenous-relations-boundary",
    "Indigenous relations are not detachable environmental inputs",
    "Whyte argues that Indigenous climate vulnerability and collective action must be understood through histories of colonialism, governance, and reciprocal responsibilities rather than treating Indigenous knowledge as a detachable policy input.",
    "editorial-interpretation",
  ),
  statement(
    "colonial-conservation-displacement",
    "Conservation can dispossess affected communities",
    "Protected-land and forestry projects can restrict customary access and political authority, so conservation status alone cannot establish justice or environmental benefit for affected communities.",
    "editorial-interpretation",
  ),
  statement(
    "nuclear-environmental-policy-boundary",
    "Nuclear policy does not follow from the label environmentalism",
    "Nuclear power and nuclear weapons raise distinct questions about climate, extraction, land, safety, waste, security, and justice; an environmentalist relationship does not determine a position on either technology.",
    "editorial-interpretation",
  ),

  statement(
    "chipko-commercial-forestry-conflict",
    "Chipko arose within a commercial-forestry conflict",
    "Guha locates Chipko actions in Garhwal conflicts over state forestry, commercial felling, local access, and village livelihood during the 1970s.",
  ),
  statement(
    "chipko-organized-tree-protection",
    "Villagers used nonviolent obstruction",
    "Participants in selected Garhwal actions used collective presence and nonviolent obstruction to prevent contracted tree felling.",
  ),
  statement(
    "chipko-women-participation",
    "Women participated through gendered forest relations",
    "Agarwal relates rural women's participation in forest protection to gendered divisions of labor, subsistence responsibilities, property, and decision-making power rather than an innate female closeness to nature.",
  ),
  statement(
    "chipko-ecofeminist-rival",
    "Ecofeminist readings are contested",
    "Agarwal challenges accounts that explain Chipko through a universal women–nature bond and instead emphasizes material and institutional differences among women.",
    "causal-hypothesis",
  ),
  statement(
    "chipko-state-community-rival",
    "State and community were not unitary opponents",
    "Rangan argues that Garhwal forestry involved negotiation and conflict among state institutions, communities, and classes rather than a simple state-versus-community divide.",
    "causal-hypothesis",
  ),
  statement(
    "chipko-local-archive-provenance",
    "The Bhatt archive preserves local organizational records",
    "The Chandi Prasad Bhatt papers catalogue identifies Hindi correspondence and organizational files from the Dasholi Gram Swarajya Mandal and Chipko activity in Chamoli, including 1973 forest-preservation records and Reni material.",
  ),
  statement(
    "chipko-case-boundary",
    "Chipko cannot stand for a universal environmentalism",
    "The selected Garhwal actions illuminate forestry, livelihood, gender, and movement interpretation but do not define all Chipko activity, Indian environmentalism, or rural women's politics.",
    "editorial-interpretation",
  ),

  statement(
    "warren-county-landfill-siting",
    "North Carolina sited the PCB landfill in Warren County",
    "North Carolina selected a predominantly Black Warren County community for a landfill holding soil contaminated by illegal PCB dumping elsewhere in the state.",
  ),
  statement(
    "warren-county-protest",
    "Residents and allies protested the landfill",
    "In 1982, Warren County residents and allied civil-rights and religious organizations used demonstrations and civil disobedience against the landfill, and hundreds of participants were arrested.",
  ),
  statement(
    "warren-county-landfill-built",
    "The immediate siting was not stopped",
    "The protests did not prevent construction and filling of the Warren County PCB landfill.",
  ),
  statement(
    "gao-siting-pattern",
    "GAO found a racial and income pattern in four sites",
    "The 1983 General Accounting Office study found that three of four southeastern hazardous-waste landfills it examined were in majority-Black communities and that all four surrounding communities had relatively high poverty rates.",
  ),
  statement(
    "ucc-national-race-finding",
    "The UCC report identified race as a major siting correlate",
    "The 1987 United Church of Christ study reported race as the most significant variable associated with commercial hazardous-waste facility location in its national analysis.",
  ),
  statement(
    "ej-summit-principles",
    "The 1991 summit adopted environmental-justice principles",
    "Delegates at the First National People of Color Environmental Leadership Summit adopted seventeen principles linking ecological protection with self-determination, public participation, health, work, and opposition to environmental racism.",
    "attributed-value",
  ),
  statement(
    "warren-county-causal-boundary",
    "Movement influence is not one isolated causal effect",
    "Warren County became an important reference point for environmental-justice organizing, but the selected evidence does not isolate its effect from longer civil-rights, labor, Indigenous, and anti-toxics organizing or prove that it caused every later policy change.",
    "editorial-interpretation",
  ),

  statement(
    "te-awa-legal-person",
    "The 2017 Act recognized Te Awa Tupua as a legal person",
    "The Te Awa Tupua Act declares Te Awa Tupua a legal person with corresponding rights, powers, duties, and liabilities.",
  ),
  statement(
    "te-awa-living-whole",
    "The Act recognizes an indivisible living whole",
    "The Act recognizes Te Awa Tupua as an indivisible living whole from the mountains to the sea, incorporating physical and metaphysical elements.",
  ),
  statement(
    "te-awa-tupua-kawa",
    "Tupua te Kawa guides the statutory framework",
    "The Act sets out Tupua te Kawa as intrinsic values and requires relevant actors to recognize the relationship of Whanganui iwi and hapū with Te Awa Tupua.",
  ),
  statement(
    "te-pou-tupua-representation",
    "Te Pou Tupua acts for Te Awa Tupua",
    "The Act establishes Te Pou Tupua as the human face of Te Awa Tupua and provides for two appointees acting as one office.",
  ),
  statement(
    "te-awa-iwi-provenance",
    "Te Pou Tupua centers Whanganui iwi and hapū relationships",
    "Te Pou Tupua describes the framework as supporting values practised by Whanganui hapū and iwi and protecting their continuing authority to speak for their own interests.",
  ),
  statement(
    "te-awa-environmentalism-boundary",
    "Te Awa Tupua is not an environmentalist embodiment",
    "The Te Awa Tupua framework is a Whanganui iwi–Crown settlement and legal-governance arrangement grounded in Whanganui relationships and law; placing it near environmentalism does not reclassify those relationships as an environmental ideology.",
    "editorial-interpretation",
  ),

  {
    documentType: "entity",
    entity: {
      id: "garhwal-uttarakhand",
      kind: "place",
      label: "Garhwal, Uttarakhand",
      description:
        "The Garhwal Himalayan districts in present-day Uttarakhand used to bound the selected Chipko actions.",
      placeType: "region",
      externalRefs: [
        {
          system: "wikipedia",
          url: "https://en.wikipedia.org/wiki/Garhwal_division",
          purpose: "orientation",
          language: "en",
          checkedAt: "2026-09-06",
        },
        {
          system: "wikidata",
          id: "Q1460406",
          url: "https://www.wikidata.org/wiki/Q1460406",
          purpose: "identity",
          match: "close",
          checkedAt: "2026-09-06",
        },
      ],
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "warren-county-north-carolina",
      kind: "place",
      label: "Warren County, North Carolina",
      description:
        "The North Carolina county containing the PCB landfill and 1982 protest sites.",
      placeType: "region",
      externalRefs: [
        {
          system: "wikipedia",
          url: "https://en.wikipedia.org/wiki/Warren_County,_North_Carolina",
          purpose: "orientation",
          language: "en",
          checkedAt: "2026-09-06",
        },
        {
          system: "wikidata",
          id: "Q507853",
          url: "https://www.wikidata.org/wiki/Q507853",
          purpose: "identity",
          match: "exact",
          checkedAt: "2026-09-06",
        },
      ],
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "whanganui-river-catchment",
      kind: "place",
      label: "Whanganui River catchment",
      description:
        "The Whanganui River and catchment to which the Te Awa Tupua framework applies.",
      placeType: "region",
      externalRefs: [
        {
          system: "wikipedia",
          url: "https://en.wikipedia.org/wiki/Whanganui_River",
          purpose: "orientation",
          language: "en",
          checkedAt: "2026-09-06",
        },
        {
          system: "wikidata",
          id: "Q1940419",
          url: "https://www.wikidata.org/wiki/Q1940419",
          purpose: "identity",
          match: "close",
          checkedAt: "2026-09-06",
        },
      ],
      ...reviewed,
    },
  },

  {
    documentType: "entity",
    entity: {
      id: "chipko-garhwal-1973-1981",
      kind: "case",
      label: "Chipko actions in Garhwal, 1973–1981",
      description:
        "Selected forest-protection actions and disputes over their interpretation in the Garhwal Himalaya.",
      locationIds: ["garhwal-uttarakhand"],
      startDate: { year: 1973, certainty: "exact" },
      endDate: {
        year: 1981,
        certainty: "approximate",
        note: "The guide bounds the early movement through approximately 1981.",
      },
      scope:
        "Selected Garhwal forestry actions from the first Mandal action through the movement's early expansion and interpretation; not every action called Chipko or all Himalayan forest politics.",
      selectionRationale:
        "The case exposes livelihood, gender, conservation, and state–community boundaries through both movement history and serious rival interpretations.",
      conditionStatementIds: ["chipko-commercial-forestry-conflict"],
      episodeIds: ["chipko-garhwal-actions-episode"],
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "chipko-garhwal-actions-episode",
      kind: "case-episode",
      label: "Selected Garhwal Chipko actions, 1973–1981",
      description:
        "The bounded interval of selected nonviolent forest-protection actions and organizing.",
      caseId: "chipko-garhwal-1973-1981",
      locationIds: ["garhwal-uttarakhand"],
      startDate: { year: 1973, certainty: "exact" },
      endDate: {
        year: 1981,
        certainty: "approximate",
        note: "The guide bounds the early movement through approximately 1981.",
      },
      scope:
        "Documented actions and interpretations in the selected sources, excluding later programs and universal claims about women or village communities.",
      conditionStatementIds: ["chipko-commercial-forestry-conflict"],
      formalRuleStatementIds: [],
      ruleInUseStatementIds: ["chipko-organized-tree-protection"],
      interactionStatementIds: ["chipko-women-participation"],
      outcomeStatementIds: [],
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "warren-county-environmental-justice-1982-1991",
      kind: "case",
      label: "Warren County and environmental-justice organizing, 1982–1991",
      description:
        "The Warren County PCB protest, subsequent siting research, and the 1991 national summit principles.",
      locationIds: ["warren-county-north-carolina", "united-states"],
      startDate: { year: 1982, certainty: "exact" },
      endDate: { year: 1991, certainty: "exact" },
      scope:
        "The 1982 Warren County protest, selected 1983 and 1987 siting studies, and 1991 summit principles; not the whole environmental-justice movement or every later policy attributed to it.",
      selectionRationale:
        "The case connects affected-community action to distribution, participation, recognition, and the limits of movement-effect claims.",
      conditionStatementIds: ["warren-county-landfill-siting"],
      episodeIds: ["warren-county-to-ej-summit-episode"],
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "warren-county-to-ej-summit-episode",
      kind: "case-episode",
      label: "From Warren County protest to summit principles, 1982–1991",
      description:
        "The selected protest, evidence, and movement-articulation sequence.",
      caseId: "warren-county-environmental-justice-1982-1991",
      locationIds: ["warren-county-north-carolina", "united-states"],
      startDate: { year: 1982, certainty: "exact" },
      endDate: { year: 1991, certainty: "exact" },
      scope:
        "Selected organizing and publications without treating sequence as proof that one protest caused every later development.",
      conditionStatementIds: ["warren-county-landfill-siting"],
      formalRuleStatementIds: [],
      ruleInUseStatementIds: [],
      interactionStatementIds: ["warren-county-protest"],
      outcomeStatementIds: [
        "warren-county-landfill-built",
        "ej-summit-principles",
      ],
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "te-awa-tupua-framework-2017-present",
      kind: "case",
      label: "Te Awa Tupua framework, 2017–present",
      description:
        "The statutory recognition and governance framework for Te Awa Tupua and its relationship with Whanganui iwi and hapū.",
      locationIds: ["whanganui-river-catchment"],
      startDate: { year: 2017, certainty: "exact" },
      asOf: "2026-09-06",
      lastReviewedAt: "2026-09-06",
      freshness: "review-needed",
      scope:
        "The enacted statutory framework and Te Pou Tupua's account through the review date; not all Whanganui tikanga, Māori law, rights-of-nature initiatives, or observed ecological outcomes.",
      selectionRationale:
        "The case tests whether environmentalist categories can be kept adjacent to, but distinct from, an iwi-grounded legal and governance relationship.",
      conditionStatementIds: ["te-awa-iwi-provenance"],
      episodeIds: ["te-awa-tupua-enacted-framework-episode"],
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "te-awa-tupua-enacted-framework-episode",
      kind: "case-episode",
      label: "Te Awa Tupua enacted framework, 2017–present",
      description:
        "The current statutory design and representation arrangement.",
      caseId: "te-awa-tupua-framework-2017-present",
      locationIds: ["whanganui-river-catchment"],
      startDate: { year: 2017, certainty: "exact" },
      scope:
        "The formal design and community-account provenance reviewed through 2026-09-06; implementation outcomes require separate evidence.",
      conditionStatementIds: ["te-awa-iwi-provenance"],
      formalRuleStatementIds: [
        "te-awa-legal-person",
        "te-awa-living-whole",
        "te-awa-tupua-kawa",
        "te-pou-tupua-representation",
      ],
      ruleInUseStatementIds: [],
      interactionStatementIds: [],
      outcomeStatementIds: [],
      ...reviewed,
    },
  },
] satisfies AuthoringDocument[];
