// Approved Precision Talks explanation library, transcribed verbatim from the supplied tables.
// Outcome IDs are shared; general and problem-specific explanations are stored separately.
// Missing personalized entries are intentional. Never fall back to the general explanation.
export const allBenefitExplanations: Record<string, Record<string, string>> = {
  "inbound": {
    "positive-operational-fewer-lost-leads": "Leads who previously received no answer can now speak to the business when they call. Instead of hanging up, losing interest or contacting competitors, they can ask questions and continue toward purchase.",
    "positive-operational-fewer-lost-qualified-leads": "Leads who meet the business's requirements can be qualified during their first call. They do not need to wait for another call to find out if they qualify. Fewer qualified leads lose interest or purchase elsewhere while waiting.",
    "positive-operational-more-appointments-booked": "Leads who are ready to book can choose an available appointment during their calls. They no longer need to contact the business again to complete their bookings. Fewer interested leads leave without booking.",
    "positive-operational-more-buyers-served": "Buyers who previously struggled to reach employees can get answers to their questions and help with supported requests. More buyers get the help they need without waiting for employees.",
    "positive-operational-fewer-lost-existing-buyers": "Existing buyers can get answers and help when they call. Buyers who need further assistance can reach the appropriate employees when available. They are less likely to stop buying because they cannot get help.",
    "positive-operational-more-employee-time-available-for-other-work": "Employees spend less time answering calls, qualifying leads, booking appointments and recording information. They have more time to serve buyers and complete other tasks.",
    "positive-financial-increased-revenue-potential": "More leads can become paying buyers instead of being lost through unanswered or incomplete calls. Existing buyers are also less likely to stop purchasing because they cannot get help. The business can earn more revenue from new and existing buyers.",
    "positive-financial-less-wasted-marketing-spend": "The business has already paid to acquire some of the leads who call. Fewer of those leads are lost because nobody answers. More of the money spent acquiring those leads can result in sales.",
    "positive-financial-lower-cost-per-buyer": "Fewer leads are lost through unanswered calls. More of those leads can become buyers. If the business gains more buyers while spending the same amount on acquiring them, it spends less money acquiring each buyer.",
    "positive-financial-lower-employee-costs": "Employees spend fewer hours handling incoming calls and related tasks. If the business can reduce paid overtime or the number of employees needed to handle those calls, it spends less money on employees.",
    "positive-financial-less-wasted-employee-costs": "The business already pays employees for their working hours. Instead of spending those hours on routine calls and repetitive tasks, employees can serve buyers and complete other work. The business gets more useful work from the same employee spending."
  },
  "speed": {
    "positive-operational-fewer-lost-leads": "New leads receive calls while they are still interested. Hot leads are less likely to purchase elsewhere before hearing from the business. Warm leads are less likely to lose interest while waiting.",
    "positive-operational-fewer-lost-qualified-leads": "New leads who meet the business's requirements can be qualified sooner. They can move to the next step before losing interest or purchasing elsewhere. Fewer qualified leads are lost while waiting.",
    "positive-operational-more-appointments-booked": "Interested new leads can choose appointment times during their calls. They do not need to wait for employees to contact them again to complete their bookings.",
    "positive-operational-more-new-buyers": "More new leads stay interested long enough to be qualified, book appointments and make purchases. Leads who might otherwise have been lost can become buyers.",
    "positive-operational-more-employee-time-available-for-other-work": "Employees spend less time calling, qualifying and following up with new leads. They have more time to speak with interested leads, serve buyers and complete other tasks.",
    "positive-financial-increased-revenue-potential": "New leads who previously lost interest or purchased elsewhere while waiting can continue toward purchase. More of the leads the business already receives can become paying buyers.",
    "positive-financial-less-wasted-marketing-spend": "The business has already paid to acquire some of its new leads. Fewer of those leads lose interest because nobody calls them in time. More of the money spent acquiring those leads can result in sales.",
    "positive-financial-lower-cost-per-buyer": "More leads from existing marketing campaigns can become buyers. If the business gains more buyers without spending more money acquiring them, the cost per buyer decreases.",
    "positive-financial-lower-employee-costs": "Employees spend fewer hours calling, qualifying and following up with new leads. If the business needs fewer paid hours or additional employees for this work, employee costs decrease.",
    "positive-financial-less-wasted-employee-costs": "Paid employee hours previously spent on repetitive lead calls and follow-ups can be used for other work. Employees can spend more of their paid time speaking with interested leads and completing tasks that require their help."
  },
  "revival": {
    "positive-operational-more-old-leads-reactivated": "Some old leads may now need the service, have enough money to purchase or be ready to buy. When they receive another call, they can tell the business that they are interested. These leads can return to the buying process instead of remaining inactive in the CRM.",
    "positive-operational-fewer-lost-leads": "Old leads who become interested again can receive further calls. Instead of losing interest because nobody contacts them again, they can continue toward purchase.",
    "positive-operational-fewer-lost-qualified-leads": "Some old leads who did not previously qualify may now meet the business's requirements. They can be qualified when they receive another call. Fewer qualified old leads remain unnoticed or lose interest again.",
    "positive-operational-more-appointments-booked": "Old leads who become interested again can choose an appointment during their calls. Instead of remaining inactive after showing interest, they can move to an appointment.",
    "positive-operational-more-new-buyers": "Old leads who have never purchased may now be ready to buy. They can return to the buying process and become new buyers instead of remaining inactive in the CRM.",
    "positive-operational-more-employee-time-available-for-other-work": "Employees spend less time calling old leads to find out who is still interested. They have more time to speak with interested leads and complete other tasks.",
    "positive-financial-increased-revenue-potential": "More old leads can become paying buyers instead of remaining inactive in the CRM. The business can earn revenue from leads it already has.",
    "positive-financial-less-wasted-marketing-spend": "The business previously paid to acquire some of its old leads without gaining sales from them. Those leads have another chance to purchase. Some of the money spent acquiring them can still result in sales.",
    "positive-financial-lower-cost-per-buyer": "Old leads can become buyers without being acquired again through new marketing campaigns. If the cost of bringing those leads back is low compared with the number of additional buyers gained, the cost per buyer can decrease.",
    "positive-financial-lower-marketing-costs": "More old leads can become buyers. If those buyers reduce the number of new leads the business needs to acquire, the business can spend less money on marketing.",
    "positive-financial-lower-employee-costs": "Employees spend fewer hours calling and following up with old leads. If the business needs fewer paid hours or additional employees for this work, employee costs decrease.",
    "positive-financial-less-wasted-employee-costs": "Employees spend less paid time calling old leads who are no longer interested. They can spend more of their paid hours speaking with interested leads and completing other useful tasks."
  },
  "guardian": {
    "positive-operational-more-appointments-attended": "Buyers receive reminders about their upcoming appointments. Buyers who cannot attend their original appointments can choose another available time. Fewer buyers miss or abandon their appointments.",
    "positive-operational-fewer-unused-appointment-slots": "Buyers who might otherwise forget their appointments are more likely to attend. Buyers who cannot attend can communicate this sooner. Employees have more time to offer available slots to other buyers.",
    "positive-operational-more-buyers-served": "More buyers attend their original appointments or arrange another time. Employees can also serve other buyers when they successfully fill canceled appointment slots.",
    "positive-operational-more-employee-time-available-for-other-work": "Employees spend less time reminding buyers, confirming appointments and changing appointment times. They have more time to serve buyers and complete other tasks.",
    "positive-financial-increased-revenue-potential": "More appointments take place instead of being missed or abandoned. More buyers can receive paid services or attend sales appointments that may lead to purchases.",
    "positive-financial-less-wasted-employee-costs": "The business already pays employees to be available during appointment times. When more buyers attend, employees spend less paid time waiting for buyers who never arrive. More of their paid time can be used to provide services.",
    "positive-financial-lower-employee-costs": "Employees spend fewer hours managing reminders, confirmations and appointment changes. If the business can reduce paid overtime or the number of employees needed for this work, employee costs decrease."
  },
  "support": {
    "positive-operational-more-buyers-served": "Buyers with routine questions, account enquiries and supported requests can get help without waiting for employees. Fewer buyers leave without getting the help they need.",
    "positive-operational-fewer-lost-existing-buyers": "Existing buyers can get answers to their questions and help with supported requests. They are less likely to stop buying because they repeatedly struggle to get help.",
    "positive-operational-more-employee-time-available-for-other-work": "Employees spend less time answering routine questions and handling basic requests. They have more time to handle complex requests and complete other tasks.",
    "positive-operational-more-tasks-completed": "Routine requests can be completed while employees work on other tasks. Tasks that previously remained unfinished because employees were busy can now receive their attention.",
    "positive-financial-increased-revenue-potential": "Buyers who previously abandoned purchases because they could not get help may now complete those purchases. Existing buyers are also less likely to stop buying. Employees have more time to complete work that can generate revenue.",
    "positive-financial-lower-employee-costs": "Employees spend fewer hours answering routine questions and handling supported requests. If the business can pay for fewer overtime hours or operate with fewer employees, employee costs decrease.",
    "positive-financial-less-wasted-employee-costs": "The business already pays employees for their working hours. Instead of spending those hours answering the same questions and handling routine requests, employees can complete work that requires their help. The business gets more work done with the same employee spending."
  },
  "payments": {
    "positive-operational-fewer-unpaid-invoices": "Buyers who forget their payments receive reminders. Buyers who leave invoices unpaid receive further contact. Buyers who struggle to pay can receive information about approved payment plans. More buyers may pay their outstanding invoices.",
    "positive-operational-more-employee-time-available-for-other-work": "Employees spend less time reminding buyers about payments and following up on unpaid invoices. They have more time to handle difficult payment cases and complete other tasks.",
    "positive-financial-faster-cash-collection": "Buyers who forget their payment deadlines receive reminders. Buyers with unpaid invoices receive further contact. They are more likely to pay sooner, allowing the business to receive the money it is owed earlier.",
    "positive-financial-less-money-lost-from-unpaid-invoices": "Buyers who might otherwise leave their invoices unpaid receive further contact. Some may pay their invoices or use approved payment plans. The business can recover money it might otherwise never receive.",
    "positive-financial-lower-collection-costs": "Employees spend fewer hours contacting buyers about unpaid invoices. If the business can reduce paid collection hours or the amount it spends on external collection services, it spends less money recovering payments."
  },
  "reviews": {
    "positive-operational-more-buyer-reviews": "Buyers who previously completed their purchases without being asked for reviews now receive a request. Buyers who are willing to leave reviews are less likely to forget to do so.",
    "positive-operational-more-new-buyers": "New leads can read more about the experiences of previous buyers. If those reviews are positive, leads who were unsure about purchasing may feel more comfortable buying from the business.",
    "positive-financial-increased-revenue-potential": "Leads who previously hesitated because they could not find enough reviews may now find the information they need. If more of those leads purchase, the business earns more revenue.",
    "positive-financial-lower-cost-per-buyer": "More leads from existing marketing campaigns may become buyers after reading positive reviews. If the business gains more buyers without spending more money acquiring them, the cost per buyer decreases."
  },
  "dashboard": {
    "positive-operational-more-complete-business-information": "Employees can see calls, listen to recordings, read conversations and check bookings and failed requests. Information that was previously missing or difficult to find becomes available in one place. Employees can see what happened instead of having to guess."
  },
  "crm": {
    "positive-operational-more-complete-business-information": "Lead details, call outcomes, conversation summaries and next steps can be saved in the existing CRM through the configured connection. Information that employees might otherwise forget to record becomes available when they need it."
  }
};

