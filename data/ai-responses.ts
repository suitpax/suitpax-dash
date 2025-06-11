// Comprehensive AI responses for different travel scenarios
// These responses are designed to be contextual and helpful for business travelers

export interface ContextualResponse {
  keywords: string[]
  response: string
  followUp?: string
  options?: string[]
}

export const flightResponses: ContextualResponse[] = [
  {
    keywords: ["cheap", "budget", "affordable", "cost", "price"],
    response:
      "I understand you're looking for budget-friendly flight options. To find the best deals, I recommend booking 4-6 weeks in advance and being flexible with your travel dates if possible. Mid-week flights (Tuesday and Wednesday) are typically cheaper than weekend flights.",
    followUp: "Would you like me to search for specific dates or destinations to find you the best deals?",
    options: ["Search for specific dates", "Show me flexible date options", "Compare different airlines"],
  },
  {
    keywords: ["business class", "first class", "premium", "upgrade"],
    response:
      "For business or premium class travel, I recommend booking through your company's preferred airline partners to maximize corporate discounts. Many airlines also offer upgrade opportunities using points or at check-in for a reduced rate.",
    followUp: "Would you like me to check for upgrade availability on your upcoming flights?",
    options: ["Check upgrade availability", "Show point upgrade options", "Find business class deals"],
  },
  {
    keywords: ["delay", "cancel", "reschedule", "change"],
    response:
      "I'm sorry to hear about your flight changes. In case of delays or cancellations, you're entitled to either a full refund or rebooking on the next available flight. For flights to/from the EU, you may also be eligible for compensation under EC 261 regulations if the delay exceeds 3 hours.",
    followUp: "Would you like me to help you rebook your flight or check your compensation eligibility?",
    options: ["Help me rebook", "Check compensation eligibility", "Contact the airline"],
  },
  {
    keywords: ["baggage", "luggage", "suitcase", "carry-on", "checked"],
    response:
      "For your baggage inquiry: most airlines allow one carry-on (22 x 14 x 9 inches/56 x 36 x 23 cm) and one personal item free of charge. Checked baggage policies vary by airline and fare class. Business travelers often benefit from priority baggage handling with premium tickets or airline status.",
    followUp: "Would you like me to check the specific baggage policy for your airline?",
    options: ["Check specific airline policy", "Baggage tracking options", "Excess baggage fees"],
  },
  {
    keywords: ["miles", "points", "rewards", "loyalty", "frequent flyer"],
    response:
      "Maximizing your frequent flyer miles is a smart strategy. Consider consolidating travel with one airline alliance (Star Alliance, OneWorld, or SkyTeam) to reach status faster. Credit card points can often be transferred to multiple airline programs, giving you more flexibility.",
    followUp: "Would you like me to help optimize your miles strategy or check your current point balances?",
    options: ["Optimize my miles strategy", "Check point balances", "Find best redemption options"],
  },
  {
    keywords: ["international", "visa", "passport", "customs", "immigration"],
    response:
      "For international travel, ensure your passport is valid for at least 6 months beyond your return date. Visa requirements vary by destination and your citizenship. Many business travelers benefit from programs like Global Entry, TSA PreCheck, or CLEAR to expedite security and immigration.",
    followUp: "Would you like me to check visa requirements for a specific destination?",
    options: ["Check visa requirements", "Expedited security programs", "International travel checklist"],
  },
  {
    keywords: ["direct", "nonstop", "connecting", "layover"],
    response:
      "When considering flight routes, nonstop flights save time but often cost more. Strategic layovers (1-2 hours domestic, 2-3 hours international) provide buffer for delays while minimizing total travel time. For long-haul flights, sometimes a longer layover in a premium lounge can help reduce travel fatigue.",
    followUp: "What's your preference for your upcoming trip?",
    options: ["Find nonstop options", "Optimize layover time", "Find routes with lounge access"],
  },
]

