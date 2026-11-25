// Approved Precision Talks — Master Solution and Function Table.
// Function wording and order are transcribed from the supplied library.
// Conditions and proposed capabilities are internal reference data, not visible UI.
export type SolutionFunction = {
  id: string;
  name: string;
  description: string;
  kind: "agent-function" | "shared-system";
  availability: "documented" | "configuration-dependent" | "proposed";
  conditionIds: string[];
};
export type ConfigurationCapability = { id: string; capability: string; applicableSolution: string; condition: string };
export type SolutionFunctionReference = { id: string; sourceName: string; overview: string; functionIds: string[]; proposedFunctionIds: string[]; notes: string[] };

export const configurationCapabilities: ConfigurationCapability[] = [
  {
    "id": "calls-outside-working-hours",
    "capability": "Calls outside working hours",
    "applicableSolution": "Inbound Agent",
    "condition": "The agent follows the business's approved rules for handling calls outside working hours."
  },
  {
    "id": "warm-transfers-calls",
    "capability": "Warm-transfers calls",
    "applicableSolution": "Inbound Agent and other agents",
    "condition": "The agent needs an established process for transferring calls to staff."
  },
  {
    "id": "handles-objections",
    "capability": "Handles objections",
    "applicableSolution": "Lead-handling agents",
    "condition": "The business must include approved objections and answers in the agent's training."
  },
  {
    "id": "contacts-waitlisted-customers-after-cancellations",
    "capability": "Contacts waitlisted customers after cancellations",
    "applicableSolution": "Appointment Guardian Agent",
    "condition": "This is a proposed use case. We must confirm that the agent supports this process."
  },
  {
    "id": "collects-booking-deposits",
    "capability": "Collects booking deposits",
    "applicableSolution": "Booking agents",
    "condition": "We must confirm that the payment system supports deposits and that deposit collection is part of the agreed solution."
  },
  {
    "id": "handles-insurance-questions",
    "capability": "Handles insurance questions",
    "applicableSolution": "Inbound Agent; Customer Support Agent",
    "condition": "The agent uses the business's approved insurance information. This is not a separate standard function."
  },
  {
    "id": "handles-industry-specific-qualification",
    "capability": "Handles industry-specific qualification",
    "applicableSolution": "Lead-handling agents",
    "condition": "The agent uses the business's own qualification questions and requirements."
  },
  {
    "id": "reactivates-inactive-customers-or-members",
    "capability": "Reactivates inactive customers or members",
    "applicableSolution": "Lead Revival Agent",
    "condition": "The agent needs a process for contacting and following up with inactive customers or members."
  },
  {
    "id": "sends-sms-or-email-messages",
    "capability": "Sends SMS or email messages",
    "applicableSolution": "Applicable configured agents",
    "condition": "We must confirm that the solution includes these messages. The Email and SMS case study alone does not establish these as standard voice-agent functions."
  },
  {
    "id": "makes-calls-within-30-seconds",
    "capability": "Makes calls within 30 seconds",
    "applicableSolution": "Speed-to-Lead Agent",
    "condition": "The solar case study demonstrates this capability. The general advertised response time remains 60 seconds."
  },
  {
    "id": "handles-simultaneous-calls",
    "capability": "Handles simultaneous calls",
    "applicableSolution": "Applicable voice agents",
    "condition": "We must confirm how many calls the agents can handle at the same time."
  },
  {
    "id": "speaks-multiple-languages",
    "capability": "Speaks multiple languages",
    "applicableSolution": "Applicable voice agents",
    "condition": "We must confirm which languages and dialects the agents support."
  },
  {
    "id": "updates-the-crm",
    "capability": "Updates the CRM",
    "applicableSolution": "Applicable voice agents",
    "condition": "The system needs a connection to a compatible CRM."
  },
  {
    "id": "sends-appointment-messages",
    "capability": "Sends appointment messages",
    "applicableSolution": "Applicable appointment-handling agents",
    "condition": "The system needs WhatsApp verification, a WhatsApp connection and approved message templates."
  },
  {
    "id": "records-calls",
    "capability": "Records calls",
    "applicableSolution": "Applicable voice agents",
    "condition": "Call recording depends on the agreed setup and applicable recording requirements."
  }
];

