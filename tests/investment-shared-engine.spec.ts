import {test,expect} from "@playwright/test";
import {solveInvestmentCore,solveInvestmentExpected,solveInvestmentPayback,resolved} from "../app/quantification/investment-equations";

const facts={packageFee:73500,subscription:0,launch:1,period:undefined,profit:undefined,currentCosts:undefined,invoices:0,otherLost:0};
test("shared solver calculates costs removed, payments and savings in either direction",()=>{
 const cases:Record<string,string>[]=[{removed:"689",running:"610"},{removed:"689",saved:"79"},{running:"610",saved:"79"}];
 for(const raw of cases){
  const r=solveInvestmentCore(raw,facts,false);
  expect(r.errors).toEqual([]);
  expect(resolved(r,"removed")).toBeCloseTo(689);
  expect(resolved(r,"monthlyCost")).toBeCloseTo(610);
  expect(resolved(r,"saved")).toBeCloseTo(79);
  expect(resolved(r,"running")).toBeCloseTo(610);
 }
});
test("shared solver reuses an entered total and computes an independent payment component",()=>{
 const r=solveInvestmentCore({upfront:"78500",running:"16650",period:"12"},facts,false);
 expect(r.errors).toEqual([]);
 expect(resolved(r,"otherUpfront")).toBe(5000);
 expect(resolved(r,"totalPayments")).toBe(261650);
 expect(resolved(r,"gain")).toBeUndefined();
});
test("shared solver chains gains, payback, net gain and ROI",()=>{
 const r=solveInvestmentCore({otherUpfront:"5000",running:"16650",period:"12",removed:"20000"},{...facts,profit:40000},false);
 expect(r.errors).toEqual([]);
 expect(resolved(r,"saved")).toBe(3350);
 expect(resolved(r,"gain")).toBe(43350);
 expect(resolved(r,"net")).toBe(398350);
 expect(resolved(r,"payback")).toBeCloseTo(1+78500/43350);
 expect(resolved(r,"roi")).toBeCloseTo(398350/261650*100);
});
test("shared solver derives running payments from breakdown and rejects contradictions",()=>{
 const r=solveInvestmentCore({running:"1000",minutes:"500",lines:"100",whatsapp:"0"},facts,true);
 expect(r.errors).toEqual([]);
 expect(resolved(r,"minuteCost")).toBeCloseTo(1.8);
 const conflict=solveInvestmentCore({removed:"689",running:"610",saved:"100"},facts,false);
 expect(conflict.errors.length).toBeGreaterThan(0);
 expect(resolved(conflict,"saved")).toBeUndefined();
});
test("shared solver respects cost bounds and handles zero separately from unknown",()=>{
 const r=solveInvestmentCore({running:"610"},{...facts,currentCosts:1000},false);
 expect(r.bounds?.removed?.max).toBe(1000);
 expect(resolved(r,"removed")).toBeUndefined();
 expect(resolved(solveInvestmentCore({removed:"0",running:"610"},facts,false),"saved")).toBe(-610);
 const zero=solveInvestmentCore({period:"1"},{...facts,packageFee:0},false);
 expect(resolved(zero,"totalPayments")).toBe(0);
 expect(resolved(zero,"roi")).toBeUndefined();
});
test("expected and required payback calculations use the shared solver",()=>{
 const e=solveInvestmentExpected({expectedProfit:"2000",expectedRate:"50"},undefined,25,100);
 expect(e.errors).toEqual([]);
 expect(e.buyers).toBe(20);expect(e.recovered).toBe(80);expect(e.pool).toBe(160);
 expect(solveInvestmentExpected({expectedBuyers:"20",expectedProfit:"1000"},undefined,undefined,100).errors.length).toBeGreaterThan(0);
 const r=solveInvestmentPayback({requiredNet:"10000"},{upfront:73500,monthlyCost:1000,launch:1,deadline:undefined});
 expect(r.conflict).toBe(false);expect(r.deadline).toBeCloseTo(8.35);expect(r.gainNeeded).toBe(11000);
});
test("browser: reverse savings inputs share values across approved result panels",async({page})=>{
 await page.goto("/quantification");
 const inv=page.locator(".inv-investment");
 await inv.getByRole("button",{name:"Expand all",exact:true}).click();
 const field=(key:string)=>inv.locator('[data-investment-quantity="'+key+'"]');
 await field("removed").fill("689");
 const savings=inv.getByLabel("Money saved value",{exact:true});
 await savings.click();await savings.fill("79");await savings.blur();
 expect(Number(await field("running").inputValue())).toBeCloseTo(610);
 expect(Number(await field("gain-saved").inputValue())).toBeCloseTo(79);
 await inv.getByRole("button",{name:"Collapse all",exact:true}).click();
 await inv.getByRole("button",{name:"Expand all",exact:true}).click();
 expect(Number(await field("removed").inputValue())).toBeCloseTo(689);
 expect(Number(await field("running").inputValue())).toBeCloseTo(610);
});

test("browser: identical historical buyer amounts transfer in both directions",async({page})=>{
 await page.goto("/");
 const problem=page.locator('[data-problem="problem-1"]');
 await problem.locator(".problem-toggle").click();
 await problem.getByRole("checkbox",{name:"Lost potential revenue",exact:true}).check();
 await page.getByRole("link",{name:"Quantification"}).click();
 await page.getByRole("button",{name:"Negative financial impacts",exact:true}).click();
 const historical=page.locator('[data-financial-impact="F7"] input[data-quantity="fin:average-revenue-buyer"]').first();
 const inv=page.locator(".inv-investment");
 await inv.getByRole("button",{name:"Expand all",exact:true}).click();
 const shared=inv.locator('[data-investment-quantity="averageRevenue"]');
 await historical.fill("500");
 await expect(shared).toHaveValue("500");
 await expect(shared).toHaveAttribute("data-shared-historical-quantity","fin:average-revenue-buyer");
 await shared.fill("750");
 await expect(historical).toHaveValue("750");
 await shared.fill("");
 await expect(historical).toHaveValue("");
});
