# Supabase の削除

Supabase を使わないプロジェクトでは、以下の手順でテンプレートから Supabase を完全に削除できます。

## 削除手順

### 1. ファイル・ディレクトリの削除

```sh
rm -rf supabase/
rm -rf apps/web/src/lib/supabase/
```

### 2. パッケージの削除

```sh
pnpm remove @supabase/ssr @supabase/supabase-js --filter web
```

### 3. 環境変数の削除

`apps/web/.env.example` と `apps/web/.env` から以下の変数を削除します:

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

### 4. スキルの削除（任意）

Supabase リファレンススキルが不要な場合:

```sh
rm -rf .agents/skills/supabase/
```

`skills-lock.json` を開き、`"supabase"` エントリを削除してください。

### 5. lockfile の更新

```sh
pnpm install
```

### 6. 検証

```sh
pnpm check-types    # 型エラーがないことを確認
pnpm lint           # lint エラーがないことを確認
pnpm build          # ビルドが通ることを確認
```

## 削除後の注意

- `apps/web/src/lib/` ディレクトリが空になった場合は、ディレクトリごと削除して構いません
- Vercel の環境変数から Supabase 関連の変数を削除することも忘れずに
- 認証やデータベースが必要な場合は、代替サービス（Firebase, PlanetScale 等）のセットアップを行ってください
