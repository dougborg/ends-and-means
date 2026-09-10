import { accessSync, constants, existsSync, lstatSync, readFileSync, realpathSync, statSync } from "node:fs";
import { isDeepStrictEqual } from "node:util";
import { dirname, isAbsolute, join, relative, resolve } from "node:path";
import { parse } from "yaml";
import type { EnvironmentFinding } from "./environment-runtime.ts";

type Data = Record<string, unknown>;
function record(value: unknown): Data { return value !== null && typeof value === "object" && !Array.isArray(value) ? value as Data : {}; }
function yaml(path: string) { return record(parse(readFileSync(path, "utf8"))); }
const groups = ["dependencies", "devDependencies", "optionalDependencies"] as const;
function inside(root: string, path: string) { const r = relative(root, path); return r === "" || (!r.startsWith("..") && !isAbsolute(r)); }

function manifestMatches(manifest: Data, importer: Data) {
  return groups.every(group => {
    const expected = record(manifest[group]);
    const locked = record(importer[group]);
    return isDeepStrictEqual(Object.keys(expected).sort(), Object.keys(locked).sort()) && Object.entries(expected).every(([name, specifier]) => record(locked[name]).specifier === specifier);
  });
}

function installedDependency(start: string, name: string, boundary: string): string | null {
  for (let directory = start; inside(boundary, directory); directory = dirname(directory)) {
    const target = join(directory, "node_modules", name);
    if (existsSync(target)) return realpathSync(target);
    if (directory === dirname(directory)) break;
  }
  return null;
}

interface DependencyEdge { name: string; version: unknown; parent: string; optional: boolean }
function snapshotEdges(snapshot: Data, parent: string): DependencyEdge[] {
  return ["dependencies", "optionalDependencies"].flatMap(group => Object.entries(record(snapshot[group])).map(([name, version]) => ({ name, version, parent, optional: group === "optionalDependencies" })));
}
function packageMatches(path: string, name: string, version: string, snapshots: Data) {
  const installed = JSON.parse(readFileSync(join(path, "package.json"), "utf8"));
  return installed.name === name && installed.version === version.split("(")[0] && Object.hasOwn(snapshots, `${name}@${version}`);
}
function effectivePackages(root: string, importer: Data, virtualStore: string, snapshots: Data) {
  const pending = groups.flatMap(group => Object.entries(record(importer[group])).map(([name, value]) => ({ name, version: record(value).version, parent: root, optional: group === "optionalDependencies" })));
  const visited = new Set<string>();
  while (pending.length) {
    const edge = pending.pop();
    if (!edge || typeof edge.version !== "string") return false;
    const path = installedDependency(edge.parent, edge.name, root);
    if (!path) { if (edge.optional) continue; return false; }
    if (!inside(virtualStore, path)) return false;
    const key = `${edge.name}@${edge.version}`;
    const visitedKey = `${path}\0${key}`;
    if (visited.has(visitedKey)) continue;
    visited.add(visitedKey);
    if (!packageMatches(path, edge.name, edge.version, snapshots)) return false;
    const snapshot = record(snapshots[key]);
    pending.push(...snapshotEdges(snapshot, path));
  }
  return true;
}

export function dependencyFindings(root: string): EnvironmentFinding[] {
  const failure = (code: string, remedy: string) => [{ code, remedy }];
  try {
    root = realpathSync(root);
    const modulesPath = join(root, "node_modules");
    if (lstatSync(modulesPath).isSymbolicLink() || realpathSync(modulesPath) !== join(realpathSync(root), "node_modules")) return failure("DEPENDENCY_RELOCATED", "Use a task-owned frozen installation; do not reuse another worktree's mutable node_modules.");
    const manifest = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
    const lock = yaml(join(root, "pnpm-lock.yaml"));
    const workspace = yaml(join(root, "pnpm-workspace.yaml"));
    if (Object.keys(workspace).some(key => !["overrides", "allowBuilds", "minimumReleaseAgeExclude"].includes(key)) || ["peerDependencies", "peerDependenciesMeta", "pnpm", "bundledDependencies", "bundleDependencies", "dependenciesMeta"].some(key => Object.hasOwn(manifest, key))) return failure("DEPENDENCY_POLICY", "Dependency policy fields outside the supported repository contract require an explicit contract update before installation.");
    const modules = yaml(join(modulesPath, ".modules.yaml"));
    const virtualStore = realpathSync(resolve(modulesPath, String(modules.virtualStoreDir)));
    if (virtualStore !== join(realpathSync(modulesPath), ".pnpm") || modules.nodeLinker !== "isolated" || modules.layoutVersion !== 5) return failure("DEPENDENCY_RELOCATED", "Use the supported isolated pnpm layout in this worktree.");
    const installedLock = yaml(join(virtualStore, "lock.yaml"));
    const importer = record(record(lock.importers)["."]);
    if (!manifestMatches(manifest, importer) || !isDeepStrictEqual(workspace.overrides ?? {}, lock.overrides ?? {}) || !isDeepStrictEqual(lock, installedLock)) return failure("DEPENDENCY_LOCK_MISMATCH", "Review dependency manifest/workspace/lock changes, then explicitly install with --frozen-lockfile.");
    if (modules.packageManager !== manifest.packageManager || groups.some(group => record(modules.included)[group] !== true) || !isDeepStrictEqual(modules.allowBuilds, workspace.allowBuilds) || !effectivePackages(root, importer, virtualStore, record(lock.snapshots))) return failure("DEPENDENCY_VIEW_MISMATCH", "Restore a complete task-owned frozen install with approved build policy; matching version metadata alone is insufficient.");
    return [];
  } catch { return failure("DEPENDENCY_UNAVAILABLE", "Inspect missing or unreadable installed packages and metadata; explicitly run the isolated frozen setup when appropriate."); }
}

export function outputFindings(root: string): EnvironmentFinding[] {
  try {
    for (const output of [".", "node_modules", "dist", ".astro", "coverage", ".artifacts", ".artifacts/environment", ".artifacts/visual-review"]) {
      let target = join(root, output);
      try { lstatSync(target); } catch { target = root; }
      if (!inside(realpathSync(root), realpathSync(target)) || lstatSync(target).isSymbolicLink()) throw new Error("Relocated output");
      const stat = statSync(target);
      if (!stat.isDirectory() || (process.getuid && stat.uid !== process.getuid())) throw new Error("Foreign output");
      accessSync(target, constants.R_OK | constants.W_OK | constants.X_OK);
    }
    return [];
  } catch { return [{ code: "OUTPUT_ACCESS", remedy: "Use owned, writable worktree output directories without redirected output links; inspect permissions without deleting foreign data." }]; }
}
