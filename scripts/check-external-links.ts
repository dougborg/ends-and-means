import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { canonicalDocuments } from "../content/domain/index";
import { reviewedOrientationOnlyMappings } from "../src/lib/domain/orientation-only-mappings";
import {
  checkExternalLinks,
  discoverCanonicalAuthoringLocations,
  extractExternalLinkInventory,
  renderExternalLinkMarkdown,
  summarizeExternalLinkChecks,
} from "./external-links";

function argument(name: string, fallback: string) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? (process.argv[index + 1] ?? fallback) : fallback;
}

const root = process.cwd();
const jsonPath = resolve(
  root,
  argument("--json", ".artifacts/external-links/report.json"),
);
const markdownPath = resolve(
  root,
  argument("--markdown", ".artifacts/external-links/report.md"),
);
const locations = await discoverCanonicalAuthoringLocations(root);
const generatedOrientationLocations = new Map(
  Object.keys(reviewedOrientationOnlyMappings).map((id) => [
    id,
    "src/lib/domain/orientation-only-mappings.ts",
  ]),
);
const inventory = extractExternalLinkInventory(canonicalDocuments, locations, {
  externalReferenceLocations: generatedOrientationLocations,
});
const checks = await checkExternalLinks(inventory, {
  concurrency: Number(argument("--concurrency", "6")),
  timeoutMs: Number(argument("--timeout-ms", "10000")),
  retries: Number(argument("--retries", "1")),
});
const report = {
  schemaVersion: 1,
  generatedAt: new Date().toISOString(),
  policy: "report-only" as const,
  summary: summarizeExternalLinkChecks(checks),
  checks,
};
await Promise.all([
  mkdir(dirname(jsonPath), { recursive: true }),
  mkdir(dirname(markdownPath), { recursive: true }),
]);
await Promise.all([
  writeFile(jsonPath, `${JSON.stringify(report, null, 2)}\n`),
  writeFile(markdownPath, renderExternalLinkMarkdown(checks)),
]);
console.log(renderExternalLinkMarkdown(checks));
