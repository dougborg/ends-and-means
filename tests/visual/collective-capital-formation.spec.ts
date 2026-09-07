import { expect, test } from "@playwright/test";
import { gotoRenderedPage } from "./support/rendered-page";

test("collective capital formation publishes its traced reader narrative", async ({
  page,
}) => {
  await gotoRenderedPage(page, "/concepts/collective-capital-formation/");
  await expect(
    page.getByRole("heading", { name: "Collective capital formation", level: 1 }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", {
      name: "What does collective mean here?",
      level: 3,
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", {
      name: "Why can collective funds lose support?",
      level: 3,
    }),
  ).toBeVisible();
});
