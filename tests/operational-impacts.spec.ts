import {test,expect,type Page} from "@playwright/test";
import {configs} from "../app/quantification/config";
import {problems} from "../app/discovery/data";
import {solve} from "../app/quantification/solver";
import {operationalPanels,operationalEquations} from "../app/quantification/operational-data";

const config=configs.find(c=>c.id==="problem-6")!;
const lostId="negative-operational-lost-leads";
const lost="op:lost-leads:result",recovered="op:lost-leads:recovered",pending="op:lost-leads:pending",rate="op:lost-leads:loss-rate";
const equations=operationalEquations(operationalPanels(config,[lostId]));
test("verified lead equations support all single-unknown directions and combined routes",()=>{
 const values:Record<string,number>={affected:40,[recovered]:10,[pending]:10,[lost]:20,[rate]:50};
 for(const missing of ["affected",recovered,pending,lost]){
  const raw=Object.fromEntries(["affected",recovered,pending,lost].filter(k=>k!==missing).map(k=>[k,String(values[k])]));
  const result=solve(config,raw,equations);
  expect(result.errors).toEqual([]);
  expect(result.values[missing]).toBeCloseTo(values[missing]);
 }
 for(const missing of ["affected",lost,rate]){
  const raw=Object.fromEntries(["affected",lost,rate].filter(k=>k!==missing).map(k=>[k,String(values[k])]));
  const result=solve(config,raw,equations);
  expect(result.errors).toEqual([]);
  expect(result.values[missing]).toBeCloseTo(values[missing]);
 }
 const combined=solve(config,{[recovered]:"10",[pending]:"10",[rate]:"50",total:"100",days:"10"},equations);
 expect(combined.errors).toEqual([]);
 expect(combined.values.affected).toBe(40);
 expect(combined.values[lost]).toBe(20);
 expect(combined.values.unaffected).toBe(60);
 expect(combined.values.daily).toBe(4);
 const screenshot=solve(config,{affected:"26",[recovered]:"8",[pending]:"9"},equations);
 expect(screenshot.values[lost]).toBe(9);
 expect(screenshot.values[rate]).toBeCloseTo(9/26*100);
 expect(solve(config,{affected:"5",[recovered]:"8"},equations).errors.length).toBeGreaterThan(0);
 expect(solve(config,{affected:"26",[recovered]:"8",[pending]:"9",[lost]:"10"},equations).errors.length).toBeGreaterThan(0);
 expect(solve(config,{affected:"0",[recovered]:"0",[pending]:"0"},equations).values[lost]).toBe(0);
 expect(solve(config,{affected:"0",[recovered]:"0",[pending]:"0"},equations).values[rate]).toBeUndefined();
 const missed=configs.find(c=>c.id==="problem-1")!;
 const missedEq=operationalEquations(operationalPanels(missed,[lostId]));
 const different=solve(missed,{affected:"50","op:lost-leads:unique-leads":"30",[recovered]:"8",[pending]:"10"},missedEq);
 expect(different.values.affected).toBe(50);
 expect(different.values[lost]).toBe(12);
});

async function choose(page:Page,id:string){
 const trigger=page.locator("#q-problem");
 await trigger.click();
 await page.locator('#q-problem-options [data-value="'+id+'"]').click();
 await expect(trigger).toHaveAttribute("data-value",id);
}
test("all approved operational impact panels follow Discovery selections and preserve independent direct figures",async({page})=>{
 test.setTimeout(180000);
 await page.goto("/");
 for(const problem of problems){
  const card=page.locator('[data-problem="'+problem.id+'"]');
  await card.getByRole("button",{name:/^Expand/}).click();
  for(const impact of problem.operationalImpacts)await card.getByRole("checkbox",{name:impact.label,exact:true}).check();
  await card.getByRole("button",{name:/^Collapse/}).click();
 }
 await page.getByRole("link",{name:"Quantification"}).click();
 await page.locator(".op-panel > button").click();
 for(const problem of problems){
  await choose(page,problem.id);
  const panels=operationalPanels(configs.find(c=>c.id===problem.id)!,problem.operationalImpacts.map(i=>i.id));
  expect(panels.map(p=>p.id)).toEqual(problem.operationalImpacts.map(i=>i.id));
  await expect(page.locator(".op-impact-card")).toHaveCount(panels.length);
  for(const panel of panels){
   const card=page.locator('.op-impact-card[data-impact="'+panel.id+'"]');
   await expect(card.locator(".op-impact-toggle")).toHaveText(panel.name);
   const primary=card.locator('input[data-quantity="'+panel.primaryKey+'"]');
   await primary.fill("7");
   await expect(card.locator(".op-result-row strong")).toHaveText("7");
   await expect(card.locator(".op-result")).toContainText("Directly entered");
   await card.locator(".op-impact-toggle").click();
   await expect(primary).toHaveValue("7");
   await card.locator(".op-impact-toggle").click();
   await expect(primary).toHaveValue("7");
  }
 }
 await choose(page,"problem-6");
 await expect(page.locator('.op-impact-card input[data-quantity="'+lost+'"]')).toHaveValue("7");
 await page.getByRole("link",{name:"Discovery",exact:true}).click();
 const card=page.locator('[data-problem="problem-6"]');
 await card.getByRole("button",{name:/^Expand/}).click();
 await card.getByRole("checkbox",{name:"Lost leads",exact:true}).uncheck();
 await page.getByRole("link",{name:"Quantification"}).click();
 await expect(page.locator(".op-impact-card")).toHaveCount(0);
 await page.getByRole("link",{name:"Discovery",exact:true}).click();
 await card.getByRole("checkbox",{name:"Lost leads",exact:true}).check();
 await page.getByRole("link",{name:"Quantification"}).click();
 await expect(page.locator('.op-impact-card input[data-quantity="'+lost+'"]')).toHaveValue("7");
});
test("screenshot lead panel shares editable and calculated values with Problem quantification",async({page})=>{
 await page.goto("/");
 const card=page.locator('[data-problem="problem-6"]');
 await card.getByRole("button",{name:/^Expand/}).click();
 await card.getByRole("checkbox",{name:"Lost leads",exact:true}).check();
 await page.getByRole("link",{name:"Quantification"}).click();
 await choose(page,"problem-6");
 const base=(key:string)=>page.locator('[data-section="Quantity"] input[data-quantity="'+key+'"]');
 await base("total").fill("100");
 await base("affected").fill("26");
 await page.locator(".op-panel > button").click();
 const panel=page.locator(".op-impact-card");
 const input=(key:string)=>panel.locator('input[data-quantity="'+key+'"]');
 await expect(input("affected")).toHaveValue("26");
 await input(recovered).fill("8");await input(pending).fill("9");
 await expect(input(lost)).toHaveValue("9");
 await expect(panel.locator(".op-result-row strong")).toHaveText("9");
 await expect(panel.locator(".op-auto")).toHaveCount(2);
 await input("affected").fill("30");
 await expect(base("affected")).toHaveValue("30");
 await expect(base("unaffected")).toHaveValue("70");
 await expect(input(lost)).toHaveValue("13");
 await input("affected").fill("");
 await input(lost).fill("9");
 await expect(base("affected")).toHaveValue("26");
 await expect(base("unaffected")).toHaveValue("74");
 await expect(input("affected")).toHaveValue("26");
 await page.getByRole("button",{name:"Problem quantification",exact:true}).click();
 await expect(panel.locator(".op-result-row strong")).toHaveText("9");
 await page.getByRole("link",{name:"Discovery",exact:true}).click();
 await page.getByRole("link",{name:"Quantification"}).click();
 await expect(input(lost)).toHaveValue("9");
});
