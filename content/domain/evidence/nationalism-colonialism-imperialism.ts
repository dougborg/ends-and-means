import type { AuthoringDocument } from "../../../src/lib/domain";

const reviewed = {
  publicationStatus: "reviewed" as const,
  reviewedAt: "2026-09-06",
};
const refs = (article: string, qid: string) => [
  {
    system: "wikipedia" as const,
    url: `https://en.wikipedia.org/wiki/${article.replaceAll(" ", "_")}`,
    purpose: "orientation" as const,
    language: "en",
    checkedAt: "2026-09-06",
  },
  {
    system: "wikidata" as const,
    id: qid,
    url: `https://www.wikidata.org/wiki/${qid}`,
    purpose: "identity" as const,
    match: "exact" as const,
    checkedAt: "2026-09-06",
  },
];

const sourceData = [
  [
    "sep-nationalism",
    "Nationalism",
    ["David Miller"],
    "Stanford Encyclopedia of Philosophy",
    "web-page",
    "https://plato.stanford.edu/entries/nationalism/",
    2025,
    "A contemporary philosophical synthesis of nationality, national identity, and self-determination.",
  ],
  [
    "anderson-imagined",
    "Imagined Communities",
    ["Benedict Anderson"],
    "Verso",
    "web-page",
    "https://www.versobooks.com/blogs/news/2394-in-memory-of-benedict-anderson-an-extract-from-imagined-communities",
    2015,
    "The publisher-hosted introduction to Anderson's historical interpretation of nations as imagined political communities.",
  ],
  [
    "chatterjee-nationalist-thought",
    "Nationalist Thought and the Colonial World",
    ["Partha Chatterjee"],
    "University of Minnesota Press",
    "web-page",
    "https://www.upress.umn.edu/9780816623112/nationalist-thought-and-the-colonial-world/",
    1993,
    "The publisher record and synopsis for Chatterjee's critique of derivative and state-centered accounts of anticolonial nationalism.",
  ],
  [
    "tagore-nationalism",
    "Nationalism",
    ["Rabindranath Tagore"],
    "Macmillan",
    "edition",
    "https://archive.org/details/nationalism00tago",
    1917,
    "A digitized English-language edition of Tagore's near-contemporary criticism of nationalism in Japan, the West, and India.",
  ],
  [
    "sep-colonialism",
    "Colonialism",
    ["Margaret Kohn", "Kavita Reddy"],
    "Stanford Encyclopedia of Philosophy",
    "web-page",
    "https://plato.stanford.edu/archives/spr2018/entries/colonialism/",
    2017,
    "A fixed reference synthesis distinguishing colonialism, imperialism, postcolonial theory, and Indigenous critiques.",
  ],
  [
    "cooper-colonialism-question",
    "Colonialism in Question",
    ["Frederick Cooper"],
    "University of California Press",
    "web-page",
    "https://www.ucpress.edu/books/colonialism-in-question/pdf",
    2005,
    "A historian's argument for bounded analysis of colonial processes and political possibilities rather than category inflation.",
  ],
  [
    "cesaire-discourse",
    "Discourse on Colonialism",
    ["Aimé Césaire", "Joan Pinkham"],
    "Monthly Review Press",
    "edition",
    "https://sahistory.org.za/archive/discourse-colonialism",
    2001,
    "South African History Online's authorized English edition; Pinkham translated Césaire's anticolonial argument from French.",
  ],
  [
    "silva-aloha-betrayed",
    "Aloha Betrayed",
    ["Noenoe K. Silva"],
    "Duke University Press",
    "web-page",
    "https://www.dukeupress.edu/aloha-betrayed",
    2004,
    "A Native Hawaiian scholar's Hawaiian-language-archive-centered history of resistance to American colonialism.",
  ],
  [
    "hawaii-kue-petitions",
    "Petition Against the Annexation of Hawaii",
    ["Hui Aloha ʻĀina"],
    "U.S. National Archives and Records Administration",
    "archival-record",
    "https://www.archives.gov/education/lessons/hawaii-petition",
    1897,
    "A bilingual Hawaiian-and-English petition and archival description; the petition preserves named Kanaka Maoli opposition, mediated here through a U.S. repository.",
  ],
  [
    "silva-1897-petitions",
    "The 1897 Petitions Protesting Annexation",
    ["Noenoe K. Silva"],
    "University of Hawaiʻi at Mānoa Library, Hawaiian Collection",
    "web-page",
    "https://libweb.hawaii.edu/digicoll/annexation/petition/pet-intro.php",
    1998,
    "Silva's Hawaiian Collection introduction recounting the anti-annexation coalition, Hawaiian political language, and the petitions' recovery.",
  ],
  [
    "bandung-communique",
    "Final Communiqué of the Asian-African Conference",
    ["Asian-African Conference"],
    "United Nations Digital Library",
    "report",
    "https://digitallibrary.un.org/record/860963/files/1955-E.pdf",
    1955,
    "The English conference communiqué adopted at Bandung; participating delegations used several working languages and this manifestation is the UN English reproduction.",
  ],
  [
    "un-resolution-1514",
    "Declaration on the Granting of Independence to Colonial Countries and Peoples",
    ["United Nations General Assembly"],
    "United Nations Digital Library",
    "legal-text",
    "https://digitallibrary.un.org/record/662085/files/A_RES_1514(XV)-EN.pdf",
    1960,
    "The official English text of General Assembly resolution 1514 (XV).",
  ],
  [
    "getachew-worldmaking",
    "Worldmaking after Empire",
    ["Adom Getachew"],
    "Princeton University Press",
    "web-page",
    "https://academic.oup.com/princeton-scholarship-online/book/14344",
    2019,
    "A history of Black Atlantic anticolonial projects for international institutions beyond simple nation-state succession.",
  ],
  [
    "nkrumah-neocolonialism",
    "Neo-Colonialism: The Last Stage of Imperialism",
    ["Kwame Nkrumah"],
    "Thomas Nelson & Sons",
    "edition",
    "https://www.marxists.org/subject/africa/nkrumah/neo-colonialism/index.htm",
    1965,
    "A transcribed edition, credited to Dominic Tweedie, of Nkrumah's attributed theory of formally sovereign states constrained through external economic power.",
  ],
  [
    "ghana-independence-act",
    "Ghana Independence Act 1957",
    ["Parliament of the United Kingdom"],
    "The National Archives",
    "legal-text",
    "https://www.legislation.gov.uk/ukpga/Eliz2/5-6/6/enacted",
    1957,
    "The enacted UK statute providing for the Gold Coast's attainment of fully responsible status within the Commonwealth.",
  ],
] as const;

