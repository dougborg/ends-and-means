import { createHash } from "node:crypto";
import { readFileSync, statSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  conceptDiagramFor,
  conceptDiagrams,
  contextualAssetForPlacement,
  contextualAssets,
  contextualPlacements,
  contextualPlacementsForConceptSection,
  contextualPlacementsForGuideNarrative,
  validateContextualImagery,
  validateSvgSource,
} from "../../src/lib/contextual-imagery";
import { canonicalGraph } from "../../src/lib/domain/canonical";

function itemAt<T>(items: T[], index: number) {
  const item = items[index];
  if (!item) throw new Error(`Missing fixture at ${index}`);
  return item;
}

function jpegDimensions(buffer: Buffer) {
  let offset = 2;
  const frames = new Set([
    0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce,
    0xcf,
  ]);
  while (offset < buffer.length) {
    if (buffer[offset] !== 0xff) throw new Error("Malformed JPEG marker");
    const marker = buffer[offset + 1] ?? 0;
    if (frames.has(marker))
      return [buffer.readUInt16BE(offset + 7), buffer.readUInt16BE(offset + 5)];
    offset += 2 + buffer.readUInt16BE(offset + 2);
  }
  throw new Error("JPEG lacks frame dimensions");
}

function webpDimensions(buffer: Buffer) {
  const chunk = buffer.toString("ascii", 12, 16);
  if (chunk === "VP8 ")
    return [buffer.readUInt16LE(26) & 0x3fff, buffer.readUInt16LE(28) & 0x3fff];
  if (chunk === "VP8L") {
    const bits = buffer.readUInt32LE(21);
    return [(bits & 0x3fff) + 1, ((bits >> 14) & 0x3fff) + 1];
  }
  if (chunk === "VP8X")
    return [buffer.readUIntLE(24, 3) + 1, buffer.readUIntLE(27, 3) + 1];
  throw new Error(`Unsupported WebP chunk ${chunk}`);
}

function rasterDimensions(buffer: Buffer, mimeType: string) {
  if (mimeType === "image/jpeg") return jpegDimensions(buffer);
  if (mimeType === "image/webp") return webpDimensions(buffer);
  if (mimeType !== "image/avif")
    throw new Error(`Unsupported raster ${mimeType}`);
  const offset = buffer.indexOf(Buffer.from("ispe"));
  if (offset < 0) throw new Error("AVIF lacks ispe dimensions");
  return [buffer.readUInt32BE(offset + 8), buffer.readUInt32BE(offset + 12)];
}

describe("contextual imagery placement", () => {
  it("binds the reviewed assets and diagrams to exact canonical passages", () => {
    expect(
      validateContextualImagery(canonicalGraph, canonicalGraph.subjectGuides),
    ).toEqual([]);
    expect(contextualAssets.map(({ id }) => id)).toEqual([
      "war-production-board-seal",
      "peoples-party-campaign-print-1892",
      "guaman-poma-drawing-80",
      "sweden-flag",
    ]);
    expect(
      contextualPlacementsForGuideNarrative(
        "guide-populism",
        "bounded-practice",
        "populism-dossier",
        "peoples-party",
      ).map(({ id }) => id),
    ).toEqual(["populism-peoples-party-print"]);
    expect(
      contextualPlacementsForConceptSection(
        "social-ownership",
        "what-do-the-swedish-cases-show",
      ).map(({ id }) => id),
    ).toEqual(["social-ownership-sweden-place"]);
    expect(
      contextualAssetForPlacement(itemAt(contextualPlacements, 0))?.id,
    ).toBe("war-production-board-seal");
    expect(conceptDiagrams.map(({ conceptId }) => conceptId)).toEqual([
      "social-ownership",
      "populism",
    ]);
    expect(conceptDiagramFor("populism")?.id).toBe(
      "populism-attributed-accounts-diagram",
    );
    expect(conceptDiagramFor("liberalism")).toBeUndefined();
  });
});

describe("contextual imagery rejection boundaries", () => {
  it("rejects stale passages and unsupported identities", () => {
    const placements = structuredClone(contextualPlacements);
    itemAt(placements, 0).depictedRef = {
      kind: "organization",
      id: "wpb-requirements-committee",
    };
    itemAt(placements, 1).target = {
      kind: "guide-narrative",
      guideId: "guide-populism",
      guideSectionId: "bounded-practice",
      dossierId: "populism-dossier",
      dossierSectionId: "definitions",
    };
    itemAt(placements, 4).contextRef = {
      kind: "case",
      id: "us-peoples-party-1890-1896",
    };
    expect(
      validateContextualImagery(
        canonicalGraph,
        canonicalGraph.subjectGuides,
        contextualAssets,
        placements,
      ),
    ).toEqual(
      expect.arrayContaining([
        "central-planning-wpb-seal: depicted reference is not owned by its asset",
        "populism-peoples-party-print: guide narrative target is not selected",
        "economic-democracy-sweden-place: place mark is not located by its contextual Case",
      ]),
    );
  });

  it("rejects a wrong live context even when the passage owns its Statements", () => {
    const wrongOrganization = structuredClone(contextualPlacements);
    itemAt(wrongOrganization, 0).contextRef = {
      kind: "organization",
      id: "wpb-requirements-committee",
    };
    expect(
      validateContextualImagery(
        canonicalGraph,
        canonicalGraph.subjectGuides,
        contextualAssets,
        wrongOrganization,
      ),
    ).toContain(
      "central-planning-wpb-seal: context does not match the depicted identity",
    );

    const wrongCase = structuredClone(contextualPlacements);
    itemAt(wrongCase, 1).contextRef = {
      kind: "case",
      id: "peronist-formation-1943-1955",
    };
    expect(
      validateContextualImagery(
        canonicalGraph,
        canonicalGraph.subjectGuides,
        contextualAssets,
        wrongCase,
      ),
    ).toContain(
      "populism-peoples-party-print: guide passage does not select its context",
    );
  });
});