export const hotelResponses: ContextualResponse[] = [
  {
    keywords: ["luxury", "5-star", "premium", "high-end"],
    response:
      "For luxury accommodations, I recommend focusing on hotels that offer executive floors or club access, which typically include private check-in, dedicated concierge, and lounge access with complimentary breakfast and evening refreshments—amenities particularly valuable for business travelers.",
    followUp: "Would you like me to find luxury hotels with executive lounges in your destination?",
    options: ["Find hotels with executive lounges", "Compare 5-star options", "Show luxury boutique hotels"],
  },
  {
    keywords: ["budget", "affordable", "cheap", "inexpensive"],
    response:
      "For budget-conscious business travel, consider well-located business hotels like Courtyard by Marriott, Hilton Garden Inn, or Hyatt Place that offer essential amenities (reliable WiFi, workspace, breakfast) without the premium price tag of luxury properties. Booking directly with hotels often matches online rates and earns you loyalty points.",
    followUp: "Would you like me to find budget-friendly business hotels for your trip?",
    options: ["Find budget business hotels", "Compare rates across chains", "Show extended stay options"],
  },
  {
    keywords: ["location", "downtown", "central", "near", "close"],
    response:
      "Location is crucial for business travel efficiency. Staying near your meeting locations can save valuable time and transportation costs. Many business districts have hotels within walking distance of major office complexes, and some companies have negotiated corporate rates with strategically located properties.",
    followUp: "Would you like me to find hotels near a specific address or landmark?",
    options: ["Find hotels near an address", "Show walkable options", "Compare transportation times"],
  },
  {
    keywords: ["amenities", "facilities", "gym", "wifi", "breakfast"],
    response:
      "For business travelers, key amenities include reliable high-speed WiFi, in-room workspaces, 24-hour business centers, and fitness facilities. Many business-oriented hotels now offer flexible spaces for impromptu meetings and tech-enabled meeting rooms that can be booked by the hour.",
    followUp: "Which amenities are most important for your stay?",
    options: ["Hotels with meeting spaces", "24-hour fitness centers", "Best in-room workspaces"],
  },
  {
    keywords: ["points", "rewards", "loyalty", "status", "program"],
    response:
      "Hotel loyalty programs offer significant benefits for frequent business travelers. Elite status perks like guaranteed late checkout, room upgrades, and breakfast can enhance productivity. Consider focusing on one or two major hotel groups (Marriott, Hilton, Hyatt, IHG) to reach higher status tiers faster.",
    followUp: "Would you like me to help optimize your hotel loyalty strategy?",
    options: ["Optimize loyalty strategy", "Status match opportunities", "Best point redemption options"],
  },
  {
    keywords: ["extended stay", "long term", "weekly", "monthly"],
    response:
      "For extended business trips (1+ weeks), consider suite hotels or serviced apartments that offer kitchen facilities, separate living areas, and often reduced rates for longer stays. Brands like Residence Inn, Homewood Suites, or local serviced apartment providers can offer significant savings and more comfortable accommodations for longer periods.",
    followUp: "How long will your extended stay be?",
    options: ["Find weekly rate options", "Compare suite hotels", "Show serviced apartments"],
  },
  {
    keywords: ["cancel", "change", "flexible", "refundable"],
    response:
      "Business travel often requires flexibility. Many hotels offer fully refundable rates that can be canceled up to 24-48 hours before arrival. While these rates are typically 10-15% higher than non-refundable options, they provide valuable flexibility for changing business schedules. Some hotel loyalty programs offer free cancellation as a status benefit.",
    followUp: "Would you like me to find hotels with flexible cancellation policies?",
    options: ["Find flexible rates", "Compare cancellation policies", "Check status benefits"],
  },
]

