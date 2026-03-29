import { expect, test } from "@playwright/test";
import { HomePage } from "@/pages";

test.describe("Home page", () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.goto("/");
  });

  test("displays the heading", async () => {
    await expect(homePage.heading).toHaveText("Frontend Template");
  });

  test("has the correct page title", async ({ page }) => {
    await expect(page).toHaveTitle("Frontend Template");
  });
});
