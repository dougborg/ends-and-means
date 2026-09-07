import { describe, expect, it, vi } from "vitest";
import {
  closeRegisteredPages,
  observeOpenedPage,
} from "../../scripts/browser-page-cleanup";

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
  it("observes registration before activation and closes a delayed target", async () => {
    const sourcePage = page();
    const delayedPage = page();
    const pages = [sourcePage];
    let pagePredicate: ((candidate: typeof sourcePage) => boolean) | undefined;
    let registerPage:
      | ((registeredPage: typeof delayedPage) => void)
      | undefined;
    const pageRegistration = new Promise<typeof delayedPage>((resolve) => {
      registerPage = resolve;
    });
    const context = {
      pages: () => pages,
      waitForEvent: vi.fn(
        async (
          _event: "page",
          options: {
            predicate: (candidate: typeof sourcePage) => boolean;
            timeout: number;
          },
        ) => {
          pagePredicate = options.predicate;
          return pageRegistration;
        },
      ),
    };
    const existingPages = new Set(pages);
    const registeredPage = observeOpenedPage(context, existingPages, 5_000);

    expect(context.waitForEvent).toHaveBeenCalledOnce();
    expect(pagePredicate?.(sourcePage)).toBe(false);
    expect(pagePredicate?.(delayedPage)).toBe(true);

    const cleanup = closeRegisteredPages(
      context,
      existingPages,
      registeredPage,
    );
    expect(delayedPage.close).not.toHaveBeenCalled();
    registerPage?.(delayedPage);
    await cleanup;
    expect(delayedPage.close).toHaveBeenCalledOnce();
    expect(sourcePage.close).not.toHaveBeenCalled();
  });

  it("closes a registered target even when it is absent from the later snapshot", async () => {
    const sourcePage = page();
    const transientPage = page();

    await closeRegisteredPages(
      { pages: () => [sourcePage] },
      new Set([sourcePage]),
      Promise.resolve(transientPage),
    );

    expect(transientPage.close).toHaveBeenCalledOnce();
    expect(sourcePage.close).not.toHaveBeenCalled();
  });

  it("fails when the expected target registration rejects", async () => {
    const sourcePage = page();
    await expect(
      closeRegisteredPages(
        { pages: () => [sourcePage] },
        new Set([sourcePage]),
        Promise.reject(new Error("timed out")),
      ),
    ).rejects.toThrow("not registered for cleanup");
  });
});
