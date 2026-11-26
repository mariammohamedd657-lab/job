import { test, expect } from "@playwright/test";
import { configs, type Config } from "../app/quantification/config";
import { problems } from "../app/discovery/data";
import { operationalPanels, operationalEquations, operationalMethods, type OperationalPanel } from "../app/quantification/operational-data";
import { solve, type Figures } from "../app/quantification/solver";

type Block={keys:string[];groups:string[][];threshold:number;direct:string[][]};
type Fixture={values:Record<string,number>;blocks:Block[]};
const prefix="negative-operational-";
const check=(condition:unknown,message:string)=>{if(!condition)throw new Error(message);};
const eq=(a:number,b:number)=>Number.isFinite(a)&&Math.abs(a-b)<=1e-8*Math.max(1,Math.abs(a),Math.abs(b));
const popcount=(n:number)=>{let c=0;while(n){n&=n-1;c++;}return c;};

// Independent closed-form fixtures and identifiability rules, not the solver's
// calculated outputs or its list of Relation objects. Interior examples:
// all denominators positive, rates strictly between 0 and 100, difference nonzero.
function fixture(c:Config,panels:OperationalPanel[],example:number):Fixture{
 const scale=example===0?1:2;
 const values:Record<string,number>={total:example===0?200:300,affected:60*scale,unaffected:example===0?140:180,affectedPct:example===0?30:40,unaffectedPct:example===0?70:60,months:3+example};
 const blocks:Block[]=[];
 const block=(keys:string[],threshold:number,groups:string[][]=[],direct:string[][]=[keys])=>blocks.push({keys,threshold,groups,direct});
 block(["total","affected","unaffected","affectedPct","unaffectedPct"],2,[["affectedPct","unaffectedPct"]],[["total","affected","unaffected"],["affected","total","affectedPct"],["unaffected","total","unaffectedPct"],["affectedPct","unaffectedPct"]]);
 if(c.timePopulation){
  if(c.timePopulation==="recordedUnits")values.recordedUnits=40*scale;
  values.averageMinutes=example===0?18:24;
  values.hours=values[c.timePopulation]*values.averageMinutes/60;
  block(["hours",c.timePopulation,"averageMinutes"],2);
 }
 if(c.fields.Frequency.length){values.days=example===0?12:15;values.daily=values.affected/values.days;block(["affected","days","daily"],2);}
 if(c.actualKey){values.target=values[c.actualKey]*(example===0?.8:1.25);values.difference=values[c.actualKey]-values.target;values.targetPct=values[c.actualKey]/values.target*100;block([c.actualKey,"target","difference","targetPct"],2,[],[[c.actualKey,"target","difference"],[c.actualKey,"target","targetPct"]]);}
 if(c.moneyPopulation){values.moneyAverage=example===0?25.5:71.25;values.moneyTotal=values[c.moneyPopulation]*values.moneyAverage;block(["moneyTotal",c.moneyPopulation,"moneyAverage"],2);}
 for(const panel of panels){
  const method=operationalMethods[c.id][panel.id.slice(prefix.length)];
  const key=panel.primaryKey, op="op:"+panel.id.slice(prefix.length)+":";
  switch(method){
   case "calls":case "leads":case "qualified":case "booking":{
    const pop=method==="calls"?op+"unique-leads":method==="leads"?"affected":method==="qualified"?op+"affected-qualified-leads":op+"intended-bookings";
    const recovered=op+"recovered",pending=op+"pending",rate=op+"loss-rate";
    if(pop!=="affected")values[pop]=(method==="calls"||method==="qualified"?40:80)*scale;
    values[recovered]=values[pop]*(example===0?.25:.2);
    values[pending]=values[pop]*(example===0?.25:.2);
    values[key]=values[pop]-values[recovered]-values[pending];
    values[rate]=100*values[key]/values[pop];
    block([pop,recovered,pending,key,rate],3,[[pop,key,rate]],[[pop,recovered,pending,key],[pop,key,rate]]);
    break;
   }
   case "reactivation":case "attendance":case "invoices":case "reviews":{
    const population=method==="invoices"&&c.id==="problem-22"?op+"affected-invoices":"affected";
    const rate=op+({reactivation:"reactivation-rate",attendance:"attendance-loss-rate",invoices:"invoice-loss-rate",reviews:"additional-review-rate"}[method]);
    if(population!=="affected")values[population]=40*scale;
    values[rate]=example===0?25:40;
    values[key]=values[population]*values[rate]/100;
    block([population,rate,key],2);
    break;
   }
   case "time":{
    const rate=op+"avoidable-percentage",necessary=op+"necessary-time";
    values[rate]=example===0?25:40;
    values[key]=values.hours*values[rate]/100;
    values[necessary]=values.hours-values[key];
    block(["hours",necessary,key,rate],2,[],[["hours",necessary,key],["hours",key,rate]]);break;
   }
   case "information":break;
   default:values[key]=example===0?7:11;
  }
 }
 return {values,blocks};
}
type Rule={requires:number;adds:number};
function components(keys:string[],blocks:Block[]):string[][]{
 const remaining=new Set(keys),result:string[][]=[];
 while(remaining.size){
  const group=new Set([remaining.values().next().value!]);
  let changed=true;while(changed){changed=false;for(const b of blocks)if(b.keys.some(k=>group.has(k)))for(const k of b.keys)if(!group.has(k)){group.add(k);changed=true;}}
  for(const k of group)remaining.delete(k);result.push([...group]);
 }
 return result;
}
function rulesFor(keys:string[],blocks:Block[]):Rule[]{
 const rules:Rule[]=[];
 const mask=(ks:string[])=>ks.reduce((n,k)=>n|(1<<keys.indexOf(k)),0);
 for(const b of blocks){
  if(!b.keys.every(k=>keys.includes(k)))continue;
  const all=mask(b.keys);
  // The only dependent local subsets are these explicitly stated groups:
  // the complementary rates, or population/loss/rate.
  const exceptions=b.groups.map(group=>mask(group));
  for(let m=1;m<1<<b.keys.length;m++){
   const local=mask(b.keys.filter((_,i)=>m&(1<<i)));
   if(popcount(m)===b.threshold&&!exceptions.some(e=>(local&e)===local))rules.push({requires:local,adds:all});
   for(const e of exceptions)if((local&e)===local&&popcount(local)===popcount(e)-1)rules.push({requires:local,adds:e});
  }
 }
 return rules;
}
function closeMask(m:number,rules:Rule[]):number{
 let previous=-1;while(previous!==m){previous=m;for(const rule of rules)if((m&rule.requires)===rule.requires)m|=rule.adds;}return m;
}
// Each algebraic block is rationally invertible from every nondependent basis
// in the stated interior domain. The block incidence graph is a forest, so
// each connection contributes only one shared scalar. No extra global
// dependency can arise from a loop between blocks.
function verifyForest(keys:string[],blocks:Block[]){
 const parent=new Map<string,string>();
 const root=(k:string):string=>{const p=parent.get(k);if(!p||p===k)return k;const r=root(p);parent.set(k,r);return r;};
 blocks.forEach((b,i)=>{const node="block:"+i;for(const key of b.keys){check(keys.includes(key),"Unknown key "+key);const a=root(node),z=root(key);check(a!==z,"Block incidence graph contains cycle");parent.set(a,z);}});
}
for(const c of configs)test("minimum-input audit "+c.id,()=>{
 test.setTimeout(180000);
 const problem=problems.find(p=>p.id===c.id)!;
 const impactIds=problem.operationalImpacts.map(i=>i.id);
 let configurations=0,quantityOccurrences=0,subsetEnumerations=0,minimumTargetCombinations=0,minimumSets=0,removalSets=0,solverCases=0,combinedCases=0,chainedOrCombinedCases=0,algebraicCases=0,verifiedTargets=0;
 const uniqueKeys=new Set<string>();
 for(let selection=0;selection<1<<impactIds.length;selection++){
  const panels=operationalPanels(c,impactIds.filter((_,i)=>selection&(1<<i)));
  const keys=[...new Set([...Object.values(c.fields).flat().map(f=>f.key),...panels.flatMap(p=>p.fields.map(f=>f.key))])];
  configurations++;quantityOccurrences+=keys.length;for(const k of keys)uniqueKeys.add(k);
  const equations=operationalEquations(panels);
  for(let example=0;example<2;example++){
   const {values,blocks}=fixture(c,panels,example);
   check(keys.every(k=>Number.isFinite(values[k])),c.id+" missing independent fixture");
   verifyForest(keys,blocks);
   for(const group of components(keys,blocks)){
    check(group.length<25,"Audit component exceeds practical enumeration limit");
    const rules=rulesFor(group,blocks),size=1<<group.length;
    const directMasks=blocks.filter(b=>b.keys.every(k=>group.includes(k))).flatMap(b=>b.direct.map(eq=>eq.reduce((n,k)=>n|(1<<group.indexOf(k)),0)));
    const closures=new Uint32Array(size),cases=new Set<number>([0,size-1]),minimal=new Set<number>(),removals=new Set<number>();
    for(let mask=0;mask<size;mask++)closures[mask]=closeMask(mask,rules);
    subsetEnumerations+=size;
    for(let mask=1;mask<size;mask++){
     let derived=closures[mask]&~mask;
     for(let i=0;i<group.length;i++)if(derived&(1<<i)){
      const target=1<<i;
      let isMinimal=true;for(let bits=mask;bits;bits&=bits-1)if(closures[mask^(bits&-bits)]&target){isMinimal=false;break;}
      if(isMinimal){minimumTargetCombinations++;minimal.add(mask);for(let bits=mask;bits;bits&=bits-1)removals.add(mask^(bits&-bits));}
     }
    }
    minimumSets+=minimal.size;removalSets+=removals.size;
    for(const m of minimal)cases.add(m);for(const m of removals)cases.add(m);
    // Small connected components: exercise every subset directly, not just minimum sets.
    if(group.length<=9)for(let m=0;m<size;m++)cases.add(m);
    for(const mask of cases){
     const raw:Figures={};group.forEach((k,i)=>{if(mask&(1<<i))raw[k]=String(values[k]);});
     const result=solve(c,raw,equations);solverCases++;
     const label=c.id+" / selection "+selection+" / example "+example+" / inputs "+JSON.stringify(raw);
     check(!result.errors.length,label+" unexpected errors: "+result.errors.join("; "));
     const determined=closures[mask];
     const known=new Set(group.filter((_,i)=>determined&(1<<i)));
     if(popcount(determined&~mask)>1)combinedCases++;
     let firstStep=mask;
     for(const equation of directMasks)if(popcount(equation&~mask)===1)firstStep|=equation;
     if(determined&~firstStep)chainedOrCombinedCases++;
     if(Object.values(result.calculated).some(s=>s.includes("(combined:")))algebraicCases++;
     for(const key of keys){
      if(known.has(key)){verifiedTargets++;check(eq(result.values[key],values[key]),label+" expected "+key+" = "+values[key]+", got "+result.values[key]);}
      else check(result.values[key]===undefined,label+" unexpectedly determined "+key+" = "+result.values[key]);
     }
    }
   }
  }
 }
 console.log("MINIMUM_AUDIT "+JSON.stringify({problem:c.id,impactCount:impactIds.length,configurations,uniqueQuantities:uniqueKeys.size,quantityOccurrences,subsetEnumerations,minimumTargetCombinations,minimumSets,removalSets,solverCases,combinedCases,chainedOrCombinedCases,algebraicCases,verifiedTargets}));
});

