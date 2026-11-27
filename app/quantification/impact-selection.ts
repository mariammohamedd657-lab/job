// Discovery categories map to existing Quantification outcomes, not to new cards.
// Several Discovery impacts can select one existing financial outcome.
export const discoveryFinancialOutcome:Readonly<Record<string,string>>={
 "negative-financial-lost-potential-revenue":"F7",
 "negative-financial-wasted-marketing-spend":"F4",
 "negative-financial-wasted-staffing-costs":"F4",
 "negative-financial-higher-cost-per-customer":"F3",
 "negative-financial-higher-marketing-costs":"F3",
 "negative-financial-higher-staffing-costs":"F3",
 "negative-financial-higher-collection-costs":"F3",
 "negative-financial-delayed-cash-collection":"F5",
 "negative-financial-money-lost-from-unpaid-invoices":"F6"
};
export function selectedFinancialOutcomes(impactIds:readonly string[]):string[]{
 return [...new Set(impactIds.map(id=>discoveryFinancialOutcome[id]).filter(Boolean))];
}
