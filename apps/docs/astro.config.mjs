import react from "@astrojs/react";
import starlight from "@astrojs/starlight";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

// Set this to your production URL — drives canonical URLs and the sitemap.
// Remember to update public/robots.txt to match.
export default defineConfig({
  site: "https://hard-stack.dev",
  // Tailwind v4 via the Vite plugin only processes CSS that imports it, so
  // Starlight's own styles are untouched — it's scoped to our app.css.
  vite: { plugins: [tailwindcss()] },
  integrations: [
    react(),
    starlight({
      title: "Hard Stack",
      description: "Docs for the Hard Stack monorepo.",
      // Docs live under /docs/* (content is nested in src/content/docs/docs).
      // The marketing landing page at / is a plain Astro page.
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/your-org/hard-stack",
        },
      ],
      sidebar: [
        {
          label: "Start Here",
          items: [
            { label: "Overview", slug: "docs" },
            { label: "Getting Started", slug: "docs/guides/getting-started" },
          ],
        },
        {
          label: "Reference",
          items: [{ label: "API Reference", slug: "docs/reference/api" }],
        },
      ],
    }),
  ],
});
