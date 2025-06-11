"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plane, Hotel, Car, Calendar, Users, Search, ArrowRight, ArrowUp } from "lucide-react"
import Image from "next/image"
import { Textarea } from "@/components/ui/textarea"
import { FeatureCard } from "@/components/feature-card"

// Flight destination combinations
const flightCombinations = [
  { from: "New York", to: "London", price: 850, airline: "British Airways", duration: "7h 20m" },
  { from: "New York", to: "Paris", price: 920, airline: "Air France", duration: "7h 45m" },
  { from: "New York", to: "Tokyo", price: 1450, airline: "Japan Airlines", duration: "14h 15m" },
  { from: "New York", to: "San Francisco", price: 350, airline: "United", duration: "6h 10m" },
  { from: "London", to: "New York", price: 870, airline: "American Airlines", duration: "8h 05m" },
  { from: "London", to: "Paris", price: 180, airline: "EasyJet", duration: "1h 25m" },
  { from: "London", to: "Dubai", price: 620, airline: "Emirates", duration: "7h 10m" },
  { from: "London", to: "Singapore", price: 1050, airline: "Singapore Airlines", duration: "13h 30m" },
  { from: "Paris", to: "New York", price: 930, airline: "Delta", duration: "8h 15m" },
  { from: "Paris", to: "London", price: 175, airline: "British Airways", duration: "1h 20m" },
  { from: "Paris", to: "Rome", price: 210, airline: "Alitalia", duration: "2h 05m" },
  { from: "Paris", to: "Tokyo", price: 1380, airline: "Air France", duration: "12h 50m" },
  { from: "Tokyo", to: "New York", price: 1470, airline: "ANA", duration: "13h 55m" },
  { from: "Tokyo", to: "London", price: 1120, airline: "JAL", duration: "12h 30m" },
  { from: "Tokyo", to: "Singapore", price: 580, airline: "Singapore Airlines", duration: "7h 10m" },
  { from: "San Francisco", to: "New York", price: 340, airline: "JetBlue", duration: "5h 45m" },
  { from: "San Francisco", to: "Tokyo", price: 890, airline: "United", duration: "11h 15m" },
  { from: "San Francisco", to: "London", price: 980, airline: "Virgin Atlantic", duration: "10h 30m" },
  { from: "Dubai", to: "London", price: 640, airline: "Emirates", duration: "7h 25m" },
  { from: "Singapore", to: "Tokyo", price: 560, airline: "ANA", duration: "6h 55m" },
]

