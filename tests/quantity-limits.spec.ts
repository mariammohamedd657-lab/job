import {test,expect} from "@playwright/test";
import {configs} from "../app/quantification/config";
import {problems} from "../app/discovery/data";
import {operationalPanels,operationalEquations} from "../app/quantification/operational-data";
import {solve} from "../app/quantification/solver";
const cfg=(id:string)=>configs.find(c=>c.id===id)!;
const all=(id:string)=>operationalEquations(operationalPanels(cfg(id),problems.find(p=>p.id===id)!.operationalImpacts.map(i=>i.id)));
const unique="op:lost-leads:unique-leads",recovered="op:lost-leads:recovered",pending="op:lost-leads:pending",lost="op:lost-leads:result",rate="op:lost-leads:loss-rate";
test("proactive lead limits, estimated values and correction of invalid entries",()=>{
 const c=cfg("problem-1"),e=all(c.id),run=(raw:Record<string,string>)=>solve(c,raw,e,{includeBounds:true});
 const r=run({[unique]:"123",[recovered]:"78"});
 expect(r.errors).toEqual([]);
 for(const key of [pending,lost]){expect(r.values[key]).toBeUndefined();expect(r.bounds?.[key].min).toBe(0);expect(r.bounds?.[key].max).toBe(45);}
 expect(r.bounds?.[rate].min).toBe(0);expect(r.bounds?.[rate].max).toBeCloseTo(45/123*100,12);
 const invalid=run({[unique]:"123",[recovered]:"78",[pending]:"46"});
 expect(invalid.errors.length).toBeGreaterThan(0);expect(invalid.values[pending]).toBe(46);expect(invalid.bounds?.[pending].max).toBe(45);
 const badRate=run({[unique]:"123",[recovered]:"78",[rate]:"40"});
 expect(badRate.errors.length).toBeGreaterThan(0);expect(badRate.bounds?.[rate].max).toBeCloseTo(45/123*100,12);
 for(const raw of [{[unique]:"123",[recovered]:"78",[rate]:"30"},{[rate]:"30",[recovered]:"78",[unique]:"123"}]){
  const result=run(raw);expect(result.errors).toEqual([]);expect(result.values[lost]).toBeCloseTo(36.9,12);expect(result.values[pending]).toBeCloseTo(8.1,12);
  expect(result.estimated.has(lost)).toBe(true);expect(result.estimated.has(pending)).toBe(true);
 }
 const limited=run({affected:"123",[recovered]:"78",[pending]:"7"});
 expect(limited.bounds?.[rate].max).toBe(100);
 expect(limited.bounds?.[unique].max).toBeUndefined();
 const zero=run({[unique]:"123",[recovered]:"123"});
 expect(zero.values[lost]).toBe(0);expect(zero.values[pending]).toBe(0);
 const deleted=run({[unique]:"123"});
 expect(deleted.bounds?.[pending].max).toBe(123);expect(deleted.bounds?.[rate].max).toBe(100);
 const undefinedRate=run({[unique]:"0"});expect(undefinedRate.bounds?.[rate]).toBeUndefined();
});
test("all problem configurations expose applicable numerical limits without filling ambiguous fields",()=>{
 for(const c of configs){
  const e=all(c.id);
  const r=solve(c,{total:"123" },e,{includeBounds:true});
  expect(r.errors,c.id).toEqual([]);
  expect(r.bounds?.affected.min,c.id).toBe(0);expect(r.bounds?.affected.max,c.id).toBe(123);
  expect(r.bounds?.unaffected.max,c.id).toBe(123);expect(r.values.affected,c.id).toBeUndefined();
  expect(r.bounds?.affectedPct.max,c.id).toBe(100);
  expect(r.bounds?.months.min,c.id).toBe(0);expect(r.bounds?.months.max,c.id).toBeUndefined();
  if(c.actualKey==="affected"){expect(r.bounds?.difference.max,c.id).toBe(123);expect(r.bounds?.difference.min,c.id).toBeUndefined();}
  if(c.timePopulation==="recordedUnits")expect(r.bounds?.recordedUnits.max,c.id).toBe(123);
  const invalid=solve(c,{total:"123",affected:"124"},e,{includeBounds:true});
  expect(invalid.errors.length,c.id).toBeGreaterThan(0);expect(invalid.bounds?.affected.max,c.id).toBe(123);
  for(const p of operationalPanels(c,problems.find(x=>x.id===c.id)!.operationalImpacts.map(x=>x.id))){
   const pair=p.undefinedRates?.[0];if(!pair)continue;
   const limited=solve(c,{[pair.denominator]:"123"},operationalEquations([p]),{includeBounds:true});
   expect(limited.errors,c.id+" "+p.name).toEqual([]);
   expect(limited.bounds?.[p.primaryKey].min).toBe(0);expect(limited.bounds?.[p.primaryKey].max).toBe(123);
   expect(limited.bounds?.[pair.rate].max).toBe(100);
  }
 }
});
test("limits are visible before the next entry and remain after invalid input",async({page})=>{
 await page.goto("/");
 const p=page.locator('[data-problem="problem-1"]');
 await p.getByRole("button",{name:/^Expand/}).click();
 await p.getByRole("checkbox",{name:"Lost leads",exact:true}).check();
 await page.getByRole("link",{name:"Quantification"}).click();
 await page.locator(".op-panel > button").click();
 const panel=page.locator(".op-impact-card");
 const input=(key:string)=>panel.locator('input[data-quantity="'+key+'"]');
 const hint=(key:string)=>panel.locator('[data-quantity-limit="'+key+'"]');
 await input(unique).fill("123");await input(recovered).fill("78");
 await expect(input(pending)).toHaveValue("");await expect(hint(pending)).toHaveText("Min: 0 · Max: 45");
 await expect(hint(lost)).toHaveText("Min: 0 · Max: 45");
 await expect(hint(rate)).toHaveText("Min: 0% · Max: ≈ 36.59%");
 await expect(panel.locator(".q-formula")).toHaveCount(0);
 await input(pending).fill("46");await expect(input(pending)).toHaveValue("46");
 await expect(hint(pending)).toHaveText("Min: 0 · Max: 45");
 await expect(hint(pending)).toHaveClass(/q-limits-conflict/);
 await expect(hint(lost)).toHaveText("Min: 0 · Max: 45");
 await expect(hint(rate)).toHaveText("Min: 0% · Max: ≈ 36.59%");
 await input(pending).fill("");await input(pending).blur();
 await input(rate).fill("30");await expect(input(lost)).toHaveValue("36.9");await expect(input(pending)).toHaveValue("8.1");
 await expect(input(pending)).toBeEditable();
 await input(rate).fill("");await input(rate).blur();
 await expect(input(pending)).toHaveValue("");await expect(hint(pending)).toHaveText("Min: 0 · Max: 45");
 await page.locator(".q-calculator").getByRole("checkbox",{name:"Show calculations"}).check();
 await expect(hint(pending).locator("xpath=following-sibling::div[contains(@class,'q-formula')]")).toBeVisible();
});


