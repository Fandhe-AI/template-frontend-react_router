# 開発ガイド

Claude Code を使ったバイブコーディングの開発ワークフローガイド。

本テンプレートは Claude Code のスキル・エージェントと組み合わせて、計画 → 実装 → レビュー → PR のサイクルを効率的に回せるよう設計されています。

## ドキュメント一覧

| ファイル | 内容 |
| --- | --- |
| [workflow.md](workflow.md) | Claude Code を使った開発ワークフロー（計画 → Issue → 実装 → レビュー → PR） |

## ワークフロー概要

```text
/create-plan  →  /create-issue  →  ブランチ移動  →  /implement-issue
    │                                                      │
    │              ┌───────────────────────────────────────┘
    │              ▼
    │         /implement-review  →  /update-docs  →  /create-pr
    │              │
    │              ▼
    │         /implement-review-pr  →  マージ  →  次の Issue へ
    │
    └─── 繰り返し ──────────────────────────────────────────┘
```

詳細は [workflow.md](workflow.md) を参照してください。
