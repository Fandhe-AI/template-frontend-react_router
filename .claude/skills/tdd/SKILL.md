---
name: tdd
description: |
  テスト駆動開発 (TDD) のワークフロースキル。Red-Green-Refactor サイクルでコードを実装する。
  他スキル（create-component, implement-issue 等）の設計・実行時にテスト戦略を提供する。
  TDD, テスト駆動開発, テストファースト, テスト設計, Red-Green-Refactor
argument-hint: "<description> [--unit|--integration|--e2e] [--target <file-or-module>]"
autoTrigger: true
triggerCondition: >
  テスト作成、テスト駆動開発、TDD、テストファースト、テスト設計に関するタスクが検出された場合。
  または create-component / implement-issue の実行中にテスト作成が必要になった場合。
---

# テスト駆動開発 (TDD)

Red-Green-Refactor サイクルでコードを実装する。

## 使い方

`/tdd <description> [options]`

- `$ARGUMENTS[0]`: テスト対象の説明（例: `validateEmail 関数`, `LoginForm コンポーネント`）
- オプション:
  - `--unit`: ユニットテスト（デフォルト）
  - `--integration`: 統合テスト
  - `--e2e`: E2E テスト（Playwright）
  - `--target <path>`: テスト対象ファイルのパス（既存コードに対する TDD の場合）

## TDD ワークフロー

### Step 1: タスク分析とテスト戦略の決定

ユーザーの説明からテスト対象を特定し、以下を決定する:

#### 1-1. テスト種別の決定

`--unit` / `--integration` / `--e2e` が指定されていない場合、対象に応じて自動判定する:

| 対象 | テスト種別 | フレームワーク |
|------|-----------|--------------|
| 純粋関数・ユーティリティ・バリデーション | Unit | Vitest |
| React hooks・カスタム hooks | Unit | Vitest + jsdom |
| 単体コンポーネント（表示・インタラクション） | Unit | Vitest + jsdom |
| 複数コンポーネントの結合・状態管理 | Integration | Vitest + jsdom |
| API 連携・データフェッチ | Integration | Vitest |
| ユーザーフロー・ページ遷移 | E2E | Playwright |

#### 1-2. テストファイル配置の決定

FSD レイヤーに基づいてテストファイルの配置先を決定する:

```
# Unit / Integration テスト — コロケーション（実装の隣）
packages/<layer>/<slice>/src/
├── model/
│   ├── use-auth.ts
│   └── use-auth.test.ts
├── ui/
│   ├── login-form/
│   │   ├── index.tsx
│   │   └── index.test.tsx
│   └── ...
└── lib/
    ├── validate-email.ts
    └── validate-email.test.ts

# E2E テスト — Playwright アプリ内
apps/playwright/src/tests/
├── auth/
│   └── login.spec.ts
└── ...
```

#### 1-3. コードベースの調査

- `--target` が指定されている場合: 対象ファイルを読み込み、テスト対象の API を把握する
- 新規作成の場合: 類似する既存実装を Glob / Grep で探し、パターンを参照する
- 関連する型定義・インターフェースを確認する

### Step 2: Red — 失敗するテストを書く

テストケースを設計し、**実装より先に**テストファイルを作成する。

#### テストケース設計の原則

1. **正常系を最初に**: 最も基本的な動作を確認するテストから始める
2. **境界値**: 入力の境界条件をテストする
3. **異常系**: 不正な入力・エラーケースをテストする
4. **1 テスト 1 アサーション**: 各テストは 1 つの振る舞いのみ検証する

#### テストファイルの作成

対象に応じたテンプレートでテストファイルを作成する。

**純粋関数のテスト:**

```typescript
import { describe, expect, test } from "vitest";
import { targetFunction } from "./target";

describe("targetFunction", () => {
  test("正常な入力で期待する結果を返す", () => {
    const result = targetFunction(validInput);
    expect(result).toBe(expectedOutput);
  });

  test("境界値で正しく動作する", () => {
    expect(targetFunction(boundaryInput)).toBe(expected);
  });

  test("不正な入力でエラーを投げる", () => {
    expect(() => targetFunction(invalidInput)).toThrow();
  });
});
```

