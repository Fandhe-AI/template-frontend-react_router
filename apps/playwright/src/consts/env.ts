/** Playwright テスト対象の Base URL */
export const BASE_URL = process.env.BASE_URL ?? "http://localhost:3000";

/** CI 環境かどうか */
export const IS_CI = !!process.env.CI;

/** Web サーバー起動タイムアウト（ms） */
export const WEB_SERVER_TIMEOUT = 120_000;

/** テストタイムアウト（ms） */
export const TEST_TIMEOUT = 180_000;

/** expect タイムアウト（ms） */
export const EXPECT_TIMEOUT = 30_000;