test("algebraic boundary routes, ambiguity, contradiction isolation and exact count validation",()=>{
 const c=configs.find(x=>x.id==="problem-20")!;
 const panels=operationalPanels(c,problems.find(x=>x.id===c.id)!.operationalImpacts.map(x=>x.id));
 const equations=operationalEquations(panels);
 const zero=solve(c,{total:"0"},equations);
 check(zero.values.affected===0&&zero.values.unaffected===0&&zero.values.hours===0,"Zero total must determine counts and total time");
 check(zero.values.affectedPct===undefined&&zero.values.unaffectedPct===undefined,"Zero population percentages undefined");
 const pct=solve(c,{targetPct:"100"},equations);
 check(pct.values.difference===0,"100% comparison determines zero difference");
 check(pct.values.hours===undefined&&pct.values.target===undefined,"100% does not identify actual or target");
 const no=solve(c,{affectedPct:"0"},equations);
 check(no.values.affected===0&&no.values.total===undefined,"0% identifies affected count but not population");
 const none=solve(c,{averageMinutes:"0"},equations);
 check(none.values.hours===0&&none.values.affected===undefined,"Zero average fixes hours, not population");
 const partial=solve(c,{total:"10",affected:"20",months:"3",target:"8",difference:"2"},equations);
 check(partial.errors.length&&partial.values.months===3&&partial.values.hours===10,"Contradiction must not block independent comparison and duration");
 check(partial.values.unaffected===undefined,"Contradictory population cannot calculate remaining count");
 const fraction=solve(c,{total:"10",affectedPct:"15"},equations);
 check(fraction.errors.length&&fraction.values.affected===undefined,"Fractional confirmed counts must not be silently rounded");
 const tiny=solve(c,{averageMinutes:"0.000000000001",affected:"1"},equations);
 check(tiny.values.hours>0,"Small positive hours must not become zero");
 const input={total:"100",unaffected:"70",averageMinutes:"15",days:"10"};
 const first=solve(c,input,equations),second=solve(c,Object.fromEntries(Object.entries(input).reverse()),equations);
 for(const key of Object.keys(first.values))check(eq(first.values[key],second.values[key]),"Order changes "+key);
 const edited=solve(c,{...input,unaffected:"60"},equations);check(edited.values.affected===40&&edited.values.hours===10,"Edited input recalculates");
 const removed=solve(c,{total:"100",averageMinutes:"15",days:"10"},equations);check(removed.values.affected===undefined&&removed.values.hours===undefined,"Removing information clears underdetermined values");
});

