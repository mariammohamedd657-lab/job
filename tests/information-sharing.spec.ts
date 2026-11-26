import { test,expect } from "@playwright/test";
import { configs } from "../app/quantification/config";
import { problems } from "../app/discovery/data";
import { operationalPanels,operationalEquations } from "../app/quantification/operational-data";
import { solve } from "../app/quantification/solver";

const lostId="negative-operational-lost-leads";
const unique="op:lost-leads:unique-leads",lost="op:lost-leads:result",recovered="op:lost-leads:recovered",pending="op:lost-leads:pending",rate="op:lost-leads:loss-rate";
const config=(id:string)=>configs.find(c=>c.id===id)!;
const panels=(id:string)=>operationalPanels(config(id),problems.find(p=>p.id===id)!.operationalImpacts.map(i=>i.id));
test("all 43 impact assignments use the same problem values and respect attributable populations",()=>{
 let count=0;
 for(const c of configs){
  const ps=panels(c.id),eq=operationalEquations(ps);
  const zero=solve(c,{total:"100",unaffected:"100"},eq);
  expect(zero.errors,c.id).toEqual([]);
  expect(zero.values.affected,c.id).toBe(0);
  for(const p of ps){
   count++;
   expect(zero.values[p.primaryKey],c.id+" "+p.name).toBe(0);
   const isolated=solve(c,{[p.primaryKey]:"0"},operationalEquations([p]));
   // No observed impact does not prove that the underlying problem did not occur.
   if(p.primaryKey!=="affected")expect(isolated.values.affected,c.id+" "+p.name).toBeUndefined();
   const conflict=solve(c,{affected:"0",[p.primaryKey]:"1",months:"3"},operationalEquations([p]));
   if(p.primaryKey!=="affected"){
    expect(conflict.errors.length,c.id+" "+p.name).toBeGreaterThan(0);
    expect(conflict.values.affected).toBe(0);
    expect(conflict.values[p.primaryKey]).toBe(1);
    expect(conflict.values.months).toBe(3);
   }
   for(const f of p.fields.filter(f=>f.shared)){
    const base=Object.values(c.fields).flat().find(x=>x.key===f.key);
    expect(base).toBeDefined();
    expect(base?.label).toBe(f.label);
    expect(base?.unit).toBe(f.unit);
   }
  }
 }
 expect(count).toBe(43);
});
test("missed calls and outside-hours calls share logical bounds without assuming one lead per call",()=>{
 for(const id of ["problem-1","problem-2"]){
  const c=config(id),eq=operationalEquations(panels(id));
  const screenshot=solve(c,{affected:"100",[unique]:"67",[pending]:"7"},eq);
  expect(screenshot.errors).toEqual([]);
  expect(screenshot.values[lost]).toBeUndefined();
  expect(screenshot.values[recovered]).toBeUndefined();
  const complete=solve(c,{affected:"100",[unique]:"67",[pending]:"7",[recovered]:"0"},eq);
  expect(complete.values[lost]).toBe(60);
  expect(complete.values[rate]).toBeCloseTo(60/67*100);
  const shared=solve(c,{total:"80",unaffected:"13",[pending]:"7",[lost]:"60"},eq);
  expect(shared.errors).toEqual([]);
  expect(shared.values.affected).toBe(67);
  expect(shared.values[unique]).toBe(67);
  expect(shared.values[recovered]).toBe(0);
  const reverse=solve(c,{total:"67",[unique]:"67"},eq);
  expect(reverse.values.affected).toBe(67);expect(reverse.values.unaffected).toBe(0);
  const ambiguous=solve(c,{affected:"67"},eq);
  expect(ambiguous.values[unique]).toBeUndefined();
  expect(ambiguous.values[lost]).toBeUndefined();
  const conflict=solve(c,{affected:"66",[unique]:"67",months:"2"},eq);
  expect(conflict.errors.length).toBeGreaterThan(0);
  expect(conflict.values.months).toBe(2);
  expect(conflict.values.affected).toBe(66);expect(conflict.values[unique]).toBe(67);
  const changed=solve(c,{total:"80",unaffected:"12",[pending]:"7",[lost]:"60"},eq);
  expect(changed.values[unique]).toBeUndefined();expect(changed.values[recovered]).toBeUndefined();
  const removed=solve(c,{total:"80",[pending]:"7",[lost]:"60"},eq);
  expect(removed.values.affected).toBeUndefined();
 }
});
test("subset constraints propagate in both directions; distinct event and outcome populations remain distinct",()=>{
 const c=config("problem-7"),eq=operationalEquations(panels(c.id));
 const qualified="op:lost-qualified-leads:affected-qualified-leads";
 const r=solve(c,{total:"40",[qualified]:"40"},eq);
 expect(r.errors).toEqual([]);expect(r.values.affected).toBe(40);expect(r.values.unaffected).toBe(0);
 const overload=config("problem-28"),o=operationalEquations(panels(overload.id));
 const incomplete="op:fewer-tasks-completed:result";
 const only=solve(overload,{affected:"20"},o);
 expect(only.values[incomplete]).toBeUndefined();
 const equal=solve(overload,{total:"20",[incomplete]:"20"},o);
 expect(equal.errors).toEqual([]);expect(equal.values.affected).toBe(20);expect(equal.values.unaffected).toBe(0);
 for(const [id,key] of [["problem-3","op:fewer-appointments-booked:intended-bookings"],["problem-22","op:more-unpaid-invoices:affected-invoices"]]){
  const c=config(id),e=operationalEquations(panels(id));
  const r=solve(c,{affected:"2",[key]:"5"},e);
  expect(r.errors).toEqual([]);expect(r.values[key]).toBe(5);
 }
 // Problem-local periods and quantities do not cross into another problem.
 expect(solve(config("problem-2"),{},operationalEquations(panels("problem-2"))).values[unique]).toBeUndefined();
});
test("logical population links transfer values across visible inputs and recalculate on edit or deletion",async({page})=>{
 await page.goto("/");
 const problem=page.locator('[data-problem="problem-1"]');
 await problem.getByRole("button",{name:/^Expand/}).click();
 await problem.getByRole("checkbox",{name:"Lost leads",exact:true}).check();
 await page.getByRole("link",{name:"Quantification"}).click();
 const field=(section:string,key:string)=>page.locator('[data-section="'+section+'"] input[data-quantity="'+key+'"]');
 const total=field("Quantity","total"),unaffected=field("Quantity","unaffected"),affected=field("Quantity","affected");
 await total.fill("80");await unaffected.fill("13");
 await page.locator(".op-panel > button").click();
 const panel=page.locator(".op-impact-card");
 const op=(key:string)=>panel.locator('input[data-quantity="'+key+'"]');
 await op(pending).fill("7");await op(lost).fill("60");
 await expect(op(unique)).toHaveValue("67");await expect(op(recovered)).toHaveValue("0");
 await expect(affected).toHaveValue("67");await expect(field("Frequency","affected")).toHaveValue("67");
 await unaffected.fill("12");
 await expect(op(unique)).toHaveValue("");await expect(op(recovered)).toHaveValue("");
 await op(unique).fill("67");
 await expect(op(recovered)).toHaveValue("0");
 await unaffected.fill("");
 await total.fill("67");
 await expect(affected).toHaveValue("67");await expect(unaffected).toHaveValue("0");
 await panel.locator(".op-impact-toggle").click();
 await page.getByRole("link",{name:"Discovery",exact:true}).click();
 await page.getByRole("link",{name:"Quantification"}).click();
 await panel.locator(".op-impact-toggle").click();
 await expect(op(unique)).toHaveValue("67");
 await expect(op(lost)).toHaveValue("60");
});
