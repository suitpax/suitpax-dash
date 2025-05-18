"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

// Datos de ejemplo para las gráficas
const travelData = [
  { month: "Ene", business: 24, conference: 12, training: 8 },
  { month: "Feb", business: 28, conference: 10, training: 12 },
  { month: "Mar", business: 32, conference: 18, training: 10 },
  { month: "Abr", business: 30, conference: 15, training: 14 },
  { month: "May", business: 34, conference: 20, training: 16 },
  { month: "Jun", business: 38, conference: 25, training: 18 },
  { month: "Jul", business: 42, conference: 22, training: 20 },
  { month: "Ago", business: 36, conference: 18, training: 15 },
  { month: "Sep", business: 40, conference: 28, training: 22 },
  { month: "Oct", business: 44, conference: 30, training: 24 },
  { month: "Nov", business: 48, conference: 32, training: 26 },
  { month: "Dic", business: 38, conference: 20, training: 18 },
]

export function TravelTrends() {
  return (
    <Card className="bg-black border-white/10">
      <CardHeader>
        <CardTitle className="text-white">Tendencias de Viaje</CardTitle>
        <CardDescription className="text-white/70">Volumen de viajes por propósito</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            business: {
              label: "Reuniones de Negocio",
              color: "hsl(var(--chart-1))",
            },
            conference: {
              label: "Conferencias",
              color: "hsl(var(--chart-2))",
            },
            training: {
              label: "Formación",
              color: "hsl(var(--chart-3))",
            },
          }}
          className="aspect-[4/3]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={travelData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="month" stroke="rgba(255,255,255,0.5)" tick={{ fill: "rgba(255,255,255,0.7)" }} />
              <YAxis stroke="rgba(255,255,255,0.5)" tick={{ fill: "rgba(255,255,255,0.7)" }} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              <Bar dataKey="business" fill="var(--color-business)" name="Reuniones de Negocio" />
              <Bar dataKey="conference" fill="var(--color-conference)" name="Conferencias" />
              <Bar dataKey="training" fill="var(--color-training)" name="Formación" />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
