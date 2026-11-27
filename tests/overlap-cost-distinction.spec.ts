import {test,expect} from "@playwright/test";
import {configs} from "../app/quantification/config";
import {solve,type Figures} from "../app/quantification/solver";
import {scopedUnion} from "../app/quantification/scoped-union";
import {potentialAndCostEquations} from "../app/quantification/potential-financial";
import {confirmedFinancialEquations} from "../app/quantification/confirmed-financial";
const c=configs.find(x=>x.id==="problem-1")!;
const base={fields:[],relations:[]};
test("two overlapping populations and containing population",()=>{
 const run=(raw:Figures)=>solve(c,raw,undefined,{populationClassification:"overlapping",includeBounds:true});
 expect(run({affected:"60",unaffected:"40",overlap:"20"}).values.combined).toBe(80);
 const a=run({affected:"60",unaffected:"40"});expect(a.errors).toEqual([]);expect(a.bounds?.combined?.min).toBe(60);expect(a.bounds?.combined?.max).toBe(100);
 const b=run({affected:"60",unaffected:"40",total:"80"});expect(b.errors).toEqual([]);expect(b.bounds?.overlap?.min).toBe(20);expect(b.bounds?.overlap?.max).toBe(40);expect(b.bounds?.combined?.max).toBe(80);
});
test("three sets preserve unknown triple intersection",()=>{
 const fields=["U","A","B","C","AB","AC","BC","ABC"].map(key=>({key,label:key,unit:"Leads"}));
 const e=scopedUnion({fields,relations:[],integerKeys:fields.map(f=>f.key)},"U",["A","B","C"],[{key:"AB",members:["A","B"]},{key:"AC",members:["A","C"]},{key:"BC",members:["B","C"]},{key:"ABC",members:["A","B","C"]}]);
 const raw={A:"60",B:"40",C:"30",AB:"20",AC:"15",BC:"10"};
 const a=solve(c,raw,e,{includeBounds:true});expect(a.errors).toEqual([]);expect(a.values.U).toBeUndefined();expect(a.bounds?.U?.min).toBe(85);expect(a.bounds?.U?.max).toBe(95);
 expect(solve(c,{...raw,ABC:"5"},e).values.U).toBe(90);
});
test("equivalent contribution routes are not added",()=>{
 const e=confirmedFinancialEquations(c,base);
 const a=solve(c,{"fin:confirmed-revenue":"10000","fin:avoided-variable":"6000","fin:confirmed-margin":"40"},e);
 expect(a.errors).toEqual([]);expect(a.values["fin:confirmed-profit"]).toBe(4000);
 const b=solve(c,{"fin:confirmed-revenue":"10000","fin:avoided-variable":"6000","fin:confirmed-margin":"50"},e,{includeBounds:true});expect(b.errors.length).toBeGreaterThan(0);
});
test("gross and net remain separate; collection staff counted only once",()=>{
 const p="fin:higher:";
 const raw={[p+"marketing-difference"]:"3000",[p+"staff-difference"]:"-2000",[p+"collection-difference"]:"0",[p+"financing-difference"]:"0",[p+"other-difference"]:"0",[p+"collection"]:"0",[p+"financing"]:"0"};
 const r=solve(c,raw,potentialAndCostEquations(c,base,{grossComplete:true,netComplete:true}));expect(r.errors).toEqual([]);expect(r.values[p+"gross-increase"]).toBe(3000);expect(r.values[p+"difference"]).toBe(1000);expect(r.values[p+"result"]).toBe(1000);
 const a=solve(c,{[p+"marketing"]:"3000",[p+"staff"]:"1000",[p+"collection-staff"]:"500",[p+"collection-fees"]:"100",[p+"financing"]:"0",[p+"other"]:"0"},potentialAndCostEquations(c,base,{grossComplete:true,collectionStaffIncluded:true}));expect(a.errors).toEqual([]);expect(a.values[p+"gross-increase"]).toBe(4100);
});
