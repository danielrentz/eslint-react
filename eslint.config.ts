import url from "node:url";

import eslint from "@eslint/js";
import stylisticJs from "@stylistic/eslint-plugin-js";
import safeTsPlugin from "@susisu/eslint-plugin-safe-typescript";
import { Record } from "effect";
import type { Linter } from "eslint";
import gitignore from "eslint-config-flat-gitignore";
// @ts-expect-error - missing types
import pluginBetterMutation from "eslint-plugin-better-mutation";
// @ts-expect-error - missing types
import eslintCommentsPlugin from "eslint-plugin-eslint-comments";
// @ts-expect-error - missing types
import eslintPluginPlugin from "eslint-plugin-eslint-plugin";
import importPlugin from "eslint-plugin-import-x";
import jsdocPlugin from "eslint-plugin-jsdoc";
import perfectionist from "eslint-plugin-perfectionist";
import regexpPlugin from "eslint-plugin-regexp";
import simpleImportSortPlugin from "eslint-plugin-simple-import-sort";
import unicornPlugin from "eslint-plugin-unicorn";
import vitest from "eslint-plugin-vitest";
// import { isCI } from "std-env";
import tseslint from "typescript-eslint";

const dirname = url.fileURLToPath(new URL(".", import.meta.url));

const GLOB_JS = ["*.{js,jsx,cjs,mjs}", "**/*.{js,jsx,cjs,mjs}"] as const;
const GLOB_TS = ["*.{ts,tsx,cts,mts}", "**/*.{ts,tsx,cts,mts}"] as const;
const GLOB_TEST = [
  "**/*.spec.{ts,tsx,cts,mts}",
  "**/*.test.{ts,tsx,cts,mts}",
  "**/spec.{ts,tsx,cts,mts}",
  "**/test.{ts,tsx,cts,mts}",
] as const;
// const GLOB_YAML = ["*.{yaml,yml}", "**/*.{yaml,yml}"] as const;
const GLOB_CONFIG = ["*.config.{ts,tsx,cts,mts}", "**/*.config.{ts,tsx,cts,mts}"] as const;
const GLOB_SCRIPT = ["scripts/**/*.{ts,cts,mts}"] as const;

const templateIndentAnnotations = [
  "outdent",
  "dedent",
  "html",
  "tsx",
  "ts",
] as const;

const packagesTsConfigs = [
  "packages/*/tsconfig.json",
  "packages/*/*/tsconfig.json",
] as const;

const rootTsConfigs = [
  "tsconfig.json",
] as const;

const p11tOptions = {
  type: "natural",
  ignoreCase: false,
} as const;

const p11tGroups = {
  customGroups: {
    id: ["^_$", "^id$", "^key$", "^self$"],
    type: ["^type$", "^kind$"],
    meta: [
      "^name$",
      "^meta$",
      "^title$",
      "^description$",
    ],
    alias: ["^alias$", "^as$"],
    rules: ["^node$", "^messageId$"],
  },
  groups: ["id", "type", "meta", "alias", "rules", "unknown"],
} as const;

const disableTypeCheckedRules = {
  ...tseslint.configs.disableTypeChecked.rules,
  "@susisu/safe-typescript/no-object-assign": "off",
  "@susisu/safe-typescript/no-type-assertion": "off",
  "@susisu/safe-typescript/no-unsafe-object-enum-method": "off",
  "@susisu/safe-typescript/no-unsafe-object-property-check": "off",
  "@susisu/safe-typescript/no-unsafe-object-property-overwrite": "off",
} as const;

const typeCheckedRules = {
  ...Record.map(disableTypeCheckedRules, () => "warn"),
  "@susisu/safe-typescript/no-unsafe-object-property-check": "off",
  "@susisu/safe-typescript/no-unsafe-object-property-overwrite": "off",
  "@typescript-eslint/naming-convention": "off",
  "@typescript-eslint/no-confusing-void-expression": "off",
  "@typescript-eslint/prefer-destructuring": "off",
  "@typescript-eslint/prefer-readonly-parameter-types": "off",
  "@typescript-eslint/strict-boolean-expressions": ["warn", { allowNullableBoolean: true, allowNullableString: true }],
  "@typescript-eslint/switch-exhaustiveness-check": "off",
} as const;

