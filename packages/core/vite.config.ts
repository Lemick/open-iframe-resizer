import * as path from "node:path";
import { visualizer } from "rollup-plugin-visualizer";
import { type PluginOption, defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
	plugins: [
		visualizer() as PluginOption,
		dts({
			entryRoot: "src",
			copyDtsFiles: true,
			tsconfigPath: path.join(__dirname, "tsconfig.json"),
		}),
	],
	resolve: {
		alias: [
			{
				find: "~",
				replacement: path.resolve(__dirname, "./src"),
			},
		],
	},
	build: {
		minify: true,
		sourcemap: true,
		reportCompressedSize: true,
		lib: {
			name: "iframeResizer",
			entry: path.resolve(__dirname, "src/index.ts"),
			fileName: "index",
			formats: ["es", "umd"],
		},
	},
});
