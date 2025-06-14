"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Plane, Receipt, CreditCard, Upload, DollarSign, Building2, FileText, PlusCircle } from "lucide-react"
import Link from "next/link"

export default function Dashboard() {
  const [dragActive, setDragActive] = useState(false)

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
      // Handle file upload logic here
      console.log("Files dropped:", e.dataTransfer.files)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white p-3">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Header Section */}
        <div className="flex items-center gap-4 mb-6">
          <div className="h-12 w-12 rounded-md bg-white/5 flex items-center justify-center overflow-hidden">
            <img src="/placeholder-user.jpg" alt="User Avatar" className="h-full w-full object-cover" />
          </div>
          <div>
            <h1 className="text-2xl font-medium tracking-tighter text-white">Welcome Alberto</h1>
            <p className="text-white/70 text-sm">Ready to manage your business travel</p>
          </div>
        </div>

        {/* Quick Access Badges */}
        <div className="flex gap-2 mb-6">
          <Link href="/flights">
            <Badge
              variant="outline"
              className="bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white px-3 py-1.5 rounded-xl cursor-pointer transition-colors"
            >
              <Plane className="h-3 w-3 mr-1.5" />
              Flights
            </Badge>
          </Link>
          <Link href="/expenses">
            <Badge
              variant="outline"
              className="bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white px-3 py-1.5 rounded-xl cursor-pointer transition-colors"
            >
              <Receipt className="h-3 w-3 mr-1.5" />
              Expense Management
            </Badge>
          </Link>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Finance Hub */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white font-medium tracking-tighter flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Finance Hub
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Connect Bank */}
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-white/10 flex items-center justify-center">
                        <CreditCard className="h-5 w-5 text-white/70" />
                      </div>
                      <div>
                        <h3 className="font-medium text-white">Connect Corporate Bank</h3>
                        <p className="text-sm text-white/70">
                          Link your business account for automatic expense tracking
                        </p>
                      </div>
                    </div>
                    <Button size="sm" className="bg-white/10 hover:bg-white/20 text-white border-white/20">
                      <PlusCircle className="h-4 w-4 mr-1" />
                      Connect
                    </Button>
                  </div>
                </div>

                {/* Upload Receipts */}
                <div
                  className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                    dragActive ? "border-white/30 bg-white/10" : "border-white/20 bg-white/5"
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <Upload className="h-8 w-8 text-white/50 mx-auto mb-3" />
                  <h3 className="font-medium text-white mb-1">Upload Receipts & Invoices</h3>
                  <p className="text-sm text-white/70 mb-3">Drag and drop your files here, or click to browse</p>
                  <p className="text-xs text-white/50">Supports JPG, PNG, PDF up to 10MB</p>
                  <Input type="file" multiple accept=".jpg,.jpeg,.png,.pdf" className="hidden" id="file-upload" />
                  <Button
                    size="sm"
                    variant="outline"
                    className="mt-3 bg-transparent border-white/20 text-white/70 hover:bg-white/10"
                    onClick={() => document.getElementById("file-upload")?.click()}
                  >
                    Choose Files
                  </Button>
                </div>

                {/* Monthly Summary */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="h-4 w-4 text-white/70" />
                      <span className="text-sm text-white/70">This Month</span>
                    </div>
                    <div className="text-2xl font-medium text-white">$2,847</div>
                    <div className="text-xs text-white/50">+12% from last month</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="h-4 w-4 text-white/70" />
                      <span className="text-sm text-white/70">Pending</span>
                    </div>
                    <div className="text-2xl font-medium text-white">7</div>
                    <div className="text-xs text-white/50">receipts to process</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Travel Status */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white font-medium tracking-tighter text-sm">Travel Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <span className="text-sm text-white/70">No active trips</span>
                </div>
                <Link href="/flights">
                  <Button size="sm" className="w-full bg-white/10 hover:bg-white/20 text-white border-white/20">
                    <Plane className="h-4 w-4 mr-2" />
                    Book Flight
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white font-medium tracking-tighter text-sm">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/70">Trips this year</span>
                  <span className="text-sm font-medium text-white">12</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/70">Total saved</span>
                  <span className="text-sm font-medium text-white">$1,240</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/70">CO2 offset</span>
                  <span className="text-sm font-medium text-white">2.4 tons</span>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white font-medium tracking-tighter text-sm">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-white/10 flex items-center justify-center">
                    <Receipt className="h-4 w-4 text-white/70" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-white">Expense submitted</p>
                    <p className="text-xs text-white/50">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-white/10 flex items-center justify-center">
                    <Plane className="h-4 w-4 text-white/70" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-white">Flight booked</p>
                    <p className="text-xs text-white/50">1 day ago</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
