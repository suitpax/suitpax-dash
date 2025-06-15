"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PiLeaf, PiTarget } from "react-icons/pi"

export default function SustainabilityPage() {
  const carbonStats = [
    { period: "This Month", emissions: "2.4t CO₂", offset: "100%", trend: "+5%" },
    { period: "This Quarter", emissions: "7.2t CO₂", offset: "95%", trend: "+12%" },
    { period: "This Year", emissions: "28.8t CO₂", offset: "87%", trend: "+8%" },
  ]

  const greenOptions = [
    {
      route: "NYC → London",
      standard: "8.2t CO₂",
      green: "6.1t CO₂",
      savings: "25%",
      option: "Direct flight + carbon offset",
    },
    {
      route: "Paris → Berlin",
      standard: "0.8t CO₂",
      green: "0.02t CO₂",
      savings: "97%",
      option: "High-speed train",
    },
  ]

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-light tracking-tight text-white mb-2">Sustainability Dashboard</h1>
          <p className="text-white/60 font-light text-lg">
            Track your carbon footprint and discover eco-friendly travel options
          </p>
        </div>

        {/* Carbon Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {carbonStats.map((stat, index) => (
            <Card key={index} className="bg-white/5 border-white/10 rounded-2xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <PiLeaf className="h-8 w-8 text-green-400" />
                  <span className="text-sm text-green-400 font-light">{stat.trend}</span>
                </div>
                <div>
                  <p className="text-white/60 text-sm font-light mb-1">{stat.period}</p>
                  <p className="text-2xl font-light text-white mb-2">{stat.emissions}</p>
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30 rounded-full font-light">
                    {stat.offset} offset
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Green Travel Options */}
        <Card className="bg-white/5 border-white/10 rounded-2xl">
          <CardHeader>
            <CardTitle className="text-white font-light text-xl flex items-center gap-3">
              <PiTarget className="h-6 w-6 text-green-400" />
              Eco-Friendly Alternatives
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {greenOptions.map((option, index) => (
              <div key={index} className="p-4 bg-white/5 border border-white/10 rounded-xl">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-white font-medium">{option.route}</h3>
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30 rounded-full font-light">
                    -{option.savings} emissions
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <p className="text-white/50 text-xs font-light">Standard Option</p>
                    <p className="text-white/70 font-light">{option.standard}</p>
                  </div>
                  <div>
                    <p className="text-white/50 text-xs font-light">Green Option</p>
                    <p className="text-green-400 font-light">{option.green}</p>
                  </div>
                </div>
                <p className="text-white/60 text-sm font-light">{option.option}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
