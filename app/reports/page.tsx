"use client"

import { useState } from "react"
import { BarChart3, TrendingUp, Download, DollarSign, Plane, Building } from "lucide-react"

export default function ReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("last-30-days")
  const [selectedReport, setSelectedReport] = useState("overview")

  const reportData = {
    totalSpent: "$45,230",
    totalTrips: 127,
    avgTripCost: "$356",
    savings: "$8,450",
    topDestinations: [
      { city: "New York", trips: 23, amount: "$12,450" },
      { city: "London", trips: 18, amount: "$9,800" },
      { city: "Tokyo", trips: 15, amount: "$8,900" },
      { city: "Paris", trips: 12, amount: "$7,200" },
    ],
    monthlySpending: [
      { month: "Jan", amount: 4200 },
      { month: "Feb", amount: 3800 },
      { month: "Mar", amount: 5100 },
      { month: "Apr", amount: 4600 },
      { month: "May", amount: 5300 },
    ],
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <h1 className="text-md font-medium text-white">Travel Reports & Analytics</h1>
          <div className="flex gap-2">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white"
            >
              <option className="bg-black text-white" value="last-7-days">
                Last 7 days
              </option>
              <option className="bg-black text-white" value="last-30-days">
                Last 30 days
              </option>
              <option className="bg-black text-white" value="last-90-days">
                Last 90 days
              </option>
              <option className="bg-black text-white" value="last-year">
                Last year
              </option>
            </select>
            <button className="px-3 py-2 bg-white text-black rounded-lg text-sm hover:bg-white/90 flex items-center gap-2 font-medium">
              <Download className="h-4 w-4" />
              Export
            </button>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white/5 rounded-xl border border-white/10 p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-white/70">Total Spent</h3>
              <DollarSign className="h-5 w-5 text-white/50" />
            </div>
            <p className="text-2xl font-medium text-white">{reportData.totalSpent}</p>
            <div className="flex items-center text-xs text-emerald-400 mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              <span>+12% from last period</span>
            </div>
          </div>

          <div className="bg-white/5 rounded-xl border border-white/10 p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-white/70">Total Trips</h3>
              <Plane className="h-5 w-5 text-white/50" />
            </div>
            <p className="text-2xl font-medium text-white">{reportData.totalTrips}</p>
            <div className="flex items-center text-xs text-emerald-400 mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              <span>+8% from last period</span>
            </div>
          </div>

          <div className="bg-white/5 rounded-xl border border-white/10 p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-white/70">Avg Trip Cost</h3>
              <BarChart3 className="h-5 w-5 text-white/50" />
            </div>
            <p className="text-2xl font-medium text-white">{reportData.avgTripCost}</p>
            <div className="flex items-center text-xs text-red-400 mt-1">
              <TrendingUp className="h-3 w-3 mr-1 rotate-180" />
              <span>-3% from last period</span>
            </div>
          </div>

          <div className="bg-white/5 rounded-xl border border-white/10 p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-white/70">Savings</h3>
              <Building className="h-5 w-5 text-white/50" />
            </div>
            <p className="text-2xl font-medium text-white">{reportData.savings}</p>
            <div className="flex items-center text-xs text-emerald-400 mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              <span>+15% from last period</span>
            </div>
          </div>
        </div>

        {/* Report Tabs */}
        <div className="bg-white/5 rounded-xl border border-white/10 p-6 shadow-sm mb-6">
          <div className="flex flex-wrap border-b border-white/10 mb-6 overflow-x-auto">
            <button
              onClick={() => setSelectedReport("overview")}
              className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${
                selectedReport === "overview" ? "text-white border-b-2 border-white" : "text-white/70 hover:text-white"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setSelectedReport("destinations")}
              className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${
                selectedReport === "destinations"
                  ? "text-white border-b-2 border-white"
                  : "text-white/70 hover:text-white"
              }`}
            >
              Destinations
            </button>
            <button
              onClick={() => setSelectedReport("expenses")}
              className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${
                selectedReport === "expenses" ? "text-white border-b-2 border-white" : "text-white/70 hover:text-white"
              }`}
            >
              Expenses
            </button>
            <button
              onClick={() => setSelectedReport("trends")}
              className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${
                selectedReport === "trends" ? "text-white border-b-2 border-white" : "text-white/70 hover:text-white"
              }`}
            >
              Trends
            </button>
          </div>

          {selectedReport === "overview" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-white mb-4">Monthly Spending Trend</h3>
                <div className="h-64 bg-white/5 rounded-lg flex items-center justify-center border border-white/10">
                  <p className="text-white/50">Chart visualization would go here</p>
                </div>
              </div>
            </div>
          )}

          {selectedReport === "destinations" && (
            <div>
              <h3 className="text-lg font-medium text-white mb-4">Top Destinations</h3>
              <div className="space-y-3">
                {reportData.topDestinations.map((destination, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div>
                      <h4 className="font-medium text-white">{destination.city}</h4>
                      <p className="text-sm text-white/70">{destination.trips} trips</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-white">{destination.amount}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedReport === "expenses" && (
            <div>
              <h3 className="text-lg font-medium text-white mb-4">Expense Breakdown</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-white/70">Flights</span>
                    <span className="font-medium text-white">$18,450 (41%)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-white/70">Hotels</span>
                    <span className="font-medium text-white">$15,200 (34%)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-white/70">Transportation</span>
                    <span className="font-medium text-white">$6,780 (15%)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-white/70">Meals</span>
                    <span className="font-medium text-white">$4,800 (10%)</span>
                  </div>
                </div>
                <div className="h-48 bg-white/5 rounded-lg flex items-center justify-center border border-white/10">
                  <p className="text-white/50">Pie chart would go here</p>
                </div>
              </div>
            </div>
          )}

          {selectedReport === "trends" && (
            <div>
              <h3 className="text-lg font-medium text-white mb-4">Travel Trends</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-white/5 rounded-lg">
                  <h4 className="font-medium text-white mb-2">Peak Travel Months</h4>
                  <p className="text-sm text-white/70">March and September show highest travel activity</p>
                </div>
                <div className="p-4 bg-white/5 rounded-lg">
                  <h4 className="font-medium text-white mb-2">Cost Optimization</h4>
                  <p className="text-sm text-white/70">Booking 2 weeks in advance saves 15% on average</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
