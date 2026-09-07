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
  it("closes the request page without waiting for a context page event", async () => {
    const sourcePage = page();
    const requestPage = page();
    const context = {
      pages: () => [sourcePage],
      waitForEvent: vi.fn(() => new Promise(() => undefined)),
    };

    await closeEventuallyOpenedPages(
      context,
      new Set([sourcePage]),
      () => requestPage,
      20,
    );

    expect(context.waitForEvent).not.toHaveBeenCalled();
    expect(requestPage.close).toHaveBeenCalledOnce();
    expect(sourcePage.close).not.toHaveBeenCalled();
  });

  it("closes a request page whose frame becomes available after the request", async () => {
    const sourcePage = page();
    const requestPage = page();
    const resolveRequestPage = vi
      .fn<() => ReturnType<typeof page> | undefined>()
      .mockReturnValueOnce(undefined)
      .mockReturnValueOnce(undefined)
      .mockReturnValue(requestPage);

    await closeEventuallyOpenedPages(
      { pages: () => [sourcePage] },
      new Set([sourcePage]),
      resolveRequestPage,
      100,
    );

    expect(resolveRequestPage).toHaveBeenCalledTimes(3);
    expect(requestPage.close).toHaveBeenCalledOnce();
    expect(sourcePage.close).not.toHaveBeenCalled();
  });

  it("fails when neither the request nor context exposes a target", async () => {
    const sourcePage = page();
    await expect(
      closeEventuallyOpenedPages(
        { pages: () => [sourcePage] },
        new Set([sourcePage]),
        () => undefined,
        20,
      ),
    ).rejects.toThrow("not registered for cleanup");
  });
});
