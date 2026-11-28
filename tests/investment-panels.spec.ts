import {test,expect} from "@playwright/test";
import {targetValues,finance,packages,editTarget,expectedValues} from "../app/quantification/investment-model";
test("target calculations work in reverse",()=>{expect(targetValues("Buyers",{current:"50",target:"456"},undefined).change).toBe(406);expect(targetValues("Buyers",{target:"456",rate:"812"},undefined).current).toBeCloseTo(50);expect(targetValues("Monthly costs",{current:"1000",rate:"20"},undefined).target).toBe(800)});
test("investment math uses full period and launch delay",()=>{const f=finance(110250,16650,5,1,1624000,-16650,0,200000,0);expect(f.total).toBe(193500);expect(f.payback).toBeCloseTo(1.07895,4);expect(f.gain).toBe(1607350);expect(packages.Growth.setup+12*packages.Growth.monthly).toBe(150000);expect(finance(100,10,5,1,0,-10,0,0,0).noPayback).toBe(true);expect(finance(100,undefined,5,1,0,undefined,0,0,0).total).toBeUndefined()});
test("target and investment panels appear with ten results",async({page})=>{await page.goto("/quantification");await expect(page.locator(".inv-target")).toBeVisible();await expect(page.locator(".inv-result")).toHaveCount(10);await page.locator(".inv-target").getByRole("checkbox",{name:"Buyers",exact:true}).check();await page.getByRole("spinbutton",{name:"Current monthly buyers",exact:true}).fill("50");await page.getByRole("spinbutton",{name:"Target monthly buyers",exact:true}).fill("456");await expect(page.getByRole("spinbutton",{name:"Monthly increase needed",exact:true})).toHaveValue("406");await expect(page.getByRole("spinbutton",{name:"Increase rate needed",exact:true})).toHaveValue("812");await page.getByRole("button",{name:"Growth",exact:true}).click();await expect(page.getByRole("spinbutton",{name:"Ownership fee",exact:true})).toHaveValue("110250");await page.getByRole("button",{name:"Expand all",exact:true}).click();await expect(page.locator(".inv-result .inv-header[aria-expanded=true]")).toHaveCount(10);await page.getByRole("button",{name:"Collapse all",exact:true}).click();await expect(page.locator(".inv-result .inv-header[aria-expanded=false]")).toHaveCount(10)});

test("editing target increase or percentage replaces obsolete goal across all targets",()=>{
 for(const name of ["Revenue","Profit from sales","Monthly costs","Buyers"] as const){
  const saving=name==="Monthly costs",first={current:"100",target:saving?"80":"120"};
  let raw=editTarget(name,first,"change","30",undefined);
  expect(targetValues(name,raw,undefined).target).toBe(saving?70:130);
  raw=editTarget(name,raw,"rate","40",undefined);
  expect(targetValues(name,raw,undefined).target).toBe(saving?60:140);
  expect(targetValues(name,raw,undefined).conflict).toBe(false);
 }
});
test("monthly results do not require a deadline",()=>{
 const f=finance(73500,1000,undefined,1,2000,-1000,0,undefined,undefined);
 expect(f.gain).toBe(1000);expect(f.total).toBeUndefined();expect(f.payback).toBe(75.5);
 expect(expectedValues("Expected extra buyers",{expectedBuyers:"10"},undefined,undefined,200).profit).toBe(2000);
 expect(expectedValues("Expected extra monthly profit from sales",{expectedProfit:"3000"},undefined,undefined,undefined).profit).toBe(3000);
});
test("editable targets, independent monthly results, scenario dropdown and reset",async({page})=>{
 await page.goto("/quantification");
 const target=page.locator(".inv-target"),inv=page.locator(".inv-investment");
 await target.getByRole("checkbox",{name:"Revenue",exact:true}).check();
 const field=(key:string)=>target.locator('[data-investment-quantity="target:Revenue:'+key+'"]');
 await field("current").fill("10000");await field("target").fill("12000");await expect(field("change")).toHaveValue("2000");
 await field("change").fill("4000");await expect(field("target")).toHaveValue("14000");await expect(field("rate")).toHaveValue("40");
 await field("rate").fill("50");await expect(field("target")).toHaveValue("15000");
 await inv.getByRole("button",{name:"Expand all",exact:true}).click();
 await inv.locator('[data-investment-quantity="running"]').fill("1000");
 await inv.locator('[data-investment-quantity="averageRevenue"]').fill("500");
 await inv.locator('[data-investment-quantity="averageProfit"]').fill("200");
 await expect(inv.locator('[data-investment-quantity="tb:Revenue"]')).toHaveValue("10");
 await expect(inv.locator('[data-investment-quantity="gain-profit"]')).toHaveValue("2000");
 await expect(inv.locator('[data-investment-quantity="p-gain"]')).toHaveValue("1000");
 await expect(inv.getByRole("combobox",{name:"Required scenario calculation"})).toBeVisible();
 await inv.getByRole("button",{name:"Expected scenario",exact:true}).click();
 await inv.getByRole("combobox",{name:"Expected performance calculation"}).selectOption("Expected extra buyers");
 await inv.locator('[data-investment-quantity="expectedBuyers"]').fill("15");
 await expect(inv.locator('[data-investment-quantity="gain-profit"]')).toHaveValue("3000");
 await inv.getByRole("button",{name:"Reset",exact:true}).click();
 await expect(field("target")).toHaveValue("");await expect(inv.locator('[data-investment-quantity="running"]')).toHaveValue("");
 await expect(inv.getByRole("spinbutton",{name:"Ownership fee",exact:true})).toHaveValue("73500");
});
