import { test, expect } from "@playwright/test";

test("all 28 problems, independent confirmation, expansion, and pending personalized mappings", async ({ page }) => {
  await page.goto("/");
  const cards = page.locator(".problem-card");
  await expect(cards).toHaveCount(28);
  const missed = page.locator('[data-problem="problem-1"]');
  const slow = page.locator('[data-problem="problem-5"]');
  const confirmation = missed.getByRole("checkbox", { name: "Missed calls", exact: true });
  await missed.getByRole("button", { name: "Expand Missed calls" }).click();
  await expect(confirmation).not.toBeChecked();
  await confirmation.check();
  await expect(missed.getByRole("checkbox", { name: "Lost leads" })).not.toBeChecked();
  await confirmation.uncheck();
  await expect(missed.getByRole("heading", { name: "Solution", exact: true })).toBeVisible();
  await slow.getByRole("button", { name: "Expand Slow response to new leads" }).click();
  await expect(missed.getByRole("heading", { name: "Solution", exact: true })).toBeVisible();
  await expect(slow.getByRole("heading", { name: "Solution", exact: true })).toBeVisible();
  const buyer = missed.getByRole("checkbox", { name: "Lost leads" });
  const money = missed.getByRole("checkbox", { name: "Lost potential revenue" });
  await buyer.check();
  await expect(missed.locator(".outcome-list li")).toHaveCount(0);
  await expect(money).not.toBeChecked();
  await money.check();
  await expect(missed.locator(".outcome-list li")).toHaveCount(0);
  await expect(slow.getByRole("checkbox", { name: "Lost leads" })).not.toBeChecked();
  await missed.getByText("How the agent functions", { exact: true }).click();
  await missed.getByText("How it produces operational outcomes", { exact: true }).click();
  await missed.getByText("How it produces financial outcomes", { exact: true }).click();
  await expect(missed.locator("details[open]")).toHaveCount(3);
  await expect(missed.locator(".muted-function").filter({ hasText: "Routes urgent callers" })).toHaveCount(1);
  await expect(missed.locator(".explanation")).toHaveCount(0);
  await missed.getByRole("button", { name: "All benefits" }).click();
  await expect(missed.locator(".outcome-list li")).toHaveCount(6);
  await expect(missed.locator(".muted-function")).toHaveCount(0);
  await expect(missed.locator(".explanation")).toHaveCount(6);
  await expect(missed.getByRole("checkbox", { name: "Wasted marketing spend" })).not.toBeChecked();
  await expect(slow.getByRole("button", { name: "Personalized" })).toHaveAttribute("aria-pressed", "true");
  await missed.getByRole("button", { name: "Collapse Missed calls" }).click();
  await missed.getByRole("button", { name: "Expand Missed calls" }).click();
  await expect(missed.getByRole("button", { name: "All benefits" })).toHaveAttribute("aria-pressed", "true");
  await expect(buyer).toBeChecked();
  await expect(money).toBeChecked();
  await expect(missed.locator("details[open]")).toHaveCount(3);
  await missed.getByRole("button", { name: "Personalized" }).click();
  await expect(missed.locator(".outcome-list li")).toHaveCount(0);
  await buyer.uncheck();
  await expect(missed.locator(".outcome-list li")).toHaveCount(0);
  await expect(missed.locator(".explanation")).toHaveCount(0);
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

test("all seven category subtitles and all 28 problem cards are in the requested order", async ({ page }) => {
  await page.goto("/");
  const groups = page.locator(".problem-category");
  const expected = [
    ["Leads", [1,2,5,6,7,8,9,10,11]],
    ["Appointments", [3,12,13,14,15,16]],
    ["Buyers", [4,18,21]],
    ["Employees", [17,19,20,28]],
    ["Payments", [22,23]],
    ["Reviews", [24]],
    ["Business information", [25,26,27]],
  ] as const;
  await expect(groups).toHaveCount(expected.length);
  await expect(page.locator(".problem-card")).toHaveCount(28);
  for (let i = 0; i < expected.length; i++) {
    const group = groups.nth(i);
    const [title, ids] = expected[i];
    const subtitle = group.locator(".problem-category-title");
    await expect(subtitle).toHaveText(title);
    await expect(subtitle).toHaveCSS("font-style", "italic");
    await expect(subtitle).toHaveCSS("font-weight", "700");
    await expect(subtitle.locator("input, button, svg")).toHaveCount(0);
    await expect(group.locator(".problem-card")).toHaveCount(ids.length);
    expect(await group.locator(".problem-card").evaluateAll(cards => cards.map(card => card.getAttribute("data-problem")))).toEqual(ids.map(id => "problem-" + id));
  }
  const lead = page.locator('[data-problem="problem-1"]');
  const appointment = page.locator('[data-problem="problem-14"]');
  await lead.getByRole("button", { name: /^Expand/ }).click();
  await appointment.getByRole("button", { name: /^Expand/ }).click();
  await lead.getByRole("checkbox").first().check();
  await expect(appointment.getByRole("checkbox").first()).not.toBeChecked();
  await expect(lead.getByRole("heading", { name: "Solution", exact: true })).toBeVisible();
  await expect(appointment.getByRole("heading", { name: "Solution", exact: true })).toBeVisible();
});

test("existing problem titles and sample agent content are preserved", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".problem-confirm > span")).toHaveText(["Missed calls","Calls outside working hours","Slow response to new leads","New leads never called","Late lead qualifications","Warm leads not contacted","Old leads not called","Inconsistent follow-up with old leads","Warm old leads not contacted again","Missed bookings during calls","Missed appointment reminders","Unconfirmed appointments","Appointment no-shows","Time-consuming appointment rescheduling","Empty slots after cancellations","Urgent calls not reaching employees","Slow answers to simple questions","Basic buyer requests not handled","Many routine questions","Employees answering the same questions","Too much manual work","Employees overloaded","Missed payment reminders","Invoices not followed up regularly","Buyers not asked for reviews","Missing call recordings and outcomes","Lead details not updated in CRM","Hard to see what the AI agent is doing"]);
  const missed = page.locator('[data-problem="problem-1"]');
  await missed.getByRole("button", { name: /^Expand/ }).click();
  await expect(missed.getByRole("checkbox", { name: "Lost leads", exact: true })).toBeVisible();
  await missed.getByRole("button", { name: "All benefits" }).click();
  await expect(missed.locator(".outcome-list").getByText("More urgent callers connected to employees", { exact: true })).toBeVisible();
  await missed.getByText("How the agent functions", { exact: true }).click();
  await expect(missed.locator(".function-list")).toContainText("Routes urgent callers to the appropriate employee, when configured.");
  const guardian = page.locator('[data-problem="problem-14"]');
  await guardian.getByRole("button", { name: /^Expand/ }).click();
  await guardian.getByRole("checkbox", { name: "Unused appointment slots" }).check();
  await guardian.getByRole("checkbox", { name: "Wasted staffing costs" }).check();
  await expect(guardian.locator(".outcome-list li")).toHaveCount(0);
  await guardian.getByRole("button", { name: "All benefits" }).click();
  await expect(guardian.locator(".outcome-list").getByText("More buyers reminded before appointments", { exact: true })).toBeVisible();
  await expect(guardian.locator(".outcome-list").getByText("Potentially less wasted employees' time", { exact: true })).toBeVisible();
});

