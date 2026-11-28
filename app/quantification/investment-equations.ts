import type {Config} from "./config";
import {solve,product,type AdditionalEquations,type Relation,type Figures,type Result} from "./solver";
import type {Num,Values} from "./investment-model";

// The same solver used by Problem quantification. Use a separate scenario
// scope: hypothetical results must not write into historical problem data.
const config:Config={id:"investment",name:"Investment and solution",category:"Investment",fields:{Quantity:[],Time:[],Frequency:[],Comparison:[],Money:[]},example:{},reference:"prior-discussion"};
const close=(a:number,b:number)=>Math.abs(a-b)<=1e-8*Math.max(1,Math.abs(a),Math.abs(b));
export const resolved=(r:Result,key:string):Num=>!r.blocked.has(key)&&Number.isFinite(r.values[key])?r.values[key]:undefined;
const linear=(label:string,coefficients:Record<string,number>):Relation=>{
 const keys=Object.keys(coefficients);
 return {keys,label,terms:keys.map(key=>({coefficient:coefficients[key],keys:[key]})),
  derive:(v,key)=>-keys.filter(k=>k!==key).reduce((sum,k)=>sum+coefficients[k]*v[k],0)/coefficients[key],
  valid:v=>{const terms=keys.map(k=>coefficients[k]*v[k]);return Math.abs(terms.reduce((sum,n)=>sum+n,0))<=1e-8*Math.max(1,...terms.map(Math.abs));}};
};
const positive=(result:string,difference:string,label:string):Relation=>({keys:[result,difference],label,
 derive:(v,key)=>key===result?Math.max(0,v[difference]):v[result]>0?v[result]:undefined,
 valid:v=>close(v[result],Math.max(0,v[difference]))});
const p=(a:string,b:string,c:string,f=1)=>product(a,b,c,f,a+" = "+b+" × "+c+(f===.01?" ÷ 100":""));
type GraphOptions={signed?:string[];rates?:string[];unboundedRates?:string[];positiveParts?:{result:string;difference:string}[];denominators?:{rate:string;denominator:string}[];subsets?:{population:string;member:string;label:string}[];extraFields?:string[];bounds?:boolean};
function graph(raw:Values,facts:Record<string,Num>,relations:Relation[],options:GraphOptions={}):Result{
 const keys=new Set([...relations.flatMap(r=>r.keys),...Object.keys(facts),...(options.extraFields??[])]);
 const figures:Figures={};
 for(const key of keys){if(raw[key]?.trim())figures[key]=raw[key];if(facts[key]!==undefined)figures[key]=String(facts[key]);}
 const additional:AdditionalEquations={
  fields:[...keys].map(key=>({key,label:key,unit:options.rates?.includes(key)||options.unboundedRates?.includes(key)?"%":"Units"})),
  relations,signedKeys:options.signed,unboundedRateKeys:options.unboundedRates,
  positiveParts:options.positiveParts,undefinedRates:options.denominators,
  populationLinks:options.subsets?.map(x=>({...x,kind:"subset" as const})),
  inferZeros:v=>relations.flatMap(r=>{
   if(r.terms?.length!==2)return [];
   const output=r.terms.find(t=>t.keys.length===1&&t.coefficient===1);
   const factors=r.terms.find(t=>t.keys.length===2&&t.coefficient<0);
   const zero=factors?.keys.find(k=>v[k]===0);
   return output&&zero?[{target:output.keys[0],dependencies:[zero],label:"A known product factor is zero"}]:[];
  })
 };
 return solve(config,figures,additional,{includeBounds:options.bounds??Object.keys(figures).length>0});
}

export function solveInvestmentExpected(raw:Values,pool:Num,conversion:Num,averageProfit:Num){
 const input:Values={expectedRate:raw.expectedRate??"",expectedRecovered:raw.expectedRecovered??"",expectedBuyers:raw.expectedBuyers??"",expectedProfit:raw.expectedProfit??""};
 const r=graph(input,{pool,conversion,averageProfit},[
  p("expectedRecovered","pool","expectedRate",.01),p("expectedBuyers","expectedRecovered","conversion",.01),p("expectedProfit","expectedBuyers","averageProfit")
 ],{rates:["expectedRate","conversion"],subsets:[{population:"pool",member:"expectedRecovered",label:"Recovered opportunities cannot exceed lost opportunities"}]});
 return {pool:resolved(r,"pool"),conversion:resolved(r,"conversion"),averageProfit:resolved(r,"averageProfit"),rate:resolved(r,"expectedRate"),recovered:resolved(r,"expectedRecovered"),buyers:resolved(r,"expectedBuyers"),profit:resolved(r,"expectedProfit"),errors:r.errors,result:r};
}

