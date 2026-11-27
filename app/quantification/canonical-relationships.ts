// Registered conditions only. These are not active equations or automatic aliases.
export type RelationshipKind="identity"|"subset"|"disjoint"|"overlap"|"mathematical"|"conditional"|"attribution"|"independent";
export const crossPanelIdentitySpecification=[
  [
    "1",
    "Missed calls",
    "Unique affected leads",
    "Separate quantities; call-to-lead relationship requires additional information"
  ],
  [
    "2",
    "Unanswered calls outside working hours",
    "Unique affected leads",
    "Separate quantities"
  ],
  [
    "3",
    "Missed bookings during calls",
    "Intended bookings",
    "Conditional identity only when both measure the same individual booking opportunities"
  ],
  [
    "4",
    "Urgent calls not reaching employees",
    "Unserved buyers",
    "Separate quantities"
  ],
  [
    "5",
    "New leads with slow responses",
    "Unique affected leads",
    "Shared instance when both measure the same distinct leads"
  ],
  [
    "6",
    "New leads never called",
    "Unique affected leads",
    "Shared instance when the population matches"
  ],
  [
    "7",
    "Late lead qualifications",
    "Affected qualified leads",
    "Separate; qualified leads may form a subset"
  ],
  [
    "8",
    "Warm leads not contacted",
    "Unique affected leads",
    "Shared instance when the population matches"
  ],
  [
    "9",
    "Old leads not called",
    "Affected old leads",
    "Reuse the same affected old lead population"
  ],
  [
    "10",
    "Old leads followed up inconsistently",
    "Affected old leads",
    "Reuse the same population"
  ],
  [
    "10",
    "Old leads followed up inconsistently",
    "Unique affected leads",
    "Reuse when measured as the same distinct leads"
  ],
  [
    "11",
    "Warm old leads not contacted again",
    "Unique affected leads",
    "Reuse when the population matches"
  ],
  [
    "12",
    "Missed appointment reminders",
    "Affected appointments",
    "Conditional identity; reminder events may differ from appointment counts"
  ],
  [
    "13",
    "Unconfirmed appointments",
    "Affected appointments",
    "Reuse when the same appointments are measured"
  ],
  [
    "14",
    "Appointment no-shows",
    "Unused appointment slots",
    "Separate quantities; slots may subsequently be filled"
  ],
  [
    "15",
    "Total time for affected quantity",
    "Total time for affected quantity",
    "Reuse one instance"
  ],
  [
    "15",
    "Time-consuming appointment rescheduling",
    "Affected appointments",
    "Conditional identity when measured as the same appointment occurrences"
  ],
  [
    "16",
    "Empty slots after cancellations",
    "Unused appointment slots",
    "Conditional identity for the same canceled slots"
  ],
  [
    "17",
    "Total time for affected quantity",
    "Total time for affected quantity",
    "Reuse one instance"
  ],
  [
    "18",
    "Simple questions answered slowly",
    "Unserved buyers",
    "Separate counting populations"
  ],
  [
    "19",
    "Total time for affected quantity",
    "Total time for affected quantity",
    "Reuse one instance"
  ],
  [
    "20",
    "Total time for affected quantity",
    "Total time for affected quantity",
    "Reuse one instance"
  ],
  [
    "21",
    "Basic buyer requests not handled",
    "Unserved buyers",
    "Separate quantities"
  ],
  [
    "22",
    "Missed payment reminders",
    "Affected invoices",
    "Separate quantities"
  ],
  [
    "23",
    "Invoices not followed up regularly",
    "Affected invoices",
    "Reuse the same invoice population"
  ],
  [
    "24",
    "Buyers not asked for reviews",
    "Buyers not asked for reviews",
    "Reuse the existing instance"
  ],
  [
    "25",
    "Calls with missing recordings or outcomes",
    "Missing information count",
    "Reuse existing affected call count"
  ],
  [
    "26",
    "Lead details not updated in CRM",
    "Missing information count",
    "Reuse existing affected lead record count"
  ],
  [
    "27",
    "Agent activities not visible",
    "Missing information count",
    "Reuse existing affected activity count"
  ],
  [
    "28",
    "Tasks affected by employee overload",
    "Affected tasks",
    "Reuse when measuring the same tasks"
  ],
  [
    "28",
    "Required staff hours",
    "Required staff hours",
    "Reuse one instance"
  ],
  [
    "28",
    "Available staff hours",
    "Available staff hours",
    "Reuse one instance"
  ]
] as const;
export const financialIdentitySpecification=[
  [
    "Confirmed purchases lost",
    "Confirmed revenue loss and Confirmed contribution profit loss"
  ],
  [
    "Confirmed revenue loss",
    "Confirmed revenue loss and Confirmed contribution profit loss"
  ],
  [
    "Lost potential buyers",
    "Lost potential revenue and Lost potential contribution profit"
  ],
  [
    "Lost potential revenue",
    "Lost potential revenue and Lost potential contribution profit"
  ],
  [
    "Contribution profit margin",
    "Applicable confirmed and estimated contribution profit routes"
  ],
  [
    "Total revenue",
    "Applicable revenue averages and contribution profit calculations"
  ],
  [
    "Total purchases",
    "Revenue and contribution profit per purchase"
  ],
  [
    "Total buyers",
    "Revenue and contribution profit per buyer"
  ],
  [
    "Total contribution profit",
    "Applicable margins and contribution profit averages"
  ],
  [
    "Average cost per paid lead",
    "Higher marketing costs, Wasted marketing costs, Estimated higher marketing costs"
  ],
  [
    "Marketing spend for paid leads",
    "Applicable paid lead cost calculations"
  ],
  [
    "Paid leads acquired",
    "Applicable paid lead cost calculations"
  ],
  [
    "Average cost per additional staff hour",
    "Confirmed and estimated higher staffing costs"
  ],
  [
    "Average cost per collection staff hour",
    "Confirmed and estimated higher collection costs"
  ],
  [
    "Cost per additional employee",
    "Applicable confirmed and estimated employee-cost routes"
  ],
  [
    "Annual interest rate",
    "Applicable confirmed and estimated financing arrangements"
  ],
  [
    "Pending unpaid amount",
    "Confirmed unpaid invoice balance breakdown and estimated unpaid invoice loss"
  ]
] as const;
export const populationRelationshipSpecification=[
  {
    "section": 68,
    "reference": "Total incoming calls",
    "related": "Calls outside working hours",
    "condition": "Subset when coverage and period match"
  },
  {
    "section": 68,
    "reference": "Missed calls",
    "related": "Unanswered calls outside working hours",
    "condition": "Subset when coverage and period match"
  },
  {
    "section": 68,
    "reference": "Answered calls",
    "related": "Answered calls outside working hours",
    "condition": "Subset when coverage and period match"
  },
  {
    "section": 68,
    "reference": "Total incoming calls",
    "related": "Urgent calls",
    "condition": "Conditional subset when urgent calls are incoming calls"
  },
  {
    "section": 68,
    "reference": "Total incoming calls",
    "related": "Calls requiring appointments",
    "condition": "Conditional subset"
  },
  {
    "section": 68,
    "reference": "Missed calls",
    "related": "Urgent calls not reaching employees",
    "condition": "Conditional overlap; routing failure is not necessarily an unanswered call"
  },
  {
    "section": 68,
    "reference": "Missed calls",
    "related": "Unique affected leads",
    "condition": "Attribution; cardinality must be established"
  },
  {
    "section": 68,
    "reference": "Calls requiring appointments",
    "related": "Intended bookings",
    "condition": "Attribution; one call may involve multiple bookings"
  },
  {
    "section": 68,
    "reference": "New leads requiring a response",
    "related": "New leads requiring calls",
    "condition": "Conditional subset or overlap"
  },
  {
    "section": 68,
    "reference": "New leads with slow responses",
    "related": "New leads never called",
    "condition": "Conditional overlap or separate classifications"
  },
  {
    "section": 68,
    "reference": "New leads requiring a response",
    "related": "Leads requiring qualification",
    "condition": "Conditional subset or overlap"
  },
  {
    "section": 68,
    "reference": "New leads requiring calls",
    "related": "Warm leads requiring contact",
    "condition": "Conditional population relationship"
  },
  {
    "section": 68,
    "reference": "Warm leads requiring contact",
    "related": "Warm leads not contacted",
    "condition": "Subset"
  },
  {
    "section": 68,
    "reference": "Old leads requiring calls",
    "related": "Warm old leads requiring further contact",
    "condition": "Conditional subset"
  },
  {
    "section": 68,
    "reference": "Old leads requiring follow-up",
    "related": "Warm old leads requiring further contact",
    "condition": "Conditional subset"
  },
  {
    "section": 68,
    "reference": "Old leads not called",
    "related": "Old leads followed up inconsistently",
    "condition": "Conditional overlap"
  },
  {
    "section": 68,
    "reference": "Warm old leads not contacted again",
    "related": "Old leads not called",
    "condition": "Conditional subset or overlap"
  },
  {
    "section": 68,
    "reference": "Unique affected leads",
    "related": "Affected qualified leads",
    "condition": "Conditional subset when the qualified population comes from those same leads"
  },
  {
    "section": 68,
    "reference": "Lost leads",
    "related": "Lost qualified leads",
    "condition": "Conditional subset when population and loss classification match"
  },
  {
    "section": 69,
    "reference": "Scheduled appointments",
    "related": "Appointments requiring reminders",
    "condition": "Conditional subset"
  },
  {
    "section": 69,
    "reference": "Scheduled appointments",
    "related": "Appointments requiring confirmation",
    "condition": "Conditional subset"
  },
  {
    "section": 69,
    "reference": "Scheduled appointments",
    "related": "Appointments requiring rescheduling",
    "condition": "Conditional subset"
  },
  {
    "section": 69,
    "reference": "Appointments requiring reminders",
    "related": "Appointments requiring confirmation",
    "condition": "Conditional overlap"
  },
  {
    "section": 69,
    "reference": "Missed appointment reminders",
    "related": "Unconfirmed appointments",
    "condition": "Conditional overlap"
  },
  {
    "section": 69,
    "reference": "Missed appointment reminders",
    "related": "Appointment no-shows",
    "condition": "Attribution or overlap"
  },
  {
    "section": 69,
    "reference": "Unconfirmed appointments",
    "related": "Appointment no-shows",
    "condition": "Attribution or overlap"
  },
  {
    "section": 69,
    "reference": "Time-consuming appointment rescheduling",
    "related": "Lost attendance",
    "condition": "Attribution"
  },
  {
    "section": 69,
    "reference": "Appointment no-shows",
    "related": "Unused appointment slots",
    "condition": "Conditional; some slots may subsequently be filled"
  },
  {
    "section": 69,
    "reference": "Canceled appointment slots",
    "related": "Empty slots after cancellations",
    "condition": "Subset"
  },
  {
    "section": 69,
    "reference": "Empty slots after cancellations",
    "related": "Unused appointment slots",
    "condition": "Conditional identity"
  },
  {
    "section": 69,
    "reference": "Lost bookings",
    "related": "Lost attendance",
    "condition": "Different stages; no default equality"
  },
  {
    "section": 69,
    "reference": "Lost attendance",
    "related": "Unserved buyers",
    "condition": "Conditional relationship"
  },
  {
    "section": 69,
    "reference": "Unused appointment slots",
    "related": "Unserved buyers",
    "condition": "Attribution"
  },
  {
    "section": 70,
    "reference": "Questions received",
    "related": "Simple questions received",
    "condition": "Conditional subset"
  },
  {
    "section": 70,
    "reference": "Questions received",
    "related": "Routine questions",
    "condition": "Subset"
  },
  {
    "section": 70,
    "reference": "Questions received",
    "related": "Questions answered by employees",
    "condition": "Conditional subset"
  },
  {
    "section": 70,
    "reference": "Questions answered by employees",
    "related": "Repeated questions answered by employees",
    "condition": "Subset"
  },
  {
    "section": 70,
    "reference": "Routine questions",
    "related": "Repeated questions answered by employees",
    "condition": "Conditional overlap"
  },
  {
    "section": 70,
    "reference": "Routine questions",
    "related": "Simple questions",
    "condition": "Conditional overlap"
  },
  {
    "section": 70,
    "reference": "Total tasks in Problem 20",
    "related": "Total tasks in Problem 28",
    "condition": "Conditional identity"
  },
  {
    "section": 70,
    "reference": "Total tasks",
    "related": "Tasks completed manually",
    "condition": "Subset"
  },
  {
    "section": 70,
    "reference": "Total tasks",
    "related": "Tasks affected by employee overload",
    "condition": "Subset"
  },
  {
    "section": 70,
    "reference": "Tasks completed manually",
    "related": "Tasks affected by employee overload",
    "condition": "Conditional overlap"
  },
  {
    "section": 70,
    "reference": "Tasks affected by employee overload",
    "related": "Incomplete tasks",
    "condition": "Conditional subset"
  },
  {
    "section": 70,
    "reference": "Basic buyer requests",
    "related": "Basic buyer requests not handled",
    "condition": "Subset"
  },
  {
    "section": 70,
    "reference": "Basic buyer requests not handled",
    "related": "Unserved buyers",
    "condition": "Attribution"
  },
  {
    "section": 70,
    "reference": "Total time for affected quantity",
    "related": "Avoidable time",
    "condition": "Time component"
  },
  {
    "section": 70,
    "reference": "Avoidable time",
    "related": "Wasted paid staff hours",
    "condition": "Conditional time subset under the relevant route"
  },
  {
    "section": 70,
    "reference": "Required staff hours",
    "related": "Available staff hours",
    "condition": "Mathematical comparison"
  },
  {
    "section": 70,
    "reference": "Staff hour shortfall",
    "related": "Additional paid staff hours",
    "condition": "Conditional relationship; never automatic equality"
  },
  {
    "section": 71,
    "reference": "Payments requiring reminders",
    "related": "Missed payment reminders",
    "condition": "Subset when counting compatible payment entities"
  },
  {
    "section": 71,
    "reference": "Missed payment reminders",
    "related": "Affected invoices",
    "condition": "Attribution; possible many-to-many relationship"
  },
  {
    "section": 71,
    "reference": "Invoices requiring follow-up",
    "related": "Invoices not followed up regularly",
    "condition": "Subset"
  },
  {
    "section": 71,
    "reference": "Invoices not followed up regularly",
    "related": "Affected invoices within Problem 23",
    "condition": "Identity"
  },
  {
    "section": 71,
    "reference": "Affected invoices in Problem 22",
    "related": "Affected invoices in Problem 23",
    "condition": "Conditional overlap"
  },
  {
    "section": 71,
    "reference": "Affected invoices",
    "related": "Additional unpaid invoices",
    "condition": "Conditional subset"
  },
  {
    "section": 71,
    "reference": "Additional unpaid invoices",
    "related": "Invoices not paid on time",
    "condition": "Conditional subset or overlap"
  },
  {
    "section": 71,
    "reference": "Additional unpaid invoices",
    "related": "Confirmed unrecoverable invoices",
    "condition": "Conditional relationship"
  },
  {
    "section": 71,
    "reference": "Total amount of affected invoices",
    "related": "Original unpaid amount",
    "condition": "Conditional monetary restriction"
  },
  {
    "section": 71,
    "reference": "Original unpaid amount",
    "related": "Recovered unpaid amount",
    "condition": "Monetary component"
  },
  {
    "section": 71,
    "reference": "Original unpaid amount",
    "related": "Pending unpaid amount",
    "condition": "Monetary component"
  },
  {
    "section": 71,
    "reference": "Original unpaid amount",
    "related": "Money lost from unpaid invoices",
    "condition": "Monetary component"
  },
  {
    "section": 71,
    "reference": "Pending unpaid amount",
    "related": "Estimated money lost from unpaid invoices",
    "condition": "Expected monetary component"
  },
  {
    "section": 72,
    "reference": "Buyers eligible for review requests",
    "related": "Buyers not asked for reviews",
    "condition": "Subset"
  },
  {
    "section": 72,
    "reference": "Buyers not asked for reviews",
    "related": "Potential reviews lost",
    "condition": "Conditional expected relationship"
  },
  {
    "section": 72,
    "reference": "Potential reviews lost",
    "related": "Potential new buyers lost",
    "condition": "Attribution"
  },
  {
    "section": 72,
    "reference": "Total incoming calls",
    "related": "Calls requiring recordings and outcomes",
    "condition": "Conditional subset"
  },
  {
    "section": 72,
    "reference": "Missed calls",
    "related": "Calls with missing recordings or outcomes",
    "condition": "Conditional overlap"
  },
  {
    "section": 72,
    "reference": "Calls with missing recordings or outcomes",
    "related": "Agent activities not visible",
    "condition": "Attribution or conditional overlap"
  },
  {
    "section": 72,
    "reference": "Lead records requiring CRM updates",
    "related": "Lead details not updated in CRM",
    "condition": "Subset"
  },
  {
    "section": 72,
    "reference": "Lead details not updated in CRM",
    "related": "Lost leads",
    "condition": "Attribution"
  },
  {
    "section": 72,
    "reference": "Agent activities requiring visibility",
    "related": "Agent activities not visible",
    "condition": "Subset"
  }
] as const;
export const problemPairRelationships=[
  {
    "problems": [
      "problem-1",
      "problem-2"
    ],
    "classification": "Subset",
    "condition": "Outside-hours calls may form part of total incoming, missed and answered call populations",
    "active": false
  },
  {
    "problems": [
      "problem-1",
      "problem-3"
    ],
    "classification": "Conditional subset",
    "condition": "Calls requiring appointments may belong to incoming calls",
    "active": false
  },
  {
    "problems": [
      "problem-1",
      "problem-4"
    ],
    "classification": "Conditional subset or overlap",
    "condition": "Urgent calls may belong to incoming calls; unrouted calls are not necessarily missed calls",
    "active": false
  },
  {
    "problems": [
      "problem-1",
      "problem-25"
    ],
    "classification": "Conditional subset or overlap",
    "condition": "Call recording requirements may cover incoming calls",
    "active": false
  },
  {
    "problems": [
      "problem-5",
      "problem-6"
    ],
    "classification": "Conditional overlap",
    "condition": "Slow responses and never-called leads may overlap depending on definitions",
    "active": false
  },
  {
    "problems": [
      "problem-5",
      "problem-7"
    ],
    "classification": "Conditional overlap",
    "condition": "Response and qualification populations may contain the same leads",
    "active": false
  },
  {
    "problems": [
      "problem-6",
      "problem-7"
    ],
    "classification": "Conditional overlap",
    "condition": "Uncalled leads may also experience late qualification",
    "active": false
  },
  {
    "problems": [
      "problem-6",
      "problem-8"
    ],
    "classification": "Conditional overlap",
    "condition": "Warm leads may belong to the new-lead population",
    "active": false
  },
  {
    "problems": [
      "problem-9",
      "problem-10"
    ],
    "classification": "Conditional overlap",
    "condition": "Old leads may experience both missed calls and inconsistent follow-up",
    "active": false
  },
  {
    "problems": [
      "problem-9",
      "problem-11"
    ],
    "classification": "Conditional subset or overlap",
    "condition": "Warm old leads may form part of the old-lead population",
    "active": false
  },
  {
    "problems": [
      "problem-10",
      "problem-11"
    ],
    "classification": "Conditional subset or overlap",
    "condition": "Warm old lead contact may form part of old-lead follow-up",
    "active": false
  },
  {
    "problems": [
      "problem-12",
      "problem-13"
    ],
    "classification": "Conditional overlap",
    "condition": "The same appointment may lack reminders and confirmation",
    "active": false
  },
  {
    "problems": [
      "problem-12",
      "problem-14"
    ],
    "classification": "Attribution or overlap",
    "condition": "Missed reminders may contribute to no-shows",
    "active": false
  },
  {
    "problems": [
      "problem-13",
      "problem-14"
    ],
    "classification": "Attribution or overlap",
    "condition": "Unconfirmed appointments may become no-shows",
    "active": false
  },
  {
    "problems": [
      "problem-12",
      "problem-15"
    ],
    "classification": "Conditional overlap",
    "condition": "Appointments may require reminders and rescheduling",
    "active": false
  },
  {
    "problems": [
      "problem-13",
      "problem-15"
    ],
    "classification": "Conditional overlap",
    "condition": "Confirmation and rescheduling may concern the same appointments",
    "active": false
  },
  {
    "problems": [
      "problem-14",
      "problem-15"
    ],
    "classification": "Conditional overlap",
    "condition": "Attendance and rescheduling may concern compatible appointment occurrences",
    "active": false
  },
  {
    "problems": [
      "problem-14",
      "problem-16"
    ],
    "classification": "Conditional overlap",
    "condition": "Canceled slots and no-show slots are not automatically identical",
    "active": false
  },
  {
    "problems": [
      "problem-17",
      "problem-18"
    ],
    "classification": "Conditional overlap",
    "condition": "Routine and simple questions may overlap",
    "active": false
  },
  {
    "problems": [
      "problem-17",
      "problem-19"
    ],
    "classification": "Conditional subset or overlap",
    "condition": "Employee-answered questions may belong to the broader question population",
    "active": false
  },
  {
    "problems": [
      "problem-18",
      "problem-19"
    ],
    "classification": "Conditional overlap",
    "condition": "Repeated questions may also receive slow answers",
    "active": false
  },
  {
    "problems": [
      "problem-17",
      "problem-20"
    ],
    "classification": "Conditional overlap",
    "condition": "Routine questions may contribute to manual work",
    "active": false
  },
  {
    "problems": [
      "problem-19",
      "problem-20"
    ],
    "classification": "Conditional overlap",
    "condition": "Repeated questions may contribute to manual work",
    "active": false
  },
  {
    "problems": [
      "problem-20",
      "problem-28"
    ],
    "classification": "Conditional identity and overlap",
    "condition": "Total tasks may be shared; manual tasks and overload-affected tasks may overlap",
    "active": false
  },
  {
    "problems": [
      "problem-17",
      "problem-28"
    ],
    "classification": "Attribution or overlap",
    "condition": "Routine work may contribute to employee overload",
    "active": false
  },
  {
    "problems": [
      "problem-19",
      "problem-28"
    ],
    "classification": "Attribution or overlap",
    "condition": "Repeated questions may consume staff capacity already measured elsewhere",
    "active": false
  },
  {
    "problems": [
      "problem-21",
      "problem-28"
    ],
    "classification": "Attribution or overlap",
    "condition": "Unhandled requests may result from employee overload",
    "active": false
  },
  {
    "problems": [
      "problem-22",
      "problem-23"
    ],
    "classification": "Conditional overlap",
    "condition": "The same invoice may lack reminders and regular follow-up",
    "active": false
  },
  {
    "problems": [
      "problem-25",
      "problem-26"
    ],
    "classification": "Attribution",
    "condition": "Missing call information may contribute to missing CRM information",
    "active": false
  },
  {
    "problems": [
      "problem-25",
      "problem-27"
    ],
    "classification": "Conditional overlap",
    "condition": "Missing call records may contribute to missing AI activity visibility",
    "active": false
  },
  {
    "problems": [
      "problem-26",
      "problem-27"
    ],
    "classification": "Attribution or overlap",
    "condition": "Missing lead updates may relate to missing agent visibility",
    "active": false
  }
] as const;
export const ambiguousPopulationDefinitions=[
  [
    "Missed bookings during calls",
    "Affected calls or missed individual booking opportunities"
  ],
  [
    "Bookings completed during calls",
    "Compatible counting unit with the relevant total"
  ],
  [
    "Missed appointment reminders",
    "Reminder events or unique appointments affected"
  ],
  [
    "Appointment reminders sent",
    "Reminder events or unique appointments receiving reminders"
  ],
  [
    "Missed payment reminders",
    "Reminder events or unique affected payments"
  ],
  [
    "Payment reminders sent",
    "Corresponding event or payment population"
  ],
  [
    "Scheduled appointments",
    "Whether future, canceled and rescheduled appointments are included"
  ],
  [
    "New leads with timely responses",
    "Whether unanswered leads are separately classified"
  ],
  [
    "Late lead qualifications",
    "Whether unqualified or pending leads form another classification"
  ],
  [
    "Timely lead qualifications",
    "Whether all other qualification states are accounted for"
  ],
  [
    "Tasks not completed manually",
    "Whether incomplete tasks are included"
  ],
  [
    "Lead details not updated in CRM",
    "Update events or distinct affected lead records"
  ],
  [
    "Invoice loss rate",
    "Additional unpaid invoice proportion, not permanently lost money"
  ],
  [
    "Additional review rate",
    "Incremental attributable review response, not necessarily overall review rate"
  ],
  [
    "Confirmed revenue loss",
    "Confirmation of the purchase loss versus estimation of the monetary amount"
  ]
] as const;
export const baseRouteSpecification=[
  [
    "Population breakdown",
    "Existing problem total, affected and unaffected quantities, plus an unclassified quantity when necessary"
  ],
  [
    "Affected percentage",
    "Existing affected and total quantities"
  ],
  [
    "Unaffected percentage",
    "Existing unaffected and total quantities"
  ],
  [
    "Frequency",
    "Existing affected quantity, measurement_period, affected_daily_rate"
  ],
  [
    "Recorded time",
    "recorded_units, recorded_duration, applicable average response or qualification time"
  ],
  [
    "Affected time",
    "Existing affected quantity, affected_duration, applicable average affected-unit time"
  ],
  [
    "Comparison",
    "Existing actual measurement, applicable target, actual_target_difference, percentage_of_target"
  ],
  [
    "Payment amount",
    "Applicable affected payment count, payments_without_reminders_amount, average_payment_amount"
  ],
  [
    "Invoice amount",
    "Applicable affected invoice count, affected_invoices_amount, average_invoice_amount"
  ],
  [
    "Staff capacity",
    "required_staff_hours, available_staff_hours, staff_hour_shortfall"
  ]
] as const;
export const conditionalBreakdownRequirement="A total equals affected plus unaffected only when the population, counting unit, period and reporting cutoff match, and classifications are mutually exclusive and collectively exhaustive.";
export const routeSpecification={"48":"## 48. Operational routes\n\n### Lost leads\n\nUse:\n\n- unique_affected_leads\n- recovered_leads\n- pending_leads\n- lead_loss_rate\n- lost_leads\n\nBoth the loss-rate route and the population-breakdown route establish the same scoped lost_leads instance.\n\n### Lost qualified leads\n\nUse:\n\n- affected_qualified_leads\n- recovered_qualified_leads\n- pending_qualified_leads\n- qualified_lead_loss_rate\n- lost_qualified_leads\n\n### Lost bookings\n\nUse:\n\n- intended_bookings\n- recovered_bookings\n- pending_bookings\n- booking_loss_rate\n- lost_bookings\n\n### Potential reactivations lost\n\nUse:\n\n- affected_old_leads\n- reactivation_rate\n- potential_reactivations_lost\n\n### Lost attendance\n\nUse:\n\n- affected_appointments\n- attendance_loss_rate\n- lost_attendance\n\n### Unused appointment slots\n\nUse:\n\n- available_affected_slots\n- filled_affected_slots\n- unused_appointment_slots\n\n### Unserved buyers\n\nUse:\n\n- affected_buyers\n- subsequently_served_buyers\n- unserved_buyers\n\n### Lost existing buyers\n\nUse:\n\n- affected_existing_buyers\n- existing_buyer_loss_rate\n- lost_existing_buyers\n\n### Avoidable time\n\nUse:\n\n- affected_duration\n- necessary_time\n- avoidable_time_percentage\n- avoidable_time\n\n### Incomplete tasks\n\nUse:\n\n- affected_tasks\n- completed_affected_tasks\n- incomplete_tasks\n\n### Additional unpaid invoices\n\nUse:\n\n- affected_invoices\n- invoice_loss_rate\n- additional_unpaid_invoices\n\n### Potential reviews lost\n\nUse:\n\n- review_requests.affected\n- additional_review_rate\n- potential_reviews_lost\n\n### Potential new buyers lost\n\nUse:\n\n- review_exposed_potential_buyers\n- attributable_buyer_loss_rate\n- potential_new_buyers_lost\n\n### Missing information\n\nUse the applicable existing problem population.\n\nDo not generate an independent duplicate affected record count.\n\n### Staff hour shortfall\n\nUse:\n\n- required_staff_hours\n- available_staff_hours\n- staff_hour_shortfall\n\n---\n\n# SECTION K — FINANCIAL ALTERNATIVE ROUTE REFERENCES\n","49":"## 49. Confirmed revenue loss\n\nMain outcome:\n\nconfirmed_revenue_loss\n\nRequired route references:\n\n### Purchases and average revenue\n\n- confirmed_purchases_lost\n- average_revenue_per_purchase\n\n### Revenue difference\n\n- confirmed_purchase_revenue_before_loss\n- retained_purchase_revenue\n\n### Calculate average revenue per purchase\n\n- total_revenue\n- total_purchases\n\nIntermediate result:\n\naverage_revenue_per_purchase\n\n### Direct measurement\n\n- confirmed_revenue_loss\n\nDirect measurement must populate the existing outcome instance, not a second independent confirmed revenue loss value.\n","50":"## 50. Confirmed contribution profit loss\n\nMain outcome:\n\nconfirmed_contribution_profit_loss\n\n### Revenue less avoided costs\n\n- confirmed_revenue_loss\n- avoided_variable_costs\n\n### Contribution profit margin route\n\n- confirmed_revenue_loss\n- contribution_profit_margin\n\n### Contribution profit per purchase route\n\n- confirmed_purchases_lost\n- average_contribution_profit_per_purchase\n\n### Calculate avoided variable costs\n\n- confirmed_purchases_lost\n- average_avoided_variable_cost_per_purchase\n\nIntermediate result:\n\navoided_variable_costs\n\n### Calculate contribution profit margin\n\n- total_revenue\n- total_variable_costs\n- total_contribution_profit\n\nIntermediate result:\n\ncontribution_profit_margin\n\n### Calculate contribution profit per purchase\n\n- total_contribution_profit\n- total_purchases\n\nIntermediate result:\n\naverage_contribution_profit_per_purchase\n\n### Calculate applicable average avoided variable cost\n\nUse a corresponding avoided-variable-cost amount and purchase population.\n\nReuse avoided_variable_costs and confirmed_purchases_lost only when they represent the population relevant to the average.\n","51":"## 51. Higher costs\n\nMain outcome:\n\nhigher_costs\n\n### Overall cost comparison\n\n- actual_costs\n- comparable_costs_without_problem\n- cost_difference\n\n### Cost category breakdown\n\n- higher_marketing_costs\n- higher_staffing_costs\n- higher_collection_costs\n- higher_financing_costs\n- higher_other_operating_costs\n\n### Additional marketing\n\n- additional_paid_leads\n- average_cost_per_paid_lead\n\nIntermediate result:\n\nhigher_marketing_costs\n\n### Marketing cost comparison\n\n- actual_marketing_costs\n- comparable_marketing_costs\n\nIntermediate result:\n\nhigher_marketing_costs\n\n### Additional staff hours\n\n- additional_paid_staff_hours\n- average_cost_per_additional_staff_hour\n\nIntermediate result:\n\nhigher_staffing_costs\n\n### Additional employees\n\n- additional_employees\n- cost_per_additional_employee\n\nIntermediate result:\n\nhigher_staffing_costs\n\n### Staffing cost comparison\n\n- actual_staffing_costs\n- comparable_staffing_costs\n\nIntermediate result:\n\nhigher_staffing_costs\n\n### Collection cost breakdown\n\n- additional_collection_staff_costs\n- additional_collection_fees\n\nIntermediate result:\n\nhigher_collection_costs\n\n### Collection staff cost calculation\n\n- additional_collection_staff_hours\n- average_cost_per_collection_staff_hour\n\nIntermediate result:\n\nadditional_collection_staff_costs\n\n### Financing cost breakdown\n\n- additional_interest\n- additional_financing_fees\n\nIntermediate result:\n\nhigher_financing_costs\n\n### Simple interest route\n\n- additional_borrowed_amount\n- annual_interest_rate\n- borrowing_period\n\nIntermediate result:\n\nadditional_interest\n\nThis route requires the relevant interest convention.\n\n### Additional resources\n\n- additional_resources_used\n- average_cost_per_additional_resource\n\nIntermediate result:\n\nhigher_other_operating_costs\n\n### Other operating cost comparison\n\n- actual_other_operating_costs\n- comparable_other_operating_costs\n\nIntermediate result:\n\nhigher_other_operating_costs\n","52":"## 52. Wasted costs\n\nMain outcome:\n\nwasted_costs\n\n### Cost category breakdown\n\n- wasted_marketing_costs\n- wasted_staffing_costs\n- wasted_other_operating_costs\n\n### Wasted marketing\n\n- paid_lost_leads\n- average_cost_per_paid_lead\n\nIntermediate result:\n\nwasted_marketing_costs\n\n### Calculate paid lost leads\n\n- lost_leads\n- paid_lost_lead_percentage\n\nIntermediate result:\n\npaid_lost_leads\n\n### Calculate average cost per paid lead\n\n- marketing_spend_for_paid_leads\n- paid_leads_acquired\n\nIntermediate result:\n\naverage_cost_per_paid_lead\n\n### Wasted staffing\n\n- wasted_paid_staff_hours\n- average_staffing_cost_per_hour\n\nIntermediate result:\n\nwasted_staffing_costs\n\n### Avoidable time route\n\n- avoidable_time\n- paid_wasted_time_percentage\n\nIntermediate result:\n\nwasted_paid_staff_hours\n\n### Unused appointment slot route\n\n- unused_appointment_slots\n- wasted_paid_hours_per_unused_slot\n\nIntermediate result:\n\nwasted_paid_staff_hours\n\nOnly activate when the slots caused the measured wasted paid staff hours.\n\n### Calculate average staffing cost\n\n- relevant_staffing_costs\n- corresponding_paid_staff_hours\n\nIntermediate result:\n\naverage_staffing_cost_per_hour\n\n### Wasted resources\n\n- wasted_resources\n- average_cost_per_wasted_resource\n\nIntermediate result:\n\nwasted_other_operating_costs\n","53":"## 53. Delayed cash collection\n\nMain outcome:\n\ndelayed_cash_collection\n\n### Payment balance route\n\n- payments_due\n- payments_received_on_time\n\n### Overdue invoice route\n\n- invoices_not_paid_on_time\n- average_amount_not_paid_on_time_per_invoice\n\n### Calculate the applicable overdue invoice average\n\nUse the corresponding overdue monetary amount and invoice population.\n\nReuse delayed_cash_collection and invoices_not_paid_on_time when they represent the exact relevant amount and population.\n\nOtherwise, preserve separate scoped measurements.\n","54":"## 54. Money lost from unpaid invoices\n\nMain outcome:\n\nunpaid_invoice_money_loss\n\n### Unpaid balance breakdown\n\n- original_unpaid_amount\n- recovered_unpaid_amount\n- pending_unpaid_amount\n\n### Unrecoverable invoice route\n\n- confirmed_unrecoverable_invoices\n- average_unrecoverable_amount_per_invoice\n\n### Direct measurement\n\n- unpaid_invoice_money_loss\n\n### Calculate average unrecoverable amount\n\nUse the applicable unrecoverable amount and corresponding invoice count.\n\nReuse unpaid_invoice_money_loss and confirmed_unrecoverable_invoices where the scopes match.\n","55":"## 55. Lost potential revenue\n\nMain outcome:\n\nlost_potential_revenue\n\n### Potential buyer route\n\n- lost_potential_buyers\n- average_revenue_per_buyer\n\n### Calculate average revenue per buyer\n\n- total_revenue\n- total_buyers\n\nIntermediate result:\n\naverage_revenue_per_buyer\n\n### Lost lead route\n\n- lost_leads\n- lead_to_buyer_rate\n\nIntermediate result:\n\nlost_potential_buyers\n\n### Qualified lead route\n\n- lost_qualified_leads\n- qualified_lead_to_buyer_rate\n\nIntermediate result:\n\nlost_potential_buyers\n\n### Reactivation route\n\n- potential_reactivations_lost\n- reactivation_to_buyer_rate\n\nIntermediate result:\n\nlost_potential_buyers\n\n### Lost booking route\n\n- lost_bookings\n- booking_to_buyer_rate\n\nIntermediate result:\n\nlost_potential_buyers\n\n### Lost attendance route\n\n- lost_attendance\n- attendance_to_buyer_rate\n\nIntermediate result:\n\nlost_potential_buyers\n\n### Unused slot route\n\n- unused_appointment_slots\n- potential_buyers_per_unused_slot\n\nIntermediate result:\n\nlost_potential_buyers\n\n### Unserved buyer route\n\n- unserved_buyers\n- attributable_purchase_loss_rate\n\nIntermediate result:\n\nlost_potential_buyers\n\n### New buyer route\n\n- potential_new_buyers_lost\n\nReuse lost_potential_buyers only when the intended population consists exclusively of those same potential new buyers.\n\n### Existing buyer route\n\n- lost_existing_buyers\n- expected_future_revenue_per_lost_existing_buyer\n- future_revenue_period\n\nThis route requires its applicable future revenue scope.\n\nIt must not automatically reuse new-buyer acquisition averages.\n","56":"## 56. Lost potential contribution profit\n\nMain outcome:\n\nlost_potential_contribution_profit\n\n### Revenue less estimated avoided costs\n\n- lost_potential_revenue\n- estimated_avoided_variable_costs\n\n### Contribution profit margin route\n\n- lost_potential_revenue\n- contribution_profit_margin\n\n### Contribution profit per buyer route\n\n- lost_potential_buyers\n- average_contribution_profit_per_buyer\n\n### Calculate estimated avoided variable costs\n\n- lost_potential_buyers\n- average_avoided_variable_cost_per_buyer\n\nIntermediate result:\n\nestimated_avoided_variable_costs\n\n### Calculate contribution profit per buyer\n\n- total_contribution_profit\n- total_buyers\n\nIntermediate result:\n\naverage_contribution_profit_per_buyer\n\n### Calculate applicable contribution profit margin\n\n- total_revenue\n- total_variable_costs\n- total_contribution_profit\n\nIntermediate result:\n\ncontribution_profit_margin\n\n### Calculate average avoided variable cost per buyer\n\nUse the corresponding avoided-variable-cost amount and buyer population.\n\nReuse existing quantities only when their scopes match.\n","57":"## 57. Estimated higher costs\n\nMain outcome:\n\nestimated_higher_costs\n\n### Overall estimated cost comparison\n\n- estimated_costs_with_problem\n- estimated_comparable_costs\n- estimated_cost_difference\n\n### Estimated cost category breakdown\n\n- estimated_higher_marketing_costs\n- estimated_higher_staffing_costs\n- estimated_higher_collection_costs\n- estimated_higher_financing_costs\n- estimated_higher_other_operating_costs\n\n### Estimated additional marketing\n\n- estimated_additional_paid_leads\n- average_cost_per_paid_lead\n\n### Estimated marketing comparison\n\n- estimated_marketing_costs_with_problem\n- estimated_comparable_marketing_costs\n\n### Estimated additional staff hours\n\n- estimated_additional_paid_staff_hours\n- average_cost_per_additional_staff_hour\n\n### Estimated additional employees\n\n- estimated_additional_employees\n- cost_per_additional_employee\n\n### Estimated staffing comparison\n\n- estimated_staffing_costs_with_problem\n- estimated_comparable_staffing_costs\n\n### Estimated collection cost breakdown\n\n- estimated_additional_collection_staff_costs\n- estimated_additional_collection_fees\n\n### Estimated collection staff costs\n\n- estimated_additional_collection_staff_hours\n- average_cost_per_collection_staff_hour\n\n### Estimated financing cost breakdown\n\n- estimated_additional_interest\n- estimated_additional_financing_fees\n\n### Estimated simple interest\n\n- estimated_additional_borrowed_amount\n- annual_interest_rate\n- estimated_borrowing_period\n\n### Estimated additional resources\n\n- estimated_additional_resources_used\n- average_cost_per_additional_resource\n\n### Estimated other operating cost comparison\n\n- estimated_other_operating_costs_with_problem\n- estimated_comparable_other_operating_costs\n\nEach route must reference the corresponding estimated intermediate result, not the equivalent confirmed result.\n\nReuse established cost averages only when their scopes remain applicable.\n\n","58":"## 58. Estimated money lost from unpaid invoices\n\nMain outcome:\n\nestimated_unpaid_invoice_money_loss\n\n### Expected monetary loss route\n\n- pending_unpaid_amount\n- expected_unrecoverable_percentage\n\n### Expected invoice count loss route\n\n- pending_invoices\n- expected_invoice_loss_rate\n- average_expected_unrecoverable_amount_per_lost_invoice\n\n### Expected recovery route\n\n- pending_unpaid_amount\n- expected_recoverable_amount\n\nConfirmed unrecoverable balances must remain outside the pending unpaid amount.\n\n---\n\n# SECTION L — CONVERSION-RATE SUPPORTING POPULATIONS\n\n","59":"## 59. Register applicable conversion numerators and denominators\n\nConversion percentages may themselves be established from measured populations.\n\n| Conversion measurement | Numerator | Denominator |\n|---|---|---|\n| Lead-to-buyer conversion rate | Leads becoming buyers | Eligible leads |\n| Qualified lead-to-buyer conversion rate | Qualified leads becoming buyers | Eligible qualified leads |\n| Reactivation-to-buyer conversion rate | Reactivated leads becoming buyers | Eligible reactivated leads |\n| Booking-to-buyer conversion rate | Bookings resulting in purchases | Eligible bookings |\n| Attendance-to-buyer conversion rate | Attended appointments resulting in purchases | Eligible attended appointments |\n| Additional review rate | Additional attributable reviews | Eligible buyers |\n| Reactivation rate | Reactivated leads | Eligible old leads |\n\nUse explicit scoped instances of eligible_conversion_population and converted_population or reuse existing canonical quantities when identical.\n\nThe numerator and denominator must describe compatible counting units.\n\nFor example, the number of bookings that produced purchases may be used as a converted-booking count.\n\nThe number of separate purchases or unique buyers produced by those bookings may require another ratio.\n\nDo not use the affected or lost population as the denominator of a historical conversion rate merely because the historical rate is subsequently applied to that population.\n\nKeep historical measurement populations and estimated consequence populations separate.\n\n---\n\n# SECTION M — COMPLETE MEASUREMENT SCOPE\n\n"} as const;

