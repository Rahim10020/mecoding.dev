// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  site: "https://mecoding.dev",
  integrations: [
    sitemap({
      // Page interne de validation du design system.
      filter: (page) => !page.includes("/styleguide"),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
