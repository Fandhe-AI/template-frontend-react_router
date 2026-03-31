# フロントエンドテンプレート（React Router）

Vercel × Supabase 環境でのバイブコーディングに最適化されたフロントエンドテンプレート。

Turborepo + pnpm ワークスペースによるモノレポ構成で、Feature-Sliced Design (FSD) アーキテクチャを採用しています。

**Author:** Fandhe Inc.

## クイックスタート

### 必要なもの

- Node.js 24.13.0
- pnpm 10.32.1
- [Claude Code](https://docs.anthropic.com/en/docs/claude-code)（推奨）

### セットアップ

```sh
# 1. リポジトリをクローン（--recurse-submodules で submodule も取得）
git clone --recurse-submodules <repository-url> my-project
cd my-project

# 2. セットアップ（env ファイル生成、依存インストール、Git hooks 設定）
make setup

# 3. 開発サーバー起動
pnpm dev
```

`make setup` は以下を実行します:

1. Git Submodules の初期化（`packages/shared/config-*`）
1. `.env.example` から `.env` を生成
1. Volta のインストール（Node バージョン管理）
1. `pnpm install`
1. Playwright ブラウザのインストール
1. Lefthook（Git hooks）のインストール

開発サーバーは <http://localhost:3000> で起動します。

各サービスの詳細なセットアップ手順は [セットアップガイド](docs/setup/README.md) を参照してください。

## プロジェクト構成

```text
apps/
  web/                — React Router v7 + Vite (port 3000)
  storybook/          — Storybook UI カタログ (port 6006)
  playwright/         — Playwright E2E テスト
  typedoc/            — TypeDoc API ドキュメント
  vitest/             — Vitest テストレポート集約
packages/
  pages/              — FSD pages レイヤー
  widgets/            — FSD widgets レイヤー
  features/           — FSD features レイヤー
  entities/           — FSD entities レイヤー
  shared/
    config-biome/     — [submodule] Biome 設定 (@fandhe-ai/shared-config-biome)
    config-commitlint/ — [submodule] Commitlint 設定 (@fandhe-ai/shared-config-commitlint)
    config-knip/      — [submodule] Knip 設定 (@fandhe-ai/shared-config-knip)
    config-playwright/ — [submodule] Playwright 設定 (@fandhe-ai/shared-config-playwright)
    config-storybook/ — [submodule] Storybook 設定 (@fandhe-ai/shared-config-storybook)
    config-syncpack/  — [submodule] Syncpack 設定 (@fandhe-ai/shared-config-syncpack)
    config-typescript/ — [submodule] TypeScript 設定 (@fandhe-ai/shared-config-typescript)
    config-typedoc/   — [submodule] TypeDoc 設定 (@fandhe-ai/shared-config-typedoc)
    config-vitest/    — [submodule] Vitest 設定 (@fandhe-ai/shared-config-vitest)
    sandbox/          — dev tooling 検証用 (@repo/shared-sandbox)
supabase/             — Supabase ローカル開発設定・マイグレーション
docs/                 — 詳細ドキュメント
```

## 技術スタック

| カテゴリ | 技術 |
| --- | --- |
| Runtime | Node 24.13.0 / pnpm 10.32.1 / TypeScript 5.9.3 |
| Frontend | React 19 / React Router v7 (Framework Mode) / Vite 8 |
| UI | Chakra UI v3 |
| Backend | Supabase (Auth / Database / Storage) |
| Deploy | Vercel |
| Lint & Format | Biome 2.4 |
| Test | Vitest 4 / Playwright 1.58 |
| UI Catalog | Storybook 10 |
| Docs | TypeDoc |
| Build | Turborepo |
| Git Hooks | Lefthook (pre-commit: biome, commit-msg: commitlint, pre-push: test) |

## コマンド一覧

すべてのコマンドはリポジトリルートから実行してください。**pnpm のみ使用**（npm/yarn 不可）。

| コマンド | 説明 |
| --- | --- |
| `pnpm dev` | web アプリ起動 (port 3000) |
| `pnpm storybook` | Storybook 起動 (port 6006) |
| `pnpm build` | 全パッケージビルド |
| `pnpm lint` | Biome チェック |
| `pnpm lint:fix` | Biome 自動修正 |
| `pnpm format` | フォーマットチェック |
| `pnpm format:fix` | フォーマット自動修正 |
| `pnpm check-types` | TypeScript 型チェック |
| `pnpm test` | ユニット / 統合テスト |
| `pnpm test:coverage` | カバレッジレポート付きテスト |
| `pnpm test:e2e` | Playwright E2E テスト |
| `pnpm typedoc` | API ドキュメント生成 |
| `pnpm knip` | 未使用コード / 依存 / export 検出 |
| `pnpm package:lint` | 依存バージョン整合性チェック |
| `make setup` | 初期セットアップ（submodules, env, volta, pnpm, playwright, lefthook） |
| `make update-submodules` | 共有設定 submodules を最新に更新 |

## アーキテクチャ

### Feature-Sliced Design (FSD)

本テンプレートは [Feature-Sliced Design](https://feature-sliced.design/) アーキテクチャを採用しています。

```text
packages/
  shared/     → 共有ユーティリティ・UI・設定（どのレイヤーからも参照可）
  entities/   → ビジネスエンティティ（User, Product 等）
  features/   → ユーザーアクション（認証, 検索 等）
  widgets/    → ページを構成する独立したブロック
  pages/      → ルートに対応するページコンポーネント
```

**依存方向**: `shared` → `entities` → `features` → `widgets` → `pages` の一方向のみ。上位レイヤーが下位レイヤーを参照してはいけません。

### Turborepo モノレポ

Turborepo でビルド・lint・テスト等のタスクを並列実行・キャッシュします。

- `build`: パッケージ → アプリの順にビルド（`^build` 依存）
- `lint` / `check-types`: 全パッケージで並列実行
- `test`: パッケージ単位でキャッシュ
- `dev`: `apps/web` のみ起動（persistent タスク）

## Supabase

本テンプレートは [Supabase](https://supabase.com/) をデフォルトのバックエンドとして組み込んでいます。

- `apps/web/src/lib/supabase/server.ts` — サーバーサイド Supabase クライアント（SSR 対応、Cookie 管理付き）
- `apps/web/src/lib/supabase/client.ts` — ブラウザ Supabase クライアント

詳細なセットアップ手順は [Supabase セットアップガイド](docs/setup/supabase.md) を参照してください。

Supabase を使わない場合は [Supabase 削除ガイド](docs/setup/remove-supabase.md) を参照してください。

## Claude Code での開発

本テンプレートは [Claude Code](https://docs.anthropic.com/en/docs/claude-code) でのバイブコーディングに最適化されています。

### 開発ワークフロー

Claude Code のスキルを組み合わせた開発フローが用意されています:

```text
/create-plan → /create-issue → ブランチ移動 → /implement-issue
  → /implement-review → /update-docs → /create-pr → マージ → 次の Issue へ
```

詳細は [開発ガイド](docs/guide/workflow.md) を参照してください。

### スキル

Claude Code のスラッシュコマンドで利用できるスキルが組み込まれています:

| コマンド | 説明 |
| --- | --- |
| `/create-plan` | 実装計画を作成 |
| `/create-issue` | GitHub Issue を作成 |
| `/implement-issue` | Issue を読み込み実装 |
| `/implement-review` | コード変更をレビュー |
| `/update-docs` | ドキュメントを更新 |
| `/create-pr` | PR を作成 |
| `/create-commit` | Conventional Commits 形式でコミット |
| `/create-component` | Chakra UI + FSD 準拠の UI コンポーネントを生成 |
| `/create-slice` | FSD スライス（package.json, tsconfig, index.ts）を生成 |
| `/tdd` | Red-Green-Refactor サイクルでの TDD ワークフロー |
| `/deploy-to-vercel` | Vercel へデプロイ |

リファレンススキル（`.agents/skills/`）はライブラリやツールのドキュメントを Claude Code に提供します。必要に応じて `claude skill add` で追加できます。

### エージェント

9 つのカスタムエージェントが `.claude/agents/` に定義されています:

| エージェント | 役割 |
| --- | --- |
| `code-reviewer` | コード品質レビュー |
| `component-analyzer` | コンポーネント再利用分析 |
| `figma-analyzer` | Figma デザイン分析 |
| `plan-verifier` | 実装計画の検証 |
| `playwright-tester` | E2E テスト・ビジュアル検証 |
| `refactor-cleaner` | 未使用コード検出・削除 |
| `reference-researcher` | 公式ドキュメント調査 |
| `security-auditor` | セキュリティ監査 |
| `sub-investigator` | エラー調査・情報収集・検証の代行 |

### MCP サーバー

`.mcp.json` で以下の MCP サーバーが設定されています:

| サーバー | 用途 | 備考 |
| --- | --- | --- |
| Figma Desktop | デザインコンテキストの取得 | Figma Desktop の起動が必要 |
| Playwright | ブラウザ操作・E2E テスト | — |
| Chakra UI | コンポーネント情報・テーマデータ | `CHAKRA_PRO_API_KEY` が必要（[セットアップ](docs/setup/chakra-ui-mcp.md)） |

## 新しいプロジェクトの始め方

1. **リポジトリの準備**:

   ```sh
   git clone --recurse-submodules <template-url> my-project
   cd my-project
   rm -rf .git
   git init
   git submodule update --init --recursive
   ```

1. **プロジェクト情報の更新**:
   - `package.json` の `name` を変更
   - `supabase/config.toml` の `project_id` を変更
   - `README.md` を更新

1. **セットアップ**:

   ```sh
   make setup
   ```

1. **各サービスの接続**:
   - [Vercel セットアップ](docs/setup/vercel.md)
   - [Supabase セットアップ](docs/setup/supabase.md)（使用する場合）
   - [Chakra UI MCP セットアップ](docs/setup/chakra-ui-mcp.md)（Claude Code 利用時）

1. **開発開始**:

   ```sh
   pnpm dev
   ```

## 詳細ドキュメント

| ドキュメント | 内容 |
| --- | --- |
| [セットアップガイド](docs/setup/README.md) | Vercel / Supabase / Chakra UI MCP の詳細セットアップ |
| [開発ガイド](docs/guide/README.md) | Claude Code を使った開発ワークフロー |
| [Claude Code 構成ガイド](docs/claude/README.md) | エージェント・スキル・MCP・Hooks の詳細 |
| [フロントエンド技術ガイド](docs/frontend/README.md) | アーキテクチャ・ツールチェーン・テスト戦略 |
| [GitHub Actions ガイド](docs/github/README.md) | CI/CD ワークフローの詳細 |

## Author

Fandhe Inc.