test("bounded rates and counts can determine a result without entering an intermediate population",()=>{
 const c=configs.find(x=>x.id==="problem-9")!;
 const ps=operationalPanels(c,problems.find(x=>x.id===c.id)!.operationalImpacts.map(x=>x.id));
 const eqs=operationalEquations(ps);
 const primary=ps[0].primaryKey,rate=ps[0].fields.find(x=>x.unit==="%")!.key;
 const saturated=solve(c,{total:"40",[primary]:"40"},eqs);
 check(!saturated.errors.length,"Saturated rate example contradicts: "+saturated.errors.join("; "));
 check(saturated.values.affected===40&&saturated.values.unaffected===0&&saturated.values[rate]===100,"Maximum possible result fixes population, remaining count and rate");
 const nonunique=solve(c,{total:"40",[primary]:"20"},eqs);
 check(!nonunique.errors.length&&nonunique.values.affected===undefined&&nonunique.values[rate]===undefined,"Do not guess a value from a non-singleton range");
 const impossible=solve(c,{total:"40",[primary]:"41",months:"3"},eqs);
 check(impossible.errors.length&&impossible.values.months===3,"Impossible bounds must not disable unrelated duration");
 const lostC=configs.find(x=>x.id==="problem-6")!;
 const lostPanels=operationalPanels(lostC,["negative-operational-lost-leads"]),lostEq=operationalEquations(lostPanels);
 const unique=solve(lostC,{total:"10","op:lost-leads:recovered":"5","op:lost-leads:loss-rate":"30"},lostEq);
 check(!unique.errors.length&&unique.values.affected===10&&unique.values["op:lost-leads:result"]===3&&unique.values["op:lost-leads:pending"]===2,"Integer count and rate ranges identify the only feasible count");
});

