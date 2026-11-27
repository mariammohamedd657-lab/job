import {test,expect} from "@playwright/test";
import {configs} from "../app/quantification/config";
import {operationalPanels,operationalEquations} from "../app/quantification/operational-data";
import {confirmedFinancialEquations} from "../app/quantification/confirmed-financial";
import {potentialAndCostEquations} from "../app/quantification/potential-financial";
import {solve} from "../app/quantification/solver";
const c=configs.find(c=>c.id==="problem-1")!;
const eq=potentialAndCostEquations(c,confirmedFinancialEquations(c,operationalEquations(operationalPanels(c,["negative-operational-lost-leads"]))));
const given={"op:lost-leads:unique-leads":"123","op:lost-leads:recovered":"78","op:lost-leads:loss-rate":"30","fin:conversion:leads":"40","fin:average-revenue-buyer":"500","fin:average-avoided-buyer":"300"};
const expected={"op:lost-leads:result":36.9,"op:lost-leads:pending":8.1,"fin:potential-buyers":14.76,"fin:potential-revenue":7380,"fin:estimated-avoided":4428,"fin:potential-profit":2952};
test("Missed calls: exact six-input shared solver chain and edits",()=>{
 const result=solve(c,given,eq,{includeBounds:true});expect(result.errors).toEqual([]);
 for(const [key,value] of Object.entries(expected))expect(result.values[key],key).toBeCloseTo(value,9);
 const scenarios:[keyof typeof given,string,number,number,number,number,number,number][]=[
 ["op:lost-leads:unique-leads","130",39,13,15.6,7800,4680,3120],
 ["op:lost-leads:recovered","80",36.9,6.1,14.76,7380,4428,2952],
 ["op:lost-leads:loss-rate","20",24.6,20.4,9.84,4920,2952,1968],
 ["fin:conversion:leads","50",36.9,8.1,18.45,9225,5535,3690],
 ["fin:average-revenue-buyer","600",36.9,8.1,14.76,8856,4428,4428],
 ["fin:average-avoided-buyer","200",36.9,8.1,14.76,7380,2952,4428]
 ];
 for(const [key,value,...answers] of scenarios){const r=solve(c,{...given,[key]:value},eq,{includeBounds:true});expect(r.errors,key).toEqual([]);Object.keys(expected).forEach((k,j)=>expect(r.values[k],key+" -> "+k).toBeCloseTo(answers[j],9));}
});
test("Missed calls: exact calculation chain through actual website fields",async({page})=>{
 test.setTimeout(90000);
 await page.goto("/quantification");
 await page.locator(".op-panel > button").click();
 const op=page.locator('[data-impact="negative-operational-lost-leads"]');
 const input=(key:string)=>op.locator('input[data-quantity="'+key+'"]');
 await input("op:lost-leads:unique-leads").fill("123");
 await input("op:lost-leads:recovered").fill("78");
 await input("op:lost-leads:loss-rate").fill("30");
 await expect(input("op:lost-leads:result")).toHaveValue("36.9");
 await expect(input("op:lost-leads:pending")).toHaveValue("8.1");
 await page.getByRole("button",{name:"Negative financial impacts",exact:true}).click();
 const revenue=page.locator('[data-financial-impact="F7"]'),profit=page.locator('[data-financial-impact="F8"]');
 await revenue.locator(".fin-check").check();
 await profit.locator(".fin-check").check();
 await revenue.getByRole("button",{name:"Alternative calculation methods",exact:true}).click();
 await revenue.getByRole("button",{name:"Lost leads",exact:true}).click();
 await revenue.locator('input[data-quantity="fin:conversion:leads"]').fill("40");
 await revenue.locator('input[data-quantity="fin:average-revenue-buyer"]').fill("500");
 await profit.getByRole("button",{name:"Estimated avoided variable costs",exact:true}).click();
 await profit.locator('input[data-quantity="fin:average-avoided-buyer"]').fill("300");
 await expect(revenue.locator('input[data-quantity="fin:potential-buyers"]')).toHaveValue("14.76");
 await expect(revenue.locator('input[data-quantity="fin:potential-revenue"]')).toHaveValue("7380");
 await expect(profit.locator('input[data-quantity="fin:estimated-avoided"]')).toHaveValue("4428");
 await expect(profit.locator('input[data-quantity="fin:potential-profit"]')).toHaveValue("2952");
 await input("op:lost-leads:loss-rate").fill("20");
 await expect(input("op:lost-leads:result")).toHaveValue("24.6");
 await expect(input("op:lost-leads:pending")).toHaveValue("20.4");
 await expect(revenue.locator('input[data-quantity="fin:potential-buyers"]')).toHaveValue("9.84");
 await expect(revenue.locator('input[data-quantity="fin:potential-revenue"]')).toHaveValue("4920");
 await expect(profit.locator('input[data-quantity="fin:estimated-avoided"]')).toHaveValue("2952");
 await expect(profit.locator('input[data-quantity="fin:potential-profit"]')).toHaveValue("1968");
});
