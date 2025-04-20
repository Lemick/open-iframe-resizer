import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "node:path";
import dts from "vite-plugin-dts";

const formattedName = "open-iframe-resizer-vue";

export default defineConfig({
  plugins: [
    vue(),
    dts({
      tsconfigPath: "./tsconfig.app.json",
      insertTypesEntry: true,
      rollupTypes: true,
    }),
  ],
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: formattedName,
      formats: ["es", "umd"],
      fileName: (format) => `${formattedName}.${format}.js`,
    },
    rollupOptions: {
      external: ["vue"],
      output: {
        globals: {
          vue: "Vue",
        },
      },
    },
  },
  server: {
    watch: {
      ignored: ["!**/dist/**"], // Force HMR for build.output
    },
  },
});
