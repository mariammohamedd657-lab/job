import { test, expect } from "@playwright/test";
import { configs, sectionOrder } from "../app/quantification/config";
import { solve } from "../app/quantification/solver";
import { problems } from "../app/discovery/data";

test("all 28 problems use stable configurations and valid examples",()=>{
 expect(configs).toHaveLength(28);
 expect(configs.map(c=>c.id).sort()).toEqual(problems.map(p=>p.id).sort());
 for(const c of configs){
  expect(c.fields.Time[0].key).toBe("months");
  const result=solve(c,c.example);
  expect(result.errors).toEqual([]);
  expect(result.values.total).toBe(100);
  expect(result.values.affected).toBe(20);
  expect(result.values.unaffected).toBe(80);
  expect(result.values.affectedPct).toBe(20);
  expect(result.values.unaffectedPct).toBe(80);
  if(c.fields.Frequency.length) expect(result.values.daily).toBeCloseTo(20/30);
  if(c.timePopulation) expect(result.values.hours).toBeCloseTo((c.timePopulation==="recordedUnits"?10:20)*15/60);
  if(c.moneyPopulation) expect(result.values.moneyTotal).toBe(1000);
 }
});
test("quantity, percentages, time, frequency, comparison and money calculate in reverse",()=>{
 const c=configs.find(c=>c.id==="problem-20")!;
 const pay=configs.find(c=>c.id==="problem-23")!;
 expect(solve(c,{affected:"20",unaffected:"80"}).values.total).toBe(100);
 expect(solve(c,{total:"100",unaffected:"80"}).values.affected).toBe(20);
 expect(solve(c,{affected:"20",affectedPct:"20"}).values.total).toBe(100);
 expect(solve(c,{total:"100",unaffectedPct:"80"}).values.affected).toBe(20);
 expect(solve(c,{hours:"5",averageMinutes:"15"}).values.affected).toBe(20);
 expect(solve(c,{hours:"5",affected:"20"}).values.averageMinutes).toBe(15);
 expect(solve(c,{daily:"2",days:"10"}).values.affected).toBe(20);
 expect(solve(c,{affected:"20",daily:"2"}).values.days).toBe(10);
 expect(solve(c,{target:"8",difference:"-3"}).values.hours).toBe(5);
 expect(solve(c,{hours:"5",targetPct:"50"}).values.target).toBe(10);
 expect(solve(pay,{moneyTotal:"1000",moneyAverage:"50"}).values.affected).toBe(20);
 expect(solve(pay,{moneyTotal:"1000",affected:"20"}).values.moneyAverage).toBe(50);
 expect(solve(c,{total:"0",affected:"0"}).values.unaffected).toBe(0);
 expect(solve(c,{total:"0",affected:"0"}).values.affectedPct).toBeUndefined();
 const invalid=solve(c,{total:"10",affected:"20",months:"3"});
 expect(invalid.errors.length).toBeGreaterThan(0);
 expect(invalid.values.total).toBe(10);
 expect(invalid.values.affected).toBe(20);
 expect(invalid.values.unaffected).toBeUndefined();
 expect(invalid.values.months).toBe(3);
 expect(solve(c,{affected:"20",days:"0"}).errors.length).toBeGreaterThan(0);
 expect(solve(c,{affected:"-1"}).errors.length).toBeGreaterThan(0);
});
test("quantification panels, calculator state, and Discovery survive route navigation",async({page})=>{
 await page.goto("/");
 const problem=page.locator('[data-problem="problem-1"]');
 await problem.getByRole("button",{name:/^Expand/}).click();
 await problem.getByRole("checkbox",{name:"Lost leads",exact:true}).check();
 await page.getByRole("link",{name:"Quantification"}).click();
 await expect(page).toHaveURL(/\/quantification$/);
 await expect(page.locator(".q-panel")).toHaveCount(6);
 await expect(page.locator(".q-panel-header[aria-expanded=true]")).toHaveCount(1);
 const select=page.locator("#q-problem");
 await expect(select.locator("option")).toHaveCount(28);
 await select.selectOption("problem-6");
 await expect(page.locator(".q-meta").first()).toHaveText("Leads4 of 5 sections available");
 await expect(page.locator('[data-section="Money"] button')).toBeDisabled();
 const total=page.locator('[data-section="Quantity"] input[data-quantity="total"]');
 const affected=page.locator('[data-section="Quantity"] input[data-quantity="affected"]');
 const unaffected=page.locator('[data-section="Quantity"] input[data-quantity="unaffected"]');
 await total.fill("100");await affected.fill("25");
 await expect(unaffected).toHaveValue("75");
 await expect(unaffected).toHaveCSS("color","rgb(120, 197, 155)");
 await expect(page.locator('[data-section="Frequency"] input[data-quantity="affected"]')).toHaveValue("25");
 await page.getByRole("checkbox",{name:"Show calculations"}).check();
 await expect(page.locator(".q-formula").first()).toBeVisible();
 await page.getByRole("button",{name:"Negative operational impacts",exact:true}).click();
 await expect(page.locator(".q-panel-header[aria-expanded=true]")).toHaveCount(2);
 await page.locator('[data-section="Quantity"] button').click();
 await select.selectOption("problem-20");
 await page.getByRole("button",{name:"Load example"}).click();
 await expect(page.locator('[data-section="Time"] input[data-quantity="hours"]')).toHaveValue("5");
 await expect(page.locator('[data-section="Comparison"] input[data-quantity="hours"]')).toHaveValue("5");
 await page.getByRole("button",{name:"Reset",exact:true}).click();
 await expect(page.locator('[data-section="Time"] input[data-quantity="hours"]')).toHaveValue("");
 await select.selectOption("problem-6");
 await expect(page.locator('[data-section="Quantity"] button')).toHaveAttribute("aria-expanded","false");
 await page.getByRole("link",{name:"Discovery",exact:true}).click();
 await expect(problem.getByRole("checkbox",{name:"Lost leads",exact:true})).toBeChecked();
 await page.getByRole("link",{name:"Quantification"}).click();
 await expect(select).toHaveValue("problem-6");
 await expect(page.locator(".q-panel-header[aria-expanded=true]")).toHaveCount(2);
 await page.locator('[data-section="Quantity"] button').click();
 await expect(total).toHaveValue("100");
 await expect(affected).toHaveValue("25");
 await expect(unaffected).toHaveValue("75");
 for(const c of configs){
  await select.selectOption(c.id);
  for(const s of sectionOrder){
   const section=page.locator('[data-section="'+s+'"]');
   if(c.fields[s].length)await expect(section.locator("button")).toBeEnabled();
   else await expect(section.locator("button")).toBeDisabled();
  }
 }
});
