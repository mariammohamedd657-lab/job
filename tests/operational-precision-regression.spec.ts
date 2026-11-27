import {test,expect} from "@playwright/test";
import {configs} from "../app/quantification/config";
import {operationalPanels,operationalEquations} from "../app/quantification/operational-data";
import {solve,format,type Figures} from "../app/quantification/solver";
import {confirmedFinancialEquations} from "../app/quantification/confirmed-financial";
import {potentialAndCostEquations} from "../app/quantification/potential-financial";
test("display cleans machine residue without discarding meaningful precision",()=>{
 expect(format(8.09999999999999)).toBe("8.1");
 expect(format(36.900000000000006)).toBe("36.9");
 expect(format(-12450.744000000002)).toBe("-12450.744");
 expect(format(1e-15)).toBe("1e-15");
 expect(Number(format(45/123*100))).toBeCloseTo(45/123*100,12);
 expect(format(8.10000000001)).toBe("8.10000000001");
});
test("missed calls minimum inputs and connected chain",()=>{
 const c=configs.find(c=>c.id==="problem-1")!;
 const e=potentialAndCostEquations(c,confirmedFinancialEquations(c,operationalEquations(operationalPanels(c,["negative-operational-lost-leads"]))));
 const run=(raw:Figures)=>solve(c,raw,e,{includeBounds:true});
 const p="op:lost-leads:";
 for(const [raw,key,expected] of [[{[p+"unique-leads"]:"100",[p+"result"]:"30"},p+"loss-rate",30],[{[p+"result"]:"30",[p+"loss-rate"]:"25"},p+"unique-leads",120]] as [Figures,string,number][]){
  const r=run(raw);expect(r.errors).toEqual([]);expect(r.values[key]).toBeCloseTo(expected,12);
 }
 const raw={[p+"unique-leads"]:"123",[p+"recovered"]:"78",[p+"loss-rate"]:"30","fin:conversion:leads":"40","fin:average-revenue-buyer":"500","fin:average-avoided-buyer":"300"};
 const a=run(raw);expect(a.errors).toEqual([]);expect(format(a.values[p+"pending"])).toBe("8.1");expect(a.values[p+"result"]).toBeCloseTo(36.9,12);expect(a.values["fin:potential-buyers"]).toBeCloseTo(14.76,12);expect(a.values["fin:potential-revenue"]).toBeCloseTo(7380,9);expect(a.values["fin:estimated-avoided"]).toBeCloseTo(4428,9);expect(a.values["fin:potential-profit"]).toBeCloseTo(2952,9);
 expect(run(Object.fromEntries(Object.entries(raw).reverse())).values[p+"pending"]).toBeCloseTo(8.1,12);
 const partial=run({[p+"unique-leads"]:"123",[p+"recovered"]:"78"});expect(partial.values[p+"pending"]).toBeUndefined();expect(partial.values[p+"result"]).toBeUndefined();
});
for(const [id,method] of [["problem-9","reactivation"],["problem-24","reviews"]])test(id+" historical supporting calculation works in every direction",()=>{
 const c=configs.find(c=>c.id===id)!;
 const p=operationalPanels(c,[method==="reactivation"?"negative-operational-fewer-old-leads-reactivated":"negative-operational-fewer-customer-reviews"])[0];
 const e=operationalEquations([p]),prefix="step3:historical:"+method+":";
 const eligible=prefix+"eligible",converted=prefix+"converted",rate=prefix+"rate";
 for(const [raw,key,value] of [[{[eligible]:"200",[converted]:"60"},rate,30],[{[eligible]:"200",[rate]:"30"},converted,60],[{[converted]:"60",[rate]:"30"},eligible,200]] as [Figures,string,number][]){
  const r=solve(c,raw,e);expect(r.errors).toEqual([]);expect(r.values[key]).toBeCloseTo(value,12);expect(r.values[p.primaryKey]).toBeUndefined();
 }
 const example=solve(c,p.example??{},e);expect(example.errors).toEqual([]);expect(example.values[rate]).toBeCloseTo(30);
});
