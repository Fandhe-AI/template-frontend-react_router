#!/usr/bin/env bash
# direnv があれば `direnv allow .` を実行する（`make setup-direnv`）。無ければスキップして成功終了する。
set -euo pipefail
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=./lib.sh
source "${DIR}/lib.sh"

reject_args "$(basename "$0")" "$@"

cd "${ROOT_DIR}"

if command -v direnv >/dev/null 2>&1; then
  direnv allow .
  echo "direnv allow を実行しました"
else
  echo "direnv が見つからないため、direnv allow をスキップしました"
fi
