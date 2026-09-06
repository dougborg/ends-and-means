import type { AuthoringDocument } from "../../../src/lib/domain";

const reviewed = {
  publicationStatus: "reviewed" as const,
  reviewedAt: "2026-09-06",
};
const orientationRefs = (article: string, id: string) => [
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
    match: "exact" as const,
    checkedAt: "2026-09-06",
  },
];

const sourceCopy: Record<
  string,
  { work: string; source: string; purpose: "publisher" | "authorized-reading" }
> = {
  "sep-liberalism": {
    work: "A reference account of disputes within liberal political philosophy.",
    source:
      "The fixed Spring 2026 archive edition of the Stanford Encyclopedia of Philosophy entry on liberalism.",
    purpose: "publisher",
  },
  "mill-on-liberty": {
    work: "John Stuart Mill's 1859 argument about liberty and the limits of social coercion.",
    source:
      "Project Gutenberg's readable electronic edition of Mill's On Liberty.",
    purpose: "authorized-reading",
  },
  "mehta-liberalism-empire": {
    work: "Uday Singh Mehta's study of empire in nineteenth-century British liberal thought.",
    source:
      "The University of Chicago Press record and synopsis for Mehta's 1999 book.",
    purpose: "publisher",
  },
  "pateman-sexual-contract": {
    work: "Carole Pateman's feminist critique of social-contract theory and patriarchal political right.",
    source:
      "Wiley's publisher record for the 1988 Polity edition of The Sexual Contract.",
    purpose: "publisher",
  },
  "japan-constitution": {
    work: "Japan's postwar constitutional text, promulgated in 1946 and effective in 1947.",
    source:
      "The official English text reproduced from the November 3, 1946 Official Gazette.",
    purpose: "publisher",
  },
  "nakanishi-japan-rights": {
    work: "A Japanese scholarly account of how Beate Shirota Gordon's drafts shaped Articles 24 and 26 of Japan's Constitution.",
    source:
      "The Journal of Home Economics of Japan article page and full text.",
    purpose: "publisher",
  },
  "sep-conservatism": {
    work: "A reference account of rival definitions and arguments within conservative political philosophy.",
    source:
      "The fixed Fall 2025 archive edition of the Stanford Encyclopedia of Philosophy entry on conservatism.",
    purpose: "publisher",
  },
  "burke-reflections": {
    work: "Edmund Burke's 1790 intervention in British debate about the French Revolution.",
    source:
      "Project Gutenberg's readable electronic edition of Burke's Reflections.",
    purpose: "authorized-reading",
  },
  "cdu-ahlen-programme": {
    work: "The British-zone CDU's 1947 economic and social program.",
    source:
      "The Konrad Adenauer Foundation's PDF reproduction of the original German Ahlen Programme; English summaries are Ends and Means translations.",
    purpose: "publisher",
  },
  "cdu-duesseldorf-guidelines": {
    work: "The CDU and CSU's 1949 economic, agricultural, social-policy, and housing guidelines.",
    source:
      "The Konrad Adenauer Foundation's scan of the original German Düsseldorf Guidelines; English summaries are Ends and Means translations.",
    purpose: "publisher",
  },
  "bell-what-is-liberalism": {
    work: "Duncan Bell's rival account of how liberalism is defined and historically reconstructed.",
    source:
      "The SAGE article page, including the abstract's account of Bell's three definitional approaches.",
    purpose: "publisher",
  },
  "huntington-conservatism-ideology": {
    work: "Samuel P. Huntington's rival taxonomy of aristocratic, autonomous, and situational definitions of conservatism.",
    source:
      "The Cambridge Core article page and extract identifying Huntington's three conflicting conceptions.",
    purpose: "publisher",
  },
  "commons-right-to-buy": {
    work: "The House of Commons Library's institutional history and impact review of Right to Buy.",
    source: "The complete 1999 parliamentary research paper.",
    purpose: "authorized-reading",
  },
  "housing-act-1980": {
    work: "The United Kingdom statute that created a tenant's statutory Right to Buy in England and Wales.",
    source:
      "The enacted version of the Housing Act 1980 published by the National Archives.",
    purpose: "publisher",
  },
  "balasubramanian-free-economy": {
    work: "Aditya Balasubramanian's history of Swatantra and economic conservatism in postcolonial India.",
    source: "The publisher-authorized introduction to Toward a Free Economy.",
    purpose: "authorized-reading",
  },
  "swatantra-statement-principles": {
    work: "The twenty-one principles adopted by Swatantra's preparatory convention in August 1959.",
    source:
      "A scan of the party's English-language Statement of Principles preserved by Indian Liberals.",
    purpose: "authorized-reading",
  },
};

