import {test,expect} from "@playwright/test";
import {configs} from "../app/quantification/config";
import {solve} from "../app/quantification/solver";
import {operationalPanels,operationalEquations} from "../app/quantification/operational-data";
import {confirmedFinancialEquations} from "../app/quantification/confirmed-financial";
import {potentialAndCostEquations} from "../app/quantification/potential-financial";
const c=configs.find(c=>c.id==="problem-1")!,op=operationalEquations(operationalPanels(c,["negative-operational-lost-leads"])),e=potentialAndCostEquations(c,confirmedFinancialEquations(c,op));
const run=(raw:Record<string,string>)=>solve(c,raw,e,{includeBounds:true});
test("potential revenue and profit from operational chain",()=>{
 const r=run({"op:lost-leads:unique-leads":"123","op:lost-leads:recovered":"78","op:lost-leads:loss-rate":"30","fin:conversion:leads":"40","fin:average-revenue-buyer":"500","fin:average-avoided-buyer":"300"});
 expect(r.errors).toEqual([]);expect(r.values["fin:potential-buyers"]).toBeCloseTo(14.76);expect(r.values["fin:potential-revenue"]).toBeCloseTo(7380);expect(r.values["fin:potential-profit"]).toBeCloseTo(2952);
 const n=run({"fin:potential-buyers":"15.544","fin:average-revenue-buyer":"89","fin:average-avoided-buyer":"890"});expect(n.values["fin:potential-profit"]).toBeCloseTo(-12450.744);
});
test("potential revenue correction",()=>{const r=run({"fin:potential-buyers":"30","fin:average-revenue-buyer":"500","fin:potential-revenue":"18000"});expect(r.errors.length).toBeGreaterThan(0);expect(r.bounds?.["fin:potential-buyers"]?.min).toBeCloseTo(36);});
test("marketing and staffing",()=>{const r=run({"fin:estimated-higher:paid-leads":"100","fin:average-paid-lead":"25","fin:estimated-higher:paid-hours":"40","fin:average-additional-hour":"30"});expect(r.values["fin:estimated-higher:marketing"]).toBeCloseTo(2500);expect(r.values["fin:estimated-higher:staff"]).toBeCloseTo(1200);const n=run({"fin:estimated-higher:actual-staff":"10000","fin:estimated-higher:comparable-staff":"12000"});expect(n.values["fin:estimated-higher:staff-difference"]).toBe(-2000);expect(n.values["fin:estimated-higher:staff"]).toBe(0);});
