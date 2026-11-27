import {test,expect} from "@playwright/test";
import {configs} from "../app/quantification/config";
import {solve,type Figures} from "../app/quantification/solver";
const run=(id:string,raw:Figures,recordedSubset=true)=>solve(configs.find(c=>c.id===id)!,raw,undefined,{populationClassification:"containment",recordedSubset,includeBounds:true});
for(const c of configs.filter(c=>c.timePopulation))test(c.id+" duration all directions",()=>{
 const k=c.timePopulation!;
 for(const [raw,key,n] of [[{[k]:"120",averageMinutes:"5"},"hours",10],[{hours:"10",[k]:"120"},"averageMinutes",5],[{hours:"10",averageMinutes:"5"},k,120]] as [Figures,string,number][]){const r=run(c.id,raw);expect(r.errors).toEqual([]);expect(r.values[key]).toBeCloseTo(n,10);}
});
for(const c of configs.filter(c=>c.actualKey))test(c.id+" comparison all directions",()=>{
 const a=c.actualKey!;
 for(const [raw,key,n] of [[{[a]:"90",target:"60"},"difference",30],[{[a]:"90",target:"60"},"targetPct",150],[{difference:"30",targetPct:"150"},a,90],[{difference:"30",targetPct:"150"},"target",60],[{difference:"-30",targetPct:"50"},a,30],[{difference:"-30",targetPct:"50"},"target",60]] as [Figures,string,number][]){const r=run(c.id,raw);expect(r.errors).toEqual([]);expect(r.values[key]).toBeCloseTo(n,10);}
 const equal=run(c.id,{targetPct:"100"});expect(equal.values.difference).toBe(0);expect(equal.values[a]).toBeUndefined();expect(equal.values.target).toBeUndefined();
 const zero=run(c.id,{[a]:"90",target:"0"});expect(zero.values.targetPct).toBeUndefined();expect(zero.undefinedKeys?.has("targetPct")).toBe(true);
 const bad=run(c.id,{[a]:"90",target:"60",difference:"40"});expect(bad.errors.length).toBeGreaterThan(0);expect(bad.bounds?.[a]?.min).toBe(100);expect(bad.bounds?.target?.min).toBe(50);expect(bad.bounds?.difference?.min).toBe(30);
});
test("distinct time populations and rescheduling",()=>{
 const r=run("problem-15",{affected:"5",reschedulingEvents:"12",hours:"1"});expect(r.errors).toEqual([]);expect(r.values.averageMinutes).toBeCloseTo(12);expect(r.values.averageEventMinutes).toBeCloseTo(5);
 expect(run("problem-17",{affected:"1200",averageMinutes:"6"}).values.hours).toBeCloseTo(120);
 expect(run("problem-5",{total:"10",recordedUnits:"120",averageMinutes:"5"},false).values.hours).toBeCloseTo(10);
 expect(run("problem-5",{recordedUnits:"0",hours:"0"}).undefinedKeys?.has("averageMinutes")).toBe(true);
});
test("distinct payment and invoice amount routes",()=>{
 const r=run("problem-22",{missedReminders:"12",affected:"5",moneyAverage:"200"});expect(r.errors).toEqual([]);expect(r.values.moneyTotal).toBe(1000);
 expect(run("problem-22",{moneyTotal:"1000",moneyAverage:"200"}).values.affected).toBe(5);
 expect(run("problem-23",{moneyTotal:"5000",affected:"20"}).values.moneyAverage).toBe(250);
});
test("staff capacity positive and zero shortfalls",()=>{
 const key="step2:staff-shortfall";
 for(const [raw,k,n] of [[{hours:"100",target:"80"},key,20],[{target:"80",[key]:"20"},"hours",100],[{hours:"100",[key]:"20"},"target",80],[{hours:"80",target:"100"},key,0]] as [Figures,string,number][]){const r=run("problem-28",raw);expect(r.errors).toEqual([]);expect(r.values[k]).toBeCloseTo(n);}
 const r=run("problem-28",{hours:"100",[key]:"0"});expect(r.errors).toEqual([]);expect(r.values.target).toBeUndefined();expect(r.bounds?.target?.min).toBe(100);
});
test("actual website duration fields",async({page})=>{
 await page.goto("/quantification");await page.locator("#q-problem").click();await page.locator('#q-problem-options [data-value="problem-5"]').click();
 const input=(k:string)=>page.locator('.q-calculator input[data-quantity="'+k+'"]').first();
 await input("recordedUnits").fill("120");await input("averageMinutes").fill("5");await expect(input("hours")).toHaveValue("10");
});
