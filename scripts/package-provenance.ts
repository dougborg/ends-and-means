import { readFileSync, readdirSync, statSync } from "node:fs";
import { createHash } from "node:crypto";
import { join } from "node:path";

export interface PackageManifestEvidence {
  license: string;
  source: string | null;
}

interface PlatformEvidenceFile {
  schemaVersion: number;
  observations: Array<PackageManifestEvidence & { key: string; platform: string }>;
}

export function readCommittedPackageEvidence(path = "provenance/platform-package-evidence.json") {
  const file = JSON.parse(readFileSync(path, "utf8")) as PlatformEvidenceFile;
  if (file.schemaVersion !== 1) throw new Error("platform package evidence schemaVersion must be 1");
  const evidence = new Map<string, PackageManifestEvidence>();
  for (const observation of file.observations) {
    if (!observation.key || !observation.platform || !observation.license || !observation.source || evidence.has(observation.key)) throw new Error(`Invalid or duplicate platform package evidence: ${observation.key}`);
    evidence.set(observation.key, { license: observation.license, source: observation.source });
  }
  return evidence;
}

export function mergePackageEvidence(committed: Map<string, PackageManifestEvidence>, installed: Map<string, PackageManifestEvidence>) {
  const merged = new Map(committed);
  for (const [key, evidence] of installed) {
    const prior = merged.get(key);
    if (prior && (prior.license !== evidence.license || prior.source !== evidence.source)) throw new Error(`${key}: installed manifest conflicts with committed platform evidence`);
    merged.set(key, evidence);
  }
  return merged;
}

interface PackageManifest {
  name?: string;
  version?: string;
  license?: string | { type?: string };
  homepage?: string;
  repository?: string | { url?: string };
}

function packageDirectories(root: string) {
  const directories: string[] = [];
  for (const entry of readdirSync(root)) {
    const path = join(root, entry);
    if (entry.startsWith("@") && statSync(path).isDirectory()) {
      for (const child of readdirSync(path)) directories.push(join(path, child));
    } else if (statSync(path).isDirectory()) directories.push(path);
  }
  return directories;
}

function sourceFrom(manifest: PackageManifest) {
  if (typeof manifest.repository === "string") return manifest.repository;
  return manifest.repository?.url ?? manifest.homepage ?? null;
}

function licenseFrom(manifest: PackageManifest) {
  if (typeof manifest.license === "string") return manifest.license;
  return manifest.license?.type ?? "unresolved";
}

export function readInstalledPackageEvidence(root = "node_modules/.pnpm") {
  const metadata = new Map<string, PackageManifestEvidence>();
  for (const virtualStore of readdirSync(root)) {
    const modules = join(root, virtualStore, "node_modules");
    try {
      for (const directory of packageDirectories(modules)) {
        const manifest = JSON.parse(readFileSync(join(directory, "package.json"), "utf8")) as PackageManifest;
        if (manifest.name && manifest.version) metadata.set(`${manifest.name}@${manifest.version}`, { license: licenseFrom(manifest), source: sourceFrom(manifest) });
      }
    } catch {
      // Cross-platform optional packages are not installed on every audit host.
    }
  }
  return metadata;
}

export function packageIdentity(key: string) {
  const separator = key.lastIndexOf("@");
  return { name: key.slice(0, separator), version: key.slice(separator + 1) };
}

export function packageLocators(name: string, version: string) {
  const encodedName = encodeURIComponent(name);
  return {
    origin: `https://registry.npmjs.org/${encodedName}/${version}`,
    terms: `https://www.npmjs.com/package/${encodedName}/v/${version}?activeTab=code`,
  };
}

export function packageEvidenceDigest(record: { name: string; version: string; license: string; source: string | null; metadataStatus: string }) {
  return createHash("sha256").update(JSON.stringify([record.name, record.version, record.license, record.source, record.metadataStatus])).digest("hex");
}
