"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle } from "lucide-react"

// Datos de ejemplo para las gráficas
const anomalyData = [
  { date: "01/05", expense: 1200, threshold: 1500 },
  { date: "02/05", expense: 1300, threshold: 1500 },
  { date: "03/05", expense: 1100, threshold: 1500 },
  { date: "04/05", expense: 1400, threshold: 1500 },
  { date: "05/05", expense: 2200, threshold: 1500 },
  { date: "06/05", expense: 1300, threshold: 1500 },
  { date: "07/05", expense: 1200, threshold: 1500 },
]

const anomalies = [
  {
    id: 1,
    date: "05/05/2023",
    amount: "€2,200",
    category: "Hotel",
    description: "Reserva de hotel premium fuera de política",
    severity: "alta",
  },
  {
    id: 2,
    date: "12/04/2023",
    amount: "€850",
    category: "Comidas",
    description: "Gasto de comida excede el límite diario",
    severity: "media",
  },
  {
    id: 3,
    date: "28/03/2023",
    amount: "€1,500",
    category: "Transporte",
    description: "Servicio de coche premium no autorizado",
    severity: "alta",
  },
]

export function AnomalyDetection() {
  return (
    <Card className="bg-black border-white/10">
      <CardHeader>
        <CardTitle className="text-white">Detección de Anomalías</CardTitle>
        <CardDescription className="text-white/70">Gastos que superan los umbrales establecidos</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <ChartContainer
            config={{
              expense: {
                label: "Gasto",
                color: "hsl(var(--chart-1))",
              },
              threshold: {
                label: "Umbral",
                color: "hsl(var(--chart-3))",
              },
            }}
            className="aspect-[4/3]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={anomalyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" tick={{ fill: "rgba(255,255,255,0.7)" }} />
                <YAxis
                  stroke="rgba(255,255,255,0.5)"
                  tick={{ fill: "rgba(255,255,255,0.7)" }}
                  tickFormatter={(value) => `€${value}`}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="expense"
                  stroke="var(--color-expense)"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Gasto"
                />
                <Line
                  type="monotone"
                  dataKey="threshold"
                  stroke="var(--color-threshold)"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                  name="Umbral"
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>

          <div className="space-y-2">
            <h3 className="text-sm font-medium text-white">Anomalías Detectadas</h3>
            <div className="space-y-2">
              {anomalies.map((anomaly) => (
                <div key={anomaly.id} className="flex items-start space-x-3 p-3 bg-white/5 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-white">{anomaly.category}</h4>
                      <Badge
                        variant="outline"
                        className={`text-[10px] ${
                          anomaly.severity === "alta"
                            ? "border-red-500/30 text-red-500 bg-red-500/10"
                            : "border-amber-500/30 text-amber-500 bg-amber-500/10"
                        }`}
                      >
                        {anomaly.severity === "alta" ? "Prioridad Alta" : "Prioridad Media"}
                      </Badge>
                    </div>
                    <p className="text-xs text-white/70 mt-1">{anomaly.description}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-white/50">{anomaly.date}</span>
                      <span className="text-xs font-medium text-white">{anomaly.amount}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
