import type { AuthoringDocument } from "../../../src/lib/domain";

const reviewed = { publicationStatus: "reviewed" as const };
const source = (
  id: string,
  title: string,
  contributorDisplay: string[],
  publicationYear: number,
  publisher: string,
  sourceType: "edition" | "article" | "web-page" | "report",
  url: string,
): AuthoringDocument[] => [
  {
    documentType: "entity",
    entity: {
      id: `${id}-work`,
      kind: "work",
      label: title,
      description: `The non-fiction work underlying the cited Tawantinsuyu source: ${title}.`,
      title,
      workType:
        sourceType === "article"
          ? "article"
          : sourceType === "report"
            ? "report"
            : sourceType === "edition"
              ? "book"
              : "other",
      originalPublicationYear: publicationYear,
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: `${id}-source`,
      kind: "source",
      label: title,
      description: `A source used for the bounded Tawantinsuyu case: ${title}.`,
      title,
      sourceType,
      workId: `${id}-work`,
      contributorDisplay,
      publicationYear,
      publisher,
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
    | "observation"
    | "definition"
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

export const tawantinsuyuEvidenceDocuments = [
  {
    documentType: "entity",
    entity: {
      id: "andes-tawantinsuyu",
      kind: "place",
      label: "Tawantinsuyu",
      description:
        "The multi-regional Andean polity conventionally called the Inka or Inca Empire, centered on Cusco and bounded here to its fifteenth- and early-sixteenth-century expansion.",
      placeType: "region",
      ...reviewed,
    },
  },
  ...source(
    "nmai-great-inka-road",
    "The Great Inka Road: Engineering an Empire",
    ["National Museum of the American Indian"],
    2015,
    "Smithsonian National Museum of the American Indian",
    "web-page",
    "https://americanindian.si.edu/inkaroad/",
  ),
  ...source(
    "oxford-handbook-incas",
    "The Oxford Handbook of the Incas",
    ["Sonia Alconini", "R. Alan Covey"],
    2018,
    "Oxford University Press",
    "edition",
    "https://doi.org/10.1093/oxfordhb/9780190219352.001.0001",
  ),
  ...source(
    "daltroy-incas",
    "The Incas, second edition",
    ["Terence N. D’Altroy"],
    2015,
    "Wiley Blackwell",
    "edition",
    "https://www.wiley.com/en-us/The+Incas%2C+2nd+Edition-p-9781444331158",
  ),
  ...source(
    "rostworowski-inca-realm",
    "History of the Inca Realm",
    ["María Rostworowski de Diez Canseco"],
    1999,
    "Cambridge University Press",
    "edition",
    "https://doi.org/10.1017/CBO9780511612503",
  ),
  ...source(
    "murra-economic-organization",
    "The Economic Organization of the Inka State",
    ["John V. Murra"],
    1980,
    "JAI Press",
    "edition",
    "https://search.worldcat.org/title/6627638",
  ),
  ...source(
    "daltroy-hastorf-storehouses",
    "The Distribution and Contents of Inca State Storehouses in the Xauxa Region of Peru",
    ["Terence N. D’Altroy", "Christine A. Hastorf"],
    1984,
    "American Antiquity",
    "article",
    "https://doi.org/10.2307/280022",
  ),
  ...source(
    "huanuco-pampa-project",
    "The Huánuco Pampa Archaeological Project, Volume 1: The Plaza and Palace Complex",
    ["Craig Morris", "R. Alan Covey", "Pat Stein"],
    2011,
    "American Museum of Natural History",
    "edition",
    "https://doi.org/10.5531/sp.anth.0096",
  ),
  ...source(
    "daltroy-earle-staple-finance",
    "Staple Finance, Wealth Finance, and Storage in the Inka Political Economy",
    ["Terence N. D’Altroy", "Timothy Earle"],
    1985,
    "Current Anthropology",
    "article",
    "https://doi.org/10.1086/203249",
  ),
  ...source(
    "guaman-poma-coronica",
    "El primer nueva corónica y buen gobierno",
    ["Felipe Guaman Poma de Ayala"],
    1615,
    "Royal Danish Library",
    "web-page",
    "https://poma.kb.dk/permalink/2006/poma/info/en/contents.htm",
  ),
  ...source(
    "julien-reading-inca-history",
    "Reading Inca History",
    ["Catherine Julien"],
    2000,
    "University of Iowa Press",
    "edition",
    "https://books.google.com/books?id=Sa8hsn9JbTQC",
  ),
  ...source(
    "adorno-guaman-poma",
    "Guaman Poma: Writing and Resistance in Colonial Peru, second edition",
    ["Rolena Adorno"],
    2000,
    "University of Texas Press",
    "edition",
    "https://utpress.utexas.edu/9780292705036/",
  ),
  ...source(
    "cieza-chronicle-peru",
    "Segunda parte de la Crónica del Perú, que trata del señorío de los incas yupanquis",
    ["Pedro de Cieza de León"],
    1880,
    "Biblioteca Virtual Miguel de Cervantes",
    "web-page",
    "https://www.cervantesvirtual.com/obra/segunda-parte-de-la-cronica-del-peru-que-trata-del-senorio-de-los-incas-yupanquis-y-de-sus-grandes-hechos-y-gobernacion--0/",
  ),
  statement(
    "tawantinsuyu-name-boundary",
    "Tawantinsuyu and Inka naming boundary",
    "Tawantinsuyu names a polity organized in four named quarters; Inka can name a ruler, privileged people, a language-associated identity, or the polity, while Inca is a conventional Spanish and English spelling.",
    "definition",
  ),
  statement(
    "tawantinsuyu-chronology-boundary",
    "Imperial chronology boundary",
    "The bounded case begins with expansion conventionally associated with Pachakuti in the fifteenth century and ends with the Spanish seizure of Cusco in 1533; exact accession and conquest chronologies remain disputed.",
  ),
  statement(
    "tawantinsuyu-ruler-kin-authority",
    "Ruler and royal-kin authority",
    "The Sapa Inka stood at the apex of imperial authority, but royal descent groups and estates organized resources and succession interests, so rule was not the action of one unencumbered individual.",
  ),
  statement(
    "tawantinsuyu-provincial-indirect-rule",
    "Provincial and local authority",
    "Imperial officials commonly governed through local kurakas and negotiated obligations, while strategies varied with prior political organization, resistance, distance, and regional importance.",
  ),
  statement(
    "tawantinsuyu-mita-labor",
    "Rotating labor obligations",
    "Households owed rotating mit’a service for farming, construction, transport, military, craft, and other state projects; this was a labor obligation, not adequately described as a wage contract or a uniform tax in goods.",
  ),
  statement(
    "tawantinsuyu-storage-evidence",
    "Xauxa storehouse evidence",
    "Excavated Xauxa storehouses contained major highland crops and storage vessels, while their distribution indicates centrally coordinated accumulation and disbursement with dispersed material support.",
  ),
  statement(
    "tawantinsuyu-road-labor",
    "Road building and local knowledge",
    "The imperial road system joined earlier routes to new construction and depended on the labor and landscape knowledge of incorporated populations.",
  ),
  statement(
    "tawantinsuyu-road-power-limit",
    "Road-system inference limit",
    "Roads enabled official travel, armies, messages, and provisioning, but their extent does not by itself establish identical administration or effective control in every province.",
    "editorial-interpretation",
  ),
  statement(
    "tawantinsuyu-land-resource-plurality",
    "Plural land and resource claims",
    "Subject communities, state institutions, shrines, and royal estates held distinct claims on labor and resources; calling all land simply communal or state-owned erases those divisions.",
  ),
  statement(
    "tawantinsuyu-mitmaq-resettlement",
    "Resettlement as imperial strategy",
    "Imperial authorities relocated mitmaq populations for production, security, colonization, and political control, making mobility both an administrative instrument and a source of coercion.",
  ),
  statement(
    "tawantinsuyu-warfare-incorporation",
    "Warfare and differentiated incorporation",
    "Expansion combined warfare and threats with diplomacy, gifts, ritual claims, and negotiated retention of local leaders; incorporation was neither wholly consensual nor mechanically uniform.",
  ),
  statement(
    "tawantinsuyu-gender-status-variation",
    "Gender and status differentiated obligations",
    "Work, ritual office, residence, and access to resources varied by gender and status, including specialized service by acllakuna; complementary roles did not eliminate hierarchy or coercion.",
  ),
  statement(
    "tawantinsuyu-huanuco-material",
    "Huánuco Pampa material evidence",
    "Huánuco Pampa’s plazas, compounds, and restricted palace spaces show a planned provincial center where officials and local groups met through differently accessible settings.",
  ),
  statement(
    "tawantinsuyu-reciprocity-interpretation",
    "Reciprocity and redistribution interpretation",
    "Murra interpreted state labor mobilization through Andean reciprocity and redistribution, emphasizing obligations presented through idioms of mutual provision rather than commodity exchange.",
  ),
  statement(
    "tawantinsuyu-extraction-rival",
    "Extraction and staple-finance interpretation",
    "D’Altroy and Earle analyze labor and stored staples as finance for state power, foregrounding compulsory extraction and logistical control that a reciprocity-only account can obscure.",
  ),
  statement(
    "tawantinsuyu-chronicle-mediation",
    "Colonial chronicle mediation",
    "Cieza composed his second chronicle in the 1550s, and Guaman Poma completed his manuscript around 1615; both recorded Andean institutions after invasion through colonial Spanish genres shaped by translation, Christian argument, political purpose, and retrospective reconstruction.",
  ),
  statement(
    "tawantinsuyu-guaman-poma-service",
    "Guaman Poma on age-graded service",
    "Guaman Poma’s census chapter differentiates service by age: its first-age entry assigns young men military and messenger duties, while its second-age entry assigns older men lighter work.",
  ),
  statement(
    "tawantinsuyu-non-embodiment",
    "Tawantinsuyu is not an ideological embodiment",
    "This imperial case does not embody socialism, communism, statelessness, or timeless Andean collectivism: it joined communal institutions and reciprocal idioms to ranked authority, conquest, compulsory labor, royal estates, and local variation.",
    "editorial-interpretation",
  ),
  {
    documentType: "entity",
    entity: {
      id: "tawantinsuyu-imperial-organization",
      kind: "case",
      label: "Tawantinsuyu imperial organization",
      description:
        "A bounded study of rule, labor, provisioning, and differentiated incorporation during Tawantinsuyu’s fifteenth-century expansion through the seizure of Cusco in 1533.",
      locationIds: ["andes-tawantinsuyu"],
      startDate: {
        year: 1438,
        certainty: "approximate",
        note: "A conventional marker for Pachakuti’s accession and expansion; chronology is disputed.",
      },
      endDate: {
        year: 1533,
        month: 11,
        certainty: "approximate",
        note: "Spanish forces seized Cusco in November 1533.",
      },
      scope:
        "Imperial institutions and their regional operation from the expansion associated with Pachakuti through the Spanish seizure of Cusco; excludes treating later colonial Andean communities, all Inka-descended peoples, or the Vilcabamba polity as the same institutional episode.",
      selectionRationale:
        "The case permits comparison of coercion, negotiation, reciprocity, labor, storage, and indirect rule without making Tawantinsuyu an avatar of a modern ideology.",
      conditionStatementIds: [
        "tawantinsuyu-name-boundary",
        "tawantinsuyu-chronology-boundary",
        "tawantinsuyu-chronicle-mediation",
        "tawantinsuyu-non-embodiment",
      ],
      episodeIds: [
        "tawantinsuyu-expansion-consolidation",
        "tawantinsuyu-succession-invasion",
      ],
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "tawantinsuyu-expansion-consolidation",
      kind: "case-episode",
      label: "Expansion and consolidation, c. 1438–1527",
      description:
        "Expansion and provincial consolidation before the succession crisis.",
      caseId: "tawantinsuyu-imperial-organization",
      locationIds: ["andes-tawantinsuyu"],
      startDate: {
        year: 1438,
        certainty: "approximate",
        note: "Conventional accession marker; exact chronology is disputed.",
      },
      endDate: {
        year: 1527,
        certainty: "approximate",
        note: "Approximate death year of Huayna Capac and onset of succession crisis.",
      },
      scope:
        "The expansionary imperial order before Huayna Capac’s death; dates are conventional and locally variable.",
      conditionStatementIds: ["tawantinsuyu-chronology-boundary"],
      formalRuleStatementIds: [
        "tawantinsuyu-ruler-kin-authority",
        "tawantinsuyu-provincial-indirect-rule",
        "tawantinsuyu-mita-labor",
      ],
      ruleInUseStatementIds: [
        "tawantinsuyu-warfare-incorporation",
        "tawantinsuyu-mitmaq-resettlement",
        "tawantinsuyu-road-labor",
      ],
      interactionStatementIds: [
        "tawantinsuyu-reciprocity-interpretation",
        "tawantinsuyu-extraction-rival",
      ],
      outcomeStatementIds: [
        "tawantinsuyu-storage-evidence",
        "tawantinsuyu-huanuco-material",
      ],
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "tawantinsuyu-succession-invasion",
      kind: "case-episode",
      label: "Succession war and invasion, c. 1527–1533",
      description:
        "The succession conflict, Spanish invasion, and seizure of Cusco that disrupted imperial rule.",
      caseId: "tawantinsuyu-imperial-organization",
      locationIds: ["andes-tawantinsuyu"],
      startDate: {
        year: 1527,
        certainty: "approximate",
        note: "Approximate onset of the succession crisis.",
      },
      endDate: {
        year: 1533,
        month: 11,
        certainty: "approximate",
        note: "Approximate month in which Spanish forces seized Cusco.",
      },
      scope:
        "The crisis following Huayna Capac’s death through the seizure of Cusco, not the end of Inka political action or Andean history.",
      conditionStatementIds: [
        "tawantinsuyu-ruler-kin-authority",
        "tawantinsuyu-chronology-boundary",
      ],
      formalRuleStatementIds: [],
      ruleInUseStatementIds: ["tawantinsuyu-warfare-incorporation"],
      interactionStatementIds: ["tawantinsuyu-provincial-indirect-rule"],
      outcomeStatementIds: ["tawantinsuyu-chronicle-mediation"],
      ...reviewed,
    },
  },
] satisfies AuthoringDocument[];
