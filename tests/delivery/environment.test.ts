import { createHash } from "node:crypto";
import fs from "node:fs";
import { syncBuiltinESMExports } from "node:module";
import { execFileSync, spawnSync } from "node:child_process";
import { chmodSync, cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { createServer } from "node:net";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { stringify } from "yaml";
import { artifactDigest, writeVerificationEvidence } from "../../scripts/environment-artifact.ts";
import { dependencyFindings, outputFindings } from "../../scripts/environment-dependencies.ts";
import { advisoryProbe, classifyAdvisory, previewProbe } from "../../scripts/environment-probes.ts";
import { configurationFindings, resourceProfile, toolchainFindings } from "../../scripts/environment-runtime.ts";

const roots: string[] = [];
afterEach(() => { vi.restoreAllMocks(); syncBuiltinESMExports(); vi.unstubAllEnvs(); for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true }); });
function fixture() {
  const root = mkdtempSync(join(tmpdir(), "environment-test-")); roots.push(root);
  const manifest = { packageManager: "pnpm@11.25.0", engines: { node: ">=26 <27" }, dependencies: { example: "^1.0.0" } };
  const lock = { lockfileVersion: "9.0", importers: { ".": { dependencies: { example: { specifier: "^1.0.0", version: "1.0.0" } } } }, snapshots: { "example@1.0.0": { dependencies: { nested: "2.0.0" } }, "nested@2.0.0": {} } };
  const modules = { packageManager: manifest.packageManager, nodeLinker: "isolated", layoutVersion: 5, virtualStoreDir: ".pnpm", included: { dependencies: true, devDependencies: true, optionalDependencies: true } };
  mkdirSync(join(root, "node_modules/.pnpm/example@1.0.0/node_modules/example"), { recursive: true });
  mkdirSync(join(root, "node_modules/.pnpm/nested@2.0.0/node_modules/nested"), { recursive: true });
  writeFileSync(join(root, "package.json"), JSON.stringify(manifest));
  writeFileSync(join(root, ".node-version"), "26.8.1\n"); writeFileSync(join(root, ".nvmrc"), "26.8.1\n");
  writeFileSync(join(root, "pnpm-workspace.yaml"), "{}\n");
  writeFileSync(join(root, "pnpm-lock.yaml"), stringify(lock));
  writeFileSync(join(root, "node_modules/.modules.yaml"), JSON.stringify(modules));
  writeFileSync(join(root, "node_modules/.pnpm/lock.yaml"), stringify(lock));
  writeFileSync(join(root, "node_modules/.pnpm/example@1.0.0/node_modules/example/package.json"), JSON.stringify({ name: "example", version: "1.0.0" }));
  writeFileSync(join(root, "node_modules/.pnpm/nested@2.0.0/node_modules/nested/package.json"), JSON.stringify({ name: "nested", version: "2.0.0" }));
  symlinkSync(".pnpm/example@1.0.0/node_modules/example", join(root, "node_modules/example"));
  symlinkSync("../../nested@2.0.0/node_modules/nested", join(root, "node_modules/.pnpm/example@1.0.0/node_modules/nested"));
  return root;
}

const observed = { node: "26.8.1", pnpm: "11.25.0", executablesResolved: true, packageManagerResolved: true, platform: "linux", architecture: "x64", timezone: "UTC", locale: "en-US", profile: "local" as const, availableParallelism: 11, workers: 3 };

