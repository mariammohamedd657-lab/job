export type Num=number|undefined;
export const read=(s:string|undefined):Num=>s!==undefined&&s.trim()!==""&&Number.isFinite(Number(s))?Number(s):undefined;
export const add=(...a:Num[]):Num=>a.every(x=>x!==undefined)?a.reduce<number>((s,x)=>s+x!,0):undefined;
export const sub=(a:Num,b:Num):Num=>a!==undefined&&b!==undefined?a-b:undefined;
export const mul=(...a:Num[]):Num=>a.some(x=>x===0)?0:a.every(x=>x!==undefined)?a.reduce<number>((s,x)=>s*x!,1):undefined;
export const div=(a:Num,b:Num):Num=>a!==undefined&&b!==undefined&&b!==0?a/b:undefined;
export const max=(...a:Num[]):Num=>a.every(x=>x!==undefined)?Math.max(...a as number[]):undefined;
export const nonnegative=(a:Num):Num=>a===undefined?undefined:Math.max(0,a);
export const ceil=(a:Num):Num=>a===undefined?undefined:Math.ceil(a);
export const fmt=(a:Num)=>a===undefined?"—":Number(a.toPrecision(10)).toLocaleString("en-US",{maximumFractionDigits:4});
export const targetNames=["Revenue","Profit from sales","Monthly costs","Buyers"] as const;
export type TargetName=typeof targetNames[number];
export type Values=Record<string,string>;
export function targetValues(name:TargetName,raw:Values,linked:Num){
 const v=[linked??read(raw.current),read(raw.target),read(raw.change),read(raw.rate)];
 const sign=name==="Monthly costs"?-1:1;
 const put=(i:number,x:Num)=>{if(v[i]===undefined&&x!==undefined&&Number.isFinite(x))v[i]=x;};
 for(let pass=0;pass<5;pass++){
  put(1,add(v[0],mul(sign,v[2])));put(0,sub(v[1],mul(sign,v[2])));put(2,mul(sign,sub(v[1],v[0])));
  put(2,mul(v[0],v[3],.01));put(3,mul(div(v[2],v[0]),100));put(0,div(mul(v[2],100),v[3]));
  put(0,div(v[1],add(1,mul(sign,v[3],.01))));
 }
 const conflict=v.every(x=>x!==undefined)&&(Math.abs(v[1]!-v[0]!-sign*v[2]!)>1e-7||Math.abs(v[2]!-v[0]!*v[3]!/100)>1e-7);
 return {current:v[0],target:v[1],change:v[2],rate:v[3],deadline:read(raw.deadline),conflict};
}
export const packages={Starter:{agents:"1",ownership:73500,setup:22000,monthly:6500,conversion:36750},Growth:{agents:"2–3",ownership:110250,setup:33000,monthly:9750,conversion:55125}};
export function finance(upfront:Num,monthly:Num,period:Num,launch:Num,profit:Num,saved:Num,extra:Num,cash:Num,reserve:Num){
 const after=nonnegative(sub(period,launch)),before=mul(monthly,launch),total=add(upfront,mul(monthly,period)),gain=add(profit,saved,extra),gross=add(gain,monthly),net=sub(mul(gross,after),total);
 const atLaunch=add(upfront,before),payback=atLaunch===0?0:gain!==undefined&&gain>0?add(launch,div(atLaunch,gain)):undefined;
 // Upfront paid at time zero, running costs through launch, net gains at end of each post-launch month.
 const shortage=nonnegative(sub(max(upfront,add(upfront,mul(monthly,launch)),mul(-1,net)),sub(cash,reserve)));
 return {after,before,total,gain,gross,net,payback,shortage,roi:mul(div(net,total),100),noPayback:atLaunch!==undefined&&atLaunch>0&&gain!==undefined&&gain<=0};
}
