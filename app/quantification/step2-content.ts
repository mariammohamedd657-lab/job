import type {Config} from "./config";
import {problems} from "../discovery/data";
import {operationalPanels,operationalMethods} from "./operational-data";

// Step 2 presentation metadata only. Existing solver IDs are reused explicitly.
// New provisional IDs are problem-local and never matched by label.
export type ContentField={key:string;label:string;unit:string;shared?:"problem"|"operational"|"financial";signed?:boolean;percentage?:boolean;estimated?:boolean};
export type ContentRoute={id:string;title:string;fields:ContentField[];reference:string;condition?:string;children?:ContentRoute[]};
export type ContentOutcome={id:string;name:string;kind:"Confirmed"|"Estimated";primary:ContentField;fields:ContentField[];routes:ContentRoute[];reference:string;condition:string;applicability:"primary"|"conditional"};
const f=(key:string,label:string,unit="$",options:Partial<ContentField>={}):ContentField=>({key:"fin:"+key,label,unit,...options});
const pct=(key:string,label:string)=>f(key,label,"%",{percentage:true});
const signed=(key:string,label:string,unit="$")=>f(key,label,unit,{signed:true});
const shared=(field:ContentField,scope:ContentField["shared"]="financial"):ContentField=>({...field,shared:scope});
const route=(id:string,title:string,fields:ContentField[],reference:string,condition?:string,children?:ContentRoute[]):ContentRoute=>({id,title,fields,reference,condition,children});
const alt=(id:string,fields:ContentField[],reference:string,condition?:string)=>route(id,"Alternative calculation methods",fields,reference,condition);
const mapping:Record<number,[number[],number[]]>={};
for(let n=1;n<=28;n++)mapping[n]=[[7,8],[1,2,3,4,9]];
for(const n of [14,15,16])mapping[n]=[[4,7,8],[1,2,3,9]];
Object.assign(mapping,{17:[[4],[1,2,3,7,8,9]],19:[[4],[3,9]],20:[[3,4,9],[1,2,7,8]],22:[[5,6,10],[3,4,9]],23:[[5,6,10],[3,4,9]],25:[[],[1,2,3,4,7,8,9]],27:[[],[1,2,3,4,7,8,9]],28:[[3,9],[1,2,4,7,8]]});
export const financialApplicability=mapping;
export const scopeRestrictions=[
 "Do not aggregate revenue loss and contribution profit loss for the same purchases.",
 "Confirmed and estimated losses must represent non-overlapping opportunities before aggregation.",
 "Higher costs and wasted costs may overlap; do not count the same expenditure twice.",
 "Delayed cash collection is not permanently lost money.",
 "Alternative methods may measure the same outcome; do not add them together.",
 "Different problems may affect overlapping populations. Reuse quantities only where definitions and measurement periods match."
];
export function financialContent(config:Config):ContentOutcome[]{
 const n=Number(config.id.split("-")[1]);
 const p=problems.find(p=>p.id===config.id)!;
 const op=operationalPanels(config,p.operationalImpacts.map(i=>i.id));
 const source=(method:string):ContentField|undefined=>{
  const panel=op.find(x=>operationalMethods[config.id][x.id.replace("negative-operational-","")]===method);
  const field=panel?.fields.find(x=>x.primary);
  return field?{...field,shared:"operational"}:undefined;
 };
 const base=(key:string,label?:string):ContentField=>{const field=Object.values(config.fields).flat().find(x=>x.key===key)!;return {...field,label:label??field.label,shared:"problem"};};
 const outcomes:Record<number,ContentOutcome>={};
 function add(i:number,primary:ContentField,fields:ContentField[],reference:string,routes:ContentRoute[],condition:string){
  outcomes[i]={id:"F"+i,name:primary.label,kind:i<=6?"Confirmed":"Estimated",primary,fields:[...fields,primary],routes,reference,condition,applicability:mapping[n][0].includes(i)?"primary":"conditional"};
 }
 const purchases=f("confirmed-purchases","Confirmed purchases lost","Purchases"),avgPurchase=f("average-revenue-purchase","Average revenue per purchase","$/Purchase"),purchaseRevenue=f("purchase-revenue","Confirmed purchase revenue"),retained=f("retained-revenue","Retained purchase revenue"),rev=f("confirmed-revenue","Confirmed revenue loss"),avoided=f("avoided-variable","Avoided variable costs"),profit=signed("confirmed-profit","Confirmed contribution profit loss");
 const purchaseAverage=route("purchase-average","Average revenue per purchase",[f("purchase-total-revenue","Total revenue"),f("total-purchases","Total purchases","Purchases")],"Average revenue per purchase = Total revenue ÷ Total purchases.","The average must apply to the lost purchases.");
 add(1,rev,[purchases,avgPurchase,purchaseRevenue,retained],"Confirmed revenue loss = Confirmed purchases lost × Average revenue per purchase.",[alt("purchase-values",[],"Confirmed revenue loss = Confirmed purchase revenue before the loss − Retained purchase revenue. Direct entry of established revenue is also supported.","Use the same established purchase population and period."),purchaseAverage],"A confirmed lost purchase requires separate evidence. If an average is used, the monetary amount is estimated even when the purchase loss is confirmed.");
 add(2,profit,[shared(rev),avoided],"Confirmed contribution profit loss = Confirmed revenue loss − Avoided variable costs.",[
 route("margin","Contribution profit margin",[signed("confirmed-margin","Contribution profit margin","%")],"Confirmed contribution profit loss = Confirmed revenue loss × Contribution profit margin ÷ 100.","Use the margin applicable to the lost purchases."),
 route("profit-purchase","Contribution profit per purchase",[shared(purchases),signed("average-profit-purchase","Average contribution profit per purchase","$/Purchase")],"Confirmed contribution profit loss = Confirmed purchases lost × Average contribution profit per purchase."),
 route("avoided-purchase","Avoided variable costs",[shared(purchases),f("average-avoided-purchase","Average avoided variable cost per purchase","$/Purchase")],"Avoided variable costs = Confirmed purchases lost × Average avoided variable cost per purchase.")],"Use only confirmed purchase losses; profit and margin can be negative.");
 const avgPaid=f("average-paid-lead","Average cost per paid lead","$/Lead"),avgAdditionalHour=f("average-additional-hour","Average cost per additional staff hour","$/hr"),avgResource=f("average-additional-resource","Average cost per additional resource","$/Unit"),avgCollection=f("average-collection-hour","Average cost per collection staff hour","$/hr");
 for(const estimated of [false,true]){
  const prefix=estimated?"estimated-higher:":"higher:";
  const label=(s:string)=>estimated?"Estimated "+s[0].toLowerCase()+s.slice(1):s;
  const q=(id:string,name:string,unit="$")=>f(prefix+id,label(name),unit,{estimated});
  const marketing=q("marketing","Higher marketing costs"),staff=q("staff","Higher staffing costs"),collection=q("collection","Higher collection costs"),financing=q("financing","Higher financing costs"),other=q("other","Higher other operating costs");
  const paid=q("paid-leads","Additional paid leads","Leads"),hours=q("paid-hours","Additional paid staff hours","hrs"),employees=q("employees","Additional employees","Employees");
  const staffCosts=q("collection-staff","Additional collection staff costs"),collectionFees=q("collection-fees","Additional collection fees"),interest=q("interest","Additional interest"),fees=q("financing-fees","Additional financing fees");
  const difference=(id:string,title:string)=>alt(id,[q("actual-"+id,"Actual "+title),q("comparable-"+id,"Comparable "+title)],"Use the positive attributable difference between actual and comparable costs.");
  const categories=[
   route("marketing",marketing.label,[paid,shared(avgPaid),marketing],marketing.label+" = "+paid.label+" × Average cost per paid lead.",undefined,[difference("marketing","marketing costs")]),
   route("staff",staff.label,[hours,shared(avgAdditionalHour),staff],staff.label+" = "+hours.label+" × Average cost per additional staff hour.","Additional paid time must be established; avoidable time or staff shortfall is not automatically paid time.",[
    route("employees","Additional employees",[employees,f(prefix+"employee-cost","Cost per additional employee","$/Employee")],staff.label+" = Additional employees × Cost per additional employee."),difference("staff","staffing costs")]),
   route("collection",collection.label,[staffCosts,collectionFees,collection],collection.label+" = Additional collection staff costs + Additional collection fees.","Exclude staffing costs already counted.",[route("hours","Collection staff costs",[q("collection-hours","Additional collection staff hours","hrs"),shared(avgCollection)],"Additional collection staff costs = Additional collection staff hours × Average cost per collection staff hour.")]),
   route("financing",financing.label,[interest,fees,financing],financing.label+" = Additional interest + Additional financing fees.",undefined,[route("interest","Additional interest",[q("borrowed","Additional borrowed amount"),f(prefix+"interest-rate","Annual interest rate","%"),f(prefix+"borrowing-period","Borrowing period in days","Days")],"Additional interest = Additional borrowed amount × Annual interest rate ÷ 100 × Borrowing period ÷ 365.","Only for simple interest on a 365-day convention.")]),
   route("other",other.label,[q("resources","Additional resources used","Units"),shared(avgResource),other],other.label+" = Additional resources used × Average cost per additional resource.",undefined,[difference("other","other operating costs")])
  ];
  add(estimated?9:3,q("result","Higher costs"),[f(prefix+"actual",estimated?"Estimated costs with the problem":"Actual costs"),f(prefix+"comparable",estimated?"Estimated comparable costs without the problem":"Comparable costs without the problem")],"Positive attributable difference between costs with and without the problem.",[route("breakdown","Cost breakdown",[marketing,staff,collection,financing,other],"Sum the applicable non-overlapping cost categories.","Do not add alternative calculations of the same cost.",categories)],estimated?"Estimated additional expenditure; not necessarily incurred.":"Actual additional expenditure attributable to the problem.");
 }
 const wasted=f("wasted","Wasted costs"),wm=f("wasted-marketing","Wasted marketing costs"),ws=f("wasted-staff","Wasted staffing costs"),wo=f("wasted-other","Wasted other operating costs"),paidLost=f("paid-lost","Paid lost leads","Leads"),wastedHours=f("wasted-hours","Wasted paid staff hours","hrs"),avgStaff=f("average-staff-hour","Average staffing cost per hour","$/hr");
 const lost=source("calls")??source("leads")??source("direct-leads")??source("qualified");
 const slots=source("slots")??(n===16?base("affected","Unused appointment slots"):undefined);
 const time=source("time");
 const marketingRoutes=[...(lost?[route("paid-lost","Paid lost leads",[lost,pct("paid-share","Percentage of lost leads acquired through paid marketing")],"Paid lost leads = Lost leads × Percentage of lost leads acquired through paid marketing ÷ 100.","Use the matching paid lost lead population.")]:[]),route("paid-average","Average cost per paid lead",[f("marketing-spend","Marketing spend for paid leads"),f("paid-acquired","Paid leads acquired","Leads")],"Average cost per paid lead = Marketing spend for paid leads ÷ Paid leads acquired.")];
 const staffRoutes=[...(time?[route("avoidable","Avoidable paid time",[time,pct("avoidable-paid-share","Percentage of avoidable time that was paid and wasted")],"Wasted paid staff hours = Avoidable time × Percentage of avoidable time that was paid and wasted ÷ 100.")]:[]),...(slots?[route("slots","Unused appointment slots",[slots,f("wasted-hours-slot","Wasted paid staff hours per unused slot","hrs/Slot")],"Wasted paid staff hours = Unused appointment slots × Wasted paid staff hours per unused slot.","Only if unused slots caused wasted paid time.")]:[]),route("staff-average","Average staffing cost per hour",[f("relevant-staff-costs","Relevant staffing costs"),f("corresponding-hours","Corresponding paid staff hours","hrs")],"Average staffing cost per hour = Relevant staffing costs ÷ Corresponding paid staff hours.")];
 add(4,wasted,[],"Wasted costs = Wasted marketing costs + Wasted staffing costs + Wasted other operating costs.",[route("breakdown","Cost breakdown",[wm,ws,wo],"Sum non-overlapping wasted costs.",undefined,[
 route("marketing","Wasted marketing costs",[paidLost,shared(avgPaid),wm],"Wasted marketing costs = Paid lost leads × Average cost per paid lead.",undefined,marketingRoutes),
 route("staff","Wasted staffing costs",[wastedHours,avgStaff,ws],"Wasted staffing costs = Wasted paid staff hours × Average staffing cost per hour.",undefined,staffRoutes),
 route("other","Wasted other operating costs",[f("wasted-resources","Wasted resources","Units"),f("average-wasted-resource","Average cost per wasted resource","$/Unit"),wo],"Wasted other operating costs = Wasted resources × Average cost per wasted resource.")
 ])],"Wasted costs are not automatically additional costs.");
 const due=f("payments-due","Payments due"),timely=f("timely-payments","Payments received on time"),delayed=f("delayed","Delayed cash collection");
 add(5,delayed,[due,timely],"Delayed cash collection = Payments due − Payments received on time.",[alt("invoice-timing",[f("late-invoices","Invoices not paid on time","Invoices"),f("average-late-invoice","Average amount not paid on time per invoice","$/Invoice")],"Delayed cash collection = Invoices not paid on time × Average amount not paid on time per invoice.")],"Use the same payment population; delayed cash is not permanent loss.");
 const original=f("original-unpaid","Original unpaid amount"),recovered=f("recovered-unpaid","Recovered unpaid amount"),pending=f("pending-unpaid","Pending unpaid amount"),unpaid=f("unpaid-loss","Money lost from unpaid invoices");
 add(6,unpaid,[original,recovered,pending],"Money lost from unpaid invoices = Original unpaid amount − Recovered unpaid amount − Pending unpaid amount.",[alt("invoice-loss",[f("unrecoverable-invoices","Confirmed unrecoverable invoices","Invoices"),f("average-unrecoverable","Average unrecoverable amount per invoice","$/Invoice")],"Money lost from unpaid invoices = Confirmed unrecoverable invoices × Average unrecoverable amount per invoice. Directly established unrecoverable amount is also supported.")],"Fully classify the original balance. Unexplained or pending amounts are not confirmed unrecoverable.");
 const buyers=f("potential-buyers","Lost potential buyers","Buyers",{estimated:true}),avgBuyer=f("average-revenue-buyer","Average revenue per buyer","$/Buyer"),potential=f("potential-revenue","Lost potential revenue","$",{estimated:true});
 const conversions:ContentRoute[]=[];
 for(const [method,id,rateName] of [["calls","leads","Lead-to-buyer conversion rate"],["leads","leads","Lead-to-buyer conversion rate"],["direct-leads","leads","Lead-to-buyer conversion rate"],["qualified","qualified","Qualified lead-to-buyer conversion rate"],["reactivation","reactivation","Reactivation-to-buyer conversion rate"],["booking","booking","Booking-to-buyer conversion rate"],["attendance","attendance","Attendance-to-buyer conversion rate"],["unserved","unserved","Attributable purchase loss rate"]]){
  const src=source(method);if(src)conversions.push(route(id,src.label,[src,pct("conversion:"+id,rateName)],"Lost potential buyers = "+src.label+" × "+rateName+" ÷ 100.","The starting population and rate must match; alternatives are not additive."));
 }
 if(slots)conversions.push(route("slots","Unused appointment slots",[slots,f("buyers-per-slot","Potential buyers per unused slot","Buyers/Slot")],"Lost potential buyers = Unused appointment slots × Potential buyers per unused slot."));
 const newBuyers=source("new-buyers");if(newBuyers)conversions.push(route("new-buyers","Potential new buyers lost",[newBuyers],"Reuse only if the financial population consists exclusively of those same new buyers.","Do not automatically equate the populations."));
 const existing=source("existing-buyers");if(existing)conversions.push(route("existing","Lost existing buyers",[existing,f("future-revenue-existing","Expected future revenue per lost existing buyer","$/Buyer"),f("future-period","Relevant future measurement period","months")],"Use expected future lost revenue over the defined period.","Do not assume unrestricted lifetime revenue or new-buyer value."));
 const buyerRoutes=[...(conversions.length?[route("conversions","Alternative calculation methods",[],"Alternative conversions estimate the same outcome where applicable.","Do not add overlapping opportunities.",conversions)]:[]),route("average-buyer","Average revenue per buyer",[f("buyer-scope-revenue","Total revenue"),f("total-buyers","Total buyers","Buyers")],"Average revenue per buyer = Total revenue ÷ Total buyers.","Buyer and purchase averages are separate.")];
 add(7,potential,[buyers,avgBuyer],"Lost potential revenue = Lost potential buyers × Average revenue per buyer.",buyerRoutes,"Use attributable potential purchase opportunities, not confirmed losses.");
 const estimatedAvoided=f("estimated-avoided","Estimated avoided variable costs"),potentialProfit=signed("potential-profit","Lost potential contribution profit");
 add(8,potentialProfit,[shared(potential),estimatedAvoided],"Lost potential contribution profit = Lost potential revenue − Estimated avoided variable costs.",[
 route("margin","Contribution profit margin",[signed("potential-margin","Applicable contribution profit margin","%")],"Lost potential contribution profit = Lost potential revenue × Applicable contribution profit margin ÷ 100."),
 route("profit-buyer","Contribution profit per buyer",[shared(buyers),signed("average-profit-buyer","Average contribution profit per buyer","$/Buyer")],"Lost potential contribution profit = Lost potential buyers × Average contribution profit per buyer."),
 route("avoided-buyer","Estimated avoided variable costs",[shared(buyers),f("average-avoided-buyer","Average avoided variable cost per buyer","$/Buyer")],"Estimated avoided variable costs = Lost potential buyers × Average avoided variable cost per buyer."),
 route("revenue","Lost potential revenue",[shared(buyers),shared(avgBuyer)],"Supporting quantities for the shared lost potential revenue.",undefined,buyerRoutes)
 ],"Use the relevant estimated costs and margins; contribution profit can be negative.");
 const expected=f("estimated-invoice-loss","Estimated money lost from unpaid invoices","$",{estimated:true});
 add(10,expected,[shared(pending),pct("expected-unrecoverable","Expected unrecoverable percentage")],"Estimated money lost from unpaid invoices = Pending unpaid amount × Expected unrecoverable percentage ÷ 100.",[
 route("invoice-rate","Expected invoice loss rate",[f("pending-invoices","Pending invoices","Invoices"),pct("expected-invoice-rate","Expected invoice loss rate"),f("average-expected-unrecoverable","Average expected unrecoverable amount per lost invoice","$/Invoice")],"Estimated money lost = Pending invoices × Expected invoice loss rate ÷ 100 × Average expected unrecoverable amount per lost invoice."),
 route("recoverable","Expected recoverable amount",[f("expected-recoverable","Expected recoverable amount")],"Estimated money lost = Pending unpaid amount − Expected recoverable amount.")
 ],"Exclude confirmed unrecoverable balances from pending unpaid amounts.");
 return [...mapping[n][0],...mapping[n][1]].sort((a,b)=>a-b).map(i=>outcomes[i]);
}