function workType(type: string) {
  return type === "legal-text"
    ? ("law" as const)
    : type === "report"
      ? ("report" as const)
      : type === "edition"
        ? ("book" as const)
        : ("other" as const);
}
const originalPublicationYears: Partial<Record<string, number>> = {
  "anderson-imagined": 1983,
  "cesaire-discourse": 1950,
  "chatterjee-nationalist-thought": 1986,
};
const sourceIdentifiers: Partial<
  Record<string, { doi?: string; isbn13?: string }>
> = {
  "cesaire-discourse": { isbn13: "9781583670255" },
};
const bookWorkIds = new Set([
  "anderson-imagined",
  "chatterjee-nationalist-thought",
  "cooper-colonialism-question",
  "getachew-worldmaking",
  "silva-aloha-betrayed",
]);
const webManifestationTitles: Partial<Record<string, string>> = {
  "anderson-imagined": "Publisher excerpt from Imagined Communities",
  "chatterjee-nationalist-thought":
    "Publisher description of Nationalist Thought and the Colonial World",
  "cooper-colonialism-question":
    "Publisher description of Colonialism in Question",
  "getachew-worldmaking": "Publisher abstract for Worldmaking after Empire",
  "silva-aloha-betrayed": "Publisher description of Aloha Betrayed",
};
const webManifestationDescriptions: Partial<Record<string, string>> = {
  "anderson-imagined":
    "A Verso-hosted excerpt from the introduction to the 2006 edition; it is not the complete book.",
  "chatterjee-nationalist-thought":
    "The University of Minnesota Press description and contents for its 1993 edition; it is not the book text.",
  "cooper-colonialism-question":
    "The University of California Press description and contents for the book; it is not the book text.",
  "getachew-worldmaking":
    "The Oxford Academic publisher record, book abstract, and contents; chapter text was not consulted.",
  "silva-aloha-betrayed":
    "The Duke University Press description and contents for the book; it is not the book text.",
};
const sources = sourceData.flatMap(
  ([
    id,
    title,
    contributors,
    publisher,
    sourceType,
    url,
    year,
    description,
  ]) => [
    {
      documentType: "entity" as const,
      entity: {
        id: `${id}-work`,
        kind: "work" as const,
        label: title,
        description,
        title,
        workType: bookWorkIds.has(id) ? "book" : workType(sourceType),
        originalPublicationYear: originalPublicationYears[id] ?? year,
        ...reviewed,
      },
    },
    {
      documentType: "entity" as const,
      entity: {
        id: `${id}-source`,
        kind: "source" as const,
        label: webManifestationTitles[id] ?? title,
        description: webManifestationDescriptions[id] ?? description,
        title: webManifestationTitles[id] ?? title,
        sourceType,
        workId: `${id}-work`,
        contributorDisplay: [...contributors],
        publisher,
        ...(id === "anderson-imagined"
          ? { publicationYear: 2015 }
          : sourceType === "web-page"
            ? {}
            : { publicationYear: year }),
        ...(sourceIdentifiers[id]
          ? { identifiers: sourceIdentifiers[id] }
          : {}),
        resourceLinks: [
          {
            purpose:
              id === "silva-1897-petitions"
                ? ("authorized-reading" as const)
                : sourceType === "web-page"
                  ? ("publisher" as const)
                  : ("authorized-reading" as const),
            url,
            label: "Open the source",
          },
        ],
        ...reviewed,
      },
    },
  ],
);

