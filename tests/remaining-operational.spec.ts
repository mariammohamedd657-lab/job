import {test,expect} from "@playwright/test";
import {configs} from "../app/quantification/config";
import {operationalPanels,operationalEquations} from "../app/quantification/operational-data";
import {solve,type Figures} from "../app/quantification/solver";
const run=(id:number,impact:string,raw:Figures)=>{const c=configs.find(x=>x.id==="problem-"+id)!;return solve(c,raw,operationalEquations(operationalPanels(c,["negative-operational-"+impact])),{includeBounds:true});};
for(const id of [15,17,19,20])test("avoidable time "+id,()=>{
 const k="op:less-staff-time-available-for-other-work:";
 for(const raw of [{hours:"120",[k+"avoidable-percentage"]:"75"},{hours:"120",[k+"necessary-time"]:"30"},{[k+"result"]:"90",[k+"necessary-time"]:"30"},{[k+"result"]:"90",[k+"avoidable-percentage"]:"75"}] as Figures[]){
 const r=run(id,"less-staff-time-available-for-other-work",raw);expect(r.errors).toEqual([]);expect(r.values.hours).toBeCloseTo(120);expect(r.values[k+"result"]).toBeCloseTo(90);expect(r.values[k+"necessary-time"]).toBeCloseTo(30);
 }
});
for(const id of [22,23])test("unpaid invoice count "+id,()=>{
 const k="op:more-unpaid-invoices:",population=id===22?"affectedInvoices":"affected";
 const r=run(id,"more-unpaid-invoices",{[population]:"100",[k+"invoice-loss-rate"]:"15"});expect(r.errors).toEqual([]);expect(r.values[k+"result"]).toBeCloseTo(15);
 const reverse=run(id,"more-unpaid-invoices",{[k+"result"]:"15",[k+"invoice-loss-rate"]:"15"});expect(reverse.values[population]).toBeCloseTo(100);
});
test("review losses and exposed buyers remain separate",()=>{
 const k="op:fewer-customer-reviews:",b="op:fewer-new-customers:";
 const r=run(24,"fewer-customer-reviews",{affected:"200",[k+"additional-review-rate"]:"30"});expect(r.errors).toEqual([]);expect(r.values[k+"result"]).toBeCloseTo(60);expect(r.values[b+"result"]).toBeUndefined();
 const buyers=run(24,"fewer-new-customers",{[b+"exposed"]:"200",[b+"rate"]:"30"});expect(buyers.errors).toEqual([]);expect(buyers.values[b+"result"]).toBeCloseTo(60);expect(buyers.values.affected).toBeUndefined();
});
test("missing call records use union not sum",()=>{
 const r=run(25,"missing-business-information",{missingRecordings:"30",missingOutcomes:"20",missingBoth:"10"});expect(r.errors).toEqual([]);expect(r.values.affected).toBe(40);
});
test("one shared staff shortfall",()=>{
 const r=run(28,"fewer-tasks-completed",{hours:"100",target:"80"});expect(r.errors).toEqual([]);expect(r.values["step2:staff-shortfall"]).toBeCloseTo(20);
});
