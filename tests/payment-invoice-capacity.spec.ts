import {test,expect} from "@playwright/test";
import {configs} from "../app/quantification/config";
import {solve,type Figures} from "../app/quantification/solver";
const run=(id:number,raw:Figures)=>solve(configs.find(c=>c.id==="problem-"+id)!,raw,undefined,{includeBounds:true});
test("payment amounts use distinct payments, not reminder events",()=>{
 const count="step2:payments-without-reminders";
 for(const raw of ([{affected:"12",[count]:"5",moneyAverage:"200"},{affected:"12",[count]:"5",moneyTotal:"1000"},{affected:"12",moneyTotal:"1000",moneyAverage:"200"}] as Figures[])){
  const result=run(22,raw);expect(result.errors).toEqual([]);expect(result.values[count]).toBeCloseTo(5);expect(result.values.moneyTotal).toBeCloseTo(1000);expect(result.values.moneyAverage).toBeCloseTo(200);
 }
});
test("invoice amount is reversible",()=>{
 for(const raw of ([{affected:"20",moneyTotal:"5000"},{affected:"20",moneyAverage:"250"},{moneyTotal:"5000",moneyAverage:"250"}] as Figures[])){
  const result=run(23,raw);expect(result.errors).toEqual([]);expect(result.values.affected).toBeCloseTo(20);expect(result.values.moneyTotal).toBeCloseTo(5000);expect(result.values.moneyAverage).toBeCloseTo(250);
 }
});
test("staff shortfall positive and zero branches",()=>{
 const key="step2:staff-shortfall";
 for(const raw of ([{hours:"100",target:"80"},{target:"80",[key]:"20"},{hours:"100",[key]:"20"}] as Figures[])){
  const result=run(28,raw);expect(result.errors).toEqual([]);expect(result.values.hours).toBeCloseTo(100);expect(result.values.target).toBeCloseTo(80);expect(result.values[key]).toBeCloseTo(20);
 }
 const zero=run(28,{hours:"100",[key]:"0"});expect(zero.errors).toEqual([]);expect(zero.values.target).toBeUndefined();expect(zero.bounds?.target?.min).toBeCloseTo(100);
 expect(run(28,{hours:"80",target:"100"}).values[key]).toBe(0);
 expect(run(28,{hours:"100",target:"80",[key]:"0"}).errors.length).toBeGreaterThan(0);
});
