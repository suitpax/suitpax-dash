"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Upload, Receipt, Calendar, DollarSign, FileText, X, Check, Clock, AlertCircle } from "lucide-react"

interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  status: "uploading" | "completed" | "error"
}

export default function Expenses() {
  const [dragActive, setDragActive] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])

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
        setUploadedFiles((prev) => prev.map((f) => (f.id === newFile.id ? { ...f, status: "completed" } : f)))
      }, 2000)
    })
  }

  const removeFile = (id: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== id))
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div className="min-h-screen bg-black text-white p-3">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-medium tracking-tighter text-white">Expense Management</h1>
            <p className="text-white/70 text-sm">Upload and manage your business expenses</p>
          </div>
          <Badge className="bg-white/10 text-white/70 border-white/20">{uploadedFiles.length} files uploaded</Badge>
        </div>

        {/* Upload Area */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white font-medium tracking-tighter">Upload Receipts & Invoices</CardTitle>
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
                    className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10"
                  >
                    <div className="h-10 w-10 rounded-lg bg-white/10 flex items-center justify-center">
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
          <CardContent className="space-y-4">
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
                    placeholder="0.00"
                    className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/30"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="date" className="text-white/70">
                  Date
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
                  <Input id="date" type="date" className="pl-10 bg-white/5 border-white/10 text-white" />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description" className="text-white/70">
                Description
              </Label>
              <Input
                id="description"
                placeholder="Business lunch, taxi fare, hotel..."
                className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
              />
            </div>
            <div className="flex gap-3">
              <Button className="bg-white text-black hover:bg-white/90">
                <Receipt className="h-4 w-4 mr-2" />
                Submit Expense
              </Button>
              <Button variant="outline" className="bg-transparent border-white/20 text-white/70 hover:bg-white/10">
                Save Draft
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