const statements = [
  [
    "nationalism-attitude-program-boundary",
    "Nationalism can name attachments or action",
    "Nationalism can name concern for national identity or action seeking national self-determination; neither usage by itself identifies a state, party, movement, or institutional practice.",
    "definition",
  ],
  [
    "nation-state-boundary",
    "Nations and states are not synonyms",
    "A nation is a claimed community of belonging while a state is a political and legal organization; a nation may lack a state and one state may contain several national claims.",
    "definition",
  ],
  [
    "self-determination-statehood-boundary",
    "Self-determination need not mean full statehood",
    "National self-determination can be claimed through statehood, autonomy, federation, or other authority arrangements, and formal sovereignty does not establish effective control.",
    "definition",
  ],
  [
    "anderson-imagined-community",
    "Anderson defines nations through social imagination",
    "Anderson defines a nation as an imagined political community understood as limited and sovereign, without treating imagination as falsity.",
    "definition",
  ],
  [
    "anderson-horizontal-inequality",
    "Asserted fraternity can coexist with inequality",
    "Anderson argues that nations are imagined as horizontal comradeship even where inequality and exploitation persist.",
    "editorial-interpretation",
  ],
  [
    "chatterjee-derivative-dispute",
    "Chatterjee disputes universal nationalist scripts",
    "Chatterjee argues that anticolonial nationalism challenged European domination while remaining constrained by post-Enlightenment categories it sought to reject.",
    "editorial-interpretation",
  ],
  [
    "chatterjee-state-unity-limit",
    "State nationalism can appropriate national life",
    "Chatterjee argues that ruling classes can convert anticolonial nationalism into a state ideology whose asserted unity does not subsume the whole life of a nation.",
    "editorial-interpretation",
  ],
  [
    "tagore-nation-society-rival",
    "Tagore distinguishes political nation from society",
    "Tagore's 1917 lectures criticize the organized political and commercial power he calls the Nation and distinguish it from society and living social relations.",
    "editorial-interpretation",
  ],
  [
    "nationalism-self-description-limit",
    "A nationalist label does not prove practice",
    "Self-description as national or nationalist establishes an attributed identity or program, not who was included, which institutions operated, or how authority was exercised.",
    "editorial-interpretation",
  ],
  [
    "national-unity-exclusion-boundary",
    "National unity does not establish inclusion",
    "An assertion of national unity cannot establish equal membership across race, caste, class, gender, religion, language, region, citizenship, or Indigenous status.",
    "editorial-interpretation",
  ],

  [
    "colonialism-domination-definition",
    "Colonialism involves domination",
    "Kohn and Reddy define colonialism as a practice in which one people subjugates another, while warning that its boundary with imperialism is disputed.",
    "definition",
  ],
  [
    "colonization-colonialism-boundary",
    "Colonization and colonialism are not interchangeable",
    "Population movement or settlement can occur without the full relation called colonialism, while colonial domination can operate through administration, extraction, labor coercion, or local intermediaries without mass settlement.",
    "definition",
  ],
  [
    "colonial-arrangements-plural",
    "Colonialism and imperialism have disputed institutional boundaries",
    "Kohn and Reddy distinguish colonization through settlement and political control from imperial command that can also operate indirectly, while noting that the concepts' boundary is disputed.",
    "definition",
  ],
  [
    "colonial-formal-practice-boundary",
    "Colonial mobilization could reconfigure political concepts",
    "Cooper's publisher summary attributes to the book an account of citizenship and equality being reconfigured through political mobilizations in colonial contexts.",
    "editorial-interpretation",
  ],
  [
    "colonial-archive-mediation",
    "Silva centers Hawaiian-language resistance records",
    "Duke University Press describes Silva's study as recovering Kanaka Maoli resistance through Hawaiian-language newspapers and the petitions against annexation.",
    "editorial-interpretation",
  ],
  [
    "cesaire-colonization-civilization-rival",
    "Césaire rejects a civilizing equation",
    "Césaire rejects the claim that colonization equals civilization and instead presents colonial contact as domination organized around force and extraction.",
    "editorial-interpretation",
  ],
  [
    "cooper-category-boundary",
    "Cooper favors bounded colonial processes",
    "Cooper warns that treating colonialism as an all-purpose explanatory category can obscure the specific institutions, struggles, and political alternatives operating in a place and period.",
    "editorial-interpretation",
  ],
  [
    "decolonization-independence-boundary",
    "Racialized sovereign inequality prompted institutional alternatives",
    "Getachew argues that Black Atlantic thinkers responded to racialized sovereign inequality by proposing alternatives including self-determination through the United Nations and regional federations.",
    "editorial-interpretation",
  ],
  [
    "kaulia-lahui-annexation-refusal",
    "Kaulia spoke for lāhui opposition to annexation",
    "Silva reports that in 1897 Hui Aloha ʻĀina president James Keauiluna Kaulia called the opposing public ka lāhui and said it would never consent to annexation while the last aloha ʻāina lived.",
    "attributed-value",
  ],
  [
    "silva-continuing-sovereignty-claim",
    "Silva asserts continuing Kanaka Maoli sovereignty",
    "Writing in 1998, Silva states that Kānaka Maoli had never relinquished national sovereignty and continued seeking recognition and defending rights to land, waters, language, and cultural traditions.",
    "attributed-value",
  ],
  [
    "colonial-modernization-boundary",
    "Colonial rule is not a modernization stage",
    "Colonial rule cannot be inferred to be a universal stage between an earlier society and a modern nation-state, and infrastructure or administrative change does not prove a civilizing purpose or effect.",
    "editorial-interpretation",
  ],

  [
    "imperialism-power-extension-definition",
    "Imperialism concerns extended power",
    "Imperialism can name projects, practices, relations, or theories of extending political or economic power beyond an existing center through formal or indirect mechanisms.",
    "definition",
  ],
  [
    "empire-imperialism-boundary",
    "Empire and imperialism are not synonyms",
    "An empire is a historically bounded political formation; imperialism is an attributed project, practice, relation, or explanatory theory and cannot be inferred from a polity's name alone.",
    "definition",
  ],
  [
    "imperial-mechanisms-plural",
    "Nkrumah identifies several neo-colonial mechanisms",
    "Nkrumah identifies retained military bases, land and mineral concessions, customs and administrative privileges, currency control, tax exemptions, and tied aid as mechanisms that can constrain sovereignty.",
    "causal-hypothesis",
  ],
  [
    "formal-informal-empire-boundary",
    "Formal sovereignty does not settle external control",
    "Formal sovereignty distinguishes legal status but neither proves effective self-determination nor by itself demonstrates informal empire.",
    "editorial-interpretation",
  ],
  [
    "nkrumah-neocolonial-definition",
    "Nkrumah defines neo-colonial constraint",
    "Nkrumah argues that a formally independent state's economic system and policy can be directed from outside; this is an attributed causal theory requiring evidence of the mechanism in each case.",
    "causal-hypothesis",
  ],
  [
    "sep-indirect-imperial-boundary",
    "Imperialism may exceed settlement",
    "Kohn and Reddy distinguish imperialism by its focus on command exercised through settlement, sovereignty, or indirect control, rather than making population transfer necessary.",
    "definition",
  ],
  [
    "imperial-cultural-project-boundary",
    "Cultural projects require a power mechanism",
    "A cultural influence or civilizing claim is not by itself proof of imperialism; analysis must identify actors, authority, material leverage, scope, and effects.",
    "editorial-interpretation",
  ],
  [
    "capitalist-imperialism-rival-boundary",
    "Capitalist theories do not exhaust imperialism",
    "Theories tying imperial expansion to capitalist accumulation compete with geopolitical, strategic, cultural, and state-centered explanations and must remain attributed rather than inherited from capitalism.",
    "editorial-interpretation",
  ],
  [
    "imperial-allegation-proof-boundary",
    "Nkrumah's mechanisms are an attributed diagnosis",
    "Nkrumah presents specific retained privileges as mechanisms of neo-colonialism; applying that diagnosis to another relationship requires evidence that the claimed privilege operated there.",
    "editorial-interpretation",
  ],
  [
    "imperial-country-essence-boundary",
    "Cooper rejects an inevitable empire-to-nation sequence",
    "The publisher summary of Cooper's book rejects portraying the past two centuries as an inevitable movement from empire to nation-state and instead notes wider imperial and diasporic political imaginations.",
    "editorial-interpretation",
  ],

  [
    "hawaii-petition-scale",
    "Hawaiian petitions documented mass opposition",
    "Hui Aloha ʻĀina's bilingual 1897 petition against annexation carried 21,269 Native Hawaiian signatures collected across five principal islands.",
    "observation",
  ],
  [
    "hawaii-petition-language-provenance",
    "The petition preserves Hawaiian-language political action",
    "The petition presented Hawaiian and English texts; the National Archives repository supplies access but does not replace the named Hawaiian organization and signatories as the political actors.",
    "observation",
  ],
  [
    "hawaii-annexation-sequence",
    "Annexation followed treaty defeat",
    "The 1897 annexation treaty failed to secure Senate support after organized opposition, while Congress enacted annexation through the Newlands joint resolution in July 1898.",
    "observation",
  ],
  [
    "hawaii-case-boundary",
    "Three Hawaiian organizations formed an anti-annexation coalition",
    "Silva reports that Hui Aloha ʻĀina for Women, Hui Aloha ʻĀina for Men, and Hui Kālaiʻāina formed a coalition opposing the 1897 treaty and together represented a majority of Kānaka Maoli.",
    "observation",
  ],
  [
    "bandung-participation",
    "Twenty-nine governments met at Bandung",
    "Delegations from twenty-nine Asian and African governments met at Bandung from 18 through 24 April 1955.",
    "observation",
  ],
  [
    "bandung-anticolonial-principles",
    "Bandung condemned colonialism while affirming sovereignty",
    "The Final Communiqué declared colonialism in all its manifestations an evil and paired self-determination with sovereignty, territorial integrity, non-intervention, and equality among nations.",
    "attributed-value",
  ],
  [
    "bandung-worldmaking-boundary",
    "Anticolonial nationalists pursued worldmaking projects",
    "Getachew argues that selected Black Atlantic anticolonial nationalists sought to remake international order rather than act solely as nation-builders.",
    "editorial-interpretation",
  ],
  [
    "ghana-legal-independence",
    "The Ghana Independence Act changed formal status",
    "The Ghana Independence Act provided that from 6 March 1957 the Gold Coast would form part of Her Majesty's dominions under the name Ghana and that UK governmental responsibility would cease.",
    "observation",
  ],
  [
    "ghana-worldmaking-project",
    "Getachew places Nkrumah within anticolonial worldmaking",
    "Getachew includes Nkrumah among Black Atlantic anticolonial thinkers and identifies regional African federations among their projects for transforming international order.",
    "editorial-interpretation",
  ],
  [
    "ghana-neocolonial-limit",
    "Ghanaian independence cannot prove economic autonomy",
    "The 1957 legal transition establishes a change in constitutional responsibility, not whether later property, finance, trade, or military relationships satisfied Nkrumah's neo-colonial diagnosis.",
    "editorial-interpretation",
  ],
  [
    "un-1514-self-determination",
    "Resolution 1514 linked self-determination and independence",
    "UN General Assembly resolution 1514 declared that all peoples have a right to self-determination and called for transfer of powers to peoples of trust and non-self-governing territories.",
    "attributed-value",
  ],
  [
    "decolonization-sequence-limit",
    "Anticolonial projects exceeded nation-state succession",
    "Getachew argues that accounts of decolonization as an inevitable transition from empires to nation-states obscure Black Atlantic projects for regional federation and transformed international institutions.",
    "editorial-interpretation",
  ],
] as const;

