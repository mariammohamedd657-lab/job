import {test,expect} from "@playwright/test";
import {configs} from "../app/quantification/config";
import {solve,type Figures} from "../app/quantification/solver";

for(const config of configs.filter(c=>c.actualKey)){
 const actual=config.actualKey!;
 const run=(raw:Figures)=>solve(config,raw,undefined,{includeBounds:true});
 test(config.id+" comparison: all directions",()=>{
  for(const raw of [{[actual]:"90",target:"60"},{difference:"30",targetPct:"150"},{difference:"-30",targetPct:"50"},{[actual]:"30",targetPct:"50"}]){
   const result=run(raw);
   expect(result.errors).toEqual([]);
   const negative=raw.difference==="-30"||raw.targetPct==="50";
   expect(result.values[actual]).toBeCloseTo(negative?30:90,8);
   expect(result.values.target).toBeCloseTo(60,8);
   expect(result.values.difference).toBeCloseTo(negative?-30:30,8);
   expect(result.values.targetPct).toBeCloseTo(negative?50:150,8);
  }
 });
 test(config.id+" comparison: equality is not an absolute value",()=>{
  const result=run({difference:"0",targetPct:"100"});
  expect(result.errors).toEqual([]);
  expect(result.values[actual]).toBeUndefined();
  expect(result.values.target).toBeUndefined();
  expect(run({targetPct:"100"}).values.difference).toBe(0);
 });
 test(config.id+" comparison: corrections and undefined rates",()=>{
  const result=run({[actual]:"90",target:"60",difference:"40"});
  expect(result.errors.length).toBeGreaterThan(0);
  expect(result.values[actual]).toBe(90);
  expect(result.values.target).toBe(60);
  expect(result.values.difference).toBe(40);
  expect(result.bounds?.difference?.min).toBeCloseTo(30,8);
  expect(result.bounds?.target?.min).toBeCloseTo(50,8);
  expect(result.bounds?.[actual]?.min).toBeCloseTo(100,8);
  expect(run({target:"0",targetPct:"100"}).errors.length).toBeGreaterThan(0);
  expect(run({[actual]:"0",targetPct:"50"}).errors.length).toBeGreaterThan(0);
 });
}
