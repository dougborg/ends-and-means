import type { EntityRef } from "./domain";
import { canonicalGraph } from "./domain/canonical";
import type { CompiledDomainGraph } from "./domain/graph";
import type { Dossier, SubjectGuide } from "./domain/presentation";

export type ContextualAssetKind =
  | "place-mark"
  | "organization-mark"
  | "artifact"
  | "photograph";

export interface ContextualAssetVariant {
  path: `public/contextual-media/${string}`;
  url: `/contextual-media/${string}`;
  mimeType: "image/avif" | "image/jpeg" | "image/svg+xml" | "image/webp";
  width: number;
  height: number;
  byteSize: number;
  sha256: string;
}

export interface ContextualAsset {
  id: string;
  kind: ContextualAssetKind;
  title: string;
  creatorOrAuthority: string;
  creationDateOrPeriod: string;
  sourcePageUrl: string;
  manifestationUrl: string;
  sourceSha1: string;
  termsLabel: string;
  termsUrl: string;
  retrievalDate: string;
  modifications: string;
  creditLine: string;
  rightsResolution: "reviewed-for-distribution";
  depictedRefs: EntityRef[];
  boundedPeriod?: { startYear: number; endYear: number };
  alt:
    | { kind: "informative"; text: string }
    | { kind: "decorative-with-adjacent-text" };
  variants: ContextualAssetVariant[];
  byteBudget: number;
}

type GuideNarrativePlacementTarget = {
  kind: "guide-narrative";
  guideId: string;
  guideSectionId: string;
  dossierId: string;
  dossierSectionId: string;
};

type ConceptDossierPlacementTarget = {
  kind: "concept-dossier";
  conceptId: string;
  dossierSectionId: string;
};

export interface ContextualPlacement {
  id: string;
  assetId: string;
  target: GuideNarrativePlacementTarget | ConceptDossierPlacementTarget;
  depictedRef: EntityRef;
  contextRef: EntityRef;
  statementIds: string[];
  caption: string;
  displayMode: "archival" | "compact-mark";
  sizes: string;
  loading: "lazy";
}

export interface ConceptDiagramItem {
  heading: string;
  statementIds: string[];
}

export interface ConceptDiagramDefinition {
  id: string;
  conceptId: string;
  heading: string;
  introduction: string;
  items: ConceptDiagramItem[];
  boundary: string;
  statementIds: string[];
}

const unsafeSvgPattern =
  /<!doctype|<!entity|&#|<\/?(?:script|foreignObject|animate|animateTransform|set|image|style)\b|\son[a-z]+\s*=|\s(?:href|src|style)\s*=|url\s*\(|@import|<\/?(?:font|font-face)\b/i;

const allowedSvgAttributes = new Set([
  "xmlns",
  "viewBox",
  "width",
  "height",
  "d",
  "fill",
  "stroke",
  "points",
]);

function isSafeSvgAttribute(name: string, value: string) {
  if (name === "xmlns") return value === "http://www.w3.org/2000/svg";
  if (name === "width" || name === "height")
    return /^\d+(?:\.\d+)?$/.test(value);
  if (name === "viewBox")
    return /^-?\d+(?:\.\d+)?(?:\s+-?\d+(?:\.\d+)?){3}$/.test(value);
  if (name === "fill" || name === "stroke")
    return value === "none" || /^#[a-f0-9]{3,8}$/i.test(value);
  return /^[a-z0-9.,+\-\s]+$/i.test(value);
}

