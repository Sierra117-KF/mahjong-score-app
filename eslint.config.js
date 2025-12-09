import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";
import nextConfig from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import vitest from "@vitest/eslint-plugin";
import testingLibrary from "eslint-plugin-testing-library";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import unusedImports from "eslint-plugin-unused-imports";
import globals from "globals";
import importPlugin from "eslint-plugin-import";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default tseslint.config(
  // ========================================================
  // 1. グローバル無視設定
  // ========================================================
  {
    name: "global-ignores",
    ignores: [
      ".next/**",
      "node_modules/**",
      ".vercel/**",
      "coverage/**",
      "dist/**",
      "build/**",
      "out/**",
      "public/**",
      "**/*.min.js",
      "**/*.d.ts",
      "**/*.tsbuildinfo",
      "next-env.d.ts",
      "next.config.*",
      "vitest.config.*",
      "postcss.config.*",
      "tailwind.config.*",
      "eslint.config.*",
    ],
  },

  // ========================================================
  // 2. ベース設定 (JS / Next.js / A11y)
  // ========================================================
  js.configs.recommended,
  ...nextConfig,
  ...nextTs,

  // ========================================================
  // 3. TypeScript Strict設定
  // ========================================================
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,

  // ========================================================
  // 4. グローバル設定 & Parser Options
  // ========================================================
  {
    name: "global-settings",
    linterOptions: {
      reportUnusedDisableDirectives: "error",
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        React: "readonly",
      },
      parserOptions: {
        projectService: true,
        tsconfigRootDir: __dirname,
      },
    },
    settings: {
      react: { version: "detect" },
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true,
          project: "./tsconfig.json",
        },
        node: true,
      },
      "import/extensions": [".js", ".jsx", ".ts", ".tsx"],
    },
  },

  // ========================================================
  // 5. 共通プラグイン設定
  // ========================================================
  {
    name: "plugins-setup",
    plugins: {
      "simple-import-sort": simpleImportSort,
      "unused-imports": unusedImports,
      import: importPlugin,
    },
  },

  // ========================================================
  // 6. メインルール（プロジェクト全体の規律）
  // ========================================================
  {
    name: "main-rules",
    files: ["**/*.{js,mjs,cjs,jsx,ts,tsx}"],
    rules: {
      // ----------------------------------------------------
      // セキュリティ & 堅牢性
      // ----------------------------------------------------
      eqeqeq: ["error", "always", { null: "ignore" }],
      "no-eval": "error",
      "no-implied-eval": "error",
      "no-new-func": "error",
      curly: ["error", "all"],
      "no-param-reassign": "error",
      "no-var": "error",
      "prefer-const": "error",
      "no-shadow": "off",
      "@typescript-eslint/no-shadow": "error",
      "no-proto": "error",
      "no-extend-native": "error",
      "no-with": "error",
      "no-unreachable": "error",
      "no-unreachable-loop": "error",

      "prefer-destructuring": [
        "error",
        { array: false, object: true },
        { enforceForRenamedProperties: false },
      ],

      "no-case-declarations": "error",
      "no-duplicate-case": "error",

      // 不正な空白文字の制限（日本語対応）
      "no-irregular-whitespace": [
        "error",
        {
          skipStrings: true,
          skipComments: false,
          skipRegExps: true,
          skipTemplates: true,
        },
      ],

      // ----------------------------------------------------
      // TypeScript 厳格化
      // ----------------------------------------------------
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-non-null-assertion": "error",
      "@typescript-eslint/no-unnecessary-type-assertion": "error",
      "@typescript-eslint/unified-signatures": "error",
      "@typescript-eslint/no-empty-object-type": "error",

      "@typescript-eslint/prefer-nullish-coalescing": [
        "error",
        { ignorePrimitives: { string: true, number: true, boolean: true } },
      ],
      "@typescript-eslint/prefer-optional-chain": "error",

      // 厳格なBooleanチェック
      "@typescript-eslint/strict-boolean-expressions": [
        "error",
        {
          allowString: false,
          allowNumber: false,
          allowNullableObject: false,
          allowNullableBoolean: false,
          allowNullableString: false,
          allowNullableNumber: false,
          allowAny: false,
        },
      ],

      "@typescript-eslint/no-confusing-void-expression": [
        "error",
        { ignoreArrowShorthand: true },
      ],
      "@typescript-eslint/no-unnecessary-type-parameters": "error",

      // Promise誤用防止（Reactイベントハンドラ対応）
      "@typescript-eslint/no-misused-promises": [
        "error",
        {
          checksConditionals: true,
          checksVoidReturn: {
            attributes: false,
            arguments: false, // ★重要: これがないと非同期コールバックでエラー多発
            properties: true,
            returns: true,
            variables: true,
          },
        },
      ],

      // 命名規則
      "@typescript-eslint/naming-convention": [
        "error",
        {
          selector: "default",
          format: ["camelCase"],
          leadingUnderscore: "allow",
          trailingUnderscore: "forbid",
        },
        {
          selector: "variable",
          format: ["camelCase", "UPPER_CASE", "PascalCase"],
          leadingUnderscore: "allow",
        },
        {
          selector: "function",
          format: ["camelCase", "PascalCase"],
        },
        {
          selector: "typeLike",
          format: ["PascalCase"],
        },
        {
          selector: "property",
          format: null,
        },
        {
          selector: "variable",
          types: ["boolean"],
          format: ["PascalCase", "camelCase"],
        },
        {
          selector: "property",
          modifiers: ["private"],
          format: ["camelCase"],
          leadingUnderscore: "require",
        },
      ],

      "@typescript-eslint/ban-ts-comment": [
        "error",
        {
          "ts-expect-error": "allow-with-description",
          "ts-ignore": true,
          "ts-nocheck": true,
          "ts-check": false,
          minimumDescriptionLength: 10,
        },
      ],

      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports", fixStyle: "inline-type-imports" },
      ],
      "@typescript-eslint/consistent-type-assertions": [
        "error",
        { assertionStyle: "as", objectLiteralTypeAssertions: "never" },
      ],
      "@typescript-eslint/consistent-type-definitions": ["error", "type"],
      "@typescript-eslint/method-signature-style": ["error", "property"],

      "@typescript-eslint/restrict-plus-operands": [
        "error",
        {
          allowAny: false,
          allowBoolean: false,
          allowNullish: false,
          allowNumberAndString: false,
          allowRegExp: false,
        },
      ],
      "@typescript-eslint/restrict-template-expressions": [
        "error",
        {
          allowNumber: true,
          allowBoolean: false,
          allowAny: false,
          allowNullish: false,
          allowRegExp: false,
        },
      ],
      "@typescript-eslint/no-unnecessary-condition": [
        "error",
        { allowConstantLoopConditions: true },
      ],
      "@typescript-eslint/no-floating-promises": [
        "error",
        { ignoreVoid: true, ignoreIIFE: false },
      ],
      "@typescript-eslint/switch-exhaustiveness-check": "error",
      "@typescript-eslint/promise-function-async": "error",

      // ----------------------------------------------------
      // Import & Code Cleanup
      // ----------------------------------------------------
      "no-console": "error",
      "no-duplicate-imports": "off",
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "error",
        {
          vars: "all",
          varsIgnorePattern: "^_",
          args: "after-used",
          argsIgnorePattern: "^_",
          caughtErrors: "all",
          caughtErrorsIgnorePattern: "^_",
        },
      ],

      "import/no-default-export": "error",
      "import/no-duplicates": "error",
      "import/extensions": [
        "error",
        "ignorePackages",
        {
          js: "never",
          jsx: "never",
          ts: "never",
          tsx: "never",
        },
      ],

      // ----------------------------------------------------
      // React / Next.js 安全性強化
      // ----------------------------------------------------
      "react/button-has-type": "error",
      "react/jsx-boolean-value": ["error", "never"],
      "react/self-closing-comp": "error",
      "react/jsx-no-useless-fragment": ["error", { allowExpressions: true }],
      "react/jsx-curly-brace-presence": [
        "error",
        { props: "never", children: "never" },
      ],
      "react/jsx-no-leaked-render": [
        "error",
        { validStrategies: ["ternary", "coerce"] },
      ],
      "react/jsx-key": [
        "error",
        {
          checkFragmentShorthand: true,
          checkKeyMustBeforeSpread: true,
          warnOnDuplicates: true,
        },
      ],
      "react/destructuring-assignment": ["error", "always"],
      "react/jsx-handler-names": [
        "error",
        {
          eventHandlerPrefix: "handle",
          eventHandlerPropPrefix: "on",
          checkLocalVariables: true,
          checkInlineFunction: false,
        },
      ],

      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": [
        "error",
        {
          additionalHooks: "(useCustomEffect|useCustomMemo)",
        },
      ],

      "react/no-danger": "warn",
      "react/no-array-index-key": "error",
      "react/no-unused-prop-types": "off",

      "react/jsx-no-target-blank": ["error", { enforceDynamicLinks: "always" }],
      "react/no-unescaped-entities": "error",

      "@next/next/no-html-link-for-pages": "error",
      "@next/next/no-img-element": "error",
      "@next/next/no-sync-scripts": "error",
      "@next/next/no-css-tags": "error",

      "react/jsx-no-bind": [
        "warn",
        {
          ignoreRefs: true,
          allowArrowFunctions: true,
          allowFunctions: false,
          allowBind: false,
        },
      ],
    },
  },

  // ========================================================
  // 7. JavaScript/JSXファイル専用設定（型チェック無効化）
  // ========================================================
  {
    name: "javascript-overrides",
    files: ["*.js", "*.jsx", "*.mjs", "*.cjs"],
    // tseslint.configs.disableTypeChecked を継承するのが最も確実です
    extends: [tseslint.configs.disableTypeChecked],
    languageOptions: {
      parserOptions: {
        projectService: false,
        project: null,
      },
    },
    rules: {
      "@typescript-eslint/no-var-requires": "off",
      "no-unused-vars": "error",
    },
  },

  // ========================================================
  // 8. 型定義ファイル専用設定
  // ========================================================
  {
    name: "type-definition-files",
    files: ["types/**/*.ts", "**/*.d.ts"],
    rules: {
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/no-explicit-any": "error",
    },
  },

  // ========================================================
  // 9. Next.js専用ファイル（デフォルトエクスポート許可）
  // ========================================================
  {
    name: "nextjs-special-files",
    files: [
      "**/app/**/page.{ts,tsx}",
      "**/app/**/layout.{ts,tsx}",
      "**/app/**/loading.{ts,tsx}",
      "**/app/**/error.{ts,tsx}",
      "**/app/**/global-error.{ts,tsx}",
      "**/app/**/not-found.{ts,tsx}",
      "**/app/**/template.{ts,tsx}",
      "**/app/**/default.{ts,tsx}",
      "**/app/**/route.{ts,tsx}",
      "**/pages/**/*.{ts,tsx}",
      "**/pages/api/**/*.{ts,tsx}",
      "**/app/api/**/*.{ts,tsx}",
      "**/proxy.{ts,tsx}",
      "**/next.config.{js,mjs,ts}",
      "**/tailwind.config.{js,ts}",
    ],
    rules: {
      "import/no-default-export": "off",
      "import/prefer-default-export": "off",
      "@typescript-eslint/no-explicit-any": "off",
    },
  },

  // ========================================================
  // 10. Storybookファイル
  // ========================================================
  {
    name: "storybook-files",
    files: [
      "**/*.stories.{ts,tsx}",
      "**/*.story.{ts,tsx}",
      ".storybook/**/*.{ts,tsx}",
    ],
    rules: {
      "import/no-default-export": "off",
      "@typescript-eslint/naming-convention": "off",
    },
  },

  // ========================================================
  // 11. テスト環境
  // ========================================================
  {
    name: "test-environment",
    files: [
      "**/*.test.{ts,tsx}",
      "**/*.spec.{ts,tsx}",
      "tests/**/*.{ts,tsx}",
      "**/__tests__/**/*.{ts,tsx}",
    ],
    plugins: {
      vitest,
      "testing-library": testingLibrary,
    },
    rules: {
      ...vitest.configs.recommended.rules,
      ...testingLibrary.configs["flat/react"].rules,

      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unsafe-assignment": "warn",
      "@typescript-eslint/no-unsafe-call": "warn",
      "@typescript-eslint/no-unsafe-member-access": "warn",
      "@typescript-eslint/unbound-method": "off",
      "@typescript-eslint/no-non-null-assertion": "off",
      "@typescript-eslint/strict-boolean-expressions": "off",
      // ★追加: モック作成用に空関数を許可
      "@typescript-eslint/no-empty-function": "off",

      "vitest/expect-expect": "error",
      "vitest/consistent-test-it": [
        "error",
        { fn: "test", withinDescribe: "it" },
      ],
      "vitest/no-disabled-tests": "warn",
      "vitest/no-focused-tests": "error",
      "vitest/prefer-to-be": "error",
      "vitest/prefer-to-have-length": "error",
      "vitest/prefer-to-be-truthy": "warn",
      "vitest/prefer-to-be-falsy": "warn",

      "no-console": "off",
      "react/jsx-no-bind": "off",
      "import/no-default-export": "off",
    },
  },

  // ========================================================
  // 12. Prettier
  // ========================================================
  eslintConfigPrettier
);
