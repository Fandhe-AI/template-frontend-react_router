# 開発用 Makefile。変更時は .claude/rules/makefile.md に従うこと。
#
# Make は薄い入口であり、複数行・条件分岐・環境依存の処理は scripts/*.sh に置く
# （そのレシピは 1 行の呼び出しに限定し、ここで処理を二重定義しない）。
# pnpm / git / volta 等の 1 行で済むコマンドは直接書く。lint / test / build 等は pnpm scripts（turbo）が正本。
# Make を使わない場合の同等コマンドは scripts/help.sh を参照。
#
# GNU Make 3.81（macOS 標準）で動作する。3.82+ 専用機能（.ONESHELL・.RECIPEPREFIX 等）は使わない。
#
# 使い方: `make help`（既定ターゲット）でターゲット一覧を表示する。
# 一覧は下記の `## ` コメントから生成されるため、`## ` の無いターゲットは表示されない。
# ターゲットを追加・改名・削除したら scripts/help.sh も同じ変更で更新すること。

.DEFAULT_GOAL := help

# setup 系は順序依存（volta → pnpm → playwright / lefthook）のため、`make -j` でも直列に実行する。
# 旧 Makefile から存在した問題への最小修正（GNU Make 3.81 でも引数なしの .NOTPARALLEL は有効）。
.NOTPARALLEL:

.PHONY: help setup setup-submodules update-submodules setup-env setup-direnv \
	setup-volta setup-pnpm setup-playwright setup-lefthook \
	volta-setup volta-install volta-install-node volta-install-corepack

help: ## このヘルプを表示する（Make 非依存の一覧: scripts/help.sh）
	@awk 'BEGIN {FS = ":.*## "} /^[a-zA-Z0-9_-]+:.*## /{printf "  \033[36mmake %-24s\033[0m %s\n", $$1, $$2}' $(firstword $(MAKEFILE_LIST))

setup: setup-submodules setup-env setup-direnv setup-volta setup-pnpm setup-playwright setup-lefthook ## 初期セットアップ一式（submodules, env, direnv, volta, pnpm, playwright, lefthook）

setup-submodules: ## submodule を初期化・取得する
	git submodule update --init --recursive

update-submodules: ## 共有設定 submodules を最新に更新する
	git submodule update --remote --recursive

setup-env: ## .env.example から .env を生成する（バックアップ付き）。直接: scripts/setup-env.sh
	@scripts/setup-env.sh

setup-direnv: ## direnv があれば direnv allow を実行する。直接: scripts/setup-direnv.sh
	@scripts/setup-direnv.sh

setup-volta: volta-setup volta-install ## Volta を導入し Node / corepack を入れる

setup-pnpm: ## pnpm install を実行する
	pnpm install

setup-playwright: ## Playwright のブラウザを導入する
	pnpm --dir apps/playwright exec playwright install --with-deps

setup-lefthook: ## Git hooks（lefthook）を有効化する
	pnpm exec lefthook install

volta-setup: ## Volta が未導入なら導入する。直接: scripts/volta-setup.sh
	@scripts/volta-setup.sh

volta-install: volta-install-node volta-install-corepack ## Volta で Node と corepack を導入する

volta-install-node: ## Volta で Node を導入する
	volta install node@24.13.0

volta-install-corepack: ## Volta で corepack を導入し有効化する。直接: scripts/volta-install-corepack.sh
	@scripts/volta-install-corepack.sh
