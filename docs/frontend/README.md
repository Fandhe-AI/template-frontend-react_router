# フロントエンド構成ガイド

本プロジェクトのフロントエンド技術スタック・アーキテクチャ・開発ツールの全体像をまとめたドキュメント。

## 技術スタック

| カテゴリ | 技術 | バージョン |
| --- | --- | --- |
| ランタイム | Node.js | 24.13.0 |
| パッケージ管理 | pnpm | 10.32.1 |
| 言語 | TypeScript | 6.0.2 |
| UI ライブラリ | React | 19.2.4 |
| ルーティング | React Router (Framework Mode) | 7.13.1 |
| ビルドツール | Vite | 8.0.1 |
| UI コンポーネント | Chakra UI | 3.34.0 |
| Backend | Supabase | 2.99.3 |
| API ドキュメント | TypeDoc | — |
| モノレポ管理 | Turborepo | 2.8.20 |
| Lint / Format | Biome | 2.4.8 |
| 未使用コード検出 | Knip | 6.0.2 |
| 依存バージョン | Syncpack | 14.0.0 |
| Git Hooks | Lefthook | 2.1.4 |
| コミット検証 | Commitlint (@commitlint/config-conventional) | 20.5.0 |
| テスト | Vitest | 4.1.0 |
| UI カタログ | Storybook | 10.3.1 |
| E2E テスト | Playwright | 1.58 |

## ドキュメント一覧

| ファイル                             | 内容                                                     |
| ------------------------------------ | -------------------------------------------------------- |
| [architecture.md](architecture.md)   | モノレポ構成・FSD レイヤー・Turborepo タスクグラフ       |
| [toolchain.md](toolchain.md)         | Biome・Knip・Syncpack・Lefthook 等の開発ツールチェーン   |
| [testing.md](testing.md)             | テスト戦略（Vitest / Storybook / Playwright / TDD）      |
| [web-app.md](web-app.md)             | apps/web の React Router v7 / Vite 構成                  |
