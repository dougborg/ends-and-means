import type { AuthoringDocument } from "../../../src/lib/domain";

const reviewed = { publicationStatus: "reviewed" as const };

type SourceType = "article" | "report" | "web-page" | "edition";
type ResourcePurpose = "publisher" | "library" | "authorized-reading" | "other";
const source = (
  id: string,
  title: string,
  contributors: string[],
  publisher: string,
  sourceType: SourceType,
  year: number | undefined,
  url: string,
  identifiers: { doi?: string; isbn13?: string } = {},
  originalPublicationYear?: number,
  resourcePurpose: ResourcePurpose = "publisher",
  sourceTitle = title,
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
          : sourceType === "report"
            ? "report"
            : sourceType === "web-page"
              ? "other"
              : "book",
      ...(originalPublicationYear === undefined
        ? {}
        : { originalPublicationYear }),
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: `${id}-source`,
      kind: "source",
      label: sourceTitle,
      description: `The consulted source for the authoritarianism, fascism, and totalitarianism guides: ${sourceTitle}.`,
      title: sourceTitle,
      sourceType,
      workId: `${id}-work`,
      contributorDisplay: contributors,
      ...(year === undefined ? {} : { publicationYear: year }),
      publisher,
      identifiers,
      resourceLinks: [
        {
          purpose: resourcePurpose,
          url,
          label:
            resourcePurpose === "authorized-reading"
              ? "Read the source"
              : "Open the source record",
        },
      ],
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
    | "causal-hypothesis"
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
    description: label,
    statementKind,
    text,
    ...reviewed,
  },
});

