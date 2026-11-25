// Approved unified positive outcomes. Descriptions and function mappings are pending.
// All financial outcomes represent potential improvements, not guarantees.
import type { Outcome, ImpactKind } from "./data";

export const positiveOutcomes: Record<string, Outcome> = {
  "positive-operational-fewer-lost-leads": {
    "id": "positive-operational-fewer-lost-leads",
    "title": "Fewer lost leads",
    "description": "",
    "functionIds": []
  },
  "positive-operational-fewer-lost-qualified-leads": {
    "id": "positive-operational-fewer-lost-qualified-leads",
    "title": "Fewer lost qualified leads",
    "description": "",
    "functionIds": []
  },
  "positive-operational-more-old-leads-reactivated": {
    "id": "positive-operational-more-old-leads-reactivated",
    "title": "More old leads reactivated",
    "description": "",
    "functionIds": []
  },
  "positive-operational-more-appointments-booked": {
    "id": "positive-operational-more-appointments-booked",
    "title": "More appointments booked",
    "description": "",
    "functionIds": []
  },
  "positive-operational-more-appointments-attended": {
    "id": "positive-operational-more-appointments-attended",
    "title": "More appointments attended",
    "description": "",
    "functionIds": []
  },
  "positive-operational-fewer-unused-appointment-slots": {
    "id": "positive-operational-fewer-unused-appointment-slots",
    "title": "Fewer unused appointment slots",
    "description": "",
    "functionIds": []
  },
  "positive-operational-more-new-buyers": {
    "id": "positive-operational-more-new-buyers",
    "title": "More new buyers",
    "description": "",
    "functionIds": []
  },
  "positive-operational-fewer-lost-existing-buyers": {
    "id": "positive-operational-fewer-lost-existing-buyers",
    "title": "Fewer lost existing buyers",
    "description": "",
    "functionIds": []
  },
  "positive-operational-more-buyers-served": {
    "id": "positive-operational-more-buyers-served",
    "title": "More buyers served",
    "description": "",
    "functionIds": []
  },
  "positive-operational-more-employee-time-available-for-other-work": {
    "id": "positive-operational-more-employee-time-available-for-other-work",
    "title": "More employee time available for other work",
    "description": "",
    "functionIds": []
  },
  "positive-operational-more-tasks-completed": {
    "id": "positive-operational-more-tasks-completed",
    "title": "More tasks completed",
    "description": "",
    "functionIds": []
  },
  "positive-operational-fewer-unpaid-invoices": {
    "id": "positive-operational-fewer-unpaid-invoices",
    "title": "Fewer unpaid invoices",
    "description": "",
    "functionIds": []
  },
  "positive-operational-more-buyer-reviews": {
    "id": "positive-operational-more-buyer-reviews",
    "title": "More buyer reviews",
    "description": "",
    "functionIds": []
  },
  "positive-operational-more-complete-business-information": {
    "id": "positive-operational-more-complete-business-information",
    "title": "More complete business information",
    "description": "",
    "functionIds": []
  },
  "positive-financial-increased-revenue-potential": {
    "id": "positive-financial-increased-revenue-potential",
    "title": "Increased revenue potential",
    "description": "",
    "functionIds": []
  },
  "positive-financial-less-wasted-marketing-spend": {
    "id": "positive-financial-less-wasted-marketing-spend",
    "title": "Less wasted marketing spend",
    "description": "",
    "functionIds": []
  },
  "positive-financial-lower-cost-per-buyer": {
    "id": "positive-financial-lower-cost-per-buyer",
    "title": "Lower cost per buyer",
    "description": "",
    "functionIds": []
  },
  "positive-financial-lower-marketing-costs": {
    "id": "positive-financial-lower-marketing-costs",
    "title": "Lower marketing costs",
    "description": "",
    "functionIds": []
  },
  "positive-financial-lower-employee-costs": {
    "id": "positive-financial-lower-employee-costs",
    "title": "Lower employee costs",
    "description": "",
    "functionIds": []
  },
  "positive-financial-less-wasted-employee-costs": {
    "id": "positive-financial-less-wasted-employee-costs",
    "title": "Less wasted employee costs",
    "description": "",
    "functionIds": []
  },
  "positive-financial-lower-collection-costs": {
    "id": "positive-financial-lower-collection-costs",
    "title": "Lower collection costs",
    "description": "",
    "functionIds": []
  },
  "positive-financial-faster-cash-collection": {
    "id": "positive-financial-faster-cash-collection",
    "title": "Faster cash collection",
    "description": "",
    "functionIds": []
  },
  "positive-financial-less-money-lost-from-unpaid-invoices": {
    "id": "positive-financial-less-money-lost-from-unpaid-invoices",
    "title": "Less money lost from unpaid invoices",
    "description": "",
    "functionIds": []
  }
};

