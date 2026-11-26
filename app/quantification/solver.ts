import type { Config } from "./config";
import { algebraicConsequences, type Term } from "./algebra";
export type Figures=Record<string,string>;
export type Result={values:Record<string,number>; calculated:Record<string,string>; errors:string[]; blocked:Set<string>};
export type Relation={keys:string[]; label:string; terms?:Term[]; operation?:(v:Record<string,number>,key:string)=>string; impossible?:(v:Record<string,number>,key:string)=>boolean; derive:(v:Record<string,number>, key:string)=>number|undefined; valid:(v:Record<string,number>)=>boolean};
const close=(a:number,b:number)=>Math.abs(a-b)<=1e-8*Math.max(1,Math.abs(a),Math.abs(b));
const div=(a:number,b:number)=>b===0?undefined:a/b;
function sum(a:string,b:string,c:string,label:string):Relation{return {keys:[a,b,c],label,terms:[{coefficient:1,keys:[a]},{coefficient:-1,keys:[b]},{coefficient:-1,keys:[c]}],operation:(v,k)=>k===a?format(v[b])+" + "+format(v[c]):k===b?format(v[a])+" − "+format(v[c]):format(v[a])+" − "+format(v[b]),derive:(v,k)=>k===a?v[b]+v[c]:k===b?v[a]-v[c]:v[a]-v[b],valid:v=>close(v[a],v[b]+v[c])};}
// a = b*c*factor. A zero divisor is indeterminate, never infinity.
export function product(a:string,b:string,c:string,factor:number,label:string):Relation{return {keys:[a,b,c],label,terms:[{coefficient:1,keys:[a]},{coefficient:-factor,keys:[b,c]}],operation:(v,k)=>{const f=factor===1?"":factor===.01?" ÷ 100":factor===1/60?" ÷ 60":" × "+format(factor);const inv=factor===1?"":factor===.01?" × 100":factor===1/60?" × 60":" ÷ "+format(factor);return k===a?format(v[b])+" × "+format(v[c])+f:format(v[a])+" ÷ "+format(v[k===b?c:b])+inv;},impossible:(v,k)=>k!==a&&v[k===b?c:b]===0&&v[a]!==0,derive:(v,k)=>k===a?v[b]*v[c]*factor:k===b?div(v[a],v[c]*factor):div(v[a],v[b]*factor),valid:v=>close(v[a],v[b]*v[c]*factor)};}
function ratio(a:string,b:string,c:string,factor:number,label:string):Relation{return product(a,b,c,factor,label);}
const validValue=(key:string,n:number)=>Number.isFinite(n)&&(key==="difference"||n>=0)&&(!["affectedPct","unaffectedPct"].includes(key)||n<=100);
export type AdditionalConstraint={keys:string[];message:string;violated:(values:Record<string,number>)=>boolean};
export type ZeroInference={target:string;dependencies:string[];label:string};
export type AdditionalEquations={fields:{key:string;label:string;unit:string}[];relations:Relation[];constraints?:AdditionalConstraint[];undefinedRates?:{denominator:string;rate:string}[];integerKeys?:string[];inferZeros?:(values:Record<string,number>)=>ZeroInference[]};
export function solve(config:Config,raw:Figures,additional?:AdditionalEquations):Result{
 const labels=Object.fromEntries([...Object.values(config.fields).flat(),...(additional?.fields??[])].map(f=>[f.key,f.label]));
 const integerKeys=new Set(["total","affected","unaffected","recordedUnits",...(additional?.integerKeys??[])]);
 const isValid=(key:string,n:number,computed=false)=>validValue(key,n)&&(!additional?.fields.some(f=>f.key===key&&f.unit==="%")||n<=100)&&(!integerKeys.has(key)||(computed?Math.abs(n-Math.round(n))<=1e-7:Number.isInteger(n)));

 const relations:Relation[]=[];
 if(config.fields.Quantity.length)relations.push(sum("total","affected","unaffected","Total = affected + unaffected"),ratio("affected","total","affectedPct",.01,"Affected = total × affected % ÷ 100"),ratio("unaffected","total","unaffectedPct",.01,"Unaffected = total × unaffected % ÷ 100"),{keys:["affectedPct","unaffectedPct"],label:"Affected % + unaffected % = 100",terms:[{coefficient:1,keys:["affectedPct"]},{coefficient:1,keys:["unaffectedPct"]},{coefficient:-100,keys:[]}],operation:(v,k)=>"100 − "+format(v[k==="affectedPct"?"unaffectedPct":"affectedPct"]),derive:(v,k)=>100-v[k==="affectedPct"?"unaffectedPct":"affectedPct"],valid:v=>close(v.affectedPct+v.unaffectedPct,100)});
 if(config.timePopulation)relations.push(product("hours",config.timePopulation,"averageMinutes",1/60,"Hours = quantity × average minutes ÷ 60"));
 if(config.fields.Frequency.length)relations.push(product("affected","days","daily",1,"Affected quantity = days × quantity per day"));
 if(config.actualKey)relations.push(sum(config.actualKey,"target","difference","Actual = target + difference"),ratio(config.actualKey,"target","targetPct",.01,"Actual = target × percentage of target ÷ 100"),{
  keys:["difference","target","targetPct"],label:"Difference = target × (percentage of target ÷ 100 − 1)",
  derive:(v,k)=>k==="difference"?v.target*(v.targetPct/100-1):k==="target"?div(v.difference,v.targetPct/100-1):v.target===0?undefined:(1+v.difference/v.target)*100,
  operation:(v,k)=>k==="difference"?format(v.target)+" × ("+format(v.targetPct)+" ÷ 100 − 1)":k==="target"?format(v.difference)+" ÷ ("+format(v.targetPct)+" ÷ 100 − 1)":"(1 + "+format(v.difference)+" ÷ "+format(v.target)+") × 100",
  impossible:(v,k)=>k==="target"&&v.targetPct===100&&v.difference!==0||k==="targetPct"&&v.target===0&&v.difference!==0,
  valid:v=>close(v.difference,v.target*(v.targetPct/100-1))
 });
 if(config.moneyPopulation)relations.push(product("moneyTotal",config.moneyPopulation,"moneyAverage",1,"Total amount = quantity × average amount"));
 if(additional)relations.push(...additional.relations);
 const algebra=relations.flatMap(rel=>rel.terms?[{keys:rel.keys,label:rel.label,terms:rel.terms}]:[]);
 const rateDenominators:Record<string,string>={affectedPct:"total",unaffectedPct:"total",targetPct:"target",daily:"days",...Object.fromEntries((additional?.undefinedRates??[]).map(x=>[x.rate,x.denominator]))};
 const domain=(key:string):[number,number]=>[key==="difference"?-Infinity:0,["affectedPct","unaffectedPct"].includes(key)||additional?.fields.some(f=>f.key===key&&f.unit==="%")?100:Infinity];
 const manual:Record<string,number>={},blocked=new Set<string>(),errors=new Set<string>();
 for(const [k,s] of Object.entries(raw)){if(!labels[k]||s.trim()==="")continue;const n=Number(s);if(!isValid(k,n)){blocked.add(k);errors.add((labels[k]??k)+": invalid value.");}else manual[k]=n;}
 let values:Record<string,number>={},calculated:Record<string,string>={};
 // Rebuild from manual figures after blocking contradictory dependencies.
 for(let round=0;round<50;round++){
  values={...manual};calculated={};
  const roots:Record<string,Set<string>>=Object.fromEntries(Object.keys(manual).map(k=>[k,new Set([k])]));
  const active=(k:string)=>values[k]!==undefined&&!blocked.has(k)&&![...(roots[k]??[])].some(x=>blocked.has(x));
  let changed=false;
  const contradict=(keys:string[],message:string)=>{errors.add(message);for(const k of keys)for(const x of roots[k]??[]){if(!blocked.has(x)){blocked.add(x);changed=true;}}};
  for(let pass=0;pass<50;pass++){
   let added=false;
   for(const rel of relations){
    if(rel.keys.some(k=>blocked.has(k)))continue;
    const missing=rel.keys.filter(k=>!active(k));
    if(missing.length===0){if(!rel.valid(values))contradict(rel.keys,"Contradictory entries: "+rel.label+".");continue;}
    if(missing.length!==1)continue;
    const k=missing[0];if(k in manual||blocked.has(k))continue;
    const known=rel.keys.filter(x=>x!==k);if(!known.every(active))continue;
    if(rel.impossible?.(values,k)){contradict(known,"Contradictory entries: "+rel.label+".");continue;}
    const n=rel.derive(values,k);if(n===undefined)continue;
    if(!isValid(k,n,true)){contradict(known,"Contradictory entries: "+rel.label+".");continue;}
    values[k]=integerKeys.has(k)?Math.round(n):Math.abs(n)<1e-12?0:n;
    roots[k]=new Set(known.flatMap(x=>[...roots[x]]));
    calculated[k]=(labels[k]??k)+" = "+(rel.operation?.(values,k)??rel.label)+" = "+format(values[k]);
    added=true;
   }
   // Boundary cases of the approved operational equations: a zero population,
   // a zero/100% rate, or an exhausted nonnegative breakdown can force zero
   // even when several fields were initially unknown.
   if(additional?.inferZeros){
    const known=Object.fromEntries(Object.entries(values).filter(([k])=>active(k)));
    for(const inference of additional.inferZeros(known)){
     const k=inference.target;
     if(blocked.has(k)||!inference.dependencies.every(active))continue;
     if(active(k)){
      if(values[k]!==0)contradict([...inference.dependencies,k],"Contradictory entries: "+inference.label+".");
      continue;
     }
     if(k in manual)continue;
     values[k]=0;
     roots[k]=new Set(inference.dependencies.flatMap(x=>[...roots[x]]));
     calculated[k]=(labels[k]??k)+" = 0 ("+inference.label+")";
     added=true;
    }
   }
   // Run a simultaneous algebraic pass after the ordinary forward/reverse
   // routes have reached a fixed point. Re-enter the same loop on any new value.
   if(!changed&&!added){
    const known=Object.fromEntries(Object.entries(values).filter(([key])=>active(key)));
    const deductions=algebraicConsequences(algebra,known,blocked,domain);
    for(const conflict of deductions.conflicts)if(conflict.dependencies.every(active))contradict(conflict.dependencies,"Contradictory entries: "+conflict.label+".");
    for(const inferred of deductions.results){
     const k=inferred.key;
     if(blocked.has(k)||!inferred.dependencies.every(active))continue;
     const denominator=rateDenominators[k];
     if(denominator&&active(denominator)&&values[denominator]===0)continue;
     if(!isValid(k,inferred.value,true)){contradict(inferred.dependencies,"Contradictory entries: "+inferred.label+".");continue;}
     if(active(k)){if(!close(values[k],inferred.value))contradict([...inferred.dependencies,k],"Contradictory entries: "+inferred.label+".");continue;}
     if(k in manual)continue;
     values[k]=integerKeys.has(k)?Math.round(inferred.value):inferred.value===0?0:inferred.value;
     roots[k]=new Set(inferred.dependencies.flatMap(x=>[...roots[x]]));
     calculated[k]=(labels[k]??k)+" = "+format(values[k])+" (combined: "+inferred.label+")";
     added=true;
    }
   }
   if(changed||!added)break;
  }
  if(active("total"))for(const k of ["affected","unaffected"])if(active(k)&&values[k]>values.total&&!close(values[k],values.total))contradict(["total",k],"Contradictory entries: affected or unaffected quantity exceeds total.");
  if(active("total")&&values.total===0){for(const k of ["affectedPct","unaffectedPct"])if(active(k)){if(k in manual)contradict(["total",k],"Percentages are undefined when total quantity is zero.");else {delete values[k];delete calculated[k];}}}
  if(active("target")&&values.target===0&&active("targetPct")){if("targetPct" in manual)contradict(["target","targetPct"],"Percentage of target is undefined when target is zero.");else{delete values.targetPct;delete calculated.targetPct;}}
  if(active("days")&&values.days===0&&active("daily")){if("daily" in manual)contradict(["days","daily"],"Frequency is undefined for a zero measurement period.");else{delete values.daily;delete calculated.daily;}}
  // Extra checks belong only to active impact equations; the original problem rules remain unchanged.
  const known=Object.fromEntries(Object.entries(values).filter(([key])=>active(key)));
  for(const constraint of additional?.constraints??[])if(constraint.violated(known))contradict(constraint.keys.filter(active),constraint.message);
  for(const {denominator,rate} of additional?.undefinedRates??[])if(active(denominator)&&values[denominator]===0&&active(rate)){
   if(rate in manual)contradict([denominator,rate],(labels[rate]??"Rate")+" is undefined when "+(labels[denominator]??"the population")+" is zero.");
   else {delete values[rate];delete calculated[rate];}
  }
  if(!changed)break;
 }
 return {values,calculated,errors:[...errors],blocked};
}
export function format(n:number){return String(Number(n.toPrecision(10)));}