// Supplemental operational routes are presentation-only; no additional equations
// enter the working solver until the canonical identities and engine are approved.
export function operationalAlternatives(config:Config,impactId:string):ContentRoute[]{
 const method=operationalMethods[config.id]?.[impactId.replace("negative-operational-","")];
 const p=(suffix:string,label:string,unit:string,percentage=false):ContentField=>({key:"step2:"+impactId+":"+suffix,label,unit,percentage});
 const n=Number(config.id.split("-")[1]);
 switch(method){
 case "slots":return [alt("slots",[p("available","Available affected slots","Slots"),p("filled","Filled affected slots","Slots")],"Unused appointment slots = Available affected slots − Filled affected slots.","Use matching populations and periods.")];
 case "unserved":return [alt("buyers",[p("affected","Affected buyers","Buyers"),p("served","Buyers subsequently served","Buyers")],"Unserved buyers = Affected buyers − Buyers subsequently served.","Only when every remaining affected buyer is classified as unserved.")];
 case "existing-buyers":return [alt("rate",[p("affected","Affected existing buyers","Buyers"),p("rate","Attributable existing buyer loss rate","%",true)],"Lost existing buyers = Affected existing buyers × Attributable existing buyer loss rate ÷ 100.","Distinguish confirmed losses from estimates.")];
 case "tasks":return [alt("tasks",[n===28?{key:"affected",label:"Affected tasks",unit:"Units",shared:"problem"}:p("affected","Affected tasks","Tasks"),p("completed","Completed affected tasks","Tasks")],"Incomplete tasks = Affected tasks − Completed affected tasks.","The populations and classification must match.")];
 case "new-buyers":return [alt("reviews",[p("exposed","Potential buyers exposed to the review-related problem","Buyers"),p("rate","Attributable buyer loss rate","%",true)],"Potential new buyers lost = Potential buyers exposed to the review-related problem × Attributable buyer loss rate ÷ 100.","Do not equate reviews and buyers.")];
 default:return [];
 }
}
export const shortfallField:ContentField={key:"step2:staff-shortfall",label:"Staff hour shortfall",unit:"hrs"};
export const shortfallRoute:ContentRoute=route("shortfall","Staff hour shortfall",[{key:"hours",label:"Required staff hours",unit:"hrs",shared:"problem"},{key:"target",label:"Available staff hours",unit:"hrs",shared:"problem"},shortfallField],"Staff hour shortfall = Maximum of zero and Required staff hours − Available staff hours.","A shortfall does not establish additional paid staff hours.");

export function baseSupplementalRoutes(config:Config,section:string):ContentRoute[]{
 if(config.id==="problem-22"&&section==="Money")return [alt("payment-population",[{key:"step2:payments-without-reminders",label:"Payments without reminders",unit:"Payments"}],"Total amount of payments without reminders = Payments without reminders × Average payment amount.","Separate payment population from reminder events; canonical identity and existing monetary route reconciliation are pending Step 3.")];
 return [];
}
