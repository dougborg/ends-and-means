import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "tests/visual",
  outputDir: ".artifacts/visual-review",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: "http://127.0.0.1:4321",
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
  },
  webServer: {
    // Astro otherwise auto-detects agent environments and backgrounds the server,
    // which makes Playwright think its managed process exited prematurely.
    command: "ASTRO_PREVIEW_BACKGROUND=0 pnpm preview -- --host 127.0.0.1",
    url: "http://127.0.0.1:4321",
    reuseExistingServer: !process.env.CI,
  },
});
