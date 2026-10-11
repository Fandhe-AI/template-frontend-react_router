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
- キャッシュを追加・変更する場合は下の「キャッシュ方針」に従う
- CI 独自にロジックを書かず、`pnpm` scripts / `scripts/` の共通コマンドを呼ぶ
- lefthook と検査を重複させない（`.claude/rules/git-hooks.md` 参照）
- 変更後は `actionlint` を通す

## キャッシュ方針

- 前提: リポジトリのキャッシュ上限は 10GB（超過分は LRU で古いものから追い出し、7 日間アクセスの無いものは削除）。
  上限超過分の課金は Org の Actions 予算 $10（超過で停止）に含まれるため、上限を超える前提にしない。**10GB の中でヒット率を最大化する**ことを目的にする
- PR の実行が保存したキャッシュは `refs/pull/<n>/merge` スコープに入り、その PR 以外（main・他 PR）からは復元できない。
  **保存は main への push（`ci.yml`）のみ**とし、PR（`check-pr.yml`）は復元だけにする。`actions/cache` には `save-if` が無いため、
  `.github/actions/setup-pnpm` で main は `actions/cache`、それ以外は `actions/cache/restore` を同じキーで使い分けている。
  lockfile を変える PR（Dependabot 等）の 2 回目以降の push は main の旧キーから部分復元になり差分だけダウンロードする
- キーに `github.sha` 等の一意な値を入れる場合は、同じ用途の直近キャッシュへ `restore-keys` の前方一致で戻れるようにし、
  複数ジョブが同じキーを奪い合わないようにする（`.turbo` はジョブごとに実行タスクが違うため `github.job` をキーに含める）
- `hashFiles` に `**/` の再帰 glob を使わない。`.agents/skills/make/samples/**` のサンプル lockfile（`.claude/skills` の symlink 経由も）
  が混入し、依存が変わっていないのにスキル更新でキーが変わる。ルートの `pnpm-lock.yaml` を直接指定する（再帰が必要な場合は
  `'!.agents/**'`・`'!.claude/**'` で除外する）
- 効果の無いキャッシュは持たない。`.turbo` は turbo のタスクを実行するジョブ（`check-types`・`test`・`storybook-build`・`build`）
  だけ `turbo-cache: "true"` で有効にする（`lint`・`knip`・`syncpack`・`commitlint` は turbo を実行せず、`test:e2e` は turbo 側で
  `cache: false`）
- 計測:

    ```bash
    gh api --paginate "repos/Fandhe-AI/template-frontend-react_router/actions/caches?per_page=100" \
      --jq '.actions_caches[]|[.key,.size_in_bytes,.ref,.last_accessed_at]|@tsv'   # 一覧（ref で PR 由来の複製を確認）
    gh api repos/Fandhe-AI/template-frontend-react_router/actions/cache/usage      # 使用量
    gh run view <id> --log | grep -E "Cache restored from key|Cache not found|Cache saved with key|Cached: "
    ```

### 実測（2026-10-11・変更前）

- 使用量 0.55GB / 10GB（13 件）。追い出しによる miss は無し
- pnpm store（126MB/件）: 4 件のうち 2 件（252MB）は PR スコープの複製。PR の 2 回目以降の push は全ジョブ exact hit、
  lockfile 更新直後の main push は旧キーから部分復元
- `.turbo`（約 1.6MB/件）: 実行ごとに新キーで 1 件保存（9 件中 7 件が PR スコープ）。並列ジョブが同じキーを奪い合い、最初に
  終わったジョブ（Storybook build や Syncpack）の `.turbo` だけが保存されるため、turbo のタスクヒットは `storybook:build` の
  1/1 のみで、`build` 0/1・`test:coverage` 0/2・`check-types` 0/2 は毎回 miss していた
- pnpm store のキーが `hashFiles('**/pnpm-lock.yaml')` だったため、lockfile を変えていない #35（make スキルのサンプル追加）で
  キーが `d20a7b…` → `af05d5…` に変わり 126MB を再保存していた

### 実測（2026-10-11・変更後、#36 の PR 実行）

- pnpm store: ルートのみのキーは `d20a7b…` に戻り、9 ジョブとも main の既存キャッシュに exact hit。保存 0 件・
  `refs/pull/36/merge` のエントリ 0 件
- `.turbo`: 4 ジョブのみ復元を試み、新しいキー空間のため miss（main で各ジョブのキーが保存されるまで）。マージ後、
  同じジョブのキーから復元して turbo のタスクが `cached` になるかを確認し、ならなければ `.turbo` キャッシュを廃止する

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
