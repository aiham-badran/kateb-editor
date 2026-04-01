import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "KatebEditor",
      fileName: "kateb-editor",
      formats: ["es", "umd"],
    },
    rollupOptions: {
      external: [
        "prosemirror-model",
        "prosemirror-state",
        "prosemirror-view",
        "prosemirror-schema-basic",
      ],
      output: {
        globals: {
          "prosemirror-model": "ProseMirrorModel",
          "prosemirror-state": "ProseMirrorState",
          "prosemirror-view": "ProseMirrorView",
          "prosemirror-schema-basic": "ProseMirrorSchemaBasic",
        },
      },
    },
    sourcemap: true,
    emptyOutDir: true,
  },
  server: {
    open: "/index.html",
  },
  test: {
    environment: "jsdom",
    globals: true,
    include: ["tests/**/*.{test,spec}.ts"],
  },
});
