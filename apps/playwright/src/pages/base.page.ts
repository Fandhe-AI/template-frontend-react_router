import type { Locator, Page } from "@playwright/test";

export abstract class BasePage {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto(path = "/"): Promise<void> {
    await this.page.goto(path);
  }

  async waitForNetworkIdle(timeout = 10000): Promise<void> {
    await this.page.waitForLoadState("networkidle", { timeout });
  }

  getByTestId(testId: string): Locator {
    return this.page.getByTestId(testId);
  }
}