test("all approved negative impacts appear exactly in order, default unchecked, and remain independent", async ({ page }) => {
  test.setTimeout(120000);
  await page.goto("/");
  const expected = [
  {
    "id": "problem-1",
    "operational": [
      "Lost leads"
    ],
    "financial": [
      "Lost potential revenue",
      "Wasted marketing spend",
      "Higher cost per customer"
    ]
  },
  {
    "id": "problem-2",
    "operational": [
      "Lost leads"
    ],
    "financial": [
      "Lost potential revenue",
      "Wasted marketing spend"
    ]
  },
  {
    "id": "problem-3",
    "operational": [
      "Fewer appointments booked"
    ],
    "financial": [
      "Lost potential revenue"
    ]
  },
  {
    "id": "problem-4",
    "operational": [
      "Fewer customers served",
      "Lost existing customers"
    ],
    "financial": [
      "Lost potential revenue"
    ]
  },
  {
    "id": "problem-5",
    "operational": [
      "Lost leads"
    ],
    "financial": [
      "Lost potential revenue",
      "Wasted marketing spend",
      "Higher cost per customer"
    ]
  },
  {
    "id": "problem-6",
    "operational": [
      "Lost leads"
    ],
    "financial": [
      "Lost potential revenue",
      "Wasted marketing spend",
      "Higher cost per customer"
    ]
  },
  {
    "id": "problem-7",
    "operational": [
      "Lost qualified leads"
    ],
    "financial": [
      "Lost potential revenue",
      "Higher cost per customer"
    ]
  },
  {
    "id": "problem-8",
    "operational": [
      "Lost leads"
    ],
    "financial": [
      "Lost potential revenue",
      "Wasted marketing spend"
    ]
  },
  {
    "id": "problem-9",
    "operational": [
      "Fewer old leads reactivated"
    ],
    "financial": [
      "Lost potential revenue",
      "Higher marketing costs"
    ]
  },
  {
    "id": "problem-10",
    "operational": [
      "Fewer old leads reactivated",
      "Lost leads"
    ],
    "financial": [
      "Lost potential revenue",
      "Higher marketing costs"
    ]
  },
  {
    "id": "problem-11",
    "operational": [
      "Lost leads"
    ],
    "financial": [
      "Lost potential revenue",
      "Higher marketing costs"
    ]
  },
  {
    "id": "problem-12",
    "operational": [
      "Fewer appointments attended",
      "Unused appointment slots"
    ],
    "financial": [
      "Lost potential revenue",
      "Wasted staffing costs"
    ]
  },
  {
    "id": "problem-13",
    "operational": [
      "Fewer appointments attended",
      "Unused appointment slots"
    ],
    "financial": [
      "Lost potential revenue",
      "Wasted staffing costs"
    ]
  },
  {
    "id": "problem-14",
    "operational": [
      "Unused appointment slots",
      "Fewer customers served"
    ],
    "financial": [
      "Lost potential revenue",
      "Wasted staffing costs"
    ]
  },
  {
    "id": "problem-15",
    "operational": [
      "Fewer appointments attended",
      "Less staff time available for other work"
    ],
    "financial": [
      "Lost potential revenue",
      "Higher staffing costs"
    ]
  },
  {
    "id": "problem-16",
    "operational": [
      "Fewer customers served"
    ],
    "financial": [
      "Lost potential revenue",
      "Wasted staffing costs"
    ]
  },
  {
    "id": "problem-17",
    "operational": [
      "Less staff time available for other work",
      "Fewer tasks completed"
    ],
    "financial": [
      "Higher staffing costs",
      "Wasted staffing costs",
      "Lost potential revenue"
    ]
  },
  {
    "id": "problem-18",
    "operational": [
      "Fewer customers served",
      "Lost existing customers"
    ],
    "financial": [
      "Lost potential revenue"
    ]
  },
  {
    "id": "problem-19",
    "operational": [
      "Less staff time available for other work"
    ],
    "financial": [
      "Wasted staffing costs",
      "Higher staffing costs"
    ]
  },
  {
    "id": "problem-20",
    "operational": [
      "Less staff time available for other work",
      "Fewer tasks completed",
      "Fewer customers served"
    ],
    "financial": [
      "Higher staffing costs",
      "Wasted staffing costs",
      "Lost potential revenue"
    ]
  },
  {
    "id": "problem-21",
    "operational": [
      "Fewer customers served",
      "Lost existing customers"
    ],
    "financial": [
      "Lost potential revenue"
    ]
  },
  {
    "id": "problem-22",
    "operational": [
      "More unpaid invoices"
    ],
    "financial": [
      "Delayed cash collection"
    ]
  },
  {
    "id": "problem-23",
    "operational": [
      "More unpaid invoices"
    ],
    "financial": [
      "Delayed cash collection",
      "Money lost from unpaid invoices",
      "Higher collection costs"
    ]
  },
  {
    "id": "problem-24",
    "operational": [
      "Fewer customer reviews",
      "Fewer new customers"
    ],
    "financial": [
      "Lost potential revenue",
      "Higher cost per customer"
    ]
  },
  {
    "id": "problem-25",
    "operational": [
      "Missing business information"
    ],
    "financial": []
  },
  {
    "id": "problem-26",
    "operational": [
      "Missing business information",
      "Lost leads"
    ],
    "financial": [
      "Lost potential revenue",
      "Wasted marketing spend"
    ]
  },
  {
    "id": "problem-27",
    "operational": [
      "Missing business information"
    ],
    "financial": []
  },
  {
    "id": "problem-28",
    "operational": [
      "Fewer tasks completed",
      "Fewer customers served",
      "Lost leads"
    ],
    "financial": [
      "Higher staffing costs",
      "Lost potential revenue"
    ]
  }
];
  await expect(page.locator(".problem-card")).toHaveCount(28);
  await expect(page.locator("input[type=checkbox]:checked")).toHaveCount(0);
  for (const item of expected) {
    const card = page.locator('[data-problem="' + item.id + '"]');
    await card.getByRole("button", { name: /^Expand/ }).click();
    for (const [i, labels] of [item.operational, item.financial].entries()) {
      const column = card.locator(".impact-columns > div").nth(i);
      const inputs = column.getByRole("checkbox");
      await expect(inputs).toHaveCount(labels.length);
      expect(await column.locator(".circle-label > span").allTextContents()).toEqual(labels);
      if (!labels.length) await expect(column.locator(".empty-note, .impact-list")).toHaveCount(0);
      for (const label of labels) {
        const input = column.getByRole("checkbox", { name: label, exact: true });
        await expect(input).not.toBeChecked();
        await input.check();
        await expect(input).toBeChecked();
        await expect(card.locator(".solution-card .outcome-list li")).toHaveCount(0);
        await input.uncheck();
        await expect(input).not.toBeChecked();
      }
    }
    await expect(card.getByRole("checkbox").first()).not.toBeChecked();
    await card.getByRole("button", { name: /^Collapse/ }).click();
  }
  const missed = page.locator('[data-problem="problem-1"]');
  const slow = page.locator('[data-problem="problem-5"]');
  for (const card of [missed, slow]) await card.getByRole("button", { name: /^Expand/ }).click();
  await missed.getByRole("checkbox", { name: "Lost leads", exact: true }).check();
  await missed.getByRole("checkbox", { name: "Lost potential revenue", exact: true }).check();
  await expect(slow.getByRole("checkbox", { name: "Lost leads", exact: true })).not.toBeChecked();
  await expect(slow.getByRole("checkbox", { name: "Lost potential revenue", exact: true })).not.toBeChecked();
  await missed.getByRole("button", { name: /^Collapse/ }).click();
  await missed.getByRole("button", { name: /^Expand/ }).click();
  await expect(missed.getByRole("checkbox", { name: "Lost leads", exact: true })).toBeChecked();
  await expect(missed.getByRole("checkbox", { name: "Lost potential revenue", exact: true })).toBeChecked();
  await expect(missed.locator(".outcome-list li")).toHaveCount(0);
});