export const transportationResponses: ContextualResponse[] = [
  {
    keywords: ["car rental", "rent a car", "rental car"],
    response:
      "When renting a car for business travel, booking through your company's corporate portal often provides discounted rates and included insurance coverage. Consider joining rental car loyalty programs for faster pickup/dropoff and potential upgrades. For urban destinations, evaluate whether a car is necessary or if rideshare/public transit would be more efficient.",
    followUp: "Would you like me to help you find a rental car for your trip?",
    options: ["Compare rental car options", "Check corporate discounts", "Evaluate transportation alternatives"],
  },
  {
    keywords: ["uber", "lyft", "taxi", "cab", "rideshare"],
    response:
      "Rideshare services like Uber and Lyft often provide the most flexible ground transportation option for business travelers. Many companies have corporate accounts that allow direct billing and policy enforcement. For frequent trips between the same locations, scheduling rides in advance can provide peace of mind and more consistent service.",
    followUp: "Would you like me to help you estimate rideshare costs for your trip?",
    options: ["Estimate trip costs", "Compare rideshare options", "Set up scheduled rides"],
  },
  {
    keywords: ["train", "rail", "subway", "metro", "public transportation"],
    response:
      "In many global business hubs, trains and public transit can be faster than cars during peak hours. High-speed rail between nearby cities (like Acela in the Northeast US or trains throughout Europe and Asia) often delivers door-to-door times competitive with flying when accounting for airport procedures and city access.",
    followUp: "Would you like me to check train or public transit options for your trip?",
    options: ["Find train connections", "Check public transit routes", "Compare with other transport modes"],
  },
  {
    keywords: ["airport transfer", "shuttle", "from airport", "to airport"],
    response:
      "For airport transfers, pre-arranged transportation provides peace of mind after long flights. Options range from hotel shuttles (often complimentary) to pre-booked private cars. In unfamiliar cities, especially with late arrivals or language barriers, having confirmed transportation waiting can significantly reduce travel stress.",
    followUp: "Would you like me to arrange airport transportation for your trip?",
    options: ["Check hotel shuttle availability", "Book private transfer", "Compare transportation options"],
  },
  {
    keywords: ["chauffeur", "car service", "private driver", "black car"],
    response:
      "Executive car services provide reliable, professional transportation for high-stakes business meetings or client entertainment. These services typically offer flight tracking (adjusting for delays), professional drivers familiar with business districts, and the ability to work confidentially during transit. Many allow booking by the hour for multiple stops.",
    followUp: "Would you like me to find executive car service options?",
    options: ["Compare car service rates", "Book hourly service", "Schedule multiple pickups"],
  },
  {
    keywords: ["parking", "garage", "valet", "self-park"],
    response:
      "Parking in business districts can be expensive and time-consuming. Many hotels charge $30-50/day for parking. Some alternatives include nearby public garages (often cheaper than hotel parking), or apps like SpotHero that allow you to reserve discounted parking in advance. Some expense policies cover parking costs when driving is the most efficient option.",
    followUp: "Would you like me to help find parking options at your destination?",
    options: ["Find hotel parking rates", "Compare nearby garages", "Check parking apps for deals"],
  },
]

