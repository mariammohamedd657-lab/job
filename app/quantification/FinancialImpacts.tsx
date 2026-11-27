"use client";
import {useState} from "react";
import {useQuantityRegistry} from "./RegistryContext";
import {fieldReference,instanceState} from "./quantity-identity";
import {numericalTypes,validNumericalValue} from "./canonical-definitions";
import type {ContentField,ContentRoute,ContentOutcome} from "./step2-content";
import NumericalInput,{resolveQuantity} from "./NumericalInput";
import {QuantityLimits} from "./QuantityLimits";
import {format,type Figures,type Result} from "./solver";
import "./step2.css";
export type ContentProps={raw:Figures;result:Result;show:boolean;update:(key:string,value:string)=>void};
function Chevron(){return <svg className="q-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>}
function LinkIcon(){return <svg className="q-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m10 13 4-4M8 15l-1 1a3 3 0 0 1-4-4l4-4a3 3 0 0 1 4 0M13 9l1-1a3 3 0 0 1 4 4l-4 4a3 3 0 0 1-4 0"/></svg>}
function read(field:ContentField,raw:Figures,result:Result,problemId:string){
 const ref=fieldReference(problemId,field),state=instanceState(ref,raw,result);
 const resolved=resolveQuantity(field.key,raw,result),n=Number(resolved.value),entered=resolved.value.trim()!=="";
 const invalid=entered&&(state.contradictory||!Number.isFinite(n)||(!resolved.computed&&!validNumericalValue(ref.type,n)));
 const rule=numericalTypes[ref.type] as {min?:number;max?:number};
 return {...resolved,n,invalid,valid:entered&&!invalid,ref,rule};
}
export function ContentRow({field,primary=false,...props}:ContentProps&{field:ContentField;primary?:boolean}){
 const {raw,result,show,update}=props,problemId=useQuantityRegistry().problemId,v=read(field,raw,result,problemId);
 const labelClass=primary?"op-primary":field.shared==="problem"?"q-general":field.shared?"step2-shared":"";
 return <div className="q-field step2-field"><label className={labelClass}><span>{v.ref.label}</span><NumericalInput step="any" min={v.rule.min} max={v.rule.max} aria-label={v.ref.label} data-quantity={field.key} value={v.value} placeholder="—" className={v.invalid?"q-invalid":v.computed?"q-calculated":""} onValueChange={value=>update(field.key,value)}/><span className="q-unit">{v.ref.unit}</span></label>
 {field.shared&&<div className="step2-shared-note"><LinkIcon/>Shared {field.shared} quantity</div>}
 {result.bounds?.[field.key]?<QuantityLimits quantity={field.key} unit={field.unit} result={result} value={v.value} show={show}/>:(!v.value||v.invalid)&&(v.rule.min!==undefined||v.rule.max!==undefined)&&<div className={"q-limits"+(v.invalid?" q-limits-conflict":"")}>{v.rule.min!==undefined?"Min: "+v.rule.min+(v.ref.unit==="%"?"%":""):""}{v.rule.max!==undefined?(v.rule.min!==undefined?" · ":"")+"Max: "+v.rule.max+(v.ref.unit==="%"?"%":""):""}</div>}
 {v.invalid&&<div className="q-limits q-limits-conflict">Invalid value</div>}{show&&v.computed&&<div className="q-formula">{result.calculated[field.key]}</div>}</div>;
}
export function ContentRoutes({routes,exclude=[],...props}:ContentProps&{routes:ContentRoute[];exclude?:string[]}){
 return <>{routes.map(route=><Route key={route.id} route={route} exclude={exclude} {...props}/>)}</>;
}
function Route({route,exclude,...props}:ContentProps&{route:ContentRoute;exclude:string[]}){
 const [open,setOpen]=useState(false);
 const fields=route.fields.filter(field=>!exclude.includes(field.key));
 return <section className="step2-alternative"><button type="button" className="step2-alt-toggle" aria-expanded={open} onClick={()=>setOpen(!open)}>{route.title}<span className={"q-arrow "+(open?"q-open":"")}><Chevron/></span></button><div className="step2-alt-body" hidden={!open}>{open&&<><div className="step2-fields">{fields.map(field=><ContentRow key={field.key} field={field} {...props}/>)}</div>{props.show&&<div className="q-formula">{route.reference}{route.condition&&<div>{route.condition}</div>}</div>}<ContentRoutes routes={route.children??[]} exclude={[...exclude,...fields.map(f=>f.key)]} {...props}/></>}</div></section>;
}
export function ContentResult({field,name,kind,raw,result,estimated=false}:{field:ContentField;name:string;kind:"operational"|"financial";raw:Figures;result:Result;estimated?:boolean}){
 const problemId=useQuantityRegistry().problemId,v=read(field,raw,result,problemId);
 return <div className={"op-result step2-result result-"+kind}><div className="op-result-row"><span>{name}</span><strong>{v.valid?format(v.n):"—"}</strong><span className="step2-result-unit">{field.unit}</span></div></div>;
}
function SelectedCheck(){return <svg className="q-icon" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.7" fill="none" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9" fill="currentColor" stroke="none"/><path d="m8 12 3 3 5-6" stroke="#181818"/></svg>}
export default function FinancialImpacts({problemId,outcomes,discoverySelections={},...props}:ContentProps&{problemId:string;outcomes:ContentOutcome[];discoverySelections?:Record<string,string[]>}){
 const [filters,setFilters]=useState<Record<string,"All"|"Confirmed"|"Estimated">>({});
 const [collapsed,setCollapsed]=useState<Record<string,boolean>>({});
 const filter=filters[problemId]??"All";
 const selected=new Set(discoverySelections[problemId]??[]);
 const visible=outcomes.filter(outcome=>selected.has(outcome.id)&&(filter==="All"||outcome.kind===filter));
 return <div className="fin-impact-content"><div className="fin-filter" role="group" aria-label="Financial impact filter">{(["All","Confirmed","Estimated"] as const).map(kind=><button type="button" key={kind} aria-pressed={filter===kind} onClick={()=>setFilters(old=>({...old,[problemId]:kind}))}>{kind}</button>)}</div>
 <div className="op-impact-panels">{visible.map(outcome=>{
  const key=problemId+":"+outcome.id,open=!collapsed[key];
  return <section className="op-impact-card fin-card" data-financial-impact={outcome.id} data-applicability={outcome.applicability} data-kind={outcome.kind} key={key}>
   <button type="button" className="op-impact-toggle fin-card-toggle" aria-expanded={open} onClick={()=>setCollapsed(old=>({...old,[key]:open}))}><span className="op-result-tick"><SelectedCheck/></span><span>{outcome.name}</span><span className={"q-arrow "+(open?"q-open":"")}><Chevron/></span></button>
   <div className="op-impact-body fin-card-body" hidden={!open}>
    <div className="op-impact-fields">{outcome.fields.map(field=><ContentRow key={field.key} field={field} primary={field.key===outcome.primary.key} {...props}/>)}</div>
    {props.show&&<div className="q-formula">{outcome.reference}<div>{outcome.condition}</div></div>}
    <div className="op-result-wrap"><ContentResult field={outcome.primary} name={outcome.name} kind="financial" estimated={outcome.kind==="Estimated"} {...props}/></div>
    <ContentRoutes routes={outcome.routes} exclude={outcome.fields.map(f=>f.key)} {...props}/>
   </div></section>;
 })}</div>
 {!visible.length&&<div className="op-empty">No selected financial impacts.</div>}</div>;
}
