import type React from "react"
import { BuildingOfficeIcon, Car, PaperAirplaneIcon, ArrowRightIcon } from "@heroicons/react/24/outline"
import Link from "next/link"

export default function TravelBudgets() {
  return (
    <div className="bg-black/95 backdrop-blur-sm rounded-lg border border-white/10 p-3">
      <h2 className="text-sm font-medium text-white mb-3">Travel Budgets</h2>
      <div className="space-y-2">
        <BudgetItem
          category="Flights"
          budget="$5,000"
          spent="$3,250"
          percentage={65}
          icon={<PaperAirplaneIcon className="h-3 w-3" />}
        />
        <BudgetItem
          category="Hotels"
          budget="$7,500"
          spent="$6,800"
          percentage={91}
          icon={<BuildingOfficeIcon className="h-3 w-3" />}
        />
        <BudgetItem
          category="Transfers"
          budget="$1,000"
          spent="$750"
          percentage={75}
          icon={<Car className="h-3 w-3" />}
        />
      </div>
      <Link
        href="/expenses"
        className="text-xs font-medium flex items-center justify-center gap-1 w-full px-2 py-1.5 bg-transparent border border-white/10 rounded-lg hover:bg-white/5 transition-colors text-white mt-3"
      >
        View All Budgets
        <ArrowRightIcon className="h-3 w-3" />
      </Link>
    </div>
  )
}

interface BudgetItemProps {
  category: string
  budget: string
  spent: string
  percentage: number
  icon: React.ReactNode
}

function BudgetItem({ category, budget, spent, percentage, icon }: BudgetItemProps) {
  return (
    <div className="flex items-center justify-between p-2 border border-white/10 bg-white/5 rounded-lg">
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 bg-white/10 text-white rounded-full flex items-center justify-center font-medium text-xs">
          {icon}
        </div>
        <div className="text-left">
          <h3 className="text-xs font-medium text-white">{category}</h3>
          <p className="text-white/70 text-[0.6rem]">
            {spent} / {budget}
          </p>
        </div>
      </div>
      <div className="w-16 h-2 bg-white/10 rounded-full overflow-hidden relative">
        <div className="absolute left-0 top-0 h-full bg-emerald-500" style={{ width: `${percentage}%` }}></div>
      </div>
    </div>
  )
}
