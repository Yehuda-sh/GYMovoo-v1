/**
 * @file eslint.config.mjs
 * @description תצורת ESLint עבור פרויקט GYMovoo
 * English: ESLint configuration for GYMovoo project
 * @features TypeScript, React, React Native, Hebrew support
 */

// eslint.config.mjs
import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";
import pluginReactNative from "eslint-plugin-react-native";

export default [
  // Ignore heavy/generated folders (Flat config doesn't read .eslintignore)
  {
    ignores: [
      "**/node_modules/**",
      "**/android/**",
      "**/ios/**",
      "**/dist/**",
      "**/build/**",
      "**/coverage/**",
      "**/.expo/**",
      "**/.expo-shared/**",
      "**/.vscode/**",
    ],
  },

  // Base configurations | תצורות בסיס
  js.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,

  // Main configuration | תצורה עיקרית
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    plugins: {
      "react-hooks": pluginReactHooks,
      "react-native": pluginReactNative,
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
        // React Native globals
        __DEV__: "readonly",
        fetch: "readonly",
        FormData: "readonly",
        navigator: "readonly",
        requestAnimationFrame: "readonly",
      },
      ecmaVersion: 2021,
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      // TypeScript rules | חוקי TypeScript
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-require-imports": "off", // Allow require() for assets
      "@typescript-eslint/no-var-requires": "off", // Allow for React Native assets

      // React rules | חוקי React
      "react/react-in-jsx-scope": "off", // React 17+ doesn't need import React
      "react/prop-types": "off", // Using TypeScript instead
      "react/no-unescaped-entities": "off", // Allow Hebrew text without encoding
      "react/display-name": "warn",
      "react/jsx-uses-react": "off",
      "react/jsx-uses-vars": "error",

      // React Hooks rules | חוקי React Hooks
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",

      // React Native specific rules | חוקים ספציפיים ל-React Native
      "react-native/no-unused-styles": "warn",
      "react-native/no-inline-styles": "warn",
      "react-native/no-color-literals": "off", // Allow color literals for flexibility

      // General code quality | איכות קוד כללית
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "no-debugger": "warn",
      "no-unused-vars": "off", // Handled by TypeScript rule
      "prefer-const": "error",
      "no-var": "error",

      // Prevent stray raw text nodes (e.g., {' '}) that trigger RN warnings
      // Uses react-native/no-raw-text to enforce wrapping text in <Text>
      // Hebrew & RTL text is allowed inside <Text> components.
      "react-native/no-raw-text": [
        "warn",
        {
          skip: ["Trans", "FormattedMessage"],
        },
      ],
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },

  // TypeScript parser for TS files (explicit in flat config)
  {
    files: ["**/*.{ts,tsx,mts,cts}"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        sourceType: "module",
      },
    },
  },

  // Relaxed rules for debug/test/script files | חוקים מקלים לקבצי דיבוג/בדיקה/סקריפטים
  {
    files: [
      "debug_*.js",
      "test_*.js",
      "**/*.test.{js,ts,tsx}",
      "**/*.spec.{js,ts,tsx}",
      "scripts/**/*.js",
      "**/__tests__/**/*.{js,ts,tsx}",
      "**/__mocks__/**/*.{js,ts}",
    ],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/no-var-requires": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "prefer-const": "off",
      "no-console": "off", // Allow console in tests/scripts
      "react-native/no-unused-styles": "off",
      "react-native/no-inline-styles": "off",
    },
  },

  // Configuration files | קבצי תצורה
  {
    files: [
      "*.config.{js,mjs,ts}",
      "babel.config.js",
      "metro.config.js",
      "jest.config.js",
    ],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/no-var-requires": "off",
      "no-console": "off",
    },
  },
];
