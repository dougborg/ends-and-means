interface ClosablePage {
  close(): Promise<void>;
  isClosed(): boolean;
}

interface PageContext<Page extends ClosablePage> {
  pages(): Page[];
}

export async function closeEventuallyOpenedPages<Page extends ClosablePage>(
  context: PageContext<Page>,
  existingPages: ReadonlySet<Page>,
  requestPage: () => Page | undefined,
  timeout: number,
) {
  const deadline = Date.now() + timeout;

  while (Date.now() <= deadline) {
    const openedPages = new Set(
      context.pages().filter((page) => !existingPages.has(page)),
    );
    const framePage = requestPage();
    if (framePage !== undefined) openedPages.add(framePage);

    if (openedPages.size > 0) {
      await Promise.all(
        [...openedPages].map((page) =>
          page.isClosed() ? undefined : page.close(),
        ),
      );
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 10));
  }

  throw new Error("Native navigation target was not registered for cleanup");
}
