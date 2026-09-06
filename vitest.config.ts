import { getViteConfig } from "astro/config";

export default getViteConfig({
  // Vitest extends Vite's config; Astro's helper types only the Vite surface.
  // @ts-expect-error -- consumed by Vitest after Astro installs its plugin.
  test: {
    coverage: {
      include: ["src/lib/**/*.ts"],
      provider: "v8",
      reporter: ["text", "json-summary", "html"],
      thresholds: {
        branches: 87,
        functions: 100,
        lines: 90,
        statements: 88,
      },
    },
  },
});
