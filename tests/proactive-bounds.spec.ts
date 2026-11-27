import {test,expect} from "@playwright/test";
import {rangeConsequences} from "../app/quantification/ranges";
import {algebraicConsequences,type AlgebraEquation} from "../app/quantification/algebra";
import {configs} from "../app/quantification/config";
import {operationalPanels,operationalEquations} from "../app/quantification/operational-data";
import {solve} from "../app/quantification/solver";
const mul=(a:string,b:string,c:string,f=1):AlgebraEquation=>({keys:[a,b,c],label:a+" product",terms:[{coefficient:1,keys:[a]},{coefficient:-f,keys:[b,c]}]});
const sum=(a:string,b:string,c:string):AlgebraEquation=>({keys:[a,b,c],label:"sum",terms:[{coefficient:1,keys:[a]},{coefficient:-1,keys:[b]},{coefficient:-1,keys:[c]}]});
const run=(eq:AlgebraEquation[],known:Record<string,number>,bounds:Record<string,[number,number]>,ints:string[]=[])=>rangeConsequences(eq,known,new Set(),key=>bounds[key]??[0,Infinity],new Set(ints),{});
test("signed multiplication interval endpoints",()=>{const r=run([mul("profit","buyers","average")],{},{buyers:[10,20],average:[-100,50],profit:[-Infinity,Infinity]});expect(r.bounds.profit.min).toBe(-2000);expect(r.bounds.profit.max).toBe(1000);expect(r.bounds.profit.maxQuality).toBe("conservative");});
test("percentage restrictions forward and reverse",()=>{
 const eq=[mul("affected","total","rate",.01)];
 const a=run(eq,{total:100},{rate:[0,40]});expect(a.bounds.affected.max).toBe(40);
 const b=run(eq,{affected:30},{rate:[0,50]});expect(b.bounds.total.min).toBe(60);
 const c=run(eq,{affected:30},{rate:[25,100]});expect(c.bounds.total.max).toBe(120);
 const d=run(eq,{affected:30},{total:[0,100],rate:[0,100]});expect(d.bounds.rate.min).toBe(30);
 const e=run(eq,{affected:30},{total:[60,Infinity],rate:[0,100]});expect(e.bounds.rate.max).toBe(50);
});
test("additive constraints and integer domains",()=>{
 const a=run([sum("total","A","B")],{total:100},{A:[30,Infinity],B:[40,Infinity]});expect(a.bounds.A.max).toBe(60);expect(a.bounds.B.max).toBe(70);
 const b=run([],{}, {A:[12.2,17.8]},["A"]); // use explicit keys below
 const c=rangeConsequences([],{},new Set(),()=>[12.2,17.8],new Set(["A"]),{},[],[],["A"]);expect(c.bounds.A.min).toBe(13);expect(c.bounds.A.max).toBe(17);
 const d=rangeConsequences([],{},new Set(),()=>[12.2,12.8],new Set(["A"]),{},[],[],["A"]);expect(d.conflicts.length).toBeGreaterThan(0);
});
test("missed calls proactive bounds, edits and removal",()=>{
 const c=configs.find(c=>c.id==="problem-1")!,e=operationalEquations(operationalPanels(c,["negative-operational-lost-leads"]));
 const raw={"op:lost-leads:unique-leads":"123","op:lost-leads:recovered":"78"};
 const r=solve(c,raw,e,{includeBounds:true});expect(r.errors).toEqual([]);
 expect(r.bounds?.["op:lost-leads:pending"]?.max).toBeCloseTo(45,9);
 expect(r.bounds?.["op:lost-leads:result"]?.max).toBeCloseTo(45,9);
 expect(r.bounds?.["op:lost-leads:loss-rate"]?.max).toBeCloseTo(45/123*100,9);
 expect(r.values["op:lost-leads:result"]).toBeUndefined();
 expect(r.values["op:lost-leads:pending"]).toBeUndefined();
 const changed=solve(c,{...raw,"op:lost-leads:recovered":"80"},e,{includeBounds:true});expect(changed.bounds?.["op:lost-leads:result"]?.max).toBeCloseTo(43,9);
 const cleared=solve(c,{"op:lost-leads:recovered":"78"},e,{includeBounds:true});expect(cleared.bounds?.["op:lost-leads:loss-rate"]?.maxExclusive).toBe(true);
});
