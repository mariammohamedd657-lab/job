// Algebraic consequences of the original equations. Unknown products are
// independent columns during elimination: this is a conservative relaxation,
// never a guessed value for either factor. Only singleton variable columns
// or variables forced by their domain are returned.
export type Term={coefficient:number;keys:string[]};
export type AlgebraEquation={terms:Term[];label:string;keys:string[]};
export type Consequence={key:string;value:number;dependencies:string[];label:string};
type Row={coeff:Map<string,number>;rhs:number;dependencies:Set<string>;labels:Set<string>};
const SEP="\u001f";
const EPS=1e-12;
const singleton=(key:string)=>!key.includes(SEP);
const finite=Number.isFinite;
function normalize(row:Row){
 const scale=Math.max(...Array.from(row.coeff.values(),Math.abs),0);
 if(scale>0){for(const [k,v] of row.coeff){if(Math.abs(v/scale)<=EPS)row.coeff.delete(k);else row.coeff.set(k,v/scale);}row.rhs/=scale;}
 return row;
}
export function algebraicConsequences(equations:AlgebraEquation[],known:Record<string,number>,blocked:Set<string>,domain:(key:string)=>[number,number]){
 const rows:Row[]=[];
 for(const equation of equations){
  if(equation.keys.some(k=>blocked.has(k)))continue;
  const row:Row={coeff:new Map(),rhs:0,dependencies:new Set(),labels:new Set([equation.label])};
  for(const term of equation.terms){
   let c=term.coefficient;const unknown:string[]=[];
   for(const k of term.keys){if(finite(known[k])){c*=known[k];row.dependencies.add(k);}else unknown.push(k);}
   if(c===0)continue;
   if(!unknown.length)row.rhs-=c;
   else{const key=unknown.sort().join(SEP);row.coeff.set(key,(row.coeff.get(key)??0)+c);}
  }
  for(const [key,c] of row.coeff)if(c===0)row.coeff.delete(key);
  rows.push(normalize(row));
 }
 const original=rows.map(row=>({coeff:new Map(row.coeff),rhs:row.rhs,dependencies:new Set(row.dependencies),labels:new Set(row.labels)}));
 const columns=[...new Set(rows.flatMap(row=>[...row.coeff.keys()]))].sort((a,b)=>Number(singleton(a))-Number(singleton(b))||a.localeCompare(b));
 let pivot=0;
 for(const col of columns){
  let best=-1;for(let i=pivot;i<rows.length;i++)if(Math.abs(rows[i].coeff.get(col)??0)>Math.max(EPS,best<0?0:Math.abs(rows[best].coeff.get(col)??0)))best=i;
  if(best<0)continue;
  [rows[pivot],rows[best]]=[rows[best],rows[pivot]];
  const p=rows[pivot],v=p.coeff.get(col)!;
  for(const [key,c] of p.coeff)p.coeff.set(key,c/v);p.rhs/=v;
  for(let i=0;i<rows.length;i++){
   if(i===pivot)continue;
   const row=rows[i],f=row.coeff.get(col)??0;if(Math.abs(f)<=EPS)continue;
   for(const [key,c] of p.coeff){const prev=row.coeff.get(key)??0,next=prev-f*c;if(Math.abs(next)<=EPS*Math.max(Math.abs(prev),Math.abs(f*c),1))row.coeff.delete(key);else row.coeff.set(key,next);}
   row.rhs-=f*p.rhs;for(const k of p.dependencies)row.dependencies.add(k);for(const label of p.labels)row.labels.add(label);
  }
  pivot++;
 }
 const results:Consequence[]=[];
 const add=(row:Row,key:string,value:number)=>{
  if(!singleton(key)||!finite(value)||finite(known[key]))return;
  // A zero denominator may make a rate undefined. The calling solver handles
  // that case separately using the original ratio semantics.
  results.push({key,value,dependencies:[...row.dependencies],label:[...row.labels].join("; ")});
 };
 for(const row of [...original,...rows]){
  if(row.coeff.size===1){const [key,c]=[...row.coeff][0];add(row,key,row.rhs/c);continue;}
  // A linear sum can force several quantities to a domain endpoint at once.
  // For example, nonnegative terms summing to zero are individually zero.
  for(const edge of [0,1] as const){
   let bound=0;const endpoints=new Map<string,number>();let usable=true;
   for(const [key,c] of row.coeff){
    if(!singleton(key)){usable=false;break;}
    const limits=domain(key),index=c>0?edge:1-edge,n=limits[index];
    if(!finite(n)){usable=false;break;}
    bound+=c*n;endpoints.set(key,n);
   }
   if(usable&&Math.abs(row.rhs-bound)<=EPS*Math.max(1,Math.abs(row.rhs),Math.abs(bound)))for(const [key,n] of endpoints)add(row,key,n);
  }
 }
 return results;
}
