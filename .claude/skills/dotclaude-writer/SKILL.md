---
name: dotclaude-writer
description: |
  .claude/ ディレクトリ配下にファイルを安全に作成・編集するためのスキル。
  一時ディレクトリ _/dotclaude/ を経由して mv で配置する手順を提供する。
  dotclaude, .claude, rules, skills, agents, commands, settings
autoTrigger: true
triggerCondition: |
  .claude/ ディレクトリ配下にファイルを新規作成・編集・移動する操作が含まれる場合に自動トリガーする。
  他のスキル（create-plan 等）の実行中でも、.claude/ への書き込みが発生する場合にはこの手順に従うこと。
---

# .claude/ ディレクトリへの安全な書き込み手順

`.claude/` 配下のファイルを新規作成・編集する場合、**直接書き込まず** `_/dotclaude/` に一時作成してからまとめて `mv` で配置する。

## 必須ルール

- `.claude/` 配下に Write / Edit ツールで直接ファイルを作成・編集しない
- 必ず `_/dotclaude/` を経由する

## 操作フロー

### Step 1: 一時ディレクトリに作成

`_/dotclaude/` 配下に、最終配置先と同じディレクトリ構造を再現してファイルを作成・編集する。

```
# パスの対応
.claude/rules/foo.md       → _/dotclaude/rules/foo.md
.claude/skills/bar/SKILL.md → _/dotclaude/skills/bar/SKILL.md
.claude/agents/baz.md      → _/dotclaude/agents/baz.md
.claude/commands/qux.md    → _/dotclaude/commands/qux.md
.claude/settings.local.json → _/dotclaude/settings.local.json
.claude/CLAUDE.md          → _/dotclaude/CLAUDE.md
```

### Step 2: mv で配置

全ファイルの作成・編集が完了したら、まとめて `mv` で `.claude/` に移動する。

```bash
# 移動先ディレクトリが存在しない場合は事前に作成
mkdir -p .claude/skills/bar

# 単一ファイル
mv _/dotclaude/rules/foo.md .claude/rules/foo.md

# ディレクトリごと
mv _/dotclaude/skills/bar .claude/skills/bar
```

### Step 3: 後片付け

**`rm -rf _/dotclaude` は禁止。** 並行作業が `_/dotclaude/` を共有している可能性がある。

自分が作成・使用したサブディレクトリのみを削除し、`_/dotclaude/` が空になった場合のみディレクトリ自体を削除する。

```bash
# 自分が使ったサブディレクトリだけ削除
rm -rf _/dotclaude/rules/foo.md
rmdir _/dotclaude/rules 2>/dev/null  # 空なら削除、残っていれば無視

# _/dotclaude/ が空なら削除（中身があれば何もしない）
rmdir _/dotclaude 2>/dev/null
```

- `rm -rf _/dotclaude` は絶対に実行しない
- `rmdir` は空ディレクトリにのみ作用するため安全
- 並行作業のファイルを誤って削除するリスクがない

## 他スキルとの連携

他のスキル（create-plan, feature-sliced-design 等）の実行中に `.claude/` 配下のファイルを作成・編集する必要が生じた場合も、このフローに従うこと。
