import {test,expect} from "@playwright/test";
import {configs} from "../app/quantification/config";
import {operationalPanels,operationalEquations} from "../app/quantification/operational-data";
import {solve,type Figures} from "../app/quantification/solver";
const run=(id:number,impact:string,raw:Figures,finalizedSlots=false)=>{
 const c=configs.find(c=>c.id==="problem-"+id)!;
 return solve(c,raw,operationalEquations(operationalPanels(c,["negative-operational-"+impact],{finalizedSlots})),{includeBounds:true});
};
for(const id of [9,10])test("reactivation "+id,()=>{
 const k="op:fewer-old-leads-reactivated:",h="step3:historical:reactivation:";
 const r=run(id,"fewer-old-leads-reactivated",{affected:"200",[k+"reactivation-rate"]:"15",[h+"eligible"]:"100",[h+"converted"]:"40"});
 expect(r.errors).toEqual([]);expect(r.values[k+"result"]).toBeCloseTo(30);expect(r.values[h+"rate"]).toBeCloseTo(40);
 expect(run(id,"fewer-old-leads-reactivated",{[h+"eligible"]:"100",[h+"converted"]:"40"}).values[k+"reactivation-rate"]).toBeUndefined();
});
for(const id of [12,13,15])test("attendance "+id,()=>{
 const k="op:fewer-appointments-attended:";
 const r=run(id,"fewer-appointments-attended",{[k+"result"]:"20",[k+"attendance-loss-rate"]:"25"});
 expect(r.errors).toEqual([]);expect(r.values.affected).toBeCloseTo(80);
});
for(const id of [12,13,14])test("slot classifications "+id,()=>{
 const k="op:unused-appointment-slots:",raw:Figures={[k+"available"]:"40",[k+"filled"]:"25"};
 const pending=run(id,"unused-appointment-slots",raw);expect(pending.errors).toEqual([]);expect(pending.values[k+"result"]).toBeUndefined();expect(pending.bounds?.[k+"result"]?.max).toBe(15);
 const complete=run(id,"unused-appointment-slots",raw,true);expect(complete.errors).toEqual([]);expect(complete.values[k+"result"]).toBe(15);
 const bad=run(id,"unused-appointment-slots",{[k+"available"]:"40",[k+"filled"]:"30",[k+"result"]:"20"},true);expect(bad.errors.length).toBeGreaterThan(0);expect(bad.bounds?.[k+"available"]?.min).toBe(50);expect(bad.bounds?.[k+"filled"]?.max).toBe(20);expect(bad.bounds?.[k+"result"]?.max).toBe(10);
});
