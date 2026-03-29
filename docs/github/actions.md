# Composite Actions

ワークフロー内で再利用される共通ステップを Composite Actions として定義。

## setup-pnpm

pnpm と Node.js の環境構築、および依存キャッシュの設定を行う。

**パス**: `.github/actions/setup-pnpm/action.yml`

### 入力パラメータ

| パラメータ      | デフォルト | 説明                |
| --------------- | ---------- | ------------------- |
| `node-version`  | `24.13.0`  | Node.js バージョン  |
| `pnpm-version`  | `10.32.1`  | pnpm バージョン     |

### ステップ

| # | ステップ               | 内容                                                      |
|---|------------------------|-----------------------------------------------------------|
| 1 | Enable corepack        | `corepack enable` を実行                                  |
| 2 | Setup pnpm             | `pnpm/action-setup@v4` で pnpm をインストール             |
| 3 | Setup Node.js          | `actions/setup-node@v4` で Node.js をインストール         |
| 4 | Get pnpm store directory | `pnpm store path --silent` でストアパスを取得            |
| 5 | Setup pnpm cache       | pnpm ストアをキャッシュ（キー: `{OS}-pnpm-store-{lockfile hash}`） |
| 6 | Setup Turborepo cache  | `.turbo` ディレクトリをキャッシュ（キー: `{OS}-turbo-{git SHA}`）  |

### キャッシュ戦略

```
pnpm ストア:
  key:          {runner.os}-pnpm-store-{hash of pnpm-lock.yaml}
  restore-keys: {runner.os}-pnpm-store-

Turborepo:
  key:          {runner.os}-turbo-{github.sha}
  restore-keys: {runner.os}-turbo-
```

---

## install-deps

pnpm 依存関係のインストール。

**パス**: `.github/actions/install-deps/action.yml`

### ステップ

```bash
pnpm install --frozen-lockfile
```

`--frozen-lockfile` により、`pnpm-lock.yaml` と `package.json` の不一致があればエラーとなる。

---

## build-app

アプリケーションのビルドと、オプションでビルド成果物のアップロード。

**パス**: `.github/actions/build-app/action.yml`

### 入力パラメータ

| パラメータ          | デフォルト | 説明                             |
| ------------------- | ---------- | -------------------------------- |
| `upload-artifacts`  | `false`    | ビルド成果物をアップロードするか |

### ステップ

| # | ステップ                | 条件                              | 内容                                |
|---|-------------------------|-----------------------------------|-------------------------------------|
| 1 | Build application       | 常時                              | `pnpm build`                        |
| 2 | Upload build artifacts  | `upload-artifacts == 'true'` の時 | `apps/web/build` をアーティファクトとしてアップロード（保持期間: 1 日） |

### アーティファクト設定

```yaml
uses: actions/upload-artifact@v4
with:
  name: build-output
  path: apps/web/build
  retention-days: 1
```
