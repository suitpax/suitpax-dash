import { cn } from "@/lib/utils"
import { Wallet, Building2, Users2, ArrowRight } from "lucide-react"

interface BudgetItem {
  id: string
  title: string
  description: string
  allocated: string
  spent: string
  remaining: string
  progress: number
  department: string
}

interface TravelBudgetsProps {
  budgets?: BudgetItem[]
  className?: string
}

const BUDGETS: BudgetItem[] = [
  {
    id: "1",
    title: "Presupuesto Q2 2024",
    description: "Viajes corporativos segundo trimestre",
    allocated: "$75,000",
    spent: "$45,320",
    remaining: "$29,680",
    progress: 60,
    department: "Global",
  },
  {
    id: "2",
    title: "Ventas Internacional",
    description: "Equipo de ventas internacionales",
    allocated: "$35,000",
    spent: "$28,450",
    remaining: "$6,550",
    progress: 81,
    department: "Ventas",
  },
  {
    id: "3",
    title: "Conferencias Tecnología",
    description: "Eventos y conferencias tecnológicas",
    allocated: "$25,000",
    spent: "$12,780",
    remaining: "$12,220",
    progress: 51,
    department: "Tecnología",
  },
  {
    id: "4",
    title: "Formación Ejecutiva",
    description: "Programas de formación para directivos",
    allocated: "$18,000",
    spent: "$4,250",
    remaining: "$13,750",
    progress: 24,
    department: "Recursos Humanos",
  },
]

export default function TravelBudgets({ budgets = BUDGETS, className }: TravelBudgetsProps) {
  return (
    <div className={cn("w-full", className)}>
      <div className="space-y-4">
        {budgets.map((budget) => (
          <div
            key={budget.id}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center">
                <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 mr-3">
                  <Wallet className="h-4 w-4 text-gray-900 dark:text-gray-100" />
                </div>
                <div>
                  <h3 className="font-medium text-sm text-gray-900 dark:text-gray-100">{budget.title}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{budget.description}</p>
                </div>
              </div>
              <div className="flex items-center text-xs font-medium">
                <div className="flex items-center px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700">
                  {budget.department === "Global" ? (
                    <Building2 className="h-3 w-3 mr-1 text-gray-600 dark:text-gray-300" />
                  ) : (
                    <Users2 className="h-3 w-3 mr-1 text-gray-600 dark:text-gray-300" />
                  )}
                  <span className="text-gray-700 dark:text-gray-300">{budget.department}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-3">
              <div className="text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400">Asignado</p>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{budget.allocated}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400">Gastado</p>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{budget.spent}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400">Restante</p>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{budget.remaining}</p>
              </div>
            </div>

            <div className="space-y-1.5 mb-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600 dark:text-gray-400">Progreso</span>
                <span className="text-gray-900 dark:text-gray-100">{budget.progress}%</span>
              </div>
              <div className="h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full",
                    budget.progress > 80 ? "bg-red-500" : budget.progress > 60 ? "bg-amber-500" : "bg-emerald-500",
                  )}
                  style={{ width: `${budget.progress}%` }}
                />
              </div>
            </div>

            <button className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200">
              Ver Detalles
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
