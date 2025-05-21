"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { DateRange } from "react-day-picker"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer, BarChart, Bar } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ExpensePredictionProps {
  dateRange: DateRange
}

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

export function ExpensePrediction({ dateRange }: ExpensePredictionProps) {
  // Datos de ejemplo para las predicciones de gastos
  const monthlyPredictionData = [
    { month: "Jan", actual: 42000, predicted: 42000, variance: 0 },
    { month: "Feb", actual: 38000, predicted: 40000, variance: -2000 },
    { month: "Mar", actual: 45000, predicted: 43000, variance: 2000 },
    { month: "Apr", actual: 40000, predicted: 41000, variance: -1000 },
    { month: "May", actual: 35000, predicted: 38000, variance: -3000 },
    { month: "Jun", actual: 48000, predicted: 45000, variance: 3000 },
    { month: "Jul", actual: null, predicted: 52000, variance: null },
    { month: "Aug", actual: null, predicted: 58000, variance: null },
    { month: "Sep", actual: null, predicted: 49000, variance: null },
    { month: "Oct", actual: null, predicted: 45000, variance: null },
    { month: "Nov", actual: null, predicted: 51000, variance: null },
    { month: "Dec", actual: null, predicted: 60000, variance: null },
  ]

  const categoryPredictionData = [
    { category: "Flights", actual: 120000, predicted: 135000, variance: -15000 },
    { category: "Hotels", actual: 85000, predicted: 92000, variance: -7000 },
    { category: "Transportation", actual: 35000, predicted: 38000, variance: -3000 },
    { category: "Meals", actual: 42000, predicted: 45000, variance: -3000 },
    { category: "Conferences", actual: 28000, predicted: 32000, variance: -4000 },
    { category: "Other", actual: 18000, predicted: 20000, variance: -2000 },
  ]

  const departmentPredictionData = [
    { department: "Sales", actual: 95000, predicted: 105000, variance: -10000 },
    { department: "Marketing", actual: 65000, predicted: 72000, variance: -7000 },
    { department: "Engineering", actual: 78000, predicted: 85000, variance: -7000 },
    { department: "Product", actual: 45000, predicted: 48000, variance: -3000 },
    { department: "Finance", actual: 32000, predicted: 35000, variance: -3000 },
    { department: "HR", actual: 18000, predicted: 20000, variance: -2000 },
    { department: "Legal", actual: 15000, predicted: 17000, variance: -2000 },
  ]

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Expense Predictions</h2>
          <p className="text-white/70 text-sm">
            AI-powered forecasting of travel expenses based on historical data and upcoming trips
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select defaultValue="monthly">
            <SelectTrigger className="w-[180px] bg-black border-white/10 text-white">
              <SelectValue placeholder="View by" />
            </SelectTrigger>
            <SelectContent className="bg-black border-white/10 text-white">
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="quarterly">Quarterly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="timeline" className="w-full">
        <TabsList className="bg-black border border-white/10 mb-4">
          <TabsTrigger value="timeline" className="data-[state=active]:bg-white/10">
            Timeline
          </TabsTrigger>
          <TabsTrigger value="category" className="data-[state=active]:bg-white/10">
            By Category
          </TabsTrigger>
          <TabsTrigger value="department" className="data-[state=active]:bg-white/10">
            By Department
          </TabsTrigger>
        </TabsList>

        <TabsContent value="timeline" className="mt-0">
          <Card className="bg-black border-white/10">
            <CardHeader>
              <CardTitle className="text-white text-lg">Monthly Expense Forecast</CardTitle>
              <CardDescription className="text-white/70">
                Actual vs predicted expenses with 6-month forecast
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ChartContainer
                  config={{
                    actual: {
                      label: "Actual Expenses",
                      color: "hsl(var(--chart-1))",
                    },
                    predicted: {
                      label: "Predicted Expenses",
                      color: "hsl(var(--chart-2))",
                    },
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyPredictionData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis dataKey="month" stroke="rgba(255,255,255,0.5)" />
                      <YAxis stroke="rgba(255,255,255,0.5)" tickFormatter={(value) => `$${value / 1000}k`} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="actual"
                        stroke="var(--color-actual)"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                        name="Actual Expenses"
                      />
                      <Line
                        type="monotone"
                        dataKey="predicted"
                        stroke="var(--color-predicted)"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        dot={{ r: 4 }}
                        name="Predicted Expenses"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <MetricCard
                  title="Total Annual Forecast"
                  value="$562,000"
                  change={8.5}
                  trend="up"
                  description="vs previous year"
                />
                <MetricCard
                  title="Forecast Accuracy"
                  value="94.2%"
                  change={1.8}
                  trend="up"
                  description="vs previous quarter"
                />
                <MetricCard
                  title="Avg. Monthly Variance"
                  value="$2,100"
                  change={12.5}
                  trend="down"
                  description="Improved from last quarter"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="category" className="mt-0">
          <Card className="bg-black border-white/10">
            <CardHeader>
              <CardTitle className="text-white text-lg">Expense Forecast by Category</CardTitle>
              <CardDescription className="text-white/70">
                Breakdown of predicted expenses across travel categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ChartContainer
                  config={{
                    actual: {
                      label: "Actual Expenses",
                      color: "hsl(var(--chart-1))",
                    },
                    predicted: {
                      label: "Predicted Expenses",
                      color: "hsl(var(--chart-2))",
                    },
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={categoryPredictionData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis dataKey="category" stroke="rgba(255,255,255,0.5)" />
                      <YAxis stroke="rgba(255,255,255,0.5)" tickFormatter={(value) => `$${value / 1000}k`} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Bar dataKey="actual" fill="var(--color-actual)" name="Actual Expenses" />
                      <Bar dataKey="predicted" fill="var(--color-predicted)" name="Predicted Expenses" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>

              <div className="mt-6">
                <h3 className="text-white font-medium mb-3">Category Insights</h3>
                <div className="space-y-2">
                  <InsightItem
                    category="Flights"
                    insight="Prices expected to increase by 12% in Q3 due to seasonal demand"
                    recommendation="Book 45+ days in advance to secure better rates"
                  />
                  <InsightItem
                    category="Hotels"
                    insight="Corporate rates negotiated with preferred vendors saving 15% on average"
                    recommendation="Increase compliance with preferred hotel program"
                  />
                  <InsightItem
                    category="Transportation"
                    insight="Ride-sharing expenses growing faster than expected (18% YoY)"
                    recommendation="Consider implementing transportation allowances"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="department" className="mt-0">
          <Card className="bg-black border-white/10">
            <CardHeader>
              <CardTitle className="text-white text-lg">Expense Forecast by Department</CardTitle>
              <CardDescription className="text-white/70">
                Departmental breakdown of travel spending and predictions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ChartContainer
                  config={{
                    actual: {
                      label: "Actual Expenses",
                      color: "hsl(var(--chart-1))",
                    },
                    predicted: {
                      label: "Predicted Expenses",
                      color: "hsl(var(--chart-2))",
                    },
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={departmentPredictionData}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis
                        type="number"
                        stroke="rgba(255,255,255,0.5)"
                        tickFormatter={(value) => `$${value / 1000}k`}
                      />
                      <YAxis type="category" dataKey="department" stroke="rgba(255,255,255,0.5)" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Bar dataKey="actual" fill="var(--color-actual)" name="Actual Expenses" />
                      <Bar dataKey="predicted" fill="var(--color-predicted)" name="Predicted Expenses" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>

              <div className="mt-6">
                <h3 className="text-white font-medium mb-3">Department Insights</h3>
                <div className="space-y-2">
                  <DepartmentInsight
                    department="Sales"
                    budgetStatus="At Risk"
                    trend="10.5% above forecast"
                    recommendation="Review Q3 travel plans and prioritize high-value opportunities"
                  />
                  <DepartmentInsight
                    department="Engineering"
                    budgetStatus="On Track"
                    trend="2.3% below forecast"
                    recommendation="Consider reallocating budget to teams with higher needs"
                  />
                  <DepartmentInsight
                    department="Marketing"
                    budgetStatus="Warning"
                    trend="7.8% above forecast"
                    recommendation="Evaluate conference ROI and adjust attendance strategy"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface MetricCardProps {
  title: string
  value: string
  change: number
  trend: "up" | "down"
  description: string
}

function MetricCard({ title, value, change, trend, description }: MetricCardProps) {
  return (
    <div className="bg-white/5 rounded-lg p-4">
      <h3 className="text-sm font-medium text-white/70 mb-1">{title}</h3>
      <div className="flex items-end justify-between">
        <div className="text-2xl font-bold text-white">{value}</div>
        <div
          className={`flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
            trend === "up"
              ? change > 0
                ? "bg-emerald-950/30 text-emerald-400"
                : "bg-rose-950/30 text-rose-400"
              : change > 0
                ? "bg-rose-950/30 text-rose-400"
                : "bg-emerald-950/30 text-emerald-400"
          }`}
        >
          {change}% {description}
        </div>
      </div>
    </div>
  )
}

interface InsightItemProps {
  category: string
  insight: string
  recommendation: string
}

function InsightItem({ category, insight, recommendation }: InsightItemProps) {
  return (
    <div className="bg-white/5 rounded-lg p-3">
      <div className="flex items-center justify-between mb-1">
        <h4 className="text-sm font-medium text-white">{category}</h4>
        <span className="text-xs px-2 py-0.5 bg-blue-950/30 text-blue-400 rounded-full">Insight</span>
      </div>
      <p className="text-xs text-white/70 mb-2">{insight}</p>
      <div className="flex items-center gap-2">
        <span className="text-xs text-white/50">Recommendation:</span>
        <span className="text-xs text-white/70">{recommendation}</span>
      </div>
    </div>
  )
}

interface DepartmentInsightProps {
  department: string
  budgetStatus: "On Track" | "Warning" | "At Risk"
  trend: string
  recommendation: string
}

function DepartmentInsight({ department, budgetStatus, trend, recommendation }: DepartmentInsightProps) {
  const statusColors = {
    "On Track": "bg-emerald-950/30 text-emerald-400",
    Warning: "bg-amber-950/30 text-amber-400",
    "At Risk": "bg-rose-950/30 text-rose-400",
  }

  return (
    <div className="bg-white/5 rounded-lg p-3">
      <div className="flex items-center justify-between mb-1">
        <h4 className="text-sm font-medium text-white">{department}</h4>
        <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[budgetStatus]}`}>{budgetStatus}</span>
      </div>
      <p className="text-xs text-white/70 mb-2">Trend: {trend}</p>
      <div className="flex items-center gap-2">
        <span className="text-xs text-white/50">Recommendation:</span>
        <span className="text-xs text-white/70">{recommendation}</span>
      </div>
    </div>
  )
}
