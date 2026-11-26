import {test,expect,type Page} from "@playwright/test";
import {configs} from "../app/quantification/config";
import {problems} from "../app/discovery/data";
import {solve} from "../app/quantification/solver";
import {operationalPanels,operationalEquations,operationalMethods} from "../app/quantification/operational-data";

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
   if(panel.estimated)await expect(card.locator(".op-result")).toContainText("Estimated");
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

test("all 43 approved assignments are configured, with exact shared base IDs and no unapproved relationships",()=>{
 const expected:Record<string,string[]>={
 "problem-1":["lost-leads"],"problem-2":["lost-leads"],"problem-3":["fewer-appointments-booked"],"problem-4":["fewer-customers-served","lost-existing-customers"],"problem-5":["lost-leads"],"problem-6":["lost-leads"],"problem-7":["lost-qualified-leads"],"problem-8":["lost-leads"],"problem-9":["fewer-old-leads-reactivated"],"problem-10":["fewer-old-leads-reactivated","lost-leads"],"problem-11":["lost-leads"],"problem-12":["fewer-appointments-attended","unused-appointment-slots"],"problem-13":["fewer-appointments-attended","unused-appointment-slots"],"problem-14":["unused-appointment-slots","fewer-customers-served"],"problem-15":["fewer-appointments-attended","less-staff-time-available-for-other-work"],"problem-16":["fewer-customers-served"],"problem-17":["less-staff-time-available-for-other-work","fewer-tasks-completed"],"problem-18":["fewer-customers-served","lost-existing-customers"],"problem-19":["less-staff-time-available-for-other-work"],"problem-20":["less-staff-time-available-for-other-work","fewer-tasks-completed","fewer-customers-served"],"problem-21":["fewer-customers-served","lost-existing-customers"],"problem-22":["more-unpaid-invoices"],"problem-23":["more-unpaid-invoices"],"problem-24":["fewer-customer-reviews","fewer-new-customers"],"problem-25":["missing-business-information"],"problem-26":["missing-business-information","lost-leads"],"problem-27":["missing-business-information"],"problem-28":["fewer-tasks-completed","fewer-customers-served","lost-leads"]};
 expect(Object.keys(operationalMethods)).toHaveLength(28);
 let count=0;
 for(const c of configs){
  const problem=problems.find(p=>p.id===c.id)!;
  const ids=expected[c.id].map(k=>"negative-operational-"+k);
  expect(problem.operationalImpacts.map(i=>i.id)).toEqual(ids);
  expect(Object.keys(operationalMethods[c.id])).toEqual(expected[c.id]);
  const panels=operationalPanels(c,ids);
  count+=panels.length;
  expect(panels.every(p=>p.verified)).toBe(true);
  expect(operationalPanels(c,[])).toEqual([]);
  for(const panel of panels){
   expect(panel.fields.filter(f=>f.primary)).toHaveLength(1);
   expect(new Set(panel.fields.map(f=>f.key)).size).toBe(panel.fields.length);
   expect(panel.fields.find(f=>f.primary)?.key).toBe(panel.primaryKey);
   for(const f of panel.fields.filter(f=>f.shared)){
    const baseField=Object.values(c.fields).flat().find(v=>v.key===f.key);
    expect(baseField).toBeDefined();
    expect(f.label).toBe(baseField?.label);expect(f.unit).toBe(baseField?.unit);
   }
   for(const rel of panel.relations)for(const key of rel.keys)expect(panel.fields.some(f=>f.key===key)).toBe(true);
  }
 }
 expect(count).toBe(43);
});

test("every configured equation solves every single-unknown position and combined routes",()=>{
 let directions=0;
 for(const c of configs){
  const problem=problems.find(p=>p.id===c.id)!;
  for(const panel of operationalPanels(c,problem.operationalImpacts.map(i=>i.id))){
   const eq=operationalEquations([panel]);
   const example=panel.example??{};
   const complete=solve(c,example,eq);
   expect(complete.errors, c.id+" / "+panel.name).toEqual([]);
   expect(complete.values[panel.primaryKey]).toBeDefined();
   if(!panel.relations.length){
    expect(complete.calculated[panel.primaryKey]).toBeUndefined();
    continue;
   }
   for(const rel of panel.relations){
    for(const missing of rel.keys){
     const raw=Object.fromEntries(rel.keys.filter(k=>k!==missing).map(k=>[k,String(complete.values[k])]));
     const result=solve(c,raw,eq);
     expect(result.errors,c.id+" / "+panel.name+" / "+rel.label+" / "+missing).toEqual([]);
     expect(result.values[missing],c.id+" / "+rel.label+" / "+missing).toBeCloseTo(complete.values[missing],7);
     expect(result.calculated[missing]).toBeDefined();
     directions++;
    }
   }
  }
 }
 expect(directions).toBeGreaterThan(100);
});

