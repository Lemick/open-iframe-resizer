import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export const defaultConfig = {
	integrations: [
		starlight({
			title: 'Open Iframe Resizer',
			social: {
				github: 'https://github.com/Lemick/open-iframe-resizer',
			},
			sidebar: [
				{
					label: 'Guides',
					items: [
						{ label: 'Getting started', slug: 'guides/getting-started' },
						{ label: 'Cross-origin setup', slug: 'guides/cross-origin' },
						{ label: 'React setup', slug: 'guides/react' },
					],
				},
				{
					label: 'Reference',
					autogenerate: { directory: 'reference' },
				},
			],
		}),
	],
}

// https://astro.build/config
export default defineConfig(defaultConfig);
