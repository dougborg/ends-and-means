import { readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { parse } from "yaml";
import type { LockfilePackageInventory } from "./provenance.ts";

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

function installedMetadata() {
  const metadata = new Map<string, PackageManifest>();
  for (const virtualStore of readdirSync("node_modules/.pnpm")) {
    const modules = join("node_modules/.pnpm", virtualStore, "node_modules");
    try {
      for (const directory of packageDirectories(modules)) {
        const manifest = JSON.parse(readFileSync(join(directory, "package.json"), "utf8")) as PackageManifest;
        if (manifest.name && manifest.version) metadata.set(`${manifest.name}@${manifest.version}`, manifest);
      }
    } catch {
      // Optional packages for other platforms are legitimately absent.
    }
  }
  return metadata;
}

function packageIdentity(key: string) {
  const separator = key.lastIndexOf("@");
  return { name: key.slice(0, separator), version: key.slice(separator + 1) };
}

function sourceFrom(manifest: PackageManifest | undefined) {
  if (!manifest) return null;
  if (typeof manifest.repository === "string") return manifest.repository;
  return manifest.repository?.url ?? manifest.homepage ?? null;
}

function licenseFrom(manifest: PackageManifest | undefined) {
  if (typeof manifest?.license === "string") return manifest.license;
  return manifest?.license?.type ?? "unresolved";
}

const lockfile = parse(readFileSync("pnpm-lock.yaml", "utf8")) as { packages?: Record<string, unknown> };
const installed = installedMetadata();
const packages = Object.keys(lockfile.packages ?? {}).sort().map((key) => {
  const { name, version } = packageIdentity(key);
  const manifest = installed.get(key);
  const license = licenseFrom(manifest);
  const encodedName = encodeURIComponent(name);
  return {
    key,
    name,
    version,
    origin: `https://registry.npmjs.org/${encodedName}/${version}`,
    source: sourceFrom(manifest),
    license,
    terms: `https://www.npmjs.com/package/${encodedName}/v/${version}?activeTab=code`,
    metadataStatus: license === "unresolved" ? "unresolved" : "resolved",
  } as const;
});
const inventory: LockfilePackageInventory = { schemaVersion: 1, lockfile: "pnpm-lock.yaml", packages };
writeFileSync("provenance/pnpm-lock-packages.json", `${JSON.stringify(inventory, null, 2)}\n`);
