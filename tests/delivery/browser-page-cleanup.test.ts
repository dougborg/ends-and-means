import { describe, expect, it, vi } from "vitest";
import { closeEventuallyOpenedPages } from "../../scripts/browser-page-cleanup";

function page() {
  let closed = false;
  return {
    close: vi.fn(async () => {
      closed = true;
    }),
    isClosed: () => closed,
  };
}

describe("browser page cleanup", () => {
  it("closes a target registered after its navigation request", async () => {
    const sourcePage = page();
    const delayedPage = page();
    const pages = [sourcePage];
    const cleanup = closeEventuallyOpenedPages(
      { pages: () => pages },
      new Set(pages),
      100,
    );

    setTimeout(() => pages.push(delayedPage), 20);

    await cleanup;
    expect(delayedPage.close).toHaveBeenCalledOnce();
    expect(sourcePage.close).not.toHaveBeenCalled();
  });

  it("fails when an expected target is never registered", async () => {
    const sourcePage = page();
    await expect(
      closeEventuallyOpenedPages(
        { pages: () => [sourcePage] },
        new Set([sourcePage]),
        20,
      ),
    ).rejects.toThrow("not registered for cleanup");
  });
});
