import type { Config } from "./config";
import { algebraicConsequences, type Term } from "./algebra";
import { rangeConsequences, type QuantityBounds, type ComplementRate } from "./ranges";
import { basePopulationLinks, type PopulationLink } from "./information-links";
export type Figures=Record<string,string>;
export type Result={undefinedKeys?:Set<string>;values:Record<string,number>; calculated:Record<string,string>; errors:string[]; blocked:Set<string>; estimated:Set<string>; bounds?:Record<string,QuantityBounds>};
export type Relation={keys:string[]; label:string; terms?:Term[]; complement?:ComplementRate; operation?:(v:Record<string,number>,key:string)=>string; impossible?:(v:Record<string,number>,key:string)=>boolean; derive:(v:Record<string,number>, key:string)=>number|undefined; valid:(v:Record<string,number>)=>boolean};
const close=(a:number,b:number)=>Math.abs(a-b)<=1e-8*Math.max(1,Math.abs(a),Math.abs(b));
const div=(a:number,b:number)=>b===0?undefined:a/b;
function sum(a:string,b:string,c:string,label:string):Relation{return {keys:[a,b,c],label,terms:[{coefficient:1,keys:[a]},{coefficient:-1,keys:[b]},{coefficient:-1,keys:[c]}],operation:(v,k)=>k===a?format(v[b])+" + "+format(v[c]):k===b?format(v[a])+" − "+format(v[c]):format(v[a])+" − "+format(v[b]),derive:(v,k)=>k===a?v[b]+v[c]:k===b?v[a]-v[c]:v[a]-v[b],valid:v=>close(v[a],v[b]+v[c])};}
// a = b*c*factor. A zero divisor is indeterminate, never infinity.
export function product(a:string,b:string,c:string,factor:number,label:string):Relation{return {keys:[a,b,c],label,terms:[{coefficient:1,keys:[a]},{coefficient:-factor,keys:[b,c]}],operation:(v,k)=>{const f=factor===1?"":factor===.01?" ÷ 100":factor===1/60?" ÷ 60":" × "+format(factor);const inv=factor===1?"":factor===.01?" × 100":factor===1/60?" × 60":" ÷ "+format(factor);return k===a?format(v[b])+" × "+format(v[c])+f:format(v[a])+" ÷ "+format(v[k===b?c:b])+inv;},impossible:(v,k)=>k!==a&&v[k===b?c:b]===0&&v[a]!==0,derive:(v,k)=>k===a?v[b]*v[c]*factor:k===b?div(v[a],v[c]*factor):div(v[a],v[b]*factor),valid:v=>close(v[a],v[b]*v[c]*factor)};}
function ratio(a:string,b:string,c:string,factor:number,label:string):Relation{return product(a,b,c,factor,label);}
const validValue=(key:string,n:number)=>Number.isFinite(n)&&(key==="difference"||n>=0)&&(!["affectedPct","unaffectedPct","remainingPct","missedReminderPct"].includes(key)||n<=100);
export type AdditionalConstraint={keys:string[];message:string;violated:(values:Record<string,number>)=>boolean};
export type ZeroInference={target:string;dependencies:string[];label:string};
export type AdditionalEquations={actualIntegerKeys?:string[];averageKeys?:string[];fields:{key:string;label:string;unit:string}[];relations:Relation[];constraints?:AdditionalConstraint[];undefinedRates?:{denominator:string;rate:string}[];integerKeys?:string[];estimatedKeys?:string[];populationLinks?:PopulationLink[];inferZeros?:(values:Record<string,number>)=>ZeroInference[]};
// Entered rates and averages are nominal estimates unless explicitly declared exact.
// Actual count fields remain integer-valued when directly entered.
export type PopulationClassification="complete"|"incomplete"|"disjoint"|"containment"|"overlapping";
export type PrecisionOptions={populationClassification?:PopulationClassification;recordedSubset?:boolean;exactInputs?:ReadonlySet<string>;estimatedInputs?:ReadonlySet<string>; includeBounds?:boolean;correctionKey?:string};
export function solve(config:Config,raw:Figures,additional?:AdditionalEquations,precision:PrecisionOptions={}):Result{
 const labels=Object.fromEntries([...Object.values(config.fields).flat(),...(additional?.fields??[])].map(f=>[f.key,f.label]));
 const classification=precision.populationClassification??"complete";
 const supplemental:Record<string,{label:string;unit:string;integer:boolean}>= {"remaining":{"label":"Remaining unclassified quantity","unit":"Units","integer":true},"remainingPct":{"label":"Remaining unclassified percentage","unit":"%","integer":false},"overlap":{"label":"Overlap","unit":"Units","integer":true},"combined":{"label":"Unique combined population","unit":"Units","integer":true},"intendedBookings":{"label":"Intended individual bookings","unit":"Bookings","integer":true},"missedBookings":{"label":"Missed individual bookings","unit":"Bookings","integer":true},"requiredReminders":{"label":"Required reminder events","unit":"Events","integer":true},"missedReminders":{"label":"Missed reminder events","unit":"Events","integer":true},"sentReminders":{"label":"Sent reminder events","unit":"Events","integer":true},"pendingReminders":{"label":"Unclassified reminder events","unit":"Events","integer":true},"missedReminderPct":{"label":"Missed reminder-event percentage","unit":"%","integer":false},"reschedulingEvents":{"label":"Individual rescheduling events","unit":"Events","integer":true},"averageEventMinutes":{"label":"Average rescheduling time per event","unit":"min","integer":false},"affectedInvoices":{"label":"Distinct affected invoices","unit":"Invoices","integer":true},"requiredUpdates":{"label":"Required CRM update events","unit":"Events","integer":true},"missedUpdates":{"label":"Missed CRM update events","unit":"Events","integer":true},"completedUpdates":{"label":"Completed CRM update events","unit":"Events","integer":true},"pendingUpdates":{"label":"Unclassified CRM update events","unit":"Events","integer":true},"missingRecordings":{"label":"Calls missing recordings","unit":"Calls","integer":true},"missingOutcomes":{"label":"Calls missing outcomes","unit":"Calls","integer":true},"missingBoth":{"label":"Calls missing both recordings and outcomes","unit":"Calls","integer":true}};
 const extras:Record<string,string[]>={"problem-3":["intendedBookings","missedBookings"],"problem-12":["requiredReminders","missedReminders","sentReminders","pendingReminders","missedReminderPct"],"problem-22":["requiredReminders","missedReminders","sentReminders","pendingReminders","missedReminderPct","affectedInvoices"],"problem-25":["missingRecordings","missingOutcomes","missingBoth"],"problem-26":["requiredUpdates","missedUpdates","completedUpdates","pendingUpdates"],"problem-15":["reschedulingEvents","averageEventMinutes"]};
 const activeExtras=[...(extras[config.id]??[]),...(classification==="incomplete"?["remaining","remainingPct"]:classification==="overlapping"?["overlap","combined"]:[]),...(config.id==="problem-22"?["step2:payments-without-reminders"]:[])];
 for(const key of activeExtras)labels[key]=supplemental[key]?.label??"Payments without reminders";
 if(config.id==="problem-28")labels["step2:staff-shortfall"]="Staff hour shortfall";
 const integerKeys=new Set([...activeExtras.filter(key=>supplemental[key]?.integer||key==="step2:payments-without-reminders"),"total","affected","unaffected","recordedUnits",...(additional?.integerKeys??[])]);
 if(config.actualKey&&integerKeys.has(config.actualKey)){integerKeys.add("target");integerKeys.add("difference");}
 const actualIntegerKeys=new Set(additional?.actualIntegerKeys??[]);
 const inherentEstimates=new Set(additional?.estimatedKeys??[]);
 const estimateInputs=new Set([...Object.values(config.fields).flat(),...(additional?.fields??[])].filter(f=>f.unit==="%"||f.key==="averageMinutes"||f.key==="daily"||f.key==="moneyAverage").map(f=>f.key));
 const inputEstimated=(key:string)=>!actualIntegerKeys.has(key)&&!precision.exactInputs?.has(key)&&(precision.estimatedInputs?.has(key)||estimateInputs.has(key)||inherentEstimates.has(key)||additional?.averageKeys?.includes(key));
 // Only correct machine-precision residue of an exact integral calculation.
 // Never round an estimated count to an integer.
 const nearInteger=(n:number)=>Number.isSafeInteger(Math.round(n))&&Math.abs(n-Math.round(n))<=Math.min(1e-8,8*Number.EPSILON*Math.max(1,Math.abs(n)));
 const isValid=(key:string,n:number,computed=false,estimate=false)=>validValue(key,n)&&(!additional?.fields.some(f=>f.key===key&&f.unit==="%")||n<=100)&&(!integerKeys.has(key)||(estimate?Math.abs(n)<=Number.MAX_SAFE_INTEGER:computed?nearInteger(n):Number.isSafeInteger(n)));
 const numericValue=(key:string,n:number,estimate:boolean)=>integerKeys.has(key)&&!estimate?Math.round(n):n===0?0:n;

 const relations:Relation[]=[];
 const localLinks:PopulationLink[]=[];
 const subset=(population:string,member:string)=>localLinks.push({population,member,kind:"subset",label:(labels[member]??member)+" cannot exceed "+(labels[population]??population)});
 const linear=(keys:string[],coefficients:number[],label:string,constant=0):Relation=>({keys,label,terms:[...keys.map((key,j)=>({coefficient:coefficients[j],keys:[key]})),...(constant?[{coefficient:-constant,keys:[]}]:[])],derive:(v,k)=>(constant-keys.reduce((n,x,j)=>n+(x===k?0:coefficients[j]*v[x]),0))/coefficients[keys.indexOf(k)],valid:v=>close(keys.reduce((n,x,j)=>n+coefficients[j]*v[x],0),constant)});
 const union=(combined:string,a:string,b:string,overlap:string)=>{relations.push(linear([combined,a,b,overlap],[1,-1,-1,1],"Unique combined population = A + B − overlap"));subset(a,overlap);subset(b,overlap);subset(combined,a);subset(combined,b);};
 if(config.fields.Quantity.length){
  relations.push(ratio("affected","total","affectedPct",.01,"Affected = total × affected % ÷ 100"),ratio("unaffected","total","unaffectedPct",.01,"Unaffected = total × unaffected % ÷ 100"));
  subset("total","affected");subset("total","unaffected");
  if(classification==="complete")relations.push(sum("total","affected","unaffected","Total = affected + unaffected"),linear(["affectedPct","unaffectedPct"],[1,1],"Affected % + unaffected % = 100",100));
  if(classification==="incomplete")relations.push(linear(["total","affected","unaffected","remaining"],[1,-1,-1,-1],"Total = affected + unaffected + remaining"),product("remaining","total","remainingPct",.01,"Remaining = total × remaining % ÷ 100"),linear(["affectedPct","unaffectedPct","remainingPct"],[1,1,1],"Affected % + unaffected % + remaining % = 100",100));
  if(classification==="disjoint"){const slack="__unclassified";relations.push(linear(["total","affected","unaffected",slack],[1,-1,-1,-1],"Affected + unaffected cannot exceed total"));integerKeys.add(slack);}
  if(classification==="overlapping"){union("combined","affected","unaffected","overlap");subset("total","combined");}
 }
 if(config.id==="problem-3"){subset("intendedBookings","missedBookings");subset("intendedBookings","total");subset("missedBookings","affected");}
 if(config.id==="problem-12"||config.id==="problem-22"){
  relations.push(linear(["requiredReminders","missedReminders","sentReminders","pendingReminders"],[1,-1,-1,-1],"Required reminder events = missed + sent + unclassified"),product("missedReminders","requiredReminders","missedReminderPct",.01,"Missed events = required events × missed event % ÷ 100"));
  subset("requiredReminders","total");subset("missedReminders","affected");
 }
 if(config.id==="problem-15"){relations.push(product("hours","reschedulingEvents","averageEventMinutes",1/60,"Total rescheduling hours = events × average minutes per event ÷ 60"));subset("reschedulingEvents","affected");}
 if(config.id==="problem-22"){localLinks.push({population:"affected",member:"step2:payments-without-reminders",kind:"subset",label:"Distinct payments without reminders cannot exceed affected payments"});localLinks.push({population:"affected",member:"affectedInvoices",kind:"attributed",label:"Affected invoices are attributable to affected payments"});}
 if(config.id==="problem-25"){union("affected","missingRecordings","missingOutcomes","missingBoth");}
 if(config.id==="problem-26"){relations.push(linear(["requiredUpdates","missedUpdates","completedUpdates","pendingUpdates"],[1,-1,-1,-1],"Required update events = missed + completed + unclassified"));subset("requiredUpdates","total");subset("missedUpdates","affected");}

 if(config.timePopulation)relations.push(product("hours",config.timePopulation,"averageMinutes",1/60,"Hours = quantity × average minutes ÷ 60"));
 if(config.fields.Frequency.length)relations.push(product("affected","days","daily",1,"Affected quantity = days × quantity per day"));
 if(config.actualKey)relations.push(sum(config.actualKey,"target","difference","Actual = target + difference"),ratio(config.actualKey,"target","targetPct",.01,"Actual = target × percentage of target ÷ 100"),{
  keys:["difference","target","targetPct"],label:"Difference = target × (percentage of target ÷ 100 − 1)",
  derive:(v,k)=>k==="difference"?v.target*(v.targetPct/100-1):k==="target"?div(v.difference,v.targetPct/100-1):v.target===0?undefined:(1+v.difference/v.target)*100,
  operation:(v,k)=>k==="difference"?format(v.target)+" × ("+format(v.targetPct)+" ÷ 100 − 1)":k==="target"?format(v.difference)+" ÷ ("+format(v.targetPct)+" ÷ 100 − 1)":"(1 + "+format(v.difference)+" ÷ "+format(v.target)+") × 100",
  impossible:(v,k)=>k==="target"&&v.targetPct===100&&v.difference!==0||k==="targetPct"&&v.target===0&&v.difference!==0,
  valid:v=>close(v.difference,v.target*(v.targetPct/100-1))
 });
 if(config.moneyPopulation)relations.push(product("moneyTotal",config.moneyPopulation,"moneyAverage",1,"Total amount = quantity × average amount"));
 if(config.id==="problem-22")relations.push(linear(["affected","step2:payments-without-reminders"],[1,-1],"Distinct affected payments are the payments affected by missed reminders"));
 if(config.id==="problem-28")relations.push({
  keys:["difference","step2:staff-shortfall"],label:"Staff hour shortfall = max(0, required − available hours)",
  derive:(v,k)=>k==="step2:staff-shortfall"?Math.max(0,v.difference):v["step2:staff-shortfall"]>0?v["step2:staff-shortfall"]:undefined,
  valid:v=>close(v["step2:staff-shortfall"],Math.max(0,v.difference))
 });
 if(additional)relations.push(...additional.relations);
 if(config.id==="problem-22"&&labels["op:more-unpaid-invoices:affected-invoices"])relations.push(linear(["affectedInvoices","op:more-unpaid-invoices:affected-invoices"],[1,-1],"Same distinct affected invoices"));
 if(["problem-12","problem-15"].includes(config.id)&&labels["op:fewer-appointments-attended:unique-appointments"])relations.push(linear(["affected","op:fewer-appointments-attended:unique-appointments"],[1,-1],"Same distinct affected appointments"));
 if(config.id==="problem-3"&&labels["op:fewer-appointments-booked:intended-bookings"])relations.push(linear(["intendedBookings","op:fewer-appointments-booked:intended-bookings"],[1,-1],"Same intended individual bookings"));
 const complements:ComplementRate[]=relations.flatMap(rel=>rel.complement?[rel.complement]:[]);
 if(config.fields.Quantity.length&&classification==="complete")complements.push(
  {population:"total",components:["unaffected"],rate:"affectedPct",label:"Affected rate is the complement of unaffected quantity ÷ total"},
  {population:"total",components:["affected"],rate:"unaffectedPct",label:"Unaffected rate is the complement of affected quantity ÷ total"});
 const algebra=relations.flatMap(rel=>rel.terms?[{keys:rel.keys,label:rel.label,terms:rel.terms}]:[]);
 const rateDenominators:Record<string,string>={...(config.timePopulation?{averageMinutes:config.timePopulation}:{}),...(config.moneyPopulation?{moneyAverage:config.moneyPopulation}:{}),...(config.id==="problem-15"?{averageEventMinutes:"reschedulingEvents"}:{}),affectedPct:"total",unaffectedPct:"total",...(classification==="incomplete"?{remainingPct:"total"}:{}),...([ "problem-12","problem-22"].includes(config.id)?{missedReminderPct:"requiredReminders"}:{}),targetPct:"target",daily:"days",...Object.fromEntries((additional?.undefinedRates??[]).map(x=>[x.rate,x.denominator]))};
 const domain=(key:string):[number,number]=>[key==="difference"?-Infinity:0,["affectedPct","unaffectedPct","remainingPct","missedReminderPct"].includes(key)||additional?.fields.some(f=>f.key===key&&f.unit==="%")?100:Infinity];
 const manual:Record<string,number>={},blocked=new Set<string>(),errors=new Set<string>();
 for(const [k,s] of Object.entries(raw)){if(!labels[k]||s.trim()==="")continue;const n=Number(s);if(!isValid(k,n,false,inputEstimated(k))){blocked.add(k);errors.add((labels[k]??k)+": invalid value.");}else manual[k]=n;}
 let values:Record<string,number>={},calculated:Record<string,string>={},estimated=new Set<string>();
 const intervals=(known:Record<string,number>)=>{
    const links=[...localLinks,...(precision.recordedSubset===false?[]:basePopulationLinks(config)),...(additional?.populationLinks??[])];
    // Relax the integer domain only for unknown counts in components with an
    // active estimate. A manual actual count is still an exact fixed value.
    // In an exact-only component retain the existing discrete bound inference.
    const estimateReach=new Set(Object.keys(known).filter(k=>estimated.has(k)));
    const connected=[...relations.filter(rel=>!rel.keys.some(k=>blocked.has(k))).map(rel=>rel.keys),...links.filter(link=>!blocked.has(link.population)&&!blocked.has(link.member)).map(link=>[link.population,link.member])];
    let expanded=true;while(expanded){expanded=false;for(const keys of connected)if(keys.some(k=>estimateReach.has(k)))for(const k of keys)if(!estimateReach.has(k)){estimateReach.add(k);expanded=true;}}
    const exactIntegerKeys=new Set([...integerKeys].filter(k=>actualIntegerKeys.has(k)||precision.exactInputs?.has(k)||!estimateReach.has(k)||k in manual&&!estimated.has(k)));
    return rangeConsequences(algebra,known,blocked,domain,exactIntegerKeys,rateDenominators,links,complements,Object.keys(labels),config.actualKey?{actual:config.actualKey,target:"target",difference:"difference",rate:"targetPct"}:undefined,config.id==="problem-28"?{difference:"difference",shortfall:"step2:staff-shortfall"}:undefined);

 };
 // Rebuild from manual figures after blocking contradictory dependencies.
 for(let round=0;round<50;round++){
  values={...manual};calculated={};estimated=new Set(Object.keys(manual).filter(inputEstimated));
  const derivesEstimate=(key:string,dependencies:string[])=>!actualIntegerKeys.has(key)&&!precision.exactInputs?.has(key)&&(inherentEstimates.has(key)||dependencies.some(k=>estimated.has(k)));
  const markEstimate=(key:string,estimate:boolean)=>{if(estimate)estimated.add(key);else estimated.delete(key);};
  const roots:Record<string,Set<string>>=Object.fromEntries(Object.keys(manual).map(k=>[k,new Set([k])]));
  const active=(k:string)=>values[k]!==undefined&&!blocked.has(k)&&![...(roots[k]??[])].some(x=>blocked.has(x));
  let changed=false;
  const contradict=(keys:string[],message:string)=>{errors.add(message);for(const k of keys)for(const x of roots[k]??[]){if(!blocked.has(x)){blocked.add(x);changed=true;}}};
  for(let pass=0;pass<50;pass++){
   let added=false;
   for(const rel of relations){
    if(rel.keys.some(k=>blocked.has(k)))continue;
    // An established zero factor fixes a product even if the other factor is unknown.
    const productTerm=rel.terms?.find(t=>t.keys.length===2);
    const outputTerm=rel.terms?.find(t=>t.keys.length===1);
    if(productTerm&&outputTerm&&rel.terms?.length===2){
     const output=outputTerm.keys[0],zero=productTerm.keys.find(k=>active(k)&&values[k]===0);
     if(zero&&!active(output)&&!(output in manual)&&!blocked.has(output)){
      values[output]=0;markEstimate(output,derivesEstimate(output,[zero]));roots[output]=new Set(roots[zero]);calculated[output]=(labels[output]??output)+" = 0 (zero factor)";added=true;
     }
    }
    const missing=rel.keys.filter(k=>!active(k));
    if(missing.length===0){if(!rel.valid(values))contradict(rel.keys,"Contradictory entries: "+rel.label+".");continue;}
    if(missing.length!==1)continue;
    const k=missing[0];if(k in manual||blocked.has(k))continue;
    const known=rel.keys.filter(x=>x!==k);if(!known.every(active))continue;
    if(rel.impossible?.(values,k)){contradict(known,"Contradictory entries: "+rel.label+".");continue;}
    if(rateDenominators[k]&&active(rateDenominators[k])&&values[rateDenominators[k]]===0)continue;
    const n=rel.derive(values,k);if(n===undefined)continue;
    const estimate=derivesEstimate(k,known);
    if(!isValid(k,n,true,estimate)){contradict(known,"Contradictory entries: "+rel.label+".");continue;}
    values[k]=numericValue(k,n,estimate);
    markEstimate(k,estimate);
    roots[k]=new Set(known.flatMap(x=>[...roots[x]]));
    calculated[k]=(labels[k]??k)+" = "+(rel.operation?.(values,k)??rel.label)+" = "+format(values[k])+(estimate?" (estimate)":"");
    added=true;
   }
   if(config.actualKey&&active("targetPct")&&values.targetPct===100&&!active("difference")&&!blocked.has("difference")&&!("difference" in manual)){
    values.difference=0;markEstimate("difference",derivesEstimate("difference",["targetPct"]));roots.difference=new Set(roots.targetPct);calculated.difference="Difference = 0 (100% of target)";added=true;
   }
   // Boundary cases of the approved operational equations: a zero population,
   // a zero/100% rate, or an exhausted nonnegative breakdown can force zero
   // even when several fields were initially unknown.
   if(additional?.inferZeros){
    const known=Object.fromEntries(Object.entries(values).filter(([k])=>active(k)));
    for(const inference of additional.inferZeros(known)){
     const k=inference.target;
     if(blocked.has(k)||!inference.dependencies.every(active))continue;
     if(active(k)){
      if(values[k]!==0)contradict([...inference.dependencies,k],"Contradictory entries: "+inference.label+".");
      continue;
     }
     if(k in manual)continue;
     values[k]=0;
     markEstimate(k,derivesEstimate(k,inference.dependencies));
     roots[k]=new Set(inference.dependencies.flatMap(x=>[...roots[x]]));
     calculated[k]=(labels[k]??k)+" = 0 ("+inference.label+")";
     added=true;
    }
   }
   // Run a simultaneous algebraic pass after the ordinary forward/reverse
   // routes have reached a fixed point. Re-enter the same loop on any new value.
   if(!changed&&!added){
    const known=Object.fromEntries(Object.entries(values).filter(([key])=>active(key)));
    const linear=algebraicConsequences(algebra,known,blocked,domain);
    const ranges=intervals(known);
    const deductions={results:[...linear.results,...ranges.results],conflicts:[...linear.conflicts,...ranges.conflicts]};
    for(const conflict of deductions.conflicts)if(conflict.dependencies.every(active))contradict(conflict.dependencies,"Contradictory entries: "+conflict.label+".");
    for(const inferred of deductions.results){
     const k=inferred.key;
     if(blocked.has(k)||!inferred.dependencies.every(active))continue;
     const denominator=rateDenominators[k];
     if(denominator&&active(denominator)&&values[denominator]===0)continue;
     const estimate=derivesEstimate(k,inferred.dependencies);
     if(!isValid(k,inferred.value,true,estimate)){contradict(inferred.dependencies,"Contradictory entries: "+inferred.label+".");continue;}
     if(active(k)){if(!close(values[k],inferred.value))contradict([...inferred.dependencies,k],"Contradictory entries: "+inferred.label+".");continue;}
     if(k in manual)continue;
     values[k]=numericValue(k,inferred.value,estimate);
     markEstimate(k,estimate);
     roots[k]=new Set(inferred.dependencies.flatMap(x=>[...roots[x]]));
     calculated[k]=(labels[k]??k)+" = "+format(values[k])+" (combined: "+inferred.label+")"+(estimate?" (estimate)":"");
     added=true;
    }
   }
   if(changed||!added)break;
  }
  if(active("total"))for(const k of ["affected","unaffected"])if(active(k)&&values[k]>values.total&&!close(values[k],values.total))contradict(["total",k],"Contradictory entries: affected or unaffected quantity exceeds total.");
  if(active("total")&&values.total===0){for(const k of ["affectedPct","unaffectedPct","remainingPct"])if(active(k)){if(k in manual)contradict(["total",k],"Percentages are undefined when total quantity is zero.");else {delete values[k];delete calculated[k];}}}
  if(active("days")&&values.days===0&&active("affected")&&values.affected>0)contradict(["days","affected"],"Positive affected count requires a positive measurement period.");
  if(active("daily")&&values.daily===0&&active("affected")&&values.affected>0)contradict(["daily","affected"],"Positive affected count requires a positive frequency.");
  if(active("requiredReminders")&&values.requiredReminders===0&&active("missedReminderPct")){if("missedReminderPct" in manual)contradict(["requiredReminders","missedReminderPct"],"Reminder-event percentage is undefined over zero required events.");else{delete values.missedReminderPct;delete calculated.missedReminderPct;}}
  if(active("target")&&values.target===0&&active("targetPct")){if("targetPct" in manual)contradict(["target","targetPct"],"Percentage of target is undefined when target is zero.");else{delete values.targetPct;delete calculated.targetPct;}}
  if(active("days")&&values.days===0&&active("daily")){if("daily" in manual)contradict(["days","daily"],"Frequency is undefined for a zero measurement period.");else{delete values.daily;delete calculated.daily;}}
  for(const [average,count] of Object.entries(rateDenominators))if(["averageMinutes","averageEventMinutes","moneyAverage"].includes(average)&&active(count)&&values[count]===0&&active(average)){
   if(average in manual)contradict([count,average],(labels[average]??average)+" is undefined when the corresponding population is zero.");
   else{delete values[average];delete calculated[average];}
  }
  if(config.id==="problem-28"&&active("step2:staff-shortfall")&&values["step2:staff-shortfall"]===0&&active("difference")&&values.difference>0)contradict(["step2:staff-shortfall","difference"],"Zero shortfall requires required hours ≤ available hours.");
  // Extra checks belong only to active impact equations; the original problem rules remain unchanged.
  for(const link of localLinks)if(active(link.population)&&active(link.member)&&((link.kind==="subset"&&values[link.member]>values[link.population]&&!close(values[link.member],values[link.population]))||(link.kind==="attributed"&&values[link.population]===0&&values[link.member]>0)))contradict([link.population,link.member],link.label);
  const known=Object.fromEntries(Object.entries(values).filter(([key])=>active(key)));
  for(const constraint of additional?.constraints??[])if(constraint.violated(known))contradict(constraint.keys.filter(active),constraint.message);
  for(const {denominator,rate} of additional?.undefinedRates??[])if(active(denominator)&&values[denominator]===0&&active(rate)){
   if(rate in manual)contradict([denominator,rate],(labels[rate]??"Rate")+" is undefined when "+(labels[denominator]??"the population")+" is zero.");
   else {delete values[rate];delete calculated[rate];}
  }
  if(!changed)break;
 }
 const undefinedKeys=new Set(Object.entries(rateDenominators).filter(([key,count])=>!blocked.has(count)&&values[count]===0&&!(key in manual)).map(([key])=>key));
 if(labels["fin:average-revenue-purchase"]&&values["fin:total-purchases"]===0&&!Number.isFinite(values["fin:average-revenue-purchase"]))undefinedKeys.add("fin:average-revenue-purchase");
 const result:Result={undefinedKeys,values,calculated,errors:[...errors],blocked,estimated:new Set([...estimated].filter(k=>Number.isFinite(values[k])&&!blocked.has(k)))};
 if(precision.includeBounds){
  // Consistent inputs give proactive limits. In a contradiction, use the
  // other constraints to find the range for each conflicting manual entry.
  const known=Object.fromEntries(Object.entries(values).filter(([k])=>!blocked.has(k)));
  const deduction=intervals(known);
  let bounds=deduction.conflicts.length?{}:deduction.bounds;
  if(errors.size)for(const key of Object.keys(raw)){
   if(!labels[key]||raw[key].trim()===""||!blocked.has(key))continue;
   const remaining={...raw};delete remaining[key];
   const exactInputs=new Set(precision.exactInputs??[]);if(integerKeys.has(key)&&!inputEstimated(key))exactInputs.add(key);
   const alternative=solve(config,remaining,additional,{...precision,exactInputs,includeBounds:false});
   if(alternative.errors.length)continue;
   if(Number.isFinite(alternative.values[key])&&!alternative.blocked.has(key)){
    bounds[key]={min:alternative.values[key],max:alternative.values[key],minReason:"Other entered figures determine this value",maxReason:"Other entered figures determine this value"};
    continue;
   }
   // Recompute the range from the remaining data, with that run's actual
   // estimate provenance, not the conflicting run's blocked inputs.
   const allowed=solve(config,remaining,additional,{...precision,exactInputs,includeBounds:true});
   if(allowed.bounds?.[key])bounds[key]=allowed.bounds[key];
  }
  result.bounds=bounds;
 }
 return result;
}
export function format(n:number){return String(Number(n.toPrecision(14)));}
