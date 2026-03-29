# テスト戦略

3 層のテスト戦略で品質を担保する。

## テスト層

```
Unit / Integration テスト (Vitest)
  ├── 純粋関数・ユーティリティ         … Unit
  ├── React コンポーネント・hooks      … Unit / Integration
  └── API 連携・データフェッチ          … Integration

UI カタログ (Storybook)
  └── コンポーネントの視覚的確認・ドキュメント

E2E テスト (Playwright)
  └── ユーザーフロー全体の検証
```

## Vitest

### 設定構成

パッケージレベルキャッシング方式を採用（ルートの Workspace Mode は廃止）。各パッケージが独立して `vitest run` を実行し、Turborepo がキャッシュを管理する。

| ファイル | 役割 |
| --- | --- |
| `apps/*/vitest.config.ts` | アプリ固有設定（共有設定を継承） |
| `packages/<layer>/*/vitest.config.ts` | FSD スライス固有設定（共有設定を継承） |
| `@repo/shared-config-vitest/base` | 共有設定テンプレート |
| `apps/vitest/` | テスト結果の集約・レポート生成・閲覧 |

### 共有設定 (`@repo/shared-config-vitest/base`)

| オプション | 値 |
| --- | --- |
| `globals` | `true` |
| `environment` | `happy-dom` |
| `include` | `src/**/*.test.{ts,tsx}`, `src/**/*.spec.{ts,tsx}` |
| `exclude` | `node_modules`, `dist`, `build` |
| `passWithNoTests` | `true` |
| `reporters` | `default`, `blob` |
| `outputFile.blob` | `./test-results/results.blob` |
| `coverage.provider` | `v8`（`@vitest/coverage-v8`） |
| `coverage.reporter` | `text`, `json-summary`, `json` |
| `coverage.reportOnFailure` | `true` |

### レポート集約 (`apps/vitest`)

各パッケージのテスト結果（blob ファイル）を収集し、統合レポートを生成する。

| スクリプト | 役割 |
| --- | --- |
| `collect-blobs` | 各パッケージの `test-results/results.blob` を `blob-inputs/` に収集 |
| `collect-coverage` | 各パッケージの `coverage/` JSON を `apps/vitest/coverage/` に集約（CI 用） |
| `merge-reports` | blob を統合し JSON + HTML レポートを `reports/` に生成 |
| `vitest` | `vite preview` で HTML レポートをブラウザ表示 |

タスクチェーンは `apps/vitest/turbo.json` で定義: `collect-blobs` → `merge-reports` → `vitest`

### テストファイル配置

コロケーション方式 — テストファイルは実装ファイルの隣に配置する:

```
packages/<layer>/<slice>/src/
├── ui/
│   ├── login-form/
│   │   ├── index.tsx
│   │   ├── index.test.tsx      # コンポーネントテスト
│   │   └── index.stories.tsx   # Storybook stories
│   └── ...
├── model/
│   ├── use-auth.ts
│   └── use-auth.test.ts        # hooks テスト
└── lib/
    ├── validate-email.ts
    └── validate-email.test.ts  # ユーティリティテスト
```

### コマンド

```bash
pnpm test                                          # 全テスト実行（Turborepo キャッシュ有効）
pnpm test:coverage                                 # カバレッジ付きテスト実行
pnpm test --filter=@repo/<package>                 # 特定パッケージ
pnpm test --filter=@repo/<package> -- --run <file> # 特定ファイル
pnpm vitest                                        # テスト実行 + HTML レポート表示
```

## Storybook

### 設定構成

| ファイル | 役割 |
| --- | --- |
| `apps/storybook/.storybook/main.ts` | Storybook メイン設定 |
| `apps/storybook/.storybook/preview.ts` | プレビュー設定 |
| `@repo/shared-config-storybook/base` | 共有パラメータ（viewport 等） |

### Stories パターン

```typescript
// main.ts
stories: [
  "../../../apps/**/src/**/*.stories.@(ts|tsx)",
  "../../../packages/**/src/**/*.stories.@(ts|tsx)",
]
```

`apps/` と `packages/` 配下の全 `.stories.ts` / `.stories.tsx` を自動検出する。

### ビューポートプリセット

| プリセット | 幅 x 高さ |
| --- | --- |
| Mobile | 375 x 667 |
| Tablet | 768 x 1024 |
| Desktop | 1280 x 800 |

### コマンド

```bash
pnpm storybook                # 開発サーバー（port 6006）
pnpm storybook:build          # 静的ビルド
```

## Playwright

### 設定構成

| ファイル | 役割 |
| --- | --- |
| `apps/playwright/playwright.config.ts` | Playwright メイン設定 |
| `@repo/shared-config-playwright/base` | 共有設定テンプレート |

### 共有設定 (`@repo/shared-config-playwright`)

| オプション | 値 |
| --- | --- |
| ブラウザ | Chromium のみ |
| リトライ | CI: 2 回、ローカル: 0 回 |
| レポーター | HTML + JUnit + List |
| トレース | 初回リトライ時に記録 |
| スクリーンショット | 失敗時のみ |
| 並列実行 | `false`（シングルワーカー） |

### テストファイル配置

Page Object パターンを採用:

```
apps/playwright/src/
├── tests/            # テストファイル（*.spec.ts）
│   └── example.spec.ts
└── pages/            # Page Object
    └── example.page.ts
```

### コマンド

```bash
pnpm test:e2e                                        # 全 E2E テスト
pnpm --filter=playwright test:debug            # デバッグモード
pnpm --filter=playwright test:ui               # UI モード
```

## TDD ワークフロー

`/tdd` スキルで Red-Green-Refactor サイクルによるテスト駆動開発が可能。

### サイクル

1. **Red** — 失敗するテストを先に書く
2. **Green** — テストを通す最小限の実装を書く
3. **Refactor** — テストが通る状態を維持しつつコードを改善する

### FSD レイヤー別テスト戦略

| レイヤー | テスト種別 | 対象 | 優先度 |
| --- | --- | --- | --- |
| `shared/` | Unit | ユーティリティ、ヘルパー、型ガード、バリデーション | 高 |
| `entities/` | Unit | モデル、バリデーション、データ変換 | 高 |
| `features/` | Unit + Integration | ビジネスロジック、hooks、フォーム処理 | 高 |
| `widgets/` | Integration | コンポーネント結合、状態の流れ | 中 |
| `pages/` | Integration + E2E | ページ全体の動作、ルーティング | 中 |
| `apps/web/` | E2E | ユーザーフロー全体 | 低（重要フローのみ） |

## CI / ローカル統合

### Lefthook（ローカル）

| フック | ジョブ | コマンド |
| --- | --- | --- |
| pre-push | `test` | `pnpm run test` |

### GitHub Actions（CI）

`check-pr.yml` で以下を並列実行:

| ジョブ | コマンド |
| --- | --- |
| `test` | `pnpm test:coverage` + `collect-coverage`（カバレッジ集約） |
| `storybook-build` | `pnpm storybook:build` |

`test` ジョブでは `davelosert/vitest-coverage-report-action@v2` で PR コメントにカバレッジサマリーを自動投稿する。

両ジョブが成功した場合のみ `build` ジョブが実行される。
