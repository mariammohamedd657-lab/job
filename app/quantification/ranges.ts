import type { AlgebraEquation, Consequence } from "./algebra";
import type { PopulationLink } from "./information-links";
export type Limit={value:number;deps:Set<string>;reason?:string;exclusive?:boolean};
type Range={lo:Limit;hi:Limit};
export type QuantityBounds={min?:number;max?:number;minExclusive?:boolean;maxExclusive?:boolean;minReason?:string;maxReason?:string;minQuality?:"exact"|"conservative"|"unresolved"|"unbounded";maxQuality?:"exact"|"conservative"|"unresolved"|"unbounded"};
export type ComparisonRange={actual:string;target:string;difference:string;rate:string};
export type ComplementRate={population:string;components:string[];rate:string;label:string};
const limit=(value:number,deps:Iterable<string>=[]):Limit=>({value,deps:new Set(deps)});
const deps=(...limits:Limit[])=>new Set(limits.flatMap(x=>[...x.deps]));
const plus=(a:Limit,b:Limit):Limit=>({...limit(a.value+b.value,deps(a,b)),exclusive:a.exclusive||b.exclusive});
const times=(a:Limit,n:number):Limit=>({...limit(a.value*n,a.deps),exclusive:n!==0&&a.exclusive});
const multiply=(a:Limit,b:Limit,f:number)=>limit(a.value===0||b.value===0?0:a.value*b.value*f,deps(a,b));
const tolerance=(a:number,b:number)=>16*Number.EPSILON*Math.max(Math.abs(a),Math.abs(b),Number.MIN_VALUE);
export function rangeConsequences(equations:AlgebraEquation[],known:Record<string,number>,blocked:Set<string>,domain:(key:string)=>[number,number],integerKeys:Set<string>,denominators:Record<string,string>,populationLinks:PopulationLink[]=[],complements:ComplementRate[]=[],allKeys:string[]=[],comparison?:ComparisonRange,positiveParts:{difference:string;result:string}[]=[],externalBounds:Readonly<Record<string,QuantityBounds>>={}){
 const ranges=new Map<string,Range>();
 const results:Consequence[]=[];
 const conflicts:{dependencies:string[];label:string}[]=[];
 const active=equations.filter(e=>!e.keys.some(k=>blocked.has(k)));
 const links=populationLinks.filter(link=>!blocked.has(link.population)&&!blocked.has(link.member));
 for(const key of new Set([...active.flatMap(e=>e.keys),...links.flatMap(link=>[link.population,link.member]),...allKeys])){
  let [lo,hi]=domain(key);
  const external=externalBounds[key];
  let loOpen=!!external?.minExclusive&&external.min===lo,hiOpen=!!external?.maxExclusive&&external.max===hi;
  if(integerKeys.has(key)){
   if(Number.isFinite(lo))lo=loOpen?Math.floor(lo)+1:Math.ceil(lo);
   if(Number.isFinite(hi))hi=hiOpen?Math.ceil(hi)-1:Math.floor(hi);
   loOpen=false;hiOpen=false;
  }
  if(lo>hi||lo===hi&&(loOpen||hiOpen))conflicts.push({dependencies:Object.keys(known),label:"No feasible value for "+key+" within its numerical domain"});
  if(Number.isFinite(known[key])){
   const v=known[key];if(v<lo||v>hi||v===lo&&loOpen||v===hi&&hiOpen)conflicts.push({dependencies:[key],label:"Entered value violates the numerical domain of "+key});
   ranges.set(key,{lo:limit(v,[key]),hi:limit(v,[key])});
  }else ranges.set(key,{lo:{...limit(lo),exclusive:loOpen},hi:{...limit(hi),exclusive:hiOpen}});
 }
 let changed=false;
 function narrow(key:string,edge:"lo"|"hi",candidate:Limit,label:string){
  const range=ranges.get(key);if(!range||!Number.isFinite(candidate.value))return;
  let n=candidate.value,exclusive=!!candidate.exclusive;
  if(integerKeys.has(key)){
   const slack=Math.min(1e-8,16*Number.EPSILON*Math.max(1,Math.abs(n)));
   n=exclusive?(edge==="lo"?Math.floor(n)+1:Math.ceil(n)-1):edge==="lo"?Math.ceil(n-slack):Math.floor(n+slack);
   exclusive=false;
  }
  const current=range[edge],opposite=range[edge==="lo"?"hi":"lo"];
  if(edge==="lo"?n<current.value:n>current.value)return;
  if(n===current.value&&(!exclusive||current.exclusive))return;
  if((edge==="lo"?n>opposite.value:n<opposite.value)||n===opposite.value&&(exclusive||opposite.exclusive)){
   if(n===opposite.value&&(exclusive||opposite.exclusive)||Math.abs(n-opposite.value)>tolerance(n,opposite.value))conflicts.push({dependencies:[...deps(candidate,opposite)],label});
   // Small floating-point discrepancies are not proof of inconsistency.
   return;
  }
  range[edge]={...limit(n,candidate.deps),reason:label,exclusive};changed=true;
 }
 // Positive denominators are necessary for specified rates. Integer
 // populations must be at least one; continuous denominators stay open-ended.
 for(const [rate,key] of Object.entries(denominators))if(Number.isFinite(known[rate]))narrow(key,"lo",{...limit(0,[rate]),exclusive:true},"A specified rate requires a positive denominator");
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
  // Use the original breakdown and rate together, rather than dividing
  // independent endpoints which can refer to different populations.
  for(const item of complements){
   const {population,components,rate,label}=item;
   if([population,...components,rate].some(k=>blocked.has(k)||!ranges.has(k)))continue;
   if([population,...components,rate].every(k=>Number.isFinite(known[k])))continue;
   const p=ranges.get(population)!,r=ranges.get(rate)!;
   const low=components.reduce((a,k)=>plus(a,ranges.get(k)!.lo),limit(0));
   const high=components.reduce((a,k)=>plus(a,ranges.get(k)!.hi),limit(0));
   if(low.value>0)narrow(rate,"hi",{...limit(100,low.deps),exclusive:true},label);
   if(p.hi.value>0&&Number.isFinite(p.hi.value))narrow(rate,"hi",limit(100*(1-low.value/p.hi.value),deps(low,p.hi)),label);
   if(p.lo.value>0&&Number.isFinite(high.value))narrow(rate,"lo",limit(100*(1-high.value/p.lo.value),deps(high,p.lo)),label);
   if(r.hi.value<100)narrow(population,"hi",limit(high.value/(1-r.hi.value/100),deps(high,r.hi)),label);
   if(r.lo.value<100)narrow(population,"lo",limit(low.value/(1-r.lo.value/100),deps(low,r.lo)),label);
   const complementHi=multiply(p.hi,limit(1-r.lo.value/100,r.lo.deps),1);
   for(const key of components){const otherMin=components.filter(k=>k!==key).reduce((a,k)=>plus(a,ranges.get(k)!.lo),limit(0));narrow(key,"hi",limit(complementHi.value-otherMin.value,deps(complementHi,otherMin)),label);}
   if(r.lo.value===100&&low.value>0)conflicts.push({dependencies:[...deps(r.lo,low)],label});
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
  for(const {difference,result} of positiveParts){
   const D=ranges.get(difference),S=ranges.get(result);
   if(D&&S&&!blocked.has(difference)&&!blocked.has(result)){
    const label="Nonnegative outcome is the positive part of the signed difference";
    narrow(result,"lo",limit(Math.max(0,D.lo.value),D.lo.deps),label);
    narrow(result,"hi",limit(Math.max(0,D.hi.value),D.hi.deps),label);
    narrow(difference,"hi",S.hi,label);
    if(S.lo.value>0)narrow(difference,"lo",S.lo,label);
   }
  }
  for(const equation of active){
   // Fully known equations have already been checked by the original
   // validation pass with display-precision tolerance. Do not reinterpret them.
   if(equation.keys.every(k=>Number.isFinite(known[k])))continue;
   const product=equation.terms.find(t=>t.keys.length>=2);
   if(product){
    const linear=equation.terms.find(t=>t.keys.length===1);
    if(!linear||equation.terms.length!==2)continue;
    const a=linear.keys[0],f=-product.coefficient/linear.coefficient;
    if(!Number.isFinite(f)||f===0)continue;
    const A=ranges.get(a)!;
    const intervalProduct=(factors:Range[],scale:number):Range=>{
     let range:Range={lo:limit(scale),hi:limit(scale)};
     for(const factor of factors){
      const corners=[multiply(range.lo,factor.lo,1),multiply(range.lo,factor.hi,1),multiply(range.hi,factor.lo,1),multiply(range.hi,factor.hi,1)];
      range={lo:limit(Math.min(...corners.map(c=>c.value)),deps(...corners)),hi:limit(Math.max(...corners.map(c=>c.value)),deps(...corners))};
     }
     return range;
    };
    const full=intervalProduct(product.keys.map(k=>ranges.get(k)!),f);
    narrow(a,"lo",full.lo,equation.label);narrow(a,"hi",full.hi,equation.label);
    for(let j=0;j<product.keys.length;j++){
     const key=product.keys[j],other=intervalProduct(product.keys.filter((_,i)=>i!==j).map(k=>ranges.get(k)!),f);
     // Division is sound only when the entire divisor interval excludes zero.
     // Retain the one-sided nonnegative restrictions if the divisor may be zero.
     if(other.lo.value>0||other.hi.value<0){
      const corners=[A.lo.value/other.lo.value,A.lo.value/other.hi.value,A.hi.value/other.lo.value,A.hi.value/other.hi.value];
      if(corners.every(n=>!Number.isNaN(n))){const provenance=deps(A.lo,A.hi,other.lo,other.hi);narrow(key,"lo",limit(Math.min(...corners),provenance),equation.label);narrow(key,"hi",limit(Math.max(...corners),provenance),equation.label);}
     }else if(other.lo.value>=0&&A.lo.value>=0){
      if(other.hi.value>0&&Number.isFinite(other.hi.value))narrow(key,"lo",limit(A.lo.value/other.hi.value,deps(A.lo,other.hi)),equation.label);
     }
    }
   }else{
    if(equation.terms.some(t=>t.keys.length>1))continue;
    const coefficients=new Map<string,number>();let rhs=0;
    for(const t of equation.terms){if(t.keys.length===0)rhs-=t.coefficient;else if(t.keys.length===1)coefficients.set(t.keys[0],(coefficients.get(t.keys[0])??0)+t.coefficient);}
    for(const [key,c] of coefficients){
     if(!c)continue;let lo=limit(0),hi=limit(0);
     for(const [other,v] of coefficients){if(other===key||!v)continue;const range=ranges.get(other)!;lo=plus(lo,times(v>0?range.lo:range.hi,v));hi=plus(hi,times(v>0?range.hi:range.lo,v));}
     const low=c>0?hi:lo,high=c>0?lo:hi;
     narrow(key,"lo",{...limit((rhs-low.value)/c,low.deps),exclusive:low.exclusive},equation.label);
     narrow(key,"hi",{...limit((rhs-high.value)/c,high.deps),exclusive:high.exclusive},equation.label);
    }
   }
  }
  if(!changed)break;
 }
 if(!conflicts.length)for(const [key,{lo,hi}] of ranges){
  // Never equate two merely close floating point endpoints.
  if(!Number.isFinite(known[key])&&Number.isFinite(lo.value)&&lo.value===hi.value&&!lo.exclusive&&!hi.exclusive)results.push({key,value:lo.value,dependencies:[...deps(lo,hi)],label:"bounds of connected equations"});
 }
 const positive=new Set<string>();
 for(const [rate,key] of Object.entries(denominators))if(Number.isFinite(known[rate]))positive.add(key);
 for(const equation of active){
  const product=equation.terms.find(t=>t.keys.length===2),linear=equation.terms.find(t=>t.keys.length===1);
  if(product&&linear&&equation.terms.length===2&&(ranges.get(linear.keys[0])?.lo.value??0)>0&&product.keys.every(k=>(ranges.get(k)?.lo.value??-Infinity)>=0))for(const key of product.keys)positive.add(key);
 }
 const bounds:Record<string,QuantityBounds>={};
 for(const [key,{lo,hi}] of ranges){
  if(blocked.has(key))continue;
  const denominator=denominators[key];
  if(denominator&&ranges.get(denominator)?.hi.value===0)continue;
  const min=Number.isFinite(lo.value)?lo.value:undefined,max=Number.isFinite(hi.value)?hi.value:undefined;
  if(min!==undefined&&max!==undefined&&min>max)continue;
  const diff=comparison&&key===comparison.rate?ranges.get(comparison.difference):undefined;
  bounds[key]={min,max,minQuality:min===undefined?"unresolved":min===max?"exact":"conservative",maxQuality:max===undefined?"unresolved":min===max?"exact":"conservative",minExclusive:!!lo.exclusive||min===0&&positive.has(key)||min===100&&!!diff&&diff.lo.value>0,maxExclusive:!!hi.exclusive||max===100&&(!!diff&&diff.hi.value<0||complements.some(c=>c.rate===key&&!c.components.some(k=>blocked.has(k))&&c.components.some(k=>(ranges.get(k)?.lo.value??0)>0))),minReason:lo.reason??(Number.isFinite(known[key])?"Entered or calculated quantity":"Valid numerical domain"),maxReason:hi.reason??(Number.isFinite(known[key])?"Entered or calculated quantity":"Valid numerical domain")};
 }
 return {results,conflicts,bounds};
}
