import { test, expect } from "@playwright/test";
import { agents, problems } from "../app/discovery/data";
import { functionLibrary, configurationCapabilities, solutionFunctionReferences } from "../app/discovery/functions";
import { matchedSolutions, visibleOutcomes, initialState, relevantFunctions, visibleOutcomeExplanations } from "../app/discovery/model";
import { allBenefitExplanations, personalizedExplanations } from "../app/discovery/explanations";
import { personalizedFunctionRelationships, pendingPersonalizedRelationships } from "../app/discovery/personalized-functions";
import { positiveOutcomes, negativeToPositive, solutionOutcomeIds } from "../app/discovery/outcomes";

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
  await expect(missed.getByRole("checkbox", { name: "Lost leads" })).not.toBeChecked();
  await confirmation.uncheck();
  await expect(missed.getByRole("heading", { name: "Solution", exact: true })).toBeVisible();
  await slow.getByRole("button", { name: "Expand Slow response to new leads" }).click();
  await expect(missed.getByRole("heading", { name: "Solution", exact: true })).toBeVisible();
  await expect(slow.getByRole("heading", { name: "Solution", exact: true })).toBeVisible();
  const buyer = missed.getByRole("checkbox", { name: "Lost leads", exact: true });
  const money = missed.getByRole("checkbox", { name: "Wasted marketing spend", exact: true });
  const entry = missed.locator(".solution-entry");
  const op = entry.locator(".solution-card > .two-columns > div").nth(0);
  const fin = entry.locator(".solution-card > .two-columns > div").nth(1);
  await buyer.check();
  await expect(op.locator(".outcome-list li")).toHaveText(["Fewer lost leads"]);
  await expect(fin.locator(".outcome-list li")).toHaveCount(0);
  await expect(money).not.toBeChecked();
  await money.check();
  await expect(fin.locator(".outcome-list li")).toHaveText(["Less wasted marketing spend"]);
  await expect(slow.getByRole("checkbox", { name: "Lost leads" })).not.toBeChecked();
  await missed.getByText("How the agent functions", { exact: true }).click();
  await missed.getByText("How it produces operational outcomes", { exact: true }).click();
  await missed.getByText("How it produces financial outcomes", { exact: true }).click();
  await expect(missed.locator("details[open]")).toHaveCount(3);
  await expect(missed.locator(".function-list li > span")).toHaveText(["Answers incoming calls"]);
  await expect(missed.locator(".personalized-function")).toHaveCSS("color", "rgb(16, 184, 92)");
  await expect(missed.locator(".explanation")).toHaveCount(2);
  await missed.getByRole("button", { name: "All benefits" }).click();
  await expect(op.locator(".outcome-list li")).toHaveText(["Fewer lost leads","Fewer lost qualified leads","More appointments booked","More buyers served","Fewer lost existing buyers","More employee time available for other work"]);
  await expect(fin.locator(".outcome-list li")).toHaveText(["Increased revenue potential","Less wasted marketing spend","Lower cost per buyer","Lower employee costs","Less wasted employee costs"]);
  await expect(missed.locator(".muted-function")).toHaveCount(0);
  await expect(missed.locator(".explanation")).toHaveCount(11);
  await expect(money).toBeChecked();
  await expect(slow.getByRole("button", { name: "Personalized" })).toHaveAttribute("aria-pressed", "true");
  await missed.getByRole("button", { name: "Collapse Missed calls" }).click();
  await missed.getByRole("button", { name: "Expand Missed calls" }).click();
  await expect(missed.getByRole("button", { name: "All benefits" })).toHaveAttribute("aria-pressed", "true");
  await expect(buyer).toBeChecked();
  await expect(money).toBeChecked();
  await expect(missed.locator("details[open]")).toHaveCount(3);
  await missed.getByRole("button", { name: "Personalized" }).click();
  await expect(op.locator(".outcome-list li")).toHaveText(["Fewer lost leads"]);
  await expect(fin.locator(".outcome-list li")).toHaveText(["Less wasted marketing spend"]);
  await buyer.uncheck();
  await expect(op.locator(".outcome-list li")).toHaveCount(0);
  await expect(fin.locator(".outcome-list li")).toHaveText(["Less wasted marketing spend"]);
  await money.uncheck();
  await expect(fin.locator(".outcome-list li")).toHaveCount(0);
  await expect(op.locator(".empty-note")).toHaveText("No related operational impact has been confirmed.");
  await expect(fin.locator(".empty-note")).toHaveText("No related financial impact has been confirmed.");
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
      await expect(header.locator("p")).toHaveCount(1);
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
  await expect(missed.locator(".outcome-list").getByText("Fewer lost existing buyers", { exact: true })).toBeVisible();
  await missed.getByText("How the agent functions", { exact: true }).click();
  await expect(missed.locator(".function-list")).toContainText("The agent identifies when a caller needs to speak to a person. It transfers the call to the right staff member or department using the business\'s transfer rules, contact numbers and working hours.");
  const guardian = page.locator('[data-problem="problem-14"]');
  await guardian.getByRole("button", { name: /^Expand/ }).click();
  await guardian.getByRole("checkbox", { name: "Unused appointment slots" }).check();
  await guardian.getByRole("checkbox", { name: "Wasted employee costs" }).check();
  await expect(guardian.locator(".outcome-list li")).toHaveText(["Fewer unused appointment slots", "Less wasted employee costs"]);
  await guardian.getByRole("button", { name: "All benefits" }).click();
  await expect(guardian.locator(".outcome-list").getByText("More appointments attended", { exact: true })).toBeVisible();
  await expect(guardian.locator(".outcome-list").getByText("Less wasted employee costs", { exact: true })).toBeVisible();
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
      "Higher cost per buyer"
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
      "Fewer buyers served",
      "Lost existing buyers"
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
      "Higher cost per buyer"
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
      "Higher cost per buyer"
    ]
  },
  {
    "id": "problem-7",
    "operational": [
      "Lost qualified leads"
    ],
    "financial": [
      "Lost potential revenue",
      "Higher cost per buyer"
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
      "Wasted employee costs"
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
      "Wasted employee costs"
    ]
  },
  {
    "id": "problem-14",
    "operational": [
      "Unused appointment slots",
      "Fewer buyers served"
    ],
    "financial": [
      "Lost potential revenue",
      "Wasted employee costs"
    ]
  },
  {
    "id": "problem-15",
    "operational": [
      "Fewer appointments attended",
      "Less employee time available for other work"
    ],
    "financial": [
      "Lost potential revenue",
      "Higher employee costs"
    ]
  },
  {
    "id": "problem-16",
    "operational": [
      "Fewer buyers served"
    ],
    "financial": [
      "Lost potential revenue",
      "Wasted employee costs"
    ]
  },
  {
    "id": "problem-17",
    "operational": [
      "Less employee time available for other work",
      "Fewer tasks completed"
    ],
    "financial": [
      "Higher employee costs",
      "Wasted employee costs",
      "Lost potential revenue"
    ]
  },
  {
    "id": "problem-18",
    "operational": [
      "Fewer buyers served",
      "Lost existing buyers"
    ],
    "financial": [
      "Lost potential revenue"
    ]
  },
  {
    "id": "problem-19",
    "operational": [
      "Less employee time available for other work"
    ],
    "financial": [
      "Wasted employee costs",
      "Higher employee costs"
    ]
  },
  {
    "id": "problem-20",
    "operational": [
      "Less employee time available for other work",
      "Fewer tasks completed",
      "Fewer buyers served"
    ],
    "financial": [
      "Higher employee costs",
      "Wasted employee costs",
      "Lost potential revenue"
    ]
  },
  {
    "id": "problem-21",
    "operational": [
      "Fewer buyers served",
      "Lost existing buyers"
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
      "Fewer buyer reviews",
      "Fewer new buyers"
    ],
    "financial": [
      "Lost potential revenue",
      "Higher cost per buyer"
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
      "Fewer buyers served",
      "Lost leads"
    ],
    "financial": [
      "Higher employee costs",
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
        const problem = problems.find(p => p.id === item.id)!;
        const kind = i === 0 ? "operational" : "financial";
        const impact = (i === 0 ? problem.operationalImpacts : problem.financialImpacts).find(x => x.label === label)!;
        const outcomeId = negativeToPositive[kind][impact.id];
        for (const rel of problem.solutions) {
          const agent = agents[rel.solutionId];
          const entry = card.locator('[data-solution="' + agent.id + '"]');
          const supported = solutionOutcomeIds[agent.id][kind].includes(outcomeId);
          const outcomeColumn = entry.locator(".solution-card > .two-columns > div").nth(i);
          const otherColumn = entry.locator(".solution-card > .two-columns > div").nth(1-i);
          if (supported) await expect(outcomeColumn.locator(".outcome-list li")).toHaveText([positiveOutcomes[outcomeId].title]);
          else await expect(outcomeColumn.locator(".outcome-list li")).toHaveCount(0);
          await expect(otherColumn.locator(".outcome-list li")).toHaveCount(0);
        }
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
  await expect(missed.locator(".outcome-list li")).toHaveText(["Fewer lost leads", "Increased revenue potential"]);
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
  await expect(inbound.locator(".outcome-list li")).toHaveText(["More appointments booked"]);
  await expect(revival.locator(".outcome-list li")).toHaveText(["More appointments booked"]);
  await expect(speed.locator(".outcome-list li")).toHaveCount(10);
  await expect(card.getByRole("checkbox", { name: "Fewer appointments booked", exact: true })).toBeChecked();
  const other = page.locator('[data-problem="problem-1"]');
  await other.getByRole("button", { name: /^Expand/ }).click();
  await expect(other.getByRole("button", { name: "Personalized" })).toHaveAttribute("aria-pressed", "true");
});

