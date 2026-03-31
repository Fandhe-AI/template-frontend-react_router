# CLAUDE.md

フロントエンドテンプレート（React Router） — Fandhe Inc.

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

All commands run from the repo root. Use **pnpm** only (npm/yarn forbidden).

```bash
# Development
pnpm dev                          # Start web app (port 3000)

# Build
pnpm build                        # Build all
pnpm build --filter=web           # Build single app

# Lint & Format (Biome)
pnpm lint                         # Biome check all
pnpm lint:fix                     # Biome check --write all
pnpm format                       # Biome format check
pnpm format:fix                   # Biome format --write all

# Type Check
pnpm check-types                  # TypeScript type check all

# Test (Vitest)
pnpm test                         # Run all unit/integration tests
pnpm test:coverage                # Run tests with coverage report
pnpm vitest                       # Run tests + generate & view HTML report

# E2E Test (Playwright)
pnpm test:e2e                     # Run all E2E tests

# Storybook
pnpm storybook                    # Start Storybook dev server (port 6006)
pnpm storybook:build              # Build Storybook static site

# TypeDoc
pnpm typedoc                      # Generate API documentation

# Dependency Management (Syncpack)
pnpm package:lint                 # Check dependency version consistency
pnpm package:fix                  # Fix dependency version mismatches
pnpm package:format               # Check package.json formatting
pnpm package:format:fix           # Fix package.json formatting

# Unused Code Detection (Knip)
pnpm knip                         # Detect unused code/deps/exports
pnpm knip:fix                     # Auto-fix unused exports

# Initial Setup
make setup                        # Run all setup steps (submodules, env, volta, pnpm, playwright, lefthook)
make setup-env                    # Generate .env from .env.example (with backup)
make setup-submodules             # git submodule update --init --recursive
make update-submodules            # git submodule update --remote --recursive
```

## Architecture

Turborepo monorepo with pnpm workspaces, organized by Feature-Sliced Design (FSD).

```
apps/
  web/                — React Router v7 Framework Mode + Vite (port 3000)
  storybook/          — Storybook UI catalog (port 6006)
  playwright/         — Playwright E2E tests
  typedoc/            — TypeDoc API documentation
  vitest/             — Vitest test report aggregation (blob merge + HTML view)
packages/
  pages/              — FSD pages layer
  widgets/            — FSD widgets layer
  features/           — FSD features layer
  entities/           — FSD entities layer
  shared/
    config-biome/     — [submodule] Shared Biome configuration (@fandhe-ai/shared-config-biome)
    config-commitlint/ — [submodule] Shared Commitlint configuration (@fandhe-ai/shared-config-commitlint)
    config-knip/      — [submodule] Shared Knip configuration (@fandhe-ai/shared-config-knip)
    config-playwright/ — [submodule] Shared Playwright configuration (@fandhe-ai/shared-config-playwright)
    config-storybook/ — [submodule] Shared Storybook configuration (@fandhe-ai/shared-config-storybook)
    config-syncpack/  — [submodule] Shared Syncpack configuration (@fandhe-ai/shared-config-syncpack)
    config-typescript/ — [submodule] Shared tsconfig templates (@fandhe-ai/shared-config-typescript)
    config-typedoc/   — [submodule] Shared TypeDoc configuration (@fandhe-ai/shared-config-typedoc)
    config-vitest/    — [submodule] Shared Vitest configuration (@fandhe-ai/shared-config-vitest)
    sandbox/          — Sandbox slice for verifying dev tooling (@repo/shared-sandbox)
```

- **Node 24.13.0 / pnpm 10.32.1 / TypeScript 6.0.2**
- **React 19.2.4 / React Router 7.13.1 / Vite 8**
- **Biome 2.4** for lint + format + import sorting (replaces ESLint + Prettier)
- **Commitlint** with Conventional Commits (`@commitlint/config-conventional`)
- **Knip 6** for unused code/dependency detection
- **Syncpack** for dependency version consistency
- **Vitest 4** for unit/integration testing
- **Storybook 10** for UI catalog
- **Playwright 1.58** for E2E testing
- **TypeDoc** for API documentation generation
- **Lefthook** for git hooks (pre-commit: biome, commit-msg: commitlint, pre-push: test)
- TypeScript strict mode with `noUncheckedIndexedAccess: true`
- Path alias `@/*` → `./src/*` in all packages/apps with `tsconfig.json`

## Backend (Supabase — optional)

- Default backend is Supabase (Vercel × Supabase environment)
- `supabase/` directory contains local dev config and migrations
- `apps/web/src/lib/supabase/` provides server/client utilities
- Supabase can be removed — see README.md "Supabase を使わない場合" section

## Environment Variables

- `.env.example` files define required env vars with local defaults
- `make setup-env` auto-detects all `.env.example` and generates `.env` (skips if `.env` is newer, backs up if older)
- Hardcoded values (URLs, timeouts) are centralized in `src/consts/env.ts` per app

## Knip Notes

- Knip config is in `@fandhe-ai/shared-config-knip` (Git submodule: `packages/shared/config-knip/src/config/base.json`)
- `apps/web` の `ignoreUnresolved: ["\\./\\+types/"]` は **削除禁止** — React Router の `+types/` ディレクトリは `react-router typegen` で生成されるため、CI 環境や `pnpm knip` 単体実行時には存在しない。この ignore を削除すると CI の knip チェックが失敗する
- knip の ignore エントリを変更する際は `pnpm knip` をローカルで実行し、Configuration hints が出ないことを確認すること

## Storybook Conventions

- Stories are auto-discovered from `packages/**/src/ui/**/*.stories.@(ts|tsx)`
- Do not set `title` manually — auto-title from file path is used

## Turborepo Task Graph

- `build` depends on `^build` (packages build before apps), outputs `build/**`, `dist/**`
- `lint` depends on `^lint`, outputs nothing (cached by exit code)
- `check-types` depends on `^check-types`, outputs nothing (cached by exit code)
- `dev` persistent and uncached (web only via `--filter=web`)
- `test` depends on `^test`, outputs `test-results/**`, cached
- `test:coverage` depends on `^test:coverage`, outputs `coverage/**` + `test-results/**`
- `test:e2e` uncached (E2E tests)
- `storybook:build` outputs `storybook-static/**`
- `typedoc` outputs `docs/**`
- `apps/vitest` has package-level tasks: `collect-blobs` → `merge-reports` → `vitest`
