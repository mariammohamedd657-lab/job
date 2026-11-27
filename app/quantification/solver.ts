import type { Config } from "./config";
import { algebraicConsequences, type Term } from "./algebra";
import { rangeConsequences, type QuantityBounds, type ComplementRate } from "./ranges";
import { basePopulationLinks, type PopulationLink } from "./information-links";
export type Figures=Record<string,string>;
export type MeasurementEvidence={kind:"exact"|"estimated"|"rounded"|"interval";digits?:number;min?:number;max?:number};
export type EvidenceMap=Record<string,MeasurementEvidence>;
export type Correction={kind:"exact"|"range"|"requires-other-changes"|"unresolved";bounds?:QuantityBounds;message:string};
export type Conflict={keys:string[];message:string};
export type Result={undefinedKeys?:Set<string>;evidence?:EvidenceMap;corrections?:Record<string,Correction>;conflicts?:Conflict[];values:Record<string,number>; calculated:Record<string,string>; errors:string[]; blocked:Set<string>; estimated:Set<string>; bounds?:Record<string,QuantityBounds>};
export type Relation={keys:string[]; label:string; terms?:Term[]; complement?:ComplementRate; operation?:(v:Record<string,number>,key:string)=>string; impossible?:(v:Record<string,number>,key:string)=>boolean; derive:(v:Record<string,number>, key:string)=>number|undefined; valid:(v:Record<string,number>)=>boolean};
const close=(a:number,b:number)=>Math.abs(a-b)<=64*Number.EPSILON*Math.max(1,Math.abs(a),Math.abs(b));
const div=(a:number,b:number)=>b===0?undefined:a/b;
export function sum(a:string,b:string,c:string,label:string):Relation{return {keys:[a,b,c],label,terms:[{coefficient:1,keys:[a]},{coefficient:-1,keys:[b]},{coefficient:-1,keys:[c]}],operation:(v,k)=>k===a?format(v[b])+" + "+format(v[c]):k===b?format(v[a])+" − "+format(v[c]):format(v[a])+" − "+format(v[b]),derive:(v,k)=>k===a?v[b]+v[c]:k===b?v[a]-v[c]:v[a]-v[b],valid:v=>close(v[a],v[b]+v[c])};}
// a = b*c*factor. A zero divisor is indeterminate, never infinity.
export function product(a:string,b:string,c:string,factor:number,label:string):Relation{return {keys:[a,b,c],label,terms:[{coefficient:1,keys:[a]},{coefficient:-factor,keys:[b,c]}],operation:(v,k)=>{const f=factor===1?"":factor===.01?" ÷ 100":factor===1/60?" ÷ 60":" × "+format(factor);const inv=factor===1?"":factor===.01?" × 100":factor===1/60?" × 60":" ÷ "+format(factor);return k===a?format(v[b])+" × "+format(v[c])+f:format(v[a])+" ÷ "+format(v[k===b?c:b])+inv;},impossible:(v,k)=>k!==a&&v[k===b?c:b]===0&&v[a]!==0,derive:(v,k)=>k===a?v[b]*v[c]*factor:k===b?div(v[a],v[c]*factor):div(v[a],v[b]*factor),valid:v=>close(v[a],v[b]*v[c]*factor)};}
function ratio(a:string,b:string,c:string,factor:number,label:string):Relation{return product(a,b,c,factor,label);}
const validValue=(key:string,n:number)=>Number.isFinite(n)&&(key==="difference"||n>=0)&&(!["affectedPct","unaffectedPct","remainingPct","missedReminderPct"].includes(key)||n<=100);
export type AdditionalConstraint={keys:string[];message:string;violated:(values:Record<string,number>)=>boolean};
export type ZeroInference={target:string;dependencies:string[];label:string};
export type AdditionalEquations={positiveParts?:{difference:string;result:string}[];signedKeys?:string[];averageKeys?:string[];fields:{key:string;label:string;unit:string}[];relations:Relation[];constraints?:AdditionalConstraint[];undefinedRates?:{denominator:string;rate:string}[];integerKeys?:string[];estimatedKeys?:string[];populationLinks?:PopulationLink[];inferZeros?:(values:Record<string,number>)=>ZeroInference[]};
// Entered rates and averages are nominal estimates unless explicitly declared exact.
// Actual count fields remain integer-valued when directly entered.
export type PopulationClassification="complete"|"disjoint"|"overlapping"|"unknown"|"incomplete"|"incompatible";
export type PrecisionOptions={evidence?:EvidenceMap;externalBounds?:Readonly<Record<string,QuantityBounds>>;populationClassification?:PopulationClassification;exactInputs?:ReadonlySet<string>;estimatedInputs?:ReadonlySet<string>; includeBounds?:boolean;correctionKey?:string;skipCorrections?:boolean};
export function solve(config:Config,raw:Figures,additional?:AdditionalEquations,precision:PrecisionOptions={}):Result{
 const evidence=precision.evidence??{};
 const externalBounds={...precision.externalBounds};
 for(const [key,entry] of Object.entries(evidence)){
  const value=Number(raw[key]);if(!raw[key]?.trim()||!Number.isFinite(value))continue;
  if(entry.kind!=="rounded"&&entry.kind!=="interval")continue;
  const half=0.5*10**(-Math.max(0,Math.min(12,entry.digits??0)));
  const lo=entry.kind==="rounded"?value-half:entry.min,hi=entry.kind==="rounded"?value+half:entry.max;
  if(lo===undefined||hi===undefined||!Number.isFinite(lo)||!Number.isFinite(hi))continue;
  const prior=externalBounds[key];externalBounds[key]={min:Math.max(prior?.min??-Infinity,lo),max:Math.min(prior?.max??Infinity,hi),minExclusive:prior?.min===lo&&prior.minExclusive,maxExclusive:entry.kind==="rounded"||prior?.max===hi&&prior.maxExclusive};
 }
 const labels=Object.fromEntries([...Object.values(config.fields).flat(),...(additional?.fields??[])].map(f=>[f.key,f.label]));
 if(["disjoint","incomplete"].includes(precision.populationClassification??"")){labels.remaining="Remaining unclassified quantity";labels.remainingPct="Remaining percentage";}
 if(precision.populationClassification==="overlapping"){labels.overlap="Overlap";labels.combined="Unique combined population";}
 const integerKeys=new Set(["intendedBookings","missedBookings","requiredReminders","missedReminders","sentReminders","pendingReminders","reschedulingEvents","affectedInvoices","requiredPayments","missingRecordings","missingOutcomes","missingBoth","requiredUpdates","missedUpdates","completedUpdates","pendingUpdates","overlap","combined", "step2:payments-without-reminders","total","affected","unaffected","remaining","recordedUnits",...(additional?.integerKeys??[])]);
 if(config.actualKey&&integerKeys.has(config.actualKey)){integerKeys.add("target");integerKeys.add("difference");}
 const inherentEstimates=new Set(additional?.estimatedKeys??[]);
 const estimateInputs=new Set([...Object.values(config.fields).flat(),...(additional?.fields??[])].filter(f=>f.unit==="%"||f.key==="averageMinutes"||f.key==="averageEventMinutes"||f.key==="daily"||f.key==="moneyAverage").map(f=>f.key));
 const inputEstimated=(key:string)=>evidence[key]?.kind==="exact"?false:evidence[key]?.kind==="estimated"?true:!precision.exactInputs?.has(key)&&(precision.estimatedInputs?.has(key)||additional?.averageKeys?.includes(key)||estimateInputs.has(key)&&key!=="targetPct"||inherentEstimates.has(key));
 // Only correct machine-precision residue of an exact integral calculation.
 // Never round an estimated count to an integer.
 const nearInteger=(n:number)=>Number.isSafeInteger(Math.round(n))&&Math.abs(n-Math.round(n))<=Math.min(1e-8,8*Number.EPSILON*Math.max(1,Math.abs(n)));
 const isValid=(key:string,n:number,computed=false,estimate=false)=>(additional?.signedKeys?.includes(key)?Number.isFinite(n):validValue(key,n))&&(!additional?.fields.some(f=>f.key===key&&f.unit==="%")||n<=100)&&(!integerKeys.has(key)||(estimate?Math.abs(n)<=Number.MAX_SAFE_INTEGER:computed?nearInteger(n):Number.isSafeInteger(n)));
 const numericValue=(key:string,n:number,estimate:boolean)=>integerKeys.has(key)&&!estimate?Math.round(n):n===0?0:n;

 const classification=precision.populationClassification??"unknown";
 const complete=classification==="complete";
 const disjoint=complete||classification==="disjoint"||classification==="incomplete";
 const compatible=classification!=="incompatible";
 const relations:Relation[]=[];
 const hasFrequency=config.fields.Frequency.length>0;
 if(config.fields.Quantity.length&&compatible){
  relations.push(ratio("affected","total","affectedPct",.01,"Affected = total × affected % ÷ 100"),ratio("unaffected","total","unaffectedPct",.01,"Unaffected = total × unaffected % ÷ 100"));
  if(complete)relations.push(sum("total","affected","unaffected","Total = affected + unaffected"),{keys:["affectedPct","unaffectedPct"],label:"Affected % + unaffected % = 100",terms:[{coefficient:1,keys:["affectedPct"]},{coefficient:1,keys:["unaffectedPct"]},{coefficient:-100,keys:[]}],operation:(v,k)=>"100 − "+format(v[k==="affectedPct"?"unaffectedPct":"affectedPct"]),derive:(v,k)=>100-v[k==="affectedPct"?"unaffectedPct":"affectedPct"],valid:v=>close(v.affectedPct+v.unaffectedPct,100)});
  if((classification==="disjoint"||classification==="incomplete"))relations.push({keys:["total","affected","unaffected","remaining"],label:"Total = affected + unaffected + remaining",terms:[{coefficient:1,keys:["total"]},{coefficient:-1,keys:["affected"]},{coefficient:-1,keys:["unaffected"]},{coefficient:-1,keys:["remaining"]}],derive:(v,k)=>k==="total"?v.affected+v.unaffected+v.remaining:v.total-["affected","unaffected","remaining"].filter(x=>x!==k).reduce((a,x)=>a+v[x],0),valid:v=>close(v.total,v.affected+v.unaffected+v.remaining)});
 }
 if((classification==="disjoint"||classification==="incomplete")&&config.fields.Quantity.length)relations.push(product("remaining","total","remainingPct",.01,"Remaining = total × remaining percentage ÷ 100"),{keys:["affectedPct","unaffectedPct","remainingPct"],label:"Population percentages sum to 100",terms:[{coefficient:1,keys:["affectedPct"]},{coefficient:1,keys:["unaffectedPct"]},{coefficient:1,keys:["remainingPct"]},{coefficient:-100,keys:[]}],derive:(v,k)=>100-["affectedPct","unaffectedPct","remainingPct"].filter(x=>x!==k).reduce((a,x)=>a+v[x],0),valid:v=>close(v.affectedPct+v.unaffectedPct+v.remainingPct,100)});
 if(config.timePopulation)relations.push(product("hours",config.timePopulation,"averageMinutes",1/60,"Hours = quantity × average minutes ÷ 60"));
 if(hasFrequency)relations.push(product("affected","days","daily",1,"Affected quantity = days × quantity per day"));
 if(config.actualKey)relations.push(sum(config.actualKey,"target","difference","Actual = target + difference"),ratio(config.actualKey,"target","targetPct",.01,"Actual = target × percentage of target ÷ 100"),{
  keys:["difference","target","targetPct"],label:"Difference = target × (percentage of target ÷ 100 − 1)",terms:[{coefficient:1,keys:["difference"]},{coefficient:1,keys:["target"]},{coefficient:-.01,keys:["target","targetPct"]}],
  derive:(v,k)=>k==="difference"?v.target*(v.targetPct/100-1):k==="target"?div(v.difference,v.targetPct/100-1):v.target===0?undefined:(1+v.difference/v.target)*100,
  operation:(v,k)=>k==="difference"?format(v.target)+" × ("+format(v.targetPct)+" ÷ 100 − 1)":k==="target"?format(v.difference)+" ÷ ("+format(v.targetPct)+" ÷ 100 − 1)":"(1 + "+format(v.difference)+" ÷ "+format(v.target)+") × 100",
  impossible:(v,k)=>k==="target"&&v.targetPct===100&&v.difference!==0||k==="targetPct"&&v.target===0&&v.difference!==0,
  valid:v=>close(v.difference,v.target*(v.targetPct/100-1))
 });
 if(config.moneyPopulation)relations.push(product("moneyTotal",config.moneyPopulation,"moneyAverage",1,"Total amount = quantity × average amount"));
 if(additional)relations.push(...additional.relations.filter(rel=>rel.keys.every(k=>Object.prototype.hasOwnProperty.call(labels,k))));
 const localLinks:PopulationLink[]=[];
 const subset=(population:string,member:string)=>localLinks.push({population,member,kind:"subset",label:(labels[member]??member)+" cannot exceed "+(labels[population]??population)});
 const linear=(keys:string[],coefficients:number[],label:string):Relation=>({keys,label,terms:keys.map((key,j)=>({coefficient:coefficients[j],keys:[key]})),derive:(v,k)=>-keys.reduce((acc,key,j)=>acc+(key===k?0:coefficients[j]*v[key]),0)/coefficients[keys.indexOf(k)],valid:v=>close(keys.reduce((acc,key,j)=>acc+coefficients[j]*v[key],0),0)});
 const union=(combined:string,a:string,b:string,overlap:string)=>{relations.push(linear([combined,a,b,overlap],[1,-1,-1,1],"Combined population = first + second − overlap"));subset(a,overlap);subset(b,overlap);subset(combined,a);subset(combined,b);};
 if(classification==="overlapping"){union("combined","affected","unaffected","overlap");subset("total","combined");}
 if(config.id==="problem-25"){union("affected","missingRecordings","missingOutcomes","missingBoth");if(compatible)subset("total","affected");}
 if(config.id==="problem-3"){subset("intendedBookings","missedBookings");subset("missedBookings","affected");subset("intendedBookings","total");}
 if(config.id==="problem-12"){relations.push(linear(["requiredReminders","missedReminders","sentReminders","pendingReminders"],[1,-1,-1,-1],"Required events = missed + sent + unclassified"),product("missedReminders","requiredReminders","missedReminderPct",.01,"Missed events = required events × missed event percentage ÷ 100"));subset("requiredReminders","total");subset("missedReminders","affected");}
 if(config.id==="problem-15"){relations.push(product("hours","reschedulingEvents","averageEventMinutes",1/60,"Total rescheduling hours = events × average event minutes ÷ 60"));subset("reschedulingEvents","affected");}
 if(config.id==="problem-22"){subset("total","requiredPayments");subset("requiredPayments","step2:payments-without-reminders");subset("affected","step2:payments-without-reminders");}
 if(config.id==="problem-26"){relations.push(linear(["requiredUpdates","missedUpdates","completedUpdates","pendingUpdates"],[1,-1,-1,-1],"Required updates = missed + completed + unclassified"));subset("requiredUpdates","total");subset("missedUpdates","affected");}
 const complements:ComplementRate[]=relations.flatMap(rel=>rel.complement?[rel.complement]:[]);
 if(config.fields.Quantity.length&&complete)complements.push(
  {population:"total",components:["unaffected"],rate:"affectedPct",label:"Affected rate is the complement of unaffected quantity ÷ total"},
  {population:"total",components:["affected"],rate:"unaffectedPct",label:"Unaffected rate is the complement of affected quantity ÷ total"});
 const algebra=relations.filter(rel=>rel.keys.every(k=>Object.prototype.hasOwnProperty.call(labels,k))).flatMap(rel=>rel.terms?[{keys:rel.keys,label:rel.label,terms:rel.terms}]:[]);
 if(config.id==="problem-28"){
  const key="step2:staff-shortfall";
  relations.push({keys:[key,"difference"],label:"Staff hour shortfall = max(0, required − available)",derive:(v,k)=>k===key?Math.max(0,v.difference):v[key]>0?v[key]:undefined,valid:v=>close(v[key],Math.max(0,v.difference))});
 }
 const timeDenominators:Record<string,string>=config.timePopulation?{averageMinutes:config.timePopulation,...(config.id==="problem-15"?{averageEventMinutes:"reschedulingEvents"}:{})}:{};
 const rateDenominators:Record<string,string>={...timeDenominators,...(config.moneyPopulation?{moneyAverage:config.moneyPopulation}:{}),...(compatible?{affectedPct:"total",unaffectedPct:"total",remainingPct:"total"}:{}),targetPct:"target",daily:"days",...(config.id==="problem-12"?{missedReminderPct:"requiredReminders"}:{}),...Object.fromEntries((additional?.undefinedRates??[]).map(x=>[x.rate,x.denominator]))};
 for(const key of Object.keys(rateDenominators))if(!Object.prototype.hasOwnProperty.call(labels,key)||!Object.prototype.hasOwnProperty.call(labels,rateDenominators[key]))delete rateDenominators[key];
 const baseDomain=(key:string):[number,number]=>[key==="difference"||additional?.signedKeys?.includes(key)?-Infinity:0,["affectedPct","unaffectedPct","remainingPct","missedReminderPct"].includes(key)||additional?.fields.some(f=>f.key===key&&f.unit==="%")?100:Infinity];
 const domain=(key:string):[number,number]=>{const [lo,hi]=baseDomain(key),b=externalBounds[key];return [Math.max(lo,b?.min??-Infinity),Math.min(hi,b?.max??Infinity)];};
 const manual:Record<string,number>={},blocked=new Set<string>(),errors=new Set<string>(),conflicts:Conflict[]=[];
 const report=(keys:string[],message:string)=>{errors.add(message);const sorted=[...new Set(keys)].sort();if(!conflicts.some(c=>c.message===message&&c.keys.join("\\0")===sorted.join("\\0")))conflicts.push({keys:sorted,message});};
 for(const [k,s] of Object.entries(raw)){if(!labels[k]||s.trim()==="")continue;if(evidence[k]?.kind==="rounded"||evidence[k]?.kind==="interval")continue;const n=Number(s);if(!isValid(k,n,false,inputEstimated(k))){blocked.add(k);report([k],(labels[k]??k)+": invalid value.");}else manual[k]=n;}
 let values:Record<string,number>={},calculated:Record<string,string>={},estimated=new Set<string>();
 const intervals=(known:Record<string,number>)=>{
    const links=[...localLinks,...(compatible?basePopulationLinks(config):[]),...(additional?.populationLinks??[]),...(config.fields.Quantity.length&&compatible?[{population:"total",member:"affected",kind:"subset" as const,label:"Affected is contained in total"},{population:"total",member:"unaffected",kind:"subset" as const,label:"Unaffected is contained in total"}]:[])].filter(link=>Object.prototype.hasOwnProperty.call(labels,link.population)&&Object.prototype.hasOwnProperty.call(labels,link.member));
    // Relax the integer domain only for unknown counts in components with an
    // active estimate. A manual actual count is still an exact fixed value.
    // In an exact-only component retain the existing discrete bound inference.
    const estimateReach=new Set(Object.keys(known).filter(k=>estimated.has(k)));
    const connected=[...relations.filter(rel=>!rel.keys.some(k=>blocked.has(k))).map(rel=>rel.keys),...links.filter(link=>!blocked.has(link.population)&&!blocked.has(link.member)).map(link=>[link.population,link.member])];
    let expanded=true;while(expanded){expanded=false;for(const keys of connected)if(keys.some(k=>estimateReach.has(k)))for(const k of keys)if(!estimateReach.has(k)){estimateReach.add(k);expanded=true;}}
    const exactIntegerKeys=new Set([...integerKeys].filter(k=>evidence[k]?.kind==="exact"||precision.exactInputs?.has(k)||!inherentEstimates.has(k)&&!estimateReach.has(k)||k in manual&&!estimated.has(k)));
    return rangeConsequences(algebra,known,blocked,domain,exactIntegerKeys,rateDenominators,links,complements,Object.keys(labels),config.actualKey?{actual:config.actualKey,target:"target",difference:"difference",rate:"targetPct"}:undefined,[...(config.id==="problem-28"?[{difference:"difference",result:"step2:staff-shortfall"}]:[]),...(additional?.positiveParts??[])],externalBounds);

 };
 // Rebuild from manual figures after blocking contradictory dependencies.
 for(let round=0;round<50;round++){
  values={...manual};calculated={};estimated=new Set(Object.keys(manual).filter(inputEstimated));
  const derivesEstimate=(key:string,dependencies:string[])=>evidence[key]?.kind!=="exact"&&!precision.exactInputs?.has(key)&&(inherentEstimates.has(key)||dependencies.some(k=>estimated.has(k)));
  const markEstimate=(key:string,estimate:boolean)=>{if(estimate)estimated.add(key);else estimated.delete(key);};
  const roots:Record<string,Set<string>>=Object.fromEntries(Object.keys(manual).map(k=>[k,new Set([k])]));
  const active=(k:string)=>values[k]!==undefined&&!blocked.has(k)&&![...(roots[k]??[])].some(x=>blocked.has(x));
  let changed=false;
  const contradict=(keys:string[],message:string)=>{const sources=[...new Set(keys.flatMap(k=>[...(roots[k]??[])]))];report(sources,message);for(const x of sources){if(!blocked.has(x)){blocked.add(x);changed=true;}}};
  for(let pass=0;pass<Math.max(50,Object.keys(labels).length*2);pass++){
   let added=false;
   for(const [key,b] of Object.entries(externalBounds))if(active(key)&&((b.min!==undefined&&(values[key]<b.min&&!close(values[key],b.min)||b.minExclusive&&values[key]<=b.min))||(b.max!==undefined&&(values[key]>b.max&&!close(values[key],b.max)||b.maxExclusive&&values[key]>=b.max))))contradict([key],"Cross-problem restriction conflicts with "+(labels[key]??key)+".");
   for(const [average,count] of Object.entries(timeDenominators)){
    if(active(count)&&values[count]===0&&active(average))contradict([count,average],(labels[average]??average)+" is undefined when the corresponding count is zero.");
    if(active(average)&&values[average]===0&&active("hours")&&values.hours>0)contradict([average,"hours"],"Positive total duration cannot have a zero average duration.");
   }
   if(config.actualKey&&active("targetPct")){
    if(active("target")&&values.target===0)contradict(["target","targetPct"],"Percentage of target is undefined when target is zero.");
    if(active("difference")){
     const sign=Math.sign(values.targetPct-100),diffSign=Math.sign(values.difference);
     if(sign!==diffSign)contradict(["difference","targetPct"],"Difference and percentage of target must have matching signs relative to 100%.");
    }
    if(active(config.actualKey)&&((values.targetPct===0&&values[config.actualKey]>0)||(values.targetPct>0&&values[config.actualKey]===0)))contradict([config.actualKey,"targetPct"],"A defined percentage of target requires compatible actual value and a positive target.");
   }
   if(config.moneyPopulation&&active(config.moneyPopulation)&&values[config.moneyPopulation]===0&&active("moneyAverage"))contradict([config.moneyPopulation,"moneyAverage"],"Average amount is undefined for a zero corresponding count.");
   if(config.moneyPopulation&&active("moneyAverage")&&values.moneyAverage===0&&active("moneyTotal")&&values.moneyTotal>0)contradict(["moneyAverage","moneyTotal"],"A positive total amount cannot have a zero average amount.");
   for(const {denominator,rate} of additional?.undefinedRates??[])if(active(denominator)&&values[denominator]===0&&active(rate)&&rate in manual)contradict([denominator,rate],(labels[rate]??rate)+" is undefined when its corresponding denominator is zero.");
   // A specified frequency requires a positive observation period, even when the frequency is zero.
   if(hasFrequency&&active("days")&&values.days===0){
    if(active("daily"))contradict(["days","daily"],"Frequency is undefined for a zero measurement period.");
    if(active("affected")&&values.affected>0)contradict(["days","affected"],"A positive affected quantity requires a positive measurement period.");
   }
   if(hasFrequency&&active("daily")&&values.daily===0&&active("affected")&&values.affected>0)contradict(["daily","affected"],"A positive affected quantity cannot have a zero daily frequency.");
   if(changed)break;
   for(const rel of relations){
    if(changed)break;
    if(rel.keys.some(k=>blocked.has(k)||!Object.prototype.hasOwnProperty.call(labels,k)))continue;
    const productTerm=rel.terms?.length===2?rel.terms.find(t=>t.keys.length>1):undefined;
    const outputTerm=productTerm?rel.terms?.find(t=>t.keys.length===1):undefined;
    if(productTerm&&outputTerm){
     const out=outputTerm.keys[0],zero=productTerm.keys.find(k=>active(k)&&values[k]===0);
     if(zero&&out!==zero){
      if(active(out)&&values[out]!==0){contradict([out,zero],"Contradictory entries: "+rel.label+". A zero factor requires a zero product.");continue;}
      if(!active(out)&&!(out in manual)&&!blocked.has(out)){values[out]=0;markEstimate(out,derivesEstimate(out,[zero]));roots[out]=new Set(roots[zero]);calculated[out]=(labels[out]??out)+" = 0 (zero factor)";added=true;}
     }
    }
    const missing=rel.keys.filter(k=>!active(k));
    if(missing.length===0){if(!rel.valid(values))contradict(rel.keys,"Contradictory entries: "+rel.label+". Entered or derived values: "+rel.keys.map(k=>(labels[k]??k)+" = "+format(values[k])).join("; ")+".");continue;}
    if(missing.length!==1)continue;
    const k=missing[0];if(k in manual||blocked.has(k))continue;
    const known=rel.keys.filter(x=>x!==k);if(!known.every(active))continue;
    if(rel.impossible?.(values,k)){contradict(known,"Contradictory entries: "+rel.label+".");continue;}
    const denominator=rateDenominators[k];if(denominator&&active(denominator)&&values[denominator]===0)continue;
    const n=rel.derive(values,k);if(n===undefined)continue;
    if(config.actualKey&&k==="target"&&n===0&&active("targetPct")){contradict(known,"A defined percentage of target requires a positive target.");continue;}
    if(hasFrequency&&k==="days"&&n===0&&known.includes("daily")){contradict(known,"A defined daily frequency requires a positive measurement period.");continue;}
    if(Object.entries(timeDenominators).some(([average,count])=>count===k&&n===0&&active(average))){contradict(known,"A defined average duration requires a positive corresponding count.");continue;}
    if(config.moneyPopulation===k&&n===0&&active("moneyAverage")){contradict(known,"A defined average amount requires a positive corresponding count.");continue;}
    const estimate=derivesEstimate(k,known);
    if(!isValid(k,n,true,estimate)){contradict(known,"Contradictory entries: "+rel.label+". This would require "+(labels[k]??k)+" = "+format(n)+", outside its permitted numerical domain.");continue;}
    values[k]=numericValue(k,n,estimate);
    markEstimate(k,estimate);
    roots[k]=new Set(known.flatMap(x=>[...roots[x]]));
    calculated[k]=(labels[k]??k)+" = "+(rel.operation?.(values,k)??rel.label)+" = "+format(values[k])+(estimate?" (estimate)":"");
    added=true;
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
     if(config.actualKey&&k==="target"&&inferred.value===0&&active("targetPct")){contradict([...inferred.dependencies,"targetPct"],"A defined percentage of target requires a positive target.");continue;}
     if(hasFrequency&&k==="days"&&inferred.value===0&&active("daily")){contradict([...inferred.dependencies,"daily"],"A defined daily frequency requires a positive measurement period.");continue;}
     if(Object.entries(timeDenominators).some(([average,count])=>count===k&&inferred.value===0&&active(average))){contradict([...inferred.dependencies,...Object.keys(timeDenominators).filter(average=>timeDenominators[average]===k&&active(average))],"A defined average duration requires a positive corresponding count.");continue;}
     if(config.moneyPopulation===k&&inferred.value===0&&active("moneyAverage")){contradict([...inferred.dependencies,"moneyAverage"],"A defined average amount requires a positive corresponding count.");continue;}
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
  if(compatible&&active("total"))for(const k of ["affected","unaffected"])if(active(k)&&values[k]>values.total&&!close(values[k],values.total))contradict(["total",k],"Contradictory entries: affected or unaffected quantity exceeds total.");
  if(disjoint&&active("total")&&active("affected")&&active("unaffected")&&values.affected+values.unaffected>values.total&&!close(values.affected+values.unaffected,values.total))contradict(["total","affected","unaffected"],"Contradictory entries: disjoint quantities exceed total.");
  if(compatible&&active("total")&&values.total===0){for(const k of ["affectedPct","unaffectedPct","remainingPct"])if(active(k)){if(k in manual)contradict(["total",k],"Percentages are undefined when total quantity is zero.");else {delete values[k];delete calculated[k];}}}
  if(active("target")&&values.target===0&&active("targetPct")){if("targetPct" in manual)contradict(["target","targetPct"],"Percentage of target is undefined when target is zero.");else{delete values.targetPct;delete calculated.targetPct;}}
  if(hasFrequency&&active("days")&&values.days===0&&active("daily")){if("daily" in manual)contradict(["days","daily"],"Frequency is undefined for a zero measurement period.");else{delete values.daily;delete calculated.daily;}}
  if(config.id==="problem-12"&&active("requiredReminders")&&values.requiredReminders===0&&active("missedReminderPct")){if("missedReminderPct" in manual)contradict(["requiredReminders","missedReminderPct"],"Reminder-event percentage is undefined for zero required events.");else{delete values.missedReminderPct;delete calculated.missedReminderPct;}}
  for(const [average,count] of Object.entries(timeDenominators))if(active(count)&&values[count]===0&&active(average)){if(average in manual)contradict([count,average],(labels[average]??average)+" is undefined when the corresponding count is zero.");else{delete values[average];delete calculated[average];}}
  // Extra checks belong only to active impact equations; the original problem rules remain unchanged.
  const known=Object.fromEntries(Object.entries(values).filter(([key])=>active(key)));
  for(const constraint of additional?.constraints??[])if(constraint.violated(known))contradict(constraint.keys.filter(active),constraint.message);
  for(const {denominator,rate} of additional?.undefinedRates??[])if(active(denominator)&&values[denominator]===0&&active(rate)){
   if(rate in manual)contradict([denominator,rate],(labels[rate]??"Rate")+" is undefined when "+(labels[denominator]??"the population")+" is zero.");
   else {delete values[rate];delete calculated[rate];}
  }
  if(!changed)break;
 }
 const undefinedKeys=new Set(Object.entries(rateDenominators).filter(([key,denominator])=>!blocked.has(denominator)&&values[denominator]===0).map(([key])=>key));
 const result:Result={undefinedKeys,evidence,values,calculated,errors:[...errors],conflicts,blocked,estimated:new Set([...estimated].filter(k=>Number.isFinite(values[k])&&!blocked.has(k)))};
 if(precision.includeBounds){
  // Consistent inputs give proactive limits. In a contradiction, use the
  // other constraints to find the range for each conflicting manual entry.
  const known=Object.fromEntries(Object.entries(values).filter(([k])=>!blocked.has(k)));
  const deduction=intervals(known);
  let bounds=deduction.conflicts.length?{}:deduction.bounds;
  // Each trial removes exactly one original assertion. Never copy a trial's
  // unrelated bounds back into the original calculation, or privilege edit order.
  const corrections:Record<string,Correction>={};
  if(errors.size&&!precision.skipCorrections)for(const key of Object.keys(raw).sort()){
   if(!labels[key]||raw[key].trim()===""||!blocked.has(key))continue;
   const remaining={...raw};delete remaining[key];
   const correctionExact=new Set(precision.exactInputs??[]);
   if(integerKeys.has(key)&&!inputEstimated(key))correctionExact.add(key);
   const trialEvidence={...evidence};delete trialEvidence[key];
   const trialOptions={...precision,evidence:trialEvidence,exactInputs:correctionExact,includeBounds:false,correctionKey:undefined,skipCorrections:true};
   const alternative=solve(config,remaining,additional,trialOptions);
   if(alternative.errors.length){
    // Distinguish a still-inconsistent connected system from a separate conflict.
    const related=new Set([key]);let expanded=true;
    const connections=[...relations.map(r=>r.keys),...localLinks.map(l=>[l.population,l.member]),...(additional?.populationLinks??[]).map(l=>[l.population,l.member]),...(additional?.constraints??[]).map(c=>c.keys)];
    while(expanded){expanded=false;for(const group of connections)if(group.some(k=>related.has(k)))for(const k of group)if(!related.has(k)){related.add(k);expanded=true;}}
    if((alternative.conflicts??[]).some(c=>c.keys.some(k=>related.has(k)))){
     corrections[key]={kind:"requires-other-changes",message:"Changing this quantity alone cannot resolve the connected contradiction. At least one other entry must also change."};delete bounds[key];continue;
    }
    // Independent contradictions do not prevent correction of this component.
   }
   if(Number.isFinite(alternative.values[key])&&!alternative.blocked.has(key)){
    const value=alternative.values[key];
    const check=solve(config,{...remaining,[key]:String(value)},additional,trialOptions);
    if(!check.blocked.has(key)&&!(check.conflicts??[]).some(c=>c.keys.includes(key))){
     const b:QuantityBounds={min:value,max:value,minQuality:"exact",maxQuality:"exact",minReason:"Other entered figures determine this value",maxReason:"Other entered figures determine this value"};
     bounds[key]=b;corrections[key]={kind:"exact",bounds:b,message:"If all other relevant entries remain unchanged, this quantity must equal "+format(value)+"."};continue;
    }
   }
   const allowed=solve(config,remaining,additional,{...trialOptions,includeBounds:true});
   const b=allowed.bounds?.[key];
   if(b&&(b.min!==undefined||b.max!==undefined)&&!allowed.blocked.has(key)){
    bounds[key]=b;corrections[key]={kind:"range",bounds:b,message:"If the other relevant entries remain unchanged, this quantity must satisfy these restrictions. Conservative bounds do not guarantee that every value is feasible."};
   }else{
    delete bounds[key];corrections[key]={kind:"unresolved",message:"No single numerical correction has been established. Additional information or changes may be required."};
   }
  }
  result.corrections=corrections;
  for(const [key,b] of Object.entries(externalBounds)){const local=bounds[key];const min=Math.max(local?.min??-Infinity,b.min??-Infinity),max=Math.min(local?.max??Infinity,b.max??Infinity);bounds[key]={...local,min:Number.isFinite(min)?min:undefined,max:Number.isFinite(max)?max:undefined,minExclusive:!!(local?.min===min&&local.minExclusive||b.min===min&&b.minExclusive),maxExclusive:!!(local?.max===max&&local.maxExclusive||b.max===max&&b.maxExclusive),minReason:b.minReason??local?.minReason,maxReason:b.maxReason??local?.maxReason};}
  result.bounds=bounds;
 }
 return result;
}
export function format(n:number){return Number.isFinite(n)?String(Number(n.toPrecision(15))):"—";}
