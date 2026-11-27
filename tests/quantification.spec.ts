import { test, expect, type Page } from "@playwright/test";
import { configs, sectionOrder } from "../app/quantification/config";
import { solve } from "../app/quantification/solver";
import { quantificationStatus } from "../app/quantification/status";
import { problems } from "../app/discovery/data";

async function chooseProblem(page:Page,id:string){
 const trigger=page.locator("#q-problem");
 if(await trigger.getAttribute("aria-expanded")!=="true")await trigger.click();
 await page.locator('#q-problem-options [role="option"][data-value="'+id+'"]').click();
 await expect(trigger).toHaveAttribute("data-value",id);
}

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
 expect(solve(c,{difference:"-5",targetPct:"50"}).values.target).toBe(10);
 expect(solve(c,{difference:"-5",targetPct:"50"}).values.hours).toBe(5);
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
 await select.click();
 await expect(page.locator("#q-problem-options").getByRole("option")).toHaveCount(28);
 await chooseProblem(page,"problem-6");
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
 await chooseProblem(page,"problem-20");
 await page.getByRole("button",{name:"Load example"}).click();
 await expect(page.locator('[data-section="Time"] input[data-quantity="hours"]')).toHaveValue("5");
 await expect(page.locator('[data-section="Comparison"] input[data-quantity="hours"]')).toHaveValue("5");
 await page.getByRole("button",{name:"Reset",exact:true}).click();
 await expect(page.locator('[data-section="Time"] input[data-quantity="hours"]')).toHaveValue("");
 await chooseProblem(page,"problem-6");
 await expect(page.locator('[data-section="Quantity"] button')).toHaveAttribute("aria-expanded","false");
 await page.getByRole("link",{name:"Discovery",exact:true}).click();
 await expect(problem.getByRole("checkbox",{name:"Lost leads",exact:true})).toBeChecked();
 await page.getByRole("link",{name:"Quantification"}).click();
 await expect(select).toHaveAttribute("data-value","problem-6");
 await expect(page.locator(".q-panel-header[aria-expanded=true]")).toHaveCount(2);
 await page.locator('[data-section="Quantity"] button').click();
 await expect(total).toHaveValue("100");
 await expect(affected).toHaveValue("25");
 await expect(unaffected).toHaveValue("75");
 for(const c of configs){
  await chooseProblem(page,c.id);
  for(const s of sectionOrder){
   const section=page.locator('[data-section="'+s+'"]');
   if(c.fields[s].length)await expect(section.locator(".q-section-header")).toBeEnabled();
   else await expect(section.locator(".q-section-header")).toBeDisabled();
  }
 }
});

test("quantification status uses valid resolved figures and problem-specific minimums",()=>{
 for(const c of configs){
  expect(quantificationStatus(c,c.example,false)).toBe("default");
  expect(quantificationStatus(c,{},true)).toBe("incomplete");
  expect(quantificationStatus(c,c.example,true)).toBe("complete");
 }
 const count=configs.find(c=>c.id==="problem-1")!;
 expect(quantificationStatus(count,{months:"3"},true)).toBe("incomplete");
 expect(quantificationStatus(count,{total:"100",unaffected:"80"},true)).toBe("complete");
 expect(quantificationStatus(count,{total:"100",affected:"0"},true)).toBe("complete");
 expect(quantificationStatus(count,{affected:"20",days:"30"},true)).toBe("complete");
 expect(quantificationStatus(count,{total:"100",affected:"110"},true)).toBe("incomplete");
 const timed=configs.find(c=>c.id==="problem-20")!;
 expect(quantificationStatus(timed,{total:"100",affected:"20"},true)).toBe("incomplete");
 expect(quantificationStatus(timed,{total:"100",affected:"20",averageMinutes:"15"},true)).toBe("complete");
 const money=configs.find(c=>c.id==="problem-23")!;
 expect(quantificationStatus(money,{total:"100",affected:"20"},true)).toBe("incomplete");
 expect(quantificationStatus(money,{total:"100",affected:"20",moneyAverage:"50"},true)).toBe("complete");
 const overload=configs.find(c=>c.id==="problem-28")!;
 expect(quantificationStatus(overload,{hours:"10"},true)).toBe("incomplete");
 expect(quantificationStatus(overload,{hours:"10",target:"8"},true)).toBe("complete");
});
test("problem selector colors follow Discovery confirmation and valid figures without changing state",async({page})=>{
 await page.goto("/");
 const problem=page.locator('[data-problem="problem-1"]');
 const confirmation=problem.getByRole("checkbox",{name:"Missed calls",exact:true});
 await confirmation.check();
 await page.getByRole("link",{name:"Quantification"}).click();
 const select=page.locator("#q-problem");
 const option=page.locator('#q-problem-options [data-value="problem-1"]');
 const other=page.locator('#q-problem-options [data-value="problem-6"]');
 const color=async(status:string,rgb:string)=>{
  await expect(select).toHaveAttribute("data-status",status);
  await expect(option).toHaveAttribute("data-status",status);
  await expect(select).toHaveCSS("color",rgb);
  await select.click();
  await expect(option).toBeVisible();
  await expect(option).toHaveCSS("color",rgb);
  await select.press("Escape");
 };
 await color("incomplete","rgb(242, 173, 173)");
 await expect(other).toHaveCSS("color","rgb(244, 244, 244)");
 const total=page.locator('[data-section="Quantity"] input[data-quantity="total"]');
 const unaffected=page.locator('[data-section="Quantity"] input[data-quantity="unaffected"]');
 await total.fill("100");await unaffected.fill("80");
 await color("complete","rgb(16, 184, 92)");
 await unaffected.fill("110");await color("incomplete","rgb(242, 173, 173)");
 await unaffected.fill("80");await color("complete","rgb(16, 184, 92)");
 await unaffected.fill("");await color("incomplete","rgb(242, 173, 173)");
 await unaffected.fill("80");await color("complete","rgb(16, 184, 92)");
 await chooseProblem(page,"problem-6");
 await expect(select).toHaveCSS("color","rgb(244, 244, 244)");
 await expect(option).toHaveCSS("color","rgb(16, 184, 92)");
 await chooseProblem(page,"problem-1");
 await page.getByRole("link",{name:"Discovery",exact:true}).click();
 await confirmation.uncheck();
 await page.getByRole("link",{name:"Quantification"}).click();
 await color("default","rgb(244, 244, 244)");
 await expect(total).toHaveValue("100");
 await expect(unaffected).toHaveValue("80");
});

