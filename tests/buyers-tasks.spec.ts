import {test,expect} from "@playwright/test";
import {configs} from "../app/quantification/config";
import {operationalPanels,operationalEquations,operationalMethods} from "../app/quantification/operational-data";
import {solve,type Figures} from "../app/quantification/solver";
for(const c of configs)for(const [impact,method] of Object.entries(operationalMethods[c.id])){
 if(!["unserved","existing-buyers","tasks"].includes(method))continue;
 const k="op:"+impact+":",total=method==="tasks"&&c.id==="problem-28"?"affected":k+"affected",result=k+"result";
 const run=(raw:Figures,complete=true)=>solve(c,raw,operationalEquations(operationalPanels(c,["negative-operational-"+impact],{finalizedBuyers:complete,finalizedTasks:complete})),{includeBounds:true});
 test(c.id+" "+method+" forward reverse and restrictions",()=>{
  if(method==="existing-buyers"){
   for(const raw of [{[total]:"50",[k+"rate"]:"20"},{[result]:"10",[k+"rate"]:"20"},{[total]:"50",[result]:"10"}] as Figures[]){
    const r=run(raw);expect(r.errors).toEqual([]);expect(r.values[total]).toBeCloseTo(50);expect(r.values[result]).toBeCloseTo(10);expect(r.values[k+"rate"]).toBeCloseTo(20);
   }
   const reverse=run({[result]:"15",[k+"rate"]:"25"});expect(reverse.values[total]).toBeCloseTo(60);
  }else{
   const other=k+(method==="tasks"?"completed":"served"),T=method==="tasks"?200:100,O=method==="tasks"?150:70,L=T-O;
   for(const raw of [{[total]:String(T),[other]:String(O)},{[total]:String(T),[result]:String(L)},{[other]:String(O),[result]:String(L)}] as Figures[]){
    const r=run(raw);expect(r.errors).toEqual([]);expect(r.values[total]).toBe(T);expect(r.values[other]).toBe(O);expect(r.values[result]).toBe(L);
   }
   const pending=run({[total]:String(T),[other]:String(O)},false);expect(pending.errors).toEqual([]);expect(pending.values[result]).toBeUndefined();expect(pending.bounds?.[result]?.max).toBe(L);
   const bad=run({[total]:"100",[other]:"80",[result]:"40"});expect(bad.errors.length).toBeGreaterThan(0);expect(bad.bounds?.[total]?.min).toBe(120);expect(bad.bounds?.[other]?.max).toBe(60);expect(bad.bounds?.[result]?.max).toBe(20);
  }
 });
}
