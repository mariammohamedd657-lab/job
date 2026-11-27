import { problems } from "../discovery/data";
import { operationalPopulationLinks, type PopulationLink } from "./information-links";
import type { Config, Field } from "./config";
import {normalizeField} from "./quantity-identity";
import { product, format, type AdditionalEquations, type AdditionalConstraint, type Relation, type ZeroInference } from "./solver";

export type ImpactField=Field&{shared?:boolean;primary?:boolean;integer?:boolean};
export type OperationalPanel={id:string;name:string;fields:ImpactField[];primaryKey:string;relations:Relation[];constraints?:AdditionalConstraint[];undefinedRates?:{denominator:string;rate:string}[];example?:Record<string,string>;verified:boolean;populationLinks?:PopulationLink[];estimated?:boolean;inferZeros?:(values:Record<string,number>)=>ZeroInference[]};
const prefix="negative-operational-";
type Method="calls"|"leads"|"qualified"|"reactivation"|"booking"|"attendance"|"slots"|"new-buyers"|"existing-buyers"|"unserved"|"time"|"tasks"|"invoices"|"reviews"|"information"|"direct-leads";
// Explicit, reviewed problem-to-impact mapping. Do not infer a method from a similar problem name.
export const operationalMethods:Record<string,Record<string,Method>>={
 "problem-1":{"lost-leads":"calls"},
 "problem-2":{"lost-leads":"calls"},
 "problem-3":{"fewer-appointments-booked":"booking"},
 "problem-4":{"fewer-customers-served":"unserved","lost-existing-customers":"existing-buyers"},
 "problem-5":{"lost-leads":"leads"},
 "problem-6":{"lost-leads":"leads"},
 "problem-7":{"lost-qualified-leads":"qualified"},
 "problem-8":{"lost-leads":"leads"},
 "problem-9":{"fewer-old-leads-reactivated":"reactivation"},
 "problem-10":{"fewer-old-leads-reactivated":"reactivation","lost-leads":"leads"},
 "problem-11":{"lost-leads":"leads"},
 "problem-12":{"fewer-appointments-attended":"attendance","unused-appointment-slots":"slots"},
 "problem-13":{"fewer-appointments-attended":"attendance","unused-appointment-slots":"slots"},
 "problem-14":{"unused-appointment-slots":"slots","fewer-customers-served":"unserved"},
 "problem-15":{"fewer-appointments-attended":"attendance","less-staff-time-available-for-other-work":"time"},
 "problem-16":{"fewer-customers-served":"unserved"},
 "problem-17":{"less-staff-time-available-for-other-work":"time","fewer-tasks-completed":"tasks"},
 "problem-18":{"fewer-customers-served":"unserved","lost-existing-customers":"existing-buyers"},
 "problem-19":{"less-staff-time-available-for-other-work":"time"},
 "problem-20":{"less-staff-time-available-for-other-work":"time","fewer-tasks-completed":"tasks","fewer-customers-served":"unserved"},
 "problem-21":{"fewer-customers-served":"unserved","lost-existing-customers":"existing-buyers"},
 "problem-22":{"more-unpaid-invoices":"invoices"},
 "problem-23":{"more-unpaid-invoices":"invoices"},
 "problem-24":{"fewer-customer-reviews":"reviews","fewer-new-customers":"new-buyers"},
 "problem-25":{"missing-business-information":"information"},
 "problem-26":{"missing-business-information":"information","lost-leads":"direct-leads"},
 "problem-27":{"missing-business-information":"information"},
 "problem-28":{"fewer-tasks-completed":"tasks","fewer-customers-served":"unserved","lost-leads":"direct-leads"}
};

