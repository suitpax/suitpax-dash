"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Line, LineChart, Bar, BarChart, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { BarChart3, TrendingUp, Zap, Plane, Building2, Users } from "lucide-react"

// Datos de ejemplo para las gráficas
const expenseData = [
  { month: "Ene", actual: 12400, predicted: 13000 },
  { month: "Feb", actual: 14200, predicted: 14500 },
  { month: "Mar", actual: 15800, predicted: 15000 },
  { month: "Abr", actual: 16200, predicted: 16500 },
  { month: "May", actual: 18100, predicted: 17500 },
  { month: "Jun", actual: 17300, predicted: 18000 },
  { month: "Jul", actual: 19200, predicted: 19000 },
  { month: "Ago", actual: 20100, predicted: 20500 },
  { month: "Sep", actual: null, predicted: 21000 },
  { month: "Oct", actual: null, predicted: 22500 },
  { month: "Nov", actual: null, predicted: 23000 },
  { month: "Dic", actual: null, predicted: 24500 },
]

const categoryData = [
  { name: "Vuelos", actual: 42000, predicted: 45000 },
  { name: "Hoteles", actual: 35000, predicted: 38000 },
  { name: "Transporte", actual: 12000, predicted: 14000 },
  { name: "Comidas", actual: 8000, predicted: 9500 },
  { name: "Otros", actual: 5000, predicted: 6500 },
]

const departmentData = [
  { name: "Ventas", actual: 38000, predicted: 42000 },
  { name: "Marketing", actual: 25000, predicted: 28000 },
  { name: "Ingeniería", actual: 18000, predicted: 22000 },
  { name: "Ejecutivos", actual: 15000, predicted: 16000 },
  { name: "Operaciones", actual: 12000, predicted: 14000 },
]

const anomalyData = [
  { date: "01/05", expense: 1200, threshold: 1500 },
  { date: "02/05", expense: 1300, threshold: 1500 },
  { date: "03/05", expense: 1100, threshold: 1500 },
  { date: "04/05", expense: 1400, threshold: 1500 },
  { date: "05/05", expense: 2200, threshold: 1500 },
  { date: "06/05", expense: 1300, threshold: 1500 },
  { date: "07/05", expense: 1200, threshold: 1500 },
]