**React コンポーネントのテスト:**

```tsx
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, test } from "vitest";
import TargetComponent from "./target-component";

describe("TargetComponent", () => {
  afterEach(() => {
    cleanup();
  });

  test("初期状態で正しくレンダリングされる", () => {
    render(<TargetComponent />);
    expect(screen.getByRole("button", { name: "送信" })).toBeInTheDocument();
  });

  test("ユーザー操作に正しく応答する", async () => {
    const user = userEvent.setup();
    render(<TargetComponent />);
    await user.click(screen.getByRole("button", { name: "送信" }));
    expect(screen.getByText("送信完了")).toBeInTheDocument();
  });
});
```

**React hooks のテスト:**

```typescript
import { renderHook, act } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { useTargetHook } from "./use-target-hook";

describe("useTargetHook", () => {
  test("初期値を返す", () => {
    const { result } = renderHook(() => useTargetHook());
    expect(result.current.value).toBe(initialValue);
  });

  test("アクションで状態が変化する", () => {
    const { result } = renderHook(() => useTargetHook());
    act(() => {
      result.current.doAction();
    });
    expect(result.current.value).toBe(updatedValue);
  });
});
```

**E2E テスト (Playwright):**

```typescript
import { expect, test } from "@playwright/test";
import { SomePage } from "../pages/some.page";

test.describe("機能名", () => {
  test("ユーザーフローが正しく動作する", async ({ page }) => {
    const somePage = new SomePage(page);
    await somePage.goto("/path");
    await somePage.performAction();
    await expect(page.getByText("期待するテキスト")).toBeVisible();
  });
});
```

#### テストの実行（Red の確認）

```bash
# Unit / Integration テスト
pnpm test --filter=@repo/<package> -- --run <test-file>

# E2E テスト
pnpm test:e2e -- --grep "テスト名"
```

テストが**失敗する**ことを確認する。すでに通る場合はテストが不十分か、実装が既に存在する。

### Step 3: Green — テストを通す最小限の実装

テストを通すための**最小限のコード**を実装する。

#### Green フェーズの原則

1. **最小限**: テストを通すために必要なコードだけを書く
2. **ハードコードも可**: 最初はハードコードされた値でもよい（後のテストで一般化する）
3. **設計は後回し**: きれいなコードは Refactor フェーズで行う
4. **既存テストを壊さない**: 新しい実装が既存テストを壊していないか確認する

#### 実装後のテスト実行

```bash
# 対象のテストが通ることを確認
pnpm test --filter=@repo/<package> -- --run <test-file>
```

テストが**成功する**ことを確認する。失敗する場合は実装を修正する。

### Step 4: Refactor — コードを改善する

テストが通る状態を維持しつつ、コードの品質を改善する。

#### Refactor のチェックリスト

- [ ] 重複コードの排除
- [ ] 命名の改善（変数・関数・型）
- [ ] 関数の分割（単一責任）
- [ ] 型の厳密化
- [ ] 不要な import の削除

#### Refactor 後の確認

```bash
# テストが引き続き通ることを確認
pnpm test --filter=@repo/<package> -- --run <test-file>

# Lint も確認
pnpm lint --filter=@repo/<package>
```

### Step 5: サイクルの繰り返し

未実装の要件がある場合は Step 2 に戻る。

すべての要件が実装されたら:

1. 全テストが通ることを確認: `pnpm test --filter=@repo/<package>`
2. Lint が通ることを確認: `pnpm lint --filter=@repo/<package>`
3. 型チェックが通ることを確認: `pnpm check-types --filter=@repo/<package>`
4. ユーザーに完了報告する

## テスト戦略ガイドライン（他スキル参照用）

他スキル（`create-component`, `create-plan`, `create-issue`, `implement-issue`）がテストを設計する際に参照するセクション。

### FSD レイヤー別テスト戦略

