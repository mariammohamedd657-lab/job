import {test,expect} from "@playwright/test";
import {configs} from "../app/quantification/config";
import {quantityDefinitions,numericalTypes,validNumericalValue,definition} from "../app/quantification/canonical-definitions";
import {fieldReference,canShare,instanceState} from "../app/quantification/quantity-identity";
import {registryFor} from "../app/quantification/quantity-registry";
import {problemPairRelationships,crossPanelIdentitySpecification,populationRelationshipSpecification} from "../app/quantification/canonical-relationships";
import {solve} from "../app/quantification/solver";
test("canonical registry resolves every visible and hidden field and every registered route across all 28 problems",()=>{
 let fields=0,instances=0,routes=0,conditional=0;
 expect(configs.length).toBe(28);
 for(const [id,d] of Object.entries(quantityDefinitions)){
  expect(d.id).toBe(id);expect(d.name.length).toBeGreaterThan(0);expect(d.definition.length).toBeGreaterThan(0);expect(d.unit.length).toBeGreaterThan(0);
  expect(d.types.every(t=>t in numericalTypes)).toBe(true);expect(d.scopeRequirements).toContain("populationId");expect(d.scopeRequirements).toContain("measurementPeriod");
 }
 const all=new Set<string>();
 for(const c of configs){
  const registry=registryFor(c.id);
  for(const f of registry.fields){
   expect(definition(f.reference.canonicalId)).toBe(f.reference.definition);
   expect(f.reference.label).not.toBe("");expect(f.reference.unit).not.toBe("");
   expect(registry.instances[f.reference.legacyKey].instanceId).toBe(f.reference.instanceId);
   expect(registry.instances[f.reference.legacyKey].canonicalId).toBe(f.reference.canonicalId);
   expect(f.reference.scope.status).toBe("local-reference");
  }
  for(const f of Object.values(registry.instances)){expect(all.has(f.instanceId)).toBe(false);all.add(f.instanceId);}
  const ids=new Set(Object.values(registry.instances).map(f=>f.instanceId));
  for(const route of registry.routes){
   expect(route.reference).not.toBe("");expect(route.condition).not.toBe("");
   for(const id of [...route.fieldInstanceIds,...(route.resultInstanceId?[route.resultInstanceId]:[])])expect(ids.has(id),route.id+" "+id).toBe(true);
   if(route.panel==="financial")expect(route.active).toBe(false);
  }
  for(const rel of registry.conditionalIdentities){expect(ids.has(rel.left)&&ids.has(rel.right)).toBe(true);expect(rel.active).toBe(false);}
  fields+=registry.fields.length;instances+=ids.size;routes+=registry.routes.length;conditional+=registry.conditionalIdentities.length;
 }
 expect(problemPairRelationships.length).toBe(31);expect(crossPanelIdentitySpecification.length).toBe(32);expect(populationRelationshipSpecification.length).toBe(72);
 console.log("STEP3_REGISTRY_AUDIT "+JSON.stringify({definitions:Object.keys(quantityDefinitions).length,problems:28,fields,instances,routes,conditional,pairs:31}));
});
test("type restrictions distinguish actual counts, estimates, signed values, rates and ratios",()=>{
 for(const [type,value,valid] of [["COUNT",12.5,false],["EST_COUNT",15.544,true],["PCT",123,false],["TARGET_PCT",123,true],["SIGNED_MONEY",-4500,true],["MINUTES",2.75,true],["DIFF",-30,true],["COUNT",1.5,false],["FTE",1.5,true],["INTEREST",125,true],["RATIO",2,true],["MARGIN",-20,true],["MONEY",-1,false]] as const)expect(validNumericalValue(type,value),type+" "+value).toBe(valid);
 expect(validNumericalValue("MARGIN",101,{positiveRevenueAndNonnegativeCosts:true})).toBe(false);
 expect(validNumericalValue("DAYS",0,{denominator:true})).toBe(false);
});
test("identical explicit keys share an instance; similar or conditional measurements remain distinct",()=>{
 const r1=registryFor("problem-1"),r2=registryFor("problem-2"),r28=registryFor("problem-28"),r20=registryFor("problem-20");
 expect(r1.instances.affected.canonicalId).toBe("incoming_calls.affected");
 expect(r1.instances["op:lost-leads:unique-leads"].canonicalId).toBe("unique_affected_leads");
 expect(canShare(r1.instances.affected,r1.instances["op:lost-leads:unique-leads"])).toBe(false);
 expect(canShare(r1.instances["op:lost-leads:result"],r2.instances["op:lost-leads:result"])).toBe(false);
 expect(r20.instances.total.canonicalId).toBe(r28.instances.total.canonicalId);
 expect(canShare(r20.instances.total,r28.instances.total)).toBe(false);
 expect(r28.instances.hours.canonicalId).toBe("required_staff_hours");
 expect(r28.instances.target.canonicalId).toBe("available_staff_hours");
 expect(r28.fields.filter(f=>f.reference.legacyKey==="hours").every(f=>f.reference.instanceId===r28.instances.hours.instanceId)).toBe(true);
 expect(r1.instances["fin:purchase-total-revenue"].canonicalId).toBe(r1.instances["fin:buyer-scope-revenue"].canonicalId);
 expect(canShare(r1.instances["fin:purchase-total-revenue"],r1.instances["fin:buyer-scope-revenue"])).toBe(false);
 expect(canShare(r1.instances["fin:confirmed-margin"],r1.instances["fin:potential-margin"])).toBe(false);
 const c=configs.find(c=>c.id==="problem-1")!,raw={total:"100",affected:"25"},result=solve(c,raw);
 const state=instanceState(r1.instances.unaffected,raw,result);
 expect(state.calculatedValue).toBe(75);expect(state.source).toBe("calculated");
 expect(instanceState(r1.instances.affected,raw,result).manualValue).toBe("25");
});
test("browser uses canonical field identities in all 28 problem selectors and financial routes",async({page})=>{
 test.setTimeout(120000);
 await page.goto("/quantification");
 await page.getByRole("button",{name:"Negative financial impacts",exact:true}).click();
 for(const c of configs){
  await page.locator("#q-problem").click();await page.locator('#q-problem-options [data-value="'+c.id+'"]').click();
  const registry=registryFor(c.id);
  const base=page.locator('.q-calculator input[data-quantity="affected"]').first();
  await expect(base).toHaveAttribute("data-canonical-quantity",registry.instances.affected.canonicalId);
  await expect(base).toHaveAttribute("data-quantity-instance",registry.instances.affected.instanceId);
  const check=page.locator(".fin-card").first().getByRole("checkbox");await check.check();
  for(const field of await page.locator(".fin-card").first().locator("input[data-quantity]").all()){
   const key=await field.getAttribute("data-quantity");await expect(field).toHaveAttribute("data-quantity-instance",registry.instances[key!].instanceId);
   await expect(field).toBeEditable();
  }
  await check.uncheck();
 }
});
test("canonical browser references preserve shared values and enforce new financial count domains",async({page})=>{
 await page.goto("/quantification");await page.getByRole("button",{name:"Negative financial impacts",exact:true}).click();
 const card=(id:string)=>page.locator('[data-financial-impact="'+id+'"]');
 await card("F1").getByRole("checkbox").check();await card("F2").getByRole("checkbox").check();
 const count=card("F1").locator('input[data-quantity="fin:confirmed-purchases"]');
 await expect(count).toHaveAttribute("data-numerical-type","COUNT");await count.fill("12.5");await expect(count).toHaveClass(/q-invalid/);
 await count.fill("12");await expect(count).not.toHaveClass(/q-invalid/);
 const loss=card("F1").locator('input[data-quantity="fin:confirmed-revenue"]'),copy=card("F2").locator('input[data-quantity="fin:confirmed-revenue"]');
 await loss.fill("1200");await expect(copy).toHaveValue("1200");await expect(copy).toHaveAttribute("data-quantity-instance",(await loss.getAttribute("data-quantity-instance"))!);
 await card("F2").locator('input[data-quantity="fin:confirmed-profit"]').fill("-4500");await expect(card("F2").locator(".op-result-row strong")).toHaveText("-4500");
 await card("F7").getByRole("checkbox").check();const buyers=card("F7").locator('input[data-quantity="fin:potential-buyers"]');await buyers.fill("15.544");await expect(buyers).not.toHaveClass(/q-invalid/);
});
