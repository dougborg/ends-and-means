import type { AuthoringDocument } from "../../../src/lib/domain";

const reviewed = { publicationStatus: "reviewed" as const };
const source = (
  id: string,
  title: string,
  author: string,
  year: number,
  publisher: string,
  url: string,
  sourceYear = year,
  sourcePublisher = publisher,
): AuthoringDocument[] => [
  {
    documentType: "entity",
    entity: {
      id: `${id}-work`,
      kind: "work",
      label: title,
      description: `A non-fiction work used to distinguish anarchist ideas, movements, and institutions: ${title}.`,
      title,
      workType: "book",
      originalPublicationYear: year,
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: `${id}-source`,
      kind: "source",
      label: title,
      description: `The consulted edition of ${title}.`,
      title,
      sourceType: "edition",
      workId: `${id}-work`,
      contributorDisplay: [author],
      publicationYear: sourceYear,
      publisher: sourcePublisher,
      resourceLinks: [{ purpose: "publisher", url, label: "Source record" }],
      ...reviewed,
    },
  },
];
const claim = (
  id: string,
  label: string,
  text: string,
  statementKind:
    | "definition"
    | "observation"
    | "attributed-proposal"
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

export const anarchismEvidenceDocuments = [
  ...source(
    "prichard-anarchism-vsi",
    "Anarchism: A Very Short Introduction, second edition",
    "Alex Prichard",
    2022,
    "Oxford University Press",
    "https://doi.org/10.1093/actrade/9780198815617.001.0001",
  ),
  ...source(
    "baker-means-ends",
    "Means and Ends: The Revolutionary Practice of Anarchism in Europe and the United States",
    "Zoe Baker",
    2023,
    "AK Press",
    "https://www.akpress.org/means-and-ends.html",
  ),
  ...source(
    "rocker-anarchosyndicalism",
    "Anarcho-Syndicalism: Theory and Practice",
    "Rudolf Rocker",
    1938,
    "Martin Secker and Warburg",
    "https://books.google.com/books?id=dblzAdMMtX0C",
    2004,
    "AK Press",
  ),
  ...source(
    "graham-spanish-republic",
    "The Spanish Republic at War, 1936–1939",
    "Helen Graham",
    2002,
    "Cambridge University Press",
    "https://assets.cambridge.org/97805214/59327/toc/9780521459327_toc.pdf",
  ),
  ...source(
    "ackelsberg-free-women",
    "Free Women of Spain: Anarchism and the Struggle for the Emancipation of Women",
    "Martha A. Ackelsberg",
    1991,
    "Indiana University Press",
    "https://iupress.org/9780253116178/free-women-of-spain/",
  ),
  {
    documentType: "entity",
    entity: {
      id: "anarcho-syndicalism",
      kind: "concept",
      label: "Anarcho-syndicalism",
      description:
        "A historical anarchist tradition joining revolutionary union organization to a proposed federated social order.",
      schemeIds: ["political-economic-ideas"],
      scopeNote:
        "Keep this historically named tradition distinct from the broader anarchism concept and from any concrete organizing approach or union.",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "anarchism",
      kind: "concept",
      label: "Anarchism",
      description:
        "A contested family of ideas and movements opposing domination and proposing social organization without governing hierarchy.",
      schemeIds: ["political-economic-ideas"],
      scopeNote:
        "Keep the concept, historical movements, approaches, ends, means, self-identification, and bounded cases distinct.",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "anarchist-traditions",
      kind: "collection",
      label: "Anarchist traditions",
      description:
        "A non-inheriting collection of historically related but internally disputed anarchist traditions.",
      inclusionRule:
        "Include a concept or approach only through a qualified, sourced relationship; membership does not transmit ends, means, or case classifications.",
      editorialPurpose:
        "Help readers follow overlapping anarchist lineages without treating them as one inherited program.",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "anarcho-syndicalist-organizing",
      kind: "approach",
      label: "Anarcho-syndicalist organizing",
      description:
        "An approach that treats worker organization and direct industrial action as both present struggle and preparation for federated worker administration.",
      scope:
        "Historically self-described anarcho-syndicalist proposals and organizations; not every militant or federated union.",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "freedom-from-domination",
      kind: "end",
      label: "Freedom from domination",
      description:
        "An attributed aim of preventing durable subjection to state, economic, patriarchal, or other governing power.",
      scope:
        "An attributed anarchist aim whose institutional meaning varies across traditions.",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "worker-union-federation",
      kind: "means",
      label: "Worker-union federation",
      description:
        "Worker unions coordinate production and collective action through federated organization.",
      institutionalForm:
        "Worker unions join federations that coordinate industrial action and, in Rocker's proposal, prepare administration of production.",
      ...reviewed,
    },
  },
  claim(
    "anarchism-contested-family",
    "Anarchism is an internally disputed family",
    "Anarchism names an internally disputed family of ideas and movements rather than one institutional blueprint.",
    "definition",
  ),
  claim(
    "anarchism-opposes-domination",
    "Anarchists oppose governing domination",
    "Across major historical currents, anarchists opposed the state's claim to governing authority.",
  ),
  claim(
    "anarchism-opposes-other-domination",
    "Anarchist criticism extends beyond the state",
    "Anarchist traditions have also challenged durable economic and social relations of domination.",
  ),
  claim(
    "anarchism-property-strategy-disagreement",
    "Anarchists disagree about property and strategy",
    "Historical anarchist currents disagreed about property, markets, formal organization, and revolutionary strategy.",
  ),
  claim(
    "anarchism-not-disorganization",
    "Anarchism does not mean absence of organization",
    "Anarchist proposals replace centralized governing authority with voluntary association, assemblies, delegation, and federation rather than rejecting organization itself.",
    "definition",
  ),
  claim(
    "anarchism-tradition-boundary",
    "Traditions do not inherit one program",
    "Anarcho-communism, syndicalist anarchism, mutualism, and individualist currents overlap historically but do not inherit one position on exchange, distribution, or formal organization.",
    "editorial-interpretation",
  ),
  claim(
    "rocker-syndicalist-double-aim",
    "Rocker gives unions a double aim",
    "Rocker proposes revolutionary unions both defend workers under existing conditions and prepare them to administer production through federation.",
    "attributed-proposal",
  ),
  claim(
    "baker-strategy-disagreement",
    "Anarchists disputed mass organization",
    "Baker distinguishes mass-organizational, insurrectionist, syndicalist, and organizational-dualist strategies within the historical anarchist movement.",
  ),
  claim(
    "spanish-case-plurality",
    "Spanish revolutionary institutions were politically plural",
    "In Republican Spain after July 1936, anarchist-led initiatives operated beside socialist unions, parties, regional governments, and wartime state institutions rather than replacing them uniformly.",
  ),
  claim(
    "mujeres-libres-gender-counterevidence",
    "Mujeres Libres exposed gender limits",
    "Mujeres Libres formed an autonomous women's organization within the Spanish libertarian movement.",
  ),
  claim(
    "spanish-anarchist-gender-subordination",
    "Anarchist commitments did not end women's subordination",
    "Ackelsberg finds that formal commitments to emancipation did not remove women's subordination inside the wider Spanish anarchist movement.",
  ),
  claim(
    "anarchosyndicalist-self-identification",
    "Anarcho-syndicalism was a historically named tradition",
    "Rocker described anarcho-syndicalism as a libertarian-socialist current with its own aims and methods.",
  ),
  claim(
    "anarchist-case-nonembodiment",
    "Institutional resemblance does not establish anarchist identity",
    "A bounded case or institution is not anarchist merely because it uses assemblies, mutual aid, direct action, or federation; classification also requires historical actors, purposes, relationships, and counterevidence.",
    "editorial-interpretation",
  ),
  {
    documentType: "entity",
    entity: {
      id: "spain",
      kind: "place",
      label: "Spain",
      description: "The geographic boundary for the 1936–1939 case.",
      placeType: "country",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "spanish-anarchist-initiatives-1936-1939",
      kind: "case",
      label: "Anarchist initiatives in Republican Spain, 1936–1939",
      description:
        "A bounded examination of anarchist-led workplace, militia, and women's organizing amid civil war and politically plural Republican institutions.",
      locationIds: ["spain"],
      startDate: { year: 1936, certainty: "exact" },
      endDate: { year: 1939, certainty: "exact" },
      scope:
        "Selected anarchist-led initiatives in Republican-held Spain from July 1936 through defeat in 1939; not Spain as an anarchist society or a complete history of the war.",
      selectionRationale:
        "The episode tests organizational proposals and ideological classification under war, coalition government, and gender hierarchy.",
      conditionStatementIds: ["spanish-case-plurality"],
      episodeIds: ["spanish-anarchist-initiatives-war-episode"],
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "spanish-anarchist-initiatives-war-episode",
      kind: "case-episode",
      label: "Anarchist initiatives during the Spanish Civil War",
      description:
        "The operating interval for selected anarchist-led initiatives and Mujeres Libres in Republican-held Spain.",
      caseId: "spanish-anarchist-initiatives-1936-1939",
      locationIds: ["spain"],
      startDate: { year: 1936, month: 7, certainty: "exact" },
      endDate: { year: 1939, certainty: "exact" },
      scope:
        "Selected institutions from July 1936 through 1939, with political plurality and uneven geography kept explicit.",
      conditionStatementIds: ["spanish-case-plurality"],
      formalRuleStatementIds: [],
      ruleInUseStatementIds: ["mujeres-libres-gender-counterevidence"],
      interactionStatementIds: ["spanish-case-plurality"],
      outcomeStatementIds: [],
      ...reviewed,
    },
  },
] satisfies AuthoringDocument[];
