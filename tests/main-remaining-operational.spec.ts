import {test,expect} from "@playwright/test";
import {configs} from "../app/quantification/config";
import {operationalPanels,operationalEquations,operationalMethods} from "../app/quantification/operational-data";
import {solve,type Figures} from "../app/quantification/solver";
for(const c of configs)for(const [id,method] of Object.entries(operationalMethods[c.id])){
 const impact="negative-operational-"+id,p=operationalPanels(c,[impact])[0],e=operationalEquations([p]),key="op:"+id+":",L=p.primaryKey;
 const run=(raw:Figures)=>solve(c,raw,e,{populationClassification:"containment",includeBounds:true});
 if(["reactivation","attendance","reviews","invoices","new-buyers"].includes(method))test(c.id+" "+method+" minimum sufficient directions",()=>{
  const T=method==="new-buyers"?key+"exposed":method==="invoices"&&c.id==="problem-22"?key+"affected-invoices":"affected";
  const r=key+(method==="reactivation"?"reactivation-rate":method==="attendance"?"attendance-loss-rate":method==="reviews"?"additional-review-rate":method==="invoices"?"invoice-loss-rate":"rate");
  for(const [raw,k,n] of [[{[T]:"200",[r]:"15"},L,30],[{[L]:"30",[r]:"15"},T,200],[{[T]:"200",[L]:"30"},r,15]] as [Figures,string,number][]){const a=run(raw);expect(a.errors).toEqual([]);expect(a.values[k]).toBeCloseTo(n,9);}
  expect(run({[T]:"0"}).values[L]).toBe(0);expect(run({[T]:"0"}).values[r]).toBeUndefined();
  expect(run({[T]:"200",[r]:"15",[L]:"40"}).errors.length).toBeGreaterThan(0);
 });
 if(method==="slots")test(c.id+" slot calculations",()=>{
  const T=key+"available",F=key+"filled";
  for(const [raw,k,n] of [[{[T]:"120",[F]:"95"},L,25],[{[F]:"95",[L]:"25"},T,120],[{[T]:"120",[L]:"25"},F,95]] as [Figures,string,number][]){const a=run(raw);expect(a.errors).toEqual([]);expect(a.values[k]).toBe(n);}
  const pending=operationalEquations(operationalPanels(c,[impact],{[impact]:false}));expect(solve(c,{[T]:"120",[F]:"95"},pending).values[L]).toBeUndefined();
 });
 if(method==="time")test(c.id+" avoidable time both routes",()=>{
  const N=key+"necessary-time",r=key+"avoidable-percentage";
  for(const [raw,k,n] of [[{hours:"120",[N]:"30"},L,90],[{hours:"120",[r]:"75"},L,90],[{[L]:"90",[r]:"75"},"hours",120],[{hours:"120",[L]:"90"},N,30]] as [Figures,string,number][]){const a=run(raw);expect(a.errors).toEqual([]);expect(a.values[k]).toBeCloseTo(n,9);}
  const partial=operationalEquations(operationalPanels(c,[impact],{[impact]:false}));expect(solve(c,{hours:"120",[N]:"30"},partial).values[L]).toBeUndefined();
 });
}
test("reference review and reactivation rates do not silently become attributable rates",()=>{
 for(const [id,method,impact] of [["problem-9","reactivation","fewer-old-leads-reactivated"],["problem-24","reviews","fewer-customer-reviews"]]){
  const c=configs.find(c=>c.id===id)!,p=operationalPanels(c,["negative-operational-"+impact])[0],e=operationalEquations([p]),k="step3:historical:"+method+":";
  const r=solve(c,{[k+"eligible"]:"200",[k+"converted"]:"60"},e);expect(r.errors).toEqual([]);expect(r.values[k+"rate"]).toBeCloseTo(30);expect(r.values[p.primaryKey]).toBeUndefined();
 }
});
test("same invoice and appointment quantities share values",()=>{
 const c=configs.find(c=>c.id==="problem-22")!,p=operationalPanels(c,["negative-operational-more-unpaid-invoices"])[0],e=operationalEquations([p]);
 const r=solve(c,{affectedInvoices:"100","op:more-unpaid-invoices:invoice-loss-rate":"12"},e);expect(r.errors).toEqual([]);expect(r.values[p.primaryKey]).toBeCloseTo(12);
});
test("actual unused slot fields calculate in website",async({page})=>{
 await page.goto("/");const discovery=page.locator('[data-problem="problem-12"]');await discovery.getByRole("button",{name:/^Expand/}).click();await discovery.getByRole("checkbox",{name:"Unused appointment slots",exact:true}).check();await page.getByRole("link",{name:"Quantification"}).click();await page.locator("#q-problem").click();await page.locator('#q-problem-options [data-value="problem-12"]').click();await page.getByRole("button",{name:"Negative operational impacts",exact:true}).click();const card=page.locator('[data-impact="negative-operational-unused-appointment-slots"]');await card.locator('input[data-quantity="op:unused-appointment-slots:available"]').fill("120");await card.locator('input[data-quantity="op:unused-appointment-slots:filled"]').fill("95");await expect(card.locator('input[data-quantity="op:unused-appointment-slots:result"]')).toHaveValue("25");
});
