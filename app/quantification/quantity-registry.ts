import {configs,sectionOrder} from "./config";
import {problems} from "../discovery/data";
import {operationalPanels} from "./operational-data";
import {baseSupplementalRoutes,financialContent,operationalAlternatives,shortfallRoute,type ContentRoute} from "./step2-content";
import {fieldReference,canonicalId,canShare,type FieldReference} from "./quantity-identity";
import {definition} from "./canonical-definitions";
export type RegistryFieldOccurrence={path:string;reference:FieldReference;panel:"problem"|"operational"|"financial";outcome?:string;route?:string};
export type RegistryRoute={id:string;outcomeId?:string;panel:RegistryFieldOccurrence["panel"];fieldInstanceIds:string[];resultInstanceId?:string;reference:string;condition:string;active:boolean};
export type ProblemRegistry={problemId:string;fields:RegistryFieldOccurrence[];instances:Readonly<Record<string,FieldReference>>;routes:RegistryRoute[];conditionalIdentities:readonly {left:string;right:string;condition:string;active:false}[]};
const cache=new Map<string,ProblemRegistry>();
export function registryFor(problemId:string):ProblemRegistry{
 const cached=cache.get(problemId);if(cached)return cached;
 const c=configs.find(c=>c.id===problemId);if(!c)throw Error("Unknown problem "+problemId);
 const p=problems.find(p=>p.id===problemId)!;
 const fields:RegistryFieldOccurrence[]=[],instances:Record<string,FieldReference>={},routes:RegistryRoute[]=[];
 const put=(field:Parameters<typeof fieldReference>[1],panel:RegistryFieldOccurrence["panel"],path:string,outcome?:string,route?:string)=>{
  const ref=fieldReference(problemId,field);
  const existing=instances[ref.legacyKey];
  if(existing&&(existing.canonicalId!==ref.canonicalId||existing.instanceId!==ref.instanceId||!canShare(existing,ref)))throw Error("Conflicting quantity identity "+path);
  if(!existing)instances[ref.legacyKey]=ref;
  fields.push({path,reference:ref,panel,outcome,route});return ref.instanceId;
 };
 const key=(k:string)=>problemId+"/"+k;
 const addRoute=(id:string,panel:RegistryRoute["panel"],keys:string[],result:string|undefined,reference:string,condition:string,active=false,outcomeId?:string)=>{
  routes.push({id,panel,fieldInstanceIds:[...new Set(keys.map(key))],resultInstanceId:result?key(result):undefined,reference,condition,active,outcomeId});
 };
 const target=(outcome:string,r:ContentRoute,parentPath:string,primary:string):string|undefined=>{
  const id=r.id;
  if(id==="affected-invoice-context"||id==="conversions"||id==="revenue")return id==="revenue"?"fin:potential-revenue":id==="conversions"?"fin:potential-buyers":undefined;
  if(outcome==="F1")return id==="purchase-average"?"fin:average-revenue-purchase":primary;
  if(outcome==="F2")return id==="margin-basis"?"fin:confirmed-margin":id==="profit-average"?"fin:average-profit-purchase":id==="avoided-purchase"?"fin:avoided-variable":primary;
  if(outcome==="F3"||outcome==="F9"){
   const prefix=outcome==="F3"?"fin:higher:":"fin:estimated-higher:";
   const k=({marketing:"marketing",staff:"staff",employees:"staff",collection:"collection",hours:"collection-staff",financing:"financing",interest:"interest",other:"other","overall-difference":"difference"} as Record<string,string>)[id];
   return k?prefix+k:primary;
  }
  if(outcome==="F4"){
   const k=({marketing:"wasted-marketing",staff:"wasted-staff",other:"wasted-other","paid-lost":"paid-lost","paid-average":"average-paid-lead",avoidable:"wasted-hours",slots:"wasted-hours","staff-average":"average-staff-hour"} as Record<string,string>)[id];
   return k?"fin:"+k:primary;
  }
  if(outcome==="F7"||outcome==="F8"){
   if(id==="margin-basis")return "fin:potential-margin";
   if(id==="profit-average")return "fin:average-profit-buyer";
   if(id==="avoided-buyer")return "fin:estimated-avoided";
   if(id==="average-buyer")return "fin:average-revenue-buyer";
   if(id==="existing")return "fin:potential-revenue";
   if(["leads","qualified","reactivation","booking","attendance","unserved","slots","new-buyers"].includes(id))return "fin:potential-buyers";
  }
  return primary;
 };
 const registerRoutes=(items:ContentRoute[],panel:RegistryRoute["panel"],path:string,primary:string,outcomeId?:string)=>{
  for(const r of items){
   const routePath=path+"/"+r.id;
   r.fields.forEach((f,j)=>put(f,panel,routePath+"/"+j,outcomeId,routePath));
   const result=panel==="financial"?target(outcomeId!,r,path,primary):primary;
   let keys=r.fields.map(f=>f.key);
   if(outcomeId==="F1"&&r.id==="purchase-values")keys=["fin:purchase-revenue","fin:retained-revenue"];
   if(r.id==="overall-difference")keys=[...keys,outcomeId==="F3"?"fin:higher:actual":"fin:estimated-higher:actual",outcomeId==="F3"?"fin:higher:comparable":"fin:estimated-higher:comparable"];
   if(panel==="operational"&&r.id==="appointment-population")keys.push("op:fewer-appointments-attended:attendance-loss-rate");
   addRoute(routePath,panel,keys,result,r.reference,r.condition??"Compatible population, period, units, evidence and attribution must be established.",false,outcomeId);
   registerRoutes(r.children??[],panel,routePath,primary,outcomeId);
  }
 };
 for(const s of sectionOrder){
  const list=c.fields[s];list.forEach((f,j)=>put(f,"problem","problem/"+s+"/"+j));
  if(list.length)addRoute("problem/"+s,"problem",list.map(f=>f.key),undefined,"Existing "+s+" calculation references.","Population, counting unit and measurement period must match; additive classifications must be mutually exclusive and exhaustive.",true);
  registerRoutes(baseSupplementalRoutes(c,s),"problem","problem/"+s,s==="Money"?"moneyTotal":"affected");
 }
 const operational=operationalPanels(c,p.operationalImpacts.map(i=>i.id));
 for(const op of operational){
  op.fields.forEach((f,j)=>put(f,"operational","operational/"+op.id+"/"+j,op.id));
  for(const [j,rel] of op.relations.entries())addRoute("operational/"+op.id+"/equation-"+j,"operational",rel.keys,op.primaryKey,rel.label,"Existing equation; scope and applicable population must match.",true,op.id);
  registerRoutes(operationalAlternatives(c,op.id),"operational","operational/"+op.id,op.primaryKey,op.id);
 }
 if(problemId==="problem-28")registerRoutes([shortfallRoute],"operational","operational","step2:staff-shortfall","shortfall");
 for(const outcome of financialContent(c)){
  outcome.fields.forEach((f,j)=>put(f,"financial","financial/"+outcome.id+"/"+j,outcome.id));
  addRoute("financial/"+outcome.id,"financial",outcome.fields.map(f=>f.key),outcome.primary.key,outcome.reference,outcome.condition,false,outcome.id);
  registerRoutes(outcome.routes,"financial","financial/"+outcome.id,outcome.primary.key,outcome.id);
 }
 const conditionalIdentities:{left:string;right:string;condition:string;active:false}[]=[];
 const conditional=(left:string,right:string,condition:string)=>{if(instances[left]&&instances[right])conditionalIdentities.push({left:key(left),right:key(right),condition,active:false});};
 if(problemId==="problem-3")conditional("affected","op:fewer-appointments-booked:intended-bookings","Same individual booking opportunities, not call events.");
 if(problemId==="problem-12"||problemId==="problem-15")conditional("affected","step2:negative-operational-fewer-appointments-attended:unique-appointments","Same unique appointment occurrences, not multiple reminder or rescheduling events.");
 if(problemId==="problem-22")conditional("affected","step2:payments-without-reminders","Same distinct affected payments, not reminder events.");
 conditional("fin:confirmed-margin","fin:potential-margin","Same revenue and variable-cost population and period.");
 conditional("fin:purchase-total-revenue","fin:buyer-scope-revenue","Same product, business, currency, revenue population and period.");
 conditional("fin:purchase-total-profit","fin:buyer-total-profit","Same contribution profit population, costs, currency and period.");
 conditional("fin:higher:employee-cost","fin:estimated-higher:employee-cost","Same employee cost, arrangement and period.");
 conditional("fin:higher:interest-rate","fin:estimated-higher:interest-rate","Same financing arrangement, interest method and day-count convention.");
 conditional("op:fewer-new-customers:result","fin:potential-buyers","Financial population consists exclusively of those same potential new buyers.");
 const instanceIds=new Set(Object.values(instances).map(x=>x.instanceId));
 for(const route of routes)for(const id of [...route.fieldInstanceIds,...(route.resultInstanceId?[route.resultInstanceId]:[])])if(!instanceIds.has(id))throw Error("Unresolved route reference "+route.id+" -> "+id);
 const registry={problemId,fields,instances,routes,conditionalIdentities};
 cache.set(problemId,registry);return registry;
}