const statementDocs = statements.map(([id, label, text, statementKind]) => ({
  documentType: "entity" as const,
  entity: {
    id,
    kind: "statement" as const,
    label,
    description: label,
    text,
    statementKind,
    ...reviewed,
  },
}));

const concepts = [
  [
    "nationalism",
    "Nationalism",
    "Claims, attachments, programs, and movements concerning nations, belonging, political authority, or self-determination.",
    "Use for a contested concept, not a synonym for nation, state, patriotism, citizenship, ethnicity, or any government's practice.",
    "Nationalism",
    "Q6235",
  ],
  [
    "colonialism",
    "Colonialism",
    "Durable arrangements through which one people or political authority dominates another territory or population.",
    "Specify conquest, settlement, land, labor, extraction, administration, classification, and locally mediated practice; do not infer a universal stage.",
    "Colonialism",
    "Q7167",
  ],
  [
    "imperialism",
    "Imperialism",
    "Projects, practices, relations, and theories concerning power extended beyond an existing political center.",
    "Specify the mechanism and period; do not equate every empire, influence, external inequality, or polemical accusation with demonstrated imperial practice.",
    "Imperialism",
    "Q7260",
  ],
] as const;

const entities: AuthoringDocument[] = concepts.map(
  ([id, label, description, scopeNote, article, qid]) => ({
    documentType: "entity",
    entity: {
      id,
      kind: "concept",
      label,
      description,
      schemeIds: ["political-economic-ideas"],
      scopeNote,
      externalRefs: refs(article, qid),
      ...reviewed,
    },
  }),
) as AuthoringDocument[];

