# MCP サーバー構成

`.mcp.json` で定義された 3 つの MCP（Model Context Protocol）サーバー。Claude Code に外部ツールとの連携機能を提供する。

## サーバー一覧

| サーバー                        | 種別         | 用途                                         |
| ------------------------------- | ------------ | -------------------------------------------- |
| [figma-desktop](#figma-desktop) | HTTP         | Figma デザインの読み取り・分析               |
| [playwright](#playwright)       | stdio（npx） | ブラウザ操作・E2E テスト・スクリーンショット |
| [chakra-ui](#chakra-ui)         | stdio（npx） | Chakra UI コンポーネント情報・テーマ取得     |

## figma-desktop

```json
{
  "type": "http",
  "url": "http://127.0.0.1:3845/mcp"
}
```

- **接続方式**: HTTP（ローカルの Figma Desktop アプリ経由）
- **前提**: Figma Desktop が起動している必要がある
- **提供ツール**:
  - `get_design_context` — デザインのコンテキスト情報を取得
  - `get_screenshot` — デザインのスクリーンショットを取得
  - `get_metadata` — メタデータ（コンポーネント名、プロパティ等）を取得
  - `get_variable_defs` — デザイン変数の定義を取得
- **利用エージェント**: figma-analyzer

## playwright

```json
{
  "command": "npx",
  "args": [
    "@playwright/mcp@0.0.68",
    "--browser",
    "chromium",
    "--user-data-dir=./_/playwright/profile",
    "--output-dir=./_/playwright/output"
  ]
}
```

- **接続方式**: stdio（npx で起動）
- **ブラウザ**: Chromium
- **プロファイル**: `./_/playwright/profile` に永続化
- **出力ディレクトリ**: `./_/playwright/output`（スナップショット・コンソールログ・ネットワークログ）
- **提供ツール**:
  - `browser_navigate` — URL へ移動
  - `browser_click` / `browser_hover` — 要素操作
  - `browser_fill_form` / `browser_type` — フォーム入力
  - `browser_take_screenshot` / `browser_snapshot` — 画面キャプチャ
  - `browser_resize` — ビューポートサイズ変更
  - `browser_evaluate` — JavaScript 実行
  - `browser_console_messages` / `browser_network_requests` — デバッグ情報
  - `browser_wait_for` — 要素待機
  - `browser_tabs` / `browser_close` — タブ管理
- **利用エージェント**: playwright-tester

## chakra-ui

```json
{
  "command": "npx",
  "args": ["-y", "@chakra-ui/react-mcp@2.1.1"],
  "env": {
    "CHAKRA_PRO_API_KEY": "${CHAKRA_PRO_API_KEY}"
  }
}
```

- **接続方式**: stdio（npx で起動）
- **認証**: `CHAKRA_PRO_API_KEY` 環境変数が必要
- **提供ツール**:
  - `list_components` — コンポーネント一覧
  - `get_component_example` — コンポーネントの使用例
  - `get_component_props` — Props 定義
  - `get_component_templates` / `list_component_templates` — テンプレート
  - `get_theme` / `customize_theme` — テーマ情報
  - `installation` — セットアップ手順
  - `v2_to_v3_code_review` — v2 → v3 マイグレーションレビュー

## 必要な環境変数

| 変数                 | 用途                     |
| -------------------- | ------------------------ |
| `CHAKRA_PRO_API_KEY` | Chakra UI MCP の認証キー |
