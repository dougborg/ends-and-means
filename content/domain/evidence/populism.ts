import type { AuthoringDocument } from "../../../src/lib/domain";

const reviewed = { publicationStatus: "reviewed" as const };

type SourceType = "article" | "edition" | "report" | "archival-record";
type WorkType = "article" | "book" | "report" | "other";

const source = (
  id: string,
  title: string,
  contributors: string[],
  year: number,
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
      description: `The non-fiction work used to distinguish definitions and bounded uses of populism: ${title}.`,
      title,
      workType,
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
      description: `The consulted ${publisher} manifestation of ${title}.`,
      title,
      sourceType,
      workId: `${id}-work`,
      contributorDisplay: contributors,
      publicationYear: year,
      publisher,
      ...(identifiers ? { identifiers } : {}),
      resourceLinks: [{ purpose, url, label: "Open the consulted source" }],
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
    | "attributed-value"
    | "attributed-proposal"
    | "causal-hypothesis"
    | "classification"
    | "editorial-interpretation" = "observation",
): AuthoringDocument => ({
  documentType: "entity",
  entity: { id, kind: "statement", label, description: label, statementKind, text, ...reviewed },
});

const place = (id: string, label: string): AuthoringDocument => ({
  documentType: "entity",
  entity: {
    id,
    kind: "place",
    label,
    description: `${label}, the geographic boundary used for one selected populism case.`,
    placeType: "country",
    ...reviewed,
  },
});

const boundedCase = (
  id: string,
  episodeId: string,
  label: string,
  placeId: string,
  start: number,
  end: number,
  scope: string,
  rationale: string,
  conditionStatementIds: string[],
  formalRuleStatementIds: string[],
  interactionStatementIds: string[],
  outcomeStatementIds: string[],
): AuthoringDocument[] => [
  {
    documentType: "entity",
    entity: {
      id,
      kind: "case",
      label,
      description: scope,
      locationIds: [placeId],
      startDate: { year: start, certainty: "exact" },
      endDate: { year: end, certainty: "exact" },
      scope,
      selectionRationale: rationale,
      conditionStatementIds,
      episodeIds: [episodeId],
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: episodeId,
      kind: "case-episode",
      label,
      description: scope,
      caseId: id,
      locationIds: [placeId],
      startDate: { year: start, certainty: "exact" },
      endDate: { year: end, certainty: "exact" },
      scope,
      conditionStatementIds,
      formalRuleStatementIds,
      ruleInUseStatementIds: [],
      interactionStatementIds,
      outcomeStatementIds,
      ...reviewed,
    },
  },
];