export const expenseResponses: ContextualResponse[] = [
  {
    keywords: ["receipt", "receipts", "missing receipt", "lost receipt"],
    response:
      "For missing receipts, most company policies allow alternative documentation. Credit card statements can serve as backup, though they typically need to be accompanied by details about the business purpose. Some companies accept digital receipt declaration forms for smaller amounts. Always check your specific company policy for receipt thresholds and documentation requirements.",
    followUp: "Would you like me to help you document a missing receipt?",
    options: ["Create receipt declaration", "Check company policy", "Find credit card statement"],
  },
  {
    keywords: ["per diem", "daily allowance", "meal allowance"],
    response:
      "Per diem allowances simplify expense management by providing a fixed daily amount for meals and incidentals without requiring itemized receipts. Rates typically vary by destination to account for cost differences. Some companies offer a choice between actual expense reimbursement (with receipts) or per diem. International per diems often follow government published rates (like US State Department rates).",
    followUp: "Would you like me to check the per diem rates for your destination?",
    options: ["Check destination rates", "Compare with actual expenses", "Review company policy"],
  },
  {
    keywords: ["reimbursement", "submit expense", "expense report"],
    response:
      "For efficient expense reimbursement, submit reports promptly after trip completion with all required documentation. Many expense systems allow real-time submission via mobile apps as expenses occur. Categorize expenses accurately according to your company's chart of accounts, and include clear business purposes for each item to minimize follow-up questions and processing delays.",
    followUp: "Would you like tips on organizing your expense documentation?",
    options: ["Mobile submission tips", "Expense categorization guide", "Documentation best practices"],
  },
  {
    keywords: ["corporate card", "company card", "business credit card"],
    response:
      "Corporate cards streamline expense management by centralizing business charges and often integrating directly with expense systems. Most companies require corporate cards to be used for all business expenses when available. Be aware of your company's policy regarding personal charges on corporate cards—many strictly prohibit this practice even if you intend to reimburse the company.",
    followUp: "Would you like me to help you understand your corporate card policy?",
    options: ["Review card policy", "Check integration with expense system", "Handle card disputes"],
  },
  {
    keywords: ["tax", "vat", "gst", "refund", "deduction"],
    response:
      "Business travelers should be aware of potential tax advantages. Many countries offer VAT/GST refunds for business expenses, though the process varies by country. Keep detailed records and original receipts for international expenses. For self-employed travelers, maintain clear documentation of business purposes for potential tax deductions according to your country's regulations.",
    followUp: "Would you like information about tax considerations for a specific country?",
    options: ["VAT refund process", "Documentation requirements", "Self-employed deductions"],
  },
  {
    keywords: ["policy", "compliance", "allowed", "limit", "threshold"],
    response:
      "Understanding your company's travel policy prevents reimbursement issues. Common policy elements include required booking channels, class of service guidelines (economy vs. premium), hotel rate caps by city, and approval requirements for exceptions. Many companies use automated systems that flag out-of-policy expenses for additional review, potentially delaying reimbursement.",
    followUp: "Would you like me to help you check if an expense complies with your policy?",
    options: ["Check specific expense compliance", "Review policy highlights", "Request policy exception"],
  },
  {
    keywords: ["mileage", "personal car", "reimburse miles", "driving expense"],
    response:
      "When using your personal vehicle for business travel, mileage reimbursement typically covers fuel, wear and tear, and insurance. Most companies follow standard rates (like IRS rates in the US, currently $0.67/mile for 2023). Document your starting point, destination, business purpose, and total miles. Some expense systems integrate with mapping tools to automatically calculate and verify mileage claims.",
    followUp: "Would you like me to help calculate your mileage reimbursement?",
    options: ["Calculate reimbursement amount", "Document mileage properly", "Compare with other transport options"],
  },
]

