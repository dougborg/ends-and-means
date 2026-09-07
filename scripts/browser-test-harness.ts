import { resolve } from "node:path";

const PORT_MIN = 20_000;
const PORT_SPAN = 30_000;

function hash(value: string) {
  let result = 2_166_136_261;
  for (const character of value) {
    result ^= character.codePointAt(0) ?? 0;
    result = Math.imul(result, 16_777_619);
  }
  return result >>> 0;
}

export function browserTestPort(
  workingDirectory = process.cwd(),
  configuredPort = process.env.PLAYWRIGHT_TEST_PORT,
) {
  if (configuredPort !== undefined) {
    const port = Number(configuredPort);
    if (!Number.isInteger(port) || port < 1_024 || port > 65_535) {
      throw new Error(
        "PLAYWRIGHT_TEST_PORT must be an integer between 1024 and 65535",
      );
    }
    return port;
  }

  return PORT_MIN + (hash(resolve(workingDirectory)) % PORT_SPAN);
}

export function assertManagedBrowserServer(server: {
  reuseExistingServer?: boolean;
}) {
  if (server.reuseExistingServer !== false) {
    throw new Error(
      "Browser tests must start their own preview server; reusing a listener can test another worktree's build",
    );
  }
}
