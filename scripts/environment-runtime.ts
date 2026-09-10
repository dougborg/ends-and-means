import { execFileSync } from "node:child_process";
import { accessSync, constants, existsSync, readFileSync, realpathSync } from "node:fs";
import { availableParallelism, tmpdir } from "node:os";
import { delimiter, join } from "node:path";

export type EnvironmentMode = "command" | "focused" | "verify";
export interface EnvironmentFinding { code: string; remedy: string }
export interface RuntimeObservation {
  node: string | null;
  pnpm: string | null;
  executablesResolved: boolean;
  packageManagerResolved: boolean;
  platform: string;
  architecture: string;
  timezone: string;
  locale: string;
  profile: "local" | "hosted";
  availableParallelism: number;
  workers: number;
}

export function resourceProfile(env: NodeJS.ProcessEnv = process.env, parallelism = availableParallelism()) {
  const hosted = env.CI === "true" || env.CI === "1";
  return { profile: hosted ? "hosted" as const : "local" as const, availableParallelism: parallelism, workers: hosted ? Math.max(1, parallelism - 1) : 3 };
}

function executable(name: string, env: NodeJS.ProcessEnv) {
  for (const directory of (env.PATH ?? "").split(delimiter)) {
    if (!directory) continue;
    try {
      const path = realpathSync(join(directory, name));
      accessSync(path, constants.X_OK);
      return path;
    } catch { /* Continue through the actual executable search path. */ }
  }
  throw new Error("Executable unavailable");
}

export function runtimeObservation(env: NodeJS.ProcessEnv = process.env): RuntimeObservation {
  let node: string | null = null;
  let pnpm: string | null = null;
  let executablesResolved = false;
  let packageManagerResolved = false;
  try {
    const nodePath = executable("node", env);
    const pnpmPath = executable("pnpm", env);
    const options = { encoding: "utf8" as const, timeout: 5_000, cwd: tmpdir(), env: { ...env, COREPACK_ENABLE_NETWORK: "0", npm_config_manage_package_manager_versions: "false" }, stdio: ["ignore", "pipe", "pipe"] as ["ignore", "pipe", "pipe"] };
    const observedNode = execFileSync(nodePath, ["--version"], options).trim();
    const observedPnpm = execFileSync(pnpmPath, ["--version"], options).trim();
    node = /^v\d+\.\d+\.\d+$/.test(observedNode) ? observedNode.slice(1) : null;
    pnpm = /^\d+\.\d+\.\d+$/.test(observedPnpm) ? observedPnpm : null;
    executablesResolved = nodePath === realpathSync(process.execPath);
    packageManagerResolved = !env.npm_execpath || realpathSync(env.npm_execpath) === pnpmPath;
    if (!packageManagerResolved && env.npm_execpath) {
      const launcher = realpathSync(env.npm_execpath);
      const launchedVersion = /\.[cm]?js$/.test(launcher) ? execFileSync(process.execPath, [launcher, "--version"], options) : execFileSync(launcher, ["--version"], options);
      packageManagerResolved = launchedVersion.trim() === observedPnpm;
    }
  } catch { /* Public evidence never includes executable paths or stderr. */ }
  return { node, pnpm, executablesResolved, packageManagerResolved, platform: process.platform, architecture: process.arch, timezone: Intl.DateTimeFormat().resolvedOptions().timeZone, locale: Intl.DateTimeFormat().resolvedOptions().locale, ...resourceProfile(env) };
}

export function configurationFindings(mode: EnvironmentMode, env: NodeJS.ProcessEnv = process.env): EnvironmentFinding[] {
  const findings: EnvironmentFinding[] = [];
  const reject = (code: string, remedy: string) => findings.push({ code, remedy });
  if (env.CI !== undefined && env.CI !== "true" && env.CI !== "1") reject("CONFIG_CI", "Unset CI locally; hosted CI uses true or 1.");
  if (Object.keys(env).some(key => key.startsWith("PUBLIC_") || key.startsWith("VITE_"))) reject("CONFIG_PUBLIC", "No public build-time environment variables are supported; keep secrets outside browser configuration.");
  if (env.NODE_OPTIONS) reject("CONFIG_NODE_OPTIONS", "Run the supported entry without ambient Node options.");
  if (env.VITEST_MAX_WORKERS !== undefined || env.VITEST_MIN_WORKERS !== undefined) reject("CONFIG_WORKERS", "Unset worker overrides; the local/hosted profile is governed in Vitest configuration.");
  if (mode !== "focused" && env.PLAYWRIGHT_TEST_PORT !== undefined) reject("CONFIG_PORT", "Unset the global preview port; a scoped override is supported only for focused browser commands.");
  if (mode === "verify" && env.NODE_ENV) reject("CONFIG_NODE_ENV", "Full verification requires the default command-specific Node environment; unset NODE_ENV.");
  if (mode === "verify" && (env.REVIEW_ROUTES !== undefined || env.CONTENT_PREFLIGHT_BASE !== undefined)) reject("CONFIG_SCOPE", "Unset route/base filters before full verification; use focused commands for targeted review.");
  if (env.ASTRO_PREVIEW_BACKGROUND !== undefined && env.ASTRO_PREVIEW_BACKGROUND !== "0") reject("CONFIG_PREVIEW", "Managed previews require foreground operation (0).");
  return findings;
}

export function toolchainFindings(root: string, observed: RuntimeObservation): EnvironmentFinding[] {
  const findings: EnvironmentFinding[] = [];
  try {
    if ([".env", ".env.local", ".env.production", ".env.production.local", ".env.development", ".env.development.local"].some(file => existsSync(join(root, file)))) findings.push({ code: "CONFIG_DOTENV", remedy: "The supported build uses repository configuration without local dotenv inputs; move private configuration outside this worktree." });
    const pin = readFileSync(join(root, ".node-version"), "utf8").trim();
    const manifest = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
    const major = Number(pin.split(".")[0]);
    if (!/^\d+\.\d+\.\d+$/.test(pin) || readFileSync(join(root, ".nvmrc"), "utf8").trim() !== pin || manifest.engines?.node !== `>=${major} <${major + 1}`) findings.push({ code: "TOOLCHAIN_DECLARATION", remedy: "Reconcile .node-version, .nvmrc, and engines compatibility declarations." });
    if (observed.node !== pin || process.versions.node !== pin || !observed.executablesResolved) findings.push({ code: "NODE_MISMATCH", remedy: "Select the exact .node-version executable on PATH and restart the command." });
    if (`pnpm@${observed.pnpm}` !== manifest.packageManager || !observed.packageManagerResolved) findings.push({ code: "PNPM_MISMATCH", remedy: "Select the packageManager-pinned pnpm executable on PATH." });
    if (!["darwin", "linux"].includes(observed.platform)) findings.push({ code: "OS_UNSUPPORTED", remedy: "Use macOS or Linux (including a Linux WSL worktree)." });
  } catch { findings.push({ code: "TOOLCHAIN_UNAVAILABLE", remedy: "Run from the repository root with readable toolchain declarations." }); }
  return findings;
}
