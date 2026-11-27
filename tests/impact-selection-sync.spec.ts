import {test,expect,type Page} from "@playwright/test";
import {problems} from "../app/discovery/data";
import {configs} from "../app/quantification/config";
import {financialContent} from "../app/quantification/step2-content";
import {discoveryFinancialOutcome,selectedFinancialOutcomes} from "../app/quantification/impact-selection";
const choose=async(page:Page,id:string)=>{await page.locator("#q-problem").click();await page.locator('#q-problem-options [data-value="'+id+'"]').click();};
test("every Discovery financial impact maps to an applicable existing card",()=>{
 for(const p of problems){
  const outcomes=financialContent(configs.find(c=>c.id===p.id)!);
  for(const impact of p.financialImpacts){const id=discoveryFinancialOutcome[impact.id];expect(id,p.id+" "+impact.id).toBeTruthy();expect(outcomes.some(o=>o.id===id),p.id+" "+id).toBeTruthy();}
 }
});
for(const p of problems)test(p.id+" Discovery selects and deselects both impact types",async({page})=>{
 await page.goto("/");
 const problem=page.locator('[data-problem="'+p.id+'"]');
 await problem.locator(".problem-toggle").click();
 const op=problem.locator(".impact-columns > div").nth(0),fin=problem.locator(".impact-columns > div").nth(1);
 for(const impact of p.operationalImpacts)await op.getByRole("checkbox",{name:impact.label,exact:true}).check();
 for(const impact of p.financialImpacts)await fin.getByRole("checkbox",{name:impact.label,exact:true}).check();
 await page.getByRole("link",{name:"Quantification"}).click();
 await choose(page,p.id);
 await page.getByRole("button",{name:/^Negative operational impacts/}).click();
 await page.getByRole("button",{name:"Negative financial impacts",exact:true}).click();
 await expect(page.locator(".op-impact-card[data-impact]")).toHaveCount(p.operationalImpacts.length);
 for(const impact of p.operationalImpacts)await expect(page.locator('[data-impact="'+impact.id+'"]')).toBeVisible();
 const expected=selectedFinancialOutcomes(p.financialImpacts.map(i=>i.id));
 for(const id of expected)await expect(page.locator('[data-financial-impact="'+id+'"] .fin-check')).toBeChecked();
 await expect(page.locator(".fin-check:checked")).toHaveCount(expected.length);
 await page.getByRole("link",{name:"Discovery"}).click();
 for(const impact of p.operationalImpacts)await op.getByRole("checkbox",{name:impact.label,exact:true}).uncheck();
 for(const impact of p.financialImpacts)await fin.getByRole("checkbox",{name:impact.label,exact:true}).uncheck();
 await page.getByRole("link",{name:"Quantification"}).click();
 await expect(page.locator(".op-impact-card[data-impact]")).toHaveCount(0);
 await expect(page.locator(".fin-check:checked")).toHaveCount(0);
});
test("multiple Discovery financial impacts sharing one card do not prematurely deselect it",()=>{
 expect(selectedFinancialOutcomes(["negative-financial-higher-cost-per-customer","negative-financial-higher-marketing-costs"])).toEqual(["F3"]);
 expect(selectedFinancialOutcomes(["negative-financial-higher-cost-per-customer"])).toEqual(["F3"]);
 expect(selectedFinancialOutcomes([])).toEqual([]);
});
