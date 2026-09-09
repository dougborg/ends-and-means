import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { contextualAssets } from "../../src/lib/contextual-imagery";

const dist = path.resolve(import.meta.dirname, "../../dist");
const htmlFor = (route: string) =>
  readFile(path.join(dist, route, "index.html"), "utf8");
const count = (text: string, pattern: RegExp) =>
  [...text.matchAll(pattern)].length;

function selectedSection(html: string, sectionId: string, className: string) {
  const start = html.indexOf(`<section id="${sectionId}" class="${className}`);
  if (start < 0) return "";
  const next = html.indexOf("<section id=", start + 12);
  return html.slice(start, next < 0 ? undefined : next);
}

describe("built contextual imagery routes", () => {
  it.each([
    [
      "guides/central-planning",
      "institutions-and-mechanisms",
      "central-planning-wpb-seal",
    ],
    ["guides/populism", "bounded-practice", "populism-peoples-party-print"],
    [
      "guides/tawantinsuyu-imperial-organization",
      "variants-disputes-and-limits",
      "tawantinsuyu-guaman-poma-drawing",
    ],
    [
      "guides/economic-democracy",
      "bounded-practice",
      "economic-democracy-sweden-place",
    ],
    [
      "concepts/social-ownership",
      "what-do-the-swedish-cases-show",
      "social-ownership-sweden-place",
    ],
  ])(
    "places %s media inside its selected section",
    async (route, sectionId, placementId) => {
      const html = await htmlFor(route);
      const className = route.startsWith("guides/")
        ? "subject-guide__section"
        : "narrative-section";
      const section = selectedSection(html, sectionId, className);
      expect(section).toContain(`data-contextual-placement="${placementId}"`);
      expect(
        count(
          html,
          new RegExp(`data-contextual-placement="${placementId}"`, "g"),
        ),
      ).toBe(1);
    },
  );

  it("renders both diagrams as sourced semantic HTML without fragment collisions", async () => {
    for (const [route, id, itemCount] of [
      ["concepts/social-ownership", "social-ownership-rights-diagram", 4],
      ["concepts/populism", "populism-attributed-accounts-diagram", 5],
    ] as const) {
      const html = await htmlFor(route);
      const diagram =
        html.match(
          new RegExp(
            `<figure[^>]*data-concept-diagram="${id}"[\\s\\S]*?</figure>`,
          ),
        )?.[0] ?? "";
      expect(diagram).toContain("Sources for this diagram");
      expect(
        count(diagram.match(/<ol>[\s\S]*?<\/ol>/)?.[0] ?? "", /<li>/g),
      ).toBe(itemCount);
      const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map(
        ([, value]) => value,
      );
      expect(new Set(ids).size).toBe(ids.length);
    }
  });

  it("ships only local registered variants and leaves an image-free route empty", async () => {
    const guide = await htmlFor("guides/populism");
    expect(guide).not.toMatch(/<(?:img|source)[^>]+(?:src|srcset)="https?:/i);
    expect(await htmlFor("concepts/liberalism")).not.toContain(
      "data-contextual-placement",
    );
    for (const asset of contextualAssets)
      for (const variant of asset.variants) {
        await expect(
          readFile(path.join(dist, variant.url.slice(1))),
        ).resolves.toHaveLength(variant.byteSize);
      }
  });
});
