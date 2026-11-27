import {test,expect} from "@playwright/test";
import {configs} from "../app/quantification/config";
import {problems} from "../app/discovery/data";
import {operationalPanels,operationalEquations} from "../app/quantification/operational-data";
import {confirmedFinancialEquations} from "../app/quantification/confirmed-financial";
import {potentialAndCostEquations} from "../app/quantification/potential-financial";
import {solve,type Figures} from "../app/quantification/solver";
const c=configs.find(c=>c.id==="problem-1")!;
const e=potentialAndCostEquations(c,confirmedFinancialEquations(c,operationalEquations(operationalPanels(c,["negative-operational-lost-leads"]))));
const run=(raw:Figures)=>solve(c,raw,e,{includeBounds:true});
test("minimum sufficient leads inputs, with all other fields empty",()=>{
 const a="op:lost-leads:unique-leads",b="op:lost-leads:result",r="op:lost-leads:loss-rate";
 for(const [raw,key,value] of [[{[a]:"100",[b]:"30"},r,30],[{[b]:"30",[r]:"25"},a,120],[{[a]:"100",[r]:"30"},b,30]] as [Figures,string,number][]){
  const result=run(raw);expect(result.errors).toEqual([]);expect(result.values[key]).toBeCloseTo(value,9);
 }
 const partial=run({[a]:"123","op:lost-leads:recovered":"78",[r]:"30"});
 expect(partial.errors).toEqual([]);expect(partial.values[b]).toBeCloseTo(36.9);expect(partial.values["op:lost-leads:pending"]).toBeCloseTo(8.1);
 expect(partial.values["fin:potential-revenue"]).toBeUndefined();
});
test("minimum reverse profit inputs",()=>{
 const raw={"fin:potential-profit":"4000","fin:average-revenue-buyer":"500","fin:average-avoided-buyer":"300"};
 const r=run(raw);expect(r.errors).toEqual([]);expect(r.values["fin:potential-buyers"]).toBeCloseTo(20);expect(r.values["fin:potential-revenue"]).toBeCloseTo(10000);expect(r.values["fin:estimated-avoided"]).toBeCloseTo(6000);
 expect(run(Object.fromEntries(Object.entries(raw).reverse())).values).toEqual(r.values);
 expect(run({"fin:potential-profit":"4000","fin:average-revenue-buyer":"500"}).values["fin:potential-buyers"]).toBeUndefined();
});
for(const config of configs)test("minimum base and operational inputs "+config.id,()=>{
 const all=operationalPanels(config,problems.find(p=>p.id===config.id)!.operationalImpacts.map(p=>p.id));
 const equations=potentialAndCostEquations(config,confirmedFinancialEquations(config,operationalEquations(all)));
 const result=solve(config,{total:"100",affected:"30"},equations,{includeBounds:true});
 expect(result.errors).toEqual([]);expect(result.values.affectedPct).toBeCloseTo(30);
 for(const panel of all)for(const rel of panel.relations){
  // Audit each direct relationship whose two known nonzero factors uniquely determine a third.
  const term=rel.terms?.find(t=>t.keys.length===2),out=rel.terms?.find(t=>t.keys.length===1);
  if(!term||!out||rel.terms?.length!==2)continue;
  if(term.keys.some(k=>k===out.keys[0]))continue;
  const factor=-term.coefficient/out.coefficient;
  const raw={[term.keys[0]]:"20",[term.keys[1]]:"50"};
  const direct=solve(config,raw,equations,{includeBounds:true});
  expect(direct.errors,rel.label).toEqual([]);expect(direct.values[out.keys[0]],rel.label).toBeCloseTo(1000*factor);
 }
});
