// Centralized knowledge library. Sample content is not a finalized offer specification.
export type ImpactKind = "operational" | "financial";
export type Impact = { id: string; label: string };
export type Outcome = { id: string; title: string; description: string; functionIds: string[] };
export type AgentIcon = "inbound" | "speed" | "revival" | "guardian" | "generic";
export type Agent = { id: string; name: string; icon: AgentIcon; overview: string; temporary: boolean; functions: { id: string; text: string }[]; operationalOutcomes: Outcome[]; financialOutcomes: Outcome[] };
export type Link = { kind: ImpactKind; impactId: string; agentId: string; outcomeId: string };
export type Problem = { id: string; name: string; operationalImpacts: Impact[]; financialImpacts: Impact[]; agentIds: string[]; links: Link[] };

export const problems: Problem[] = [
  {
    "id": "problem-1",
    "name": "Missed calls",
    "operationalImpacts": [
      {
        "id": "operational-1",
        "label": "Potential buyers lost before qualification"
      },
      {
        "id": "operational-2",
        "label": "Potential appointments lost"
      },
      {
        "id": "operational-3",
        "label": "Urgent callers not reaching staff"
      }
    ],
    "financialImpacts": [
      {
        "id": "financial-1",
        "label": "Lost potential sales revenue"
      },
      {
        "id": "financial-2",
        "label": "Wasted marketing spend"
      },
      {
        "id": "financial-3",
        "label": "Excessive staffing costs"
      }
    ],
    "agentIds": [
      "inbound"
    ],
    "links": [
      {
        "kind": "operational",
        "impactId": "operational-1",
        "agentId": "inbound",
        "outcomeId": "operational-1"
      },
      {
        "kind": "operational",
        "impactId": "operational-2",
        "agentId": "inbound",
        "outcomeId": "operational-2"
      },
      {
        "kind": "operational",
        "impactId": "operational-3",
        "agentId": "inbound",
        "outcomeId": "operational-3"
      },
      {
        "kind": "financial",
        "impactId": "financial-1",
        "agentId": "inbound",
        "outcomeId": "financial-1"
      },
      {
        "kind": "financial",
        "impactId": "financial-2",
        "agentId": "inbound",
        "outcomeId": "financial-2"
      },
      {
        "kind": "financial",
        "impactId": "financial-3",
        "agentId": "inbound",
        "outcomeId": "financial-3"
      }
    ]
  },
  {
    "id": "problem-2",
    "name": "Calls outside working hours",
    "operationalImpacts": [],
    "financialImpacts": [],
    "agentIds": [],
    "links": []
  },
  {
    "id": "problem-3",
    "name": "Missed bookings during calls",
    "operationalImpacts": [],
    "financialImpacts": [],
    "agentIds": [],
    "links": []
  },
  {
    "id": "problem-4",
    "name": "Urgent calls not reaching staff",
    "operationalImpacts": [],
    "financialImpacts": [],
    "agentIds": [],
    "links": []
  },
  {
    "id": "problem-5",
    "name": "Slow response to new leads",
    "operationalImpacts": [
      {
        "id": "operational-1",
        "label": "New leads not reached promptly"
      },
      {
        "id": "operational-2",
        "label": "Potential buyers lost before qualification"
      },
      {
        "id": "operational-3",
        "label": "Potential appointments lost"
      }
    ],
    "financialImpacts": [
      {
        "id": "financial-1",
        "label": "Lost potential sales revenue"
      },
      {
        "id": "financial-2",
        "label": "Wasted marketing spend"
      }
    ],
    "agentIds": [
      "speed"
    ],
    "links": [
      {
        "kind": "operational",
        "impactId": "operational-1",
        "agentId": "speed",
        "outcomeId": "operational-1"
      },
      {
        "kind": "operational",
        "impactId": "operational-2",
        "agentId": "speed",
        "outcomeId": "operational-2"
      },
      {
        "kind": "operational",
        "impactId": "operational-3",
        "agentId": "speed",
        "outcomeId": "operational-3"
      },
      {
        "kind": "financial",
        "impactId": "financial-1",
        "agentId": "speed",
        "outcomeId": "financial-1"
      },
      {
        "kind": "financial",
        "impactId": "financial-2",
        "agentId": "speed",
        "outcomeId": "financial-2"
      }
    ]
  },
  {
    "id": "problem-6",
    "name": "New leads never called",
    "operationalImpacts": [],
    "financialImpacts": [],
    "agentIds": [],
    "links": []
  },
  {
    "id": "problem-7",
    "name": "Late lead qualifications",
    "operationalImpacts": [],
    "financialImpacts": [],
    "agentIds": [],
    "links": []
  },
  {
    "id": "problem-8",
    "name": "Warm leads not contacted",
    "operationalImpacts": [],
    "financialImpacts": [],
    "agentIds": [],
    "links": []
  },
  {
    "id": "problem-9",
    "name": "Old leads not called",
    "operationalImpacts": [
      {
        "id": "operational-1",
        "label": "Old leads left uncontacted"
      },
      {
        "id": "operational-2",
        "label": "Interested old leads not identified"
      },
      {
        "id": "operational-3",
        "label": "Potential appointments lost"
      }
    ],
    "financialImpacts": [
      {
        "id": "financial-1",
        "label": "Lost potential sales revenue"
      },
      {
        "id": "financial-2",
        "label": "Wasted past lead acquisition spend"
      }
    ],
    "agentIds": [
      "revival"
    ],
    "links": [
      {
        "kind": "operational",
        "impactId": "operational-1",
        "agentId": "revival",
        "outcomeId": "operational-1"
      },
      {
        "kind": "operational",
        "impactId": "operational-2",
        "agentId": "revival",
        "outcomeId": "operational-2"
      },
      {
        "kind": "operational",
        "impactId": "operational-3",
        "agentId": "revival",
        "outcomeId": "operational-3"
      },
      {
        "kind": "financial",
        "impactId": "financial-1",
        "agentId": "revival",
        "outcomeId": "financial-1"
      },
      {
        "kind": "financial",
        "impactId": "financial-2",
        "agentId": "revival",
        "outcomeId": "financial-2"
      }
    ]
  },
  {
    "id": "problem-10",
    "name": "Inconsistent follow-up with old leads",
    "operationalImpacts": [],
    "financialImpacts": [],
    "agentIds": [],
    "links": []
  },
  {
    "id": "problem-11",
    "name": "Warm old leads not contacted again",
    "operationalImpacts": [],
    "financialImpacts": [],
    "agentIds": [],
    "links": []
  },
  {
    "id": "problem-12",
    "name": "Missed appointment reminders",
    "operationalImpacts": [],
    "financialImpacts": [],
    "agentIds": [],
    "links": []
  },
  {
    "id": "problem-13",
    "name": "Unconfirmed appointments",
    "operationalImpacts": [],
    "financialImpacts": [],
    "agentIds": [],
    "links": []
  },
  {
    "id": "problem-14",
    "name": "Appointment no-shows",
    "operationalImpacts": [
      {
        "id": "operational-1",
        "label": "Customers forgetting appointments"
      },
      {
        "id": "operational-2",
        "label": "Appointments missed without notice"
      },
      {
        "id": "operational-3",
        "label": "Customers unable to attend at the booked time"
      }
    ],
    "financialImpacts": [
      {
        "id": "financial-1",
        "label": "Lost potential sales revenue"
      },
      {
        "id": "financial-2",
        "label": "Staff time wasted on missed appointments"
      }
    ],
    "agentIds": [
      "guardian"
    ],
    "links": [
      {
        "kind": "operational",
        "impactId": "operational-1",
        "agentId": "guardian",
        "outcomeId": "operational-1"
      },
      {
        "kind": "operational",
        "impactId": "operational-2",
        "agentId": "guardian",
        "outcomeId": "operational-2"
      },
      {
        "kind": "operational",
        "impactId": "operational-3",
        "agentId": "guardian",
        "outcomeId": "operational-3"
      },
      {
        "kind": "financial",
        "impactId": "financial-1",
        "agentId": "guardian",
        "outcomeId": "financial-1"
      },
      {
        "kind": "financial",
        "impactId": "financial-2",
        "agentId": "guardian",
        "outcomeId": "financial-2"
      }
    ]
  },
  {
    "id": "problem-15",
    "name": "Time-consuming appointment rescheduling",
    "operationalImpacts": [],
    "financialImpacts": [],
    "agentIds": [],
    "links": []
  },
  {
    "id": "problem-16",
    "name": "Empty slots after cancellations",
    "operationalImpacts": [],
    "financialImpacts": [],
    "agentIds": [],
    "links": []
  },
  {
    "id": "problem-17",
    "name": "Many routine questions",
    "operationalImpacts": [],
    "financialImpacts": [],
    "agentIds": [],
    "links": []
  },
  {
    "id": "problem-18",
    "name": "Slow answers to simple questions",
    "operationalImpacts": [],
    "financialImpacts": [],
    "agentIds": [],
    "links": []
  },
  {
    "id": "problem-19",
    "name": "Staff answering the same questions",
    "operationalImpacts": [],
    "financialImpacts": [],
    "agentIds": [],
    "links": []
  },
  {
    "id": "problem-20",
    "name": "Too much manual work",
    "operationalImpacts": [],
    "financialImpacts": [],
    "agentIds": [],
    "links": []
  },
  {
    "id": "problem-21",
    "name": "Basic customer requests not handled",
    "operationalImpacts": [],
    "financialImpacts": [],
    "agentIds": [],
    "links": []
  },
  {
    "id": "problem-22",
    "name": "Missed payment reminders",
    "operationalImpacts": [],
    "financialImpacts": [],
    "agentIds": [],
    "links": []
  },
  {
    "id": "problem-23",
    "name": "Invoices not followed up regularly",
    "operationalImpacts": [],
    "financialImpacts": [],
    "agentIds": [],
    "links": []
  },
  {
    "id": "problem-24",
    "name": "Customers not asked for reviews",
    "operationalImpacts": [],
    "financialImpacts": [],
    "agentIds": [],
    "links": []
  },
  {
    "id": "problem-25",
    "name": "Missing call recordings and outcomes",
    "operationalImpacts": [],
    "financialImpacts": [],
    "agentIds": [],
    "links": []
  },
  {
    "id": "problem-26",
    "name": "Lead details not updated in CRM",
    "operationalImpacts": [],
    "financialImpacts": [],
    "agentIds": [],
    "links": []
  },
  {
    "id": "problem-27",
    "name": "Hard to see what the AI agent is doing",
    "operationalImpacts": [],
    "financialImpacts": [],
    "agentIds": [],
    "links": []
  },
  {
    "id": "problem-28",
    "name": "Humans overloaded",
    "operationalImpacts": [],
    "financialImpacts": [],
    "agentIds": [],
    "links": []
  }
];