// Historical conversion measurements are scoped independently of estimated consequence populations.
export const conversionPopulationSpecification=[
 ["lead_to_buyer_rate","Leads becoming buyers","Eligible leads"],
 ["qualified_lead_to_buyer_rate","Qualified leads becoming buyers","Eligible qualified leads"],
 ["reactivation_to_buyer_rate","Reactivated leads becoming buyers","Eligible reactivated leads"],
 ["booking_to_buyer_rate","Bookings resulting in purchases","Eligible bookings"],
 ["attendance_to_buyer_rate","Attended appointments resulting in purchases","Eligible attended appointments"],
 ["additional_review_rate","Additional attributable reviews","Eligible buyers"],
 ["reactivation_rate","Reactivated leads","Eligible old leads"]
] as const;
export const explicitIdentityAliases={"manual_tasks.total":"tasks.total","overloaded_tasks.total":"tasks.total"} as const;
export const scopeCompatibilityRequirements=["businessId","populationId","countingUnit","measurementPeriod","reportingCutoff","measurementBasis","evidenceClassification","scenario","attribution"] as const;
export const legacyPopulationConditions=[
 {problemId:"problem-12",legacyKey:"affected",condition:"Existing attendance calculations use unique affected appointment occurrences. If reminder events rather than distinct appointments are recorded, the separate affected_appointments instance must be used; no automatic equality is authorized."},
 {problemId:"problem-15",legacyKey:"affected",condition:"Existing attendance calculations use unique appointment occurrences requiring rescheduling; separate rescheduling events need their own population."},
 {problemId:"problem-22",legacyKey:"affected",condition:"Existing monetary calculations are valid only when the affected quantity counts distinct payments without reminders, not reminder events. A distinct affected payment instance is registered."}
] as const;

