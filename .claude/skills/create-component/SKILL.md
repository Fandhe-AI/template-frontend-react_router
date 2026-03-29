---
name: create-component
description: UI コンポーネントを新規作成する。配置先パッケージの決定、Chakra UI 統合、FSD 規約に準拠したコンポーネントを生成する
argument-hint: "<component-name> [--package <package>] [--client] [--chakra] (例: badge, accordion --chakra --client)"
---

UI コンポーネントを新規作成する。

## 使い方

`/create-component <component-name> [options]`

- `$ARGUMENTS[0]`: コンポーネント名（kebab-case、例: `badge`, `accordion`, `breadcrumb`）
- オプション:
  - `--package <package>`: 配置先パッケージ（例: `shared-ui`, `widgets-header`）。省略時は自動判定
  - `--client`: `"use client"` を付与する
  - `--chakra`: Chakra UI コンポーネントをベースにする

## コンポーネント作成手順

### 1. 配置先の決定

`--package` が指定されていない場合、以下のルールで配置先を決定する:

| コンポーネントの種類 | 配置先パッケージ | 例 |
|---------------------|-----------------|-----|
| 汎用 UI パーツ（Button, Badge, Card 等） | `@repo/shared-ui` | `packages/shared/ui/` |
| 特定ドメインの UI | 該当レイヤーのスライス | `packages/widgets/<slice>/` |

判断に迷う場合はユーザーに確認する。

配置先パッケージが存在しない場合は、先に `/create-slice` でスライスを作成するか、shared パッケージを手動で作成する。

### 2. 既存コンポーネント分析（エージェント委譲）

`component-analyzer` エージェントに分析を委譲する:

- **引数**: コンポーネント名と `--chakra` オプションの情報
- **分析タイプ**: `all`（再利用候補 + パターン参照 + 共通コード検出）

分析結果に基づいて:

- **直接再利用が可能**: 新規作成ではなく既存コンポーネントの使用を提案し、ユーザーに確認する
- **合成で実現可能**: 使用すべき基盤コンポーネントを特定する
- **パターン参照がある**: 参照コンポーネントのコードを読み込み、同じパターンで実装する
- **Chakra UI 候補がある**: `chakra-ui` MCP でコンポーネント情報を取得する

分析結果の「推奨事項」に従い、Step 3 のテンプレート選択と実装に反映する。

### 3. ファイル作成

以下のファイル構成で作成する:

```
packages/<path>/src/ui/<component-name>/
├── index.tsx              # コンポーネント本体
├── index.stories.tsx      # Storybook stories
└── index.test.tsx         # Vitest テスト
```

#### 基本テンプレート

```tsx
import type { ComponentProps } from "react";

interface Props extends ComponentProps<"div"> {}

/**
 * コンポーネントの概要（1 文）。
 *
 * @example
 * ```tsx
 * <ComponentName />
 * ```
 *
 * @category UI
 */
const ComponentName = ({ className, ...rest }: Props) => {
  return <div className={className} {...rest} />;
};

export default ComponentName;
```

#### Chakra UI テンプレート（`--chakra` 指定時）

Chakra UI MCP（`mcp__chakra-ui__get_component_example` 等）でコンポーネント情報を取得し、プロジェクトの規約に合わせてラップする。

```tsx
"use client";

import { Box } from "@chakra-ui/react";
import type { ComponentProps } from "react";

interface Props extends ComponentProps<typeof Box> {}

/**
 * コンポーネントの概要（1 文）。
 *
 * @remarks
 * Chakra UI ベースのコンポーネント。
 *
 * @example
 * ```tsx
 * <ComponentName />
 * ```
 *
 * @category UI
 */
const ComponentName = (props: Props) => {
  return <Box {...props} />;
};

export default ComponentName;
```

#### Storybook stories テンプレート

```tsx
import type { Meta, StoryObj } from "storybook";
import ComponentName from ".";

const meta = {
  title: "ui/ComponentName",
  component: ComponentName,
} satisfies Meta<typeof ComponentName>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * デフォルト表示。
 */
export const Default: Story = {};
```

