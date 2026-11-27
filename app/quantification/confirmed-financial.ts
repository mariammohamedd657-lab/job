import type {Config} from "./config";
import {financialContent,routeFields} from "./step2-content";
import {product,sum,type AdditionalEquations,type Relation} from "./solver";

// These routes share a single problem-local financial measurement. No operational
// count is treated as a confirmed purchase. Historical averages remain separate.
export function confirmedFinancialEquations(config:Config,operational:AdditionalEquations,matchedVariableCost=false):AdditionalEquations{
 const outcomes=financialContent(config).filter(o=>o.id==="F1"||o.id==="F2");
 if(!outcomes.length)return operational;
 const fields=[...new Map(outcomes.flatMap(o=>[o.primary,...o.fields,...routeFields(o.routes)]).map(f=>[f.key,f])).values()];
 const has=(id:string)=>outcomes.some(o=>o.id===id);
 const k=(x:string)=>"fin:"+x;
 const P=k("confirmed-purchases"),A=k("average-revenue-purchase"),R=k("confirmed-revenue"),B=k("purchase-revenue"),V=k("retained-revenue"),T=k("purchase-total-revenue"),N=k("total-purchases"),C=k("avoided-variable"),L=k("confirmed-profit"),M=k("confirmed-margin"),H=k("purchase-total-profit"),W=k("purchase-variable-costs"),G=k("average-profit-purchase"),J=k("average-avoided-purchase"),K=k("average-variable-purchase");
 const relations:Relation[]=[];
 const denominators:{denominator:string;rate:string}[]=[];
 const prod=(a:string,b:string,c:string,f:number,label:string,denominator?:string)=>{relations.push(product(a,b,c,f,label));if(denominator)denominators.push({denominator,rate:c});};
 if(has("F1")||has("F2")){
  prod(R,P,A,1,"Confirmed revenue loss = confirmed purchases lost × average revenue per purchase");
  relations.push(sum(B,R,V,"Purchase revenue before loss = confirmed revenue loss + retained revenue"));
  prod(T,N,A,1,"Total relevant revenue = relevant purchases × average revenue per purchase");
 }
 if(has("F2")){
  relations.push(sum(R,L,C,"Confirmed revenue loss = confirmed contribution profit loss + avoided variable costs"));
  prod(L,R,M,.01,"Confirmed contribution profit loss = confirmed revenue loss × contribution profit margin ÷ 100");
  relations.push(sum(T,H,W,"Total revenue = total contribution profit + total variable costs"));
  prod(H,T,M,.01,"Total contribution profit = total revenue × contribution profit margin ÷ 100");
  prod(L,P,G,1,"Confirmed contribution profit loss = confirmed purchases lost × average contribution profit per purchase");
  prod(H,N,G,1,"Total contribution profit = total applicable purchases × average contribution profit per purchase",N);
  prod(C,P,J,1,"Avoided variable costs = confirmed purchases lost × average avoided variable cost per purchase");
  prod(W,N,K,1,"Total variable costs = relevant purchases × average variable cost per purchase",N);
  relations.push(sum(A,G,J,"Applicable revenue per lost purchase = contribution profit per lost purchase + applicable avoided variable cost per lost purchase"));
  if(matchedVariableCost)relations.push({keys:[J,K],label:"Historical variable cost per purchase equals applicable avoided cost per purchase",terms:[{coefficient:1,keys:[J]},{coefficient:-1,keys:[K]}],derive:(v,key)=>v[key===J?K:J],valid:v=>Math.abs(v[J]-v[K])<=1e-8*Math.max(1,Math.abs(v[J]),Math.abs(v[K]))});
 }
 const constraints=[...(operational.constraints??[])];
 const populationLinks=[...(operational.populationLinks??[])];
 if(has("F1"))populationLinks.push({population:B,member:V,kind:"subset",label:"Retained purchase revenue cannot exceed the corresponding purchase revenue before loss"},{population:B,member:R,kind:"subset",label:"Confirmed revenue loss cannot exceed the corresponding purchase revenue before loss"});
 if(has("F2"))constraints.push({keys:[R,L],message:"Contribution profit loss cannot exceed corresponding revenue loss.",violated:v=>Number.isFinite(v[R])&&Number.isFinite(v[L])&&v[L]>v[R]+1e-8*Math.max(1,v[R])});
 return {...operational,fields:[...operational.fields,...fields],relations:[...operational.relations,...relations],constraints,populationLinks,undefinedRates:[...(operational.undefinedRates??[]),...denominators],integerKeys:[...(operational.integerKeys??[]),P,N],actualIntegerKeys:[...(operational.actualIntegerKeys??[]),P,N],referenceAverages:[...(operational.referenceAverages??[]),{denominator:N,total:T,average:A}],signedKeys:[...(operational.signedKeys??[]),L,M,H,G],averageKeys:[...(operational.averageKeys??[]),A,G,J,K,M],inferZeros:v=>[...(operational.inferZeros?.(v)??[]),...(v[P]===0?[{target:R,dependencies:[P],label:"Zero confirmed lost purchases"} ,...(has("F2")?[{target:L,dependencies:[P],label:"Zero confirmed lost purchases"},{target:C,dependencies:[P],label:"Zero confirmed lost purchases"}]:[])]:[])]};
}
