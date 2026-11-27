import {test,expect} from "@playwright/test";
test("requested Quantification visual cleanup retains existing controls",async({page})=>{
 await page.goto("/");
 const problem=page.locator('[data-problem="problem-1"]');
 await problem.locator(".problem-toggle").click();
 await problem.getByRole("checkbox",{name:"Lost leads",exact:true}).check();
 await page.getByRole("link",{name:"Quantification"}).click();
 await expect(page.locator("#q-problem")).toBeVisible();
 await expect(page.getByRole("heading",{name:"Business problem quantification"})).toHaveCount(0);
 await expect(page.locator(".q-select-label")).toHaveCount(0);
 await page.getByRole("button",{name:/^Negative operational impacts/}).click();
 const operational=page.locator(".op-impact-content");
 await expect(operational.locator(".op-confirmed-list,.op-confirmed-heading")).toHaveCount(0);
 const card=operational.locator('[data-impact="negative-operational-lost-leads"]');
 await expect(card).toBeVisible();
 await expect(card.locator(".op-result")).toHaveCSS("border-top-color","rgb(240, 217, 133)");
 await expect(card.locator(".op-result-row")).toHaveCSS("color","rgb(240, 217, 133)");
 await expect(card.locator(".op-result-row strong")).toHaveCSS("color","rgb(240, 217, 133)");
 await page.getByRole("button",{name:"Negative financial impacts",exact:true}).click();
 const financial=page.locator(".fin-impact-content");
 await expect(financial.getByRole("group",{name:"Financial impact filter"})).toBeVisible();
 await expect(financial.locator(".op-confirmed-heading")).toHaveCount(0);
 const fin=financial.locator('[data-financial-impact="F1"]');
 await fin.locator(".fin-check").check();
 await expect(fin.locator(".fin-note")).toHaveCount(0);
 await expect(fin.locator(".op-result")).toHaveCSS("border-top-color","rgb(170, 203, 242)");
 await expect(fin.locator(".op-result-row")).toHaveCSS("color","rgb(170, 203, 242)");
 await expect(fin.locator(".op-result-row strong")).toHaveCSS("color","rgb(170, 203, 242)");
 for(const result of [card.locator(".op-result"),fin.locator(".op-result")]){
  await expect(result.locator(":scope > *")).toHaveCount(1);
  await expect(result).not.toContainText(/Quantified negative|Automatically calculated|Directly entered|Awaiting information/);
 }
 await expect(operational.getByRole("checkbox",{name:"Show calculations"})).toBeVisible();
});

test("financial selection row and disclosure button act independently",async({page})=>{
 await page.goto("/quantification");
 await page.getByRole("button",{name:"Negative financial impacts",exact:true}).click();
 const card=page.locator('[data-financial-impact="F1"]');
 const check=card.locator(".fin-check"),row=card.locator(".fin-select-row"),toggle=card.locator(".fin-card-toggle");
 await row.locator("span").first().click();await expect(check).toBeChecked();await expect(toggle).toHaveAttribute("aria-expanded","true");
 await toggle.click();await expect(check).toBeChecked();await expect(toggle).toHaveAttribute("aria-expanded","false");
 await toggle.click();await expect(check).toBeChecked();await expect(toggle).toHaveAttribute("aria-expanded","true");
 await row.locator("span").first().click();await expect(check).not.toBeChecked();await expect(toggle).toHaveAttribute("aria-expanded","false");
});
