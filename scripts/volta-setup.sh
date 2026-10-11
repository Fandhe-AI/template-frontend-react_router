#!/usr/bin/env bash
# Volta が未導入なら導入して `volta setup` を実行する（`make volta-setup`）。導入済みなら何もしない。
set -euo pipefail
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=./lib.sh
source "${DIR}/lib.sh"

reject_args "$(basename "$0")" "$@"

if command -v volta >/dev/null 2>&1; then
  echo "volta は既にインストールされています"
  exit 0
fi

if command -v brew >/dev/null 2>&1; then
  brew install volta
else
  curl https://get.volta.sh | bash
fi
volta setup
echo "volta をインストールしました"
