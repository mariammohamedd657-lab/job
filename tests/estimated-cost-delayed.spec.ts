import {test,expect} from "@playwright/test";
import {configs} from "../app/quantification/config";
import {potentialAndCostEquations} from "../app/quantification/potential-financial";
import {solve,type Figures} from "../app/quantification/solver";
const c=configs.find(c=>c.id==="problem-22")!;
const run=(raw:Figures,options:Parameters<typeof potentialAndCostEquations>[2]={})=>solve(c,raw,potentialAndCostEquations(c,{fields:[],relations:[]},options),{includeBounds:true});
test("estimated costs retain independent actual and predicted averages",()=>{
 const e="fin:estimated-higher:";
 const r=run({[e+"paid-leads"]:"120","fin:estimated-average-paid-lead":"25",[e+"paid-hours"]:"12.5","fin:estimated-average-additional-hour":"40",[e+"actual"]:"8000",[e+"comparable"]:"10000","fin:average-paid-lead":"30"});
 expect(r.errors).toEqual([]);expect(r.values[e+"marketing"]).toBeCloseTo(3000);expect(r.values[e+"staff"]).toBeCloseTo(500);expect(r.values[e+"difference"]).toBe(-2000);expect(r.values[e+"result"]).toBe(0);
 const fractional=run({[e+"employees"]:"2.5",[e+"employee-cost"]:"1000"});expect(fractional.errors).toEqual([]);expect(fractional.values[e+"staff"]).toBeCloseTo(2500);
});
test("delayed cash collection forward reverse and contradiction",()=>{
 const D="fin:delayed",P="fin:payments-due",T="fin:timely-payments",N="fin:late-invoices",A="fin:average-late-invoice";
 for(const raw of [{[P]:"20000",[T]:"15000"},{[N]:"10",[A]:"500"},{[D]:"5000",[N]:"10"},{[D]:"5000",[A]:"500"},{[P]:"20000",[T]:"15000",[N]:"10",[A]:"500"}] as Figures[]){const r=run(raw);expect(r.errors).toEqual([]);expect(r.values[D]).toBeCloseTo(5000);}
 expect(run({"fin:overdue-reference-amount":"5000","fin:overdue-reference-count":"10"}).values[A]).toBeCloseTo(500);
 const bad=run({[P]:"20000",[T]:"15000",[D]:"6000"});expect(bad.errors.length).toBeGreaterThan(0);expect(bad.bounds?.[D]?.min).toBeCloseTo(5000);
 expect(run({[P]:"20000",[T]:"15000"}).values["fin:unpaid-loss"]).toBeUndefined();
});
