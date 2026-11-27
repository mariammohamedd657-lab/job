"use client";
import { useState, type ReactNode } from "react";
import {QuantityRegistryProvider} from "./RegistryContext";
import { configs, sectionOrder, type Section, type Field } from "./config";
import { solve, format, type Figures, type PopulationClassification } from "./solver";
import { quantificationStatus } from "./status";
import ProblemSelector from "./ProblemSelector";
import OperationalImpacts from "./OperationalImpacts";
import FinancialImpacts,{ContentRoutes} from "./FinancialImpacts";
import {financialContent,baseSupplementalRoutes,baseScopeNotes,routeFields} from "./step2-content";
import NumericalInput, { resolveQuantity } from "./NumericalInput";
import { QuantityLimits } from "./QuantityLimits";
import { operationalPanels, operationalEquations } from "./operational-data";
import type { Config } from "./config";
import type { Result } from "./solver";
import "./quantification.css";
export function QuantIcon({name}:{name:string}){
 const paths:Record<string,ReactNode>={calculator:<><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 7h8M8 11h1m6 0h1M8 15h1m6 0h1M8 18h1m6 0h1"/></>,down:<path d="m3 6 6 6 4-4 8 8m-5 0h5v-5"/>,up:<path d="m3 18 6-6 4 4 8-8m-5 0h5v5"/>,wallet:<><path d="M20 8V5H5a2 2 0 0 0-2 2v12h17v-4M3 8h17"/><rect x="14" y="10" width="8" height="6" rx="2"/><path d="M17 13h.1"/></>,lock:<><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></>,unlock:<><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 7-2"/></>,chevron:<path d="m6 9 6 6 6-6"/>,check:<><circle cx="12" cy="12" r="9" fill="currentColor" stroke="none"/><path d="m8 12 3 3 5-6" stroke="#181818"/></>};
 return <svg className="q-icon" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.7" fill="none" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}
const panels=[["Problem quantification","calculator","purple"],["Negative operational impacts","down","yellow"],["Negative financial impacts","down","blue"],["Positive operational outcomes","up","yellow"],["Positive financial outcomes","up","blue"],["Investment and financial requirements","wallet","green"]];
type CalculatorProps={selected:string;setSelected:(id:string)=>void;c:Config;raw:Figures;result:Result;statuses:Record<string,ReturnType<typeof quantificationStatus>>;setRaw:(next:Figures)=>void;update:(key:string,value:string)=>void;show:boolean;setShow:(value:boolean)=>void;classification:PopulationClassification;setClassification:(value:PopulationClassification)=>void};
function Calculator({selected,setSelected,c,raw,result,statuses,setRaw,update,show,setShow,classification,setClassification}:CalculatorProps){
 const [sectionStates,setSectionStates]=useState<Record<string,Partial<Record<Section,boolean>>>>({});
 // Resolve each quantity once per problem. Every occurrence uses the same actual
 // input value, whether entered directly or calculated in another section.
 const displayedValues=Object.fromEntries([...new Set(Object.values(c.fields).flat().map(f=>f.key))].map(key=>[key,resolveQuantity(key,raw,result)]));
 const row=(f:Field)=>{const {value,computed}=displayedValues[f.key];return <div className="q-field" key={f.key}><label className={f.general?"q-general":""}><span>{f.label}</span><NumericalInput key={selected+":"+f.key} step="any" min={f.key==="difference"?undefined:0} max={f.unit==="%"&&f.key!=="targetPct"?100:undefined} aria-label={f.label} data-quantity={f.key} className={computed?"q-calculated":result.blocked.has(f.key)?"q-invalid":""} value={value} placeholder="—" onValueChange={value=>update(f.key,value)}/><span className="q-unit">{f.unit}</span></label><QuantityLimits quantity={f.key} unit={f.unit} result={result} value={value} show={show}/>{show&&computed&&<div className="q-formula">{result.calculated[f.key]}</div>}</div>};
 const p=result.values.affectedPct,u=result.values.unaffectedPct;
 const bar=classification==="complete"&&p!==undefined&&u!==undefined&&!result.blocked.has("affectedPct")&&!result.blocked.has("unaffectedPct")&&Math.abs(p+u-100)<.001;
 return <div className="q-calculator"><h2>Business problem quantification</h2><label className="q-select-label" id="q-problem-label" htmlFor="q-problem">Select a business problem</label><ProblemSelector selected={selected} statuses={statuses} onChange={setSelected}/><div className="q-meta"><span>{c.category}</span><span>{sectionOrder.filter(s=>c.fields[s].length).length} of 5 sections available</span></div>
 <div className="q-indicators">{sectionOrder.map(s=><span key={s} className={c.fields[s].length?"q-available":"q-locked"}><QuantIcon name={c.fields[s].length?"unlock":"lock"}/>{s}</span>)}</div>
 <div className="q-sections">{sectionOrder.map(s=>{const fields=c.fields[s];const open=sectionStates[selected]?.[s]??true;return <section key={s} className={"q-section "+(!fields.length?"q-disabled":"")} data-section={s}><button type="button" className="q-section-header" disabled={!fields.length} aria-expanded={!!fields.length&&open} onClick={()=>setSectionStates(old=>({...old,[selected]:{...old[selected],[s]:!open}}))}><QuantIcon name={fields.length?"unlock":"lock"}/><span>{s}</span>{fields.length?<span className={"q-arrow "+(open?"q-open":"")}><QuantIcon name="chevron"/></span>:<span className="q-na">Not applicable</span>}</button>{fields.length>0&&<div className="q-fields" hidden={!open}>{fields.map(row)}{s==="Quantity"&&<details className="step2-alternative"><summary className="step2-alt-toggle">Population classification</summary><div className="step2-alt-body"><label>Classification of the same measured population<select aria-label="Population classification" value={classification} onChange={e=>setClassification(e.target.value as PopulationClassification)}><option value="unknown">Individual containment only</option><option value="complete">Complete and mutually exclusive</option><option value="disjoint">Mutually exclusive, completeness unknown</option><option value="incomplete">Incomplete, mutually exclusive (remaining category)</option><option value="incompatible">Different populations or counting units</option><option value="overlapping">May overlap</option></select></label></div></details>}<ContentRoutes key={selected+":"+s} routes={s==="Quantity"?classification==="incomplete"?baseSupplementalRoutes(c,s):classification==="overlapping"?[{id:"overlap",title:"Overlapping populations",fields:[{key:"overlap",label:"Overlap",unit:c.fields.Quantity[0].unit},{key:"combined",label:"Unique combined population",unit:c.fields.Quantity[0].unit}],reference:"Combined = affected + unaffected − overlap",condition:"Same containing population"}]:[]:baseSupplementalRoutes(c,s)} {...{raw,result,show,update}}/>{s==="Quantity"&&show&&baseScopeNotes[c.id]&&<div className="q-formula">{baseScopeNotes[c.id]}</div>}{s==="Quantity"&&bar&&<div className="q-percentage" aria-label="Affected and unaffected percentages"><div className="q-percentage-bar"><span style={{width:p+"%"}}/><span style={{width:u+"%"}}/></div><div className="q-meta"><span>{format(p)}% affected</span><span>{format(u)}% unaffected</span></div></div>}</div>}</section>})}</div>
 {result.errors.length>0&&<div className="q-errors" role="alert">{result.errors.map(e=><div key={e}>{e}</div>)}</div>}
 <div className="q-controls"><label><input type="checkbox" checked={show} onChange={e=>setShow(e.target.checked)}/>Show calculations</label><div><button type="button" onClick={()=>{const next={...raw};for(const field of Object.values(c.fields).flat())delete next[field.key];for(const field of sectionOrder.flatMap(s=>routeFields(baseSupplementalRoutes(c,s))))delete next[field.key];delete next.overlap;delete next.combined;setRaw(next);}}>Reset</button><button type="button" onClick={()=>{const next={...raw};for(const field of Object.values(c.fields).flat())delete next[field.key];delete next.overlap;delete next.combined;setClassification("complete");setRaw({...next,...c.example});}}>Load example</button></div></div>
 <p className="q-note">Green values are calculated automatically. Figures entered manually are preserved when switching problems. Example figures are hypothetical.</p></div>;
}
export default function Quantification({confirmedProblems = {},operationalSelections = {}}:{confirmedProblems?:Record<string,boolean>;operationalSelections?:Record<string,string[]>} = {}){
 const [open,setOpen]=useState<boolean[]>([true,false,false,false,false,false]);
 const [selected,setSelected]=useState(configs[0].id);
 const [figures,setFigures]=useState<Record<string,Figures>>({});
 const [show,setShow]=useState(false);
 const [shortfall,setShortfall]=useState(false);
 const [classifications,setClassifications]=useState<Record<string,PopulationClassification>>({});
 const classification=classifications[selected]??"unknown";
 const setClassification=(value:PopulationClassification)=>setClassifications(old=>({...old,[selected]:value}));
 const [lastEdited,setLastEdited]=useState<Record<string,string>>({});
 const c=configs.find(x=>x.id===selected)!;
 const raw=figures[selected]??{};
 const impacts=operationalPanels(c,operationalSelections[selected]??[]);
 const includeShortfall=selected==="problem-28"&&shortfall;
 const result=solve(c,raw,operationalEquations(impacts),{populationClassification:classification,includeBounds:true,correctionKey:lastEdited[selected]});
 const statuses=Object.fromEntries(configs.map(config=>{
  const inputs=figures[config.id]??{};
  return [config.id,confirmedProblems[config.id]?quantificationStatus(config,inputs,true,config.id===selected?result:solve(config,inputs,operationalEquations(operationalPanels(config,operationalSelections[config.id]??[])),{populationClassification:classifications[config.id]??"unknown"})):"default" as const];
 }));
 const setRaw=(next:Figures)=>{setLastEdited(old=>{const next={...old};delete next[selected];return next;});setFigures(old=>({...old,[selected]:next}));};
 const update=(key:string,value:string)=>{setLastEdited(old=>({...old,[selected]:key}));setFigures(old=>{const next={...old[selected]};if(value==="")delete next[key];else next[key]=value;return {...old,[selected]:next};});};
 return <QuantityRegistryProvider problemId={selected} raw={raw} result={result}><main className="q-page"><h1>Quantification</h1><div className="q-panels">{panels.map(([title,icon,tone],i)=><section className={"q-panel q-"+tone+(i===1?" op-panel":"")} key={title}><button className="q-panel-header" aria-expanded={open[i]} onClick={()=>setOpen(old=>old.map((v,j)=>j===i?!v:v))}><QuantIcon name={icon}/><span>{title}</span>{i===0&&<span className="q-complete"><QuantIcon name="check"/></span>}{i===1&&(impacts.length>0||includeShortfall)&&<span className="op-panel-count">{impacts.filter(p=>Number.isFinite(result.values[p.primaryKey])&&!result.blocked.has(p.primaryKey)).length+(includeShortfall&&Number.isFinite(result.values["step2:staff-shortfall"])&&!result.blocked.has("step2:staff-shortfall")?1:0)}/{impacts.length+(includeShortfall?1:0)}</span>}<span className={"q-arrow "+(open[i]?"q-open":"")}><QuantIcon name="chevron"/></span></button><div className="q-panel-content" hidden={!open[i]}>{i===0?<Calculator {...{selected,setSelected,c,raw,result,statuses,setRaw,update,show,setShow,classification,setClassification}}/>:i===1?<OperationalImpacts {...{problemId:selected,panels:impacts,raw,result,show,setShow,update,setRaw,shortfall,setShortfall}}/>:i===2?<FinancialImpacts {...{problemId:selected,outcomes:financialContent(c),raw,result,show,update}}/>:<div className="q-placeholder"><div>To be developed</div><p>The quantities and calculations for this section have not been approved yet.</p></div>}</div></section>)}</div></main></QuantityRegistryProvider>;
}
