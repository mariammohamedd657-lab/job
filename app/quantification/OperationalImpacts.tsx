"use client";
import {useState,type ReactNode} from "react";
import type {OperationalPanel} from "./operational-data";
import {configs} from "./config";
import {ContentRoutes,ContentResult,ContentRow} from "./FinancialImpacts";
import {operationalAlternatives,shortfallField,shortfallRoute,routeFields} from "./step2-content";
import {format,type Figures,type Result} from "./solver";
import NumericalInput, {resolveQuantity} from "./NumericalInput";
import { QuantityLimits } from "./QuantityLimits";
import "./operational.css";

function Icon({kind}:{kind:"check"|"link"|"calculator"|"chevron"}){
 const paths:Record<string,ReactNode>={check:<><circle cx="12" cy="12" r="9" fill="currentColor" stroke="none"/><path d="m8 12 3 3 5-6" stroke="#181818"/></>,link:<><path d="m10 13 4-4M8 15l-1 1a3 3 0 0 1-4-4l4-4a3 3 0 0 1 4 0M13 9l1-1a3 3 0 0 1 4 4l-4 4a3 3 0 0 1-4 0"/></>,calculator:<><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 7h8M8 11h1m6 0h1M8 15h1m6 0h1M8 18h1m6 0h1"/></>,chevron:<path d="m6 9 6 6 6-6"/>};
 return <svg className="q-icon" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.7" fill="none" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[kind]}</svg>;
}
type Props={loadExample:(values:Figures)=>void;finalizedBuyers:boolean;setFinalizedBuyers:(value:boolean)=>void;finalizedTasks:boolean;setFinalizedTasks:(value:boolean)=>void;finalizedSlots:boolean;setFinalizedSlots:(value:boolean)=>void;shortfall:boolean;setShortfall:(value:boolean)=>void;problemId:string;panels:OperationalPanel[];raw:Figures;result:Result;show:boolean;setShow:(value:boolean)=>void;update:(key:string,value:string)=>void;setRaw:(next:Figures)=>void};
export default function OperationalImpacts({problemId,panels,raw,result,show,setShow,update,setRaw,loadExample,shortfall,setShortfall,finalizedSlots,setFinalizedSlots,finalizedBuyers,setFinalizedBuyers,finalizedTasks,setFinalizedTasks}:Props){
 const [collapsed,setCollapsed]=useState<Record<string,boolean>>({});
 const [shortfallOpen,setShortfallOpen]=useState(true);
 const config=configs.find(c=>c.id===problemId)!;
 if(!panels.length&&problemId!=="problem-28")return <div className="op-empty">No confirmed operational impacts.</div>;
 const resolved=(key:string)=>resolveQuantity(key,raw,result);
 const example=Object.assign({},...panels.map(p=>p.example??{})) as Figures;
 const reset=()=>{const next={...raw};for(const panel of panels)for(const field of [...panel.fields,...routeFields(operationalAlternatives(config,panel.id))])if(!("shared" in field)||!field.shared||panel.fields.some(f=>f.key===field.key))delete next[field.key];if(problemId==="problem-28")delete next[shortfallField.key];setRaw(next);};
 return <div className="op-impact-content">
  <div className="op-confirmed-heading">Confirmed operational impacts</div>
  <div className="op-confirmed-list">{panels.map(p=><div key={p.id}><span className="op-confirmed-check"><Icon kind="check"/></span>{p.name}</div>)}</div>
  {problemId==="problem-28"&&<label className="step2-op-option"><input type="checkbox" className="step2-check" checked={shortfall} onChange={e=>setShortfall(e.target.checked)}/>Staff hour shortfall</label>}
  <div className="op-impact-panels">{panels.map(panel=>{
    const id=problemId+":"+panel.id,open=!collapsed[id],primary=panel.fields.find(f=>f.primary)!;
    const summary=resolved(panel.primaryKey);
    const state=summary.valid?((panel.estimated||result.estimated.has(panel.primaryKey))?(summary.computed?"Estimated · Automatically calculated":"Estimated · Directly entered"):(summary.computed?"Automatically calculated":"Directly entered")):"Awaiting information";
    return <section className="op-impact-card" key={id} data-impact={panel.id}>
      <button type="button" className="op-impact-toggle" aria-expanded={open} onClick={()=>setCollapsed(old=>({...old,[id]:open}))}><span className="op-result-tick"><Icon kind="check"/></span><span>{panel.name}</span><span className={"q-arrow "+(open?"q-open":"")}><Icon kind="chevron"/></span></button>
      <div className="op-impact-body" hidden={!open}>
        {panel.id==="negative-operational-unused-appointment-slots"&&<label className="step2-op-option"><input type="checkbox" className="step2-check" checked={finalizedSlots} onChange={e=>setFinalizedSlots(e.target.checked)}/>All affected slots are finally classified as filled or unused</label>}
        {panel.id==="negative-operational-fewer-customers-served"&&<label className="step2-op-option"><input type="checkbox" className="step2-check" checked={finalizedBuyers} onChange={e=>setFinalizedBuyers(e.target.checked)}/>All affected buyers are classified as subsequently served or unserved</label>}
        {panel.id==="negative-operational-fewer-tasks-completed"&&<label className="step2-op-option"><input type="checkbox" className="step2-check" checked={finalizedTasks} onChange={e=>setFinalizedTasks(e.target.checked)}/>All affected tasks are classified as completed or incomplete</label>}
        <div className="op-impact-fields">{panel.fields.map(field=>{
          const v=resolved(field.key);
          return <div className="q-field" key={field.key}>
            <label className={field.primary?"op-primary":field.shared?"q-general":""}><span>{field.shared&&<span className="op-linked-icon"><Icon kind="link"/></span>}{field.label}</span><NumericalInput step="any" min={0} max={field.unit==="%"?100:undefined} aria-label={field.label} data-quantity={field.key} value={v.value} placeholder="—" className={result.blocked.has(field.key)?"q-invalid":""} onValueChange={value=>update(field.key,value)}/><span className="q-unit">{field.unit}</span></label>
            <QuantityLimits quantity={field.key} unit={field.unit} result={result} value={v.value} show={show}/>
            {v.computed&&<div className="op-auto"><Icon kind="calculator"/>Automatically calculated</div>}
            {show&&v.computed&&<div className="q-formula">{result.calculated[field.key]}</div>}
          </div>;
        })}</div>
        {!panel.verified&&<p className="op-pending">Supporting quantities and calculations pending approved configuration.</p>}
        <div className="op-result-wrap"><div className="op-result">
          <div>Quantified negative operational impact</div>
          <div className="op-result-row"><span>{primary.label}</span><strong>{summary.valid?format(result.values[panel.primaryKey]):"—"}</strong><span>{primary.unit}</span></div>
          <div>{state}</div>
        </div></div>
        <ContentRoutes routes={operationalAlternatives(config,panel.id)} exclude={panel.fields.map(f=>f.key)} {...{raw,result,show,update}}/>
      </div>
    </section>;
  })}</div>
  {problemId==="problem-28"&&shortfall&&<section className="op-impact-card step2-shortfall" data-step2-impact="shortfall"><button type="button" className="op-impact-toggle" aria-expanded={shortfallOpen} onClick={()=>setShortfallOpen(!shortfallOpen)}><span className="op-result-tick"><Icon kind="check"/></span>Staff hour shortfall<span className={"q-arrow "+(shortfallOpen?"q-open":"")}><Icon kind="chevron"/></span></button>{shortfallOpen&&<div className="op-impact-body"><div className="step2-fields">{shortfallRoute.fields.map(field=><ContentRow key={field.key} field={field} primary={field.key===shortfallField.key} {...{raw,result,show,update}}/>)}</div>{show&&<div className="q-formula">{shortfallRoute.reference}<div>{shortfallRoute.condition}</div></div>}<ContentResult field={shortfallField} name="Staff hour shortfall" kind="operational" {...{raw,result}}/></div>}</section>}
  {result.errors.length>0&&<div className="q-errors" role="alert">{result.errors.map(e=><div key={e}>{e}</div>)}</div>}
  <div className="q-controls"><label><input type="checkbox" checked={show} onChange={e=>setShow(e.target.checked)}/>Show calculations</label><div><button type="button" onClick={reset}>Reset</button><button type="button" disabled={!Object.keys(example).length} onClick={()=>loadExample(example)}>Load example</button></div></div>
 </div>;
}
