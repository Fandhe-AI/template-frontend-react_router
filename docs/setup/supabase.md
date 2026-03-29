# Supabase セットアップ

本テンプレートのデフォルトバックエンドである Supabase のセットアップ手順。

## 前提条件

- [Supabase CLI](https://supabase.com/docs/guides/cli)
- [Docker](https://www.docker.com/)（ローカル開発に必要）

## ローカル開発

### 1. Supabase CLI のインストール

```sh
# macOS
brew install supabase/tap/supabase

# npm
npx supabase --version
```

### 2. ローカル Supabase の起動

```sh
supabase start
```

初回起動時に Docker イメージがダウンロードされます。起動完了後、以下の情報が表示されます:

```text
API URL: http://127.0.0.1:54321
anon key: eyJhbGci...
service_role key: eyJhbGci...
Studio URL: http://127.0.0.1:54323
```

### 3. 環境変数の設定

表示された情報を `apps/web/.env` に設定します:

```env
SUPABASE_URL=http://127.0.0.1:54321
SUPABASE_ANON_KEY=<表示された anon key>
SUPABASE_SERVICE_ROLE_KEY=<表示された service_role key>
VITE_SUPABASE_URL=http://127.0.0.1:54321
VITE_SUPABASE_ANON_KEY=<表示された anon key>
```

`make setup` を実行済みなら `.env` ファイルは `.env.example` から生成済みです。ローカル開発のデフォルト値は `supabase start` の出力に合わせて更新してください。

### 4. マイグレーションの作成

```sh
# 新しいマイグレーションを作成
supabase migration new create_users_table

# マイグレーションを適用
supabase db reset
```

マイグレーションファイルは `supabase/migrations/` に生成されます。

### 5. Supabase Studio

ローカルの Supabase Studio（管理画面）は <http://127.0.0.1:54323> でアクセスできます。テーブルの作成・データの確認・SQL の実行などが可能です。

### 6. ローカル Supabase の停止

```sh
supabase stop
```

## 本番環境の接続

### 1. Supabase プロジェクトの作成

[Supabase Dashboard](https://supabase.com/dashboard) でプロジェクトを作成します。

### 2. プロジェクトのリンク

```sh
supabase link --project-ref <project-ref>
```

`project-ref` は Supabase ダッシュボードの Settings → General で確認できます。

### 3. マイグレーションの適用

```sh
supabase db push
```

ローカルのマイグレーションが本番データベースに適用されます。

### 4. Vercel 環境変数の設定

Supabase ダッシュボードの Settings → API から取得した値を Vercel に設定します:

```sh
vercel env add SUPABASE_URL          # Project URL
vercel env add SUPABASE_ANON_KEY     # anon public key
vercel env add SUPABASE_SERVICE_ROLE_KEY  # service_role key（サーバーサイドのみ）
vercel env add VITE_SUPABASE_URL     # Project URL（クライアントサイド用）
vercel env add VITE_SUPABASE_ANON_KEY    # anon public key（クライアントサイド用）
```

## 提供されるユーティリティ

本テンプレートには以下の Supabase ユーティリティが含まれています:

### サーバーサイドクライアント (`apps/web/src/lib/supabase/server.ts`)

```typescript
import { createSupabaseServerClient } from "@/lib/supabase/server";

// loader / action 内で使用
export async function loader({ request }: Route.LoaderArgs) {
  const { supabase, headers } = createSupabaseServerClient(request);
  const { data } = await supabase.from("users").select("*");
  return Response.json(data, { headers });
}
```

- `request` から Cookie を読み取り、Supabase セッションを管理
- レスポンスに `Set-Cookie` ヘッダーを自動付与（トークンリフレッシュ対応）

### ブラウザクライアント (`apps/web/src/lib/supabase/client.ts`)

```typescript
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

// コンポーネント内で使用
const supabase = createSupabaseBrowserClient();
const { data } = await supabase.from("users").select("*");
```

- `VITE_SUPABASE_URL` と `VITE_SUPABASE_ANON_KEY` を使用
- クライアントサイドからの直接アクセス用

## Claude Code との連携

Supabase に関する Claude Code スキルが利用可能です:

```text
/supabase
```

マイグレーション作成、RLS ポリシー設定、Edge Functions の実装などで Supabase のベストプラクティスを参照できます。
