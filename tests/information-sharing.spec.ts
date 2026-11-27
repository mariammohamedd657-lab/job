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
test("missed calls and outside-hours calls do not impose a unique-lead count ceiling",()=>{
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
  expect(shared.values[unique]).toBeUndefined();
  expect(shared.values[recovered]).toBeUndefined();
  const reverse=solve(c,{total:"67",[unique]:"67"},eq);
  expect(reverse.values.affected).toBeUndefined();expect(reverse.values.unaffected).toBeUndefined();
  const ambiguous=solve(c,{affected:"67"},eq);
  expect(ambiguous.values[unique]).toBeUndefined();
  expect(ambiguous.values[lost]).toBeUndefined();
  const conflict=solve(c,{affected:"66",[unique]:"67",months:"2"},eq);
  expect(conflict.errors).toEqual([]);
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
 await expect(op(unique)).toHaveValue("");await expect(op(recovered)).toHaveValue("");
 await expect(affected).toHaveValue("67");await expect(field("Frequency","affected")).toHaveValue("67");
 await unaffected.fill("12");
 await expect(op(unique)).toHaveValue("");await expect(op(recovered)).toHaveValue("");
 await op(unique).fill("67");
 await expect(op(recovered)).toHaveValue("0");
 await unaffected.fill("");
 await total.fill("67");
 await expect(affected).toHaveValue("");await expect(unaffected).toHaveValue("");
 await panel.locator(".op-impact-toggle").click();
 await page.getByRole("link",{name:"Discovery",exact:true}).click();
 await page.getByRole("link",{name:"Quantification"}).click();
 await panel.locator(".op-impact-toggle").click();
 await expect(op(unique)).toHaveValue("67");
 await expect(op(lost)).toHaveValue("60");
});

test("recorded-duration observations are not automatically treated as affected units",()=>{
 for(const id of ["problem-5","problem-7","problem-18"]){
  const c=config(id),e=operationalEquations(panels(id));
  const zero=solve(c,{total:"0"},e);
  expect(zero.errors,id).toEqual([]);
  expect(zero.values.recordedUnits,id).toBe(0);expect(zero.values.hours,id).toBe(0);
  const known=solve(c,{total:"40",affected:"10",recordedUnits:"30",averageMinutes:"2"},e);
  expect(known.errors,id).toEqual([]);
  expect(known.values.hours,id).toBe(1);
  const conflict=solve(c,{total:"10",recordedUnits:"11",months:"3"},e);
  expect(conflict.errors.length,id).toBeGreaterThan(0);
  expect(conflict.values.months,id).toBe(3);
  const unknown=solve(c,{total:"40",affected:"10"},e);
  expect(unknown.values.recordedUnits,id).toBeUndefined();
 }
});

// Independent finite-population oracle: enumerate every feasible integer
// breakdown, then group by every possible subset of entered counts. This tests
// equality/inequality combinations that the interior algebra audit cannot cover.
test("exhaustive small-population count subsets for the qualified-lead subset configuration",()=>{
 test.setTimeout(120000);
 let cases=0,targets=0;
 for(const id of ["problem-7"]){
  const c=config(id),e=operationalEquations(panels(id));
  const u=id==="problem-7"?"op:lost-qualified-leads:affected-qualified-leads":unique;
  const pre=id==="problem-7"?"op:lost-qualified-leads:":"op:lost-leads:";
  const keys=["affected","unaffected",u,pre+"recovered",pre+"pending",pre+"result"];
  for(let total=0;total<=4;total++){
   const models:number[][]=[];
   for(let a=0;a<=total;a++)for(let n=0;n<=a;n++)for(let rec=0;rec<=n;rec++)for(let pen=0;pen<=n-rec;pen++)models.push([a,total-a,n,rec,pen,n-rec-pen]);
   for(let mask=0;mask<(1<<keys.length);mask++){
    const groups=new Map<string,number[][]>();
    for(const model of models){
     const group=model.filter((_,i)=>mask&(1<<i)).join(",");
     const rows=groups.get(group)??[];rows.push(model);groups.set(group,rows);
    }
    for(const rows of groups.values()){
     const raw:Record<string,string>={total:String(total)};
     keys.forEach((k,i)=>{if(mask&(1<<i))raw[k]=String(rows[0][i]);});
     const result=solve(c,raw,e);
     const context=id+" "+JSON.stringify(raw);
     if(result.errors.length)throw Error(context+" unexpected contradiction "+result.errors.join("; "));
     for(const [i,key] of keys.entries()){
      const expected=rows.every(row=>row[i]===rows[0][i])?rows[0][i]:undefined;
      if(result.values[key]!==expected)throw Error(context+" expected "+key+" "+expected+" got "+result.values[key]);
      targets++;
     }
     cases++;
    }
   }
  }
 }
 console.log("LOGICAL_COUNT_AUDIT "+JSON.stringify({problems:1,cases,targets,maximumTotal:4}));
});

test("independent finite lead-population oracle with explicitly known unique lead count",()=>{
 let cases=0;
 for(const id of ["problem-1","problem-2"]){
  const c=config(id),e=operationalEquations(panels(id)),keys=[recovered,pending,lost];
  for(let population=0;population<=8;population++){
   const models:number[][]=[];
   for(let rec=0;rec<=population;rec++)for(let pen=0;pen<=population-rec;pen++)models.push([rec,pen,population-rec-pen]);
   for(let mask=0;mask<8;mask++){
    const groups=new Map<string,number[][]>();
    for(const model of models){const k=model.filter((_,j)=>mask&(1<<j)).join(",");const group=groups.get(k)??[];group.push(model);groups.set(k,group);}
    for(const group of groups.values()){
     const raw:Record<string,string>={affected:"1",[unique]:String(population)};
     keys.forEach((key,j)=>{if(mask&(1<<j))raw[key]=String(group[0][j]);});
     // Zero population is incompatible with positive primary impact, not with a call event.
     const result=solve(c,raw,e,{includeBounds:true});
     expect(result.errors,JSON.stringify(raw)).toEqual([]);
     keys.forEach((key,j)=>{
      const values=group.map(x=>x[j]),min=Math.min(...values),max=Math.max(...values);
      expect(result.values[key],JSON.stringify(raw)+" "+key).toBe(min===max?min:undefined);
      expect(result.bounds?.[key].min).toBe(min);expect(result.bounds?.[key].max).toBe(max);
     });cases++;
    }
   }
  }
 }
 console.log("EXPLICIT_LEAD_POPULATION_AUDIT "+cases);
});