export const itineraryResponses: ContextualResponse[] = [
  {
    keywords: ["itinerary", "schedule", "plan", "agenda"],
    response:
      "An effective business travel itinerary balances productivity with realistic timing. Allow buffer time between meetings (especially in unfamiliar cities), account for potential travel delays, and consider time zone adjustments for your body clock. Digital tools like TripIt or your company's travel portal can consolidate all reservations into a single timeline view accessible offline.",
    followUp: "Would you like me to help organize your travel itinerary?",
    options: ["Create consolidated timeline", "Add buffer time to schedule", "Share itinerary with colleagues"],
  },
  {
    keywords: ["jet lag", "time zone", "sleep", "fatigue", "adjust"],
    response:
      "To minimize jet lag on business trips, begin adjusting your sleep schedule 2-3 days before departure, moving 1-2 hours toward your destination time zone each day. During the flight, stay hydrated, avoid alcohol, and consider a short nap (under 30 minutes) if traveling westward. Upon arrival, expose yourself to natural light during daylight hours at your destination to help reset your circadian rhythm.",
    followUp: "Would you like a personalized jet lag mitigation plan for your trip?",
    options: ["Create adjustment schedule", "Flight strategies", "Destination adjustment tips"],
  },
  {
    keywords: ["meeting", "client", "presentation", "conference"],
    response:
      "For business meetings in unfamiliar locations, scout the venue in advance when possible—even arriving the day before for critical presentations. Confirm technology compatibility for presentations, and have backup plans for sharing materials. For client meetings, research local business customs and appropriate attire, which can vary significantly by industry and region.",
    followUp: "Would you like tips for preparing for your business meetings?",
    options: ["Technology preparation checklist", "Local business customs", "Meeting logistics planning"],
  },
  {
    keywords: ["bleisure", "extend", "weekend", "personal", "vacation"],
    response:
      "Combining business and leisure travel ('bleisure') can improve work-life balance and maximize travel value. Many companies allow extending business trips over weekends at no additional cost to the company if the flight prices are equal or lower. Be clear about separating business and personal expenses, and understand any insurance or liability implications when extending corporate travel for personal purposes.",
    followUp: "Would you like guidance on extending your business trip?",
    options: ["Compare flight options", "Understand policy implications", "Separate business/personal expenses"],
  },
  {
    keywords: ["productive", "efficiency", "work", "time management"],
    response:
      "Maximize travel productivity by preparing task lists suited to different environments: flights without WiFi are ideal for focused reading or document review, while airport lounges work well for emails and calls. Consider time zone differences when scheduling calls, and use travel time for professional development or strategic thinking that's hard to prioritize during normal office days.",
    followUp: "Would you like help creating a productivity plan for your trip?",
    options: ["Create environment-based task lists", "Time zone management", "Professional development planning"],
  },
  {
    keywords: ["emergency", "crisis", "medical", "safety", "security"],
    response:
      "For travel emergencies, ensure you have your company's assistance program contact information readily accessible offline. Many corporate travel programs include emergency support services that can help with medical referrals, emergency travel changes, or security situations. Register international trips with your country's embassy or consular service, and consider services like International SOS for additional support in remote locations.",
    followUp: "Would you like to review emergency preparation for your trip?",
    options: ["Create emergency contact list", "Review insurance coverage", "Destination safety briefing"],
  },
  {
    keywords: ["packing", "luggage", "suitcase", "carry-on", "essentials"],
    response:
      "Efficient business travel packing centers on versatility and preparedness. Choose a color-coordinated wardrobe where items can be mixed and matched. Essential tech includes portable chargers, universal adapters, and backup presentation copies. Consider packing cubes for organization, wrinkle-resistant fabrics, and always keep critical items (medications, documents, tech) in your carry-on regardless of checked baggage.",
    followUp: "Would you like a customized packing list for your trip?",
    options: ["Create business attire packing list", "Tech essentials checklist", "Minimalist packing strategies"],
  },
]