export default function BusinessTravelPage() {
  const [searchParams, setSearchParams] = useState({
    from: "",
    to: "",
    departDate: "",
    returnDate: "",
    travelers: "1",
    class: "economy",
    airline: "any",
    stops: "any",
    sort: "price",
  })

  const [searchResults, setSearchResults] = useState([])
  const [hasSearched, setHasSearched] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setSearchParams((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSelectChange = (name, value) => {
    setSearchParams((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSearch = () => {
    // Filter flight combinations based on search parameters
    const results = flightCombinations.filter(
      (flight) =>
        flight.from.toLowerCase().includes(searchParams.from.toLowerCase()) &&
        flight.to.toLowerCase().includes(searchParams.to.toLowerCase()),
    )

    setSearchResults(results)
    setHasSearched(true)
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  }

  return (
    <motion.div className="space-y-6 pb-8" initial="hidden" animate="visible" variants={containerVariants}>
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-medium tracking-tighter mb-2">Viajes de negocios</h1>
        <p className="text-gray-500 text-sm md:text-base max-w-2xl">
          Planifica y gestiona tus viajes de negocios de manera eficiente con nuestras herramientas especializadas.
        </p>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card className="border border-gray-200 rounded-xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-white">
            <CardTitle className="text-xl md:text-2xl font-medium tracking-tighter">
              Reserva tu viaje de negocios
            </CardTitle>
            <CardDescription>Busca vuelos, hoteles y alquiler de coches para tu próximo viaje</CardDescription>
          </CardHeader>
          <CardContent className="p-4 md:p-6">
            <Tabs defaultValue="flights" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-gray-100 rounded-xl p-1">
                <TabsTrigger
                  value="flights"
                  className="rounded-lg data-[state=active]:bg-white data-[state=active]:border data-[state=active]:border-gray-200 data-[state=active]:shadow-sm"
                >
                  <Plane className="mr-2 h-4 w-4" /> Vuelos
                </TabsTrigger>
                <TabsTrigger
                  value="hotels"
                  className="rounded-lg data-[state=active]:bg-white data-[state=active]:border data-[state=active]:border-gray-200 data-[state=active]:shadow-sm"
                >
                  <Hotel className="mr-2 h-4 w-4" /> Hoteles
                </TabsTrigger>
                <TabsTrigger
                  value="cars"
                  className="rounded-lg data-[state=active]:bg-white data-[state=active]:border data-[state=active]:border-gray-200 data-[state=active]:shadow-sm"
                >
                  <Car className="mr-2 h-4 w-4" /> Alquiler de coches
                </TabsTrigger>
              </TabsList>

              <TabsContent value="flights" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <Label htmlFor="from">Origen</Label>
                    <Input
                      id="from"
                      name="from"
                      placeholder="Ciudad o aeropuerto"
                      value={searchParams.from}
                      onChange={handleInputChange}
                      className="border-gray-200 rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="to">Destino</Label>
                    <Input
                      id="to"
                      name="to"
                      placeholder="Ciudad o aeropuerto"
                      value={searchParams.to}
                      onChange={handleInputChange}
                      className="border-gray-200 rounded-xl"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div className="space-y-2">
                    <Label htmlFor="departDate">Fecha de salida</Label>
                    <div className="flex">
                      <Calendar className="mr-2 h-4 w-4 mt-3" />
                      <Input
                        id="departDate"
                        name="departDate"
                        type="date"
                        value={searchParams.departDate}
                        onChange={handleInputChange}
                        className="border-gray-200 rounded-xl"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="returnDate">Fecha de regreso</Label>
                    <div className="flex">
                      <Calendar className="mr-2 h-4 w-4 mt-3" />
                      <Input
                        id="returnDate"
                        name="returnDate"
                        type="date"
                        value={searchParams.returnDate}
                        onChange={handleInputChange}
                        className="border-gray-200 rounded-xl"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="travelers">Viajeros</Label>
                    <div className="flex">
                      <Users className="mr-2 h-4 w-4 mt-3" />
                      <Select
                        value={searchParams.travelers}
                        onValueChange={(value) => handleSelectChange("travelers", value)}
                      >
                        <SelectTrigger className="border-gray-200 rounded-xl">
                          <SelectValue placeholder="Seleccionar" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 Viajero</SelectItem>
                          <SelectItem value="2">2 Viajeros</SelectItem>
                          <SelectItem value="3">3 Viajeros</SelectItem>
                          <SelectItem value="4">4+ Viajeros</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="class">Clase</Label>
                    <Select value={searchParams.class} onValueChange={(value) => handleSelectChange("class", value)}>
                      <SelectTrigger className="border-gray-200 rounded-xl">
                        <SelectValue placeholder="Seleccionar" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="economy">Económica</SelectItem>
                        <SelectItem value="premium">Premium Economy</SelectItem>
                        <SelectItem value="business">Business</SelectItem>
                        <SelectItem value="first">Primera Clase</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="space-y-2">
                    <Label htmlFor="airline">Aerolínea preferida</Label>
                    <Select defaultValue="any" onValueChange={(value) => handleSelectChange("airline", value)}>
                      <SelectTrigger className="border-gray-200 rounded-xl">
                        <SelectValue placeholder="Cualquier aerolínea" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">Cualquier aerolínea</SelectItem>
                        <SelectItem value="american">American Airlines</SelectItem>
                        <SelectItem value="delta">Delta Air Lines</SelectItem>
                        <SelectItem value="united">United Airlines</SelectItem>
                        <SelectItem value="british">British Airways</SelectItem>
                        <SelectItem value="lufthansa">Lufthansa</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stops">Escalas</Label>
                    <Select defaultValue="any" onValueChange={(value) => handleSelectChange("stops", value)}>
                      <SelectTrigger className="border-gray-200 rounded-xl">
                        <SelectValue placeholder="Cualquier número de escalas" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">Cualquier número de escalas</SelectItem>
                        <SelectItem value="nonstop">Solo vuelos directos</SelectItem>
                        <SelectItem value="1stop">1 escala o menos</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sort">Ordenar por</Label>
                    <Select defaultValue="price" onValueChange={(value) => handleSelectChange("sort", value)}>
                      <SelectTrigger className="border-gray-200 rounded-xl">
                        <SelectValue placeholder="Ordenar resultados por" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="price">Precio (menor primero)</SelectItem>
                        <SelectItem value="duration">Duración (más corta primero)</SelectItem>
                        <SelectItem value="departure">Hora de salida (más temprano primero)</SelectItem>
                        <SelectItem value="arrival">Hora de llegada (más temprano primero)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button onClick={handleSearch} className="w-full bg-black text-white rounded-xl">
                  <Search className="mr-2 h-4 w-4" /> Buscar vuelos
                </Button>

                {hasSearched && (
                  <div className="mt-6">
                    <h3 className="text-lg font-medium mb-4">Resultados de búsqueda</h3>

                    {searchResults.length > 0 ? (
                      <motion.div
                        className="space-y-4"
                        initial="hidden"
                        animate="visible"
                        variants={{
                          hidden: { opacity: 0 },
                          visible: {
                            opacity: 1,
                            transition: {
                              staggerChildren: 0.1,
                            },
                          },
                        }}
                      >
                        {searchResults.map((flight, index) => (
                          <motion.div key={index} variants={itemVariants}>
                            <Card className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow duration-300">
                              <CardContent className="p-4">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                                  <div className="flex items-center mb-2 md:mb-0">
                                    <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center mr-3">
                                      <Plane className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div>
                                      <p className="font-medium">{flight.airline}</p>
                                      <p className="text-sm text-gray-500">
                                        {flight.from} a {flight.to}
                                      </p>
                                    </div>
                                  </div>

                                  <div className="flex flex-col items-end">
                                    <p className="font-medium">${flight.price}</p>
                                    <p className="text-sm text-gray-500">{flight.duration}</p>
                                  </div>
                                </div>

                                <div className="mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                  <div className="flex items-center">
                                    <div className="text-sm">
                                      <p className="font-medium">08:00 AM</p>
                                      <p className="text-gray-500">{flight.from}</p>
                                    </div>
                                    <div className="mx-2 flex flex-col items-center">
                                      <div className="w-20 h-0.5 bg-gray-300"></div>
                                      <p className="text-xs my-1 text-gray-500">{flight.duration}</p>
                                    </div>
                                    <div className="text-sm">
                                      <p className="font-medium">
                                        {flight.duration === "7h 20m"
                                          ? "3:20 PM"
                                          : flight.duration === "7h 45m"
                                            ? "3:45 PM"
                                            : flight.duration === "14h 15m"
                                              ? "10:15 PM"
                                              : flight.duration === "6h 10m"
                                                ? "2:10 PM"
                                                : "4:00 PM"}
                                      </p>
                                      <p className="text-gray-500">{flight.to}</p>
                                    </div>
                                  </div>

                                  <Button className="bg-black text-white rounded-xl">
                                    Seleccionar <ArrowRight className="ml-2 h-4 w-4" />
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        ))}
                      </motion.div>
                    ) : (
                      <div className="text-center p-8 border border-gray-200 rounded-xl bg-white/50 backdrop-blur-sm shadow-sm">
                        <Search className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                        <p className="mb-2 font-medium">No se encontraron vuelos que coincidan con tus criterios.</p>
                        <p className="text-sm text-gray-500 mb-4">Intenta ajustar los parámetros de búsqueda.</p>
                      </div>
                    )}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="hotels" className="mt-6">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <FeatureCard
                    icon={<Hotel className="h-6 w-6" />}
                    title="Hoteles para ejecutivos"
                    description="Alojamientos premium con servicios para viajeros de negocios"
                    iconClassName="bg-indigo-50 text-indigo-600 group-hover:bg-indigo-100"
                  />
                  <FeatureCard
                    icon={<Users className="h-6 w-6" />}
                    title="Alojamiento para equipos"
                    description="Opciones para grupos de trabajo y eventos corporativos"
                    iconClassName="bg-purple-50 text-purple-600 group-hover:bg-purple-100"
                  />
                  <FeatureCard
                    icon={<Calendar className="h-6 w-6" />}
                    title="Estancias prolongadas"
                    description="Tarifas especiales para estancias de larga duración"
                    iconClassName="bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100"
                  />
                </div>
                <div className="text-center p-8 mt-6 border border-gray-200 rounded-xl bg-white/50 backdrop-blur-sm shadow-sm">
                  <Hotel className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-medium mb-2">Reserva de hoteles próximamente</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Estamos trabajando para añadir la funcionalidad de reserva de hoteles.
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="cars" className="mt-6">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <FeatureCard
                    icon={<Car className="h-6 w-6" />}
                    title="Vehículos ejecutivos"
                    description="Coches de alta gama para desplazamientos profesionales"
                    iconClassName="bg-blue-50 text-blue-600 group-hover:bg-blue-100"
                  />
                  <FeatureCard
                    icon={<Users className="h-6 w-6" />}
                    title="Transporte para equipos"
                    description="Vehículos espaciosos para grupos de trabajo"
                    iconClassName="bg-amber-50 text-amber-600 group-hover:bg-amber-100"
                  />
                  <FeatureCard
                    icon={<Calendar className="h-6 w-6" />}
                    title="Alquiler flexible"
                    description="Opciones de alquiler con cancelación gratuita"
                    iconClassName="bg-green-50 text-green-600 group-hover:bg-green-100"
                  />
                </div>
                <div className="text-center p-8 mt-6 border border-gray-200 rounded-xl bg-white/50 backdrop-blur-sm shadow-sm">
                  <Car className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-medium mb-2">Alquiler de coches próximamente</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Estamos trabajando para añadir la funcionalidad de alquiler de coches.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants} className="grid gap-6 md:grid-cols-2">
        <Card className="border border-gray-200 rounded-xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-white">
            <CardTitle className="text-xl font-medium tracking-tighter">Asistente IA de viajes</CardTitle>
            <CardDescription>Obtén ayuda personalizada con tus viajes de negocios</CardDescription>
          </CardHeader>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-start space-x-4">
              <Image
                src="/images/ai-agent-avatar.jpeg"
                alt="AI Assistant"
                width={50}
                height={50}
                className="rounded-full"
              />
              <div className="flex-1">
                <div className="bg-gray-100 p-3 rounded-xl mb-3">
                  <p className="text-sm">
                    ¡Hola! Soy tu Asistente IA de Viajes de Suitpax. ¿Cómo puedo ayudarte con tu viaje de negocios hoy?
                  </p>
                </div>
                <div className="relative">
                  <Input
                    placeholder="Pregunta sobre políticas de viaje, opciones de vuelo o gestión de gastos..."
                    className="border-gray-200 rounded-xl pr-12"
                  />
                  <Button className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 bg-black text-white rounded-lg">
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                </div>
                <div className="mt-2 text-xs text-center text-gray-500">
                  Prueba a preguntar: "¿Cuáles son las mejores opciones de vuelo de Nueva York a Londres la próxima
                  semana?"
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 rounded-xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-white">
            <CardTitle className="text-xl font-medium tracking-tighter">Solicitud de viaje</CardTitle>
            <CardDescription>Solicita aprobación para tu viaje de negocios</CardDescription>
          </CardHeader>
          <CardContent className="p-4 md:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <Label htmlFor="destination">Destino</Label>
                <Input id="destination" placeholder="Ciudad, País" className="border-gray-200 rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="purpose">Propósito del viaje</Label>
                <Input
                  id="purpose"
                  placeholder="Reunión con cliente, Conferencia, etc."
                  className="border-gray-200 rounded-xl"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <Label htmlFor="departureDate">Fecha de salida</Label>
                <Input id="departureDate" type="date" className="border-gray-200 rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="returnDate">Fecha de regreso</Label>
                <Input id="returnDate" type="date" className="border-gray-200 rounded-xl" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <Label htmlFor="estimatedCost">Coste estimado ($)</Label>
                <Input
                  id="estimatedCost"
                  type="number"
                  placeholder="Coste total estimado del viaje"
                  className="border-gray-200 rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="approver">Gerente que aprueba</Label>
                <Select>
                  <SelectTrigger className="border-gray-200 rounded-xl">
                    <SelectValue placeholder="Seleccionar gerente" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manager1">Sarah Johnson</SelectItem>
                    <SelectItem value="manager2">Michael Chen</SelectItem>
                    <SelectItem value="manager3">Emily Rodriguez</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <Label htmlFor="details">Detalles adicionales</Label>
              <Textarea
                id="details"
                placeholder="Proporciona cualquier información adicional sobre tu viaje"
                className="border-gray-200 rounded-xl"
                rows={4}
              />
            </div>

            <div className="flex justify-end">
              <Button className="bg-black text-white rounded-xl">
                Enviar solicitud de viaje <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
