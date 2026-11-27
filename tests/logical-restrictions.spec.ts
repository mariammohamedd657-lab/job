import {test,expect} from "@playwright/test";
import {configs} from "../app/quantification/config";
import {problems} from "../app/discovery/data";
import {operationalPanels,operationalEquations} from "../app/quantification/operational-data";
import {financialEquations} from "../app/quantification/financial-equations";
import {logicalRestrictions} from "../app/quantification/logical-restrictions";
import {solve,type Figures} from "../app/quantification/solver";
const run=(id:string,raw:Figures,ids?:string[])=>{const c=configs.find(c=>c.id===id)!;const active=ids??problems.find(p=>p.id===id)!.operationalImpacts.map(i=>i.id);return solve(c,raw,logicalRestrictions(c,financialEquations(c,operationalEquations(operationalPanels(c,active))),active),{includeBounds:true});};
test("all 28 base populations have bidirectional restrictions",()=>{
 for(const c of configs){const r=run(c.id,{affected:"30"},[]);expect(r.bounds?.total?.min,c.id).toBe(30);const s=run(c.id,{total:"50"},[]);expect(s.bounds?.affected?.max,c.id).toBe(50);}
});
test("missed calls chain propagates both directions",()=>{
 const L="op:lost-leads:result",U="op:lost-leads:unique-leads";
 const lower=run("problem-1",{[L]:"30"});expect(lower.errors).toEqual([]);for(const key of [U,"affected","total"])expect(lower.bounds?.[key]?.min,key).toBe(30);
 const upper=run("problem-1",{affected:"50"});for(const key of [U,L])expect(upper.bounds?.[key]?.max,key).toBe(50);
 const split=run("problem-1",{[U]:"100","op:lost-leads:recovered":"60","op:lost-leads:pending":"15"});expect(split.values[L]).toBe(25);
 const invalid=run("problem-1",{affected:"50",[U]:"60"});expect(invalid.errors.length).toBeGreaterThan(0);expect(invalid.values[U]).toBe(60);expect(invalid.bounds?.[U]?.max).toBe(50);expect(invalid.bounds?.affected?.min).toBe(60);
});
test("existing supplementary buyer and slot fields receive bounds without new controls",()=>{
 const prefix="step2:negative-operational-fewer-customers-served:",L="op:fewer-customers-served:result";
 const r=run("problem-21",{affected:"80",[prefix+"affected"]:"60",[prefix+"served"]:"40"});expect(r.bounds?.[L]?.max).toBe(20);
 const p="step2:negative-operational-unused-appointment-slots:",S="op:unused-appointment-slots:result";
 const s=run("problem-12",{[p+"available"]:"120",[p+"filled"]:"95"});expect(s.bounds?.[S]?.max).toBe(25);
});
test("signed profit and nonnegative costs retain valid domains",()=>{
 const r=run("problem-1",{"fin:confirmed-revenue":"1000","fin:avoided-variable":"3000"},[]);expect(r.errors).toEqual([]);expect(r.values["fin:confirmed-profit"]).toBe(-2000);
 const v=run("problem-1",{"fin:confirmed-revenue":"1000"},[]);expect(v.bounds?.["fin:confirmed-profit"]?.max).toBe(1000);
});
test("historical lead conversion cannot exceed eligible population",()=>{
 const r=run("problem-1",{"fin:historical:leads:eligible":"50"},[]);expect(r.bounds?.["fin:historical:leads:converted"]?.max).toBe(50);
});
test("staff shortfall cannot exceed required hours",()=>{
 const r=run("problem-28",{hours:"100"},[]);expect(r.bounds?.["step2:staff-shortfall"]?.max).toBe(100);
});