export const populismEvidenceDocuments = [
  ...source("mudde-zeitgeist", "The Populist Zeitgeist", ["Cas Mudde"], 2004, "Government and Opposition", "https://www.cambridge.org/core/journals/government-and-opposition/article/populist-zeitgeist/2CD34F8B25C4FFF4F322316833DB94B7", "article", "article", { doi: "10.1111/j.1477-7053.2004.00135.x" }),
  ...source("weyland-contested", "Clarifying a Contested Concept: Populism in the Study of Latin American Politics", ["Kurt Weyland"], 2001, "Comparative Politics", "https://doi.org/10.2307/422412", "article", "article", { doi: "10.2307/422412" }),
  ...source("aslanidis-ideology", "Is Populism an Ideology? A Refutation and a New Perspective", ["Paris Aslanidis"], 2016, "Political Studies", "https://journals.sagepub.com/doi/10.1111/1467-9248.12224", "article", "article", { doi: "10.1111/1467-9248.12224" }),
  ...source("moffitt-global-rise", "The Global Rise of Populism", ["Benjamin Moffitt"], 2016, "Stanford University Press", "https://academic.oup.com/stanford-scholarship-online/book/30346", "book", "edition", { doi: "10.11126/stanford/9780804796132.001.0001", isbn13: "9780804796132" }),
  ...source("muller-populism", "What Is Populism?", ["Jan-Werner Müller"], 2016, "University of Pennsylvania Press", "https://www.pennpress.org/9780812248982/what-is-populism/", "book", "edition", { isbn13: "9780812248982" }),
  ...source("rovira-ambivalence", "The Ambivalence of Populism: Threat and Corrective for Democracy", ["Cristóbal Rovira Kaltwasser"], 2012, "Democratization", "https://www.tandfonline.com/doi/abs/10.1080/13510347.2011.572619", "article", "article", { doi: "10.1080/13510347.2011.572619" }),
  ...source("peoples-platforms-1896", "National Platforms of the People's and Other Parties", ["Union Pacific Railway Company"], 1896, "Library of Congress", "https://www.loc.gov/item/30000314/", "other", "archival-record", undefined, "archive"),
  ...source("omaha-congressional-record", "The Omaha Platform in the Congressional Record", ["United States Congress"], 1896, "Congress.gov", "https://www.congress.gov/54/crecb/1896/05/28/GPO-CRECB-1896-pt6-v28-18-1.pdf", "other", "archival-record", undefined, "archive"),
  ...source("argentina-constitution-1949", "Constitution of the Argentine Nation (1949)", ["Argentine Republic"], 1949, "Biblioteca del Congreso de la Nación", "https://digitales.bcn.gob.ar/textos-1/archivo-legislativo-1/constituciones-/constitucion-de-la-nacion-argentina--constitucion-1950/", "other", "edition", undefined, "authorized-reading"),
  {
    documentType: "entity",
    entity: {
      id: "peron-philosophy-address-work",
      kind: "work",
      label: "Exposición en el Acto de Clausura del primer Congreso Nacional de Filosofía",
      description: "Juan Domingo Perón's closing address to the National Congress of Philosophy in Mendoza on 9 April 1949.",
      title: "Exposición en el Acto de Clausura del primer Congreso Nacional de Filosofía",
      workType: "other",
      originalPublicationYear: 1949,
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "peron-philosophy-address-bcn-source",
      kind: "source",
      label: "Perón, 1949: Discursos, mensajes, correspondencia y escritos I",
      description: "The consulted 2016 Biblioteca del Congreso de la Nación collected edition containing the 9 April 1949 address, transcribed from Archivo General de la Nación audio and supplemented where noted from the 1950 congress proceedings.",
      title: "Perón, 1949: Discursos, mensajes, correspondencia y escritos I",
      sourceType: "edition",
      workId: "peron-philosophy-address-work",
      contributorDisplay: [
        "Juan Domingo Perón (speaker)",
        "Biblioteca del Congreso de la Nación, Subdirección de Estudios y Archivos Especiales (compilation, redaction, and general editorial supervision)",
        "Oscar Castellucci (collection director and preface co-author)",
        "Isela María Mo Amavet (preface co-author)",
      ],
      publicationYear: 2016,
      publisher: "Biblioteca del Congreso de la Nación",
      identifiers: { isbn13: "9789506910990" },
      resourceLinks: [
        {
          purpose: "authorized-reading",
          url: "https://cedinpe.unsam.edu.ar/sites/default/files/pdfs/peron-discursos_mensajes_1949_tomo1.pdf",
          label: "Open the consulted source",
        },
      ],
      ...reviewed,
    },
  },
  ...source("resnick-populist-strategies", "Populist Strategies in African Democracies", ["Danielle Resnick"], 2010, "UNU-WIDER", "https://www.econstor.eu/bitstream/10419/54155/1/63946453X.pdf", "report", "report", { isbn13: "9789292303525" }, "authorized-reading"),
  ...source("zambia-assembly-2007", "National Assembly Debates, 31 January 2007", ["National Assembly of Zambia"], 2007, "National Assembly of Zambia", "https://www.parliament.gov.zm/node/1924", "other", "archival-record", undefined, "archive"),
  ...source("thailand-policy-2001", "Policy of the Government of Prime Minister Thaksin Shinawatra", ["Thaksin Shinawatra", "Government of Thailand"], 2001, "Yale Program on Financial Stability", "https://elischolar.library.yale.edu/ypfs-documents/10190/", "other", "edition", undefined, "authorized-reading"),
  ...source("phongpaichit-baker-thaksin", "Thaksin's Populism", ["Pasuk Phongpaichit", "Chris Baker"], 2008, "Journal of Contemporary Asia", "https://www.tandfonline.com/doi/abs/10.1080/00472330701651960", "article", "article", { doi: "10.1080/00472330701651960" }),

  {
    documentType: "entity",
    entity: {
      id: "populism",
      kind: "concept",
      label: "Populism",
      description: "A disputed category for appeals that construct a morally privileged people against an elite, analyzed variously as ideology, discourse, style, or political strategy.",
      schemeIds: ["political-economic-ideas"],
      scopeNote: "The label does not follow from popularity, redistribution, charisma, nationalism, anti-establishment criticism, or democratic backsliding alone.",
      ...reviewed,
    },
  },

  claim("populism-contested-category", "Populism is a contested category", "Researchers disagree whether populism is best treated as an ideology, discourse, political style, or strategy; these are rival analytical definitions rather than interchangeable names.", "definition"),
  claim("populism-people-elite-core", "People and elite claims form a recurring core", "Across several influential definitions, populist politics constructs a morally charged opposition between 'the people' and an 'elite,' although the content of both groups varies.", "definition"),
  claim("mudde-thin-ideology", "Mudde defines a thin-centered ideology", "Mudde defines populism as a thin-centered ideology that opposes a pure people to a corrupt elite and claims politics should express the people's general will.", "classification"),
  claim("weyland-strategy-definition", "Weyland defines a political strategy", "Weyland defines populism as a strategy through which a personalistic leader seeks or exercises governmental power through direct, unmediated support from largely unorganized followers.", "classification"),
  claim("aslanidis-discourse-definition", "Aslanidis defines a discursive frame", "Aslanidis argues that populism is better analyzed as a discursive frame than as a thin ideology.", "classification"),
  claim("moffitt-style-definition", "Moffitt defines a political style", "Moffitt defines populism as a performed political style combining people-versus-elite appeals, staged crisis or threat, and norm-breaking manners.", "classification"),
  claim("muller-antipluralism", "Müller emphasizes anti-pluralism", "Müller argues that a distinctively populist claim is not merely anti-elitism but the moral assertion that the claimant alone represents the real people.", "classification"),
  claim("populism-label-provenance", "Every populism label needs provenance", "A classification should identify who applied the label, which definition and evidence they used, and the person, organization, speech, period, or practice placed within its scope.", "editorial-interpretation"),
  claim("popularity-insufficient", "Popularity is insufficient", "Electoral popularity or a mass following does not by itself establish any researched definition of populism.", "editorial-interpretation"),
  claim("redistribution-insufficient", "Redistribution is insufficient", "A redistributive policy does not by itself establish populism because similar policies can be justified and administered without a people-versus-elite claim.", "editorial-interpretation"),
  claim("anti-elitism-antipluralism-distinct", "Anti-elitism and anti-pluralism are distinct", "Criticism of elites does not by itself establish the exclusive-representation claim that Müller identifies as anti-pluralist.", "editorial-interpretation"),
  claim("host-ideology-boundary", "Populism does not transmit a host ideology", "Under thin-ideology and discourse approaches, populist claims may join nationalism, socialism, conservatism, or other projects without inheriting their institutions or aims.", "editorial-interpretation"),
  claim("democratic-ambivalence", "Populism has democratic ambivalence", "Rovira Kaltwasser argues that populism can raise neglected demands while also threatening pluralism and liberal-democratic restraints; neither effect follows from the label alone.", "causal-hypothesis"),
  claim("people-is-constructed", "The people is constructed differently", "Populist appeals may construct the people through citizenship, class, nation, ethnicity, productive work, place, or another boundary, so inclusion and exclusion require case-specific evidence.", "editorial-interpretation"),

  claim("omaha-corruption-claim", "The Omaha Platform opposed people to concentrated power", "The 1892 Omaha Platform claimed that political institutions were corrupted and wealth was concentrated while presenting producing people as dispossessed by financial and corporate power."),
  claim("omaha-institutional-demands", "The People's Party proposed institutional changes", "The Omaha Platform demanded public control of railroads and communications, a national currency, graduated income taxation, and measures intended to secure a free ballot.", "attributed-proposal"),
  claim("peoples-party-fusion-boundary", "The 1896 platform records strategic change", "The People's Party's 1896 platform reaffirmed its 1892 principles while supporting electoral cooperation around William Jennings Bryan, showing that movement claims and party strategy changed within the case period.", "observation"),
  claim("peoples-party-case-limit", "The People's Party is one agrarian formation", "The selected national platforms establish party claims and proposals, not a universal definition of populism or the experience of every farmer, worker, Black organizer, or woman in the movement.", "editorial-interpretation"),

  claim("peron-social-justice-constitution", "The 1949 constitution enacted social rights", "Argentina's 1949 Constitution declared social justice, economic freedom, and political sovereignty and incorporated workers' and social rights into the constitutional text.", "observation"),
  claim("peron-organized-community", "Perón proposed an organized community", "In the text associated with his 9 April 1949 address to the National Congress of Philosophy, Perón rejected both unconstrained individualism and materialist collectivism and proposed a community in which individual freedom and responsibility serve a shared good.", "attributed-proposal"),
  claim("peronism-self-description-boundary", "Justicialism was a self-description", "In his 9 April 1949 address, Perón called the national movement Justicialism and presented it as a doctrine and program already being realized; treating that actor self-description as equivalent to a later scholarly populism classification would collapse two different categories.", "editorial-interpretation"),
  claim("peron-case-limit", "First-government evidence does not define all Peronism", "The 1943–1955 formation and first Perón governments do not establish the meaning or institutional practice of every later Peronist organization or government.", "editorial-interpretation"),

  claim("sata-urban-poor-strategy", "Resnick classifies Sata's mobilization strategy", "Resnick classifies Michael Sata's 2006 campaign as a populist strategy that combined anti-elite appeals to urban poor voters with other appeals intended to build a wider electoral coalition.", "classification"),
  claim("sata-china-rhetoric", "Sata attacked foreign investors and incumbents", "Resnick reports that Sata linked incumbent elites and Chinese investors to poor labor conditions and exclusion during the 2006 campaign.", "observation"),
  claim("zambia-opposition-institution", "The Patriotic Front remained an opposition party", "National Assembly debate in January 2007 records the Patriotic Front's opposition-party bargaining and public dispute over an opposition memorandum, rather than government rule by Sata in the selected period.", "observation"),
  claim("zambia-case-limit", "The Zambia case tests a strategy definition", "The 2001–2008 Patriotic Front case supports a bounded strategy classification; it does not make urban poverty, anti-Chinese rhetoric, or personal leadership sufficient definitions of populism.", "editorial-interpretation"),

  claim("thai-policy-program", "The 2001 Thai government announced a policy program", "Thaksin's 2001 government policy statement included a village and urban revolving fund, farmers' debt relief, and universal health-care measures as parts of a wider governing program.", "attributed-proposal"),
  claim("thaksin-classification-developed", "Phongpaichit and Baker classify a developing populism", "Phongpaichit and Baker argue that Thaksin was not populist on taking office in 2001 but adopted populist rhetoric and personalized authority in stages through 2006.", "classification"),
  claim("prachaniyom-translation-boundary", "Prachaniyom requires contextual translation", "Thai political use of ประชานิยม (prachaniyom) cannot be treated as an exact, context-free equivalent of every English-language definition of populism.", "editorial-interpretation"),
  claim("thailand-case-limit", "Policy outputs do not settle classification", "The selected policy statement establishes proposed measures, while the later scholarly classification turns on rhetoric and representation as well as redistribution; the program alone does not prove populism.", "editorial-interpretation"),

  place("united-states-populism-case", "United States"),
  place("argentina-populism-case", "Argentina"),
  place("zambia-populism-case", "Zambia"),
  place("thailand-populism-case", "Thailand"),
  ...boundedCase("us-peoples-party-1890-1896", "us-peoples-party-platform-episode", "United States People's Party, 1890–1896", "united-states-populism-case", 1890, 1896, "The national People's Party's claims, platforms, and electoral strategy from organization through the 1896 campaign; not American agrarian politics generally.", "The named Populist Party supplies a historical agrarian movement whose self-description and proposals can be separated from later scholarly uses of populism.", ["omaha-corruption-claim"], [], ["omaha-institutional-demands", "peoples-party-fusion-boundary"], []),
  ...boundedCase("peronist-formation-1943-1955", "first-peron-governments-episode", "Peronist formation and first governments, 1943–1955", "argentina-populism-case", 1943, 1955, "The formation around Juan and Eva Perón and Argentina's first Perón governments through the 1955 overthrow; not later Peronism.", "The case separates Peronist self-description, constitutional design, and external classification within one bounded Latin American formation.", ["peronism-self-description-boundary"], ["peron-social-justice-constitution"], ["peron-organized-community"], []),
  ...boundedCase("zambia-pf-opposition-2001-2008", "zambia-pf-2006-campaign-episode", "Patriotic Front opposition under Michael Sata, 2001–2008", "zambia-populism-case", 2001, 2008, "The Patriotic Front as an opposition party, centered on the 2006 Zambian election and immediate aftermath; not its government after 2011.", "The case tests a strategy definition outside Europe and the Americas while separating opposition mobilization from later government performance.", ["zambia-opposition-institution"], [], ["sata-urban-poor-strategy", "sata-china-rhetoric"], []),
  ...boundedCase("thai-rak-thai-government-2001-2006", "thaksin-first-governments-episode", "Thai Rak Thai government under Thaksin, 2001–2006", "thailand-populism-case", 2001, 2006, "Thai Rak Thai's elected governments from the 2001 policy statement to the 2006 coup; not every later use of Thaksin-aligned politics or prachaniyom.", "The case distinguishes a policy program from an attributed political-style classification and preserves Thai-language mediation.", ["prachaniyom-translation-boundary"], [], ["thai-policy-program", "thaksin-classification-developed"], []),
] satisfies AuthoringDocument[];
