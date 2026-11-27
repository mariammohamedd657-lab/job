import {test,expect} from "@playwright/test";
import {configs} from "../app/quantification/config";
import {solve,product,sum,type Figures,type Relation} from "../app/quantification/solver";
import {operationalPanels,operationalEquations} from "../app/quantification/operational-data";
import {confirmedFinancialEquations} from "../app/quantification/confirmed-financial";
import {potentialAndCostEquations} from "../app/quantification/potential-financial";
const c=configs.find(x=>x.id==="problem-1")!;
const e=potentialAndCostEquations(c,confirmedFinancialEquations(c,operationalEquations(operationalPanels(c,["negative-operational-lost-leads"]))));
const run=(raw:Figures)=>solve(c,raw,e,{includeBounds:true});
test("independent buyer revenue corrections preserve every original entry",()=>{
 const raw={"fin:potential-buyers":"30","fin:average-revenue-buyer":"500","fin:potential-revenue":"18000"};
 const r=run(raw);expect(r.errors.length).toBeGreaterThan(0);
 for(const [key,value] of Object.entries(raw))expect(r.values[key]).toBe(Number(value));
 for(const [key,value] of Object.entries({"fin:potential-buyers":36,"fin:average-revenue-buyer":600,"fin:potential-revenue":15000})){expect(r.corrections?.[key]?.kind).toBe("exact");expect(r.corrections?.[key]?.bounds?.min).toBeCloseTo(value);}
 const reverse=run(Object.fromEntries(Object.entries(raw).reverse()));expect(reverse.corrections).toEqual(r.corrections);
 expect(run({...raw,"fin:potential-revenue":"15000"}).errors).toEqual([]);
});
test("actual-count correction limits in estimated lead breakdown",()=>{
 const r=run({"op:lost-leads:unique-leads":"123","op:lost-leads:recovered":"78","op:lost-leads:loss-rate":"56"});
 expect(r.errors.length).toBeGreaterThan(0);
 expect(r.corrections?.["op:lost-leads:unique-leads"]?.bounds?.min).toBe(178);
 expect(r.corrections?.["op:lost-leads:recovered"]?.bounds?.max).toBe(54);
 expect(r.corrections?.["op:lost-leads:loss-rate"]?.bounds?.max).toBeCloseTo(45/123*100,9);
});
test("multiple changes required for incompatible nonnegative components",()=>{
 const keys=["T","A","B","C"],parts=keys.slice(1);
 const relation:Relation={keys,label:"T = A + B + C",terms:keys.map((key,i)=>({coefficient:i===0?1:-1,keys:[key]})),derive:(v,k)=>k==="T"?parts.reduce((n,p)=>n+v[p],0):v.T-parts.filter(p=>p!==k).reduce((n,p)=>n+v[p],0),valid:v=>v.T===v.A+v.B+v.C};
 const r=solve(c,{T:"100",A:"80",B:"70",C:"50"},{fields:keys.map(key=>({key,label:key,unit:"Units"})),relations:[relation],integerKeys:keys},{includeBounds:true});
 expect(r.corrections?.T?.bounds?.min).toBe(200);
 for(const key of parts)expect(r.corrections?.[key]?.kind).toBe("requires-other-changes");
});
test("equivalent contribution routes and independent staffing",()=>{
 const r=run({"fin:confirmed-revenue":"10000","fin:avoided-variable":"6000","fin:confirmed-margin":"50","fin:wasted-hours":"40","fin:average-staff-hour":"25"});
 expect(r.errors.length).toBeGreaterThan(0);
 expect(r.corrections?.["fin:confirmed-revenue"]?.bounds?.min).toBeCloseTo(12000);
 expect(r.corrections?.["fin:avoided-variable"]?.bounds?.min).toBeCloseTo(5000);
 expect(r.corrections?.["fin:confirmed-margin"]?.bounds?.min).toBeCloseTo(40);
 expect(r.values["fin:wasted-staff"]).toBeCloseTo(1000);expect(r.blocked.has("fin:wasted-staff")).toBe(false);
});