describe("environment toolchain and supported configuration", () => {
  it("rejects runtime and executable mismatch before an expensive command", () => {
    const root = fixture();
    expect(toolchainFindings(root, { ...observed, node: "25.2.1" }).map(f => f.code)).toContain("NODE_MISMATCH");
    expect(toolchainFindings(root, { ...observed, pnpm: "10.0.0" }).map(f => f.code)).toContain("PNPM_MISMATCH");
    expect(toolchainFindings(root, { ...observed, executablesResolved: false }).map(f => f.code)).toContain("NODE_MISMATCH");
    mkdirSync(join(root, "scripts"));
    for (const file of ["environment-entry.mjs", "environment-runtime.ts"]) cpSync(join(process.cwd(), "scripts", file), join(root, "scripts", file));
    writeFileSync(join(root, ".node-version"), "25.2.1\n");
    const result = spawnSync(process.execPath, [join(root, "scripts/environment-entry.mjs"), "verify"], { cwd: root, encoding: "utf8" });
    expect(result.status).toBe(1);
    expect(result.stderr).toContain("NODE_MISMATCH");
    expect(existsSync(join(root, "dist"))).toBe(false);
  });

  it("governs and records intentional local and hosted resource profiles", () => {
    expect(resourceProfile({}, 11)).toEqual({ profile: "local", availableParallelism: 11, workers: 3 });
    expect(resourceProfile({ CI: "true" }, 11)).toEqual({ profile: "hosted", availableParallelism: 11, workers: 10 });
    expect(resourceProfile({ CI: "1" }, 1).workers).toBe(1);
    expect(configurationFindings("verify", { VITEST_MAX_WORKERS: "3" })[0]?.code).toBe("CONFIG_WORKERS");
  });

  it("rejects global filters and secret-bearing configuration without printing values", () => {
    const env = { PLAYWRIGHT_TEST_PORT: "private-sentinel", REVIEW_ROUTES: "private-sentinel", CONTENT_PREFLIGHT_BASE: "private-sentinel", PUBLIC_SECRET: "private-sentinel" };
    const full = configurationFindings("verify", env);
    expect(full.map(f => f.code)).toEqual(expect.arrayContaining(["CONFIG_PORT", "CONFIG_SCOPE", "CONFIG_PUBLIC"]));
    expect(JSON.stringify(full)).not.toContain("private-sentinel");
    expect(configurationFindings("focused", { PLAYWRIGHT_TEST_PORT: "3000", REVIEW_ROUTES: "/x", CONTENT_PREFLIGHT_BASE: "HEAD~1" })).toEqual([]);
    expect(configurationFindings("verify", { CI: "true", ASTRO_PREVIEW_BACKGROUND: "0" })).toEqual([]);
  });
});

describe("effective dependency and output inspection", () => {
  it("accepts JSON-formatted YAML metadata and ignores script-only manifest changes", () => {
    const root = fixture(); expect(dependencyFindings(root)).toEqual([]);
    const manifest = JSON.parse(readFileSync(join(root, "package.json"), "utf8")); manifest.scripts = { test: "changed" };
    writeFileSync(join(root, "package.json"), JSON.stringify(manifest));
    expect(dependencyFindings(root)).toEqual([]);
  });
  it("rejects real manifest, installed lock, and workspace policy mismatch", () => {
    const root = fixture();
    const manifest = JSON.parse(readFileSync(join(root, "package.json"), "utf8")); manifest.dependencies.example = "^2.0.0";
    writeFileSync(join(root, "package.json"), JSON.stringify(manifest));
    expect(dependencyFindings(root)[0]?.code).toBe("DEPENDENCY_LOCK_MISMATCH");
    const other = fixture(); writeFileSync(join(other, "node_modules/.pnpm/lock.yaml"), "{}");
    expect(dependencyFindings(other)[0]?.code).toBe("DEPENDENCY_LOCK_MISMATCH");
    const workspace = fixture(); writeFileSync(join(workspace, "pnpm-workspace.yaml"), "overrides:\n  example: 9.0.0\n");
    expect(dependencyFindings(workspace)[0]?.code).toBe("DEPENDENCY_LOCK_MISMATCH");
  });
  it("checks actual transitive dependency resolution rather than matching metadata alone", () => {
    const root = fixture();
    writeFileSync(join(root, "node_modules/.pnpm/nested@2.0.0/node_modules/nested/package.json"), JSON.stringify({ name: "nested", version: "3.0.0" }));
    expect(dependencyFindings(root)[0]?.code).toBe("DEPENDENCY_VIEW_MISMATCH");
    const missing = fixture(); rmSync(join(missing, "node_modules/.pnpm/example@1.0.0/node_modules/nested"));
    expect(dependencyFindings(missing)[0]?.code).toBe("DEPENDENCY_VIEW_MISMATCH");
  });
  it("rejects relocated dependency and output links without modifying their targets", () => {
    const root = fixture(); const other = fixture();
    rmSync(join(root, "node_modules"), { recursive: true }); symlinkSync(join(other, "node_modules"), join(root, "node_modules"));
    expect(dependencyFindings(root)[0]?.code).toBe("DEPENDENCY_RELOCATED");
    symlinkSync(other, join(root, "dist"));
    expect(outputFindings(root)[0]?.code).toBe("OUTPUT_ACCESS");
    expect(existsSync(join(other, "package.json"))).toBe(true);
  });
});