test("all 28 problems preserve zero quantities and undefined percentages at base equation boundaries",()=>{
 let cases=0;
 for(const c of configs){
  const zero=solve(c,{total:"0"});
  check(!zero.errors.length&&zero.values.affected===0&&zero.values.unaffected===0,c.id+" zero population");
  check(zero.values.affectedPct===undefined&&zero.values.unaffectedPct===undefined,c.id+" zero denominator");
  cases++;
  for(const [key,value,expected] of [["affectedPct","0","affected"],["unaffectedPct","100","affected"],["affectedPct","100","unaffected"],["unaffectedPct","0","unaffected"]]){
   const r=solve(c,{[key]:value});
   check(!r.errors.length&&r.values[expected]===0&&r.values.total===undefined,c.id+" boundary "+key+"="+value);
   cases++;
  }
  if(c.actualKey){
   const equality=solve(c,{targetPct:"100"}),zeroActual=solve(c,{targetPct:"0"});
   check(equality.values.difference===0&&equality.values[c.actualKey]===undefined,c.id+" 100% comparison");
   check(zeroActual.values[c.actualKey]===0&&zeroActual.values.target===undefined,c.id+" zero comparison");
   cases+=2;
  }
  if(c.fields.Frequency.length){
   const r=solve(c,{days:"0"});
   check(r.values.affected===0&&r.values.daily===undefined,c.id+" zero days");
   cases++;
  }
  if(c.timePopulation){const r=solve(c,{averageMinutes:"0"});check(r.values.hours===0&&r.values[c.timePopulation]===undefined,c.id+" zero average time");cases++;}
  if(c.moneyPopulation){const r=solve(c,{moneyAverage:"0"});check(r.values.moneyTotal===0&&r.values.affected===undefined,c.id+" zero money");cases++;}
  const contradiction=solve(c,{total:"0",affectedPct:"50",months:"3"});
  check(contradiction.errors.length&&contradiction.values.months===3,c.id+" invalid zero denominator");
  cases++;
 }
 console.log("BOUNDARY_AUDIT "+JSON.stringify({problems:28,cases}));
});
test("redundant display-rounded figures do not create false contradictions",()=>{
 const c=configs.find(x=>x.id==="problem-6")!;
 const small=solve(c,{total:"3",affected:"1",affectedPct:"33.33333333"});
 check(!small.errors.length&&small.values.unaffected===2,"Rounded percentage must not invalidate exact known counts: "+small.errors.join("; "));
 const large=solve(c,{total:"3000000000",affected:"1000000000",affectedPct:"33.33333333"});
 check(!large.errors.length&&large.values.unaffected===2000000000,"Large consistent figures must not be blocked by an absolute residual tolerance: "+large.errors.join("; "));
});


