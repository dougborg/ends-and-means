import type { AuthoringDocument } from "../../../src/lib/domain";

const citations = [
  ["populism-contested-category", "mudde-zeitgeist-source", "pp. 543–544, Defining the Undefinable", "context"],
  ["populism-contested-category", "weyland-contested-source", "pp. 1–4, competing domain and extension definitions", "supports"],
  ["populism-contested-category", "aslanidis-ideology-source", "pp. 88–92, ideology critique and framing alternative", "challenges"],
  ["populism-people-elite-core", "mudde-zeitgeist-source", "pp. 543–544", "supports"],
  ["mudde-thin-ideology", "mudde-zeitgeist-source", "pp. 543–544, definition and thin-centered qualification", "supports"],
  ["weyland-strategy-definition", "weyland-contested-source", "pp. 12–14, political-strategy definition", "supports"],
  ["aslanidis-discourse-definition", "aslanidis-ideology-source", "pp. 96–99, discursive-frame proposal", "supports"],
  ["moffitt-style-definition", "moffitt-global-rise-source", "chapter 3, pp. 28–50, especially p. 45", "supports"],
  ["muller-antipluralism", "muller-populism-source", "chapter 1, pp. 19–41", "supports"],
  ["populism-label-provenance", "weyland-contested-source", "pp. 1–14", "supports"],
  ["popularity-insufficient", "mudde-zeitgeist-source", "pp. 542–544", "supports"],
  ["redistribution-insufficient", "mudde-zeitgeist-source", "pp. 542–544, demagogy and opportunism boundary", "supports"],
  ["anti-elitism-antipluralism-distinct", "muller-populism-source", "chapter 1, pp. 19–41", "supports"],
  ["host-ideology-boundary", "mudde-zeitgeist-source", "pp. 544–546", "supports"],
  ["democratic-ambivalence", "rovira-ambivalence-source", "pp. 184–208, threat and corrective argument", "supports"],
  ["people-is-constructed", "moffitt-global-rise-source", "chapter 6, pp. 91–111", "supports"],
  ["omaha-corruption-claim", "omaha-congressional-record-source", "Congressional Record vol. 28, pp. 5826–5828, Omaha Platform preamble", "supports"],
  ["omaha-institutional-demands", "omaha-congressional-record-source", "Congressional Record vol. 28, pp. 5826–5828, platform demands", "supports"],
  ["peoples-party-fusion-boundary", "peoples-platforms-1896-source", "People's Party platform, pp. 24–29", "supports"],
  ["peoples-party-case-limit", "peoples-platforms-1896-source", "People's Party platform, pp. 24–29", "supports"],
  ["peron-social-justice-constitution", "argentina-constitution-1949-source", "Preamble; Part I, chapter III, articles 37–40", "supports"],
  ["peron-organized-community", "peron-philosophy-address-bcn-source", "9 April 1949 closing address, pp. 246–266, especially pp. 251, 254, and 263", "supports"],
  ["peronism-self-description-boundary", "peron-philosophy-address-bcn-source", "9 April 1949 closing address, p. 247", "supports"],
  ["peron-case-limit", "argentina-constitution-1949-source", "constitutional text and date boundary", "supports"],
  ["sata-urban-poor-strategy", "resnick-populist-strategies-source", "pp. 15–22, Zambia case", "supports"],
  ["sata-china-rhetoric", "resnick-populist-strategies-source", "pp. 17–20", "supports"],
  ["zambia-opposition-institution", "zambia-assembly-2007-source", "debate of 31 January 2007, passages on PF–ULP memorandum", "supports"],
  ["zambia-case-limit", "resnick-populist-strategies-source", "pp. 4–6 and 15–22", "supports"],
  ["thai-policy-program", "thailand-policy-2001-source", "policy statement of 26 February 2001, Urgent Policies and economic/social policy sections", "supports"],
  ["thaksin-classification-developed", "phongpaichit-baker-thaksin-source", "pp. 62–83, abstract and stages of populist development", "supports"],
  ["prachaniyom-translation-boundary", "phongpaichit-baker-thaksin-source", "pp. 62–66, Thai political vocabulary and classification context", "supports"],
  ["thailand-case-limit", "phongpaichit-baker-thaksin-source", "pp. 62–83", "supports"],
] as const;

export const populismRelationshipDocuments = citations.map(
  ([statementId, sourceId, locator, role], index) => ({
    documentType: "relationships" as const,
    subject: { kind: "statement" as const, id: statementId },
    relationships: [
      {
        id: `populism-citation-${index + 1}`,
        predicate: "cites" as const,
        subject: { kind: "statement" as const, id: statementId },
        object: { kind: "source" as const, id: sourceId },
        role,
        locator,
      },
    ],
  }),
) satisfies AuthoringDocument[];
