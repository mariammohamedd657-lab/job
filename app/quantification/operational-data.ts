import { problems } from "../discovery/data";
import type { Config, Field } from "./config";
import { product, format, type AdditionalEquations, type AdditionalConstraint, type Relation } from "./solver";

export type ImpactField=Field&{shared?:boolean;primary?:boolean};
export type OperationalPanel={id:string;name:string;fields:ImpactField[];primaryKey:string;relations:Relation[];constraints?:AdditionalConstraint[];undefinedRates?:{denominator:string;rate:string}[];example?:Record<string,string>;verified:boolean};

const prefix="negative-operational-";
const units:Record<string,string>={
 "lost-leads":"Leads","lost-qualified-leads":"Leads","fewer-old-leads-reactivated":"Leads",
 "fewer-appointments-booked":"Appointments","fewer-appointments-attended":"Appointments","unused-appointment-slots":"Slots",
 "fewer-new-customers":"Buyers","lost-existing-customers":"Buyers","fewer-customers-served":"Buyers",
 "less-staff-time-available-for-other-work":"hrs","fewer-tasks-completed":"Tasks","more-unpaid-invoices":"Invoices",
 "fewer-customer-reviews":"Reviews","missing-business-information":"Units"
};

const close=(a:number,b:number)=>Math.abs(a-b)<=1e-8*Math.max(1,Math.abs(a),Math.abs(b));
function breakdown(total:string,recovered:string,pending:string,lost:string):Relation{
 const parts=[recovered,pending,lost];
 return {keys:[total,...parts],label:"Affected leads = recovered leads + pending leads + lost leads",
  derive:(v,key)=>key===total?parts.reduce((sum,p)=>sum+v[p],0):v[total]-parts.filter(p=>p!==key).reduce((sum,p)=>sum+v[p],0),
  operation:(v,key)=>key===total?parts.map(p=>format(v[p])).join(" + "):format(v[total])+" − "+parts.filter(p=>p!==key).map(p=>format(v[p])).join(" − "),
  valid:v=>close(v[total],parts.reduce((sum,p)=>sum+v[p],0))};
}
// Eliminate lost leads from the two approved equations, so the system also
// solves when the remaining three values (rather than the lost count) are given.
function combined(total:string,recovered:string,pending:string,rate:string):Relation{
 return {keys:[total,recovered,pending,rate],label:"Recovered leads + pending leads = affected leads × (1 − loss rate ÷ 100)",
  derive:(v,k)=>{
   if(k===total){const d=1-v[rate]/100;return d===0?undefined:(v[recovered]+v[pending])/d;}
   if(k===rate)return v[total]===0?undefined:(1-(v[recovered]+v[pending])/v[total])*100;
   return v[total]*(1-v[rate]/100)-v[k===recovered?pending:recovered];
  },
  impossible:(v,k)=>k===total&&v[rate]===100&&v[recovered]+v[pending]!==0||k===rate&&v[total]===0&&v[recovered]+v[pending]!==0,
  operation:(v,k)=>k===total?"("+format(v[recovered])+" + "+format(v[pending])+") ÷ (1 − "+format(v[rate])+" ÷ 100)":k===rate?"(1 − ("+format(v[recovered])+" + "+format(v[pending])+") ÷ "+format(v[total])+") × 100":format(v[total])+" × (1 − "+format(v[rate])+" ÷ 100) − "+format(v[k===recovered?pending:recovered]),
  valid:v=>close(v[recovered]+v[pending],v[total]*(1-v[rate]/100))};
}

export function operationalPanels(config:Config,selectedIds:readonly string[]):OperationalPanel[]{
 const problem=problems.find(p=>p.id===config.id)!;
 return problem.operationalImpacts.filter(impact=>selectedIds.includes(impact.id)).map(impact=>{
  const key=impact.id.slice(prefix.length);
  const primaryKey="op:"+key+":result";
  const primary:ImpactField={key:primaryKey,label:impact.label,unit:units[key]??"Units",primary:true};
  // Only recovered/confirmed configurations have supporting fields or equations.
  // Do not treat calls, requests, appointments or records as unique leads/buyers.
  if(key==="lost-leads"&&(config.id==="problem-6"||config.id==="problem-1")){
   const shared=config.id==="problem-6";
   const affected:ImpactField=shared?{...config.fields.Quantity.find(f=>f.key==="affected")!,shared:true}:{key:"op:lost-leads:unique-leads",label:"Unique leads among missed callers",unit:"Leads"};
   const recovered={key:"op:lost-leads:recovered",label:"Recovered leads",unit:"Leads"};
   const pending={key:"op:lost-leads:pending",label:"Pending leads",unit:"Leads"};
   const rate={key:"op:lost-leads:loss-rate",label:"Loss rate",unit:"%"};
   const fields=[affected,recovered,pending,...(shared?[rate]:[]),primary];
   const relations=[breakdown(affected.key,recovered.key,pending.key,primaryKey)];
   if(shared)relations.push(product(primaryKey,affected.key,rate.key,.01,"Lost leads = affected leads × loss rate ÷ 100"),combined(affected.key,recovered.key,pending.key,rate.key));
   const components=[recovered.key,pending.key,primaryKey];
   const constraints=[{keys:[affected.key,...components],message:"Contradictory entries: the lead breakdown exceeds the affected lead count.",violated:(v:Record<string,number>)=>Number.isFinite(v[affected.key])&&components.reduce((n,k)=>n+(v[k]??0),0)>v[affected.key]&&!close(components.reduce((n,k)=>n+(v[k]??0),0),v[affected.key])}];
   return {id:impact.id,name:impact.label,fields,primaryKey,relations,constraints,undefinedRates:shared?[{denominator:affected.key,rate:rate.key}]:[],verified:true,...(shared?{example:{affected:"26",[recovered.key]:"8",[pending.key]:"9"}}:{})};
  }
  // Primary result is an approved impact name; supporting quantities are pending
  // the original problem-specific schema. No estimated loss or formula is inferred.
  return {id:impact.id,name:impact.label,fields:[primary],primaryKey,relations:[],verified:false};
 });
}
export function operationalEquations(panels:OperationalPanel[]):AdditionalEquations{
 return {fields:panels.flatMap(panel=>panel.fields.filter(field=>!field.shared)),relations:panels.flatMap(panel=>panel.relations),constraints:panels.flatMap(panel=>panel.constraints??[]),undefinedRates:panels.flatMap(panel=>panel.undefinedRates??[])};
}