test("approved overview and shared function content is visible in each existing card, with no proposed capabilities", async ({ page }) => {
  test.setTimeout(120000);
  expect(Object.keys(agents)).toHaveLength(9);
  expect(Object.keys(solutionFunctionReferences)).toHaveLength(12);
  expect(configurationCapabilities).toHaveLength(15);
  expect(Object.keys(functionLibrary)).toHaveLength(48);
  expect(Object.values(functionLibrary).filter(fn => fn.availability === "proposed").map(fn => fn.name)).toEqual(["Contacts waitlisted customers after cancellations"]);
  expect(agents.inbound.functionIds).toContain("function-books-appointments");
  expect(agents.speed.functionIds).toContain("function-books-appointments");
  expect(agents.revival.functionIds).toContain("function-books-appointments");
  for (const [id, count] of Object.entries({"inbound":12,"speed":13,"revival":13,"guardian":11,"support":7,"payments":9,"reviews":3,"dashboard":7,"crm":5})) {
    expect(agents[id].functionIds).toHaveLength(count);
    expect(agents[id].functionIds).toEqual(solutionFunctionReferences[id].functionIds);
    expect(agents[id].overview).toBe(solutionFunctionReferences[id].overview);
    expect(agents[id].functionIds.every(fid => functionLibrary[fid] && functionLibrary[fid].availability !== "proposed")).toBe(true);
    for (const outcome of [...agents[id].operationalOutcomes, ...agents[id].financialOutcomes]) {
      expect(outcome.functionIds.every(fid => functionLibrary[fid] || agents[id].legacyPreviewFunctions?.some(fn => fn.id === fid))).toBe(true);
    }
  }
  await page.goto("/");
  for (const problem of problems) {
    const card = page.locator('[data-problem="' + problem.id + '"]');
    await card.getByRole("button", { name: /^Expand/ }).click();
    for (const relationship of problem.solutions) {
      const agent = agents[relationship.solutionId];
      const entry = card.locator('[data-solution="' + agent.id + '"]');
      const overview = entry.locator(".agent-header p");
      await expect(overview).toHaveText(agent.overview);
      await expect(overview).toBeVisible();
      await expect(entry.locator("details[open]")).toHaveCount(0);
      const list = entry.locator(".function-list");
      await expect(list).not.toBeVisible();
      const toggle = entry.getByText("How the agent functions", { exact: true });
      await toggle.click();
      await expect(list).toHaveCount(0);
      await entry.getByRole("button", { name: "All benefits" }).click();
      await expect(list).toBeVisible();
      const expected = agent.functionIds.map(id => functionLibrary[id]);
      expect(await list.locator("li > span").allTextContents()).toEqual(expected.map(fn => fn.name));
      expect(await list.locator("li > div").allTextContents()).toEqual(expected.map(fn => fn.description));
      await expect(list.locator(".relevant-function")).toHaveCount(expected.length);
      await expect(list.locator(".personalized-function")).toHaveCount(0);
      await expect(list.locator("li").first()).toHaveCSS("color", "rgb(244, 244, 244)");
      await expect(overview).toBeVisible();
      await toggle.click();
      await expect(list).not.toBeVisible();
      await expect(overview).toBeVisible();
      await entry.getByRole("button", { name: "Personalized" }).click();
    }
    await card.getByRole("button", { name: /^Collapse/ }).click();
  }
});

