import {test,expect} from "@playwright/test";
import {configs} from "../app/quantification/config";
import {solve,product,type Figures,type PrecisionOptions} from "../app/quantification/solver";
import {operationalPanels,operationalEquations} from "../app/quantification/operational-data";
import {confirmedFinancialEquations} from "../app/quantification/confirmed-financial";
import {potentialAndCostEquations} from "../app/quantification/potential-financial";
const c=configs.find(x=>x.id==="problem-1")!,eq=potentialAndCostEquations(c,confirmedFinancialEquations(c,operationalEquations(operationalPanels(c,["negative-operational-lost-leads"]))));
const run=(raw:Figures,options:PrecisionOptions={})=>solve(c,raw,eq,{includeBounds:true,...options});
test("zero population leaves historical conversion and independent averages intact",()=>{
 const r=run({"op:lost-leads:result":"0","fin:conversion:leads":"30"});expect(r.errors).toEqual([]);expect(r.values["fin:potential-buyers"]).toBe(0);expect(r.values["fin:conversion:leads"]).toBe(30);expect(r.values["fin:potential-revenue"]).toBe(0);expect(r.values["fin:average-revenue-buyer"]).toBeUndefined();
});
test("fractional buyers and signed profit retain precision",()=>{
 const r=run({"fin:potential-buyers":"15.544","fin:average-revenue-buyer":"89","fin:average-avoided-buyer":"890"});expect(r.errors).toEqual([]);expect(r.values["fin:potential-revenue"]).toBeCloseTo(1383.416,9);expect(r.values["fin:estimated-avoided"]).toBeCloseTo(13834.16,9);expect(r.values["fin:potential-profit"]).toBeCloseTo(-12450.744,9);
});
test("zero factor is not an arbitrary zero assignment",()=>{
 const e={fields:["A","B","C"].map(key=>({key,label:key,unit:"Units"})),relations:[product("A","B","C",1,"A = B × C")]};
 const a=solve(c,{B:"0"},e);expect(a.values.A).toBe(0);expect(a.values.C).toBeUndefined();
 const b=solve(c,{A:"0"},e);expect(b.values.B).toBeUndefined();expect(b.values.C).toBeUndefined();
 const d=solve(c,{A:"1",B:"0"},e);expect(d.errors.length).toBeGreaterThan(0);
});
test("rounded versus exact percentage",()=>{
 const raw={total:"30",affected:"10",affectedPct:"33.3"};
 expect(solve(c,raw,undefined,{evidence:{affectedPct:{kind:"exact"}}}).errors.length).toBeGreaterThan(0);
 const r=solve(c,raw,undefined,{evidence:{affectedPct:{kind:"rounded",digits:1}},includeBounds:true});expect(r.errors).toEqual([]);expect(r.values.affectedPct).toBeCloseTo(100/3,9);
});
