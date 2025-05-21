"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { DateRange } from "react-day-picker"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer, BarChart, Bar } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertTriangle, CheckCircle, TrendingUp, TrendingDown } from "lucide-react"

interface BudgetForecastProps {
  dateRange: DateRange
}

// Datos de ejemplo para las gráficas
const budgetData = [
  { month: "Ene", budget: 25000, actual: 22400, forecast: 22400 },
  { month: "Feb", budget: 25000, actual: 24200, forecast: 24200 },
  { month: "Mar", budget: 25000, actual: 25800, forecast: 25800 },
  { month: "Abr", budget: 30000, actual: 26200, forecast: 26200 },
  { month: "May", budget: 30000, actual: 28100, forecast: 28100 },
  { month: "Jun", budget: 30000, actual: 27300, forecast: 27300 },
  { month: "Jul", budget: 35000, actual: 29200, forecast: 29200 },
  { month: "Ago", budget: 35000, actual: 30100, forecast: 30100 },
  { month: "Sep", budget: 35000, actual: null, forecast: 31000 },
  { month: "Oct", budget: 40000, actual: null, forecast: 32500 },
  { month: "Nov", budget: 40000, actual: null, forecast: 33000 },
  { month: "Dic", budget: 40000, actual: null, forecast: 34500 },
]

