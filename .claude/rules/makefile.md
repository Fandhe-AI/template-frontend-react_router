---
paths:
  - "Makefile"
  - "scripts/**"
---

# Makefile / scripts 編集ルール

`Makefile` と `scripts/` を編集する際の方針。詳細は make skill（`.claude/skills/make`）を参照する。
`scripts/hooks/**` は存在しない場合を含め、フック関連は `.claude/rules/git-hooks.md` の担当とする。

## 基本方針

- Makefile は**薄い入口**。レシピは `@scripts/<name>.sh` の呼び出し、または `pnpm` / `git` / `volta` 等の言語ネイティブコマンドの **1 行**に限る
- 複数行・条件分岐（`if` / `for` / `while`）・環境依存の処理は `scripts/*.sh` に置く。Makefile に処理を二重定義しない
- lint / test / build は `package.json` の pnpm scripts（turbo）が正本。Makefile に同等ターゲットを複製しない
- 中身の無いターゲット（`@true` 等）は置かない。呼び出し元が終了コードを信用してしまう
- GNU Make 3.81（macOS 標準）互換。`.ONESHELL` / `.RECIPEPREFIX` 等 3.82+ 専用機能は使わない

## ターゲットの追加・改名・削除

1. `.PHONY` に追加（改名・削除なら更新）する
2. ターゲット行に `## 説明` コメントを付ける（`make help` はこのコメントから生成される）
3. `scripts/help.sh`（Make 非依存の一覧）を同じ変更で更新する
4. 呼び出し元を洗い出して更新する: `grep -rn "make " .github .claude docs README.md CLAUDE.md lefthook.yml scripts`
5. `make help` と `make -n <target>` で確認する

## scripts/ の規約

- 先頭は `#!/usr/bin/env bash` と `set -euo pipefail`、続けて `scripts/lib.sh` を `source` する
- 引数を取らないスクリプトは `reject_args` で未知の入力を終了コード 2 で拒否する
- 実行権限を付与する（`chmod +x`）。`shellcheck -x scripts/*.sh` を通す
- 説明コメントとユーザー向け出力は既存スクリプトに合わせて日本語、エラーは `lib.sh` の規約に従う
- cwd に依存しない。リポジトリルートは `ROOT_DIR` で解決する

## ターゲットの契約

| ターゲット | 契約 |
| --- | --- |
| `setup*` / `volta-*` | 再実行しても安全。`setup-env` は既存 `.env` を上書きせずバックアップする |
| `setup-direnv` | direnv が無ければスキップして成功終了する |
| `update-submodules` | submodule を最新へ更新する（差分が出るため実行後に確認する） |

`check` / `fix` / `clean` を追加する場合: `check` はソースを変更しない、`fix` のみが書き換える、
`clean` は再生成可能なディレクトリ（`node_modules` 等）に限り、共有・永続データを消さない。