const close=(a:number,b:number)=>Math.abs(a-b)<=1e-8*Math.max(1,Math.abs(a),Math.abs(b));
const field=(key:string,label:string,unit:string,integer=false):ImpactField=>({key,label,unit,integer});
function shared(config:Config,key:string,integer=false):ImpactField{
 const original=Object.values(config.fields).flat().find(f=>f.key===key);
 if(!original)throw new Error("Missing existing quantity "+config.id+":"+key);
 return {...original,shared:true,integer};
}
function breakdown(total:ImpactField,parts:ImpactField[]):Relation{
 const keys=parts.map(p=>p.key),a=total.key;
 return {keys:[a,...keys],label:total.label+" = "+parts.map(p=>p.label).join(" + "),
  terms:[{coefficient:1,keys:[a]},...keys.map(key=>({coefficient:-1,keys:[key]}))],
  derive:(v,k)=>k===a?keys.reduce((n,p)=>n+v[p],0):v[a]-keys.filter(p=>p!==k).reduce((n,p)=>n+v[p],0),
  operation:(v,k)=>k===a?keys.map(p=>format(v[p])).join(" + "):format(v[a])+" − "+keys.filter(p=>p!==k).map(p=>format(v[p])).join(" − "),
  valid:v=>close(v[a],keys.reduce((n,p)=>n+v[p],0))};
}
// Algebraic elimination of the primary result from additive and percentage equations.
// Also supports the case with two unknowns in the original equations.
function combined(total:ImpactField,others:ImpactField[],rate:ImpactField):Relation{
 const a=total.key,b=rate.key,keys=others.map(p=>p.key);
 const sum=(v:Record<string,number>,except?:string)=>keys.filter(k=>k!==except).reduce((n,k)=>n+v[k],0);
 const sumText=(v:Record<string,number>,except?:string)=>keys.filter(k=>k!==except).map(k=>format(v[k])).join(" + ");
 return {keys:[a,...keys,b],label:others.map(p=>p.label).join(" + ")+" = "+total.label+" × (1 − "+rate.label+" ÷ 100)",
  complement:{population:a,components:keys,rate:b,label:others.map(p=>p.label).join(" + ")+" = "+total.label+" × (1 − "+rate.label+" ÷ 100)"},
  derive:(v,k)=>{if(k===a){const d=1-v[b]/100;return d===0?undefined:sum(v)/d;}if(k===b)return v[a]===0?undefined:(1-sum(v)/v[a])*100;return v[a]*(1-v[b]/100)-sum(v,k);},
  impossible:(v,k)=>k===a&&v[b]===100&&sum(v)!==0||k===b&&v[a]===0&&sum(v)!==0,
  operation:(v,k)=>k===a?"("+sumText(v)+") ÷ (1 − "+format(v[b])+" ÷ 100)":k===b?"(1 − ("+sumText(v)+") ÷ "+format(v[a])+") × 100":format(v[a])+" × (1 − "+format(v[b])+" ÷ 100)"+(keys.length>1?" − ("+sumText(v,k)+")":""),
  valid:v=>close(sum(v),v[a]*(1-v[b]/100))};
}
function bounded(total:ImpactField,parts:ImpactField[]):AdditionalConstraint{
 const keys=parts.map(p=>p.key);
 return {keys:[total.key,...keys],message:"Contradictory entries: "+parts.map(p=>p.label).join(" + ")+" exceeds "+total.label+".",
  violated:v=>{const a=v[total.key],b=keys.reduce((n,k)=>n+(v[k]??0),0);return Number.isFinite(a)&&b>a&&!close(a,b);}};
}