export const authoritarianismFascismTotalitarianismEvidenceDocuments = [
  ...source(
    "linz-regimes",
    "Totalitarian and Authoritarian Regimes",
    ["Juan J. Linz"],
    "Lynne Rienner Publishers",
    "edition",
    2000,
    "https://www.rienner.com/title/Totalitarian_and_Authoritarian_Regimes",
    { isbn13: "9781555878900" },
    1975,
  ),
  ...source(
    "glasius-practices",
    "What authoritarianism is … and is not: a practice perspective",
    ["Marlies Glasius"],
    "Oxford University Press",
    "article",
    2018,
    "https://academic.oup.com/ia/article/94/3/515/4992409",
    { doi: "10.1093/ia/iiy060" },
  ),
  ...source(
    "vdem-regimes",
    "Regimes of the World: Opening New Avenues for the Comparative Study of Political Regimes",
    ["Anna Lührmann", "Marcus Tannenberg", "Staffan I. Lindberg"],
    "Cogitatio Press",
    "article",
    2018,
    "https://www.cogitatiopress.com/politicsandgovernance/article/view/1214",
    { doi: "10.17645/pag.v6i1.1214" },
  ),
  ...source(
    "geddes-dictatorships",
    "How Dictatorships Work",
    ["Barbara Geddes", "Joseph Wright", "Erica Frantz"],
    "Cambridge University Press",
    "edition",
    2018,
    "https://www.cambridge.org/core/books/how-dictatorships-work/8DC095F7A890035729BB0BB611738497",
    { doi: "10.1017/9781316336182", isbn13: "9781107535954" },
  ),
  ...source(
    "marquez-dictatorship",
    "Ancient Tyranny and Modern Dictatorship",
    ["Xavier Márquez"],
    "Cambridge University Press",
    "article",
    2025,
    "https://www.cambridge.org/core/journals/review-of-politics/article/ancient-tyranny-and-modern-dictatorship/4E2A8C3136109F061F04DE26D81A258E",
    { doi: "10.1017/S0034670524000445" },
  ),
  ...source(
    "griffin-nature",
    "The Nature of Fascism",
    ["Roger Griffin"],
    "Routledge",
    "edition",
    1993,
    "https://www.routledge.com/The-Nature-of-Fascism/Griffin/p/book/9780415096614",
    { isbn13: "9780415096614" },
    1991,
  ),
  ...source(
    "paxton-anatomy",
    "The Anatomy of Fascism",
    ["Robert O. Paxton"],
    "Vintage",
    "edition",
    2005,
    "https://www.penguinrandomhouse.com/books/128540/the-anatomy-of-fascism-by-robert-o-paxton/",
    { isbn13: "9781400033911" },
    2004,
  ),
  ...source(
    "mussolini-doctrine",
    "The Doctrine of Fascism",
    ["Benito Mussolini", "Giovanni Gentile"],
    "Internet Modern History Sourcebook, Fordham University",
    "web-page",
    1997,
    "https://sourcebooks.web.fordham.edu/mod/mussolini-fascism.asp",
    {},
    1932,
    "authorized-reading",
    "Benito Mussolini: What is Fascism, 1932 (Sourcebook excerpts)",
  ),
  ...source(
    "ushmm-mussolini",
    "Benito Mussolini",
    ["United States Holocaust Memorial Museum"],
    "United States Holocaust Memorial Museum",
    "web-page",
    2018,
    "https://encyclopedia.ushmm.org/content/en/article/benito-mussolini-1",
  ),
  ...source(
    "arendt-origins",
    "The Origins of Totalitarianism",
    ["Hannah Arendt"],
    "Harcourt Brace Jovanovich",
    "edition",
    1973,
    "https://books.google.com/books/about/The_Origins_of_Totalitarianism.html?id=SCUL0QEACAAJ",
    { isbn13: "9780844659947" },
    1951,
    "library",
  ),
  ...source(
    "bunce-totalitarianism",
    "A Discussion of Aviezer Tucker's The Legacies of Totalitarianism",
    ["Valerie Bunce"],
    "Cambridge University Press",
    "article",
    2017,
    "https://www.cambridge.org/core/journals/perspectives-on-politics/article/abs/discussion-of-aviezer-tuckers-the-legacies-of-totalitarianism-a-theoretical-framework/F4C8D66D4C3CD1E89D6C0AC70C60841E",
    { doi: "10.1017/S1537592717000330" },
  ),
  ...source(
    "ushmm-nazi-state",
    "Foundations of the Nazi State",
    ["United States Holocaust Memorial Museum"],
    "United States Holocaust Memorial Museum",
    "web-page",
    undefined,
    "https://encyclopedia.ushmm.org/content/en/article/foundations-of-the-nazi-state",
  ),
  {
    documentType: "entity",
    entity: {
      id: "party-state-law-work",
      kind: "work",
      label: "Law to Safeguard the Unity of Party and State",
      description: "The German law promulgated on December 1, 1933.",
      title: "Gesetz zur Sicherung der Einheit von Partei und Staat",
      workType: "other",
      originalPublicationYear: 1933,
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "party-state-law-source",
      kind: "source",
      label:
        "Law to Safeguard the Unity of Party and State (GHDI reproduction)",
      description:
        "The undated German History in Documents and Images reproduction of the Nuremberg staff English translation first published in the 1946 GPO volume Nazi Conspiracy and Aggression III, document 1395-PS, pp. 978–979.",
      title: "Law to Safeguard the Unity of Party and State",
      sourceType: "web-page",
      workId: "party-state-law-work",
      contributorDisplay: [
        "Nuremberg translation staff",
        "German Historical Institute staff",
      ],
      publisher: "German Historical Institute Washington",
      resourceLinks: [
        {
          purpose: "authorized-reading",
          url: "https://germanhistorydocs.org/en/nazi-germany-1933-1945/law-to-safeguard-the-unity-of-party-and-state-december-1-1933.pdf",
          label: "Open the GHDI reproduction",
        },
      ],
      ...reviewed,
    },
  },

  {
    documentType: "entity",
    entity: {
      id: "authoritarianism",
      kind: "concept",
      label: "Authoritarianism",
      description:
        "A contested analytical concept applied to regimes and practices that restrict political pluralism or sabotage accountability.",
      schemeIds: ["political-economic-ideas"],
      scopeNote:
        "Do not infer a complete regime type from one coercive act, a leader's style, or the everyday meaning of authority.",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "fascism",
      kind: "concept",
      label: "Fascism",
      description:
        "A disputed category for revolutionary ultranationalist ideology and historically connected movements and regimes.",
      schemeIds: ["political-economic-ideas"],
      scopeNote:
        "Keep scholarly definitions, self-description, movements, parties, regimes, and polemical uses separate.",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "totalitarianism",
      kind: "concept",
      label: "Totalitarianism",
      description:
        "A contested analytical category for projects and regimes claiming unusually comprehensive ideological and organizational domination.",
      schemeIds: ["political-economic-ideas"],
      scopeNote:
        "Do not use totalitarian as an automatic intensifier for repression or as an uncontested classification of every dictatorship.",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "autocracy",
      kind: "concept",
      label: "Autocracy",
      description:
        "A comparative regime category for political orders that do not meet specified democratic thresholds.",
      schemeIds: ["political-economic-ideas"],
      scopeNote:
        "Operational definitions differ; a country label is time-indexed and measurement-dependent.",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "dictatorship",
      kind: "concept",
      label: "Dictatorship",
      description:
        "A historically changing category now often used for nondemocratic regimes while also retaining older emergency-government meanings.",
      schemeIds: ["political-economic-ideas"],
      scopeNote:
        "Do not assume personal rule or one institutional form from the generic label.",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "fascist-movements",
      kind: "collection",
      label: "Fascist movements",
      description:
        "An editorial grouping of historically evidenced fascist movements.",
      inclusionRule:
        "Include a movement only through an explicit, sourced, qualified relationship; resemblance or insult is insufficient.",
      editorialPurpose:
        "Compare movements without making fascism a regime superclass.",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "totalitarianism-analyses",
      kind: "collection",
      label: "Totalitarianism analyses",
      description:
        "An editorial grouping of distinct scholarly approaches to totalitarianism.",
      inclusionRule:
        "Include only an independently addressable analytical Approach with explicit evidence.",
      editorialPurpose:
        "Keep rival analytic uses visible without forcing consensus.",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "historical-italian-fascism",
      kind: "approach",
      label: "Historical Italian Fascism",
      description:
        "The doctrine and political program advanced by Mussolini's Fascist movement and party in interwar Italy.",
      scope:
        "The movement's documented claims and governing project; not every feature of Italy from 1922 to 1943 and not a template inherited by other regimes.",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "linz-regime-analysis",
      kind: "approach",
      label: "Linz's regime analysis",
      description:
        "A comparative approach distinguishing authoritarian and totalitarian regime types by pluralism, ideology, mobilization, and leadership.",
      scope:
        "Linz's ideal-typical analysis, not an uncontested classification of all nondemocratic regimes.",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "italy",
      kind: "place",
      label: "Italy",
      description: "The geographic boundary for the Fascist dictatorship case.",
      placeType: "country",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "germany",
      kind: "place",
      label: "Germany",
      description: "The geographic boundary for the Nazi consolidation case.",
      placeType: "country",
      ...reviewed,
    },
  },

  claim(
    "authoritarian-linz-boundary",
    "Linz distinguishes authoritarian rule by limited pluralism",
    "Linz's ideal type distinguishes authoritarian regimes by limited, non-responsible pluralism, weak or absent guiding ideology, restricted mobilization, and formally unclear but generally predictable limits on leadership.",
    "definition",
  ),
  claim(
    "authoritarian-practice-boundary",
    "Authoritarian practices can cross regime labels",
    "Glasius argues that actions which sabotage accountability should be analyzed as authoritarian practices even when they occur outside a regime classified as authoritarian.",
    "definition",
  ),
  claim(
    "autocracy-operational-boundary",
    "Autocracy is an operational regime category",
    "The Regimes of the World measure separates closed from electoral autocracies according to elections and democratic prerequisites, while recording uncertainty near category boundaries.",
    "definition",
  ),
  claim(
    "dictatorship-varied-institutions",
    "Seizure groups shape later dictatorial decisions",
    "Geddes, Wright, and Frantz argue that differences in how groups that initiate dictatorships organize and make decisions persist after seizure and shape who influences later decisions.",
    "causal-hypothesis",
  ),
  claim(
    "dictatorship-roman-office-boundary",
    "Roman dictatorship was a bounded emergency office",
    "Márquez describes early Roman dictatorship as an office with enlarged powers for a specific emergency, constrained by customary expectations that the holder resign after completing the task.",
    "definition",
  ),
  claim(
    "dictatorship-modern-legitimation-boundary",
    "Modern dictatorship foregrounds authority and legitimation",
    "Márquez argues that the modern idea of dictatorship shifted attention from a ruler's character toward the authority and legitimation of political rule.",
    "definition",
  ),
  claim(
    "authoritarian-autocracy-nonsynonym",
    "Authoritarianism and autocracy answer different questions",
    "A regime-level autocracy classification and an analysis of authoritarian practices can overlap without being synonyms: one classifies political orders by stated thresholds, while the other identifies patterns that undermine accountability.",
    "editorial-interpretation",
  ),
  claim(
    "authoritarian-not-totalitarian",
    "Authoritarian does not automatically mean totalitarian",
    "In Linz's analysis, limited pluralism and constrained mobilization distinguish authoritarian regimes from the monistic power center, guiding ideology, and extensive mobilization associated with totalitarian regimes.",
    "definition",
  ),

  claim(
    "fascism-griffin-definition",
    "Griffin defines fascism around revolutionary national rebirth",
    "Griffin's ideal type locates fascism's ideological core in a revolutionary myth of national rebirth expressed through populist ultranationalism.",
    "definition",
  ),
  claim(
    "fascism-paxton-rival",
    "Paxton centers fascist political behavior",
    "Paxton defines fascism as political behavior in which a mass-based nationalist party collaborates with traditional elites, abandons democratic liberties, and pursues internal cleansing and external expansion without legal or ethical restraint.",
    "definition",
  ),
  claim(
    "fascism-label-boundary",
    "Fascist is not a generic label for coercive politics",
    "The Griffin and Paxton approaches require more than repression, nationalism, or dictatorial rule, so those features alone do not establish a fascist classification.",
    "editorial-interpretation",
  ),
  claim(
    "fascism-self-description",
    "The Fascist doctrine rejected Marxian socialism",
    "The 1932 Fascist doctrine rejected the Marxian account of history and class conflict.",
    "attributed-value",
  ),
  claim(
    "fascism-rejects-liberal-democracy",
    "The Fascist doctrine rejected majority rule",
    "The 1932 Fascist doctrine denied that a numerical majority should direct society through periodic consultation.",
    "attributed-value",
  ),
  claim(
    "fascism-rejects-liberal-individualism",
    "The Fascist doctrine rejected liberal individualism",
    "The 1932 Fascist doctrine contrasted nineteenth-century liberal individualism with a century of authority, collectivism, and the state.",
    "attributed-value",
  ),
  claim(
    "fascism-state-organizes-nation",
    "Mussolini and Gentile assigned the state authority over national life",
    "In the 1932 doctrine, Mussolini and Gentile said that the Fascist state organizes the nation and decides which individual freedoms are essential.",
    "attributed-proposal",
  ),
  claim(
    "fascism-self-description-limit",
    "Self-description does not settle external classification",
    "Mussolini's doctrinal self-description establishes what the regime claimed, not whether every practice followed it or whether other movements belong in the same scholarly category.",
    "editorial-interpretation",
  ),
  claim(
    "italy-dictatorship-transition",
    "Mussolini dismantled parliamentary responsibility during 1925",
    "During 1925 Mussolini's government ended parliamentary responsibility and consolidated a personal dictatorship.",
    "observation",
  ),
  claim(
    "italy-party-regime-boundary",
    "The Italian Fascist movement began in 1919",
    "Mussolini founded the Italian Fascist movement in 1919.",
    "observation",
  ),
  claim(
    "italy-movement-party-sequence",
    "The movement preceded the National Fascist Party",
    "The Italian Fascist movement subsequently became the National Fascist Party.",
    "observation",
  ),
  claim(
    "italy-coalition-government-1922",
    "Mussolini initially governed through a coalition",
    "After becoming prime minister in 1922, Mussolini depended on a coalition government to remain in power.",
    "observation",
  ),
  claim(
    "fascism-evidence-region-limit",
    "Paxton's core comparison gives Italy and Germany predominant weight",
    "Paxton examines a core set of movements and regimes generally accepted as fascist, with Italy and Germany predominant rather than exclusive in his sample.",
    "editorial-interpretation",
  ),
  claim(
    "fascism-authoritarianism-distinction",
    "Paxton distinguishes conservative authoritarianism from fascism",
    "Paxton reports that conservative elites often preferred authoritarian rule to fascism even when some later collaborated with fascist movements.",
    "observation",
  ),
  claim(
    "fascism-totalitarianism-classification-dispute",
    "Scholars dispute whether fascism belongs under totalitarianism",
    "Paxton reports both a view of fascism as a subspecies of totalitarianism and postwar theories that exclude Italian Fascism from that category.",
    "observation",
  ),
  claim(
    "italian-fascism-external-classification",
    "Paxton includes Italian Fascism in a generally accepted core sample",
    "Paxton includes Italian Fascism in a core sample of movements and regimes generally accepted as fascist.",
    "classification",
  ),

  claim(
    "totalitarian-linz-definition",
    "Linz defines a totalitarian ideal type",
    "Linz's totalitarian ideal type combines a monistic power center, an exclusive guiding ideology, and extensive political mobilization.",
    "definition",
  ),
  claim(
    "totalitarian-arendt-boundary",
    "Arendt treats totalitarianism as distinct from ordinary dictatorship",
    "Arendt argues that totalitarian domination, exemplified in her analysis by Nazi Germany and Stalin's Soviet Union, was not simply a stronger version of older tyranny or dictatorship.",
    "definition",
  ),
  claim(
    "totalitarian-contested-category",
    "Totalitarianism remains a contested comparison",
    "Bunce notes that totalitarianism became a Cold War comparison between Nazi and Soviet regimes and that scholars disputed both its analytic validity and its ideological uses.",
    "definition",
  ),
  claim(
    "totalitarian-label-history",
    "Totalitarian began as criticism and was appropriated",
    "Márquez reports that Giovanni Amendola used totalitarian language in 1923 to criticize Fascist monopolization of power and that Mussolini appropriated the term in 1925.",
    "observation",
  ),
  claim(
    "totalitarian-polemical-boundary",
    "Totalitarian is also a polemical label",
    "Because totalitarianism has been extended to many unlike targets in public controversy, applying the word does not by itself establish the features required by a scholarly definition.",
    "editorial-interpretation",
  ),
  claim(
    "nazi-democratic-destruction",
    "Nazi leaders rapidly destroyed democratic government",
    "Within two months of Hitler's January 1933 appointment, Nazi leaders destroyed the institutions of Germany's democratic government.",
    "observation",
  ),
  claim(
    "nazi-one-party-state-july-1933",
    "The Nazi Party became Germany's sole legal party",
    "By mid-July 1933, the Nazi Party was the only political party left in Germany after its rivals were outlawed or dissolved under pressure.",
    "observation",
  ),
  claim(
    "nazi-party-state-law",
    "The Nazi regime legally joined party and state",
    "The December 1933 Law to Safeguard the Unity of Party and State declared the Nazi Party inseparably linked with the state while retaining them as named organizations.",
    "observation",
  ),
  claim(
    "nazi-coordination-scope",
    "Nazi coordination reached across organized life",
    "The Nazi coordination drive aligned political parties, state governments, cultural and professional organizations, and organized labor with Nazi goals.",
    "observation",
  ),
  claim(
    "nazi-christian-coordination-limit",
    "Nazi coordination did not fully absorb Christian organizations",
    "Nazi efforts to coordinate Christian denominations and their affiliated youth groups were not entirely successful.",
    "observation",
  ),
  claim(
    "totalitarian-case-nonembodiment",
    "A case cannot embody an analytical category",
    "The Nazi consolidation case supplies evidence about named institutions and dates; it cannot by itself prove that one totalitarianism definition is universally valid or that other regimes inherit its features.",
    "editorial-interpretation",
  ),

  {
    documentType: "entity",
    entity: {
      id: "italian-fascist-dictatorship-1925-1943",
      kind: "case",
      label: "Italian Fascist dictatorship, 1925–1943",
      description:
        "A bounded case of dictatorship consolidation and rule under Mussolini and the National Fascist Party.",
      locationIds: ["italy"],
      startDate: { year: 1925, certainty: "exact" },
      endDate: { year: 1943, certainty: "exact" },
      scope:
        "From the 1925 destruction of parliamentary responsibility to Mussolini's dismissal in July 1943; the earlier movement, 1922 coalition government, German occupation, and Italian Social Republic are context rather than the same episode.",
      selectionRationale:
        "The sequence separates movement, party, doctrine, entry into office, and consolidated regime rather than treating them as one timeless object.",
      conditionStatementIds: [
        "italy-party-regime-boundary",
        "italy-movement-party-sequence",
        "italy-coalition-government-1922",
      ],
      episodeIds: ["italian-fascist-consolidated-rule"],
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "italian-fascist-consolidated-rule",
      kind: "case-episode",
      label: "Consolidated Fascist rule, 1925–1943",
      description:
        "The period from Mussolini's destruction of parliamentary responsibility to his dismissal.",
      caseId: "italian-fascist-dictatorship-1925-1943",
      locationIds: ["italy"],
      startDate: { year: 1925, certainty: "exact" },
      endDate: { year: 1943, month: 7, certainty: "exact" },
      scope:
        "The national regime and its party relationship; not every local practice or social outcome.",
      conditionStatementIds: [
        "italy-party-regime-boundary",
        "italy-movement-party-sequence",
        "italy-coalition-government-1922",
      ],
      formalRuleStatementIds: [],
      ruleInUseStatementIds: ["italy-dictatorship-transition"],
      interactionStatementIds: [],
      outcomeStatementIds: [],
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "nazi-consolidation-1933",
      kind: "case",
      label: "Nazi consolidation in Germany, 1933",
      description:
        "A bounded case of the Nazi Party's destruction of plural government and legal coupling to the state during 1933.",
      locationIds: ["germany"],
      startDate: { year: 1933, month: 1, day: 30, certainty: "exact" },
      endDate: { year: 1933, month: 12, day: 1, certainty: "exact" },
      scope:
        "The January–December 1933 consolidation sequence; later war, genocide, occupation, and the regime's full institutional history require their own evidence boundaries.",
      selectionRationale:
        "The short interval tests claims about movement, party, dictatorship, institutional coordination, and totalitarian classification without presenting Nazi Germany as an embodiment.",
      conditionStatementIds: [],
      episodeIds: ["nazi-party-state-consolidation-1933"],
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "nazi-party-state-consolidation-1933",
      kind: "case-episode",
      label: "Nazi party-state consolidation, 1933",
      description:
        "The institutional consolidation from Hitler's appointment through the party-state law.",
      caseId: "nazi-consolidation-1933",
      locationIds: ["germany"],
      startDate: { year: 1933, month: 1, day: 30, certainty: "exact" },
      endDate: { year: 1933, month: 12, day: 1, certainty: "exact" },
      scope:
        "National party and state institutions during 1933; does not claim complete control over German society.",
      conditionStatementIds: [],
      formalRuleStatementIds: ["nazi-party-state-law"],
      ruleInUseStatementIds: [
        "nazi-democratic-destruction",
        "nazi-one-party-state-july-1933",
      ],
      interactionStatementIds: [
        "nazi-coordination-scope",
        "nazi-christian-coordination-limit",
      ],
      outcomeStatementIds: [],
      ...reviewed,
    },
  },
] satisfies AuthoringDocument[];
