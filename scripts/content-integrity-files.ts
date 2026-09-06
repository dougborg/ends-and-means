import { readdir, readFile } from "node:fs/promises";
import { relative, resolve } from "node:path";
import { compareCodeUnits, type PublicationFile } from "../src/lib/domain";

export async function walkRequiredFiles(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const paths = await Promise.all(
    entries
      .toSorted((left, right) => compareCodeUnits(left.name, right.name))
      .map((entry) => {
        const pathname = resolve(directory, entry.name);
        return entry.isDirectory() ? walkRequiredFiles(pathname) : [pathname];
      }),
  );
  return paths.flat().sort(compareCodeUnits);
}

export async function loadPublicationFiles(
  root: string,
  directories: string[],
  include: RegExp,
): Promise<PublicationFile[]> {
  const paths = (
    await Promise.all(
      directories.map((directory) =>
        walkRequiredFiles(resolve(root, directory)),
      ),
    )
  )
    .flat()
    .filter((pathname) => include.test(pathname))
    .sort(compareCodeUnits);
  return Promise.all(
    paths.map(async (pathname) => ({
      path: relative(root, pathname),
      content: await readFile(pathname, "utf8"),
    })),
  );
}
