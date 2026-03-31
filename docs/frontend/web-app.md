# Web アプリケーション (apps/web)

React Router v7 Framework Mode で構築されたフルスタック SSR アプリケーション。

## ディレクトリ構成

```
apps/web/
├── react-router.config.ts   — React Router 設定
├── vite.config.ts            — Vite 設定
├── vitest.config.ts          — Vitest 設定
├── tsconfig.json             — TypeScript 設定
├── package.json
├── src/
│   ├── root.tsx              — ルートレイアウト
│   ├── routes.ts             — ルート定義
│   ├── app.css               — グローバル CSS
│   └── routes/
│       └── home.tsx          — ホームルート（インデックス）
└── build/
    ├── client/               — クライアントバンドル（Vite 出力）
    └── server/               — サーバーエントリ（index.js）
```

## React Router v7

### 設定 (react-router.config.ts)

```typescript
export default {
  appDirectory: "src",
  ssr: true,
} satisfies Config;
```

- `appDirectory`: ソースディレクトリを `src/` に変更（デフォルトは `app/`）
- `ssr`: サーバーサイドレンダリング有効

### ルート定義 (src/routes.ts)

```typescript
import { index, type RouteConfig } from "@react-router/dev/routes";

export default [index("routes/home.tsx")] satisfies RouteConfig;
```

明示的ルート設定方式を採用。現在はインデックスルート 1 つのみ。

### ルートレイアウト (src/root.tsx)

エクスポート:

| エクスポート    | 役割                                                  |
| --------------- | ----------------------------------------------------- |
| `links`         | Google Fonts（Inter）の preconnect / stylesheet       |
| `Layout`        | HTML 構造（`<Meta>`, `<Links>`, `<Scripts>`, `<ScrollRestoration>`） |
| `App`（default）| `<Outlet />` でルートコンテンツを描画                 |
| `ErrorBoundary` | 404 / エラーページの表示                              |

### 型生成

`react-router typegen` コマンドで `.react-router/types/` に型定義が自動生成される:

```
.react-router/types/
└── src/
    ├── +types/root.ts          — ルートレイアウト用型
    └── routes/+types/home.ts   — ホームルート用型
```

## Vite

### 設定 (vite.config.ts)

```typescript
export default defineConfig({
  server: {
    port: 3000,
  },
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [reactRouter()],
});
```

| 設定                       | 役割                                               |
| -------------------------- | -------------------------------------------------- |
| `reactRouter()` プラグイン | React Router バンドル・SSR                         |
| `resolve.tsconfigPaths`    | tsconfig のパスエイリアス解決（Vite 8 ネイティブ） |

### 開発サーバー

```bash
pnpm dev --filter=web    # port 3000 で起動
```

HMR・React Router 統合・TypeScript パスエイリアスが有効。

## CSS

### グローバルスタイル (src/app.css)

```css
html,
body {
  font-family:
    "Inter", ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji",
    "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
  margin: 0;
  padding: 0;
}

@media (prefers-color-scheme: dark) {
  html {
    color-scheme: dark;
    background-color: #030712;
  }
}
```

- プレーン CSS（CSS フレームワークなし）
- カスタムフォント（Inter）を定義
- ダークモード対応（`prefers-color-scheme: dark`）

## TypeScript

### 設定 (tsconfig.json)

```json
{
  "extends": "@fandhe-ai/shared-config-typescript/react-router",
  "compilerOptions": {
    "rootDirs": [".", "./.react-router/types"],
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

- 共有設定 `react-router.json` を継承（strict + ES2022 + react-jsx）
- `@/*` パスエイリアスで `src/` 内のモジュールを参照可能
- `.react-router/types` を rootDirs に含めて型生成ファイルを認識

## ビルドとデプロイ

### ビルド

```bash
pnpm build --filter=web
```

出力先: `apps/web/build/`

- `build/client/` — 静的アセット（JavaScript, CSS）
- `build/server/` — Node.js サーバーエントリ（`index.js`）

### 本番起動

```bash
react-router-serve ./build/server/index.js
```

### 依存関係

| 種別         | パッケージ                                                |
| ------------ | --------------------------------------------------------- |
| dependencies | `react`, `react-dom`, `react-router`, `@react-router/node`, `@react-router/serve`, `@chakra-ui/react`, `@emotion/react`, `@emotion/cache`, `@emotion/server`, `@supabase/ssr`, `@supabase/supabase-js`, `isbot`, `next-themes`, `react-icons` |
| devDependencies | `@react-router/dev`, `vite`, `vitest`, `@vitest/coverage-v8`, `typescript`, `@types/node`, `@types/react`, `@types/react-dom`, `@testing-library/react`, `@fandhe-ai/shared-config-typescript`, `@fandhe-ai/shared-config-vitest` |

### npm scripts

| スクリプト    | コマンド                                      |
| ------------- | --------------------------------------------- |
| `dev`         | `react-router dev`                            |
| `build`       | `react-router build`                          |
| `start`       | `react-router-serve ./build/server/index.js`  |
| `check-types` | `react-router typegen && tsc --noEmit`        |
| `lint`        | `biome check .`                               |
| `test`        | `vitest run`                                  |
| `test:watch`  | `vitest --watch`                              |
