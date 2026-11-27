import {test,expect} from "@playwright/test";
import {configs} from "../app/quantification/config";
import {financialContent} from "../app/quantification/step2-content";
import {confirmedFinancialEquations} from "../app/quantification/confirmed-financial";
import {potentialAndCostEquations} from "../app/quantification/potential-financial";
import {solve,type Figures} from "../app/quantification/solver";
const R="fin:confirmed-revenue",P="fin:confirmed-purchases",A="fin:average-revenue-purchase",B="fin:purchase-revenue",V="fin:retained-revenue",T="fin:purchase-total-revenue",N="fin:total-purchases";
for(const c of configs.filter(c=>financialContent(c).some(o=>o.id==="F1"))){
 const e=potentialAndCostEquations(c,confirmedFinancialEquations(c,{fields:[],relations:[]}));
 const run=(raw:Figures)=>solve(c,raw,e,{includeBounds:true});
 test(c.id+" confirmed revenue minimum sufficient directions",()=>{
  const cases:[Figures,string,number][]=[
   [{[P]:"20",[A]:"500"},R,10000],[{[R]:"10000",[A]:"500"},P,20],[{[R]:"10000",[P]:"20"},A,500],
   [{[B]:"25000",[V]:"15000"},R,10000],[{[R]:"10000",[V]:"15000"},B,25000],[{[B]:"25000",[R]:"10000"},V,15000],
   [{[T]:"100000",[N]:"200"},A,500],[{[A]:"500",[N]:"200"},T,100000],[{[T]:"100000",[A]:"500"},N,200]
  ];
  for(const [raw,key,value] of cases){for(const input of [raw,Object.fromEntries(Object.entries(raw).reverse())]){const r=run(input);expect(r.errors,key).toEqual([]);expect(r.values[key],key).toBeCloseTo(value,9);}}
  const full=run({[T]:"100000",[N]:"200",[P]:"20",[B]:"25000"});expect(full.errors).toEqual([]);expect(full.values[A]).toBe(500);expect(full.values[R]).toBe(10000);expect(full.values[V]).toBe(15000);
  const changed=run({[T]:"100000",[N]:"200",[P]:"30",[B]:"25000"});expect(changed.values[R]).toBe(15000);expect(changed.values[V]).toBe(10000);
  expect(run({[T]:"100000",[N]:"200",[B]:"25000"}).values[R]).toBeUndefined();
  const zero=run({[P]:"0"});expect(zero.errors).toEqual([]);expect(zero.values[R]).toBe(0);expect(zero.values[A]).toBeUndefined();
  const refZero=run({[N]:"0",[T]:"0"});expect(refZero.values[A]).toBeUndefined();expect(refZero.undefinedKeys?.has(A)).toBe(true);
  expect(run({[P]:"2.5",[A]:"500"}).errors.length).toBeGreaterThan(0);
  const bad=run({[P]:"4789",[A]:"345",[R]:"343"});expect(bad.errors.length).toBeGreaterThan(0);
  expect(bad.values[R]).toBe(343);expect(bad.corrections?.[R]?.bounds?.min).toBe(1652205);
  expect(bad.corrections?.[A]?.bounds?.min).toBeCloseTo(343/4789,9);
  expect(bad.corrections?.[P]?.kind).not.toBe("exact");
 });
}
test("confirmed revenue fields in actual website",async({page})=>{
 await page.goto("/quantification");
 await page.getByRole("button",{name:"Negative financial impacts",exact:true}).click();
 const card=page.locator('[data-financial-impact="F1"]');
 await card.locator(".fin-check").check();
 const input=(k:string)=>card.locator('input[data-quantity="'+k+'"]').first();
 await input(P).fill("20");await input(A).fill("500");await expect(input(R)).toHaveValue("10000");
 await input(B).fill("25000");await expect(input(V)).toHaveValue("15000");
 await input(P).fill("30");await expect(input(R)).toHaveValue("15000");await expect(input(V)).toHaveValue("10000");
 await input(P).fill("");await input(P).blur();await expect(input(R)).toHaveValue("");
 await input(A).fill("");await input(A).blur();
 await card.getByRole("button",{name:"Average revenue per purchase",exact:true}).click();
 await input(T).fill("100000");await input(N).fill("200");await expect(input(A)).toHaveValue("500");
 await input(P).fill("20");await expect(input(R)).toHaveValue("10000");await expect(input(V)).toHaveValue("15000");
});
