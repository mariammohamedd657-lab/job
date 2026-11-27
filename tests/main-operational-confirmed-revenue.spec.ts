import {test,expect} from "@playwright/test";
import {configs} from "../app/quantification/config";
import {operationalPanels,operationalEquations,operationalMethods} from "../app/quantification/operational-data";
import {confirmedRevenueEquations} from "../app/quantification/confirmed-revenue";
import {financialContent} from "../app/quantification/step2-content";
import {solve,type Figures} from "../app/quantification/solver";
for(const c of configs){
 for(const [id,method] of Object.entries(operationalMethods[c.id])){
  if(!["calls","leads","direct-leads","qualified","booking"].includes(method))continue;
  test(c.id+" "+id+" minimum sufficient inputs",()=>{
   const p=operationalPanels(c,["negative-operational-"+id])[0],e=operationalEquations([p]),prefix="op:"+id+":";
   const T=method==="leads"?"affected":prefix+(method==="qualified"?"affected-qualified-leads":method==="booking"?"intended-bookings":"unique-leads"),R=prefix+"recovered",P=prefix+"pending",L=p.primaryKey,r=prefix+"loss-rate";
   const values:Figures={[T]:"100",[R]:"40",[P]:"30",[L]:"30",[r]:"30"};
   const groups=[[T,R,P],[T,R,L],[T,R,r],[T,P,L],[T,P,r],[T,L,r],[R,P,L],[R,P,r],[R,L,r],[P,L,r]];
   for(const group of groups){const raw=Object.fromEntries(group.map(k=>[k,values[k]]));const result=solve(c,raw,e,{populationClassification:"containment",includeBounds:true});expect(result.errors,group.join(",")).toEqual([]);for(const k of Object.keys(values)){if(group.includes(k)||group.join()!==[T,L,r].join()||![R,P].includes(k))expect(result.values[k],k).toBeCloseTo(Number(values[k]),9);} }
  });
 }
 if(financialContent(c).some(o=>o.id==="F1"))test(c.id+" confirmed revenue nine directions",()=>{
  const e=confirmedRevenueEquations(c,{fields:[],relations:[]}),R="fin:confirmed-revenue",P="fin:confirmed-purchases",A="fin:average-revenue-purchase",B="fin:purchase-revenue",V="fin:retained-revenue",T="fin:purchase-total-revenue",N="fin:total-purchases";
  const cases:[Figures,string,number][]=[[{[P]:"20",[A]:"500"},R,10000],[{[R]:"10000",[A]:"500"},P,20],[{[R]:"10000",[P]:"20"},A,500],[{[B]:"25000",[V]:"15000"},R,10000],[{[R]:"10000",[V]:"15000"},B,25000],[{[B]:"25000",[R]:"10000"},V,15000],[{[T]:"100000",[N]:"200"},A,500],[{[A]:"500",[N]:"200"},T,100000],[{[T]:"100000",[A]:"500"},N,200]];
  for(const [raw,key,n] of cases){const r=solve(c,raw,e);expect(r.errors).toEqual([]);expect(r.values[key]).toBeCloseTo(n,9);}
  const r=solve(c,{[T]:"100000",[N]:"200",[P]:"20",[B]:"25000"},e);expect(r.values[R]).toBe(10000);expect(r.values[V]).toBe(15000);
 });
}
test("missed calls restrictions and correction alternatives",()=>{
 const c=configs.find(c=>c.id==="problem-1")!,p=operationalPanels(c,["negative-operational-lost-leads"])[0],e=operationalEquations([p]),T="op:lost-leads:unique-leads",R="op:lost-leads:recovered",P="op:lost-leads:pending",L=p.primaryKey,r="op:lost-leads:loss-rate";
 const run=(raw:Figures)=>solve(c,raw,e,{includeBounds:true});
 const a=run({[T]:"123",[R]:"78"});expect(a.bounds?.[P]?.max).toBe(45);expect(a.bounds?.[L]?.max).toBe(45);expect(a.bounds?.[r]?.max).toBeCloseTo(45/123*100);
 const b=run({[T]:"123",[R]:"78",[r]:"30"});expect(b.values[L]).toBeCloseTo(36.9);expect(b.values[P]).toBeCloseTo(8.1);
 const d=run({[T]:"123",[R]:"78",[r]:"56"});expect(d.errors.length).toBeGreaterThan(0);expect(d.bounds?.[T]?.min).toBe(178);expect(d.bounds?.[R]?.max).toBe(54);expect(d.bounds?.[r]?.max).toBeCloseTo(45/123*100);
});
test("confirmed revenue is automatically calculated in website",async({page})=>{
 await page.goto("/quantification");await page.getByRole("button",{name:"Negative financial impacts",exact:true}).click();const card=page.locator('[data-financial-impact="F1"]');await card.locator(".fin-check").check();
 const input=(k:string)=>card.locator('input[data-quantity="fin:'+k+'"]').first();
 await input("confirmed-purchases").fill("20");await input("average-revenue-purchase").fill("500");await expect(input("confirmed-revenue")).toHaveValue("10000");
});
