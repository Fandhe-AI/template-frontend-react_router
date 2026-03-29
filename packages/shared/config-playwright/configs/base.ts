import type { PlaywrightTestConfig } from "@playwright/test";
import { devices } from "@playwright/test";

export type WebServerConfig = {
  command: string;
  url: string;
  reuseExistingServer?: boolean;
  timeout?: number;
};

export type BaseConfigOptions = {
  testDir: string;
  baseURL: string;
  globalSetup?: string;
  httpCredentials?: {
    username: string;
    password: string;
  };
  webServer?: WebServerConfig;
  timeout?: number;
  expectTimeout?: number;
};

export const createBaseConfig = (
  options: BaseConfigOptions,
): PlaywrightTestConfig => {
  const isCI = !!process.env.CI;

  return {
    testDir: options.testDir,
    globalSetup: options.globalSetup,
    fullyParallel: false,
    forbidOnly: isCI,
    retries: isCI ? 2 : 0,
    workers: 1,
    reporter: [
      ["html", { outputFolder: "./playwright-report" }],
      ["junit", { outputFile: "./test-results/junit.xml" }],
      ["list"],
    ],
    use: {
      baseURL: options.baseURL,
      httpCredentials: options.httpCredentials,
      trace: "on-first-retry",
      screenshot: "only-on-failure",
      video: "on-first-retry",
    },
    projects: [
      {
        name: "chromium",
        use: { ...devices["Desktop Chrome"] },
      },
    ],
    webServer: options.webServer,
    timeout: options.timeout ?? 180000,
    expect: {
      timeout: options.expectTimeout ?? 30000,
    },
  };
};
