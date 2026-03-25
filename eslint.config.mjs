// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format

import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import storybook from "eslint-plugin-storybook";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Coverage reports
    "coverage/**",
    ".coverage/**",
    // Generated API files
    "core/api/generated/**",
  ]),
  ...storybook.configs["flat/recommended"],
  {
    rules: {
      // TypeScript — eslint-config-next bundles typescript-eslint internally
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],

      // React Hooks
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",

      // Import ordering
      "import/order": [
        "warn",
        {
          groups: ["builtin", "external", "internal", "parent", "sibling", "index"],
          "newlines-between": "always",
          alphabetize: { order: "asc" },
        },
      ],
    },
  },
  // Allow `any` type in test files for flexibility with mocks
  {
    files: ["**/*.test.ts", "**/*.test.tsx"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "off",
    },
  },
  // Relax rules for Storybook files
  {
    files: ["**/*.stories.tsx", "**/*.stories.ts"],
    rules: {
      "storybook/no-renderer-packages": "off",
      "react-hooks/rules-of-hooks": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "react/no-unescaped-entities": "off",
    },
  },
  // Disable React Compiler warnings for files using TanStack Table
  // These warnings are library-level incompatibilities that cannot be fixed in user code
  {
    files: [
      "**/react-table/**/*.tsx",
      "**/react-table/**/*.ts",
      "**/quiz-table/**/*.tsx",
      "**/quiz-table/**/*.ts",
      "**/question-table/**/*.tsx",
      "**/question-table/**/*.ts",
      "**/question-list/**/*.tsx",
      "**/question-list/**/*.ts",
    ],
    rules: {
      "react-hooks/incompatible-library": "off",
    },
  },
]);

export default eslintConfig;
