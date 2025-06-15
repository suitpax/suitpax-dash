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
import { Upload, Receipt, Calendar, DollarSign, Filter, Download, Eye, Edit, Trash2 } from "lucide-react"

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
  const [expenses, setExpenses] = useState<Expense[]>([])

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
        return <Badge className="bg-green-500/20 text-green-600 border-green-500/30">Approved</Badge>
      case "pending":
        return <Badge className="bg-yellow-500/20 text-yellow-600 border-yellow-500/30">Pending</Badge>
      case "rejected":
        return <Badge className="bg-red-500/20 text-red-600 border-red-500/30">Rejected</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-3">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-medium tracking-tighter">Expense Management</h1>
            <p className="text-muted-foreground text-sm">Upload receipts and manage your business expenses</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="secondary">{uploadedFiles.length} files uploaded</Badge>
            <Badge variant="secondary">{expenses.length} expenses</Badge>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-muted">
            <TabsTrigger value="upload">Upload Receipts</TabsTrigger>
            <TabsTrigger value="expenses">My Expenses</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          {/* Upload Tab */}
          <TabsContent value="upload" className="space-y-6">
            {/* Upload Area */}
            <Card>
              <CardHeader>
                <CardTitle>Upload Receipts & Invoices</CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
                    dragActive
                      ? "border-primary bg-primary/10 scale-[1.02]"
                      : "border-muted-foreground/25 bg-muted/50 hover:border-muted-foreground/50"
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <Upload
                    className={`h-12 w-12 mx-auto mb-4 ${dragActive ? "text-primary" : "text-muted-foreground"}`}
                  />
                  <h3 className="font-medium mb-2">
                    {dragActive ? "Drop files here" : "Drag and drop your files here"}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">or click to browse your computer</p>
                  <p className="text-xs text-muted-foreground mb-4">Supports JPG, PNG, PDF up to 10MB each</p>
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
                  <Button variant="outline" onClick={() => document.getElementById("file-upload")?.click()}>
                    Choose Files
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Expense Form */}
            <Card>
              <CardHeader>
                <CardTitle>Expense Details</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitExpense} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="amount">Amount</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="amount"
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          value={formData.amount}
                          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="date">Date</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="date"
                          type="date"
                          value={formData.date}
                          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) => setFormData({ ...formData, category: value })}
                      >
                        <SelectTrigger>
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
                      <Label htmlFor="merchant">Merchant</Label>
                      <Input
                        id="merchant"
                        placeholder="Store or vendor name"
                        value={formData.merchant}
                        onChange={(e) => setFormData({ ...formData, merchant: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      placeholder="Business lunch, taxi fare, hotel..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      required
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button type="submit">
                      <Receipt className="h-4 w-4 mr-2" />
                      Submit Expense
                    </Button>
                    <Button type="button" variant="outline">
                      Save Draft
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Expenses Tab */}
          <TabsContent value="expenses" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>My Expenses</CardTitle>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {expenses.length === 0 ? (
                  <div className="text-center py-8">
                    <Receipt className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="font-medium mb-2">No expenses yet</h3>
                    <p className="text-sm text-muted-foreground">Start by uploading your first receipt</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {expenses.map((expense) => (
                      <div key={expense.id} className="flex items-center justify-between p-4 bg-muted rounded-xl">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-xl bg-background flex items-center justify-center">
                            <Receipt className="h-6 w-6 text-muted-foreground" />
                          </div>
                          <div>
                            <h3 className="font-medium">{expense.description}</h3>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
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
                            <p className="font-medium">{formatCurrency(expense.amount, expense.currency)}</p>
                            {getStatusBadge(expense.status)}
                          </div>
                          <div className="flex items-center gap-1">
                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Expense Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-muted rounded-xl p-4">
                    <h3 className="font-medium mb-2">Total Expenses</h3>
                    <p className="text-2xl font-bold">
                      {formatCurrency(expenses.reduce((sum, exp) => sum + exp.amount, 0))}
                    </p>
                    <p className="text-sm text-muted-foreground">This month</p>
                  </div>
                  <div className="bg-muted rounded-xl p-4">
                    <h3 className="font-medium mb-2">Pending Approval</h3>
                    <p className="text-2xl font-bold text-yellow-600">
                      {formatCurrency(
                        expenses.filter((exp) => exp.status === "pending").reduce((sum, exp) => sum + exp.amount, 0),
                      )}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {expenses.filter((exp) => exp.status === "pending").length} expenses
                    </p>
                  </div>
                  <div className="bg-muted rounded-xl p-4">
                    <h3 className="font-medium mb-2">Approved</h3>
                    <p className="text-2xl font-bold text-green-600">
                      {formatCurrency(
                        expenses.filter((exp) => exp.status === "approved").reduce((sum, exp) => sum + exp.amount, 0),
                      )}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {expenses.filter((exp) => exp.status === "approved").length} expenses
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