test("complete outcome libraries show on every assigned card, irrespective of selection or problem", async ({ page }) => {
  test.setTimeout(120000);
  const expected = {
  "inbound": {
    "operational": [
      "Fewer lost leads",
      "Fewer lost qualified leads",
      "More appointments booked",
      "More buyers served",
      "Fewer lost existing buyers",
      "More employee time available for other work"
    ],
    "financial": [
      "Increased revenue potential",
      "Less wasted marketing spend",
      "Lower cost per buyer",
      "Lower employee costs",
      "Less wasted employee costs"
    ]
  },
  "speed": {
    "operational": [
      "Fewer lost leads",
      "Fewer lost qualified leads",
      "More appointments booked",
      "More new buyers",
      "More employee time available for other work"
    ],
    "financial": [
      "Increased revenue potential",
      "Less wasted marketing spend",
      "Lower cost per buyer",
      "Lower employee costs",
      "Less wasted employee costs"
    ]
  },
  "revival": {
    "operational": [
      "More old leads reactivated",
      "Fewer lost leads",
      "Fewer lost qualified leads",
      "More appointments booked",
      "More new buyers",
      "More employee time available for other work"
    ],
    "financial": [
      "Increased revenue potential",
      "Less wasted marketing spend",
      "Lower cost per buyer",
      "Lower marketing costs",
      "Lower employee costs",
      "Less wasted employee costs"
    ]
  },
  "guardian": {
    "operational": [
      "More appointments attended",
      "Fewer unused appointment slots",
      "More buyers served",
      "More employee time available for other work"
    ],
    "financial": [
      "Increased revenue potential",
      "Less wasted employee costs",
      "Lower employee costs"
    ]
  },
  "support": {
    "operational": [
      "More buyers served",
      "Fewer lost existing buyers",
      "More employee time available for other work",
      "More tasks completed"
    ],
    "financial": [
      "Increased revenue potential",
      "Lower employee costs",
      "Less wasted employee costs"
    ]
  },
  "payments": {
    "operational": [
      "Fewer unpaid invoices",
      "More employee time available for other work"
    ],
    "financial": [
      "Faster cash collection",
      "Less money lost from unpaid invoices",
      "Lower collection costs"
    ]
  },
  "reviews": {
    "operational": [
      "More buyer reviews",
      "More new buyers"
    ],
    "financial": [
      "Increased revenue potential",
      "Lower cost per buyer"
    ]
  },
  "dashboard": {
    "operational": [
      "More complete business information"
    ],
    "financial": []
  },
  "crm": {
    "operational": [
      "More complete business information"
    ],
    "financial": []
  }
};
  expect(Object.keys(positiveOutcomes)).toHaveLength(23);
  await page.goto("/");
  for (const problem of problems) {
    const card = page.locator('[data-problem="' + problem.id + '"]');
    await card.getByRole("button", { name: /^Expand/ }).click();
    await expect(card.getByRole("checkbox").first()).not.toBeChecked();
    for (const rel of problem.solutions) {
      const entry = card.locator('[data-solution="' + rel.solutionId + '"]');
      await entry.getByRole("button", { name: "All benefits" }).click();
      for (const [i, kind] of (["operational","financial"] as const).entries()) {
        const col = entry.locator(".solution-card > .two-columns > div").nth(i);
        const titles = expected[rel.solutionId as keyof typeof expected][kind];
        await expect(col.locator(".outcome-list li")).toHaveCount(titles.length);
        expect(await col.locator(".outcome-list li span").allTextContents()).toEqual(titles);
        if (!titles.length) await expect(col.locator(".empty-note")).toHaveText("No applicable " + kind + " outcomes have been provided.");
      }
      await entry.getByRole("button", { name: "Personalized" }).click();
      await expect(entry.locator(".outcome-list li")).toHaveCount(0);
    }
    await expect(card.locator("input:checked")).toHaveCount(0);
    await card.getByRole("button", { name: /^Collapse/ }).click();
  }
});

