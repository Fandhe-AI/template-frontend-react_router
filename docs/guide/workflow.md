# Claude Code を使った開発ワークフロー

Claude Code のスキルを活用して、計画から PR マージまでの開発サイクルを効率的に回す手順を説明します。

## 全体フロー

1. `/create-plan` で実装計画を作成
1. `/create-issue` で詳細なタスクに分解
1. Issue の作業ブランチに移動
1. `/implement-issue` でタスクを実行
1. `/implement-review` で実装をレビュー
1. `/update-docs` でドキュメントを更新
1. `/create-pr` で PR を作成
1. `/implement-review-pr` で必要に応じて最終確認や CI 調整
1. マージ後に 3. に戻って次の Issue を対応

以下、各ステップの詳細を説明します。

---

## Step 1: 計画を作成する

```text
/create-plan ユーザー認証機能を実装する
```

`/create-plan` は実装タスクの計画を `_/local-plans/<plan-name>.md` に作成します。

**ポイント:**

- 計画にはフェーズ分割・ファイル構成・検証方法が含まれます
- コードベースを調査した上で現実的な計画を立てます
- 計画内容を確認し、必要に応じて修正を依頼してください

**出力例:**

```text
_/local-plans/user-auth.md
```

計画ファイルには背景・目的、設計、実装ステップ、検証方法が記載されます。

---

## Step 2: Issue に分解する

```text
/create-issue user-auth.md の計画に基づいて GitHub Issue を作成して
```

`/create-issue` は計画を元に、実装可能な粒度の GitHub Issue を作成します。

**ポイント:**

- 親 Issue と Sub-issue の構造で作成されます
- 各 Issue には完了条件が明記されます
- Issue の優先度・依存関係も考慮されます

---

## Step 3: 作業ブランチに移動する

```text
git checkout -b feat/user-auth-signup
```

Issue ごとに作業ブランチを切ります。ブランチ名の規約:

| 種別 | プレフィックス | 例 |
| --- | --- | --- |
| 機能追加 | `feat/` | `feat/user-auth-signup` |
| バグ修正 | `fix/` | `fix/login-redirect` |
| リファクタリング | `refactor/` | `refactor/auth-middleware` |
| ドキュメント | `docs/` | `docs/setup-guide` |

---

## Step 4: タスクを実装する

```text
/implement-issue #123
```

`/implement-issue` は GitHub Issue を読み込み、計画を作成した上でコードを実装します。

**ポイント:**

- Issue の内容を解析し、自動で実装計画を立てます
- FSD アーキテクチャに準拠したコードを生成します
- テストも一緒に書きます（TDD スキルが自動的に連携）
- 型チェック・lint を通した状態で完了します

**中断・再開:**

大きな Issue の場合、途中で中断しても再度 `/implement-issue #123` を実行すれば、残りのタスクから再開できます。

---

## Step 5: 実装をレビューする

```text
/implement-review
```

`/implement-review` は変更されたコードの品質・アーキテクチャ・規約への準拠をレビューします。

**チェック観点:**

- コード品質（命名、構造、複雑度）
- FSD 依存方向の遵守
- TypeScript の型安全性
- テストの網羅性
- セキュリティ上の問題

**指摘があった場合:**

レビュー結果に基づいて修正し、再度 `/implement-review` を実行して確認できます。

---

## Step 6: ドキュメントを更新する

```text
/update-docs
```

`/update-docs` はコード変更に基づいて、関連するドキュメントを自動更新します。

**更新対象:**

- CLAUDE.md（アーキテクチャ・コマンドの変更がある場合）
- docs/ 配下の関連ドキュメント
- TSDoc コメント

---

## Step 7: PR を作成する

```text
/create-pr
```

`/create-pr` は Conventional Commits 形式の PR を作成します。

**ポイント:**

- PR タイトルは Conventional Commits 形式（`feat:`, `fix:` 等）
- PR 本文には Summary・Test plan が含まれます
- 関連する Issue 番号が自動リンクされます

---

## Step 8: PR をレビューする

```text
/implement-review-pr
```

`/implement-review-pr` は PR の CI 結果・品質・Conventional Commits 準拠を確認します。

**チェック観点:**

- CI の全ジョブが通っているか
- Conventional Commits 形式に準拠しているか
- レビューコメントへの対応が完了しているか

**CI が失敗した場合:**

エラーメッセージを確認し、修正コミットを追加してください。再度 `/implement-review-pr` で確認できます。

---

## Step 9: マージして次の Issue へ

PR が承認されたらマージし、次の Issue のブランチに移動します:

```sh
# main ブランチを最新に
git checkout main
git pull

# 次の Issue のブランチを作成
git checkout -b feat/next-feature
```

Step 3 に戻って、次の Issue の実装を開始します。

---

## 補足: よく使うスキルの組み合わせ

### 新しいコンポーネントを作る

```text
/create-slice features user-profile
/create-component UserAvatar --package features/user-profile --chakra
```

### TDD でテストから書く

```text
/tdd ユーザープロフィールの表示テストを作成 --unit --target packages/features/user-profile
```

### Figma デザインを実装する

```text
/implement-design <Figma URL>
```

### デプロイする

```text
/deploy-to-vercel
```

## 補足: 開発中に困ったとき

Claude Code に自然言語で質問すれば、コードベースを調査して回答します:

```text
この認証の仕組みはどうなっている？
FSD の entities レイヤーに User を追加するにはどうすればいい？
Chakra UI で Modal を作るベストプラクティスは？
```

エラーが発生した場合も、エラーメッセージを貼り付けるだけで原因調査と修正提案が得られます。