export const policyResponses: ContextualResponse[] = [
  {
    keywords: ["approval", "pre-approval", "authorize", "permission"],
    response:
      "Most corporate travel policies require pre-approval for trips exceeding certain cost thresholds or for travel to high-risk destinations. The approval workflow typically routes through your direct manager and potentially additional stakeholders for higher-cost trips. Using your company's designated booking tools usually automates this approval process and creates the necessary audit trail.",
    followUp: "Would you like me to help you understand the approval requirements for your trip?",
    options: ["Check approval thresholds", "Initiate approval request", "Document special circumstances"],
  },
  {
    keywords: ["exception", "override", "waiver", "special approval"],
    response:
      "Policy exceptions may be necessary in certain business situations. Most companies require documented business justification and additional approval for exceptions. Common exceptions include premium class travel for flights exceeding certain durations (typically 6-8 hours), higher hotel rates during major conferences or events, or using non-preferred suppliers when alternatives aren't available.",
    followUp: "Do you need help requesting a policy exception?",
    options: ["Create exception justification", "Identify approval requirements", "Document business necessity"],
  },
  {
    keywords: ["preferred", "vendor", "supplier", "partner", "negotiated"],
    response:
      "Using preferred suppliers (airlines, hotels, car rentals) is typically mandatory under corporate travel policies. These arrangements provide negotiated discounts, consolidated data for vendor management, and often enhanced duty of care capabilities. Booking outside preferred channels may result in non-reimbursement of expenses or require additional justification and approval.",
    followUp: "Would you like to check if a specific vendor is preferred under your policy?",
    options: ["Check preferred vendor status", "Compare negotiated rates", "Understand booking requirements"],
  },
  {
    keywords: ["class", "premium", "business class", "first class", "economy"],
    response:
      "Travel class policies typically specify when premium travel is permitted. Common thresholds include flight duration (e.g., business class for flights over 8 hours), traveler seniority (executive allowances), or specific business needs (meeting immediately after arrival). Some policies allow premium economy as a middle option or permit using points/miles for upgrades while paying for economy fares.",
    followUp: "Would you like to check if premium travel is allowed for your trip?",
    options: ["Check class eligibility", "Understand upgrade options", "Review policy thresholds"],
  },
  {
    keywords: ["duty of care", "safety", "security", "risk", "tracking"],
    response:
      "Duty of care obligations require companies to ensure employee safety during business travel. This includes pre-trip assessments for high-risk destinations, real-time traveler tracking during disruptions or emergencies, and providing resources for medical or security assistance. Booking through approved channels ensures your location is known if emergency assistance becomes necessary.",
    followUp: "Would you like information about safety resources for your destination?",
    options: ["Destination risk assessment", "Emergency contact procedures", "Health and safety resources"],
  },
  {
    keywords: ["sustainable", "green", "carbon", "emissions", "environmental"],
    response:
      "Sustainable business travel policies are increasingly common. These may include carbon budgets for departments, encouragement of rail over short-haul flights, virtual meeting alternatives for non-essential travel, or carbon offset programs. Some companies now require sustainability justification alongside business justification for trip approval.",
    followUp: "Would you like to explore sustainable options for your business travel?",
    options: ["Calculate carbon footprint", "Compare transportation emissions", "Explore offset programs"],
  },
  {
    keywords: ["companion", "spouse", "family", "guest", "personal travel"],
    response:
      "Most corporate policies strictly separate business and personal travel expenses. If traveling with companions, only your business expenses are reimbursable. Some policies allow companions to share accommodations at no additional cost to the company, but any incremental costs (higher room rates, additional meals) must be paid personally. Mixing business and personal travel requires clear expense separation.",
    followUp: "Do you need guidance on traveling with companions?",
    options: ["Understand policy limitations", "Separate business/personal expenses", "Document shared costs"],
  },
]

// Main export of all response categories
export const aiResponses = {
  flight: flightResponses,
  hotel: hotelResponses,
  transportation: transportationResponses,
  expense: expenseResponses,
  itinerary: itineraryResponses,
  policy: policyResponses,
}

// Helper function to find the most relevant response based on user input
export function findRelevantResponse(input: string): ContextualResponse | null {
  const normalizedInput = input.toLowerCase()

  // Check all categories
  const allCategories = [
    ...flightResponses,
    ...hotelResponses,
    ...transportationResponses,
    ...expenseResponses,
    ...itineraryResponses,
    ...policyResponses,
  ]

  // Score each response based on keyword matches
  const scoredResponses = allCategories.map((response) => {
    const matchCount = response.keywords.filter((keyword) => normalizedInput.includes(keyword.toLowerCase())).length

    return {
      response,
      score: matchCount,
    }
  })

  // Sort by score (highest first)
  scoredResponses.sort((a, b) => b.score - a.score)

  // Return the highest scoring response if it has at least one match
  if (scoredResponses[0].score > 0) {
    return scoredResponses[0].response
  }

  return null
}
