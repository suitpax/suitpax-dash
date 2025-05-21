export interface TrainCompany {
  id: string
  name: string
  logo: string
  website: string
  countries: string[]
}

export interface TrainClass {
  id: string
  name: string
  description: string
  amenities: string[]
  priceCategory: "economy" | "standard" | "premium" | "business" | "first"
}

export interface TrainStation {
  id: string
  name: string
  city: string
  country: string
  code: string
  address: string
  coordinates: {
    latitude: number
    longitude: number
  }
  amenities: string[]
  connections: string[]
}

export interface TrainRoute {
  id: string
  company: string
  routeNumber: string
  origin: string
  destination: string
  stops: string[]
  duration: string
  distance: number
  frequency: string
  trainType: string
}

export const trainCompanies: TrainCompany[] = [
  {
    id: "eurostar",
    name: "Eurostar",
    logo: "/images/train-companies/eurostar.png",
    website: "https://www.eurostar.com",
    countries: ["United Kingdom", "France", "Belgium", "Netherlands"],
  },
  {
    id: "renfe",
    name: "Renfe",
    logo: "/images/train-companies/renfe.png",
    website: "https://www.renfe.com",
    countries: ["Spain", "Portugal", "France"],
  },
  {
    id: "sncf",
    name: "SNCF",
    logo: "/images/train-companies/sncf.png",
    website: "https://www.sncf.com",
    countries: ["France", "Switzerland", "Italy", "Germany", "Spain", "Belgium", "Luxembourg"],
  },
  {
    id: "db",
    name: "Deutsche Bahn",
    logo: "/images/train-companies/db.png",
    website: "https://www.bahn.com",
    countries: [
      "Germany",
      "Austria",
      "Switzerland",
      "France",
      "Denmark",
      "Netherlands",
      "Belgium",
      "Poland",
      "Czech Republic",
    ],
  },
  {
    id: "trenitalia",
    name: "Trenitalia",
    logo: "/images/train-companies/trenitalia.png",
    website: "https://www.trenitalia.com",
    countries: ["Italy", "France", "Switzerland", "Austria"],
  },
  {
    id: "thalys",
    name: "Thalys",
    logo: "/images/train-companies/thalys.png",
    website: "https://www.thalys.com",
    countries: ["France", "Belgium", "Netherlands", "Germany"],
  },
  {
    id: "italo",
    name: "Italo",
    logo: "/images/train-companies/italo.png",
    website: "https://www.italotreno.it",
    countries: ["Italy"],
  },
  {
    id: "amtrak",
    name: "Amtrak",
    logo: "/images/train-companies/amtrak.png",
    website: "https://www.amtrak.com",
    countries: ["United States", "Canada"],
  },
  {
    id: "via-rail",
    name: "VIA Rail",
    logo: "/images/train-companies/via-rail.png",
    website: "https://www.viarail.ca",
    countries: ["Canada"],
  },
  {
    id: "jr",
    name: "Japan Railways",
    logo: "/images/train-companies/jr.png",
    website: "https://www.japanrailpass.net",
    countries: ["Japan"],
  },
]

export const trainClasses: TrainClass[] = [
  {
    id: "standard",
    name: "Standard Class",
    description: "Comfortable seating with basic amenities for everyday travel",
    amenities: ["Standard seating", "Onboard food service (paid)", "Power outlets (limited)", "Wi-Fi (basic)"],
    priceCategory: "standard",
  },
  {
    id: "premium-standard",
    name: "Premium Standard",
    description: "Enhanced standard class with extra legroom and amenities",
    amenities: ["Extra legroom", "Power outlets", "Wi-Fi", "Complimentary refreshments", "Quiet zone options"],
    priceCategory: "premium",
  },
  {
    id: "business",
    name: "Business Class",
    description: "Premium experience with spacious seating and enhanced services",
    amenities: [
      "Spacious seating",
      "Power outlets",
      "Premium Wi-Fi",
      "Complimentary meals and drinks",
      "Lounge access",
      "Priority boarding",
      "Dedicated attendants",
    ],
    priceCategory: "business",
  },
  {
    id: "first",
    name: "First Class",
    description: "Luxury travel experience with the highest level of comfort and service",
    amenities: [
      "Luxury seating",
      "Power outlets",
      "Premium Wi-Fi",
      "Gourmet meals and premium drinks",
      "Exclusive lounge access",
      "Concierge service",
      "Priority boarding",
      "Private compartments (on select trains)",
    ],
    priceCategory: "first",
  },
]

