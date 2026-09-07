interface ClosablePage {
  close(): Promise<void>;
  isClosed(): boolean;
}

interface PageContext<Page extends ClosablePage> {
  pages(): Page[];
  waitForEvent(
    event: "page",
    options: { predicate: (page: Page) => boolean; timeout: number },
  ): Promise<Page>;
}

export function observeOpenedPage<Page extends ClosablePage>(
  context: PageContext<Page>,
  existingPages: ReadonlySet<Page>,
  timeout: number,
) {
  return context.waitForEvent("page", {
    predicate: (page) => !existingPages.has(page),
    timeout,
  });
}

export async function closeRegisteredPages<Page extends ClosablePage>(
  context: Pick<PageContext<Page>, "pages">,
  existingPages: ReadonlySet<Page>,
  registeredPage: Promise<Page>,
) {
  let firstRegisteredPage: Page;
  try {
    firstRegisteredPage = await registeredPage;
  } catch {
    throw new Error("Native navigation target was not registered for cleanup");
  }

  const openedPages = new Set([
    firstRegisteredPage,
    ...context.pages().filter((page) => !existingPages.has(page)),
  ]);
  await Promise.all(
    [...openedPages].map((page) =>
      page.isClosed() ? undefined : page.close(),
    ),
  );
}