test("all 144 approved personalized relationships are valid and resolve by stable IDs", () => {
  expect(personalizedFunctionRelationships).toHaveLength(144);
  expect(pendingPersonalizedRelationships).toHaveLength(8);
  const keys = personalizedFunctionRelationships.map(r => [r.problemId, r.solutionId, r.outcomeId].join("/"));
  expect(new Set(keys).size).toBe(144);
  for (const rel of personalizedFunctionRelationships) {
    const problem = problems.find(p => p.id === rel.problemId)!;
    const agent = agents[rel.solutionId];
    const kind = rel.outcomeId.startsWith("positive-operational-") ? "operational" : "financial";
    const impacts = kind === "operational" ? problem.operationalImpacts : problem.financialImpacts;
    const impact = impacts.find(i => negativeToPositive[kind][i.id] === rel.outcomeId)!;
    expect(problem.solutions.some(s => s.solutionId === agent.id)).toBe(true);
    expect(solutionOutcomeIds[agent.id][kind]).toContain(rel.outcomeId);
    expect(rel.functionIds.every(id => agent.functionIds.includes(id) && functionLibrary[id].availability !== "proposed")).toBe(true);
    const state = { ...initialState, selected: { operational: [], financial: [], [kind]: [impact.id] } };
    expect([...relevantFunctions(problem, agent, state)].sort()).toEqual([...rel.functionIds].sort());
  }
  for (const problem of problems) for (const rel of problem.solutions) {
    const agent = agents[rel.solutionId];
    expect(relevantFunctions(problem, agent, initialState).size).toBe(0);
  }
});

