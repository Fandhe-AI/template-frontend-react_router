import { createBaseConfig } from "@repo/shared-config-playwright/configs/base";
import {
  BASE_URL,
  EXPECT_TIMEOUT,
  IS_CI,
  TEST_TIMEOUT,
  WEB_SERVER_TIMEOUT,
} from "./src/consts/env";

export default createBaseConfig({
  testDir: "./src/tests",
  baseURL: BASE_URL,
  timeout: TEST_TIMEOUT,
  expectTimeout: EXPECT_TIMEOUT,
  webServer: {
    command: "pnpm --filter=web dev",
    url: BASE_URL,
    reuseExistingServer: !IS_CI,
    timeout: WEB_SERVER_TIMEOUT,
  },
});