describe("explicit owned preview and advisory capabilities", () => {
  it("releases a successful probe and an interrupted pending probe", async () => {
    expect((await previewProbe(0)).code).toBe("PREVIEW_BIND_OK");
    const abort = new AbortController();
    const pending = previewProbe(0, abort.signal); abort.abort();
    expect((await pending).status).toBe("interrupted");
    const already = new AbortController(); already.abort();
    expect((await previewProbe(0, already.signal)).status).toBe("interrupted");
  });
  it("never reuses or terminates an unrelated listener", async () => {
    const listener = createServer();
    await new Promise<void>((resolve, reject) => { listener.once("error", reject); listener.listen(0, "127.0.0.1", resolve); });
    try {
      const address = listener.address(); if (!address || typeof address === "string") throw new Error("Missing port");
      expect((await previewProbe(address.port)).code).toBe("PREVIEW_COLLISION");
      expect(listener.listening).toBe(true);
    } finally { await new Promise<void>(resolve => listener.close(() => resolve())); }
  });
  it("interrupts only its owned advisory process group and does not spawn when already aborted", async () => {
    const root = fixture(); const executable = join(root, "pnpm");
    const marker = join(root, "started");
    writeFileSync(executable, `#!/bin/sh\necho started > '${marker}'\nsleep 30\n`); chmodSync(executable, 0o755);
    vi.stubEnv("PATH", `${root}:${process.env.PATH}`);
    const abort = new AbortController(); const pending = advisoryProbe(root, abort.signal);
    const deadline = Date.now() + 2_000;
    while (!existsSync(marker) && Date.now() < deadline) await new Promise(resolve => setTimeout(resolve, 10));
    expect(existsSync(marker)).toBe(true);
    abort.abort(); expect((await pending).code).toBe("ADVISORY_INTERRUPTED");
    rmSync(marker);
    expect((await advisoryProbe(root, abort.signal)).code).toBe("ADVISORY_INTERRUPTED");
    expect(existsSync(marker)).toBe(false);
  });
  it("keeps unavailable access separate from the unchanged moderate vulnerability threshold", () => {
    const result = (moderate: number) => JSON.stringify({ metadata: { vulnerabilities: { info: 0, low: 3, moderate, high: 0, critical: 0 } } });
    expect(classifyAdvisory(1, "private-registry-secret").code).toBe("ADVISORY_UNAVAILABLE");
    expect(classifyAdvisory(1, result(1)).code).toBe("ADVISORY_VULNERABILITY");
    expect(classifyAdvisory(0, result(0)).code).toBe("ADVISORY_THRESHOLD_OK");
    expect(classifyAdvisory(1, result(0)).code).toBe("ADVISORY_UNAVAILABLE");
  });
});

