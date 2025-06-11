"use client"

import type React from "react"

import { useState } from "react"
import Layout from "@/components/ui/layout"
import { PlusCircle, Edit2, Trash2, DollarSign, Calendar, Tag, FileText, CreditCard } from "lucide-react"

interface Expense {
  id: string
  title: string
  amount: number
  date: string
  category: string
  description: string
  receipt?: string
  status: "pending" | "approved" | "rejected"
}

const CATEGORIES = [
  "Flights",
  "Hotels",
  "Transportation",
  "Meals",
  "Entertainment",
  "Office Supplies",
  "Conference",
  "Other",
]

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingExpenseId, setEditingExpenseId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Omit<Expense, "id">>({
    title: "",
    amount: 0,
    date: new Date().toISOString().split("T")[0],
    category: "Other",
    description: "",
    status: "pending",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "amount" ? Number.parseFloat(value) || 0 : value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingExpenseId) {
      // Actualizar gasto existente
      setExpenses((prev) =>
        prev.map((expense) => (expense.id === editingExpenseId ? { ...expense, ...formData } : expense)),
      )
      setEditingExpenseId(null)
    } else {
      // Crear nuevo gasto
      const newExpense: Expense = {
        id: Date.now().toString(),
        ...formData,
      }
      setExpenses((prev) => [...prev, newExpense])
    }

    // Resetear formulario
    setFormData({
      title: "",
      amount: 0,
      date: new Date().toISOString().split("T")[0],
      category: "Other",
      description: "",
      status: "pending",
    })
    setIsFormOpen(false)
  }

  const handleEdit = (expense: Expense) => {
    setFormData({
      title: expense.title,
      amount: expense.amount,
      date: expense.date,
      category: expense.category,
      description: expense.description,
      receipt: expense.receipt,
      status: expense.status,
    })
    setEditingExpenseId(expense.id)
    setIsFormOpen(true)
  }

  const handleDelete = (id: string) => {
    setExpenses((prev) => prev.filter((expense) => expense.id !== id))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
      case "rejected":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
      default:
        return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
    }
  }

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-medium tracking-tighter text-black">Expense Management</h1>
          <button
            onClick={() => {
              setIsFormOpen(true)
              setEditingExpenseId(null)
              setFormData({
                title: "",
                amount: 0,
                date: new Date().toISOString().split("T")[0],
                category: "Other",
                description: "",
                status: "pending",
              })
            }}
            className="px-3 py-1.5 rounded-xl bg-black text-white hover:bg-gray-800 flex items-center gap-2"
          >
            <PlusCircle size={14} />
            <span className="text-xs">New Expense</span>
          </button>
        </div>

        <div className="bg-white rounded-xl border border-black p-6 shadow-sm mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium tracking-tighter text-black">Connect Your Bank</h2>
            <button className="px-3 py-1.5 rounded-xl bg-black text-white hover:bg-gray-800 flex items-center gap-2">
              <PlusCircle size={14} />
              <span className="text-xs">Connect Bank</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border border-gray-200 rounded-lg p-4 flex items-center">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <CreditCard className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-sm font-medium">Chase Bank</h3>
                <p className="text-xs text-gray-500">Connect your Chase accounts</p>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4 flex items-center">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
                <CreditCard className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-sm font-medium">Bank of America</h3>
                <p className="text-xs text-gray-500">Connect your BoA accounts</p>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4 flex items-center">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                <CreditCard className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h3 className="text-sm font-medium">Wells Fargo</h3>
                <p className="text-xs text-gray-500">Connect your Wells Fargo accounts</p>
              </div>
            </div>
          </div>

          <p className="text-xs text-gray-500 mt-4">
            Connecting your bank account allows automatic expense tracking and categorization. Your financial data is
            encrypted and secure.
          </p>
        </div>

        {isFormOpen && (
          <div className="bg-white rounded-xl border border-black p-6 shadow-sm mb-6">
            <h2 className="text-lg font-medium tracking-tighter text-black mb-4">
              {editingExpenseId ? "Edit Expense" : "Create New Expense"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
                  placeholder="Expense title"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                    Amount
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <DollarSign className="h-4 w-4 text-gray-500" />
                    </div>
                    <input
                      type="number"
                      id="amount"
                      name="amount"
                      value={formData.amount}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                      required
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
                  />
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
                  >
                    {CATEGORIES.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
                  placeholder="Expense description"
                />
              </div>

              <div>
                <label htmlFor="receipt" className="block text-sm font-medium text-gray-700 mb-1">
                  Receipt (optional)
                </label>
                <input
                  type="file"
                  id="receipt"
                  name="receipt"
                  accept="image/*,.pdf"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
                />
                <p className="text-xs text-gray-500 mt-1">Upload a photo or PDF of your receipt</p>
              </div>

              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-3 py-1.5 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  <span className="text-xs">Cancel</span>
                </button>
                <button type="submit" className="px-3 py-1.5 rounded-xl bg-black text-white hover:bg-gray-800">
                  <span className="text-xs">{editingExpenseId ? "Update Expense" : "Create Expense"}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {expenses.length > 0 && (
          <div className="bg-white rounded-xl border border-black p-4 shadow-sm mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-gray-100 rounded-lg">
                <h3 className="text-sm font-medium text-gray-700 mb-1">Total Expenses</h3>
                <p className="text-2xl font-medium text-black">${totalExpenses.toFixed(2)}</p>
              </div>
              <div className="p-4 bg-gray-100 rounded-lg">
                <h3 className="text-sm font-medium text-gray-700 mb-1">Pending Approval</h3>
                <p className="text-2xl font-medium text-black">
                  $
                  {expenses
                    .filter((e) => e.status === "pending")
                    .reduce((sum, e) => sum + e.amount, 0)
                    .toFixed(2)}
                </p>
              </div>
              <div className="p-4 bg-gray-100 rounded-lg">
                <h3 className="text-sm font-medium text-gray-700 mb-1">Approved</h3>
                <p className="text-2xl font-medium text-black">
                  $
                  {expenses
                    .filter((e) => e.status === "approved")
                    .reduce((sum, e) => sum + e.amount, 0)
                    .toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        )}

        {expenses.length === 0 ? (
          <div className="bg-white rounded-xl border border-black p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-gray-100 rounded-full">
                <FileText className="h-8 w-8 text-gray-500" />
              </div>
            </div>
            <h2 className="text-xl font-medium tracking-tighter text-black mb-2">No expenses yet</h2>
            <p className="text-gray-700 mb-6 max-w-md mx-auto">
              Start tracking your business travel expenses by adding your first expense.
            </p>
            <button
              onClick={() => setIsFormOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-black text-white hover:bg-gray-800 inline-flex items-center gap-2"
            >
              <PlusCircle size={14} />
              <span className="text-xs">Add Your First Expense</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {expenses.map((expense) => (
              <div
                key={expense.id}
                className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:border-black transition-colors"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-gray-100 flex-shrink-0">
                      <DollarSign className="h-5 w-5 text-gray-700" />
                    </div>
                    <div>
                      <h3 className="font-medium text-black">{expense.title}</h3>
                      {expense.description && <p className="text-sm text-gray-600 mt-1">{expense.description}</p>}
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className="inline-flex items-center rounded-xl bg-gray-100 px-2.5 py-0.5 text-[10px] font-medium text-gray-700">
                          <Tag className="mr-1 h-3 w-3" />
                          {expense.category}
                        </span>
                        <span className="inline-flex items-center rounded-xl bg-gray-100 px-2.5 py-0.5 text-[10px] font-medium text-gray-700">
                          <Calendar className="mr-1 h-3 w-3" />
                          {new Date(expense.date).toLocaleDateString()}
                        </span>
                        <span
                          className={`inline-flex items-center rounded-xl px-2.5 py-0.5 text-[10px] font-medium ${getStatusColor(expense.status)}`}
                        >
                          {expense.status.charAt(0).toUpperCase() + expense.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between md:justify-end gap-4">
                    <div className="text-right">
                      <p className="text-lg font-medium text-black">${expense.amount.toFixed(2)}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(expense)}
                        className="p-1.5 text-gray-500 hover:text-black transition-colors"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(expense.id)}
                        className="p-1.5 text-gray-500 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}
