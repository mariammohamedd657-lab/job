import { test } from "@playwright/test";
import { configs, type Config } from "../app/quantification/config";
import { problems } from "../app/discovery/data";
import { operationalPanels, operationalEquations, operationalMethods, type OperationalPanel } from "../app/quantification/operational-data";
import { solve, type Figures } from "../app/quantification/solver";

type Block={keys:string[];groups:string[][];threshold:number};
type Fixture={values:Record<string,number>;blocks:Block[]};
const prefix="negative-operational-";
const check=(condition:unknown,message:string)=>{if(!condition)throw new Error(message);};
const eq=(a:number,b:number)=>Number.isFinite(a)&&Math.abs(a-b)<=1e-8*Math.max(1,Math.abs(a),Math.abs(b));
const popcount=(n:number)=>{let c=0;while(n){n&=n-1;c++;}return c;};

// Independent closed-form fixtures and identifiability rules, not the solver's
// calculated outputs or its list of Relation objects. Interior examples:
// all denominators positive, rates strictly between 0 and 100, difference nonzero.
function fixture(c:Config,panels:OperationalPanel[],example:number):Fixture{
 const scale=example===0?1:2;
 const values:Record<string,number>={total:200*scale,affected:60*scale,unaffected:140*scale,affectedPct:30,unaffectedPct:70,months:3+example};
 const blocks:Block[]=[];
 const block=(keys:string[],threshold:number,groups:string[][]=[])=>blocks.push({keys,threshold,groups});
 block(["total","affected","unaffected","affectedPct","unaffectedPct"],2,[["affectedPct","unaffectedPct"]]);
 if(c.timePopulation){
  if(c.timePopulation==="recordedUnits")values.recordedUnits=40*scale;
  values.averageMinutes=example===0?18:24;
  values.hours=values[c.timePopulation]*values.averageMinutes/60;
  block(["hours",c.timePopulation,"averageMinutes"],2);
 }
 if(c.fields.Frequency.length){values.days=example===0?12:15;values.daily=values.affected/values.days;block(["affected","days","daily"],2);}
 if(c.actualKey){values.target=values[c.actualKey]*(example===0?.8:1.25);values.difference=values[c.actualKey]-values.target;values.targetPct=values[c.actualKey]/values.target*100;block([c.actualKey,"target","difference","targetPct"],2);}
 if(c.moneyPopulation){values.moneyAverage=example===0?25.5:71.25;values.moneyTotal=values[c.moneyPopulation]*values.moneyAverage;block(["moneyTotal",c.moneyPopulation,"moneyAverage"],2);}
 for(const panel of panels){
  const method=operationalMethods[c.id][panel.id.slice(prefix.length)];
  const key=panel.primaryKey, op="op:"+panel.id.slice(prefix.length)+":";
  switch(method){
   case "calls":case "leads":case "qualified":case "booking":{
    const pop=method==="calls"?op+"unique-leads":method==="leads"?"affected":method==="qualified"?op+"affected-qualified-leads":op+"intended-bookings";
    const recovered=op+"recovered",pending=op+"pending",rate=op+"loss-rate";
    if(pop!=="affected")values[pop]=80*scale;
    values[recovered]=values[pop]*(example===0?.25:.2);
    values[pending]=values[pop]*(example===0?.25:.3);
    values[key]=values[pop]-values[recovered]-values[pending];
    values[rate]=100*values[key]/values[pop];
    block([pop,recovered,pending,key,rate],3,[[pop,key,rate]]);
    break;
   }
   case "reactivation":case "attendance":case "invoices":case "reviews":{
    const population=method==="invoices"&&c.id==="problem-22"?op+"affected-invoices":"affected";
    const rate=op+({reactivation:"reactivation-rate",attendance:"attendance-loss-rate",invoices:"invoice-loss-rate",reviews:"additional-review-rate"}[method]);
    if(population!=="affected")values[population]=40*scale;
    values[rate]=example===0?25:40;
    values[key]=values[population]*values[rate]/100;
    block([population,rate,key],2);
    break;
   }
   case "time":{
    const rate=op+"avoidable-percentage",necessary=op+"necessary-time";
    values[rate]=example===0?25:40;
    values[key]=values.hours*values[rate]/100;
    values[necessary]=values.hours-values[key];
    block(["hours",necessary,key,rate],2);break;
   }
   case "information":break;
   default:values[key]=example===0?7:11;
  }
 }
 return {values,blocks};
}
type Rule={requires:number;adds:number};
function components(keys:string[],blocks:Block[]):string[][]{
 const remaining=new Set(keys),result:string[][]=[];
 while(remaining.size){
  const group=new Set([remaining.values().next().value!]);
  let changed=true;while(changed){changed=false;for(const b of blocks)if(b.keys.some(k=>group.has(k)))for(const k of b.keys)if(!group.has(k)){group.add(k);changed=true;}}
  for(const k of group)remaining.delete(k);result.push([...group]);
 }
 return result;
}
function rulesFor(keys:string[],blocks:Block[]):Rule[]{
 const rules:Rule[]=[];
 const mask=(ks:string[])=>ks.reduce((n,k)=>n|(1<<keys.indexOf(k)),0);
 for(const b of blocks){
  if(!b.keys.every(k=>keys.includes(k)))continue;
  const all=mask(b.keys);
  // The only dependent local subsets are these explicitly stated groups:
  // the complementary rates, or population/loss/rate.
  const exceptions=b.groups.map(group=>mask(group));
  for(let m=1;m<1<<b.keys.length;m++){
   const local=mask(b.keys.filter((_,i)=>m&(1<<i)));
   if(popcount(m)===b.threshold&&!exceptions.some(e=>(local&e)===local))rules.push({requires:local,adds:all});
   for(const e of exceptions)if((local&e)===local&&popcount(local)===2)rules.push({requires:local,adds:e});
  }
 }
 return rules;
}
function closeMask(m:number,rules:Rule[]):number{
 let previous=-1;while(previous!==m){previous=m;for(const rule of rules)if((m&rule.requires)===rule.requires)m|=rule.adds;}return m;
}
// Each algebraic block is rationally invertible from every nondependent basis
// in the stated interior domain. The block incidence graph is a forest, so
// each connection contributes only one shared scalar. No extra global
// dependency can arise from a loop between blocks.
function verifyForest(keys:string[],blocks:Block[]){
 const parent=new Map<string,string>();
 const root=(k:string):string=>{const p=parent.get(k);if(!p||p===k)return k;const r=root(p);parent.set(k,r);return r;};
 blocks.forEach((b,i)=>{const node="block:"+i;for(const key of b.keys){check(keys.includes(key),"Unknown key "+key);const a=root(node),z=root(key);check(a!==z,"Block incidence graph contains cycle");parent.set(a,z);}});
}
for(const c of configs)test("minimum-input audit "+c.id,()=>{
 test.setTimeout(180000);
 const problem=problems.find(p=>p.id===c.id)!;
 const impactIds=problem.operationalImpacts.map(i=>i.id);
 let configurations=0,quantityOccurrences=0,subsetEnumerations=0,minimumTargetCombinations=0,minimumSets=0,removalSets=0,solverCases=0,combinedCases=0,verifiedTargets=0;
 const uniqueKeys=new Set<string>();
 for(let selection=0;selection<1<<impactIds.length;selection++){
  const panels=operationalPanels(c,impactIds.filter((_,i)=>selection&(1<<i)));
  const keys=[...new Set([...Object.values(c.fields).flat().map(f=>f.key),...panels.flatMap(p=>p.fields.map(f=>f.key))])];
  configurations++;quantityOccurrences+=keys.length;for(const k of keys)uniqueKeys.add(k);
  const equations=operationalEquations(panels);
  for(let example=0;example<2;example++){
   const {values,blocks}=fixture(c,panels,example);
   check(keys.every(k=>Number.isFinite(values[k])),c.id+" missing independent fixture");
   verifyForest(keys,blocks);
   for(const group of components(keys,blocks)){
    check(group.length<25,"Audit component exceeds practical enumeration limit");
    const rules=rulesFor(group,blocks),size=1<<group.length;
    const closures=new Uint32Array(size),cases=new Set<number>([0,size-1]),minimal=new Set<number>(),removals=new Set<number>();
    for(let mask=0;mask<size;mask++)closures[mask]=closeMask(mask,rules);
    subsetEnumerations+=size;
    for(let mask=1;mask<size;mask++){
     let derived=closures[mask]&~mask;
     for(let i=0;i<group.length;i++)if(derived&(1<<i)){
      const target=1<<i;
      let isMinimal=true;for(let bits=mask;bits;bits&=bits-1)if(closures[mask^(bits&-bits)]&target){isMinimal=false;break;}
      if(isMinimal){minimumTargetCombinations++;minimal.add(mask);for(let bits=mask;bits;bits&=bits-1)removals.add(mask^(bits&-bits));}
     }
    }
    minimumSets+=minimal.size;removalSets+=removals.size;
    for(const m of minimal)cases.add(m);for(const m of removals)cases.add(m);
    // Small connected components: exercise every subset directly, not just minimum sets.
    if(group.length<=9)for(let m=0;m<size;m++)cases.add(m);
    for(const mask of cases){
     const raw:Figures={};group.forEach((k,i)=>{if(mask&(1<<i))raw[k]=String(values[k]);});
     const result=solve(c,raw,equations);solverCases++;
     const label=c.id+" / selection "+selection+" / example "+example+" / inputs "+JSON.stringify(raw);
     check(!result.errors.length,label+" unexpected errors: "+result.errors.join("; "));
     const determined=closures[mask];
     const known=new Set(group.filter((_,i)=>determined&(1<<i)));
     if(popcount(determined&~mask)>1)combinedCases++;
     for(const key of keys){
      if(known.has(key)){verifiedTargets++;check(eq(result.values[key],values[key]),label+" expected "+key+" = "+values[key]+", got "+result.values[key]);}
      else check(result.values[key]===undefined,label+" unexpectedly determined "+key+" = "+result.values[key]);
     }
    }
   }
  }
 }
 console.log("MINIMUM_AUDIT "+JSON.stringify({problem:c.id,impactCount:impactIds.length,configurations,uniqueQuantities:uniqueKeys.size,quantityOccurrences,subsetEnumerations,minimumTargetCombinations,minimumSets,removalSets,solverCases,combinedCases,verifiedTargets}));
});

