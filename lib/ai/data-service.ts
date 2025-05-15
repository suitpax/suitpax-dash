// Servicio simplificado para datos
export class DataService {
  // Obtener información sobre las tablas disponibles
  async getTableInfo() {
    return [
      {
        name: "flights",
        description: "Información de vuelos",
        columns: ["id", "airline", "origin", "destination", "departure", "arrival", "price"],
      },
      {
        name: "hotels",
        description: "Información de hoteles",
        columns: ["id", "name", "location", "stars", "price", "amenities"],
      },
      {
        name: "cars",
        description: "Información de alquiler de coches",
        columns: ["id", "type", "company", "location", "price", "features"],
      },
      {
        name: "trains",
        description: "Información de trenes",
        columns: ["id", "company", "origin", "destination", "departure", "arrival", "price"],
      },
    ]
  }

  // Obtener datos de una tabla
  async getTableData(tableName: string) {
    // Datos mock para cada tabla
    const mockData: Record<string, any[]> = {
      flights: [
        {
          id: 1,
          airline: "British Airways",
          origin: "London",
          destination: "New York",
          departure: "2023-12-15T10:00:00Z",
          arrival: "2023-12-15T13:00:00Z",
          price: 450,
        },
        {
          id: 2,
          airline: "Lufthansa",
          origin: "Berlin",
          destination: "Paris",
          departure: "2023-12-16T08:30:00Z",
          arrival: "2023-12-16T10:00:00Z",
          price: 180,
        },
        {
          id: 3,
          airline: "Air France",
          origin: "Paris",
          destination: "Madrid",
          departure: "2023-12-17T14:15:00Z",
          arrival: "2023-12-17T16:00:00Z",
          price: 210,
        },
      ],
      hotels: [
        { id: 1, name: "Grand Hyatt", location: "New York", stars: 4, price: 180, amenities: ["WiFi", "Pool", "Gym"] },
        {
          id: 2,
          name: "Marriott Executive",
          location: "London",
          stars: 4,
          price: 195,
          amenities: ["WiFi", "Restaurant", "Business Center"],
        },
        {
          id: 3,
          name: "Hilton Garden Inn",
          location: "Paris",
          stars: 3,
          price: 150,
          amenities: ["WiFi", "Breakfast", "Parking"],
        },
      ],
      cars: [
        {
          id: 1,
          type: "Midsize Sedan",
          company: "Hertz",
          location: "New York Airport",
          price: 45,
          features: ["Automatic", "A/C", "Bluetooth"],
        },
        {
          id: 2,
          type: "Compact SUV",
          company: "Enterprise",
          location: "London Heathrow",
          price: 55,
          features: ["Automatic", "A/C", "GPS"],
        },
        { id: 3, type: "Economy", company: "Avis", location: "Paris CDG", price: 38, features: ["Manual", "A/C"] },
      ],
      trains: [
        {
          id: 1,
          company: "Eurostar",
          origin: "London",
          destination: "Paris",
          departure: "2023-12-15T08:30:00Z",
          arrival: "2023-12-15T11:47:00Z",
          price: 95,
        },
        {
          id: 2,
          company: "Deutsche Bahn",
          origin: "Berlin",
          destination: "Munich",
          departure: "2023-12-16T10:00:00Z",
          arrival: "2023-12-16T14:30:00Z",
          price: 75,
        },
        {
          id: 3,
          company: "Renfe",
          origin: "Madrid",
          destination: "Barcelona",
          departure: "2023-12-17T09:15:00Z",
          arrival: "2023-12-17T12:30:00Z",
          price: 60,
        },
      ],
    }

    return mockData[tableName] || []
  }

  // Buscar datos en una tabla
  async searchTableData(tableName: string, column: string, term: string) {
    const data = await this.getTableData(tableName)
    return data.filter((item) => {
      const value = item[column]
      if (typeof value === "string") {
        return value.toLowerCase().includes(term.toLowerCase())
      }
      return false
    })
  }
}

// Exportar una instancia del servicio
export const dataService = new DataService()
