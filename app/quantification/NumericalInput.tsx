"use client";
import {useState,type ComponentPropsWithoutRef} from "react";
import {useQuantityRegistry} from "./RegistryContext";
import {instanceState} from "./quantity-identity";
import {format,type Figures,type Result} from "./solver";

// A quantity has one manual constraint and one resolved result, independent of
// how many times it appears. A temporary empty editing buffer belongs only to
// the focused input, never to the calculation engine.
export function resolveQuantity(key:string,raw:Figures,result:Result){
 const manual=raw[key]??"";
 const valid=Number.isFinite(result.values[key])&&!result.blocked.has(key);
 const computed=manual.trim()===""&&valid;
 return {value:manual.trim()!==""?manual:computed?format(result.values[key]):"",computed,valid};
}
type Props=Omit<ComponentPropsWithoutRef<"input">,"type"|"value"|"defaultValue"|"onChange"|"onInput"|"onBlur"|"readOnly"|"disabled">&{
 value:string;
 "data-quantity"?:string;
 onValueChange:(value:string)=>void;
};
// Every numerical field remains an actual editable number input. Clearing a
// value immediately removes its manual constraint; suppress the re-inferred
// display only in this focused occurrence so the next digit can be entered.
export default function NumericalInput({value,onValueChange,...props}:Props){
 const [emptyDraft,setEmptyDraft]=useState(false);
 const {registry,raw,result}=useQuantityRegistry();
 const key=props["data-quantity"],ref=key?registry.instances[key]:undefined;
 if(key&&!ref)throw Error("Unregistered numerical input "+registry.problemId+"/"+key);
 const state=ref?instanceState(ref,raw,result,{relationships:registry.routes.filter(route=>route.fieldInstanceIds.includes(ref.instanceId)||route.resultInstanceId===ref.instanceId).map(route=>route.id)}):undefined;
 const displayed=state?state.manualValue??(state.calculatedValue!==undefined?format(state.calculatedValue):""):value;
 return <input {...props} data-canonical-quantity={ref?.canonicalId} data-quantity-instance={ref?.instanceId} data-numerical-type={ref?.type} data-quantity-source={state?.source} type="number" value={emptyDraft?"":displayed} onInput={event=>{
  // Native input events also capture a deliberate replacement with the same
  // number, which must become a manual constraint even if the display agrees.
  const next=event.currentTarget.value;
  setEmptyDraft(next==="");
  onValueChange(next);
 }} onBlur={()=>setEmptyDraft(false)}/>;
}
