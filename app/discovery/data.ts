// Centralized knowledge library. Sample outcome content is not a finalized offer specification.
import { solutionFunctionReferences } from "./functions";
export type ImpactKind = "operational" | "financial";
export type Impact = { id: string; label: string };
export type Outcome = { id: string; title: string; description: string; functionIds: string[] };
export type AgentIcon = "inbound" | "speed" | "revival" | "guardian" | "generic";
export type SolutionKind = "voice-agent" | "shared-feature";
export type Agent = { id: string; name: string; kind: SolutionKind; icon: AgentIcon; overview: string; temporary: boolean; functionIds: string[]; legacyPreviewFunctions?: { id: string; text: string }[]; operationalOutcomes: Outcome[]; financialOutcomes: Outcome[] };
export type Link = { kind: ImpactKind; impactId: string; agentId: string; outcomeId: string };
export type PreviewOutcome = Pick<Link, "kind" | "agentId" | "outcomeId">;
export type ProblemSolutionRelationship = {
  problemId: string;
  solutionId: string;
  type: "direct" | "conditional";
  condition: string;
  negativeOperationalImpactIds: string[];
  negativeFinancialImpactIds: string[];
  positiveOperationalOutcomeIds: string[];
  positiveFinancialOutcomeIds: string[];
  functionIds: string[];
  operationalOutcomeExplanations: { outcomeId: string; description: string }[];
  financialOutcomeExplanations: { outcomeId: string; description: string }[];
};
export type Problem = { id: string; name: string; operationalImpacts: Impact[]; financialImpacts: Impact[]; solutions: ProblemSolutionRelationship[]; links: Link[]; previewOutcomes?: PreviewOutcome[] };

// The relationship conditions are internal data only. Detailed mappings remain pending.
function relationship(problemId: string, solutionId: string, type: ProblemSolutionRelationship["type"], condition: string): ProblemSolutionRelationship {
  return { problemId, solutionId, type, condition, negativeOperationalImpactIds: [], negativeFinancialImpactIds: [], positiveOperationalOutcomeIds: [], positiveFinancialOutcomeIds: [], functionIds: [], operationalOutcomeExplanations: [], financialOutcomeExplanations: [] };
}

// Approved unified negative impact libraries. Shared IDs do not share checkbox state.
export const negativeOperationalImpacts = {
  "lost-leads": { id: "negative-operational-lost-leads", label: "Lost leads" },
  "lost-qualified-leads": { id: "negative-operational-lost-qualified-leads", label: "Lost qualified leads" },
  "fewer-old-leads-reactivated": { id: "negative-operational-fewer-old-leads-reactivated", label: "Fewer old leads reactivated" },
  "fewer-appointments-booked": { id: "negative-operational-fewer-appointments-booked", label: "Fewer appointments booked" },
  "fewer-appointments-attended": { id: "negative-operational-fewer-appointments-attended", label: "Fewer appointments attended" },
  "unused-appointment-slots": { id: "negative-operational-unused-appointment-slots", label: "Unused appointment slots" },
  "fewer-new-customers": { id: "negative-operational-fewer-new-customers", label: "Fewer new customers" },
  "lost-existing-customers": { id: "negative-operational-lost-existing-customers", label: "Lost existing customers" },
  "fewer-customers-served": { id: "negative-operational-fewer-customers-served", label: "Fewer customers served" },
  "less-staff-time-available-for-other-work": { id: "negative-operational-less-staff-time-available-for-other-work", label: "Less staff time available for other work" },
  "fewer-tasks-completed": { id: "negative-operational-fewer-tasks-completed", label: "Fewer tasks completed" },
  "more-unpaid-invoices": { id: "negative-operational-more-unpaid-invoices", label: "More unpaid invoices" },
  "fewer-customer-reviews": { id: "negative-operational-fewer-customer-reviews", label: "Fewer customer reviews" },
  "missing-business-information": { id: "negative-operational-missing-business-information", label: "Missing business information" },
} satisfies Record<string, Impact>;

