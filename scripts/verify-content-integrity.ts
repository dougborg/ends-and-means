import { relative } from "node:path";
import { canonicalDocuments } from "../content/domain";
import { resolveNarrativeDirectory } from "../content/domain/presentation/load-narrative";
import {
  formatIntegrityResult,
  runContentIntegrity,
} from "../src/lib/domain/content-integrity";
import { canonicalGraph } from "../src/lib/domain/canonical";
import { validateNarrativeLines } from "../src/lib/narrative-lines";
import { loadPublicationFiles } from "./content-integrity-files";

const root = process.cwd();

const narratives = (
  await loadPublicationFiles(
    root,
    [relative(root, resolveNarrativeDirectory())],
    /\.md$/u,
  )
).map((file) => ({
  ...file,
  lineErrors: validateNarrativeLines(file.content),
}));
const runtimeFiles = await loadPublicationFiles(
  root,
  ["src", "content/domain"],
  /\.(?:astro|css|js|json|md|ts)$/u,
);
const builtFiles = await loadPublicationFiles(
  root,
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
