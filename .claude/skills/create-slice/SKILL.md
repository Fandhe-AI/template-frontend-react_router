---
name: create-slice
description: Feature Sliced Design (FSD) の新しいスライスを作成する。パッケージ構造、tsconfig、package.json を自動生成する
disable-model-invocation: true
argument-hint: "<layer> <name> (例: features user-profile)"
---

FSD スライスを新規作成する。

## 使い方

`/create-slice <layer> <name>`

- `$ARGUMENTS[0]`: レイヤー名（`pages`, `widgets`, `features`, `entities`）
- `$ARGUMENTS[1]`: スライス名（kebab-case、例: `user-profile`）

## 作成するファイル

### 1. `packages/$0/$1/package.json`

```json
{
  "name": "@repo/$0-$1",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "exports": {
    "./*": "./src/*.ts",
    "./ui/*": "./src/ui/*.tsx"
  },
  "dependencies": {
    "react": "19.2.4"
  },
  "devDependencies": {
    "@repo/shared-config-typescript": "workspace:*",
    "@types/node": "22",
    "@types/react": "19.2.14",
    "typescript": "5.9.2"
  },
  "scripts": {
    "check-types": "tsc --noEmit"
  }
}
```

### 2. `packages/$0/$1/tsconfig.json`

```json
{
  "extends": "@repo/shared-config-typescript/react-library",
  "compilerOptions": {
    "outDir": "dist",
    "strictNullChecks": true
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

### 3. `packages/$0/$1/src/index.ts`

バレルファイル（空の export）

## 作成後の手順

1. 上記ファイルを作成する
2. `pnpm install` を実行してワークスペースリンクを更新する
3. 作成したパッケージの構造を報告する

## 注意事項

- バージョンはピン留め（semver range なし）— Syncpack で強制
- `@types/*` パッケージは必ず `devDependencies` に配置
- レイヤー名が `pages`, `widgets`, `features`, `entities` 以外の場合はエラーを報告
- pnpm-workspace.yaml の `packages/<layer>/*` パターンにより、新規スライスは自動的にワークスペースに含まれる
