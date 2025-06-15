"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Upload,
  Receipt,
  Calendar,
  DollarSign,
  FileText,
  X,
  Check,
  Clock,
  AlertCircle,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
} from "lucide-react"

interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  status: "uploading" | "completed" | "error"
  url?: string
}

interface Expense {
  id: string
  amount: number
  description: string
  category: string
  date: string
  status: "pending" | "approved" | "rejected"
  receipt?: string
  merchant: string
  currency: string
}

export default function Expenses() {
  const [activeTab, setActiveTab] = useState("upload")
  const [dragActive, setDragActive] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [expenses, setExpenses] = useState<Expense[]>([
    {
      id: "exp1",
      amount: 450.75,
      description: "Hotel Marriott - Business Trip",
      category: "Accommodation",
      date: "2024-04-28",
      status: "approved",
      merchant: "Marriott Hotels",
      currency: "USD",
    },
    {
      id: "exp2",
      amount: 65.2,
      description: "Uber - Airport Transfer",
      category: "Transportation",
      date: "2024-04-27",
      status: "pending",
      merchant: "Uber",
      currency: "USD",
    },
    {
      id: "exp3",
      amount: 120.5,
      description: "Client Dinner - Morton's Steakhouse",
      category: "Meals",
      date: "2024-04-26",
      status: "approved",
      merchant: "Morton's Steakhouse",
      currency: "USD",
    },
  ])

  // Form state
  const [formData, setFormData] = useState({
    amount: "",
    description: "",
    category: "meals",
    date: new Date().toISOString().split("T")[0],
    merchant: "",
    currency: "USD",
  })

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(Array.from(e.dataTransfer.files))
    }
  }

  const handleFiles = (files: File[]) => {
    files.forEach((file) => {
      const newFile: UploadedFile = {
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: file.size,
        type: file.type,
        status: "uploading",
      }

      setUploadedFiles((prev) => [...prev, newFile])

      // Simulate upload
      setTimeout(() => {
        setUploadedFiles((prev) =>
          prev.map((f) => (f.id === newFile.id ? { ...f, status: "completed", url: URL.createObjectURL(file) } : f)),
        )
      }, 2000)
    })
  }

  const removeFile = (id: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== id))
  }

  const handleSubmitExpense = (e: React.FormEvent) => {
    e.preventDefault()

    const newExpense: Expense = {
      id: `exp${expenses.length + 1}`,
      amount: Number.parseFloat(formData.amount),
      description: formData.description,
      category: formData.category,
      date: formData.date,
      status: "pending",
      merchant: formData.merchant,
      currency: formData.currency,
    }

    setExpenses([newExpense, ...expenses])

    // Reset form
    setFormData({
      amount: "",
      description: "",
      category: "meals",
      date: new Date().toISOString().split("T")[0],
      merchant: "",
      currency: "USD",
    })

    // Switch to expenses tab
    setActiveTab("expenses")
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const formatCurrency = (amount: number, currency = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-500/20 text-green-300 border-green-500/30">Approved</Badge>
      case "pending":
        return <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">Pending</Badge>
      case "rejected":
        return <Badge className="bg-red-500/20 text-red-300 border-red-500/30">Rejected</Badge>
      default:
        return <Badge className="bg-white/10 text-white/70 border-white/20">Unknown</Badge>
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-medium tracking-tighter text-white">Expense Management</h1>
          <p className="text-white/70 text-sm">Upload receipts and manage your business expenses</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-white/10 text-white/70 border-white/20">{uploadedFiles.length} files uploaded</Badge>
          <Badge className="bg-white/10 text-white/70 border-white/20">{expenses.length} expenses</Badge>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-white/5 border border-white/10">
          <TabsTrigger value="upload" className="text-white/70 data-[state=active]:text-white">
            Upload Receipts
          </TabsTrigger>
          <TabsTrigger value="expenses" className="text-white/70 data-[state=active]:text-white">
            My Expenses
          </TabsTrigger>
          <TabsTrigger value="reports" className="text-white/70 data-[state=active]:text-white">
            Reports
          </TabsTrigger>
        </TabsList>

        {/* Upload Tab */}
        <TabsContent value="upload" className="space-y-6">
          {/* Upload Area */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white font-medium tracking-tighter">Upload Receipts & Invoices</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
                  dragActive
                    ? "border-white/40 bg-white/10 scale-[1.02]"
                    : "border-white/20 bg-white/5 hover:border-white/30 hover:bg-white/8"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <Upload
                  className={`h-12 w-12 mx-auto mb-4 transition-colors ${dragActive ? "text-white" : "text-white/50"}`}
                />
                <h3 className="font-medium text-white mb-2">
                  {dragActive ? "Drop files here" : "Drag and drop your files here"}
                </h3>
                <p className="text-sm text-white/70 mb-4">or click to browse your computer</p>
                <p className="text-xs text-white/50 mb-4">Supports JPG, PNG, PDF up to 10MB each</p>
                <Input
                  type="file"
                  multiple
                  accept=".jpg,.jpeg,.png,.pdf"
                  className="hidden"
                  id="file-upload"
                  onChange={(e) => {
                    if (e.target.files) {
                      handleFiles(Array.from(e.target.files))
                    }
                  }}
                />
                <Button
                  variant="outline"
                  className="bg-transparent border-white/20 text-white/70 hover:bg-white/10 hover:text-white"
                  onClick={() => document.getElementById("file-upload")?.click()}
                >
                  Choose Files
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Uploaded Files */}
          {uploadedFiles.length > 0 && (
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white font-medium tracking-tighter">Uploaded Files</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {uploadedFiles.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10"
                    >
                      <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center">
                        <FileText className="h-5 w-5 text-white/70" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{file.name}</p>
                        <p className="text-xs text-white/50">{formatFileSize(file.size)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {file.status === "uploading" && (
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-white/50 animate-spin" />
                            <span className="text-xs text-white/50">Uploading...</span>
                          </div>
                        )}
                        {file.status === "completed" && (
                          <div className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-green-500" />
                            <span className="text-xs text-green-500">Completed</span>
                            {file.url && (
                              <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                <Eye className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        )}
                        {file.status === "error" && (
                          <div className="flex items-center gap-2">
                            <AlertCircle className="h-4 w-4 text-red-500" />
                            <span className="text-xs text-red-500">Error</span>
                          </div>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 text-white/50 hover:text-white hover:bg-white/10"
                          onClick={() => removeFile(file.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Expense Form */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white font-medium tracking-tighter">Expense Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitExpense} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount" className="text-white/70">
                      Amount
                    </Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
                      <Input
                        id="amount"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={formData.amount}
                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                        className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/30"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date" className="text-white/70">
                      Date
                    </Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
                      <Input
                        id="date"
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="pl-10 bg-white/5 border-white/10 text-white"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-white/70">
                      Category
                    </Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData({ ...formData, category: value })}
                    >
                      <SelectTrigger className="bg-white/5 border-white/10 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="meals">Meals & Entertainment</SelectItem>
                        <SelectItem value="transportation">Transportation</SelectItem>
                        <SelectItem value="accommodation">Accommodation</SelectItem>
                        <SelectItem value="office">Office Supplies</SelectItem>
                        <SelectItem value="software">Software & Subscriptions</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="merchant" className="text-white/70">
                      Merchant
                    </Label>
                    <Input
                      id="merchant"
                      placeholder="Store or vendor name"
                      value={formData.merchant}
                      onChange={(e) => setFormData({ ...formData, merchant: e.target.value })}
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-white/70">
                    Description
                  </Label>
                  <Input
                    id="description"
                    placeholder="Business lunch, taxi fare, hotel..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                    required
                  />
                </div>

                <div className="flex gap-3">
                  <Button type="submit" className="bg-white text-black hover:bg-white/90">
                    <Receipt className="h-4 w-4 mr-2" />
                    Submit Expense
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="bg-transparent border-white/20 text-white/70 hover:bg-white/10"
                  >
                    Save Draft
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Expenses Tab */}
        <TabsContent value="expenses" className="space-y-6">
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white font-medium tracking-tighter">My Expenses</CardTitle>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-transparent border-white/20 text-white/70 hover:bg-white/10"
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-transparent border-white/20 text-white/70 hover:bg-white/10"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {expenses.map((expense) => (
                  <div
                    key={expense.id}
                    className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-xl bg-white/10 flex items-center justify-center">
                        <Receipt className="h-6 w-6 text-white/70" />
                      </div>
                      <div>
                        <h3 className="font-medium text-white">{expense.description}</h3>
                        <div className="flex items-center gap-2 text-sm text-white/70">
                          <span>{expense.merchant}</span>
                          <span>•</span>
                          <span>{expense.date}</span>
                          <span>•</span>
                          <span className="capitalize">{expense.category}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-medium text-white">{formatCurrency(expense.amount, expense.currency)}</p>
                        {getStatusBadge(expense.status)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-white/50 hover:text-white">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-white/50 hover:text-white">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-white/50 hover:text-red-400">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports" className="space-y-6">
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white font-medium tracking-tighter">Expense Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <h3 className="text-white font-medium mb-2">Total Expenses</h3>
                  <p className="text-2xl font-bold text-white">
                    {formatCurrency(expenses.reduce((sum, exp) => sum + exp.amount, 0))}
                  </p>
                  <p className="text-sm text-white/70">This month</p>
                </div>
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <h3 className="text-white font-medium mb-2">Pending Approval</h3>
                  <p className="text-2xl font-bold text-yellow-400">
                    {formatCurrency(
                      expenses.filter((exp) => exp.status === "pending").reduce((sum, exp) => sum + exp.amount, 0),
                    )}
                  </p>
                  <p className="text-sm text-white/70">
                    {expenses.filter((exp) => exp.status === "pending").length} expenses
                  </p>
                </div>
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <h3 className="text-white font-medium mb-2">Approved</h3>
                  <p className="text-2xl font-bold text-green-400">
                    {formatCurrency(
                      expenses.filter((exp) => exp.status === "approved").reduce((sum, exp) => sum + exp.amount, 0),
                    )}
                  </p>
                  <p className="text-sm text-white/70">
                    {expenses.filter((exp) => exp.status === "approved").length} expenses
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
