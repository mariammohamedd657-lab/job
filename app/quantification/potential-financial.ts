import type {Config} from "./config";
import {financialContent,routeFields,type ContentRoute} from "./step2-content";
import {product,sum,type AdditionalEquations,type Relation} from "./solver";
export function potentialAndCostEquations(config:Config,base:AdditionalEquations,options:{newBuyerMatch?:boolean;matchedBuyerCosts?:boolean}={}):AdditionalEquations{
 const outcomes=financialContent(config).filter(o=>["F7","F8","F3","F9"].includes(o.id));
 if(!outcomes.length)return base;
 const fields=[...new Map(outcomes.flatMap(o=>[...o.fields,...routeFields(o.routes)]).map(f=>[f.key,f])).values()];
 const keys=new Set(fields.map(f=>f.key));
 const relations:Relation[]=[],signedKeys:string[]=[],averageKeys:string[]=[],integerKeys:string[]=[],estimatedKeys:string[]=[],positiveParts:{difference:string;result:string}[]=[],undefinedRates:{denominator:string;rate:string}[]=[];
 const k=(s:string)=>"fin:"+s;
 const prod=(a:string,b:string,c:string,f=1,denom?:string)=>{relations.push(product(a,b,c,f,a+" = "+b+" × "+c+(f===.01?" ÷ 100":"")));if(denom)undefinedRates.push({denominator:denom,rate:c});};
 const plus=(a:string,b:string,c:string)=>relations.push(sum(a,b,c,a+" = "+b+" + "+c));
 const equal=(a:string,b:string)=>relations.push({keys:[a,b],label:a+" = "+b,terms:[{coefficient:1,keys:[a]},{coefficient:-1,keys:[b]}],derive:(v,key)=>v[key===a?b:a],valid:v=>Math.abs(v[a]-v[b])<=1e-8*Math.max(1,Math.abs(v[a]),Math.abs(v[b]))});
 const positive=(result:string,difference:string,actual:string,comparable:string)=>{plus(actual,difference,comparable);signedKeys.push(difference);positiveParts.push({result,difference});relations.push({keys:[result,difference],label:result+" = max(0, "+difference+")",derive:(v,key)=>key===result?Math.max(0,v[difference]):v[result]>0?v[result]:undefined,valid:v=>Math.abs(v[result]-Math.max(0,v[difference]))<=1e-8*Math.max(1,v[result])});};
 const B=k("potential-buyers"),A=k("average-revenue-buyer"),R=k("potential-revenue"),N=k("total-buyers"),T=k("buyer-scope-revenue"),L=k("potential-profit"),C=k("estimated-avoided"),G=k("average-profit-buyer"),J=k("average-avoided-buyer"),H=k("buyer-total-profit"),W=k("buyer-variable-costs"),M=k("potential-margin"),K=k("average-variable-buyer");
 if(outcomes.some(o=>o.id==="F7"||o.id==="F8")){
  prod(R,B,A);prod(T,N,A,1,N);integerKeys.push(N);estimatedKeys.push(B,R);averageKeys.push(A);
  const walk=(routes:ContentRoute[])=>{for(const route of routes){
   const source=route.fields.find(f=>f.shared==="operational"||f.shared==="problem"),rate=route.fields.find(f=>f.key.startsWith("fin:conversion:"));
   if(source&&rate){prod(B,source.key,rate.key,.01,source.key);const e=k("historical:"+route.id+":eligible"),c=k("historical:"+route.id+":converted");if(keys.has(e)&&keys.has(c)){prod(c,e,rate.key,.01,e);integerKeys.push(e,c);}}
   if(route.id==="slots"&&source)prod(B,source.key,k("buyers-per-slot"),1,source.key);
   if(route.id==="new-buyers"&&source&&options.newBuyerMatch)equal(B,source.key);
   if(route.id==="existing"&&source)prod(k("expected-future-revenue"),source.key,k("future-revenue-existing"));
   walk(route.children??[]);
  }};
  walk(outcomes.find(o=>o.id==="F7")?.routes??outcomes.find(o=>o.id==="F8")?.routes??[]);
 }
 if(outcomes.some(o=>o.id==="F8")){
  plus(R,L,C);prod(L,R,M,.01);prod(L,B,G);prod(C,B,J);plus(T,H,W);prod(H,T,M,.01,T);prod(H,N,G,1,N);prod(W,N,K,1,N);plus(A,G,J);
  if(options.matchedBuyerCosts)equal(J,K);
  signedKeys.push(L,G,H,M);averageKeys.push(G,J,K,M);estimatedKeys.push(L,C);
 }
 for(const [id,prefix] of [["F3","higher:"],["F9","estimated-higher:"]]){
  if(!outcomes.some(o=>o.id===id))continue;
  const x=(suffix:string)=>k(prefix+suffix);
  positive(x("result"),x("difference"),x("actual"),x("comparable"));
  positive(x("marketing"),x("marketing-difference"),x("actual-marketing"),x("comparable-marketing"));
  positive(x("staff"),x("staff-difference"),x("actual-staff"),x("comparable-staff"));
  prod(x("marketing"),x("paid-leads"),k("average-paid-lead"));
  prod(k("marketing-spend"),k("paid-acquired"),k("average-paid-lead"),1,k("paid-acquired"));
  prod(x("staff"),x("paid-hours"),k("average-additional-hour"));
  prod(x("staff"),x("employees"),x("employee-cost"));
  prod(x("incremental-staff-expenditure"),x("incremental-staff-hours"),k("average-additional-hour"),1,x("incremental-staff-hours"));
  prod(x("incremental-employee-expenditure"),x("incremental-employee-count"),x("employee-cost"),1,x("incremental-employee-count"));
  integerKeys.push(x("paid-leads"),x("employees"),x("incremental-employee-count"),k("paid-acquired"));
  averageKeys.push(k("average-paid-lead"),k("average-additional-hour"),x("employee-cost"));
 }
 return {...base,fields:[...base.fields,...fields],relations:[...base.relations,...relations],signedKeys:[...(base.signedKeys??[]),...signedKeys],averageKeys:[...(base.averageKeys??[]),...averageKeys],integerKeys:[...(base.integerKeys??[]),...integerKeys],estimatedKeys:[...(base.estimatedKeys??[]),...estimatedKeys],positiveParts:[...(base.positiveParts??[]),...positiveParts],undefinedRates:[...(base.undefinedRates??[]),...undefinedRates]};
}
