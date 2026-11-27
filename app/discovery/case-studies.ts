// Verbatim spoken descriptions and separate notes from the supplied case studies.
export const caseStudies=[
  {
    "id": "golf",
    "title": "Inbound / missed calls — golf & country clubs",
    "spoken": "Let me give you an example. We worked with four golf and country clubs that were in a very similar position. They were getting calls all day while their staff were busy with members. We put an AI voice agent on the phone at each club, answering calls 24/7 and warmly transferring to staff when a person was needed. They handled more than 200,000 calls combined, with about a 100% pickup rate.",
    "notes": [
      "Spotlight club: 52,884 calls, 1.4-second average response time, 85.8% successful calls, 78% warm-transferred to staff",
      "Note that the warm-transfer rate is high: don't imply the AI eliminated all staff call handling."
    ],
    "pages": "(case studies pp. 4–9)",
    "problems": [
      1,
      2,
      4,
      18,
      20,
      28
    ]
  },
  {
    "id": "solar",
    "title": "Fast lead follow-up — solar",
    "spoken": "Let me give you an example. We worked with a solar company getting 472 leads a month. Human reps couldn't call every lead within seconds. We put in an AI voice agent that called every new lead in under 30 seconds, with follow-up in GoHighLevel. About 40% booked an appointment, about 13% of those booked appointments closed, and the client reported more than $250,000 in additional revenue.",
    "notes": [],
    "pages": "(pp. 14–17)",
    "problems": [
      3,
      5,
      6,
      8,
      20,
      28
    ]
  },
  {
    "id": "roofing",
    "title": "Ad leads to appointments — roofing",
    "spoken": "Let me give you an example. We worked with a roofing company running Meta lead campaigns. They needed new leads to get a fast call to book an inspection. We put an AI voice agent on every lead. In 30 days, 342 leads produced 72 inspection bookings and 48 closed jobs, with more than $372,000 in total revenue.",
    "notes": [],
    "pages": "(pp. 18–20)",
    "problems": [
      3,
      5,
      6,
      20
    ]
  },
  {
    "id": "debt",
    "title": "Inbound + outbound scale — debt consolidation",
    "spoken": "Let me give you an example. We worked with a debt consolidation client whose ads brought in a lot of new leads, and a small team couldn't keep up. We built two AI voice agents connected to the ad campaigns: one called new leads right away, and one picked up inbound calls. They handled over 33,000 calls a day combined, and the client reported $500,000 in added revenue in one month.",
    "notes": [],
    "pages": "(pp. 10–13)",
    "problems": [
      1,
      5,
      6,
      20,
      28
    ]
  },
  {
    "id": "worldstar",
    "title": "Email and SMS — WorldStar",
    "spoken": "Let me give you an example. We worked with a media and culture client whose Klaviyo account had been flagged as spam and was at risk. We cleaned up and rebuilt the email and SMS system. Klaviyo returned to green within 30 days, and the client reported about $300,000 in extra revenue over about 90 days.",
    "notes": [
      "This is an EMAIL + SMS case study, not proof of AI voice agent results."
    ],
    "pages": "(pp. 21–24)",
    "problems": []
  }
];
export const casesForProblem=(id:string)=>caseStudies.filter(c=>c.problems.includes(Number(id.replace("problem-",""))));
