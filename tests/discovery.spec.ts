import { test, expect } from "@playwright/test";

test("all 28 problems, independent confirmation, expansion, and personalized outcomes", async ({ page }) => {
  await page.goto("/");
  const cards = page.locator(".problem-card");
  await expect(cards).toHaveCount(28);
  const missed = page.locator('[data-problem="problem-1"]');
  const slow = page.locator('[data-problem="problem-5"]');
  const confirmation = missed.getByRole("checkbox", { name: "Missed calls", exact: true });
  await missed.getByRole("button", { name: "Expand Missed calls" }).click();
  await expect(confirmation).not.toBeChecked();
  await confirmation.check();
  await expect(missed.getByRole("checkbox", { name: "Potential buyers lost before qualification" })).not.toBeChecked();
  await confirmation.uncheck();
  await expect(missed.getByRole("heading", { name: "Matched solution" })).toBeVisible();
  await slow.getByRole("button", { name: "Expand Slow response to new leads" }).click();
  await expect(missed.getByRole("heading", { name: "Matched solution" })).toBeVisible();
  await expect(slow.getByRole("heading", { name: "Matched solution" })).toBeVisible();
  const buyer = missed.getByRole("checkbox", { name: "Potential buyers lost before qualification" });
  const money = missed.getByRole("checkbox", { name: "Lost potential sales revenue" });
  await buyer.check();
  await expect(missed.locator(".outcome-list")).toContainText("More potential buyers reached and qualified");
  await expect(money).not.toBeChecked();
  await money.check();
  await expect(missed.locator(".outcome-list").last()).toContainText("Potential additional sales revenue");
  await expect(slow.getByRole("checkbox", { name: "Potential buyers lost before qualification" })).not.toBeChecked();
  await missed.getByText("How the agent functions", { exact: true }).click();
  await missed.getByText("How it produces operational outcomes", { exact: true }).click();
  await missed.getByText("How it produces financial outcomes", { exact: true }).click();
  await expect(missed.locator("details[open]")).toHaveCount(3);
  await expect(missed.locator(".muted-function")).toContainText("Routes urgent callers");
  await expect(missed.locator(".explanation")).toHaveCount(2);
  await missed.getByRole("button", { name: "All benefits" }).click();
  await expect(missed.locator(".outcome-list li")).toHaveCount(6);
  await expect(missed.locator(".muted-function")).toHaveCount(0);
  await expect(missed.locator(".explanation")).toHaveCount(6);
  await expect(missed.getByRole("checkbox", { name: "Potential appointments lost" })).not.toBeChecked();
  await expect(slow.getByRole("button", { name: "Personalized" })).toHaveAttribute("aria-pressed", "true");
  await missed.getByRole("button", { name: "Collapse Missed calls" }).click();
  await missed.getByRole("button", { name: "Expand Missed calls" }).click();
  await expect(missed.getByRole("button", { name: "All benefits" })).toHaveAttribute("aria-pressed", "true");
  await expect(buyer).toBeChecked();
  await expect(money).toBeChecked();
  await expect(missed.locator("details[open]")).toHaveCount(3);
  await missed.getByRole("button", { name: "Personalized" }).click();
  await expect(missed.locator(".outcome-list li")).toHaveCount(2);
  await buyer.uncheck();
  await expect(missed.locator(".outcome-list li")).toHaveCount(1);
  await expect(missed.locator(".explanation")).toHaveCount(1);
  await expect(money).toBeChecked();
  await missed.getByText("How the agent functions", { exact: true }).click();
  await expect(missed.locator("details[open]")).toHaveCount(2);
});

test("remaining example agents and unpopulated problem use the same expandable interface", async ({ page }) => {
  await page.goto("/");
  for (const [id, agent] of [["problem-9", "Lead Revival Agent"], ["problem-14", "Appointment Guardian Agent"], ["problem-2", "Agent not yet provided"]]) {
    const card = page.locator(`[data-problem="${id}"]`);
    await card.getByRole("button", { name: /^Expand/ }).click();
    await expect(card.getByRole("heading", { name: agent })).toBeVisible();
    await expect(card.locator("details")).toHaveCount(3);
    await card.getByRole("checkbox").first().check();
    await expect(card.getByRole("checkbox").first()).toBeChecked();
  }
});
