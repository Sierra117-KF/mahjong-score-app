---
description: Run lint and type-check with error fixing
allowed-tools:
  - Bash
---

# /checkコマンドの概要

プロジェクトの品質チェックを実行し、エラーが検出された場合は自動修正を試みます。

# /checkコマンドの実行手順

## 1. Lintチェック

!pnpm lint

## 2. Type Check

!pnpm type-check

# エラーが検出された場合の対処

- 型定義の修正
- importパスの修正
- 型アノテーションの追加
- 未使用変数の削除
- その他のエラー

**エラーの修正後、再度チェックを実行して問題が解決されていることを確認してください。**
