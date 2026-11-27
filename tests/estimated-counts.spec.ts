import {test,expect} from "@playwright/test";
import {configs} from "../app/quantification/config";
import {problems} from "../app/discovery/data";
import {operationalPanels,operationalEquations} from "../app/quantification/operational-data";
import {solve} from "../app/quantification/solver";

test("fractional estimates from percentages, frequencies, averages and comparisons work across all 28 problems",()=>{
 let routes=0;
 for(const c of configs){
  const ps=operationalPanels(c,problems.find(p=>p.id===c.id)!.operationalImpacts.map(i=>i.id)),e=operationalEquations(ps);
  const run=(raw:Record<string,string>,key:string,expected:number)=>{
   const r=solve(c,raw,e);
   expect(r.errors,c.id+" "+JSON.stringify(raw)).toEqual([]);
   expect(r.values[key],c.id+" "+key).toBeCloseTo(expected,10);
   expect(r.estimated.has(key),c.id+" "+key).toBe(true);
   routes++;return r;
  };
  const pct=run({total:"129",affectedPct:"40"},"affected",51.6);
  expect(pct.values.unaffected).toBeCloseTo(77.4,10);
  expect(pct.estimated.has("unaffected")).toBe(true);
  expect(pct.values.months).toBeUndefined();
  run({affected:"10",affectedPct:"40"},"total",25);
  run({unaffected:"7",affectedPct:"40"},"total",7/.6);
  const exact=solve(c,{total:"129",affectedPct:"40"},e,{exactInputs:new Set(["affectedPct"])});
  expect(exact.errors.length,c.id).toBeGreaterThan(0);
  const actual=solve(c,{total:"129",affected:"52"},e);
  expect(actual.errors,c.id).toEqual([]);expect(actual.values.unaffected).toBe(77);
  expect(actual.estimated.has("unaffected")).toBe(false);
  expect(actual.estimated.has("affectedPct")).toBe(false);
  expect(actual.values.affectedPct).toBeCloseTo(52/129*100,10);
  expect(solve(c,{affected:"51.6"},e).errors.length).toBeGreaterThan(0);
  if(c.fields.Frequency.length)run({days:"3",daily:"2.5"},"affected",7.5);
  if(c.timePopulation)run({hours:"1",averageMinutes:"7"},c.timePopulation,60/7);
  if(c.actualKey==="affected")run({target:"129",targetPct:"40"},"affected",51.6);
  if(c.moneyPopulation)run({moneyTotal:"100",moneyAverage:"30"},c.moneyPopulation,100/30);
 }
 console.log("ESTIMATE_BASE_AUDIT "+JSON.stringify({problems:28,routes}));
});

test("every operational rate configuration preserves estimates and uses them in all connected equations",()=>{
 let assignments=0,routes=0,exactConflicts=0;
 for(const c of configs){
  const ps=operationalPanels(c,problems.find(p=>p.id===c.id)!.operationalImpacts.map(i=>i.id));
  for(const p of ps){
   assignments++;
   const e=operationalEquations([p]),pair=p.undefinedRates?.[0];
   if(!pair)continue;
   const raw={[pair.denominator]:"129",[pair.rate]:"40"};
   const r=solve(c,raw,e);
   expect(r.errors,c.id+" "+p.name).toEqual([]);
   expect(r.values[p.primaryKey],c.id+" "+p.name).toBeCloseTo(51.6,10);
   expect(r.estimated.has(p.primaryKey)).toBe(true);
   routes++;
   if(p.fields.find(f=>f.primary)?.integer){
    const exact=solve(c,raw,e,{exactInputs:new Set([pair.rate])});
    expect(exact.errors.length,c.id+" "+p.name).toBeGreaterThan(0);exactConflicts++;
   }
   const supports=p.fields.filter(f=>/Recovered|Pending|Necessary time/.test(f.label));
   if(supports.length){
    const withSupport=solve(c,{...raw,[supports[0].key]:supports.length===2?"20":"77.4"},e);
    expect(withSupport.errors,c.id+" "+p.name).toEqual([]);
    if(supports.length===2){
     expect(withSupport.values[supports[1].key]).toBeCloseTo(57.4,10);
     expect(withSupport.estimated.has(supports[1].key)).toBe(true);
    }else expect(withSupport.values[supports[0].key]).toBeCloseTo(77.4,10);
    routes++;
   }
   const reverse=solve(c,{[p.primaryKey]:"7",[pair.rate]:"30"},e);
   expect(reverse.errors,c.id+" "+p.name).toEqual([]);
   expect(reverse.values[pair.denominator]).toBeCloseTo(70/3,10);
   expect(reverse.estimated.has(pair.denominator)).toBe(true);routes++;
  }
 }
 expect(assignments).toBe(43);
 console.log("ESTIMATE_IMPACT_AUDIT "+JSON.stringify({assignments,routes,exactConflicts}));
});

