import type {Config} from "./config";
import {financialContent,routeFields,type ContentRoute} from "./step2-content";
import {product,sum,type AdditionalEquations,type Relation} from "./solver";
export function potentialAndCostEquations(config:Config,base:AdditionalEquations,options:{newBuyerMatch?:boolean;matchedBuyerCosts?:boolean;grossComplete?:boolean;netComplete?:boolean;wastedComplete?:boolean;paidLeadContainment?:boolean;simpleInterest?:boolean;estimatedSimpleInterest?:boolean;estimatedGrossComplete?:boolean;estimatedNetComplete?:boolean;shareEstimatedAverages?:boolean;overdueInvoiceMatch?:boolean;overdueInvoiceContainment?:boolean}={}):AdditionalEquations{
 const outcomes=financialContent(config).filter(o=>["F7","F8","F3","F9","F4","F5"].includes(o.id));
 if(!outcomes.length)return base;
 const fields=[...new Map(outcomes.flatMap(o=>[...o.fields,...routeFields(o.routes)]).map(f=>[f.key,f])).values()];
 // Financial references to an unselected operational card are still the same scoped measurement.
 const keys=new Set(fields.map(f=>f.key));
 const relations:Relation[]=[],signedKeys:string[]=[],averageKeys:string[]=[],integerKeys:string[]=[],estimatedKeys:string[]=[],positiveParts:{difference:string;result:string}[]=[],undefinedRates:{denominator:string;rate:string}[]=[];
 const k=(s:string)=>"fin:"+s;
 const prod=(a:string,b:string,c:string,f=1,denom?:string)=>{relations.push(product(a,b,c,f,a+" = "+b+" × "+c+(f===.01?" ÷ 100":"")));if(denom)undefinedRates.push({denominator:denom,rate:c});};
 const plus=(a:string,b:string,c:string)=>relations.push(sum(a,b,c,a+" = "+b+" + "+c));
 const equal=(a:string,b:string)=>relations.push({keys:[a,b],label:a+" = "+b,terms:[{coefficient:1,keys:[a]},{coefficient:-1,keys:[b]}],derive:(v,key)=>v[key===a?b:a],valid:v=>Math.abs(v[a]-v[b])<=1e-8*Math.max(1,Math.abs(v[a]),Math.abs(v[b]))});
 const positive=(result:string,difference:string,actual:string,comparable:string)=>{plus(actual,difference,comparable);signedKeys.push(difference);positiveParts.push({result,difference});relations.push({keys:[result,difference],label:result+" = max(0, "+difference+")",derive:(v,key)=>key===result?Math.max(0,v[difference]):v[result]>0?v[result]:undefined,valid:v=>Math.abs(v[result]-Math.max(0,v[difference]))<=1e-8*Math.max(1,v[result])});};
 const populationLinks=[...(base.populationLinks??[])];
 const constraints=[...(base.constraints??[])];
 const totalOf=(total:string,parts:string[],complete:boolean)=>{
  const all=[total,...parts];
  if(complete)relations.push({keys:all,label:total+" = "+parts.join(" + "),terms:[{coefficient:1,keys:[total]},...parts.map(key=>({coefficient:-1,keys:[key]}))],derive:(v,key)=>key===total?parts.reduce((a,b)=>a+v[b],0):v[total]-parts.filter(k=>k!==key).reduce((a,b)=>a+v[b],0),valid:v=>Math.abs(v[total]-parts.reduce((a,b)=>a+v[b],0))<=1e-8*Math.max(1,Math.abs(v[total]))});
  if(complete&&parts.every(k=>!signedKeys.includes(k)))constraints.push({keys:all,message:"Nonoverlapping components exceed "+total,violated:v=>Number.isFinite(v[total])&&parts.reduce((a,b)=>a+(v[b]??0),0)>v[total]+1e-8*Math.max(1,v[total])});
 };
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
  const estimated=id==="F9";
  const avg=(suffix:string)=>k((estimated?"estimated-":"")+suffix);
  const paidSpend=k(estimated?"estimated-marketing-spend":"marketing-spend"),paidCount=k(estimated?"estimated-paid-acquired":"paid-acquired");
  if(estimated){estimatedKeys.push(...fields.filter(f=>f.key.startsWith("fin:estimated-higher:")||f.key.startsWith("fin:estimated-")&&!f.key.includes("avoided")).map(f=>f.key));if(options.shareEstimatedAverages)for(const key of ["average-paid-lead","average-additional-hour","average-collection-hour","average-additional-resource"])equal(avg(key),k(key));
   prod(x("staff"),k("estimated-staff-equivalents"),k("estimated-equivalent-cost"));prod(k("estimated-equivalent-expenditure"),k("estimated-equivalent-reference"),k("estimated-equivalent-cost"),1,k("estimated-equivalent-reference"));
  }
  positive(x("result"),x("difference"),x("actual"),x("comparable"));
  positive(x("marketing"),x("marketing-difference"),x("actual-marketing"),x("comparable-marketing"));
  positive(x("staff"),x("staff-difference"),x("actual-staff"),x("comparable-staff"));
  prod(x("marketing"),x("paid-leads"),avg("average-paid-lead"));
  prod(paidSpend,paidCount,avg("average-paid-lead"),1,paidCount);
  prod(x("staff"),x("paid-hours"),avg("average-additional-hour"));
  prod(x("staff"),x("employees"),x("employee-cost"));
  prod(x("incremental-staff-expenditure"),x("incremental-staff-hours"),avg("average-additional-hour"),1,x("incremental-staff-hours"));
  prod(x("incremental-employee-expenditure"),x("incremental-employee-count"),x("employee-cost"),1,x("incremental-employee-count"));
  plus(x("collection"),x("collection-staff"),x("collection-fees"));
  prod(x("collection-staff"),x("collection-hours"),avg("average-collection-hour"));
  prod(x("collection-expenditure"),x("collection-reference-hours"),avg("average-collection-hour"),1,x("collection-reference-hours"));
  plus(x("financing"),x("interest"),x("financing-fees"));
  if((estimated?options.estimatedSimpleInterest:options.simpleInterest)!==false){
   const interest=x("interest"),factors=[x("borrowed"),x("interest-rate"),x("borrowing-period")],all=[interest,...factors];
   relations.push({keys:all,label:"Simple interest = principal × annual percentage × days ÷ 36,500",terms:[{coefficient:1,keys:[interest]},{coefficient:-1/36500,keys:factors}],derive:(v,key)=>{if(key===interest)return factors.reduce((a,b)=>a*v[b],1)/36500;const divisor=factors.filter(k=>k!==key).reduce((a,b)=>a*v[b],1);return divisor===0?undefined:v[interest]*36500/divisor;},valid:v=>Math.abs(v[interest]-factors.reduce((a,b)=>a*v[b],1)/36500)<=1e-8*Math.max(1,v[interest])});
  }
  positive(x("other"),x("other-difference"),x("actual-other"),x("comparable-other"));
  prod(x("other"),x("resources"),avg("average-additional-resource"));
  prod(x("resource-expenditure"),x("resource-reference-units"),avg("average-additional-resource"),1,x("resource-reference-units"));
  averageKeys.push(avg("average-collection-hour"),avg("average-additional-resource"));
  signedKeys.push(x("collection-difference"),x("financing-difference"),x("net-category-difference"));
  totalOf(x("gross-increase"),["marketing","staff","collection","financing","other"].map(x),!!(estimated?options.estimatedGrossComplete:options.grossComplete));
  if(estimated?options.estimatedNetComplete:options.netComplete){totalOf(x("net-category-difference"),["marketing","staff","collection","financing","other"].map(part=>x(part+"-difference")),true);equal(x("difference"),x("net-category-difference"));}
  integerKeys.push(x("paid-leads"),x("employees"),x("incremental-employee-count"),paidCount);
  averageKeys.push(avg("average-paid-lead"),avg("average-additional-hour"),x("employee-cost"));
 }
 const delayed=outcomes.find(o=>o.id==="F5");
 if(delayed){
  const D=k("delayed"),due=k("payments-due"),timely=k("timely-payments"),count=k("late-invoices"),avg=k("average-late-invoice"),referenceCount=k("overdue-reference-count"),referenceAmount=k("overdue-reference-amount");
  plus(due,D,timely);prod(D,count,avg);prod(referenceAmount,referenceCount,avg,1,referenceCount);
  integerKeys.push(count,referenceCount);averageKeys.push(avg);
  const src=delayed.routes.find(r=>r.id==="affected-invoice-context")?.fields[0];
  if(src&&options.overdueInvoiceMatch)equal(count,src.key);
  else if(src&&options.overdueInvoiceContainment)populationLinks.push({population:count,member:src.key,kind:"subset",label:"Applicable additional unpaid invoices are a subset of invoices not paid on time"});
 }
 const wasted=outcomes.find(o=>o.id==="F4");
 if(wasted){
  const wm=k("wasted-marketing"),ws=k("wasted-staff"),wo=k("wasted-other"),paid=k("paid-lost"),hours=k("wasted-hours");
  totalOf(k("wasted"),[wm,ws,wo],!!options.wastedComplete);
  prod(wm,paid,k("average-paid-lead"));prod(k("marketing-spend"),k("paid-acquired"),k("average-paid-lead"),1,k("paid-acquired"));
  prod(ws,hours,k("average-staff-hour"));prod(k("relevant-staff-costs"),k("corresponding-hours"),k("average-staff-hour"),1,k("corresponding-hours"));
  prod(wo,k("wasted-resources"),k("average-wasted-resource"));prod(k("wasted-resource-expenditure"),k("wasted-resource-reference-units"),k("average-wasted-resource"),1,k("wasted-resource-reference-units"));
  const walk=(routes:ContentRoute[])=>{for(const route of routes){const src=route.fields.find(f=>f.shared==="operational"||f.shared==="problem");
   if(src&&route.id==="paid-lost")prod(paid,src.key,k("paid-share"),.01,src.key);
   if(src&&route.id==="avoidable"){prod(hours,src.key,k("avoidable-paid-share"),.01,src.key);populationLinks.push({population:src.key,member:hours,kind:"subset",label:"Wasted paid staff hours cannot exceed applicable avoidable hours"});}
   if(src&&route.id==="slots")prod(hours,src.key,k("wasted-hours-slot"));
   walk(route.children??[]);
  }};walk(wasted.routes);
  if(options.paidLeadContainment)populationLinks.push({population:k("paid-acquired"),member:paid,kind:"subset",label:"Paid lost leads cannot exceed relevant acquired paid leads"});
  integerKeys.push(paid,k("paid-acquired"));averageKeys.push(k("average-paid-lead"),k("average-staff-hour"),k("average-wasted-resource"),k("wasted-hours-slot"));
 }
 return {...base,populationLinks,constraints,fields:[...base.fields,...fields],relations:[...base.relations,...relations],signedKeys:[...(base.signedKeys??[]),...signedKeys],averageKeys:[...(base.averageKeys??[]),...averageKeys],integerKeys:[...(base.integerKeys??[]),...integerKeys],estimatedKeys:[...(base.estimatedKeys??[]),...estimatedKeys],positiveParts:[...(base.positiveParts??[]),...positiveParts],undefinedRates:[...(base.undefinedRates??[]),...undefinedRates]};
}
