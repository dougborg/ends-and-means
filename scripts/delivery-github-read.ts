import { execFileSync } from "node:child_process";

export class ApiUnavailableError extends Error {}
// Paginated issue bodies can exceed Node's default 1 MiB capture limit.
// Keep a finite ceiling and reject overflow rather than audit partial evidence.
const githubOutputLimitBytes = 16 * 1024 * 1024;

export function boundedGitHubRead(args: string[], timeout = 30_000) {
  try {
    return execFileSync("gh", args, {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
      maxBuffer: githubOutputLimitBytes,
      timeout,
    });
  } catch (error) {
    const commandError = error as Error & {
      code?: string;
      stderr?: string | Buffer;
    };
    if (commandError.code === "ENOBUFS") {
      throw new Error(
        `gh ${args[0] ?? "command"} exceeded the 16 MiB output limit; no partial response was audited`,
      );
    }
    const stderr = String(commandError.stderr ?? "").trim();
    const detail = stderr || commandError.message || String(error);
    if (
      commandError.code === "ENOENT" ||
      /auth login|not logged into|authentication required|error connecting|could not resolve|failed to connect/i.test(
        detail,
      )
    ) {
      throw new ApiUnavailableError(detail);
    }
    throw new Error(`gh ${args[0] ?? "command"} failed: ${detail}`);
  }
}
