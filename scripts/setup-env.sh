#!/usr/bin/env bash
# apps/ と packages/ 配下の .env.example から .env を生成する（`make setup-env`）。
# .env が無ければ作成、.env.example より新しければスキップ、古ければバックアップして作り直す。
set -euo pipefail
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=./lib.sh
source "${DIR}/lib.sh"

reject_args "$(basename "$0")" "$@"

cd "${ROOT_DIR}"

find apps packages -name '.env.example' | while read -r example; do
  env_file="${example%.example}"
  if [ ! -f "${env_file}" ]; then
    cp "${example}" "${env_file}"
    echo "${env_file} を作成しました"
  elif [ "${env_file}" -nt "${example}" ]; then
    echo "${env_file} は最新です（スキップ）"
  else
    timestamp="$(date +%Y%m%d-%H%M)"
    mv "${env_file}" "${env_file}.${timestamp}"
    cp "${example}" "${env_file}"
    echo "${env_file} が古いため、${env_file}.${timestamp} にバックアップし、新しい ${env_file} を作成しました"
  fi
done