export function solveInvestmentPayback(raw:Values,facts:{upfront:Num;monthlyCost:Num;launch:Num;deadline:Num}){
 const r=graph(raw,facts,[
  linear("Target payback period = launch delay + recovery duration",{deadline:1,launch:-1,recoveryDuration:-1}),
  p("upfront","recoveryDuration","requiredNet"),
  linear("Required gain before payments = required gain after payments + monthly payments",{requiredGross:1,requiredNet:-1,monthlyCost:-1})
 ]);
 return {deadline:resolved(r,"deadline"),after:resolved(r,"recoveryDuration"),netNeeded:resolved(r,"requiredNet"),gainNeeded:resolved(r,"requiredGross"),conflict:r.errors.length>0,result:r};
}

type CoreFacts={packageFee:Num;subscription:Num;launch:Num;period:Num;profit:Num;currentCosts:Num;invoices:Num;otherLost:Num};
export function solveInvestmentCore(raw:Values,facts:CoreFacts,breakdown:boolean,withBounds=true){
 const equations=[
  linear("Total upfront payment = package payments + other upfront payments",{upfront:1,packageFee:-1,otherUpfront:-1}),
  linear("Total monthly payments = subscription + running + other payments",{monthlyCost:1,subscription:-1,running:-1,otherMonthly:-1}),
  linear("Payment period = launch delay + signed post-launch duration",{period:1,launch:-1,durationDifference:-1}),
  positive("after","durationDifference","Time after launch = max(0, payment period − launch delay)"),
  p("ongoing","monthlyCost","after"),
  linear("Total payments = upfront + ongoing payments",{totalPayments:1,upfront:-1,ongoing:-1}),
  linear("Money saved = costs removed − monthly payments",{saved:1,removed:-1,monthlyCost:1}),
  linear("Costs and payments after launch = current costs − money saved",{costsAfter:1,currentCosts:-1,saved:1}),
  linear("Other gains = recovered invoice money − other money lost",{extras:1,invoices:-1,otherLost:1}),
  linear("Gain after payments = extra sales profit + money saved + other gains",{gain:1,profit:-1,saved:-1,extras:-1}),
  linear("Gain before payments = gain after payments + monthly payments",{gross:1,gain:-1,monthlyCost:-1}),
  p("accumNet","gain","after"),p("accumGross","gross","after"),
  linear("Total gain after payments = accumulated net gain − upfront payments",{net:1,accumNet:-1,upfront:1}),
  linear("Cash shortfall before launch = upfront + minimum reserve − available cash",{cashDifference:1,upfront:-1,reserve:-1,cash:1}),
  positive("extraCash","cashDifference","Extra cash needed upfront = positive cash shortfall")
 ];
 if(breakdown)equations.push(p("callCost","minutes","minuteCost"),
  linear("Running payments = call costs + lines and platform + WhatsApp and summary",{running:1,callCost:-1,lines:-1,whatsapp:-1}));
 const opts:GraphOptions={signed:["saved","gain","gross","extras","net","accumNet","accumGross","roi","durationDifference","cashDifference"],unboundedRates:["roi"],positiveParts:[{result:"after",difference:"durationDifference"},{result:"extraCash",difference:"cashDifference"}],denominators:[{rate:"roi",denominator:"totalPayments"}],subsets:[{population:"currentCosts",member:"removed",label:"Costs removed cannot exceed current costs"}],bounds:withBounds};
 const input={...raw};
 // Optional additions default to zero, but when a direct result or reverse
 // constraint determines them, that determination takes precedence.
 const defaults=["otherUpfront","otherMonthly",...(breakdown?["lines","whatsapp"]:[])];
 let r=graph(input,facts,equations,{...opts,bounds:false});
 for(const key of defaults)if(!input[key]?.trim()&&resolved(r,key)===undefined&&!r.blocked.has(key))input[key]="0";
 r=graph(input,facts,equations,{...opts,bounds:false});
 const gain=resolved(r,"gain"),upfront=resolved(r,"upfront"),totalPayments=resolved(r,"totalPayments");
 // ROI is undefined if payments are zero; do not impose net = 0 then.
 if(totalPayments!==0&&(input.roi?.trim()||totalPayments!==undefined))equations.push(p("net","totalPayments","roi",.01));
 if(upfront!==0&&(input.payback?.trim()||gain!==undefined&&gain>0)){
  equations.push(linear("Payback period = launch delay + recovery duration",{payback:1,launch:-1,paybackAfter:-1}),p("upfront","gain","paybackAfter"));
 }
 const final=graph(input,facts,equations,opts);
 if(resolved(final,"totalPayments")===0&&input.roi?.trim()){final.errors.push("ROI is undefined when total payments are zero.");final.blocked.add("roi");}
 return final;
}