export const popularTrainStations: TrainStation[] = [
  {
    id: "st-pancras",
    name: "St Pancras International",
    city: "London",
    country: "United Kingdom",
    code: "SPX",
    address: "Euston Road, London N1C 4QP, UK",
    coordinates: {
      latitude: 51.5321,
      longitude: -0.1262,
    },
    amenities: [
      "Shops",
      "Restaurants",
      "Lounges",
      "Wi-Fi",
      "Luggage storage",
      "Currency exchange",
      "Ticket offices",
      "Waiting areas",
    ],
    connections: ["Eurostar", "East Midlands Railway", "Southeastern", "Thameslink"],
  },
  {
    id: "gare-du-nord",
    name: "Gare du Nord",
    city: "Paris",
    country: "France",
    code: "XPG",
    address: "18 Rue de Dunkerque, 75010 Paris, France",
    coordinates: {
      latitude: 48.8809,
      longitude: 2.3553,
    },
    amenities: [
      "Shops",
      "Restaurants",
      "Lounges",
      "Wi-Fi",
      "Luggage storage",
      "Currency exchange",
      "Ticket offices",
      "Waiting areas",
    ],
    connections: ["Eurostar", "Thalys", "TGV", "RER", "Metro"],
  },
  {
    id: "madrid-atocha",
    name: "Madrid Atocha",
    city: "Madrid",
    country: "Spain",
    code: "XOC",
    address: "Glorieta del Emperador Carlos V, 28045 Madrid, Spain",
    coordinates: {
      latitude: 40.4065,
      longitude: -3.6892,
    },
    amenities: [
      "Shops",
      "Restaurants",
      "Tropical garden",
      "Wi-Fi",
      "Luggage storage",
      "Ticket offices",
      "Waiting areas",
    ],
    connections: ["AVE", "Alvia", "Avant", "Cercanías"],
  },
  {
    id: "frankfurt-hbf",
    name: "Frankfurt Hauptbahnhof",
    city: "Frankfurt",
    country: "Germany",
    code: "ZRB",
    address: "Am Hauptbahnhof, 60329 Frankfurt am Main, Germany",
    coordinates: {
      latitude: 50.1071,
      longitude: 8.6638,
    },
    amenities: [
      "Shops",
      "Restaurants",
      "Lounges",
      "Wi-Fi",
      "Luggage storage",
      "Currency exchange",
      "Ticket offices",
      "Waiting areas",
    ],
    connections: ["ICE", "IC", "EC", "S-Bahn", "U-Bahn", "Tram"],
  },
  {
    id: "roma-termini",
    name: "Roma Termini",
    city: "Rome",
    country: "Italy",
    code: "XRJ",
    address: "Via Giovanni Giolitti, 40, 00185 Roma RM, Italy",
    coordinates: {
      latitude: 41.9009,
      longitude: 12.5019,
    },
    amenities: [
      "Shops",
      "Restaurants",
      "Lounges",
      "Wi-Fi",
      "Luggage storage",
      "Currency exchange",
      "Ticket offices",
      "Waiting areas",
    ],
    connections: ["Frecciarossa", "Frecciargento", "Frecciabianca", "Intercity", "Regional", "Metro"],
  },
  {
    id: "amsterdam-centraal",
    name: "Amsterdam Centraal",
    city: "Amsterdam",
    country: "Netherlands",
    code: "AMS",
    address: "Stationsplein, 1012 AB Amsterdam, Netherlands",
    coordinates: {
      latitude: 52.3791,
      longitude: 4.9003,
    },
    amenities: [
      "Shops",
      "Restaurants",
      "Lounges",
      "Wi-Fi",
      "Luggage storage",
      "Currency exchange",
      "Ticket offices",
      "Waiting areas",
    ],
    connections: ["Eurostar", "Thalys", "IC", "Sprinter", "Metro", "Tram"],
  },
  {
    id: "zurich-hb",
    name: "Zürich Hauptbahnhof",
    city: "Zurich",
    country: "Switzerland",
    code: "ZLP",
    address: "Bahnhofplatz 7, 8001 Zürich, Switzerland",
    coordinates: {
      latitude: 47.3782,
      longitude: 8.5392,
    },
    amenities: [
      "Shops",
      "Restaurants",
      "Lounges",
      "Wi-Fi",
      "Luggage storage",
      "Currency exchange",
      "Ticket offices",
      "Waiting areas",
    ],
    connections: ["SBB", "IC", "EC", "S-Bahn", "Tram"],
  },
  {
    id: "tokyo-station",
    name: "Tokyo Station",
    city: "Tokyo",
    country: "Japan",
    code: "TYO",
    address: "1 Chome Marunouchi, Chiyoda City, Tokyo 100-0005, Japan",
    coordinates: {
      latitude: 35.6812,
      longitude: 139.7671,
    },
    amenities: [
      "Shops",
      "Restaurants",
      "Character Street",
      "Ramen Street",
      "Wi-Fi",
      "Luggage storage",
      "Currency exchange",
      "Ticket offices",
      "Waiting areas",
    ],
    connections: ["Shinkansen", "JR Lines", "Tokyo Metro", "Marunouchi Line", "Tozai Line"],
  },
  {
    id: "penn-station",
    name: "Penn Station",
    city: "New York",
    country: "United States",
    code: "NYP",
    address: "8th Ave & 31st St, New York, NY 10001, USA",
    coordinates: {
      latitude: 40.7506,
      longitude: -73.9939,
    },
    amenities: [
      "Shops",
      "Restaurants",
      "Wi-Fi",
      "Luggage storage",
      "Ticket offices",
      "Waiting areas",
      "ClubAcela Lounge",
    ],
    connections: ["Amtrak", "Long Island Rail Road", "NJ Transit", "NYC Subway"],
  },
  {
    id: "union-station-toronto",
    name: "Union Station",
    city: "Toronto",
    country: "Canada",
    code: "TWO",
    address: "65 Front St W, Toronto, ON M5J 1E6, Canada",
    coordinates: {
      latitude: 43.6453,
      longitude: -79.3806,
    },
    amenities: [
      "Shops",
      "Restaurants",
      "Wi-Fi",
      "Luggage storage",
      "Currency exchange",
      "Ticket offices",
      "Waiting areas",
      "Business lounge",
    ],
    connections: ["VIA Rail", "GO Transit", "UP Express", "TTC Subway"],
  },
]

