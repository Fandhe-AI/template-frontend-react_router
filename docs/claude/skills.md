# スキル一覧

Claude Code で利用可能なスキル。ローカルスキル（`.claude/skills/`）とリファレンススキル（`.agents/skills/`）の 2 種類がある。

## ローカルスキル

`.claude/skills/` に直接配置されたプロジェクト固有のスキル。

| スキル             | 説明                                                                                | 自動トリガー                         |
| ------------------ | ----------------------------------------------------------------------------------- | ------------------------------------ |
| `create-component` | FSD 規約に準拠した UI コンポーネントを生成（Storybook stories + Vitest テスト付き） | No                                   |
| `create-slice`     | FSD スライスを新規作成（package.json / tsconfig / バレルファイル自動生成）          | No                                   |
| `dotclaude-writer` | `.claude/` 配下にファイルを安全に作成・編集する手順を提供                           | Yes（`.claude/` への書き込み検出時） |
| `tdd`              | Red-Green-Refactor サイクルでテスト駆動開発。他スキルのテスト戦略も提供             | Yes（テスト作成タスク検出時）        |
| `update-docs`      | コード変更に基づいて README / docs / TSDoc を更新                                   | No                                   |

## リファレンススキル

`.agents/skills/` に配置された外部ソースのスキル。`skills-lock.json` でバージョン管理される。

### ワークフロースキル

ユーザーがスラッシュコマンド（`/skill-name`）で呼び出す操作系スキル。

| スキル                | コマンド               | 説明                                                     |
| --------------------- | ---------------------- | -------------------------------------------------------- |
| `create-commit`       | `/create-commit`       | Conventional Commits 形式で git コミットを作成           |
| `create-pr`           | `/create-pr`           | Conventional Commits 形式で GitHub PR を作成             |
| `create-issue`        | `/create-issue`        | GitHub Issue を親子構造（sub-issues）で作成              |
| `create-plan`         | `/create-plan`         | 実装タスクの計画を `_/local-plans/` に作成               |
| `implement-issue`     | `/implement-issue`     | GitHub Issue を読み込み、計画作成後にコード実装          |
| `implement-review`    | `/implement-review`    | コード変更の品質・アーキテクチャ・規約レビュー           |
| `implement-review-pr` | `/implement-review-pr` | GitHub PR の CI・品質・Conventional Commits 準拠レビュー |
| `deploy-to-vercel`    | `/deploy-to-vercel`    | Vercel へのデプロイ                                      |

### デザイン連携スキル

Figma MCP サーバーとの連携が必要。

| スキル                       | 説明                                     | ソース                 |
| ---------------------------- | ---------------------------------------- | ---------------------- |
| `implement-design`           | Figma デザインをコードに変換             | figma/mcp-server-guide |
| `code-connect-components`    | Figma コンポーネントとコードのマッピング | figma/mcp-server-guide |
| `create-design-system-rules` | デザインシステムルールの自動生成         | figma/mcp-server-guide |

### ライブラリリファレンススキル

フレームワーク・ライブラリの API ドキュメントを参照するスキル。コード作成時に自動的にコンテキストとして読み込まれる。

| カテゴリ              | スキル                |
| --------------------- | --------------------- |
| **UI フレームワーク** | `chakra-ui`           |
| **ルーティング**      | `react-router-v7`     |
| **バリデーション**    | `zod`                 |
| **テスト**            | `vitest`, `storybook` |
| **DB / BaaS**         | `supabase`            |

### 開発ツールスキル

| カテゴリ                      | スキル                  |
| ----------------------------- | ----------------------- |
| **ビルド**                    | `turborepo`             |
| **リンター / フォーマッター** | `biome`, `editorconfig` |
| **コミット検証**              | `commitlint`            |
| **Git hooks**                 | `lefthook`              |
| **未使用コード検出**          | `knip`                  |
| **依存関係管理**              | `syncpack`              |
| **ドキュメント生成**          | `tsdoc`, `typedoc`      |

### アーキテクチャ・ベストプラクティス

| スキル                        | 説明                                 | ソース      |
| ----------------------------- | ------------------------------------ | ----------- |
| `feature-sliced-design`       | FSD アーキテクチャガイドライン       | Fandhe-AI   |
| `vercel-react-best-practices` | React / Next.js パフォーマンス最適化 | vercel-labs |
| `vercel-composition-patterns` | React コンポジションパターン         | vercel-labs |
| `vercel-cli-with-tokens`      | Vercel CLI トークン認証              | vercel-labs |
| `web-design-guidelines`       | Web インターフェースガイドライン     | vercel-labs |

## スキルの管理

- スキルのバージョンは `skills-lock.json` で追跡される
- リファレンススキルのソース変更は `Fandhe-AI/agent-reference-skills` のみ許可
- ローカルスキルの追加は `.claude/skills/<name>/SKILL.md` にファイルを配置する
- 必要に応じて `claude skill add` で新しいリファレンススキルを追加できる