export const negativeFinancialImpacts = {
  "lost-potential-revenue": { id: "negative-financial-lost-potential-revenue", label: "Lost potential revenue" },
  "wasted-marketing-spend": { id: "negative-financial-wasted-marketing-spend", label: "Wasted marketing spend" },
  "higher-cost-per-customer": { id: "negative-financial-higher-cost-per-customer", label: "Higher cost per customer" },
  "higher-marketing-costs": { id: "negative-financial-higher-marketing-costs", label: "Higher marketing costs" },
  "higher-staffing-costs": { id: "negative-financial-higher-staffing-costs", label: "Higher staffing costs" },
  "wasted-staffing-costs": { id: "negative-financial-wasted-staffing-costs", label: "Wasted staffing costs" },
  "higher-collection-costs": { id: "negative-financial-higher-collection-costs", label: "Higher collection costs" },
  "delayed-cash-collection": { id: "negative-financial-delayed-cash-collection", label: "Delayed cash collection" },
  "money-lost-from-unpaid-invoices": { id: "negative-financial-money-lost-from-unpaid-invoices", label: "Money lost from unpaid invoices" },
} satisfies Record<string, Impact>;

// Approved negative impacts; positive mappings are pending. Preview outcomes preserve the previous All benefits samples without an impact ID.
export const problems: Problem[] = [
  {
    id: "problem-1",
    name: "Missed calls",
    operationalImpacts: [negativeOperationalImpacts["lost-leads"]],
    financialImpacts: [negativeFinancialImpacts["lost-potential-revenue"], negativeFinancialImpacts["wasted-marketing-spend"], negativeFinancialImpacts["higher-cost-per-customer"]],
    solutions: [
      relationship("problem-1", "inbound", "direct", "Direct match."),
    ],
    links: [],
    previewOutcomes: [{"kind":"operational","agentId":"inbound","outcomeId":"operational-1"},{"kind":"operational","agentId":"inbound","outcomeId":"operational-2"},{"kind":"operational","agentId":"inbound","outcomeId":"operational-3"},{"kind":"financial","agentId":"inbound","outcomeId":"financial-1"},{"kind":"financial","agentId":"inbound","outcomeId":"financial-2"},{"kind":"financial","agentId":"inbound","outcomeId":"financial-3"}],
  },
  {
    id: "problem-2",
    name: "Calls outside working hours",
    operationalImpacts: [negativeOperationalImpacts["lost-leads"]],
    financialImpacts: [negativeFinancialImpacts["lost-potential-revenue"], negativeFinancialImpacts["wasted-marketing-spend"]],
    solutions: [
      relationship("problem-2", "inbound", "direct", "Direct match for unanswered incoming calls outside working hours."),
    ],
    links: [],
  },
  {
    id: "problem-3",
    name: "Missed bookings during calls",
    operationalImpacts: [negativeOperationalImpacts["fewer-appointments-booked"]],
    financialImpacts: [negativeFinancialImpacts["lost-potential-revenue"]],
    solutions: [
      relationship("problem-3", "inbound", "conditional", "Inbound applies to incoming calls."),
      relationship("problem-3", "speed", "conditional", "Speed-to-Lead applies to calls to new leads."),
      relationship("problem-3", "revival", "conditional", "Lead Revival applies to calls to old leads."),
    ],
    links: [],
  },
  {
    id: "problem-4",
    name: "Urgent calls not reaching employees",
    operationalImpacts: [negativeOperationalImpacts["fewer-customers-served"], negativeOperationalImpacts["lost-existing-customers"]],
    financialImpacts: [negativeFinancialImpacts["lost-potential-revenue"]],
    solutions: [
      relationship("problem-4", "inbound", "conditional", "Routes urgent incoming calls to staff according to configured routing rules."),
    ],
    links: [],
  },
  {
    id: "problem-5",
    name: "Slow response to new leads",
    operationalImpacts: [negativeOperationalImpacts["lost-leads"]],
    financialImpacts: [negativeFinancialImpacts["lost-potential-revenue"], negativeFinancialImpacts["wasted-marketing-spend"], negativeFinancialImpacts["higher-cost-per-customer"]],
    solutions: [
      relationship("problem-5", "speed", "direct", "Direct match."),
    ],
    links: [],
    previewOutcomes: [{"kind":"operational","agentId":"speed","outcomeId":"operational-1"},{"kind":"operational","agentId":"speed","outcomeId":"operational-2"},{"kind":"operational","agentId":"speed","outcomeId":"operational-3"},{"kind":"financial","agentId":"speed","outcomeId":"financial-1"},{"kind":"financial","agentId":"speed","outcomeId":"financial-2"}],
  },
  {
    id: "problem-6",
    name: "New leads never called",
    operationalImpacts: [negativeOperationalImpacts["lost-leads"]],
    financialImpacts: [negativeFinancialImpacts["lost-potential-revenue"], negativeFinancialImpacts["wasted-marketing-spend"], negativeFinancialImpacts["higher-cost-per-customer"]],
    solutions: [
      relationship("problem-6", "speed", "direct", "Direct match."),
    ],
    links: [],
  },
  {
    id: "problem-7",
    name: "Late lead qualifications",
    operationalImpacts: [negativeOperationalImpacts["lost-qualified-leads"]],
    financialImpacts: [negativeFinancialImpacts["lost-potential-revenue"], negativeFinancialImpacts["higher-cost-per-customer"]],
    solutions: [
      relationship("problem-7", "speed", "conditional", "Speed-to-Lead applies to new outbound leads."),
      relationship("problem-7", "inbound", "conditional", "Inbound applies to leads calling the business."),
    ],
    links: [],
  },
  {
    id: "problem-8",
    name: "Warm leads not contacted",
    operationalImpacts: [negativeOperationalImpacts["lost-leads"]],
    financialImpacts: [negativeFinancialImpacts["lost-potential-revenue"], negativeFinancialImpacts["wasted-marketing-spend"]],
    solutions: [
      relationship("problem-8", "speed", "conditional", "Speed-to-Lead applies to new leads within the configured follow-up process."),
      relationship("problem-8", "revival", "conditional", "Lead Revival applies to old leads."),
    ],
    links: [],
  },
  {
    id: "problem-9",
    name: "Old leads not called",
    operationalImpacts: [negativeOperationalImpacts["fewer-old-leads-reactivated"]],
    financialImpacts: [negativeFinancialImpacts["lost-potential-revenue"], negativeFinancialImpacts["higher-marketing-costs"]],
    solutions: [
      relationship("problem-9", "revival", "direct", "Direct match."),
    ],
    links: [],
    previewOutcomes: [{"kind":"operational","agentId":"revival","outcomeId":"operational-1"},{"kind":"operational","agentId":"revival","outcomeId":"operational-2"},{"kind":"operational","agentId":"revival","outcomeId":"operational-3"},{"kind":"financial","agentId":"revival","outcomeId":"financial-1"},{"kind":"financial","agentId":"revival","outcomeId":"financial-2"}],
  },
  {
    id: "problem-10",
    name: "Inconsistent follow-up with old leads",
    operationalImpacts: [negativeOperationalImpacts["fewer-old-leads-reactivated"], negativeOperationalImpacts["lost-leads"]],
    financialImpacts: [negativeFinancialImpacts["lost-potential-revenue"], negativeFinancialImpacts["higher-marketing-costs"]],
    solutions: [
      relationship("problem-10", "revival", "conditional", "Follow-up must be configured according to the business's requirements."),
    ],
    links: [],
  },
  {
    id: "problem-11",
    name: "Warm old leads not contacted again",
    operationalImpacts: [negativeOperationalImpacts["lost-leads"]],
    financialImpacts: [negativeFinancialImpacts["lost-potential-revenue"], negativeFinancialImpacts["higher-marketing-costs"]],
    solutions: [
      relationship("problem-11", "revival", "conditional", "Further contact must be included in the configured follow-up process."),
    ],
    links: [],
  },
  {
    id: "problem-12",
    name: "Missed appointment reminders",
    operationalImpacts: [negativeOperationalImpacts["fewer-appointments-attended"], negativeOperationalImpacts["unused-appointment-slots"]],
    financialImpacts: [negativeFinancialImpacts["lost-potential-revenue"], negativeFinancialImpacts["wasted-staffing-costs"]],
    solutions: [
      relationship("problem-12", "guardian", "direct", "Direct match."),
    ],
    links: [],
  },
  {
    id: "problem-13",
    name: "Unconfirmed appointments",
    operationalImpacts: [negativeOperationalImpacts["fewer-appointments-attended"], negativeOperationalImpacts["unused-appointment-slots"]],
    financialImpacts: [negativeFinancialImpacts["lost-potential-revenue"], negativeFinancialImpacts["wasted-staffing-costs"]],
    solutions: [
      relationship("problem-13", "guardian", "direct", "Direct match."),
    ],
    links: [],
  },
  {
    id: "problem-14",
    name: "Appointment no-shows",
    operationalImpacts: [negativeOperationalImpacts["unused-appointment-slots"], negativeOperationalImpacts["fewer-customers-served"]],
    financialImpacts: [negativeFinancialImpacts["lost-potential-revenue"], negativeFinancialImpacts["wasted-staffing-costs"]],
    solutions: [
      relationship("problem-14", "guardian", "direct", "Addresses no-shows through reminders, confirmations and rescheduling."),
    ],
    links: [],
    previewOutcomes: [{"kind":"operational","agentId":"guardian","outcomeId":"operational-1"},{"kind":"operational","agentId":"guardian","outcomeId":"operational-2"},{"kind":"operational","agentId":"guardian","outcomeId":"operational-3"},{"kind":"financial","agentId":"guardian","outcomeId":"financial-1"},{"kind":"financial","agentId":"guardian","outcomeId":"financial-2"}],
  },
  {
    id: "problem-15",
    name: "Time-consuming appointment rescheduling",
    operationalImpacts: [negativeOperationalImpacts["fewer-appointments-attended"], negativeOperationalImpacts["less-staff-time-available-for-other-work"]],
    financialImpacts: [negativeFinancialImpacts["lost-potential-revenue"], negativeFinancialImpacts["higher-staffing-costs"]],
    solutions: [
      relationship("problem-15", "guardian", "direct", "Direct match."),
    ],
    links: [],
  },
  {
    id: "problem-16",
    name: "Empty slots after cancellations",
    operationalImpacts: [negativeOperationalImpacts["fewer-customers-served"]],
    financialImpacts: [negativeFinancialImpacts["lost-potential-revenue"], negativeFinancialImpacts["wasted-staffing-costs"]],
    solutions: [
      relationship("problem-16", "guardian", "conditional", "Conditional match. Earlier cancellations and rescheduling may give staff more time to fill available slots. Do not assume that the agent automatically finds replacement customers."),
    ],
    links: [],
  },
  {
    id: "problem-17",
    name: "Many routine questions",
    operationalImpacts: [negativeOperationalImpacts["less-staff-time-available-for-other-work"], negativeOperationalImpacts["fewer-tasks-completed"]],
    financialImpacts: [negativeFinancialImpacts["higher-staffing-costs"], negativeFinancialImpacts["wasted-staffing-costs"], negativeFinancialImpacts["lost-potential-revenue"]],
    solutions: [
      relationship("problem-17", "support", "conditional", "Customer Support handles routine customer questions."),
      relationship("problem-17", "inbound", "conditional", "Inbound handles routine questions received during incoming calls."),
    ],
    links: [],
  },
  {
    id: "problem-18",
    name: "Slow answers to simple questions",
    operationalImpacts: [negativeOperationalImpacts["fewer-customers-served"], negativeOperationalImpacts["lost-existing-customers"]],
    financialImpacts: [negativeFinancialImpacts["lost-potential-revenue"]],
    solutions: [
      relationship("problem-18", "support", "conditional", "Customer Support handles routine customer questions."),
      relationship("problem-18", "inbound", "conditional", "Inbound handles approved questions during incoming calls."),
    ],
    links: [],
  },
  {
    id: "problem-19",
    name: "Employees answering the same questions",
    operationalImpacts: [negativeOperationalImpacts["less-staff-time-available-for-other-work"]],
    financialImpacts: [negativeFinancialImpacts["wasted-staffing-costs"], negativeFinancialImpacts["higher-staffing-costs"]],
    solutions: [
      relationship("problem-19", "support", "conditional", "Depends on where and how staff receive those questions. Answering routine customer questions and handling supported requests."),
      relationship("problem-19", "inbound", "conditional", "Depends on where and how staff receive those questions. Answering incoming calls."),
    ],
    links: [],
  },
  {
    id: "problem-20",
    name: "Too much manual work",
    operationalImpacts: [negativeOperationalImpacts["less-staff-time-available-for-other-work"], negativeOperationalImpacts["fewer-tasks-completed"], negativeOperationalImpacts["fewer-customers-served"]],
    financialImpacts: [negativeFinancialImpacts["higher-staffing-costs"], negativeFinancialImpacts["wasted-staffing-costs"], negativeFinancialImpacts["lost-potential-revenue"]],
    solutions: [
      relationship("problem-20", "inbound", "conditional", "Each solution applies only if its specific tasks form part of the manual workload. Answering incoming calls."),
      relationship("problem-20", "speed", "conditional", "Each solution applies only if its specific tasks form part of the manual workload. Calling and qualifying new leads."),
      relationship("problem-20", "revival", "conditional", "Each solution applies only if its specific tasks form part of the manual workload. Following up with old leads."),
      relationship("problem-20", "guardian", "conditional", "Each solution applies only if its specific tasks form part of the manual workload. Confirming and rescheduling appointments."),
      relationship("problem-20", "support", "conditional", "Each solution applies only if its specific tasks form part of the manual workload. Answering routine customer questions and handling supported requests."),
      relationship("problem-20", "payments", "conditional", "Each solution applies only if its specific tasks form part of the manual workload. Following up on outstanding payments."),
      relationship("problem-20", "reviews", "conditional", "Each solution applies only if its specific tasks form part of the manual workload. Requesting customer reviews."),
      relationship("problem-20", "crm", "conditional", "Each solution applies only if its specific tasks form part of the manual workload. Manually entering lead information."),
    ],
    links: [],
  },
  {
    id: "problem-21",
    name: "Basic buyer requests not handled",
    operationalImpacts: [negativeOperationalImpacts["fewer-customers-served"], negativeOperationalImpacts["lost-existing-customers"]],
    financialImpacts: [negativeFinancialImpacts["lost-potential-revenue"]],
    solutions: [
      relationship("problem-21", "support", "conditional", "Applies to supported customer requests."),
    ],
    links: [],
  },
  {
    id: "problem-22",
    name: "Missed payment reminders",
    operationalImpacts: [negativeOperationalImpacts["more-unpaid-invoices"]],
    financialImpacts: [negativeFinancialImpacts["delayed-cash-collection"]],
    solutions: [
      relationship("problem-22", "payments", "direct", "Direct match."),
    ],
    links: [],
  },
  {
    id: "problem-23",
    name: "Invoices not followed up regularly",
    operationalImpacts: [negativeOperationalImpacts["more-unpaid-invoices"]],
    financialImpacts: [negativeFinancialImpacts["delayed-cash-collection"], negativeFinancialImpacts["money-lost-from-unpaid-invoices"], negativeFinancialImpacts["higher-collection-costs"]],
    solutions: [
      relationship("problem-23", "payments", "direct", "Direct match."),
    ],
    links: [],
  },
  {
    id: "problem-24",
    name: "Buyers not asked for reviews",
    operationalImpacts: [negativeOperationalImpacts["fewer-customer-reviews"], negativeOperationalImpacts["fewer-new-customers"]],
    financialImpacts: [negativeFinancialImpacts["lost-potential-revenue"], negativeFinancialImpacts["higher-cost-per-customer"]],
    solutions: [
      relationship("problem-24", "reviews", "direct", "Direct match."),
    ],
    links: [],
  },
  {
    id: "problem-25",
    name: "Missing call recordings and outcomes",
    operationalImpacts: [negativeOperationalImpacts["missing-business-information"]],
    financialImpacts: [],
    solutions: [
      relationship("problem-25", "dashboard", "direct", "Provides access to call activity, recordings, transcripts and outcomes."),
    ],
    links: [],
  },
  {
    id: "problem-26",
    name: "Lead details not updated in CRM",
    operationalImpacts: [negativeOperationalImpacts["missing-business-information"], negativeOperationalImpacts["lost-leads"]],
    financialImpacts: [negativeFinancialImpacts["lost-potential-revenue"], negativeFinancialImpacts["wasted-marketing-spend"]],
    solutions: [
      relationship("problem-26", "crm", "direct", "Records collected information and call outcomes through configured CRM connections."),
    ],
    links: [],
  },
  {
    id: "problem-27",
    name: "Hard to see what the AI agent is doing",
    operationalImpacts: [negativeOperationalImpacts["missing-business-information"]],
    financialImpacts: [],
    solutions: [
      relationship("problem-27", "dashboard", "direct", "Displays agent activity, call activity, booking outcomes, failed requests and call quality scores."),
    ],
    links: [],
  },
  {
    id: "problem-28",
    name: "Employees overloaded",
    operationalImpacts: [negativeOperationalImpacts["fewer-tasks-completed"], negativeOperationalImpacts["fewer-customers-served"], negativeOperationalImpacts["lost-leads"]],
    financialImpacts: [negativeFinancialImpacts["higher-staffing-costs"], negativeFinancialImpacts["lost-potential-revenue"]],
    solutions: [
      relationship("problem-28", "inbound", "conditional", "Each solution applies only if its specific tasks contribute to the staff's workload. Answering incoming calls."),
      relationship("problem-28", "speed", "conditional", "Each solution applies only if its specific tasks contribute to the staff's workload. Calling and qualifying new leads."),
      relationship("problem-28", "revival", "conditional", "Each solution applies only if its specific tasks contribute to the staff's workload. Following up with old leads."),
      relationship("problem-28", "guardian", "conditional", "Each solution applies only if its specific tasks contribute to the staff's workload. Confirming and rescheduling appointments."),
      relationship("problem-28", "support", "conditional", "Each solution applies only if its specific tasks contribute to the staff's workload. Answering routine customer questions and handling supported requests."),
      relationship("problem-28", "payments", "conditional", "Each solution applies only if its specific tasks contribute to the staff's workload. Following up on outstanding payments."),
      relationship("problem-28", "reviews", "conditional", "Each solution applies only if its specific tasks contribute to the staff's workload. Requesting customer reviews."),
    ],
    links: [],
  },
];

