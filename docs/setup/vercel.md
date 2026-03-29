# Vercel セットアップ

本テンプレートを Vercel にデプロイするためのセットアップ手順。

## 前提条件

- [Vercel アカウント](https://vercel.com/signup)
- [Vercel CLI](https://vercel.com/docs/cli)（任意、Claude Code の `/deploy-to-vercel` スキルでも代用可）

## 手順

### 1. Vercel CLI のインストール（任意）

```sh
pnpm add -g vercel
```

### 2. Vercel プロジェクトの作成

```sh
vercel
```

初回実行時にプロジェクトの設定を求められます:

- **Framework Preset**: 自動検出されます（React Router）
- **Build Command**: `pnpm build --filter=web`
- **Output Directory**: `apps/web/build`
- **Install Command**: `pnpm install`

### 3. 環境変数の設定

Vercel のダッシュボードまたは CLI で環境変数を設定します:

```sh
# Supabase を使用する場合
vercel env add SUPABASE_URL
vercel env add SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY
```

`VITE_` プレフィックスの変数はクライアントサイドに公開されます。秘密情報には絶対に `VITE_` を付けないでください。

### 4. デプロイ

```sh
# プレビューデプロイ
vercel

# 本番デプロイ
vercel --prod
```

### Claude Code からのデプロイ

Claude Code の `/deploy-to-vercel` スキルを使うと、対話的にデプロイできます:

```text
/deploy-to-vercel
```

## モノレポ設定

Vercel はモノレポを自動検出しますが、以下の設定が必要な場合があります:

### Root Directory の設定

Vercel ダッシュボード → Settings → General → Root Directory を `apps/web` に設定します。

### Turborepo との連携

Vercel は Turborepo のリモートキャッシュをサポートしています:

1. Vercel ダッシュボードで Turborepo のリモートキャッシュを有効化
1. `turbo.json` の設定はそのまま利用可能

## トラブルシューティング

### ビルドエラー: 依存パッケージが見つからない

モノレポ構成では、ワークスペースパッケージのビルド順序が重要です。`turbo.json` の `build` タスクは `^build` 依存が設定されているため、`pnpm build` で正しい順序でビルドされます。

### 環境変数が反映されない

- Vercel ダッシュボードで環境変数を設定した後、再デプロイが必要です
- `VITE_` プレフィックスの変数はビルド時に埋め込まれるため、ランタイムでの変更は反映されません