describe("contextual imagery provenance boundaries", () => {
  it("rejects malformed dates, provenance, URLs, and local path traversal", () => {
    const assets = structuredClone(contextualAssets);
    itemAt(assets, 0).retrievalDate = "2027-02-29";
    itemAt(assets, 1).rightsResolution =
      "unreviewed" as "reviewed-for-distribution";
    itemAt(assets, 2).termsLabel = "";
    itemAt(assets, 2).creditLine = "";
    itemAt(assets, 3).termsUrl = "https://";
    itemAt(assets, 1).boundedPeriod = { startYear: 2000, endYear: 1892 };
    itemAt(itemAt(assets, 0).variants, 0).url =
      "/contextual-media/../../outside.svg";
    expect(
      validateContextualImagery(
        canonicalGraph,
        canonicalGraph.subjectGuides,
        assets,
      ),
    ).toEqual(
      expect.arrayContaining([
        "war-production-board-seal: retrieval date is missing or malformed",
        "war-production-board-seal: asset URL must be local",
        "peoples-party-campaign-print-1892: publication rights are unresolved",
        "peoples-party-campaign-print-1892: bounded period is invalid",
        "guaman-poma-drawing-80: descriptive provenance record is incomplete",
        "sweden-flag: terms locator must use HTTPS",
      ]),
    );
    const leap = structuredClone(contextualAssets);
    itemAt(leap, 0).retrievalDate = "2028-02-29";
    expect(
      validateContextualImagery(
        canonicalGraph,
        canonicalGraph.subjectGuides,
        leap,
      ),
    ).toEqual([]);
  });
});

describe("contextual imagery committed files", () => {
  it("matches every derivative byte, hash, dimension, and SVG safety boundary", () => {
    for (const asset of contextualAssets)
      for (const variant of asset.variants) {
        const bytes = readFileSync(variant.path);
        expect(statSync(variant.path).size, variant.path).toBe(
          variant.byteSize,
        );
        expect(
          createHash("sha256").update(bytes).digest("hex"),
          variant.path,
        ).toBe(variant.sha256);
        if (variant.mimeType === "image/svg+xml") {
          const source = bytes.toString("utf8");
          expect(validateSvgSource(source), variant.path).toEqual([]);
          expect(source).toContain(`width="${variant.width}"`);
          expect(source).toContain(`height="${variant.height}"`);
        } else
          expect(
            rasterDimensions(bytes, variant.mimeType),
            variant.path,
          ).toEqual([variant.width, variant.height]);
      }
  });

  it.each([
    [
      "multiple roots",
      '<svg xmlns="http://www.w3.org/2000/svg"></svg><svg xmlns="http://www.w3.org/2000/svg"></svg>',
      "SVG requires one balanced root",
    ],
    [
      "unbalanced group",
      '<svg xmlns="http://www.w3.org/2000/svg"><g></svg>',
      "SVG element nesting is malformed",
    ],
    [
      "encoded style URL",
      '<svg xmlns="http://www.w3.org/2000/svg"><path style="fill:u&#114;l(https://example.test/a.svg#paint)" /></svg>',
      "SVG contains active, external, embedded, or font content",
    ],
    [
      "active content",
      '<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>',
      "SVG contains active, external, embedded, or font content",
    ],
    [
      "empty title",
      '<svg xmlns="http://www.w3.org/2000/svg"><title></title></svg>',
      "SVG requires a nonempty title",
    ],
    [
      "whitespace title",
      '<svg xmlns="http://www.w3.org/2000/svg"><title>   </title></svg>',
      "SVG requires a nonempty title",
    ],
    [
      "escaped external paint",
      String.raw`<svg xmlns="http://www.w3.org/2000/svg"><path fill="u\72l(https://example.test/a.svg#paint)" /></svg>`,
      "SVG contains an unreviewed attribute",
    ],
  ])("rejects %s", (_name, source, finding) => {
    expect(validateSvgSource(source)).toContain(finding);
  });
});
