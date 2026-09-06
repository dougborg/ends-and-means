import { extname } from "node:path";

export interface ProvenanceInventory {
  schemaVersion: number;
  boundaries: Array<{ id: string; pathPrefix: string }>;
  rootFiles: string[];
  assetClasses: Array<{ class: string; extensions: string[]; state: string }>;
  thirdPartyAssets: Array<{
    id: string;
    paths: string[];
    origin: string;
    authorOrProvider: string;
    licenseOrTerms: string;
    termsLocator: string;
    modified: boolean;
    distribution: string;
    attribution: string;
    resolution: string;
  }>;
  dependencies: Array<{
    name: string;
    scope: "runtime" | "development";
    license: string;
    source: string;
    terms: string;
  }>;
}

function completeThirdPartyRecord(record: ProvenanceInventory["thirdPartyAssets"][number]) {
  return [record.origin, record.authorOrProvider, record.licenseOrTerms, record.termsLocator, record.distribution, record.attribution, record.resolution].every(Boolean);
}

function auditTrackedFiles(inventory: ProvenanceInventory, trackedFiles: string[]) {
  const findings: string[] = [];
  const rootFiles = new Set(inventory.rootFiles);
  const governedExtensions = new Set(inventory.assetClasses.flatMap(({ extensions }) => extensions));
  const registeredPaths = inventory.thirdPartyAssets.flatMap(({ paths }) => paths);
  for (const file of trackedFiles) {
    const matches = inventory.boundaries.filter(({ pathPrefix }) => file.startsWith(pathPrefix));
    if (!rootFiles.has(file) && matches.length !== 1) findings.push(`${file}: expected exactly one licensing boundary, found ${matches.length}`);
    if (governedExtensions.has(extname(file).toLowerCase()) && !registeredPaths.includes(file)) findings.push(`${file}: governed asset lacks provenance metadata`);
  }
  return findings;
}

function auditThirdPartyAssets(inventory: ProvenanceInventory, locatorExists: (path: string) => boolean) {
  const findings: string[] = [];
  for (const record of inventory.thirdPartyAssets) {
    if (!completeThirdPartyRecord(record)) findings.push(`${record.id}: third-party provenance record is incomplete`);
    if (!record.termsLocator.startsWith("http") && !locatorExists(record.termsLocator)) findings.push(`${record.id}: terms locator does not exist`);
    if (record.licenseOrTerms === "unresolved" && /site/.test(record.distribution) && !/source-only/.test(record.distribution)) findings.push(`${record.id}: unresolved material cannot be published`);
  }
  return findings;
}

function auditDependencies(inventory: ProvenanceInventory, manifest: { dependencies?: Record<string, string>; devDependencies?: Record<string, string> }) {
  const findings: string[] = [];
  const expected = new Map([
    ...Object.keys(manifest.dependencies ?? {}).map((name) => [name, "runtime"] as const),
    ...Object.keys(manifest.devDependencies ?? {}).map((name) => [name, "development"] as const),
  ]);
  const actual = new Map(inventory.dependencies.map((dependency) => [dependency.name, dependency]));
  for (const [name, scope] of expected) {
    const dependency = actual.get(name);
    if (!dependency) findings.push(`${name}: direct dependency lacks provenance metadata`);
    else if (dependency.scope !== scope || !dependency.license || !dependency.source || !dependency.terms) findings.push(`${name}: dependency provenance metadata is incomplete or has the wrong scope`);
  }
  for (const name of actual.keys()) if (!expected.has(name)) findings.push(`${name}: provenance entry is not a direct dependency`);
  return findings;
}

export function auditProvenance(
  inventory: ProvenanceInventory,
  trackedFiles: string[],
  manifest: { dependencies?: Record<string, string>; devDependencies?: Record<string, string> },
  locatorExists: (path: string) => boolean,
) {
  const findings: string[] = [];
  if (inventory.schemaVersion !== 1) findings.push("inventory schemaVersion must be 1");
  return findings.concat(auditTrackedFiles(inventory, trackedFiles), auditThirdPartyAssets(inventory, locatorExists), auditDependencies(inventory, manifest));
}
