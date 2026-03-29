# GitHub 構成ガイド

本プロジェクトの GitHub Actions CI/CD パイプラインの全体像をまとめたドキュメント。

## CI/CD フロー

```
PR → non-main ブランチ
  ├── Biome (reviewdog)        … PR コメントでコードレビュー
  ├── EditorConfig             … ファイルフォーマット検証
  └── Commitlint               … コミットメッセージ検証

PR → main ブランチ
  ├── Biome (reviewdog)        … PR コメントでコードレビュー
  ├── EditorConfig             … ファイルフォーマット検証
  ├── Commitlint               … コミットメッセージ検証
  ├── Biome lint & format      … コード品質チェック
  ├── TypeScript type check    … 型チェック
  ├── Knip                     … 未使用コード検出
  ├── Syncpack                 … 依存バージョン一貫性
  ├── Test                     … テスト実行
  ├── Storybook build          … Storybook ビルド検証
  └── Build                    … ビルド（上記すべての品質チェック通過後）
```

## ドキュメント一覧

| ファイル                         | 内容                                                            |
| -------------------------------- | --------------------------------------------------------------- |
| [workflows.md](workflows.md)    | CI ワークフロー（check-pr / check-pr-into-main）の詳細         |
| [actions.md](actions.md)        | Composite Actions（setup-pnpm / install-deps / build-app）      |

## 設定ファイル一覧

| ファイル                                      | 内容                       |
| --------------------------------------------- | -------------------------- |
| `.github/workflows/check-pr.yml`              | non-main PR チェック       |
| `.github/workflows/check-pr-into-main.yml`    | main PR チェック           |
| `.github/actions/setup-pnpm/action.yml`       | pnpm / Node.js セットアップ |
| `.github/actions/install-deps/action.yml`     | 依存インストール           |
| `.github/actions/build-app/action.yml`        | ビルド・アーティファクト   |
