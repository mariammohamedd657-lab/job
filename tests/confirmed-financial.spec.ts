import {test,expect} from "@playwright/test";
import {configs} from "../app/quantification/config";
import {confirmedFinancialEquations} from "../app/quantification/confirmed-financial";
import {financialContent} from "../app/quantification/step2-content";
import {solve,type Figures} from "../app/quantification/solver";
const k=(s:string)=>"fin:"+s;
for(const c of configs.filter(c=>financialContent(c).some(o=>o.id==="F1"&&financialContent(c).some(p=>p.id==="F2")))){
 const run=(raw:Figures)=>solve(c,raw,confirmedFinancialEquations(c,{fields:[],relations:[]}),{includeBounds:true});
 test(c.id+" confirmed revenue and profit",()=>{
  const R=k("confirmed-revenue"),P=k("confirmed-purchases"),A=k("average-revenue-purchase"),L=k("confirmed-profit"),C=k("avoided-variable"),M=k("confirmed-margin");
  for(const raw of [{[P]:"20",[A]:"500"},{[R]:"10000",[A]:"500"},{[k("purchase-revenue")]:"25000",[k("retained-revenue")]:"15000"}] as Figures[]){const r=run(raw);expect(r.errors).toEqual([]);expect(r.values[R]).toBeCloseTo(10000);}
  expect(run({[k("purchase-total-revenue")]:"100000",[k("total-purchases")]:"200"}).values[A]).toBeCloseTo(500);
  const profit=run({[R]:"10000",[C]:"6000",[M]:"40"});expect(profit.errors).toEqual([]);expect(profit.values[L]).toBeCloseTo(4000);
  const negative=run({[R]:"2000",[C]:"3000"});expect(negative.errors).toEqual([]);expect(negative.values[L]).toBeCloseTo(-1000);
  const bad=run({[R]:"10000",[C]:"6000",[M]:"50"});expect(bad.errors.length).toBeGreaterThan(0);
 });
}
