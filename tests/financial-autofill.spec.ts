import {test,expect} from "@playwright/test";
import {configs} from "../app/quantification/config";
import {financialContent} from "../app/quantification/step2-content";
import {financialEquations} from "../app/quantification/financial-equations";
import {solve,type Figures} from "../app/quantification/solver";
const cases:[string,Figures,string,number][]=[
 ["F1",{"confirmed-purchases":"20","average-revenue-purchase":"500"},"confirmed-revenue",10000],
 ["F1",{"confirmed-revenue":"10000","average-revenue-purchase":"500"},"confirmed-purchases",20],
 ["F1",{"confirmed-revenue":"10000","confirmed-purchases":"20"},"average-revenue-purchase",500],
 ["F1",{"purchase-revenue":"25000","retained-revenue":"15000"},"confirmed-revenue",10000],
 ["F1",{"purchase-total-revenue":"100000","total-purchases":"200","confirmed-purchases":"20"},"confirmed-revenue",10000],
 ["F2",{"confirmed-revenue":"10000","avoided-variable":"4000"},"confirmed-profit",6000],
 ["F2",{"confirmed-revenue":"10000","confirmed-margin":"60"},"confirmed-profit",6000],
 ["F2",{"confirmed-purchases":"20","average-revenue-purchase":"500","average-avoided-purchase":"200"},"confirmed-profit",6000],
 ["F2",{"confirmed-revenue":"1000","avoided-variable":"3000"},"confirmed-profit",-2000],
 ["F3",{"higher:actual":"8000","higher:comparable":"6000"},"higher:result",2000],
 ["F3",{"higher:actual":"5000","higher:comparable":"6000"},"higher:result",0],
 ["F3",{"higher:result":"2000","higher:comparable":"6000"},"higher:actual",8000],
 ["F3",{"higher:paid-leads":"100","average-paid-lead":"15"},"higher:marketing",1500],
 ["F3",{"higher:borrowed":"36500","higher:interest-rate":"10","higher:borrowing-period":"10"},"higher:interest",100],
 ["F4",{"paid-lost":"60","average-paid-lead":"20"},"wasted-marketing",1200],
 ["F4",{"wasted-hours":"72","average-staff-hour":"25"},"wasted-staff",1800],
 ["F5",{"payments-due":"50000","timely-payments":"35000"},"delayed",15000],
 ["F5",{"delayed":"15000","average-late-invoice":"500"},"late-invoices",30],
 ["F6",{"original-unpaid":"100000","recovered-unpaid":"70000","unpaid-loss":"10000"},"pending-unpaid",20000],
 ["F7",{"potential-buyers":"20","average-revenue-buyer":"500"},"potential-revenue",10000],
 ["F7",{"potential-revenue":"10000","average-revenue-buyer":"500"},"potential-buyers",20],
 ["F8",{"potential-buyers":"15.544","average-revenue-buyer":"89","average-avoided-buyer":"890"},"potential-profit",-12450.744],
 ["F9",{"estimated-higher:paid-leads":"80","average-paid-lead":"15"},"estimated-higher:marketing",1200],
 ["F10",{"pending-unpaid":"20000","expected-unrecoverable":"25"},"estimated-invoice-loss",5000],
 ["F10",{"pending-invoices":"100","expected-invoice-rate":"20","average-expected-unrecoverable":"250"},"estimated-invoice-loss",5000]
];
for(const c of configs)test(c.id+" financial minimum inputs",()=>{
 const outcomes=financialContent(c),e=financialEquations(c,{fields:[],relations:[]});
 for(const [id,raw,key,n] of cases.filter(x=>outcomes.some(o=>o.id===x[0]))){
  const figures:Figures=Object.fromEntries(Object.entries(raw).map(([k,v])=>["fin:"+k,v]));
  const r=solve(c,figures,e,{includeBounds:true});expect(r.errors,id+" "+key).toEqual([]);expect(r.values["fin:"+key],id+" "+key).toBeCloseTo(n,7);
 }
});
test("potential revenue is calculated in the selected editable website field",async({page})=>{
 await page.goto("/");const p=page.locator('[data-problem="problem-1"]');await p.locator(".problem-toggle").click();await p.getByRole("checkbox",{name:"Lost potential revenue",exact:true}).check();await page.getByRole("link",{name:"Quantification"}).click();await page.getByRole("button",{name:"Negative financial impacts",exact:true}).click();
 const card=page.locator('[data-financial-impact="F7"]');
 const field=(k:string)=>card.locator('input[data-quantity="fin:'+k+'"]').first();
 await field("average-revenue-buyer").fill("500");await field("potential-buyers").fill("20");await expect(field("potential-revenue")).toHaveValue("10000");
 await field("potential-buyers").fill("30");await expect(field("potential-revenue")).toHaveValue("15000");
 await field("potential-buyers").fill("");await expect(field("potential-revenue")).toHaveValue("");
});
