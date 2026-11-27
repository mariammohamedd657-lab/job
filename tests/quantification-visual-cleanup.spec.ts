import {test,expect} from "@playwright/test";
test("requested Quantification visual cleanup retains existing controls",async({page})=>{
 await page.goto("/");
 const problem=page.locator('[data-problem="problem-1"]');
 await problem.locator(".problem-toggle").click();
 await problem.getByRole("checkbox",{name:"Lost leads",exact:true}).check();
 await problem.getByRole("checkbox",{name:"Lost potential revenue",exact:true}).check();
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
 const fin=financial.locator('[data-financial-impact="F7"]');
 await expect(fin.locator(".op-result-tick")).toBeVisible();
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

test("financial geometry matches operational geometry and the whole header toggles",async({page})=>{
 await page.goto("/");const p=page.locator('[data-problem="problem-1"]');await p.locator(".problem-toggle").click();
 await p.getByRole("checkbox",{name:"Lost leads",exact:true}).check();await p.getByRole("checkbox",{name:"Lost potential revenue",exact:true}).check();
 await page.getByRole("link",{name:"Quantification"}).click();await page.getByRole("button",{name:/^Negative operational impacts/}).click();await page.getByRole("button",{name:"Negative financial impacts",exact:true}).click();
 const op=page.locator('[data-impact="negative-operational-lost-leads"]'),fin=page.locator('[data-financial-impact="F7"]');
 for(const selector of [".op-impact-toggle",".op-result-tick .q-icon",".q-field input",".op-result",".op-result-row strong"]){
  const style=await op.locator(selector).first().evaluate(e=>{const s=getComputedStyle(e);return [s.fontSize,s.fontWeight,s.padding,s.borderRadius,s.height,s.width];});
  const actual=await fin.locator(selector).first().evaluate(e=>{const s=getComputedStyle(e);return [s.fontSize,s.fontWeight,s.padding,s.borderRadius,s.height,s.width];});
  // Text wrapping and number content can change intrinsic height/width.
  expect(actual.slice(0,4),selector).toEqual(style.slice(0,4));
  if(selector===".q-field input"||selector===".op-result-tick .q-icon")expect(actual.slice(4),selector).toEqual(style.slice(4));
 }
 const toggle=fin.locator(".fin-card-toggle");await toggle.locator("span").nth(1).click();await expect(fin.locator(".fin-card-body")).toBeHidden();await toggle.click();await expect(fin.locator(".fin-card-body")).toBeVisible();
 await expect(fin.getByRole("checkbox")).toHaveCount(0);
});
