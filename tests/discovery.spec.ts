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
  await expect(missed.getByRole("heading", { name: "Solution", exact: true })).toBeVisible();
  await slow.getByRole("button", { name: "Expand Slow response to new leads" }).click();
  await expect(missed.getByRole("heading", { name: "Solution", exact: true })).toBeVisible();
  await expect(slow.getByRole("heading", { name: "Solution", exact: true })).toBeVisible();
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

test("requested pastel headings and compact agent headers across all problems", async ({ page }) => {
  test.setTimeout(120000);
  await page.goto("/");
  const cards = page.locator(".problem-card");
  await expect(cards).toHaveCount(28);
  for (const card of await cards.all()) {
    await expect(card.locator(".problem-confirm > span")).toHaveCSS("color", "rgb(242, 173, 173)");
    await card.getByRole("button", { name: /^Expand/ }).click();
    await expect(card.locator(".selection-heading, .confirmed-problem")).toHaveCount(0);
    await expect(card.locator(".problem-content > .discovery-divider + .impact-columns")).toBeVisible();
    await expect(card.locator(".impact-tone-operational")).toHaveCSS("color", "rgb(245, 230, 163)");
    await expect(card.locator(".impact-tone-operational")).toHaveCSS("background-color", "rgba(245, 230, 163, 0.08)");
    await expect(card.locator(".impact-tone-financial")).toHaveCSS("color", "rgb(174, 203, 244)");
    await expect(card.locator(".impact-tone-financial")).toHaveCSS("background-color", "rgba(174, 203, 244, 0.08)");
    await expect(card.getByRole("heading", { name: "Solution", exact: true })).toHaveCSS("color", "rgb(183, 223, 190)");
    await expect(card.locator(".agent-header h3")).toHaveCSS("color", "rgb(183, 223, 190)");
    await expect(card.locator(".agent-header")).toHaveCSS("align-items", "center");
    await expect(card.locator(".agent-header p")).toHaveCount(0);
    await expect(card.locator(".agent-header .agent-icon")).toHaveCount(1);
    for (const heading of await card.locator(".outcome-tone-operational").all()) {
      await expect(heading).toHaveCSS("color", "rgb(245, 230, 163)");
      await expect(heading).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
    }
    for (const heading of await card.locator(".outcome-tone-financial").all()) {
      await expect(heading).toHaveCSS("color", "rgb(174, 203, 244)");
      await expect(heading).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
    }
    await card.getByRole("button", { name: /^Collapse/ }).click();
  }
});

test("problem checkbox retains green outline and impact checkboxes use filled green with dark check", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Discovery", exact: true })).toHaveCSS("color", "rgb(244, 244, 244)");
  const card = page.locator('[data-problem="problem-1"]');
  await card.getByRole("button", { name: "Expand Missed calls" }).click();
  await expect(card.getByText("Discovery selections", { exact: true })).toHaveCount(0);
  await expect(card.getByText("Missed calls", { exact: true })).toHaveCount(1);
  const inputs = card.locator('input[type="checkbox"]');
  for (const input of await inputs.all()) {
    await expect(input).not.toBeChecked();
    await expect(input).toHaveCSS("border-top-color", "rgb(99, 99, 99)");
    await expect(input).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
    await expect(input).toHaveCSS("background-image", "none");
    await input.check();
    const label = input.locator("xpath=following-sibling::span");
    if (await label.textContent() === "Missed calls") {
      await expect(input).toHaveCSS("border-top-color", "rgb(18, 189, 98)");
      await expect(input).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
      await expect(input).toHaveCSS("background-image", /%2312bd62/);
      await expect(label).toHaveCSS("color", "rgb(242, 173, 173)");
    } else {
      await expect(input).toHaveCSS("border-top-color", "rgb(4, 184, 76)");
      await expect(input).toHaveCSS("background-color", "rgb(4, 184, 76)");
      await expect(input).toHaveCSS("background-image", /%23181818/);
      await expect(input).toHaveCSS("width", "20px");
      await expect(input).toHaveCSS("height", "20px");
      await expect(label).toHaveCSS("color", "rgb(244, 244, 244)");
    }
    await input.uncheck();
    await expect(input).toHaveCSS("border-top-color", "rgb(99, 99, 99)");
  }
});
