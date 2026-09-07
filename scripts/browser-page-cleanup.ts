interface ClosablePage {
  close(): Promise<void>;
  isClosed(): boolean;
}

interface PageContext<Page extends ClosablePage> {
  pages(): Page[];
}

export function pageForNavigationRequest<Page>(request: {
  frame(): { page(): Page };
}) {
  try {
    return request.frame().page();
  } catch (error) {
    if (
      error instanceof Error &&
      /request\s+was issued before the frame is created/i.test(error.message)
    ) {
      return undefined;
    }
    throw error;
  }
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
