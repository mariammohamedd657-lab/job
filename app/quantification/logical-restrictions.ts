import type {Config} from "./config";
import {operationalPanels,operationalMethods} from "./operational-data";
import {operationalAlternatives,baseSupplementalRoutes,financialContent,routeFields,shortfallField,type ContentField,type ContentRoute} from "./step2-content";
import type {AdditionalEquations} from "./solver";
import type {PopulationLink} from "./information-links";
import {fieldReference} from "./quantity-identity";
export function logicalRestrictions(config:Config,base:AdditionalEquations,activeIds:readonly string[]):AdditionalEquations{
 const panels=operationalPanels(config,activeIds),outcomes=financialContent(config);
 const supplemental:ContentField[]=[...panels.flatMap(p=>routeFields(operationalAlternatives(config,p.id))),...Object.keys(config.fields).flatMap(section=>routeFields(baseSupplementalRoutes(config,section))),...(config.id==="problem-28"?[shortfallField]:[])];
 const fields=[...new Map([...base.fields,...supplemental].map(f=>[f.key,f])).values()].filter(f=>!Object.values(config.fields).flat().some(b=>b.key===f.key));
 const keys=new Set([...fields.map(f=>f.key),...Object.values(config.fields).flat().map(f=>f.key)]);
 const links:PopulationLink[]=[...(base.populationLinks??[])],groups=[...(base.sumLimits??[])];
 const subset=(parent:string,child:string,label?:string)=>{if(parent!==child&&keys.has(parent)&&keys.has(child)&&!links.some(l=>l.population===parent&&l.member===child&&l.kind==="subset"))links.push({population:parent,member:child,kind:"subset",label:label??child+" cannot exceed "+parent});};
 const group=(parent:string,members:string[],label:string)=>{if(keys.has(parent)&&members.every(k=>keys.has(k))){groups.push({population:parent,members,label});for(const member of members)subset(parent,member,label);}};
 const k=(suffix:string)=>"fin:"+suffix;
 const n=Number(config.id.split("-")[1]);
 // Every base population: compatible affected and unaffected counts.
 subset("total","affected","Affected quantity cannot exceed total");
 subset("total","unaffected","Unaffected quantity cannot exceed total");
 group("total",["affected","unaffected"],"Affected and unaffected quantities combined cannot exceed total");
 subset("total","recordedUnits","Recorded duration observations cannot exceed total");
 for(const p of panels){
  const method=operationalMethods[config.id][p.id.replace("negative-operational-","")],prefix="op:"+p.id.replace("negative-operational-","")+":",alt="step2:"+p.id+":",L=p.primaryKey;
  switch(method){
   case "calls":subset("affected",prefix+"unique-leads","Unique affected leads cannot exceed missed or unanswered calls (one lead per call)");group(prefix+"unique-leads",[prefix+"recovered",prefix+"pending",L],"Recovered, pending and lost leads cannot exceed unique affected leads");break;
   case "leads":group("affected",[prefix+"recovered",prefix+"pending",L],"Recovered, pending and lost leads cannot exceed affected leads");break;
   case "qualified":subset("affected",prefix+"affected-qualified-leads","Affected qualified leads cannot exceed late qualifications in this lead population");group(prefix+"affected-qualified-leads",[prefix+"recovered",prefix+"pending",L],"Qualified lead breakdown cannot exceed affected qualified leads");break;
   case "booking":group(prefix+"intended-bookings",[prefix+"recovered",prefix+"pending",L],"Booking breakdown cannot exceed intended bookings");break;
   case "reactivation":subset("affected",L,"Lost reactivations cannot exceed affected old leads");subset("step3:historical:reactivation:eligible","step3:historical:reactivation:converted","Historical reactivations cannot exceed eligible old leads");break;
   case "attendance":if(n===13)subset("affected",L,"Lost attendance cannot exceed unconfirmed appointments");else subset(alt+"unique-appointments",L,"Lost attendance cannot exceed distinct affected appointments");break;
   case "slots":group(alt+"available",[alt+"filled",L],"Filled and unused affected slots cannot exceed available affected slots");break;
   case "unserved":group(alt+"affected",[alt+"served",L],"Subsequently served and unserved buyers cannot exceed affected buyers");if(n===4||n===21)subset("affected",alt+"affected","Distinct affected buyers cannot exceed unhandled calls or requests (one buyer per event)");break;
   case "existing-buyers":subset(alt+"affected",L,"Lost existing buyers cannot exceed affected existing buyers");if(n===4||n===21)subset("affected",alt+"affected","Distinct affected existing buyers cannot exceed unhandled calls or requests (one buyer per event)");break;
   case "new-buyers":subset(alt+"exposed",L,"Lost potential new buyers cannot exceed exposed potential buyers");break;
   case "time":group("hours",[prefix+"necessary-time",L],"Necessary and avoidable time cannot exceed affected staff time");break;
   case "tasks":group(n===28?"affected":alt+"affected",[alt+"completed",L],"Completed and incomplete affected tasks cannot exceed affected tasks");break;
   case "invoices":subset(n===23?"affected":prefix+"affected-invoices",L,"Additional unpaid invoices cannot exceed relevant affected invoices");break;
   case "reviews":subset("affected",L,"Potential lost reviews cannot exceed affected buyers under one review per buyer");subset("step3:historical:reviews:eligible","step3:historical:reviews:converted","Historical additional reviews cannot exceed eligible buyers under one review per buyer");break;
  }
 }
 subset("hours","step2:staff-shortfall","Staff hour shortfall cannot exceed required staff hours");
 // Where actual matching total counts are represented by existing keys.
 subset("total","step2:payments-without-reminders","Distinct payments without reminders cannot exceed payments requiring reminders");
 subset("total","affectedInvoices","Affected invoices cannot exceed corresponding invoices requiring follow-up");
 subset("total","missingRecordings");subset("total","missingOutcomes");subset("missingRecordings","missingBoth");subset("missingOutcomes","missingBoth");
 // Financial products and breakdowns use existing scoped keys. No historical
 // total-revenue ceiling on potential losses; signed profit remains signed.
 group(k("purchase-revenue"),[k("retained-revenue"),k("confirmed-revenue")],"Retained and lost revenue cannot exceed revenue before loss");
 subset(k("confirmed-revenue"),k("confirmed-profit"),"Contribution profit loss cannot exceed revenue loss");
 subset(k("purchase-total-revenue"),k("purchase-total-profit"),"Contribution profit cannot exceed corresponding revenue");
 subset(k("average-revenue-purchase"),k("average-profit-purchase"),"Applicable average contribution profit cannot exceed average revenue");
 subset(k("potential-revenue"),k("potential-profit"),"Potential contribution profit cannot exceed potential revenue loss");
 subset(k("buyer-scope-revenue"),k("buyer-total-profit"),"Contribution profit cannot exceed corresponding revenue");
 subset(k("average-revenue-buyer"),k("average-profit-buyer"),"Applicable average contribution profit cannot exceed average revenue");
 group(k("payments-due"),[k("timely-payments"),k("delayed")],"Timely and delayed payments cannot exceed due payments");
 group(k("original-unpaid"),[k("recovered-unpaid"),k("pending-unpaid"),k("unpaid-loss")],"Recovered, pending and unrecoverable amounts cannot exceed original unpaid amount");
 group(k("pending-unpaid"),[k("estimated-invoice-loss"),k("expected-recoverable")],"Estimated lost and recoverable amounts cannot exceed pending unpaid amount");
 subset(k("paid-acquired"),k("paid-lost"),"Paid lost leads cannot exceed the corresponding acquired paid leads");
 subset(k("marketing-spend"),k("wasted-marketing"),"Wasted marketing cannot exceed corresponding marketing spend");
 subset(k("corresponding-hours"),k("wasted-hours"),"Wasted paid hours cannot exceed corresponding paid hours");
 subset(k("relevant-staff-costs"),k("wasted-staff"),"Wasted staffing costs cannot exceed corresponding staffing costs");
 group(k("wasted"),["wasted-marketing","wasted-staff","wasted-other"].map(k),"Nonoverlapping wasted cost categories cannot exceed total wasted costs");
 for(const prefix of ["higher:","estimated-higher:"]){
  const h=(suffix:string)=>k(prefix+suffix);
  subset(h("actual"),h("result"),"Positive cost increase cannot exceed costs with the problem");
  for(const cat of ["marketing","staff","other"])subset(h("actual-"+cat),h(cat),"Positive category cost increase cannot exceed actual category costs");
  group(h("result"),["marketing","staff","collection","financing","other"].map(h),"Nonoverlapping additional cost categories cannot exceed total additional costs");
  group(h("collection"),[h("collection-staff"),h("collection-fees")],"Collection cost components cannot exceed collection costs");
  group(h("financing"),[h("interest"),h("financing-fees")],"Financing cost components cannot exceed financing costs");
 }
 const walk=(routes:ContentRoute[])=>{for(const route of routes){
  const src=route.fields.find(f=>f.shared==="operational"||f.shared==="problem");
  const rate=route.fields.find(f=>f.key.startsWith("fin:conversion:"));
  if(src&&rate){subset(src.key,k("potential-buyers"),"Potential buyers cannot exceed corresponding lost opportunities under the one-buyer conversion model");const h=rate.key.replace("fin:conversion:","fin:historical:");subset(h+":eligible",h+":converted","Historical converted count cannot exceed eligible count");}
  if(src&&route.id==="paid-lost")subset(src.key,k("paid-lost"),"Paid lost leads cannot exceed relevant lost leads");
  if(src&&route.id==="avoidable")subset(src.key,k("wasted-hours"),"Wasted paid hours cannot exceed avoidable hours");
  walk(route.children??[]);
 }};
 for(const o of outcomes)walk(o.routes);
 const integerKeys=[...(base.integerKeys??[])];
 for(const f of supplemental)if(fieldReference(config.id,f).type==="COUNT")integerKeys.push(f.key);
 return {...base,fields,populationLinks:links,sumLimits:groups,integerKeys:[...new Set(integerKeys)]};
}
