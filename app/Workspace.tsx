"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import Discovery from "./discovery/Discovery";
import Quantification, { QuantIcon } from "./quantification/Quantification";
export default function Workspace({children}:{children:ReactNode}){
 const pathname=usePathname();const quant=pathname==="/quantification";
 const [confirmedProblems,setConfirmedProblems]=useState<Record<string,boolean>>({});
 const [operationalSelections,setOperationalSelections]=useState<Record<string,string[]>>({});
 const selectOperational=(id:string,impactId:string,checked:boolean)=>setOperationalSelections(old=>({...old,[id]:checked?[...new Set([...(old[id]??[]),impactId]) ]:(old[id]??[]).filter(i=>i!==impactId)}));
 const confirmProblem=(id:string,confirmed:boolean)=>setConfirmedProblems(old=>({...old,[id]:confirmed}));
 // Both workspaces stay mounted in the persistent root layout.
 return <div className={quant?"workspace-quantification":undefined}><nav className="workspace-nav" aria-label="Main navigation"><span>Precision Talks</span><div><Link href="/" aria-current={!quant?"page":undefined}>Discovery</Link><Link href="/quantification" aria-current={quant?"page":undefined}><QuantIcon name="calculator"/>Quantification</Link></div></nav><div hidden={quant}><Discovery onProblemConfirmation={confirmProblem} onOperationalSelection={selectOperational}/></div><div hidden={!quant}><Quantification confirmedProblems={confirmedProblems} operationalSelections={operationalSelections}/></div>{children}</div>;
}