function workTypeFor(
  id: string,
  sourceType: "web-page" | "article" | "report" | "edition" | "legal-text",
  workType?: "article" | "book" | "constitution" | "law" | "other" | "report",
) {
  if (workType) return workType;
  if (id === "japan-constitution") return "constitution" as const;
  if (sourceType === "article") return "article" as const;
  if (sourceType === "report") return "report" as const;
  if (sourceType === "edition") return "book" as const;
  if (sourceType === "legal-text") return "law" as const;
  return "other" as const;
}

const source = (
  id: string,
  title: string,
  contributors: string[],
  publisher: string,
  sourceType: "web-page" | "article" | "report" | "edition" | "legal-text",
  url: string,
  publicationYear?: number,
  originalPublicationYear?: number,
  identifiers?: { doi?: string; isbn13?: string },
  workType?: "article" | "book" | "constitution" | "law" | "other" | "report",
): AuthoringDocument[] => [
  {
    documentType: "entity",
    entity: {
      id: `${id}-work`,
      kind: "work",
      label: title,
      description: sourceCopy[id]?.work ?? title,
      title,
      workType: workTypeFor(id, sourceType, workType),
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
      description: sourceCopy[id]?.source ?? title,
      title,
      sourceType,
      workId: `${id}-work`,
      contributorDisplay: contributors,
      publisher,
      ...(publicationYear === undefined ? {} : { publicationYear }),
      ...(identifiers === undefined ? {} : { identifiers }),
      resourceLinks: [
        {
          purpose: sourceCopy[id]?.purpose ?? "publisher",
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
    "https://press.uchicago.edu/ucp/books/book/chicago/L/bo3623192.html",
    1999,
    1999,
    { isbn13: "9780226519180" },
  ),
  ...source(
    "pateman-sexual-contract",
    "The Sexual Contract",
    ["Carole Pateman"],
    "Polity Press",
    "edition",
    "https://www.wiley-vch.de/en/areas-interest/humanities-social-sciences/the-sexual-contract-978-0-7456-0432-9",
    1988,
    1988,
    { isbn13: "9780745604329" },
  ),
  ...source(
    "japan-constitution",
    "The Constitution of Japan",
    ["Government of Japan"],
    "National Diet Library of Japan",
    "legal-text",
    "https://www.ndl.go.jp/constitution/e/etc/c01.html",
    1946,
    1946,
  ),
  ...source(
    "nakanishi-japan-rights",
    "Formation Process of the Human Rights Articles, the Third Chapter of the Constitution of Japan (Part 1): Circumstances under Which the Articles Drafted by Beate Shirota Gordon Became the Constitution of Japan",
    ["Haruka Nakanishi", "Hiroko Onose", "Atsuko Kusano"],
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
    "edition",
    "https://www.kas.de/c/document_library/get_file?groupId=252038&uuid=76a77614-6803-0750-c7a7-5d3ff7c46206",
    1947,
    1947,
    undefined,
    "other",
  ),
  ...source(
    "cdu-duesseldorf-guidelines",
    "Düsseldorf Guidelines",
    ["Christian Democratic Union", "Christian Social Union"],
    "Konrad Adenauer Foundation",
    "edition",
    "https://www.kas.de/documents/252038/253252/1949_Duesseldorfer-Leitsaetze.pdf/e96f38a1-b923-a79e-c5a3-11569de3f64e",
    1949,
    1949,
    undefined,
    "other",
  ),
  ...source(
    "bell-what-is-liberalism",
    "What Is Liberalism?",
    ["Duncan Bell"],
    "Political Theory",
    "article",
    "https://doi.org/10.1177/0090591714535103",
    2014,
    2014,
    { doi: "10.1177/0090591714535103" },
  ),
  ...source(
    "huntington-conservatism-ideology",
    "Conservatism as an Ideology",
    ["Samuel P. Huntington"],
    "American Political Science Review",
    "article",
    "https://doi.org/10.2307/1952202",
    1957,
    1957,
    { doi: "10.2307/1952202" },
  ),
  ...source(
    "commons-right-to-buy",
    "The Right to Buy",
    ["Wendy Wilson"],
    "House of Commons Library",
    "report",
    "https://researchbriefings.files.parliament.uk/documents/RP99-36/RP99-36.pdf",
    1999,
    1999,
  ),
  ...source(
    "housing-act-1980",
    "Housing Act 1980",
    ["Parliament of the United Kingdom"],
    "The National Archives",
    "legal-text",
    "https://www.legislation.gov.uk/ukpga/1980/51/contents/enacted",
    1980,
    1980,
  ),
  ...source(
    "balasubramanian-free-economy",
    "Toward a Free Economy: Swatantra and Opposition Politics in Democratic India",
    ["Aditya Balasubramanian"],
    "Princeton University Press",
    "edition",
    "https://pup-assets.imgix.net/onix/images/9780691205243/9780691205243.pdf?fm=pdf",
    2023,
    2023,
    { isbn13: "9780691205243" },
  ),
  ...source(
    "swatantra-statement-principles",
    "Statement of Principles of the Swatantra Party",
    ["Swatantra Party"],
    "Inland Printers, Bombay; digital copy preserved by Indian Liberals",
    "edition",
    "https://indianliberals.in/swatantra-party/statement-of-principles-of-the-swatantra-party-aug2-1959.pdf",
    1959,
    1959,
    undefined,
    "other",
  ),
  {
    documentType: "entity",
    entity: {
      id: "bach-ahlen-history-work",
      kind: "work",
      label: "CDU überwindet Kapitalismus und Marxismus",
      description:
        "Christine Bach's historical account of the Ahlen Programme's formation and competing currents.",
      title: "CDU überwindet Kapitalismus und Marxismus",
      workType: "other",
      originalPublicationYear: 2021,
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "bach-ahlen-history-source",
      kind: "source",
      label: "CDU überwindet Kapitalismus und Marxismus",
      description:
        "Christine Bach's German-language history published by the Konrad Adenauer Foundation.",
      title: "CDU überwindet Kapitalismus und Marxismus",
      sourceType: "web-page",
      workId: "bach-ahlen-history-work",
      contributorDisplay: ["Christine Bach"],
      publicationYear: 2021,
      publisher: "Konrad Adenauer Foundation",
      resourceLinks: [
        {
          purpose: "publisher",
          url: "https://www.kas.de/en/web/geschichte-der-cdu/dokumente-zur-geschichte-der-cdu/-/content/1947-ahlener-wirtschaft-sozial-programm-cdu",
          label: "Read the historical account",
        },
      ],
      ...reviewed,
    },
  },
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
      externalRefs: orientationRefs("Liberalism", "Q6216"),
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
      externalRefs: orientationRefs("Conservatism", "Q7169"),
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
    "Mehta argues that nineteenth-century British liberals made imperial rule intelligible by placing colonized peoples within a staged account of human development.",
    "classification",
  ),
  statement(
    "pateman-contract-gender-boundary",
    "Pateman challenges gender-neutral contract",
    "Pateman argues that canonical contract theories hide a gendered settlement in which civil freedom for men depends on women's subordination.",
    "classification",
  ),
  statement(
    "india-equality-before-law",
    "India's Constitution specifies equality before law",
    "Article 14 of India's Constitution guarantees equality before the law and equal protection of the laws within India.",
    "observation",
  ),
  statement(
    "india-discrimination-grounds",
    "India's Constitution lists prohibited discrimination grounds",
    "Article 15(1) prohibits the state from discriminating against a citizen only on grounds of religion, race, caste, sex, or place of birth.",
    "observation",
  ),
  statement(
    "india-special-provisions",
    "India's original Constitution permitted special provisions for women and children",
    "Article 15(3) of India's Constitution permits the state to make special provisions for women and children.",
    "observation",
  ),
  statement(
    "japan-legal-equality",
    "Japan's Constitution specifies legal equality",
    "Article 14 of Japan's Constitution states that all people are equal under the law and prohibits discrimination in political, economic, or social relations on its listed grounds.",
    "observation",
  ),
  statement(
    "japan-marriage-consent",
    "Japan's Constitution requires mutual consent for marriage",
    "Article 24 of Japan's Constitution states that marriage is based only on the mutual consent of both sexes.",
    "observation",
  ),
  statement(
    "japan-spousal-equality",
    "Japan's Constitution specifies equal spousal rights",
    "Article 24 states that marriage is maintained through mutual cooperation with equal rights of husband and wife as a basis.",
    "observation",
  ),
  statement(
    "japan-rights-drafting-boundary",
    "Japan's rights settlement had an occupation-era drafting context",
    "Nakanishi, Onose, and Kusano trace how Beate Shirota Gordon's occupation-era drafts shaped Articles 24 and 26 alongside Japanese deliberation and revision.",
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
    "attributed-proposal",
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
    "attributed-proposal",
  ),
  statement(
    "cdu-programme-change-boundary",
    "One party changed programs without fixing conservatism",
    "The shift between the CDU's Ahlen and Düsseldorf programs shows change within one party over two postwar years, not a universal definition of conservatism.",
    "editorial-interpretation",
  ),
  statement(
    "bell-rival-liberalism-methods",
    "Bell identifies rival ways to define liberalism",
    "Bell distinguishes prescriptive, comprehensive, and explanatory answers to the question of what liberalism is.",
    "classification",
  ),
  statement(
    "huntington-rival-conservatism-types",
    "Huntington proposes three definitions of conservatism",
    "Huntington distinguishes aristocratic, autonomous, and situational theories of conservatism.",
    "classification",
  ),
  statement(
    "right-to-buy-conservative-programme",
    "Right to Buy was a Conservative program",
    "The House of Commons Library records that Conservative manifestos increasingly committed the party to a statutory Right to Buy before the 1980 enactment.",
    "observation",
  ),
  statement(
    "right-to-buy-purchase-right",
    "Qualifying tenants received a purchase right",
    "Section 1 of the Housing Act 1980 gave qualifying secure tenants the right to buy their dwelling-house.",
    "observation",
  ),
  statement(
    "right-to-buy-discounts",
    "The statute specified purchase discounts",
    "Section 7 of the Housing Act 1980 specified how the tenant's purchase discount was calculated.",
    "observation",
  ),
  statement(
    "right-to-buy-mortgage-duty",
    "Local authorities had a mortgage duty",
    "Section 16 of the Housing Act 1980 required a local authority to provide a mortgage in specified Right to Buy sales.",
    "observation",
  ),
  statement(
    "right-to-buy-ministerial-intervention",
    "The minister could intervene",
    "Section 23 of the Housing Act 1980 empowered the Secretary of State to intervene when a landlord appeared unable or unwilling to complete a Right to Buy sale.",
    "observation",
  ),
  statement(
    "right-to-buy-buyer-distribution",
    "Purchases favored more desirable properties",
    "The House of Commons Library reports that more desirable council properties tended to be bought by relatively affluent tenants.",
    "observation",
  ),
  statement(
    "right-to-buy-residual-sector",
    "The remaining sector had a narrower social base",
    "The House of Commons Library reports that the remaining council sector acquired a narrower and lower-income social base.",
    "observation",
  ),
  statement(
    "right-to-buy-rules-changed",
    "Later legislation changed the 1980 rules",
    "The House of Commons Library records amendments from 1984 through 1996 that changed eligibility, discounts, resale penalties, mortgages, and related purchase schemes.",
    "observation",
  ),
  statement(
    "swatantra-economic-conservatism",
    "Balasubramanian classifies Swatantra's project as economic conservatism",
    "Balasubramanian describes Swatantra's opposition project as a conservative alternative and its free-economy program as economic conservatism in postcolonial India.",
    "classification",
  ),
  statement(
    "swatantra-ordered-progress",
    "Swatantra joined free economy to ordered progress",
    "Balasubramanian finds that the constituencies behind Swatantra sought ordered progress and limits on centralized economic regulation rather than a wholesale rejection of the state.",
    "attributed-value",
  ),
  statement(
    "swatantra-gender-limit",
    "Swatantra's participation remained gendered",
    "Balasubramanian finds that Swatantra's propaganda and organization placed women in subordinate roles even while women worked as organizers and institution builders.",
    "observation",
  ),
  statement(
    "swatantra-coalition-practice",
    "Swatantra built opposition coalitions",
    "Balasubramanian describes Swatantra forming coalitions to oppose Congress power.",
    "observation",
  ),
  statement(
    "swatantra-parliamentary-practice",
    "Swatantra used parliamentary procedure",
    "Balasubramanian describes Swatantra using parliamentary procedure as an opposition practice.",
    "observation",
  ),
  statement(
    "swatantra-court-practice",
    "Swatantra appealed to courts",
    "Balasubramanian describes Swatantra appealing to courts as a check on Congress power.",
    "observation",
  ),
  statement(
    "swatantra-formal-principles",
    "Swatantra adopted a formal statement of principles",
    "Swatantra's preparatory convention adopted twenty-one numbered principles on 1–2 August 1959.",
    "observation",
  ),
  statement(
    "india-liberal-rights-test",
    "India's settlement tests a liberal-rights question",
    "The Indian case tests how formal equality and anti-discrimination rules specify rights often debated within liberal traditions; it does not classify the constitutional settlement as a whole as liberal.",
    "editorial-interpretation",
  ),
  statement(
    "japan-liberal-rights-test",
    "Japan's settlement tests a liberal-rights question",
    "The Japanese case tests how formal equality and marital rights were specified amid divided drafting authority; it does not classify the constitutional settlement as a whole as liberal.",
    "editorial-interpretation",
  ),
  statement(
    "right-to-buy-conservatism-boundary",
    "Right to Buy tests one conservative program",
    "Right to Buy supplies evidence about one documented Conservative Party program and its institutions, not a definition of conservatism or of every conservative housing policy.",
    "editorial-interpretation",
  ),
  statement(
    "swatantra-conservatism-boundary",
    "Swatantra tests one locally grounded classification",
    "Balasubramanian's classification makes Swatantra a bounded test of Indian economic conservatism, while the party's regional coalition and gender hierarchy prevent treating it as a universal conservative model.",
    "classification",
  ),
  statement(
    "liberalism-exclusion-evidence-limit",
    "The exclusion evidence is bounded",
    "The selected evidence supports British-imperial and gender critiques but does not establish comparable claims about racial and class exclusion or supply accounts by excluded people.",
    "editorial-interpretation",
  ),
  statement(
    "liberalism-atlantic-taxonomy-limit",
    "The liberal taxonomy has an Atlantic-language limit",
    "The rival liberal taxonomies are drawn from English-language scholarship, while the India and Japan cases concern formal constitutional rules rather than complete local intellectual histories.",
    "editorial-interpretation",
  ),
  statement(
    "conservatism-genealogy-limit",
    "The conservative taxonomy has a geographic limit",
    "The general taxonomies derive from European and North American debates; Balasubramanian's Indian account supplies one locally grounded classification rather than a universal non-Atlantic definition.",
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
      externalRefs: orientationRefs("India", "Q668"),
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
      externalRefs: orientationRefs("Japan", "Q17"),
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "england-and-wales",
      kind: "place",
      label: "England and Wales",
      description:
        "The geographic boundary used for the England and Wales housing case.",
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
      formalRuleStatementIds: [
        "india-equality-before-law",
        "india-discrimination-grounds",
        "india-special-provisions",
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
      conditionStatementIds: [],
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
        "The bounded drafting-to-commencement interval for selected equality and marriage provisions in the postwar Constitution.",
      caseId: "japan-constitutional-rights-settlement-1946-1947",
      locationIds: ["japan"],
      startDate: { year: 1946, certainty: "exact" },
      endDate: { year: 1947, month: 5, day: 3, certainty: "exact" },
      scope:
        "Articles 14 and 24 and their drafting context; not their full implementation history.",
      conditionStatementIds: [],
      formalRuleStatementIds: [
        "japan-legal-equality",
        "japan-marriage-consent",
        "japan-spousal-equality",
      ],
      ruleInUseStatementIds: [],
      interactionStatementIds: ["japan-rights-drafting-boundary"],
      outcomeStatementIds: [],
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "right-to-buy-england-wales-1980-1998",
      kind: "case",
      label: "Right to Buy in England and Wales, 1980–1998",
      description:
        "An evidence-review interval for a Conservative housing program that began by giving qualifying council tenants purchase rights and was repeatedly amended through the 1990s.",
      locationIds: ["england-and-wales"],
      startDate: { year: 1980, month: 10, day: 3, certainty: "exact" },
      endDate: {
        year: 1998,
        certainty: "approximate",
        note: "The Commons Library paper reports annual sales and stock through the late 1990s; 1998 bounds this review interval rather than a statutory phase.",
      },
      scope:
        "The statutory scheme in England and Wales from commencement through the latest sales and stock figures reviewed in the 1999 Commons Library paper; Scotland had separate legislation, and later policy is excluded.",
      selectionRationale:
        "The episode connects an explicitly documented Conservative program to enacted authority, distributional effects, and a geographic transfer limit without defining conservatism by the program.",
      conditionStatementIds: ["right-to-buy-conservative-programme"],
      episodeIds: ["right-to-buy-initial-operation"],
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "right-to-buy-initial-operation",
      kind: "case-episode",
      label: "Right to Buy evidence review",
      description:
        "The 1980 enacted rules and the report's evidence about later amendments, sales, and the remaining housing sector.",
      caseId: "right-to-buy-england-wales-1980-1998",
      locationIds: ["england-and-wales"],
      startDate: { year: 1980, month: 10, day: 3, certainty: "exact" },
      endDate: {
        year: 1998,
        certainty: "approximate",
        note: "The Commons Library paper reports annual sales and stock through the late 1990s; 1998 bounds this review interval rather than a statutory phase.",
      },
      scope:
        "The formal-rule fields record the enacted 1980 scheme, not unchanged rules through 1998; later amendments remain contextual evidence rather than a Case-slot claim, and no causal estimate separates Right to Buy from falling social-housing investment.",
      conditionStatementIds: ["right-to-buy-conservative-programme"],
      formalRuleStatementIds: [
        "right-to-buy-purchase-right",
        "right-to-buy-discounts",
        "right-to-buy-mortgage-duty",
        "right-to-buy-ministerial-intervention",
      ],
      ruleInUseStatementIds: [],
      interactionStatementIds: [],
      outcomeStatementIds: [
        "right-to-buy-buyer-distribution",
        "right-to-buy-residual-sector",
      ],
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "swatantra-opposition-organization-1959-1967",
      kind: "case",
      label: "Swatantra's opposition organization, 1959–1967",
      description:
        "The formation and early national activity of an Indian opposition party whose leadership described a free economy and which Balasubramanian analyzes as economic conservatism.",
      locationIds: ["india"],
      startDate: { year: 1959, certainty: "exact" },
      endDate: { year: 1967, certainty: "exact" },
      scope:
        "Swatantra's formation and early opposition activity through the 1967 general election; not every member, later party history, or a universal Indian conservatism.",
      selectionRationale:
        "The episode provides a locally grounded, non-Atlantic classification while exposing regional, gender, and organizational differences within a free-economy coalition.",
      conditionStatementIds: [],
      episodeIds: ["swatantra-early-opposition-episode"],
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "swatantra-early-opposition-episode",
      kind: "case-episode",
      label: "Swatantra's early opposition activity",
      description:
        "The party's first eight years of organizing a conservative free-economy alternative within India's parliamentary system.",
      caseId: "swatantra-opposition-organization-1959-1967",
      locationIds: ["india"],
      startDate: { year: 1959, certainty: "exact" },
      endDate: { year: 1967, certainty: "exact" },
      scope:
        "Organizational aims and practices documented in the publisher-authorized introduction; later decline and the full record of parliamentary action remain outside this episode.",
      conditionStatementIds: [],
      formalRuleStatementIds: [],
      ruleInUseStatementIds: ["swatantra-parliamentary-practice"],
      interactionStatementIds: [
        "swatantra-gender-limit",
        "swatantra-coalition-practice",
        "swatantra-court-practice",
      ],
      outcomeStatementIds: [],
      ...reviewed,
    },
  },
] satisfies AuthoringDocument[];
