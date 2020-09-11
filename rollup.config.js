import typescript from "@rollup/plugin-typescript";

const defaults = {
  input: "idb-keyval.ts",
  plugins: [typescript()],
};

export default [
  {
    ...defaults,
    output: [
      {
        file: "dist/idb-keyval-iife.js",
        format: "iife",
        name: "idbKeyval",
      },
      {
        file: "dist/idb-keyval-cjs.js",
        format: "cjs",
      },
      {
        file: "dist/idb-keyval-amd.js",
        format: "amd",
      },
    ],
  },
  {
    ...defaults,
    plugins: [typescript({ declaration: true, declarationDir: "dist" })],
    output: [
      {
        dir: "dist",
        format: "es",
      },
    ],
  },
];