test("actual counts and missing fields remain distinct from estimates; no early rounding or stale values",()=>{
 const c=configs.find(x=>x.id==="problem-1")!,p=operationalPanels(c,["negative-operational-lost-leads"])[0],e=operationalEquations([p]);
 const unique="op:lost-leads:unique-leads",rate="op:lost-leads:loss-rate",lost=p.primaryKey,recovered="op:lost-leads:recovered",pending="op:lost-leads:pending";
 const r=solve(c,{[unique]:"129",[rate]:"40"},e);
 expect(r.errors).toEqual([]);expect(r.values[lost]).toBeCloseTo(51.6,12);
 expect(r.values[recovered]).toBeUndefined();expect(r.values[pending]).toBeUndefined();
 const chain=solve(c,{[unique]:"129",[rate]:"40",[pending]:"7"},e);
 expect(chain.errors).toEqual([]);expect(chain.values[recovered]).toBeCloseTo(70.4,12);
 expect(chain.estimated.has(recovered)).toBe(true);
 const actual=solve(c,{[unique]:"129",[recovered]:"71",[pending]:"7"},e);
 expect(actual.values[lost]).toBe(51);expect(actual.estimated.has(lost)).toBe(false);
 const edited=solve(c,{[unique]:"129",[rate]:"30",[pending]:"7"},e);
 expect(edited.values[lost]).toBeCloseTo(38.7,12);expect(edited.values[recovered]).toBeCloseTo(83.3,12);
 const removed=solve(c,{[unique]:"129",[pending]:"7"},e);
 expect(removed.values[lost]).toBeUndefined();expect(removed.values[recovered]).toBeUndefined();
 const conflict=solve(c,{[unique]:"129",[rate]:"40",[lost]:"52",months:"3"},e,{exactInputs:new Set([rate])});
 expect(conflict.errors.length).toBeGreaterThan(0);expect(conflict.values[lost]).toBe(52);expect(conflict.values.months).toBe(3);
 const invalid=solve(c,{[unique]:"129",[rate]:"110"},e);expect(invalid.errors.length).toBeGreaterThan(0);
 const zero=solve(c,{[unique]:"0"},e);expect(zero.values[lost]).toBe(0);expect(zero.values[rate]).toBeUndefined();
});

test("fractional operational estimates appear in actual editable browser fields and update both sections",async({page})=>{
 await page.goto("/");
 const problem=page.locator('[data-problem="problem-6"]');
 await problem.getByRole("button",{name:/^Expand/}).click();
 await problem.getByRole("checkbox",{name:"Lost leads",exact:true}).check();
 await page.getByRole("link",{name:"Quantification"}).click();
 await page.locator("#q-problem").click();await page.locator('#q-problem-options [data-value="problem-6"]').click();
 await page.locator(".op-panel > button").click();
 const base=(k:string)=>page.locator('[data-section="Quantity"] input[data-quantity="'+k+'"]');
 const panel=page.locator(".op-impact-card"),op=(k:string)=>panel.locator('input[data-quantity="'+k+'"]');
 const rate="op:lost-leads:loss-rate",lost="op:lost-leads:result",pending="op:lost-leads:pending",recovered="op:lost-leads:recovered";
 await base("total").fill("129");await base("affectedPct").fill("40");
 await expect(base("affected")).toHaveValue("51.6");await expect(base("unaffected")).toHaveValue("77.4");
 await expect(op("affected")).toHaveValue("51.6");
 await op(rate).fill("40");await expect(op(lost)).toHaveValue("20.64");
 await expect(panel.locator(".op-result")).toContainText("Estimated");
 await expect(panel.locator(".op-result-row strong")).toHaveText("20.64");
 await op(pending).fill("7");await expect(op(recovered)).toHaveValue("23.96");
 await expect(op(lost)).toBeEditable();
 await op(rate).fill("50");await expect(op(lost)).toHaveValue("25.8");
 await op(rate).fill("");await op(rate).blur();
 await expect(op(lost)).toHaveValue("");await expect(op(recovered)).toHaveValue("");
 await expect(base("affected")).toHaveValue("51.6");
 await base("affectedPct").fill("");await base("affectedPct").blur();
 await expect(op("affected")).toHaveValue("");
});