test("personalized functions follow selections, deduplicate, reuse tick green and preserve modes", async ({ page }) => {
  await page.goto("/");
  const missed = page.locator('[data-problem="problem-1"]');
  await missed.getByRole("button", { name: /^Expand/ }).click();
  const entry = missed.locator('[data-solution="inbound"]');
  await entry.getByText("How the agent functions", { exact: true }).click();
  const list = entry.locator(".function-list");
  await expect(list).toHaveCount(0);
  const labels = ["Lost leads", "Wasted marketing spend", "Higher cost per buyer"];
  for (const name of labels) {
    await missed.getByRole("checkbox", { name, exact: true }).check();
    await expect(list.locator("li > span")).toHaveText(["Answers incoming calls"]);
  }
  await expect(list.locator("li > div")).toHaveText([functionLibrary["function-answers-incoming-calls"].description]);
  const tickColor = await entry.locator(".green-check").first().evaluate(el => getComputedStyle(el).color);
  await expect(list.locator("li > span")).toHaveCSS("color", tickColor);
  await expect(list.locator("li > div")).toHaveCSS("color", tickColor);
  await entry.getByRole("button", { name: "All benefits" }).click();
  await expect(list.locator("li > span")).toHaveText(agents.inbound.functionIds.map(id => functionLibrary[id].name));
  await expect(list.locator("li").first()).toHaveCSS("color", "rgb(244, 244, 244)");
  for (const name of labels) await expect(missed.getByRole("checkbox", { name, exact: true })).toBeChecked();
  await entry.getByRole("button", { name: "Personalized" }).click();
  for (const name of labels.slice(0,2)) {
    await missed.getByRole("checkbox", { name, exact: true }).uncheck();
    await expect(list.locator("li > span")).toHaveText(["Answers incoming calls"]);
  }
  await missed.getByRole("checkbox", { name: labels[2], exact: true }).uncheck();
  await expect(list).toHaveCount(0);
  await missed.getByRole("checkbox", { name: "Lost potential revenue", exact: true }).check();
  await expect(list.locator("li > span")).toHaveText(["Answers incoming calls"]);
  const booking = page.locator('[data-problem="problem-3"]');
  await booking.getByRole("button", { name: /^Expand/ }).click();
  const bookingInbound = booking.locator('[data-solution="inbound"]');
  await booking.getByRole("checkbox", { name: "Lost potential revenue", exact: true }).check();
  await bookingInbound.getByText("How the agent functions", { exact: true }).click();
  await expect(bookingInbound.locator(".function-list li > span")).toHaveText(["Checks appointment availability","Books appointments"]);
  await expect(list.locator("li > span")).toHaveText(["Answers incoming calls"]);
  const late = page.locator('[data-problem="problem-7"]');
  await late.getByRole("button", { name: /^Expand/ }).click();
  await late.getByRole("checkbox", { name: "Lost qualified leads", exact: true }).check();
  for (const [id, first] of [["inbound","Answers incoming calls"],["speed","Calls new leads"]]) {
    const card = late.locator('[data-solution="' + id + '"]');
    await card.getByText("How the agent functions", { exact: true }).click();
    await expect(card.locator(".function-list li > span")).toHaveText([first,"Collects lead information","Qualifies leads"]);
  }
  const manual = page.locator('[data-problem="problem-20"]');
  await manual.getByRole("button", { name: /^Expand/ }).click();
  await manual.getByRole("checkbox", { name: "Lost potential revenue", exact: true }).check();
  const review = manual.locator('[data-solution="reviews"]');
  await review.getByText("How the agent functions", { exact: true }).click();
  await expect(review.locator(".outcome-list li")).toHaveText(["Increased revenue potential"]);
  await expect(review.locator(".function-list")).toHaveCount(0);
  await expect(review.locator("details").first().locator(".description-content")).toHaveText("");
  await expect(manual.locator(".solution-card")).toHaveCount(8);
});

