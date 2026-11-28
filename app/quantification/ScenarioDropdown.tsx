"use client";
import {useEffect,useId,useRef,useState,type KeyboardEvent} from "react";
import "./scenario-dropdown.css";
type Props={label:string;options:readonly string[];value:string;onChange:(value:string)=>void};
export default function ScenarioDropdown({label,options,value,onChange}:Props){
 const id=useId(),root=useRef<HTMLDivElement>(null),trigger=useRef<HTMLButtonElement>(null);
 const [open,setOpen]=useState(false),[active,setActive]=useState(0);
 const search=useRef({text:"",time:0});
 const show=()=>{setActive(Math.max(0,options.indexOf(value)));search.current={text:"",time:0};setOpen(true);};
 const choose=(i:number)=>{onChange(options[i]);setOpen(false);trigger.current?.focus();};
 useEffect(()=>{if(!open)return;const outside=(e:PointerEvent)=>{if(e.target instanceof Node&&!root.current?.contains(e.target))setOpen(false);};document.addEventListener("pointerdown",outside);return()=>document.removeEventListener("pointerdown",outside);},[open]);
 function keyboard(e:KeyboardEvent<HTMLButtonElement>){
  switch(e.key){
   case "ArrowDown":case "ArrowUp":e.preventDefault();if(!open)show();else setActive(i=>Math.max(0,Math.min(options.length-1,i+(e.key==="ArrowDown"?1:-1))));return;
   case "Home":case "End":e.preventDefault();setOpen(true);setActive(e.key==="Home"?0:options.length-1);return;
   case "Enter":case " ":e.preventDefault();if(open)choose(active);else show();return;
   case "Escape":if(open){e.preventDefault();setOpen(false);}return;
   case "Tab":setOpen(false);return;
  }
  if(e.key.length!==1||e.ctrlKey||e.altKey||e.metaKey)return;
  const now=Date.now(),prefix=(now-search.current.time>700?"":search.current.text)+e.key.toLowerCase();search.current={text:prefix,time:now};const i=options.findIndex(x=>x.toLowerCase().startsWith(prefix));if(i>=0){e.preventDefault();setActive(i);setOpen(true);}
 }
 return <div className="inv-scenario-select" ref={root}><button type="button" ref={trigger} className="inv-dropdown inv-scenario-trigger" role="combobox" aria-label={label} aria-haspopup="listbox" aria-expanded={open} aria-controls={id} aria-activedescendant={open?id+"-"+active:undefined} data-value={value} onClick={()=>open?setOpen(false):show()} onKeyDown={keyboard} onBlur={()=>setOpen(false)}><span>{value}</span><svg viewBox="0 0 24 24" width="17" height="17" stroke="currentColor" strokeWidth="1.7" fill="none" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg></button><div className="inv-scenario-menu" id={id} role="listbox" aria-label={label} hidden={!open}>{options.map((option,i)=><div key={option} id={id+"-"+i} role="option" aria-selected={option===value} data-active={i===active} className="inv-scenario-option" onMouseDown={e=>e.preventDefault()} onClick={()=>choose(i)}>{option}</div>)}</div></div>;
}
