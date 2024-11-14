import * as path from "node:path";
import { visualizer } from "rollup-plugin-visualizer";
import { type PluginOption, defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig((env) => ({
  plugins: [
    visualizer() as PluginOption,
    dts({
      entryRoot: "src",
      copyDtsFiles: true,
      rollupTypes: true,
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
    minify: "esbuild",
    sourcemap: env.command === "serve",
    reportCompressedSize: true,
    lib: {
      name: "iframeResizer",
      entry: path.resolve(__dirname, "src/index.ts"),
      fileName: "index",
      formats: ["es", "umd"],
    },
  },
  server: {
    watch: {
      ignored: ["!**/dist/**"], // Force HMR for build.output
    },
  },
}));
