"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PiShield, PiWarning, PiCheckCircle, PiClock } from "react-icons/pi"

export default function CompliancePage() {
  const riskAlerts = [
    {
      destination: "Ukraine",
      level: "high",
      message: "Travel not recommended due to ongoing conflict",
      updated: "2 hours ago",
    },
    {
      destination: "Myanmar",
      level: "high",
      message: "Political instability and civil unrest",
      updated: "1 day ago",
    },
    {
      destination: "Haiti",
      level: "medium",
      message: "Security concerns in certain areas",
      updated: "3 days ago",
    },
  ]

  const policyChecks = [
    { rule: "Flight booking within policy", status: "passed", trips: 24 },
    { rule: "Hotel budget compliance", status: "warning", trips: 3 },
    { rule: "Advance booking requirement", status: "passed", trips: 27 },
    { rule: "Preferred vendor usage", status: "failed", trips: 2 },
  ]

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-light tracking-tight text-white mb-2">Compliance & Risk Management</h1>
          <p className="text-white/60 font-light text-lg">Monitor travel safety, policy compliance, and risk factors</p>
        </div>

        {/* Risk Alerts */}
        <Card className="bg-white/5 border-white/10 rounded-2xl">
          <CardHeader>
            <CardTitle className="text-white font-light text-xl flex items-center gap-3">
              <PiWarning className="h-6 w-6 text-red-400" />
              Travel Risk Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {riskAlerts.map((alert, index) => (
              <div key={index} className="p-4 bg-white/5 border border-white/10 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Badge
                      className={`rounded-full font-light ${
                        alert.level === "high"
                          ? "bg-red-500/20 text-red-400 border-red-500/30"
                          : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                      }`}
                    >
                      {alert.level} risk
                    </Badge>
                    <h3 className="text-white font-medium">{alert.destination}</h3>
                  </div>
                  <span className="text-xs text-white/40">{alert.updated}</span>
                </div>
                <p className="text-white/70 text-sm font-light">{alert.message}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Policy Compliance */}
        <Card className="bg-white/5 border-white/10 rounded-2xl">
          <CardHeader>
            <CardTitle className="text-white font-light text-xl flex items-center gap-3">
              <PiShield className="h-6 w-6 text-blue-400" />
              Policy Compliance Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {policyChecks.map((check, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                <div className="flex items-center gap-3">
                  {check.status === "passed" && <PiCheckCircle className="h-5 w-5 text-green-400" />}
                  {check.status === "warning" && <PiClock className="h-5 w-5 text-yellow-400" />}
                  {check.status === "failed" && <PiWarning className="h-5 w-5 text-red-400" />}
                  <span className="text-white font-light">{check.rule}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-white/60 text-sm">{check.trips} trips</span>
                  <Badge
                    className={`rounded-full font-light ${
                      check.status === "passed"
                        ? "bg-green-500/20 text-green-400"
                        : check.status === "warning"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {check.status}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