describe("readiness CLI boundary", () => {
  it.each(["rev-parse", "status", "ls-files"])("redacts both output streams when diagnostic Git %s fails", failingCommand => {
    const root = fixture();
    const git = join(root, "git");
    const marker = join(root, "git-calls");
    const sentinel = "private-path-and-credential-sentinel";
    writeFileSync(git, `#!/bin/sh\necho "$1" >> '${marker}'\nif [ "$1" = "${failingCommand}" ]; then echo '${sentinel}'; echo '${sentinel}' >&2; exit 1; fi\nif [ "$1" = "rev-parse" ]; then echo aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa; fi\n`);
    chmodSync(git, 0o755);
    const result = spawnSync(process.execPath, ["scripts/check-environment.mjs"], { cwd: process.cwd(), encoding: "utf8", timeout: 5_000, env: { ...process.env, NODE_ENV: undefined, PATH: `${root}:${process.env.PATH}` } });
    expect(result.status).toBe(1);
    expect(result.stdout).not.toContain(sentinel);
    expect(result.stderr).toBe("");
    const report = JSON.parse(result.stdout);
    expect(report.findings.map((finding: { code: string }) => finding.code)).toContain("SOURCE_UNAVAILABLE");
    expect(report.fingerprint.source).toEqual({ commit: null, dirty: null, inputDigest: null });
    const commands = ["rev-parse", "status", "ls-files"];
    expect(readFileSync(marker, "utf8").trim().split("\n")).toEqual(commands.slice(0, commands.indexOf(failingCommand) + 1));
  });

  it.each([".env.test", ".env.test.local"])("rejects %s at the actual full entry before launching verification checks", dotenvFile => {
    const root = fixture();
    const marker = join(root, "substantive-check-started");
    const sentinel = "private-dotenv-sentinel";
    mkdirSync(join(root, "scripts"));
    for (const file of ["environment-entry.mjs", "environment-runtime.ts"]) cpSync(join(process.cwd(), "scripts", file), join(root, "scripts", file));
    const manifest = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
    manifest.scripts = { verify: JSON.parse(readFileSync("package.json", "utf8")).scripts.verify };
    writeFileSync(join(root, "package.json"), JSON.stringify(manifest));
    writeFileSync(join(root, "scripts/verify-environment.ts"), `import { writeFileSync } from "node:fs"; writeFileSync(${JSON.stringify(marker)}, "started"); console.log("${sentinel}");`);
    writeFileSync(join(root, dotenvFile), `VITE_TEST_SECRET=${sentinel}\n`);
    const result = spawnSync("pnpm", ["run", "verify"], { cwd: root, encoding: "utf8", timeout: 5_000, env: { ...process.env, NODE_ENV: undefined } });
    expect(result.status).toBe(1);
    expect(result.stderr).toContain("CONFIG_DOTENV");
    expect(result.stdout + result.stderr).not.toContain(sentinel);
    expect(existsSync(marker)).toBe(false);
  });

  it("defaults to local inspection and redacts private environment values", () => {
    const root = fixture();
    const executable = join(root, "pnpm");
    const sentinel = join(root, "unexpected-command");
    writeFileSync(executable, `#!/bin/sh\nif [ "$1" = "--version" ]; then echo 11.25.0; else touch '${sentinel}'; exit 1; fi\n`);
    chmodSync(executable, 0o755);
    const result = spawnSync(process.execPath, ["scripts/check-environment.mjs"], { cwd: process.cwd(), encoding: "utf8", env: { ...process.env, NODE_ENV: undefined, PATH: `${root}:${process.env.PATH}`, npm_execpath: executable, PRIVATE_TEST_SECRET: "private-sentinel" } });
    expect(result.status).toBe(0);
    const report = JSON.parse(result.stdout);
    expect(report.probes.preview.status).toBe("not-requested");
    expect(report.probes.advisory.status).toBe("not-requested");
    expect(report.fingerprint.runtime.workers).toBe(resourceProfile().workers);
    expect(report.fingerprint.browser.revision).toMatch(/^\d+$/);
    expect(result.stdout).not.toContain("private-sentinel");
    expect(result.stdout).not.toContain(root);
    expect(existsSync(sentinel)).toBe(false);
  });
  it("reports unavailable browser separately without installing it", () => {
    const root = fixture();
    const result = spawnSync(process.execPath, ["scripts/check-environment.mjs"], { cwd: process.cwd(), encoding: "utf8", env: { ...process.env, NODE_ENV: undefined, PLAYWRIGHT_BROWSERS_PATH: join(root, "absent-browser") } });
    expect(result.status).toBe(1);
    expect(JSON.parse(result.stdout).findings.map((finding: { code: string }) => finding.code)).toContain("BROWSER_MISSING");
    expect(existsSync(join(root, "absent-browser"))).toBe(false);
  });
});

