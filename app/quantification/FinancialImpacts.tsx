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
 {v.invalid&&<div className="q-limits q-limits-conflict">Invalid value</div>}{v.computed&&<div className="op-auto">Automatically calculated</div>}{show&&v.computed&&<div className="q-formula">{result.calculated[field.key]}</div>}</div>;
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
 return <div className="op-result step2-result"><div>Quantified negative {kind} impact</div><div className="op-result-row"><span>{name}</span><strong>{v.valid?format(v.n):"—"}</strong>{v.valid&&<span className="step2-result-unit">{field.unit}</span>}</div><div>{v.valid?((estimated||field.estimated||result.estimated.has(field.key)?"Estimated · ":"")+(v.computed?"Automatically calculated":"Directly entered")):"Awaiting information"}</div></div>;
}
export default function FinancialImpacts({problemId,outcomes,matchedVariableCost,setMatchedVariableCost,newBuyerMatch,setNewBuyerMatch,matchedBuyerCosts,setMatchedBuyerCosts,costFlags,setCostFlag,...props}:ContentProps&{problemId:string;outcomes:ContentOutcome[];matchedVariableCost?:boolean;setMatchedVariableCost?:(value:boolean)=>void;newBuyerMatch?:boolean;setNewBuyerMatch?:(value:boolean)=>void;matchedBuyerCosts?:boolean;setMatchedBuyerCosts?:(value:boolean)=>void;costFlags?:Record<string,boolean>;setCostFlag?:(key:string,value:boolean)=>void}){
 const [filters,setFilters]=useState<Record<string,"All"|"Confirmed"|"Estimated">>({});
 const [selected,setSelected]=useState<Record<string,boolean>>({});
 const [collapsed,setCollapsed]=useState<Record<string,boolean>>({});
 const filter=filters[problemId]??"All";
 return <div className="fin-impact-content"><div className="fin-filter" role="group" aria-label="Financial impact filter">{(["All","Confirmed","Estimated"] as const).map(kind=><button type="button" key={kind} aria-pressed={filter===kind} onClick={()=>setFilters(old=>({...old,[problemId]:kind}))}>{kind}</button>)}</div>
 {(["Confirmed","Estimated"] as const).filter(kind=>filter==="All"||filter===kind).map(kind=>{
  const group=outcomes.filter(outcome=>outcome.kind===kind);
  return group.length>0&&<div className="fin-group" key={kind}><div className="op-confirmed-heading">{kind} financial impacts</div><div className="op-impact-panels">{group.map(outcome=>{
   const key=problemId+":"+outcome.id,checked=!!selected[key],open=checked&&!collapsed[key],v=read(outcome.primary,props.raw,props.result,problemId);
   return <section className="fin-card" data-financial-impact={outcome.id} data-applicability={outcome.applicability} key={key}><div className="fin-card-head"><input type="checkbox" className="fin-check" aria-label={"Select "+outcome.name} checked={checked} onChange={e=>{const value=e.target.checked;setSelected(old=>({...old,[key]:value}));if(value)setCollapsed(old=>({...old,[key]:false}));}}/><button type="button" className="fin-card-toggle" aria-expanded={open} onClick={()=>{if(!checked){setSelected(old=>({...old,[key]:true}));setCollapsed(old=>({...old,[key]:false}));}else setCollapsed(old=>({...old,[key]:open}));}}><span>{outcome.name}</span><span className="fin-mini-result">{checked&&v.valid?format(v.n):"—"}</span><span className={"q-arrow "+(open?"q-open":"")}><Chevron/></span></button></div>
   {open&&<div className="fin-card-body"><p className="fin-note">{kind==="Confirmed"?"Use only when the financial consequence is confirmed.":"Use only when the financial consequence is estimated."}</p><div className="step2-fields">{outcome.fields.map(field=><ContentRow key={field.key} field={field} primary={field.key===outcome.primary.key} {...props}/>)}</div>{props.show&&<div className="q-formula">{outcome.reference}<div>{outcome.condition}</div></div>}<ContentResult field={outcome.primary} name={outcome.name} kind="financial" estimated={kind==="Estimated"} {...props}/>{outcome.id==="F2"&&<label className="step2-op-option"><input type="checkbox" checked={matchedVariableCost??false} onChange={e=>setMatchedVariableCost?.(e.target.checked)}/>Average avoided variable cost matches the variable cost applicable to these purchases</label>}{outcome.id==="F7"&&outcome.routes.some(route=>route.children?.some(child=>child.id==="new-buyers"))&&<label className="step2-op-option"><input type="checkbox" checked={newBuyerMatch??false} onChange={e=>setNewBuyerMatch?.(e.target.checked)}/>Potential new buyers lost are exactly the same financial buyer population</label>}{outcome.id==="F8"&&<label className="step2-op-option"><input type="checkbox" checked={matchedBuyerCosts??false} onChange={e=>setMatchedBuyerCosts?.(e.target.checked)}/>Historical average variable cost matches applicable avoided cost per buyer</label>}{(outcome.id==="F3"||outcome.id==="F9"||outcome.id==="F4")&&<div>{(outcome.id==="F4"?[["wastedComplete","Wasted cost categories form a complete, nonoverlapping breakdown"],["paidLeadContainment","Paid lost leads are contained in the reference paid acquisition population"]]:outcome.id==="F9"?[["estimatedGrossComplete","Estimated gross categories form a complete, nonoverlapping breakdown"],["estimatedNetComplete","Estimated signed category changes cover the entire net cost change"],["estimatedSimpleInterest","Simple interest on a 365-day basis"],["shareEstimatedAverages","Actual reference averages apply to these estimated cost populations"]]:[["grossComplete","Gross cost categories form a complete, nonoverlapping breakdown (exclude duplicated collection staffing)"],["netComplete","Signed category changes cover the entire compatible net cost change"],["simpleInterest","Simple interest on a 365-day basis"]]).map(([key,label])=><label key={key} className="step2-op-option"><input type="checkbox" checked={costFlags?.[key]??(key==="simpleInterest"||key==="estimatedSimpleInterest")} onChange={e=>setCostFlag?.(key,e.target.checked)}/>{label}</label>)}</div>}{outcome.id==="F5"&&outcome.routes.some(r=>r.id==="affected-invoice-context")&&<div>{[["overdueInvoiceMatch","Additional unpaid invoices are exactly the same invoices not paid on time"],["overdueInvoiceContainment","Additional unpaid invoices are contained in the relevant overdue invoice population"]].map(([key,label])=><label key={key} className="step2-op-option"><input type="checkbox" checked={costFlags?.[key]??false} onChange={e=>setCostFlag?.(key,e.target.checked)}/>{label}</label>)}</div>}<ContentRoutes routes={outcome.routes} exclude={outcome.fields.map(f=>f.key)} {...props}/></div>}</section>;
  })}</div></div>;
 })}
 {props.result.errors.length>0&&<div className="q-errors" role="alert">{props.result.errors.map(error=><div key={error}>{error}</div>)}</div>}
 {!outcomes.some(outcome=>filter==="All"||outcome.kind===filter)&&<div className="op-empty">No applicable financial impacts.</div>}</div>;
}