function inspectSvgToken(token: RegExpMatchArray, stack: string[]) {
  const errors: string[] = [];
  const whole = token[0];
  const tag = token[1]?.toLowerCase();
  if (!tag) return { errors, root: false };
  if (whole.startsWith("</")) {
    if (stack.pop() !== tag) errors.push("SVG element nesting is malformed");
    return { errors, root: false };
  }
  const root = stack.length === 0;
  const attributes = token[2] ?? "";
  const attributePattern = /\s([:\w-]+)\s*=\s*(['"])([\s\S]*?)\2/g;
  const parsed = [...attributes.matchAll(attributePattern)].map(
    ([, name, , value]) => ({ name, value }),
  );
  const remainder = attributes
    .replace(attributePattern, "")
    .replace("/", "")
    .trim();
  if (
    remainder ||
    parsed.some(
      ({ name, value }) =>
        !name ||
        value === undefined ||
        !allowedSvgAttributes.has(name) ||
        !isSafeSvgAttribute(name, value),
    )
  )
    errors.push("SVG contains an unreviewed attribute");
  if (!whole.endsWith("/>")) stack.push(tag);
  return { errors, root };
}

function validateSvgStructure(source: string) {
  const errors: string[] = [];
  const stack: string[] = [];
  let roots = 0;
  for (const token of source.matchAll(/<\/?([a-zA-Z][\w:-]*)\b([^>]*)>/g)) {
    const result = inspectSvgToken(token, stack);
    errors.push(...result.errors);
    roots += Number(result.root);
  }
  if (roots !== 1 || stack.length > 0)
    errors.push("SVG requires one balanced root");
  return errors;
}

export function validateSvgSource(source: string) {
  const errors: string[] = [];
  if (!/^\s*<svg\b[\s\S]*<\/svg>\s*$/i.test(source))
    errors.push("SVG requires one complete svg root");
  if (
    !/^\s*<svg\b[^>]*\sxmlns=["']http:\/\/www\.w3\.org\/2000\/svg["']/i.test(
      source,
    )
  )
    errors.push("SVG requires the standard namespace");
  const title = /<title>([^<]*)<\/title>/i.exec(source)?.[1];
  if (!title?.trim()) errors.push("SVG requires a nonempty title");
  if (unsafeSvgPattern.test(source))
    errors.push("SVG contains active, external, embedded, or font content");
  const tags = [...source.matchAll(/<\/?([a-zA-Z][\w:-]*)\b/g)].map(([, tag]) =>
    tag?.toLowerCase(),
  );
  const allowedTags = new Set(["svg", "title", "g", "path", "polygon"]);
  if (tags.some((tag) => !tag || !allowedTags.has(tag)))
    errors.push("SVG contains an unreviewed element");
  errors.push(...validateSvgStructure(source));
  return [...new Set(errors)];
}

export const contextualAssets: ContextualAsset[] = [
  {
    id: "war-production-board-seal",
    kind: "organization-mark",
    title: "Seal of the United States War Production Board",
    creatorOrAuthority: "United States Government; traced Commons derivative",
    creationDateOrPeriod: "War Production Board, 1942–1945",
    sourcePageUrl:
      "https://commons.wikimedia.org/wiki/File:US-WarProductionBoard-Seal.svg",
    manifestationUrl:
      "https://commons.wikimedia.org/wiki/Special:Redirect/file/US-WarProductionBoard-Seal.svg",
    sourceSha1: "ed416c1c4ef91f52f0673b751ac7cfa2283d105f",
    termsLabel: "Federal-work public-domain record at Wikimedia Commons",
    termsUrl:
      "https://commons.wikimedia.org/wiki/File:US-WarProductionBoard-Seal.svg#Licensing",
    retrievalDate: "2026-09-08",
    modifications:
      "Removed XML declaration, doctype, generator comment, unused identifiers, and presentation metadata; retained vector paths, polygons, proportions, and colors; added a descriptive title.",
    creditLine:
      "U.S. Government seal; SVG traced from an LOC/OWI reproduction and cleaned by Wikimedia Commons contributors.",
    rightsResolution: "reviewed-for-distribution",
    depictedRefs: [{ kind: "organization", id: "war-production-board" }],
    boundedPeriod: { startYear: 1942, endYear: 1945 },
    alt: { kind: "decorative-with-adjacent-text" },
    variants: [
      {
        path: "public/contextual-media/war-production-board-seal.svg",
        url: "/contextual-media/war-production-board-seal.svg",
        mimeType: "image/svg+xml",
        width: 720,
        height: 720,
        byteSize: 23962,
        sha256:
          "b586559a53908cb4f6186a025a9f51e0b1daae844a60ab6bc8ff45be1f6d2cb5",
      },
    ],
    byteBudget: 25000,
  },
  {
    id: "peoples-party-campaign-print-1892",
    kind: "artifact",
    title: "People's Party candidates for President and Vice President, 1892",
    creatorOrAuthority:
      "Goes Lithographing Company; Chicago Sentinel Publishing Company named as copyright claimant",
    creationDateOrPeriod: "Chicago, 1892",
    sourcePageUrl: "https://www.loc.gov/pictures/item/2018695404/",
    manifestationUrl:
      "https://tile.loc.gov/storage-services/service/pnp/ppmsca/44700/44763v.jpg",
    sourceSha1: "6398c87e10c7001e8881b73c9c2cc8e85f0fd9fa",
    termsLabel: "Library of Congress: No known restrictions on publication",
    termsUrl: "https://hdl.loc.gov/loc.pnp/res.248.pga",
    retrievalDate: "2026-09-08",
    modifications:
      "Preserved the complete composition; removed embedded metadata, converted to sRGB, resized to 382 and 764 pixels wide, and encoded AVIF, WebP, and JPEG derivatives.",
    creditLine:
      "Library of Congress, Popular Graphic Arts, LC-DIG-ppmsca-44763 (digital file from original item).",
    rightsResolution: "reviewed-for-distribution",
    depictedRefs: [{ kind: "case", id: "us-peoples-party-1890-1896" }],
    boundedPeriod: { startYear: 1892, endYear: 1892 },
    alt: {
      kind: "informative",
      text: "1892 People's Party campaign print with portraits of presidential candidate James B. Weaver and vice-presidential candidate James G. Field above industrial and agricultural scenes.",
    },
    variants: [
      {
        path: "public/contextual-media/peoples-party-1892-382.avif",
        url: "/contextual-media/peoples-party-1892-382.avif",
        mimeType: "image/avif",
        width: 382,
        height: 512,
        byteSize: 20346,
        sha256:
          "eefd03477d819775af89627c3bba04a2a4fa0a618d2918d038a0424059d95327",
      },
      {
        path: "public/contextual-media/peoples-party-1892-764.avif",
        url: "/contextual-media/peoples-party-1892-764.avif",
        mimeType: "image/avif",
        width: 764,
        height: 1024,
        byteSize: 95466,
        sha256:
          "55a741ba37c534696e27f0aaa5348c8e0cb205c437c1c368d6cea417a69b9257",
      },
      {
        path: "public/contextual-media/peoples-party-1892-382.webp",
        url: "/contextual-media/peoples-party-1892-382.webp",
        mimeType: "image/webp",
        width: 382,
        height: 512,
        byteSize: 38370,
        sha256:
          "934cc16b79a42893bb1478962f2bfca07c3c7fb68b6e57644f9526e24239d7b3",
      },
      {
        path: "public/contextual-media/peoples-party-1892-764.webp",
        url: "/contextual-media/peoples-party-1892-764.webp",
        mimeType: "image/webp",
        width: 764,
        height: 1024,
        byteSize: 190384,
        sha256:
          "ef557ad7cfe01c62bdb6908d9b0db45c8647311140120add7fd6814288df7a12",
      },
      {
        path: "public/contextual-media/peoples-party-1892-382.jpg",
        url: "/contextual-media/peoples-party-1892-382.jpg",
        mimeType: "image/jpeg",
        width: 382,
        height: 512,
        byteSize: 60178,
        sha256:
          "350520f4b4e247c9ddb89b3d74f062dc2b8075a3fc3a5614ecc6afb98bb0fdc2",
      },
      {
        path: "public/contextual-media/peoples-party-1892-764.jpg",
        url: "/contextual-media/peoples-party-1892-764.jpg",
        mimeType: "image/jpeg",
        width: 764,
        height: 1024,
        byteSize: 259850,
        sha256:
          "efaa14013f34119bdb0ccb1f4f7c5e1ad7fe88aa1abc63f9d46eb4f93538dcfc",
      },
    ],
    byteBudget: 270000,
  },
  {
    id: "guaman-poma-drawing-80",
    kind: "artifact",
    title: "Guaman Poma, Drawing 80, manuscript page 215",
    creatorOrAuthority: "Felipe Guamán Poma de Ayala",
    creationDateOrPeriod: "1615–1616",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Nueva_coronica.jpg",
    manifestationUrl:
      "https://commons.wikimedia.org/wiki/Special:Redirect/file/Nueva_coronica.jpg",
    sourceSha1: "490a4e52798f401d360a6bf4cb8d348fa8fd2216",
    termsLabel: "Public Domain Mark record at Wikimedia Commons",
    termsUrl:
      "https://commons.wikimedia.org/wiki/File:Nueva_coronica.jpg#Licensing",
    retrievalDate: "2026-09-08",
    modifications:
      "Preserved the complete manuscript page; removed embedded metadata, converted to sRGB, resized to 415 and 830 pixels wide, and encoded AVIF, WebP, and JPEG derivatives.",
    creditLine:
      "Felipe Guamán Poma de Ayala; manuscript held by the Royal Danish Library; reproduction via Wikimedia Commons.",
    rightsResolution: "reviewed-for-distribution",
    depictedRefs: [{ kind: "case", id: "tawantinsuyu-imperial-organization" }],
    boundedPeriod: { startYear: 1615, endYear: 1616 },
    alt: {
      kind: "informative",
      text: "Guaman Poma's drawing of awakuq warmi, a thirty-three-year-old woman weaving at an upright loom, labeled as the first women's age group.",
    },
    variants: [
      {
        path: "public/contextual-media/guaman-poma-drawing-80-415.avif",
        url: "/contextual-media/guaman-poma-drawing-80-415.avif",
        mimeType: "image/avif",
        width: 415,
        height: 589,
        byteSize: 35481,
        sha256:
          "5045e906aea07021064eff01efcb49a90d8fc9ce5c2d8777d8d122bd436d4e5f",
      },
      {
        path: "public/contextual-media/guaman-poma-drawing-80-830.avif",
        url: "/contextual-media/guaman-poma-drawing-80-830.avif",
        mimeType: "image/avif",
        width: 830,
        height: 1177,
        byteSize: 135140,
        sha256:
          "da87f862109a9c7af2d4371060d7ecdbb50c928711894c26d9e321525d824401",
      },
      {
        path: "public/contextual-media/guaman-poma-drawing-80-415.webp",
        url: "/contextual-media/guaman-poma-drawing-80-415.webp",
        mimeType: "image/webp",
        width: 415,
        height: 589,
        byteSize: 75110,
        sha256:
          "2b97bdf43dfd1c280ca6c3b83760fd1e0807ee5a5477bf173b7aee5f526c4d1e",
      },
      {
        path: "public/contextual-media/guaman-poma-drawing-80-830.webp",
        url: "/contextual-media/guaman-poma-drawing-80-830.webp",
        mimeType: "image/webp",
        width: 830,
        height: 1177,
        byteSize: 231776,
        sha256:
          "44ff104b2c4c0b4c9fc045f8264c30673567377b4d2b0e07d7a6b9086741b500",
      },
      {
        path: "public/contextual-media/guaman-poma-drawing-80-415.jpg",
        url: "/contextual-media/guaman-poma-drawing-80-415.jpg",
        mimeType: "image/jpeg",
        width: 415,
        height: 589,
        byteSize: 85037,
        sha256:
          "408a8ce9f6f974f84f86d6d891fe753fc4a383439f0325a996c5df25d731293b",
      },
      {
        path: "public/contextual-media/guaman-poma-drawing-80-830.jpg",
        url: "/contextual-media/guaman-poma-drawing-80-830.jpg",
        mimeType: "image/jpeg",
        width: 830,
        height: 1177,
        byteSize: 254838,
        sha256:
          "0984aedf2050c69b438fda9f306362d778bb87685b65460435da4e79c965cf3e",
      },
    ],
    byteBudget: 260000,
  },
  {
    id: "sweden-flag",
    kind: "place-mark",
    title: "Flag of Sweden",
    creatorOrAuthority: "Swedish state specification; Commons vector",
    creationDateOrPeriod: "Current design specified by Swedish law",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Flag_of_Sweden.svg",
    manifestationUrl:
      "https://commons.wikimedia.org/wiki/Special:Redirect/file/Flag_of_Sweden.svg",
    sourceSha1: "e2717718a2b2089843c6fc487d65cbe6fdceb9c3",
    termsLabel:
      "Public-domain geometry and official-insignia notes at Wikimedia Commons",
    termsUrl:
      "https://commons.wikimedia.org/wiki/File:Flag_of_Sweden.svg#Licensing",
    retrievalDate: "2026-09-08",
    modifications:
      "Removed the XML declaration; retained official geometry, viewBox, dimensions, and colors; added a descriptive title.",
    creditLine:
      "Flag of Sweden; public-domain simple geometry. Official-insignia rules can restrict uses that imply endorsement.",
    rightsResolution: "reviewed-for-distribution",
    depictedRefs: [{ kind: "place", id: "sweden" }],
    alt: { kind: "decorative-with-adjacent-text" },
    variants: [
      {
        path: "public/contextual-media/sweden-flag.svg",
        url: "/contextual-media/sweden-flag.svg",
        mimeType: "image/svg+xml",
        width: 1600,
        height: 1000,
        byteSize: 204,
        sha256:
          "8b0cef733681d5de873fe82218e56cd96330eb0e0d169d3ccd286b156dffca39",
      },
    ],
    byteBudget: 256,
  },
];

export const contextualPlacements: ContextualPlacement[] = [
  {
    id: "central-planning-wpb-seal",
    assetId: "war-production-board-seal",
    target: {
      kind: "guide-narrative",
      guideId: "guide-central-planning",
      guideSectionId: "institutions-and-mechanisms",
      dossierId: "central-planning-dossier",
      dossierSectionId: "how-did-the-plan-work",
    },
    depictedRef: { kind: "organization", id: "war-production-board" },
    contextRef: { kind: "organization", id: "war-production-board" },
    statementIds: ["cmp-authority", "cmp-scope"],
    caption:
      "War Production Board seal. The agency administered the bounded United States wartime materials-allocation case.",
    displayMode: "compact-mark",
    sizes: "9rem",
    loading: "lazy",
  },
  {
    id: "populism-peoples-party-print",
    assetId: "peoples-party-campaign-print-1892",
    target: {
      kind: "guide-narrative",
      guideId: "guide-populism",
      guideSectionId: "bounded-practice",
      dossierId: "populism-dossier",
      dossierSectionId: "peoples-party",
    },
    depictedRef: { kind: "case", id: "us-peoples-party-1890-1896" },
    contextRef: { kind: "case", id: "us-peoples-party-1890-1896" },
    statementIds: [
      "omaha-corruption-claim",
      "omaha-institutional-demands",
      "peoples-party-fusion-boundary",
      "peoples-party-case-limit",
    ],
    caption:
      "An 1892 campaign print for the People's Party presidential ticket. This bounded party artifact does not define populism in general.",
    displayMode: "archival",
    sizes: "(max-width: 48rem) 92vw, 34rem",
    loading: "lazy",
  },
  {
    id: "tawantinsuyu-guaman-poma-drawing",
    assetId: "guaman-poma-drawing-80",
    target: {
      kind: "guide-narrative",
      guideId: "guide-tawantinsuyu-imperial-organization",
      guideSectionId: "variants-disputes-and-limits",
      dossierId: "tawantinsuyu-imperial-organization-dossier",
      dossierSectionId: "how-should-colonial-accounts-be-read",
    },
    depictedRef: { kind: "case", id: "tawantinsuyu-imperial-organization" },
    contextRef: { kind: "case", id: "tawantinsuyu-imperial-organization" },
    statementIds: [
      "tawantinsuyu-chronicle-mediation",
      "tawantinsuyu-guaman-poma-service",
    ],
    caption:
      "Guaman Poma, Drawing 80, manuscript page 215. This colonial-era retrospective image appears in his age-group sequence; it is not direct evidence of pre-conquest practice.",
    displayMode: "archival",
    sizes: "(max-width: 48rem) 92vw, 30rem",
    loading: "lazy",
  },
  {
    id: "social-ownership-sweden-place",
    assetId: "sweden-flag",
    target: {
      kind: "concept-dossier",
      conceptId: "social-ownership",
      dossierSectionId: "what-do-the-swedish-cases-show",
    },
    depictedRef: { kind: "place", id: "sweden" },
    contextRef: {
      kind: "case-episode",
      id: "enacted-wage-earner-funds-1984-1991",
    },
    statementIds: [
      "funds-related-ideas-classification",
      "funds-limited-control",
    ],
    caption: "Sweden · enacted wage-earner fund-board period, 1984–1991.",
    displayMode: "compact-mark",
    sizes: "8rem",
    loading: "lazy",
  },
  {
    id: "economic-democracy-sweden-place",
    assetId: "sweden-flag",
    target: {
      kind: "guide-narrative",
      guideId: "guide-economic-democracy",
      guideSectionId: "bounded-practice",
      dossierId: "economic-democracy-dossier",
      dossierSectionId: "how-do-the-swedish-funds-fit",
    },
    depictedRef: { kind: "place", id: "sweden" },
    contextRef: {
      kind: "case-episode",
      id: "enacted-wage-earner-funds-1984-1991",
    },
    statementIds: [
      "funds-related-ideas-classification",
      "funds-limited-control",
    ],
    caption: "Sweden · enacted wage-earner fund-board period, 1984–1991.",
    displayMode: "compact-mark",
    sizes: "8rem",
    loading: "lazy",
  },
];

export const conceptDiagrams: ConceptDiagramDefinition[] = [
  {
    id: "social-ownership-rights-diagram",
    conceptId: "social-ownership",
    heading: "Four questions one arrangement must answer",
    introduction:
      "The same ownership label can conceal different holders of title, benefit, practical authority, and returns.",
    items: [
      {
        heading: "Title and benefit",
        statementIds: ["social-ownership-title-benefit-boundary"],
      },
      {
        heading: "Use and management",
        statementIds: ["social-ownership-rights-are-divisible"],
      },
      {
        heading: "Effective control",
        statementIds: ["social-ownership-control-boundary"],
      },
      {
        heading: "Income and surplus",
        statementIds: ["social-ownership-returns-boundary"],
      },
    ],
    boundary:
      "The diagram separates questions for investigation. It does not classify or score an arrangement by itself.",
    statementIds: [
      "social-ownership-four-questions",
      "social-ownership-title-benefit-boundary",
      "social-ownership-rights-are-divisible",
      "social-ownership-control-boundary",
      "social-ownership-returns-boundary",
    ],
  },
  {
    id: "populism-attributed-accounts-diagram",
    conceptId: "populism",
    heading: "Five attributed ways of defining populism",
    introduction:
      "Each published account selects a different feature and therefore directs attention to different evidence.",
    items: [
      { heading: "Mudde", statementIds: ["mudde-thin-ideology"] },
      { heading: "Weyland", statementIds: ["weyland-strategy-definition"] },
      {
        heading: "Aslanidis",
        statementIds: ["aslanidis-discourse-definition"],
      },
      { heading: "Moffitt", statementIds: ["moffitt-style-definition"] },
      { heading: "Müller", statementIds: ["muller-antipluralism"] },
    ],
    boundary:
      "Published accounts emphasize different features; this comparison does not make one account the site definition.",
    statementIds: [
      "populism-contested-category",
      "mudde-thin-ideology",
      "weyland-strategy-definition",
      "aslanidis-discourse-definition",
      "moffitt-style-definition",
      "muller-antipluralism",
      "populism-label-provenance",
    ],
  },
];

function dossierById(graph: CompiledDomainGraph, id: string) {
  const entity = graph.indexes.entitiesById[id];
  return entity?.kind === "dossier" ? entity : undefined;
}

function guideById(guides: SubjectGuide[], id: string) {
  return guides.find((guide) => guide.id === id);
}

function sameRef(left: EntityRef, right: EntityRef) {
  return left.kind === right.kind && left.id === right.id;
}

function selectedByDossierSection(
  dossier: Dossier,
  sectionId: string,
  reference: EntityRef,
) {
  const section = dossier.sections.find(({ id }) => id === sectionId);
  return Boolean(
    section?.relatedEntityRefs?.some((item) => sameRef(item, reference)),
  );
}

function selectedByDossierContext(
  dossier: Dossier,
  sectionId: string,
  reference: EntityRef,
) {
  return (
    sameRef(dossier.subject, reference) ||
    selectedByDossierSection(dossier, sectionId, reference)
  );
}

function contextualCaseForEpisode(
  graph: CompiledDomainGraph,
  reference: EntityRef,
) {
  const entity = graph.indexes.entitiesById[reference.id];
  if (entity?.kind !== "case-episode") return undefined;
  const boundedCase = graph.indexes.entitiesById[entity.caseId];
  return boundedCase?.kind === "case" ? boundedCase : undefined;
}

function isExactCalendarDate(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return false;
  const [, year, month, day] = match;
  const parsed = new Date(`${value}T00:00:00.000Z`);
  return (
    parsed.getUTCFullYear() === Number(year) &&
    parsed.getUTCMonth() + 1 === Number(month) &&
    parsed.getUTCDate() === Number(day)
  );
}

function isValidBoundedPeriod(period: ContextualAsset["boundedPeriod"]) {
  return (
    !period ||
    (Number.isInteger(period.startYear) &&
      Number.isInteger(period.endYear) &&
      period.startYear <= period.endYear)
  );
}

function hasCompleteAssetProvenance(asset: ContextualAsset) {
  return Boolean(
    asset.title.trim() &&
      asset.creatorOrAuthority.trim() &&
      asset.creationDateOrPeriod.trim() &&
      asset.modifications.trim() &&
      asset.creditLine.trim() &&
      asset.termsLabel.trim() &&
      asset.variants.length > 0,
  );
}

function isHttpsUrl(value: string) {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "https:" && Boolean(parsed.hostname);
  } catch {
    return false;
  }
}

function isExactLocalVariantPath(variant: ContextualAssetVariant) {
  return (
    /^\/contextual-media\/[a-z0-9][a-z0-9.-]+$/.test(variant.url) &&
    variant.path === `public${variant.url}`
  );
}

function validateVariant(
  asset: ContextualAsset,
  variant: ContextualAssetVariant,
  paths: Set<string>,
) {
  const errors: string[] = [];
  if (paths.has(variant.path))
    errors.push(`${asset.id}: duplicate asset path ${variant.path}`);
  paths.add(variant.path);
  if (!isExactLocalVariantPath(variant))
    errors.push(`${asset.id}: asset URL must be local`);
  if (variant.width <= 0 || variant.height <= 0)
    errors.push(`${asset.id}: invalid intrinsic dimensions`);
  if (variant.byteSize <= 0 || variant.byteSize > asset.byteBudget)
    errors.push(`${asset.id}: variant exceeds its byte budget`);
  if (!/^[a-f0-9]{64}$/.test(variant.sha256))
    errors.push(`${asset.id}: local SHA-256 is missing or malformed`);
  return errors;
}

function validateAsset(
  graph: CompiledDomainGraph,
  asset: ContextualAsset,
  ids: Set<string>,
  paths: Set<string>,
) {
  const errors: string[] = [];
  if (ids.has(asset.id)) errors.push(`${asset.id}: duplicate asset ID`);
  ids.add(asset.id);
  if (!isHttpsUrl(asset.sourcePageUrl))
    errors.push(`${asset.id}: source page must use HTTPS`);
  if (!isHttpsUrl(asset.manifestationUrl))
    errors.push(`${asset.id}: manifestation must use HTTPS`);
  if (!isHttpsUrl(asset.termsUrl))
    errors.push(`${asset.id}: terms locator must use HTTPS`);
  if (asset.rightsResolution !== "reviewed-for-distribution")
    errors.push(`${asset.id}: publication rights are unresolved`);
  if (!isExactCalendarDate(asset.retrievalDate))
    errors.push(`${asset.id}: retrieval date is missing or malformed`);
  if (!/^[a-f0-9]{40}$/.test(asset.sourceSha1))
    errors.push(`${asset.id}: source SHA-1 is missing or malformed`);
  if (!hasCompleteAssetProvenance(asset))
    errors.push(`${asset.id}: descriptive provenance record is incomplete`);
  if (asset.alt.kind === "informative" && !asset.alt.text.trim())
    errors.push(`${asset.id}: informative alt text is empty`);
  if (!isValidBoundedPeriod(asset.boundedPeriod))
    errors.push(`${asset.id}: bounded period is invalid`);
  for (const reference of asset.depictedRefs) {
    if (graph.indexes.entitiesById[reference.id]?.kind !== reference.kind)
      errors.push(
        `${asset.id}: depicted reference ${reference.id} is missing or has the wrong kind`,
      );
  }
  for (const variant of asset.variants)
    errors.push(...validateVariant(asset, variant, paths));
  return errors;
}

function guidePlacementErrors(
  graph: CompiledDomainGraph,
  guides: SubjectGuide[],
  placement: ContextualPlacement & { target: GuideNarrativePlacementTarget },
) {
  const errors: string[] = [];
  const { target } = placement;
  const guide = guideById(guides, target.guideId);
  const guideSection = guide?.sections.find(
    ({ id }) => id === target.guideSectionId,
  );
  const selected = guideSection?.narrativeRefs?.some(
    ({ dossierId, sectionId }) =>
      dossierId === target.dossierId && sectionId === target.dossierSectionId,
  );
  const dossier = dossierById(graph, target.dossierId);
  const section = dossier?.sections.find(
    ({ id }) => id === target.dossierSectionId,
  );
  if (!guide || !guideSection || !selected || !section)
    errors.push(`${placement.id}: guide narrative target is not selected`);
  const episodeCase = contextualCaseForEpisode(graph, placement.contextRef);
  const selectedContext = Boolean(
    dossier &&
      (selectedByDossierContext(
        dossier,
        target.dossierSectionId,
        placement.contextRef,
      ) ||
        (episodeCase &&
          selectedByDossierContext(dossier, target.dossierSectionId, {
            kind: "case",
            id: episodeCase.id,
          }))),
  );
  const ownsStatements = placement.statementIds.every((id) =>
    section?.statementIds.includes(id),
  );
  if (!selectedContext)
    errors.push(`${placement.id}: guide passage does not select its context`);
  if (section && !ownsStatements)
    errors.push(
      `${placement.id}: guide passage does not own every contextual Statement`,
    );
  return errors;
}

function conceptPlacementErrors(
  graph: CompiledDomainGraph,
  placement: ContextualPlacement & { target: ConceptDossierPlacementTarget },
) {
  const errors: string[] = [];
  const { target } = placement;
  const concept = graph.indexes.entitiesById[target.conceptId];
  const dossier = graph.entities.find(
    (entity): entity is Dossier =>
      entity.kind === "dossier" &&
      entity.subject.kind === "concept" &&
      entity.subject.id === target.conceptId,
  );
  const section = dossier?.sections.find(
    ({ id }) => id === target.dossierSectionId,
  );
  const episodeCase = contextualCaseForEpisode(graph, placement.contextRef);
  if (concept?.kind !== "concept" || !section)
    errors.push(`${placement.id}: concept dossier target is missing`);
  if (
    section &&
    !placement.statementIds.every((id) => section.statementIds.includes(id))
  )
    errors.push(
      `${placement.id}: concept passage does not own every contextual Statement`,
    );
  if (
    !episodeCase ||
    !section?.relatedEntityRefs?.some(
      (reference) =>
        reference.kind === "case" && reference.id === episodeCase.id,
    ) ||
    !episodeCase.locationIds.includes(placement.depictedRef.id)
  )
    errors.push(
      `${placement.id}: place is not reached through the selected Case`,
    );
  return errors;
}

function placementIdentityErrors(
  graph: CompiledDomainGraph,
  placement: ContextualPlacement,
  asset: ContextualAsset,
) {
  const errors: string[] = [];
  if (!asset.depictedRefs.some((item) => sameRef(item, placement.depictedRef)))
    errors.push(
      `${placement.id}: depicted reference is not owned by its asset`,
    );
  const depicted = graph.indexes.entitiesById[placement.depictedRef.id];
  const context = graph.indexes.entitiesById[placement.contextRef.id];
  if (depicted?.kind !== placement.depictedRef.kind)
    errors.push(`${placement.id}: depicted reference kind does not match`);
  if (context?.kind !== placement.contextRef.kind)
    errors.push(`${placement.id}: context reference kind does not match`);
  if (
    asset.kind !== "place-mark" &&
    !sameRef(placement.contextRef, placement.depictedRef)
  )
    errors.push(
      `${placement.id}: context does not match the depicted identity`,
    );
  for (const statementId of placement.statementIds) {
    if (graph.indexes.entitiesById[statementId]?.kind !== "statement")
      errors.push(`${placement.id}: Statement ${statementId} is missing`);
  }
  if (asset.kind === "place-mark") {
    const boundedCase =
      context?.kind === "case"
        ? context
        : contextualCaseForEpisode(graph, placement.contextRef);
    if (
      placement.depictedRef.kind !== "place" ||
      !boundedCase?.locationIds.includes(placement.depictedRef.id)
    )
      errors.push(
        `${placement.id}: place mark is not located by its contextual Case`,
      );
  }
  return errors;
}

function validatePlacement(
  graph: CompiledDomainGraph,
  guides: SubjectGuide[],
  assets: ContextualAsset[],
  placement: ContextualPlacement,
  ids: Set<string>,
) {
  const errors: string[] = [];
  if (ids.has(placement.id))
    errors.push(`${placement.id}: duplicate placement ID`);
  ids.add(placement.id);
  if (!placement.caption.trim() || placement.statementIds.length === 0)
    errors.push(`${placement.id}: caption or Statement ownership is missing`);
  const asset = assets.find(({ id }) => id === placement.assetId);
  if (!asset)
    return errors.concat(
      `${placement.id}: asset ${placement.assetId} is missing`,
    );
  errors.push(...placementIdentityErrors(graph, placement, asset));
  if (placement.target.kind === "guide-narrative")
    errors.push(
      ...guidePlacementErrors(
        graph,
        guides,
        placement as ContextualPlacement & {
          target: GuideNarrativePlacementTarget;
        },
      ),
    );
  else
    errors.push(
      ...conceptPlacementErrors(
        graph,
        placement as ContextualPlacement & {
          target: ConceptDossierPlacementTarget;
        },
      ),
    );
  return errors;
}

function validateDiagram(
  graph: CompiledDomainGraph,
  diagram: ConceptDiagramDefinition,
  ids: Set<string>,
) {
  const errors: string[] = [];
  if (ids.has(diagram.id)) errors.push(`${diagram.id}: duplicate diagram ID`);
  ids.add(diagram.id);
  const concept = graph.indexes.entitiesById[diagram.conceptId];
  const dossier = graph.entities.find(
    (entity): entity is Dossier =>
      entity.kind === "dossier" &&
      entity.subject.kind === "concept" &&
      entity.subject.id === diagram.conceptId,
  );
  const selected = new Set(
    dossier?.sections.flatMap(({ statementIds }) => statementIds) ?? [],
  );
  if (concept?.kind !== "concept" || !dossier)
    errors.push(`${diagram.id}: concept or dossier is missing`);
  for (const statementId of diagram.statementIds) {
    if (
      graph.indexes.entitiesById[statementId]?.kind !== "statement" ||
      !selected.has(statementId)
    )
      errors.push(
        `${diagram.id}: Statement ${statementId} is not selected by the dossier`,
      );
  }
  for (const item of diagram.items) {
    if (!item.heading.trim() || item.statementIds.length === 0)
      errors.push(`${diagram.id}: diagram item is empty`);
    if (!item.statementIds.every((id) => diagram.statementIds.includes(id)))
      errors.push(`${diagram.id}: item uses an undeclared Statement`);
  }
  return errors;
}

export function validateContextualImagery(
  graph: CompiledDomainGraph,
  guides: SubjectGuide[],
  assets: ContextualAsset[] = contextualAssets,
  placements: ContextualPlacement[] = contextualPlacements,
  diagrams: ConceptDiagramDefinition[] = conceptDiagrams,
) {
  const errors: string[] = [];
  const assetIds = new Set<string>();
  const paths = new Set<string>();
  const placementIds = new Set<string>();
  const diagramIds = new Set<string>();
  for (const asset of assets)
    errors.push(...validateAsset(graph, asset, assetIds, paths));
  for (const placement of placements)
    errors.push(
      ...validatePlacement(graph, guides, assets, placement, placementIds),
    );
  for (const diagram of diagrams)
    errors.push(...validateDiagram(graph, diagram, diagramIds));
  return errors;
}

export function conceptDiagramFor(conceptId: string) {
  return conceptDiagrams.find((diagram) => diagram.conceptId === conceptId);
}

export function contextualPlacementsForGuideNarrative(
  guideId: string,
  guideSectionId: string,
  dossierId: string,
  dossierSectionId: string,
) {
  return contextualPlacements.filter(
    (placement) =>
      placement.target.kind === "guide-narrative" &&
      placement.target.guideId === guideId &&
      placement.target.guideSectionId === guideSectionId &&
      placement.target.dossierId === dossierId &&
      placement.target.dossierSectionId === dossierSectionId,
  );
}

export function contextualPlacementsForConceptSection(
  conceptId: string,
  dossierSectionId: string,
) {
  return contextualPlacements.filter(
    (placement) =>
      placement.target.kind === "concept-dossier" &&
      placement.target.conceptId === conceptId &&
      placement.target.dossierSectionId === dossierSectionId,
  );
}

export function contextualAssetForPlacement(placement: ContextualPlacement) {
  return contextualAssets.find(({ id }) => id === placement.assetId);
}

const canonicalImageryErrors = validateContextualImagery(
  canonicalGraph,
  canonicalGraph.subjectGuides,
);
if (canonicalImageryErrors.length > 0) {
  throw new Error(
    `Invalid contextual imagery:\n${canonicalImageryErrors.join("\n")}`,
  );
}
