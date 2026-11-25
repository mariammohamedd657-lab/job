import { test, expect } from "@playwright/test";
import { agents, problems } from "../app/discovery/data";
import { matchedSolutions } from "../app/discovery/model";

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
  for (const [id, agent] of [["problem-9", "Lead Revival Agent"], ["problem-14", "Appointment Guardian Agent"], ["problem-2", "Inbound Agent"]]) {
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
    for (const header of await card.locator(".agent-header").all()) {
      await expect(header.locator("h3")).toHaveCSS("color", "rgb(183, 223, 190)");
      await expect(header).toHaveCSS("align-items", "center");
      await expect(header.locator("p")).toHaveCount(0);
      await expect(header.locator(".agent-icon")).toHaveCount(1);
    }
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

test("all approved problem-to-solution mappings, direct and conditional, and card counts", async ({ page }) => {
  test.setTimeout(120000);
  const expected = [
  {
    "id": "problem-1",
    "ids": [
      "inbound"
    ],
    "names": [
      "Inbound Agent"
    ],
    "conditions": [
      {
        "solutionId": "inbound",
        "type": "direct",
        "condition": "Direct match."
      }
    ]
  },
  {
    "id": "problem-2",
    "ids": [
      "inbound"
    ],
    "names": [
      "Inbound Agent"
    ],
    "conditions": [
      {
        "solutionId": "inbound",
        "type": "direct",
        "condition": "Direct match for unanswered incoming calls outside working hours."
      }
    ]
  },
  {
    "id": "problem-3",
    "ids": [
      "inbound",
      "speed",
      "revival"
    ],
    "names": [
      "Inbound Agent",
      "Speed-to-Lead Agent",
      "Lead Revival Agent"
    ],
    "conditions": [
      {
        "solutionId": "inbound",
        "type": "conditional",
        "condition": "Inbound applies to incoming calls."
      },
      {
        "solutionId": "speed",
        "type": "conditional",
        "condition": "Speed-to-Lead applies to calls to new leads."
      },
      {
        "solutionId": "revival",
        "type": "conditional",
        "condition": "Lead Revival applies to calls to old leads."
      }
    ]
  },
  {
    "id": "problem-4",
    "ids": [
      "inbound"
    ],
    "names": [
      "Inbound Agent"
    ],
    "conditions": [
      {
        "solutionId": "inbound",
        "type": "conditional",
        "condition": "Routes urgent incoming calls to staff according to configured routing rules."
      }
    ]
  },
  {
    "id": "problem-5",
    "ids": [
      "speed"
    ],
    "names": [
      "Speed-to-Lead Agent"
    ],
    "conditions": [
      {
        "solutionId": "speed",
        "type": "direct",
        "condition": "Direct match."
      }
    ]
  },
  {
    "id": "problem-6",
    "ids": [
      "speed"
    ],
    "names": [
      "Speed-to-Lead Agent"
    ],
    "conditions": [
      {
        "solutionId": "speed",
        "type": "direct",
        "condition": "Direct match."
      }
    ]
  },
  {
    "id": "problem-7",
    "ids": [
      "speed",
      "inbound"
    ],
    "names": [
      "Speed-to-Lead Agent",
      "Inbound Agent"
    ],
    "conditions": [
      {
        "solutionId": "speed",
        "type": "conditional",
        "condition": "Speed-to-Lead applies to new outbound leads."
      },
      {
        "solutionId": "inbound",
        "type": "conditional",
        "condition": "Inbound applies to leads calling the business."
      }
    ]
  },
  {
    "id": "problem-8",
    "ids": [
      "speed",
      "revival"
    ],
    "names": [
      "Speed-to-Lead Agent",
      "Lead Revival Agent"
    ],
    "conditions": [
      {
        "solutionId": "speed",
        "type": "conditional",
        "condition": "Speed-to-Lead applies to new leads within the configured follow-up process."
      },
      {
        "solutionId": "revival",
        "type": "conditional",
        "condition": "Lead Revival applies to old leads."
      }
    ]
  },
  {
    "id": "problem-9",
    "ids": [
      "revival"
    ],
    "names": [
      "Lead Revival Agent"
    ],
    "conditions": [
      {
        "solutionId": "revival",
        "type": "direct",
        "condition": "Direct match."
      }
    ]
  },
  {
    "id": "problem-10",
    "ids": [
      "revival"
    ],
    "names": [
      "Lead Revival Agent"
    ],
    "conditions": [
      {
        "solutionId": "revival",
        "type": "conditional",
        "condition": "Follow-up must be configured according to the business's requirements."
      }
    ]
  },
  {
    "id": "problem-11",
    "ids": [
      "revival"
    ],
    "names": [
      "Lead Revival Agent"
    ],
    "conditions": [
      {
        "solutionId": "revival",
        "type": "conditional",
        "condition": "Further contact must be included in the configured follow-up process."
      }
    ]
  },
  {
    "id": "problem-12",
    "ids": [
      "guardian"
    ],
    "names": [
      "Appointment Guardian Agent"
    ],
    "conditions": [
      {
        "solutionId": "guardian",
        "type": "direct",
        "condition": "Direct match."
      }
    ]
  },
  {
    "id": "problem-13",
    "ids": [
      "guardian"
    ],
    "names": [
      "Appointment Guardian Agent"
    ],
    "conditions": [
      {
        "solutionId": "guardian",
        "type": "direct",
        "condition": "Direct match."
      }
    ]
  },
  {
    "id": "problem-14",
    "ids": [
      "guardian"
    ],
    "names": [
      "Appointment Guardian Agent"
    ],
    "conditions": [
      {
        "solutionId": "guardian",
        "type": "direct",
        "condition": "Addresses no-shows through reminders, confirmations and rescheduling."
      }
    ]
  },
  {
    "id": "problem-15",
    "ids": [
      "guardian"
    ],
    "names": [
      "Appointment Guardian Agent"
    ],
    "conditions": [
      {
        "solutionId": "guardian",
        "type": "direct",
        "condition": "Direct match."
      }
    ]
  },
  {
    "id": "problem-16",
    "ids": [
      "guardian"
    ],
    "names": [
      "Appointment Guardian Agent"
    ],
    "conditions": [
      {
        "solutionId": "guardian",
        "type": "conditional",
        "condition": "Conditional match. Earlier cancellations and rescheduling may give staff more time to fill available slots. Do not assume that the agent automatically finds replacement customers."
      }
    ]
  },
  {
    "id": "problem-17",
    "ids": [
      "support",
      "inbound"
    ],
    "names": [
      "Customer Support Agent",
      "Inbound Agent"
    ],
    "conditions": [
      {
        "solutionId": "support",
        "type": "conditional",
        "condition": "Customer Support handles routine customer questions."
      },
      {
        "solutionId": "inbound",
        "type": "conditional",
        "condition": "Inbound handles routine questions received during incoming calls."
      }
    ]
  },
  {
    "id": "problem-18",
    "ids": [
      "support",
      "inbound"
    ],
    "names": [
      "Customer Support Agent",
      "Inbound Agent"
    ],
    "conditions": [
      {
        "solutionId": "support",
        "type": "conditional",
        "condition": "Customer Support handles routine customer questions."
      },
      {
        "solutionId": "inbound",
        "type": "conditional",
        "condition": "Inbound handles approved questions during incoming calls."
      }
    ]
  },
  {
    "id": "problem-19",
    "ids": [
      "support",
      "inbound"
    ],
    "names": [
      "Customer Support Agent",
      "Inbound Agent"
    ],
    "conditions": [
      {
        "solutionId": "support",
        "type": "conditional",
        "condition": "Depends on where and how staff receive those questions. Answering routine customer questions and handling supported requests."
      },
      {
        "solutionId": "inbound",
        "type": "conditional",
        "condition": "Depends on where and how staff receive those questions. Answering incoming calls."
      }
    ]
  },
  {
    "id": "problem-20",
    "ids": [
      "inbound",
      "speed",
      "revival",
      "guardian",
      "support",
      "payments",
      "reviews",
      "crm"
    ],
    "names": [
      "Inbound Agent",
      "Speed-to-Lead Agent",
      "Lead Revival Agent",
      "Appointment Guardian Agent",
      "Customer Support Agent",
      "Payments & Collections Agent",
      "Review Request Agent",
      "CRM Integration"
    ],
    "conditions": [
      {
        "solutionId": "inbound",
        "type": "conditional",
        "condition": "Each solution applies only if its specific tasks form part of the manual workload. Answering incoming calls."
      },
      {
        "solutionId": "speed",
        "type": "conditional",
        "condition": "Each solution applies only if its specific tasks form part of the manual workload. Calling and qualifying new leads."
      },
      {
        "solutionId": "revival",
        "type": "conditional",
        "condition": "Each solution applies only if its specific tasks form part of the manual workload. Following up with old leads."
      },
      {
        "solutionId": "guardian",
        "type": "conditional",
        "condition": "Each solution applies only if its specific tasks form part of the manual workload. Confirming and rescheduling appointments."
      },
      {
        "solutionId": "support",
        "type": "conditional",
        "condition": "Each solution applies only if its specific tasks form part of the manual workload. Answering routine customer questions and handling supported requests."
      },
      {
        "solutionId": "payments",
        "type": "conditional",
        "condition": "Each solution applies only if its specific tasks form part of the manual workload. Following up on outstanding payments."
      },
      {
        "solutionId": "reviews",
        "type": "conditional",
        "condition": "Each solution applies only if its specific tasks form part of the manual workload. Requesting customer reviews."
      },
      {
        "solutionId": "crm",
        "type": "conditional",
        "condition": "Each solution applies only if its specific tasks form part of the manual workload. Manually entering lead information."
      }
    ]
  },
  {
    "id": "problem-21",
    "ids": [
      "support"
    ],
    "names": [
      "Customer Support Agent"
    ],
    "conditions": [
      {
        "solutionId": "support",
        "type": "conditional",
        "condition": "Applies to supported customer requests."
      }
    ]
  },
  {
    "id": "problem-22",
    "ids": [
      "payments"
    ],
    "names": [
      "Payments & Collections Agent"
    ],
    "conditions": [
      {
        "solutionId": "payments",
        "type": "direct",
        "condition": "Direct match."
      }
    ]
  },
  {
    "id": "problem-23",
    "ids": [
      "payments"
    ],
    "names": [
      "Payments & Collections Agent"
    ],
    "conditions": [
      {
        "solutionId": "payments",
        "type": "direct",
        "condition": "Direct match."
      }
    ]
  },
  {
    "id": "problem-24",
    "ids": [
      "reviews"
    ],
    "names": [
      "Review Request Agent"
    ],
    "conditions": [
      {
        "solutionId": "reviews",
        "type": "direct",
        "condition": "Direct match."
      }
    ]
  },
  {
    "id": "problem-25",
    "ids": [
      "dashboard"
    ],
    "names": [
      "Smart Dashboard"
    ],
    "conditions": [
      {
        "solutionId": "dashboard",
        "type": "direct",
        "condition": "Provides access to call activity, recordings, transcripts and outcomes."
      }
    ]
  },
  {
    "id": "problem-26",
    "ids": [
      "crm"
    ],
    "names": [
      "CRM Integration"
    ],
    "conditions": [
      {
        "solutionId": "crm",
        "type": "direct",
        "condition": "Records collected information and call outcomes through configured CRM connections."
      }
    ]
  },
  {
    "id": "problem-27",
    "ids": [
      "dashboard"
    ],
    "names": [
      "Smart Dashboard"
    ],
    "conditions": [
      {
        "solutionId": "dashboard",
        "type": "direct",
        "condition": "Displays agent activity, call activity, booking outcomes, failed requests and call quality scores."
      }
    ]
  },
  {
    "id": "problem-28",
    "ids": [
      "inbound",
      "speed",
      "revival",
      "guardian",
      "support",
      "payments",
      "reviews"
    ],
    "names": [
      "Inbound Agent",
      "Speed-to-Lead Agent",
      "Lead Revival Agent",
      "Appointment Guardian Agent",
      "Customer Support Agent",
      "Payments & Collections Agent",
      "Review Request Agent"
    ],
    "conditions": [
      {
        "solutionId": "inbound",
        "type": "conditional",
        "condition": "Each solution applies only if its specific tasks contribute to the staff's workload. Answering incoming calls."
      },
      {
        "solutionId": "speed",
        "type": "conditional",
        "condition": "Each solution applies only if its specific tasks contribute to the staff's workload. Calling and qualifying new leads."
      },
      {
        "solutionId": "revival",
        "type": "conditional",
        "condition": "Each solution applies only if its specific tasks contribute to the staff's workload. Following up with old leads."
      },
      {
        "solutionId": "guardian",
        "type": "conditional",
        "condition": "Each solution applies only if its specific tasks contribute to the staff's workload. Confirming and rescheduling appointments."
      },
      {
        "solutionId": "support",
        "type": "conditional",
        "condition": "Each solution applies only if its specific tasks contribute to the staff's workload. Answering routine customer questions and handling supported requests."
      },
      {
        "solutionId": "payments",
        "type": "conditional",
        "condition": "Each solution applies only if its specific tasks contribute to the staff's workload. Following up on outstanding payments."
      },
      {
        "solutionId": "reviews",
        "type": "conditional",
        "condition": "Each solution applies only if its specific tasks contribute to the staff's workload. Requesting customer reviews."
      }
    ]
  }
];
  expect(Object.keys(agents)).toHaveLength(9);
  expect(Object.values(agents).filter(agent => agent.kind === "shared-feature").map(agent => agent.name)).toEqual(["Smart Dashboard", "CRM Integration"]);
  await page.goto("/");
  await expect(page.locator(".problem-card")).toHaveCount(28);
  for (const item of expected) {
    const problem = problems.find(p => p.id === item.id)!;
    expect(problem.solutions.map(({ solutionId, type, condition }) => ({ solutionId, type, condition }))).toEqual(item.conditions);
    expect(problem.solutions.every(rel => rel.problemId === item.id && !rel.negativeOperationalImpactIds.length && !rel.negativeFinancialImpactIds.length && !rel.positiveOperationalOutcomeIds.length && !rel.positiveFinancialOutcomeIds.length && !rel.functionIds.length && !rel.operationalOutcomeExplanations.length && !rel.financialOutcomeExplanations.length)).toBe(true);
    const card = page.locator('[data-problem="' + item.id + '"]');
    await card.getByRole("button", { name: /^Expand/ }).click();
    await expect(card.locator(".solution-card")).toHaveCount(item.ids.length);
    await expect(card.locator(".agent-header h3")).toHaveText(item.names);
    expect(await card.locator(".solution-entry").evaluateAll(nodes => nodes.map(node => node.getAttribute("data-solution")))).toEqual(item.ids);
    for (const entry of await card.locator(".solution-entry").all()) {
      await expect(entry.locator(".mode-control")).toBeVisible();
      await expect(entry.getByRole("button", { name: "Personalized" })).toHaveAttribute("aria-pressed", "true");
      await expect(entry.locator(".solution-card")).toHaveCSS("border-radius", "13px");
      await expect(entry.locator(".agent-header .agent-icon")).toHaveCount(1);
      await expect(entry.locator("details")).toHaveCount(3);
      await expect(entry.locator(".outcome-list li")).toHaveCount(0);
    }
    await card.getByRole("button", { name: /^Collapse/ }).click();
  }
});
test("solution arrays render independently with no duplicates and support adding and removing entries", async ({ page }) => {
  const problem = problems.find(p => p.id === "problem-3")!;
  const extra = { ...problem.solutions[0], solutionId: "crm" };
  expect(matchedSolutions({ ...problem, solutions: [...problem.solutions, extra, extra] }, agents).map(a => a.id)).toEqual(["inbound","speed","revival","crm"]);
  expect(matchedSolutions({ ...problem, solutions: problem.solutions.slice(1) }, agents).map(a => a.id)).toEqual(["speed","revival"]);
  expect(matchedSolutions({ ...problem, solutions: [] }, agents)).toEqual([]);
  await page.goto("/");
  const card = page.locator('[data-problem="problem-3"]');
  await card.getByRole("button", { name: /^Expand/ }).click();
  const inbound = card.locator('[data-solution="inbound"]');
  const speed = card.locator('[data-solution="speed"]');
  const revival = card.locator('[data-solution="revival"]');
  await card.getByRole("checkbox", { name: "Fewer appointments booked", exact: true }).check();
  await inbound.getByRole("button", { name: "All benefits" }).click();
  await inbound.getByText("How the agent functions", { exact: true }).click();
  await inbound.getByText("How it produces operational outcomes", { exact: true }).click();
  await speed.getByText("How it produces financial outcomes", { exact: true }).click();
  await expect(inbound.locator("details[open]")).toHaveCount(2);
  await expect(speed.locator("details[open]")).toHaveCount(1);
  await expect(revival.locator("details[open]")).toHaveCount(0);
  await expect(speed.getByRole("button", { name: "Personalized" })).toHaveAttribute("aria-pressed", "true");
  await expect(revival.getByRole("button", { name: "Personalized" })).toHaveAttribute("aria-pressed", "true");
  await card.getByRole("button", { name: /^Collapse/ }).click();
  await card.getByRole("button", { name: /^Expand/ }).click();
  await expect(card.getByRole("checkbox", { name: "Fewer appointments booked", exact: true })).toBeChecked();
  await expect(inbound.getByRole("button", { name: "All benefits" })).toHaveAttribute("aria-pressed", "true");
  await expect(inbound.locator("details[open]")).toHaveCount(2);
  await expect(speed.locator("details[open]")).toHaveCount(1);
  await expect(revival.locator("details[open]")).toHaveCount(0);
  await speed.getByRole("button", { name: "All benefits" }).click();
  await inbound.getByRole("button", { name: "Personalized" }).click();
  await expect(speed.getByRole("button", { name: "All benefits" })).toHaveAttribute("aria-pressed", "true");
  await expect(revival.getByRole("button", { name: "Personalized" })).toHaveAttribute("aria-pressed", "true");
  await expect(card.locator(".outcome-list li")).toHaveCount(0);
  await expect(card.getByRole("checkbox", { name: "Fewer appointments booked", exact: true })).toBeChecked();
  const other = page.locator('[data-problem="problem-1"]');
  await other.getByRole("button", { name: /^Expand/ }).click();
  await expect(other.getByRole("button", { name: "Personalized" })).toHaveAttribute("aria-pressed", "true");
});
