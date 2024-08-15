import * as path from "node:path";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import { defineConfig } from "vitest/config";

const formattedName = "open-iframe-resizer-react";

export default defineConfig((env) => ({
	plugins: [
		react(),
		dts({
			insertTypesEntry: true,
		}),
	],
	build: {
		minify: "esbuild",
		sourcemap: env.command === "serve",
		lib: {
			entry: path.resolve(__dirname, "src/index.ts"),
			name: formattedName,
			formats: ["es", "umd"],
			fileName: (format) => `${formattedName}.${format}.js`,
		},
		rollupOptions: {
			external: ["react", "react/jsx-runtime", "react-dom"],
			output: {
				globals: {
					react: "React",
					"react/jsx-runtime": "react/jsx-runtime",
					"react-dom": "ReactDOM",
				},
			},
		},
	},
	test: {
		globals: true,
		environment: "jsdom",
	},
}));
