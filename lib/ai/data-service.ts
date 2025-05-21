/**
 * Servicio para acceder a datos de viaje
 *
 * Este servicio proporciona métodos para acceder a datos de viaje
 * como vuelos, hoteles, transfers, etc.
 */

// Interfaz para información de tablas
export interface TableInfo {
  name: string
  description: string
  columns: {
    name: string
    type: string
    description: string
  }[]
}

// Clase principal para el servicio de datos
export class DataService {
  // Obtener información sobre las tablas disponibles
  async getTableInfo(): Promise<TableInfo[]> {
    // Información estática sobre las tablas disponibles
    return [
      {
        name: "flights",
        description: "Información sobre vuelos disponibles",
        columns: [
          { name: "id", type: "string", description: "Identificador único del vuelo" },
          { name: "airline", type: "string", description: "Aerolínea" },
          { name: "origin", type: "string", description: "Aeropuerto de origen" },
          { name: "destination", type: "string", description: "Aeropuerto de destino" },
          { name: "departure", type: "datetime", description: "Fecha y hora de salida" },
          { name: "arrival", type: "datetime", description: "Fecha y hora de llegada" },
          { name: "price", type: "number", description: "Precio en euros" },
          { name: "class", type: "string", description: "Clase (Economy, Business, First)" },
        ],
      },
      {
        name: "hotels",
        description: "Información sobre hoteles disponibles",
        columns: [
          { name: "id", type: "string", description: "Identificador único del hotel" },
          { name: "name", type: "string", description: "Nombre del hotel" },
          { name: "city", type: "string", description: "Ciudad" },
          { name: "stars", type: "number", description: "Estrellas (1-5)" },
          { name: "price", type: "number", description: "Precio por noche en euros" },
          { name: "amenities", type: "array", description: "Servicios disponibles" },
        ],
      },
      {
        name: "transfers",
        description: "Información sobre transfers disponibles",
        columns: [
          { name: "id", type: "string", description: "Identificador único del transfer" },
          { name: "type", type: "string", description: "Tipo de vehículo" },
          { name: "origin", type: "string", description: "Lugar de origen" },
          { name: "destination", type: "string", description: "Lugar de destino" },
          { name: "price", type: "number", description: "Precio en euros" },
          { name: "capacity", type: "number", description: "Capacidad de pasajeros" },
        ],
      },
      {
        name: "trains",
        description: "Información sobre trenes disponibles",
        columns: [
          { name: "id", type: "string", description: "Identificador único del tren" },
          { name: "company", type: "string", description: "Compañía ferroviaria" },
          { name: "origin", type: "string", description: "Estación de origen" },
          { name: "destination", type: "string", description: "Estación de destino" },
          { name: "departure", type: "datetime", description: "Fecha y hora de salida" },
          { name: "arrival", type: "datetime", description: "Fecha y hora de llegada" },
          { name: "price", type: "number", description: "Precio en euros" },
          { name: "class", type: "string", description: "Clase (Standard, Premium, Business)" },
        ],
      },
    ]
  }

  // Obtener datos de una tabla específica
  async getTableData(tableName: string, searchParams?: { column: string; term: string }) {
    // En una implementación real, aquí se consultaría una base de datos
    // Por ahora, devolvemos datos de ejemplo

    // Datos de ejemplo para cada tabla
    const tableData: Record<string, any[]> = {
      flights: [
        {
          id: "FL001",
          airline: "Iberia",
          origin: "MAD",
          destination: "BCN",
          departure: "2023-10-15T08:00:00",
          arrival: "2023-10-15T09:15:00",
          price: 120,
          class: "Economy",
        },
        {
          id: "FL002",
          airline: "Air France",
          origin: "MAD",
          destination: "CDG",
          departure: "2023-10-16T10:30:00",
          arrival: "2023-10-16T12:45:00",
          price: 210,
          class: "Economy",
        },
        {
          id: "FL003",
          airline: "Lufthansa",
          origin: "MAD",
          destination: "FRA",
          departure: "2023-10-17T14:15:00",
          arrival: "2023-10-17T16:45:00",
          price: 180,
          class: "Economy",
        },
      ],
      hotels: [
        { id: "HT001", name: "Gran Hotel", city: "Madrid", stars: 4, price: 120, amenities: ["WiFi", "Pool", "Gym"] },
        {
          id: "HT002",
          name: "Luxury Palace",
          city: "Barcelona",
          stars: 5,
          price: 250,
          amenities: ["WiFi", "Pool", "Spa", "Restaurant"],
        },
        {
          id: "HT003",
          name: "Business Stay",
          city: "Valencia",
          stars: 3,
          price: 90,
          amenities: ["WiFi", "Restaurant"],
        },
      ],
      transfers: [
        {
          id: "TR001",
          type: "Sedan",
          origin: "Madrid Airport",
          destination: "Madrid City Center",
          price: 35,
          capacity: 3,
        },
        {
          id: "TR002",
          type: "Van",
          origin: "Barcelona Airport",
          destination: "Barcelona City Center",
          price: 45,
          capacity: 6,
        },
        {
          id: "TR003",
          type: "Luxury Car",
          origin: "Valencia Airport",
          destination: "Valencia City Center",
          price: 60,
          capacity: 3,
        },
      ],
      trains: [
        {
          id: "TN001",
          company: "Renfe",
          origin: "Madrid Atocha",
          destination: "Barcelona Sants",
          departure: "2023-10-15T09:00:00",
          arrival: "2023-10-15T11:30:00",
          price: 80,
          class: "Standard",
        },
        {
          id: "TN002",
          company: "SNCF",
          origin: "Paris Gare de Lyon",
          destination: "Lyon Part-Dieu",
          departure: "2023-10-16T10:00:00",
          arrival: "2023-10-16T12:00:00",
          price: 65,
          class: "Standard",
        },
        {
          id: "TN003",
          company: "Deutsche Bahn",
          origin: "Berlin Hbf",
          destination: "Munich Hbf",
          departure: "2023-10-17T08:30:00",
          arrival: "2023-10-17T13:15:00",
          price: 90,
          class: "Standard",
        },
      ],
    }

    // Si no existe la tabla, devolver un error
    if (!tableData[tableName]) {
      throw new Error(`Table ${tableName} not found`)
    }

    // Si hay parámetros de búsqueda, filtrar los datos
    if (searchParams && searchParams.column && searchParams.term) {
      const { column, term } = searchParams
      return tableData[tableName].filter((row) => {
        const value = row[column]
        if (typeof value === "string") {
          return value.toLowerCase().includes(term.toLowerCase())
        } else if (typeof value === "number") {
          return value === Number.parseFloat(term)
        }
        return false
      })
    }

    // Si no hay parámetros de búsqueda, devolver todos los datos
    return tableData[tableName]
  }
}

// Exportar una instancia del servicio
export const dataService = new DataService()
