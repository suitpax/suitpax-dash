import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const accounts = [
  { name: "Checking", balance: 5240.23 },
  { name: "Savings", balance: 12750.89 },
  { name: "Investment", balance: 7890.45 },
]

export function AccountOverview() {
  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0)

  return (
    <Card className="border border-white/10 bg-white/5 rounded-lg">
      <CardHeader className="p-3">
        <CardTitle className="text-base md:text-lg font-semibold tracking-tighter text-white">
          Account Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 pt-0">
        <div className="text-xl md:text-2xl font-semibold mb-4 text-white">${totalBalance.toFixed(2)}</div>
        <div className="space-y-2">
          {accounts.map((account) => (
            <div key={account.name} className="flex justify-between items-center">
              <span className="text-sm font-medium text-white/70">{account.name}</span>
              <span className="font-medium text-white">${account.balance.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