// Exercise the actual input elements, not internal state. The fixture above is
// independent of the solver, and each field is identified by its existing ID.
for(const c of configs)test("universal editable numerical fields "+c.id,async({page})=>{
 test.setTimeout(180000);
 const problem=problems.find(p=>p.id===c.id)!;
 const panels=operationalPanels(c,problem.operationalImpacts.map(i=>i.id));
 const {values,blocks}=fixture(c,panels,0);
 const derivable=new Set(blocks.flatMap(b=>b.keys));
 await page.goto("/");
 const discovery=page.locator('[data-problem="'+c.id+'"]');
 await discovery.getByRole("button",{name:/^Expand/}).click();
 for(const impact of problem.operationalImpacts)await discovery.getByRole("checkbox",{name:impact.label,exact:true}).check();
 await page.getByRole("link",{name:"Quantification"}).click();
 await page.locator("#q-problem").click();
 await page.locator('#q-problem-options [data-value="'+c.id+'"]').click();
 await page.locator(".op-panel > button").click();
 const input=page.locator('.q-page input[type="number"]');
 const keyOf=async(i:number)=>(await input.nth(i).getAttribute("data-quantity"))!;
 const copies=(key:string)=>page.locator('.q-page input[type="number"][data-quantity="'+key+'"]');
 const count=await input.count();
 const expectedFields=Object.values(c.fields).flat().length+panels.reduce((n,p)=>n+p.fields.length,0);
 expect(count).toBe(expectedFields);
 let blankEdits=0,calculatedEdits=0,directEdits=0,sharedChecks=0;
 const keys=[...new Set(await input.evaluateAll(nodes=>nodes.map(n=>n.getAttribute("data-quantity")!)))];
 const expected=(key:string)=>String(Number(values[key].toPrecision(10)));
 // Every occurrence accepts genuine keyboard input when blank. Clearing the
 // only manual constraint returns that occurrence and all equivalent ones to blank.
 for(let i=0;i<count;i++){
  const field=input.nth(i),key=await keyOf(i);
  await expect(field).toBeEditable();
  await expect(field).toHaveValue("");
  await field.click();
  await field.pressSequentially("7");
  for(const copy of await copies(key).all())await expect(copy).toHaveValue("7");
  await field.press("ControlOrMeta+a");
  await field.press("Backspace");
  await expect(field).toHaveValue("");
  await field.blur();
  for(const copy of await copies(key).all())await expect(copy).toHaveValue("");
  blankEdits++;
 }
 // Enter a coherent independent fixture through the existing inputs.
 for(const key of keys)await copies(key).first().fill(String(values[key]));
 await input.last().blur();
 await expect(page.locator(".q-errors")).toHaveCount(0);
 for(let i=0;i<count;i++){
  const field=input.nth(i),key=await keyOf(i);
  const original=String(values[key]);
  await field.fill("");
  await field.blur();
  if(derivable.has(key)){
   await expect(field).toHaveValue(expected(key));
   await expect(field).toBeEditable();
   const row=field.locator("xpath=../..");
   if(await field.locator("xpath=ancestor::section[contains(@class,'op-impact-card')]").count())
    await expect(row.locator(".op-auto")).toHaveText("Automatically calculated");
   else await expect(field).toHaveClass(/q-calculated/);
   // Important: delete the actual displayed derived value before typing.
   // Previously it was immediately restored, obstructing sequential entry.
   await field.click();
   await field.press("ControlOrMeta+a");
   await field.press("Backspace");
   await expect(field).toHaveValue("");
   calculatedEdits++;
  }else{
   await expect(field).toHaveValue("");
   directEdits++;
  }
  // An intentionally different manual constraint is preserved even when it
  // contradicts another entry. All equivalent fields show the manual value.
  await field.pressSequentially(key==="difference"?"-7":"17");
  const replacement=key==="difference"?"-7":"17";
  await expect(field).toHaveValue(replacement);
  for(const copy of await copies(key).all()){
   await expect(copy).toHaveValue(replacement);
   sharedChecks++;
  }
  await field.fill(original);
  await field.blur();
  for(const copy of await copies(key).all())await expect(copy).toHaveValue(original);
  await expect(page.locator(".q-errors")).toHaveCount(0);
 }
 for(const panel of panels)await expect(page.locator('.op-impact-card[data-impact="'+panel.id+'"] .op-result-row strong')).toHaveText(expected(panel.primaryKey));
 // Direct-entry impact fields can also be inferred at the zero-cause
 // boundary. Verify that those inferred zeros are just as editable.
 let logicalEdits=0;
 await page.locator(".q-calculator").getByRole("button",{name:"Reset",exact:true}).click();
 await page.locator(".op-impact-content").getByRole("button",{name:"Reset",exact:true}).click();
 const affected=page.locator('[data-section="Quantity"] input[data-quantity="affected"]');
 await affected.fill("0");
 for(const panel of panels){
  if(derivable.has(panel.primaryKey))continue;
  const card=page.locator('.op-impact-card[data-impact="'+panel.id+'"]');
  const primary=card.locator('input[data-quantity="'+panel.primaryKey+'"]');
  await expect(primary).toHaveValue("0");
  await expect(primary).toBeEditable();
  await primary.click();await primary.press("ControlOrMeta+a");await primary.press("Backspace");
  await expect(primary).toHaveValue("");
  await primary.pressSequentially("7");
  await expect(primary).toHaveValue("7");
  await expect(affected).toHaveValue("0");
  await expect(page.locator(".q-errors").first()).toBeVisible();
  await primary.fill("");await primary.blur();
  await expect(primary).toHaveValue("0");
  await expect(card.locator(".op-result-row strong")).toHaveText("0");
  await expect(page.locator(".q-errors")).toHaveCount(0);
  logicalEdits++;
 }
 console.log("EDITABILITY_AUDIT "+JSON.stringify({problem:c.id,fields:count,uniqueQuantities:keys.length,blankEdits,calculatedEdits,directEdits,logicalEdits,sharedChecks}));
});

