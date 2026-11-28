import {test,expect} from "@playwright/test";
import {targetValues,finance,packages,editTarget,expectedValues,paymentFinance,solveExpectedValues,monthlyFactor} from "../app/quantification/investment-model";
test("target calculations work in reverse",()=>{expect(targetValues("Buyers",{current:"50",target:"456"},undefined).change).toBe(406);expect(targetValues("Buyers",{target:"456",rate:"812"},undefined).current).toBeCloseTo(50);expect(targetValues("Monthly costs",{current:"1000",rate:"20"},undefined).target).toBe(800)});
test("investment math uses full period and launch delay",()=>{const f=finance(110250,16650,5,1,1624000,-16650,0,200000,0);expect(f.total).toBe(193500);expect(f.payback).toBeCloseTo(1.07895,4);expect(f.gain).toBe(1607350);expect(packages.Growth.setup+12*packages.Growth.monthly).toBe(150000);expect(finance(100,10,5,1,0,-10,0,0,0).noPayback).toBe(true);expect(finance(100,undefined,5,1,0,undefined,0,0,0).total).toBeUndefined()});
test("target and investment panels appear with ten results",async({page})=>{await page.goto("/quantification");await expect(page.locator(".inv-target")).toBeVisible();await expect(page.locator(".inv-result")).toHaveCount(10);await page.locator(".inv-target").getByRole("checkbox",{name:"Buyers",exact:true}).check();await page.getByRole("spinbutton",{name:"Current buyers",exact:true}).fill("50");await page.getByRole("spinbutton",{name:"Target buyers",exact:true}).fill("456");await expect(page.getByRole("spinbutton",{name:"Increase needed",exact:true})).toHaveValue("406");await expect(page.getByRole("spinbutton",{name:"Increase rate needed",exact:true})).toHaveValue("812");await page.getByRole("button",{name:"Growth",exact:true}).click();await expect(page.getByRole("spinbutton",{name:"Package payments",exact:true})).toHaveValue("110250");await page.getByRole("button",{name:"Expand all",exact:true}).click();await expect(page.locator(".inv-result .inv-header[aria-expanded=true]")).toHaveCount(7);await page.getByRole("button",{name:"Collapse all",exact:true}).click();await expect(page.locator(".inv-result .inv-header[aria-expanded=false]")).toHaveCount(7)});

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
 await inv.locator('[data-investment-quantity="removed"]').fill("0");
 await inv.locator('[data-investment-quantity="averageRevenue"]').fill("500");
 await inv.locator('[data-investment-quantity="averageProfit"]').fill("200");
 await expect(inv.locator('[data-investment-quantity="tb:Revenue"]')).toHaveValue("10");
 await expect(inv.locator('[data-investment-quantity="gain-profit"]')).toHaveValue("2000");
 await expect(inv.locator('[data-investment-quantity="cash-gain"]')).toHaveValue("1000");
 await expect(inv.getByRole("combobox",{name:"Required scenario calculation"})).toBeVisible();
 await inv.getByRole("button",{name:"Expected scenario",exact:true}).click();
 await inv.getByRole("combobox",{name:"Expected performance calculation"}).click();
 await inv.getByRole("option",{name:"Expected extra buyers",exact:true}).click();
 await inv.locator('[data-investment-quantity="expectedBuyers"]').fill("15");
 await expect(inv.locator('[data-investment-quantity="gain-profit"]')).toHaveValue("3000");
 await inv.getByRole("button",{name:"Reset",exact:true}).click();
 await expect(field("target")).toHaveValue("");await expect(inv.locator('[data-investment-quantity="running"]')).toHaveValue("");
 await expect(inv.getByRole("spinbutton",{name:"Package payments",exact:true})).toHaveValue("73500");
});

