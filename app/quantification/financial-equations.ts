import type {Config} from "./config";
import {financialContent,routeFields,type ContentRoute} from "./step2-content";
import {product,type AdditionalEquations,type Relation,type ZeroInference} from "./solver";
import {fieldReference} from "./quantity-identity";
const close=(a:number,b:number)=>Math.abs(a-b)<=1e-8*Math.max(1,Math.abs(a),Math.abs(b));
export function financialEquations(config:Config,base:AdditionalEquations):AdditionalEquations{
 const outcomes=financialContent(config),has=(id:string)=>outcomes.some(o=>o.id===id),k=(id:string)=>"fin:"+id;
 const content=outcomes.flatMap(o=>[...o.fields,...routeFields(o.routes)]);
 const fields=[...new Map([...base.fields,...content].map(f=>[f.key,f])).values()].filter(f=>!Object.values(config.fields).flat().some(b=>b.key===f.key));
 const keys=new Set([...fields.map(f=>f.key),...Object.values(config.fields).flat().map(f=>f.key)]);
 const relations:Relation[]=[],signedKeys:string[]=[],actualIntegerKeys:string[]=[],estimatedKeys:string[]=[],unboundedRateKeys:string[]=[],positiveParts:{difference:string;result:string}[]=[],zeroProducts:{output:string;factors:string[]}[]=[];
 const register=(key:string,label:string,unit:string)=>{if(!keys.has(key)){fields.push({key,label,unit});keys.add(key);}};
 const add=(relation:Relation)=>{if(relation.keys.every(key=>keys.has(key)))relations.push(relation);};
 const sum=(a:string,parts:string[],label:string)=>add({keys:[a,...parts],label,terms:[{coefficient:1,keys:[a]},...parts.map(key=>({coefficient:-1,keys:[key]}))],derive:(v,key)=>key===a?parts.reduce((n,p)=>n+v[p],0):v[a]-parts.filter(p=>p!==key).reduce((n,p)=>n+v[p],0),valid:v=>close(v[a],parts.reduce((n,p)=>n+v[p],0)),operation:(v,key)=>key===a?parts.map(p=>v[p]).join(" + "):[v[a],...parts.filter(p=>p!==key).map(p=>v[p])].join(" − ")});
 const prod=(a:string,b:string,c:string,f:number,label:string)=>{if([a,b,c].every(key=>keys.has(key))){add(product(a,b,c,f,label));zeroProducts.push({output:a,factors:[b,c]});}};
 const multi=(a:string,parts:string[],factor:number,label:string)=>{if(![a,...parts].every(key=>keys.has(key)))return;add({keys:[a,...parts],label,terms:[{coefficient:1,keys:[a]},{coefficient:-factor,keys:parts}],derive:(v,key)=>{if(key===a)return parts.reduce((n,p)=>n*v[p],factor);const d=parts.filter(p=>p!==key).reduce((n,p)=>n*v[p],factor);return d===0?undefined:v[a]/d;},valid:v=>close(v[a],parts.reduce((n,p)=>n*v[p],factor)),operation:(v,key)=>key===a?parts.map(p=>v[p]).join(" × ")+" × "+factor:v[a]+" ÷ ("+parts.filter(p=>p!==key).map(p=>v[p]).join(" × ")+" × "+factor+")"});zeroProducts.push({output:a,factors:parts});};
 const positive=(result:string,actual:string,comparable:string,difference:string)=>{
  if(![result,actual,comparable].every(key=>keys.has(key)))return;
  register(difference,"Signed cost difference","$");signedKeys.push(difference);
  sum(actual,[comparable,difference],"Actual costs = comparable costs + signed difference");
  positiveParts.push({difference,result});
  add({keys:[result,difference],label:"Higher costs = max(0, signed cost difference)",derive:(v,key)=>key===result?Math.max(0,v[difference]):v[result]>0?v[result]:undefined,valid:v=>close(v[result],Math.max(0,v[difference]))});
 };
 for(const field of content){
  const ref=fieldReference(config.id,field);
  if(field.signed||ref.type==="SIGNED_MONEY"||ref.type==="SIGNED_AVG"||ref.type==="MARGIN")signedKeys.push(field.key);
  if(ref.type==="COUNT"&&field.key.startsWith("fin:"))actualIntegerKeys.push(field.key);
  if(field.estimated||ref.type==="EST_COUNT")estimatedKeys.push(field.key);
  if(field.key.endsWith(":interest-rate"))unboundedRateKeys.push(field.key);
 }
 // F1 / F2: a single shared purchase count, applicable average and revenue.
 const R=k("confirmed-revenue"),P=k("confirmed-purchases"),A=k("average-revenue-purchase"),B=k("purchase-revenue"),V=k("retained-revenue"),T=k("purchase-total-revenue"),N=k("total-purchases"),L=k("confirmed-profit"),C=k("avoided-variable"),M=k("confirmed-margin"),G=k("average-profit-purchase"),J=k("average-avoided-purchase"),W=k("purchase-variable-costs"),H=k("purchase-total-profit");
 if(has("F1")){prod(R,P,A,1,"Confirmed revenue loss = purchases lost × average revenue");sum(B,[R,V],"Revenue before loss = lost revenue + retained revenue");prod(T,N,A,1,"Relevant revenue = relevant purchases × average revenue");}
 if(has("F2")){sum(R,[L,C],"Confirmed revenue loss = contribution profit loss + avoided costs");prod(L,R,M,.01,"Contribution profit loss = revenue loss × applicable margin ÷ 100");prod(L,P,G,1,"Contribution profit loss = lost purchases × average contribution profit");prod(C,P,J,1,"Avoided costs = lost purchases × average avoided costs");sum(T,[H,W],"Total revenue = contribution profit + variable costs");prod(H,T,M,.01,"Relevant contribution margin");prod(H,N,G,1,"Relevant contribution profit per purchase");sum(A,[G,J],"Applicable average revenue = applicable contribution profit + avoided variable cost");}
 // F3 and F9: independent comparable-cost alternatives and complete breakdown.
 for(const estimated of [false,true]){
  if(!has(estimated?"F9":"F3"))continue;
  const h=(id:string)=>k((estimated?"estimated-higher:":"higher:")+id);
  positive(h("result"),h("actual"),h("comparable"),h("difference"));
  for(const cat of ["marketing","staff","other"])positive(h(cat),h("actual-"+cat),h("comparable-"+cat),"__"+h(cat)+"-difference");
  prod(h("marketing"),h("paid-leads"),k("average-paid-lead"),1,"Additional marketing costs = additional paid leads × applicable acquisition cost");
  prod(h("staff"),h("paid-hours"),k("average-additional-hour"),1,"Additional staffing costs = paid hours × incremental cost");
  prod(h("staff"),h("employees"),h("employee-cost"),1,"Additional staffing costs = employees × incremental employee cost");
  prod(h("collection-staff"),h("collection-hours"),k("average-collection-hour"),1,"Additional collection staff costs = paid collection hours × hourly cost");
  sum(h("collection"),[h("collection-staff"),h("collection-fees")],"Collection costs = staff costs + fees");
  sum(h("financing"),[h("interest"),h("financing-fees")],"Financing costs = interest + fees");
  multi(h("interest"),[h("borrowed"),h("interest-rate"),h("borrowing-period")],1/36500,"Simple interest on the stated 365-day convention");
  prod(h("other"),h("resources"),k("average-additional-resource"),1,"Additional other costs = resource quantity × unit cost");
  sum(h("result"),["marketing","staff","collection","financing","other"].map(h),"Complete nonoverlapping additional cost breakdown");
 }
 // F4: existing operational sources are explicit keys in route metadata.
 const walk=(routes:ContentRoute[],visit:(route:ContentRoute)=>void)=>{for(const route of routes){visit(route);walk(route.children??[],visit);}};
 if(has("F4")){
  prod(k("wasted-marketing"),k("paid-lost"),k("average-paid-lead"),1,"Wasted marketing = paid lost leads × acquisition cost");
  prod(k("marketing-spend"),k("paid-acquired"),k("average-paid-lead"),1,"Marketing spend = paid acquired leads × average acquisition cost");
  prod(k("wasted-staff"),k("wasted-hours"),k("average-staff-hour"),1,"Wasted staffing = wasted paid hours × staffing cost");
  prod(k("relevant-staff-costs"),k("corresponding-hours"),k("average-staff-hour"),1,"Relevant staffing costs = paid staff hours × cost per hour");
  prod(k("wasted-other"),k("wasted-resources"),k("average-wasted-resource"),1,"Wasted other costs = wasted resources × unit cost");
  walk(outcomes.find(o=>o.id==="F4")!.routes,route=>{const src=route.fields.find(f=>f.shared==="operational"||f.shared==="problem");if(!src)return;if(route.id==="paid-lost")prod(k("paid-lost"),src.key,k("paid-share"),.01,"Paid lost leads = lost leads × paid share");if(route.id==="avoidable")prod(k("wasted-hours"),src.key,k("avoidable-paid-share"),.01,"Paid wasted hours = avoidable time × paid wasted share");if(route.id==="slots")prod(k("wasted-hours"),src.key,k("wasted-hours-slot"),1,"Paid wasted hours = unused slots × wasted hours per slot");});
  sum(k("wasted"),["wasted-marketing","wasted-staff","wasted-other"].map(k),"Complete nonoverlapping wasted cost breakdown");
 }
 // F5/F6/F10: payment timing and permanent invoice loss remain separate.
 if(has("F5")){sum(k("payments-due"),[k("delayed"),k("timely-payments")],"Payments due = delayed cash + timely payments");prod(k("delayed"),k("late-invoices"),k("average-late-invoice"),1,"Delayed cash = late invoices × average late amount");}
 if(has("F6")){sum(k("original-unpaid"),[k("recovered-unpaid"),k("pending-unpaid"),k("unpaid-loss")],"Complete original unpaid balance breakdown");prod(k("unpaid-loss"),k("unrecoverable-invoices"),k("average-unrecoverable"),1,"Unpaid loss = unrecoverable invoices × average unrecoverable amount");}
 if(has("F10")){prod(k("estimated-invoice-loss"),k("pending-unpaid"),k("expected-unrecoverable"),.01,"Estimated invoice loss = pending amount × monetary loss rate");multi(k("estimated-invoice-loss"),[k("pending-invoices"),k("expected-invoice-rate"),k("average-expected-unrecoverable")],.01,"Estimated invoice loss = pending invoices × count loss rate × average loss");sum(k("pending-unpaid"),[k("estimated-invoice-loss"),k("expected-recoverable")],"Pending balance = estimated loss + expected recoverable amount");}
 // F7/F8: applicable conversions feed one buyer outcome; never sum routes.
 const buyers=k("potential-buyers"),rev=k("potential-revenue"),avg=k("average-revenue-buyer"),count=k("total-buyers"),revenue=k("buyer-scope-revenue"),profit=k("potential-profit"),cost=k("estimated-avoided"),margin=k("potential-margin"),perProfit=k("average-profit-buyer"),perCost=k("average-avoided-buyer"),totalProfit=k("buyer-total-profit"),variable=k("buyer-variable-costs");
 if(has("F7")){
  prod(rev,buyers,avg,1,"Potential revenue = estimated lost buyers × average revenue per buyer");prod(revenue,count,avg,1,"Relevant revenue = relevant buyers × average revenue");
  walk(outcomes.find(o=>o.id==="F7")!.routes,route=>{
   const src=route.fields.find(f=>f.shared==="operational"||f.shared==="problem"),rate=route.fields.find(f=>f.key.startsWith("fin:conversion:"));
   if(src&&rate){prod(buyers,src.key,rate.key,.01,"Potential buyers = relevant lost opportunities × conversion rate");const h=rate.key.replace("fin:conversion:","fin:historical:");prod(h+":converted",h+":eligible",rate.key,.01,"Applicable conversion rate from eligible reference population");}
   if(src&&route.id==="slots")prod(buyers,src.key,k("buyers-per-slot"),1,"Potential buyers = unused slots × buyers per slot");
   if(src&&route.id==="existing")prod(rev,src.key,k("future-revenue-existing"),1,"Future revenue loss = lost existing buyers × applicable future revenue");
   // A new-buyer context field is not an unconditional identity with all potential buyers.
  });
 }
 if(has("F8")){sum(rev,[profit,cost],"Potential revenue = potential contribution profit + avoided costs");prod(profit,rev,margin,.01,"Potential contribution profit = potential revenue × margin");prod(profit,buyers,perProfit,1,"Potential contribution profit = lost buyers × average profit");prod(cost,buyers,perCost,1,"Estimated avoided costs = lost buyers × average avoided cost");sum(avg,[perProfit,perCost],"Applicable average revenue = average profit + avoided variable cost");sum(revenue,[totalProfit,variable],"Relevant revenue = contribution profit + variable costs");prod(totalProfit,revenue,margin,.01,"Applicable contribution margin");prod(totalProfit,count,perProfit,1,"Applicable contribution profit per buyer");}
 return {...base,fields,relations:[...base.relations,...relations],signedKeys:[...(base.signedKeys??[]),...signedKeys],integerKeys:[...(base.integerKeys??[]),...actualIntegerKeys],actualIntegerKeys,estimatedKeys:[...(base.estimatedKeys??[]),...estimatedKeys],unboundedRateKeys,positiveParts,inferZeros:(values)=>[...(base.inferZeros?.(values)??[]),...zeroProducts.flatMap(({output,factors}):ZeroInference[]=>{const zero=factors.find(key=>values[key]===0);return zero?[{target:output,dependencies:[zero],label:"A known product factor is zero"}]:[];})]};
}