export const functionLibrary: Record<string, SolutionFunction> = {
  "function-answers-incoming-calls": {
    "id": "function-answers-incoming-calls",
    "name": "Answers incoming calls",
    "description": "The agent answers calls 24/7, even outside the business's working hours. It follows the business's rules for handling calls.",
    "kind": "agent-function",
    "availability": "documented",
    "conditionIds": []
  },
  "function-handles-calls-outside-working-hours": {
    "id": "function-handles-calls-outside-working-hours",
    "name": "Handles calls outside working hours",
    "description": "The agent follows the business's rules for booking appointments, calling people back and sending messages outside working hours.",
    "kind": "agent-function",
    "availability": "configuration-dependent",
    "conditionIds": [
      "calls-outside-working-hours"
    ]
  },
  "function-answers-questions": {
    "id": "function-answers-questions",
    "name": "Answers questions",
    "description": "The agent answers questions using the business's approved FAQs, services, prices, working hours and policies. It does not make up information that the business has not provided.",
    "kind": "agent-function",
    "availability": "documented",
    "conditionIds": [
      "handles-insurance-questions"
    ]
  },
  "function-collects-lead-information": {
    "id": "function-collects-lead-information",
    "name": "Collects lead information",
    "description": "The agent asks the sales team's approved qualification questions in a set order. It saves the lead's answers in the correct fields.",
    "kind": "agent-function",
    "availability": "documented",
    "conditionIds": [
      "handles-industry-specific-qualification"
    ]
  },
  "function-qualifies-leads": {
    "id": "function-qualifies-leads",
    "name": "Qualifies leads",
    "description": "The agent compares the lead's answers with the business's qualification requirements to determine whether the lead qualifies.",
    "kind": "agent-function",
    "availability": "documented",
    "conditionIds": [
      "handles-industry-specific-qualification"
    ]
  },
  "function-checks-appointment-availability": {
    "id": "function-checks-appointment-availability",
    "name": "Checks appointment availability",
    "description": "The agent checks the connected calendar for available appointment times. It follows the business's rules for how much time to leave between appointments and how far in advance customers must book.",
    "kind": "shared-system",
    "availability": "configuration-dependent",
    "conditionIds": []
  },
  "function-books-appointments": {
    "id": "function-books-appointments",
    "name": "Books appointments",
    "description": "The agent checks availability, follows the business's booking rules and books the appointment in the connected calendar.",
    "kind": "shared-system",
    "availability": "configuration-dependent",
    "conditionIds": []
  },
  "function-routes-calls-to-staff": {
    "id": "function-routes-calls-to-staff",
    "name": "Routes calls to staff",
    "description": "The agent identifies when a caller needs to speak to a person. It transfers the call to the right staff member or department using the business's transfer rules, contact numbers and working hours.",
    "kind": "agent-function",
    "availability": "configuration-dependent",
    "conditionIds": [
      "warm-transfers-calls"
    ]
  },
  "function-handles-objections": {
    "id": "function-handles-objections",
    "name": "Handles objections",
    "description": "The agent responds to lead objections using the business's approved objections and answers, if the business has included them in the agent's training.",
    "kind": "agent-function",
    "availability": "configuration-dependent",
    "conditionIds": [
      "handles-objections"
    ]
  },
  "function-speaks-multiple-languages": {
    "id": "function-speaks-multiple-languages",
    "name": "Speaks multiple languages",
    "description": "The agent speaks to customers in their preferred language, as long as it supports that language.",
    "kind": "agent-function",
    "availability": "configuration-dependent",
    "conditionIds": [
      "speaks-multiple-languages"
    ]
  },
  "function-flags-requests-requiring-staff": {
    "id": "function-flags-requests-requiring-staff",
    "name": "Flags requests requiring staff",
    "description": "The agent identifies requests that need a staff member's attention and flags them for staff to follow up.",
    "kind": "agent-function",
    "availability": "documented",
    "conditionIds": []
  },
  "function-updates-the-crm": {
    "id": "function-updates-the-crm",
    "name": "Updates the CRM",
    "description": "The system saves the call outcome, a summary of the conversation and the next step in the connected CRM.",
    "kind": "shared-system",
    "availability": "configuration-dependent",
    "conditionIds": [
      "updates-the-crm"
    ]
  },
  "function-calls-new-leads": {
    "id": "function-calls-new-leads",
    "name": "Calls new leads",
    "description": "The agent automatically calls new leads from connected forms and advertising campaigns within 60 seconds. It follows the calling process set up for the business.",
    "kind": "agent-function",
    "availability": "documented",
    "conditionIds": [
      "makes-calls-within-30-seconds"
    ]
  },
  "function-identifies-buying-intentions": {
    "id": "function-identifies-buying-intentions",
    "name": "Identifies buying intentions",
    "description": "The agent speaks to the lead to find out whether they are interested in the business's products or services.",
    "kind": "agent-function",
    "availability": "documented",
    "conditionIds": []
  },
  "function-follows-up-with-leads": {
    "id": "function-follows-up-with-leads",
    "name": "Follows up with leads",
    "description": "The agent contacts leads again according to the business's approved follow-up process.",
    "kind": "agent-function",
    "availability": "documented",
    "conditionIds": []
  },
  "function-calls-old-leads": {
    "id": "function-calls-old-leads",
    "name": "Calls old leads",
    "description": "The agent contacts inactive leads and leads who have not purchased. It uses the leads stored in the business's CRM to restart conversations about the business's products or services.",
    "kind": "agent-function",
    "availability": "documented",
    "conditionIds": [
      "reactivates-inactive-customers-or-members"
    ]
  },
  "function-sends-appointment-reminders": {
    "id": "function-sends-appointment-reminders",
    "name": "Sends appointment reminders",
    "description": "The agent automatically reminds customers about their upcoming appointments. It follows the reminder process set up for the business.",
    "kind": "agent-function",
    "availability": "documented",
    "conditionIds": []
  },
  "function-confirms-appointments": {
    "id": "function-confirms-appointments",
    "name": "Confirms appointments",
    "description": "The agent confirms customers' appointments according to the confirmation process set up for the business.",
    "kind": "agent-function",
    "availability": "documented",
    "conditionIds": []
  },
  "function-communicates-appointment-updates": {
    "id": "function-communicates-appointment-updates",
    "name": "Communicates appointment updates",
    "description": "The agent informs customers when their appointment details change.",
    "kind": "agent-function",
    "availability": "documented",
    "conditionIds": []
  },
  "function-reschedules-appointments": {
    "id": "function-reschedules-appointments",
    "name": "Reschedules appointments",
    "description": "The agent checks available appointment times, arranges a new time with the customer and updates the existing appointment.",
    "kind": "shared-system",
    "availability": "configuration-dependent",
    "conditionIds": []
  },
  "function-communicates-appointment-cancellations": {
    "id": "function-communicates-appointment-cancellations",
    "name": "Communicates appointment cancellations",
    "description": "The agent informs customers when their appointments are canceled. It follows the business's approved messaging process.",
    "kind": "agent-function",
    "availability": "documented",
    "conditionIds": []
  },
  "function-sends-appointment-messages": {
    "id": "function-sends-appointment-messages",
    "name": "Sends appointment messages",
    "description": "The system sends booking confirmations, rescheduling messages and cancellation messages using approved WhatsApp templates.",
    "kind": "shared-system",
    "availability": "configuration-dependent",
    "conditionIds": [
      "sends-appointment-messages"
    ]
  },
  "function-contacts-waitlisted-customers-after-cancellations": {
    "id": "function-contacts-waitlisted-customers-after-cancellations",
    "name": "Contacts waitlisted customers after cancellations",
    "description": "When a customer cancels an appointment, the agent contacts customers on the waiting list and offers them the available appointment times.",
    "kind": "agent-function",
    "availability": "proposed",
    "conditionIds": [
      "contacts-waitlisted-customers-after-cancellations"
    ]
  },
  "function-handles-account-enquiries": {
    "id": "function-handles-account-enquiries",
    "name": "Handles account enquiries",
    "description": "The agent answers questions about customers' accounts using the account information available in the system.",
    "kind": "agent-function",
    "availability": "documented",
    "conditionIds": []
  },
  "function-handles-customer-requests": {
    "id": "function-handles-customer-requests",
    "name": "Handles customer requests",
    "description": "The agent handles supported customer requests during the conversation. It follows the processes set up for the business.",
    "kind": "agent-function",
    "availability": "documented",
    "conditionIds": []
  },
  "function-sends-payment-reminders": {
    "id": "function-sends-payment-reminders",
    "name": "Sends payment reminders",
    "description": "The agent automatically reminds customers about their payments. It follows the payment reminder process set up for the business.",
    "kind": "agent-function",
    "availability": "documented",
    "conditionIds": []
  },
  "function-follows-up-on-unpaid-invoices": {
    "id": "function-follows-up-on-unpaid-invoices",
    "name": "Follows up on unpaid invoices",
    "description": "The agent contacts customers about their unpaid invoices. It follows the follow-up process set up for the business.",
    "kind": "agent-function",
    "availability": "documented",
    "conditionIds": []
  },
  "function-supports-payment-plans": {
    "id": "function-supports-payment-plans",
    "name": "Supports payment plans",
    "description": "The agent helps customers with payment plans according to the business's approved payment policies.",
    "kind": "agent-function",
    "availability": "documented",
    "conditionIds": []
  },
  "function-requests-customer-reviews": {
    "id": "function-requests-customer-reviews",
    "name": "Requests customer reviews",
    "description": "The agent automatically contacts customers after they receive the business's service and asks them to leave a review. When and how the agent contacts customers depends on the process set up for the business.",
    "kind": "agent-function",
    "availability": "documented",
    "conditionIds": []
  },
  "function-displays-agent-activity": {
    "id": "function-displays-agent-activity",
    "name": "Displays agent activity",
    "description": "The dashboard shows which agents are working and what tasks they are completing.",
    "kind": "shared-system",
    "availability": "documented",
    "conditionIds": []
  },
  "function-displays-call-records": {
    "id": "function-displays-call-records",
    "name": "Displays call records",
    "description": "The dashboard shows recorded conversations and the number of calls by week, client and agent.",
    "kind": "shared-system",
    "availability": "documented",
    "conditionIds": []
  },
  "function-provides-call-playback": {
    "id": "function-provides-call-playback",
    "name": "Provides call playback",
    "description": "Staff can listen to recordings of the agents' conversations through the dashboard.",
    "kind": "shared-system",
    "availability": "documented",
    "conditionIds": []
  },
  "function-displays-call-transcripts": {
    "id": "function-displays-call-transcripts",
    "name": "Displays call transcripts",
    "description": "Staff can read written transcripts of the agents' conversations through the dashboard.",
    "kind": "shared-system",
    "availability": "documented",
    "conditionIds": []
  },
  "function-displays-confirmed-bookings": {
    "id": "function-displays-confirmed-bookings",
    "name": "Displays confirmed bookings",
    "description": "The dashboard shows appointments that the agents have successfully booked.",
    "kind": "shared-system",
    "availability": "documented",
    "conditionIds": []
  },
  "function-displays-failed-requests": {
    "id": "function-displays-failed-requests",
    "name": "Displays failed requests",
    "description": "The dashboard shows requests that the agents could not complete.",
    "kind": "shared-system",
    "availability": "documented",
    "conditionIds": []
  },
  "function-displays-call-quality-scores": {
    "id": "function-displays-call-quality-scores",
    "name": "Displays call quality scores",
    "description": "The dashboard shows the quality score assigned to each scored call.",
    "kind": "shared-system",
    "availability": "documented",
    "conditionIds": []
  },
  "function-connects-to-the-existing-crm": {
    "id": "function-connects-to-the-existing-crm",
    "name": "Connects to the existing CRM",
    "description": "The system connects the agents to the business's existing CRM, as long as the CRM is compatible and the connection is part of the agreed setup.",
    "kind": "shared-system",
    "availability": "configuration-dependent",
    "conditionIds": [
      "updates-the-crm"
    ]
  },
  "function-saves-lead-information": {
    "id": "function-saves-lead-information",
    "name": "Saves lead information",
    "description": "The system saves the answers that the agent collects during lead qualification in the correct CRM fields.",
    "kind": "shared-system",
    "availability": "documented",
    "conditionIds": []
  },
  "function-saves-call-outcomes": {
    "id": "function-saves-call-outcomes",
    "name": "Saves call outcomes",
    "description": "The system saves the result of each call in the CRM.",
    "kind": "shared-system",
    "availability": "documented",
    "conditionIds": []
  },
  "function-saves-conversation-summaries": {
    "id": "function-saves-conversation-summaries",
    "name": "Saves conversation summaries",
    "description": "The system saves a summary of the conversation in the CRM.",
    "kind": "shared-system",
    "availability": "documented",
    "conditionIds": []
  },
  "function-saves-next-steps": {
    "id": "function-saves-next-steps",
    "name": "Saves next steps",
    "description": "The system saves the action that needs to happen after the conversation in the CRM.",
    "kind": "shared-system",
    "availability": "documented",
    "conditionIds": []
  },
  "function-connects-to-the-existing-calendar": {
    "id": "function-connects-to-the-existing-calendar",
    "name": "Connects to the existing calendar",
    "description": "The system connects the agents to the business's existing calendar or booking system, as long as the system is compatible and the connection is part of the agreed setup.",
    "kind": "shared-system",
    "availability": "configuration-dependent",
    "conditionIds": []
  },
  "function-connects-to-whatsapp-business": {
    "id": "function-connects-to-whatsapp-business",
    "name": "Connects to WhatsApp Business",
    "description": "The system connects the agents to WhatsApp Business through the Meta Cloud API. The connection requires business verification, the necessary permissions and approved message templates.",
    "kind": "shared-system",
    "availability": "configuration-dependent",
    "conditionIds": [
      "sends-appointment-messages"
    ]
  },
  "function-records-calls": {
    "id": "function-records-calls",
    "name": "Records calls",
    "description": "The system records each conversation so staff can review it later.",
    "kind": "shared-system",
    "availability": "configuration-dependent",
    "conditionIds": [
      "records-calls"
    ]
  },
  "function-summarizes-conversations": {
    "id": "function-summarizes-conversations",
    "name": "Summarizes conversations",
    "description": "The system creates a summary of the conversation after the call ends.",
    "kind": "shared-system",
    "availability": "documented",
    "conditionIds": []
  },
  "function-scores-calls": {
    "id": "function-scores-calls",
    "name": "Scores calls",
    "description": "The system checks the quality of each call and gives it a score.",
    "kind": "shared-system",
    "availability": "documented",
    "conditionIds": []
  },
  "function-generates-quality-alerts": {
    "id": "function-generates-quality-alerts",
    "name": "Generates quality alerts",
    "description": "The system flags problems that it identifies when monitoring calls and checking call quality.",
    "kind": "shared-system",
    "availability": "documented",
    "conditionIds": []
  },
  "function-produces-performance-reports": {
    "id": "function-produces-performance-reports",
    "name": "Produces performance reports",
    "description": "The system produces reports that show call activity, call outcomes and agent performance.",
    "kind": "shared-system",
    "availability": "documented",
    "conditionIds": []
  }
};