export default function AnalyticsDashboard() {
  const [period, setPeriod] = useState("monthly")

  return (
    <div className="flex flex-col min-h-screen bg-black">
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight text-white">Analytics</h2>
          <div className="flex items-center space-x-2">
            <Tabs defaultValue={period} className="w-[400px]" onValueChange={setPeriod}>
              <TabsList className="grid w-full grid-cols-3 bg-white/5">
                <TabsTrigger
                  value="monthly"
                  className="text-white/70 data-[state=active]:text-white data-[state=active]:bg-white/10"
                >
                  Mensual
                </TabsTrigger>
                <TabsTrigger
                  value="quarterly"
                  className="text-white/70 data-[state=active]:text-white data-[state=active]:bg-white/10"
                >
                  Trimestral
                </TabsTrigger>
                <TabsTrigger
                  value="yearly"
                  className="text-white/70 data-[state=active]:text-white data-[state=active]:bg-white/10"
                >
                  Anual
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-black border-white/10">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-white">Gasto Total Proyectado</CardTitle>
              <TrendingUp className="h-4 w-4 text-white/70" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">€102,500</div>
              <p className="text-xs text-white/70 mt-1">+12% respecto al año anterior</p>
            </CardContent>
          </Card>
          <Card className="bg-black border-white/10">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-white">Ahorro Potencial</CardTitle>
              <Zap className="h-4 w-4 text-white/70" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">€15,300</div>
              <p className="text-xs text-white/70 mt-1">15% del gasto proyectado</p>
            </CardContent>
          </Card>
          <Card className="bg-black border-white/10">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-white">Viajes Proyectados</CardTitle>
              <Plane className="h-4 w-4 text-white/70" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">78</div>
              <p className="text-xs text-white/70 mt-1">+8% respecto al trimestre anterior</p>
            </CardContent>
          </Card>
          <Card className="bg-black border-white/10">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-white">Anomalías Detectadas</CardTitle>
              <BarChart3 className="h-4 w-4 text-white/70" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">3</div>
              <p className="text-xs text-white/70 mt-1">Requieren revisión</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Charts */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="bg-black border-white/10 col-span-4">
            <CardHeader>
              <CardTitle className="text-white">Predicción de Gastos</CardTitle>
              <CardDescription className="text-white/70">
                Gastos actuales vs. proyectados para los próximos meses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  actual: {
                    label: "Gasto Actual",
                    color: "hsl(var(--chart-1))",
                  },
                  predicted: {
                    label: "Gasto Proyectado",
                    color: "hsl(var(--chart-2))",
                  },
                }}
                className="aspect-[4/3]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={expenseData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="month" stroke="rgba(255,255,255,0.5)" tick={{ fill: "rgba(255,255,255,0.7)" }} />
                    <YAxis
                      stroke="rgba(255,255,255,0.5)"
                      tick={{ fill: "rgba(255,255,255,0.7)" }}
                      tickFormatter={(value) => `€${value / 1000}k`}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="actual"
                      stroke="var(--color-actual)"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                      name="Gasto Actual"
                    />
                    <Line
                      type="monotone"
                      dataKey="predicted"
                      stroke="var(--color-predicted)"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={{ r: 4 }}
                      name="Gasto Proyectado"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
          <Card className="bg-black border-white/10 col-span-3">
            <CardHeader>
              <CardTitle className="text-white">Gastos por Categoría</CardTitle>
              <CardDescription className="text-white/70">Desglose de gastos actuales y proyectados</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  actual: {
                    label: "Actual",
                    color: "hsl(var(--chart-1))",
                  },
                  predicted: {
                    label: "Proyectado",
                    color: "hsl(var(--chart-2))",
                  },
                }}
                className="aspect-[4/3]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis
                      type="number"
                      stroke="rgba(255,255,255,0.5)"
                      tick={{ fill: "rgba(255,255,255,0.7)" }}
                      tickFormatter={(value) => `€${value / 1000}k`}
                    />
                    <YAxis
                      dataKey="name"
                      type="category"
                      stroke="rgba(255,255,255,0.5)"
                      tick={{ fill: "rgba(255,255,255,0.7)" }}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Bar dataKey="actual" fill="var(--color-actual)" name="Actual" />
                    <Bar dataKey="predicted" fill="var(--color-predicted)" name="Proyectado" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Secondary Charts */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="bg-black border-white/10 col-span-3">
            <CardHeader>
              <CardTitle className="text-white">Gastos por Departamento</CardTitle>
              <CardDescription className="text-white/70">Comparativa de gastos por equipo</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  actual: {
                    label: "Actual",
                    color: "hsl(var(--chart-1))",
                  },
                  predicted: {
                    label: "Proyectado",
                    color: "hsl(var(--chart-2))",
                  },
                }}
                className="aspect-[4/3]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={departmentData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" tick={{ fill: "rgba(255,255,255,0.7)" }} />
                    <YAxis
                      stroke="rgba(255,255,255,0.5)"
                      tick={{ fill: "rgba(255,255,255,0.7)" }}
                      tickFormatter={(value) => `€${value / 1000}k`}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Bar dataKey="actual" fill="var(--color-actual)" name="Actual" />
                    <Bar dataKey="predicted" fill="var(--color-predicted)" name="Proyectado" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
          <Card className="bg-black border-white/10 col-span-4">
            <CardHeader>
              <CardTitle className="text-white">Detección de Anomalías</CardTitle>
              <CardDescription className="text-white/70">Gastos que superan los umbrales establecidos</CardDescription>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>
        </div>

        {/* Recommendations */}
        <Card className="bg-black border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Recomendaciones de Optimización</CardTitle>
            <CardDescription className="text-white/70">Oportunidades identificadas para reducir costos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-4 p-4 bg-white/5 rounded-lg">
                <div className="bg-white/10 p-2 rounded-full">
                  <Plane className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-white">Optimización de Vuelos</h3>
                  <p className="text-xs text-white/70 mt-1">
                    Reservar vuelos con 21 días de antelación podría ahorrar hasta €8,200 en el próximo trimestre.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4 p-4 bg-white/5 rounded-lg">
                <div className="bg-white/10 p-2 rounded-full">
                  <Building2 className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-white">Consolidación de Hoteles</h3>
                  <p className="text-xs text-white/70 mt-1">
                    Negociar tarifas corporativas con los 3 hoteles más utilizados podría reducir costos en un 15%.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4 p-4 bg-white/5 rounded-lg">
                <div className="bg-white/10 p-2 rounded-full">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-white">Viajes en Grupo</h3>
                  <p className="text-xs text-white/70 mt-1">
                    Coordinar viajes de equipo para eventos podría ahorrar €4,100 en el próximo trimestre.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
