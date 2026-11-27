// Canonical Step 3 registry definitions, generated from the supplied specification.
// The definitions describe measurement types, not stored numbers or executable equations.
export const numericalTypes = {
  "COUNT": {
    "min": 0,
    "integer": true
  },
  "EST_COUNT": {
    "min": 0
  },
  "PCT": {
    "min": 0,
    "max": 100
  },
  "TARGET_PCT": {
    "min": 0
  },
  "MARGIN": {
    "conditionalMax": 100,
    "condition": "Positive revenue and nonnegative variable costs"
  },
  "RATE": {
    "min": 0
  },
  "RATIO": {
    "min": 0
  },
  "MONEY": {
    "min": 0
  },
  "SIGNED_MONEY": {},
  "AVG_MONEY": {
    "min": 0
  },
  "SIGNED_AVG": {},
  "HOURS": {
    "min": 0
  },
  "MINUTES": {
    "min": 0
  },
  "DAYS": {
    "min": 0,
    "denominatorPositive": true
  },
  "MONTHS": {
    "min": 0
  },
  "DIFF": {},
  "INTEREST": {
    "min": 0
  },
  "FTE": {
    "min": 0
  },
  "RESOURCE_COUNT": {
    "min": 0,
    "integerByUnit": true
  }
} as const;
export type NumericalType = keyof typeof numericalTypes;
export type QuantityDefinition={id:string;name:string;definition:string;unit:string;types:readonly NumericalType[];scopeRequirements:readonly string[];evidence:string;populationCondition?:string};
export const quantityDefinitions:Readonly<Record<string,QuantityDefinition>> = {
 "average_variable_cost_per_purchase":{id:"average_variable_cost_per_purchase",name:"Average variable cost per purchase",definition:"Applicable total variable costs divided by corresponding purchases.",unit:"$/Purchase",types:["AVG_MONEY"],scopeRequirements:["businessId","populationId","measurementPeriod","reportingCutoff","currency"],evidence:"evidence-dependent"},
 "reference_additional_review_rate":{id:"reference_additional_review_rate",name:"Reference additional review rate",definition:"Attributable additional reviews per eligible buyer in a separately scoped reference population, with at most one review per buyer.",unit:"%",types:["PCT"],scopeRequirements:["businessId","populationId","measurementPeriod","reportingCutoff"],evidence:"evidence-dependent"},
 "pending_affected_buyers":{id:"pending_affected_buyers",name:"Pending or otherwise classified affected buyers",definition:"Distinct affected buyers not yet classified as served or unserved.",unit:"Buyers",types:["COUNT","EST_COUNT"],scopeRequirements:["businessId","populationId","measurementPeriod","reportingCutoff"],evidence:"evidence-dependent"},
 "pending_affected_tasks":{id:"pending_affected_tasks",name:"Pending or otherwise classified affected tasks",definition:"Affected tasks outside the finalized completed and incomplete categories.",unit:"Tasks",types:["COUNT","EST_COUNT"],scopeRequirements:["businessId","populationId","measurementPeriod","reportingCutoff"],evidence:"evidence-dependent"},
 "historical_reactivation_rate":{id:"historical_reactivation_rate",name:"Historical reactivation rate",definition:"Relevant historical reactivations divided by eligible historical old leads.",unit:"%",types:["PCT"],scopeRequirements:["businessId","populationId","measurementPeriod","reportingCutoff"],evidence:"evidence-dependent"},
 "pending_affected_slots":{id:"pending_affected_slots",name:"Pending or unclassified slots",definition:"Affected slots without a finalized filled or unused status.",unit:"Slots",types:["COUNT","EST_COUNT"],scopeRequirements:["businessId","populationId","measurementPeriod","reportingCutoff"],evidence:"evidence-dependent"},
 "recovered_pending_population": {id:"recovered_pending_population",name:"Recovered + pending",definition:"Combined recovered and pending population, excluding lost entities.",unit:"Context-dependent count",types:["COUNT","EST_COUNT"],scopeRequirements:["businessId","populationId","countingUnit","measurementPeriod","reportingCutoff","scenario"],evidence:"evidence-dependent"},
  "population.intendedBookings": {"id":"population.intendedBookings","name":"Intended individual bookings","definition":"Intended individual bookings in the same explicitly scoped measurement.","unit":"Bookings","types":["COUNT"],"scopeRequirements":["businessId","populationId","countingUnit","measurementPeriod","reportingCutoff","scenario"],"evidence":"evidence-dependent"},
  "population.missedBookings": {"id":"population.missedBookings","name":"Missed individual bookings","definition":"Missed individual bookings in the same explicitly scoped measurement.","unit":"Bookings","types":["COUNT"],"scopeRequirements":["businessId","populationId","countingUnit","measurementPeriod","reportingCutoff","scenario"],"evidence":"evidence-dependent"},
  "population.requiredReminders": {"id":"population.requiredReminders","name":"Required reminder events","definition":"Required reminder events in the same explicitly scoped measurement.","unit":"Events","types":["COUNT"],"scopeRequirements":["businessId","populationId","countingUnit","measurementPeriod","reportingCutoff","scenario"],"evidence":"evidence-dependent"},
  "population.missedReminders": {"id":"population.missedReminders","name":"Missed reminder events","definition":"Missed reminder events in the same explicitly scoped measurement.","unit":"Events","types":["COUNT"],"scopeRequirements":["businessId","populationId","countingUnit","measurementPeriod","reportingCutoff","scenario"],"evidence":"evidence-dependent"},
  "population.sentReminders": {"id":"population.sentReminders","name":"Sent reminder events","definition":"Sent reminder events in the same explicitly scoped measurement.","unit":"Events","types":["COUNT"],"scopeRequirements":["businessId","populationId","countingUnit","measurementPeriod","reportingCutoff","scenario"],"evidence":"evidence-dependent"},
  "population.pendingReminders": {"id":"population.pendingReminders","name":"Unclassified reminder events","definition":"Unclassified reminder events in the same explicitly scoped measurement.","unit":"Events","types":["COUNT"],"scopeRequirements":["businessId","populationId","countingUnit","measurementPeriod","reportingCutoff","scenario"],"evidence":"evidence-dependent"},
  "population.missedReminderPct": {"id":"population.missedReminderPct","name":"Missed reminder-event percentage","definition":"Missed reminder-event percentage in the same explicitly scoped measurement.","unit":"%","types":["PCT"],"scopeRequirements":["businessId","populationId","countingUnit","measurementPeriod","reportingCutoff","scenario"],"evidence":"evidence-dependent"},
  "population.reschedulingEvents": {"id":"population.reschedulingEvents","name":"Rescheduling events","definition":"Rescheduling events in the same explicitly scoped measurement.","unit":"Events","types":["COUNT"],"scopeRequirements":["businessId","populationId","countingUnit","measurementPeriod","reportingCutoff","scenario"],"evidence":"evidence-dependent"},
  "population.averageEventMinutes": {"id":"population.averageEventMinutes","name":"Average time per rescheduling event","definition":"Average time per rescheduling event in the same explicitly scoped measurement.","unit":"min","types":["MINUTES"],"scopeRequirements":["businessId","populationId","countingUnit","measurementPeriod","reportingCutoff","scenario"],"evidence":"evidence-dependent"},
  "population.affectedInvoices": {"id":"population.affectedInvoices","name":"Distinct affected invoices","definition":"Distinct affected invoices in the same explicitly scoped measurement.","unit":"Invoices","types":["COUNT"],"scopeRequirements":["businessId","populationId","countingUnit","measurementPeriod","reportingCutoff","scenario"],"evidence":"evidence-dependent"},
  "population.requiredPayments": {"id":"population.requiredPayments","name":"Distinct payments requiring reminders","definition":"Distinct payments requiring reminders in the same explicitly scoped measurement.","unit":"Payments","types":["COUNT"],"scopeRequirements":["businessId","populationId","countingUnit","measurementPeriod","reportingCutoff","scenario"],"evidence":"evidence-dependent"},
  "population.missingRecordings": {"id":"population.missingRecordings","name":"Calls missing recordings","definition":"Calls missing recordings in the same explicitly scoped measurement.","unit":"Calls","types":["COUNT"],"scopeRequirements":["businessId","populationId","countingUnit","measurementPeriod","reportingCutoff","scenario"],"evidence":"evidence-dependent"},
  "population.missingOutcomes": {"id":"population.missingOutcomes","name":"Calls missing outcomes","definition":"Calls missing outcomes in the same explicitly scoped measurement.","unit":"Calls","types":["COUNT"],"scopeRequirements":["businessId","populationId","countingUnit","measurementPeriod","reportingCutoff","scenario"],"evidence":"evidence-dependent"},
  "population.missingBoth": {"id":"population.missingBoth","name":"Calls missing both","definition":"Calls missing both in the same explicitly scoped measurement.","unit":"Calls","types":["COUNT"],"scopeRequirements":["businessId","populationId","countingUnit","measurementPeriod","reportingCutoff","scenario"],"evidence":"evidence-dependent"},
  "population.requiredUpdates": {"id":"population.requiredUpdates","name":"Required CRM update events","definition":"Required CRM update events in the same explicitly scoped measurement.","unit":"Events","types":["COUNT"],"scopeRequirements":["businessId","populationId","countingUnit","measurementPeriod","reportingCutoff","scenario"],"evidence":"evidence-dependent"},
  "population.missedUpdates": {"id":"population.missedUpdates","name":"Missed CRM update events","definition":"Missed CRM update events in the same explicitly scoped measurement.","unit":"Events","types":["COUNT"],"scopeRequirements":["businessId","populationId","countingUnit","measurementPeriod","reportingCutoff","scenario"],"evidence":"evidence-dependent"},
  "population.completedUpdates": {"id":"population.completedUpdates","name":"Completed CRM update events","definition":"Completed CRM update events in the same explicitly scoped measurement.","unit":"Events","types":["COUNT"],"scopeRequirements":["businessId","populationId","countingUnit","measurementPeriod","reportingCutoff","scenario"],"evidence":"evidence-dependent"},
  "population.pendingUpdates": {"id":"population.pendingUpdates","name":"Unclassified CRM update events","definition":"Unclassified CRM update events in the same explicitly scoped measurement.","unit":"Events","types":["COUNT"],"scopeRequirements":["businessId","populationId","countingUnit","measurementPeriod","reportingCutoff","scenario"],"evidence":"evidence-dependent"},
  "population.overlap": {"id":"population.overlap","name":"Overlap","definition":"Overlap in the same explicitly scoped measurement.","unit":"Units","types":["COUNT"],"scopeRequirements":["businessId","populationId","countingUnit","measurementPeriod","reportingCutoff","scenario"],"evidence":"evidence-dependent"},
  "population.combined": {"id":"population.combined","name":"Unique combined population","definition":"Unique combined population in the same explicitly scoped measurement.","unit":"Units","types":["COUNT"],"scopeRequirements":["businessId","populationId","countingUnit","measurementPeriod","reportingCutoff","scenario"],"evidence":"evidence-dependent"},
  "incoming_calls.total": {
    "id": "incoming_calls.total",
    "name": "Total incoming calls",
    "definition": "Entire defined population: Total incoming calls.",
    "unit": "Calls",
    "types": [
      "COUNT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent",
    "populationCondition": "Match the counting unit, measurement period and reporting cutoff. A complete breakdown requires mutually exclusive and exhaustive classifications."
  },
  "incoming_calls.affected": {
    "id": "incoming_calls.affected",
    "name": "Missed calls",
    "definition": "Affected members of the defined incoming calls population: Missed calls.",
    "unit": "Calls",
    "types": [
      "COUNT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent",
    "populationCondition": "Match the counting unit, measurement period and reporting cutoff. A complete breakdown requires mutually exclusive and exhaustive classifications."
  },
  "incoming_calls.unaffected": {
    "id": "incoming_calls.unaffected",
    "name": "Answered calls",
    "definition": "Unaffected members of the same population: Answered calls.",
    "unit": "Calls",
    "types": [
      "COUNT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent",
    "populationCondition": "Match the counting unit, measurement period and reporting cutoff. A complete breakdown requires mutually exclusive and exhaustive classifications."
  },
  "incoming_calls.affected_rate": {
    "id": "incoming_calls.affected_rate",
    "name": "Missed call rate",
    "definition": "Percentage of the compatible total population represented by Missed calls.",
    "unit": "%",
    "types": [
      "PCT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent",
    "populationCondition": "Match the counting unit, measurement period and reporting cutoff. A complete breakdown requires mutually exclusive and exhaustive classifications."
  },
  "incoming_calls.unaffected_rate": {
    "id": "incoming_calls.unaffected_rate",
    "name": "Answered call rate",
    "definition": "Percentage of the compatible total population represented by Answered calls.",
    "unit": "%",
    "types": [
      "PCT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent",
    "populationCondition": "Match the counting unit, measurement period and reporting cutoff. A complete breakdown requires mutually exclusive and exhaustive classifications."
  },
  "outside_hours_calls.total": {
    "id": "outside_hours_calls.total",
    "name": "Calls outside working hours",
    "definition": "Entire defined population: Calls outside working hours.",
    "unit": "Calls",
    "types": [
      "COUNT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent",
    "populationCondition": "Match the counting unit, measurement period and reporting cutoff. A complete breakdown requires mutually exclusive and exhaustive classifications."
  },
  "outside_hours_calls.affected": {
    "id": "outside_hours_calls.affected",
    "name": "Unanswered calls outside working hours",
    "definition": "Affected members of the defined outside hours calls population: Unanswered calls outside working hours.",
    "unit": "Calls",
    "types": [
      "COUNT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent",
    "populationCondition": "Match the counting unit, measurement period and reporting cutoff. A complete breakdown requires mutually exclusive and exhaustive classifications."
  },
  "outside_hours_calls.unaffected": {
    "id": "outside_hours_calls.unaffected",
    "name": "Answered calls outside working hours",
    "definition": "Unaffected members of the same population: Answered calls outside working hours.",
    "unit": "Calls",
    "types": [
      "COUNT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent",
    "populationCondition": "Match the counting unit, measurement period and reporting cutoff. A complete breakdown requires mutually exclusive and exhaustive classifications."
  },
  "outside_hours_calls.affected_rate": {
    "id": "outside_hours_calls.affected_rate",
    "name": "Unanswered call rate",
    "definition": "Percentage of the compatible total population represented by Unanswered calls outside working hours.",
    "unit": "%",
    "types": [
      "PCT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent",
    "populationCondition": "Match the counting unit, measurement period and reporting cutoff. A complete breakdown requires mutually exclusive and exhaustive classifications."
  },
  "outside_hours_calls.unaffected_rate": {
    "id": "outside_hours_calls.unaffected_rate",
    "name": "Answered call rate",
    "definition": "Percentage of the compatible total population represented by Answered calls outside working hours.",
    "unit": "%",
    "types": [
      "PCT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent",
    "populationCondition": "Match the counting unit, measurement period and reporting cutoff. A complete breakdown requires mutually exclusive and exhaustive classifications."
  },
  "booking_calls.total": {
    "id": "booking_calls.total",
    "name": "Calls requiring appointments",
    "definition": "Entire defined population: Calls requiring appointments.",
    "unit": "Calls or bookings, subject to compatible counting definition",
    "types": [
      "COUNT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent",
    "populationCondition": "Match the counting unit, measurement period and reporting cutoff. A complete breakdown requires mutually exclusive and exhaustive classifications."
  },
  "booking_calls.affected": {
    "id": "booking_calls.affected",
    "name": "Missed bookings during calls",
    "definition": "Affected members of the defined booking calls population: Missed bookings during calls.",
    "unit": "Calls or bookings, subject to compatible counting definition",
    "types": [
      "COUNT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent",
    "populationCondition": "Match the counting unit, measurement period and reporting cutoff. A complete breakdown requires mutually exclusive and exhaustive classifications."
  },
  "booking_calls.unaffected": {
    "id": "booking_calls.unaffected",
    "name": "Bookings completed during calls",
    "definition": "Unaffected members of the same population: Bookings completed during calls.",
    "unit": "Calls or bookings, subject to compatible counting definition",
    "types": [
      "COUNT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent",
    "populationCondition": "Match the counting unit, measurement period and reporting cutoff. A complete breakdown requires mutually exclusive and exhaustive classifications."
  },
  "booking_calls.affected_rate": {
    "id": "booking_calls.affected_rate",
    "name": "Missed booking rate",
    "definition": "Percentage of the compatible total population represented by Missed bookings during calls.",
    "unit": "%",
    "types": [
      "PCT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent",
    "populationCondition": "Match the counting unit, measurement period and reporting cutoff. A complete breakdown requires mutually exclusive and exhaustive classifications."
  },
  "booking_calls.unaffected_rate": {
    "id": "booking_calls.unaffected_rate",
    "name": "Completed booking rate",
    "definition": "Percentage of the compatible total population represented by Bookings completed during calls.",
    "unit": "%",
    "types": [
      "PCT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent",
    "populationCondition": "Match the counting unit, measurement period and reporting cutoff. A complete breakdown requires mutually exclusive and exhaustive classifications."
  },
  "urgent_calls.total": {
    "id": "urgent_calls.total",
    "name": "Urgent calls",
    "definition": "Entire defined population: Urgent calls.",
    "unit": "Calls",
    "types": [
      "COUNT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent",
    "populationCondition": "Match the counting unit, measurement period and reporting cutoff. A complete breakdown requires mutually exclusive and exhaustive classifications."
  },
  "urgent_calls.affected": {
    "id": "urgent_calls.affected",
    "name": "Urgent calls not reaching employees",
    "definition": "Affected members of the defined urgent calls population: Urgent calls not reaching employees.",
    "unit": "Calls",
    "types": [
      "COUNT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent",
    "populationCondition": "Match the counting unit, measurement period and reporting cutoff. A complete breakdown requires mutually exclusive and exhaustive classifications."
  },
  "urgent_calls.unaffected": {
    "id": "urgent_calls.unaffected",
    "name": "Urgent calls reaching employees",
    "definition": "Unaffected members of the same population: Urgent calls reaching employees.",
    "unit": "Calls",
    "types": [
      "COUNT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent",
    "populationCondition": "Match the counting unit, measurement period and reporting cutoff. A complete breakdown requires mutually exclusive and exhaustive classifications."
  },
  "urgent_calls.affected_rate": {
    "id": "urgent_calls.affected_rate",
    "name": "Unrouted urgent call rate",
    "definition": "Percentage of the compatible total population represented by Urgent calls not reaching employees.",
    "unit": "%",
    "types": [
      "PCT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent",
    "populationCondition": "Match the counting unit, measurement period and reporting cutoff. A complete breakdown requires mutually exclusive and exhaustive classifications."
  },
  "urgent_calls.unaffected_rate": {
    "id": "urgent_calls.unaffected_rate",
    "name": "Routed urgent call rate",
    "definition": "Percentage of the compatible total population represented by Urgent calls reaching employees.",
    "unit": "%",
    "types": [
      "PCT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent",
    "populationCondition": "Match the counting unit, measurement period and reporting cutoff. A complete breakdown requires mutually exclusive and exhaustive classifications."
  },
  "new_lead_responses.total": {
    "id": "new_lead_responses.total",
    "name": "New leads requiring a response",
    "definition": "Entire defined population: New leads requiring a response.",
    "unit": "Leads",
    "types": [
      "COUNT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent",
    "populationCondition": "Match the counting unit, measurement period and reporting cutoff. A complete breakdown requires mutually exclusive and exhaustive classifications."
  },
  "new_lead_responses.affected": {
    "id": "new_lead_responses.affected",
    "name": "New leads with slow responses",
    "definition": "Affected members of the defined new lead responses population: New leads with slow responses.",
    "unit": "Leads",
    "types": [
      "COUNT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent",
    "populationCondition": "Match the counting unit, measurement period and reporting cutoff. A complete breakdown requires mutually exclusive and exhaustive classifications."
  },
  "new_lead_responses.unaffected": {
    "id": "new_lead_responses.unaffected",
    "name": "New leads with timely responses",
    "definition": "Unaffected members of the same population: New leads with timely responses.",
    "unit": "Leads",
    "types": [
      "COUNT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent",
    "populationCondition": "Match the counting unit, measurement period and reporting cutoff. A complete breakdown requires mutually exclusive and exhaustive classifications."
  },
  "new_lead_responses.affected_rate": {
    "id": "new_lead_responses.affected_rate",
    "name": "Slow response rate",
    "definition": "Percentage of the compatible total population represented by New leads with slow responses.",
    "unit": "%",
    "types": [
      "PCT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent",
    "populationCondition": "Match the counting unit, measurement period and reporting cutoff. A complete breakdown requires mutually exclusive and exhaustive classifications."
  },
  "new_lead_responses.unaffected_rate": {
    "id": "new_lead_responses.unaffected_rate",
    "name": "Timely response rate",
    "definition": "Percentage of the compatible total population represented by New leads with timely responses.",
    "unit": "%",
    "types": [
      "PCT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent",
    "populationCondition": "Match the counting unit, measurement period and reporting cutoff. A complete breakdown requires mutually exclusive and exhaustive classifications."
  },
  "new_lead_calls.total": {
    "id": "new_lead_calls.total",
    "name": "New leads requiring calls",
    "definition": "Entire defined population: New leads requiring calls.",
    "unit": "Leads",
    "types": [
      "COUNT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent",
    "populationCondition": "Match the counting unit, measurement period and reporting cutoff. A complete breakdown requires mutually exclusive and exhaustive classifications."
  },
  "new_lead_calls.affected": {
    "id": "new_lead_calls.affected",
    "name": "New leads never called",
    "definition": "Affected members of the defined new lead calls population: New leads never called.",
    "unit": "Leads",
    "types": [
      "COUNT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent",
    "populationCondition": "Match the counting unit, measurement period and reporting cutoff. A complete breakdown requires mutually exclusive and exhaustive classifications."
  },
  "new_lead_calls.unaffected": {
    "id": "new_lead_calls.unaffected",
    "name": "New leads called",
    "definition": "Unaffected members of the same population: New leads called.",
    "unit": "Leads",
    "types": [
      "COUNT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent",
    "populationCondition": "Match the counting unit, measurement period and reporting cutoff. A complete breakdown requires mutually exclusive and exhaustive classifications."
  },
  "new_lead_calls.affected_rate": {
    "id": "new_lead_calls.affected_rate",
    "name": "Uncalled lead rate",
    "definition": "Percentage of the compatible total population represented by New leads never called.",
    "unit": "%",
    "types": [
      "PCT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent",
    "populationCondition": "Match the counting unit, measurement period and reporting cutoff. A complete breakdown requires mutually exclusive and exhaustive classifications."
  },
  "new_lead_calls.unaffected_rate": {
    "id": "new_lead_calls.unaffected_rate",
    "name": "Called lead rate",
    "definition": "Percentage of the compatible total population represented by New leads called.",
    "unit": "%",
    "types": [
      "PCT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent",
    "populationCondition": "Match the counting unit, measurement period and reporting cutoff. A complete breakdown requires mutually exclusive and exhaustive classifications."
  },
  "lead_qualifications.total": {
    "id": "lead_qualifications.total",
    "name": "Leads requiring qualification",
    "definition": "Entire defined population: Leads requiring qualification.",
    "unit": "Leads",
    "types": [
      "COUNT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent",
    "populationCondition": "Match the counting unit, measurement period and reporting cutoff. A complete breakdown requires mutually exclusive and exhaustive classifications."
  },
  "lead_qualifications.affected": {
    "id": "lead_qualifications.affected",
    "name": "Late lead qualifications",
    "definition": "Affected members of the defined lead qualifications population: Late lead qualifications.",
    "unit": "Leads",
    "types": [
      "COUNT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent",
    "populationCondition": "Match the counting unit, measurement period and reporting cutoff. A complete breakdown requires mutually exclusive and exhaustive classifications."
  },
  "lead_qualifications.unaffected": {
    "id": "lead_qualifications.unaffected",
    "name": "Timely lead qualifications",
    "definition": "Unaffected members of the same population: Timely lead qualifications.",
    "unit": "Leads",
    "types": [
      "COUNT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent",
    "populationCondition": "Match the counting unit, measurement period and reporting cutoff. A complete breakdown requires mutually exclusive and exhaustive classifications."
  },
  "lead_qualifications.affected_rate": {
    "id": "lead_qualifications.affected_rate",
    "name": "Late qualification rate",
    "definition": "Percentage of the compatible total population represented by Late lead qualifications.",
    "unit": "%",
    "types": [
      "PCT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent",
    "populationCondition": "Match the counting unit, measurement period and reporting cutoff. A complete breakdown requires mutually exclusive and exhaustive classifications."
  },
  "lead_qualifications.unaffected_rate": {
    "id": "lead_qualifications.unaffected_rate",
    "name": "Timely qualification rate",
    "definition": "Percentage of the compatible total population represented by Timely lead qualifications.",
    "unit": "%",
    "types": [
      "PCT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent",
    "populationCondition": "Match the counting unit, measurement period and reporting cutoff. A complete breakdown requires mutually exclusive and exhaustive classifications."
  },
  "warm_lead_contacts.total": {
    "id": "warm_lead_contacts.total",
    "name": "Warm leads requiring contact",
    "definition": "Entire defined population: Warm leads requiring contact.",
    "unit": "Leads",
    "types": [
      "COUNT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent",
    "populationCondition": "Match the counting unit, measurement period and reporting cutoff. A complete breakdown requires mutually exclusive and exhaustive classifications."
  },
  "warm_lead_contacts.affected": {
    "id": "warm_lead_contacts.affected",
    "name": "Warm leads not contacted",
    "definition": "Affected members of the defined warm lead contacts population: Warm leads not contacted.",
    "unit": "Leads",
    "types": [
      "COUNT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent",
    "populationCondition": "Match the counting unit, measurement period and reporting cutoff. A complete breakdown requires mutually exclusive and exhaustive classifications."
  },
  "warm_lead_contacts.unaffected": {
    "id": "warm_lead_contacts.unaffected",
    "name": "Warm leads contacted",
    "definition": "Unaffected members of the same population: Warm leads contacted.",
    "unit": "Leads",
    "types": [
      "COUNT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent",
    "populationCondition": "Match the counting unit, measurement period and reporting cutoff. A complete breakdown requires mutually exclusive and exhaustive classifications."
  },
  "warm_lead_contacts.affected_rate": {
    "id": "warm_lead_contacts.affected_rate",
    "name": "Uncontacted warm lead rate",
    "definition": "Percentage of the compatible total population represented by Warm leads not contacted.",
    "unit": "%",
    "types": [
      "PCT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent",
    "populationCondition": "Match the counting unit, measurement period and reporting cutoff. A complete breakdown requires mutually exclusive and exhaustive classifications."
  },
  "warm_lead_contacts.unaffected_rate": {
    "id": "warm_lead_contacts.unaffected_rate",
    "name": "Contacted warm lead rate",
    "definition": "Percentage of the compatible total population represented by Warm leads contacted.",
    "unit": "%",
    "types": [
      "PCT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent",
    "populationCondition": "Match the counting unit, measurement period and reporting cutoff. A complete breakdown requires mutually exclusive and exhaustive classifications."
  },
  "old_lead_calls.total": {
    "id": "old_lead_calls.total",
    "name": "Old leads requiring calls",
    "definition": "Entire defined population: Old leads requiring calls.",
    "unit": "Leads",
    "types": [
      "COUNT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent",
    "populationCondition": "Match the counting unit, measurement period and reporting cutoff. A complete breakdown requires mutually exclusive and exhaustive classifications."
  },
  "old_lead_calls.affected": {
    "id": "old_lead_calls.affected",
    "name": "Old leads not called",
    "definition": "Affected members of the defined old lead calls population: Old leads not called.",
    "unit": "Leads",
    "types": [
      "COUNT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent",
    "populationCondition": "Match the counting unit, measurement period and reporting cutoff. A complete breakdown requires mutually exclusive and exhaustive classifications."
  },
  "old_lead_calls.unaffected": {
    "id": "old_lead_calls.unaffected",
    "name": "Old leads called",
    "definition": "Unaffected members of the same population: Old leads called.",
    "unit": "Leads",
    "types": [
      "COUNT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent",
    "populationCondition": "Match the counting unit, measurement period and reporting cutoff. A complete breakdown requires mutually exclusive and exhaustive classifications."
  },
  "old_lead_calls.affected_rate": {
    "id": "old_lead_calls.affected_rate",
    "name": "Uncalled old lead rate",
    "definition": "Percentage of the compatible total population represented by Old leads not called.",
    "unit": "%",
    "types": [
      "PCT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent",
    "populationCondition": "Match the counting unit, measurement period and reporting cutoff. A complete breakdown requires mutually exclusive and exhaustive classifications."
  },
  "old_lead_calls.unaffected_rate": {
    "id": "old_lead_calls.unaffected_rate",
    "name": "Called lead rate",
    "definition": "Percentage of the compatible total population represented by Old leads called.",
    "unit": "%",
    "types": [
      "PCT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent",
    "populationCondition": "Match the counting unit, measurement period and reporting cutoff. A complete breakdown requires mutually exclusive and exhaustive classifications."
  },
  "old_lead_followups.total": {
    "id": "old_lead_followups.total",
    "name": "Old leads requiring follow-up",
    "definition": "Entire defined population: Old leads requiring follow-up.",
    "unit": "Leads",
    "types": [
      "COUNT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent",
    "populationCondition": "Match the counting unit, measurement period and reporting cutoff. A complete breakdown requires mutually exclusive and exhaustive classifications."
  },
  "old_lead_followups.affected": {
    "id": "old_lead_followups.affected",
    "name": "Old leads followed up inconsistently",
    "definition": "Affected members of the defined old lead followups population: Old leads followed up inconsistently.",
    "unit": "Leads",
    "types": [
      "COUNT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent",
    "populationCondition": "Match the counting unit, measurement period and reporting cutoff. A complete breakdown requires mutually exclusive and exhaustive classifications."
  },
  "old_lead_followups.unaffected": {
    "id": "old_lead_followups.unaffected",
    "name": "Old leads followed up regularly",
    "definition": "Unaffected members of the same population: Old leads followed up regularly.",
    "unit": "Leads",
    "types": [
      "COUNT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent",
    "populationCondition": "Match the counting unit, measurement period and reporting cutoff. A complete breakdown requires mutually exclusive and exhaustive classifications."
  },
  "old_lead_followups.affected_rate": {
    "id": "old_lead_followups.affected_rate",
    "name": "Inconsistent follow-up rate",
    "definition": "Percentage of the compatible total population represented by Old leads followed up inconsistently.",
    "unit": "%",
    "types": [
      "PCT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent",
    "populationCondition": "Match the counting unit, measurement period and reporting cutoff. A complete breakdown requires mutually exclusive and exhaustive classifications."
  },
  "old_lead_followups.unaffected_rate": {
    "id": "old_lead_followups.unaffected_rate",
    "name": "Regular follow-up rate",
    "definition": "Percentage of the compatible total population represented by Old leads followed up regularly.",
    "unit": "%",
    "types": [
      "PCT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent",
    "populationCondition": "Match the counting unit, measurement period and reporting cutoff. A complete breakdown requires mutually exclusive and exhaustive classifications."
  },
  "warm_old_lead_contacts.total": {
    "id": "warm_old_lead_contacts.total",
    "name": "Warm old leads requiring further contact",
    "definition": "Entire defined population: Warm old leads requiring further contact.",
    "unit": "Leads",
    "types": [
      "COUNT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent",
    "populationCondition": "Match the counting unit, measurement period and reporting cutoff. A complete breakdown requires mutually exclusive and exhaustive classifications."
  },
  "warm_old_lead_contacts.affected": {
    "id": "warm_old_lead_contacts.affected",
    "name": "Warm old leads not contacted again",
    "definition": "Affected members of the defined warm old lead contacts population: Warm old leads not contacted again.",
    "unit": "Leads",
    "types": [
      "COUNT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent",
    "populationCondition": "Match the counting unit, measurement period and reporting cutoff. A complete breakdown requires mutually exclusive and exhaustive classifications."
  },
  "warm_old_lead_contacts.unaffected": {
    "id": "warm_old_lead_contacts.unaffected",
    "name": "Warm old leads contacted again",
    "definition": "Unaffected members of the same population: Warm old leads contacted again.",
    "unit": "Leads",
    "types": [
      "COUNT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent",
    "populationCondition": "Match the counting unit, measurement period and reporting cutoff. A complete breakdown requires mutually exclusive and exhaustive classifications."
  },
  "warm_old_lead_contacts.affected_rate": {
    "id": "warm_old_lead_contacts.affected_rate",
    "name": "Uncontacted warm old lead rate",
    "definition": "Percentage of the compatible total population represented by Warm old leads not contacted again.",
    "unit": "%",
    "types": [
      "PCT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent",
    "populationCondition": "Match the counting unit, measurement period and reporting cutoff. A complete breakdown requires mutually exclusive and exhaustive classifications."
  },
  "warm_old_lead_contacts.unaffected_rate": {
    "id": "warm_old_lead_contacts.unaffected_rate",
    "name": "Contacted warm old lead rate",
    "definition": "Percentage of the compatible total population represented by Warm old leads contacted again.",
    "unit": "%",
    "types": [
      "PCT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent",
    "populationCondition": "Match the counting unit, measurement period and reporting cutoff. A complete breakdown requires mutually exclusive and exhaustive classifications."
  },
  "appointment_reminders.total": {
    "id": "appointment_reminders.total",
    "name": "Appointments requiring reminders",
    "definition": "Entire defined population: Appointments requiring reminders.",
    "unit": "Appointments or reminder events, subject to compatible definitions",
    "types": [
      "COUNT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent",
    "populationCondition": "Match the counting unit, measurement period and reporting cutoff. A complete breakdown requires mutually exclusive and exhaustive classifications."
  },
  "appointment_reminders.affected": {
    "id": "appointment_reminders.affected",
    "name": "Missed appointment reminders",
    "definition": "Affected members of the defined appointment reminders population: Missed appointment reminders.",
    "unit": "Appointments or reminder events, subject to compatible definitions",
    "types": [
      "COUNT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent",
    "populationCondition": "Match the counting unit, measurement period and reporting cutoff. A complete breakdown requires mutually exclusive and exhaustive classifications."
  },
  "appointment_reminders.unaffected": {
    "id": "appointment_reminders.unaffected",
    "name": "Appointment reminders sent",
    "definition": "Unaffected members of the same population: Appointment reminders sent.",
    "unit": "Appointments or reminder events, subject to compatible definitions",
    "types": [
      "COUNT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent",
    "populationCondition": "Match the counting unit, measurement period and reporting cutoff. A complete breakdown requires mutually exclusive and exhaustive classifications."
  },
  "remaining_population_percentage": {
    "id": "remaining_population_percentage",
    "name": "Remaining percentage",
    "definition": "Percentage of the compatible total population not classified as affected or unaffected.",
    "unit": "%",
    "types": [
      "PCT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent",
    "populationCondition": "Match the counting unit, measurement period and reporting cutoff. A complete breakdown requires mutually exclusive and exhaustive classifications."
  },
  "appointment_reminders.affected_rate": {
    "id": "appointment_reminders.affected_rate",
    "name": "Missed reminder rate",
    "definition": "Percentage of the compatible total population represented by Missed appointment reminders.",
    "unit": "%",
    "types": [
      "PCT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent",
    "populationCondition": "Match the counting unit, measurement period and reporting cutoff. A complete breakdown requires mutually exclusive and exhaustive classifications."
  },
  "appointment_reminders.unaffected_rate": {
    "id": "appointment_reminders.unaffected_rate",
    "name": "Sent reminder rate",
    "definition": "Percentage of the compatible total population represented by Appointment reminders sent.",
    "unit": "%",
    "types": [
      "PCT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent",
    "populationCondition": "Match the counting unit, measurement period and reporting cutoff. A complete breakdown requires mutually exclusive and exhaustive classifications."
  },
  "appointment_confirmations.total": {
    "id": "appointment_confirmations.total",
    "name": "Appointments requiring confirmation",
    "definition": "Entire defined population: Appointments requiring confirmation.",
    "unit": "Appointments",
    "types": [
      "COUNT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent",
    "populationCondition": "Match the counting unit, measurement period and reporting cutoff. A complete breakdown requires mutually exclusive and exhaustive classifications."
  },
  "appointment_confirmations.affected": {
    "id": "appointment_confirmations.affected",
    "name": "Unconfirmed appointments",
    "definition": "Affected members of the defined appointment confirmations population: Unconfirmed appointments.",
    "unit": "Appointments",
    "types": [
      "COUNT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent",
    "populationCondition": "Match the counting unit, measurement period and reporting cutoff. A complete breakdown requires mutually exclusive and exhaustive classifications."
  },
  "appointment_confirmations.unaffected": {
    "id": "appointment_confirmations.unaffected",
    "name": "Confirmed appointments",
    "definition": "Unaffected members of the same population: Confirmed appointments.",
    "unit": "Appointments",
    "types": [
      "COUNT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent",
    "populationCondition": "Match the counting unit, measurement period and reporting cutoff. A complete breakdown requires mutually exclusive and exhaustive classifications."
  },
  "appointment_confirmations.affected_rate": {
    "id": "appointment_confirmations.affected_rate",
    "name": "Unconfirmed appointment rate",
    "definition": "Percentage of the compatible total population represented by Unconfirmed appointments.",
    "unit": "%",
    "types": [
      "PCT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent",
    "populationCondition": "Match the counting unit, measurement period and reporting cutoff. A complete breakdown requires mutually exclusive and exhaustive classifications."
  },
  "appointment_confirmations.unaffected_rate": {
    "id": "appointment_confirmations.unaffected_rate",
    "name": "Confirmed appointment rate",
    "definition": "Percentage of the compatible total population represented by Confirmed appointments.",
    "unit": "%",
    "types": [
      "PCT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent",
    "populationCondition": "Match the counting unit, measurement period and reporting cutoff. A complete breakdown requires mutually exclusive and exhaustive classifications."
  },
  "appointment_attendance.total": {
    "id": "appointment_attendance.total",
    "name": "Scheduled appointments",
    "definition": "Entire defined population: Scheduled appointments.",
    "unit": "Appointments",
    "types": [
      "COUNT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent",
    "populationCondition": "Match the counting unit, measurement period and reporting cutoff. A complete breakdown requires mutually exclusive and exhaustive classifications."
  },
  "appointment_attendance.affected": {
    "id": "appointment_attendance.affected",
    "name": "Appointment no-shows",
    "definition": "Affected members of the defined appointment attendance population: Appointment no-shows.",
    "unit": "Appointments",
    "types": [
      "COUNT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent",
    "populationCondition": "Match the counting unit, measurement period and reporting cutoff. A complete breakdown requires mutually exclusive and exhaustive classifications."
  },
  "appointment_attendance.unaffected": {
    "id": "appointment_attendance.unaffected",
    "name": "Appointments attended",
    "definition": "Unaffected members of the same population: Appointments attended.",
    "unit": "Appointments",
    "types": [
      "COUNT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent",
    "populationCondition": "Match the counting unit, measurement period and reporting cutoff. A complete breakdown requires mutually exclusive and exhaustive classifications."
  },
  "appointment_attendance.affected_rate": {
    "id": "appointment_attendance.affected_rate",
    "name": "No-show rate",
    "definition": "Percentage of the compatible total population represented by Appointment no-shows.",
    "unit": "%",
    "types": [
      "PCT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent",
    "populationCondition": "Match the counting unit, measurement period and reporting cutoff. A complete breakdown requires mutually exclusive and exhaustive classifications."
  },
  "appointment_attendance.unaffected_rate": {
    "id": "appointment_attendance.unaffected_rate",
    "name": "Attendance rate",
    "definition": "Percentage of the compatible total population represented by Appointments attended.",
    "unit": "%",
    "types": [
      "PCT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent",
    "populationCondition": "Match the counting unit, measurement period and reporting cutoff. A complete breakdown requires mutually exclusive and exhaustive classifications."
  },
  "appointment_rescheduling.total": {
    "id": "appointment_rescheduling.total",
    "name": "Appointments requiring rescheduling",
    "definition": "Entire defined population: Appointments requiring rescheduling.",
    "unit": "Appointments",
    "types": [
      "COUNT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent",
    "populationCondition": "Match the counting unit, measurement period and reporting cutoff. A complete breakdown requires mutually exclusive and exhaustive classifications."
  },
  "appointment_rescheduling.affected": {
    "id": "appointment_rescheduling.affected",
    "name": "Time-consuming appointment rescheduling",
    "definition": "Affected members of the defined appointment rescheduling population: Time-consuming appointment rescheduling.",
    "unit": "Appointments",
    "types": [
      "COUNT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent",
    "populationCondition": "Match the counting unit, measurement period and reporting cutoff. A complete breakdown requires mutually exclusive and exhaustive classifications."
  },
  "appointment_rescheduling.unaffected": {
    "id": "appointment_rescheduling.unaffected",
    "name": "Appointments rescheduled promptly",
    "definition": "Unaffected members of the same population: Appointments rescheduled promptly.",
    "unit": "Appointments",
    "types": [
      "COUNT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent",
    "populationCondition": "Match the counting unit, measurement period and reporting cutoff. A complete breakdown requires mutually exclusive and exhaustive classifications."
  },
  "appointment_rescheduling.affected_rate": {
    "id": "appointment_rescheduling.affected_rate",
    "name": "Time-consuming rescheduling rate",
    "definition": "Percentage of the compatible total population represented by Time-consuming appointment rescheduling.",
    "unit": "%",
    "types": [
      "PCT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent",
    "populationCondition": "Match the counting unit, measurement period and reporting cutoff. A complete breakdown requires mutually exclusive and exhaustive classifications."
  },
  "appointment_rescheduling.unaffected_rate": {
    "id": "appointment_rescheduling.unaffected_rate",
    "name": "Prompt rescheduling rate",
    "definition": "Percentage of the compatible total population represented by Appointments rescheduled promptly.",
    "unit": "%",
    "types": [
      "PCT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent",
    "populationCondition": "Match the counting unit, measurement period and reporting cutoff. A complete breakdown requires mutually exclusive and exhaustive classifications."
  },
  "canceled_slots.total": {
    "id": "canceled_slots.total",
    "name": "Canceled appointment slots",
    "definition": "Entire defined population: Canceled appointment slots.",
    "unit": "Slots",
    "types": [
      "COUNT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent",
    "populationCondition": "Match the counting unit, measurement period and reporting cutoff. A complete breakdown requires mutually exclusive and exhaustive classifications."
  },
  "canceled_slots.affected": {
    "id": "canceled_slots.affected",
    "name": "Empty slots after cancellations",
    "definition": "Affected members of the defined canceled slots population: Empty slots after cancellations.",
    "unit": "Slots",
    "types": [
      "COUNT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent",
    "populationCondition": "Match the counting unit, measurement period and reporting cutoff. A complete breakdown requires mutually exclusive and exhaustive classifications."
  },
  "canceled_slots.unaffected": {
    "id": "canceled_slots.unaffected",
    "name": "Canceled slots filled",
    "definition": "Unaffected members of the same population: Canceled slots filled.",
    "unit": "Slots",
    "types": [
      "COUNT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent",
    "populationCondition": "Match the counting unit, measurement period and reporting cutoff. A complete breakdown requires mutually exclusive and exhaustive classifications."
  },
  "canceled_slots.affected_rate": {
    "id": "canceled_slots.affected_rate",
    "name": "Unused slot rate",
    "definition": "Percentage of the compatible total population represented by Empty slots after cancellations.",
    "unit": "%",
    "types": [
      "PCT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent",
    "populationCondition": "Match the counting unit, measurement period and reporting cutoff. A complete breakdown requires mutually exclusive and exhaustive classifications."
  },
  "canceled_slots.unaffected_rate": {
    "id": "canceled_slots.unaffected_rate",
    "name": "Filled slot rate",
    "definition": "Percentage of the compatible total population represented by Canceled slots filled.",
    "unit": "%",
    "types": [
      "PCT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent",
    "populationCondition": "Match the counting unit, measurement period and reporting cutoff. A complete breakdown requires mutually exclusive and exhaustive classifications."
  },
  "routine_questions.total": {
    "id": "routine_questions.total",
    "name": "Questions received",
    "definition": "Entire defined population: Questions received.",
    "unit": "Questions",
    "types": [
      "COUNT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent",
    "populationCondition": "Match the counting unit, measurement period and reporting cutoff. A complete breakdown requires mutually exclusive and exhaustive classifications."
  },
  "routine_questions.affected": {
    "id": "routine_questions.affected",
    "name": "Routine questions",
    "definition": "Affected members of the defined routine questions population: Routine questions.",
    "unit": "Questions",
    "types": [
      "COUNT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent",
    "populationCondition": "Match the counting unit, measurement period and reporting cutoff. A complete breakdown requires mutually exclusive and exhaustive classifications."
  },
  "routine_questions.unaffected": {
    "id": "routine_questions.unaffected",
    "name": "Other questions",
    "definition": "Unaffected members of the same population: Other questions.",
    "unit": "Questions",
    "types": [
      "COUNT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent",
    "populationCondition": "Match the counting unit, measurement period and reporting cutoff. A complete breakdown requires mutually exclusive and exhaustive classifications."
  },
  "routine_questions.affected_rate": {
    "id": "routine_questions.affected_rate",
    "name": "Routine question rate",
    "definition": "Percentage of the compatible total population represented by Routine questions.",
    "unit": "%",
    "types": [
      "PCT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent",
    "populationCondition": "Match the counting unit, measurement period and reporting cutoff. A complete breakdown requires mutually exclusive and exhaustive classifications."
  },
  "routine_questions.unaffected_rate": {
    "id": "routine_questions.unaffected_rate",
    "name": "Other question rate",
    "definition": "Percentage of the compatible total population represented by Other questions.",
    "unit": "%",
    "types": [
      "PCT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent",
    "populationCondition": "Match the counting unit, measurement period and reporting cutoff. A complete breakdown requires mutually exclusive and exhaustive classifications."
  },
  "simple_question_responses.total": {
    "id": "simple_question_responses.total",
    "name": "Simple questions received",
    "definition": "Entire defined population: Simple questions received.",
    "unit": "Questions",
    "types": [
      "COUNT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent",
    "populationCondition": "Match the counting unit, measurement period and reporting cutoff. A complete breakdown requires mutually exclusive and exhaustive classifications."
  },
  "simple_question_responses.affected": {
    "id": "simple_question_responses.affected",
    "name": "Simple questions answered slowly",
    "definition": "Affected members of the defined simple question responses population: Simple questions answered slowly.",
    "unit": "Questions",
    "types": [
      "COUNT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent",
    "populationCondition": "Match the counting unit, measurement period and reporting cutoff. A complete breakdown requires mutually exclusive and exhaustive classifications."
  },
  "simple_question_responses.unaffected": {
    "id": "simple_question_responses.unaffected",
    "name": "Simple questions answered promptly",
    "definition": "Unaffected members of the same population: Simple questions answered promptly.",
    "unit": "Questions",
    "types": [
      "COUNT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent",
    "populationCondition": "Match the counting unit, measurement period and reporting cutoff. A complete breakdown requires mutually exclusive and exhaustive classifications."
  },
  "simple_question_responses.affected_rate": {
    "id": "simple_question_responses.affected_rate",
    "name": "Slow answer rate",
    "definition": "Percentage of the compatible total population represented by Simple questions answered slowly.",
    "unit": "%",
    "types": [
      "PCT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent",
    "populationCondition": "Match the counting unit, measurement period and reporting cutoff. A complete breakdown requires mutually exclusive and exhaustive classifications."
  },
  "simple_question_responses.unaffected_rate": {
    "id": "simple_question_responses.unaffected_rate",
    "name": "Prompt answer rate",
    "definition": "Percentage of the compatible total population represented by Simple questions answered promptly.",
    "unit": "%",
    "types": [
      "PCT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent",
    "populationCondition": "Match the counting unit, measurement period and reporting cutoff. A complete breakdown requires mutually exclusive and exhaustive classifications."
  },
  "repeated_questions.total": {
    "id": "repeated_questions.total",
    "name": "Questions answered by employees",
    "definition": "Entire defined population: Questions answered by employees.",
    "unit": "Questions",
    "types": [
      "COUNT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent",
    "populationCondition": "Match the counting unit, measurement period and reporting cutoff. A complete breakdown requires mutually exclusive and exhaustive classifications."
  },
  "repeated_questions.affected": {
    "id": "repeated_questions.affected",
    "name": "Repeated questions answered by employees",
    "definition": "Affected members of the defined repeated questions population: Repeated questions answered by employees.",
    "unit": "Questions",
    "types": [
      "COUNT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent",
    "populationCondition": "Match the counting unit, measurement period and reporting cutoff. A complete breakdown requires mutually exclusive and exhaustive classifications."
  },
  "repeated_questions.unaffected": {
    "id": "repeated_questions.unaffected",
    "name": "Other questions answered by employees",
    "definition": "Unaffected members of the same population: Other questions answered by employees.",
    "unit": "Questions",
    "types": [
      "COUNT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent",
    "populationCondition": "Match the counting unit, measurement period and reporting cutoff. A complete breakdown requires mutually exclusive and exhaustive classifications."
  },
  "repeated_questions.affected_rate": {
    "id": "repeated_questions.affected_rate",
    "name": "Repeated question rate",
    "definition": "Percentage of the compatible total population represented by Repeated questions answered by employees.",
    "unit": "%",
    "types": [
      "PCT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent",
    "populationCondition": "Match the counting unit, measurement period and reporting cutoff. A complete breakdown requires mutually exclusive and exhaustive classifications."
  },
  "repeated_questions.unaffected_rate": {
    "id": "repeated_questions.unaffected_rate",
    "name": "Other question rate",
    "definition": "Percentage of the compatible total population represented by Other questions answered by employees.",
    "unit": "%",
    "types": [
      "PCT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent",
    "populationCondition": "Match the counting unit, measurement period and reporting cutoff. A complete breakdown requires mutually exclusive and exhaustive classifications."
  },
  "manual_tasks.total": {
    "id": "manual_tasks.total",
    "name": "Total tasks",
    "definition": "Entire defined population: Total tasks.",
    "unit": "Tasks",
    "types": [
      "COUNT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent",
    "populationCondition": "Match the counting unit, measurement period and reporting cutoff. A complete breakdown requires mutually exclusive and exhaustive classifications."
  },
  "manual_tasks.affected": {
    "id": "manual_tasks.affected",
    "name": "Tasks completed manually",
    "definition": "Affected members of the defined manual tasks population: Tasks completed manually.",
    "unit": "Tasks",
    "types": [
      "COUNT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent",
    "populationCondition": "Match the counting unit, measurement period and reporting cutoff. A complete breakdown requires mutually exclusive and exhaustive classifications."
  },
  "manual_tasks.unaffected": {
    "id": "manual_tasks.unaffected",
    "name": "Tasks not completed manually",
    "definition": "Unaffected members of the same population: Tasks not completed manually.",
    "unit": "Tasks",
    "types": [
      "COUNT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent",
    "populationCondition": "Match the counting unit, measurement period and reporting cutoff. A complete breakdown requires mutually exclusive and exhaustive classifications."
  },
  "manual_tasks.affected_rate": {
    "id": "manual_tasks.affected_rate",
    "name": "Manual task rate",
    "definition": "Percentage of the compatible total population represented by Tasks completed manually.",
    "unit": "%",
    "types": [
      "PCT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent",
    "populationCondition": "Match the counting unit, measurement period and reporting cutoff. A complete breakdown requires mutually exclusive and exhaustive classifications."
  },
  "manual_tasks.unaffected_rate": {
    "id": "manual_tasks.unaffected_rate",
    "name": "Non-manual task rate",
    "definition": "Percentage of the compatible total population represented by Tasks not completed manually.",
    "unit": "%",
    "types": [
      "PCT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent",
    "populationCondition": "Match the counting unit, measurement period and reporting cutoff. A complete breakdown requires mutually exclusive and exhaustive classifications."
  },
  "buyer_requests.total": {
    "id": "buyer_requests.total",
    "name": "Basic buyer requests",
    "definition": "Entire defined population: Basic buyer requests.",
    "unit": "Requests",
    "types": [
      "COUNT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "productOrService",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent",
    "populationCondition": "Match the counting unit, measurement period and reporting cutoff. A complete breakdown requires mutually exclusive and exhaustive classifications."
  },
  "buyer_requests.affected": {
    "id": "buyer_requests.affected",
    "name": "Basic buyer requests not handled",
    "definition": "Affected members of the defined buyer requests population: Basic buyer requests not handled.",
    "unit": "Requests",
    "types": [
      "COUNT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "productOrService",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent",
    "populationCondition": "Match the counting unit, measurement period and reporting cutoff. A complete breakdown requires mutually exclusive and exhaustive classifications."
  },
  "buyer_requests.unaffected": {
    "id": "buyer_requests.unaffected",
    "name": "Basic buyer requests handled",
    "definition": "Unaffected members of the same population: Basic buyer requests handled.",
    "unit": "Requests",
    "types": [
      "COUNT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "productOrService",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent",
    "populationCondition": "Match the counting unit, measurement period and reporting cutoff. A complete breakdown requires mutually exclusive and exhaustive classifications."
  },
  "buyer_requests.affected_rate": {
    "id": "buyer_requests.affected_rate",
    "name": "Unhandled request rate",
    "definition": "Percentage of the compatible total population represented by Basic buyer requests not handled.",
    "unit": "%",
    "types": [
      "PCT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "productOrService",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent",
    "populationCondition": "Match the counting unit, measurement period and reporting cutoff. A complete breakdown requires mutually exclusive and exhaustive classifications."
  },
  "buyer_requests.unaffected_rate": {
    "id": "buyer_requests.unaffected_rate",
    "name": "Handled request rate",
    "definition": "Percentage of the compatible total population represented by Basic buyer requests handled.",
    "unit": "%",
    "types": [
      "PCT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "productOrService",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent",
    "populationCondition": "Match the counting unit, measurement period and reporting cutoff. A complete breakdown requires mutually exclusive and exhaustive classifications."
  },
  "payment_reminders.total": {
    "id": "payment_reminders.total",
    "name": "Payments requiring reminders",
    "definition": "Entire defined population: Payments requiring reminders.",
    "unit": "Payments or reminder events, subject to compatible definitions",
    "types": [
      "COUNT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent",
    "populationCondition": "Match the counting unit, measurement period and reporting cutoff. A complete breakdown requires mutually exclusive and exhaustive classifications."
  },
  "payment_reminders.affected": {
    "id": "payment_reminders.affected",
    "name": "Missed payment reminders",
    "definition": "Affected members of the defined payment reminders population: Missed payment reminders.",
    "unit": "Payments or reminder events, subject to compatible definitions",
    "types": [
      "COUNT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent",
    "populationCondition": "Match the counting unit, measurement period and reporting cutoff. A complete breakdown requires mutually exclusive and exhaustive classifications."
  },
  "payment_reminders.unaffected": {
    "id": "payment_reminders.unaffected",
    "name": "Payment reminders sent",
    "definition": "Unaffected members of the same population: Payment reminders sent.",
    "unit": "Payments or reminder events, subject to compatible definitions",
    "types": [
      "COUNT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent",
    "populationCondition": "Match the counting unit, measurement period and reporting cutoff. A complete breakdown requires mutually exclusive and exhaustive classifications."
  },
  "payment_reminders.affected_rate": {
    "id": "payment_reminders.affected_rate",
    "name": "Missed payment reminder rate",
    "definition": "Percentage of the compatible total population represented by Missed payment reminders.",
    "unit": "%",
    "types": [
      "PCT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent",
    "populationCondition": "Match the counting unit, measurement period and reporting cutoff. A complete breakdown requires mutually exclusive and exhaustive classifications."
  },
  "payment_reminders.unaffected_rate": {
    "id": "payment_reminders.unaffected_rate",
    "name": "Sent payment reminder rate",
    "definition": "Percentage of the compatible total population represented by Payment reminders sent.",
    "unit": "%",
    "types": [
      "PCT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent",
    "populationCondition": "Match the counting unit, measurement period and reporting cutoff. A complete breakdown requires mutually exclusive and exhaustive classifications."
  },
  "invoice_followups.total": {
    "id": "invoice_followups.total",
    "name": "Invoices requiring follow-up",
    "definition": "Entire defined population: Invoices requiring follow-up.",
    "unit": "Invoices",
    "types": [
      "COUNT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent",
    "populationCondition": "Match the counting unit, measurement period and reporting cutoff. A complete breakdown requires mutually exclusive and exhaustive classifications."
  },
  "invoice_followups.affected": {
    "id": "invoice_followups.affected",
    "name": "Invoices not followed up regularly",
    "definition": "Affected members of the defined invoice followups population: Invoices not followed up regularly.",
    "unit": "Invoices",
    "types": [
      "COUNT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent",
    "populationCondition": "Match the counting unit, measurement period and reporting cutoff. A complete breakdown requires mutually exclusive and exhaustive classifications."
  },
  "invoice_followups.unaffected": {
    "id": "invoice_followups.unaffected",
    "name": "Invoices followed up regularly",
    "definition": "Unaffected members of the same population: Invoices followed up regularly.",
    "unit": "Invoices",
    "types": [
      "COUNT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent",
    "populationCondition": "Match the counting unit, measurement period and reporting cutoff. A complete breakdown requires mutually exclusive and exhaustive classifications."
  },
  "invoice_followups.affected_rate": {
    "id": "invoice_followups.affected_rate",
    "name": "Inconsistent invoice follow-up rate",
    "definition": "Percentage of the compatible total population represented by Invoices not followed up regularly.",
    "unit": "%",
    "types": [
      "PCT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent",
    "populationCondition": "Match the counting unit, measurement period and reporting cutoff. A complete breakdown requires mutually exclusive and exhaustive classifications."
  },
  "invoice_followups.unaffected_rate": {
    "id": "invoice_followups.unaffected_rate",
    "name": "Regular invoice follow-up rate",
    "definition": "Percentage of the compatible total population represented by Invoices followed up regularly.",
    "unit": "%",
    "types": [
      "PCT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent",
    "populationCondition": "Match the counting unit, measurement period and reporting cutoff. A complete breakdown requires mutually exclusive and exhaustive classifications."
  },
  "review_requests.total": {
    "id": "review_requests.total",
    "name": "Buyers eligible for review requests",
    "definition": "Entire defined population: Buyers eligible for review requests.",
    "unit": "Buyers",
    "types": [
      "COUNT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent",
    "populationCondition": "Match the counting unit, measurement period and reporting cutoff. A complete breakdown requires mutually exclusive and exhaustive classifications."
  },
  "review_requests.affected": {
    "id": "review_requests.affected",
    "name": "Buyers not asked for reviews",
    "definition": "Affected members of the defined review requests population: Buyers not asked for reviews.",
    "unit": "Buyers",
    "types": [
      "COUNT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent",
    "populationCondition": "Match the counting unit, measurement period and reporting cutoff. A complete breakdown requires mutually exclusive and exhaustive classifications."
  },
  "review_requests.unaffected": {
    "id": "review_requests.unaffected",
    "name": "Buyers asked for reviews",
    "definition": "Unaffected members of the same population: Buyers asked for reviews.",
    "unit": "Buyers",
    "types": [
      "COUNT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent",
    "populationCondition": "Match the counting unit, measurement period and reporting cutoff. A complete breakdown requires mutually exclusive and exhaustive classifications."
  },
  "review_requests.affected_rate": {
    "id": "review_requests.affected_rate",
    "name": "Missed review request rate",
    "definition": "Percentage of the compatible total population represented by Buyers not asked for reviews.",
    "unit": "%",
    "types": [
      "PCT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent",
    "populationCondition": "Match the counting unit, measurement period and reporting cutoff. A complete breakdown requires mutually exclusive and exhaustive classifications."
  },
  "review_requests.unaffected_rate": {
    "id": "review_requests.unaffected_rate",
    "name": "Review request rate",
    "definition": "Percentage of the compatible total population represented by Buyers asked for reviews.",
    "unit": "%",
    "types": [
      "PCT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent",
    "populationCondition": "Match the counting unit, measurement period and reporting cutoff. A complete breakdown requires mutually exclusive and exhaustive classifications."
  },
  "call_records.total": {
    "id": "call_records.total",
    "name": "Calls requiring recordings and outcomes",
    "definition": "Entire defined population: Calls requiring recordings and outcomes.",
    "unit": "Calls",
    "types": [
      "COUNT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent",
    "populationCondition": "Match the counting unit, measurement period and reporting cutoff. A complete breakdown requires mutually exclusive and exhaustive classifications."
  },
  "call_records.affected": {
    "id": "call_records.affected",
    "name": "Calls with missing recordings or outcomes",
    "definition": "Affected members of the defined call records population: Calls with missing recordings or outcomes.",
    "unit": "Calls",
    "types": [
      "COUNT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent",
    "populationCondition": "Match the counting unit, measurement period and reporting cutoff. A complete breakdown requires mutually exclusive and exhaustive classifications."
  },
  "call_records.unaffected": {
    "id": "call_records.unaffected",
    "name": "Calls with recordings and outcomes",
    "definition": "Unaffected members of the same population: Calls with recordings and outcomes.",
    "unit": "Calls",
    "types": [
      "COUNT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent",
    "populationCondition": "Match the counting unit, measurement period and reporting cutoff. A complete breakdown requires mutually exclusive and exhaustive classifications."
  },
  "call_records.affected_rate": {
    "id": "call_records.affected_rate",
    "name": "Missing record rate",
    "definition": "Percentage of the compatible total population represented by Calls with missing recordings or outcomes.",
    "unit": "%",
    "types": [
      "PCT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent",
    "populationCondition": "Match the counting unit, measurement period and reporting cutoff. A complete breakdown requires mutually exclusive and exhaustive classifications."
  },
  "call_records.unaffected_rate": {
    "id": "call_records.unaffected_rate",
    "name": "Complete record rate",
    "definition": "Percentage of the compatible total population represented by Calls with recordings and outcomes.",
    "unit": "%",
    "types": [
      "PCT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent",
    "populationCondition": "Match the counting unit, measurement period and reporting cutoff. A complete breakdown requires mutually exclusive and exhaustive classifications."
  },
  "crm_lead_records.total": {
    "id": "crm_lead_records.total",
    "name": "Lead records requiring CRM updates",
    "definition": "Entire defined population: Lead records requiring CRM updates.",
    "unit": "Lead records",
    "types": [
      "COUNT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent",
    "populationCondition": "Match the counting unit, measurement period and reporting cutoff. A complete breakdown requires mutually exclusive and exhaustive classifications."
  },
  "crm_lead_records.affected": {
    "id": "crm_lead_records.affected",
    "name": "Lead details not updated in CRM",
    "definition": "Affected members of the defined crm lead records population: Lead details not updated in CRM.",
    "unit": "Lead records",
    "types": [
      "COUNT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent",
    "populationCondition": "Match the counting unit, measurement period and reporting cutoff. A complete breakdown requires mutually exclusive and exhaustive classifications."
  },
  "crm_lead_records.unaffected": {
    "id": "crm_lead_records.unaffected",
    "name": "Lead details updated in CRM",
    "definition": "Unaffected members of the same population: Lead details updated in CRM.",
    "unit": "Lead records",
    "types": [
      "COUNT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent",
    "populationCondition": "Match the counting unit, measurement period and reporting cutoff. A complete breakdown requires mutually exclusive and exhaustive classifications."
  },
  "crm_lead_records.affected_rate": {
    "id": "crm_lead_records.affected_rate",
    "name": "Missing update rate",
    "definition": "Percentage of the compatible total population represented by Lead details not updated in CRM.",
    "unit": "%",
    "types": [
      "PCT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent",
    "populationCondition": "Match the counting unit, measurement period and reporting cutoff. A complete breakdown requires mutually exclusive and exhaustive classifications."
  },
  "crm_lead_records.unaffected_rate": {
    "id": "crm_lead_records.unaffected_rate",
    "name": "Completed update rate",
    "definition": "Percentage of the compatible total population represented by Lead details updated in CRM.",
    "unit": "%",
    "types": [
      "PCT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent",
    "populationCondition": "Match the counting unit, measurement period and reporting cutoff. A complete breakdown requires mutually exclusive and exhaustive classifications."
  },
  "agent_visibility.total": {
    "id": "agent_visibility.total",
    "name": "Agent activities requiring visibility",
    "definition": "Entire defined population: Agent activities requiring visibility.",
    "unit": "Activities",
    "types": [
      "COUNT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent",
    "populationCondition": "Match the counting unit, measurement period and reporting cutoff. A complete breakdown requires mutually exclusive and exhaustive classifications."
  },
  "agent_visibility.affected": {
    "id": "agent_visibility.affected",
    "name": "Agent activities not visible",
    "definition": "Affected members of the defined agent visibility population: Agent activities not visible.",
    "unit": "Activities",
    "types": [
      "COUNT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent",
    "populationCondition": "Match the counting unit, measurement period and reporting cutoff. A complete breakdown requires mutually exclusive and exhaustive classifications."
  },
  "agent_visibility.unaffected": {
    "id": "agent_visibility.unaffected",
    "name": "Agent activities visible",
    "definition": "Unaffected members of the same population: Agent activities visible.",
    "unit": "Activities",
    "types": [
      "COUNT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent",
    "populationCondition": "Match the counting unit, measurement period and reporting cutoff. A complete breakdown requires mutually exclusive and exhaustive classifications."
  },
  "agent_visibility.affected_rate": {
    "id": "agent_visibility.affected_rate",
    "name": "Missing activity rate",
    "definition": "Percentage of the compatible total population represented by Agent activities not visible.",
    "unit": "%",
    "types": [
      "PCT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent",
    "populationCondition": "Match the counting unit, measurement period and reporting cutoff. A complete breakdown requires mutually exclusive and exhaustive classifications."
  },
  "agent_visibility.unaffected_rate": {
    "id": "agent_visibility.unaffected_rate",
    "name": "Visible activity rate",
    "definition": "Percentage of the compatible total population represented by Agent activities visible.",
    "unit": "%",
    "types": [
      "PCT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent",
    "populationCondition": "Match the counting unit, measurement period and reporting cutoff. A complete breakdown requires mutually exclusive and exhaustive classifications."
  },
  "overloaded_tasks.total": {
    "id": "overloaded_tasks.total",
    "name": "Total tasks",
    "definition": "Entire defined population: Total tasks.",
    "unit": "Tasks",
    "types": [
      "COUNT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent",
    "populationCondition": "Match the counting unit, measurement period and reporting cutoff. A complete breakdown requires mutually exclusive and exhaustive classifications."
  },
  "overloaded_tasks.affected": {
    "id": "overloaded_tasks.affected",
    "name": "Tasks affected by employee overload",
    "definition": "Affected members of the defined overloaded tasks population: Tasks affected by employee overload.",
    "unit": "Tasks",
    "types": [
      "COUNT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent",
    "populationCondition": "Match the counting unit, measurement period and reporting cutoff. A complete breakdown requires mutually exclusive and exhaustive classifications."
  },
  "overloaded_tasks.unaffected": {
    "id": "overloaded_tasks.unaffected",
    "name": "Tasks not affected by employee overload",
    "definition": "Unaffected members of the same population: Tasks not affected by employee overload.",
    "unit": "Tasks",
    "types": [
      "COUNT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent",
    "populationCondition": "Match the counting unit, measurement period and reporting cutoff. A complete breakdown requires mutually exclusive and exhaustive classifications."
  },
  "overloaded_tasks.affected_rate": {
    "id": "overloaded_tasks.affected_rate",
    "name": "Affected task rate",
    "definition": "Percentage of the compatible total population represented by Tasks affected by employee overload.",
    "unit": "%",
    "types": [
      "PCT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent",
    "populationCondition": "Match the counting unit, measurement period and reporting cutoff. A complete breakdown requires mutually exclusive and exhaustive classifications."
  },
  "overloaded_tasks.unaffected_rate": {
    "id": "overloaded_tasks.unaffected_rate",
    "name": "Unaffected task rate",
    "definition": "Percentage of the compatible total population represented by Tasks not affected by employee overload.",
    "unit": "%",
    "types": [
      "PCT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent",
    "populationCondition": "Match the counting unit, measurement period and reporting cutoff. A complete breakdown requires mutually exclusive and exhaustive classifications."
  },
  "tasks.total": {
    "id": "tasks.total",
    "name": "Total tasks",
    "definition": "Entire defined task population during the relevant period.",
    "unit": "Tasks",
    "types": [
      "COUNT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "problem_duration": {
    "id": "problem_duration",
    "name": "Duration of the problem",
    "definition": "How long the problem has existed",
    "unit": "Months",
    "types": [
      "MONTHS"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "measurement_period": {
    "id": "measurement_period",
    "name": "Measurement period",
    "definition": "Period covered by the relevant measured numerical information",
    "unit": "Days",
    "types": [
      "DAYS"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "affected_daily_rate": {
    "id": "affected_daily_rate",
    "name": "Affected quantity per day",
    "definition": "Average affected quantity per measured day",
    "unit": "Applicable units/day",
    "types": [
      "RATE"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "recorded_units": {
    "id": "recorded_units",
    "name": "Units with recorded duration",
    "definition": "Entities included in the duration measurement",
    "unit": "Context-dependent count",
    "types": [
      "COUNT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "recorded_duration": {
    "id": "recorded_duration",
    "name": "Total recorded duration",
    "definition": "Total measured duration for those recorded units",
    "unit": "Hours",
    "types": [
      "HOURS"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "average_response_time": {
    "id": "average_response_time",
    "name": "Average response time",
    "definition": "Mean duration of the applicable response activity",
    "unit": "Minutes",
    "types": [
      "MINUTES"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "average_qualification_time": {
    "id": "average_qualification_time",
    "name": "Average qualification time",
    "definition": "Mean duration of the applicable qualification activity",
    "unit": "Minutes",
    "types": [
      "MINUTES"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "affected_duration": {
    "id": "affected_duration",
    "name": "Total time for affected quantity",
    "definition": "Total relevant time for the affected population",
    "unit": "Hours",
    "types": [
      "HOURS"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "average_rescheduling_time": {
    "id": "average_rescheduling_time",
    "name": "Average rescheduling time",
    "definition": "Mean duration per applicable rescheduling activity",
    "unit": "Minutes",
    "types": [
      "MINUTES"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "average_routine_question_time": {
    "id": "average_routine_question_time",
    "name": "Average time per routine question",
    "definition": "Mean duration per applicable routine question",
    "unit": "Minutes",
    "types": [
      "MINUTES"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "average_repeated_question_time": {
    "id": "average_repeated_question_time",
    "name": "Average time per repeated question",
    "definition": "Mean duration per applicable repeated question",
    "unit": "Minutes",
    "types": [
      "MINUTES"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "average_manual_task_time": {
    "id": "average_manual_task_time",
    "name": "Average time per manual task",
    "definition": "Mean duration per applicable manual task",
    "unit": "Minutes",
    "types": [
      "MINUTES"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "target_response_time": {
    "id": "target_response_time",
    "name": "Target response time",
    "definition": "Desired average response duration",
    "unit": "Minutes",
    "types": [
      "MINUTES"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "target_qualification_time": {
    "id": "target_qualification_time",
    "name": "Target qualification time",
    "definition": "Desired average qualification duration",
    "unit": "Minutes",
    "types": [
      "MINUTES"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "target_value": {
    "id": "target_value",
    "name": "Applicable target value",
    "definition": "Nonnegative target for the actual comparison measurement, using the identical counting or duration unit and scope.",
    "unit": "Context-dependent target unit",
    "types": [
      "COUNT",
      "EST_COUNT",
      "MINUTES",
      "HOURS",
      "MONEY",
      "RATE",
      "RATIO"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "currency",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "actual_target_difference": {
    "id": "actual_target_difference",
    "name": "Difference",
    "definition": "Actual value minus the corresponding target",
    "unit": "Context-dependent",
    "types": [
      "DIFF"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "percentage_of_target": {
    "id": "percentage_of_target",
    "name": "Percentage of target",
    "definition": "Actual value relative to the corresponding target",
    "unit": "%",
    "types": [
      "TARGET_PCT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "payments_without_reminders_amount": {
    "id": "payments_without_reminders_amount",
    "name": "Total amount of payments without reminders",
    "definition": "Relevant monetary amount associated with affected payments",
    "unit": "Currency",
    "types": [
      "MONEY"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "currency",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "average_payment_amount": {
    "id": "average_payment_amount",
    "name": "Average payment amount",
    "definition": "Average monetary amount per applicable payment",
    "unit": "Currency/payment",
    "types": [
      "AVG_MONEY"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "currency",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "affected_invoices_amount": {
    "id": "affected_invoices_amount",
    "name": "Total amount of affected invoices",
    "definition": "Total relevant amount of the affected invoices",
    "unit": "Currency",
    "types": [
      "MONEY"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "currency",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "average_invoice_amount": {
    "id": "average_invoice_amount",
    "name": "Average amount per invoice",
    "definition": "Average amount per applicable invoice",
    "unit": "Currency/invoice",
    "types": [
      "AVG_MONEY"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "currency",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "required_staff_hours": {
    "id": "required_staff_hours",
    "name": "Required staff hours",
    "definition": "Staff hours required for relevant work",
    "unit": "Hours",
    "types": [
      "HOURS"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "available_staff_hours": {
    "id": "available_staff_hours",
    "name": "Available staff hours",
    "definition": "Staff hours available for the same relevant work",
    "unit": "Hours",
    "types": [
      "HOURS"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "unique_affected_leads": {
    "id": "unique_affected_leads",
    "name": "Unique affected leads",
    "definition": "Distinct leads affected by the problem",
    "unit": "Leads",
    "types": [
      "COUNT",
      "EST_COUNT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "recovered_leads": {
    "id": "recovered_leads",
    "name": "Recovered leads",
    "definition": "Affected leads subsequently recovered",
    "unit": "Leads",
    "types": [
      "COUNT",
      "EST_COUNT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "pending_leads": {
    "id": "pending_leads",
    "name": "Pending leads",
    "definition": "Affected leads not yet recovered or classified as lost",
    "unit": "Leads",
    "types": [
      "COUNT",
      "EST_COUNT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "lost_leads": {
    "id": "lost_leads",
    "name": "Lost leads",
    "definition": "Affected leads classified as lost",
    "unit": "Leads",
    "types": [
      "COUNT",
      "EST_COUNT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "lead_loss_rate": {
    "id": "lead_loss_rate",
    "name": "Lead loss rate",
    "definition": "Share of the affected lead population classified as lost",
    "unit": "%",
    "types": [
      "PCT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "affected_qualified_leads": {
    "id": "affected_qualified_leads",
    "name": "Affected qualified leads",
    "definition": "Relevant qualified lead population affected by the problem",
    "unit": "Leads",
    "types": [
      "COUNT",
      "EST_COUNT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "recovered_qualified_leads": {
    "id": "recovered_qualified_leads",
    "name": "Recovered qualified leads",
    "definition": "Affected qualified leads subsequently recovered",
    "unit": "Leads",
    "types": [
      "COUNT",
      "EST_COUNT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "pending_qualified_leads": {
    "id": "pending_qualified_leads",
    "name": "Pending qualified leads",
    "definition": "Affected qualified leads awaiting classification",
    "unit": "Leads",
    "types": [
      "COUNT",
      "EST_COUNT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "lost_qualified_leads": {
    "id": "lost_qualified_leads",
    "name": "Lost qualified leads",
    "definition": "Affected qualified leads classified as lost",
    "unit": "Leads",
    "types": [
      "COUNT",
      "EST_COUNT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "qualified_lead_loss_rate": {
    "id": "qualified_lead_loss_rate",
    "name": "Qualified lead loss rate",
    "definition": "Share of affected qualified leads classified as lost",
    "unit": "%",
    "types": [
      "PCT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "affected_old_leads": {
    "id": "affected_old_leads",
    "name": "Affected old leads",
    "definition": "Old leads affected by the relevant problem",
    "unit": "Leads",
    "types": [
      "COUNT",
      "EST_COUNT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "reactivation_rate": {
    "id": "reactivation_rate",
    "name": "Applicable attributable reactivation rate",
    "definition": "Applicable share expected or established to reactivate",
    "unit": "%",
    "types": [
      "PCT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "potential_reactivations_lost": {
    "id": "potential_reactivations_lost",
    "name": "Potential reactivations lost",
    "definition": "Estimated reactivations forgone because of the problem",
    "unit": "Leads",
    "types": [
      "EST_COUNT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "estimated"
  },
  "intended_bookings": {
    "id": "intended_bookings",
    "name": "Intended bookings",
    "definition": "Relevant booking opportunities affected by the problem",
    "unit": "Bookings",
    "types": [
      "COUNT",
      "EST_COUNT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "recovered_bookings": {
    "id": "recovered_bookings",
    "name": "Recovered bookings",
    "definition": "Affected bookings subsequently recovered",
    "unit": "Bookings",
    "types": [
      "COUNT",
      "EST_COUNT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "pending_bookings": {
    "id": "pending_bookings",
    "name": "Pending bookings",
    "definition": "Affected bookings awaiting an outcome",
    "unit": "Bookings",
    "types": [
      "COUNT",
      "EST_COUNT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "lost_bookings": {
    "id": "lost_bookings",
    "name": "Lost bookings",
    "definition": "Affected bookings classified as lost",
    "unit": "Bookings",
    "types": [
      "COUNT",
      "EST_COUNT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "booking_loss_rate": {
    "id": "booking_loss_rate",
    "name": "Booking loss rate",
    "definition": "Share of intended bookings classified as lost",
    "unit": "%",
    "types": [
      "PCT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "affected_appointments": {
    "id": "affected_appointments",
    "name": "Affected appointments",
    "definition": "Distinct appointment occurrences affected by the problem",
    "unit": "Appointments",
    "types": [
      "COUNT",
      "EST_COUNT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "attendance_loss_rate": {
    "id": "attendance_loss_rate",
    "name": "Attendance loss rate",
    "definition": "Share of affected appointments whose attendance was lost because of the problem",
    "unit": "%",
    "types": [
      "PCT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "lost_attendance": {
    "id": "lost_attendance",
    "name": "Lost attendance",
    "definition": "Relevant appointment attendance lost because of the problem",
    "unit": "Appointments",
    "types": [
      "COUNT",
      "EST_COUNT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "available_affected_slots": {
    "id": "available_affected_slots",
    "name": "Available affected slots",
    "definition": "Relevant slots available to be filled",
    "unit": "Slots",
    "types": [
      "COUNT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "filled_affected_slots": {
    "id": "filled_affected_slots",
    "name": "Filled affected slots",
    "definition": "Relevant slots that were subsequently filled",
    "unit": "Slots",
    "types": [
      "COUNT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "unused_appointment_slots": {
    "id": "unused_appointment_slots",
    "name": "Unused appointment slots",
    "definition": "Relevant slots remaining unused",
    "unit": "Slots",
    "types": [
      "COUNT",
      "EST_COUNT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "affected_buyers": {
    "id": "affected_buyers",
    "name": "Affected buyers",
    "definition": "Distinct buyers affected by the relevant problem",
    "unit": "Buyers",
    "types": [
      "COUNT",
      "EST_COUNT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "productOrService",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "subsequently_served_buyers": {
    "id": "subsequently_served_buyers",
    "name": "Buyers subsequently served",
    "definition": "Affected buyers subsequently served",
    "unit": "Buyers",
    "types": [
      "COUNT",
      "EST_COUNT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "productOrService",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "unserved_buyers": {
    "id": "unserved_buyers",
    "name": "Unserved buyers",
    "definition": "Affected buyers remaining unserved at the reporting cutoff",
    "unit": "Buyers",
    "types": [
      "COUNT",
      "EST_COUNT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "productOrService",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "affected_existing_buyers": {
    "id": "affected_existing_buyers",
    "name": "Affected existing buyers",
    "definition": "Existing buyers affected by the problem",
    "unit": "Buyers",
    "types": [
      "COUNT",
      "EST_COUNT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "productOrService",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "existing_buyer_loss_rate": {
    "id": "existing_buyer_loss_rate",
    "name": "Attributable existing buyer loss rate",
    "definition": "Share of affected existing buyers lost because of the problem",
    "unit": "%",
    "types": [
      "PCT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "productOrService",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "lost_existing_buyers": {
    "id": "lost_existing_buyers",
    "name": "Lost existing buyers",
    "definition": "Existing buyers lost because of the problem",
    "unit": "Buyers",
    "types": [
      "COUNT",
      "EST_COUNT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "productOrService",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "review_exposed_potential_buyers": {
    "id": "review_exposed_potential_buyers",
    "name": "Potential buyers exposed to the review-related problem",
    "definition": "Relevant potential buyers exposed to the missing-review consequence",
    "unit": "Buyers",
    "types": [
      "COUNT",
      "EST_COUNT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "productOrService",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "attributable_buyer_loss_rate": {
    "id": "attributable_buyer_loss_rate",
    "name": "Attributable buyer loss rate",
    "definition": "Share of the specified buyer population lost because of the problem",
    "unit": "%",
    "types": [
      "PCT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "productOrService",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "potential_new_buyers_lost": {
    "id": "potential_new_buyers_lost",
    "name": "Potential new buyers lost",
    "definition": "Estimated new buyers not acquired because of the problem",
    "unit": "Buyers",
    "types": [
      "EST_COUNT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "productOrService",
      "evidenceClassification"
    ],
    "evidence": "estimated"
  },
  "lost_potential_buyers": {
    "id": "lost_potential_buyers",
    "name": "Lost potential buyers",
    "definition": "Expected buyers who otherwise would have purchased during the applicable period",
    "unit": "Buyers",
    "types": [
      "EST_COUNT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "productOrService",
      "evidenceClassification"
    ],
    "evidence": "estimated"
  },
  "necessary_time": {
    "id": "necessary_time",
    "name": "Necessary time",
    "definition": "Portion of the relevant time required for legitimate work",
    "unit": "Hours",
    "types": [
      "HOURS"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "avoidable_time_percentage": {
    "id": "avoidable_time_percentage",
    "name": "Avoidable time percentage",
    "definition": "Share of relevant time that could be avoided",
    "unit": "%",
    "types": [
      "PCT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "avoidable_time": {
    "id": "avoidable_time",
    "name": "Avoidable time",
    "definition": "Relevant time that could be avoided",
    "unit": "Hours",
    "types": [
      "HOURS"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "affected_tasks": {
    "id": "affected_tasks",
    "name": "Affected tasks",
    "definition": "Relevant tasks affected by the problem",
    "unit": "Tasks",
    "types": [
      "COUNT",
      "EST_COUNT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "completed_affected_tasks": {
    "id": "completed_affected_tasks",
    "name": "Completed affected tasks",
    "definition": "Affected tasks that were completed",
    "unit": "Tasks",
    "types": [
      "COUNT",
      "EST_COUNT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "incomplete_tasks": {
    "id": "incomplete_tasks",
    "name": "Incomplete tasks",
    "definition": "Relevant tasks remaining incomplete",
    "unit": "Tasks",
    "types": [
      "COUNT",
      "EST_COUNT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "staff_hour_shortfall": {
    "id": "staff_hour_shortfall",
    "name": "Staff hour shortfall",
    "definition": "Positive excess of required hours over available hours",
    "unit": "Hours",
    "types": [
      "HOURS"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "affected_invoices": {
    "id": "affected_invoices",
    "name": "Affected invoices",
    "definition": "Distinct invoices affected by the problem",
    "unit": "Invoices",
    "types": [
      "COUNT",
      "EST_COUNT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "invoice_loss_rate": {
    "id": "invoice_loss_rate",
    "name": "Invoice loss rate",
    "definition": "Share of affected invoices left additionally unpaid because of the problem",
    "unit": "%",
    "types": [
      "PCT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "additional_unpaid_invoices": {
    "id": "additional_unpaid_invoices",
    "name": "Additional unpaid invoices",
    "definition": "Additional invoices left unpaid because of the problem",
    "unit": "Invoices",
    "types": [
      "COUNT",
      "EST_COUNT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "additional_review_rate": {
    "id": "additional_review_rate",
    "name": "Additional review rate",
    "definition": "Applicable incremental share expected to provide an additional review",
    "unit": "%",
    "types": [
      "PCT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "potential_reviews_lost": {
    "id": "potential_reviews_lost",
    "name": "Potential reviews lost",
    "definition": "Expected reviews forgone because buyers were not asked for reviews",
    "unit": "Reviews",
    "types": [
      "EST_COUNT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "estimated"
  },
  "confirmed_purchases_lost": {
    "id": "confirmed_purchases_lost",
    "name": "Confirmed purchases lost",
    "definition": "Established lost purchases",
    "unit": "Purchases",
    "types": [
      "COUNT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "productOrService",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "average_revenue_per_purchase": {
    "id": "average_revenue_per_purchase",
    "name": "Average revenue per purchase",
    "definition": "Relevant revenue per purchase",
    "unit": "Currency/purchase",
    "types": [
      "AVG_MONEY"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "currency",
      "productOrService",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "confirmed_revenue_loss": {
    "id": "confirmed_revenue_loss",
    "name": "Confirmed revenue loss",
    "definition": "Revenue associated with established lost purchases",
    "unit": "Currency",
    "types": [
      "MONEY"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "currency",
      "productOrService",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "confirmed_purchase_revenue_before_loss": {
    "id": "confirmed_purchase_revenue_before_loss",
    "name": "Confirmed purchase revenue before the loss",
    "definition": "Applicable established purchase revenue before loss",
    "unit": "Currency",
    "types": [
      "MONEY"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "currency",
      "productOrService",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "retained_purchase_revenue": {
    "id": "retained_purchase_revenue",
    "name": "Retained purchase revenue",
    "definition": "Revenue retained from the same purchase population",
    "unit": "Currency",
    "types": [
      "MONEY"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "currency",
      "productOrService",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "total_revenue": {
    "id": "total_revenue",
    "name": "Total revenue",
    "definition": "Revenue for the defined population and period",
    "unit": "Currency",
    "types": [
      "MONEY"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "currency",
      "productOrService",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "total_purchases": {
    "id": "total_purchases",
    "name": "Total purchases",
    "definition": "Applicable purchase count",
    "unit": "Purchases",
    "types": [
      "COUNT",
      "EST_COUNT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "productOrService",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "total_buyers": {
    "id": "total_buyers",
    "name": "Total buyers",
    "definition": "Distinct buyers in the relevant population",
    "unit": "Buyers",
    "types": [
      "COUNT",
      "EST_COUNT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "productOrService",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "average_revenue_per_buyer": {
    "id": "average_revenue_per_buyer",
    "name": "Average revenue per buyer",
    "definition": "Relevant revenue per unique buyer",
    "unit": "Currency/buyer",
    "types": [
      "AVG_MONEY"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "currency",
      "productOrService",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "lost_potential_revenue": {
    "id": "lost_potential_revenue",
    "name": "Lost potential revenue",
    "definition": "Expected revenue forgone",
    "unit": "Currency",
    "types": [
      "MONEY"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "currency",
      "productOrService",
      "evidenceClassification"
    ],
    "evidence": "estimated"
  },
  "expected_future_revenue_per_lost_existing_buyer": {
    "id": "expected_future_revenue_per_lost_existing_buyer",
    "name": "Expected future revenue per lost existing buyer",
    "definition": "Expected revenue per existing buyer over the specified future period",
    "unit": "Currency/buyer",
    "types": [
      "AVG_MONEY"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "currency",
      "productOrService",
      "futurePeriod",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "future_revenue_period": {
    "id": "future_revenue_period",
    "name": "Relevant future measurement period",
    "definition": "Applicable period for future buyer revenue",
    "unit": "Months (or explicitly established compatible future period)",
    "types": [
      "MONTHS"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "productOrService",
      "futurePeriod",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "lead_to_buyer_rate": {
    "id": "lead_to_buyer_rate",
    "name": "Lead-to-buyer conversion rate",
    "definition": "Share of the applicable lost lead population expected or established to become buyers.",
    "unit": "%",
    "types": [
      "PCT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "productOrService",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "qualified_lead_to_buyer_rate": {
    "id": "qualified_lead_to_buyer_rate",
    "name": "Qualified lead-to-buyer conversion rate",
    "definition": "Share of the applicable lost qualified lead population expected or established to become buyers.",
    "unit": "%",
    "types": [
      "PCT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "productOrService",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "reactivation_to_buyer_rate": {
    "id": "reactivation_to_buyer_rate",
    "name": "Reactivation-to-buyer conversion rate",
    "definition": "Share of the applicable reactivated lead population expected or established to become buyers.",
    "unit": "%",
    "types": [
      "PCT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "productOrService",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "booking_to_buyer_rate": {
    "id": "booking_to_buyer_rate",
    "name": "Booking-to-buyer conversion rate",
    "definition": "Share of the applicable booking population expected or established to become buyers.",
    "unit": "%",
    "types": [
      "PCT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "productOrService",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "attendance_to_buyer_rate": {
    "id": "attendance_to_buyer_rate",
    "name": "Attendance-to-buyer conversion rate",
    "definition": "Share of the applicable attendance population expected or established to become buyers.",
    "unit": "%",
    "types": [
      "PCT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "productOrService",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "potential_buyers_per_unused_slot": {
    "id": "potential_buyers_per_unused_slot",
    "name": "Potential buyers per unused slot",
    "definition": "Expected buyers per applicable unused slot, not capped at one.",
    "unit": "Buyers/slot",
    "types": [
      "RATIO"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "productOrService",
      "evidenceClassification"
    ],
    "evidence": "estimated"
  },
  "attributable_purchase_loss_rate": {
    "id": "attributable_purchase_loss_rate",
    "name": "Attributable purchase loss rate",
    "definition": "Share of the affected buyer population whose purchase opportunity was lost due to the problem.",
    "unit": "%",
    "types": [
      "PCT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "productOrService",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "confirmed_contribution_profit_loss": {
    "id": "confirmed_contribution_profit_loss",
    "name": "Confirmed contribution profit loss",
    "definition": "Contribution profit associated with confirmed lost purchases",
    "unit": "Currency",
    "types": [
      "SIGNED_MONEY"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "currency",
      "productOrService",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "lost_potential_contribution_profit": {
    "id": "lost_potential_contribution_profit",
    "name": "Lost potential contribution profit",
    "definition": "Expected contribution profit forgone",
    "unit": "Currency",
    "types": [
      "SIGNED_MONEY"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "currency",
      "productOrService",
      "evidenceClassification"
    ],
    "evidence": "estimated"
  },
  "avoided_variable_costs": {
    "id": "avoided_variable_costs",
    "name": "Avoided variable costs",
    "definition": "Relevant variable costs not incurred because confirmed purchases were lost",
    "unit": "Currency",
    "types": [
      "MONEY"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "currency",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "estimated_avoided_variable_costs": {
    "id": "estimated_avoided_variable_costs",
    "name": "Estimated avoided variable costs",
    "definition": "Expected variable costs not incurred because potential purchases were lost",
    "unit": "Currency",
    "types": [
      "MONEY"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "currency",
      "evidenceClassification"
    ],
    "evidence": "estimated"
  },
  "contribution_profit_margin": {
    "id": "contribution_profit_margin",
    "name": "Contribution profit margin",
    "definition": "Contribution profit relative to applicable revenue",
    "unit": "%",
    "types": [
      "MARGIN"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "productOrService",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "average_contribution_profit_per_purchase": {
    "id": "average_contribution_profit_per_purchase",
    "name": "Average contribution profit per purchase",
    "definition": "Relevant contribution profit per purchase",
    "unit": "Currency/purchase",
    "types": [
      "SIGNED_AVG"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "currency",
      "productOrService",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "average_contribution_profit_per_buyer": {
    "id": "average_contribution_profit_per_buyer",
    "name": "Average contribution profit per buyer",
    "definition": "Relevant contribution profit per unique buyer",
    "unit": "Currency/buyer",
    "types": [
      "SIGNED_AVG"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "currency",
      "productOrService",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "average_avoided_variable_cost_per_purchase": {
    "id": "average_avoided_variable_cost_per_purchase",
    "name": "Average avoided variable cost per purchase",
    "definition": "Relevant avoided variable cost per purchase",
    "unit": "Currency/purchase",
    "types": [
      "AVG_MONEY"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "currency",
      "productOrService",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "average_avoided_variable_cost_per_buyer": {
    "id": "average_avoided_variable_cost_per_buyer",
    "name": "Average avoided variable cost per buyer",
    "definition": "Relevant avoided variable cost per buyer",
    "unit": "Currency/buyer",
    "types": [
      "AVG_MONEY"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "currency",
      "productOrService",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "total_variable_costs": {
    "id": "total_variable_costs",
    "name": "Total variable costs",
    "definition": "Variable costs for the defined population and period",
    "unit": "Currency",
    "types": [
      "MONEY"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "currency",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "total_contribution_profit": {
    "id": "total_contribution_profit",
    "name": "Total contribution profit",
    "definition": "Relevant revenue after applicable variable costs",
    "unit": "Currency",
    "types": [
      "SIGNED_MONEY"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "currency",
      "productOrService",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "actual_costs": {
    "id": "actual_costs",
    "name": "Actual costs",
    "definition": "Actual expenditure for the defined cost population and period.",
    "unit": "Currency",
    "types": [
      "MONEY"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "currency",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "comparable_costs_without_problem": {
    "id": "comparable_costs_without_problem",
    "name": "Comparable costs without the problem",
    "definition": "Comparable expenditure absent the problem for the same scope.",
    "unit": "Currency",
    "types": [
      "MONEY"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "currency",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "cost_difference": {
    "id": "cost_difference",
    "name": "Cost difference",
    "definition": "Signed actual expenditure minus comparable expenditure.",
    "unit": "Currency",
    "types": [
      "SIGNED_MONEY"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "currency",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "higher_costs": {
    "id": "higher_costs",
    "name": "Higher costs",
    "definition": "Positive attributable increase in applicable expenditure.",
    "unit": "Currency",
    "types": [
      "MONEY"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "currency",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "higher_marketing_costs": {
    "id": "higher_marketing_costs",
    "name": "Higher marketing costs",
    "definition": "Positive incremental paid marketing expenditure attributable to the problem, compared with comparable expenditure without it.",
    "unit": "Currency",
    "types": [
      "MONEY"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "currency",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "higher_staffing_costs": {
    "id": "higher_staffing_costs",
    "name": "Higher staffing costs",
    "definition": "Positive incremental paid staffing expenditure attributable to the problem, excluding separately counted overlapping cost components.",
    "unit": "Currency",
    "types": [
      "MONEY"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "currency",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "higher_collection_costs": {
    "id": "higher_collection_costs",
    "name": "Higher collection costs",
    "definition": "Positive incremental collection expenditure attributable to the problem, including additional collection staff costs and collection fees where not duplicated.",
    "unit": "Currency",
    "types": [
      "MONEY"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "currency",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "higher_financing_costs": {
    "id": "higher_financing_costs",
    "name": "Higher financing costs",
    "definition": "Positive incremental financing expense attributable to the problem, including applicable interest and financing fees, not the borrowed principal.",
    "unit": "Currency",
    "types": [
      "MONEY"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "currency",
      "financingArrangement",
      "interestMethod",
      "dayCountConvention",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "higher_other_operating_costs": {
    "id": "higher_other_operating_costs",
    "name": "Higher other operating costs",
    "definition": "Positive incremental operating expenditure attributable to the problem outside the separately identified marketing, staffing, collection and financing categories.",
    "unit": "Currency",
    "types": [
      "MONEY"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "currency",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "additional_paid_leads": {
    "id": "additional_paid_leads",
    "name": "Additional paid leads",
    "definition": "Additional leads acquired through paid marketing because of the problem; actual additional acquisitions, not all affected or lost leads.",
    "unit": "Leads",
    "types": [
      "COUNT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "average_cost_per_paid_lead": {
    "id": "average_cost_per_paid_lead",
    "name": "Average cost per paid lead",
    "definition": "Applicable marketing expenditure for paid leads divided by the corresponding number of leads acquired through that expenditure.",
    "unit": "Currency/lead",
    "types": [
      "AVG_MONEY"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "currency",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "actual_marketing_costs": {
    "id": "actual_marketing_costs",
    "name": "Actual marketing costs",
    "definition": "Actual marketing expenditure for the relevant population and period with the problem.",
    "unit": "Currency",
    "types": [
      "MONEY"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "currency",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "comparable_marketing_costs": {
    "id": "comparable_marketing_costs",
    "name": "Comparable marketing costs",
    "definition": "Comparable marketing expenditure for the same population and period without the problem.",
    "unit": "Currency",
    "types": [
      "MONEY"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "currency",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "marketing_spend_for_paid_leads": {
    "id": "marketing_spend_for_paid_leads",
    "name": "Marketing spend for paid leads",
    "definition": "Marketing expenditure specifically incurred to acquire the corresponding paid leads.",
    "unit": "Currency",
    "types": [
      "MONEY"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "currency",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "paid_leads_acquired": {
    "id": "paid_leads_acquired",
    "name": "Paid leads acquired",
    "definition": "Distinct leads acquired through the corresponding marketing expenditure and period.",
    "unit": "Leads",
    "types": [
      "COUNT",
      "EST_COUNT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "additional_paid_staff_hours": {
    "id": "additional_paid_staff_hours",
    "name": "Additional paid staff hours",
    "definition": "Additional paid hours incurred because of the problem, not merely hours that could have been avoided or a capacity shortfall.",
    "unit": "Hours",
    "types": [
      "HOURS"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "average_cost_per_additional_staff_hour": {
    "id": "average_cost_per_additional_staff_hour",
    "name": "Average cost per additional staff hour",
    "definition": "Incremental expenditure per additional paid staff hour for the applicable arrangement.",
    "unit": "Currency/hour",
    "types": [
      "AVG_MONEY"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "currency",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "additional_employees": {
    "id": "additional_employees",
    "name": "Additional employees",
    "definition": "Actual additional individual employees attributable to the problem, not a fractional staffing equivalent.",
    "unit": "Employees",
    "types": [
      "COUNT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "cost_per_additional_employee": {
    "id": "cost_per_additional_employee",
    "name": "Cost per additional employee",
    "definition": "Applicable incremental cost per additional employee over the explicitly defined period and employment arrangement.",
    "unit": "Currency/employee for the defined period",
    "types": [
      "AVG_MONEY"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "currency",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "actual_staffing_costs": {
    "id": "actual_staffing_costs",
    "name": "Actual staffing costs",
    "definition": "Actual paid staffing expenditure for the relevant workload and period with the problem.",
    "unit": "Currency",
    "types": [
      "MONEY"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "currency",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "comparable_staffing_costs": {
    "id": "comparable_staffing_costs",
    "name": "Comparable staffing costs",
    "definition": "Comparable staffing expenditure for the same workload and period without the problem.",
    "unit": "Currency",
    "types": [
      "MONEY"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "currency",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "additional_collection_staff_hours": {
    "id": "additional_collection_staff_hours",
    "name": "Additional collection staff hours",
    "definition": "Additional paid collection staff hours attributable to the problem.",
    "unit": "Hours",
    "types": [
      "HOURS"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "average_cost_per_collection_staff_hour": {
    "id": "average_cost_per_collection_staff_hour",
    "name": "Average cost per collection staff hour",
    "definition": "Applicable collection staff expenditure per corresponding additional paid collection hour.",
    "unit": "Currency/hour",
    "types": [
      "AVG_MONEY"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "currency",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "additional_collection_staff_costs": {
    "id": "additional_collection_staff_costs",
    "name": "Additional collection staff costs",
    "definition": "Incremental collection staff expenditure attributable to the problem; may overlap general staffing costs.",
    "unit": "Currency",
    "types": [
      "MONEY"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "currency",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "additional_collection_fees": {
    "id": "additional_collection_fees",
    "name": "Additional collection fees",
    "definition": "Additional fees paid or payable for collection activity attributable to the problem, excluding separately counted staff costs.",
    "unit": "Currency",
    "types": [
      "MONEY"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "currency",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "additional_borrowed_amount": {
    "id": "additional_borrowed_amount",
    "name": "Additional borrowed amount",
    "definition": "Additional loan principal borrowed because of the problem, for the identified financing arrangement.",
    "unit": "Currency",
    "types": [
      "MONEY"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "currency",
      "financingArrangement",
      "interestMethod",
      "dayCountConvention",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "annual_interest_rate": {
    "id": "annual_interest_rate",
    "name": "Annual interest rate",
    "definition": "Annual rate of the applicable borrowing arrangement under its stated interest convention.",
    "unit": "%/year",
    "types": [
      "INTEREST"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "financingArrangement",
      "interestMethod",
      "dayCountConvention",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "borrowing_period": {
    "id": "borrowing_period",
    "name": "Borrowing period",
    "definition": "Days covered by the relevant borrowing arrangement.",
    "unit": "Days",
    "types": [
      "DAYS"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "financingArrangement",
      "interestMethod",
      "dayCountConvention",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "additional_interest": {
    "id": "additional_interest",
    "name": "Additional interest",
    "definition": "Incremental interest expense on the applicable additional financing arrangement and borrowing period.",
    "unit": "Currency",
    "types": [
      "MONEY"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "currency",
      "financingArrangement",
      "interestMethod",
      "dayCountConvention",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "additional_financing_fees": {
    "id": "additional_financing_fees",
    "name": "Additional financing fees",
    "definition": "Incremental fees for the applicable financing arrangement, excluding interest and principal.",
    "unit": "Currency",
    "types": [
      "MONEY"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "currency",
      "financingArrangement",
      "interestMethod",
      "dayCountConvention",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "additional_resources_used": {
    "id": "additional_resources_used",
    "name": "Additional resources used",
    "definition": "Additional amount of the specifically defined resource used because of the problem; unrelated resource types are not interchangeable.",
    "unit": "Defined resource units",
    "types": [
      "RESOURCE_COUNT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "resourceType",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "average_cost_per_additional_resource": {
    "id": "average_cost_per_additional_resource",
    "name": "Average cost per additional resource",
    "definition": "Incremental expense per additional unit of the same defined resource and period.",
    "unit": "Currency/resource unit",
    "types": [
      "AVG_MONEY"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "currency",
      "resourceType",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "actual_other_operating_costs": {
    "id": "actual_other_operating_costs",
    "name": "Actual other operating costs",
    "definition": "Actual expenditure for the defined other operating-cost category with the problem.",
    "unit": "Currency",
    "types": [
      "MONEY"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "currency",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "comparable_other_operating_costs": {
    "id": "comparable_other_operating_costs",
    "name": "Comparable other operating costs",
    "definition": "Comparable expenditure for the same other operating-cost category without the problem.",
    "unit": "Currency",
    "types": [
      "MONEY"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "currency",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "wasted_costs": {
    "id": "wasted_costs",
    "name": "Wasted costs",
    "definition": "Expenditure that was actually wasted for the defined scope; may overlap higher costs.",
    "unit": "Currency",
    "types": [
      "MONEY"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "currency",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "wasted_marketing_costs": {
    "id": "wasted_marketing_costs",
    "name": "Wasted marketing costs",
    "definition": "Paid marketing expenditure attributable to lost leads or other established wasted acquisition expenditure in the relevant campaign.",
    "unit": "Currency",
    "types": [
      "MONEY"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "currency",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "wasted_staffing_costs": {
    "id": "wasted_staffing_costs",
    "name": "Wasted staffing costs",
    "definition": "Paid staffing expenditure attributable to time that was actually wasted, not all avoidable time or additional staffing expense.",
    "unit": "Currency",
    "types": [
      "MONEY"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "currency",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "wasted_other_operating_costs": {
    "id": "wasted_other_operating_costs",
    "name": "Wasted other operating costs",
    "definition": "Paid expenditure for resources actually wasted outside the separate marketing and staffing categories.",
    "unit": "Currency",
    "types": [
      "MONEY"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "currency",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "paid_lost_leads": {
    "id": "paid_lost_leads",
    "name": "Paid lost leads",
    "definition": "Lost leads acquired by the relevant paid marketing expenditure.",
    "unit": "Leads",
    "types": [
      "COUNT",
      "EST_COUNT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "paid_lost_lead_percentage": {
    "id": "paid_lost_lead_percentage",
    "name": "Percentage of lost leads acquired through paid marketing",
    "definition": "Share of the relevant lost lead population acquired through paid marketing.",
    "unit": "%",
    "types": [
      "PCT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "paid_wasted_time_percentage": {
    "id": "paid_wasted_time_percentage",
    "name": "Percentage of avoidable time that was paid and wasted",
    "definition": "Share of avoidable time that was both paid and wasted.",
    "unit": "%",
    "types": [
      "PCT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "wasted_paid_staff_hours": {
    "id": "wasted_paid_staff_hours",
    "name": "Wasted paid staff hours",
    "definition": "Hours that were both paid and wasted because of the problem.",
    "unit": "Hours",
    "types": [
      "HOURS"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "average_staffing_cost_per_hour": {
    "id": "average_staffing_cost_per_hour",
    "name": "Average staffing cost per hour",
    "definition": "Relevant paid staffing expenditure divided by the corresponding paid staff hours; not necessarily the incremental cost of additional hours.",
    "unit": "Currency/hour",
    "types": [
      "AVG_MONEY"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "currency",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "wasted_paid_hours_per_unused_slot": {
    "id": "wasted_paid_hours_per_unused_slot",
    "name": "Wasted paid staff hours per unused slot",
    "definition": "Paid staff hours actually wasted per relevant unused appointment slot, conditional on an established causal link.",
    "unit": "Hours/slot",
    "types": [
      "RATIO"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "relevant_staffing_costs": {
    "id": "relevant_staffing_costs",
    "name": "Relevant staffing costs",
    "definition": "Paid staffing expenditure for the specific measured staffing population used to establish its average hourly cost.",
    "unit": "Currency",
    "types": [
      "MONEY"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "currency",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "corresponding_paid_staff_hours": {
    "id": "corresponding_paid_staff_hours",
    "name": "Corresponding paid staff hours",
    "definition": "Paid staff hours covered by the same staffing expenditure and period.",
    "unit": "Hours",
    "types": [
      "HOURS"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "wasted_resources": {
    "id": "wasted_resources",
    "name": "Wasted resources",
    "definition": "Units of the specified resource actually wasted because of the problem.",
    "unit": "Defined resource units",
    "types": [
      "RESOURCE_COUNT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "resourceType",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "average_cost_per_wasted_resource": {
    "id": "average_cost_per_wasted_resource",
    "name": "Average cost per wasted resource",
    "definition": "Applicable expenditure per wasted unit of the same resource type and period.",
    "unit": "Currency/resource unit",
    "types": [
      "AVG_MONEY"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "currency",
      "resourceType",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "payments_due": {
    "id": "payments_due",
    "name": "Payments due",
    "definition": "Relevant monetary amount due by the applicable date",
    "unit": "Currency",
    "types": [
      "MONEY"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "currency",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "payments_received_on_time": {
    "id": "payments_received_on_time",
    "name": "Payments received on time",
    "definition": "Portion of that relevant amount received by the applicable date",
    "unit": "Currency",
    "types": [
      "MONEY"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "currency",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "delayed_cash_collection": {
    "id": "delayed_cash_collection",
    "name": "Delayed cash collection",
    "definition": "Attributable monetary amount not received on time",
    "unit": "Currency",
    "types": [
      "MONEY"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "currency",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "invoices_not_paid_on_time": {
    "id": "invoices_not_paid_on_time",
    "name": "Invoices not paid on time",
    "definition": "Relevant count of invoices containing overdue amounts",
    "unit": "Invoices",
    "types": [
      "COUNT",
      "EST_COUNT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "average_amount_not_paid_on_time_per_invoice": {
    "id": "average_amount_not_paid_on_time_per_invoice",
    "name": "Average amount not paid on time per invoice",
    "definition": "Applicable overdue monetary amount per invoice",
    "unit": "Currency/invoice",
    "types": [
      "AVG_MONEY"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "currency",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "original_unpaid_amount": {
    "id": "original_unpaid_amount",
    "name": "Original unpaid amount",
    "definition": "Relevant starting unpaid monetary balance",
    "unit": "Currency",
    "types": [
      "MONEY"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "currency",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "recovered_unpaid_amount": {
    "id": "recovered_unpaid_amount",
    "name": "Recovered unpaid amount",
    "definition": "Portion of the original balance subsequently recovered",
    "unit": "Currency",
    "types": [
      "MONEY"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "currency",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "pending_unpaid_amount": {
    "id": "pending_unpaid_amount",
    "name": "Pending unpaid amount",
    "definition": "Portion still awaiting recovery or final classification",
    "unit": "Currency",
    "types": [
      "MONEY"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "currency",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "unpaid_invoice_money_loss": {
    "id": "unpaid_invoice_money_loss",
    "name": "Money lost from unpaid invoices",
    "definition": "Portion confirmed unrecoverable",
    "unit": "Currency",
    "types": [
      "MONEY"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "currency",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "confirmed_unrecoverable_invoices": {
    "id": "confirmed_unrecoverable_invoices",
    "name": "Confirmed unrecoverable invoices",
    "definition": "Invoice count meeting the relevant unrecoverable classification",
    "unit": "Invoices",
    "types": [
      "COUNT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "average_unrecoverable_amount_per_invoice": {
    "id": "average_unrecoverable_amount_per_invoice",
    "name": "Average unrecoverable amount per invoice",
    "definition": "Relevant unrecoverable monetary amount per invoice",
    "unit": "Currency/invoice",
    "types": [
      "AVG_MONEY"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "currency",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "estimated_costs_with_problem": {
    "id": "estimated_costs_with_problem",
    "name": "Estimated costs with the problem",
    "definition": "Estimated version of Actual expenditure for the defined cost population and period.",
    "unit": "Currency",
    "types": [
      "MONEY"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "currency",
      "evidenceClassification"
    ],
    "evidence": "estimated"
  },
  "estimated_comparable_costs": {
    "id": "estimated_comparable_costs",
    "name": "Estimated comparable costs without the problem",
    "definition": "Estimated version of Comparable expenditure absent the problem for the same scope.",
    "unit": "Currency",
    "types": [
      "MONEY"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "currency",
      "evidenceClassification"
    ],
    "evidence": "estimated"
  },
  "estimated_cost_difference": {
    "id": "estimated_cost_difference",
    "name": "Estimated cost difference",
    "definition": "Estimated version of Signed actual expenditure minus comparable expenditure.",
    "unit": "Currency",
    "types": [
      "SIGNED_MONEY"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "currency",
      "evidenceClassification"
    ],
    "evidence": "estimated"
  },
  "estimated_higher_costs": {
    "id": "estimated_higher_costs",
    "name": "Estimated higher costs",
    "definition": "Estimated version of Positive attributable increase in applicable expenditure.",
    "unit": "Currency",
    "types": [
      "MONEY"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "currency",
      "evidenceClassification"
    ],
    "evidence": "estimated"
  },
  "estimated_higher_marketing_costs": {
    "id": "estimated_higher_marketing_costs",
    "name": "Estimated higher marketing costs",
    "definition": "Estimated measurement: Positive incremental paid marketing expenditure attributable to the problem, compared with comparable expenditure without it.",
    "unit": "Currency",
    "types": [
      "MONEY"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "currency",
      "evidenceClassification"
    ],
    "evidence": "estimated"
  },
  "estimated_higher_staffing_costs": {
    "id": "estimated_higher_staffing_costs",
    "name": "Estimated higher staffing costs",
    "definition": "Estimated measurement: Positive incremental paid staffing expenditure attributable to the problem, excluding separately counted overlapping cost components.",
    "unit": "Currency",
    "types": [
      "MONEY"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "currency",
      "evidenceClassification"
    ],
    "evidence": "estimated"
  },
  "estimated_higher_collection_costs": {
    "id": "estimated_higher_collection_costs",
    "name": "Estimated higher collection costs",
    "definition": "Estimated measurement: Positive incremental collection expenditure attributable to the problem, including additional collection staff costs and collection fees where not duplicated.",
    "unit": "Currency",
    "types": [
      "MONEY"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "currency",
      "evidenceClassification"
    ],
    "evidence": "estimated"
  },
  "estimated_higher_financing_costs": {
    "id": "estimated_higher_financing_costs",
    "name": "Estimated higher financing costs",
    "definition": "Estimated measurement: Positive incremental financing expense attributable to the problem, including applicable interest and financing fees, not the borrowed principal.",
    "unit": "Currency",
    "types": [
      "MONEY"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "currency",
      "financingArrangement",
      "interestMethod",
      "dayCountConvention",
      "evidenceClassification"
    ],
    "evidence": "estimated"
  },
  "estimated_higher_other_operating_costs": {
    "id": "estimated_higher_other_operating_costs",
    "name": "Estimated higher other operating costs",
    "definition": "Estimated measurement: Positive incremental operating expenditure attributable to the problem outside the separately identified marketing, staffing, collection and financing categories.",
    "unit": "Currency",
    "types": [
      "MONEY"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "currency",
      "evidenceClassification"
    ],
    "evidence": "estimated"
  },
  "estimated_additional_paid_leads": {
    "id": "estimated_additional_paid_leads",
    "name": "Estimated additional paid leads",
    "definition": "Estimated measurement: Additional leads acquired through paid marketing because of the problem; actual additional acquisitions, not all affected or lost leads.",
    "unit": "Leads",
    "types": [
      "EST_COUNT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "estimated"
  },
  "estimated_additional_paid_staff_hours": {
    "id": "estimated_additional_paid_staff_hours",
    "name": "Estimated additional paid staff hours",
    "definition": "Estimated measurement: Additional paid hours incurred because of the problem, not merely hours that could have been avoided or a capacity shortfall.",
    "unit": "Hours",
    "types": [
      "HOURS"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "estimated"
  },
  "estimated_additional_employees": {
    "id": "estimated_additional_employees",
    "name": "Estimated additional employees",
    "definition": "Estimated measurement: Actual additional individual employees attributable to the problem, not a fractional staffing equivalent.",
    "unit": "Employees",
    "types": [
      "EST_COUNT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "estimated"
  },
  "estimated_additional_collection_staff_hours": {
    "id": "estimated_additional_collection_staff_hours",
    "name": "Estimated additional collection staff hours",
    "definition": "Estimated measurement: Additional paid collection staff hours attributable to the problem.",
    "unit": "Hours",
    "types": [
      "HOURS"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "estimated"
  },
  "estimated_additional_collection_staff_costs": {
    "id": "estimated_additional_collection_staff_costs",
    "name": "Estimated additional collection staff costs",
    "definition": "Estimated measurement: Incremental collection staff expenditure attributable to the problem; may overlap general staffing costs.",
    "unit": "Currency",
    "types": [
      "MONEY"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "currency",
      "evidenceClassification"
    ],
    "evidence": "estimated"
  },
  "estimated_additional_collection_fees": {
    "id": "estimated_additional_collection_fees",
    "name": "Estimated additional collection fees",
    "definition": "Estimated measurement: Additional fees paid or payable for collection activity attributable to the problem, excluding separately counted staff costs.",
    "unit": "Currency",
    "types": [
      "MONEY"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "currency",
      "evidenceClassification"
    ],
    "evidence": "estimated"
  },
  "estimated_additional_borrowed_amount": {
    "id": "estimated_additional_borrowed_amount",
    "name": "Estimated additional borrowed amount",
    "definition": "Estimated measurement: Additional loan principal borrowed because of the problem, for the identified financing arrangement.",
    "unit": "Currency",
    "types": [
      "MONEY"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "currency",
      "financingArrangement",
      "interestMethod",
      "dayCountConvention",
      "evidenceClassification"
    ],
    "evidence": "estimated"
  },
  "estimated_borrowing_period": {
    "id": "estimated_borrowing_period",
    "name": "Estimated borrowing period",
    "definition": "Estimated version of Days covered by the relevant borrowing arrangement.",
    "unit": "Days",
    "types": [
      "DAYS"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "financingArrangement",
      "interestMethod",
      "dayCountConvention",
      "evidenceClassification"
    ],
    "evidence": "estimated"
  },
  "estimated_additional_interest": {
    "id": "estimated_additional_interest",
    "name": "Estimated additional interest",
    "definition": "Estimated measurement: Incremental interest expense on the applicable additional financing arrangement and borrowing period.",
    "unit": "Currency",
    "types": [
      "MONEY"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "currency",
      "financingArrangement",
      "interestMethod",
      "dayCountConvention",
      "evidenceClassification"
    ],
    "evidence": "estimated"
  },
  "estimated_additional_financing_fees": {
    "id": "estimated_additional_financing_fees",
    "name": "Estimated additional financing fees",
    "definition": "Estimated measurement: Incremental fees for the applicable financing arrangement, excluding interest and principal.",
    "unit": "Currency",
    "types": [
      "MONEY"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "currency",
      "financingArrangement",
      "interestMethod",
      "dayCountConvention",
      "evidenceClassification"
    ],
    "evidence": "estimated"
  },
  "estimated_additional_resources_used": {
    "id": "estimated_additional_resources_used",
    "name": "Estimated additional resources used",
    "definition": "Estimated measurement: Additional amount of the specifically defined resource used because of the problem; unrelated resource types are not interchangeable.",
    "unit": "Defined resource units",
    "types": [
      "RESOURCE_COUNT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "resourceType",
      "evidenceClassification"
    ],
    "evidence": "estimated"
  },
  "estimated_marketing_costs_with_problem": {
    "id": "estimated_marketing_costs_with_problem",
    "name": "Estimated marketing costs with the problem",
    "definition": "Estimated measurement: Actual marketing expenditure for the relevant population and period with the problem.",
    "unit": "Currency",
    "types": [
      "MONEY"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "currency",
      "evidenceClassification"
    ],
    "evidence": "estimated"
  },
  "estimated_comparable_marketing_costs": {
    "id": "estimated_comparable_marketing_costs",
    "name": "Estimated comparable marketing costs",
    "definition": "Estimated measurement: Comparable marketing expenditure for the same population and period without the problem.",
    "unit": "Currency",
    "types": [
      "MONEY"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "currency",
      "evidenceClassification"
    ],
    "evidence": "estimated"
  },
  "estimated_staffing_costs_with_problem": {
    "id": "estimated_staffing_costs_with_problem",
    "name": "Estimated staffing costs with the problem",
    "definition": "Estimated measurement: Actual paid staffing expenditure for the relevant workload and period with the problem.",
    "unit": "Currency",
    "types": [
      "MONEY"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "currency",
      "evidenceClassification"
    ],
    "evidence": "estimated"
  },
  "estimated_comparable_staffing_costs": {
    "id": "estimated_comparable_staffing_costs",
    "name": "Estimated comparable staffing costs",
    "definition": "Estimated measurement: Comparable staffing expenditure for the same workload and period without the problem.",
    "unit": "Currency",
    "types": [
      "MONEY"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "currency",
      "evidenceClassification"
    ],
    "evidence": "estimated"
  },
  "estimated_other_operating_costs_with_problem": {
    "id": "estimated_other_operating_costs_with_problem",
    "name": "Estimated other operating costs with the problem",
    "definition": "Estimated measurement: Actual expenditure for the defined other operating-cost category with the problem.",
    "unit": "Currency",
    "types": [
      "MONEY"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "currency",
      "evidenceClassification"
    ],
    "evidence": "estimated"
  },
  "estimated_comparable_other_operating_costs": {
    "id": "estimated_comparable_other_operating_costs",
    "name": "Estimated comparable other operating costs",
    "definition": "Estimated measurement: Comparable expenditure for the same other operating-cost category without the problem.",
    "unit": "Currency",
    "types": [
      "MONEY"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "currency",
      "evidenceClassification"
    ],
    "evidence": "estimated"
  },
  "expected_unrecoverable_percentage": {
    "id": "expected_unrecoverable_percentage",
    "name": "Expected unrecoverable percentage",
    "definition": "Expected proportion of the pending unpaid monetary balance not recoverable.",
    "unit": "% of monetary balance",
    "types": [
      "PCT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "estimated_unpaid_invoice_money_loss": {
    "id": "estimated_unpaid_invoice_money_loss",
    "name": "Estimated money lost from unpaid invoices",
    "definition": "Expected unrecoverable monetary amount from the pending balance.",
    "unit": "Currency",
    "types": [
      "MONEY"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "currency",
      "evidenceClassification"
    ],
    "evidence": "estimated"
  },
  "pending_invoices": {
    "id": "pending_invoices",
    "name": "Pending invoices",
    "definition": "Relevant invoices still awaiting final recovery classification.",
    "unit": "Invoices",
    "types": [
      "COUNT",
      "EST_COUNT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "expected_invoice_loss_rate": {
    "id": "expected_invoice_loss_rate",
    "name": "Expected invoice loss rate",
    "definition": "Expected proportion of pending invoice counts that will be lost.",
    "unit": "% of invoice count",
    "types": [
      "PCT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "average_expected_unrecoverable_amount_per_lost_invoice": {
    "id": "average_expected_unrecoverable_amount_per_lost_invoice",
    "name": "Average expected unrecoverable amount per lost invoice",
    "definition": "Expected unrecoverable amount per applicable lost invoice.",
    "unit": "Currency/invoice",
    "types": [
      "AVG_MONEY"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "currency",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "expected_recoverable_amount": {
    "id": "expected_recoverable_amount",
    "name": "Expected recoverable amount",
    "definition": "Expected recoverable part of the pending unpaid balance.",
    "unit": "Currency",
    "types": [
      "MONEY"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "currency",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "unclassified_quantity": {
    "id": "unclassified_quantity",
    "name": "Unclassified quantity",
    "definition": "Account for entities not included in an otherwise incomplete population breakdown",
    "unit": "Context-dependent count",
    "types": [
      "COUNT",
      "EST_COUNT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "eligible_conversion_population": {
    "id": "eligible_conversion_population",
    "name": "Eligible conversion population",
    "definition": "Denominator for an applicable measured conversion rate",
    "unit": "Context-dependent count",
    "types": [
      "COUNT",
      "EST_COUNT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "converted_population": {
    "id": "converted_population",
    "name": "Converted population",
    "definition": "Numerator for an applicable measured conversion rate",
    "unit": "Context-dependent count",
    "types": [
      "COUNT",
      "EST_COUNT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "applicable_average_population": {
    "id": "applicable_average_population",
    "name": "Corresponding measured population",
    "definition": "Denominator for an applicable average",
    "unit": "Context-dependent count",
    "types": [
      "COUNT",
      "EST_COUNT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "overlapping_quantity": {
    "id": "overlapping_quantity",
    "name": "Quantity counted in both populations",
    "definition": "Prevent duplicate entity counts",
    "unit": "Context-dependent count",
    "types": [
      "COUNT",
      "EST_COUNT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "unique_combined_quantity": {
    "id": "unique_combined_quantity",
    "name": "Total unique combined quantity",
    "definition": "Represent the union of compatible populations",
    "unit": "Context-dependent count",
    "types": [
      "COUNT",
      "EST_COUNT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "overlapping_staff_hours": {
    "id": "overlapping_staff_hours",
    "name": "Staff hours counted in both measurements",
    "definition": "Prevent duplicate staff-hour counts",
    "unit": "Hours",
    "types": [
      "HOURS"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "unique_combined_staff_hours": {
    "id": "unique_combined_staff_hours",
    "name": "Total unique combined staff hours",
    "definition": "Represent the nonduplicated time amount",
    "unit": "Hours",
    "types": [
      "HOURS"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "overlapping_monetary_amount": {
    "id": "overlapping_monetary_amount",
    "name": "Amount counted in both measurements",
    "definition": "Prevent duplicate financial amounts",
    "unit": "Currency",
    "types": [
      "MONEY"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "currency",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "nonduplicated_combined_amount": {
    "id": "nonduplicated_combined_amount",
    "name": "Total nonduplicated amount",
    "definition": "Represent an appropriately combined financial amount",
    "unit": "Currency",
    "types": [
      "MONEY"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "currency",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "affected_payments": {
    "id": "affected_payments",
    "name": "Payments without reminders",
    "definition": "Distinct payments without reminders; reminder events may not represent distinct payments.",
    "unit": "Payments",
    "types": [
      "COUNT",
      "EST_COUNT"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "average_overloaded_task_time": {
    "id": "average_overloaded_task_time",
    "name": "Average time per unit",
    "definition": "Existing legacy mean duration per overload-affected task; retain the existing calculation pending complete engine review.",
    "unit": "Minutes",
    "types": [
      "MINUTES"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "staffing_equivalent": {
    "id": "staffing_equivalent",
    "name": "Staffing equivalent",
    "definition": "Full-time-equivalent staff capacity, not an individual employee count.",
    "unit": "FTE",
    "types": [
      "FTE"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  },
  "buyers_per_entity": {
    "id": "buyers_per_entity",
    "name": "Buyers per entity",
    "definition": "Buyers per defined starting entity, distinct from a conversion percentage.",
    "unit": "Buyers/entity",
    "types": [
      "RATIO"
    ],
    "scopeRequirements": [
      "businessId",
      "populationId",
      "populationDefinition",
      "countingUnit",
      "measurementPeriod",
      "reportingCutoff",
      "measurementBasis",
      "scenario",
      "attribution",
      "productOrService",
      "evidenceClassification"
    ],
    "evidence": "evidence-dependent"
  }
};
export const problemQuantityDefinitions = [
  {
    "problemId": "problem-1",
    "prefix": "incoming_calls",
    "labels": [
      "Total incoming calls",
      "Missed calls",
      "Answered calls",
      "Missed call rate",
      "Answered call rate"
    ],
    "unit": "Calls"
  },
  {
    "problemId": "problem-2",
    "prefix": "outside_hours_calls",
    "labels": [
      "Calls outside working hours",
      "Unanswered calls outside working hours",
      "Answered calls outside working hours",
      "Unanswered call rate",
      "Answered call rate"
    ],
    "unit": "Calls"
  },
  {
    "problemId": "problem-3",
    "prefix": "booking_calls",
    "labels": [
      "Calls requiring appointments",
      "Missed bookings during calls",
      "Bookings completed during calls",
      "Missed booking rate",
      "Completed booking rate"
    ],
    "unit": "Calls or bookings, subject to compatible counting definition"
  },
  {
    "problemId": "problem-4",
    "prefix": "urgent_calls",
    "labels": [
      "Urgent calls",
      "Urgent calls not reaching employees",
      "Urgent calls reaching employees",
      "Unrouted urgent call rate",
      "Routed urgent call rate"
    ],
    "unit": "Calls"
  },
  {
    "problemId": "problem-5",
    "prefix": "new_lead_responses",
    "labels": [
      "New leads requiring a response",
      "New leads with slow responses",
      "New leads with timely responses",
      "Slow response rate",
      "Timely response rate"
    ],
    "unit": "Leads"
  },
  {
    "problemId": "problem-6",
    "prefix": "new_lead_calls",
    "labels": [
      "New leads requiring calls",
      "New leads never called",
      "New leads called",
      "Uncalled lead rate",
      "Called lead rate"
    ],
    "unit": "Leads"
  },
  {
    "problemId": "problem-7",
    "prefix": "lead_qualifications",
    "labels": [
      "Leads requiring qualification",
      "Late lead qualifications",
      "Timely lead qualifications",
      "Late qualification rate",
      "Timely qualification rate"
    ],
    "unit": "Leads"
  },
  {
    "problemId": "problem-8",
    "prefix": "warm_lead_contacts",
    "labels": [
      "Warm leads requiring contact",
      "Warm leads not contacted",
      "Warm leads contacted",
      "Uncontacted warm lead rate",
      "Contacted warm lead rate"
    ],
    "unit": "Leads"
  },
  {
    "problemId": "problem-9",
    "prefix": "old_lead_calls",
    "labels": [
      "Old leads requiring calls",
      "Old leads not called",
      "Old leads called",
      "Uncalled old lead rate",
      "Called lead rate"
    ],
    "unit": "Leads"
  },
  {
    "problemId": "problem-10",
    "prefix": "old_lead_followups",
    "labels": [
      "Old leads requiring follow-up",
      "Old leads followed up inconsistently",
      "Old leads followed up regularly",
      "Inconsistent follow-up rate",
      "Regular follow-up rate"
    ],
    "unit": "Leads"
  },
  {
    "problemId": "problem-11",
    "prefix": "warm_old_lead_contacts",
    "labels": [
      "Warm old leads requiring further contact",
      "Warm old leads not contacted again",
      "Warm old leads contacted again",
      "Uncontacted warm old lead rate",
      "Contacted warm old lead rate"
    ],
    "unit": "Leads"
  },
  {
    "problemId": "problem-12",
    "prefix": "appointment_reminders",
    "labels": [
      "Appointments requiring reminders",
      "Missed appointment reminders",
      "Appointment reminders sent",
      "Missed reminder rate",
      "Sent reminder rate"
    ],
    "unit": "Appointments or reminder events, subject to compatible definitions"
  },
  {
    "problemId": "problem-13",
    "prefix": "appointment_confirmations",
    "labels": [
      "Appointments requiring confirmation",
      "Unconfirmed appointments",
      "Confirmed appointments",
      "Unconfirmed appointment rate",
      "Confirmed appointment rate"
    ],
    "unit": "Appointments"
  },
  {
    "problemId": "problem-14",
    "prefix": "appointment_attendance",
    "labels": [
      "Scheduled appointments",
      "Appointment no-shows",
      "Appointments attended",
      "No-show rate",
      "Attendance rate"
    ],
    "unit": "Appointments"
  },
  {
    "problemId": "problem-15",
    "prefix": "appointment_rescheduling",
    "labels": [
      "Appointments requiring rescheduling",
      "Time-consuming appointment rescheduling",
      "Appointments rescheduled promptly",
      "Time-consuming rescheduling rate",
      "Prompt rescheduling rate"
    ],
    "unit": "Appointments"
  },
  {
    "problemId": "problem-16",
    "prefix": "canceled_slots",
    "labels": [
      "Canceled appointment slots",
      "Empty slots after cancellations",
      "Canceled slots filled",
      "Unused slot rate",
      "Filled slot rate"
    ],
    "unit": "Slots"
  },
  {
    "problemId": "problem-17",
    "prefix": "routine_questions",
    "labels": [
      "Questions received",
      "Routine questions",
      "Other questions",
      "Routine question rate",
      "Other question rate"
    ],
    "unit": "Questions"
  },
  {
    "problemId": "problem-18",
    "prefix": "simple_question_responses",
    "labels": [
      "Simple questions received",
      "Simple questions answered slowly",
      "Simple questions answered promptly",
      "Slow answer rate",
      "Prompt answer rate"
    ],
    "unit": "Questions"
  },
  {
    "problemId": "problem-19",
    "prefix": "repeated_questions",
    "labels": [
      "Questions answered by employees",
      "Repeated questions answered by employees",
      "Other questions answered by employees",
      "Repeated question rate",
      "Other question rate"
    ],
    "unit": "Questions"
  },
  {
    "problemId": "problem-20",
    "prefix": "manual_tasks",
    "labels": [
      "Total tasks",
      "Tasks completed manually",
      "Tasks not completed manually",
      "Manual task rate",
      "Non-manual task rate"
    ],
    "unit": "Tasks"
  },
  {
    "problemId": "problem-21",
    "prefix": "buyer_requests",
    "labels": [
      "Basic buyer requests",
      "Basic buyer requests not handled",
      "Basic buyer requests handled",
      "Unhandled request rate",
      "Handled request rate"
    ],
    "unit": "Requests"
  },
  {
    "problemId": "problem-22",
    "prefix": "payment_reminders",
    "labels": [
      "Payments requiring reminders",
      "Missed payment reminders",
      "Payment reminders sent",
      "Missed payment reminder rate",
      "Sent payment reminder rate"
    ],
    "unit": "Payments or reminder events, subject to compatible definitions"
  },
  {
    "problemId": "problem-23",
    "prefix": "invoice_followups",
    "labels": [
      "Invoices requiring follow-up",
      "Invoices not followed up regularly",
      "Invoices followed up regularly",
      "Inconsistent invoice follow-up rate",
      "Regular invoice follow-up rate"
    ],
    "unit": "Invoices"
  },
  {
    "problemId": "problem-24",
    "prefix": "review_requests",
    "labels": [
      "Buyers eligible for review requests",
      "Buyers not asked for reviews",
      "Buyers asked for reviews",
      "Missed review request rate",
      "Review request rate"
    ],
    "unit": "Buyers"
  },
  {
    "problemId": "problem-25",
    "prefix": "call_records",
    "labels": [
      "Calls requiring recordings and outcomes",
      "Calls with missing recordings or outcomes",
      "Calls with recordings and outcomes",
      "Missing record rate",
      "Complete record rate"
    ],
    "unit": "Calls"
  },
  {
    "problemId": "problem-26",
    "prefix": "crm_lead_records",
    "labels": [
      "Lead records requiring CRM updates",
      "Lead details not updated in CRM",
      "Lead details updated in CRM",
      "Missing update rate",
      "Completed update rate"
    ],
    "unit": "Lead records"
  },
  {
    "problemId": "problem-27",
    "prefix": "agent_visibility",
    "labels": [
      "Agent activities requiring visibility",
      "Agent activities not visible",
      "Agent activities visible",
      "Missing activity rate",
      "Visible activity rate"
    ],
    "unit": "Activities"
  },
  {
    "problemId": "problem-28",
    "prefix": "overloaded_tasks",
    "labels": [
      "Total tasks",
      "Tasks affected by employee overload",
      "Tasks not affected by employee overload",
      "Affected task rate",
      "Unaffected task rate"
    ],
    "unit": "Tasks"
  }
] as const;
export function definition(id:string):QuantityDefinition{const d=quantityDefinitions[id];if(!d)throw new Error("Unregistered canonical quantity: "+id);return d;}
export function validNumericalValue(type:NumericalType,value:number,options:{positiveRevenueAndNonnegativeCosts?:boolean;integerResource?:boolean;denominator?:boolean}={}):boolean{
 if(!Number.isFinite(value))return false;
 const rule=numericalTypes[type] as {min?:number;max?:number;integer?:boolean;conditionalMax?:number;denominatorPositive?:boolean;integerByUnit?:boolean};
 return !(rule.min!==undefined&&value<rule.min||rule.max!==undefined&&value>rule.max||rule.integer&&!Number.isSafeInteger(value)||rule.integerByUnit&&options.integerResource&&!Number.isSafeInteger(value)||rule.conditionalMax!==undefined&&options.positiveRevenueAndNonnegativeCosts&&value>rule.conditionalMax||rule.denominatorPositive&&options.denominator&&value<=0);
}
