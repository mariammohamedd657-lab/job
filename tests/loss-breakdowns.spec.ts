import {test,expect} from "@playwright/test";
import {configs} from "../app/quantification/config";
import {operationalPanels,operationalEquations} from "../app/quantification/operational-data";
import {solve,type Figures} from "../app/quantification/solver";
for(const [id,impact] of [[1,"lost-leads"],[7,"lost-qualified-leads"],[3,"fewer-appointments-booked"]] as const){
 const c=configs.find(c=>c.id==="problem-"+id)!;
 const p=operationalPanels(c,["negative-operational-"+impact])[0],e=operationalEquations([p]);
 const T=p.undefinedRates![0].denominator,r=p.undefinedRates![0].rate,L=p.primaryKey,R="op:"+impact+":recovered",P="op:"+impact+":pending";
 const run=(raw:Figures)=>solve(c,raw,e,{includeBounds:true});
 test(impact+" ten combinations",()=>{
  const full:Figures={[T]:"100",[R]:"50",[P]:"20",[L]:"30",[r]:"30"};
  for(const keys of [[T,R,P],[T,R,L],[T,R,r],[T,P,L],[T,P,r],[T,L,r],[R,P,L],[R,P,r],[R,L,r],[P,L,r]]){
   const result=run(Object.fromEntries(keys.map(k=>[k,full[k]])));
   expect(result.errors,keys.join(",")).toEqual([]);
   for(const k of [T,R,P,L,r])if(!(keys.includes(T)&&keys.includes(L)&&keys.includes(r)&&(k===R||k===P)))expect(result.values[k],k).toBeCloseTo(Number(full[k]),8);
  }
 });
 test(impact+" restrictions and fractional estimates",()=>{
  const base:Figures={[T]:"123",[R]:"78"};
  const a=run(base);expect(a.errors).toEqual([]);expect(a.bounds?.[P]?.max).toBeCloseTo(45);expect(a.bounds?.[L]?.max).toBeCloseTo(45);expect(a.bounds?.[r]?.max).toBeCloseTo(45/123*100,8);
  const b=run({...base,[r]:"30"});expect(b.errors).toEqual([]);expect(b.values[L]).toBeCloseTo(36.9);expect(b.values[P]).toBeCloseTo(8.1);
  const conflict=run({...base,[r]:"56"});expect(conflict.errors.length).toBeGreaterThan(0);expect(conflict.bounds?.[T]?.min).toBe(178);expect(conflict.bounds?.[R]?.max).toBe(54);expect(conflict.bounds?.[r]?.max).toBeCloseTo(45/123*100,8);
 });
}