export const popularTrainRoutes: TrainRoute[] = [
  {
    id: "route-1",
    company: "eurostar",
    routeNumber: "ES 9000",
    origin: "st-pancras",
    destination: "gare-du-nord",
    stops: [],
    duration: "2h 16m",
    distance: 495,
    frequency: "Hourly",
    trainType: "High-speed",
  },
  {
    id: "route-2",
    company: "renfe",
    routeNumber: "AVE 3092",
    origin: "madrid-atocha",
    destination: "barcelona-sants",
    stops: ["Zaragoza"],
    duration: "2h 30m",
    distance: 621,
    frequency: "Every 2 hours",
    trainType: "High-speed AVE",
  },
  {
    id: "route-3",
    company: "db",
    routeNumber: "ICE 590",
    origin: "frankfurt-hbf",
    destination: "berlin-hbf",
    stops: ["Hanover", "Wolfsburg"],
    duration: "3h 52m",
    distance: 545,
    frequency: "Every 2 hours",
    trainType: "ICE High-speed",
  },
  {
    id: "route-4",
    company: "trenitalia",
    routeNumber: "FR 9410",
    origin: "roma-termini",
    destination: "firenze-smn",
    stops: [],
    duration: "1h 32m",
    distance: 261,
    frequency: "Hourly",
    trainType: "Frecciarossa High-speed",
  },
  {
    id: "route-5",
    company: "sncf",
    routeNumber: "TGV 6215",
    origin: "gare-du-nord",
    destination: "lyon-part-dieu",
    stops: [],
    duration: "1h 57m",
    distance: 427,
    frequency: "Every 2 hours",
    trainType: "TGV High-speed",
  },
  {
    id: "route-6",
    company: "jr",
    routeNumber: "N700 Nozomi",
    origin: "tokyo-station",
    destination: "shin-osaka",
    stops: ["Nagoya"],
    duration: "2h 30m",
    distance: 515,
    frequency: "Every 10 minutes",
    trainType: "Shinkansen High-speed",
  },
  {
    id: "route-7",
    company: "amtrak",
    routeNumber: "Acela 2153",
    origin: "penn-station",
    destination: "union-station-dc",
    stops: ["Philadelphia", "Baltimore"],
    duration: "2h 55m",
    distance: 362,
    frequency: "Hourly",
    trainType: "Acela Express",
  },
  {
    id: "route-8",
    company: "thalys",
    routeNumber: "THA 9431",
    origin: "gare-du-nord",
    destination: "amsterdam-centraal",
    stops: ["Brussels", "Rotterdam"],
    duration: "3h 20m",
    distance: 527,
    frequency: "Every 2 hours",
    trainType: "Thalys High-speed",
  },
  {
    id: "route-9",
    company: "via-rail",
    routeNumber: "VIA 62",
    origin: "union-station-toronto",
    destination: "central-station-montreal",
    stops: ["Kingston", "Ottawa"],
    duration: "5h 00m",
    distance: 539,
    frequency: "4 times daily",
    trainType: "VIA Rail Corridor",
  },
  {
    id: "route-10",
    company: "italo",
    routeNumber: "IT 9925",
    origin: "roma-termini",
    destination: "milano-centrale",
    stops: ["Florence", "Bologna"],
    duration: "2h 55m",
    distance: 477,
    frequency: "Hourly",
    trainType: "Italo High-speed",
  },
]
