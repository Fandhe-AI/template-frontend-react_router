---
paths:
  - "lefthook.yml"
---

# Git hooks（lefthook）編集ルール

`lefthook.yml` を編集する際の方針。フックは staged 限定で一瞬で終わる検査とコミット単位でしか意味がない検査に限り、
型チェック・テスト・ビルド・全体 lint や CI と重複する検査は GitHub Actions に置く。

## 目的

フックはコミット・push のたびに実行されるため、遅いフックはそのまま開発速度の低下になる。
フックはローカルでの早期検知専用であり、CI の代替ではない。**開発速度を落とさないことを最優先**し、
重い検査・網羅的な検査は CI に任せる。

| ワークフロー | トリガー | 品質チェックのジョブ |
| --- | --- | --- |
| `.github/workflows/check-pr.yml`（PR チェック） | 全 PR | `reviewdog` / `editorconfig` / `commitlint` |
| 同上 | main 向け PR のみ（`if: github.base_ref == 'main'`） | `lint` / `check-types` / `knip` / `syncpack` / `test` / `test-e2e` / `storybook-build` → `build` |
| `.github/workflows/ci.yml`（CI） | main への push | `editorconfig` / `lint` / `check-types` / `knip` / `syncpack` / `test` / `test-e2e` / `storybook-build` → `build` |

main 以外をベースにした PR では `lint` 以下の品質チェックが走らないが、main へのマージ前（main 向け PR）と
マージ後（`ci.yml`）で必ず実行されるため、フックで補わない。

## 時間予算

| フック | 予算 | 判定方法 |
| --- | --- | --- |
| pre-commit | 全ジョブ合計 1 秒未満 | `lefthook run pre-commit --all-files` の `summary: (done in N seconds)` |
| commit-msg | 1 秒未満（ネットワーク不可） | 実コミット時に表示される commit-msg の summary（メッセージファイルを引数に取るため `--all-files` では計測しない） |
| pre-push・post-checkout・post-merge 等 | 原則追加しない | 追加する場合は理由と実測値を PR 本文に記載する |

`--all-files` は全追跡ファイルを対象にする最悪ケースであり、実際のコミット（staged のみ）はこれより速い。

## フックに置かないもの（→ CI へ）

- テスト（`pnpm test` / `pnpm test:e2e`）・ビルド（`pnpm build` / `pnpm storybook:build`）・型チェック（`pnpm check-types`）
- リポジトリ全体を走査する検査（`pnpm lint`・`pnpm knip`・`pnpm package:lint`・`pnpm package:format` 等）
- 依存パッケージのインストール・ネットワークアクセス
- `check-pr.yml` / `ci.yml` のジョブと同じコマンドを同じ範囲で実行するもの

## フックに置いてよいもの

- `{staged_files}` に限定し、`glob` で対象を絞った 1 秒未満の検査
- CI ではコミット単位で検知できない、または push 後では遅いもの

### 明示的な例外

以下は CI と重複するが、時間予算内に収まるため維持する（2026-10-11 計測・決定）。

- pre-commit の `biome check`: CI の `lint`（`pnpm lint`）・`reviewdog` と重複するが、staged ファイル限定で
  `--all-files` でも 0.2 秒程度のため維持する
- commit-msg の `commitlint`: `check-pr.yml` の `commitlint` ジョブと重複するが、push 後に検知すると
  履歴の書き換えが必要になるため維持する（1 回 0.3 秒程度）

## 手元で CI 相当を確認したい場合

ローカルで品質を確認する規約自体は変わらず、フックで強制しないだけである。push 前に CI 相当を確認したい場合は
以下を手動で実行する。

```bash
pnpm lint && pnpm check-types && pnpm knip && pnpm package:lint && pnpm package:format && pnpm test
```

E2E・ビルドまで確認する場合は `pnpm test:e2e` / `pnpm storybook:build` / `pnpm build` も実行する。

## 書き方の規約

- 既存の書式（pre-commit は `jobs`、commit-msg は `commands`）を維持する
- `pre-commit` の `parallel: true` を維持する（直列化しない）
- `{staged_files}` と `glob` で対象を絞る
- 条件付き実行が必要な場合は lefthook の `skip` / `only` を使ってよい

## 検査を追加するときの判断手順

1. その検査は `check-pr.yml` / `ci.yml` で既に実施されているか
    - 実施済みで、staged 限定にしても 1 秒以上かかる → フックに入れない
2. staged ファイルに限定できるか
    - できない → CI へ置く
3. CI へ置く場合は `check-pr.yml` と `ci.yml` の両方にジョブを追加し、ビルドの前提にする場合は `build` ジョブの `needs` にも追加する
    - pnpm・Node.js のセットアップは既存ジョブと同じく `./.github/actions/setup-pnpm` / `./.github/actions/install-deps` を使う
4. 編集後に以下を実行し、summary の合計時間をユーザーへ報告する（1 秒以上なら構成を見直す）

```bash
time lefthook run pre-commit --all-files
```

## バイパス禁止

遅いからといって `--no-verify` や `LEFTHOOK=0` で回避しない。遅いフックはフック側を直す
（検査を CI へ移す・staged 限定にする・対象 glob を絞る）。
