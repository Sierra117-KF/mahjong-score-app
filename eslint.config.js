import path from 'node:path';
import { fileURLToPath } from 'node:url';
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import vitest from '@vitest/eslint-plugin';
import testingLibrary from 'eslint-plugin-testing-library';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default [
  // グローバル無視設定
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      '*.d.ts',
      '*.tsbuildinfo',
      '.vercel/**',
      'coverage/**',
      'dist/**',
      'build/**',
      'out/**',
      'tsconfig*.json',
      '*.json',
      '*.config.js',
      '*.config.mjs',
      '*.config.ts',
      'next.config.js',
      'vitest.config.ts'
    ],
  },

  // Base Configurations (優先度：低)
  eslint.configs.recommended,
  
  // Next.js 設定 (Baseとして先に読み込む)
  // これらが依存するプラグイン(import, react, jsx-a11y等)もここでロードされます
  ...nextVitals,
  ...nextTs,

  // TypeScript Strict Settings (優先度：高)
  // Next.jsの設定よりも後に記述することで、厳格なルールで上書きします
  ...tseslint.configs.strictTypeChecked,
  // スタイルに関するルールが含まれる場合があるため、必要に応じて stylistic も追加検討
  // ...tseslint.configs.stylisticTypeChecked, 

  // 共通設定 & プロジェクト固有の厳格ルール
  {
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: [
          './tsconfig.json',
          './tsconfig.test.json',
          './tests/tsconfig.json'
        ],
        tsconfigRootDir: __dirname,
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: [
            './tsconfig.json',
            './tsconfig.test.json',
            './tests/tsconfig.json',
          ],
        },
      },
    },
    rules: {
      // === プロジェクト固有のカスタマイズ（Strictルールの上書き・調整） ===

      // unified-signaturesルールを無効化（proxy.tsとの互換性問題のため）
      '@typescript-eslint/unified-signatures': 'off',

      // TypeScript指令コメントの厳格な制限（説明必須化）
      '@typescript-eslint/ban-ts-comment': [
        'error',
        {
          'ts-expect-error': 'allow-with-description',
          'ts-ignore': true,
          'ts-nocheck': true,
          'ts-check': false,
          minimumDescriptionLength: 3,
        },
      ],

      // 型インポートの明確化（バンドルサイズ削減、コンパイル時に型情報除去）
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
        },
      ],

      // 未使用変数検知（_プレフィックスで意図的な未使用を明示）
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          vars: 'all',
          args: 'after-used',
          ignoreRestSiblings: true,
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],

      // Promise誤用防止（React/Next.jsイベントハンドラ対応）
      '@typescript-eslint/no-misused-promises': [
        'error',
        {
          checksConditionals: true,
          checksVoidReturn: {
            arguments: false,
            attributes: false,
          },
          checksSpreads: true,
        },
      ],

      // テンプレート文字列の型制限（数値は許可、実用性重視）
      '@typescript-eslint/restrict-template-expressions': [
        'error',
        {
          allowNumber: true,
          allowBoolean: false,
          allowAny: false,
          allowNullish: false,
          allowRegExp: false,
        },
      ],

      // 浮遊Promiseの禁止（void演算子での意図的無視は許可）
      '@typescript-eslint/no-floating-promises': [
        'error',
        {
          ignoreVoid: true,
          ignoreIIFE: false,
        },
      ],

      // 不要な条件式の検出（ループ条件は許可）
      '@typescript-eslint/no-unnecessary-condition': [
        'error',
        {
          allowConstantLoopConditions: true,
        },
      ],

      // +演算子の型制限（厳格設定）
      '@typescript-eslint/restrict-plus-operands': [
        'error',
        {
          allowAny: false,
          allowBoolean: false,
          allowNullish: false,
          allowNumberAndString: false,
          allowRegExp: false,
        },
      ],
    },
  },

  // メインアプリケーションルール (src/app 配下など)
  {
    name: 'app-main-logic',
    files: ['src/**/*.{js,jsx,ts,tsx}'], // src全体に適用範囲を拡大（漏れ防止）
    rules: {
      // TypeScript型安全性
      '@typescript-eslint/no-explicit-any': 'error',

      // TypeScript-ESLint strictTypeCheckedに含まれるルールは自動適用されるため、
      // プロジェクト固有のカスタマイズのみここに記述

      // プロジェクト固有のルール

      // console使用制限（本アプリではconsoleを完全禁止）
      'no-console': 'error',

      // 不正な空白文字の制限（正規表現内の全角スペースを許可）
      'no-irregular-whitespace': [
        'error',
        {
          skipStrings: true,
          skipComments: false,
          skipRegExps: true,
          skipTemplates: true,
        },
      ],
      
      // Import順序 (eslint-plugin-importはNext.js設定によりロード済みと仮定)
      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            ['parent', 'sibling', 'index'],
          ],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],

      // 空のオブジェクト型
      '@typescript-eslint/no-empty-object-type': 'error',

      // コード品質ルール
      'prefer-const': 'error',
      'no-var': 'error',
      'no-duplicate-imports': 'error',
      'no-case-declarations': 'error',
      'no-duplicate-case': 'error',

      // React/Next.js固有のルール
      'react-hooks/exhaustive-deps': 'error',
      'react/jsx-key': 'error',
      'react/no-unescaped-entities': 'error',

      // Next.jsルール
      '@next/next/no-html-link-for-pages': 'error',
      '@next/next/no-img-element': 'error',
      '@next/next/no-sync-scripts': 'error',
      
      // アクセシビリティ (jsx-a11y)
      // Next.js推奨設定に追加して、さらに厳しくしたい場合のみ記述
      // 基本はNext.jsのプリセットで十分
    },
  },

  // JavaScript/JSXファイル用設定 (JSファイルでのTSルール無効化)
  {
    name: 'javascript-overrides',
    files: ['*.js', '*.jsx', '*.mjs'],
    languageOptions: {
      parserOptions: {
        projectService: false,
        project: null, // JSファイルでは型情報を無効化して高速化
      },
    },
    rules: {
      '@typescript-eslint/no-var-requires': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      'no-unused-vars': 'error',
    },
  },

  // 型定義ファイル用設定
  {
    name: 'type-definition-overrides',
    files: ['types/**/*.ts', '**/*.d.ts'],
    rules: {
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-explicit-any': 'error',
    },
  },

  // テスト環境設定（Vitest + React Testing Library）
  {
    name: 'test-environment-overrides',
    files: ['tests/**/*.{js,jsx,ts,tsx}', '**/*.test.{js,jsx,ts,tsx}', '**/*.spec.{js,jsx,ts,tsx}'],
    plugins: {
      vitest: vitest,
      'testing-library': testingLibrary,
    },
    rules: {
      // Vitest推奨ルールを継承
      ...vitest.configs.recommended.rules,
      // Testing Library推奨ルールを継承
      ...testingLibrary.configs['flat/react'].rules,

      // テスト特有のルール緩和（最小限）
      // モック作成に必須のルールのみ緩和し、テストロジックの誤りは検出する設計

      // TypeScript unsafe系ルール（モックオブジェクトの型変換で必須）
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/unbound-method': 'off',

      // テストスタブ・モック設定で必須
      '@typescript-eslint/no-empty-function': 'off',
      'import/no-anonymous-default-export': 'off',

      // テストデバッグ用
      'no-console': 'off',
    },
  },

  // Prettier統合（ESLintとの競合を解消）
  eslintConfigPrettier,
];
