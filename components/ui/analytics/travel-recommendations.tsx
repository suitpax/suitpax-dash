"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2, Plane, Users, Calendar, CreditCard, Banknote } from "lucide-react"
import type { DateRange } from "react-day-picker"
import { Lightbulb, TrendingDown, DollarSign, Clock, Building, Car } from "lucide-react"

interface TravelRecommendationsProps {
  dateRange: DateRange
}

const recommendations = [
  {
    id: 1,
    title: "Optimización de Vuelos",
    description: "Reservar vuelos con 21 días de antelación podría ahorrar hasta €8,200 en el próximo trimestre.",
    savings: "€8,200",
    effort: "baja",
    icon: Plane,
  },
  {
    id: 2,
    title: "Consolidación de Hoteles",
    description: "Negociar tarifas corporativas con los 3 hoteles más utilizados podría reducir costos en un 15%.",
    savings: "€5,300",
    effort: "media",
    icon: Building2,
  },
  {
    id: 3,
    title: "Viajes en Grupo",
    description: "Coordinar viajes de equipo para eventos podría ahorrar €4,100 en el próximo trimestre.",
    savings: "€4,100",
    effort: "media",
    icon: Users,
  },
  {
    id: 4,
    title: "Planificación Anticipada",
    description: "Implementar un sistema de aprobación de viajes con 30 días de antelación.",
    savings: "€3,800",
    effort: "alta",
    icon: Calendar,
  },
  {
    id: 5,
    title: "Tarjetas Corporativas",
    description:
      "Consolidar todos los gastos en tarjetas corporativas para mejorar el seguimiento y obtener recompensas.",
    savings: "€2,900",
    effort: "baja",
    icon: CreditCard,
  },
  {
    id: 6,
    title: "Presupuestos por Departamento",
    description: "Implementar presupuestos específicos por departamento con incentivos para el ahorro.",
    savings: "€6,500",
    effort: "alta",
    icon: Banknote,
  },
]