test("custom problem menu renders all three status colors simultaneously and supports keyboard and dismissal",async({page})=>{
 await page.goto("/");
 for(const id of ["problem-1","problem-6"])await page.locator('[data-problem="'+id+'"] .problem-confirm input').check();
 await page.getByRole("link",{name:"Quantification"}).click();
 const trigger=page.getByRole("combobox",{name:"Select a business problem"});
 const menu=page.getByRole("listbox",{name:"Select a business problem"});
 await page.locator('[data-section="Quantity"] input[data-quantity="total"]').fill("100");
 await page.locator('[data-section="Quantity"] input[data-quantity="affected"]').fill("20");
 await trigger.click();
 await expect(menu).toBeVisible();
 await expect(menu.getByRole("option")).toHaveCount(28);
 await expect(menu.getByRole("group")).toHaveCount(7);
 await expect(menu.getByRole("option",{name:"Missed calls",exact:true})).toHaveCSS("color","rgb(16, 184, 92)");
 await expect(menu.getByRole("option",{name:"New leads never called",exact:true})).toHaveCSS("color","rgb(242, 173, 173)");
 await expect(menu.getByRole("option",{name:"Calls outside working hours",exact:true})).toHaveCSS("color","rgb(244, 244, 244)");
 await expect(trigger).toHaveCSS("color","rgb(16, 184, 92)");
 await trigger.press("ArrowDown");
 await trigger.press("Enter");
 await expect(trigger).toHaveAttribute("data-value","problem-2");
 await expect(menu).not.toBeVisible();
 await expect(trigger).toHaveCSS("color","rgb(244, 244, 244)");
 await trigger.press("Enter");
 await trigger.press("End");
 await trigger.press("Escape");
 await expect(menu).not.toBeVisible();
 await expect(trigger).toHaveAttribute("data-value","problem-2");
 await trigger.click();
 await page.locator(".q-meta").first().click();
 await expect(menu).not.toBeVisible();
 await trigger.press("Enter");
 await trigger.press("Home");
 await trigger.press("Enter");
 await expect(trigger).toHaveAttribute("data-value","problem-1");
 await expect(page.locator('[data-section="Quantity"] input[data-quantity="total"]')).toHaveValue("100");
 await expect(page.locator('[data-section="Quantity"] input[data-quantity="affected"]')).toHaveValue("20");
 await expect(trigger).toHaveCSS("color","rgb(16, 184, 92)");
});

