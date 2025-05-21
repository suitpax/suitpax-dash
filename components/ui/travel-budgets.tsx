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
            className="bg-black/30 border border-white/10 rounded-lg p-4 hover:bg-white/5 transition-all duration-200"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center">
                <div className="p-2 rounded-lg bg-white/5 mr-3">
                  <Wallet className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h3 className="font-medium text-sm text-white">{budget.title}</h3>
                  <p className="text-xs text-white/70 mt-0.5">{budget.description}</p>
                </div>
              </div>
              <div className="flex items-center text-xs font-medium">
                <div className="flex items-center px-2 py-1 rounded-full bg-white/10">
                  {budget.department === "Global" ? (
                    <Building2 className="h-3 w-3 mr-1 text-white/70" />
                  ) : (
                    <Users2 className="h-3 w-3 mr-1 text-white/70" />
                  )}
                  <span className="text-white/70">{budget.department}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-3">
              <div className="text-center">
                <p className="text-xs text-white/50">Asignado</p>
                <p className="text-sm font-medium text-white">{budget.allocated}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-white/50">Gastado</p>
                <p className="text-sm font-medium text-white">{budget.spent}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-white/50">Restante</p>
                <p className="text-sm font-medium text-white">{budget.remaining}</p>
              </div>
            </div>

            <div className="space-y-1.5 mb-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-white/70">Progreso</span>
                <span className="text-white">{budget.progress}%</span>
              </div>
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full",
                    budget.progress > 80 ? "bg-red-500" : budget.progress > 60 ? "bg-amber-500" : "bg-emerald-500",
                  )}
                  style={{ width: `${budget.progress}%` }}
                />
              </div>
            </div>

            <button className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-medium text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors duration-200">
              Ver Detalles
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