describe("verified static artifact boundary", () => {
  it("rejects explicit build and full-gate target arguments before generating output", () => {
    for (const command of ["scripts/build-environment.mjs", "scripts/verify-environment.ts"]) {
      const result = spawnSync(process.execPath, [command, "--outDir=foreign-output"], { encoding: "utf8" });
      expect(result.status).toBe(1);
      expect(existsSync("foreign-output")).toBe(false);
    }
  });
  it("reads the opened artifact object when its path is replaced before the content read", () => {
    const root = fixture(); mkdirSync(join(root, "dist"));
    const target = join(root, "dist/index.html");
    const foreign = join(root, "private-file");
    writeFileSync(target, "verified original"); writeFileSync(foreign, "foreign secret");
    const originalRead = fs.readFileSync;
    let replaced = false;
    const read = vi.spyOn(fs, "readFileSync").mockImplementation((...args: Parameters<typeof fs.readFileSync>) => {
      if (!replaced) {
        replaced = true;
        fs.renameSync(target, join(root, "preserved-original"));
        symlinkSync(foreign, target);
      }
      return originalRead(...args);
    });
    syncBuiltinESMExports();
    const digest = artifactDigest(root);
    expect(replaced).toBe(true);
    expect(read.mock.calls[0]?.[0]).toEqual(expect.any(Number));
    expect(digest.sha256).toBe(createHash("sha256").update("index.html\0verified original\0").digest("hex"));
    expect(digest.files).toBe(1);
  });
  it.each(["root", "nested"])("rejects observed %s directory replacement before reading content", location => {
    const root = fixture(); mkdirSync(join(root, "dist/pages"), { recursive: true });
    writeFileSync(join(root, "dist/pages/index.html"), "verified original");
    const foreign = join(root, "foreign-directory"); mkdirSync(foreign);
    writeFileSync(join(foreign, "index.html"), "foreign secret");
    const replacedDirectory = join(root, location === "root" ? "dist" : "dist/pages");
    const trigger = location === "root" ? replacedDirectory : join(replacedDirectory, "index.html");
    const originalOpen = fs.openSync;
    let replaced = false;
    vi.spyOn(fs, "openSync").mockImplementation((...args: Parameters<typeof fs.openSync>) => {
      const descriptor = originalOpen(...args);
      if (args[0] === trigger) {
        replaced = true;
        fs.renameSync(replacedDirectory, join(root, "preserved-directory"));
        symlinkSync(foreign, replacedDirectory);
      }
      return descriptor;
    });
    const read = vi.spyOn(fs, "readFileSync");
    syncBuiltinESMExports();
    expect(() => artifactDigest(root)).toThrow("Artifact directory changed during traversal");
    expect(replaced).toBe(true);
    expect(read).not.toHaveBeenCalled();
  });
  it("rejects symlinks on open and closes owned descriptors after a failed read", () => {
    const root = fixture(); mkdirSync(join(root, "dist"));
    const target = join(root, "dist/index.html");
    const foreign = join(root, "private-file"); writeFileSync(foreign, "foreign secret");
    symlinkSync(foreign, target);
    expect(() => artifactDigest(root)).toThrow();
    rmSync(target); writeFileSync(target, "verified original");
    let descriptor: number | undefined;
    vi.spyOn(fs, "readFileSync").mockImplementation((file) => {
      if (typeof file === "number") descriptor = file;
      throw new Error("Injected read failure");
    });
    syncBuiltinESMExports();
    expect(() => artifactDigest(root)).toThrow("Injected read failure");
    expect(descriptor).toEqual(expect.any(Number));
    expect(() => fs.fstatSync(descriptor as number)).toThrow(expect.objectContaining({ code: "EBADF" }));
  });
  it("hashes actual output bytes and names and preserves earlier evidence", () => {
    const root = fixture(); mkdirSync(join(root, "dist")); writeFileSync(join(root, "dist/index.html"), "first");
    const first = artifactDigest(root); writeFileSync(join(root, "dist/index.html"), "second");
    expect(artifactDigest(root).sha256).not.toBe(first.sha256);
    expect(first.files).toBe(1);
    writeVerificationEvidence(root, { artifact: first });
    expect(existsSync(join(root, ".artifacts/environment"))).toBe(true);
  });
  it("keeps deployment a consumer of the shared verified dist with no rebuild", () => {
    const action = readFileSync(".github/actions/verify/action.yml", "utf8");
    const pages = readFileSync(".github/workflows/pages.yml", "utf8");
    expect(action.indexOf("run: pnpm verify")).toBeLessThan(action.indexOf("name: Upload verified Pages artifact"));
    expect(action).toContain("path: dist");
    expect(pages.slice(pages.indexOf("  deploy:"))).not.toMatch(/pnpm|astro|checkout/);
    expect(execFileSync(process.execPath, ["-p", "process.versions.node"], { encoding: "utf8" }).trim()).toBe(readFileSync(".node-version", "utf8").trim());
  });
});
