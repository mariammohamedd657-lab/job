import type { AlgebraEquation, Consequence } from "./algebra";
import type { PopulationLink } from "./information-links";
type Limit={value:number;deps:Set<string>};
type Range={lo:Limit;hi:Limit};
const limit=(value:number,deps:Iterable<string>=[]):Limit=>({value,deps:new Set(deps)});
const deps=(...limits:Limit[])=>new Set(limits.flatMap(x=>[...x.deps]));
const plus=(a:Limit,b:Limit)=>limit(a.value+b.value,deps(a,b));
const times=(a:Limit,n:number)=>limit(a.value*n,a.deps);
const multiply=(a:Limit,b:Limit,f:number)=>limit(a.value===0||b.value===0?0:a.value*b.value*f,deps(a,b));
const tolerance=(a:number,b:number)=>16*Number.EPSILON*Math.max(Math.abs(a),Math.abs(b),Number.MIN_VALUE);
export function rangeConsequences(equations:AlgebraEquation[],known:Record<string,number>,blocked:Set<string>,domain:(key:string)=>[number,number],integerKeys:Set<string>,denominators:Record<string,string>,populationLinks:PopulationLink[]=[]){
 const ranges=new Map<string,Range>();
 const results:Consequence[]=[];
 const conflicts:{dependencies:string[];label:string}[]=[];
 const active=equations.filter(e=>!e.keys.some(k=>blocked.has(k)));
 const links=populationLinks.filter(link=>!blocked.has(link.population)&&!blocked.has(link.member));
 for(const key of new Set([...active.flatMap(e=>e.keys),...links.flatMap(link=>[link.population,link.member])])){
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
  range[edge]=limit(n,candidate.deps);changed=true;
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
    if(B.lo.value<0||C.lo.value<0||A.lo.value<0)continue;
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
 return {results,conflicts};
}