// The last three entries are reference-only systems; they are not registered as website solutions.
export const solutionFunctionReferences: Record<string, SolutionFunctionReference> = {
  "inbound": {
    "id": "inbound",
    "sourceName": "Inbound Agent",
    "overview": "The agent answers incoming calls 24/7, answers callers' questions, qualifies leads, books appointments and routes urgent calls to staff.",
    "functionIds": [
      "function-answers-incoming-calls",
      "function-handles-calls-outside-working-hours",
      "function-answers-questions",
      "function-collects-lead-information",
      "function-qualifies-leads",
      "function-checks-appointment-availability",
      "function-books-appointments",
      "function-routes-calls-to-staff",
      "function-handles-objections",
      "function-speaks-multiple-languages",
      "function-flags-requests-requiring-staff",
      "function-updates-the-crm"
    ],
    "proposedFunctionIds": [],
    "notes": []
  },
  "speed": {
    "id": "speed",
    "sourceName": "Speed-to-Lead Agent",
    "overview": "The agent automatically calls new leads from forms and ads within 60 seconds. It identifies their buying intentions, qualifies them and books appointments.",
    "functionIds": [
      "function-calls-new-leads",
      "function-identifies-buying-intentions",
      "function-answers-questions",
      "function-collects-lead-information",
      "function-qualifies-leads",
      "function-follows-up-with-leads",
      "function-handles-objections",
      "function-checks-appointment-availability",
      "function-books-appointments",
      "function-routes-calls-to-staff",
      "function-speaks-multiple-languages",
      "function-flags-requests-requiring-staff",
      "function-updates-the-crm"
    ],
    "proposedFunctionIds": [],
    "notes": []
  },
  "revival": {
    "id": "revival",
    "sourceName": "Lead Revival Agent",
    "overview": "The agent automatically contacts inactive leads and leads who have not purchased. It finds out whether they are interested again, qualifies them and books appointments.",
    "functionIds": [
      "function-calls-old-leads",
      "function-identifies-buying-intentions",
      "function-answers-questions",
      "function-follows-up-with-leads",
      "function-collects-lead-information",
      "function-qualifies-leads",
      "function-handles-objections",
      "function-checks-appointment-availability",
      "function-books-appointments",
      "function-routes-calls-to-staff",
      "function-speaks-multiple-languages",
      "function-flags-requests-requiring-staff",
      "function-updates-the-crm"
    ],
    "proposedFunctionIds": [],
    "notes": []
  },
  "guardian": {
    "id": "guardian",
    "sourceName": "Appointment Guardian Agent",
    "overview": "The agent automatically reminds customers about appointments, confirms appointments, informs customers of changes and reschedules appointments.",
    "functionIds": [
      "function-sends-appointment-reminders",
      "function-confirms-appointments",
      "function-communicates-appointment-updates",
      "function-checks-appointment-availability",
      "function-reschedules-appointments",
      "function-communicates-appointment-cancellations",
      "function-sends-appointment-messages",
      "function-answers-questions",
      "function-speaks-multiple-languages",
      "function-flags-requests-requiring-staff",
      "function-updates-the-crm"
    ],
    "proposedFunctionIds": [
      "function-contacts-waitlisted-customers-after-cancellations"
    ],
    "notes": [
      "The Authority Playbook suggests this additional function as a possible use case. We must confirm that the agent supports this function before offering it as part of the solution."
    ]
  },
  "support": {
    "id": "support",
    "sourceName": "Customer Support Agent",
    "overview": "The agent answers customer questions, handles questions about customer accounts and completes supported customer requests. It uses the business's approved information and follows the business's approved processes.",
    "functionIds": [
      "function-answers-questions",
      "function-handles-account-enquiries",
      "function-handles-customer-requests",
      "function-routes-calls-to-staff",
      "function-flags-requests-requiring-staff",
      "function-speaks-multiple-languages",
      "function-updates-the-crm"
    ],
    "proposedFunctionIds": [],
    "notes": []
  },
  "payments": {
    "id": "payments",
    "sourceName": "Payments & Collections Agent",
    "overview": "The agent automatically sends payment reminders, follows up on unpaid invoices and helps customers with payment plans.",
    "functionIds": [
      "function-sends-payment-reminders",
      "function-follows-up-on-unpaid-invoices",
      "function-supports-payment-plans",
      "function-answers-questions",
      "function-handles-account-enquiries",
      "function-routes-calls-to-staff",
      "function-flags-requests-requiring-staff",
      "function-speaks-multiple-languages",
      "function-updates-the-crm"
    ],
    "proposedFunctionIds": [],
    "notes": [
      "The company materials do not confirm whether the agent can process payments directly, change payment deadlines, approve payment plans on its own or send payment links."
    ]
  },
  "reviews": {
    "id": "reviews",
    "sourceName": "Review Request Agent",
    "overview": "The agent automatically contacts customers and asks them to leave a review about their experience with the business.",
    "functionIds": [
      "function-requests-customer-reviews",
      "function-speaks-multiple-languages",
      "function-updates-the-crm"
    ],
    "proposedFunctionIds": [],
    "notes": [
      "The company materials do not specify which review platforms the agent supports, whether the agent sends direct review links or exactly when the agent requests reviews."
    ]
  },
  "dashboard": {
    "id": "dashboard",
    "sourceName": "Custom-Coded Smart Dashboard",
    "overview": "A dashboard built specifically for the business. It shows agent activity, call records, conversations, appointment bookings, failed requests and call quality scores.",
    "functionIds": [
      "function-displays-agent-activity",
      "function-displays-call-records",
      "function-provides-call-playback",
      "function-displays-call-transcripts",
      "function-displays-confirmed-bookings",
      "function-displays-failed-requests",
      "function-displays-call-quality-scores"
    ],
    "proposedFunctionIds": [],
    "notes": []
  },
  "crm": {
    "id": "crm",
    "sourceName": "CRM Integration",
    "overview": "The system connects the AI agents to the business's existing CRM. It saves lead information, call outcomes and the next steps required after conversations.",
    "functionIds": [
      "function-connects-to-the-existing-crm",
      "function-saves-lead-information",
      "function-saves-call-outcomes",
      "function-saves-conversation-summaries",
      "function-saves-next-steps"
    ],
    "proposedFunctionIds": [],
    "notes": [
      "Saving call outcomes, conversation summaries and next steps together makes up the shared **Updates the CRM** function."
    ]
  },
  "calendar": {
    "id": "calendar",
    "sourceName": "Calendar Integration",
    "overview": "The system connects the AI agents to the business's calendar. The agents use the calendar to check availability, book appointments and update existing appointments according to the business's booking rules.",
    "functionIds": [
      "function-connects-to-the-existing-calendar",
      "function-checks-appointment-availability",
      "function-books-appointments",
      "function-reschedules-appointments"
    ],
    "proposedFunctionIds": [],
    "notes": []
  },
  "whatsapp": {
    "id": "whatsapp",
    "sourceName": "WhatsApp Integration",
    "overview": "The system connects the AI agents to WhatsApp Business and automatically sends approved appointment messages.",
    "functionIds": [
      "function-connects-to-whatsapp-business",
      "function-sends-appointment-messages"
    ],
    "proposedFunctionIds": [],
    "notes": [
      "This connection does not mean the agents can send messages across all social media platforms."
    ]
  },
  "call-monitoring": {
    "id": "call-monitoring",
    "sourceName": "Call Recording, Quality Monitoring & Reporting",
    "overview": "The system records agent conversations, summarizes call outcomes, checks call quality, flags problems and reports agent performance.",
    "functionIds": [
      "function-records-calls",
      "function-summarizes-conversations",
      "function-scores-calls",
      "function-generates-quality-alerts",
      "function-flags-requests-requiring-staff",
      "function-produces-performance-reports",
      "function-updates-the-crm"
    ],
    "proposedFunctionIds": [],
    "notes": [
      "The recording, monitoring and reporting system produces the information. The dashboard displays that information."
    ]
  }
};