test("all explanation records correspond to the existing approved relationships", () => {
  let allCount = 0;
  let personalizedCount = 0;
  for (const agent of Object.values(agents)) {
    const expected = [...agent.operationalOutcomes, ...agent.financialOutcomes].map(o => o.id);
    expect(Object.keys(allBenefitExplanations[agent.id]).sort()).toEqual(expected.sort());
    allCount += expected.length;
    expect(Object.values(allBenefitExplanations[agent.id]).every(text => text.trim())).toBe(true);
  }
  for (const problem of problems) for (const rel of problem.solutions) {
    const agent = agents[rel.solutionId];
    const expected = personalizedFunctionRelationships.filter(r => r.problemId === problem.id && r.solutionId === agent.id).map(r => r.outcomeId);
    const actual = personalizedExplanations[problem.id]?.[agent.id] ?? {};
    expect(Object.keys(actual).sort()).toEqual(expected.sort());
    personalizedCount += expected.length;
    const state = { ...initialState, selected: { operational: problem.operationalImpacts.map(i => i.id), financial: problem.financialImpacts.map(i => i.id) } };
    for (const kind of ["operational", "financial"] as const) {
      const shown = visibleOutcomes(problem, agent, kind, state);
      expect(visibleOutcomeExplanations(problem, agent, kind, state).map(o => o.id)).toEqual(shown.filter(o => actual[o.id]).map(o => o.id));
    }
  }
  expect(allCount).toBe(58);
  expect(personalizedCount).toBe(144);
});

test("every card displays exact approved explanations in order in both viewing modes", async ({ page }) => {
  test.setTimeout(180000);
  await page.goto("/");
  for (const problem of problems) {
    const card = page.locator('[data-problem="' + problem.id + '"]');
    await card.getByRole("button", { name: /^Expand/ }).click();
    for (const relationship of problem.solutions) {
      const entry = card.locator('[data-solution="' + relationship.solutionId + '"]');
      const agent = agents[relationship.solutionId];
      for (const kind of ["operational","financial"] as const) {
        const panel = entry.locator("details").filter({has: page.locator("summary", {hasText: "How it produces " + kind + " outcomes"})});
        await panel.locator("summary").click();
        await expect(panel.locator(".explanation")).toHaveCount(0);
      }
      await entry.getByRole("button", { name: "All benefits" }).click();
      for (const [i,kind] of (["operational","financial"] as const).entries()) {
        const panel = entry.locator("details").nth(i+1);
        const expected = kind === "operational" ? agent.operationalOutcomes : agent.financialOutcomes;
        await expect(panel.locator(".explanation")).toHaveCount(expected.length);
        expect(await panel.locator(".explanation h5").allTextContents()).toEqual(expected.map(o => o.title));
        expect(await panel.locator(".explanation p").allTextContents()).toEqual(expected.map(o => allBenefitExplanations[agent.id][o.id]));
        if (expected.length) {
          await expect(panel.locator(".explanation h5").first()).toHaveCSS("color","rgb(244, 244, 244)");
          await expect(panel.locator(".explanation p").first()).toHaveCSS("color","rgb(244, 244, 244)");
        }
      }
      await expect(card.locator("input:checked")).toHaveCount(0);
      await entry.getByRole("button", { name: "Personalized" }).click();
    }
    for (const impact of [...problem.operationalImpacts,...problem.financialImpacts]) await card.getByRole("checkbox", {name:impact.label,exact:true}).check();
    for (const relationship of problem.solutions) {
      const agent = agents[relationship.solutionId];
      const entry = card.locator('[data-solution="' + agent.id + '"]');
      const lookup = personalizedExplanations[problem.id]?.[agent.id] ?? {};
      for (const [i,kind] of (["operational","financial"] as const).entries()) {
        const panel = entry.locator("details").nth(i+1);
        const relevantIds = new Set((kind==="operational"?problem.operationalImpacts:problem.financialImpacts).map(impact=>negativeToPositive[kind][impact.id]));
        const expected = (kind==="operational"?agent.operationalOutcomes:agent.financialOutcomes).filter(o=>relevantIds.has(o.id)&&lookup[o.id]);
        await expect(panel.locator(".explanation")).toHaveCount(expected.length);
        expect(await panel.locator(".explanation h5").allTextContents()).toEqual(expected.map(o=>o.title));
        expect(await panel.locator(".explanation p").allTextContents()).toEqual(expected.map(o=>lookup[o.id]));
        if (expected.length) {
          const tickColor = await entry.locator(".green-check").first().evaluate(el=>getComputedStyle(el).color);
          await expect(panel.locator(".explanation h5").first()).toHaveCSS("color",tickColor);
          await expect(panel.locator(".explanation p").first()).toHaveCSS("color",tickColor);
        } else await expect(panel.locator(".description-content")).toHaveText("");
      }
    }
    for (const impact of [...problem.operationalImpacts,...problem.financialImpacts]) await card.getByRole("checkbox",{name:impact.label,exact:true}).uncheck();
    await expect(card.locator(".explanation")).toHaveCount(0);
    await card.getByRole("button", { name: /^Collapse/ }).click();
  }
});