`--chakra` 指定時:

```tsx
"use client";

import type { Meta, StoryObj } from "storybook";
import ComponentName from ".";

const meta = {
  title: "ui/ComponentName",
  component: ComponentName,
} satisfies Meta<typeof ComponentName>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * デフォルト表示。
 */
export const Default: Story = {};
```

#### Vitest テストテンプレート

```tsx
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, test } from "vitest";
import ComponentName from ".";

describe("ComponentName", () => {
  afterEach(() => {
    cleanup();
  });

  test("正しくレンダリングされる", () => {
    render(<ComponentName />);
    expect(screen.getByRole("...")).toBeInTheDocument();
  });
});
```

> **Note**: `getByRole("...")` のロールは実際のコンポーネントに合わせて変更する。

#### 複数パーツのコンポーネント（Dialog, Accordion 等）

複数パーツがある場合はパーツごとにファイルを分割する:

```
packages/<path>/src/ui/<component-name>/
├── index.tsx          # 名前空間 export（import * as Xxx from "..."）
├── index.stories.tsx  # Storybook stories
├── index.test.tsx     # Vitest テスト
├── root.tsx           # XxxRoot — export default
├── trigger.tsx        # XxxTrigger — export default
├── content.tsx        # XxxContent — export default
└── ...
```

`index.tsx` の例:

```tsx
export { default as Root } from "./root";
export { default as Trigger } from "./trigger";
export { default as Content } from "./content";
```

消費側: `import * as Dialog from "@repo/<package>/ui/dialog";`

### 4. 依存関係のインストール

必要な依存関係を追加する:

```bash
# Chakra UI（--chakra 指定時、未インストールの場合）
pnpm add @chakra-ui/react --filter @repo/<package>
```

バージョンはピン留め（semver range なし）。パッケージに既にインストール済みの場合はスキップ。

### 5. `pnpm install` の実行

新規依存関係を追加した場合は `pnpm install` を実行してワークスペースリンクを更新する。

### 6. 作成結果の報告

- 作成したファイルパスとコンポーネント構造
- インポート方法の例
- バリアントがある場合はバリアント一覧

## コーディング規約チェックリスト

作成するコンポーネントは以下に準拠すること:

- [ ] `export default` + arrow function
- [ ] `import type` で型と値の import を分離
- [ ] ファイル名は kebab-case、コンポーネント名は PascalCase
- [ ] Server Components がデフォルト（`"use client"` は必要な場合のみ）
- [ ] `"use client"` が必要なケース: Chakra UI 使用時、useState/useEffect/イベントハンドラ使用時
- [ ] React 19: `forwardRef` は不要、`ref` は通常の prop として受け取る
- [ ] Tailwind クラスは Biome `useSortedClasses` 順に整列
- [ ] バージョンはピン留め（semver range なし）
- [ ] `@types/*` は devDependencies に配置
- [ ] TSDoc コメントを記述（Props プロパティに `/** */`、コンポーネント定義に概要・`@example`・`@category`）
- [ ] 配置先パッケージの `package.json` の `exports` に `"./ui/*"` パターンが既にある場合、追加設定は不要
- [ ] `index.stories.tsx` が存在すること（`satisfies Meta<typeof Component>` パターン）
- [ ] `index.test.tsx` が存在すること（`describe` + `test` パターン、`afterEach(() => { cleanup(); })` を含む）
- [ ] Stories の `title` はパッケージ内のパスに対応（例: `"ui/ComponentName"`）

## 注意事項

- バリアントが不要なシンプルなコンポーネントでは直接 `className` でスタイリングしてよい
- 配置先パッケージが存在しない場合は先にスライスまたはパッケージを作成する
- `@chakra-ui/react` の Slot / `asChild` パターンでコンポーネント合成が可能
- TDD で進める場合は `/tdd` スキルを参照し、テストを先に書く（Red-Green-Refactor サイクル）
