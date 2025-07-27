// eslint.config.mjs
import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
  },
  // TypeScript-specific rules (excluding debug files)
  {
    files: ["**/*.{ts,mts,cts,tsx}"],
    ...tseslint.configs.recommended,
  },
  // Relaxed rules for debug/test files
  {
    files: ["debug_*.js", "test_*.js", "**/*.test.js", "**/*.spec.js"],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/no-var-requires": "off",
    },
  },
  pluginReact.configs.flat.recommended,
]);
