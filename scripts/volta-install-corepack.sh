#!/usr/bin/env bash
# Volta で corepack を導入し、corepack / pnpm を有効化する（`make volta-install-corepack`）。
set -euo pipefail
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=./lib.sh
source "${DIR}/lib.sh"

reject_args "$(basename "$0")" "$@"

volta install corepack
corepack enable
corepack enable pnpm
