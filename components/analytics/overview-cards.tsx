import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, Users, CreditCard, TrendingUp } from "lucide-react"

const cards = [
  {
    title: "Total Revenue",
    icon: DollarSign,
    amount: "$45,231.89",
    description: "+20.1% from last month",
    trend: "up",
  },
  {
    title: "New Customers",
    icon: Users,
    amount: "2,350",
    description: "+180.1% from last month",
    trend: "up",
  },
  {
    title: "Active Accounts",
    icon: CreditCard,
    amount: "12,234",
    description: "+19% from last month",
    trend: "up",
  },
  {
    title: "Growth Rate",
    icon: TrendingUp,
    amount: "18.6%",
    description: "+5.4% from last month",
    trend: "up",
  },
]

export function OverviewCards() {
  return (
    <>
      {cards.map((card) => (
        <Card key={card.title} className="border border-white/10 bg-white/5 rounded-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3">
            <CardTitle className="text-sm font-medium text-white">{card.title}</CardTitle>
            <card.icon className="h-4 w-4 text-white/70" />
          </CardHeader>
          <CardContent className="p-3 pt-0">
            <div className="text-xl md:text-2xl font-bold text-white">{card.amount}</div>
            <p className="text-xs text-white/70">{card.description}</p>
            <div
              className={`mt-2 flex items-center text-xs ${card.trend === "up" ? "text-green-400" : "text-red-400"}`}
            >
              {card.trend === "up" ? (
                <TrendingUp className="mr-1 h-3 w-3" />
              ) : (
                <TrendingUp className="mr-1 h-3 w-3 transform rotate-180" />
              )}
              {card.description.split(" ")[0]}
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  )
}
