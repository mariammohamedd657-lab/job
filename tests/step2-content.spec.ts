import {test,expect,type Page} from "@playwright/test";
import {configs} from "../app/quantification/config";
import {financialContent,financialApplicability,routeFields,operationalAlternatives,shortfallRoute} from "../app/quantification/step2-content";
import {operationalPanels} from "../app/quantification/operational-data";
import {problems} from "../app/discovery/data";
import {solve} from "../app/quantification/solver";
const expectedNames=["Confirmed revenue loss","Confirmed contribution profit loss","Higher costs","Wasted costs","Delayed cash collection","Money lost from unpaid invoices","Lost potential revenue","Lost potential contribution profit","Estimated higher costs","Estimated money lost from unpaid invoices"];
const expectedPrimary=[[7,8],[7,8],[7,8],[7,8],[7,8],[7,8],[7,8],[7,8],[7,8],[7,8],[7,8],[7,8],[7,8],[4,7,8],[4,7,8],[4,7,8],[4],[7,8],[4],[3,4,9],[7,8],[5,6,10],[5,6,10],[7,8],[],[7,8],[],[3,9]];
const expectedConditional=[[1,2,3,4,9],[1,2,3,4,9],[1,2,3,4,9],[1,2,3,4,9],[1,2,3,4,9],[1,2,3,4,9],[1,2,3,4,9],[1,2,3,4,9],[1,2,3,4,9],[1,2,3,4,9],[1,2,3,4,9],[1,2,3,4,9],[1,2,3,4,9],[1,2,3,9],[1,2,3,9],[1,2,3,9],[1,2,3,7,8,9],[1,2,3,4,9],[3,9],[1,2,7,8],[1,2,3,4,9],[3,4,9],[3,4,9],[1,2,3,4,9],[1,2,3,4,7,8,9],[1,2,3,4,9],[1,2,3,4,7,8,9],[1,2,4,7,8]];
const choose=async(page:Page,id:string)=>{await page.locator("#q-problem").click();await page.locator('#q-problem-options [data-value="'+id+'"]').click();};
test("Step 2 configuration matches all 28 supplied financial mappings and preserves the working solver",()=>{
 let total=0,primary=0,fields=0,routes=0,ops=0;
 const allNames=new Set<string>();
 for(const c of configs){
  const n=Number(c.id.split("-")[1]),outcomes=financialContent(c),p=problems.find(p=>p.id===c.id)!;
  expect(financialApplicability[n]).toEqual([expectedPrimary[n-1],expectedConditional[n-1]]);
  expect(outcomes.filter(x=>x.applicability==="primary").map(x=>Number(x.id.slice(1)))).toEqual(expectedPrimary[n-1]);
  expect(outcomes.filter(x=>x.applicability==="conditional").map(x=>Number(x.id.slice(1)))).toEqual(expectedConditional[n-1]);
  expect(new Set(outcomes.map(x=>x.id)).size).toBe(outcomes.length);
  const existing=operationalPanels(c,p.operationalImpacts.map(i=>i.id));
  ops+=existing.length+(n===28?1:0);
  for(const o of outcomes){
   expect(o.name).toBe(expectedNames[Number(o.id.slice(1))-1]);allNames.add(o.name);
   expect(o.fields.some(f=>f.key===o.primary.key)).toBe(true);
   expect(o.condition).not.toBe("");expect(o.reference).not.toBe("");
   const all=[...o.fields,...routeFields(o.routes)];
   expect(all.every(f=>!!f.key&&!!f.label&&!!f.unit)).toBe(true);fields+=all.length;routes+=o.routes.length;
   for(const f of all.filter(f=>f.shared==="operational"))expect(existing.some(p=>p.fields.some(x=>x.key===f.key))).toBe(true);
   for(const f of all.filter(f=>f.shared==="problem"))expect(Object.values(c.fields).flat().some(x=>x.key===f.key)).toBe(true);
  }
  total+=outcomes.length;primary+=outcomes.filter(x=>x.applicability==="primary").length;
  const result=solve(c,{...c.example,"fin:confirmed-revenue":"100","fin:confirmed-profit":"-5"});expect(result.errors).toEqual([]);expect(result.values.total).toBe(100);expect(result.values["fin:confirmed-revenue"]).toBeUndefined();
  for(const panel of existing)for(const route of operationalAlternatives(c,panel.id))expect(route.fields.length).toBeGreaterThan(0);
 }
 expect(total).toBe(190);expect(primary).toBe(56);expect(ops).toBe(44);expect(allNames.size).toBe(10);expect(shortfallRoute.fields.length).toBe(3);
 console.log("STEP2_CONTENT "+JSON.stringify({problems:28,total,primary,conditional:total-primary,ops,fields,routes}));
});
for(const c of configs)test("Step 2 rendered financial content "+c.id,async({page})=>{
 test.setTimeout(90000);
 await page.goto("/quantification");await choose(page,c.id);
 await page.getByRole("button",{name:"Negative financial impacts",exact:true}).click();
 const panel=page.locator(".fin-impact-content"),outcomes=financialContent(c);
 await expect(panel).toBeVisible();await expect(panel.locator(".fin-card")).toHaveCount(outcomes.length);
 await expect(panel.getByText("To be developed",{exact:true})).toHaveCount(0);
 for(const outcome of outcomes){
  const card=panel.locator('[data-financial-impact="'+outcome.id+'"]');
  await expect(card).toHaveAttribute("data-applicability",outcome.applicability);
  const check=card.getByRole("checkbox");await expect(check).not.toBeChecked();await check.check();
  const result=card.locator(".op-result-row strong");await expect(result).toHaveText("—");
  const field=card.locator('input[data-quantity="'+outcome.primary.key+'"]').first();await expect(field).toBeEditable();
  await field.fill("12.5");await expect(result).toHaveText("12.5");
  const toggle=card.locator(".fin-card-toggle");await toggle.click();await expect(card.locator(".fin-card-body")).toHaveCount(0);await toggle.click();await expect(field).toHaveValue("12.5");
  // Expand all alternative branches, including nested cost breakdowns.
  for(let i=0;i<80;i++){const closed=card.locator('.step2-alt-toggle[aria-expanded="false"]').first();if(!await closed.count())break;await closed.click();}
  const expected=[...outcome.fields,...routeFields(outcome.routes)];
  for(const f of expected)await expect(card.locator('input[data-quantity="'+f.key+'"]').first()).toBeEditable();
  await field.fill("");await field.blur();await expect(result).toHaveText("—");
  await check.uncheck();
 }
 await panel.getByRole("button",{name:"Confirmed",exact:true}).click();await expect(panel.locator(".fin-card")).toHaveCount(outcomes.filter(x=>x.kind==="Confirmed").length);
 await panel.getByRole("button",{name:"Estimated",exact:true}).click();await expect(panel.locator(".fin-card")).toHaveCount(outcomes.filter(x=>x.kind==="Estimated").length);
 await panel.getByRole("button",{name:"All",exact:true}).click();await expect(panel.locator(".fin-card")).toHaveCount(outcomes.length);
 console.log("STEP2_BROWSER "+c.id+" "+outcomes.length);
});
test("shared financial quantities, alternative values and legacy calculations survive navigation",async({page})=>{
 await page.goto("/quantification");await page.getByRole("button",{name:"Negative financial impacts",exact:true}).click();
 const card=(id:string)=>page.locator('[data-financial-impact="'+id+'"]');
 await card("F1").getByRole("checkbox").check();await card("F2").getByRole("checkbox").check();
 const rev=card("F1").locator('input[data-quantity="fin:confirmed-revenue"]'),copy=card("F2").locator('input[data-quantity="fin:confirmed-revenue"]');
 await rev.fill("1234.5");await expect(copy).toHaveValue("1234.5");await copy.fill("1000");await expect(rev).toHaveValue("1000");
 const profit=card("F2").locator('input[data-quantity="fin:confirmed-profit"]');await profit.fill("-25");await expect(card("F2").locator(".op-result-row strong")).toHaveText("-25");
 await card("F1").getByRole("button",{name:"Average revenue per purchase",exact:true}).click();
 const purchases=card("F1").locator('input[data-quantity="fin:total-purchases"]');await purchases.fill("10");
 await card("F1").getByRole("button",{name:"Average revenue per purchase",exact:true}).click();await card("F1").getByRole("button",{name:"Average revenue per purchase",exact:true}).click();await expect(purchases).toHaveValue("10");
 await page.locator('[data-section="Quantity"] input[data-quantity="total"]').fill("100");await page.locator('[data-section="Quantity"] input[data-quantity="affected"]').fill("20");await expect(page.locator('[data-section="Quantity"] input[data-quantity="unaffected"]')).toHaveValue("80");
 await choose(page,"problem-2");await card("F1").getByRole("checkbox").check();await expect(card("F1").locator('input[data-quantity="fin:confirmed-revenue"]')).toHaveValue("");
 await choose(page,"problem-1");await expect(rev).toHaveValue("1000");
 await page.getByRole("link",{name:"Discovery",exact:true}).click();await page.getByRole("link",{name:"Quantification"}).click();await expect(rev).toHaveValue("1000");
 await expect(page.locator('[data-section="Quantity"] input[data-quantity="unaffected"]')).toHaveValue("80");
 await page.getByRole("button",{name:"Positive operational outcomes",exact:true}).click();await expect(page.getByText("To be developed",{exact:true}).filter({visible:true})).toHaveCount(1);
});

