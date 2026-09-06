import type { AuthoringDocument } from "../../../src/lib/domain";

const reviewed = { publicationStatus: "reviewed" as const };

const source = (
  id: string,
  title: string,
  contributors: string[],
  publisher: string,
  sourceType: "web-page" | "report" | "article" | "edition",
  url: string,
  publicationYear?: number,
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
        sourceType === "report"
          ? "report"
          : sourceType === "article"
            ? "article"
            : sourceType === "edition"
              ? "book"
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
      description: `The consulted source for the Democracy and Republic guides: ${title}.`,
      title,
      sourceType,
      workId: `${id}-work`,
      contributorDisplay: contributors,
      ...(publicationYear === undefined ? {} : { publicationYear }),
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

export const democracyRepublicEvidenceDocuments = [
  ...source(
    "sep-democracy",
    "Democracy",
    ["Tom Christiano", "Sameer Bajaj"],
    "Stanford Encyclopedia of Philosophy",
    "web-page",
    "https://plato.stanford.edu/entries/democracy/",
    2024,
    2006,
  ),
  ...source(
    "idea-democracy-indices-methodology",
    "The Global State of Democracy Indices Methodology, Version 10",
    ["Svend-Erik Skaaning", "Alexander Hudson"],
    "International IDEA",
    "report",
    "https://www.idea.int/publications/catalogue/global-state-democracy-indices-methodology-conceptualization-and-measurement",
    2026,
    2026,
  ),
  ...source(
    "sep-republicanism",
    "Republicanism",
    ["Frank Lovett"],
    "Stanford Encyclopedia of Philosophy",
    "web-page",
    "https://plato.stanford.edu/entries/republicanism/",
    2026,
    2006,
  ),
  ...source(
    "federalist-39",
    "The Federalist No. 39",
    ["James Madison"],
    "Founders Online, National Archives",
    "web-page",
    "https://founders.archives.gov/documents/Madison/01-10-02-0234",
    undefined,
    1788,
  ),
  ...source(
    "india-constitution",
    "The Constitution of India",
    ["Constituent Assembly of India"],
    "Legislative Department, Ministry of Law and Justice, Government of India",
    "web-page",
    "https://www.legislative.gov.in/constitution-of-india/",
    2024,
    1949,
  ),
  ...source(
    "us-constitution",
    "Constitution of the United States: A Transcription",
    ["Constitutional Convention"],
    "National Archives and Records Administration",
    "web-page",
    "https://www.archives.gov/founding-docs/constitution-transcript",
    undefined,
    1787,
  ),
  ...source(
    "nabulsi-republicanism",
    "Republicanism",
    ["Karma Nabulsi"],
    "Oxford University Press",
    "article",
    "https://academic.oup.com/edited-volume/34508/chapter-abstract/292823540",
    2011,
    2011,
  ),
  ...source(
    "keyssar-right-to-vote",
    "The Right to Vote: The Contested History of Democracy in the United States",
    ["Alexander Keyssar"],
    "Basic Books",
    "edition",
    "https://www.basicbooks.com/titles/alexander-keyssar/the-right-to-vote/9780465010141/",
    2009,
    2000,
  ),
  ...source(
    "khosla-indias-founding-moment",
    "India's Founding Moment",
    ["Madhav Khosla"],
    "Harvard University Press",
    "edition",
    "https://www.hup.harvard.edu/books/9780674980877",
    2020,
    2020,
  ),
  {
    documentType: "entity",
    entity: {
      id: "democratic-traditions",
      kind: "collection",
      label: "Democratic traditions",
      description:
        "An editorial grouping of approaches that explicitly interpret democracy.",
      inclusionRule:
        "Include an Approach only through an explicit, sourced, qualified membership relationship.",
      editorialPurpose:
        "Support comparison without inheriting democratic Ends, Means, or performance claims.",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "democratic-selection-means",
      kind: "collection",
      label: "Democratic selection means",
      description:
        "An editorial grouping of distinct procedures used to select public decision-makers.",
      inclusionRule:
        "Include only a concrete Means with located evidence connecting its selection rule to democratic institutional debate.",
      editorialPurpose:
        "Compare electoral and random selection without treating either as sufficient proof of democracy.",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "republican-traditions",
      kind: "collection",
      label: "Republican traditions",
      description:
        "An editorial grouping of historically contested republican approaches.",
      inclusionRule:
        "Include an Approach only through an explicit, sourced, qualified membership relationship.",
      editorialPurpose:
        "Keep republican traditions distinct from states bearing a republic label.",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "neo-republican-nondomination",
      kind: "approach",
      label: "Neo-republican non-domination",
      description:
        "A contemporary republican approach that treats freedom as protection from arbitrary or uncontrolled power.",
      scope:
        "The contemporary non-domination approach synthesized by Lovett; not every historical republican argument or republic.",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "democracy",
      kind: "concept",
      label: "Democracy",
      description:
        "A contested concept used for political equality, collective self-government, decision procedures, institutional systems, and measured features.",
      schemeIds: ["political-economic-ideas"],
      scopeNote:
        "Do not infer democratic practice from a constitutional label, an election, or one participatory institution.",
      externalRefs: [
        {
          system: "wikipedia",
          url: "https://en.wikipedia.org/wiki/Democracy",
          purpose: "orientation",
          language: "en",
          checkedAt: "2026-09-06",
        },
        {
          system: "wikidata",
          id: "Q7174",
          url: "https://www.wikidata.org/wiki/Q7174",
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
      id: "republic",
      kind: "concept",
      label: "Republic",
      description:
        "A contested constitutional and governmental-form concept often contrasted with hereditary monarchy.",
      schemeIds: ["political-economic-ideas"],
      scopeNote:
        "Keep a republic, republican traditions, democratic procedures, attributed popular sovereignty, and measured practice distinct.",
      externalRefs: [
        {
          system: "wikipedia",
          url: "https://en.wikipedia.org/wiki/Republic",
          purpose: "orientation",
          language: "en",
          checkedAt: "2026-09-06",
        },
        {
          system: "wikidata",
          id: "Q7270",
          url: "https://www.wikidata.org/wiki/Q7270",
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
      id: "representative-democratic-government",
      kind: "approach",
      label: "Representative democratic government",
      description:
        "An approach in which voters choose representatives to exercise public authority.",
      scope:
        "Representative electoral arrangements; not a synonym for democracy, accountability, or every elected government.",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "equal-political-standing",
      kind: "end",
      label: "Equal political standing",
      description:
        "An attributed democratic aim that people subject to collective rules should count as political equals.",
      scope:
        "An aim defended in public-equality accounts of democracy, not an automatically observed outcome.",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "freedom-as-nondomination",
      kind: "end",
      label: "Freedom as non-domination",
      description:
        "An attributed republican aim of protection from uncontrolled or arbitrary power.",
      scope:
        "A prominent neo-republican account of freedom, not the sole historical meaning of republic or liberty.",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "electoral-representation",
      kind: "means",
      label: "Electoral representation",
      description:
        "A procedure in which voters choose people to exercise specified public authority.",
      institutionalForm:
        "Voters select representatives who make public decisions under an electoral arrangement.",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "sortition-deliberative-minipublic",
      kind: "means",
      label: "Selection by lot",
      description:
        "A procedure that selects people by lot for a defined public role.",
      institutionalForm:
        "Eligible participants have an equal chance of random selection for a specified role.",
      externalRefs: [
        {
          system: "wikipedia",
          url: "https://en.wikipedia.org/wiki/Sortition",
          purpose: "orientation",
          language: "en",
          checkedAt: "2026-09-06",
        },
        {
          system: "wikidata",
          id: "Q70196",
          url: "https://www.wikidata.org/wiki/Q70196",
          purpose: "identity",
          match: "exact",
          checkedAt: "2026-09-06",
        },
      ],
      ...reviewed,
    },
  },
  statement(
    "democracy-usage-plural",
    "Democracy has several uses",
    "Democracy is used for ideals, decision procedures, institutional arrangements, and assessments of political systems.",
    "definition",
  ),
  statement(
    "democracy-public-equality-end",
    "Public equality is one democratic justification",
    "Christiano and Bajaj present public equality as one justification for democratic decision-making.",
    "attributed-value",
  ),
  statement(
    "democracy-voting-boundary",
    "A vote does not establish political equality",
    "Holding a vote does not by itself establish that citizens had an equal say in the decision process.",
    "editorial-interpretation",
  ),
  statement(
    "democracy-representation-mechanism",
    "Representation assigns decisions to chosen officeholders",
    "Electoral representation assigns public decisions to officeholders selected by voters.",
    "definition",
  ),
  statement(
    "democracy-sortition-alternative",
    "Sortition supplies a different selection rule",
    "Sortition selects participants by lot rather than by election.",
    "definition",
  ),
  statement(
    "democracy-measurement-selection",
    "Democracy measures select attributes",
    "International IDEA measures democracy through separately constructed attributes and indicators rather than treating a country's constitutional name as a score.",
    "observation",
  ),
  statement(
    "democracy-kahnawake-boundary",
    "Community participation has its own institutional history",
    "Kahnawà:ke's contemporary law-making process combines community-specific Haudenosaunee principles with elected-council and legislative institutions.",
    "observation",
  ),
  statement(
    "democracy-majority-limit",
    "Majority authorization has limits",
    "Democratic authority remains disputed when a majority decision denies the equal standing or basic rights of those subject to it.",
    "editorial-interpretation",
  ),
  statement(
    "republic-form-boundary",
    "Republic is often contrasted with monarchy",
    "Nabulsi describes opposition to monarchy as a common, but not sufficient, feature of republican traditions.",
    "definition",
  ),
  statement(
    "republic-democracy-distinction",
    "A republic label does not establish inclusive citizenship",
    "Calling a government a republic does not establish that citizenship or political participation is inclusive.",
    "editorial-interpretation",
  ),
  statement(
    "republicanism-tradition-boundary",
    "Republicanism is not the same as republic",
    "Republicanism names traditions of political argument, while republic can name a governmental or constitutional form.",
    "definition",
  ),
  statement(
    "republic-nondomination-end",
    "Non-domination is one republican end",
    "Lovett identifies freedom from arbitrary or uncontrolled power as a central concern of contemporary republican theory.",
    "attributed-value",
  ),
  statement(
    "madison-republic-popular-source",
    "Madison located republican authority in the people",
    "Madison argued that republican power must originate in the broader public rather than a small favored class.",
    "attributed-value",
  ),
  statement(
    "us-republic-elector-boundary",
    "Popular selection did not mean universal suffrage",
    "The 1787 United States Constitution left House elector qualifications tied to each state's qualifications for its most numerous legislative branch rather than establishing universal suffrage.",
    "observation",
  ),
  statement(
    "india-democratic-republic-preamble",
    "India's Preamble uses democratic and republic together",
    "The Constitution of India's Preamble describes India as a democratic republic.",
    "observation",
  ),
  statement(
    "india-adult-suffrage-rule",
    "India's Constitution separately specifies adult suffrage",
    "Article 326 establishes adult suffrage as the basis for elections to the House of the People and state legislative assemblies, subject to its stated qualifications.",
    "observation",
  ),
  statement(
    "kahnawake-cdmrp-bridge",
    "Horn-Miller describes the CDMRP as a bridge",
    "Horn-Miller describes Kahnawà:ke's law-making process as a community-specific bridge between Haudenosaunee and elected-council systems.",
    "observation",
  ),
  statement(
    "republic-kahnawake-transfer-limit",
    "The guide does not impose a republic classification",
    "This guide uses the Kahnawà:ke process to compare participation while withholding the externally imposed classification of republic.",
    "editorial-interpretation",
  ),
] satisfies AuthoringDocument[];
