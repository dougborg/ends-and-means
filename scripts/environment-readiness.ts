import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { accessSync, constants, readFileSync, realpathSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { chromium } from "@playwright/test";
import { browserTestPort } from "./browser-test-harness.ts";
import { dependencyFindings, outputFindings } from "./environment-dependencies.ts";
import { advisoryProbe, previewProbe, probeFinding } from "./environment-probes.ts";
import { configurationFindings, runtimeObservation, toolchainFindings } from "./environment-runtime.ts";

export function inputFingerprint(root: string) {
  const hash = createHash("sha256");
  const files = execFileSync("git", ["ls-files", "-z", "--cached", "--others", "--exclude-standard"], { cwd: root, encoding: "utf8", timeout: 5_000, maxBuffer: 8_000_000 }).split("\0").filter(Boolean).sort();
  for (const file of files) { hash.update(file).update("\0"); try { hash.update(readFileSync(join(root, file))); } catch { hash.update("missing"); } hash.update("\0"); }
  return hash.digest("hex");
}

export function sourceObservation(root: string) {
  try {
    const head = execFileSync("git", ["rev-parse", "HEAD"], { cwd: root, encoding: "utf8", timeout: 5_000 }).trim();
    if (!/^[0-9a-f]{40}$/.test(head)) throw new Error("Invalid source");
    const dirty = execFileSync("git", ["status", "--porcelain", "--untracked-files=normal"], { cwd: root, encoding: "utf8", timeout: 5_000 }).length > 0;
    return { commit: head, dirty, inputDigest: inputFingerprint(root) };
  } catch { return { commit: null, dirty: null, inputDigest: null }; }
}

function browserObservation(root: string) {
  try {
    const version = JSON.parse(readFileSync(join(root, "node_modules/@playwright/test/package.json"), "utf8")).version;
    const playwright = createRequire(realpathSync(join(root, "node_modules/@playwright/test/package.json"))).resolve("playwright/package.json");
    const core = createRequire(playwright).resolve("playwright-core/package.json");
    const browsers = JSON.parse(readFileSync(join(dirname(core), "browsers.json"), "utf8")).browsers as Array<{ name: string; revision: string; browserVersion: string }>;
    const browser = browsers.find(entry => entry.name === "chromium");
    if (!browser || !/^\d+$/.test(browser.revision) || !/^[\d.]+$/.test(browser.browserVersion)) throw new Error("Invalid browser identity");
    accessSync(chromium.executablePath(), constants.R_OK | constants.X_OK);
    // Use the locked Playwright registry authority for the headless default, too.
    const registry = createRequire(core)(join(dirname(core), "lib/coreBundle.js")).registry.registry as { findExecutable(name: string): { executablePath(): string | undefined } | undefined };
    const headless = registry.findExecutable("chromium-headless-shell")?.executablePath();
    if (!headless) throw new Error("Missing headless executable");
    accessSync(headless, constants.R_OK | constants.X_OK);
    return { version: /^\d+\.\d+\.\d+$/.test(version) ? version as string : null, revision: browser.revision, browserVersion: browser.browserVersion, available: true };
  } catch { return { version: null, revision: null, browserVersion: null, available: false }; }
}

export async function inspectEnvironment(root = process.cwd(), options: { preview?: boolean; advisory?: boolean; signal?: AbortSignal } = {}) {
  const observedAt = new Date().toISOString();
  const runtime = runtimeObservation();
  const browser = browserObservation(root);
  const source = sourceObservation(root);
  const findings = [...toolchainFindings(root, runtime), ...configurationFindings("verify"), ...dependencyFindings(root), ...outputFindings(root)];
  if (!browser.available) findings.push({ code: "BROWSER_MISSING", remedy: "Explicitly install the lock-governed Chromium with pnpm exec playwright install chromium (CI adds --with-deps)." });
  if (!source.commit) findings.push({ code: "SOURCE_UNAVAILABLE", remedy: "Run from a readable Git worktree root." });
  const fingerprint = { runtime, browser, source, configuration: { scope: "full", preview: "owned-loopback", production: "static", nodeOptions: Boolean(process.env.NODE_OPTIONS), portOverride: process.env.PLAYWRIGHT_TEST_PORT !== undefined, routeFilter: process.env.REVIEW_ROUTES !== undefined, baseOverride: process.env.CONTENT_PREFLIGHT_BASE !== undefined } };
  const probes = { preview: { status: "not-requested", code: "PREVIEW_NOT_REQUESTED" }, advisory: { status: "not-requested", code: "ADVISORY_NOT_REQUESTED" } };
  const canProbe = findings.length === 0;
  if (options.preview && !canProbe) probes.preview = { status: "not-run", code: "PREVIEW_PREREQUISITE" };
  if (options.advisory && !canProbe) probes.advisory = { status: "not-run", code: "ADVISORY_PREREQUISITE" };
  if (options.preview && canProbe) { probes.preview = await previewProbe(browserTestPort(root), options.signal); findings.push(...probeFinding(probes.preview as Awaited<ReturnType<typeof previewProbe>>)); }
  if (options.advisory && canProbe) { probes.advisory = await advisoryProbe(root, options.signal); findings.push(...probeFinding(probes.advisory as Awaited<ReturnType<typeof advisoryProbe>>)); }
  return { schemaVersion: 1, kind: "environment-readiness", observedAt, completedAt: new Date().toISOString(), status: findings.length ? "not-ready" : "locally-ready", fingerprint, fingerprintDigest: createHash("sha256").update(JSON.stringify(fingerprint)).digest("hex"), probes, findings, limits: ["Local inspection is read-only; access metadata does not prove a future write.", "A bind probe releases its socket and cannot reserve a future port or validate a browser launch.", "Readiness is neither pnpm verify, an exact-head hosted check, nor a production deployment test.", "Resource profiles cannot guarantee test deadlines; authorization is not an enforcement result.", "Dependency graph identity is checked, not a byte-integrity audit or hermetic build proof."] };
}
