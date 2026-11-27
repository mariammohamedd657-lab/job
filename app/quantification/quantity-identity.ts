import {definition,problemQuantityDefinitions,type NumericalType,type QuantityDefinition,validNumericalValue} from "./canonical-definitions";
import type {Field} from "./config";
import type {Figures,Result} from "./solver";

// Explicit key mappings. Neither matching names nor matching canonical types imply
// identical populations. The existing scoped key remains the storage address.
const coreRoles:Record<string,string>={total:"total",affected:"affected",unaffected:"unaffected",affectedPct:"affected_rate",unaffectedPct:"unaffected_rate"};
const averages:Record<number,string>={5:"average_response_time",7:"average_qualification_time",15:"average_rescheduling_time",17:"average_routine_question_time",18:"average_response_time",19:"average_repeated_question_time",20:"average_manual_task_time",28:"average_overloaded_task_time"};
const financialKeys:Record<string,string>={
 "confirmed-purchases":"confirmed_purchases_lost","average-revenue-purchase":"average_revenue_per_purchase","purchase-revenue":"confirmed_purchase_revenue_before_loss","retained-revenue":"retained_purchase_revenue","confirmed-revenue":"confirmed_revenue_loss","avoided-variable":"avoided_variable_costs","confirmed-profit":"confirmed_contribution_profit_loss",
 "purchase-total-revenue":"total_revenue","buyer-scope-revenue":"total_revenue","total-purchases":"total_purchases","total-buyers":"total_buyers","confirmed-margin":"contribution_profit_margin","potential-margin":"contribution_profit_margin","average-profit-purchase":"average_contribution_profit_per_purchase","average-avoided-purchase":"average_avoided_variable_cost_per_purchase","average-variable-purchase":"average_variable_cost_per_purchase",
 "purchase-variable-costs":"total_variable_costs","buyer-variable-costs":"total_variable_costs","purchase-total-profit":"total_contribution_profit","buyer-total-profit":"total_contribution_profit",
 "average-paid-lead":"average_cost_per_paid_lead","average-additional-hour":"average_cost_per_additional_staff_hour","average-additional-resource":"average_cost_per_additional_resource","average-collection-hour":"average_cost_per_collection_staff_hour",
 "wasted":"wasted_costs","wasted-marketing":"wasted_marketing_costs","wasted-staff":"wasted_staffing_costs","wasted-other":"wasted_other_operating_costs","paid-lost":"paid_lost_leads","paid-share":"paid_lost_lead_percentage","marketing-spend":"marketing_spend_for_paid_leads","paid-acquired":"paid_leads_acquired","wasted-hours":"wasted_paid_staff_hours","average-staff-hour":"average_staffing_cost_per_hour","avoidable-paid-share":"paid_wasted_time_percentage","wasted-hours-slot":"wasted_paid_hours_per_unused_slot","relevant-staff-costs":"relevant_staffing_costs","corresponding-hours":"corresponding_paid_staff_hours","wasted-resources":"wasted_resources","average-wasted-resource":"average_cost_per_wasted_resource",
 "payments-due":"payments_due","timely-payments":"payments_received_on_time","delayed":"delayed_cash_collection","late-invoices":"invoices_not_paid_on_time","average-late-invoice":"average_amount_not_paid_on_time_per_invoice",
 "original-unpaid":"original_unpaid_amount","recovered-unpaid":"recovered_unpaid_amount","pending-unpaid":"pending_unpaid_amount","unpaid-loss":"unpaid_invoice_money_loss","unrecoverable-invoices":"confirmed_unrecoverable_invoices","average-unrecoverable":"average_unrecoverable_amount_per_invoice",
 "potential-buyers":"lost_potential_buyers","average-revenue-buyer":"average_revenue_per_buyer","potential-revenue":"lost_potential_revenue","conversion:leads":"lead_to_buyer_rate","conversion:qualified":"qualified_lead_to_buyer_rate","conversion:reactivation":"reactivation_to_buyer_rate","conversion:booking":"booking_to_buyer_rate","conversion:attendance":"attendance_to_buyer_rate","conversion:unserved":"attributable_purchase_loss_rate","buyers-per-slot":"potential_buyers_per_unused_slot","future-revenue-existing":"expected_future_revenue_per_lost_existing_buyer","future-period":"future_revenue_period",
 "estimated-avoided":"estimated_avoided_variable_costs","potential-profit":"lost_potential_contribution_profit","average-profit-buyer":"average_contribution_profit_per_buyer","average-avoided-buyer":"average_avoided_variable_cost_per_buyer",
 "estimated-invoice-loss":"estimated_unpaid_invoice_money_loss","expected-unrecoverable":"expected_unrecoverable_percentage","pending-invoices":"pending_invoices","expected-invoice-rate":"expected_invoice_loss_rate","average-expected-unrecoverable":"average_expected_unrecoverable_amount_per_lost_invoice","expected-recoverable":"expected_recoverable_amount"
};
const higherKeys:Record<string,string>={
 result:"higher_costs",actual:"actual_costs",comparable:"comparable_costs_without_problem",difference:"cost_difference",marketing:"higher_marketing_costs",staff:"higher_staffing_costs",collection:"higher_collection_costs",financing:"higher_financing_costs",other:"higher_other_operating_costs","paid-leads":"additional_paid_leads","paid-hours":"additional_paid_staff_hours",employees:"additional_employees","employee-cost":"cost_per_additional_employee","collection-staff":"additional_collection_staff_costs","collection-fees":"additional_collection_fees","collection-hours":"additional_collection_staff_hours",interest:"additional_interest","financing-fees":"additional_financing_fees",borrowed:"additional_borrowed_amount","interest-rate":"annual_interest_rate","borrowing-period":"borrowing_period",resources:"additional_resources_used","actual-marketing":"actual_marketing_costs","comparable-marketing":"comparable_marketing_costs","actual-staff":"actual_staffing_costs","comparable-staff":"comparable_staffing_costs","actual-other":"actual_other_operating_costs","comparable-other":"comparable_other_operating_costs"
};
const estimatedHigher:Record<string,string>={actual:"estimated_costs_with_problem",comparable:"estimated_comparable_costs","actual-marketing":"estimated_marketing_costs_with_problem","actual-staff":"estimated_staffing_costs_with_problem","actual-other":"estimated_other_operating_costs_with_problem","employee-cost":"cost_per_additional_employee","interest-rate":"annual_interest_rate"};
const opKeys:Record<string,Record<string,string>>={
 "lost-leads":{"unique-leads":"unique_affected_leads",recovered:"recovered_leads",pending:"pending_leads","loss-rate":"lead_loss_rate",result:"lost_leads"},
 "lost-qualified-leads":{"affected-qualified-leads":"affected_qualified_leads",recovered:"recovered_qualified_leads",pending:"pending_qualified_leads","loss-rate":"qualified_lead_loss_rate",result:"lost_qualified_leads"},
 "fewer-old-leads-reactivated":{"reactivation-rate":"reactivation_rate",result:"potential_reactivations_lost"},
 "fewer-appointments-booked":{"intended-bookings":"intended_bookings",recovered:"recovered_bookings",pending:"pending_bookings","loss-rate":"booking_loss_rate",result:"lost_bookings"},
 "fewer-appointments-attended":{"attendance-loss-rate":"attendance_loss_rate",result:"lost_attendance","unique-appointments":"affected_appointments"},
 "unused-appointment-slots":{result:"unused_appointment_slots",available:"available_affected_slots",filled:"filled_affected_slots",pending:"pending_affected_slots"},
 "fewer-customers-served":{result:"unserved_buyers",affected:"affected_buyers",served:"subsequently_served_buyers",pending:"pending_affected_buyers"},
 "lost-existing-customers":{result:"lost_existing_buyers",affected:"affected_existing_buyers",rate:"existing_buyer_loss_rate"},
 "less-staff-time-available-for-other-work":{"avoidable-percentage":"avoidable_time_percentage","necessary-time":"necessary_time",result:"avoidable_time"},
 "fewer-tasks-completed":{result:"incomplete_tasks",affected:"affected_tasks",completed:"completed_affected_tasks",pending:"pending_affected_tasks"},
 "more-unpaid-invoices":{"affected-invoices":"affected_invoices","invoice-loss-rate":"invoice_loss_rate",result:"additional_unpaid_invoices"},
 "fewer-customer-reviews":{"additional-review-rate":"additional_review_rate",result:"potential_reviews_lost"},
 "fewer-new-customers":{result:"potential_new_buyers_lost",exposed:"review_exposed_potential_buyers",rate:"attributable_buyer_loss_rate"}
};
export function canonicalId(problemId:string,key:string):string{
 const n=Number(problemId.split("-")[1]),core=problemQuantityDefinitions.find(p=>p.problemId===problemId);
 if(!core)throw Error("Unknown problem "+problemId);
 if(["intendedBookings","missedBookings","requiredReminders","missedReminders","sentReminders","pendingReminders","missedReminderPct","reschedulingEvents","averageEventMinutes","affectedInvoices","requiredPayments","missingRecordings","missingOutcomes","missingBoth","requiredUpdates","missedUpdates","completedUpdates","pendingUpdates","overlap","combined"].includes(key))return "population."+key;
 if(coreRoles[key])return key==="total"&&(n===20||n===28)?"tasks.total":core.prefix+"."+coreRoles[key];
 const base:Record<string,string>={remainingPct:"remaining_population_percentage",remaining:"unclassified_quantity",months:"problem_duration",days:"measurement_period",daily:"affected_daily_rate",recordedUnits:"recorded_units",hours:n===28?"required_staff_hours":[5,7,18].includes(n)?"recorded_duration":"affected_duration",averageMinutes:averages[n],target:n===28?"available_staff_hours":[5,18].includes(n)?"target_response_time":n===7?"target_qualification_time":"target_value",difference:"actual_target_difference",targetPct:"percentage_of_target",moneyTotal:n===22?"payments_without_reminders_amount":"affected_invoices_amount",moneyAverage:n===22?"average_payment_amount":"average_invoice_amount","step2:staff-shortfall":"staff_hour_shortfall","step2:payments-without-reminders":"affected_payments"};
 if(base[key])return base[key];
 if(key==="step3:historical:reviews:rate")return "reference_additional_review_rate";
 if(key==="step3:historical:reactivation:rate")return "historical_reactivation_rate";
 if(/^step3:historical:(reactivation|reviews):(eligible|converted)$/.test(key))return key.endsWith(":eligible")?"eligible_conversion_population":"converted_population";
 if(/^op:(lost-leads|lost-qualified-leads|fewer-appointments-booked):not-lost$/.test(key))return "recovered_pending_population";
 if(key.startsWith("op:")||key.startsWith("step2:negative-operational-")){
  const [,impact,suffix]=key.split(":");const id=opKeys[impact.replace("negative-operational-","")]?.[suffix];if(id)return id;
 }
 if(key.startsWith("fin:")){
  const newKey=key.slice(4).replace(/^(higher|estimated-higher):/,"");if(["expected-future-revenue","average-variable-buyer","buyers-per-source","incremental-staff-expenditure","incremental-staff-hours","incremental-employee-expenditure","incremental-employee-count","marketing-difference","staff-difference","gross-increase","other-difference","collection-expenditure","collection-reference-hours","resource-expenditure","resource-reference-units","wasted-resource-expenditure","wasted-resource-reference-units","net-category-difference","collection-difference","financing-difference","overdue-reference-amount","overdue-reference-count","estimated-staff-equivalents","estimated-equivalent-cost","estimated-equivalent-expenditure","estimated-equivalent-reference","estimated-average-paid-lead","estimated-average-additional-hour","estimated-average-collection-hour","estimated-average-additional-resource","estimated-marketing-spend","estimated-paid-acquired"].includes(newKey))return "financial_"+newKey.replaceAll("-","_");
  const suffix=key.slice(4);
  if(/^historical:(leads|qualified|reactivation|booking|attendance):(eligible|converted)$/.test(suffix))return suffix.endsWith(":eligible")?"eligible_conversion_population":"converted_population";
  if(financialKeys[suffix])return financialKeys[suffix];
  const [prefix,part]=suffix.split(":");if((prefix==="higher"||prefix==="estimated-higher")&&higherKeys[part])return prefix==="higher"?higherKeys[part]:estimatedHigher[part]??"estimated_"+higherKeys[part];
 }
 throw Error("Unmapped existing quantity "+problemId+"/"+key);
}
export type QuantityScope={
 businessId?:string;populationId?:string;populationDefinition?:string;countingUnit?:string;measurementPeriod?:string;reportingCutoff?:string;currency?:string;measurementBasis?:string;evidenceClassification?:string;scenario?:string;attribution?:string;productOrService?:string;resourceType?:string;financingArrangement?:string;interestMethod?:string;dayCountConvention?:string;futurePeriod?:string;
 // The old local identity is established within one workspace, but does not establish
 // the underlying real-world population for any other problem or period.
 status:"local-reference"|"established";localReference:string;
};
export type FieldReference={problemId:string;legacyKey:string;canonicalId:string;instanceId:string;definition:QuantityDefinition;label:string;unit:string;scope:QuantityScope;type:NumericalType;estimated:boolean};
const unitDisplay=(unit:string)=>unit==="Calls or bookings, subject to compatible counting definition"?"Calls":unit==="Appointments or reminder events, subject to compatible definitions"?"Appointments":unit==="Payments or reminder events, subject to compatible definitions"?"Payments":unit==="Hours"?"hrs":unit==="Minutes"?"min":unit==="Months"?"months":unit==="Context-dependent count"||unit==="Context-dependent"||unit==="Context-dependent target unit"?undefined:unit;
export function fieldReference(problemId:string,field:Pick<Field,"key"|"label"|"unit">&{estimated?:boolean}):FieldReference{
 const id=canonicalId(problemId,field.key),d=definition(id),n=Number(problemId.split("-")[1]);
 const core=problemQuantityDefinitions.find(p=>p.problemId===problemId)!;
 // An explicitly shared field retains its original scoped key. Distinct keys
 // (even identical canonical IDs) are never unified without scope evidence.
 const instanceId=problemId+"/"+field.key;
 const estimated=!!field.estimated||d.evidence==="estimated";
 let type:NumericalType=estimated&&d.types.includes("EST_COUNT")?"EST_COUNT":d.types[0];
 if(id==="target_value")type=field.unit==="min"?"MINUTES":field.unit==="hrs"?"HOURS":"COUNT";
 const scopedUnit=field.unit==="Units"?(field.key==="recordedUnits"?unitDisplay(core.unit):unitDisplay(d.unit)):undefined;
 const unit=problemId==="problem-22"&&["total","affected","unaffected"].includes(field.key)?"Events":field.key==="moneyAverage"&&field.unit==="Currency/unit"?d.unit:field.key==="daily"?"/day":id==="annual_interest_rate"?"%/year":field.unit==="Units"&&["target","difference"].includes(field.key)?unitDisplay(core.unit)??field.unit:scopedUnit??field.unit;
 const scopedLabels:Record<string,Record<string,string>>={"problem-3":{"affected":"Calls containing missed bookings","unaffected":"Calls in which all intended bookings were completed","affectedPct":"Affected call percentage","unaffectedPct":"Completed call percentage"},"problem-12":{"affected":"Appointments affected by missed reminders","unaffected":"Appointments receiving all required reminders","affectedPct":"Affected appointment percentage","unaffectedPct":"Unaffected appointment percentage"},"problem-15":{"affected":"Distinct affected appointments","averageMinutes":"Average total time per affected appointment","hours":"Total rescheduling time"},"problem-22":{"total":"Required reminder events","affected":"Missed reminder events","unaffected":"Sent reminder events","affectedPct":"Missed reminder-event percentage","unaffectedPct":"Sent reminder-event percentage"}};
 const label=scopedLabels[problemId]?.[field.key]??(id==="target_value"?"Target value":["eligible_conversion_population","converted_population","applicable_average_population","unclassified_quantity","overlapping_quantity","unique_combined_quantity","recovered_pending_population"].includes(id)?field.label:d.name);
 return {problemId,legacyKey:field.key,canonicalId:id,instanceId,definition:d,label,unit,type,estimated,scope:{status:"local-reference",localReference:instanceId,countingUnit:unit}};
}
export type QuantityInstanceState={reference:FieldReference;effectiveNumericalType:NumericalType;manualAssertions:Record<string,string>;manualValue?:string;calculatedValue?:number;source:"manual"|"calculated"|"shared"|"unknown";consequence:"confirmed"|"estimated"|"unknown";amountEvidence:"directly-measured"|"calculated-from-measurements"|"estimated"|"unknown";minimum?:number;maximum?:number;dependencies:readonly string[];contradictory:boolean;undefined:boolean;applicable:boolean;relationshipRefs:readonly string[]};
export function instanceState(reference:FieldReference,raw:Figures,result:Result,options:{consequence?:QuantityInstanceState["consequence"];amountEvidence?:QuantityInstanceState["amountEvidence"];relationships?:string[];dependencies?:string[];applicable?:boolean;undefined?:boolean}={}):QuantityInstanceState{
 const key=reference.legacyKey,manual=raw[key]?.trim()?raw[key]:undefined;
 const calculated=manual===undefined&&Number.isFinite(result.values[key])&&!result.blocked.has(key)?result.values[key]:undefined;
 const estimated=reference.estimated||result.estimated.has(key),bound=result.bounds?.[key];
 const invalid=manual!==undefined&&!validNumericalValue(reference.type,Number(manual));
 return {reference,effectiveNumericalType:reference.type==="COUNT"&&estimated&&manual===undefined?"EST_COUNT":reference.type,manualAssertions:manual===undefined?{}:{[reference.instanceId]:manual},manualValue:manual,calculatedValue:calculated,source:manual!==undefined?"manual":calculated!==undefined?"calculated":"unknown",consequence:options.consequence??"unknown",amountEvidence:manual===undefined&&calculated===undefined?"unknown":estimated?"estimated":options.amountEvidence??"unknown",minimum:bound?.min,maximum:bound?.max,dependencies:options.dependencies??[],contradictory:invalid||result.blocked.has(key),undefined:options.undefined??false,applicable:options.applicable??true,relationshipRefs:options.relationships??[]};
}
// Explicit complete scope comparison only; no cross-problem propagation in Step 3.
export function canShare(a:FieldReference,b:FieldReference):boolean{
 if(a.instanceId===b.instanceId)return true;
 if(a.canonicalId!==b.canonicalId||a.scope.status!=="established"||b.scope.status!=="established")return false;
 return a.definition.scopeRequirements.every(key=>{const av=a.scope[key as keyof QuantityScope],bv=b.scope[key as keyof QuantityScope];return av!==undefined&&av!==""&&av===bv;});
}
export function normalizeField<T extends Field>(problemId:string,field:T):T{
 const ref=fieldReference(problemId,field);return {...field,label:ref.label,unit:ref.unit};
}