test("every repeated quantity in all 28 problems synchronizes actual input values in both directions",async({page})=>{
 test.setTimeout(180000);
 await page.goto("/quantification");
 for(const config of configs){
  await chooseProblem(page,config.id);
  await page.getByRole("button",{name:"Reset",exact:true}).click();
  const field=(section:string,key:string)=>page.locator('[data-section="'+section+'"] input[data-quantity="'+key+'"]');
  const allFields=(key:string)=>page.locator('.q-calculator input[data-quantity="'+key+'"]');
  const repeated=[...new Set(Object.values(config.fields).flat().map(f=>f.key))].filter(key=>sectionOrder.filter(s=>config.fields[s].some(f=>f.key===key)).length>1);
  for(const key of repeated){
   const sections=sectionOrder.filter(s=>config.fields[s].some(f=>f.key===key));
   for(const [i,section] of sections.entries()){
    const value=String(12+i);
    await field(section,key).fill(value);
    await expect(allFields(key)).toHaveCount(sections.length);
    for(const input of await allFields(key).all())await expect(input).toHaveValue(value);
   }
   await field(sections[0],key).fill("0");
   for(const input of await allFields(key).all())await expect(input).toHaveValue("0");
   await field(sections[sections.length-1],key).fill("");
   for(const input of await allFields(key).all())await expect(input).toHaveValue("");
  }
  // Calculate affected quantity from two other quantities, without entering it.
  await field("Quantity","total").fill("100");
  await field("Quantity","unaffected").fill("80");
  for(const input of await allFields("affected").all()){
   await expect(input).toHaveValue("20");
   await expect(input).toHaveCSS("color","rgb(120, 197, 155)");
  }
  await field("Quantity","unaffected").fill("70");
  for(const input of await allFields("affected").all())await expect(input).toHaveValue("30");
  if(config.timePopulation){
   if(config.timePopulation==="recordedUnits")await field("Time","recordedUnits").fill("12");
   await field("Time","averageMinutes").fill("15");
   const expectedHours=config.timePopulation==="recordedUnits"?"3":"7.5";
   for(const input of await allFields("hours").all())await expect(input).toHaveValue(expectedHours);
  }
  if(config.fields.Frequency.length){
   await field("Frequency","days").fill("10");
   await expect(field("Frequency","daily")).toHaveValue("3");
  }
  if(config.moneyPopulation){
   await field("Money","moneyAverage").fill("50");
   await expect(field("Money","moneyTotal")).toHaveValue("1500");
  }
  // Example/reset keep the same shared display state, including collapsed fields.
  await page.getByRole("button",{name:"Load example"}).click();
  const expected=solve(config,config.example);
  for(const key of repeated){
   const value=config.example[key]??String(Number(expected.values[key].toPrecision(10)));
   for(const input of await allFields(key).all())await expect(input).toHaveValue(value);
  }
  await page.getByRole("button",{name:"Reset",exact:true}).click();
  for(const key of repeated)for(const input of await allFields(key).all())await expect(input).toHaveValue("");
 }
});

test("repeated fields update dependent calculations from either section without copying calculated values into manual state",async({page})=>{
 await page.goto("/quantification");
 await chooseProblem(page,"problem-20");
 const input=(section:string,key:string)=>page.locator('[data-section="'+section+'"] input[data-quantity="'+key+'"]');
 await input("Frequency","affected").fill("20");
 await input("Frequency","days").fill("10");
 await input("Time","averageMinutes").fill("15");
 await input("Comparison","target").fill("8");
 await expect(input("Quantity","affected")).toHaveValue("20");
 await expect(input("Time","hours")).toHaveValue("5");
 await expect(input("Comparison","hours")).toHaveValue("5");
 await expect(input("Comparison","difference")).toHaveValue("-3");
 await input("Quantity","affected").fill("40");
 await expect(input("Frequency","affected")).toHaveValue("40");
 await expect(input("Frequency","daily")).toHaveValue("4");
 await expect(input("Comparison","hours")).toHaveValue("10");
 await expect(input("Comparison","difference")).toHaveValue("2");
 await input("Frequency","affected").fill("");
 await expect(input("Quantity","affected")).toHaveValue("");
 await expect(input("Time","hours")).toHaveValue("");
 await expect(input("Comparison","hours")).toHaveValue("");
 await input("Comparison","hours").fill("5");
 await expect(input("Time","hours")).toHaveValue("5");
 await expect(input("Quantity","affected")).toHaveValue("20");
 await expect(input("Frequency","affected")).toHaveValue("20");
 await input("Time","hours").fill("10");
 await expect(input("Comparison","hours")).toHaveValue("10");
 await expect(input("Quantity","affected")).toHaveValue("40");
 await expect(input("Frequency","daily")).toHaveValue("4");
 await page.locator('[data-section="Time"] button').click();
 await input("Comparison","hours").fill("15");
 await expect(input("Time","hours")).toHaveValue("15");
 await page.locator('[data-section="Time"] button').click();
 await expect(input("Time","hours")).toHaveValue("15");
 await expect(input("Quantity","affected")).toHaveValue("60");
});
