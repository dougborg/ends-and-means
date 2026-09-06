import type { AuthoringDocument } from "../../../src/lib/domain";

const reviewed = { publicationStatus: "reviewed" as const };
const source = (
  id: string,
  title: string,
  contributors: string[],
  publisher: string,
  sourceType: "web-page" | "report" | "edition",
  url: string,
  publicationYear?: number,
  linkPurpose:
    | "publisher"
    | "library"
    | "authorized-reading"
    | "archive" = "publisher",
  manifestationTitle = title,
  workType?: "book" | "report" | "law" | "constitution" | "other",
  originalPublicationYear?: number,
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
        workType ??
        (sourceType === "report"
          ? "report"
          : sourceType === "edition"
            ? "book"
            : "other"),
      ...(originalPublicationYear ? { originalPublicationYear } : {}),
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: `${id}-source`,
      kind: "source",
      label: manifestationTitle,
      description:
        manifestationTitle === title
          ? `The consulted manifestation of ${title}.`
          : `The consulted manifestation of ${title}: ${manifestationTitle}.`,
      title: manifestationTitle,
      sourceType,
      workId: `${id}-work`,
      contributorDisplay: contributors,
      publisher,
      ...(publicationYear ? { publicationYear } : {}),
      resourceLinks: [
        {
          purpose: linkPurpose,
          url,
          label: "Open the consulted manifestation",
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
    | "attributed-value"
    | "editorial-interpretation" = "observation",
): AuthoringDocument => ({
  documentType: "entity",
  entity: {
    id,
    kind: "statement",
    label,
    description: label,
    text,
    statementKind,
    ...reviewed,
  },
});

export const monarchyEvidenceDocuments = [
  ...source(
    "idea-constitutional-monarchs",
    "Constitutional Monarchs in Parliamentary Democracies",
    ["Elliot Bulmer"],
    "International IDEA",
    "report",
    "https://www.idea.int/sites/default/files/publications/constitutional-monarchs-in-parliamentary-democracies-primer.pdf",
    2017,
    "publisher",
    "Constitutional Monarchs in Parliamentary Democracies (second edition, 2017)",
    "report",
    2014,
  ),
  ...source(
    "sep-colonialism-monarchy-boundaries",
    "Colonialism",
    ["Margaret Kohn", "Kavita Reddy"],
    "Stanford Encyclopedia of Philosophy",
    "web-page",
    "https://plato.stanford.edu/entries/colonialism/",
    2023,
    "publisher",
    "Colonialism (2023 substantive revision)",
    "other",
    2006,
  ),
  ...source(
    "oxford-nobility-definition",
    "Oxford Advanced Learner's Dictionary entry: nobility",
    ["Oxford University Press"],
    "Oxford University Press",
    "web-page",
    "https://www.oxfordlearnersdictionaries.com/us/definition/english/nobility",
  ),
  {
    documentType: "entity",
    entity: {
      id: "japan-constitution-moj-source",
      kind: "source",
      label: "The Constitution of Japan (government reference translation)",
      description:
        "Japanese Law Translation publishes the Constitution's Japanese text alongside a non-authoritative English reference translation; its disclaimer states that only the Japanese originals have legal effect.",
      title: "The Constitution of Japan",
      sourceType: "web-page",
      workId: "japan-constitution-work",
      contributorDisplay: ["Government of Japan"],
      publisher: "Ministry of Justice, Japan",
      resourceLinks: [
        {
          purpose: "publisher",
          url: "https://www.japaneselawtranslation.go.jp/en/laws/view/174",
          label: "Open the government reference translation",
        },
      ],
      ...reviewed,
    },
  },
  ...source(
    "japan-imperial-house-law",
    "Imperial House Act",
    ["National Diet of Japan"],
    "Digital Agency, Government of Japan (e-Gov)",
    "web-page",
    "https://laws.e-gov.go.jp/document?lawid=322AC0000000003",
    undefined,
    "publisher",
    "Imperial House Act (e-Gov Japanese text)",
    "law",
    1947,
  ),
  ...source(
    "shugiin-emperor-study",
    "The Emperor System",
    ["Research Commission on the Constitution"],
    "House of Representatives, Japan",
    "report",
    "https://www.shugiin.go.jp/Internet/itdb_kenpou.nsf/html/kenpou/chosa/en/20040205sl.htm",
    2004,
    "publisher",
    "The Emperor System",
    "report",
    2004,
  ),
  ...source(
    "tonga-constitution-constitute",
    "Tonga's Constitution of 1875 with Amendments through 2013",
    ["Kingdom of Tonga"],
    "Constitute Project",
    "web-page",
    "https://www.constituteproject.org/constitution/Tonga_2013.pdf",
    2022,
    "authorized-reading",
    "Tonga 1875 (rev. 2013), Constitute PDF generated 27 April 2022",
    "constitution",
    1875,
  ),
  ...source(
    "tonga-crown-law-prime-minister-2010",
    "Status of Current Ministers",
    ["Crown Law Department, Kingdom of Tonga"],
    "Attorney General's Office, Kingdom of Tonga",
    "web-page",
    "https://ago.gov.to/cms/ago-materials/publications/media-statements.html?download=172%3Apress-release-24-december-2010&start=20",
    2010,
    "publisher",
    "Status of Current Ministers (24 December 2010 media release)",
    "other",
    2010,
  ),
  ...source(
    "saudi-basic-law",
    "Basic Law of Governance (1992, amendments through 2005)",
    ["Kingdom of Saudi Arabia"],
    "Constitute Project",
    "web-page",
    "https://www.constituteproject.org/constitution/Saudi_Arabia_2005.pdf?lang=en",
    2026,
    "authorized-reading",
    "Saudi Arabia 1992 (rev. 2005), Constitute PDF generated 30 June 2026",
    "law",
    1992,
  ),
  ...source(
    "spa-2022-prime-minister-order",
    "Three Royal Orders Issued",
    ["Saudi Press Agency"],
    "Saudi Press Agency",
    "web-page",
    "https://www.spa.gov.sa/2387811",
    2022,
    "publisher",
    "Three Royal Orders Issued",
    "other",
    2022,
  ),
  ...source(
    "loc-saudi-country-study",
    "Saudi Arabia: A Country Study",
    ["Helen Chapin Metz"],
    "Library of Congress",
    "edition",
    "https://tile.loc.gov/storage-services/master/frd/frdcstdy/sa/saudiarabiacount00metz_0/saudiarabiacount00metz_0.pdf",
    1993,
    "library",
    "Saudi Arabia: A Country Study (1993 edition)",
    "book",
    1993,
  ),
  ...source(
    "herb-all-in-family",
    "All in the Family: Absolutism, Revolution, and Democracy in Middle Eastern Monarchies",
    ["Michael Herb"],
    "State University of New York Press",
    "edition",
    "https://michaelherb.net/aitf01.pdf",
    1999,
    "authorized-reading",
    "All in the Family, chapter 1 extract",
    "book",
    1999,
  ),

  {
    documentType: "entity",
    entity: {
      id: "monarchy",
      kind: "concept",
      label: "Monarchy",
      description:
        "A governmental form organized around a continuing monarchic office whose succession, legal authority, practical power, and public meaning vary.",
      schemeIds: ["political-economic-ideas"],
      scopeNote:
        "Do not infer heredity, personal rule, authoritarianism, sacred legitimacy, empire, nobility, or ceremonial powerlessness from the existence of a monarch.",
      externalRefs: [
        {
          system: "wikipedia",
          url: "https://en.wikipedia.org/wiki/Monarchy",
          purpose: "orientation",
          language: "en",
          checkedAt: "2026-09-06",
        },
        {
          system: "wikidata",
          id: "Q7269",
          url: "https://www.wikidata.org/wiki/Q7269",
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
      id: "monarchism",
      kind: "concept",
      label: "Monarchism",
      description:
        "A family of arguments or movements favoring monarchy, distinct from the existence of a monarchic office.",
      schemeIds: ["political-economic-ideas"],
      scopeNote:
        "A monarchy need not express one monarchist doctrine, and a monarchist position is not itself a governmental office.",
      externalRefs: [
        {
          system: "wikipedia",
          url: "https://en.wikipedia.org/wiki/Monarchism",
          purpose: "orientation",
          language: "en",
          checkedAt: "2026-09-06",
        },
        {
          system: "wikidata",
          id: "Q216669",
          url: "https://www.wikidata.org/wiki/Q216669",
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
      id: "monarchic-succession",
      kind: "concept",
      label: "Monarchic succession",
      description:
        "Rules and practices for selecting the next holder of a monarchic office.",
      schemeIds: ["political-economic-ideas"],
      scopeNote:
        "Keep hereditary, elective, rotational, designated, and disputed succession independently visible.",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "theocracy",
      kind: "concept",
      label: "Theocracy",
      description:
        "A contested classification for government in which religious authority or divine law has a governing institutional role.",
      schemeIds: ["political-economic-ideas"],
      scopeNote:
        "Do not infer theocracy from sacred legitimation, an established religion, or religious language without specifying the governing institutions and definition used.",
      externalRefs: [
        {
          system: "wikipedia",
          url: "https://en.wikipedia.org/wiki/Theocracy",
          purpose: "orientation",
          language: "en",
          checkedAt: "2026-09-06",
        },
        {
          system: "wikidata",
          id: "Q44405",
          url: "https://www.wikidata.org/wiki/Q44405",
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
      id: "executive-authority",
      kind: "concept",
      label: "Executive authority",
      description:
        "Authority to direct or administer government, allocated differently across constitutional and practical arrangements.",
      schemeIds: ["political-economic-ideas"],
      scopeNote:
        "Separate formal grants, delegated official acts, reserve powers, and authority exercised in practice.",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "legislative-accountability",
      kind: "concept",
      label: "Legislative accountability",
      description:
        "Arrangements by which ministers or other officeholders answer to, retain the confidence of, or may be removed through a legislature.",
      schemeIds: ["political-economic-ideas"],
      scopeNote:
        "Formal responsibility rules do not alone establish competitive elections or effective scrutiny.",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "constitutional-parliamentary-monarchy",
      kind: "approach",
      label: "Constitutional parliamentary monarchy",
      description:
        "A configuration in which a monarch serves as head of state while ministers responsible to a legislature conduct government.",
      scope:
        "A formal constitutional arrangement; it does not by itself establish democratic competition, practical powerlessness, or one British-derived convention.",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "executive-dynastic-monarchy",
      kind: "approach",
      label: "Executive dynastic monarchy",
      description:
        "A configuration in which a ruling dynasty staffs important offices and the monarch retains governing authority.",
      scope:
        "Herb's analysis of selected dynastic monarchies, not a classification inherited by every monarchy or dynasty.",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "tonga",
      kind: "place",
      label: "Tonga",
      description:
        "The geographic boundary for the Tongan constitutional settlement case.",
      placeType: "country",
      externalRefs: [
        {
          system: "wikipedia",
          url: "https://en.wikipedia.org/wiki/Tonga",
          purpose: "orientation",
          language: "en",
          checkedAt: "2026-09-06",
        },
        {
          system: "wikidata",
          id: "Q678",
          url: "https://www.wikidata.org/wiki/Q678",
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
      id: "saudi-arabia",
      kind: "place",
      label: "Saudi Arabia",
      description: "The geographic boundary for the Saudi Basic Law case.",
      placeType: "country",
      externalRefs: [
        {
          system: "wikipedia",
          url: "https://en.wikipedia.org/wiki/Saudi_Arabia",
          purpose: "orientation",
          language: "en",
          checkedAt: "2026-09-06",
        },
        {
          system: "wikidata",
          id: "Q851",
          url: "https://www.wikidata.org/wiki/Q851",
          purpose: "identity",
          match: "exact",
          checkedAt: "2026-09-06",
        },
      ],
      ...reviewed,
    },
  },

  claim(
    "monarchy-office-form-definition",
    "A monarchic office does not settle succession or practical power",
    "A monarchic head-of-state office can be analyzed separately from succession, formal authority, and practical power; International IDEA supplies evidence only for the narrower parliamentary-constitutional comparison.",
    "editorial-interpretation",
  ),
  claim(
    "monarchy-heredity-boundary",
    "Hereditary succession is not definitional",
    "International IDEA distinguishes hereditary monarchy from arrangements in which a monarch is selected or confirmed by another procedure.",
    "definition",
  ),
  claim(
    "monarchy-succession-varies",
    "Succession rules vary",
    "Within its limited survey, International IDEA contrasts hereditary succession with Malaysia's selection and rotation among state rulers and nomination of a crown prince in some Arab states.",
    "definition",
  ),
  claim(
    "monarchy-head-roles-boundary",
    "Head-of-state and head-of-government roles differ",
    "In a parliamentary monarchy, the monarch holds the head-of-state office while a prime minister and cabinet conduct government and answer through political institutions.",
    "definition",
  ),
  claim(
    "monarchy-formal-practice-boundary",
    "Legal powers and rules in use differ",
    "A constitution's grant of formal authority does not establish how often a monarch exercises it, whether ministers direct the act, or what informal influence accompanies it.",
    "editorial-interpretation",
  ),
  claim(
    "monarchy-reserve-delegated-boundary",
    "Reserve and delegated acts need separate analysis",
    "International IDEA distinguishes powers ordinarily exercised on ministerial advice from limited situations in which a constitutional monarch may act with discretion.",
    "definition",
  ),
  claim(
    "monarchy-democracy-boundary",
    "Monarchy does not determine democracy",
    "The presence of a monarch does not establish either democratic accountability or its absence; selection, competition, rights, and ministerial responsibility require separate evidence.",
    "editorial-interpretation",
  ),
  claim(
    "monarchy-authoritarian-boundary",
    "A crown does not establish authoritarianism",
    "A monarchic form and an authoritarian regime classification answer different questions and must not be inferred from one another.",
    "editorial-interpretation",
  ),
  claim(
    "monarchy-theocracy-boundary",
    "Sacred legitimation is not theocracy",
    "Religious status or sacred language attached to a monarch does not by itself establish that clerical institutions govern or that religious law controls every public authority.",
    "editorial-interpretation",
  ),
  claim(
    "monarchy-republic-boundary",
    "Monarchy and republic identify different head-of-state choices",
    "For parliamentary constitution-building, International IDEA frames hereditary monarchy and an elected presidency as alternative choices for the head-of-state office, while warning that historical and political context shapes that choice.",
    "editorial-interpretation",
  ),
  claim(
    "japan-emperor-symbol-rule",
    "Japan's Constitution defines the Emperor as symbol",
    "Article 1 of Japan's Constitution defines the Tennō (天皇), rendered 'Emperor' in the government-hosted English reference translation, as the symbol of the State and of the unity of the people, deriving his position from the people's will; only the Japanese original has legal effect.",
    "observation",
  ),
  claim(
    "japan-constitution-commencement",
    "Japan's Constitution commenced on 3 May 1947",
    "The government-hosted text identifies the Constitution as dated 3 November 1946, and Article 100 provides that it would be enforced after six months had elapsed from promulgation, fixing commencement on 3 May 1947.",
    "observation",
  ),
  claim(
    "japan-emperor-no-government-powers",
    "Japan's Emperor has no governmental powers",
    "Article 4 limits the Emperor to acts in matters of state provided by the Constitution and states that he has no powers related to government.",
    "observation",
  ),
  claim(
    "japan-emperor-cabinet-advice",
    "Cabinet advice and approval govern state acts",
    "Article 3 requires Cabinet advice and approval for the Emperor's acts in matters of state and makes the Cabinet responsible for them.",
    "observation",
  ),
  claim(
    "japan-emperor-enumerated-acts",
    "Japan enumerates the Emperor's state acts",
    "Articles 6 and 7 assign appointment and promulgation, convocation, dissolution, attestation, honors, and ceremonial functions to the Emperor under the Constitution's stated conditions.",
    "observation",
  ),
  claim(
    "japan-succession-male-line",
    "Japan's statute restricts succession to male-line males",
    "Article 1 of the Japanese text of the Imperial House Act limits succession to male offspring in the male line belonging to the Imperial Lineage; the project supplies this English paraphrase rather than claiming an official translation.",
    "observation",
  ),
  claim(
    "japan-practice-influence-question",
    "Japan's Emperor performs constitutionally disputed public acts",
    "The House of Representatives commission digest reports Prof. Yokota's view that the Emperor performs public acts beyond acts in matters of state, while warning of expansion or political exploitation; this does not establish a separate constitutional governing power.",
    "observation",
  ),
  claim(
    "tonga-2013-assembly-composition",
    "Tonga's 2013 consolidation specifies the Assembly's composition",
    "Clauses 59 and 60 of Tonga's amended Constitution provide for an Assembly composed of Cabinet members, seventeen people's representatives, and nine nobles' representatives.",
    "observation",
  ),
  claim(
    "tonga-king-appoints-pm",
    "Tonga's King appoints the nominated prime minister",
    "The amended Constitution provides for the Legislative Assembly to recommend one of its elected representatives for appointment as Prime Minister by the King.",
    "observation",
  ),
  claim(
    "tonga-retained-royal-formal-powers",
    "Tonga retains royal constitutional functions",
    "Clause 50 of Tonga's Constitution establishes a Privy Council to advise the King and provides for its members to be appointed by the King.",
    "observation",
  ),
  claim(
    "tonga-cabinet-executive-design",
    "Tonga's Constitution assigns executive authority to Cabinet",
    "Clauses 50A and 51 constitute a Cabinet led by a Prime Minister recommended by the Legislative Assembly and describe Cabinet as the executive authority of government.",
    "observation",
  ),
  claim(
    "tonga-2010-government-formation",
    "Tonga's King appointed a Prime Minister recommended by the Assembly in 2010",
    "On 22 December 2010, King George Tupou V appointed Lord Tu'ivakano Prime Minister on the recommendation of the Legislative Assembly.",
    "observation",
  ),
  claim(
    "tonga-record-mediation-boundary",
    "The English constitutional record has a mediated history",
    "The consulted English consolidation does not identify its translator or textual provenance, so its English institutional labels should not be assumed to exhaust Tongan meanings without comparison to versioned Tongan texts.",
    "editorial-interpretation",
  ),
  claim(
    "saudi-monarchy-basic-law",
    "Saudi Arabia's Basic Law declares a monarchy",
    "Article 5(a) of the consulted English consolidation of the 1992 Basic Law states that the system of government in the Kingdom of Saudi Arabia is a monarchy.",
    "observation",
  ),
  claim(
    "saudi-succession-designation",
    "The Basic Law bounds succession to the founder's descendants",
    "Article 5(b) confines rule to the sons and descendants of the founder and provides for allegiance to the most suitable among them.",
    "observation",
  ),
  claim(
    "saudi-crown-prince-designation",
    "The King designates the Crown Prince",
    "Article 5(c) provides that the King names the Crown Prince and may relieve him by royal order.",
    "observation",
  ),
  claim(
    "saudi-basic-law-king-prime-minister-clause",
    "The Basic Law names the King as Prime Minister",
    "Articles 55 and 56 of the consulted Basic Law consolidation assign the King supervision of general state policy and state that the King shall be Prime Minister.",
    "observation",
  ),
  claim(
    "saudi-2022-crown-prince-prime-minister",
    "A 2022 royal order appointed the Crown Prince as Prime Minister",
    "On 27 September 2022, a royal order appointed Crown Prince Mohammed bin Salman as Prime Minister as an express exception to Article 56, while reserving the King's chairing of Cabinet sessions he attends.",
    "observation",
  ),
  claim(
    "saudi-religious-law-rule",
    "The Basic Law grounds government in Islamic sources",
    "Articles 1 and 7 identify the Qur'an and Sunnah as the state's constitution and the source of governmental authority.",
    "observation",
  ),
  claim(
    "saudi-theocracy-classification-boundary",
    "Religious grounding does not settle a theocracy classification",
    "The Basic Law's religious grounding is evidence about stated legal authority, but classifying Saudi government as theocracy also requires a definition and evidence about which institutions interpret and exercise that authority.",
    "editorial-interpretation",
  ),
  claim(
    "saudi-dynastic-rules-in-use",
    "Herb defines dynastic monarchy by family participation in government",
    "Herb characterizes dynastic monarchy by the ruling family's broad participation in government, including family members serving in cabinet and other senior state offices.",
    "observation",
  ),
  claim(
    "saudi-ruling-family-institution-herb",
    "Herb places Saudi Arabia among family-governed monarchies",
    "Herb includes Saudi Arabia among monarchies organized through extensive ruling-family participation, rather than systems in which a monarch governs without relatives in cabinet.",
    "observation",
  ),
  claim(
    "three-cases-nonrepresentative",
    "Constitutional-monarchy design varies by context",
    "International IDEA treats the design of a parliamentary constitutional monarchy as context-dependent and presents its examples as distinct institutional choices rather than one universal settlement.",
    "editorial-interpretation",
  ),
  claim(
    "monarchy-empire-boundary",
    "Empire concerns domination across territories",
    "The Stanford Encyclopedia of Philosophy describes imperialism in terms of political and economic control over dependent territory; that territorial relation is distinct from whether a polity's head of state is a monarch.",
    "definition",
  ),
  claim(
    "monarchy-colonial-rule-boundary",
    "Colonial rule concerns domination of one people by another",
    "The Stanford Encyclopedia of Philosophy defines colonialism as domination involving one people's subjugation by another; the existence of a monarch does not by itself establish that relationship.",
    "definition",
  ),
  claim(
    "monarchy-nobility-boundary",
    "Nobility names a titled social group",
    "Oxford Advanced Learner's Dictionary defines the nobility as people of high social position bearing titles such as duke or duchess; that social category is not the monarchic office itself.",
    "definition",
  ),

  {
    documentType: "entity",
    entity: {
      id: "japan-symbolic-emperorship-1947-2004",
      kind: "case",
      label: "Japan under the 1947 Constitution",
      description:
        "A bounded record of Japan's monarchic office under the Constitution effective 3 May 1947; present-day completeness requires review.",
      locationIds: ["japan"],
      startDate: { year: 1947, month: 5, day: 3, certainty: "exact" },
      endDate: { year: 2004, certainty: "exact" },
      scope:
        "The constitutional design and documented public practice of the Emperor's office in the consulted 1947–2004 evidence record; not prewar imperial government, later institutional continuity, or a general classification of Japanese politics.",
      selectionRationale:
        "Separates a hereditary office and civic symbolism from governmental power while keeping statutory succession and public practice visible.",
      conditionStatementIds: [
        "japan-constitution-commencement",
        "japan-emperor-symbol-rule",
      ],
      episodeIds: ["japan-symbolic-emperorship-episode"],
      asOf: "2026-09-06",
      lastReviewedAt: "2026-09-06",
      freshness: "review-needed",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "japan-symbolic-emperorship-episode",
      kind: "case-episode",
      label: "Postwar symbolic emperorship evidence, 1947–2004",
      description:
        "The constitutional episode beginning when Japan's postwar Constitution took effect.",
      caseId: "japan-symbolic-emperorship-1947-2004",
      locationIds: ["japan"],
      startDate: { year: 1947, month: 5, day: 3, certainty: "exact" },
      endDate: { year: 2004, certainty: "exact" },
      scope:
        "Selected formal state acts, succession law, and documented performance of the symbolic office; not a current institutional census.",
      conditionStatementIds: [
        "japan-constitution-commencement",
        "japan-emperor-symbol-rule",
      ],
      formalRuleStatementIds: [
        "japan-emperor-no-government-powers",
        "japan-emperor-cabinet-advice",
        "japan-emperor-enumerated-acts",
        "japan-succession-male-line",
      ],
      ruleInUseStatementIds: ["japan-practice-influence-question"],
      interactionStatementIds: [],
      outcomeStatementIds: [],
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "tonga-constitutional-settlement-2010-2013",
      kind: "case",
      label: "Tonga's 2010 constitutional settlement",
      description:
        "A bounded record of Tonga's 2010 constitutional reform and election; later operation requires review.",
      locationIds: ["tonga"],
      startDate: { year: 2010, certainty: "exact" },
      endDate: { year: 2013, certainty: "exact" },
      scope:
        "The distribution of authority among the King, Cabinet, and Legislative Assembly after the 2010 reform; not all Tongan political or constitutional history.",
      selectionRationale:
        "Shows a specified mixed Assembly composition, Assembly recommendation of a prime minister, and retained royal functions without inferring later operation.",
      conditionStatementIds: ["tonga-record-mediation-boundary"],
      episodeIds: ["tonga-post-reform-monarchy-episode"],
      asOf: "2026-09-06",
      lastReviewedAt: "2026-09-06",
      freshness: "review-needed",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "tonga-post-reform-monarchy-episode",
      kind: "case-episode",
      label: "Tongan reform evidence, 2010–2013",
      description:
        "The evidence-bounded episode from Tonga's 2010 reform through the consulted 2013 constitutional consolidation.",
      caseId: "tonga-constitutional-settlement-2010-2013",
      locationIds: ["tonga"],
      startDate: { year: 2010, certainty: "exact" },
      endDate: { year: 2013, certainty: "exact" },
      scope:
        "The 2010 appointment and formal design in the constitutional consolidation through 2013; no claim about later operation.",
      conditionStatementIds: ["tonga-record-mediation-boundary"],
      formalRuleStatementIds: [
        "tonga-king-appoints-pm",
        "tonga-retained-royal-formal-powers",
        "tonga-cabinet-executive-design",
        "tonga-2013-assembly-composition",
      ],
      ruleInUseStatementIds: ["tonga-2010-government-formation"],
      interactionStatementIds: [],
      outcomeStatementIds: [],
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "saudi-basic-law-monarchy-1992-2022",
      kind: "case",
      label: "Saudi Arabia under the 1992 Basic Law",
      description:
        "A bounded record of the 1992 Basic Law consolidation and the September 2022 prime-minister exception; later amendments require review.",
      locationIds: ["saudi-arabia"],
      startDate: { year: 1992, month: 3, day: 1, certainty: "exact" },
      endDate: { year: 2022, month: 9, day: 27, certainty: "exact" },
      scope:
        "The Basic Law's formal allocation of monarchy, succession, executive authority, and religious legal grounding, the 2022 prime-minister exception, and Herb's bounded analytical definition; not every Saudi institution or later decree.",
      selectionRationale:
        "Contrasts an executive dynastic monarchy with parliamentary and symbolic arrangements without deriving authoritarianism or theocracy from the crown.",
      conditionStatementIds: [
        "saudi-monarchy-basic-law",
        "saudi-religious-law-rule",
      ],
      episodeIds: ["saudi-basic-law-monarchy-episode"],
      asOf: "2026-09-06",
      lastReviewedAt: "2026-09-06",
      freshness: "review-needed",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "saudi-basic-law-monarchy-episode",
      kind: "case-episode",
      label: "Basic Law evidence, 1992–2022",
      description:
        "The evidence-bounded episode from the 1992 Basic Law through the September 2022 royal order.",
      caseId: "saudi-basic-law-monarchy-1992-2022",
      locationIds: ["saudi-arabia"],
      startDate: { year: 1992, month: 3, day: 1, certainty: "exact" },
      endDate: { year: 2022, month: 9, day: 27, certainty: "exact" },
      scope:
        "The consulted 2005 Basic Law consolidation, Herb's 1999 analytical definition, and the September 2022 royal order; not a current consolidation.",
      conditionStatementIds: ["saudi-monarchy-basic-law"],
      formalRuleStatementIds: [
        "saudi-succession-designation",
        "saudi-crown-prince-designation",
        "saudi-basic-law-king-prime-minister-clause",
        "saudi-religious-law-rule",
      ],
      ruleInUseStatementIds: ["saudi-2022-crown-prince-prime-minister"],
      interactionStatementIds: ["saudi-theocracy-classification-boundary"],
      outcomeStatementIds: [],
      ...reviewed,
    },
  },
] satisfies AuthoringDocument[];
