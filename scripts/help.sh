#!/usr/bin/env bash
# Make を介さない操作一覧。`make help` は Makefile の `## ` コメントから
# 機械的に生成されるのに対し、本ファイルは手動で保守する一覧であり、
# 両者を自動で同期する仕組みは無い。Makefile のターゲットを追加・改名・
# 削除したら同じ変更で本ファイルも更新すること。
set -euo pipefail
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=./lib.sh
source "${DIR}/lib.sh"

reject_args "$(basename "$0")" "$@"

cat <<'EOT'
このリポジトリの操作と、Make を使わずに直接実行する方法:

  help                     scripts/help.sh                  この一覧を表示する
  setup                    （下記の setup-* / volta-* を順に実行）
  setup-submodules         git submodule update --init --recursive
  update-submodules        git submodule update --remote --recursive
  setup-env                scripts/setup-env.sh             .env.example から .env を生成（バックアップ付き）
  setup-direnv             scripts/setup-direnv.sh          direnv があれば direnv allow
  setup-volta              volta-setup と volta-install を実行
  setup-pnpm               pnpm install
  setup-playwright         pnpm --dir apps/playwright exec playwright install --with-deps
  setup-lefthook           pnpm exec lefthook install
  volta-setup              scripts/volta-setup.sh           Volta が未導入なら導入
  volta-install            volta-install-node と volta-install-corepack を実行
  volta-install-node       volta install node@24.13.0
  volta-install-corepack   scripts/volta-install-corepack.sh

`make <target>` は上記と同じコマンドを呼ぶだけの薄い入口であり、
複数行の処理の定義は scripts/ 側にのみ存在する。
EOT
