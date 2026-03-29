# Chakra UI MCP セットアップ

Claude Code で Chakra UI のコンポーネント情報・テーマデータ・テンプレートを利用するための MCP サーバーのセットアップ手順。

## 概要

Chakra UI MCP サーバーは、Claude Code に以下の機能を提供します:

- コンポーネント一覧・Props 定義の取得
- コンポーネントの使用例・テンプレートの取得
- テーマ情報の取得・カスタマイズ支援
- v2 → v3 マイグレーションレビュー

## セットアップ

### 1. API キーの取得

[Chakra UI Pro](https://www.chakra-ui.com/pro) にアクセスし、API キーを取得します。

無料プランでも基本的なコンポーネント情報は利用可能です。Pro テンプレートの取得には有料プランが必要です。

### 2. 環境変数の設定

リポジトリルートの `.env` ファイルに API キーを設定します:

```env
CHAKRA_PRO_API_KEY=your-api-key-here
```

`.env.example`（ルート）には空の `CHAKRA_PRO_API_KEY=` がプレースホルダとして用意されています。

### 3. 動作確認

Claude Code を起動し、Chakra UI MCP が利用可能であることを確認します:

```text
Chakra UI の Button コンポーネントの Props を教えて
```

正常に動作していれば、MCP サーバーを通じてコンポーネント情報が返されます。

## 設定ファイル

MCP サーバーの設定は `.mcp.json` に記述されています:

```json
{
  "chakra-ui": {
    "command": "npx",
    "args": ["-y", "@chakra-ui/react-mcp@2.1.1"],
    "env": {
      "CHAKRA_PRO_API_KEY": "${CHAKRA_PRO_API_KEY}"
    }
  }
}
```

- `${CHAKRA_PRO_API_KEY}` はルートの `.env` から読み込まれます
- バージョンは `.mcp.json` で固定されています

## 利用できるツール

| ツール | 説明 |
| --- | --- |
| `list_components` | 利用可能なコンポーネントの一覧 |
| `get_component_example` | コンポーネントの使用例 |
| `get_component_props` | Props の定義・型情報 |
| `get_component_templates` | Pro テンプレート |
| `list_component_templates` | テンプレート一覧 |
| `get_theme` | 現在のテーマ情報 |
| `customize_theme` | テーマのカスタマイズ支援 |
| `installation` | セットアップ手順 |
| `v2_to_v3_code_review` | v2 → v3 マイグレーションレビュー |

## API キーなしでの動作

API キーを設定しなくても MCP サーバーは起動しますが、一部の機能（Pro テンプレートの取得等）が制限されます。基本的なコンポーネント情報は API キーなしでも利用可能です。

## トラブルシューティング

### MCP サーバーが起動しない

`npx` が利用可能であることを確認してください:

```sh
npx --version
```

### API キーが認識されない

1. `.env` ファイルがリポジトリルートにあることを確認
1. Claude Code を再起動して環境変数を再読み込み
