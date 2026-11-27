import {test,expect} from "@playwright/test";
import {configs} from "../app/quantification/config";
import {financialContent} from "../app/quantification/step2-content";
import {confirmedRevenueEquations} from "../app/quantification/confirmed-revenue";
import {confirmedProfitEquations} from "../app/quantification/confirmed-profit";
import {solve,type Figures} from "../app/quantification/solver";
const L="fin:confirmed-profit",R="fin:confirmed-revenue",C="fin:avoided-variable",P="fin:confirmed-purchases",A="fin:average-revenue-purchase",M="fin:confirmed-margin",G="fin:average-profit-purchase",J="fin:average-avoided-purchase",T="fin:purchase-total-revenue",W="fin:purchase-variable-costs",H="fin:purchase-total-profit",N="fin:total-purchases",K="fin:average-variable-purchase";
for(const c of configs.filter(c=>financialContent(c).some(o=>o.id==="F2")))test(c.id+" confirmed contribution profit routes",()=>{
 const base=confirmedRevenueEquations(c,{fields:[],relations:[]}),e=confirmedProfitEquations(c,base),run=(raw:Figures)=>solve(c,raw,e,{includeBounds:true});
 const cases:[Figures,string,number][]=[
 [{[R]:"10000",[C]:"4000"},L,6000],[{[L]:"6000",[C]:"4000"},R,10000],[{[R]:"10000",[L]:"6000"},C,4000],
 [{[R]:"10000",[M]:"60"},L,6000],[{[L]:"6000",[M]:"60"},R,10000],[{[L]:"6000",[R]:"10000"},M,60],
 [{[P]:"20",[G]:"300"},L,6000],[{[L]:"6000",[G]:"300"},P,20],[{[P]:"20",[L]:"6000"},G,300],
 [{[P]:"20",[J]:"200"},C,4000],[{[C]:"4000",[J]:"200"},P,20],[{[P]:"20",[C]:"4000"},J,200],
 [{[T]:"100000",[W]:"40000"},H,60000],[{[T]:"100000",[H]:"60000"},W,40000],[{[H]:"60000",[W]:"40000"},T,100000],
 [{[H]:"60000",[N]:"200"},G,300],[{[G]:"300",[N]:"200"},H,60000],[{[H]:"60000",[G]:"300"},N,200],
 [{[W]:"40000",[N]:"200"},K,200],[{[K]:"200",[N]:"200"},W,40000],[{[W]:"40000",[K]:"200"},N,200],
 [{[T]:"100000",[H]:"60000"},M,60],[{[M]:"60",[T]:"100000"},H,60000],[{[H]:"60000",[M]:"60"},T,100000],
 [{[A]:"500",[K]:"200"},G,300],[{[G]:"300",[K]:"200"},A,500],[{[A]:"500",[G]:"300"},K,200]
 ];
 for(const [raw,key,n] of cases){const r=run(raw);expect(r.errors,key).toEqual([]);expect(r.values[key],key).toBeCloseTo(n,8);}
 const combined=run({[P]:"20",[A]:"500",[J]:"200"});expect(combined.errors).toEqual([]);expect(combined.values[R]).toBe(10000);expect(combined.values[C]).toBe(4000);expect(combined.values[L]).toBe(6000);
 expect(run({[R]:"1000",[C]:"3000"}).values[L]).toBe(-2000);
 expect(run({[R]:"1000",[M]:"-200"}).values[L]).toBe(-2000);
 expect(run({[P]:"0"}).values[L]).toBe(0);expect(run({[P]:"0"}).values[G]).toBeUndefined();
 expect(run({[K]:"200"}).values[J]).toBeUndefined();
 expect(solve(c,{[K]:"200"},confirmedProfitEquations(c,base,true)).values[J]).toBe(200);
 const bad=run({[R]:"10000",[C]:"4000",[L]:"7000"});expect(bad.errors.length).toBeGreaterThan(0);expect(bad.values[L]).toBe(7000);expect(bad.bounds?.[L]?.min).toBe(6000);
});
test("confirmed profit actual browser fields",async({page})=>{
 await page.goto("/quantification");await page.getByRole("button",{name:"Negative financial impacts",exact:true}).click();
 const card=page.locator('[data-financial-impact="F2"]');await card.locator(".fin-check").check();const input=(k:string)=>card.locator('input[data-quantity="'+k+'"]').first();await input(R).fill("10000");await input(C).fill("4000");await expect(input(L)).toHaveValue("6000");await input(C).fill("12000");await expect(input(L)).toHaveValue("-2000");
});