test("supplemental operational routes and staff shortfall appear in the actual application",async({page})=>{
 test.setTimeout(120000);
 await page.goto("/");
 for(const c of configs){
  const problem=problems.find(p=>p.id===c.id)!;
  const extra=operationalPanels(c,problem.operationalImpacts.map(i=>i.id)).filter(p=>operationalAlternatives(c,p.id).length);
  if(!extra.length)continue;
  const discovery=page.locator('[data-problem="'+c.id+'"]');
  await discovery.getByRole("button",{name:/^Expand/}).click();
  for(const op of extra)await discovery.getByRole("checkbox",{name:op.name,exact:true}).check();
  await discovery.getByRole("button",{name:/^Collapse/}).click();
 }
 await page.getByRole("link",{name:"Quantification"}).click();
 await page.locator(".op-panel > button").click();
 for(const c of configs){
  const problem=problems.find(p=>p.id===c.id)!;
  const extra=operationalPanels(c,problem.operationalImpacts.map(i=>i.id)).filter(p=>operationalAlternatives(c,p.id).length);
  if(!extra.length)continue;
  await choose(page,c.id);
  for(const op of extra){
   const card=page.locator('.op-impact-card[data-impact="'+op.id+'"]');
   const routes=operationalAlternatives(c,op.id);
   await expect(card).toBeVisible();
   for(const route of routes){
    const button=card.getByRole("button",{name:route.title,exact:true});
    await button.click();
    for(const f of route.fields){
     const input=card.locator('input[data-quantity="'+f.key+'"]').first();
     await expect(input).toBeEditable();
     if(!f.shared){await input.fill("3");await expect(input).toHaveValue("3");}
    }
    await button.click();await button.click();
    for(const f of route.fields.filter(f=>!f.shared))await expect(card.locator('input[data-quantity="'+f.key+'"]').first()).toHaveValue("3");
    await button.click();
   }
  }
 }
 await choose(page,"problem-28");
 await page.getByRole("checkbox",{name:"Staff hour shortfall",exact:true}).check();
 const shortfall=page.locator('[data-step2-impact="shortfall"]');
 const required=shortfall.locator('input[data-quantity="hours"]'),available=shortfall.locator('input[data-quantity="target"]');
 await required.fill("120");await available.fill("100");
 await expect(page.locator('[data-section="Comparison"] input[data-quantity="hours"]')).toHaveValue("120");
 await expect(shortfall.locator(".op-result-row strong")).toHaveText("—");
 await shortfall.locator('input[data-quantity="step2:staff-shortfall"]').fill("20");
 await expect(shortfall.locator(".op-result-row strong")).toHaveText("20");
 await choose(page,"problem-1");await choose(page,"problem-28");
 await expect(shortfall.locator('input[data-quantity="step2:staff-shortfall"]')).toHaveValue("20");
});
test("existing operational calculation is available inside a financial alternative without a new formula",async({page})=>{
 await page.goto("/");
 const p=page.locator('[data-problem="problem-6"]');
 await p.getByRole("button",{name:/^Expand/}).click();
 await p.getByRole("checkbox",{name:"Lost leads",exact:true}).check();
 await page.getByRole("link",{name:"Quantification"}).click();await choose(page,"problem-6");
 await page.locator('[data-section="Quantity"] input[data-quantity="affected"]').fill("20");
 await page.locator(".op-panel > button").click();
 const op=page.locator(".op-impact-card");
 await op.locator('input[data-quantity="op:lost-leads:loss-rate"]').fill("40");
 await expect(op.locator('input[data-quantity="op:lost-leads:result"]')).toHaveValue("8");
 await page.getByRole("button",{name:"Negative financial impacts",exact:true}).click();
 const card=page.locator('[data-financial-impact="F7"]');await card.getByRole("checkbox").check();
 await card.getByRole("button",{name:"Alternative calculation methods",exact:true}).click();
 await card.getByRole("button",{name:"Lost leads",exact:true}).click();
 await expect(card.locator('input[data-quantity="op:lost-leads:result"]')).toHaveValue("8");
 await expect(card.locator('input[data-quantity="fin:potential-buyers"]')).toHaveValue("");
 await expect(card.locator(".op-result-row strong")).toHaveText("—");
 await op.locator('input[data-quantity="op:lost-leads:loss-rate"]').fill("50");
 await expect(card.locator('input[data-quantity="op:lost-leads:result"]')).toHaveValue("10");
});
