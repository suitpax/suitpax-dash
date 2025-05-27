"use client"

import type React from "react"

import { useState } from "react"
import Layout from "@/components/ui/layout"
import { SiRevolut } from "react-icons/si"
import {
  PlusCircle,
  Edit2,
  Trash2,
  DollarSign,
  Calendar,
  Tag,
  FileText,
  CreditCard,
  Building,
  X,
  Check,
  ChevronRight,
  Lock,
  Shield,
} from "lucide-react"

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
  const [showConnectBank, setShowConnectBank] = useState(false)
  const [connectingBank, setConnectingBank] = useState(false)
  const [bankConnected, setBankConnected] = useState(false)
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
        return "bg-white/10 text-white"
      case "rejected":
        return "bg-white/10 text-white/50"
      default:
        return "bg-white/10 text-white/70"
    }
  }

  const handleConnectBank = () => {
    setShowConnectBank(true)
  }

  const startConnecting = () => {
    setConnectingBank(true)
    setTimeout(() => {
      setConnectingBank(false)
      setBankConnected(true)
    }, 2000)
  }

  const closeConnectBank = () => {
    setShowConnectBank(false)
    setBankConnected(false)
  }

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        {/* Header específico de Expenses */}
        <div className="bg-black/30 backdrop-blur-sm rounded-xl border border-white/10 p-4 sm:p-6 shadow-sm mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-medium tracking-tighter text-white">Expense Management</h1>
              <p className="text-sm text-white/70 mt-1">Track and manage your business travel expenses</p>
            </div>
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
              className="px-3 py-1.5 rounded-lg bg-white/10 text-white hover:bg-white/5 flex items-center gap-2 whitespace-nowrap"
            >
              <PlusCircle size={14} />
              <span className="text-xs">New Expense</span>
            </button>
          </div>
        </div>

        <div className="bg-black rounded-lg border border-white/10 p-6 shadow-sm mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium tracking-tighter text-white">Connect Your Bank</h2>
            <button
              onClick={handleConnectBank}
              className="px-3 py-1.5 rounded-lg bg-white/10 text-white hover:bg-white/5 flex items-center gap-2"
            >
              <PlusCircle size={14} />
              <span className="text-xs">Connect Bank</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border border-white/10 rounded-lg p-4 flex items-center bg-black/30">
              <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center mr-3">
                <CreditCard className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-white">Chase Bank</h3>
                <p className="text-xs text-white/50">Connect your Chase accounts</p>
              </div>
            </div>

            <div className="border border-white/10 rounded-lg p-4 flex items-center bg-black/30">
              <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center mr-3">
                <Building className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-white">Bank of America</h3>
                <p className="text-xs text-white/50">Connect your BoA accounts</p>
              </div>
            </div>

            <div className="border border-white/10 rounded-lg p-4 flex items-center bg-black/30">
              <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center mr-3">
                <Building className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-white">Wells Fargo</h3>
                <p className="text-xs text-white/50">Connect your Wells Fargo accounts</p>
              </div>
            </div>
          </div>

          <p className="text-xs text-white/50 mt-4">
            Connecting your bank account allows automatic expense tracking and categorization. Your financial data is
            encrypted and secure.
          </p>
        </div>

        {isFormOpen && (
          <div className="bg-black rounded-lg border border-white/10 p-6 shadow-sm mb-6">
            <h2 className="text-lg font-medium tracking-tighter text-white mb-4">
              {editingExpenseId ? "Edit Expense" : "Create New Expense"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-white/70 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20 bg-white/5 text-white"
                  placeholder="Expense title"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="amount" className="block text-sm font-medium text-white/70 mb-1">
                    Amount
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <DollarSign className="h-4 w-4 text-white/50" />
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
                      className="w-full pl-10 pr-3 py-2 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20 bg-white/5 text-white"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-white/70 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20 bg-white/5 text-white"
                  />
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-white/70 mb-1">
                    Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20 bg-white/5 text-white"
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
                <label htmlFor="description" className="block text-sm font-medium text-white/70 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20 bg-white/5 text-white"
                  placeholder="Expense description"
                />
              </div>

              <div>
                <label htmlFor="receipt" className="block text-sm font-medium text-white/70 mb-1">
                  Receipt (optional)
                </label>
                <input
                  type="file"
                  id="receipt"
                  name="receipt"
                  accept="image/*,.pdf"
                  className="w-full px-3 py-2 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20 bg-white/5 text-white"
                />
                <p className="text-xs text-white/50 mt-1">Upload a photo or PDF of your receipt</p>
              </div>

              <div>
                <label htmlFor="status" className="block text-sm font-medium text-white/70 mb-1">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20 bg-white/5 text-white"
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
                  className="px-3 py-1.5 rounded-lg border border-white/10 text-white/70 hover:bg-white/5"
                >
                  <span className="text-xs">Cancel</span>
                </button>
                <button type="submit" className="px-3 py-1.5 rounded-lg bg-white/10 text-white hover:bg-white/5">
                  <span className="text-xs">{editingExpenseId ? "Update Expense" : "Create Expense"}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {expenses.length > 0 && (
          <div className="bg-black rounded-lg border border-white/10 p-4 shadow-sm mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-black/30 rounded-lg border border-white/10">
                <h3 className="text-sm font-medium text-white/70 mb-1">Total Expenses</h3>
                <p className="text-2xl font-medium text-white">${totalExpenses.toFixed(2)}</p>
              </div>
              <div className="p-4 bg-black/30 rounded-lg border border-white/10">
                <h3 className="text-sm font-medium text-white/70 mb-1">Pending Approval</h3>
                <p className="text-2xl font-medium text-white">
                  $
                  {expenses
                    .filter((e) => e.status === "pending")
                    .reduce((sum, e) => sum + e.amount, 0)
                    .toFixed(2)}
                </p>
              </div>
              <div className="p-4 bg-black/30 rounded-lg border border-white/10">
                <h3 className="text-sm font-medium text-white/70 mb-1">Approved</h3>
                <p className="text-2xl font-medium text-white">
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
          <div className="bg-black rounded-lg border border-white/10 p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-white/5 rounded-full">
                <FileText className="h-8 w-8 text-white/70" />
              </div>
            </div>
            <h2 className="text-xl font-medium tracking-tighter text-white mb-2">No expenses yet</h2>
            <p className="text-white/70 mb-6 max-w-md mx-auto">
              Start tracking your business travel expenses by adding your first expense.
            </p>
            <button
              onClick={() => setIsFormOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-white/10 text-white hover:bg-white/5 inline-flex items-center gap-2"
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
                className="bg-black rounded-lg border border-white/10 p-4 shadow-sm hover:border-white/20 transition-colors"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-white/5 flex-shrink-0">
                      <DollarSign className="h-5 w-5 text-white/70" />
                    </div>
                    <div>
                      <h3 className="font-medium text-white">{expense.title}</h3>
                      {expense.description && <p className="text-sm text-white/70 mt-1">{expense.description}</p>}
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className="inline-flex items-center rounded-lg bg-white/5 px-2.5 py-0.5 text-[10px] font-medium text-white/70">
                          <Tag className="mr-1 h-3 w-3" />
                          {expense.category}
                        </span>
                        <span className="inline-flex items-center rounded-lg bg-white/5 px-2.5 py-0.5 text-[10px] font-medium text-white/70">
                          <Calendar className="mr-1 h-3 w-3" />
                          {new Date(expense.date).toLocaleDateString()}
                        </span>
                        <span
                          className={`inline-flex items-center rounded-lg px-2.5 py-0.5 text-[10px] font-medium ${getStatusColor(expense.status)}`}
                        >
                          {expense.status.charAt(0).toUpperCase() + expense.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between md:justify-end gap-4">
                    <div className="text-right">
                      <p className="text-lg font-medium text-white">${expense.amount.toFixed(2)}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(expense)}
                        className="p-1.5 text-white/50 hover:text-white transition-colors"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(expense.id)}
                        className="p-1.5 text-white/50 hover:text-white/70 transition-colors"
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

      {/* Modal para conectar con Revolut */}
      {showConnectBank && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-black border border-white/10 rounded-lg max-w-md w-full p-6 relative">
            <button onClick={closeConnectBank} className="absolute top-4 right-4 text-white/50 hover:text-white">
              <X size={20} />
            </button>

            <div className="text-center mb-6">
              {!bankConnected ? (
                <>
                  <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                    <SiRevolut className="h-8 w-8 text-white" />
                  </div>
                  <h2 className="text-xl font-medium text-white mb-2">Connect with Revolut</h2>
                  <p className="text-white/70 text-sm">
                    Link your Revolut business account to automatically import and categorize your expenses.
                  </p>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="h-8 w-8 text-white" />
                  </div>
                  <h2 className="text-xl font-medium text-white mb-2">Successfully Connected!</h2>
                  <p className="text-white/70 text-sm">
                    Your Revolut account has been successfully connected to SuitPax.
                  </p>
                </>
              )}
            </div>

            {!bankConnected ? (
              <>
                <div className="space-y-4 mb-6">
                  <div className="flex items-center p-3 border border-white/10 rounded-lg bg-white/5">
                    <div className="mr-3">
                      <Lock className="h-5 w-5 text-white/70" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-white">Secure Connection</h3>
                      <p className="text-xs text-white/50">Your banking credentials are never stored on our servers</p>
                    </div>
                  </div>

                  <div className="flex items-center p-3 border border-white/10 rounded-lg bg-white/5">
                    <div className="mr-3">
                      <Shield className="h-5 w-5 text-white/70" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-white">Read-Only Access</h3>
                      <p className="text-xs text-white/50">We can only view your transactions, not move your money</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={startConnecting}
                    disabled={connectingBank}
                    className="w-full py-2 px-4 bg-white/10 hover:bg-white/5 text-white rounded-lg flex items-center justify-center gap-2"
                  >
                    {connectingBank ? (
                      <>
                        <div className="animate-spin h-4 w-4 border-2 border-white/70 border-t-transparent rounded-full"></div>
                        <span>Connecting...</span>
                      </>
                    ) : (
                      <>
                        <SiRevolut className="h-4 w-4" />
                        <span>Connect with Revolut</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={closeConnectBank}
                    className="w-full py-2 px-4 border border-white/10 text-white/70 hover:text-white hover:bg-white/5 rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <div className="border border-white/10 rounded-lg p-4 bg-white/5">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-medium text-white">Revolut Business</h3>
                    <span className="text-xs bg-white/10 text-white px-2 py-0.5 rounded-full">Connected</span>
                  </div>
                  <p className="text-xs text-white/50 mb-2">Last synced: Just now</p>
                  <div className="flex items-center text-xs text-white/70">
                    <Check className="h-3 w-3 mr-1 text-white" />
                    <span>3 accounts imported</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <button className="w-full py-2 px-4 bg-white/10 hover:bg-white/5 text-white rounded-lg flex items-center justify-center gap-2">
                    <span>View Connected Accounts</span>
                    <ChevronRight size={16} />
                  </button>

                  <button
                    onClick={closeConnectBank}
                    className="w-full py-2 px-4 border border-white/10 text-white/70 hover:text-white hover:bg-white/5 rounded-lg"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </Layout>
  )
}