test("clearing an inferred value allows replacement typing and independently recalculates equivalent fields",async({page})=>{
 await page.goto("/");
 const problem=page.locator('[data-problem="problem-6"]');
 await problem.getByRole("button",{name:/^Expand/}).click();
 await problem.getByRole("checkbox",{name:"Lost leads",exact:true}).check();
 await page.getByRole("link",{name:"Quantification"}).click();
 await page.locator("#q-problem").click();
 await page.locator('#q-problem-options [data-value="problem-6"]').click();
 const base=(key:string)=>page.locator('[data-section="Quantity"] input[data-quantity="'+key+'"]');
 await base("total").fill("100");await base("unaffected").fill("80");
 await page.locator(".op-panel > button").click();
 const op=(key:string)=>page.locator('.op-impact-card input[data-quantity="'+key+'"]');
 await expect(op("affected")).toHaveValue("20");
 await op("op:lost-leads:recovered").fill("8");await op("op:lost-leads:pending").fill("7");
 const lost=op("op:lost-leads:result");
 await expect(lost).toHaveValue("5");
 await lost.click();await lost.press("ControlOrMeta+a");await lost.press("Backspace");
 await expect(lost).toHaveValue("");
 await lost.pressSequentially("6");
 await expect(lost).toHaveValue("6");
 await expect(page.locator(".q-errors").first()).toBeVisible();
 await expect(op("op:lost-leads:recovered")).toHaveValue("8");
 await base("unaffected").fill("");
 await expect(base("affected")).toHaveValue("21");
 await expect(op("affected")).toHaveValue("21");
 await expect(base("unaffected")).toHaveValue(""); // still editing the cleared constraint
 await base("unaffected").blur();
 await expect(base("unaffected")).toHaveValue("79");
 await expect(page.locator(".op-result-row strong")).toHaveText("6");
 await lost.fill("");await lost.blur();
 await expect(lost).toHaveValue("");
 await expect(base("affected")).toHaveValue("");
});


