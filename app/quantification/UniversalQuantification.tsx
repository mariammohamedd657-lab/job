"use client";
import {opportunityTypes,type OpportunityType,type PoolValues} from "./opportunity-pool";
import {fmt,type Num,type Values} from "./investment-model";
type Props={overview?:boolean;raw:Values;pool:PoolValues;type:OpportunityType;setType:(v:OpportunityType)=>void;lossMethod:"number"|"percentage";setLossMethod:(v:"number"|"percentage")=>void;update:(key:string,value:string)=>void;reset:()=>void;show:boolean;setShow:(v:boolean)=>void};
export default function UniversalQuantification({overview=false,raw,pool,type,setType,lossMethod,setLossMethod,update,reset,show,setShow}:Props){
 const unit=type==="Confirmed lost buyers"?"Buyers":type;
 const row=(label:string,key:string,unit:string,value:Num,priority=false,locked=false)=><div className="q-field inv-field" key={key}><label className={priority?"q-priority":""}><span>{label}</span><input type="number" step="any" min={key==="profit"||key==="confirmedProfit"?undefined:0} max={unit==="%"?100:undefined} aria-label={label} data-pool-quantity={key} value={locked?value??"":raw[key]??value??""} readOnly={locked} className={locked?"q-calculated":""} placeholder="—" onChange={e=>update(key,e.target.value)}/><span className="q-unit">{unit}</span></label></div>;
 return <div className="q-universal">
 <div className="inv-options" aria-label="Opportunity measurement">{opportunityTypes.map(t=><button type="button" key={t} aria-pressed={type===t} onClick={()=>setType(t)}>{t}</button>)}</div>
 <p className="q-note">Enter one combined monthly pool across selected problems. Count each lost opportunity only once.</p>
 {row(type==="Leads"?"Monthly leads":"Monthly "+unit.toLowerCase(),"total",unit,pool.total,true)}
 <div className="inv-options" aria-label="Loss measurement"><button type="button" aria-pressed={lossMethod==="number"} onClick={()=>setLossMethod("number")}>Number lost</button><button type="button" aria-pressed={lossMethod==="percentage"} onClick={()=>setLossMethod("percentage")}>Percentage lost</button></div>
 {row(type==="Leads"?"Monthly lost leads":"Monthly lost "+unit.toLowerCase(),"lost",unit,pool.lost,true,lossMethod==="percentage")}
 <div hidden={overview&&lossMethod==="number"}>{row("Percentage lost","leakage","%",pool.leakage,lossMethod==="percentage",lossMethod==="number")}</div>
 {row(type==="Leads"?"Average close rate":type==="Confirmed lost buyers"?"Confirmed buyer rate":unit+"-to-buyer close rate","rate","%",pool.rate,true,type==="Confirmed lost buyers")}
 {row("Average ticket size","ticket","AED",pool.ticket,true)}
 {row("Average profit per buyer","profit","AED",pool.profit,true)}
 {pool.invalid&&<p className="q-errors" role="alert">Lost opportunities cannot exceed the total. Close and leakage rates must be between 0 and 100%.</p>}
 <div className="q-universal-results" hidden={overview}>
 {row("Remaining opportunities","remaining",unit,pool.remaining,false,true)}
 {row("Leakage rate","leakage-result","%",pool.leakage,false,true)}
 {row(type==="Confirmed lost buyers"?"Confirmed buyers lost":"Potential buyers lost","buyers-lost","Buyers",pool.buyersLost,false,true)}
 {row("Potential monthly revenue lost","revenue-lost","AED",pool.revenueLost,false,true)}
 {row("Potential monthly profit lost","profit-lost","AED",pool.profitLost,false,true)}
 </div>
 {overview&&<div className="q-overview-pool-results"><div className="q-overview-stat q-leakage"><span>Lead leakage rate</span><strong>{fmt(pool.leakage)}{pool.leakage!==undefined?"%":""}</strong></div><div className="q-overview-stat q-leakage"><span>{type==="Confirmed lost buyers"?"Confirmed monthly buyers lost":"Potential monthly buyers lost"}</span><strong>{fmt(pool.buyersLost)}</strong></div>{[["Potential monthly revenue lost",pool.revenueLost],["Potential monthly profit lost",pool.profitLost]].map(([label,value])=><div className="q-overview-money" key={String(label)}><span>{label}</span><strong>{fmt(value as Num)}{value!==undefined?" AED":""}</strong></div>)}</div>}
 <details className="step2-alternative"><summary className="step2-alt-toggle">Optional financial quantities</summary><div className="step2-alt-body">
 {row("Unnecessary monthly costs","unnecessary","AED",pool.unnecessary)}
 {row("Money permanently lost from unpaid invoices","unpaid","AED",pool.unpaid)}
 {row("Money received late","late","AED",pool.late)}
 <p className="q-note">Money received late is delayed cash, not lost profit.</p></div></details>
 <details className="step2-alternative"><summary className="step2-alt-toggle">Confirmed current business figures (optional)</summary><div className="step2-alt-body">
 {row("Current monthly buyers","confirmedBuyers","Buyers",pool.confirmedBuyers)}
 {row("Current monthly revenue","confirmedRevenue","AED",pool.confirmedRevenue)}
 {row("Current monthly profit from sales","confirmedProfit","AED",pool.confirmedProfit)}
 </div></details>
 {show&&<div className="q-formula">Remaining = {fmt(pool.total)} − {fmt(pool.lost)} = {fmt(pool.remaining)}<br/>Leakage = {fmt(pool.lost)} ÷ {fmt(pool.total)} × 100 = {fmt(pool.leakage)}%<br/>Buyers lost = {fmt(pool.lost)} × {fmt(pool.rate)} ÷ 100 = {fmt(pool.buyersLost)}<br/>Revenue lost = {fmt(pool.buyersLost)} × {fmt(pool.ticket)} = {fmt(pool.revenueLost)} AED<br/>Profit lost = {fmt(pool.buyersLost)} × {fmt(pool.profit)} = {fmt(pool.profitLost)} AED</div>}
 <div className="q-controls"><label><input type="checkbox" checked={show} onChange={e=>setShow(e.target.checked)}/>Show calculations</label><div><button type="button" onClick={reset}>Reset</button></div></div>
 </div>;
}
