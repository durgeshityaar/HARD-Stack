import starlight from "@astrojs/starlight";
import { defineConfig } from "astro/config";

export default defineConfig({
  integrations: [
    starlight({
      title: "Hard Stack",
      description: "Docs for the Hard Stack monorepo.",
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
          items: [{ label: "Getting Started", slug: "guides/getting-started" }],
        },
        {
          label: "Reference",
          items: [{ label: "API Reference", slug: "reference/api" }],
        },
      ],
    }),
  ],
});