| レイヤー | テスト種別 | 対象 | 優先度 |
|---------|-----------|------|--------|
| `shared/` | Unit | ユーティリティ、ヘルパー、型ガード、バリデーション | 高 |
| `entities/` | Unit | モデル、バリデーション、データ変換 | 高 |
| `features/` | Unit + Integration | ビジネスロジック、hooks、フォーム処理 | 高 |
| `widgets/` | Integration | コンポーネント結合、状態の流れ | 中 |
| `pages/` | Integration + E2E | ページ全体の動作、ルーティング | 中 |
| `apps/web/` | E2E | ユーザーフロー全体 | 低（重要フローのみ） |

### テストの書き方の指針

#### 何をテストするか

- **テストすべき**: ビジネスロジック、データ変換、バリデーション、条件分岐、エラーハンドリング
- **テスト不要**: フレームワークの機能（React のレンダリング自体）、外部ライブラリの動作、単純な props パススルー

#### テストの粒度

```
# 良い: 1 つの振る舞いを検証
test("空文字列を拒否する", () => {
  expect(validate("")).toBe(false);
});

# 悪い: 複数の振る舞いを 1 テストに詰め込む
test("バリデーションが動く", () => {
  expect(validate("")).toBe(false);
  expect(validate("valid@email.com")).toBe(true);
  expect(validate("no-at-sign")).toBe(false);
});
```

#### モック戦略

| 対象 | アプローチ |
|------|-----------|
| 外部 API | `vi.mock` でモジュールモック or `msw` でネットワークモック |
| タイマー | `vi.useFakeTimers()` |
| ブラウザ API | jsdom 環境で自動提供、不足分は `vi.stubGlobal` |
| 子コンポーネント | 原則モックしない（統合テストとして扱う） |
| DB・外部サービス | モック必須（Unit テスト時） |

### 他スキルとの連携

#### create-component との連携

`create-component` でコンポーネントを作成する際、TDD で進める場合:

1. **先にテストファイルを作成**: `index.test.tsx` を実装コードより先に書く
2. **レンダリングテスト**: 初期表示が正しいことを確認
3. **インタラクションテスト**: ユーザー操作への応答を確認
4. **Props テスト**: 各 prop の効果を確認

#### create-plan との連携

`create-plan` で計画を作成する際、テスト計画を含める:

```markdown
## テスト計画

### テスト種別と対象

| テスト種別 | 対象 | ファイル |
|-----------|------|---------|
| Unit | validateEmail | packages/shared/lib/src/lib/validate-email.test.ts |
| Integration | LoginForm | packages/features/auth/src/ui/login-form/index.test.tsx |
| E2E | ログインフロー | apps/playwright/src/tests/auth/login.spec.ts |

### テストケース

- [ ] 正常系: ...
- [ ] 境界値: ...
- [ ] 異常系: ...
```

#### create-issue との連携

`create-issue` で Issue を作成する際、受け入れ条件にテスト要件を含める:

```markdown
## 受け入れ条件

- [ ] 機能が正しく動作する
- [ ] ユニットテストが追加されている
- [ ] テストがすべて通る (`pnpm test`)
- [ ] エッジケースがテストされている
```

#### implement-issue との連携

`implement-issue` の Step 4（実装）で TDD サイクルを適用する:

1. Issue の要件からテストケースを洗い出す
2. Step 2（Red）→ Step 3（Green）→ Step 4（Refactor）を繰り返す
3. Step 6（テスト実行）は TDD の過程で既に完了している

## テストコマンドリファレンス

```bash
# 全テスト実行
pnpm test

# 特定パッケージのテスト
pnpm test --filter=@repo/<package>

# 特定ファイルのテスト
pnpm test --filter=@repo/<package> -- --run <file-path>

# ウォッチモード
pnpm test:projects:watch

# E2E テスト
pnpm test:e2e

# E2E デバッグモード
pnpm --filter=playwright test:debug

# E2E UI モード
pnpm --filter=playwright test:ui
```

## 注意事項

- テストは実装の**前に**書く — 実装後にテストを追加するのは TDD ではない
- 1 サイクルで 1 つの振る舞いのみ追加する — 大きなジャンプは避ける
- Refactor フェーズではテストコード自体もリファクタリング対象にする
- テストが通らない状態でコミットしない
- `vitest` スキルを API リファレンスとして参照できる
- `playwright` スキルを E2E テストの API リファレンスとして参照できる