const places = [
  [
    "hawaiian-kingdom-islands",
    "Hawaiian Islands",
    "The Hawaiian Kingdom islands in the overthrow-and-annexation episode.",
    "region",
    "Hawaiian Islands",
    "Q192626",
  ],
  [
    "bandung-indonesia",
    "Bandung",
    "Bandung, Indonesia, the conference location.",
    "city",
    "Bandung",
    "Q10389",
  ],
  [
    "ghana-1957",
    "Ghana",
    "The Gold Coast/Ghana jurisdiction in the 1957 constitutional transition.",
    "country",
    "Ghana",
    "Q117",
  ],
] as const;
entities.push(
  ...(places.map(([id, label, description, placeType, article, qid]) => ({
    documentType: "entity" as const,
    entity: {
      id,
      kind: "place" as const,
      label,
      description,
      placeType,
      externalRefs: refs(article, qid),
      ...reviewed,
    },
  })) as AuthoringDocument[]),
);

const caseDocs: AuthoringDocument[] = [
  {
    documentType: "entity",
    entity: {
      id: "hawaiian-overthrow-annexation-1893-1898",
      kind: "case",
      label: "Hawaiian overthrow and annexation, 1893–1898",
      description:
        "A bounded episode of overthrow, organized Hawaiian resistance, treaty defeat, and U.S. annexation.",
      locationIds: ["hawaiian-kingdom-islands"],
      startDate: { year: 1893, certainty: "exact" },
      endDate: { year: 1898, certainty: "exact" },
      scope:
        "The overthrow through annexation, centered on documented political acts; not all Hawaiian history or present sovereignty claims.",
      selectionRationale:
        "The case tests how Indigenous, national, anticolonial, and imperial claims overlap without merging identities.",
      conditionStatementIds: [],
      episodeIds: ["hawaiian-annexation-resistance-episode"],
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "hawaiian-annexation-resistance-episode",
      kind: "case-episode",
      label: "Hawaiian resistance to annexation, 1897–1898",
      description:
        "The petition campaign, treaty defeat, and later joint-resolution annexation.",
      caseId: "hawaiian-overthrow-annexation-1893-1898",
      locationIds: ["hawaiian-kingdom-islands"],
      startDate: { year: 1897, certainty: "exact" },
      endDate: { year: 1898, month: 7, day: 7, certainty: "exact" },
      scope:
        "The documented petition and U.S. annexation sequence; no inference that signatories shared every political aim.",
      conditionStatementIds: [],
      formalRuleStatementIds: [],
      ruleInUseStatementIds: [
        "hawaii-petition-scale",
        "hawaii-petition-language-provenance",
      ],
      interactionStatementIds: ["hawaii-annexation-sequence"],
      outcomeStatementIds: [],
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "bandung-conference-1955",
      kind: "case",
      label: "Asian-African Conference at Bandung, 1955",
      description:
        "A bounded conference where twenty-nine governments articulated shared anticolonial and international-order principles.",
      locationIds: ["bandung-indonesia"],
      startDate: { year: 1955, month: 4, day: 18, certainty: "exact" },
      endDate: { year: 1955, month: 4, day: 24, certainty: "exact" },
      scope:
        "The conference and final communiqué, not later nonalignment or every participating population's view.",
      selectionRationale:
        "The conference tests anticolonial worldmaking beyond a simple transition to isolated nation-states.",
      conditionStatementIds: [],
      episodeIds: ["bandung-communique-episode"],
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "bandung-communique-episode",
      kind: "case-episode",
      label: "Bandung deliberation and communiqué",
      description: "The April 1955 conference interval and adopted communiqué.",
      caseId: "bandung-conference-1955",
      locationIds: ["bandung-indonesia"],
      startDate: { year: 1955, month: 4, day: 18, certainty: "exact" },
      endDate: { year: 1955, month: 4, day: 24, certainty: "exact" },
      scope:
        "Attributed positions in the final communiqué; not proof of uniform implementation by participating governments.",
      conditionStatementIds: ["bandung-participation"],
      formalRuleStatementIds: [],
      ruleInUseStatementIds: [],
      interactionStatementIds: [],
      outcomeStatementIds: ["bandung-anticolonial-principles"],
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "ghana-independence-1957",
      kind: "case",
      label: "Ghanaian legal independence, 6 March 1957",
      description:
        "The bounded statutory transition in constitutional responsibility on 6 March 1957.",
      locationIds: ["ghana-1957"],
      startDate: { year: 1957, month: 3, day: 6, certainty: "exact" },
      endDate: { year: 1957, month: 3, day: 6, certainty: "exact" },
      scope:
        "The statutory change in constitutional responsibility on 6 March 1957; not the preceding independence movement, later Ghanaian rule, or continental Pan-African institutions.",
      selectionRationale:
        "The case separates a documented legal-status change from broader nationalist projects and claims of continuing external constraint.",
      conditionStatementIds: [],
      episodeIds: ["ghana-independence-legal-transition-episode"],
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "ghana-independence-legal-transition-episode",
      kind: "case-episode",
      label: "Ghanaian legal-independence transition",
      description:
        "The 6 March 1957 statutory transition to Ghanaian independence.",
      caseId: "ghana-independence-1957",
      locationIds: ["ghana-1957"],
      startDate: { year: 1957, month: 3, day: 6, certainty: "exact" },
      endDate: { year: 1957, month: 3, day: 6, certainty: "exact" },
      scope:
        "The formal constitutional change, not its implementation, social distribution, or later Pan-African projects.",
      conditionStatementIds: [],
      formalRuleStatementIds: ["ghana-legal-independence"],
      ruleInUseStatementIds: [],
      interactionStatementIds: [],
      outcomeStatementIds: [],
      ...reviewed,
    },
  },
];

export const nationalismColonialismImperialismEvidenceDocuments = [
  ...sources,
  ...entities,
  ...statementDocs,
  ...caseDocs,
] satisfies AuthoringDocument[];
