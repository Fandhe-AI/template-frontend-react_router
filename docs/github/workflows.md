# CI ワークフロー

1 つのワークフローで PR の品質を検証する。

## check-pr.yml — PR チェック

全 PR で実行。main ブランチ向け PR では追加の品質チェックとビルドも行う。

### トリガー

```yaml
on:
  pull_request:
```

### 共通設定

- **権限**: `contents: read`
- **並行制御**: `workflow × head_ref` でグループ化、同一グループの実行中ジョブはキャンセル

### ジョブ構成

```
── 全 PR 共通（軽量チェック） ──────────────
reviewdog      … Biome の検出結果を PR コメントで通知
editorconfig   … EditorConfig 準拠をチェック
commitlint     … コミットメッセージを Conventional Commits で検証

── main 向け PR のみ（if: github.base_ref == 'main'） ──
lint           ─┐
check-types    ─┤
knip           ─┼─ コード品質チェック（並列実行）
syncpack       ─┤
test           ─┤
test-e2e       ─┤
storybook-build─┘
                │
              build ─── ビルド（品質チェック全通過後）
```

### 軽量チェック（全 PR）

| ジョブ         | 内容                                      | セットアップ |
| -------------- | ----------------------------------------- | ------------ |
| `reviewdog`    | Biome の検出結果を PR コメントで通知      | 不要         |
| `editorconfig` | EditorConfig 準拠をチェック               | 不要         |
| `commitlint`   | PR 内のコミットメッセージを Conventional Commits 形式で検証 | 要（pnpm + deps） |

### コード品質チェック（main 向け PR のみ・並列）

| ジョブ             | 内容                                 | コマンド                                    |
| ------------------ | ------------------------------------ | ------------------------------------------- |
| `lint`             | Biome による lint & format チェック   | `pnpm lint`                                 |
| `check-types`      | TypeScript 型チェック                | `pnpm check-types`                          |
| `knip`             | 未使用コード・依存関係の検出         | `pnpm knip`                                 |
| `syncpack`         | 依存バージョン一貫性チェック         | `pnpm package:lint` + `pnpm package:format` |
| `test`             | ユニット/統合テスト実行              | `pnpm test:coverage`                        |
| `test-e2e`         | E2E テスト実行（Playwright）         | `pnpm test:e2e`                             |
| `storybook-build`  | Storybook ビルド検証                 | `pnpm storybook:build`                      |

`test` ジョブでは `davelosert/vitest-coverage-report-action@v2` で PR コメントにカバレッジサマリーを自動投稿する。

各ジョブの共通ステップ:

```yaml
steps:
  - uses: actions/checkout@v5
  - uses: ./.github/actions/setup-pnpm
  - uses: ./.github/actions/install-deps
  - run: <チェックコマンド>
```

### ビルドジョブ（main 向け PR のみ）

すべての品質チェックジョブが成功した場合のみ実行:

```yaml
build:
  needs: [lint, check-types, knip, syncpack, test, test-e2e, storybook-build]
  steps:
    - uses: actions/checkout@v5
    - uses: ./.github/actions/setup-pnpm
    - uses: ./.github/actions/install-deps
    - uses: ./.github/actions/build-app
```
