import { expect, test } from "@playwright/test";

test("collective capital formation publishes its traced reader narrative", async ({
  page,
}) => {
  const response = await page.goto("/concepts/collective-capital-formation/", {
    waitUntil: "networkidle",
  });

  expect(response?.ok()).toBe(true);
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
