import type { AuthoringDocument } from "../../../src/lib/domain";

const reviewed = { publicationStatus: "reviewed" as const };
const orientationRefs = (
  article: string,
  id: string,
  match: "exact" | "close" = "exact",
) => [
  {
    system: "wikipedia" as const,
    url: `https://en.wikipedia.org/wiki/${article.replaceAll(" ", "_")}`,
    purpose: "orientation" as const,
    language: "en",
    checkedAt: "2026-09-06",
  },
  {
    system: "wikidata" as const,
    id,
    url: `https://www.wikidata.org/wiki/${id}`,
    purpose: "identity" as const,
    match,
    checkedAt: "2026-09-06",
  },
];

type SourceType = "article" | "edition" | "web-page";
type WorkType = "article" | "book" | "other";
type LinkPurpose = "archive" | "authorized-reading" | "publisher";
type SourceOptions = {
  sourcePublicationYear?: number | null;
  sourceContributors?: string[];
  sourcePublisher?: string;
  workType?: WorkType;
  linkPurpose?: LinkPurpose;
};

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
  options: SourceOptions = {},
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
        options.workType ??
        (sourceType === "article"
          ? "article"
          : sourceType === "edition"
            ? "book"
            : "other"),
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
      contributorDisplay: options.sourceContributors ?? contributors,
      ...(options.sourcePublicationYear === null
        ? {}
        : {
            publicationYear: options.sourcePublicationYear ?? publicationYear,
          }),
      publisher: options.sourcePublisher ?? publisher,
      ...(Object.keys(identifiers).length ? { identifiers } : {}),
      resourceLinks: [
        {
          purpose: options.linkPurpose ?? "publisher",
          url,
          label: "Open the source record",
        },
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
    | "causal-hypothesis"
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
    { sourcePublicationYear: 2026 },
  ),
  ...source(
    "hodgson-conceptualizing-capitalism",
    "Conceptualizing Capitalism: Institutions, Evolution, Future",
    ["Geoffrey M. Hodgson"],
    2015,
    "University of Chicago Press",
    "edition",
    "https://academic.oup.com/chicago-scholarship-online/book/17328",
    { doi: "10.7208/chicago/9780226168142.001.0001", isbn13: "9780226168142" },
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
    {
      sourcePublicationYear: null,
      linkPurpose: "authorized-reading",
    },
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
    {
      sourcePublicationYear: null,
      sourceContributors: [
        "Karl Marx",
        "Samuel Moore",
        "Edward Aveling",
        "Friedrich Engels",
      ],
      linkPurpose: "archive",
    },
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
    1985,
    { sourcePublicationYear: 2009 },
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
    { isbn13: "9780521470551" },
    1995,
    { sourcePublicationYear: 2010 },
  ),

  {
    documentType: "entity",
    entity: {
      id: "capitalism",
      kind: "concept",
      label: "Capitalism",
      description:
        "A contested concept whose definitions distinguish modern capitalism from older markets by adding further institutions.",
      schemeIds: ["political-economic-ideas"],
      scopeNote:
        "Do not use the term as a synonym for markets, commerce, private possessions, freedom, one policy program, or a timeless property of a country.",
      externalRefs: orientationRefs("Capitalism", "Q6206"),
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
        "A contested description for economies in which markets are important; it leaves ownership open and does not exclude non-market allocation.",
      schemeIds: ["political-economic-ideas"],
      scopeNote:
        "Do not infer private ownership, laissez-faire policy, capitalism, or the absence of planning from market exchange alone.",
      externalRefs: orientationRefs("Market economy", "Q179522"),
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
      externalRefs: orientationRefs("Private property", "Q555911"),
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
      externalRefs: orientationRefs("Wage labour", "Q949973"),
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
      externalRefs: orientationRefs("Mixed economy", "Q191675"),
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
  statement(
    "capitalism-definition-contested",
    "Capitalism has rival definitions",
    "The term capitalism has no single, generally accepted definition.",
    "definition",
  ),
  statement(
    "capitalism-market-boundary",
    "Markets predate modern capitalism",
    "Markets existed before the economic order commonly called capitalism.",
    "definition",
  ),
  statement(
    "capitalism-institutional-definition",
    "Hodgson’s institutional definition",
    "Geoffrey Hodgson includes widespread employment and developed financial institutions in his minimum definition of capitalism.",
    "definition",
  ),
  statement(
    "capitalism-marx-definition",
    "Marx on labor-power and surplus value",
    "Marx describes the capitalist’s purchase of labor-power as a condition for producing surplus value.",
    "definition",
  ),
  statement(
    "capitalism-polanyi-definition",
    "Polanyi’s fictitious commodities",
    "Karl Polanyi calls labor, land, and money fictitious commodities because they are not produced for sale.",
    "definition",
  ),
  statement(
    "property-possession-boundary",
    "Property differs from possession",
    "Legal property is distinct from physical possession.",
    "definition",
  ),
  statement(
    "property-rights-plural",
    "Hohfeld distinguishes separate legal positions",
    "Hohfeld distinguishes claims, privileges, powers, and immunities as separate legal positions.",
    "definition",
  ),
  statement(
    "wage-labor-boundary",
    "Employment permits direction of work",
    "An employment contract gives the employer a right to direct how work is performed.",
    "definition",
  ),
  statement(
    "wage-labor-history-limit",
    "Paid day labor predates modern capitalism",
    "Paid day labor existed in medieval Europe before modern capitalism.",
    "observation",
  ),
  statement(
    "commodity-production-boundary",
    "Production for exchange leaves ownership open",
    "Production for exchange does not by itself specify the ownership of productive assets.",
    "definition",
  ),
  statement(
    "firm-market-boundary",
    "Firms coordinate internally without market exchange",
    "Firms commonly coordinate their internal activity through hierarchy rather than market exchange.",
    "definition",
  ),
  statement(
    "capital-finance-boundary",
    "Hodgson’s definition of capital",
    "Hodgson defines capital as money value attached to alienable property.",
    "definition",
  ),
  statement(
    "market-definition-exchange",
    "Markets organize recurring exchange",
    "A market is a social institution in which goods and services are regularly exchanged.",
    "definition",
  ),
  statement(
    "market-economy-plural-allocation",
    "Economies use several allocation mechanisms",
    "Economies allocate goods through mechanisms other than markets, including reciprocity and redistribution.",
    "definition",
  ),
  statement(
    "market-state-boundary",
    "A market economy requires supporting legal rules",
    "A functioning market economy requires legal rules that protect property rights and enforce contracts.",
    "definition",
  ),
  statement(
    "market-ownership-boundary",
    "Market exchange does not settle ownership",
    "Market exchange can coexist with forms of capital ownership other than private ownership.",
    "definition",
  ),
  statement(
    "market-laissez-faire-boundary",
    "Market economy does not mean laissez-faire",
    "The existence of regulation does not make an economy non-market.",
    "definition",
  ),
  statement(
    "smith-exchange-division-labor",
    "Smith on market extent and the division of labor",
    "Adam Smith argues that the extent of the market limits the division of labor.",
    "causal-hypothesis",
  ),
  statement(
    "england-brenner-class-thesis",
    "Brenner’s agrarian class thesis",
    "Robert Brenner attributes England’s agrarian development to its structure of agrarian class relations.",
    "causal-hypothesis",
  ),
  statement(
    "england-brenner-rival-explanations",
    "The Brenner thesis remains contested",
    "The contributors to The Brenner Debate disagree about Brenner’s account of agrarian change.",
    "observation",
  ),
  statement(
    "ghana-cocoa-smallholder-expansion",
    "African producers initiated cocoa expansion",
    "African producers initiated the Gold Coast cocoa take-off around 1890.",
    "observation",
  ),
  statement(
    "ghana-cocoa-resource-reallocation",
    "Cocoa growth reallocated resources",
    "Gareth Austin finds that Gold Coast cocoa production reallocated resources from existing market activities.",
    "observation",
  ),
  statement(
    "ghana-cocoa-classification-limit",
    "Gold Coast cocoa exports expanded",
    "Gold Coast cocoa exports expanded rapidly between about 1890 and 1936.",
    "observation",
  ),
  statement(
    "china-dual-track-coordination",
    "Enterprise autonomy expanded while planning continued",
    "China’s state-sector reforms after 1978 combined greater enterprise autonomy with continued planning.",
    "observation",
  ),
  statement(
    "china-tve-ownership-boundary",
    "Township and village enterprises entered markets",
    "Township and village enterprises entered markets and competed with state-owned enterprises during China’s reform period.",
    "observation",
  ),
  statement(
    "china-marketization-classification-limit",
    "Naughton describes reform as growing out of the plan",
    "Naughton describes China’s 1978–1993 reforms as growing out of the plan rather than abolishing it at once.",
    "observation",
  ),
  statement(
    "england-case-period-boundary",
    "The England case uses an analytical period",
    "Approximately 1450–1750 bounds England’s long agrarian transformation analytically; those years are not dates of a single transition event.",
    "editorial-interpretation",
  ),
  statement(
    "ghana-case-period-boundary",
    "Austin bounds the cocoa take-off",
    "Austin dates the Ghanaian cocoa take-off to approximately 1890–1936.",
    "observation",
  ),
  statement(
    "china-case-period-boundary",
    "Naughton bounds the reform study",
    "Naughton’s study covers Chinese economic reform from 1978 through 1993.",
    "observation",
  ),
  statement(
    "china-nonstate-sector-growth",
    "China’s non-state sector grew",
    "China’s non-state sector grew rapidly during the reform period.",
    "observation",
  ),
  statement(
    "capitalism-legal-order-relation",
    "Hodgson’s definition requires a legal system",
    "Hodgson’s definition of capitalism treats a legal system supporting property and contract as a necessary institution.",
    "definition",
  ),
  statement(
    "capitalism-private-property-relation",
    "Hodgson includes private property in capitalism’s definition",
    "Hodgson includes private property among the institutions in his definition of capitalism.",
    "definition",
  ),
  statement(
    "market-economy-firm-relation",
    "Economies can contain markets and hierarchical corporations",
    "An economy can include both markets and corporations while corporations coordinate their internal activity through hierarchy.",
    "definition",
  ),
  statement(
    "capitalism-market-economy-relation",
    "Hodgson finds markets insufficient to define capitalism",
    "Hodgson argues that markets are insufficient to define capitalism.",
    "definition",
  ),

  {
    documentType: "entity",
    entity: {
      id: "agrarian-england",
      kind: "place",
      label: "England",
      description: "England as bounded for the agrarian transformation case.",
      placeType: "country",
      externalRefs: orientationRefs("England", "Q21"),
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
      externalRefs: orientationRefs("China", "Q148"),
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "english-agrarian-market-dependence",
      kind: "case",
      label: "Agrarian change in England, c. 1450–1750",
      description:
        "A bounded case for comparing Brenner’s agrarian-class explanation with the historical dispute it prompted.",
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
        "The case preserves a prominent explanation of agrarian development together with disagreement about that explanation.",
      conditionStatementIds: [],
      episodeIds: ["english-agrarian-transformation-1450-1750"],
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "english-agrarian-transformation-1450-1750",
      kind: "case-episode",
      label: "English agrarian change, c. 1450–1750",
      description:
        "An analytically bounded period for Brenner’s account of English agrarian development.",
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
      conditionStatementIds: [],
      formalRuleStatementIds: [],
      ruleInUseStatementIds: [],
      interactionStatementIds: [],
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
        "A bounded case from Austin’s study of African producer-led cocoa expansion and resource reallocation.",
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
        "The case records Austin’s finding that expansion reallocated resources from other market activities.",
      conditionStatementIds: [],
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
        "The producer-led cocoa expansion dated approximately 1890–1936 by Austin.",
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
      conditionStatementIds: [],
      formalRuleStatementIds: [],
      ruleInUseStatementIds: [],
      interactionStatementIds: [
        "ghana-cocoa-smallholder-expansion",
        "ghana-cocoa-resource-reallocation",
      ],
      outcomeStatementIds: ["ghana-cocoa-classification-limit"],
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "china-dual-track-market-reforms",
      kind: "case",
      label: "China’s economic reforms, 1978–1993",
      description:
        "A bounded case of greater enterprise autonomy, continued planning, and non-state-sector growth.",
      locationIds: ["reform-era-china"],
      startDate: { year: 1978, certainty: "exact" },
      endDate: { year: 1993, certainty: "exact" },
      scope:
        "Economic reforms in the People’s Republic of China from 1978 through 1993; not a classification of China before or after those dates.",
      selectionRationale:
        "The case records institutional changes that Naughton describes as growing out of the plan rather than ending it at once.",
      conditionStatementIds: [],
      episodeIds: ["china-plan-market-coexistence-1978-1993"],
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "china-plan-market-coexistence-1978-1993",
      kind: "case-episode",
      label: "Enterprise reform and non-state growth, 1978–1993",
      description:
        "A period of enterprise reform, continued planning, and non-state market entry.",
      caseId: "china-dual-track-market-reforms",
      locationIds: ["reform-era-china"],
      startDate: { year: 1978, certainty: "exact" },
      endDate: { year: 1993, certainty: "exact" },
      scope:
        "The reform sequence analyzed by Naughton, ending before later ownership and corporate reforms.",
      conditionStatementIds: [],
      formalRuleStatementIds: [],
      ruleInUseStatementIds: [],
      interactionStatementIds: [
        "china-dual-track-coordination",
        "china-tve-ownership-boundary",
      ],
      outcomeStatementIds: ["china-nonstate-sector-growth"],
      ...reviewed,
    },
  },
] satisfies AuthoringDocument[];
