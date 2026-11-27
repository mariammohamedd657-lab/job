import {read,mul,div,sub,type Num,type Values} from "./investment-model";
export const opportunityTypes=["Leads","Qualified leads","Appointments","Confirmed lost buyers"] as const;
export type OpportunityType=typeof opportunityTypes[number];
export type PoolValues={type:OpportunityType;total:Num;lost:Num;remaining:Num;leakage:Num;rate:Num;ticket:Num;profit:Num;buyersLost:Num;revenueLost:Num;profitLost:Num;unnecessary:Num;unpaid:Num;late:Num;confirmedBuyers:Num;confirmedRevenue:Num;confirmedProfit:Num;estimatedBuyers:Num;estimatedRevenue:Num;estimatedProfit:Num;invalid:boolean};
export function opportunityPool(raw:Values,type:OpportunityType,lossMethod:"number"|"percentage"):PoolValues{
 const total=read(raw.total),ticket=read(raw.ticket),profit=read(raw.profit),rate=type==="Confirmed lost buyers"?100:read(raw.rate);
 const lost=lossMethod==="number"?read(raw.lost):mul(total,read(raw.leakage),.01);
 const leakage=lossMethod==="percentage"?read(raw.leakage):mul(div(lost,total),100);
 const invalid=[total,lost,leakage,rate,ticket].some(x=>x!==undefined&&x<0)||(lost!==undefined&&total!==undefined&&lost>total)||(leakage!==undefined&&leakage>100)||(rate!==undefined&&rate>100);
 const validLost=invalid?undefined:lost,buyersLost=mul(validLost,rate,.01);
 const estimatedBuyers=invalid?undefined:mul(sub(total,lost),rate,.01),confirmedBuyers=read(raw.confirmedBuyers);
 const currentBuyers=confirmedBuyers??estimatedBuyers;
 return {type,total,lost:validLost,remaining:invalid?undefined:sub(total,lost),leakage:invalid?undefined:leakage,rate:invalid?undefined:rate,ticket,profit,buyersLost,revenueLost:mul(buyersLost,ticket),profitLost:mul(buyersLost,profit),unnecessary:read(raw.unnecessary),unpaid:read(raw.unpaid),late:read(raw.late),confirmedBuyers,confirmedRevenue:read(raw.confirmedRevenue),confirmedProfit:read(raw.confirmedProfit),estimatedBuyers,estimatedRevenue:mul(currentBuyers,ticket),estimatedProfit:mul(currentBuyers,profit),invalid};
}
