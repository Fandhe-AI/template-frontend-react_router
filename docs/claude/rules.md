# ルール・運用規約

Claude Code の動作を制御するルールと運用上の規約。

## .claude ディレクトリ操作ルール

**ファイル**: `.claude/rules/dotclaude-via-temp.md`
**適用対象**: `.claude/**/*` へのファイル操作

`.claude/` 配下のファイルを新規作成・編集する場合、直接書き込まず一時ディレクトリ `_/dotclaude/` を経由する。

### 操作フロー

1. `_/dotclaude/` 配下に、元のディレクトリ構造を再現してファイルを作成・編集する
2. 全ファイルの作成・編集が完了したら、まとめて `mv` で `.claude/` に移動する
3. 自分が作成したファイル・サブディレクトリのみ削除し、`_/dotclaude/` が空の場合のみ `rmdir` で削除する

### パスの対応例

| 最終配置先                    | 一時作成先                        |
| ----------------------------- | --------------------------------- |
| `.claude/rules/foo.md`        | `_/dotclaude/rules/foo.md`        |
| `.claude/skills/bar/SKILL.md` | `_/dotclaude/skills/bar/SKILL.md` |
| `.claude/agents/baz.md`       | `_/dotclaude/agents/baz.md`       |

### 移動コマンド例

```bash
# 単一ファイル
mv _/dotclaude/rules/foo.md .claude/rules/foo.md

# ディレクトリごと
mv _/dotclaude/skills/bar .claude/skills/bar

# 後片付け — 自分が使ったパスのみ削除
rm -rf _/dotclaude/rules/foo.md
rmdir _/dotclaude/rules 2>/dev/null   # 空なら削除
rmdir _/dotclaude 2>/dev/null         # 空なら削除
```

### 禁止事項

- **`rm -rf _/dotclaude` は禁止** — 並行作業が `_/dotclaude/` を共有している可能性がある
- 自分が作成したファイル・サブディレクトリのみ削除する

## dotclaude-writer スキル

**ファイル**: `.claude/skills/dotclaude-writer/SKILL.md`

上記ルールを自動適用するスキル。`.claude/` への書き込みが検出されると自動トリガーされる。他のスキル（`create-plan` 等）の実行中でも、`.claude/` への書き込みが発生する場合にはこの手順に従う。

## スキルソースの制約

リファレンススキル（`.agents/skills/`）の編集は `Fandhe-AI/agent-reference-skills` ソースのスキルのみ許可。他のソース（`figma/mcp-server-guide`, `vercel-labs/agent-skills`）のスキルは変更禁止。

## 一時ディレクトリ規約

| パス                    | 用途                                      | 管理方法                   |
| ----------------------- | ----------------------------------------- | -------------------------- |
| `_/dotclaude/`          | `.claude/` ファイルの一時作成先           | 手動 mv + rmdir            |
| `_/playwright/profile/` | Playwright ブラウザプロファイル           | MCP サーバーが自動管理     |
| `_/playwright/output/`  | Playwright 出力（ログ・スナップショット） | MCP サーバーが自動管理     |
| `_/local-plans/`        | 実装計画ファイル                          | `create-plan` スキルが作成 |
| `_/.last-update-docs`   | ドキュメント更新の追跡記録                | `update-docs` スキルが管理 |
