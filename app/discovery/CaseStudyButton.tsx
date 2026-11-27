"use client";
import {useRef,useState} from "react";
import {casesForProblem,caseStudies} from "./case-studies";
import "./case-studies.css";
function Book(){return <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 6c-3-3-7-3-10-2v15c3-1 7-1 10 2 3-3 7-3 10-2V4c-3-1-7-1-10 2v15"/></svg>}
export default function CaseStudyButton({problemId,referenceOnly=false}:{problemId:string;referenceOnly?:boolean}){
 const cases=referenceOnly?caseStudies.filter(c=>c.id==="worldstar"):casesForProblem(problemId);
 const dialog=useRef<HTMLDialogElement>(null),trigger=useRef<HTMLButtonElement>(null);
 const [active,setActive]=useState(0),[status,setStatus]=useState("");
 if(!cases.length)return null;
 const study=cases[active]??cases[0];
 const close=()=>dialog.current?.close();
 const copy=async()=>{try{await navigator.clipboard.writeText(study.spoken);setStatus("Copied");}catch{setStatus("Copy unavailable. Select the spoken description to copy it manually.");}};
 return <div className="cs-control">
 <button ref={trigger} type="button" className="cs-trigger" onClick={()=>{setActive(0);setStatus("");dialog.current?.showModal();}}><Book/>Case study</button>
 <dialog ref={dialog} className="cs-dialog" aria-label="Case study" onClose={()=>trigger.current?.focus()} onClick={e=>{if(e.target===e.currentTarget){const r=e.currentTarget.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)close();}}}>
 <div className="cs-top"><span><Book/>Case study</span><button type="button" className="cs-close" aria-label="Close case study" onClick={close}>×</button></div>
 {cases.length>1&&<div className="cs-options" aria-label="Available case studies">{cases.map((c,i)=><button type="button" key={c.id} aria-pressed={active===i} onClick={()=>{setActive(i);setStatus("");}}>{c.title}</button>)}</div>}
 <h3>{study.title}</h3><p className="cs-spoken">“{study.spoken}”</p>
 {study.notes.length>0&&<div className="cs-notes"><h4>Additional notes</h4>{study.notes.map(note=><p key={note}>{note}</p>)}</div>}
 <div className="cs-footer"><span>Source: {study.pages}</span><button type="button" onClick={copy}>Copy</button></div>
 <div role="status" className="cs-status">{status}</div>
 </dialog></div>;
}
