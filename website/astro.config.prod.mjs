import { defineConfig } from 'astro/config';
import { defaultConfig } from "./astro.config.mjs"

// https://astro.build/config
export default defineConfig({
	site: 'https://lemick.github.io',
	base: 'open-iframe-resizer',
	...defaultConfig
});
