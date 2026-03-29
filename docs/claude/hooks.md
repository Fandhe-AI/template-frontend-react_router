# Hooks 設定

`.claude/settings.json` で定義された Hooks。Claude Code のイベントに応じてシェルコマンドを自動実行する。

## 一覧

| イベント                                                  | マッチャー       | 動作                                 |
| --------------------------------------------------------- | ---------------- | ------------------------------------ |
| [PostToolUse](#posttooluse--自動フォーマット)             | `Edit\|Write`    | Biome で自動フォーマット             |
| [Notification](#notification--デスクトップ通知)           | （全通知）       | macOS デスクトップ通知を表示         |
| [SessionStart](#sessionstart--セッション開始リマインダー) | （全セッション） | プロジェクト規約のリマインダーを出力 |

## PostToolUse — 自動フォーマット

```json
{
  "matcher": "Edit|Write",
  "hooks": [
    {
      "type": "command",
      "command": "jq -r '.tool_input.file_path // empty' | grep -E '\\.(js|ts|cjs|mjs|jsx|tsx|json|jsonc)$' | { read -r f; pnpm exec biome check --write --no-errors-on-unmatched --files-ignore-unknown=true \"$f\"; } 2>/dev/null || true"
    }
  ]
}
```

- **トリガー**: `Edit` または `Write` ツール使用後
- **対象拡張子**: `.js`, `.ts`, `.cjs`, `.mjs`, `.jsx`, `.tsx`, `.json`, `.jsonc`
- **動作**: 変更されたファイルに対して `pnpm exec biome check --write` を実行（lint + format）
- **エラー処理**: 対象外ファイルやエラー時はサイレントに無視（`2>/dev/null || true`）

## Notification — デスクトップ通知

```json
{
  "matcher": "",
  "hooks": [
    {
      "type": "command",
      "command": "osascript -e 'display notification \"Claude Code needs your attention\" with title \"Claude Code\"' 2>/dev/null || true"
    }
  ]
}
```

- **トリガー**: Claude Code がユーザーの注意を必要とするとき
- **動作**: macOS のネイティブ通知で「Claude Code needs your attention」を表示
- **エラー処理**: 通知送信失敗時はサイレントに無視（`2>/dev/null || true`）

## SessionStart — セッション開始リマインダー

```json
{
  "matcher": "",
  "hooks": [
    {
      "type": "command",
      "command": "echo 'Reminder: pnpm only. Biome for lint/format. Turborepo monorepo with FSD (apps/web, packages/pages, packages/widgets, packages/features, packages/entities, packages/shared/*). React Router v7 Framework Mode. Run commands from repo root.'"
    }
  ]
}
```

- **トリガー**: 新しいセッション開始時
- **動作**: プロジェクト規約のリマインダーを出力
- **リマインダー内容**:
  - パッケージマネージャーは **pnpm** のみ使用
  - **Biome** で lint / format
  - **Turborepo** モノレポ構成（FSD ワークスペース: `apps/web`, `packages/pages`, `packages/widgets`, `packages/features`, `packages/entities`, `packages/shared/*`）
  - **React Router v7 Framework Mode** を使用
  - コマンドは**リポジトリルート**から実行
