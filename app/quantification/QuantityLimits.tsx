import type { Result } from "./solver";
import type { QuantityBounds } from "./ranges";

// Display only rounded hints, never feed display rounding back into the solver.
// An approximation marker is shown whenever rounding changes the number.
function formatLimit(value:number,unit:string,exclusive=false,edge:"min"|"max"="min"){
 const rounded=Number(value.toFixed(2));
 const shown=Math.abs(value)>1e12||value!==0&&rounded===0?Number(value.toPrecision(4)):rounded;
 return (exclusive?(edge==="min"?">":"<"):"")+(shown===value?"":"≈ ")+String(shown)+(unit==="%"?"%":"");
}
export function QuantityLimits({quantity,unit,result,value,show}:{quantity:string;unit:string;result:Result;value:string;show:boolean}){
 const correction=result.corrections?.[quantity];
 const range:QuantityBounds|undefined=correction?.bounds??result.bounds?.[quantity];
 if(correction&&(correction.kind==="requires-other-changes"||correction.kind==="unresolved"))return <div className="q-limits q-limits-conflict" data-quantity-correction={quantity}>{correction.message}</div>;
 if(!range||value!==""&&!result.blocked.has(quantity))return null;
 const {min,max}=range;
 if(min===undefined&&max===undefined&&!show)return null;
 const parts=[min!==undefined?"Min: "+formatLimit(min,unit,range.minExclusive,"min"):"",max!==undefined?"Max: "+formatLimit(max,unit,range.maxExclusive,"max"):""].filter(Boolean);
 const quality=[range.minQuality,range.maxQuality].includes("conservative")?"Conservative bounds; not every value in this interval is necessarily feasible.":min!==undefined&&min===max?"Exact determined value.":"";
 const unresolved=[min===undefined?"Minimum unresolved":"",max===undefined?"Maximum unresolved":""].filter(Boolean).join(" · ");
 const reasons=[min!==undefined?"Min "+(range.minExclusive?"> ":"= ")+String(min)+(unit==="%"?"%":"")+(range.minReason?" — "+range.minReason:""):undefined,max!==undefined?"Max "+(range.maxExclusive?"< ":"= ")+String(max)+(unit==="%"?"%":"")+(range.maxReason?" — "+range.maxReason:""):undefined].filter(Boolean);
 return <><div className={"q-limits"+(result.blocked.has(quantity)?" q-limits-conflict":"")} data-quantity-limit={quantity}>{correction&&<span>Independent correction: </span>}{parts.join(" · ")}{quality&&<span title={quality}> · {min===max?"Exact":"Conservative"}</span>}</div>{correction&&<div className="q-limits q-limits-conflict" data-quantity-correction={quantity}>{correction.message}</div>}{show&&<div className="q-formula">{[reasons.join(" · "),quality,unresolved].filter(Boolean).join(" · ")}</div>}</>;
}
