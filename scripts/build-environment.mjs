import { execFileSync } from "node:child_process";
if (process.argv.length !== 2 || process.env.NODE_ENV) {
  console.error("BUILD_TARGET: the supported build accepts no target/configuration overrides; Astro configuration owns dist and the production origin.");
  process.exitCode = 1;
} else {
  try { execFileSync("pnpm", ["exec", "astro", "build"], { stdio: "inherit" }); }
  catch { process.exitCode = 1; }
}
