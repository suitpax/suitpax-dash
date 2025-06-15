import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"

const plans = [
  {
    name: "Free",
    price: "$0",
    features: ["Basic features", "Limited support"],
    cta: "Get Started",
  },
  {
    name: "Pro",
    price: "$19/month",
    features: ["Advanced features", "Priority support", "Analytics dashboard"],
    cta: "Upgrade to Pro",
  },
  {
    name: "Enterprise",
    price: "Contact Us",
    features: ["Custom features", "Dedicated support", "Unlimited usage"],
    cta: "Contact Us",
  },
]

export default function PlansPage() {
  return (
    <div className="container py-10">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Choose Your Plan</h1>
        <p className="text-muted-foreground mt-2">Start with our free plan and upgrade as you grow.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
        {plans.map((plan) => (
          <Card key={plan.name} className="shadow-md">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold">{plan.name}</CardTitle>
              <CardDescription>{plan.price}</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-none space-y-2">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button className="w-full mt-4">{plan.cta}</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
