# 開発ツールチェーン

本プロジェクトで使用する開発ツールの設定と役割。

## Biome

Lint・フォーマット・インポート整理を 1 ツールで統合（ESLint + Prettier の代替）。

### 設定構成

ルートの `biome.jsonc` が 3 つの共有設定を継承:

| 共有設定                         | 内容                         |
| -------------------------------- | ---------------------------- |
| `@repo/shared-config-biome/core`   | フォーマッタ設定（EditorConfig 連携） |
| `@repo/shared-config-biome/root`   | VCS 設定（Git / defaultBranch: main） |
| `@repo/shared-config-biome/import` | インポート整理ルール         |

### 対象ファイル

- **対象**: `apps/**`, `packages/**`
- **除外**: `node_modules`, `build`, `dist`, `.next`, `.react-router`, `.turbo`, `public`, `*.css`, `.agents`, `.claude/skills`, `.claude/worktrees`

### インポート整理グループ

```
1. :NODE:              — Node.js ビルトイン
2. npm:*, npm:*/**     — 外部パッケージ
3. :PACKAGE:           — ワークスペースパッケージ
4. /**                 — プロジェクトルートからの絶対パス
5. #*, #*/**           — ハッシュエイリアス
6. :PATH:              — 相対パス
```

### コマンド

```bash
pnpm lint             # biome check .
pnpm lint:fix         # biome check --write .
pnpm format           # biome format .（チェックのみ）
pnpm format:fix       # biome format --write .
```

## Knip

未使用のコード・依存関係・エクスポートを検出する。

### ワークスペース設定

`@repo/shared-config-knip/base` で定義:

| ワークスペース                         | エントリ                   | 特記                                                        |
| -------------------------------------- | -------------------------- | ----------------------------------------------------------- |
| `.`（ルート）                          | なし                       | `tsx` を ignoreDependencies、`playwright` を ignoreBinaries |
| `apps/web`                             | `src/routes/**/*.tsx`      | —                                                           |
| `apps/storybook`                       | `.storybook/**/*.{ts,tsx}` | —                                                           |
| `apps/typedoc`                         | なし                       | `@repo/shared-config-typedoc` を ignoreDependencies         |
| `apps/playwright`                      | `src/**/*.ts`              | —                                                           |
| `packages/shared/config-commitlint`    | `src/**/*.ts`              | `@commitlint/config-*` を ignoreDependencies                |
| `packages/shared/config-typescript`    | `src/**/*.{ts,tsx,json}`   | `vite/client` を ignoreUnresolved                           |
| `packages/shared/config-vitest`        | `src/**/*.ts`              | —                                                           |
| `packages/shared/config-storybook`     | `src/**/*.{ts,tsx}`        | —                                                           |
| `packages/shared/config-playwright`    | `configs/**/*.ts`          | —                                                           |
| `packages/shared/*`                    | `src/**/*.{ts,tsx,json}`   | —                                                           |

### コマンド

```bash
pnpm knip             # 未使用コード検出
pnpm knip:fix         # 未使用エクスポートを自動修正
```

## Syncpack

モノレポ内の依存関係バージョンの一貫性を管理する。

### 設定構成

`syncpack.config.ts` が 3 つの共有設定をマージ:

| 共有設定                    | 内容                                   |
| --------------------------- | -------------------------------------- |
| `strict`                    | 全依存関係で正確なバージョン指定を強制（semver range 禁止） |
| `fsd-dependency-direction`  | FSD レイヤー間の依存方向を制御（10 ルール） |
| `types-only-dev`            | `@types/*` は devDependencies のみ許可 |

### コマンド

```bash
pnpm package:lint         # 依存バージョンの一貫性チェック
pnpm package:fix          # 依存バージョンの不一致を修正
pnpm package:format       # package.json のフォーマットチェック
pnpm package:format:fix   # package.json のフォーマット修正
```

## Commitlint

Conventional Commits 形式でコミットメッセージを検証する。

### 設定

`commitlint.config.ts` → `@repo/shared-config-commitlint/base`:

```typescript
extends: [
  "@commitlint/config-conventional",   // 標準的な Conventional Commits ルール
  "@commitlint/config-pnpm-scopes",    // pnpm ワークスペース名をスコープとして許可
]
```

コミットメッセージ形式: `type(scope): subject`

## Lefthook

Git hooks マネージャー。3 つのフックを設定:

### pre-commit（並列実行）

| ジョブ         | 対象                                                                           | コマンド                                                                                               |
| -------------- | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------ |
| `biome check`  | `{apps,packages}/**/*.{js,ts,cjs,mjs,d.cts,d.mts,jsx,tsx,json,jsonc}` | `pnpm exec biome check --no-errors-on-unmatched --files-ignore-unknown=true --colors=off {staged_files}` |

### pre-push（並列実行）

| ジョブ              | 対象                                         | コマンド                   |
| ------------------- | -------------------------------------------- | -------------------------- |
| `check-types`       | `{apps,packages}/**/*.{ts,tsx,js,jsx}`       | `pnpm run check-types`     |
| `knip`              | `{apps,packages}/**/*.{ts,tsx,js,jsx,json}`  | `pnpm run knip`            |
| `syncpack:lint`     | `**/package.json`                            | `pnpm run package:lint`    |
| `syncpack:format`   | `**/package.json`                            | `pnpm run package:format`  |
| `test`              | `{apps,packages}/**/*.{ts,tsx,js,jsx}`       | `pnpm run test`            |

### commit-msg

| コマンド      | 実行                                    |
| ------------- | --------------------------------------- |
| `commitlint`  | `pnpm exec commitlint --edit {1}`       |

## Vitest

ユニットテスト・統合テストフレームワーク。

### 設定構成

パッケージレベルキャッシング方式を採用。各パッケージが `vitest run` を独立実行し、Turborepo がキャッシュを管理する。

`@repo/shared-config-vitest/base` で共有設定を提供:

| オプション         | 値                                                     |
| ------------------ | ------------------------------------------------------ |
| `globals`          | `true`                                                 |
| `environment`      | `happy-dom`                                            |
| `include`          | `src/**/*.test.{ts,tsx}`, `src/**/*.spec.{ts,tsx}`     |
| `passWithNoTests`  | `true`                                                 |
| `reporters`        | `default`, `blob`                                      |
| `coverage.provider`| `v8`                                                   |
| `coverage.reporter`| `text`, `json-summary`, `json`                         |

各アプリ・パッケージの `vitest.config.ts` が共有設定を継承。`apps/vitest` が blob レポートを集約し HTML レポートを生成する。

### コマンド

```bash
pnpm test                     # 全テスト実行（Turborepo 経由）
pnpm test:coverage            # カバレッジ付きテスト実行
pnpm vitest                   # テスト実行 + HTML レポート表示
```

詳細は [testing.md](testing.md) を参照。

## EditorConfig

`.editorconfig` でエディタの基本設定を統一:

| プロパティ                 | 値      |
| -------------------------- | ------- |
| `charset`                  | utf-8   |
| `end_of_line`              | lf      |
| `indent_size`              | 2       |
| `indent_style`             | space   |
| `insert_final_newline`     | true    |
| `trim_trailing_whitespace` | true    |

ファイル種別ごとの上書き:

| パターン      | 上書き              |
| ------------- | ------------------- |
| `[Makefile]`  | `indent_style = tab`|
