import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

export const commonConfig = {
  integrations: [
    starlight({
      title: "Open Iframe Resizer",
      social: {
        github: "https://github.com/Lemick/open-iframe-resizer",
      },
      head: [
        { tag: "script", attrs: { src: "//gc.zgo.at/count.js", defer: "true", "data-goatcounter": "https://open-iframe-resizer.goatcounter.com/count" } },
        { tag: "meta", attrs: { name: "google-site-verification", content: "8FoOLQ6IEjarQF4kcRiSxY07aDfoVvATd4pLIe0fIS0" } },
      ],
      sidebar: [
        {
          label: "Guides",
          items: [
            { label: "Getting started", slug: "guides/getting-started" },
            { label: "Cross-origin setup", slug: "guides/cross-origin" },
            { label: "React setup", slug: "guides/react" },
          ],
        },
        {
          label: "Reference",
          autogenerate: { directory: "reference" },
        },
      ],
    }),
  ],
};


// https://astro.build/config
export default defineConfig({
  site: "https://lemick.github.io",
  base: "/open-iframe-resizer/",
  ...commonConfig,
});