test("algebraic boundary routes, ambiguity, contradiction isolation and exact count validation",()=>{
 const c=configs.find(x=>x.id==="problem-20")!;
 const panels=operationalPanels(c,problems.find(x=>x.id===c.id)!.operationalImpacts.map(x=>x.id));
 const equations=operationalEquations(panels);
 const zero=solve(c,{total:"0"},equations);
 check(zero.values.affected===0&&zero.values.unaffected===0&&zero.values.hours===0,"Zero total must determine counts and total time");
 check(zero.values.affectedPct===undefined&&zero.values.unaffectedPct===undefined,"Zero population percentages undefined");
 const pct=solve(c,{targetPct:"100"},equations);
 check(pct.values.difference===0,"100% comparison determines zero difference");
 check(pct.values.hours===undefined&&pct.values.target===undefined,"100% does not identify actual or target");
 const no=solve(c,{affectedPct:"0"},equations);
 check(no.values.affected===0&&no.values.total===undefined,"0% identifies affected count but not population");
 const none=solve(c,{averageMinutes:"0"},equations);
 check(none.values.hours===0&&none.values.affected===undefined,"Zero average fixes hours, not population");
 const partial=solve(c,{total:"10",affected:"20",months:"3",target:"8",difference:"2"},equations);
 check(partial.errors.length&&partial.values.months===3&&partial.values.hours===10,"Contradiction must not block independent comparison and duration");
 check(partial.values.unaffected===undefined,"Contradictory population cannot calculate remaining count");
 const fraction=solve(c,{total:"10",affectedPct:"15"},equations);
 check(fraction.errors.length&&fraction.values.affected===undefined,"Fractional confirmed counts must not be silently rounded");
 const tiny=solve(c,{averageMinutes:"0.000000000001",affected:"1"},equations);
 check(tiny.values.hours>0,"Small positive hours must not become zero");
 const input={total:"100",unaffected:"70",averageMinutes:"15",days:"10"};
 const first=solve(c,input,equations),second=solve(c,Object.fromEntries(Object.entries(input).reverse()),equations);
 for(const key of Object.keys(first.values))check(eq(first.values[key],second.values[key]),"Order changes "+key);
 const edited=solve(c,{...input,unaffected:"60"},equations);check(edited.values.affected===40&&edited.values.hours===10,"Edited input recalculates");
 const removed=solve(c,{total:"100",averageMinutes:"15",days:"10"},equations);check(removed.values.affected===undefined&&removed.values.hours===undefined,"Removing information clears underdetermined values");
});