export function TravelRecommendations() {
  // Datos de ejemplo para las recomendaciones de viaje
  const savingsOpportunityData = [
    { category: "Advance Booking", potential: 45000, implemented: 18000 },
    { category: "Preferred Vendors", potential: 35000, implemented: 22000 },
    { category: "Alternative Airports", potential: 18000, implemented: 5000 },
    { category: "Shared Transportation", potential: 12000, implemented: 3000 },
    { category: "Virtual Meetings", potential: 28000, implemented: 15000 },
    { category: "Off-peak Travel", potential: 15000, implemented: 6000 },
  ]

  const optimalBookingData = [
    { days: "1-7", premium: 35 },
    { days: "8-14", premium: 25 },
    { days: "15-21", premium: 15 },
    { days: "22-30", premium: 8 },
    { days: "31-45", premium: 5 },
    { days: "46-60", premium: 3 },
    { days: "61+", premium: 2 },
  ]

  const vendorSavingsData = [
    { name: "Current Mix", value: 100 },
    { name: "Recommended Mix", value: 82 },
  ]

  const COLORS = ["#0088FE", "#00C49F"]

  const topRecommendations = [
    {
      id: "rec1",
      title: "Implement 21-day Advance Booking Policy",
      category: "Policy",
      impact: "high",
      savings: "$28,500 annually",
      description:
        "Requiring bookings at least 21 days in advance could reduce average flight costs by 15% and hotel rates by 12%.",
      implementation: "Medium effort",
    },
    {
      id: "rec2",
      title: "Consolidate to Preferred Hotel Vendors",
      category: "Vendor Management",
      impact: "high",
      savings: "$22,000 annually",
      description:
        "Negotiating corporate rates with top 5 hotel chains used by your travelers could yield 18% savings on accommodations.",
      implementation: "Medium effort",
    },
    {
      id: "rec3",
      title: "Optimize Meeting Schedule for Travel",
      category: "Planning",
      impact: "medium",
      savings: "$15,000 annually",
      description:
        "Scheduling meetings on Tuesdays-Thursdays could reduce premium pricing for Monday/Friday flights by 22%.",
      implementation: "Low effort",
    },
    {
      id: "rec4",
      title: "Implement Virtual Meeting Policy",
      category: "Policy",
      impact: "medium",
      savings: "$18,000 annually",
      description:
        "Requiring virtual meetings for internal discussions under 2 hours could eliminate 15% of short-haul flights.",
      implementation: "Low effort",
    },
  ]

  return (
    <Card className="bg-black border-white/10">
      <CardHeader>
        <CardTitle className="text-white">Recomendaciones de Optimización</CardTitle>
        <CardDescription className="text-white/70">Oportunidades identificadas para reducir costos</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          {recommendations.map((recommendation) => (
            <div key={recommendation.id} className="flex items-start space-x-4 p-4 bg-white/5 rounded-lg">
              <div className="bg-white/10 p-2 rounded-full">
                <recommendation.icon className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-white">{recommendation.title}</h3>
                  <Badge
                    variant="outline"
                    className={`text-[10px] ${
                      recommendation.effort === "baja"
                        ? "border-green-500/30 text-green-500 bg-green-500/10"
                        : recommendation.effort === "media"
                          ? "border-amber-500/30 text-amber-500 bg-amber-500/10"
                          : "border-red-500/30 text-red-500 bg-red-500/10"
                    }`}
                  >
                    {recommendation.effort === "baja"
                      ? "Esfuerzo Bajo"
                      : recommendation.effort === "media"
                        ? "Esfuerzo Medio"
                        : "Esfuerzo Alto"}
                  </Badge>
                </div>
                <p className="text-xs text-white/70 mt-1">{recommendation.description}</p>
                <div className="mt-2">
                  <span className="text-xs font-medium text-white">Ahorro potencial: {recommendation.savings}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

interface RecommendationItemProps {
  recommendation: {
    id: string
    title: string
    category: string
    impact: "low" | "medium" | "high"
    savings: string
    description: string
    implementation: string
  }
}

function RecommendationItem({ recommendation }: RecommendationItemProps) {
  const impactColors = {
    low: "bg-blue-950/30 text-blue-400",
    medium: "bg-amber-950/30 text-amber-400",
    high: "bg-emerald-950/30 text-emerald-400",
  }

  const categoryIcons = {
    Policy: <Building className="h-5 w-5" />,
    "Vendor Management": <Building className="h-5 w-5" />,
    Planning: <Calendar className="h-5 w-5" />,
    Booking: <Plane className="h-5 w-5" />,
    Transportation: <Car className="h-5 w-5" />,
  }

  return (
    <div className="p-4 bg-white/5 rounded-lg">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-white/5 rounded-lg">
          {categoryIcons[recommendation.category as keyof typeof categoryIcons] || <Lightbulb className="h-5 w-5" />}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-sm font-medium text-white">{recommendation.title}</h3>
            <span className={`text-xs px-2 py-0.5 rounded-full ${impactColors[recommendation.impact]}`}>
              {recommendation.impact.charAt(0).toUpperCase() + recommendation.impact.slice(1)} Impact
            </span>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full text-white/70">
              {recommendation.category}
            </span>
            <span className="text-xs text-white/50">•</span>
            <div className="flex items-center gap-1">
              <DollarSign className="h-3 w-3 text-emerald-400" />
              <span className="text-xs text-emerald-400">{recommendation.savings}</span>
            </div>
            <span className="text-xs text-white/50">•</span>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3 text-white/50" />
              <span className="text-xs text-white/70">{recommendation.implementation}</span>
            </div>
          </div>
          <p className="text-xs text-white/70">{recommendation.description}</p>
        </div>
      </div>
    </div>
  )
}

interface VendorInsightProps {
  category: string
  current: string
  recommended: string
  savings: string
}

function VendorInsight({ category, current, recommended, savings }: VendorInsightProps) {
  return (
    <div className="p-3 bg-white/5 rounded-lg">
      <h4 className="text-sm font-medium text-white mb-1">{category}</h4>
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <span className="text-xs text-white/50">Current:</span>
          <span className="text-xs text-white/70">{current}</span>
        </div>
        <TrendingDown className="h-4 w-4 text-emerald-400" />
        <div className="flex items-center gap-2">
          <span className="text-xs text-white/50">Recommended:</span>
          <span className="text-xs text-white/70">{recommended}</span>
        </div>
      </div>
      <div className="flex items-center gap-1.5">
        <DollarSign className="h-3 w-3 text-emerald-400" />
        <span className="text-xs text-emerald-400">{savings}</span>
      </div>
    </div>
  )
}

interface RoadmapPhaseProps {
  phase: string
  timeframe: string
  items: string[]
  savings: string
  effort: string
}

function RoadmapPhase({ phase, timeframe, items, savings, effort }: RoadmapPhaseProps) {
  const effortColors = {
    Low: "bg-emerald-950/30 text-emerald-400",
    Medium: "bg-amber-950/30 text-amber-400",
    High: "bg-blue-950/30 text-blue-400",
  }

  return (
    <div className="p-3 bg-white/5 rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-white">{phase}</h3>
        <div className="flex items-center gap-2">
          <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full text-white/70">{timeframe}</span>
          <span className={`text-xs px-2 py-0.5 rounded-full ${effortColors[effort as keyof typeof effortColors]}`}>
            {effort} Effort
          </span>
        </div>
      </div>
      <ul className="space-y-1 mb-2">
        {items.map((item, index) => (
          <li key={index} className="flex items-start gap-2">
            <span className="text-emerald-400 text-xs mt-0.5">•</span>
            <span className="text-xs text-white/70">{item}</span>
          </li>
        ))}
      </ul>
      <div className="flex items-center gap-1.5">
        <DollarSign className="h-3 w-3 text-emerald-400" />
        <span className="text-xs text-emerald-400">Potential Savings: {savings}</span>
      </div>
    </div>
  )
}