// Explicit semantic/scoped references for each supplied population relationship.
// A scoped endpoint uses an existing problem and legacy key. A semantic endpoint
// identifies a measurement type only; it does not establish a specific population.
export type RelationshipEndpoint={canonicalId:string;problemId?:string;legacyKey?:string};
const endpointKeys=[["1/total","2/total"],["1/affected","2/affected"],["1/unaffected","2/unaffected"],["1/total","4/total"],["1/total","3/total"],["1/affected","4/affected"],["1/affected","unique_affected_leads"],["3/total","3/missedBookings"],["5/total","6/total"],["5/affected","6/affected"],["5/total","7/total"],["6/total","8/total"],["8/total","8/affected"],["9/total","11/total"],["10/total","11/total"],["9/affected","10/affected"],["11/affected","9/affected"],["unique_affected_leads","affected_qualified_leads"],["lost_leads","lost_qualified_leads"],["14/total","12/total"],["14/total","13/total"],["14/total","15/total"],["12/total","13/total"],["12/affected","13/affected"],["12/affected","14/affected"],["13/affected","14/affected"],["15/affected","15/op:fewer-appointments-attended:result"],["14/affected","14/op:unused-appointment-slots:result"],["16/total","16/affected"],["16/affected","unused_appointment_slots"],["lost_bookings","lost_attendance"],["lost_attendance","unserved_buyers"],["unused_appointment_slots","unserved_buyers"],["17/total","18/total"],["17/total","17/affected"],["17/total","19/total"],["19/total","19/affected"],["17/affected","19/affected"],["17/affected","18/total"],["20/total","28/total"],["20/total","20/affected"],["28/total","28/affected"],["20/affected","28/affected"],["28/affected","28/op:fewer-tasks-completed:result"],["21/total","21/affected"],["21/affected","21/op:fewer-customers-served:result"],["affected_duration","avoidable_time"],["avoidable_time","wasted_paid_staff_hours"],["28/hours","28/target"],["28/step2:staff-shortfall","additional_paid_staff_hours"],["22/total","22/affected"],["22/affected","22/affectedInvoices"],["23/total","23/affected"],["23/affected","23/affected"],["22/affectedInvoices","23/affected"],["affected_invoices","additional_unpaid_invoices"],["additional_unpaid_invoices","invoices_not_paid_on_time"],["additional_unpaid_invoices","confirmed_unrecoverable_invoices"],["23/moneyTotal","original_unpaid_amount"],["original_unpaid_amount","recovered_unpaid_amount"],["original_unpaid_amount","pending_unpaid_amount"],["original_unpaid_amount","unpaid_invoice_money_loss"],["pending_unpaid_amount","estimated_unpaid_invoice_money_loss"],["24/total","24/affected"],["24/affected","24/op:fewer-customer-reviews:result"],["24/op:fewer-customer-reviews:result","24/op:fewer-new-customers:result"],["1/total","25/total"],["1/affected","25/affected"],["25/affected","27/affected"],["26/total","26/affected"],["26/affected","26/op:lost-leads:result"],["27/total","27/affected"]] as const;
export const relationshipEndpointKeys=endpointKeys;
export function relationshipKinds(condition:string):RelationshipKind[]{
 const s=condition.toLowerCase(),k:RelationshipKind[]=[];
 if(s.includes("identity"))k.push("identity");
 if(s.includes("subset"))k.push("subset");
 if(s.includes("overlap"))k.push("overlap");
 if(s.includes("attribution"))k.push("attribution");
 if(s.includes("component")||s.includes("mathematical comparison"))k.push("mathematical");
 if(s.includes("conditional")||s.includes("when")||s.includes("must be established")||s.includes("compatible"))k.push("conditional");
 if(s.includes("no default equality"))k.push("independent");
 return k.length?k:["conditional"];
}