test("confirmed counts reject fractions; potential outcomes allow decimals; direct entry and population identity remain distinct",()=>{
 const panelFor=(id:string,key:string)=>{
  const c=configs.find(x=>x.id===id)!;
  return {c,p:operationalPanels(c,["negative-operational-"+key])[0]};
 };
 const lostPanel=panelFor("problem-6","lost-leads");
 expect(solve(lostPanel.c,{affected:"10",[rate]:"15"},operationalEquations([lostPanel.p])).errors.length).toBeGreaterThan(0);
 expect(solve(lostPanel.c,{[lost]:"1.5"},operationalEquations([lostPanel.p])).errors.length).toBeGreaterThan(0);
 const react=panelFor("problem-9","fewer-old-leads-reactivated");
 const rr=react.p.fields.find(f=>f.unit==="%")!;
 expect(solve(react.c,{affected:"3",[rr.key]:"50"},operationalEquations([react.p])).values[react.p.primaryKey]).toBe(1.5);
 const review=panelFor("problem-24","fewer-customer-reviews");
 expect(solve(review.c,{affected:"5",[review.p.fields.find(f=>f.unit==="%")!.key]:"30"},operationalEquations([review.p])).values[review.p.primaryKey]).toBeCloseTo(1.5);
 for(const id of ["problem-1","problem-2"]){
  const {c,p}=panelFor(id,"lost-leads");
  const result=solve(c,{affected:"50",[p.fields[0].key]:"30",[recovered]:"8",[pending]:"10"},operationalEquations([p]));
  expect(result.errors).toEqual([]);expect(result.values.affected).toBe(50);expect(result.values[p.primaryKey]).toBe(12);
 }
 for(const [id,key] of [["problem-3","fewer-appointments-booked"],["problem-7","lost-qualified-leads"],["problem-22","more-unpaid-invoices"]]){
  const {c,p}=panelFor(id,key);
  const result=solve(c,{affected:"50"},operationalEquations([p]));
  expect(result.values[p.primaryKey]).toBeUndefined();
 }
 const overload=panelFor("problem-28","fewer-tasks-completed");
 expect(overload.p.primaryKey).not.toBe("affected");
 expect(solve(overload.c,{affected:"50"},operationalEquations([overload.p])).values[overload.p.primaryKey]).toBeUndefined();
 const slots=panelFor("problem-14","unused-appointment-slots");
 expect(solve(slots.c,{affected:"50"},operationalEquations([slots.p])).values[slots.p.primaryKey]).toBeUndefined();
});

test("multiple impacts combine only approved shared quantities; edits propagate through existing problem equations",()=>{
 const c=configs.find(x=>x.id==="problem-10")!;
 const ps=operationalPanels(c,["negative-operational-fewer-old-leads-reactivated",lostId]);
 const react=ps[0], loss=ps[1];
 const reactRate=react.fields.find(f=>f.unit==="%")!.key;
 const result=solve(c,{total:"100",[recovered]:"10",[pending]:"10",[lost]:"20",[reactRate]:"25",days:"10"},operationalEquations(ps));
 expect(result.errors).toEqual([]);
 expect(result.values.affected).toBe(40);expect(result.values.unaffected).toBe(60);expect(result.values.daily).toBe(4);
 expect(result.values[react.primaryKey]).toBe(10);expect(result.values[loss.primaryKey]).toBe(20);
 const manual=configs.find(x=>x.id==="problem-20")!;
 const p=operationalPanels(manual,["negative-operational-less-staff-time-available-for-other-work","negative-operational-fewer-tasks-completed","negative-operational-fewer-customers-served"]);
 const necessary=p[0].fields.find(f=>f.label==="Necessary time")!.key;
 const r=solve(manual,{[necessary]:"3",[p[0].primaryKey]:"2",averageMinutes:"15",total:"100",[p[1].primaryKey]:"7",[p[2].primaryKey]:"4"},operationalEquations(p));
 expect(r.errors).toEqual([]);expect(r.values.hours).toBe(5);expect(r.values.affected).toBe(20);expect(r.values.unaffected).toBe(80);
 expect(r.values[p[0].fields.find(f=>f.unit==="%")!.key]).toBe(40);
 expect(r.values[p[1].primaryKey]).toBe(7);expect(r.values[p[2].primaryKey]).toBe(4);
 for(const id of ["problem-25","problem-26","problem-27"]){
  const config=configs.find(x=>x.id===id)!;
  const panel=operationalPanels(config,["negative-operational-missing-business-information"])[0];
  expect(panel.fields).toHaveLength(1);expect(panel.primaryKey).toBe("affected");
  expect(solve(config,{total:"100",unaffected:"75"},operationalEquations([panel])).values[panel.primaryKey]).toBe(25);
 }
});

test("zero and 100% boundaries determine zero counts without inventing unknown denominators",()=>{
 for(const c of configs){
  const problem=problems.find(p=>p.id===c.id)!;
  for(const panel of operationalPanels(c,problem.operationalImpacts.map(i=>i.id))){
   const rate=panel.fields.find(f=>f.unit==="%");
   if(!rate)continue;
   const eq=operationalEquations([panel]);
   const pair=panel.undefinedRates![0];
   const zero=solve(c,{[pair.denominator]:"0"},eq);
   expect(zero.errors,c.id+" / "+panel.name).toEqual([]);
   expect(zero.values[panel.primaryKey]).toBe(0);
   expect(zero.values[rate.key]).toBeUndefined();
   const rateZero=solve(c,{[rate.key]:"0"},eq);
   expect(rateZero.errors).toEqual([]);
   expect(rateZero.values[panel.primaryKey]).toBe(0);
   expect(rateZero.values[pair.denominator]).toBeUndefined();
   expect(solve(c,{[pair.denominator]:"0",[rate.key]:"50"},eq).errors.length).toBeGreaterThan(0);
  }
 }
 const result=solve(config,{affected:"26",[recovered]:"26"},equations);
 expect(result.errors).toEqual([]);
 expect(result.values[lost]).toBe(0);
 expect(result.values[pending]).toBe(0);
 expect(result.values[rate]).toBe(0);
 const allLost=solve(config,{affected:"26",[rate]:"100"},equations);
 expect(allLost.errors).toEqual([]);
 expect(allLost.values[lost]).toBe(26);
 expect(allLost.values[recovered]).toBe(0);
 expect(allLost.values[pending]).toBe(0);
 const unknown=solve(config,{[rate]:"100"},equations);
 expect(unknown.values[recovered]).toBe(0);expect(unknown.values[pending]).toBe(0);
 expect(unknown.values.affected).toBeUndefined();expect(unknown.values[lost]).toBeUndefined();
});
