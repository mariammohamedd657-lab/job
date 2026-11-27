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
 const range:QuantityBounds|undefined=result.bounds?.[quantity];
 if(!range||value!==""&&!result.blocked.has(quantity))return null;
 const {min,max}=range;
 if(min===undefined&&max===undefined)return null;
 const parts=[min!==undefined?"Min: "+formatLimit(min,unit,range.minExclusive,"min"):"",max!==undefined?"Max: "+formatLimit(max,unit,range.maxExclusive,"max"):""].filter(Boolean);
 const reasons=[min!==undefined?range.minReason:undefined,max!==undefined?range.maxReason:undefined].filter(Boolean);
 return <><div className={"q-limits"+(result.blocked.has(quantity)?" q-limits-conflict":"")} data-quantity-limit={quantity}>{parts.join(" · ")}</div>{show&&<div className="q-formula">{[...new Set(reasons)].join(" · ")}</div>}</>;
}