export const negativeToPositive: Record<ImpactKind, Record<string, string>> = {
  "operational": {
    "negative-operational-lost-leads": "positive-operational-fewer-lost-leads",
    "negative-operational-lost-qualified-leads": "positive-operational-fewer-lost-qualified-leads",
    "negative-operational-fewer-old-leads-reactivated": "positive-operational-more-old-leads-reactivated",
    "negative-operational-fewer-appointments-booked": "positive-operational-more-appointments-booked",
    "negative-operational-fewer-appointments-attended": "positive-operational-more-appointments-attended",
    "negative-operational-unused-appointment-slots": "positive-operational-fewer-unused-appointment-slots",
    "negative-operational-fewer-new-customers": "positive-operational-more-new-buyers",
    "negative-operational-lost-existing-customers": "positive-operational-fewer-lost-existing-buyers",
    "negative-operational-fewer-customers-served": "positive-operational-more-buyers-served",
    "negative-operational-less-staff-time-available-for-other-work": "positive-operational-more-employee-time-available-for-other-work",
    "negative-operational-fewer-tasks-completed": "positive-operational-more-tasks-completed",
    "negative-operational-more-unpaid-invoices": "positive-operational-fewer-unpaid-invoices",
    "negative-operational-fewer-customer-reviews": "positive-operational-more-buyer-reviews",
    "negative-operational-missing-business-information": "positive-operational-more-complete-business-information"
  },
  "financial": {
    "negative-financial-lost-potential-revenue": "positive-financial-increased-revenue-potential",
    "negative-financial-wasted-marketing-spend": "positive-financial-less-wasted-marketing-spend",
    "negative-financial-higher-cost-per-customer": "positive-financial-lower-cost-per-buyer",
    "negative-financial-higher-marketing-costs": "positive-financial-lower-marketing-costs",
    "negative-financial-higher-staffing-costs": "positive-financial-lower-employee-costs",
    "negative-financial-wasted-staffing-costs": "positive-financial-less-wasted-employee-costs",
    "negative-financial-higher-collection-costs": "positive-financial-lower-collection-costs",
    "negative-financial-delayed-cash-collection": "positive-financial-faster-cash-collection",
    "negative-financial-money-lost-from-unpaid-invoices": "positive-financial-less-money-lost-from-unpaid-invoices"
  }
};

export const solutionOutcomeIds: Record<string, Record<ImpactKind, string[]>> = {
  "inbound": {
    "operational": [
      "positive-operational-fewer-lost-leads",
      "positive-operational-fewer-lost-qualified-leads",
      "positive-operational-more-appointments-booked",
      "positive-operational-more-buyers-served",
      "positive-operational-fewer-lost-existing-buyers",
      "positive-operational-more-employee-time-available-for-other-work"
    ],
    "financial": [
      "positive-financial-increased-revenue-potential",
      "positive-financial-less-wasted-marketing-spend",
      "positive-financial-lower-cost-per-buyer",
      "positive-financial-lower-employee-costs",
      "positive-financial-less-wasted-employee-costs"
    ]
  },
  "speed": {
    "operational": [
      "positive-operational-fewer-lost-leads",
      "positive-operational-fewer-lost-qualified-leads",
      "positive-operational-more-appointments-booked",
      "positive-operational-more-new-buyers",
      "positive-operational-more-employee-time-available-for-other-work"
    ],
    "financial": [
      "positive-financial-increased-revenue-potential",
      "positive-financial-less-wasted-marketing-spend",
      "positive-financial-lower-cost-per-buyer",
      "positive-financial-lower-employee-costs",
      "positive-financial-less-wasted-employee-costs"
    ]
  },
  "revival": {
    "operational": [
      "positive-operational-more-old-leads-reactivated",
      "positive-operational-fewer-lost-leads",
      "positive-operational-fewer-lost-qualified-leads",
      "positive-operational-more-appointments-booked",
      "positive-operational-more-new-buyers",
      "positive-operational-more-employee-time-available-for-other-work"
    ],
    "financial": [
      "positive-financial-increased-revenue-potential",
      "positive-financial-less-wasted-marketing-spend",
      "positive-financial-lower-cost-per-buyer",
      "positive-financial-lower-marketing-costs",
      "positive-financial-lower-employee-costs",
      "positive-financial-less-wasted-employee-costs"
    ]
  },
  "guardian": {
    "operational": [
      "positive-operational-more-appointments-attended",
      "positive-operational-fewer-unused-appointment-slots",
      "positive-operational-more-buyers-served",
      "positive-operational-more-employee-time-available-for-other-work"
    ],
    "financial": [
      "positive-financial-increased-revenue-potential",
      "positive-financial-less-wasted-employee-costs",
      "positive-financial-lower-employee-costs"
    ]
  },
  "support": {
    "operational": [
      "positive-operational-more-buyers-served",
      "positive-operational-fewer-lost-existing-buyers",
      "positive-operational-more-employee-time-available-for-other-work",
      "positive-operational-more-tasks-completed"
    ],
    "financial": [
      "positive-financial-increased-revenue-potential",
      "positive-financial-lower-employee-costs",
      "positive-financial-less-wasted-employee-costs"
    ]
  },
  "payments": {
    "operational": [
      "positive-operational-fewer-unpaid-invoices",
      "positive-operational-more-employee-time-available-for-other-work"
    ],
    "financial": [
      "positive-financial-faster-cash-collection",
      "positive-financial-less-money-lost-from-unpaid-invoices",
      "positive-financial-lower-collection-costs"
    ]
  },
  "reviews": {
    "operational": [
      "positive-operational-more-buyer-reviews",
      "positive-operational-more-new-buyers"
    ],
    "financial": [
      "positive-financial-increased-revenue-potential",
      "positive-financial-lower-cost-per-buyer"
    ]
  },
  "dashboard": {
    "operational": [
      "positive-operational-more-complete-business-information"
    ],
    "financial": []
  },
  "crm": {
    "operational": [
      "positive-operational-more-complete-business-information"
    ],
    "financial": []
  }
};

export const financialOutcomeConditions = [
  "Lower employee costs require an actual reduction in employee expenses.",
  "Less wasted employee costs can represent better use of paid employee time without necessarily reducing cash expenses.",
  "Lower marketing costs require an actual reduction in marketing expenses.",
  "Less wasted marketing spend requires better results from existing marketing spending.",
  "Lower cost per buyer depends on acquisition costs relative to the number of buyers acquired.",
  "Increased revenue potential becomes additional revenue when additional purchases occur.",
  "Faster cash collection does not independently represent additional revenue.",
  "Less money lost from unpaid invoices requires the recovery of payments that would otherwise remain unrecoverable."
];