test("actual simultaneous algebraic deduction is displayed and editable without an intermediate input",async({page})=>{
 await page.goto("/quantification");
 const comparison=page.locator('[data-section="Comparison"]');
 const input=(key:string)=>comparison.locator('input[data-quantity="'+key+'"]');
 await input("targetPct").fill("100");
 await expect(input("difference")).toHaveValue("0");
 await expect(input("affected")).toHaveValue("");
 await expect(input("target")).toHaveValue("");
 await page.locator(".q-calculator").getByRole("checkbox",{name:"Show calculations"}).check();
 const explanation=input("difference").locator("xpath=../..").locator(".q-formula");
 await expect(explanation).toContainText("combined:");
 await expect(explanation).toContainText("Actual = target + difference");
 await expect(explanation).toContainText("Actual = target × percentage of target");
 await input("difference").click();await input("difference").press("ControlOrMeta+a");await input("difference").press("Backspace");
 await expect(input("difference")).toHaveValue("");
 await input("difference").pressSequentially("3");
 await expect(input("difference")).toHaveValue("3");
 await expect(input("targetPct")).toHaveValue("100");
 await expect(page.locator(".q-errors").first()).toBeVisible();
 await input("targetPct").fill("");await input("target").fill("10");
 await expect(input("affected")).toHaveValue("13");
 await expect(page.locator('[data-section="Quantity"] input[data-quantity="affected"]')).toHaveValue("13");
 await expect(input("targetPct")).toHaveValue("130");
});


test("retyping the same calculated number explicitly retains it as a manual constraint",async({page})=>{
 await page.goto("/quantification");
 const quantity=page.locator('[data-section="Quantity"]');
 const input=(key:string)=>quantity.locator('input[data-quantity="'+key+'"]');
 await input("total").fill("10");await input("unaffected").fill("5");
 await expect(input("affected")).toHaveValue("5");
 await expect(input("affected")).toHaveClass(/q-calculated/);
 await input("affected").click();await input("affected").press("ControlOrMeta+a");
 await input("affected").pressSequentially("5");
 await expect(input("affected")).not.toHaveClass(/q-calculated/);
 await input("unaffected").fill("");await input("unaffected").blur();
 await expect(input("affected")).toHaveValue("5");
 await expect(input("unaffected")).toHaveValue("5");
 await input("total").fill("");await input("total").blur();
 await expect(input("affected")).toHaveValue("5");
 await expect(input("total")).toHaveValue("");
 await expect(input("unaffected")).toHaveValue("");
});
