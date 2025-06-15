// Comprehensive Travel Industry Knowledge Base
export const AIRLINES = {
  major: [
    "American Airlines",
    "Delta Air Lines",
    "United Airlines",
    "Southwest Airlines",
    "Lufthansa",
    "British Airways",
    "Air France",
    "KLM",
    "Emirates",
    "Qatar Airways",
    "Singapore Airlines",
    "Cathay Pacific",
    "Japan Airlines",
    "All Nippon Airways",
    "Turkish Airlines",
    "Etihad Airways",
    "Swiss International",
    "Austrian Airlines",
  ],
  lowCost: [
    "Ryanair",
    "EasyJet",
    "Spirit Airlines",
    "Frontier Airlines",
    "JetBlue Airways",
    "Wizz Air",
    "Vueling",
    "Norwegian Air",
    "Scoot",
    "AirAsia",
    "Jetstar",
  ],
  regional: [
    "Alaska Airlines",
    "JetBlue",
    "Virgin Atlantic",
    "TAP Air Portugal",
    "Scandinavian Airlines",
    "Finnair",
    "Iberia",
    "Alitalia",
    "LOT Polish",
  ],
}

export const AIRPORTS = {
  major: [
    {
      code: "JFK",
      name: "John F. Kennedy International",
      city: "New York",
      lounges: ["American Express Centurion", "Delta Sky Club", "British Airways Terraces"],
    },
    {
      code: "LAX",
      name: "Los Angeles International",
      city: "Los Angeles",
      lounges: ["Star Alliance", "SkyTeam", "oneworld"],
    },
    {
      code: "LHR",
      name: "London Heathrow",
      city: "London",
      lounges: ["British Airways Galleries", "Virgin Atlantic Clubhouse", "Plaza Premium"],
    },
    {
      code: "CDG",
      name: "Charles de Gaulle",
      city: "Paris",
      lounges: ["Air France La Première", "Star Alliance", "Priority Pass"],
    },
    {
      code: "FRA",
      name: "Frankfurt Airport",
      city: "Frankfurt",
      lounges: ["Lufthansa Senator", "Star Alliance", "Plaza Premium"],
    },
    { code: "NRT", name: "Narita International", city: "Tokyo", lounges: ["JAL Sakura", "ANA Suite", "United Club"] },
    { code: "DXB", name: "Dubai International", city: "Dubai", lounges: ["Emirates First Class", "dnata", "Marhaba"] },
    {
      code: "SIN",
      name: "Singapore Changi",
      city: "Singapore",
      lounges: ["Singapore Airlines SilverKris", "SATS Premier", "Plaza Premium"],
    },
  ],
}

export const VIP_LOUNGES = {
  networks: ["Priority Pass", "LoungeKey", "Diners Club", "American Express Global Lounge Collection"],
  premium: [
    "Emirates First Class Lounge",
    "Lufthansa First Class Terminal",
    "British Airways Concorde Room",
    "Singapore Airlines Private Room",
    "Cathay Pacific The Pier First",
    "American Express Centurion",
  ],
}

export const EUROPEAN_TRAINS = {
  operators: [
    { name: "Deutsche Bahn (DB)", country: "Germany", routes: ["ICE", "IC", "EC"] },
    { name: "SNCF Connect", country: "France", routes: ["TGV", "Intercités", "TER"] },
    { name: "Trenitalia", country: "Italy", routes: ["Frecciarossa", "Frecciargento", "Frecciabianca"] },
    { name: "Renfe", country: "Spain", routes: ["AVE", "Alvia", "Avant"] },
    { name: "SBB", country: "Switzerland", routes: ["IC", "IR", "RE"] },
    { name: "ÖBB", country: "Austria", routes: ["Railjet", "IC", "EC"] },
    { name: "NS International", country: "Netherlands", routes: ["Intercity", "Thalys", "Eurostar"] },
  ],
  highSpeed: [
    "TGV (France)",
    "ICE (Germany)",
    "AVE (Spain)",
    "Frecciarossa (Italy)",
    "Thalys (International)",
    "Eurostar (UK-Europe)",
    "Railjet (Austria)",
  ],
}

export const CAR_RENTAL_BRANDS = {
  major: ["Hertz", "Avis", "Enterprise", "Budget", "National", "Alamo"],
  european: ["Europcar", "Sixt", "Zipcar", "Turo"],
  luxury: ["Hertz Prestige", "Avis Prestige", "Enterprise Exotic", "Sixt Luxury"],
}

export const TECH_HUBS = {
  global: [
    { city: "Silicon Valley", country: "USA", focus: "Software, Hardware, VC" },
    { city: "London", country: "UK", focus: "Fintech, AI, Startups" },
    { city: "Tel Aviv", country: "Israel", focus: "Cybersecurity, AI, Defense Tech" },
    { city: "Singapore", country: "Singapore", focus: "Fintech, Blockchain, IoT" },
    { city: "Berlin", country: "Germany", focus: "Startups, E-commerce, Mobility" },
    { city: "Bangalore", country: "India", focus: "Software Services, R&D" },
    { city: "Shenzhen", country: "China", focus: "Hardware, Manufacturing, 5G" },
    { city: "Toronto", country: "Canada", focus: "AI, Fintech, Healthtech" },
  ],
}

export const BUSINESS_DISTRICTS = {
  financial: [
    "Wall Street (NYC)",
    "City of London",
    "Canary Wharf (London)",
    "La Défense (Paris)",
    "Marunouchi (Tokyo)",
    "Central (Hong Kong)",
    "Pudong (Shanghai)",
    "DIFC (Dubai)",
  ],
  tech: [
    "Silicon Valley",
    "South Lake Union (Seattle)",
    "Shoreditch (London)",
    "Station F (Paris)",
    "Zhongguancun (Beijing)",
    "Gangnam (Seoul)",
  ],
}
