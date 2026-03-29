# Claude Code 構成ガイド

本プロジェクトにおける Claude Code の設定・エージェント・スキル・MCP サーバーの全体像をまとめたドキュメント。

## ディレクトリ構成

```text
.claude/
├── settings.json                # Hooks 設定（自動フォーマット・通知等）
├── agents/                      # カスタムエージェント定義
│   ├── code-reviewer.md
│   ├── component-analyzer.md
│   ├── figma-analyzer.md
│   ├── plan-verifier.md
│   ├── playwright-tester.md
│   ├── refactor-cleaner.md
│   ├── reference-researcher.md
│   ├── security-auditor.md
│   └── sub-investigator.md
├── rules/                       # 操作ルール
│   └── dotclaude-via-temp.md
└── skills/                      # ローカルスキル
    ├── create-component/SKILL.md
    ├── create-slice/SKILL.md
    ├── dotclaude-writer/SKILL.md
    ├── tdd/SKILL.md
    └── update-docs/SKILL.md

.agents/skills/                  # リファレンススキルライブラリ（33 スキル）
.mcp.json                        # MCP サーバー設定
skills-lock.json                 # スキルバージョンロック
```

## ドキュメント一覧

| ファイル               | 内容                                                 |
| ---------------------- | ---------------------------------------------------- |
| [agents.md](agents.md) | 9 つのカスタムエージェントの役割・モデル・利用場面   |
| [skills.md](skills.md) | ローカルスキル 5 つ + リファレンススキル 33 個の一覧 |
| [mcp.md](mcp.md)       | MCP サーバー（Figma / Playwright / Chakra UI）の構成 |
| [rules.md](rules.md)   | `.claude/` ディレクトリ操作ルールと運用規約          |
| [hooks.md](hooks.md)   | Hooks 設定（自動フォーマット・通知・セッション開始） |

## スキルソース

スキルは 3 つのソースから提供される（`skills-lock.json` で管理）:

| ソース                             | 種別                     | 主なスキル                                                            |
| ---------------------------------- | ------------------------ | --------------------------------------------------------------------- |
| `Fandhe-AI/agent-reference-skills` | ライブラリリファレンス   | chakra-ui, react-router-v7, vitest, zod, supabase 等                  |
| `figma/mcp-server-guide`           | デザイン連携             | code-connect-components, implement-design, create-design-system-rules |
| `vercel-labs/agent-skills`         | デプロイ・パフォーマンス | deploy-to-vercel, vercel-react-best-practices, web-design-guidelines  |
