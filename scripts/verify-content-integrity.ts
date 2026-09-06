import { readdir, readFile } from "node:fs/promises";
import { relative, resolve } from "node:path";
import { canonicalDocuments } from "../content/domain";
import { resolveNarrativeDirectory } from "../content/domain/presentation/load-narrative";
import {
  formatIntegrityResult,
  type PublicationFile,
  runContentIntegrity,
} from "../src/lib/domain";
import { canonicalGraph } from "../src/lib/domain/canonical";
import { validateNarrativeLines } from "../src/lib/narrative-lines";

const root = process.cwd();

async function walk(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true }).catch(
    () => [],
  );
  const paths = await Promise.all(
    entries.map((entry) => {
      const pathname = resolve(directory, entry.name);
      return entry.isDirectory() ? walk(pathname) : [pathname];
    }),
  );
  return paths.flat();
}

async function loadFiles(
  directories: string[],
  include: RegExp,
): Promise<PublicationFile[]> {
  const paths = (
    await Promise.all(
      directories.map((directory) => walk(resolve(root, directory))),
    )
  )
    .flat()
    .filter((pathname) => include.test(pathname));
  return Promise.all(
    paths.map(async (pathname) => ({
      path: relative(root, pathname),
      content: await readFile(pathname, "utf8"),
    })),
  );
}

const narratives = (
  await loadFiles([relative(root, resolveNarrativeDirectory())], /\.md$/u)
).map((file) => ({
  ...file,
  lineErrors: validateNarrativeLines(file.content),
}));
const runtimeFiles = await loadFiles(
  ["src", "content/domain"],
  /\.(?:astro|css|js|json|md|ts)$/u,
);
const builtFiles = await loadFiles(
  ["dist"],
  /\.(?:css|html|js|json|txt|xml)$/u,
);
const result = runContentIntegrity({
  documents: canonicalDocuments,
  graph: canonicalGraph,
  narratives,
  runtimeFiles,
  builtFiles,
});

console.log(formatIntegrityResult(result));

if (result.findings.some(({ severity }) => severity === "violation"))
  process.exitCode = 1;
