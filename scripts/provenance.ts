import { extname } from "node:path";

export function trackedFilesFromGit(run: () => string) {
  try {
    return run().trim().split("\n").filter(Boolean);
  } catch {
    throw new Error("Unable to list tracked files. Run pnpm audit:provenance inside a Git checkout with git available.");
  }
}

export interface ProvenanceInventory {
  schemaVersion: number;
  boundaries: Array<{ id: string; pathPrefix: string }>;
  rootFiles: Array<{ path: string; material: string; kind: string; distribution: string }>;
  assetClasses: Array<{ class: string; extensions: string[]; paths: string[]; state: "none" | "present" | "generated" }>;
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
    scope: "runtime" | "development" | "optional";
    license: string;
    source: string;
    terms: string;
  }>;
}

export interface LockfilePackageInventory {
  schemaVersion: number;
  lockfile: string;
  packages: Array<{
    key: string;
    name: string;
    version: string;
    origin: string;
    source: string | null;
    license: string;
    terms: string;
    metadataStatus: "resolved" | "unresolved";
  }>;
}

function completeThirdPartyRecord(record: ProvenanceInventory["thirdPartyAssets"][number]) {
  return record.paths.length > 0 && [record.origin, record.authorOrProvider, record.licenseOrTerms, record.termsLocator, record.distribution, record.attribution, record.resolution].every(Boolean);
}

function auditTrackedFiles(inventory: ProvenanceInventory, trackedFiles: string[]) {
  const findings: string[] = [];
  const rootFiles = new Map(inventory.rootFiles.map((record) => [record.path, record]));
  const governedExtensions = new Set(inventory.assetClasses.flatMap(({ extensions }) => extensions));
  const registeredPaths = inventory.thirdPartyAssets.flatMap(({ paths }) => paths);
  for (const file of trackedFiles) {
    const matches = inventory.boundaries.filter(({ pathPrefix }) => file.startsWith(pathPrefix));
    const rootRecord = rootFiles.get(file);
    if (!rootRecord && matches.length !== 1) findings.push(`${file}: expected exactly one licensing boundary, found ${matches.length}`);
    if (rootRecord && ![rootRecord.material, rootRecord.kind, rootRecord.distribution].every(Boolean)) findings.push(`${file}: root-file licensing boundary is incomplete`);
    if (governedExtensions.has(extname(file).toLowerCase()) && !registeredPaths.includes(file)) findings.push(`${file}: governed asset lacks provenance metadata`);
  }
  for (const path of rootFiles.keys()) if (!trackedFiles.includes(path)) findings.push(`${path}: root-file boundary does not match a tracked file`);
  return findings;
}

function auditAssetClasses(inventory: ProvenanceInventory, trackedFiles: string[]) {
  const findings: string[] = [];
  for (const assetClass of inventory.assetClasses) {
    const discovered = trackedFiles.filter((file) => assetClass.extensions.includes(extname(file).toLowerCase()));
    const missingPaths = assetClass.paths.filter((path) => !trackedFiles.includes(path));
    if (missingPaths.length > 0) findings.push(`${assetClass.class}: declared asset paths are not tracked: ${missingPaths.join(", ")}`);
    const count = new Set([...discovered, ...assetClass.paths]).size;
    if (assetClass.state === "none" && count > 0) findings.push(`${assetClass.class}: state is none but ${count} tracked asset(s) exist`);
    if (assetClass.state === "present" && count === 0) findings.push(`${assetClass.class}: state is present but no tracked assets exist`);
    if (assetClass.state === "generated" && count > 0) findings.push(`${assetClass.class}: generated assets must not be tracked`);
  }
  return findings;
}

function auditThirdPartyAssets(inventory: ProvenanceInventory, trackedFiles: string[], locatorExists: (path: string) => boolean) {
  const findings: string[] = [];
  for (const record of inventory.thirdPartyAssets) {
    if (!completeThirdPartyRecord(record)) findings.push(`${record.id}: third-party provenance record is incomplete`);
    for (const path of record.paths) if (!trackedFiles.some((file) => file === path || file.startsWith(path))) findings.push(`${record.id}: ${path} does not match a tracked path`);
    if (!record.termsLocator.startsWith("http") && !locatorExists(record.termsLocator)) findings.push(`${record.id}: terms locator does not exist`);
    if (record.licenseOrTerms === "unresolved" && /site/.test(record.distribution) && !/source-only/.test(record.distribution)) findings.push(`${record.id}: unresolved material cannot be published`);
  }
  return findings;
}

function auditDependencies(inventory: ProvenanceInventory, manifest: { dependencies?: Record<string, string>; devDependencies?: Record<string, string>; optionalDependencies?: Record<string, string> }) {
  const findings: string[] = [];
  const expected = new Map([
    ...Object.keys(manifest.dependencies ?? {}).map((name) => [name, "runtime"] as const),
    ...Object.keys(manifest.devDependencies ?? {}).map((name) => [name, "development"] as const),
    ...Object.keys(manifest.optionalDependencies ?? {}).map((name) => [name, "optional"] as const),
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

export function auditLockfilePackages(inventory: LockfilePackageInventory, lockfileKeys: string[]) {
  const findings: string[] = [];
  if (inventory.schemaVersion !== 1 || inventory.lockfile !== "pnpm-lock.yaml") findings.push("lockfile package inventory header is invalid");
  const expected = new Set(lockfileKeys);
  const actual = new Map(inventory.packages.map((record) => [record.key, record]));
  if (actual.size !== inventory.packages.length) findings.push("lockfile package inventory contains duplicate keys");
  for (const key of expected) {
    const record = actual.get(key);
    if (!record) findings.push(`${key}: locked package lacks provenance metadata`);
    else findings.push(...auditLockfileRecord(key, record));
  }
  for (const key of actual.keys()) if (!expected.has(key)) findings.push(`${key}: provenance entry is not in pnpm-lock.yaml`);
  return findings;
}

function auditLockfileRecord(key: string, record: LockfilePackageInventory["packages"][number]) {
  if (![record.name, record.version, record.origin, record.license, record.terms, record.metadataStatus].every(Boolean)) return [`${key}: locked package provenance metadata is incomplete`];
  if (`${record.name}@${record.version}` !== key) return [`${key}: locked package identity does not match its key`];
  if ((record.license === "unresolved") !== (record.metadataStatus === "unresolved")) return [`${key}: unresolved license status is inconsistent`];
  if (record.metadataStatus === "resolved" && !record.source) return [`${key}: resolved package lacks an upstream source locator`];
  return [];
}

export function auditProvenance(
  inventory: ProvenanceInventory,
  trackedFiles: string[],
  manifest: { dependencies?: Record<string, string>; devDependencies?: Record<string, string>; optionalDependencies?: Record<string, string> },
  locatorExists: (path: string) => boolean,
) {
  const findings: string[] = [];
  if (inventory.schemaVersion !== 1) findings.push("inventory schemaVersion must be 1");
  return findings.concat(auditTrackedFiles(inventory, trackedFiles), auditAssetClasses(inventory, trackedFiles), auditThirdPartyAssets(inventory, trackedFiles, locatorExists), auditDependencies(inventory, manifest));
}
