import {test,expect} from "@playwright/test";
import {algebraicConsequences,type AlgebraEquation} from "../app/quantification/algebra";
import {configs} from "../app/quantification/config";
import {operationalPanels,operationalEquations} from "../app/quantification/operational-data";
import {confirmedFinancialEquations} from "../app/quantification/confirmed-financial";
import {potentialAndCostEquations} from "../app/quantification/potential-financial";
import {solve,type Figures} from "../app/quantification/solver";
const run=(id:number,raw:Figures,options:Parameters<typeof potentialAndCostEquations>[2]={})=>{const c=configs.find(c=>c.id==="problem-"+id)!;const op=operationalEquations(operationalPanels(c,id===1?["negative-operational-lost-leads"]:id===17?["negative-operational-less-staff-time-available-for-other-work"]:[]));return solve(c,raw,potentialAndCostEquations(c,confirmedFinancialEquations(c,op),options),{includeBounds:true});};
test("simultaneous linear system and partial identifiability",()=>{
 const equation=(keys:string[],coefficients:number[],rhs:number):AlgebraEquation=>({keys,label:keys.join("+"),terms:[...keys.map((key,i)=>({coefficient:coefficients[i],keys:[key]})),{coefficient:-rhs,keys:[]}]});
 const solve=(e:AlgebraEquation[])=>Object.fromEntries(algebraicConsequences(e,{},new Set(),()=>[0,Infinity]).results.map(x=>[x.key,x.value]));
 const a=solve([equation(["A","B"],[1,1],100),equation(["A","B"],[1,-4],0)]);expect(a.A).toBeCloseTo(80);expect(a.B).toBeCloseTo(20);
 const b=solve([equation(["A","B"],[1,1],100),equation(["A","B","C"],[1,1,1],150)]);expect(b.C).toBeCloseTo(50);expect(b.A).toBeUndefined();expect(b.B).toBeUndefined();
});
test("reverse combined buyer and purchase profit",()=>{
 const b=run(1,{"fin:potential-profit":"4000","fin:average-revenue-buyer":"500","fin:average-avoided-buyer":"300"});
 expect(b.errors).toEqual([]);expect(b.values["fin:potential-buyers"]).toBeCloseTo(20);expect(b.values["fin:potential-revenue"]).toBeCloseTo(10000);expect(b.values["fin:estimated-avoided"]).toBeCloseTo(6000);
 const p=run(1,{"fin:confirmed-profit":"4000","fin:average-revenue-purchase":"500","fin:average-avoided-purchase":"300"});expect(p.errors).toEqual([]);expect(p.values["fin:confirmed-purchases"]).toBeCloseTo(20);expect(p.values["fin:confirmed-revenue"]).toBeCloseTo(10000);expect(p.values["fin:avoided-variable"]).toBeCloseTo(6000);
});
test("wasted staffing reverse and forward",()=>{
 const factors={"averageMinutes":"6","op:less-staff-time-available-for-other-work:avoidable-percentage":"75","fin:avoidable-paid-share":"80","fin:average-staff-hour":"25"};
 const f=run(17,{...factors,affected:"1200"});expect(f.errors).toEqual([]);expect(f.values.hours).toBeCloseTo(120);expect(f.values["fin:wasted-hours"]).toBeCloseTo(72);expect(f.values["fin:wasted-staff"]).toBeCloseTo(1800);
 const b=run(17,{...factors,"fin:wasted-staff":"1800"});expect(b.errors).toEqual([]);expect(b.values.affected).toBeCloseTo(1200);
});
test("invoice loss chains reverse without treating partial breakdown as complete",()=>{
 const raw={"fin:original-unpaid":"20000","fin:recovered-unpaid":"5000","fin:unpaid-loss":"3000","fin:expected-unrecoverable":"25"};
 const a=run(22,raw,{invoiceBalanceComplete:true});expect(a.errors).toEqual([]);expect(a.values["fin:pending-unpaid"]).toBeCloseTo(12000);expect(a.values["fin:estimated-invoice-loss"]).toBeCloseTo(3000);expect(a.values["fin:expected-recoverable"]).toBeCloseTo(9000);
 const b=run(22,{"fin:estimated-invoice-loss":"3000","fin:expected-unrecoverable":"25","fin:recovered-unpaid":"5000","fin:unpaid-loss":"3000"},{invoiceBalanceComplete:true});expect(b.errors).toEqual([]);expect(b.values["fin:original-unpaid"]).toBeCloseTo(20000);
 expect(run(22,raw).values["fin:pending-unpaid"]).toBeUndefined();
});
test("wasted marketing combined factors and reverse",()=>{
 const raw={"op:lost-leads:result":"100","fin:paid-share":"50","fin:marketing-spend":"5000","fin:paid-acquired":"200"};
 const a=run(1,raw);expect(a.errors).toEqual([]);expect(a.values["fin:wasted-marketing"]).toBeCloseTo(1250);
 const b=run(1,{...raw,"op:lost-leads:result":"","fin:wasted-marketing":"1250"});expect(b.errors).toEqual([]);expect(b.values["op:lost-leads:result"]).toBeCloseTo(100);
});
