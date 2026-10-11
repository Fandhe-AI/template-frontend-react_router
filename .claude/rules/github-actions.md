---
paths:
  - ".github/workflows/**"
  - ".github/actions/**"
---

# GitHub Actions 編集ルール

`.github/workflows/` と `.github/actions/` を編集する際の方針。目的はワークフロー数・ジョブ数・実行時間の最小化。

## runner 方針

- 本リポジトリは **public** のため GitHub-hosted（`ubuntu-latest`）を使う。全ジョブが該当し、例外は無い
- public で self-hosted を使うと fork PR 経由で任意コードが実行されるリスクがあるため使わない
- 将来 private 化した場合は組織方針に従い self-hosted へ切り替える（ラベルは他リポジトリの実物を確認する）

## 必須チェックと集約ジョブ

ruleset「Code Quality Copilot review for default branch」の required status checks（ジョブの `name` と一致させる）:

`Analyze (javascript-typescript)`（CodeQL） / `Biome (reviewdog)` / `Biome lint & format` / `Build` / `Commitlint` /
`E2E Test (Playwright)` / `EditorConfig` / `Knip (unused code)` / `Storybook build` /
`Syncpack (dependency consistency)` / `Test` / `TypeScript type check`

- 集約ジョブは無い。ジョブ名を変える・追加する場合は ruleset 側の更新が必要（ユーザー判断事項）
- branch protection は未設定（ruleset のみ）

## 発火条件の方針

- `check-pr.yml`: `pull_request`（`opened` / `synchronize` / `reopened` / `ready_for_review`）。draft ではスキップする
- `ci.yml`: `push` は `main` のみ。ドキュメント・エージェントスキルのみの変更は `paths-ignore`（必須チェック対象外のため可）
- 必須チェックを含む workflow には workflow 単位の `paths` を付けない（pending のまま永久にマージ不能になる）。
  `check-pr.yml` の `changes` ジョブでコード変更の有無を判定し、重いジョブは `needs: changes` + `if` で skipped にする（skipped は必須チェックで成功扱い）。
  `if` は `!cancelled()` を付け、`needs.changes.result != 'success' || needs.changes.outputs.code != 'false'` で判定する（判定ジョブ失敗時に必須ジョブが skipped で素通りしないよう fail-closed）。
  シェルでの判定に `printf | grep -q` を使わない（SIGPIPE + pipefail で誤判定する。here-string を使う）
- `concurrency`: PR は `group: ${{ github.workflow }}-${{ github.head_ref }}` + `cancel-in-progress: true`、main への push は cancel しない
- `schedule` は `update-external.yml` の日次 1 回のみ。頻度を増やさない

## ジョブ・ワークフロー追加のチェックリスト

- 新規ワークフローを増やさず、既存の `check-pr.yml` / `ci.yml` へのジョブ追加を優先する
- 必須にするジョブは ruleset の required checks へ追加が必要（ユーザー判断事項として報告する）
- 不要な `needs` を作らない（独立ジョブは並列に走らせる）。`Build` も独立
- セットアップは `.github/actions/setup-pnpm` / `install-deps` を使い、`fetch-depth` は必要時のみ（`commitlint` のみ 0）
- 公式 action は既存方針に合わせて SHA ピン（`# vX.Y.Z` コメント付き）。composite action 内は tag 指定
- CI 独自にロジックを書かず、`pnpm` scripts / `scripts/` の共通コマンドを呼ぶ
- lefthook と検査を重複させない（`.claude/rules/git-hooks.md` 参照）
- 変更後は `actionlint` を通す

## 計測方法

```bash
gh run list --workflow <file> --limit 30 --json databaseId,conclusion,createdAt,updatedAt,event
gh run view <id> --json jobs
```

## 棚卸し結果（2026-10-11）

| ワークフロー | 直近 30 件の中央値 / 最大 | 備考 |
| --- | --- | --- |
| `check-pr.yml` | 94 秒 / 210 秒 | 1 回 11 ジョブ。`Build` が全ジョブ待ちで直列だった |
| `ci.yml` | 114 秒 / 870 秒 | 1 回 9 ジョブ |
| `update-external.yml` | 34 秒 / 70 秒 | 日次 schedule |
