import type { Config } from "./config";
export type Figures=Record<string,string>;
export type Result={values:Record<string,number>; calculated:Record<string,string>; errors:string[]; blocked:Set<string>};
type Relation={keys:string[]; label:string; derive:(v:Record<string,number>, key:string)=>number|undefined; valid:(v:Record<string,number>)=>boolean};
const close=(a:number,b:number)=>Math.abs(a-b)<=1e-8*Math.max(1,Math.abs(a),Math.abs(b));
const div=(a:number,b:number)=>b===0?undefined:a/b;
function sum(a:string,b:string,c:string,label:string):Relation{return {keys:[a,b,c],label,derive:(v,k)=>k===a?v[b]+v[c]:k===b?v[a]-v[c]:v[a]-v[b],valid:v=>close(v[a],v[b]+v[c])};}
// a = b*c*factor. A zero divisor is indeterminate, never infinity.
function product(a:string,b:string,c:string,factor:number,label:string):Relation{return {keys:[a,b,c],label,derive:(v,k)=>k===a?v[b]*v[c]*factor:k===b?div(v[a],v[c]*factor):div(v[a],v[b]*factor),valid:v=>close(v[a],v[b]*v[c]*factor)};}
function ratio(a:string,b:string,c:string,factor:number,label:string):Relation{return product(a,b,c,factor,label);}
const validValue=(key:string,n:number)=>Number.isFinite(n)&&(key==="difference"||n>=0)&&(!["affectedPct","unaffectedPct"].includes(key)||n<=100);
export function solve(config:Config,raw:Figures):Result{
 const labels=Object.fromEntries(Object.values(config.fields).flat().map(f=>[f.key,f.label]));
 const relations:Relation[]=[];
 if(config.fields.Quantity.length)relations.push(sum("total","affected","unaffected","Total = affected + unaffected"),ratio("affected","total","affectedPct",.01,"Affected = total × affected % ÷ 100"),ratio("unaffected","total","unaffectedPct",.01,"Unaffected = total × unaffected % ÷ 100"),{keys:["affectedPct","unaffectedPct"],label:"Affected % + unaffected % = 100",derive:(v,k)=>100-v[k==="affectedPct"?"unaffectedPct":"affectedPct"],valid:v=>close(v.affectedPct+v.unaffectedPct,100)});
 if(config.timePopulation)relations.push(product("hours",config.timePopulation,"averageMinutes",1/60,"Hours = quantity × average minutes ÷ 60"));
 if(config.fields.Frequency.length)relations.push(product("affected","days","daily",1,"Affected quantity = days × quantity per day"));
 if(config.actualKey)relations.push(sum(config.actualKey,"target","difference","Actual = target + difference"),ratio(config.actualKey,"target","targetPct",.01,"Actual = target × percentage of target ÷ 100"));
 if(config.moneyPopulation)relations.push(product("moneyTotal",config.moneyPopulation,"moneyAverage",1,"Total amount = quantity × average amount"));
 const manual:Record<string,number>={},blocked=new Set<string>(),errors=new Set<string>();
 for(const [k,s] of Object.entries(raw)){if(!labels[k]||s.trim()==="")continue;const n=Number(s);if(!validValue(k,n)){blocked.add(k);errors.add((labels[k]??k)+": invalid value.");}else manual[k]=n;}
 let values:Record<string,number>={},calculated:Record<string,string>={};
 // Rebuild from manual figures after blocking contradictory dependencies.
 for(let round=0;round<50;round++){
  values={...manual};calculated={};
  const roots:Record<string,Set<string>>=Object.fromEntries(Object.keys(manual).map(k=>[k,new Set([k])]));
  const active=(k:string)=>values[k]!==undefined&&!blocked.has(k)&&![...(roots[k]??[])].some(x=>blocked.has(x));
  let changed=false;
  const contradict=(keys:string[],message:string)=>{errors.add(message);for(const k of keys)for(const x of roots[k]??[]){if(!blocked.has(x)){blocked.add(x);changed=true;}}};
  for(let pass=0;pass<50;pass++){
   let added=false;
   for(const rel of relations){
    if(rel.keys.some(k=>blocked.has(k)))continue;
    const missing=rel.keys.filter(k=>!active(k));
    if(missing.length===0){if(!rel.valid(values))contradict(rel.keys,"Contradictory entries: "+rel.label+".");continue;}
    if(missing.length!==1)continue;
    const k=missing[0];if(k in manual||blocked.has(k))continue;
    const known=rel.keys.filter(x=>x!==k);if(!known.every(active))continue;
    const n=rel.derive(values,k);if(n===undefined)continue;
    if(!validValue(k,n)){contradict(known,"Contradictory entries: "+rel.label+".");continue;}
    values[k]=Math.abs(n)<1e-12?0:n;
    roots[k]=new Set(known.flatMap(x=>[...roots[x]]));
    calculated[k]=rel.label+" ("+known.map(x=>(labels[x]??x)+" = "+format(values[x])).join("; ")+") → "+(labels[k]??k)+" = "+format(n);
    added=true;
   }
   if(changed||!added)break;
  }
  if(active("total"))for(const k of ["affected","unaffected"])if(active(k)&&values[k]>values.total&&!close(values[k],values.total))contradict(["total",k],"Contradictory entries: affected or unaffected quantity exceeds total.");
  if(active("total")&&values.total===0){for(const k of ["affectedPct","unaffectedPct"])if(active(k)){if(k in manual)contradict(["total",k],"Percentages are undefined when total quantity is zero.");else {delete values[k];delete calculated[k];}}}
  if(active("target")&&values.target===0&&active("targetPct")){if("targetPct" in manual)contradict(["target","targetPct"],"Percentage of target is undefined when target is zero.");else{delete values.targetPct;delete calculated.targetPct;}}
  if(active("days")&&values.days===0&&active("daily")){if("daily" in manual)contradict(["days","daily"],"Frequency is undefined for a zero measurement period.");else{delete values.daily;delete calculated.daily;}}
  if(!changed)break;
 }
 return {values,calculated,errors:[...errors],blocked};
}
export function format(n:number){return String(Number(n.toPrecision(10)));}
