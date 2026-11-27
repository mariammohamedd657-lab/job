import type {AdditionalEquations,Relation} from "./solver";
import type {PopulationLink} from "./information-links";
// Use only for explicitly compatible sets. Intersections are ordinary
// nonnegative quantities, never signed financial amounts.
export function scopedUnion(base:AdditionalEquations,combined:string,members:string[],intersections:{key:string;members:string[]}[],containing?:string):AdditionalEquations{
 const unique=[...new Set(members)];
 if(unique.length<2||unique.length>12||unique.length!==members.length)throw Error("Invalid union members");
 const allowed=new Set(base.fields.map(f=>f.key));
 const all=[combined,...unique,...intersections.map(i=>i.key),...(containing?[containing]:[])];
 if(all.some(k=>!allowed.has(k))||new Set(all).size!==all.length)throw Error("Union requires distinct existing quantity identities");
 const links:PopulationLink[]=[...(base.populationLinks??[])];
 const subset=(population:string,member:string)=>links.push({population,member,kind:"subset",label:member+" cannot exceed "+population});
 for(const member of unique)subset(combined,member);
 if(containing)subset(containing,combined);
 for(const i of intersections){
  if(i.members.length<2||new Set(i.members).size!==i.members.length||i.members.some(k=>!unique.includes(k)))throw Error("Invalid intersection");
  for(const member of i.members)subset(member,i.key);
  for(const parent of intersections)if(parent.members.length<i.members.length&&parent.members.every(k=>i.members.includes(k)))subset(parent.key,i.key);
 }
 const keyFor=(m:string[])=>[...m].sort().join("\u001f");
 const lookup=new Map(intersections.map(i=>[keyFor(i.members),i.key]));
 if(lookup.size!==intersections.length)throw Error("Duplicate intersections");
 const relations:Relation[]=[...base.relations];
 const linear=(keys:string[],coefficients:number[],label:string):Relation=>({keys,label,terms:keys.map((key,j)=>({coefficient:coefficients[j],keys:[key]})),derive:(v,k)=>-keys.reduce((n,key,j)=>n+(key===k?0:coefficients[j]*v[key]),0)/coefficients[keys.indexOf(k)],valid:v=>{const sum=keys.reduce((n,key,j)=>n+coefficients[j]*v[key],0);return Math.abs(sum)<=64*Number.EPSILON*Math.max(1,...keys.map(k=>Math.abs(v[k])));}});
 // Inclusion-exclusion is exact only if every required intersection is
 // represented. Missing intersections never become zero by default.
 let complete=true;const keys=[combined,...unique],coeff=[1,...unique.map(()=>-1)];
 for(let mask=1;mask<2**unique.length;mask++){
  const group=unique.filter((_,j)=>mask&(1<<j));if(group.length<2)continue;
  const k=lookup.get(keyFor(group));if(!k){complete=false;continue;}keys.push(k);coeff.push(group.length%2===0?1:-1);
 }
 if(complete)relations.push(linear(keys,coeff,"Unique combined population = inclusion-exclusion of compatible populations"));
 const constraints=[...(base.constraints??[])];
 constraints.push({keys:[combined,...unique],message:"Combined population cannot exceed the sum of its members",violated:v=>[combined,...unique].every(k=>Number.isFinite(v[k]))&&v[combined]>unique.reduce((n,k)=>n+v[k],0)});
 return {...base,relations,populationLinks:links,constraints};
}
