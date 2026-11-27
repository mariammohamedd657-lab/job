import type { AlgebraEquation, Consequence } from "./algebra";
import type { PopulationLink } from "./information-links";
export type Limit={value:number;deps:Set<string>;reason?:string};
type Range={lo:Limit;hi:Limit};
export type QuantityBounds={min?:number;max?:number;minExclusive?:boolean;maxExclusive?:boolean;minReason?:string;maxReason?:string};
export type ComparisonRange={actual:string;target:string;difference:string;rate:string};
export type ComplementRate={population:string;components:string[];rate:string;label:string};
const limit=(value:number,deps:Iterable<string>=[]):Limit=>({value,deps:new Set(deps)});
const deps=(...limits:Limit[])=>new Set(limits.flatMap(x=>[...x.deps]));
const plus=(a:Limit,b:Limit)=>limit(a.value+b.value,deps(a,b));
const times=(a:Limit,n:number)=>limit(a.value*n,a.deps);
const multiply=(a:Limit,b:Limit,f:number)=>limit(a.value===0||b.value===0?0:a.value*b.value*f,deps(a,b));
const tolerance=(a:number,b:number)=>16*Number.EPSILON*Math.max(Math.abs(a),Math.abs(b),Number.MIN_VALUE);
export function rangeConsequences(equations:AlgebraEquation[],known:Record<string,number>,blocked:Set<string>,domain:(key:string)=>[number,number],integerKeys:Set<string>,denominators:Record<string,string>,populationLinks:PopulationLink[]=[],complements:ComplementRate[]=[],allKeys:string[]=[],comparison?:ComparisonRange,positiveParts:{result:string;difference:string}[]=[],sumLimits:{population:string;members:string[];label:string}[]=[]) {
 const ranges=new Map<string,Range>();
 const results:Consequence[]=[];
 const conflicts:{dependencies:string[];label:string}[]=[];
 const active=equations.filter(e=>!e.keys.some(k=>blocked.has(k)));
 const links=populationLinks.filter(link=>!blocked.has(link.population)&&!blocked.has(link.member));
 const groups=sumLimits.filter(g=>![g.population,...g.members].some(k=>blocked.has(k)));
 for(const key of new Set([...active.flatMap(e=>e.keys),...links.flatMap(link=>[link.population,link.member]),...groups.flatMap(g=>[g.population,...g.members]),...allKeys])){
  const [lo,hi]=domain(key);
  ranges.set(key,Number.isFinite(known[key])?{lo:limit(known[key],[key]),hi:limit(known[key],[key])}:{lo:limit(lo),hi:limit(hi)});
 }
 let changed=false;
 function narrow(key:string,edge:"lo"|"hi",candidate:Limit,label:string){
  const range=ranges.get(key);if(!range||!Number.isFinite(candidate.value))return;
  let n=candidate.value;
  if(integerKeys.has(key)){
   const slack=Math.min(1e-8,16*Number.EPSILON*Math.max(1,Math.abs(n)));
   n=edge==="lo"?Math.ceil(n-slack):Math.floor(n+slack);
  }
  const current=range[edge],opposite=range[edge==="lo"?"hi":"lo"];
  if(edge==="lo"?n<=current.value:n>=current.value)return;
  if(edge==="lo"?n>opposite.value:n<opposite.value){
   if(Math.abs(n-opposite.value)>tolerance(n,opposite.value))conflicts.push({dependencies:[...deps(candidate,opposite)],label});
   // Small floating-point discrepancies are not proof of inconsistency.
   return;
  }
  range[edge]={...limit(n,candidate.deps),reason:label};changed=true;
 }
 // Positive denominators are necessary for specified rates. Integer
 // populations must be at least one; continuous denominators stay open-ended.
 for(const [rate,key] of Object.entries(denominators))if(Number.isFinite(known[rate])&&integerKeys.has(key))narrow(key,"lo",limit(1,[rate]),"A specified rate requires a positive denominator");
 for(let pass=0;pass<48&&!conflicts.length;pass++){
  changed=false;
  for(const link of links){
   const parent=ranges.get(link.population)!,child=ranges.get(link.member)!;
   if(link.kind==="subset"){
    narrow(link.member,"hi",parent.hi,link.label);
    narrow(link.population,"lo",child.lo,link.label);
   }else{
    if(parent.hi.value===0)narrow(link.member,"hi",parent.hi,link.label);
    if(child.lo.value>0&&integerKeys.has(link.population))narrow(link.population,"lo",limit(1,child.lo.deps),link.label);
   }
  }
  for(const group of groups){
   const parent=ranges.get(group.population)!;
   const lower=group.members.reduce((a,key)=>plus(a,ranges.get(key)!.lo),limit(0));
   narrow(group.population,"lo",lower,group.label);
   for(const member of group.members){const others=group.members.filter(k=>k!==member).reduce((a,key)=>plus(a,ranges.get(key)!.lo),limit(0));narrow(member,"hi",limit(parent.hi.value-others.value,deps(parent.hi,others)),group.label);}
  }
  // Use the original breakdown and rate together, rather than dividing
  // independent endpoints which can refer to different populations.
  for(const item of complements){
   const {population,components,rate,label}=item;
   if([population,...components,rate].some(k=>blocked.has(k)||!ranges.has(k)))continue;
   if([population,...components,rate].every(k=>Number.isFinite(known[k])))continue;
   const p=ranges.get(population)!,r=ranges.get(rate)!;
   const low=components.reduce((a,k)=>plus(a,ranges.get(k)!.lo),limit(0));
   const high=components.reduce((a,k)=>plus(a,ranges.get(k)!.hi),limit(0));
   if(p.hi.value>0&&Number.isFinite(p.hi.value))narrow(rate,"hi",limit(100*(1-low.value/p.hi.value),deps(low,p.hi)),label);
   if(p.lo.value>0&&Number.isFinite(high.value))narrow(rate,"lo",limit(100*(1-high.value/p.lo.value),deps(high,p.lo)),label);
   if(r.hi.value<100)narrow(population,"hi",limit(high.value/(1-r.hi.value/100),deps(high,r.hi)),label);
   if(r.lo.value<100)narrow(population,"lo",limit(low.value/(1-r.lo.value/100),deps(low,r.lo)),label);
  }
  // Difference and percentage of target describe the same comparison.
  // Their combined relation is signed; it is not an ordinary nonnegative
  // product. These monotone endpoint formulas are valid even with missing
  // actual and target figures.
  if(comparison){
   const {actual,target,difference,rate}=comparison;
   const keys=[actual,target,difference,rate];
   if(keys.every(k=>ranges.has(k)&&!blocked.has(k))&&!keys.every(k=>Number.isFinite(known[k]))){
    const A=ranges.get(actual)!,T=ranges.get(target)!,D=ranges.get(difference)!,R=ranges.get(rate)!;
    const label="Difference = target × (percentage of target ÷ 100 − 1)";
    if(T.hi.value>0){
     if(D.lo.value>=0)narrow(rate,"lo",limit(100*(1+D.lo.value/T.hi.value),deps(D.lo,T.hi)),label);
     else if(T.lo.value>0)narrow(rate,"lo",limit(100*(1+D.lo.value/T.lo.value),deps(D.lo,T.lo)),label);
     if(D.hi.value<=0)narrow(rate,"hi",limit(100*(1+D.hi.value/T.hi.value),deps(D.hi,T.hi)),label);
     else if(T.lo.value>0)narrow(rate,"hi",limit(100*(1+D.hi.value/T.lo.value),deps(D.hi,T.lo)),label);
     const factorLo=R.lo.value/100-1,factorHi=R.hi.value/100-1;
     const product=(v:number,w:number)=>v===0||w===0?0:v*w;
     const lowT=factorLo<0?T.hi:T.lo,highT=factorHi<0?T.lo:T.hi;
     narrow(difference,"lo",limit(product(factorLo,lowT.value),deps(R.lo,lowT)),label);
     narrow(difference,"hi",limit(product(factorHi,highT.value),deps(R.hi,highT)),label);
     // Eliminate target: for a positive actual and rate, D/A=1−100/R.
     if(A.hi.value>0&&R.hi.value>0){
      if(D.lo.value>0&&Number.isFinite(A.hi.value)&&D.lo.value<A.hi.value)narrow(rate,"lo",limit(100/(1-D.lo.value/A.hi.value),deps(D.lo,A.hi)),label);
      if(D.hi.value<0&&Number.isFinite(A.hi.value))narrow(rate,"hi",limit(100/(1-D.hi.value/A.hi.value),deps(D.hi,A.hi)),label);
     }
    }
   }
  }
  for(const {result,difference} of positiveParts){
   if(blocked.has(result)||blocked.has(difference))continue;
   const A=ranges.get(result),D=ranges.get(difference);if(!A||!D)continue;
   const label="Higher costs = positive part of cost difference";
   narrow(result,"lo",limit(Math.max(0,D.lo.value),D.lo.deps),label);
   narrow(result,"hi",limit(Math.max(0,D.hi.value),D.hi.deps),label);
   narrow(difference,"hi",A.hi,label);
   if(A.lo.value>0)narrow(difference,"lo",A.lo,label);
  }
  for(const equation of active){
   // Fully known equations have already been checked by the original
   // validation pass with display-precision tolerance. Do not reinterpret them.
   if(equation.keys.every(k=>Number.isFinite(known[k])))continue;
   const product=equation.terms.find(t=>t.keys.length===2);
   if(product){
    const linear=equation.terms.find(t=>t.keys.length===1);
    if(!linear||equation.terms.length!==2)continue;
    const a=linear.keys[0],[b,c]=product.keys,f=-product.coefficient/linear.coefficient;
    if(f<=0)continue;
    const A=ranges.get(a)!,B=ranges.get(b)!,C=ranges.get(c)!;
    if(B.lo.value<0||C.lo.value<0||A.lo.value<0){
     const corners=[multiply(B.lo,C.lo,f),multiply(B.lo,C.hi,f),multiply(B.hi,C.lo,f),multiply(B.hi,C.hi,f)];
     narrow(a,"lo",limit(Math.min(...corners.map(x=>x.value)),deps(...corners)),equation.label);
     narrow(a,"hi",limit(Math.max(...corners.map(x=>x.value)),deps(...corners)),equation.label);
     for(const [key,other] of [[b,C],[c,B]] as const)if(other.lo.value>0||other.hi.value<0){
      const candidates=[A.lo.value/other.lo.value/f,A.lo.value/other.hi.value/f,A.hi.value/other.lo.value/f,A.hi.value/other.hi.value/f];
      if(candidates.every(v=>!Number.isNaN(v))){narrow(key,"lo",limit(Math.min(...candidates),deps(A.lo,A.hi,other.lo,other.hi)),equation.label);narrow(key,"hi",limit(Math.max(...candidates),deps(A.lo,A.hi,other.lo,other.hi)),equation.label);}
     }
     continue;
    }
    narrow(a,"lo",multiply(B.lo,C.lo,f),equation.label);
    narrow(a,"hi",multiply(B.hi,C.hi,f),equation.label);
    for(const [key,other] of [[b,C],[c,B]] as const){
     if(other.hi.value>0&&Number.isFinite(other.hi.value))narrow(key,"lo",limit(A.lo.value/other.hi.value/f,deps(A.lo,other.hi)),equation.label);
     if(other.lo.value>0&&Number.isFinite(A.hi.value))narrow(key,"hi",limit(A.hi.value/other.lo.value/f,deps(A.hi,other.lo)),equation.label);
    }
   }else{
    const coefficients=new Map<string,number>();let rhs=0;
    for(const t of equation.terms){if(t.keys.length===0)rhs-=t.coefficient;else if(t.keys.length===1)coefficients.set(t.keys[0],(coefficients.get(t.keys[0])??0)+t.coefficient);}
    for(const [key,c] of coefficients){
     if(!c)continue;let lo=limit(0),hi=limit(0);
     for(const [other,v] of coefficients){if(other===key||!v)continue;const range=ranges.get(other)!;lo=plus(lo,times(v>0?range.lo:range.hi,v));hi=plus(hi,times(v>0?range.hi:range.lo,v));}
     const low=c>0?hi:lo,high=c>0?lo:hi;
     narrow(key,"lo",limit((rhs-low.value)/c,low.deps),equation.label);
     narrow(key,"hi",limit((rhs-high.value)/c,high.deps),equation.label);
    }
   }
  }
  if(!changed)break;
 }
 if(!conflicts.length)for(const [key,{lo,hi}] of ranges){
  // Never equate two merely close floating point endpoints.
  if(!Number.isFinite(known[key])&&Number.isFinite(lo.value)&&lo.value===hi.value)results.push({key,value:lo.value,dependencies:[...deps(lo,hi)],label:"bounds of connected equations"});
 }
 const positive=new Set<string>();
 for(const [rate,key] of Object.entries(denominators))if(Number.isFinite(known[rate]))positive.add(key);
 for(const equation of active){
  const product=equation.terms.find(t=>t.keys.length===2),linear=equation.terms.find(t=>t.keys.length===1);
  if(product&&linear&&equation.terms.length===2&&(ranges.get(linear.keys[0])?.lo.value??0)>0)for(const key of product.keys)positive.add(key);
 }
 const bounds:Record<string,QuantityBounds>={};
 for(const [key,{lo,hi}] of ranges){
  if(blocked.has(key))continue;
  const denominator=denominators[key];
  if(denominator&&ranges.get(denominator)?.hi.value===0)continue;
  const min=Number.isFinite(lo.value)?lo.value:undefined,max=Number.isFinite(hi.value)?hi.value:undefined;
  if(min!==undefined&&max!==undefined&&min>max)continue;
  const diff=comparison&&key===comparison.rate?ranges.get(comparison.difference):undefined;
  bounds[key]={min,max,minExclusive:min===0&&positive.has(key)||min===100&&!!diff&&diff.lo.value>0,maxExclusive:max===100&&!!diff&&diff.hi.value<0,minReason:lo.reason??(Number.isFinite(known[key])?"Entered or calculated quantity":"Valid numerical domain"),maxReason:hi.reason??(Number.isFinite(known[key])?"Entered or calculated quantity":"Valid numerical domain")};
 }
 return {results,conflicts,bounds};
}