test("consolidated payments, cash timing, zero and independent results",()=>{
 const f=paymentFinance(78500,16650,12,1,40000,3350,0,100000,10000);
 expect(f.total).toBe(261650);expect(f.gain).toBe(43350);expect(f.net).toBe(398350);
 expect(f.payback).toBeCloseTo(1+78500/43350);expect(f.shortage).toBe(5150);
 expect(paymentFinance(78500,16650,12,1,40000,3350,0,100000,10000,-1000).shortage).toBe(15150);
 expect(paymentFinance(73500,16650,12,1,undefined,undefined,0,undefined,undefined).total).toBe(256650);
 const zero=paymentFinance(73500,undefined,1,1,undefined,undefined,undefined,70000,0);
 expect(zero.total).toBe(73500);expect(zero.net).toBe(-73500);expect(zero.shortage).toBe(3500);
 expect(paymentFinance(100,10,3,0,0,-10,0,0,0).shortage).toBe(130);
 expect(paymentFinance(100,10,1.5,0,0,-2,0,0,0).shortage).toBe(110);
});
test("expected routes support reverse calculation, chaining and conflicting manual values",()=>{
 const e=solveExpectedValues({expectedProfit:"2000",expectedRate:"50"},undefined,25,100);
 expect(e.buyers).toBe(20);expect(e.recovered).toBe(80);expect(e.pool).toBe(160);expect(e.errors).toEqual([]);
 expect(solveExpectedValues({expectedBuyers:"20",expectedProfit:"2000"},undefined,undefined,undefined).averageProfit).toBe(100);
 expect(solveExpectedValues({expectedBuyers:"20",expectedRecovered:"80"},undefined,undefined,undefined).conversion).toBe(25);
 expect(solveExpectedValues({expectedRate:"0"},undefined,25,100).profit).toBe(0);
 expect(solveExpectedValues({expectedProfit:"2000"},undefined,undefined,undefined).profit).toBe(2000);
 expect(solveExpectedValues({expectedBuyers:"20",expectedProfit:"1000"},undefined,undefined,100).errors.length).toBeGreaterThan(0);
 expect(solveExpectedValues({expectedRate:"150"},100,25,100).errors.length).toBeGreaterThan(0);
});
test("approved investment layout preserves controls and converts currency and period without losing inputs",async({page})=>{
 await page.goto("/quantification");
 const inv=page.locator(".inv-investment");
 await inv.getByRole("button",{name:"Expand all",exact:true}).click();
 const field=(key:string)=>inv.locator('[data-investment-quantity="'+key+'"]');
 const select=async(label:string,option:string)=>{
  await inv.getByRole("combobox",{name:label,exact:true}).click();
  await inv.getByRole("option",{name:option,exact:true}).click();
 };
 await expect(inv.getByRole("spinbutton",{name:"Package payments",exact:true})).toHaveValue("73500");
 await field("otherUpfront").fill("5000");
 await field("running").fill("16650");
 await field("period").fill("12");
 await field("removed").fill("20000");
 await expect(field("gain-saved")).toHaveValue("3350");
 await select("Money saved and gained period","Yearly");
 await expect(field("removed")).toHaveValue("240000");
 await expect(field("gain-saved")).toHaveValue("40200");
 await select("Money saved and gained period","Daily");
 expect(Number(await field("removed").inputValue())).toBeCloseTo(20000/monthlyFactor("Daily"));
 await select("Money saved and gained period","Weekly");
 expect(Number(await field("removed").inputValue())).toBeCloseTo(20000/monthlyFactor("Weekly"));
 await select("Money saved and gained period","Monthly");
 await expect(field("removed")).toHaveValue("20000");
 await select("Investment currency","USD");
 expect(Number(await field("running").inputValue())).toBeCloseTo(16650/3.6725);
 await select("Investment currency","AED");
 await expect(field("running")).toHaveValue("16650");
 await expect(field("otherUpfront")).toHaveValue("5000");
 await expect(inv.getByRole("spinbutton",{name:"Upfront payment budget (optional)",exact:true})).toBeVisible();
 await expect(inv.getByRole("spinbutton",{name:"Extra cash needed upfront",exact:true})).toBeVisible();
 await expect(inv.getByRole("button",{name:"Implementation period",exact:true})).toBeVisible();
 await inv.getByRole("button",{name:"Collapse all",exact:true}).click();
 await inv.getByRole("button",{name:"Expand all",exact:true}).click();
 await expect(field("removed")).toHaveValue("20000");
});
