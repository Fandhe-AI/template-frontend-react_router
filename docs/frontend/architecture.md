# アーキテクチャ

Turborepo + pnpm workspaces によるモノレポ構成。Feature-Sliced Design (FSD) のレイヤー分割をワークスペース単位で実現している。

## ディレクトリ構成

```
apps/
  web/                     — React Router v7 Framework Mode アプリケーション
  storybook/               — Storybook UI カタログ（port 6006）
  playwright/              — Playwright E2E テスト
  typedoc/                 — TypeDoc ドキュメント生成
  vitest/                  — Vitest テストレポート集約（blob マージ + HTML 表示）

packages/
  pages/                   — FSD pages レイヤー（未実装）
  widgets/                 — FSD widgets レイヤー（未実装）
  features/                — FSD features レイヤー（未実装）
  entities/                — FSD entities レイヤー（未実装）
  shared/
    config-biome/          — 共有 Biome 設定 (@repo/shared-config-biome)
    config-commitlint/     — 共有 Commitlint 設定 (@repo/shared-config-commitlint)
    config-knip/           — 共有 Knip 設定 (@repo/shared-config-knip)
    config-playwright/     — 共有 Playwright 設定 (@repo/shared-config-playwright)
    config-storybook/      — 共有 Storybook 設定 (@repo/shared-config-storybook)
    config-syncpack/       — 共有 Syncpack 設定 (@repo/shared-config-syncpack)
    config-typescript/     — 共有 TypeScript 設定 (@repo/shared-config-typescript)
    config-typedoc/        — 共有 TypeDoc 設定 (@repo/shared-config-typedoc)
    config-vitest/         — 共有 Vitest 設定 (@repo/shared-config-vitest)
    sandbox/               — 開発環境検証用スライス (@repo/shared-sandbox)
```

FSD レイヤー（pages / widgets / features / entities）は `.gitkeep` のみで、実装はまだ配置されていない。

## pnpm ワークスペース

`pnpm-workspace.yaml` で定義:

```yaml
packages:
  - apps/*
  - packages/pages/*
  - packages/widgets/*
  - packages/features/*
  - packages/entities/*
  - packages/shared/*

onlyBuiltDependencies:
  - esbuild
  - lefthook
```

## FSD 依存方向ルール

Syncpack により、FSD のレイヤー間依存方向を強制している。下位レイヤーから上位レイヤーへの依存は禁止:

```
shared → entities / features / widgets / pages  ✗ 禁止
entities → features / widgets / pages            ✗ 禁止
features → widgets / pages                       ✗ 禁止
widgets → pages                                  ✗ 禁止
```

許可される依存方向（上位 → 下位）:

```
pages → widgets → features → entities → shared  ✓ 許可
```

## Turborepo タスクグラフ

`turbo.json` で定義されるタスク:

| タスク            | 依存             | キャッシュ | 出力                             | 追加入力                           |
| ----------------- | ---------------- | ---------- | -------------------------------- | ---------------------------------- |
| `build`           | `^build`         | あり       | `build/**`                       | `.env*`                            |
| `lint`            | `^lint`          | あり       | なし                             | `biome.json`                       |
| `check-types`     | `^check-types`   | あり       | なし                             | `tsconfig.json`, `tsconfig.*.json` |
| `dev`             | `^build`         | なし       | —                                | —                                  |
| `test`            | `^test`          | あり       | `test-results/**`                | —                                  |
| `test:coverage`   | `^test:coverage` | あり       | `coverage/**`, `test-results/**` | —                                  |
| `test:e2e`        | —                | なし       | なし                             | —                                  |
| `storybook:build` | `^build`         | あり       | `storybook-static/**`            | —                                  |
| `typedoc`         | `^build`         | あり       | `docs/**`                        | —                                  |

- `^` プレフィクスにより、依存パッケージのタスクが先に実行される
- `dev` は `persistent: true` で常駐プロセスとして動作
- `build` の出力から `build/cache/**` は除外
- `test:e2e` は E2E テスト（Playwright）用で、キャッシュ無効
- `apps/vitest` がパッケージ固有タスクチェーンを定義: `collect-blobs` → `merge-reports` → `vitest`

## 共有 TypeScript 設定

`@repo/shared-config-typescript` が 3 つのテンプレートを提供:

### base.json

全テンプレートの基盤:

| オプション               | 値        |
| ------------------------ | --------- |
| `target`                 | ES2022    |
| `module`                 | ESNext    |
| `moduleResolution`       | Bundler   |
| `strict`                 | true      |
| `noUncheckedIndexedAccess` | true    |
| `isolatedModules`        | true      |
| `verbatimModuleSyntax`   | true      |
| `declaration`            | true      |
| `declarationMap`         | true      |
| `skipLibCheck`           | true      |

### react-router.json

`base.json` を継承し、React Router v7 アプリ向け:

- `jsx`: `react-jsx`
- `module`: `ES2022`
- `noEmit`: `true`
- `types`: `["node", "vite/client"]`

### react-library.json

`base.json` を継承し、React ライブラリパッケージ向け:

- `jsx`: `react-jsx`
