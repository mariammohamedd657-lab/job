"use client";
import {useState,type ReactNode} from "react";
import type {OperationalPanel} from "./operational-data";
import {format,type Figures,type Result} from "./solver";
import "./operational.css";

function Icon({kind}:{kind:"check"|"link"|"calculator"|"chevron"}){
 const paths:Record<string,ReactNode>={check:<><circle cx="12" cy="12" r="9" fill="currentColor" stroke="none"/><path d="m8 12 3 3 5-6" stroke="#181818"/></>,link:<><path d="m10 13 4-4M8 15l-1 1a3 3 0 0 1-4-4l4-4a3 3 0 0 1 4 0M13 9l1-1a3 3 0 0 1 4 4l-4 4a3 3 0 0 1-4 0"/></>,calculator:<><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 7h8M8 11h1m6 0h1M8 15h1m6 0h1M8 18h1m6 0h1"/></>,chevron:<path d="m6 9 6 6 6-6"/>};
 return <svg className="q-icon" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.7" fill="none" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[kind]}</svg>;
}
type Props={problemId:string;panels:OperationalPanel[];raw:Figures;result:Result;show:boolean;setShow:(value:boolean)=>void;update:(key:string,value:string)=>void;setRaw:(next:Figures)=>void};
export default function OperationalImpacts({problemId,panels,raw,result,show,setShow,update,setRaw}:Props){
 const [collapsed,setCollapsed]=useState<Record<string,boolean>>({});
 if(!panels.length)return <div className="op-empty">No confirmed operational impacts.</div>;
 const resolved=(key:string)=>{
  const manual=raw[key]??"";
  const valid=Number.isFinite(result.values[key])&&!result.blocked.has(key);
  return {value:manual.trim()!==""?manual:valid?format(result.values[key]):"",computed:manual.trim()===""&&valid,valid};
 };
 const example=Object.assign({},...panels.map(p=>p.example??{})) as Figures;
 const reset=()=>{const next={...raw};for(const panel of panels)for(const field of panel.fields)delete next[field.key];setRaw(next);};
 return <div className="op-impact-content">
  <div className="op-confirmed-heading">Confirmed operational impacts</div>
  <div className="op-confirmed-list">{panels.map(p=><div key={p.id}><span className="op-confirmed-check"><Icon kind="check"/></span>{p.name}</div>)}</div>
  <div className="op-impact-panels">{panels.map(panel=>{
    const id=problemId+":"+panel.id,open=!collapsed[id],primary=panel.fields.find(f=>f.primary)!;
    const summary=resolved(panel.primaryKey);
    const state=summary.valid?(panel.estimated?(summary.computed?"Estimated · Automatically calculated":"Estimated · Directly entered"):(summary.computed?"Automatically calculated":"Directly entered")):"Awaiting information";
    return <section className="op-impact-card" key={id} data-impact={panel.id}>
      <button type="button" className="op-impact-toggle" aria-expanded={open} onClick={()=>setCollapsed(old=>({...old,[id]:open}))}><span className="op-result-tick"><Icon kind="check"/></span><span>{panel.name}</span><span className={"q-arrow "+(open?"q-open":"")}><Icon kind="chevron"/></span></button>
      <div className="op-impact-body" hidden={!open}>
        <div className="op-impact-fields">{panel.fields.map(field=>{
          const v=resolved(field.key);
          return <div className="q-field" key={field.key}>
            <label className={field.primary?"op-primary":field.shared?"q-general":""}><span>{field.shared&&<span className="op-linked-icon"><Icon kind="link"/></span>}{field.label}</span><input type="number" step="any" min={0} max={field.unit==="%"?100:undefined} aria-label={field.label} data-quantity={field.key} value={v.value} placeholder="—" className={result.blocked.has(field.key)?"q-invalid":""} onChange={e=>update(field.key,e.target.value)}/><span className="q-unit">{field.unit}</span></label>
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
      </div>
    </section>;
  })}</div>
  {result.errors.length>0&&<div className="q-errors" role="alert">{result.errors.map(e=><div key={e}>{e}</div>)}</div>}
  <div className="q-controls"><label><input type="checkbox" checked={show} onChange={e=>setShow(e.target.checked)}/>Show calculations</label><div><button type="button" onClick={reset}>Reset</button><button type="button" disabled={!Object.keys(example).length} onClick={()=>setRaw({...raw,...example})}>Load example</button></div></div>
 </div>;
}
