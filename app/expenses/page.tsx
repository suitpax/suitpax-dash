import ExpenseTable from "@/components/ExpenseTable"
import AddExpenseModal from "@/components/AddExpenseModal"
import { fetchExpenses } from "@/lib/data"

export default async function ExpensesPage() {
  const expenses = await fetchExpenses()

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Expenses</h1>
      <AddExpenseModal />
      <ExpenseTable expenses={expenses} />
    </div>
  )
}
