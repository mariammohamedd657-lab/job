"use client";
import {useState} from "react";
import {configs,type Config} from "./config";
import {registryFor} from "./quantity-registry";
import {relationshipEndpointKeys,populationRelationshipSpecification} from "./canonical-relationships";
import {solve,type AdditionalEquations,type Figures,type Result,type PopulationClassification,type EvidenceMap} from "./solver";
import type {QuantityBounds} from "./ranges";
export type SharingLink={left:string;right:string;kind:"identity"|"subset";scopeConfirmed:true};
const split=(id:string)=>{const i=id.indexOf("/");return [id.slice(0,i),id.slice(i+1)] as const;};
const get=(results:Record<string,Result>,id:string)=>{const [p,k]=split(id);return results[p];};
const ref=(id:string)=>{const [p,k]=split(id);return registryFor(p).instances[k];};
const registered=relationshipEndpointKeys.flatMap((pair,index)=>{
 const condition=populationRelationshipSpecification[index].condition.toLowerCase();
 if(!condition.includes("subset")||condition.includes("overlap"))return [];
 if(!pair.every(x=>/^\d+\//.test(x)))return [];
 const [left,right]=pair.map(x=>"problem-"+x);
 return left.split("/")[0]!==right.split("/")[0]?[{left,right,kind:"subset" as const}]:[];
});
export function allowedSharing(left:string,right:string,kind:SharingLink["kind"]){
 const a=ref(left),b=ref(right);if(!a||!b||a.problemId===b.problemId||a.unit!==b.unit)return false;
 if(kind==="identity")return a.canonicalId===b.canonicalId&&a.type===b.type;
 if(registered.some(l=>l.left===left&&l.right===right))return true;
 const semanticPairs=[["unique_affected_leads","affected_qualified_leads"],["lost_leads","lost_qualified_leads"],["affected_invoices","additional_unpaid_invoices"]];
 return semanticPairs.some(([x,y])=>a.canonicalId===x&&b.canonicalId===y)||left==="problem-20/total"&&right==="problem-28/affected"||left==="problem-28/total"&&right==="problem-20/affected";
}
export function solveAcrossProblems(cs:Config[],figures:Record<string,Figures>,equations:Record<string,AdditionalEquations>,classifications:Record<string,PopulationClassification>,edited:Record<string,string>,links:SharingLink[],evidence:Record<string,EvidenceMap>={}):Record<string,Result>{
 const active=links.filter(l=>l.scopeConfirmed&&allowedSharing(l.left,l.right,l.kind));
 let external:Record<string,Record<string,QuantityBounds>>={};
 const run=()=>Object.fromEntries(cs.map(c=>[c.id,solve(c,figures[c.id]??{},equations[c.id],{populationClassification:classifications[c.id]??"unknown",includeBounds:true,correctionKey:edited[c.id],externalBounds:external[c.id],evidence:evidence[c.id]})]));
 let results=run();
 if(!active.length)return results;
 // Keep exact values as constraints, not additional user assertions.
 const conflicts=new Map<string,string[]>();
 const correctionBounds=new Map<string,QuantityBounds>();
 for(let pass=0;pass<32;pass++){
  const next:typeof external={};
  const apply=(id:string,b:QuantityBounds)=>{const [p,k]=split(id);const old=next[p]?.[k];(next[p]??={})[k]={min:Math.max(old?.min??-Infinity,b.min??-Infinity),max:Math.min(old?.max??Infinity,b.max??Infinity),minReason:"Established cross-problem relationship",maxReason:"Established cross-problem relationship"};};
  const bounds=(id:string)=>{const [p,k]=split(id),r=results[p];if(!r||r.blocked.has(k))return undefined;const n=r.values[k];return Number.isFinite(n)?{min:n,max:n}:r.bounds?.[k];};
  for(const l of active){
   const a=bounds(l.left),b=bounds(l.right);
   const conflict=a&&b&&(l.kind==="identity"?((a.min??-Infinity)>(b.max??Infinity)||(b.min??-Infinity)>(a.max??Infinity)):(b.min??-Infinity)>(a.max??Infinity));
   if(conflict){const msg="Conflicting shared information: "+l.left+" "+(l.kind==="identity"?"must equal":"must contain")+" "+l.right;
    if(a&&b){correctionBounds.set(l.left,l.kind==="identity"?b:{min:b.min,minExclusive:b.minExclusive});correctionBounds.set(l.right,l.kind==="identity"?a:{max:a.max,maxExclusive:a.maxExclusive});}conflicts.set(l.left,[...(conflicts.get(l.left)??[]),msg]);conflicts.set(l.right,[...(conflicts.get(l.right)??[]),msg]);}
   if(l.kind==="identity"){if(a)apply(l.right,a);if(b)apply(l.left,b);}
   else {if(a?.max!==undefined)apply(l.right,{max:a.max});if(b?.min!==undefined)apply(l.left,{min:b.min});}
  }
  const signature=(x:typeof external)=>JSON.stringify(x,(_k,v)=>v===Infinity?"Infinity":v===-Infinity?"-Infinity":v);
  if(signature(next)===signature(external))break;
  external=next;results=run();
 }
 for(const [id,msgs] of conflicts){const [p,k]=split(id),r=results[p];if(!r)continue;r.blocked.add(k);r.errors=[...new Set([...r.errors,...msgs])];const b=correctionBounds.get(id);if(b){(r.bounds??={})[k]=b;(r.corrections??={})[k]={kind:b.min!==undefined&&b.min===b.max?"exact":"range",bounds:b,message:"Independent correction required by the established cross-problem relationship; other constraints must also remain satisfied."};}}
 return results;
}
export function CrossProblemControls({enabled,setEnabled,links,setLinks,selected}:{enabled:boolean;setEnabled:(v:boolean)=>void;links:SharingLink[];setLinks:(v:SharingLink[])=>void;selected:string}){
 const [other,setOther]=useState("problem-2"),[leftKey,setLeftKey]=useState("total"),[rightKey,setRightKey]=useState("total"),[kind,setKind]=useState<SharingLink["kind"]>("subset"),[confirmed,setConfirmed]=useState(false);
 const left=selected+"/"+leftKey,right=other+"/"+rightKey;
 const valid=confirmed&&allowedSharing(left,right,kind);
 return <div className="q-controls" style={{display:"block"}}><label><input type="checkbox" checked={enabled} onChange={e=>setEnabled(e.target.checked)}/>Share information between business problems</label>{enabled&&<details className="step2-alternative"><summary className="step2-alt-toggle">Established cross-problem relationships ({links.length})</summary><div className="step2-alt-body"><p className="q-note">Confirm only matching business, population relationship, counting units, period, cutoff, currency, scenario, attribution and financial basis.</p><label>Current problem quantity<select value={leftKey} onChange={e=>{setLeftKey(e.target.value);setConfirmed(false);}}>{Object.values(registryFor(selected).instances).map(f=><option key={f.legacyKey} value={f.legacyKey}>{f.label}</option>)}</select></label><label>Other business problem<select value={other} onChange={e=>{setOther(e.target.value);setRightKey("total");setConfirmed(false);}}>{configs.filter(c=>c.id!==selected).map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></label><label>Other quantity<select value={rightKey} onChange={e=>{setRightKey(e.target.value);setConfirmed(false);}}>{Object.values(registryFor(other).instances).map(f=><option key={f.legacyKey} value={f.legacyKey}>{f.label}</option>)}</select></label><select aria-label="Relationship type" value={kind} onChange={e=>{setKind(e.target.value as SharingLink["kind"]);setConfirmed(false);}}><option value="subset">Other quantity is a subset of current quantity</option><option value="identity">Identical measurement</option></select><label><input type="checkbox" checked={confirmed} onChange={e=>setConfirmed(e.target.checked)}/>I confirm the applicable measurement scopes and relationship match</label><button type="button" disabled={!valid} onClick={()=>{if(valid)setLinks([...links.filter(l=>l.left!==left||l.right!==right),{left,right,kind,scopeConfirmed:true}]);setConfirmed(false);}}>Establish relationship</button>{links.map((l,j)=><div key={l.left+l.right}><span>{ref(l.left)?.label} ({split(l.left)[0]}) {l.kind==="identity"?"=":"contains"} {ref(l.right)?.label} ({split(l.right)[0]})</span><button type="button" onClick={()=>setLinks(links.filter((_,i)=>i!==j))}>Remove</button></div>)}</div></details>}</div>;
}