test("explanations update dynamically and pending relationships never fall back", async ({page}) => {
  await page.goto("/");
  const card = page.locator('[data-problem="problem-1"]');
  await card.getByRole("button",{name:/^Expand/}).click();
  const entry = card.locator('[data-solution="inbound"]');
  const op = entry.locator("details").nth(1), fin = entry.locator("details").nth(2);
  await op.locator("summary").click(); await fin.locator("summary").click();
  const lead=card.getByRole("checkbox",{name:"Lost leads",exact:true}), revenue=card.getByRole("checkbox",{name:"Lost potential revenue",exact:true});
  await lead.check();
  await expect(op.locator("h5")).toHaveText(["Fewer lost leads"]);
  await expect(fin.locator(".explanation")).toHaveCount(0);
  await revenue.check();
  const expected=personalizedExplanations["problem-1"].inbound["positive-financial-increased-revenue-potential"];
  await expect(fin.locator(".explanation p")).toHaveText(expected);
  await entry.getByRole("button",{name:"All benefits"}).click();
  await expect(fin.locator(".explanation").filter({has:page.getByRole("heading",{name:"Increased revenue potential",exact:true})}).locator("p")).toHaveText(allBenefitExplanations.inbound["positive-financial-increased-revenue-potential"]);
  await entry.getByRole("button",{name:"Personalized"}).click();
  await expect(fin.locator(".explanation p")).toHaveText(expected);
  await expect(lead).toBeChecked(); await expect(revenue).toBeChecked();
  await card.getByRole("button",{name:/^Collapse/}).click(); await card.getByRole("button",{name:/^Expand/}).click();
  await expect(entry.locator("details[open]")).toHaveCount(2);
  await expect(fin.locator(".explanation p")).toHaveText(expected);
  await revenue.uncheck(); await expect(fin.locator(".explanation")).toHaveCount(0); await expect(op.locator("h5")).toHaveText(["Fewer lost leads"]);
  const manual=page.locator('[data-problem="problem-20"]');
  await manual.getByRole("button",{name:/^Expand/}).click();
  const review=manual.locator('[data-solution="reviews"]'), inbound=manual.locator('[data-solution="inbound"]');
  await manual.getByRole("checkbox",{name:"Lost potential revenue",exact:true}).check();
  await review.locator("details").nth(2).locator("summary").click();
  await expect(review.locator(".outcome-list li")).toHaveText(["Increased revenue potential"]);
  await expect(review.locator("details").nth(2).locator(".description-content")).toHaveText("");
  await review.getByRole("button",{name:"All benefits"}).click();
  await expect(review.locator("details").nth(2).locator(".explanation")).toHaveCount(2);
  await expect(inbound.getByRole("button",{name:"Personalized"})).toHaveAttribute("aria-pressed","true");
  await review.getByRole("button",{name:"Personalized"}).click();
  await expect(review.locator("details").nth(2).locator(".description-content")).toHaveText("");
});
