// Adapted from https://github.com/Turfjs/turf/blob/master/tsup.config.ts

import { defineConfig, type Options } from "tsup";

const baseOptions : Options = {
  entry: ["src/index.ts"],
  clean: true,
  dts: true,
  minify: false,
  skipNodeModulesBundle: true,
  sourcemap: false,
  target: "es2017",
  tsconfig: "./tsconfig.json",
  cjsInterop: true,
  splitting: true,
};

export default [
  defineConfig({
    ...baseOptions,
    outDir: "dist/cjs",
    format: "cjs",
  }),
  defineConfig({
    ...baseOptions,
    outDir: "dist/esm",
    format: "esm",
  }),
];