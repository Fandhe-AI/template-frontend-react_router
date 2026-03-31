# セットアップガイド

本テンプレートの各サービス・ツールのセットアップ手順をまとめたドキュメント。

## 基本セットアップ

リポジトリルートで以下を実行すると、開発に必要な基本セットアップが完了します:

```sh
make setup
```

このコマンドは以下を実行します:

1. Git Submodules の初期化（`packages/shared/config-*` パッケージ）
1. `.env.example` から `.env` を生成
1. Volta のインストール（Node バージョン管理）
1. `pnpm install`（依存パッケージのインストール）
1. Playwright ブラウザのインストール
1. Lefthook（Git hooks）のインストール

### Submodules の更新

共有設定パッケージを最新に更新する場合:

```sh
make update-submodules
```

## 個別セットアップガイド

| ファイル | 内容 |
| --- | --- |
| [vercel.md](vercel.md) | Vercel へのデプロイセットアップ |
| [supabase.md](supabase.md) | Supabase のローカル開発・本番接続セットアップ |
| [remove-supabase.md](remove-supabase.md) | Supabase を使わない場合の削除手順 |
| [chakra-ui-mcp.md](chakra-ui-mcp.md) | Chakra UI MCP サーバーの API キーセットアップ |
