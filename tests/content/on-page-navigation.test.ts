import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { describe, expect, it } from "vitest";
import OnPageNavigation from "../../src/components/OnPageNavigation.astro";
import {
  hasUsefulOnPageNavigation,
  minimumOnPageNavigationItems,
} from "../../src/lib/on-page-navigation";

const denseItems = [
  { id: "plain-answer", label: "The plain answer" },
  { id: "boundaries", label: "Meanings and boundaries" },
  { id: "practice", label: "What happened in practice?" },
];

describe("generated on-page navigation", () => {
  it("omits navigation below the useful-destination threshold", async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(OnPageNavigation, {
      props: { pageLabel: "Sparse subject", items: denseItems.slice(0, 2) },
    });

    expect(minimumOnPageNavigationItems).toBe(3);
    expect(hasUsefulOnPageNavigation(denseItems.slice(0, 2))).toBe(false);
    expect(html).not.toContain("page-outline");
  });

  it("derives desktop and native-mobile links from one ordered item contract", async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(OnPageNavigation, {
      props: {
        pageLabel: "Dense subject",
        items: denseItems,
        referenceLink: {
          href: "/concepts/dense/",
          label: "Open the reference page",
        },
      },
    });

    expect(hasUsefulOnPageNavigation(denseItems)).toBe(true);
    expect(html).toContain('<details class="page-outline__mobile"');
    expect(html).toContain('aria-label="On this page: Dense subject"');
    for (const item of denseItems) {
      expect(html.match(new RegExp(`href="#${item.id}"`, "g"))).toHaveLength(2);
      expect(
        html.match(new RegExp(item.label.replace("?", "\\?"), "g")),
      ).toHaveLength(2);
    }
  });
});
