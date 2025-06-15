"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PiTrendUp, PiTrendDown, PiCalendar, PiTarget, PiWarning, PiCheckCircle, PiClock } from "react-icons/pi"

export default function ForecastingPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("quarter")

  const forecasts = [
    {
      metric: "Total Travel Spend",
      current: "$124,580",
      predicted: "$142,300",
      variance: "+14.2%",
      trend: "up",
      confidence: 87,
      period: "Next Quarter",
    },
    {
      metric: "Average Trip Cost",
      current: "$2,847",
      predicted: "$2,650",
      variance: "-6.9%",
      trend: "down",
      confidence: 92,
      period: "Next Quarter",
    },
    {
      metric: "Booking Volume",
      current: "156 trips",
      predicted: "178 trips",
      variance: "+14.1%",
      trend: "up",
      confidence: 79,
      period: "Next Quarter",
    },
    {
      metric: "Policy Compliance",
      current: "94.7%",
      predicted: "96.2%",
      variance: "+1.5%",
      trend: "up",
      confidence: 85,
      period: "Next Quarter",
    },
  ]

  const seasonalTrends = [
    {
      period: "Q1 2025",
      prediction: "High travel volume expected",
      factors: ["Conference season", "New fiscal year planning"],
      impact: "high",
      confidence: 88,
    },
    {
      period: "Q2 2025",
      prediction: "Moderate decrease in travel",
      factors: ["Summer vacation period", "Reduced business activity"],
      impact: "medium",
      confidence: 82,
    },
    {
      period: "Q3 2025",
      prediction: "Gradual increase in bookings",
      factors: ["Back to business", "Trade show season"],
      impact: "medium",
      confidence: 75,
    },
    {
      period: "Q4 2025",
      prediction: "Peak travel season",
      factors: ["Year-end meetings", "Holiday travel"],
      impact: "high",
      confidence: 91,
    },
  ]

  const riskFactors = [
    {
      factor: "Economic Uncertainty",
      probability: 65,
      impact: "Medium",
      mitigation: "Flexible booking policies",
    },
    {
      factor: "Fuel Price Volatility",
      probability: 78,
      impact: "High",
      mitigation: "Hedge fuel costs with preferred vendors",
    },
    {
      factor: "Seasonal Demand Spikes",
      probability: 89,
      impact: "Medium",
      mitigation: "Early booking incentives",
    },
    {
      factor: "Currency Fluctuations",
      probability: 72,
      impact: "Low",
      mitigation: "Multi-currency budgeting",
    },
  ]

  const getConfidenceBadge = (confidence: number) => {
    if (confidence >= 85) {
      return (
        <Badge className="bg-green-500/20 text-green-400 border-green-500/30 font-light">
          <PiCheckCircle className="h-3 w-3 mr-1" />
          High ({confidence}%)
        </Badge>
      )
    } else if (confidence >= 70) {
      return (
        <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 font-light">
          <PiClock className="h-3 w-3 mr-1" />
          Medium ({confidence}%)
        </Badge>
      )
    } else {
      return (
        <Badge className="bg-red-500/20 text-red-400 border-red-500/30 font-light">
          <PiWarning className="h-3 w-3 mr-1" />
          Low ({confidence}%)
        </Badge>
      )
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact.toLowerCase()) {
      case "high":
        return "text-red-400"
      case "medium":
        return "text-yellow-400"
      case "low":
        return "text-green-400"
      default:
        return "text-white/70"
    }
  }

  return (
    <div className="min-h-screen bg-black text-white p-3">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-light tracking-tighter text-white">Travel Forecasting</h1>
            <p className="text-white/70 text-sm font-light">Predictive analytics for travel planning and budgeting</p>
          </div>
          <div className="flex gap-2">
            {["month", "quarter", "year"].map((period) => (
              <Button
                key={period}
                variant={selectedPeriod === period ? "default" : "outline"}
                onClick={() => setSelectedPeriod(period)}
                className={`capitalize text-sm font-light ${
                  selectedPeriod === period
                    ? "bg-white text-black hover:bg-white/90"
                    : "border-white/20 text-white/70 hover:bg-white/10"
                }`}
              >
                <PiCalendar className="h-4 w-4 mr-2" />
                {period}
              </Button>
            ))}
          </div>
        </div>

        {/* Forecast Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {forecasts.map((forecast, index) => (
            <Card key={index} className="bg-white/5 border-white/10">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <PiTarget className="h-5 w-5 text-white/50" />
                  <div className="flex items-center gap-1">
                    {forecast.trend === "up" ? (
                      <PiTrendUp className="h-4 w-4 text-green-400" />
                    ) : (
                      <PiTrendDown className="h-4 w-4 text-red-400" />
                    )}
                    <span
                      className={`text-xs font-light ${forecast.trend === "up" ? "text-green-400" : "text-red-400"}`}
                    >
                      {forecast.variance}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-xs text-white/50 font-light">{forecast.metric}</p>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-white/60 font-light">Current</span>
                      <span className="text-sm font-light text-white/80">{forecast.current}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-white/60 font-light">Predicted</span>
                      <span className="text-lg font-light text-white">{forecast.predicted}</span>
                    </div>
                  </div>
                  <div className="pt-2">{getConfidenceBadge(forecast.confidence)}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Seasonal Trends */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader className="py-3">
            <CardTitle className="text-white font-light tracking-tighter text-lg">
              Seasonal Trends & Predictions
            </CardTitle>
          </CardHeader>
          <CardContent className="py-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {seasonalTrends.map((trend, index) => (
                <div key={index} className="p-4 bg-white/5 border border-white/10 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-light text-white">{trend.period}</h3>
                    {getConfidenceBadge(trend.confidence)}
                  </div>
                  <p className="text-sm text-white/70 font-light mb-3">{trend.prediction}</p>
                  <div className="space-y-2">
                    <p className="text-xs text-white/50 font-light">Key Factors:</p>
                    <div className="flex flex-wrap gap-1">
                      {trend.factors.map((factor, factorIndex) => (
                        <Badge
                          key={factorIndex}
                          className="bg-white/10 text-white/70 border-white/20 text-xs font-light"
                        >
                          {factor}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-white/10">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-white/50 font-light">Expected Impact</span>
                      <span className={`text-xs font-light ${getImpactColor(trend.impact)}`}>{trend.impact}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Risk Factors */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader className="py-3">
            <CardTitle className="text-white font-light tracking-tighter text-lg">Risk Assessment</CardTitle>
          </CardHeader>
          <CardContent className="py-2">
            <div className="space-y-4">
              {riskFactors.map((risk, index) => (
                <div key={index} className="p-4 bg-white/5 border border-white/10 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-light text-white">{risk.factor}</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-white/50 font-light">Probability:</span>
                      <span className="text-sm font-light text-white">{risk.probability}%</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-white/50 font-light mb-1">Impact Level</p>
                      <span className={`text-sm font-light ${getImpactColor(risk.impact)}`}>{risk.impact}</span>
                    </div>
                    <div>
                      <p className="text-xs text-white/50 font-light mb-1">Mitigation Strategy</p>
                      <p className="text-sm text-white/70 font-light">{risk.mitigation}</p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs text-white/50 mb-1">
                      <span className="font-light">Risk Probability</span>
                      <span className="font-light">{risk.probability}%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${
                          risk.probability <= 50
                            ? "bg-green-400"
                            : risk.probability <= 75
                              ? "bg-yellow-400"
                              : "bg-red-400"
                        }`}
                        style={{ width: `${risk.probability}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