export const agents: Record<string, Agent> = {
  "inbound": {
    "id": "inbound",
    "name": "Inbound Agent",
    "icon": "inbound",
    "overview": "24/7 incoming call handling, qualification and booking.",
    "temporary": true,
    "functions": [
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
        "text": "Routes urgent callers to the appropriate staff member, when configured."
      }
    ],
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
        "title": "More urgent callers connected to staff",
        "description": "The agent identifies urgent calls and routes them to the designated staff member when configured.",
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
        "description": "Handling routine calls and bookings can reduce the staff time needed for those tasks. Actual cost savings depend on staffing changes.",
        "functionIds": [
          "answer",
          "qualify",
          "book"
        ]
      }
    ]
  },
  "speed": {
    "id": "speed",
    "name": "Speed-to-Lead Agent",
    "icon": "speed",
    "overview": "Prompt contact, qualification and booking for new leads.",
    "temporary": true,
    "functions": [
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
    "operationalOutcomes": [
      {
        "id": "operational-1",
        "title": "More new leads contacted promptly",
        "description": "The agent initiates contact when a lead arrives instead of waiting for a member of staff to become available.",
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
    ]
  },
  "revival": {
    "id": "revival",
    "name": "Lead Revival Agent",
    "icon": "revival",
    "overview": "Reconnecting with old leads, qualifying interest and booking appointments.",
    "temporary": true,
    "functions": [
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
    ]
  },
  "guardian": {
    "id": "guardian",
    "name": "Appointment Guardian Agent",
    "icon": "guardian",
    "overview": "Appointment reminders, confirmation and rescheduling.",
    "temporary": true,
    "functions": [
      {
        "id": "remind",
        "text": "Sends appointment reminders using configured channels."
      },
      {
        "id": "confirm",
        "text": "Asks customers to confirm whether they will attend."
      },
      {
        "id": "reschedule",
        "text": "Offers available alternative appointment times when needed."
      }
    ],
    "operationalOutcomes": [
      {
        "id": "operational-1",
        "title": "More customers reminded before appointments",
        "description": "The agent sends reminders before scheduled appointments so customers have an opportunity to prepare.",
        "functionIds": [
          "remind"
        ]
      },
      {
        "id": "operational-2",
        "title": "More appointments confirmed in advance",
        "description": "The agent asks customers to confirm attendance, which can identify appointments at risk of being missed.",
        "functionIds": [
          "remind",
          "confirm"
        ]
      },
      {
        "id": "operational-3",
        "title": "More appointments rescheduled when needed",
        "description": "The agent offers another available time to customers who cannot attend the original appointment.",
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
        "description": "Reminders and rescheduling may help more customers attend. Additional revenue depends on attendance and subsequent sales.",
        "functionIds": [
          "remind",
          "confirm",
          "reschedule"
        ]
      },
      {
        "id": "financial-2",
        "title": "Potentially less wasted staff time",
        "description": "Confirmations and rescheduling can give staff advance notice of some missed appointments and help them use their time more effectively.",
        "functionIds": [
          "confirm",
          "reschedule"
        ]
      }
    ]
  }
};