export const personalizedExplanations: Record<string, Record<string, Record<string, string>>> = {
  "problem-1": {
    "inbound": {
      "positive-operational-fewer-lost-leads": "Leads who previously received no answer can now speak to the business when they call. Instead of hanging up, losing interest or contacting competitors, they can ask questions and continue toward purchase.",
      "positive-financial-increased-revenue-potential": "Leads who were previously lost through unanswered calls can now continue toward purchase. More of those leads can become paying buyers.",
      "positive-financial-less-wasted-marketing-spend": "The business has already paid to acquire some of the leads who call. Fewer of those leads are lost because nobody answers. More of the money spent acquiring those leads can result in sales.",
      "positive-financial-lower-cost-per-buyer": "Fewer leads are lost through unanswered calls. More of those leads can become buyers. If the business gains more buyers while spending the same amount on acquiring them, the cost per buyer decreases."
    }
  },
  "problem-2": {
    "inbound": {
      "positive-operational-fewer-lost-leads": "Leads who call outside working hours no longer need to wait until employees return. They can speak to the business while they are interested. Fewer leads lose interest or contact competitors while waiting.",
      "positive-financial-increased-revenue-potential": "Leads who previously could not speak to the business outside working hours can now continue toward purchase. The business can gain sales from leads who call at times when employees are unavailable.",
      "positive-financial-less-wasted-marketing-spend": "Some paid marketing leads call outside working hours. Fewer of those leads are lost because employees are unavailable. More of the money spent acquiring those leads can result in sales."
    }
  },
  "problem-5": {
    "speed": {
      "positive-operational-fewer-lost-leads": "New leads receive calls shortly after submitting their details. Hot leads are less likely to purchase elsewhere before hearing from the business. Warm leads are less likely to lose interest while waiting.",
      "positive-financial-increased-revenue-potential": "Leads who previously lost interest or purchased elsewhere while waiting can now continue toward purchase. More of the new leads the business receives can become paying buyers.",
      "positive-financial-less-wasted-marketing-spend": "The business has already paid to acquire some of its new leads. Fewer of those leads are lost because the business takes too long to call them. More of its existing marketing spending can result in sales.",
      "positive-financial-lower-cost-per-buyer": "Fewer leads are lost while waiting for calls. More of those leads can become buyers. If the business gains more buyers without spending more money acquiring them, the cost per buyer decreases."
    }
  },
  "problem-6": {
    "speed": {
      "positive-operational-fewer-lost-leads": "New leads who previously submitted their details without receiving calls can now speak to the business. They can ask questions and continue toward purchase instead of losing interest or purchasing elsewhere.",
      "positive-financial-increased-revenue-potential": "Leads who previously received no calls had little chance to purchase through that process. Those leads can now speak to the business and continue toward purchase. More existing leads can become paying buyers.",
      "positive-financial-less-wasted-marketing-spend": "Fewer paid marketing leads remain uncontacted. Money spent acquiring those leads can result in sales instead of generating enquiries that nobody handles.",
      "positive-financial-lower-cost-per-buyer": "More of the leads the business already pays to acquire can become buyers. If the number of buyers increases without an increase in acquisition spending, the cost per buyer decreases."
    }
  },
  "problem-7": {
    "speed": {
      "positive-operational-fewer-lost-qualified-leads": "New leads who meet the business's requirements can be qualified shortly after submitting their details. They can move to the next step before losing interest or purchasing elsewhere.",
      "positive-financial-increased-revenue-potential": "Leads who qualify are less likely to leave before the business finds out that they qualify. More qualified leads can continue toward purchase and become paying buyers.",
      "positive-financial-lower-cost-per-buyer": "Fewer qualified leads are lost before they receive the next step. If more of those leads purchase while acquisition spending remains the same, the cost per buyer decreases."
    },
    "inbound": {
      "positive-operational-fewer-lost-qualified-leads": "Interested callers can find out if they qualify during their first call. They no longer need to wait for another call to find out if the business can serve them. Fewer qualified leads are lost while waiting.",
      "positive-financial-increased-revenue-potential": "Qualified callers who previously might have left while waiting for another call can now continue toward purchase. More incoming leads can become paying buyers.",
      "positive-financial-lower-cost-per-buyer": "Paid marketing leads who call the business are less likely to be lost before qualification. If more of those leads purchase without an increase in acquisition spending, the cost per buyer decreases."
    }
  },
  "problem-8": {
    "speed": {
      "positive-operational-fewer-lost-leads": "Warm new leads who are not ready to buy immediately receive further calls. They can ask more questions and continue speaking to the business while deciding whether to purchase. Fewer warm leads lose interest because nobody contacts them again.",
      "positive-financial-increased-revenue-potential": "Warm leads who need more time before purchasing can remain interested instead of being lost. More of those leads can become paying buyers when they are ready.",
      "positive-financial-less-wasted-marketing-spend": "The business has already paid to acquire some of its warm leads. Fewer of those leads are lost because nobody contacts them again. More of the money spent acquiring those leads can result in sales."
    },
    "revival": {
      "positive-operational-fewer-lost-leads": "Warm leads already stored in the CRM receive further calls. Leads who are still interested can continue speaking to the business instead of being left without contact until they lose interest.",
      "positive-financial-increased-revenue-potential": "Warm old leads who might otherwise lose interest can continue toward purchase. The business can earn revenue from leads it already has.",
      "positive-financial-less-wasted-marketing-spend": "Some warm old leads came from previous paid marketing campaigns. Those leads have another chance to purchase. Money previously spent acquiring them can still result in sales."
    }
  },
  "problem-9": {
    "revival": {
      "positive-operational-more-old-leads-reactivated": "Some old leads may now need the service, have enough money to purchase or be ready to buy. When they receive another call, they can tell the business that they are interested. They can return to the buying process instead of remaining inactive in the CRM.",
      "positive-financial-increased-revenue-potential": "Old leads who previously did not purchase may now be ready to buy. The business can earn revenue from leads that were previously inactive in the CRM.",
      "positive-financial-lower-marketing-costs": "More old leads can become buyers. If those buyers reduce the number of new leads the business needs to acquire, the business can spend less money on marketing."
    }
  },
  "problem-10": {
    "revival": {
      "positive-operational-more-old-leads-reactivated": "Old leads receive more regular calls. Leads who become interested again between calls are less likely to remain unnoticed. They can return to the buying process when they are ready.",
      "positive-operational-fewer-lost-leads": "Old leads who show interest receive further contact instead of waiting long periods between calls. Fewer of those leads lose interest again before they can purchase.",
      "positive-financial-increased-revenue-potential": "Old leads who become ready to buy are less likely to be overlooked between calls. More of those leads can become paying buyers.",
      "positive-financial-lower-marketing-costs": "More existing leads can become buyers instead of being lost through inconsistent follow-up. If those buyers reduce the need to acquire new leads, the business can spend less money on marketing."
    }
  },
  "problem-11": {
    "revival": {
      "positive-operational-fewer-lost-leads": "Old leads who have already become interested again receive further calls. They can ask questions and continue toward purchase instead of losing interest because nobody contacts them again.",
      "positive-financial-increased-revenue-potential": "Old leads who have already shown interest can continue toward purchase. More of those leads can become paying buyers instead of being lost again.",
      "positive-financial-lower-marketing-costs": "Interested old leads can become buyers without the business needing to acquire them again. If those buyers reduce the need for new leads, the business can spend less money on marketing."
    }
  },
  "problem-3": {
    "inbound": {
      "positive-operational-more-appointments-booked": "Interested callers can choose an available appointment during their first call. Instead of ending the call without booking and having to contact the business again, they can complete their bookings immediately.",
      "positive-financial-increased-revenue-potential": "Callers who previously left without booking can now attend appointments. More of those appointments can result in paid services or sales."
    },
    "speed": {
      "positive-operational-more-appointments-booked": "New leads who show interest during their calls can choose an available appointment before the call ends. They no longer need to wait for employees to call them again to complete their bookings.",
      "positive-financial-increased-revenue-potential": "Fewer interested new leads are lost between their first calls and appointment bookings. More of those leads can attend appointments and make purchases."
    },
    "revival": {
      "positive-operational-more-appointments-booked": "Old leads who become interested again can choose an appointment during their calls. Instead of becoming inactive again after showing interest, they can complete their bookings.",
      "positive-financial-increased-revenue-potential": "More interested old leads can attend appointments instead of remaining inactive after their calls. The business can earn revenue from more of the old leads it already has."
    }
  },
  "problem-12": {
    "guardian": {
      "positive-operational-more-appointments-attended": "Buyers who might otherwise forget their appointments receive reminders. They can prepare for their appointments and make time to attend. Fewer buyers miss their appointments because they forget them.",
      "positive-operational-fewer-unused-appointment-slots": "More buyers remember and attend their appointments. Fewer appointment slots remain empty because buyers forget their bookings.",
      "positive-financial-increased-revenue-potential": "More appointments take place instead of being missed. More buyers can receive paid services or attend sales appointments that may lead to purchases.",
      "positive-financial-less-wasted-employee-costs": "The business already pays employees to be available during appointment times. When more buyers attend, employees spend less paid time waiting for buyers who never arrive."
    }
  },
  "problem-13": {
    "guardian": {
      "positive-operational-more-appointments-attended": "Buyers can confirm whether they can attend their appointments. Buyers who cannot attend their original appointments can choose another available time. Fewer buyers abandon their appointments completely.",
      "positive-operational-fewer-unused-appointment-slots": "Buyers can tell the business sooner when they cannot attend. Employees have more time to offer those appointment slots to other buyers instead of discovering empty slots too late.",
      "positive-financial-increased-revenue-potential": "Buyers who cannot attend their original appointments can attend at another time. Employees can also offer available slots to other buyers. More appointments can result in paid services or sales.",
      "positive-financial-less-wasted-employee-costs": "Employees can find out sooner when buyers will not attend. If they use the available time to serve other buyers or complete other tasks, less paid employee time goes unused."
    }
  },
  "problem-14": {
    "guardian": {
      "positive-operational-fewer-unused-appointment-slots": "Buyers are more likely to remember their appointments. Buyers who cannot attend can tell the business sooner or choose another time. Employees have more time to fill available slots with other buyers.",
      "positive-operational-more-buyers-served": "Buyers who previously might have missed their appointments can attend as planned or choose another time. More buyers can receive the services they originally wanted.",
      "positive-financial-increased-revenue-potential": "Appointments that previously might have been missed can now take place at their original times or at another time. More appointments can result in paid services or sales.",
      "positive-financial-less-wasted-employee-costs": "Employees spend less paid time waiting for buyers who never arrive. When buyers attend or employees fill available appointment slots, more paid employee time can be used to provide services."
    }
  },
  "problem-15": {
    "guardian": {
      "positive-operational-more-appointments-attended": "Buyers who cannot attend their original appointments can choose another available time without waiting for employees to arrange every change. Fewer buyers abandon their appointments because changing them takes too long.",
      "positive-operational-more-employee-time-available-for-other-work": "Employees spend less time contacting buyers, checking available appointment times and changing bookings. They have more time to serve buyers and complete other tasks.",
      "positive-financial-increased-revenue-potential": "Buyers who previously might have abandoned their appointments because changing them was difficult can now attend at another time. More of those appointments can generate revenue.",
      "positive-financial-lower-employee-costs": "Employees spend fewer hours changing appointment times. If the business can reduce paid overtime or the number of employees needed to manage bookings, employee costs decrease."
    }
  },
  "problem-16": {
    "guardian": {
      "positive-operational-more-buyers-served": "Employees can find out sooner when buyers cancel or change their appointments. They have more time to offer the available slots to other buyers. If those slots are filled, more buyers can receive services.",
      "positive-financial-increased-revenue-potential": "Canceled appointment slots previously remained empty and generated no revenue. If employees fill those slots with other paying buyers, the same appointment time can generate revenue.",
      "positive-financial-less-wasted-employee-costs": "The business already pays employees to be available during the canceled appointments. If employees serve other buyers during those times, less paid employee time goes unused."
    }
  },
  "problem-4": {
    "inbound": {
      "positive-operational-more-buyers-served": "Buyers with urgent requests can reach employees who are able to help them instead of remaining without assistance. When those employees are available and respond, more buyers get the help they need.",
      "positive-operational-fewer-lost-existing-buyers": "Existing buyers with urgent problems are less likely to be left without help. When their problems are handled, they are less likely to stop buying from the business because their requests were ignored.",
      "positive-financial-increased-revenue-potential": "Existing buyers who might otherwise cancel purchases or stop buying because their urgent requests remain unresolved can receive help. The business is more likely to keep receiving revenue from those buyers."
    }
  },
  "problem-18": {
    "support": {
      "positive-operational-more-buyers-served": "Buyers with simple questions and supported account enquiries can get answers without waiting for employees. Fewer buyers leave before getting the help they need.",
      "positive-operational-fewer-lost-existing-buyers": "Existing buyers spend less time waiting for simple answers. They are less likely to become frustrated and stop buying because they repeatedly struggle to get help.",
      "positive-financial-increased-revenue-potential": "Buyers who previously might have abandoned purchases while waiting for answers can now complete those purchases. Existing buyers are also less likely to stop buying because they cannot get help."
    },
    "inbound": {
      "positive-operational-more-buyers-served": "Buyers who call with simple questions can receive answers during their calls. They no longer need to wait for employees to become available to get routine information.",
      "positive-operational-fewer-lost-existing-buyers": "Existing buyers who call for information can get answers sooner. They are less likely to stop buying because they repeatedly experience unanswered calls or long waits.",
      "positive-financial-increased-revenue-potential": "Buyers who need information before purchasing can get that information while they are interested. More buyers can complete their purchases, and fewer existing buyers may stop purchasing because they cannot get telephone assistance."
    }
  },
  "problem-21": {
    "support": {
      "positive-operational-more-buyers-served": "Buyers with supported requests can get the help they need instead of leaving their requests unfinished. More buyers can have their routine requests completed without waiting for employees.",
      "positive-operational-fewer-lost-existing-buyers": "Existing buyers can get help with basic requests that previously remained unresolved. They are less likely to stop buying because their needs are repeatedly ignored.",
      "positive-financial-increased-revenue-potential": "Buyers who previously might have canceled purchases or stopped buying because their requests were not handled can now receive help. The business is more likely to keep receiving revenue from those buyers."
    }
  },
  "problem-17": {
    "support": {
      "positive-operational-more-employee-time-available-for-other-work": "Employees spend less time answering large numbers of routine questions and account enquiries. They have more time to help buyers with complex requests and complete other tasks.",
      "positive-operational-more-tasks-completed": "Tasks that previously remained unfinished because employees were busy answering routine questions can now receive their attention. Employees can complete more of their work within their existing working hours.",
      "positive-financial-lower-employee-costs": "Employees spend fewer hours answering routine questions. If the business can reduce overtime or the number of employees needed to handle those questions, employee costs decrease.",
      "positive-financial-less-wasted-employee-costs": "The business already pays employees for their working hours. Instead of spending those hours answering routine questions, employees can serve buyers and complete other work.",
      "positive-financial-increased-revenue-potential": "Employees have more time to speak with interested leads, serve paying buyers and complete paid services. If they use that time for work that generates revenue, the business can earn more money."
    },
    "inbound": {
      "positive-operational-more-employee-time-available-for-other-work": "Employees spend less time answering routine questions during incoming calls. They have more time to handle calls that require their help and complete other tasks.",
      "positive-financial-lower-employee-costs": "Employees spend fewer hours answering routine telephone questions. If the business can reduce paid overtime or the number of employees needed to answer those calls, employee costs decrease.",
      "positive-financial-less-wasted-employee-costs": "Paid employee hours previously spent answering routine telephone questions can be used to serve buyers and complete other work. The business gets more useful work from the same employee spending.",
      "positive-financial-increased-revenue-potential": "Employees who previously spent much of their time answering routine calls can spend more time speaking with interested leads and serving paying buyers. If those additional activities result in sales, revenue increases."
    }
  },
  "problem-19": {
    "support": {
      "positive-operational-more-employee-time-available-for-other-work": "Employees no longer need to give the same answers to every buyer who asks the same questions. They have more time to handle other requests and complete other tasks.",
      "positive-financial-lower-employee-costs": "Employees spend fewer hours answering repeated questions. If the business needs fewer paid hours or additional employees for that work, employee costs decrease.",
      "positive-financial-less-wasted-employee-costs": "Instead of paying employees to repeatedly provide the same information, the business can use those paid hours for work that requires employee help."
    },
    "inbound": {
      "positive-operational-more-employee-time-available-for-other-work": "Employees spend less time answering incoming calls containing the same questions. They have more time to handle other calls, serve buyers and complete other tasks.",
      "positive-financial-lower-employee-costs": "Employees spend fewer hours answering repeated telephone questions. If the business can reduce paid overtime or the number of employees needed to answer those calls, employee costs decrease.",
      "positive-financial-less-wasted-employee-costs": "Paid employee hours previously spent repeating the same information over the phone can be used for other useful work."
    }
  },
  "problem-20": {
    "inbound": {
      "positive-operational-more-employee-time-available-for-other-work": "Employees spend less time answering calls, collecting lead details, qualifying leads, booking appointments and updating records. They have more time to complete other tasks.",
      "positive-operational-more-buyers-served": "Buyers who previously waited while employees completed other manual tasks can now receive routine assistance. More buyers can get help even when employees are busy.",
      "positive-financial-increased-revenue-potential": "Fewer leads and buyers leave because employees are busy completing manual tasks. More of those leads and buyers can book appointments, purchase or receive paid services.",
      "positive-financial-lower-employee-costs": "Employees spend fewer hours handling incoming calls and related manual tasks. If the business can reduce paid overtime or the number of employees needed for that work, employee costs decrease.",
      "positive-financial-less-wasted-employee-costs": "Paid employee hours previously spent on routine telephone tasks can be used to serve buyers and complete work that requires employee help. The business gets more useful work from the same employee spending."
    },
    "speed": {
      "positive-operational-more-employee-time-available-for-other-work": "Employees spend less time manually calling new leads, collecting their details, qualifying them, following up and booking appointments. They have more time to speak with interested leads and complete other tasks.",
      "positive-financial-increased-revenue-potential": "New leads spend less time waiting while employees complete other manual tasks. Fewer interested leads are lost before qualification or booking. More new leads can become paying buyers.",
      "positive-financial-lower-employee-costs": "Employees spend fewer hours contacting, qualifying and following up with new leads. If the business can reduce paid overtime or the number of employees needed for this work, employee costs decrease.",
      "positive-financial-less-wasted-employee-costs": "Paid employee hours previously spent on repeated lead calls, qualification questions and follow-ups can be used to speak with interested leads and complete other useful work."
    },
    "revival": {
      "positive-operational-more-employee-time-available-for-other-work": "Employees spend less time manually calling old leads, finding out who is still interested and arranging appointments. They have more time to speak with interested leads and complete other tasks.",
      "positive-financial-increased-revenue-potential": "Old leads who previously remained inactive because employees had no time to call them can receive contact. Leads who are interested again can become paying buyers.",
      "positive-financial-lower-employee-costs": "Employees spend fewer hours contacting and following up with old leads. If the business needs fewer paid hours or additional employees to handle those leads, employee costs decrease.",
      "positive-financial-less-wasted-employee-costs": "Employees spend less paid time calling old leads who may no longer be interested. They can spend more of their paid hours speaking with interested leads and completing other useful work."
    },
    "guardian": {
      "positive-operational-more-employee-time-available-for-other-work": "Employees spend less time manually reminding buyers, confirming appointments and changing appointment times. They have more time to serve buyers and complete other tasks.",
      "positive-operational-more-buyers-served": "Buyers no longer need to wait for employees to handle every reminder, confirmation or appointment change. Fewer buyers miss or abandon their appointments because employees cannot complete those tasks in time.",
      "positive-financial-increased-revenue-potential": "More appointments can take place instead of being missed or abandoned because employees cannot complete every appointment-related task. More buyers can receive paid services or attend sales appointments.",
      "positive-financial-lower-employee-costs": "Employees spend fewer hours managing appointments. If the business can reduce overtime or the number of employees needed for appointment management, employee costs decrease.",
      "positive-financial-less-wasted-employee-costs": "Paid employee hours previously spent on repetitive appointment tasks can be used to serve buyers and complete other work."
    },
    "support": {
      "positive-operational-more-employee-time-available-for-other-work": "Employees spend less time manually answering questions, handling account enquiries and completing routine requests. They have more time for complex requests and other tasks.",
      "positive-operational-more-tasks-completed": "Routine requests can be completed while employees work on other tasks. Employees can complete work that previously remained unfinished because they were busy handling routine requests.",
      "positive-operational-more-buyers-served": "Buyers with routine requests can receive help without waiting for employees to finish other manual work. Employees also have more time to help buyers with complex requests.",
      "positive-financial-increased-revenue-potential": "Fewer buyers abandon purchases because employees are busy completing manual work. Employees also have more time to serve paying buyers and complete work that can generate revenue.",
      "positive-financial-lower-employee-costs": "Employees spend fewer hours answering routine questions and handling supported requests. If the business can reduce paid overtime or the number of employees needed for support, employee costs decrease.",
      "positive-financial-less-wasted-employee-costs": "Paid employee hours previously spent on repetitive support tasks can be used for work that requires employee help."
    },
    "payments": {
      "positive-operational-more-employee-time-available-for-other-work": "Employees spend less time manually reminding buyers about payments, following up on unpaid invoices and answering routine payment questions. They have more time to handle difficult payment cases and complete other tasks."
    }
  },
  "problem-28": {
    "inbound": {
      "positive-operational-fewer-lost-leads": "Leads can receive answers even when employees are busy with other calls or tasks. Fewer interested callers hang up, lose interest or contact competitors because employees cannot answer.",
      "positive-operational-more-buyers-served": "Buyers with routine telephone requests can get help while employees are occupied with other work. More buyers can receive assistance despite the limited number of employees available.",
      "positive-financial-increased-revenue-potential": "Fewer leads and buyers leave because employees cannot answer every incoming call. More leads can become buyers, and more existing buyers can continue purchasing.",
      "positive-financial-lower-employee-costs": "The business can handle more incoming calls without requiring employees to answer every call. If the business can reduce overtime or avoid hiring additional employees to handle those calls, employee costs decrease."
    },
    "speed": {
      "positive-operational-fewer-lost-leads": "New leads can receive calls even when employees are busy with other leads and tasks. Fewer new leads lose interest or purchase elsewhere because employees cannot contact them in time.",
      "positive-financial-increased-revenue-potential": "More new leads can receive calls, be qualified and book appointments despite employees being overloaded. More of the leads the business already receives can become paying buyers.",
      "positive-financial-lower-employee-costs": "The business can handle its new leads without requiring employees to personally call and qualify every lead. If fewer overtime hours or additional employees are needed, employee costs decrease."
    },
    "revival": {
      "positive-operational-fewer-lost-leads": "Old leads can receive calls even when employees are busy handling new leads and other tasks. Old leads who are still interested or become interested again are less likely to be overlooked.",
      "positive-financial-increased-revenue-potential": "Old leads who previously remained inactive because employees were overloaded can return to the buying process. More of those leads can become paying buyers.",
      "positive-financial-lower-employee-costs": "Old leads can receive calls and follow-ups without requiring employees to personally contact every lead. If the business can reduce overtime or avoid hiring additional employees for this work, employee costs decrease."
    },
    "guardian": {
      "positive-operational-more-buyers-served": "Buyers can receive reminders, confirm appointments and arrange other times even when employees are busy. Fewer buyers miss or abandon appointments because employees cannot manage every booking.",
      "positive-financial-increased-revenue-potential": "More appointments take place despite employees being overloaded. More buyers can receive paid services or attend sales appointments that may lead to purchases.",
      "positive-financial-lower-employee-costs": "The business can manage its appointments without requiring employees to personally handle every reminder, confirmation and appointment change. If fewer paid overtime hours or additional employees are needed, employee costs decrease."
    },
    "support": {
      "positive-operational-more-buyers-served": "Buyers with routine questions and supported requests can receive help while employees handle other requests. Fewer buyers leave because employees are too busy to help them.",
      "positive-operational-more-tasks-completed": "Routine requests can be completed while employees work on other tasks. Employees have more time to complete work that previously remained unfinished because they were overloaded.",
      "positive-financial-increased-revenue-potential": "Buyers who previously might have left because employees were too busy to help can now continue with their purchases. Employees also have more time to serve paying buyers and complete work that can generate revenue.",
      "positive-financial-lower-employee-costs": "The business can handle more routine buyer requests without requiring employees to handle every request personally. If fewer paid overtime hours or additional employees are needed, employee costs decrease."
    }
  },
  "problem-22": {
    "payments": {
      "positive-operational-fewer-unpaid-invoices": "Buyers who forget their payment deadlines receive reminders. Buyers who are able to pay are less likely to leave their invoices unpaid simply because they forgot about them.",
      "positive-financial-faster-cash-collection": "Buyers who forget their payment deadlines receive reminders and may pay sooner. The business receives the money it is owed earlier instead of waiting for buyers to remember their payments."
    }
  },
  "problem-23": {
    "payments": {
      "positive-operational-fewer-unpaid-invoices": "Buyers with unpaid invoices receive more regular contact. Buyers who forget their payments can be reminded. Buyers who struggle to pay can receive information about approved payment plans. More buyers may pay their outstanding invoices.",
      "positive-financial-faster-cash-collection": "Buyers with unpaid invoices receive further contact instead of being left without reminders for long periods. Buyers who are able to pay may pay sooner. The business receives its money earlier.",
      "positive-financial-less-money-lost-from-unpaid-invoices": "Buyers who might otherwise leave their invoices unpaid receive further contact. Some may pay their invoices or use approved payment plans. The business can recover money it might otherwise never receive.",
      "positive-financial-lower-collection-costs": "Employees spend fewer hours personally following up on unpaid invoices. If the business can reduce paid collection hours or the amount it spends on external collection services, it spends less money recovering payments."
    }
  },
  "problem-24": {
    "reviews": {
      "positive-operational-more-buyer-reviews": "Buyers who previously completed their purchases without being asked for reviews now receive a request. Buyers who are willing to leave reviews are less likely to forget or leave without doing so.",
      "positive-operational-more-new-buyers": "New leads can read more about the experiences of previous buyers. If those reviews are positive, leads who were unsure about purchasing may feel more comfortable buying from the business instead of choosing competitors.",
      "positive-financial-increased-revenue-potential": "Leads who previously hesitated to purchase because they could not find enough reviews may now find the information they need. If more of those leads purchase, the business earns more revenue.",
      "positive-financial-lower-cost-per-buyer": "More leads from existing marketing campaigns may become buyers after reading positive reviews. If the business gains more buyers while spending the same amount on acquiring them, the cost per buyer decreases."
    }
  },
  "problem-25": {
    "dashboard": {
      "positive-operational-more-complete-business-information": "Employees can listen to previous calls, read conversations and check recorded call outcomes. They can find out what callers requested, what answers they received, which appointments were booked and which requests failed. They no longer need to rely entirely on memory or incomplete records."
    }
  },
  "problem-26": {
    "crm": {
      "positive-operational-more-complete-business-information": "Lead details, previous conversations, call outcomes and next steps can be saved in the existing CRM. Information that employees might otherwise forget to record becomes available when they need to contact or assist those leads."
    }
  },
  "problem-27": {
    "dashboard": {
      "positive-operational-more-complete-business-information": "Employees can see which calls the agent handled, which appointments were booked, which requests failed and how calls were assessed. Instead of guessing what the agent has completed, employees can check the available records."
    }
  }
};
