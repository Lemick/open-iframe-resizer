import * as path from "node:path";
import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig({
	resolve: {
		alias: [
			{
				find: "~",
				replacement: path.resolve(__dirname, "./src"),
			},
		],
	},
	test: {
		exclude: ["**/node_modules/**", "**/e2e/**"],
		environment: "jsdom",
		coverage: {
			reporter: ["text", "json", "html"],
			exclude: [...configDefaults.exclude, "_docs", "src/index.ts"],
		},
	},
});
