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
  CloudArrowUpIcon,
  ReceiptRefundIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  XMarkIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  FunnelIcon,
  ArrowDownTrayIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  CameraIcon,
  MicrophoneIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline"

interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  status: "uploading" | "completed" | "error"
  url?: string
  extractedData?: {
    amount?: number
    merchant?: string
    date?: string
    category?: string
  }
}

interface Expense {
  id: string
  amount: number
  description: string
  category: string
  date: string
  status: "pending" | "approved" | "rejected" | "draft"
  receipt?: string
  merchant: string
  currency: string
  tags?: string[]
  notes?: string
  project?: string
}

export default function ExpensesPage() {
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
      tags: ["business", "client-meeting"],
      project: "Q1 Sales Campaign",
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
      tags: ["transport"],
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
      tags: ["client", "dinner"],
      project: "Client Relations",
    },
  ])

  // Enhanced form state
  const [formData, setFormData] = useState({
    amount: "",
    description: "",
    category: "meals",
    date: new Date().toISOString().split("T")[0],
    merchant: "",
    currency: "USD",
    tags: "",
    notes: "",
    project: "",
  })

  const [filters, setFilters] = useState({
    status: "all",
    category: "all",
    dateRange: "all",
    amountRange: "all",
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

      // Simulate AI extraction and upload
      setTimeout(() => {
        const mockExtractedData = {
          amount: Math.floor(Math.random() * 500) + 10,
          merchant: ["Starbucks", "Uber", "Marriott", "Delta Airlines"][Math.floor(Math.random() * 4)],
          date: new Date().toISOString().split("T")[0],
          category: ["meals", "transportation", "accommodation", "office"][Math.floor(Math.random() * 4)],
        }

        setUploadedFiles((prev) =>
          prev.map((f) =>
            f.id === newFile.id
              ? {
                  ...f,
                  status: "completed",
                  url: URL.createObjectURL(file),
                  extractedData: mockExtractedData,
                }
              : f,
          ),
        )

        // Auto-fill form with extracted data
        setFormData((prev) => ({
          ...prev,
          amount: mockExtractedData.amount.toString(),
          merchant: mockExtractedData.merchant,
          date: mockExtractedData.date,
          category: mockExtractedData.category,
          description: `${mockExtractedData.merchant} - Auto-extracted`,
        }))
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
      tags: formData.tags ? formData.tags.split(",").map((tag) => tag.trim()) : [],
      notes: formData.notes,
      project: formData.project,
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
      tags: "",
      notes: "",
      project: "",
    })

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
      case "draft":
        return <Badge className="bg-gray-500/20 text-gray-300 border-gray-500/30">Draft</Badge>
      default:
        return <Badge className="bg-white/10 text-white/70 border-white/20">Unknown</Badge>
    }
  }

  const filteredExpenses = expenses.filter((expense) => {
    if (filters.status !== "all" && expense.status !== filters.status) return false
    if (filters.category !== "all" && expense.category !== filters.category) return false
    return true
  })

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0)
  const pendingExpenses = expenses.filter((exp) => exp.status === "pending")
  const approvedExpenses = expenses.filter((exp) => exp.status === "approved")

  return (
    <div className="min-h-screen bg-black p-3 text-white">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Header */}
        <div className="bg-white/5 border border-white/10 rounded-lg p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-medium tracking-tight text-white">Expense Management</h1>
              <p className="text-white/70 text-sm">Upload receipts and manage your business expenses</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="bg-white/10 text-white/70 border-white/20">{uploadedFiles.length} files uploaded</Badge>
              <Badge className="bg-white/10 text-white/70 border-white/20">{expenses.length} expenses</Badge>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white/5 border border-white/10 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm">Total Expenses</p>
                <p className="text-2xl font-medium text-white">{formatCurrency(totalExpenses)}</p>
              </div>
              <CurrencyDollarIcon className="h-8 w-8 text-blue-400" />
            </div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm">Pending Approval</p>
                <p className="text-2xl font-medium text-yellow-400">
                  {formatCurrency(pendingExpenses.reduce((sum, exp) => sum + exp.amount, 0))}
                </p>
              </div>
              <ClockIcon className="h-8 w-8 text-yellow-400" />
            </div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm">Approved</p>
                <p className="text-2xl font-medium text-green-400">
                  {formatCurrency(approvedExpenses.reduce((sum, exp) => sum + exp.amount, 0))}
                </p>
              </div>
              <CheckCircleIcon className="h-8 w-8 text-green-400" />
            </div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm">This Month</p>
                <p className="text-2xl font-medium text-white">
                  {expenses.filter((exp) => new Date(exp.date).getMonth() === new Date().getMonth()).length}
                </p>
              </div>
              <CalendarIcon className="h-8 w-8 text-purple-400" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-white/5 border border-white/10">
            <TabsTrigger value="upload" className="text-white/70 data-[state=active]:text-white">
              Smart Upload
            </TabsTrigger>
            <TabsTrigger value="expenses" className="text-white/70 data-[state=active]:text-white">
              My Expenses
            </TabsTrigger>
            <TabsTrigger value="analytics" className="text-white/70 data-[state=active]:text-white">
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Smart Upload Tab */}
          <TabsContent value="upload" className="space-y-4">
            {/* Enhanced Upload Area */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white font-medium tracking-tight flex items-center gap-2">
                  <CloudArrowUpIcon className="h-5 w-5" />
                  Smart Receipt Upload
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
                    dragActive
                      ? "border-white/40 bg-white/10 scale-[1.02]"
                      : "border-white/20 bg-white/5 hover:border-white/30 hover:bg-white/8"
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <CloudArrowUpIcon
                    className={`h-12 w-12 mx-auto mb-4 transition-colors ${
                      dragActive ? "text-white" : "text-white/50"
                    }`}
                  />
                  <h3 className="font-medium text-white mb-2">
                    {dragActive ? "Drop files here" : "Drag and drop your receipts here"}
                  </h3>
                  <p className="text-sm text-white/70 mb-4">or click to browse your computer</p>
                  <p className="text-xs text-white/50 mb-4">
                    AI will automatically extract data from JPG, PNG, PDF up to 10MB each
                  </p>
                  <div className="flex gap-2 justify-center">
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
                      <DocumentTextIcon className="h-4 w-4 mr-2" />
                      Choose Files
                    </Button>
                    <Button
                      variant="outline"
                      className="bg-transparent border-white/20 text-white/70 hover:bg-white/10 hover:text-white"
                    >
                      <CameraIcon className="h-4 w-4 mr-2" />
                      Take Photo
                    </Button>
                    <Button
                      variant="outline"
                      className="bg-transparent border-white/20 text-white/70 hover:bg-white/10 hover:text-white"
                    >
                      <MicrophoneIcon className="h-4 w-4 mr-2" />
                      Voice Note
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Uploaded Files with AI Extraction */}
            {uploadedFiles.length > 0 && (
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white font-medium tracking-tight">
                    Uploaded Files & AI Extraction
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {uploadedFiles.map((file) => (
                      <div
                        key={file.id}
                        className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10"
                      >
                        <div className="h-10 w-10 rounded-lg bg-white/10 flex items-center justify-center">
                          <DocumentTextIcon className="h-5 w-5 text-white/70" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white truncate">{file.name}</p>
                          <p className="text-xs text-white/50">{formatFileSize(file.size)}</p>
                          {file.extractedData && (
                            <div className="flex gap-2 mt-1">
                              <Badge className="bg-blue-500/20 text-blue-300 text-xs">
                                ${file.extractedData.amount}
                              </Badge>
                              <Badge className="bg-green-500/20 text-green-300 text-xs">
                                {file.extractedData.merchant}
                              </Badge>
                              <Badge className="bg-purple-500/20 text-purple-300 text-xs">
                                {file.extractedData.category}
                              </Badge>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {file.status === "uploading" && (
                            <div className="flex items-center gap-2">
                              <ClockIcon className="h-4 w-4 text-white/50 animate-spin" />
                              <span className="text-xs text-white/50">Processing...</span>
                            </div>
                          )}
                          {file.status === "completed" && (
                            <div className="flex items-center gap-2">
                              <CheckCircleIcon className="h-4 w-4 text-green-500" />
                              <span className="text-xs text-green-500">Extracted</span>
                              {file.url && (
                                <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                  <EyeIcon className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          )}
                          {file.status === "error" && (
                            <div className="flex items-center gap-2">
                              <ExclamationTriangleIcon className="h-4 w-4 text-red-500" />
                              <span className="text-xs text-red-500">Error</span>
                            </div>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0 text-white/50 hover:text-white hover:bg-white/10"
                            onClick={() => removeFile(file.id)}
                          >
                            <XMarkIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Enhanced Expense Form */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white font-medium tracking-tight">Expense Details</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitExpense} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="amount" className="text-white/70">
                        Amount
                      </Label>
                      <div className="relative">
                        <CurrencyDollarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
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
                        <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="tags" className="text-white/70">
                        Tags (comma separated)
                      </Label>
                      <Input
                        id="tags"
                        placeholder="business, client, urgent"
                        value={formData.tags}
                        onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                        className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="project" className="text-white/70">
                        Project (optional)
                      </Label>
                      <Input
                        id="project"
                        placeholder="Project name"
                        value={formData.project}
                        onChange={(e) => setFormData({ ...formData, project: e.target.value })}
                        className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes" className="text-white/70">
                      Notes (optional)
                    </Label>
                    <Input
                      id="notes"
                      placeholder="Additional notes..."
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button type="submit" className="bg-white text-black hover:bg-white/90">
                      <ReceiptRefundIcon className="h-4 w-4 mr-2" />
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

          {/* Enhanced Expenses Tab */}
          <TabsContent value="expenses" className="space-y-4">
            {/* Filters */}
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row gap-4 items-center">
                  <div className="flex items-center gap-2">
                    <FunnelIcon className="h-4 w-4 text-white/50" />
                    <span className="text-sm text-white/70">Filters:</span>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
                      <SelectTrigger className="bg-white/5 border-white/10 text-white w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select
                      value={filters.category}
                      onValueChange={(value) => setFilters({ ...filters, category: value })}
                    >
                      <SelectTrigger className="bg-white/5 border-white/10 text-white w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="meals">Meals</SelectItem>
                        <SelectItem value="transportation">Transportation</SelectItem>
                        <SelectItem value="accommodation">Accommodation</SelectItem>
                        <SelectItem value="office">Office</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-transparent border-white/20 text-white/70 hover:bg-white/10"
                    >
                      <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white font-medium tracking-tight">My Expenses</CardTitle>
                  <Badge className="bg-white/10 text-white/70 border-white/20">
                    {filteredExpenses.length} expenses
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {filteredExpenses.map((expense) => (
                    <div
                      key={expense.id}
                      className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/8 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-lg bg-white/10 flex items-center justify-center">
                          <ReceiptRefundIcon className="h-6 w-6 text-white/70" />
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
                          {expense.tags && expense.tags.length > 0 && (
                            <div className="flex gap-1 mt-1">
                              {expense.tags.map((tag) => (
                                <Badge key={tag} className="bg-blue-500/20 text-blue-300 text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-medium text-white">{formatCurrency(expense.amount, expense.currency)}</p>
                          {getStatusBadge(expense.status)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-white/50 hover:text-white">
                            <EyeIcon className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-white/50 hover:text-white">
                            <PencilIcon className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-white/50 hover:text-red-400">
                            <TrashIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white font-medium tracking-tight">Spending by Category</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {["meals", "transportation", "accommodation", "office"].map((category) => {
                      const categoryExpenses = expenses.filter((exp) => exp.category === category)
                      const total = categoryExpenses.reduce((sum, exp) => sum + exp.amount, 0)
                      const percentage = totalExpenses > 0 ? (total / totalExpenses) * 100 : 0

                      return (
                        <div key={category} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-white/70 capitalize">{category}</span>
                            <span className="text-white">{formatCurrency(total)}</span>
                          </div>
                          <div className="w-full bg-white/10 rounded-full h-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white font-medium tracking-tight">Monthly Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <ChartBarIcon className="h-16 w-16 text-white/30 mx-auto mb-4" />
                    <p className="text-white/50">Chart visualization coming soon</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