export function operationalPanels(config:Config,selectedIds:readonly string[],options:{finalizedSlots?:boolean;finalizedBuyers?:boolean;finalizedTasks?:boolean}={}):OperationalPanel[]{
 const problem=problems.find(p=>p.id===config.id)!;
 return problem.operationalImpacts.filter(impact=>selectedIds.includes(impact.id)).map(impact=>{
  const key=impact.id.slice(prefix.length),method=operationalMethods[config.id]?.[key];
  const primaryKey="op:"+key+":result";
  const support=(suffix:string,label:string,unit:string,integer=false)=>normalizeField(config.id,field("op:"+key+":"+suffix,label,unit,integer));
  const primary=(label:string,unit:string,integer=true):ImpactField=>({...normalizeField(config.id,field(primaryKey,label,unit,integer)),primary:true});
  const panel=(fields:ImpactField[],relations:Relation[]=[],extra:Partial<OperationalPanel>={}):OperationalPanel=>({id:impact.id,name:impact.label,fields,primaryKey:fields.find(f=>f.primary)!.key,relations,verified:true,populationLinks:operationalPopulationLinks(config.id,method,fields.find(f=>f.primary)!.key),...extra});
  const direct=(label:string,unit:string,estimated=false)=>{const result=primary(label,unit,!estimated);return panel([result],[],{estimated,example:{[result.key]:"7"}});};
  const ratePanel=(population:ImpactField,rate:ImpactField,result:ImpactField,others:ImpactField[]=[],context:ImpactField[]=[],estimated=false,example?:Record<string,string>)=>{
   const relations=[product(result.key,population.key,rate.key,.01,result.label+" = "+population.label+" × "+rate.label+" ÷ 100")];
   const isLoss=others.length===2;
   const remainder=isLoss?support("not-lost","Recovered + pending",""+population.unit):undefined;
   if(remainder){relations.push(breakdown(remainder,others),breakdown(population,[remainder,result]));}
   if(others.length)relations.unshift(breakdown(population,[...others,result]));
   if(others.length)relations.push(combined(population,others,rate));
   return panel([...context,population,...others,...(remainder?[remainder]:[]),rate,result],relations,{
    estimated,constraints:[bounded(population,[...others,result])],
    inferZeros:v=>{
     const zeros:ZeroInference[]=[];
     const components=[...others,result];
     const infer=(target:string,dependencies:string[],label:string)=>zeros.push({target,dependencies,label});
     if(v[population.key]===0)for(const f of components)infer(f.key,[population.key],population.label+" is zero");
     if(v[rate.key]===0)infer(result.key,[rate.key],rate.label+" is zero");
     if(v[rate.key]===100)for(const f of others)infer(f.key,[rate.key],rate.label+" is 100%");
     if(others.length&&Number.isFinite(v[population.key])){
      const known=components.filter(f=>Number.isFinite(v[f.key]));
      const missing=components.filter(f=>!Number.isFinite(v[f.key]));
      const sum=known.reduce((n,f)=>n+v[f.key],0);
      if(sum===v[population.key])for(const f of missing)infer(f.key,[population.key,...known.map(f=>f.key)],"Known quantities account for all of "+population.label);
     }
     return zeros;
    },
    undefinedRates:[{denominator:population.key,rate:rate.key}],
    example:example??{[population.key]:"40",[rate.key]:"50",...Object.fromEntries(others.map(f=>[f.key,String(20/others.length)]))}
   });
  };
  switch(method){
   case "calls":
   case "direct-leads":
   case "leads":{
    const population=method!=="leads"?support("unique-leads","Unique affected leads","Leads",true):shared(config,"affected",true);
    const recovered=support("recovered","Recovered leads","Leads",true),pending=support("pending","Pending leads","Leads",true);
    return ratePanel(population,support("loss-rate","Loss rate","%"),primary("Lost leads","Leads"),[recovered,pending],[],false,{[population.key]:"26",[recovered.key]:"8",[pending.key]:"9"});
   }
   case "qualified":return ratePanel(support("affected-qualified-leads","Affected qualified leads","Leads",true),support("loss-rate","Qualified lead loss rate","%"),primary("Lost qualified leads","Leads"),[support("recovered","Recovered qualified leads","Leads",true),support("pending","Pending qualified leads","Leads",true)],[shared(config,"affected",true)]);
   case "reactivation":{
    const p=ratePanel(shared(config,"affected",true),support("reactivation-rate","Applicable attributable reactivation rate","%"),primary("Potential reactivations lost","Leads",false),[],[],true);
    const eligible=field("step3:historical:reactivation:eligible","Eligible old leads","Leads",true),converted=field("step3:historical:reactivation:converted","Relevant reactivated leads","Leads",true),rate=field("step3:historical:reactivation:rate","Historical reactivation rate","%");
    return {...p,fields:[...p.fields,eligible,converted,rate],relations:[...p.relations,product(converted.key,eligible.key,rate.key,.01,"Reactivated leads = eligible old leads × historical reactivation rate ÷ 100")],constraints:[...(p.constraints??[]),bounded(eligible,[converted])],populationLinks:[...(p.populationLinks??[]),{population:eligible.key,member:converted.key,kind:"subset",label:"Historical reactivated leads cannot exceed eligible old leads"}],undefinedRates:[...(p.undefinedRates??[]),{denominator:eligible.key,rate:rate.key}]};
   }
   case "booking":return ratePanel(shared(config,"missedBookings",true),support("loss-rate","Booking loss rate","%"),primary("Lost bookings","Bookings"),[support("recovered","Recovered bookings","Bookings",true),support("pending","Pending bookings","Bookings",true)],[shared(config,"affected",true)]);
   case "attendance":return ratePanel(shared(config,"affected",true),support("attendance-loss-rate","Attendance loss rate","%"),primary("Lost attendance","Appointments"));
   case "slots":{
    const available=support("available","Available affected slots","Slots",true),filled=support("filled","Filled affected slots","Slots",true),unused=primary("Unused appointment slots","Slots"),pending=support("pending","Pending or unclassified slots","Slots",true);
    const parts=options.finalizedSlots?[filled,unused]:[filled,unused,pending];
    return panel([available,filled,...(options.finalizedSlots?[]:[pending]),unused],[breakdown(available,parts)],{constraints:[bounded(available,parts)],example:{[available.key]:"40",[filled.key]:"25",...(options.finalizedSlots?{}:{[pending.key]:"0"})}});
   }
   case "new-buyers":return direct("Potential new buyers lost","Buyers",true);
   case "existing-buyers":return ratePanel(support("affected","Affected existing buyers","Buyers",true),support("rate","Attributable existing buyer loss rate","%"),primary("Lost existing buyers","Buyers"));
   case "unserved":{
    const population=support("affected","Affected buyers","Buyers",true),served=support("served","Buyers subsequently served","Buyers",true),pending=support("pending","Pending or otherwise classified affected buyers","Buyers",true),result=primary("Unserved buyers","Buyers");
    const parts=options.finalizedBuyers?[served,result]:[served,result,pending];
    return panel([population,...parts],[breakdown(population,parts)],{constraints:[bounded(population,parts)],example:{[population.key]:"100",[served.key]:"70",...(options.finalizedBuyers?{}:{[pending.key]:"0"})}});
   }
   case "time":return ratePanel(shared(config,"hours"),support("avoidable-percentage","Avoidable time percentage","%"),primary("Avoidable time","hrs",false),[support("necessary-time","Necessary time","hrs")]);
   case "tasks":{
    const population=config.id==="problem-28"?shared(config,"affected",true):support("affected","Affected tasks","Tasks",true),completed=support("completed","Completed affected tasks","Tasks",true),pending=support("pending","Pending or otherwise classified affected tasks","Tasks",true),result=primary("Incomplete tasks","Tasks");
    const parts=options.finalizedTasks?[completed,result]:[completed,result,pending];
    return panel([population,...parts],[breakdown(population,parts)],{constraints:[bounded(population,parts)],example:{[population.key]:"200",[completed.key]:"150",...(options.finalizedTasks?{}:{[pending.key]:"0"})}});
   }
   case "invoices":{
    // Missed payment reminders are not necessarily unique affected invoices.
    // The invoice-follow-up problem already has an identical affected-invoice count.
    const population=config.id==="problem-23"?shared(config,"affected",true):support("affected-invoices","Affected invoices","Invoices",true);
    return ratePanel(population,support("invoice-loss-rate","Invoice loss rate","%"),primary("Additional unpaid invoices","Invoices"),[],config.id==="problem-22"?[shared(config,"affected",true)]:[]);
   }
   case "reviews":return ratePanel(shared(config,"affected",true),support("additional-review-rate","Additional review rate","%"),primary("Potential reviews lost","Reviews",false),[],[],true);
   case "information":return panel([{...shared(config,"affected",true),primary:true}],[],{example:{affected:"7"}});

   default:throw new Error("Missing approved operational configuration: "+config.id+" / "+impact.id);
  }
 });
}
export function operationalEquations(panels:OperationalPanel[]):AdditionalEquations{
 return {fields:panels.flatMap(panel=>panel.fields.filter(field=>!field.shared)),relations:panels.flatMap(panel=>panel.relations),populationLinks:panels.flatMap(panel=>panel.populationLinks??[]),constraints:panels.flatMap(panel=>panel.constraints??[]),undefinedRates:panels.flatMap(panel=>panel.undefinedRates??[]),integerKeys:[...new Set(panels.flatMap(panel=>panel.fields.filter(f=>f.integer).map(f=>f.key)))],estimatedKeys:panels.filter(panel=>panel.estimated).map(panel=>panel.primaryKey),inferZeros:values=>panels.flatMap(panel=>panel.inferZeros?.(values)??[])};
}
