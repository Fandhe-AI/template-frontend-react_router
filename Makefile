setup: setup-env setup-volta setup-pnpm setup-playwright setup-lefthook

setup-env:
	@find apps packages -name '.env.example' | while read example; do \
		env_file="$${example%.example}"; \
		if [ ! -f "$$env_file" ]; then \
			cp "$$example" "$$env_file"; \
			echo "$$env_file を作成しました"; \
		elif [ "$$env_file" -nt "$$example" ]; then \
			echo "$$env_file は最新です（スキップ）"; \
		else \
			timestamp=$$(date +%Y%m%d-%H%M); \
			mv "$$env_file" "$$env_file.$$timestamp"; \
			cp "$$example" "$$env_file"; \
			echo "$$env_file が古いため、$$env_file.$$timestamp にバックアップし、新しい $$env_file を作成しました"; \
		fi; \
	done

setup-volta: volta-setup volta-install

setup-pnpm:
	pnpm install

setup-playwright:
	cd apps/playwright && pnpm exec playwright install --with-deps && cd ../..

setup-lefthook:
	pnpm exec lefthook install

volta-setup:
	@if ! command -v volta >/dev/null 2>&1; then \
		if command -v brew >/dev/null 2>&1; then \
			brew install volta; \
		else \
			curl https://get.volta.sh | bash; \
		fi; \
		volta setup; \
		echo "volta をインストールしました"; \
	else \
		echo "volta は既にインストールされています"; \
	fi

volta-install: volta-install-node volta-install-corepack

volta-install-node:
	volta install node@24.13.0

volta-install-corepack:
	volta install corepack
	corepack enable
	corepack enable pnpm
