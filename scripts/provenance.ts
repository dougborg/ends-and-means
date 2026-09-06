import { extname } from "node:path";
import { packageEvidenceDigest, packageIdentity, packageLocators, type PackageManifestEvidence } from "./package-provenance.ts";

export function trackedFilesFromGit(run: () => string) {
  try {
    return run().split("\0").filter(Boolean);
  } catch {
    throw new Error("Unable to list tracked files. Run pnpm audit:provenance inside a Git checkout with git available.");
  }
}

export interface ProvenanceInventory {
  schemaVersion: number;
  boundaries: Array<{ id: string; pathPrefix: string } & Classification>;
  rootFiles: Array<{ path: string } & Classification>;
  assetClasses: Array<{ class: string; extensions: string[]; paths: string[]; state: "none" | "present" | "generated" }>;
  thirdPartyAssets: Array<{
    id: string;
    paths: string[];
    origin: string;
    authorOrProvider: string;
    licenseOrTerms: string;
    termsLocator: string;
    modified: boolean;
    distribution: "source-only" | "source-and-site" | "site";
    distributionNote?: string;
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

interface Classification {
  material: "repository-owned" | "mixed-unresolved" | "mixed-third-party-metadata" | "generated-third-party-metadata";
  kind: "code" | "canonical-data" | "documentation" | "archive" | "site-input" | "configuration" | "package-manifest" | "dependency-lockfile";
  distribution: "source-only" | "source-and-site" | "site";
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
    evidenceDigest: string;
  }>;
}

function completeThirdPartyRecord(record: ProvenanceInventory["thirdPartyAssets"][number]) {
  return record.paths.length > 0 && ["source-only", "source-and-site", "site"].includes(record.distribution) && [record.origin, record.authorOrProvider, record.licenseOrTerms, record.termsLocator, record.attribution, record.resolution].every(Boolean);
}

function validPath(path: string, prefix: boolean) {
  const body = path.endsWith("/") ? path.slice(0, -1) : path;
  const segments = body.split("/");
  return body.length > 0 && !path.startsWith("/") && !path.includes("\\") && !path.includes("\0") && segments.every((segment) => segment.length > 0 && segment !== "." && segment !== "..") && (prefix === path.endsWith("/"));
}

function pathMatches(path: string, file: string) {
  return path.endsWith("/") ? file.startsWith(path) : file === path;
}

function completeClassification(record: { material: string; kind: string; distribution: string }) {
  return ["repository-owned", "mixed-unresolved", "mixed-third-party-metadata", "generated-third-party-metadata"].includes(record.material) && ["code", "canonical-data", "documentation", "archive", "site-input", "configuration", "package-manifest", "dependency-lockfile"].includes(record.kind) && ["source-only", "source-and-site", "site"].includes(record.distribution);
}

function auditTrackedFile(file: string, inventory: ProvenanceInventory, rootFiles: Map<string, ProvenanceInventory["rootFiles"][number]>, governedExtensions: Set<string>, registeredPaths: string[]) {
  const findings: string[] = [];
  const matches = inventory.boundaries.filter(({ pathPrefix }) => pathMatches(pathPrefix, file));
  const rootRecord = rootFiles.get(file);
  const classificationCount = matches.length + Number(Boolean(rootRecord));
  if (classificationCount !== 1) findings.push(`${file}: expected exactly one licensing boundary, found ${classificationCount}`);
  if (rootRecord && !completeClassification(rootRecord)) findings.push(`${file}: root-file licensing boundary is incomplete`);
  if (governedExtensions.has(extname(file).toLowerCase()) && !registeredPaths.some((path) => pathMatches(path, file))) findings.push(`${file}: governed asset lacks provenance metadata`);
  return findings;
}

function auditBoundaryDefinitions(inventory: ProvenanceInventory, trackedFiles: string[], rootFiles: Map<string, ProvenanceInventory["rootFiles"][number]>) {
  const findings: string[] = [];
  if (rootFiles.size !== inventory.rootFiles.length) findings.push("root-file boundaries contain duplicate paths");
  for (const record of inventory.rootFiles) if (!validPath(record.path, false)) findings.push(`${record.path}: invalid root-file path`);
  for (const boundary of inventory.boundaries) {
    if (!validPath(boundary.pathPrefix, true)) findings.push(`${boundary.id}: invalid directory boundary prefix`);
    if (!completeClassification(boundary)) findings.push(`${boundary.id}: directory licensing boundary is incomplete`);
  }
  for (const path of rootFiles.keys()) if (!trackedFiles.includes(path)) findings.push(`${path}: root-file boundary does not match a tracked file`);
  return findings;
}

function auditTrackedFiles(inventory: ProvenanceInventory, trackedFiles: string[]) {
  const findings: string[] = [];
  const rootFiles = new Map(inventory.rootFiles.map((record) => [record.path, record]));
  const governedExtensions = new Set(inventory.assetClasses.flatMap(({ extensions }) => extensions));
  const registeredPaths = inventory.thirdPartyAssets.flatMap(({ paths }) => paths);
  for (const file of trackedFiles) findings.push(...auditTrackedFile(file, inventory, rootFiles, governedExtensions, registeredPaths));
  return findings.concat(auditBoundaryDefinitions(inventory, trackedFiles, rootFiles));
}

function auditAssetClasses(inventory: ProvenanceInventory, trackedFiles: string[]) {
  const findings: string[] = [];
  for (const assetClass of inventory.assetClasses) {
    const discovered = trackedFiles.filter((file) => assetClass.extensions.includes(extname(file).toLowerCase()));
    const missingPaths = assetClass.paths.filter((path) => !validPath(path, path.endsWith("/")) || !trackedFiles.some((file) => pathMatches(path, file)));
    if (missingPaths.length > 0) findings.push(`${assetClass.class}: declared asset paths are not tracked: ${missingPaths.join(", ")}`);
    const declared = trackedFiles.filter((file) => assetClass.paths.some((path) => pathMatches(path, file)));
    const count = new Set([...discovered, ...declared]).size;
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
    for (const path of record.paths) if (!validPath(path, path.endsWith("/")) || !trackedFiles.some((file) => pathMatches(path, file))) findings.push(`${record.id}: ${path} does not match a safe tracked path or directory prefix`);
    if (!record.termsLocator.startsWith("http") && !locatorExists(record.termsLocator)) findings.push(`${record.id}: terms locator does not exist`);
    if (record.licenseOrTerms === "unresolved" && record.distribution !== "source-only") findings.push(`${record.id}: unresolved material cannot be published`);
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

export function auditLockfilePackages(inventory: LockfilePackageInventory, lockfileKeys: string[], installed: Map<string, PackageManifestEvidence>) {
  const findings: string[] = [];
  if (inventory.schemaVersion !== 1 || inventory.lockfile !== "pnpm-lock.yaml") findings.push("lockfile package inventory header is invalid");
  const expected = new Set(lockfileKeys);
  const actual = new Map(inventory.packages.map((record) => [record.key, record]));
  if (actual.size !== inventory.packages.length) findings.push("lockfile package inventory contains duplicate keys");
  for (const key of expected) {
    const record = actual.get(key);
    if (!record) findings.push(`${key}: locked package lacks provenance metadata`);
    else findings.push(...auditLockfileRecord(key, record, installed.get(key)));
  }
  for (const key of actual.keys()) if (!expected.has(key)) findings.push(`${key}: provenance entry is not in pnpm-lock.yaml`);
  return findings;
}

function auditLockfileRecord(key: string, record: LockfilePackageInventory["packages"][number], evidence: PackageManifestEvidence | undefined) {
  if (![record.name, record.version, record.origin, record.license, record.terms, record.metadataStatus, record.evidenceDigest].every(Boolean)) return [`${key}: locked package provenance metadata is incomplete`];
  const identity = packageIdentity(key);
  if (record.name !== identity.name || record.version !== identity.version) return [`${key}: locked package identity does not match its key`];
  const locators = packageLocators(identity.name, identity.version);
  if (record.origin !== locators.origin || record.terms !== locators.terms) return [`${key}: registry origin or terms locator is not deterministic`];
  if (record.evidenceDigest !== packageEvidenceDigest(record)) return [`${key}: package evidence digest does not match license/source metadata`];
  const resolutionFinding = auditInstalledResolution(key, record, evidence);
  if (resolutionFinding) return [resolutionFinding];
  if (record.metadataStatus === "unresolved" && (record.license !== "unresolved" || record.source !== null)) return [`${key}: unavailable package metadata must remain explicitly unresolved`];
  if (record.metadataStatus === "resolved" && !record.source) return [`${key}: resolved package lacks an upstream source locator`];
  const evidenceFinding = auditInstalledEvidence(key, record, evidence);
  if (evidenceFinding) return [evidenceFinding];
  return [];
}

function auditInstalledResolution(key: string, record: LockfilePackageInventory["packages"][number], evidence: PackageManifestEvidence | undefined) {
  return evidence && record.metadataStatus !== "resolved" ? `${key}: installed package evidence must be recorded as resolved` : undefined;
}

function auditInstalledEvidence(key: string, record: LockfilePackageInventory["packages"][number], evidence: PackageManifestEvidence | undefined) {
  if (!evidence) return undefined;
  if (record.license !== evidence.license || record.source !== evidence.source) return `${key}: license or source differs from the installed package manifest`;
  return undefined;
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
