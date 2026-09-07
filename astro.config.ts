import { defineConfig } from "astro/config";

export default defineConfig({
  output: "static",
  site: "https://endsandmeans.info",
  vite: {
    build: {
      assetsInlineLimit: 0,
    },
  },
});
