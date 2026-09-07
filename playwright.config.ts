import { defineConfig } from "@playwright/test";
import {
  assertManagedBrowserServer,
  browserTestPort,
} from "./scripts/browser-test-harness";

const port = browserTestPort();
const baseURL = `http://127.0.0.1:${port}`;
const webServer = {
  // Astro otherwise auto-detects agent environments and backgrounds the server,
  // which makes Playwright think its managed process exited prematurely.
  command: `ASTRO_PREVIEW_BACKGROUND=0 pnpm preview --host 127.0.0.1 --port ${port}`,
  url: baseURL,
  // A listener on this port is a collision, never evidence that this worktree's
  // build is already being served.
  reuseExistingServer: false,
};

assertManagedBrowserServer(webServer);

export default defineConfig({
  testDir: "tests/visual",
  outputDir: ".artifacts/visual-review",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  // A retry is evidence that the browser contract is unstable, not a passing
  // result. Keep it visible so the owning boundary is corrected instead of
  // publishing a green run with a flaky annotation.
  retries: 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL,
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
  },
  webServer,
});