export default [
  gitignore(),
  {
    ignores: [
      "docs",
      "examples",
      "website",
      "website-*",
      "test",
    ],
  },
  {
    // register all of the plugins up-front
    // note - intentionally uses computed syntax to make it easy to sort the keys
    plugins: {
      ["@stylistic/js"]: stylisticJs,
      ["@susisu/safe-typescript"]: safeTsPlugin,
      ["@typescript-eslint"]: tseslint.plugin,
      ["better-mutation"]: pluginBetterMutation,
      ["eslint-comments"]: eslintCommentsPlugin,
      ["eslint-plugin"]: eslintPluginPlugin,
      ["import-x"]: importPlugin,
      ["jsdoc"]: jsdocPlugin,
      ["simple-import-sort"]: simpleImportSortPlugin,
      ["unicorn"]: unicornPlugin,
    },
    settings: {},
  },
  eslint.configs.recommended,
  ...tseslint.configs.strict,
  perfectionist.configs["recommended-natural"],
  regexpPlugin.configs["flat/recommended"],
  jsdocPlugin.configs["flat/recommended-typescript-error"],
  eslintPluginPlugin.configs["flat/all-type-checked"],
  // base ts language options
  {
    files: GLOB_TS,
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        allowAutomaticSingleRunInference: true,
        project: packagesTsConfigs,
        projectService: true,
        tsconfigRootDir: dirname,
        warnOnUnsupportedTypeScriptVersion: false,
      },
    },
  },
  // base config
  {
    files: [...GLOB_JS, ...GLOB_TS],
    rules: {
      // Part: eslint rules
      curly: "off",
      eqeqeq: ["error", "always"],
      "logical-assignment-operators": "error",
      "max-depth": ["warn", 3],
      "no-console": "error",
      "no-constant-binary-expression": "off", // esbuild will remove these at build time
      "no-else-return": "error",
      "no-fallthrough": ["error", { commentPattern: ".*intentional fallthrough.*" }],
      "no-mixed-operators": "error",
      "no-process-exit": "error",
      "no-restricted-syntax": [
        "error",
        {
          message: "no optional",
          selector: "TSPropertySignature[optional=true]",
        },
        {
          message: "no promise",
          selector: "CallExpression[callee.object.name='Promise']",
        },
        {
          message: "no promise",
          selector: "CallExpression[callee.property.name='then']",
        },
        {
          message: "no async/await",
          selector: ":function[async=true]",
        },
        {
          message: "no async/await",
          selector: "AwaitExpression",
        },
      ],
      "no-undef": "off",
      "one-var": ["error", "never"],
      "prefer-object-has-own": "error",
      // Part: stylistic-js rules
      "@stylistic/js/no-extra-parens": "warn",
      // Part: typescript-eslint rules
      "@typescript-eslint/ban-ts-comment": [
        "error",
        {
          minimumDescriptionLength: 5,
          "ts-check": false,
          "ts-expect-error": "allow-with-description",
          "ts-ignore": true,
          "ts-nocheck": true,
        },
      ],
      "@typescript-eslint/ban-types": "off",
      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-misused-promises": "off",
      "@typescript-eslint/no-unnecessary-parameter-property-assignment": "warn",
      "@typescript-eslint/no-unnecessary-template-expression": "off",
      "@typescript-eslint/no-unnecessary-type-parameters": "warn",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          caughtErrors: "all",
          varsIgnorePattern: "^_",
        },
      ],
      // Part: type-checked rules
      ...typeCheckedRules,
      // Part: functional rules
      "functional/no-return-void": "off",
      ...pluginBetterMutation.configs.recommended.rules,
      // Part: jsdoc rules
      "jsdoc/check-param-names": "warn",
      "jsdoc/check-tag-names": "warn",
      "jsdoc/informative-docs": "off",
      "jsdoc/lines-before-block": "off",
      "jsdoc/require-jsdoc": "off",
      "jsdoc/require-param": "warn",
      "jsdoc/require-param-description": "warn",
      "jsdoc/require-returns": "off",
      "jsdoc/require-yields": "warn",
      "jsdoc/tag-lines": "warn",
      // Part: import rules
      "import-x/consistent-type-specifier-style": "warn",
      "import-x/export": "error",
      "import-x/first": "warn",
      "import-x/newline-after-import": "warn",
      "import-x/no-absolute-path": "error",
      "import-x/no-duplicates": "error",
      "import-x/no-dynamic-require": "error",
      "import-x/no-empty-named-blocks": "error",
      "import-x/no-extraneous-dependencies": "error",
      "import-x/no-mutable-exports": "error",
      "import-x/no-self-import": "error",
      "import-x/no-unused-modules": "error",
      // Part: simple-import-sort rules
      "simple-import-sort/exports": "warn",
      "simple-import-sort/imports": "warn",
      // Part: perfectionist rules
      "perfectionist/sort-exports": "off",
      "perfectionist/sort-imports": "off",
      "perfectionist/sort-interfaces": [
        "warn",
        {
          ...p11tOptions,
          ...p11tGroups,
        },
      ],
      "perfectionist/sort-intersection-types": "off",
      "perfectionist/sort-modules": "off",
      "perfectionist/sort-named-exports": "off",
      "perfectionist/sort-named-imports": "off",
      "perfectionist/sort-object-types": [
        "warn",
        {
          ...p11tOptions,
          ...p11tGroups,
        },
      ],
      "perfectionist/sort-objects": [
        "warn",
        {
          ...p11tOptions,
          ...p11tGroups,
          partitionByComment: "^Part:.*",
        },
      ],
      "perfectionist/sort-union-types": "warn",
      // Part: unicorn rules
      "unicorn/template-indent": [
        "warn",
        {
          comments: templateIndentAnnotations,
          tags: templateIndentAnnotations,
        },
      ],
      // Part: eslint-comments rules
      "eslint-comments/disable-enable-pair": ["error", { allowWholeFile: true }],
      "eslint-comments/no-aggregating-enable": "error",
      "eslint-comments/no-duplicate-disable": "error",
      "eslint-comments/no-unlimited-disable": "error",
      "eslint-comments/no-unused-disable": "error",
      "eslint-comments/no-unused-enable": "error",
      "eslint-comments/no-use": [
        "error",
        {
          allow: [
            "eslint-disable",
            "eslint-disable-line",
            "eslint-disable-next-line",
            "eslint-enable",
            "global",
          ],
        },
      ],
      // Part: eslint-plugin rules
      "eslint-plugin/meta-property-ordering": "off",
      "eslint-plugin/no-property-in-node": "off",
      "eslint-plugin/require-meta-docs-recommended": "off",
      "eslint-plugin/require-meta-docs-url": "off",
    },
    settings: {
      "import-x/parsers": {
        "@typescript-eslint/parser": GLOB_TS,
      },
      "import-x/resolver": "oxc",
    },
  },
  {
    files: GLOB_JS,
    rules: {
      ...disableTypeCheckedRules,
      "@typescript-eslint/no-var-requires": "off",
    },
  },
  {
    files: GLOB_TEST,
    languageOptions: {
      globals: {
        ...vitest.environments.env.globals,
      },
      parser: tseslint.parser,
      parserOptions: {
        allowAutomaticSingleRunInference: true,
        project: rootTsConfigs,
        projectService: true,
        tsconfigRootDir: dirname,
        warnOnUnsupportedTypeScriptVersion: false,
      },
    },
    plugins: {
      vitest,
    },
    rules: {
      ...disableTypeCheckedRules,
      ...vitest.configs.recommended.rules,
      "@typescript-eslint/no-empty-function": ["error", { allow: ["arrowFunctions"] }],
      "import-x/no-extraneous-dependencies": "off",
    },
  },
  {
    files: GLOB_SCRIPT,
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        allowAutomaticSingleRunInference: true,
        project: rootTsConfigs,
        projectService: true,
        tsconfigRootDir: dirname,
        warnOnUnsupportedTypeScriptVersion: false,
      },
    },
  },
  {
    files: GLOB_CONFIG,
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        allowAutomaticSingleRunInference: true,
        project: false,
        projectService: false,
      },
    },
    rules: {
      ...disableTypeCheckedRules,
    },
  },
] satisfies Linter.Config[];