export function BudgetForecast({ dateRange }: BudgetForecastProps) {
  // Datos de ejemplo para la previsión de presupuesto
  const annualBudgetData = [
    { month: "Jan", budget: 50000, actual: 48000, forecast: 48000 },
    { month: "Feb", budget: 50000, actual: 52000, forecast: 52000 },
    { month: "Mar", budget: 50000, actual: 49000, forecast: 49000 },
    { month: "Apr", budget: 50000, actual: 51000, forecast: 51000 },
    { month: "May", budget: 50000, actual: 53000, forecast: 53000 },
    { month: "Jun", budget: 50000, actual: 55000, forecast: 55000 },
    { month: "Jul", budget: 50000, actual: null, forecast: 58000 },
    { month: "Aug", budget: 50000, actual: null, forecast: 60000 },
    { month: "Sep", budget: 50000, actual: null, forecast: 54000 },
    { month: "Oct", budget: 50000, actual: null, forecast: 52000 },
    { month: "Nov", budget: 50000, actual: null, forecast: 56000 },
    { month: "Dec", budget: 50000, actual: null, forecast: 62000 },
  ]

  const departmentBudgetData = [
    { department: "Sales", budget: 240000, forecast: 258000, variance: 18000, status: "at-risk" },
    { department: "Marketing", budget: 180000, forecast: 192000, variance: 12000, status: "warning" },
    { department: "Engineering", budget: 150000, forecast: 145000, variance: -5000, status: "on-track" },
    { department: "Product", budget: 120000, forecast: 118000, variance: -2000, status: "on-track" },
    { department: "Finance", budget: 90000, forecast: 94000, variance: 4000, status: "on-track" },
    { department: "HR", budget: 60000, forecast: 62000, variance: 2000, status: "on-track" },
    { department: "Legal", budget: 45000, forecast: 48000, variance: 3000, status: "on-track" },
  ]

  const categoryBudgetData = [
    { category: "Flights", budget: 300000, forecast: 325000, variance: 25000, status: "at-risk" },
    { category: "Hotels", budget: 250000, forecast: 265000, variance: 15000, status: "warning" },
    { category: "Transportation", budget: 100000, forecast: 105000, variance: 5000, status: "on-track" },
    { category: "Meals", budget: 120000, forecast: 128000, variance: 8000, status: "warning" },
    { category: "Conferences", budget: 80000, forecast: 85000, variance: 5000, status: "on-track" },
    { category: "Other", budget: 50000, forecast: 52000, variance: 2000, status: "on-track" },
  ]

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Budget Forecasting</h2>
          <p className="text-white/70 text-sm">Predictive analysis of travel budget utilization and forecasts</p>
        </div>
        <div className="flex items-center gap-2">
          <Select defaultValue="2025">
            <SelectTrigger className="w-[180px] bg-black border-white/10 text-white">
              <SelectValue placeholder="Fiscal Year" />
            </SelectTrigger>
            <SelectContent className="bg-black border-white/10 text-white">
              <SelectItem value="2023">FY 2023</SelectItem>
              <SelectItem value="2024">FY 2024</SelectItem>
              <SelectItem value="2025">FY 2025</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className="bg-black border-white/10">
        <CardHeader>
          <CardTitle className="text-white text-lg">Annual Budget Forecast</CardTitle>
          <CardDescription className="text-white/70">Monthly budget vs actual spend and forecast</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ChartContainer
              config={{
                budget: {
                  label: "Budget",
                  color: "hsl(var(--chart-1))",
                },
                actual: {
                  label: "Actual Spend",
                  color: "hsl(var(--chart-2))",
                },
                forecast: {
                  label: "Forecast",
                  color: "hsl(var(--chart-3))",
                },
              }}
            >
              {/* <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={annualBudgetData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="month" stroke="rgba(255,255,255,0.5)" />
                  <YAxis stroke="rgba(255,255,255,0.5)" tickFormatter={(value) => `$${value / 1000}k`} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="budget"
                    stroke="var(--color-budget)"
                    fill="var(--color-budget)"
                    fillOpacity={0.1}
                    strokeWidth={2}
                    name="Budget"
                  />
                  <Area
                    type="monotone"
                    dataKey="actual"
                    stroke="var(--color-actual)"
                    fill="var(--color-actual)"
                    fillOpacity={0.2}
                    strokeWidth={2}
                    name="Actual Spend"
                  />
                  <Area
                    type="monotone"
                    dataKey="forecast"
                    stroke="var(--color-forecast)"
                    fill="var(--color-forecast)"
                    fillOpacity={0.1}
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    name="Forecast"
                  />
                </AreaChart>
              </ResponsiveContainer> */}
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={budgetData}>
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
                    type="stepAfter"
                    dataKey="budget"
                    stroke="var(--color-budget)"
                    strokeWidth={2}
                    dot={false}
                    name="Presupuesto"
                  />
                  <Line
                    type="monotone"
                    dataKey="actual"
                    stroke="var(--color-actual)"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                    name="Gasto Real"
                  />
                  <Line
                    type="monotone"
                    dataKey="forecast"
                    stroke="var(--color-forecast)"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={{ r: 4 }}
                    name="Previsión"
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <BudgetMetricCard
              title="Annual Budget"
              value="$600,000"
              subValue="$650,000 forecasted"
              status="warning"
              description="Projected 8.3% over budget"
            />
            <BudgetMetricCard
              title="YTD Spend"
              value="$308,000"
              subValue="51.3% of annual budget"
              status="on-track"
              description="On pace with 6-month target"
            />
            <BudgetMetricCard
              title="Q3 Forecast"
              value="$172,000"
              subValue="$150,000 budgeted"
              status="at-risk"
              description="Projected 14.7% over budget"
            />
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="department" className="w-full">
        <TabsList className="bg-black border border-white/10 mb-4">
          <TabsTrigger value="department" className="data-[state=active]:bg-white/10">
            By Department
          </TabsTrigger>
          <TabsTrigger value="category" className="data-[state=active]:bg-white/10">
            By Category
          </TabsTrigger>
        </TabsList>

        <TabsContent value="department" className="mt-0">
          <Card className="bg-black border-white/10">
            <CardHeader>
              <CardTitle className="text-white text-lg">Departmental Budget Forecast</CardTitle>
              <CardDescription className="text-white/70">Budget allocation and forecast by department</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {departmentBudgetData.map((dept) => (
                  <DepartmentBudgetItem
                    key={dept.department}
                    department={dept.department}
                    budget={dept.budget}
                    forecast={dept.forecast}
                    variance={dept.variance}
                    status={dept.status as "on-track" | "warning" | "at-risk"}
                  />
                ))}
              </div>

              <div className="mt-6 p-4 bg-white/5 rounded-lg">
                <h3 className="text-white font-medium mb-3">Budget Reallocation Recommendations</h3>
                <div className="space-y-2">
                  <ReallocationItem
                    from="Engineering"
                    to="Sales"
                    amount="$5,000"
                    reason="Engineering is under budget while Sales needs additional funds for Q3 client visits"
                  />
                  <ReallocationItem
                    from="Product"
                    to="Marketing"
                    amount="$2,000"
                    reason="Product team travel is below forecast, Marketing needs additional conference budget"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="category" className="mt-0">
          <Card className="bg-black border-white/10">
            <CardHeader>
              <CardTitle className="text-white text-lg">Category Budget Forecast</CardTitle>
              <CardDescription className="text-white/70">
                Budget allocation and forecast by expense category
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] mb-6">
                <ChartContainer
                  config={{
                    budget: {
                      label: "Budget",
                      color: "hsl(var(--chart-1))",
                    },
                    forecast: {
                      label: "Forecast",
                      color: "hsl(var(--chart-2))",
                    },
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={categoryBudgetData}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis
                        type="number"
                        stroke="rgba(255,255,255,0.5)"
                        tickFormatter={(value) => `$${value / 1000}k`}
                      />
                      <YAxis type="category" dataKey="category" stroke="rgba(255,255,255,0.5)" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Bar dataKey="budget" fill="var(--color-budget)" name="Budget" />
                      <Bar dataKey="forecast" fill="var(--color-forecast)" name="Forecast" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>

              <div className="space-y-4">
                {categoryBudgetData.map((cat) => (
                  <CategoryBudgetItem
                    key={cat.category}
                    category={cat.category}
                    budget={cat.budget}
                    forecast={cat.forecast}
                    variance={cat.variance}
                    status={cat.status as "on-track" | "warning" | "at-risk"}
                  />
                ))}
              </div>

              <div className="mt-6 p-4 bg-white/5 rounded-lg">
                <h3 className="text-white font-medium mb-3">Cost Optimization Opportunities</h3>
                <div className="space-y-2">
                  <OptimizationItem
                    category="Flights"
                    savingsAmount="$15,000"
                    strategy="Implement 21-day advance booking policy and preferred airline program"
                  />
                  <OptimizationItem
                    category="Hotels"
                    savingsAmount="$8,500"
                    strategy="Negotiate corporate rates with top 5 most-visited destinations"
                  />
                  <OptimizationItem
                    category="Meals"
                    savingsAmount="$4,200"
                    strategy="Revise per diem structure based on destination cost of living"
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

interface BudgetMetricCardProps {
  title: string
  value: string
  subValue: string
  status: "on-track" | "warning" | "at-risk"
  description: string
}

function BudgetMetricCard({ title, value, subValue, status, description }: BudgetMetricCardProps) {
  const statusColors = {
    "on-track": "bg-emerald-950/30 text-emerald-400",
    warning: "bg-amber-950/30 text-amber-400",
    "at-risk": "bg-rose-950/30 text-rose-400",
  }

  const statusIcons = {
    "on-track": <CheckCircle className="h-4 w-4" />,
    warning: <AlertTriangle className="h-4 w-4" />,
    "at-risk": <AlertTriangle className="h-4 w-4" />,
  }

  return (
    <div className="bg-white/5 rounded-lg p-4">
      <h3 className="text-sm font-medium text-white/70 mb-1">{title}</h3>
      <div className="text-2xl font-bold text-white mb-1">{value}</div>
      <div className="flex items-center justify-between">
        <span className="text-xs text-white/50">{subValue}</span>
        <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${statusColors[status]}`}>
          {statusIcons[status]}
          <span>{status === "on-track" ? "On Track" : status === "warning" ? "Warning" : "At Risk"}</span>
        </div>
      </div>
      <p className="text-xs text-white/70 mt-2">{description}</p>
    </div>
  )
}

interface DepartmentBudgetItemProps {
  department: string
  budget: number
  forecast: number
  variance: number
  status: "on-track" | "warning" | "at-risk"
}

function DepartmentBudgetItem({ department, budget, forecast, variance, status }: DepartmentBudgetItemProps) {
  const statusColors = {
    "on-track": "bg-emerald-950/30 text-emerald-400",
    warning: "bg-amber-950/30 text-amber-400",
    "at-risk": "bg-rose-950/30 text-rose-400",
  }

  const percentage = (forecast / budget) * 100
  const progressColors = {
    "on-track": "bg-emerald-500",
    warning: "bg-amber-500",
    "at-risk": "bg-rose-500",
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-white">{department}</h3>
        <div className={`px-2 py-0.5 rounded-full text-xs ${statusColors[status]}`}>
          {status === "on-track" ? "On Track" : status === "warning" ? "Warning" : "At Risk"}
        </div>
      </div>
      <div className="flex items-center justify-between text-xs text-white/70">
        <span>Budget: ${(budget / 1000).toFixed(1)}k</span>
        <span>Forecast: ${(forecast / 1000).toFixed(1)}k</span>
        <span className={variance >= 0 ? "text-rose-400" : "text-emerald-400"}>
          Variance: {variance >= 0 ? "+" : ""}${(variance / 1000).toFixed(1)}k
        </span>
      </div>
      <div className="w-full bg-white/10 rounded-full h-2">
        <div
          className={`${progressColors[status]} h-2 rounded-full`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        ></div>
      </div>
      <div className="flex justify-between text-xs text-white/50">
        <span>0%</span>
        <span>50%</span>
        <span>100%</span>
      </div>
    </div>
  )
}

interface CategoryBudgetItemProps {
  category: string
  budget: number
  forecast: number
  variance: number
  status: "on-track" | "warning" | "at-risk"
}

function CategoryBudgetItem({ category, budget, forecast, variance, status }: CategoryBudgetItemProps) {
  const statusColors = {
    "on-track": "bg-emerald-950/30 text-emerald-400",
    warning: "bg-amber-950/30 text-amber-400",
    "at-risk": "bg-rose-950/30 text-rose-400",
  }

  return (
    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
      <div>
        <h3 className="text-sm font-medium text-white">{category}</h3>
        <div className="flex items-center gap-4 mt-1 text-xs text-white/70">
          <span>Budget: ${(budget / 1000).toFixed(1)}k</span>
          <span>Forecast: ${(forecast / 1000).toFixed(1)}k</span>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <div className={`px-2 py-0.5 rounded-full text-xs ${statusColors[status]}`}>
          {variance >= 0 ? "+" : ""}${(variance / 1000).toFixed(1)}k ({((variance / budget) * 100).toFixed(1)}%)
        </div>
        <span className="text-xs text-white/50 mt-1">
          {status === "on-track" ? "On Track" : status === "warning" ? "Warning" : "At Risk"}
        </span>
      </div>
    </div>
  )
}

interface ReallocationItemProps {
  from: string
  to: string
  amount: string
  reason: string
}

function ReallocationItem({ from, to, amount, reason }: ReallocationItemProps) {
  return (
    <div className="p-3 bg-white/5 rounded-lg">
      <div className="flex items-center gap-2 mb-1">
        <div className="flex items-center gap-1">
          <span className="text-sm text-white/70">{from}</span>
          <TrendingDown className="h-4 w-4 text-emerald-400" />
        </div>
        <span className="text-white/50">→</span>
        <div className="flex items-center gap-1">
          <span className="text-sm text-white/70">{to}</span>
          <TrendingUp className="h-4 w-4 text-amber-400" />
        </div>
        <span className="text-xs bg-blue-950/30 text-blue-400 px-2 py-0.5 rounded-full ml-auto">{amount}</span>
      </div>
      <p className="text-xs text-white/50">{reason}</p>
    </div>
  )
}

interface OptimizationItemProps {
  category: string
  savingsAmount: string
  strategy: string
}

function OptimizationItem({ category, savingsAmount, strategy }: OptimizationItemProps) {
  return (
    <div className="p-3 bg-white/5 rounded-lg">
      <div className="flex items-center justify-between mb-1">
        <h4 className="text-sm font-medium text-white">{category}</h4>
        <span className="text-xs bg-emerald-950/30 text-emerald-400 px-2 py-0.5 rounded-full">
          Potential Savings: {savingsAmount}
        </span>
      </div>
      <p className="text-xs text-white/70">{strategy}</p>
    </div>
  )
}