export const agents: Record<string, Agent> = {
  "inbound": {
    "id": "inbound",
    "name": "Inbound Agent",
    "kind": "voice-agent",
    "icon": "inbound",
    "temporary": true,
    "operationalOutcomes": [
      {
        "id": "operational-1",
        "title": "More potential buyers reached and qualified",
        "description": "The agent answers incoming calls and asks qualification questions. Interested callers can complete qualification instead of leaving without speaking to the business.",
        "functionIds": [
          "answer",
          "qualify"
        ]
      },
      {
        "id": "operational-2",
        "title": "More appointments booked",
        "description": "The agent checks calendar availability and books suitable callers during the conversation, without waiting for an employee to arrange the appointment.",
        "functionIds": [
          "answer",
          "book"
        ]
      },
      {
        "id": "operational-3",
        "title": "More urgent callers connected to employees",
        "description": "The agent identifies urgent calls and routes them to the designated employee when configured.",
        "functionIds": [
          "answer",
          "route"
        ]
      }
    ],
    "financialOutcomes": [
      {
        "id": "financial-1",
        "title": "Potential additional sales revenue",
        "description": "By answering calls, qualifying interested buyers and booking appointments, the agent can recover sales opportunities. Additional revenue depends on how many of those opportunities turn into sales.",
        "functionIds": [
          "answer",
          "qualify",
          "book"
        ]
      },
      {
        "id": "financial-2",
        "title": "Potentially more value from existing marketing spend",
        "description": "Answering and qualifying callers gives the business more opportunities to convert leads it has already paid to attract.",
        "functionIds": [
          "answer",
          "qualify"
        ]
      },
      {
        "id": "financial-3",
        "title": "Potentially lower call-handling costs",
        "description": "Handling routine calls and bookings can reduce the employees' time needed for those tasks. Actual cost savings depend on staffing changes.",
        "functionIds": [
          "answer",
          "qualify",
          "book"
        ]
      }
    ],
    "legacyPreviewFunctions": [
      {
        "id": "answer",
        "text": "Answers incoming calls around the clock."
      },
      {
        "id": "qualify",
        "text": "Asks qualification questions."
      },
      {
        "id": "book",
        "text": "Checks calendar availability and books suitable callers."
      },
      {
        "id": "route",
        "text": "Routes urgent callers to the appropriate employee, when configured."
      }
    ],
    overview: solutionFunctionReferences["inbound"].overview,
    functionIds: solutionFunctionReferences["inbound"].functionIds
  },
  "speed": {
    "id": "speed",
    "name": "Speed-to-Lead Agent",
    "kind": "voice-agent",
    "icon": "speed",
    "temporary": true,
    "operationalOutcomes": [
      {
        "id": "operational-1",
        "title": "More new leads contacted promptly",
        "description": "The agent initiates contact when a lead arrives instead of waiting for an employee to become available.",
        "functionIds": [
          "contact"
        ]
      },
      {
        "id": "operational-2",
        "title": "More new leads qualified",
        "description": "The agent asks qualification questions while the lead is available to speak.",
        "functionIds": [
          "contact",
          "qualify"
        ]
      },
      {
        "id": "operational-3",
        "title": "More appointments booked",
        "description": "The agent offers suitable appointment times to interested leads during the conversation.",
        "functionIds": [
          "contact",
          "book"
        ]
      }
    ],
    "financialOutcomes": [
      {
        "id": "financial-1",
        "title": "Potential additional sales revenue",
        "description": "Earlier contact and qualification can create more sales opportunities. Revenue depends on whether those opportunities convert.",
        "functionIds": [
          "contact",
          "qualify",
          "book"
        ]
      },
      {
        "id": "financial-2",
        "title": "Potentially more value from existing marketing spend",
        "description": "Prompt contact can help the business reach more of the leads it has paid to acquire.",
        "functionIds": [
          "contact",
          "qualify"
        ]
      }
    ],
    "legacyPreviewFunctions": [
      {
        "id": "contact",
        "text": "Initiates contact when a new lead is received."
      },
      {
        "id": "qualify",
        "text": "Asks the lead qualification questions."
      },
      {
        "id": "book",
        "text": "Checks availability and offers suitable appointment times."
      }
    ],
    overview: solutionFunctionReferences["speed"].overview,
    functionIds: solutionFunctionReferences["speed"].functionIds
  },
  "revival": {
    "id": "revival",
    "name": "Lead Revival Agent",
    "kind": "voice-agent",
    "icon": "revival",
    "temporary": true,
    "operationalOutcomes": [
      {
        "id": "operational-1",
        "title": "More old leads contacted",
        "description": "The agent works through the approved list and attempts to reconnect with old leads.",
        "functionIds": [
          "contact"
        ]
      },
      {
        "id": "operational-2",
        "title": "More interested old leads identified",
        "description": "The agent asks whether the lead still has a need and records their response.",
        "functionIds": [
          "contact",
          "qualify"
        ]
      },
      {
        "id": "operational-3",
        "title": "More appointments booked from old leads",
        "description": "The agent offers available appointments to interested, suitable leads.",
        "functionIds": [
          "qualify",
          "book"
        ]
      }
    ],
    "financialOutcomes": [
      {
        "id": "financial-1",
        "title": "Potential additional sales revenue",
        "description": "Reconnecting with previously interested leads can create new sales opportunities without requiring every opportunity to come from a new lead.",
        "functionIds": [
          "contact",
          "qualify",
          "book"
        ]
      },
      {
        "id": "financial-2",
        "title": "Potentially more value from previously acquired leads",
        "description": "Contacting eligible old leads can create additional opportunities from leads the business has already acquired.",
        "functionIds": [
          "contact",
          "qualify"
        ]
      }
    ],
    "legacyPreviewFunctions": [
      {
        "id": "contact",
        "text": "Contacts eligible old leads using an approved list."
      },
      {
        "id": "qualify",
        "text": "Asks whether the lead is still interested and qualifies their needs."
      },
      {
        "id": "book",
        "text": "Offers appointment times to suitable interested leads."
      }
    ],
    overview: solutionFunctionReferences["revival"].overview,
    functionIds: solutionFunctionReferences["revival"].functionIds
  },
  "guardian": {
    "id": "guardian",
    "name": "Appointment Guardian Agent",
    "kind": "voice-agent",
    "icon": "guardian",
    "temporary": true,
    "operationalOutcomes": [
      {
        "id": "operational-1",
        "title": "More buyers reminded before appointments",
        "description": "The agent sends reminders before scheduled appointments so buyers have an opportunity to prepare.",
        "functionIds": [
          "remind"
        ]
      },
      {
        "id": "operational-2",
        "title": "More appointments confirmed in advance",
        "description": "The agent asks buyers to confirm attendance, which can identify appointments at risk of being missed.",
        "functionIds": [
          "remind",
          "confirm"
        ]
      },
      {
        "id": "operational-3",
        "title": "More appointments rescheduled when needed",
        "description": "The agent offers another available time to buyers who cannot attend the original appointment.",
        "functionIds": [
          "confirm",
          "reschedule"
        ]
      }
    ],
    "financialOutcomes": [
      {
        "id": "financial-1",
        "title": "Potential additional revenue from attended appointments",
        "description": "Reminders and rescheduling may help more buyers attend. Additional revenue depends on attendance and subsequent sales.",
        "functionIds": [
          "remind",
          "confirm",
          "reschedule"
        ]
      },
      {
        "id": "financial-2",
        "title": "Potentially less wasted employees' time",
        "description": "Confirmations and rescheduling can give employees advance notice of some missed appointments and help them use their time more effectively.",
        "functionIds": [
          "confirm",
          "reschedule"
        ]
      }
    ],
    "legacyPreviewFunctions": [
      {
        "id": "remind",
        "text": "Sends appointment reminders using configured channels."
      },
      {
        "id": "confirm",
        "text": "Asks buyers to confirm whether they will attend."
      },
      {
        "id": "reschedule",
        "text": "Offers available alternative appointment times when needed."
      }
    ],
    overview: solutionFunctionReferences["guardian"].overview,
    functionIds: solutionFunctionReferences["guardian"].functionIds
  },
  "support": {
    "id": "support",
    "name": "Customer Support Agent",
    "kind": "voice-agent",
    "icon": "generic",
    "temporary": false,
    "operationalOutcomes": [],
    "financialOutcomes": [],
    overview: solutionFunctionReferences["support"].overview,
    functionIds: solutionFunctionReferences["support"].functionIds
  },
  "payments": {
    "id": "payments",
    "name": "Payments & Collections Agent",
    "kind": "voice-agent",
    "icon": "generic",
    "temporary": false,
    "operationalOutcomes": [],
    "financialOutcomes": [],
    overview: solutionFunctionReferences["payments"].overview,
    functionIds: solutionFunctionReferences["payments"].functionIds
  },
  "reviews": {
    "id": "reviews",
    "name": "Review Request Agent",
    "kind": "voice-agent",
    "icon": "generic",
    "temporary": false,
    "operationalOutcomes": [],
    "financialOutcomes": [],
    overview: solutionFunctionReferences["reviews"].overview,
    functionIds: solutionFunctionReferences["reviews"].functionIds
  },
  "dashboard": {
    "id": "dashboard",
    "name": "Smart Dashboard",
    "kind": "shared-feature",
    "icon": "generic",
    "temporary": false,
    "operationalOutcomes": [],
    "financialOutcomes": [],
    overview: solutionFunctionReferences["dashboard"].overview,
    functionIds: solutionFunctionReferences["dashboard"].functionIds
  },
  "crm": {
    "id": "crm",
    "name": "CRM Integration",
    "kind": "shared-feature",
    "icon": "generic",
    "temporary": false,
    "operationalOutcomes": [],
    "financialOutcomes": [],
    overview: solutionFunctionReferences["crm"].overview,
    functionIds: solutionFunctionReferences["crm"].functionIds
  }
};

// Display groups are separate from problem IDs and knowledge relationships.
export const problemCategories = [
  {
    "title": "Leads",
    "problemIds": [
      "problem-1",
      "problem-2",
      "problem-5",
      "problem-6",
      "problem-7",
      "problem-8",
      "problem-9",
      "problem-10",
      "problem-11"
    ]
  },
  {
    "title": "Appointments",
    "problemIds": [
      "problem-3",
      "problem-12",
      "problem-13",
      "problem-14",
      "problem-15",
      "problem-16"
    ]
  },
  {
    "title": "Buyers",
    "problemIds": [
      "problem-4",
      "problem-18",
      "problem-21"
    ]
  },
  {
    "title": "Employees",
    "problemIds": [
      "problem-17",
      "problem-19",
      "problem-20",
      "problem-28"
    ]
  },
  {
    "title": "Payments",
    "problemIds": [
      "problem-22",
      "problem-23"
    ]
  },
  {
    "title": "Reviews",
    "problemIds": [
      "problem-24"
    ]
  },
  {
    "title": "Business information",
    "problemIds": [
      "problem-25",
      "problem-26",
      "problem-27"
    ]
  }
];
