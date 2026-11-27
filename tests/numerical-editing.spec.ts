import {test,expect} from "@playwright/test";
test("calculated inputs can be overwritten, cleared and re-inferred",async({page})=>{
 await page.goto("/quantification");
 await page.getByRole("button",{name:"Negative financial impacts",exact:true}).click();
 const card=page.locator('[data-financial-impact="F7"]');
 await card.locator(".fin-check").check();
 const input=(k:string)=>card.locator('input[data-quantity="'+k+'"]').first();
 await input("fin:potential-buyers").fill("30");await input("fin:average-revenue-buyer").fill("500");
 const revenue=input("fin:potential-revenue");
 await expect(revenue).toHaveValue("15000");await expect(revenue).toHaveAttribute("data-quantity-source","calculated");
 await revenue.fill("");await expect(revenue).toHaveValue("");
 await revenue.fill("18000");await expect(revenue).toHaveValue("18000");await expect(revenue).toHaveAttribute("data-quantity-source","manual");
 await revenue.fill("");await revenue.blur();await expect(revenue).toHaveValue("15000");
 await expect(revenue).toHaveAttribute("data-quantity-source","calculated");
});
test("temporary decimal and signed drafts do not reinsert calculated text",async({page})=>{
 await page.goto("/quantification");
 const total=page.locator('[data-section="Quantity"] input[data-quantity="total"]');
 await total.fill("");await total.pressSequentially("12.");await expect(total).toHaveValue("12.");
 await total.pressSequentially("5");await expect(total).toHaveValue("12.5");
 const amount=page.locator('[data-section="Quantity"] input[data-quantity="affected"]');
 await amount.fill("-");await expect(amount).toHaveValue("-");await amount.blur();await expect(amount).toHaveValue("");
});
test("example preserves separate prospect inputs and switching problems",async({page})=>{
 await page.goto("/quantification");
 const total=page.locator('[data-section="Quantity"] input[data-quantity="total"]');
 await total.fill("321");
 await page.locator(".q-calculator").getByRole("button",{name:"Load example",exact:true}).click();
 await expect(page.getByRole("status")).toContainText("Hypothetical example");
 await expect(total).not.toHaveValue("321");
 await page.locator("#q-problem").click();await page.locator('#q-problem-options [data-value="problem-2"]').click();
 await total.fill("42");
 await page.locator("#q-problem").click();await page.locator('#q-problem-options [data-value="problem-1"]').click();
 await page.locator(".q-calculator").getByRole("button",{name:"Reset",exact:true}).click();await expect(total).toHaveValue("321");
 await page.locator("#q-problem").click();await page.locator('#q-problem-options [data-value="problem-2"]').click();await expect(total).toHaveValue("42");
});
