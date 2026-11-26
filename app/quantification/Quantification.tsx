"use client";
import { useState, type ReactNode } from "react";
import { configs, sectionOrder, type Section, type Field } from "./config";
import { solve, format, type Figures } from "./solver";
import "./quantification.css";
export function QuantIcon({name}:{name:string}){
 const paths:Record<string,ReactNode>={calculator:<><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 7h8M8 11h1m6 0h1M8 15h1m6 0h1M8 18h1m6 0h1"/></>,down:<path d="m3 6 6 6 4-4 8 8m-5 0h5v-5"/>,up:<path d="m3 18 6-6 4 4 8-8m-5 0h5v5"/>,wallet:<><path d="M20 8V5H5a2 2 0 0 0-2 2v12h17v-4M3 8h17"/><rect x="14" y="10" width="8" height="6" rx="2"/><path d="M17 13h.1"/></>,lock:<><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></>,unlock:<><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 7-2"/></>,chevron:<path d="m6 9 6 6 6-6"/>,check:<><circle cx="12" cy="12" r="9" fill="currentColor" stroke="none"/><path d="m8 12 3 3 5-6" stroke="#181818"/></>};
 return <svg className="q-icon" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.7" fill="none" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}
const panels=[["Problem quantification","calculator","purple"],["Negative operational impacts","down","yellow"],["Negative financial impacts","down","blue"],["Positive operational outcomes","up","yellow"],["Positive financial outcomes","up","blue"],["Investment and financial requirements","wallet","green"]];
function Calculator(){
 const [selected,setSelected]=useState(configs[0].id);
 const [figures,setFigures]=useState<Record<string,Figures>>({});
 const [sectionStates,setSectionStates]=useState<Record<string,Partial<Record<Section,boolean>>>>({});
 const [show,setShow]=useState(false);
 const c=configs.find(x=>x.id===selected)!;
 const raw=figures[selected]??{};
 const result=solve(c,raw);
 const setRaw=(next:Figures)=>setFigures(old=>({...old,[selected]:next}));
 const update=(key:string,value:string)=>setFigures(old=>({...old,[selected]:{...old[selected],[key]:value}}));
 const row=(f:Field)=>{const manual=raw[f.key]??"";const computed=manual.trim()===""&&result.calculated[f.key]!==undefined&&!result.blocked.has(f.key);const value=manual.trim()!==""?manual:computed?format(result.values[f.key]):"";return <div className="q-field" key={f.key}><label className={f.general?"q-general":""}><span>{f.label}</span><input type="number" step="any" min={f.key==="difference"?undefined:0} max={f.key==="affectedPct"||f.key==="unaffectedPct"?100:undefined} aria-label={f.label} data-quantity={f.key} className={computed?"q-calculated":result.blocked.has(f.key)?"q-invalid":""} value={value} placeholder="—" onChange={e=>update(f.key,e.target.value)}/><span className="q-unit">{f.unit}</span></label>{show&&computed&&<div className="q-formula">{result.calculated[f.key]}</div>}</div>};
 const p=result.values.affectedPct,u=result.values.unaffectedPct;
 const bar=p!==undefined&&u!==undefined&&!result.blocked.has("affectedPct")&&!result.blocked.has("unaffectedPct")&&Math.abs(p+u-100)<.001;
 return <div className="q-calculator"><h2>Business problem quantification</h2><label className="q-select-label" htmlFor="q-problem">Select a business problem</label><div className="q-select-wrap"><select id="q-problem" value={selected} onChange={e=>setSelected(e.target.value)}>{[...new Set(configs.map(x=>x.category))].map(cat=><optgroup label={cat} key={cat}>{configs.filter(x=>x.category===cat).map(x=><option key={x.id} value={x.id}>{x.name}</option>)}</optgroup>)}</select><QuantIcon name="chevron"/></div><div className="q-meta"><span>{c.category}</span><span>{sectionOrder.filter(s=>c.fields[s].length).length} of 5 sections available</span></div>
 <div className="q-indicators">{sectionOrder.map(s=><span key={s} className={c.fields[s].length?"q-available":"q-locked"}><QuantIcon name={c.fields[s].length?"unlock":"lock"}/>{s}</span>)}</div>
 <div className="q-sections">{sectionOrder.map(s=>{const fields=c.fields[s];const open=sectionStates[selected]?.[s]??true;return <section key={s} className={"q-section "+(!fields.length?"q-disabled":"")} data-section={s}><button type="button" className="q-section-header" disabled={!fields.length} aria-expanded={!!fields.length&&open} onClick={()=>setSectionStates(old=>({...old,[selected]:{...old[selected],[s]:!open}}))}><QuantIcon name={fields.length?"unlock":"lock"}/><span>{s}</span>{fields.length?<span className={"q-arrow "+(open?"q-open":"")}><QuantIcon name="chevron"/></span>:<span className="q-na">Not applicable</span>}</button>{fields.length>0&&<div className="q-fields" hidden={!open}>{fields.map(row)}{s==="Quantity"&&bar&&<div className="q-percentage" aria-label="Affected and unaffected percentages"><div className="q-percentage-bar"><span style={{width:p+"%"}}/><span style={{width:u+"%"}}/></div><div className="q-meta"><span>{format(p)}% affected</span><span>{format(u)}% unaffected</span></div></div>}</div>}</section>})}</div>
 {result.errors.length>0&&<div className="q-errors" role="alert">{result.errors.map(e=><div key={e}>{e}</div>)}</div>}
 <div className="q-controls"><label><input type="checkbox" checked={show} onChange={e=>setShow(e.target.checked)}/>Show calculations</label><div><button type="button" onClick={()=>setRaw({})}>Reset</button><button type="button" onClick={()=>setRaw({...c.example})}>Load example</button></div></div>
 <p className="q-note">Green values are calculated automatically. Figures entered manually are preserved when switching problems. Example figures are hypothetical.</p></div>;
}
export default function Quantification(){
 const [open,setOpen]=useState<boolean[]>([true,false,false,false,false,false]);
 return <main className="q-page"><h1>Quantification</h1><div className="q-panels">{panels.map(([title,icon,tone],i)=><section className={"q-panel q-"+tone} key={title}><button className="q-panel-header" aria-expanded={open[i]} onClick={()=>setOpen(old=>old.map((v,j)=>j===i?!v:v))}><QuantIcon name={icon}/><span>{title}</span>{i===0&&<span className="q-complete"><QuantIcon name="check"/></span>}<span className={"q-arrow "+(open[i]?"q-open":"")}><QuantIcon name="chevron"/></span></button><div className="q-panel-content" hidden={!open[i]}>{i===0?<Calculator/>:<div className="q-placeholder"><div>To be developed</div><p>The quantities and calculations for this section have not been approved yet.</p></div>}</div></section>)}</div></main>;
}
