import { defineConfig } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals.js";
import nextTs from "eslint-config-next/typescript.js";

const ignorePatterns = [
  ".next/**",
  "out/**",
  "build/**",
  "next-env.d.ts"
];

export default defineConfig([
  nextVitals,
  nextTs,
  {
    ignores: ignorePatterns
  }
]);