test("comparison bounds combine difference, population and percentage relationships",()=>{
 const c=cfg("problem-1"),e=all(c.id);
 const higher=solve(c,{total:"100",difference:"20"},e,{includeBounds:true});
 expect(higher.errors).toEqual([]);
 expect(higher.bounds?.targetPct.min).toBeCloseTo(125,10);
 expect(higher.bounds?.targetPct.max).toBeUndefined();
 const lower=solve(c,{total:"100",difference:"-20"},e,{includeBounds:true});
 expect(lower.errors).toEqual([]);
 expect(lower.bounds?.targetPct.max).toBeCloseTo(100/120*100,10);
 const only=solve(c,{difference:"20"},e,{includeBounds:true});
 expect(only.bounds?.targetPct.min).toBe(100);
 expect(only.bounds?.targetPct.minExclusive).toBe(true);
 const below=solve(c,{difference:"-20"},e,{includeBounds:true});
 expect(below.bounds?.targetPct.max).toBe(100);
 expect(below.bounds?.targetPct.maxExclusive).toBe(true);
});

test("independent small-population enumeration checks all exact count limits",()=>{
 test.setTimeout(120000);
 let cases=0,checks=0;
 for(const id of ["problem-7"]){
  const c=cfg(id),e=all(id);
  const pre=id==="problem-7"?"op:lost-qualified-leads:":"op:lost-leads:";
  const keys=["affected","unaffected",id==="problem-7"?pre+"affected-qualified-leads":unique,pre+"recovered",pre+"pending",pre+"result"];
  for(let total=0;total<=4;total++){
   const models:number[][]=[];
   for(let a=0;a<=total;a++)for(let n=0;n<=a;n++)for(let rec=0;rec<=n;rec++)for(let pen=0;pen<=n-rec;pen++)models.push([a,total-a,n,rec,pen,n-rec-pen]);
   for(let mask=0;mask<1<<keys.length;mask++){
    const groups=new Map<string,number[][]>();
    for(const model of models){const key=model.filter((_,i)=>mask&(1<<i)).join(",");const rows=groups.get(key)??[];rows.push(model);groups.set(key,rows);}
    for(const rows of groups.values()){
     const raw:Record<string,string>={total:String(total)};
     keys.forEach((k,i)=>{if(mask&(1<<i))raw[k]=String(rows[0][i]);});
     const result=solve(c,raw,e,{includeBounds:true});
     const label=id+" "+JSON.stringify(raw);
     if(result.errors.length)throw Error(label+" "+result.errors.join("; "));
     for(const [i,key] of keys.entries()){
      const lo=Math.min(...rows.map(row=>row[i])),hi=Math.max(...rows.map(row=>row[i]));
      const range=result.bounds?.[key];
      if(range?.min!==lo||range?.max!==hi)throw Error(label+" "+key+" expected "+lo+".."+hi+" got "+JSON.stringify(range));
      checks++;
     }
     cases++;
    }
   }
  }
 }
 console.log("LIMIT_AUDIT "+JSON.stringify({problems:1,cases,checks}));
});
