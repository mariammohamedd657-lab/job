import type {Config} from "./config";
import {financialContent,routeFields} from "./step2-content";
import {product,type AdditionalEquations,type Relation} from "./solver";
export function confirmedRevenueEquations(config:Config,base:AdditionalEquations):AdditionalEquations{
 const outcome=financialContent(config).find(o=>o.id==="F1");
 if(!outcome)return base;
 const P="fin:confirmed-purchases",A="fin:average-revenue-purchase",R="fin:confirmed-revenue",B="fin:purchase-revenue",V="fin:retained-revenue",T="fin:purchase-total-revenue",N="fin:total-purchases";
 const fields=[...new Map([...outcome.fields,...routeFields(outcome.routes)].map(f=>[f.key,f])).values()];
 const relations:Relation[]=[product(R,P,A,1,"Confirmed revenue loss = confirmed purchases lost × average revenue per purchase"),product(T,N,A,1,"Total relevant revenue = relevant purchases × average revenue per purchase"),{keys:[B,R,V],label:"Revenue before loss = confirmed revenue loss + retained revenue",terms:[{coefficient:1,keys:[B]},{coefficient:-1,keys:[R]},{coefficient:-1,keys:[V]}],derive:(v,k)=>k===B?v[R]+v[V]:k===R?v[B]-v[V]:v[B]-v[R],valid:v=>Math.abs(v[B]-v[R]-v[V])<=16*Number.EPSILON*Math.max(1,v[B],v[R],v[V])}];
 return {...base,fields:[...base.fields,...fields],relations:[...base.relations,...relations],integerKeys:[...(base.integerKeys??[]),P,N],actualIntegerKeys:[...(base.actualIntegerKeys??[]),P,N],averageKeys:[...(base.averageKeys??[]),A],populationLinks:[...(base.populationLinks??[]),{population:B,member:V,kind:"subset",label:"Retained revenue cannot exceed corresponding revenue before loss"},{population:B,member:R,kind:"subset",label:"Revenue loss cannot exceed corresponding revenue before loss"}]};
}
