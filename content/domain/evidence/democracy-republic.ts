import type { AuthoringDocument } from "../../../src/lib/domain";

const reviewed = { publicationStatus: "reviewed" as const };

const source = (
  id: string,
  title: string,
  contributors: string[],
  publisher: string,
  sourceType: "web-page" | "report",
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
      workType: sourceType === "report" ? "report" : "other",
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
    1788,
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
        "A contested constitutional and governmental-form concept in which public office is not held as hereditary monarchy.",
      schemeIds: ["political-economic-ideas"],
      scopeNote:
        "Keep a republic, republican traditions, democratic procedures, attributed popular sovereignty, and measured practice distinct.",
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
        "An approach in which voters authorize officeholders through recurring elections and institutions make those officeholders answerable.",
      scope:
        "Representative arrangements with competitive authorization and accountability; not a synonym for democracy or every elected government.",
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
        "Recurring elections authorize representatives for bounded offices under rules for eligibility, competition, tenure, and replacement.",
      ...reviewed,
    },
  },
  {
    documentType: "entity",
    entity: {
      id: "sortition-deliberative-minipublic",
      kind: "means",
      label: "Sortition and deliberative mini-publics",
      description:
        "A procedure that selects a bounded group by lot to learn, deliberate, and formulate judgments or recommendations.",
      institutionalForm:
        "A defined population supplies a randomly selected body whose remit, information, facilitation, decision rule, and authority are specified in advance.",
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
    "Voting is a procedure, not proof",
    "Holding a vote does not by itself establish equal influence, meaningful choice, or accountable rule.",
    "editorial-interpretation",
  ),
  statement(
    "democracy-representation-mechanism",
    "Representation delegates authority",
    "Electoral representation delegates bounded public authority to chosen officeholders.",
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
    "Republic names a form, not a performance result",
    "Republic can name a non-monarchical constitutional form without describing how equally or effectively people govern.",
    "definition",
  ),
  statement(
    "republic-democracy-distinction",
    "A republic need not be democratic",
    "Calling a government a republic does not establish competitive participation, inclusive citizenship, or public accountability.",
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
    "Madison defined a republic by government deriving its powers directly or indirectly from the people.",
    "attributed-value",
  ),
  statement(
    "us-republic-elector-boundary",
    "Popular selection did not mean universal suffrage",
    "The 1787 United States Constitution left House elector qualifications tied to each state's qualifications for its most numerous legislative branch rather than establishing universal suffrage.",
    "observation",
  ),
  statement(
    "india-democratic-republic-self-description",
    "India joins democratic and republic as distinct claims",
    "The Constitution of India describes India as both a democratic republic and separately establishes elections on the basis of adult suffrage.",
    "observation",
  ),
  statement(
    "republic-kahnawake-divergence",
    "Democratic practice does not require a republic label",
    "Horn-Miller documents Kahnawà:ke's law-making process as a community-specific bridge between Haudenosaunee and elected-council systems; this guide does not reclassify that process as a republic.",
    "editorial-interpretation",
  ),
] satisfies AuthoringDocument[];
