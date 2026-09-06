import type { AuthoringDocument } from "../../../src/lib/domain";

const reviewed = {
  publicationStatus: "reviewed" as const,
  reviewedAt: "2026-09-06",
};

const source = (
  id: string,
  title: string,
  contributors: string[],
  publisher: string,
  sourceType: "web-page" | "article" | "edition" | "legal-text",
  url: string,
  publicationYear?: number,
  originalPublicationYear?: number,
  identifiers?: { doi?: string; isbn13?: string },
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
            : sourceType === "legal-text"
              ? "law"
              : "other",
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
      label: title,
      description: `The consulted source for the Liberalism and Conservatism guides: ${title}.`,
      title,
      sourceType,
      workId: `${id}-work`,
      contributorDisplay: contributors,
      publisher,
      ...(publicationYear === undefined ? {} : { publicationYear }),
      ...(identifiers === undefined ? {} : { identifiers }),
      resourceLinks: [
        {
          purpose:
            sourceType === "edition" || sourceType === "article"
              ? "authorized-reading"
              : "publisher",
          url,
          label: "Open the source",
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
    | "attributed-value"
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

export const liberalismConservatismEvidenceDocuments = [
  ...source(
    "sep-liberalism",
    "Liberalism",
    ["Gerald Gaus", "Shane D. Courtland", "David Schmidtz"],
    "Stanford Encyclopedia of Philosophy",
    "web-page",
    "https://plato.stanford.edu/archives/spr2026/entries/liberalism/",
    2026,
    1996,
  ),
  ...source(
    "mill-on-liberty",
    "On Liberty",
    ["John Stuart Mill"],
    "Project Gutenberg",
    "edition",
    "https://www.gutenberg.org/ebooks/34901",
    2011,
    1859,
  ),
  ...source(
    "mehta-liberalism-empire",
    "Liberalism and Empire: A Study in Nineteenth-Century British Liberal Thought",
    ["Uday Singh Mehta"],
    "University of Chicago Press",
    "edition",
    "https://press.uchicago.edu/ucp/books/book/chicago/L/bo3642864.html",
    1999,
    1999,
    { isbn13: "9780226519180" },
  ),
  ...source(
    "pateman-sexual-contract",
    "The Sexual Contract",
    ["Carole Pateman"],
    "Stanford University Press",
    "edition",
    "https://openlibrary.org/books/OL2412256M/The_sexual_contract",
    1988,
    1988,
    { isbn13: "9780804714778" },
  ),
  ...source(
    "japan-constitution",
    "The Constitution of Japan",
    ["Government of Japan"],
    "Prime Minister's Office of Japan",
    "legal-text",
    "https://japan.kantei.go.jp/policy/constitution_and_government_of_japan/constitution_e.html",
    1946,
    1946,
  ),
  ...source(
    "nakanishi-japan-rights",
    "The Process of Making the Human Rights Articles in the Constitution of Japan",
    ["Yuki Nakanishi", "Akiko Onose", "Yukiko Kusano"],
    "Journal of Home Economics of Japan",
    "article",
    "https://www.jstage.jst.go.jp/article/jhej1987/49/11/49_11_1185/_article",
    1998,
    1998,
    { doi: "10.11428/jhej1987.49.1185" },
  ),
  ...source(
    "sep-conservatism",
    "Conservatism",
    ["Andy Hamilton"],
    "Stanford Encyclopedia of Philosophy",
    "web-page",
    "https://plato.stanford.edu/archives/fall2025/entries/conservatism/",
    2025,
    2015,
  ),
  ...source(
    "burke-reflections",
    "Reflections on the Revolution in France",
    ["Edmund Burke"],
    "Project Gutenberg",
    "edition",
    "https://www.gutenberg.org/ebooks/15679",
    2005,
    1790,
  ),
  ...source(
    "cdu-ahlen-programme",
    "Ahlen Programme",
    ["Christian Democratic Union"],
    "Konrad Adenauer Foundation",
    "web-page",
    "https://www.kas.de/en/web/geschichte-der-cdu/dokumente-zur-geschichte-der-cdu/-/content/1947-ahlener-wirtschaft-sozial-programm-cdu",
    1947,
    1947,
  ),
  ...source(
    "cdu-duesseldorf-guidelines",
    "Düsseldorf Guidelines",
    ["Christian Democratic Union"],
    "Konrad Adenauer Foundation",
    "edition",
    "https://www.kas.de/documents/291599/20906855/07-001-9001_Duesseldorfer_Leitsaetze.pdf/ab19f58f-49ae-18e3-ccbd-4fb5cc6567c2",
    1949,
    1949,
  ),
  {
    documentType: "entity",
    entity: {
      id: "liberalism",
      kind: "concept",
      label: "Liberalism",
      description:
        "A contested family of political traditions organized around liberty and the demand that authority be justified, with enduring disputes about equality, property, markets, welfare, democracy, and the reach of liberal commitments.",
      schemeIds: ["political-economic-ideas"],
      scopeNote:
        "Do not infer a fixed economic program, democratic performance, individualism, or a present-day party position from the label alone.",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "conservatism",
      kind: "concept",
      label: "Conservatism",
      description:
        "A contested political concept used for dispositions, arguments, traditions, movements, and programs that give weight to inherited institutions, practical knowledge, authority, order, community, or cautious change.",
      schemeIds: ["political-economic-ideas"],
      scopeNote:
        "Do not infer authoritarianism, nationalism, religion, capitalism, opposition to all reform, or a present-day party position from the label alone.",
      ...reviewed,
    },
  },
  statement(
    "liberalism-plural-traditions",
    "Liberalism contains competing traditions",
    "Liberalism names related but competing traditions rather than one fixed doctrine or policy package.",
    "definition",
  ),
  statement(
    "liberalism-authority-justification",
    "Liberal authority requires justification",
    "Gaus, Courtland, and Schmidtz describe the demand that political authority be justified as a starting point shared across liberal traditions.",
    "attributed-value",
  ),
  statement(
    "liberalism-liberty-disputes",
    "Liberals dispute the meaning of liberty",
    "Liberal traditions disagree over negative, positive, and republican interpretations of liberty.",
    "definition",
  ),
  statement(
    "liberalism-old-new-boundary",
    "Old and new liberalisms differ",
    "The Stanford Encyclopedia distinguishes classical or old liberalism from new liberal traditions that give a larger role to social justice and public action.",
    "definition",
  ),
  statement(
    "liberalism-label-insufficient",
    "A liberal label does not specify institutions",
    "Calling a constitution, party, market, or welfare program liberal does not identify which liberal justification or institutional commitments it adopts.",
    "editorial-interpretation",
  ),
  statement(
    "mill-liberty-limiting-principle",
    "Mill limited coercion by harm to others",
    "Mill argued that preventing harm to others, rather than a person's own good, can justify coercive power over an adult member of a civilized community.",
    "attributed-value",
  ),
  statement(
    "mill-colonial-exclusion",
    "Mill excluded peoples he called barbarians",
    "Mill stated that his liberty principle did not apply to peoples he classified as barbarians and allowed despotism as a means of their improvement.",
    "observation",
  ),
  statement(
    "mehta-liberal-empire-tension",
    "Mehta examines liberal arguments for empire",
    "Mehta argues that nineteenth-century British liberal thinkers reconciled commitments to liberty with imperial rule through judgments about history, reason, and political capacity.",
    "observation",
  ),
  statement(
    "pateman-contract-gender-boundary",
    "Pateman challenges gender-neutral contract",
    "Pateman argues that classic social-contract narratives obscure a sexual contract that structures men's political right over women.",
    "observation",
  ),
  statement(
    "india-rights-equality",
    "India's Constitution specifies equality rights",
    "Articles 14 and 15 of India's Constitution specify equality before the law and prohibit listed forms of discrimination while also permitting specified special provisions.",
    "observation",
  ),
  statement(
    "japan-rights-equality-marriage",
    "Japan's Constitution specifies equality and marriage rights",
    "Articles 14 and 24 of Japan's Constitution specify legal equality and ground marriage in mutual consent and equal rights of husband and wife.",
    "observation",
  ),
  statement(
    "japan-rights-drafting-boundary",
    "Japan's rights settlement had an occupation-era drafting context",
    "Nakanishi, Onose, and Kusano trace the human-rights provisions of Japan's Constitution through Japanese drafts and the Allied occupation drafting process rather than attributing them to one national tradition.",
    "observation",
  ),
  statement(
    "conservatism-broad-narrow",
    "Conservatism has broad and narrow senses",
    "Conservatism can name a general disposition against abrupt change or a self-conscious modern political tradition.",
    "definition",
  ),
  statement(
    "conservatism-tradition-reform",
    "Conservative tradition can permit reform",
    "The Stanford Encyclopedia describes a prominent conservatism that values inherited practice while allowing cautious and incremental reform.",
    "definition",
  ),
  statement(
    "conservatism-reaction-boundary",
    "Conservatism is not identical to reaction",
    "Resistance to every change is not sufficient to define the conservative tradition described by Hamilton.",
    "editorial-interpretation",
  ),
  statement(
    "conservatism-authoritarian-boundary",
    "Conservatism is not necessarily authoritarian",
    "Hamilton distinguishes conservatism from dogmatic reaction and states that reaction, rather than conservatism as such, is inherently authoritarian.",
    "definition",
  ),
  statement(
    "conservatism-procedural-substantive",
    "Conservatism can be procedural or substantive",
    "Accounts of conservatism differ between a procedural preference for gradual change and substantive defenses of particular forms of authority and social order.",
    "definition",
  ),
  statement(
    "burke-change-conservation",
    "Burke connected change to conservation",
    "Burke argued that a state requires a capacity for change in order to preserve itself.",
    "attributed-value",
  ),
  statement(
    "burke-inheritance-prudence",
    "Burke defended inherited institutions",
    "Burke defended inherited institutions and prescription against reconstructing government solely from abstract rights or present choice.",
    "attributed-value",
  ),
  statement(
    "ahlen-programme-economic-order",
    "The Ahlen Programme rejected the existing capitalist order",
    "The CDU's 1947 Ahlen Programme declared that the capitalist economic system had not served the German people's vital interests and called for a new social and economic order.",
    "attributed-value",
  ),
  statement(
    "ahlen-programme-compromise",
    "The Ahlen Programme combined rival currents",
    "The Konrad Adenauer Foundation describes the Ahlen Programme as a compromise combining Catholic social, cooperative, and ordoliberal positions.",
    "observation",
  ),
  statement(
    "duesseldorf-social-market-shift",
    "The Düsseldorf Guidelines foregrounded a social market economy",
    "The CDU's 1949 Düsseldorf Guidelines presented a social market economy based on competition, price formation, and social protections as its economic program.",
    "attributed-value",
  ),
  statement(
    "cdu-programme-change-boundary",
    "One party changed programs without fixing conservatism",
    "The shift between the CDU's Ahlen and Düsseldorf programs shows change within one party over two postwar years, not a universal definition of conservatism.",
    "editorial-interpretation",
  ),
  {
    documentType: "entity",
    entity: {
      id: "india",
      kind: "place",
      label: "India",
      description:
        "The geographic boundary for the Indian constitutional settlement case.",
      placeType: "country",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "japan",
      kind: "place",
      label: "Japan",
      description:
        "The geographic boundary for the Japanese constitutional settlement case.",
      placeType: "country",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "great-britain",
      kind: "place",
      label: "Great Britain",
      description:
        "The geographic boundary for the 1790 publication intervention.",
      placeType: "country",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "western-germany",
      kind: "place",
      label: "Western Germany",
      description:
        "The geographic boundary for the CDU program case before the Federal Republic's consolidation.",
      placeType: "region",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "india-constitutional-rights-settlement-1946-1950",
      kind: "case",
      label: "India's constitutional-rights settlement, 1946–1950",
      description:
        "The Constituent Assembly period in which independent India framed equality and other fundamental rights in a democratic-republican constitution.",
      locationIds: ["india"],
      startDate: { year: 1946, certainty: "exact" },
      endDate: { year: 1950, certainty: "exact" },
      scope:
        "Constitutional drafting, adoption, and commencement from 1946 through 1950; not a claim that formal rights eliminated social or colonial inequalities.",
      selectionRationale:
        "The settlement tests how liberal rights language was specified in a postcolonial constitution without treating India as an embodiment of liberalism.",
      conditionStatementIds: ["india-democratic-republic-preamble"],
      episodeIds: ["india-constitutional-rights-episode"],
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "india-constitutional-rights-episode",
      kind: "case-episode",
      label: "Indian constitutional-rights drafting and commencement",
      description:
        "The bounded drafting-to-commencement interval for the Constitution's equality provisions.",
      caseId: "india-constitutional-rights-settlement-1946-1950",
      locationIds: ["india"],
      startDate: { year: 1946, certainty: "exact" },
      endDate: { year: 1950, month: 1, day: 26, certainty: "exact" },
      scope:
        "Articles 14 and 15 in their constitutional settlement context; not their full later judicial or practical history.",
      conditionStatementIds: ["india-democratic-republic-preamble"],
      formalRuleStatementIds: ["india-rights-equality"],
      ruleInUseStatementIds: [],
      interactionStatementIds: [],
      outcomeStatementIds: [],
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "japan-constitutional-rights-settlement-1946-1947",
      kind: "case",
      label: "Japan's constitutional-rights settlement, 1946–1947",
      description:
        "The adoption and commencement of Japan's postwar constitutional equality and marriage provisions under an Allied occupation drafting context.",
      locationIds: ["japan"],
      startDate: { year: 1946, certainty: "exact" },
      endDate: { year: 1947, certainty: "exact" },
      scope:
        "The constitutional drafting, promulgation, and commencement interval; not a complete account of Japanese liberal traditions or equality in practice.",
      selectionRationale:
        "The settlement supplies a non-Atlantic constitutional example while making occupation power and gender-specific provisions visible.",
      conditionStatementIds: ["japan-rights-drafting-boundary"],
      episodeIds: ["japan-constitutional-rights-episode"],
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "japan-constitutional-rights-episode",
      kind: "case-episode",
      label: "Japanese constitutional-rights adoption and commencement",
      description:
        "The bounded promulgation-to-commencement interval for the postwar Constitution.",
      caseId: "japan-constitutional-rights-settlement-1946-1947",
      locationIds: ["japan"],
      startDate: { year: 1946, month: 11, day: 3, certainty: "exact" },
      endDate: { year: 1947, month: 5, day: 3, certainty: "exact" },
      scope:
        "Articles 14 and 24 and their drafting context; not their full implementation history.",
      conditionStatementIds: ["japan-rights-drafting-boundary"],
      formalRuleStatementIds: ["japan-rights-equality-marriage"],
      ruleInUseStatementIds: [],
      interactionStatementIds: ["japan-rights-drafting-boundary"],
      outcomeStatementIds: [],
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "burke-reflections-intervention-1790",
      kind: "case",
      label: "Burke's Reflections intervention, 1790",
      description:
        "A bounded publication intervention against arguments made in Britain about the French Revolution.",
      locationIds: ["great-britain"],
      startDate: { year: 1790, certainty: "exact" },
      endDate: { year: 1790, certainty: "exact" },
      scope:
        "Burke's 1790 argument about inheritance, prudence, change, and conservation; not every conservative tradition or the institutional course of the French Revolution.",
      selectionRationale:
        "The intervention exposes influential conservative reasoning while keeping one author's argument distinct from later movements and parties.",
      conditionStatementIds: [],
      episodeIds: ["burke-reflections-publication-episode"],
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "burke-reflections-publication-episode",
      kind: "case-episode",
      label: "Publication of Reflections on the Revolution in France",
      description:
        "The 1790 publication episode for Burke's intervention in British revolutionary debate.",
      caseId: "burke-reflections-intervention-1790",
      locationIds: ["great-britain"],
      startDate: { year: 1790, certainty: "exact" },
      endDate: { year: 1790, certainty: "exact" },
      scope:
        "The arguments in Reflections, not a claim that later conservatisms inherited them unchanged.",
      conditionStatementIds: [],
      formalRuleStatementIds: [],
      ruleInUseStatementIds: [],
      interactionStatementIds: [
        "burke-change-conservation",
        "burke-inheritance-prudence",
      ],
      outcomeStatementIds: [],
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "cdu-economic-programmes-1947-1949",
      kind: "case",
      label: "CDU economic programs, 1947–1949",
      description:
        "The bounded shift from the CDU's Ahlen Programme to its Düsseldorf Guidelines in western Germany.",
      locationIds: ["western-germany"],
      startDate: { year: 1947, certainty: "exact" },
      endDate: { year: 1949, certainty: "exact" },
      scope:
        "Two CDU economic programs and their documented relationship; not all Christian democracy, German conservatism, or postwar economic policy in practice.",
      selectionRationale:
        "The short sequence demonstrates party-program variation and challenges the idea that a conservative label determines one economic package.",
      conditionStatementIds: ["ahlen-programme-compromise"],
      episodeIds: ["cdu-programme-change-episode"],
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "cdu-programme-change-episode",
      kind: "case-episode",
      label: "From Ahlen to Düsseldorf",
      description:
        "The interval between the CDU's 1947 and 1949 economic programs.",
      caseId: "cdu-economic-programmes-1947-1949",
      locationIds: ["western-germany"],
      startDate: { year: 1947, month: 2, day: 3, certainty: "exact" },
      endDate: { year: 1949, month: 7, day: 15, certainty: "exact" },
      scope:
        "Authored economic commitments in two programs; not their complete implementation or electoral reception.",
      conditionStatementIds: ["ahlen-programme-compromise"],
      formalRuleStatementIds: [],
      ruleInUseStatementIds: [],
      interactionStatementIds: [
        "ahlen-programme-economic-order",
        "duesseldorf-social-market-shift",
      ],
      outcomeStatementIds: ["cdu-programme-change-boundary"],
      ...reviewed,
    },
  },
] satisfies AuthoringDocument[];
