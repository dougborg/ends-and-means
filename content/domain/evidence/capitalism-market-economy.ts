import type { AuthoringDocument } from "../../../src/lib/domain";

const reviewed = { publicationStatus: "reviewed" as const };

type SourceType = "article" | "edition" | "web-page";

const source = (
  id: string,
  title: string,
  contributors: string[],
  publicationYear: number,
  publisher: string,
  sourceType: SourceType,
  url: string,
  identifiers: { doi?: string; isbn13?: string } = {},
  originalPublicationYear: number | null = publicationYear,
): AuthoringDocument[] => [
  {
    documentType: "entity",
    entity: {
      id: `${id}-work`,
      kind: "work",
      label: title,
      description: `The non-fiction work underlying the cited source: ${title}.`,
      title,
      workType:
        sourceType === "article"
          ? "article"
          : sourceType === "edition"
            ? "book"
            : "other",
      ...(originalPublicationYear === null ? {} : { originalPublicationYear }),
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: `${id}-source`,
      kind: "source",
      label: title,
      description: `A source used to distinguish capitalism, market economies, and their institutions: ${title}.`,
      title,
      sourceType,
      workId: `${id}-work`,
      contributorDisplay: contributors,
      publicationYear,
      publisher,
      ...(Object.keys(identifiers).length ? { identifiers } : {}),
      resourceLinks: [
        { purpose: "publisher", url, label: "Open the source record" },
      ],
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

export const capitalismMarketEvidenceDocuments = [
  ...source(
    "sep-capitalism",
    "Capitalism",
    ["Chiara Cordelli"],
    2026,
    "Stanford Encyclopedia of Philosophy",
    "web-page",
    "https://plato.stanford.edu/entries/capitalism/",
    {},
    2026,
  ),
  ...source(
    "sep-markets-2026",
    "Markets",
    ["Lisa Herzog"],
    2025,
    "Stanford Encyclopedia of Philosophy",
    "web-page",
    "https://plato.stanford.edu/archives/sum2026/entries/markets/",
    {},
    2013,
  ),
  ...source(
    "hodgson-conceptualizing-capitalism",
    "Conceptualizing Capitalism: Institutions, Evolution, Future",
    ["Geoffrey M. Hodgson"],
    2015,
    "University of Chicago Press",
    "edition",
    "https://press.uchicago.edu/ucp/books/book/chicago/C/bo18523749.html",
    { isbn13: "9780226168142" },
  ),
  ...source(
    "smith-wealth-nations-cannan",
    "An Inquiry into the Nature and Causes of the Wealth of Nations, Cannan edition, volume 1",
    ["Adam Smith", "Edwin Cannan"],
    1904,
    "Online Library of Liberty",
    "edition",
    "https://oll.libertyfund.org/titles/smith-an-inquiry-into-the-nature-and-causes-of-the-wealth-of-nations-cannan-ed-vol-1",
    {},
    1776,
  ),
  ...source(
    "marx-capital-volume-one",
    "Capital: A Critique of Political Economy, volume 1",
    ["Karl Marx"],
    1887,
    "Marxists Internet Archive",
    "edition",
    "https://www.marxists.org/archive/marx/works/1867-c1/",
    {},
    1867,
  ),
  ...source(
    "polanyi-great-transformation",
    "The Great Transformation: The Political and Economic Origins of Our Time",
    ["Karl Polanyi"],
    2001,
    "Beacon Press",
    "edition",
    "https://www.beacon.org/The-Great-Transformation-P1180.aspx",
    { isbn13: "9780807056431" },
    1944,
  ),
  ...source(
    "hohfeld-fundamental-legal-conceptions",
    "Some Fundamental Legal Conceptions as Applied in Judicial Reasoning",
    ["Wesley Newcomb Hohfeld"],
    1913,
    "Yale Law Journal",
    "article",
    "https://doi.org/10.2307/785533",
    { doi: "10.2307/785533" },
  ),
  ...source(
    "brenner-agrarian-class-structure",
    "Agrarian Class Structure and Economic Development in Pre-Industrial Europe",
    ["Robert Brenner"],
    1976,
    "Past & Present",
    "article",
    "https://doi.org/10.1093/past/70.1.30",
    { doi: "10.1093/past/70.1.30" },
  ),
  ...source(
    "aston-philpin-brenner-debate",
    "The Brenner Debate: Agrarian Class Structure and Economic Development in Pre-Industrial Europe",
    ["T. H. Aston", "C. H. E. Philpin"],
    1985,
    "Cambridge University Press",
    "edition",
    "https://www.cambridge.org/core/books/brenner-debate/A44B7FC72563D885578E901E188924EF",
    { isbn13: "9780521349338" },
  ),
  ...source(
    "austin-ghana-cocoa",
    "Vent for Surplus or Productivity Breakthrough? The Ghanaian Cocoa Take-off, c. 1890–1936",
    ["Gareth Austin"],
    2014,
    "Economic History Review",
    "article",
    "https://doi.org/10.1111/1468-0289.12043",
    { doi: "10.1111/1468-0289.12043" },
  ),
  ...source(
    "naughton-growing-out-plan",
    "Growing Out of the Plan: Chinese Economic Reform, 1978–1993",
    ["Barry Naughton"],
    1995,
    "Cambridge University Press",
    "edition",
    "https://www.cambridge.org/core/books/growing-out-of-the-plan/4500F9826731A4765F9B6C2EFCE7AD53",
    { isbn13: "9780521574624" },
  ),

  {
    documentType: "entity",
    entity: {
      id: "capitalism",
      kind: "concept",
      label: "Capitalism",
      description:
        "A contested concept for economic orders in which private claims over productive assets, firms, employment, markets, finance, and investment operate in historically variable combinations.",
      schemeIds: ["political-economic-ideas"],
      scopeNote:
        "Do not use the term as a synonym for markets, commerce, private possessions, freedom, one policy program, or a timeless property of a country.",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "market-economy",
      kind: "concept",
      label: "Market economy",
      description:
        "A contested description for an economy in which price-mediated exchange substantially coordinates production or allocation alongside organizations, law, households, public authority, and non-market practices.",
      schemeIds: ["political-economic-ideas"],
      scopeNote:
        "Do not infer private ownership, laissez-faire policy, capitalism, or the absence of planning from market exchange alone.",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "private-property",
      kind: "concept",
      label: "Private property",
      description:
        "Legally recognized claims that allocate powers, protections, duties, and liabilities concerning resources to private persons or organizations.",
      schemeIds: ["political-economic-ideas"],
      scopeNote:
        "Keep property distinct from possession and identify which rights, assets, holders, and public enforcement institutions are involved.",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "wage-labor",
      kind: "concept",
      label: "Wage labor",
      description:
        "An employment relation in which a worker supplies labor under an employer’s authority in return for wages.",
      schemeIds: ["political-economic-ideas"],
      scopeNote:
        "Keep employment distinct from slavery, serfdom, independent contracting, self-employment, household work, tenancy, and cooperative membership.",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "commodity-production",
      kind: "concept",
      label: "Commodity production",
      description:
        "Production of goods or services principally for exchange rather than direct use by their producers.",
      schemeIds: ["political-economic-ideas"],
      scopeNote:
        "Commodity production can occur under different ownership and labor relations and is not sufficient to classify an economy as capitalist.",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "mixed-economy",
      kind: "concept",
      label: "Mixed economy",
      description:
        "A scoped description of an economy combining multiple ownership forms and allocation mechanisms.",
      schemeIds: ["political-economic-ideas"],
      scopeNote:
        "Name the actual public, private, cooperative, household, customary, market, planned, and redistributive institutions instead of using this as a residual category.",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "business-firm",
      kind: "concept",
      label: "Business firm",
      description:
        "A governed organization that coordinates production or services through internal authority while transacting with other actors.",
      schemeIds: ["political-economic-ideas"],
      scopeNote:
        "Identify legal form, ownership, control, employment, finance, and internal coordination rather than treating every firm as privately owned or internally market-organized.",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "finance",
      kind: "concept",
      label: "Finance",
      description:
        "Institutions and practices that create, price, transfer, or administer monetary claims across time and uncertainty.",
      schemeIds: ["political-economic-ideas"],
      scopeNote:
        "Keep finance distinct from money, physical assets, wealth, productive activity, and capital while identifying the legal claims and institutions involved.",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "legal-order",
      kind: "concept",
      label: "Legal order",
      description:
        "An institutional arrangement of recognized rules, offices, procedures, powers, duties, and remedies.",
      schemeIds: ["political-economic-ideas"],
      scopeNote:
        "Do not reduce law to state legislation alone or infer effective enforcement from a formal rule; identify institutions and practice in a bounded setting.",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "state-capacity",
      kind: "concept",
      label: "State capacity",
      description:
        "A state’s uneven ability to formulate and carry out decisions through administrative, fiscal, informational, legal, and coercive institutions.",
      schemeIds: ["political-economic-ideas"],
      scopeNote:
        "Specify the task, institution, place, period, and evidence; capacity in one field does not establish capacity, legitimacy, or effectiveness in another.",
      ...reviewed,
    },
  },

  statement(
    "capitalism-definition-contested",
    "Capitalism has rival definitions",
    "Influential accounts define capitalism through different combinations of accumulation, private ownership, wage labor, markets, firms, finance, law, and state institutions; no single feature is an uncontested sufficient definition.",
    "definition",
  ),
  statement(
    "capitalism-market-boundary",
    "Markets do not define capitalism",
    "Markets are central to capitalism but existed before it and can operate with non-private ownership, so market exchange alone does not identify capitalism.",
    "definition",
  ),
  statement(
    "capitalism-institutional-definition",
    "Hodgson’s institutional definition",
    "Geoffrey Hodgson defines capitalism through a historically specific combination of legal property, commodity exchange, money and finance, firms, and widespread employment rather than through markets or private property alone.",
    "definition",
  ),
  statement(
    "capitalism-marx-definition",
    "Marx’s social-relation account",
    "Marx analyzes capital as a social relation in which owners purchase labor-power and direct commodity production toward surplus and accumulation.",
    "definition",
  ),
  statement(
    "capitalism-polanyi-definition",
    "Polanyi’s market-society account",
    "Karl Polanyi interprets nineteenth-century market society through efforts to organize land, labor, and money as if they were commodities, while emphasizing that public action created and maintained those markets.",
    "definition",
  ),
  statement(
    "property-possession-boundary",
    "Property differs from possession",
    "Legal property allocates enforceable relations among people concerning a resource; physical control or use of the resource does not by itself establish the same rights.",
    "definition",
  ),
  statement(
    "property-rights-plural",
    "Property is not one indivisible power",
    "Hohfeld’s legal analysis distinguishes claims, privileges, powers, and immunities and their correlative duties and liabilities, so an ownership label does not reveal every operative right.",
    "definition",
  ),
  statement(
    "wage-labor-boundary",
    "Wage labor is one labor relation",
    "Employment gives an employer authority over how work is performed in exchange for wages, unlike a contract for a completed service; neither relation is slavery, serfdom, or household labor.",
    "definition",
  ),
  statement(
    "wage-labor-history-limit",
    "Wage labor predates modern capitalism",
    "Day labor and paid employment existed before the eighteenth-century capitalist transformation, so wage labor alone is not a sufficient historical test for capitalism.",
    "observation",
  ),
  statement(
    "commodity-production-boundary",
    "Commodity production is not a complete system",
    "Producing for exchange identifies an orientation of production but does not specify who owns assets, who controls work, how investment is financed, or which non-market institutions allocate resources.",
    "definition",
  ),
  statement(
    "firm-market-boundary",
    "Firms coordinate internally without market exchange",
    "Transactions among firms can be market exchanges while authority within firms is commonly hierarchical and administrative, so an economy cannot be described as a pure network of markets.",
    "definition",
  ),
  statement(
    "capital-finance-boundary",
    "Capital is not simply money or wealth",
    "Hodgson treats capital as money value attached to alienable property that can support credit and investment; money, physical assets, wealth, and capital therefore require separate identification.",
    "definition",
  ),
  statement(
    "market-definition-exchange",
    "Markets organize recurring exchange",
    "Markets are institutions for exchange whose prices and competitive conditions emerge from rules, participants, and repeated transactions; an isolated swap is not a complete market economy.",
    "definition",
  ),
  statement(
    "market-economy-plural-allocation",
    "Economies use several allocation mechanisms",
    "Households, firms, public agencies, associations, reciprocity, redistribution, and direct production coexist with price-mediated exchange, including in economies commonly called market economies.",
    "definition",
  ),
  statement(
    "market-state-boundary",
    "Markets depend on political and legal institutions",
    "Property, contract, money, competition, and remedies operate through legal and political rules, so market coordination does not imply the absence of public authority.",
    "definition",
  ),
  statement(
    "market-ownership-boundary",
    "Market coordination does not settle ownership",
    "Goods and services can be exchanged at prices under private, public, cooperative, social, or mixed ownership arrangements.",
    "definition",
  ),
  statement(
    "market-laissez-faire-boundary",
    "Market economy does not mean laissez-faire",
    "Regulation, taxation, public provision, social insurance, and state-owned organizations can coexist with extensive market exchange; their presence or absence must be assessed separately.",
    "definition",
  ),
  statement(
    "smith-exchange-division-labor",
    "Smith’s exchange account",
    "Adam Smith attributes the division of labor partly to a human propensity to exchange and argues that the extent of the market limits specialization.",
    "observation",
  ),
  statement(
    "england-brenner-class-thesis",
    "Brenner’s agrarian class thesis",
    "Robert Brenner attributes England’s agrarian transformation to changing relations among landlords, tenant farmers, and laborers that subjected producers to market dependence and competitive leasing.",
    "observation",
  ),
  statement(
    "england-brenner-rival-explanations",
    "The Brenner thesis remains contested",
    "Contributors to the Brenner Debate dispute the weight assigned to class relations and advance demographic, commercial, regional, and political explanations, so the English sequence is not a settled universal origin story.",
    "observation",
  ),
  statement(
    "ghana-cocoa-smallholder-expansion",
    "African producers drove cocoa expansion",
    "In the Gold Coast cocoa take-off from about 1890 to 1936, African farmers adopted and expanded an introduced export crop through predominantly smallholder production rather than plantation firms directing wage labor throughout production.",
    "observation",
  ),
  statement(
    "ghana-cocoa-resource-reallocation",
    "Cocoa growth reallocated resources",
    "Gareth Austin finds that cocoa expansion drew land, labor, and capital from existing market activities into a more profitable production process rather than merely putting otherwise idle labor to work.",
    "observation",
  ),
  statement(
    "ghana-cocoa-classification-limit",
    "Commodity expansion does not settle system classification",
    "Gold Coast cocoa joined smallholder landholding and family or hired labor to colonial rule and international markets, showing that commodity production alone does not specify one ownership or labor system.",
    "editorial-interpretation",
  ),
  statement(
    "china-dual-track-coordination",
    "Plan and market operated together in reform-era China",
    "From 1979 through the early 1990s, Chinese reforms expanded enterprise autonomy and market exchange while mandatory plans, administered prices, and state organizations continued to operate.",
    "observation",
  ),
  statement(
    "china-tve-ownership-boundary",
    "Market entry did not require conventional private ownership",
    "Township and village enterprises expanded market production and competition under varied local and collective ownership claims, making marketization an unreliable synonym for privatization.",
    "observation",
  ),
  statement(
    "china-marketization-classification-limit",
    "Marketization does not decide whether an economy is capitalist",
    "Naughton’s account documents incremental institutional change rather than one switch from plan to market, so classifying the resulting order requires separate evidence about ownership, control, employment, finance, and state power.",
    "editorial-interpretation",
  ),

  {
    documentType: "entity",
    entity: {
      id: "agrarian-england",
      kind: "place",
      label: "England",
      description: "England as bounded for the agrarian transformation case.",
      placeType: "country",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "colonial-gold-coast-cocoa-region",
      kind: "place",
      label: "Gold Coast cocoa-growing regions",
      description:
        "Cocoa-growing regions of Asante and the colonial Gold Coast, within present-day Ghana.",
      placeType: "region",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "reform-era-china",
      kind: "place",
      label: "People’s Republic of China",
      description:
        "The People’s Republic of China as bounded for the 1978–1993 reform case.",
      placeType: "country",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "english-agrarian-market-dependence",
      kind: "case",
      label: "Agrarian market dependence in England, c. 1450–1750",
      description:
        "A contested case about agrarian class relations, leasing, labor, and market dependence before industrialization.",
      locationIds: ["agrarian-england"],
      startDate: {
        year: 1450,
        certainty: "approximate",
        note: "A conventional lower bound for the long agrarian transformation.",
      },
      endDate: {
        year: 1750,
        certainty: "approximate",
        note: "A conventional upper bound before industrialization.",
      },
      scope:
        "Agrarian England from approximately 1450 to 1750; not Britain’s whole economy, a single-origin account, or a universal transition sequence.",
      selectionRationale:
        "The dispute tests whether markets and private property alone explain capitalism or whether changing class and tenancy relations matter.",
      conditionStatementIds: [
        "capitalism-market-boundary",
        "england-brenner-rival-explanations",
      ],
      episodeIds: ["english-agrarian-transformation-1450-1750"],
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "english-agrarian-transformation-1450-1750",
      kind: "case-episode",
      label: "English agrarian transformation, c. 1450–1750",
      description:
        "The bounded period in which rival explanations trace changes in agrarian property, tenancy, labor, and markets.",
      caseId: "english-agrarian-market-dependence",
      locationIds: ["agrarian-england"],
      startDate: {
        year: 1450,
        certainty: "approximate",
        note: "A conventional beginning for the long agrarian transformation.",
      },
      endDate: {
        year: 1750,
        certainty: "approximate",
        note: "A conventional endpoint before industrialization.",
      },
      scope:
        "Agrarian institutions in England, with regional and chronological variation retained.",
      conditionStatementIds: ["capitalism-market-boundary"],
      formalRuleStatementIds: ["property-rights-plural"],
      ruleInUseStatementIds: ["england-brenner-class-thesis"],
      interactionStatementIds: ["england-brenner-rival-explanations"],
      outcomeStatementIds: [],
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "gold-coast-cocoa-expansion",
      kind: "case",
      label: "Gold Coast cocoa expansion, c. 1890–1936",
      description:
        "A bounded case of African smallholder commodity production within colonial rule and global markets.",
      locationIds: ["colonial-gold-coast-cocoa-region"],
      startDate: {
        year: 1890,
        certainty: "approximate",
        note: "Approximate beginning of sustained cocoa expansion.",
      },
      endDate: {
        year: 1936,
        certainty: "approximate",
        note: "Austin’s analytical endpoint.",
      },
      scope:
        "Cocoa-growing regions of Asante and the Gold Coast from about 1890 to 1936; not all households, crops, or colonial Africa.",
      selectionRationale:
        "The case separates commodity and market expansion from plantation ownership and uniform wage labor.",
      conditionStatementIds: ["ghana-cocoa-classification-limit"],
      episodeIds: ["gold-coast-cocoa-takeoff-1890-1936"],
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "gold-coast-cocoa-takeoff-1890-1936",
      kind: "case-episode",
      label: "Gold Coast cocoa take-off, c. 1890–1936",
      description:
        "African producer-led adoption and expansion of cocoa for export under colonial rule.",
      caseId: "gold-coast-cocoa-expansion",
      locationIds: ["colonial-gold-coast-cocoa-region"],
      startDate: {
        year: 1890,
        certainty: "approximate",
        note: "Approximate beginning of sustained cocoa expansion.",
      },
      endDate: {
        year: 1936,
        certainty: "approximate",
        note: "Austin’s analytical endpoint.",
      },
      scope:
        "The supply-side transformation studied by Austin, not a complete welfare or political history.",
      conditionStatementIds: ["ghana-cocoa-smallholder-expansion"],
      formalRuleStatementIds: [],
      ruleInUseStatementIds: ["ghana-cocoa-smallholder-expansion"],
      interactionStatementIds: ["ghana-cocoa-resource-reallocation"],
      outcomeStatementIds: ["ghana-cocoa-classification-limit"],
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "china-dual-track-market-reforms",
      kind: "case",
      label: "China’s dual-track market reforms, 1978–1993",
      description:
        "A bounded case of market expansion alongside planning, state organizations, and mixed ownership claims.",
      locationIds: ["reform-era-china"],
      startDate: { year: 1978, certainty: "exact" },
      endDate: { year: 1993, certainty: "exact" },
      scope:
        "Economic reforms in the People’s Republic of China from 1978 through 1993; not a classification of China before or after those dates.",
      selectionRationale:
        "The case tests whether marketization, privatization, and capitalism can be treated as interchangeable transitions.",
      conditionStatementIds: ["china-marketization-classification-limit"],
      episodeIds: ["china-plan-market-coexistence-1978-1993"],
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "china-plan-market-coexistence-1978-1993",
      kind: "case-episode",
      label: "Plan–market coexistence, 1978–1993",
      description:
        "Incremental reform through enterprise autonomy, dual-track allocation, and non-state entry.",
      caseId: "china-dual-track-market-reforms",
      locationIds: ["reform-era-china"],
      startDate: { year: 1978, certainty: "exact" },
      endDate: { year: 1993, certainty: "exact" },
      scope:
        "The reform sequence analyzed by Naughton, ending before later ownership and corporate reforms.",
      conditionStatementIds: ["china-dual-track-coordination"],
      formalRuleStatementIds: ["china-dual-track-coordination"],
      ruleInUseStatementIds: ["china-tve-ownership-boundary"],
      interactionStatementIds: ["china-marketization-classification-limit"],
      outcomeStatementIds: [],
      ...reviewed,
    },
  },
] satisfies AuthoringDocument[];
