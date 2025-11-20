# 麻雀点数計算アプリ

モバイルファーストで動作する、シンプルで使いやすい麻雀点数計算アプリケーションです。

## 技術スタック

- **Next.js 16** - React フレームワーク（静的エクスポート）
- **React 19.2** - UIライブラリ
- **TypeScript 5** - 型安全な開発
- **Tailwind CSS 4** - ユーティリティファーストCSS
- **Turbopack** - 高速バンドラー（Next.js 16デフォルト）
- **Vitest** - テストランナー

## 主な機能

### 点数計算
- 飜数（1〜13飜）と符数から正確な点数を自動計算
- 満貫・跳満・倍満・三倍満・役満に対応
- 本場数による加算も自動計算

### 設定項目
- **ゲームモード**: 4人麻雀 / 3人麻雀
- **プレイヤー**: 親 / 子
- **和了種別**: ロン / ツモ
- **飜数**: 1〜13飜（クイックボタン + 入力欄）
- **符数**: 20〜110符（10符単位）
- **本場数**: 0〜99本場

### 表示内容
- 計算結果の点数（大きく見やすい表示）
- 基本点の詳細
- 支払い内訳（ロン時の放銃者、ツモ時の各プレイヤー）

## 開発環境のセットアップ

### 必要な環境
- Node.js 20.9以上
- npm または yarn

### インストール

```bash
# リポジトリをクローン
git clone https://github.com/Sierra117-KF/mahjong-score-app.git
cd mahjong-score-app

# 依存関係をインストール
npm install
```

### 開発サーバーの起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてください。

### ビルド

```bash
# 本番用ビルド（静的エクスポート）
npm run build

```

### その他のコマンド

```bash
# 型チェック
npm run type-check

# Lint
npm run lint

# テスト実行
npm test

# テスト（ウォッチモード）
npm run test:watch

# テストカバレッジ
npm run test:coverage
```

## プロジェクト構成

```
mahjong-score-app/
├── .claude/                   # Claude Code設定
│   ├── settings.json          # 設定ファイル
│   └── commands/              # カスタムスラッシュコマンド
├── .next/                     # Next.jsビルド出力（Git除外）
├── .vscode/                   # VSCode設定
│   └── settings.json          # VSCode設定ファイル
├── node_modules/              # 依存パッケージ（Git除外）
├── src/
│   ├── app/
│   │   ├── favicon.ico        # ファビコン
│   │   ├── globals.css        # グローバルスタイル（Tailwind設定）
│   │   ├── layout.tsx         # ルートレイアウト
│   │   └── page.tsx           # メインページ（トップページ）
│   ├── components/            # UIコンポーネント
│   │   ├── NumberInput.tsx    # 数値入力コンポーネント
│   │   ├── ScoreDisplay.tsx   # 点数表示コンポーネント
│   │   └── ToggleButton.tsx   # トグルボタンコンポーネント
│   ├── hooks/                 # アプリ固有のカスタムフック
│   │   └── useMahjongGame.ts  # 入力状態と計算ロジックを集約
│   ├── lib/                   # 共有定数
│   │   └── constants.ts       # 各種セレクタとデフォルト値
│   ├── types/                 # TypeScript型定義
│   │   └── index.ts           # 型定義ファイル
│   └── utils/                 # ユーティリティ関数
│       └── scoreCalculator.ts # 点数計算ロジック
├── tests/
│   ├── unit/                  # 単体テスト
│   ├── sample.test.ts         # サンプルテスト
│   ├── setup.ts               # テストセットアップ
│   ├── tsconfig.json          # テスト用TypeScript設定
│   └── tsconfig.tsbuildinfo   # TypeScriptビルド情報（Git除外）
├── .gitignore                 # Git除外設定
├── AGENTS.md                  # AIコーディングガイドライン
├── CLAUDE.md                  # Claude Codeガイドライン
├── eslint.config.js           # ESLint設定
├── GEMINI.md                  # Googleガイドライン
├── LICENSE                    # ライセンス（MIT）
├── next-env.d.ts              # Next.js型定義（Git除外）
├── next.config.ts             # Next.js設定
├── package-lock.json          # 依存関係ロックファイル
├── package.json               # プロジェクト設定・依存関係
├── postcss.config.mjs         # PostCSS設定
├── README.md                  # プロジェクト説明
├── tsconfig.json              # TypeScript設定
├── tsconfig.test.json         # テスト用TypeScript設定
├── tsconfig.tsbuildinfo       # TypeScriptビルド情報（Git除外）
└── vitest.config.ts           # Vitestテスト設定
```

## デプロイ

このアプリケーションは静的サイトとしてエクスポートされるため、Vercel、Netlify、GitHub Pagesなど、あらゆる静的ホスティングサービスにデプロイできます。

### 手動デプロイ

```bash
# ビルド
npm run build

```

## 技術的な特徴

### プライバシー重視
このアプリケーションは**データを一切保存しません**：
- データベース不使用
- LocalStorage不使用
- Cookie不使用
- すべての計算はその場限りで完結
- ページをリロードすると初期状態に戻ります

## 開発ガイドライン

詳細な開発ガイドライン、UI/UX仕様、点数計算ロジックの詳細については、[AGENTS.md](AGENTS.md)を参照してください。

## ライセンス

このプロジェクトは[MITライセンス](LICENSE)の下で公開されています。

Have fun!