import {test,expect,type Page} from "@playwright/test";
async function fill(page:Page,key:string,value:string){await page.locator('[data-investment-quantity="'+key+'"]').first().fill(value);}
async function base(page:Page){await page.goto("/quantification");for(const [k,v] of Object.entries({total:"1000",lost:"200",rate:"25",ticket:"1000",profit:"400"}))await page.locator('[data-pool-quantity="'+k+'"]').fill(v);await page.locator(".inv-target").getByRole("checkbox",{name:"Revenue",exact:true}).check();await fill(page,"target:Revenue:target","250000");await fill(page,"target:Revenue:deadline","5");}
const result=(page:Page,name:string)=>page.locator(".inv-result").filter({has:page.locator(".inv-header > span:first-child",{hasText:new RegExp("^"+name+"$")})}).locator(".inv-header strong").first();
test("missing monthly running costs are automatically visible and all dependent results populate",async({page})=>{
 await base(page);
 const running=page.locator('[data-investment-quantity="running"]');await expect(running).toBeVisible();await expect(running.locator("..")).toHaveClass(/q-priority/);
 await fill(page,"running","1000");
 for(const [name,value] of Object.entries({"Total upfront investment":"73,500","Total monthly investment":"1,000","Total investment":"78,500","Monthly money saved":"-1,000","Extra monthly profit from sales":"20,000","Monthly gain after costs":"19,000","Total gain after costs":"1,500"}))await expect(result(page,name),name).toHaveText(value);
 await expect(page.locator(".inv-result").last().locator("strong")).toHaveText("1.9108");
 await expect(result(page,"Payback period")).toHaveText("4.9211");
 await expect(page.locator('[data-investment-quantity="cash"]')).toBeVisible();await fill(page,"cash","100000");await fill(page,"reserve","0");await expect(result(page,"Maximum cash shortage")).toHaveText("0");
});
test("cost breakdown, subscription and selected optional missing quantities",async({page})=>{
 await base(page);await page.getByRole("button",{name:"Subscription",exact:true}).click();await page.getByRole("button",{name:"Cost breakdown",exact:true}).click();
 await expect(page.locator('[data-investment-quantity="minutes"]')).toBeVisible();await fill(page,"minutes","1000");await fill(page,"minuteCost","1");
 await expect(result(page,"Total monthly investment")).toHaveText("7,500");await expect(result(page,"Total investment")).toHaveText("59,500");
 await page.getByRole("button",{name:"Monthly gain after costs",exact:false}).first().click();
 await page.getByRole("checkbox",{name:"Money saved from otherwise unpaid invoices",exact:true}).check();
 await expect(page.locator('[data-investment-quantity="invoices"]').locator("..")).toHaveClass(/q-priority/);await fill(page,"invoices","500");await expect(result(page,"Monthly gain after costs")).toHaveText("13,000");
});
test("expected scenario automatically reveals just the independent assumption",async({page})=>{
 await base(page);await fill(page,"running","1000");await page.getByRole("button",{name:"Expected scenario",exact:true}).click();await page.getByRole("combobox",{name:"Expected performance calculation"}).selectOption("Expected extra buyers");await expect(page.locator('[data-investment-quantity="expectedBuyers"]')).toBeVisible();await expect(page.locator('[data-investment-quantity="expectedBuyers"]').locator("..")).toHaveClass(/q-priority/);await fill(page,"expectedBuyers","25");await expect(result(page,"Extra monthly profit from sales")).toHaveText("10,000");await expect(result(page,"Monthly gain after costs")).toHaveText("9,000");
});
