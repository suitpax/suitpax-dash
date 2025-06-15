"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PiBuilding, PiPlus, PiStar, PiTrendUp, PiDownload, PiFunnel } from "react-icons/pi"

export default function VendorsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const vendors: any[] = []
  const categories = ["all", "airlines", "hotels", "car rental", "ground transport", "travel management"]

  return (
    <div className="min-h-screen bg-background text-foreground p-3">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-light tracking-tighter">Vendor Management</h1>
            <p className="text-muted-foreground text-sm font-light">Manage travel suppliers and partnerships</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="font-light">
              <PiDownload className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button className="font-light">
              <PiPlus className="h-4 w-4 mr-2" />
              Add Vendor
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="py-3">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Input
                  placeholder="Search vendors..."
                  className="font-light"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <select
                  className="px-3 py-2 text-sm bg-background border border-input rounded-lg font-light"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
                <Button variant="outline" className="font-light">
                  <PiFunnel className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Vendor Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <PiBuilding className="h-5 w-5 text-muted-foreground" />
                <PiTrendUp className="h-4 w-4 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-light mb-1">0</p>
                <p className="text-xs text-muted-foreground font-light">Active Vendors</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <PiStar className="h-5 w-5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground font-light">N/A</span>
              </div>
              <div>
                <p className="text-2xl font-light mb-1">0</p>
                <p className="text-xs text-muted-foreground font-light">Avg Rating</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-muted-foreground text-xs">$</span>
                <PiTrendUp className="h-4 w-4 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-light mb-1">$0</p>
                <p className="text-xs text-muted-foreground font-light">Total Spend</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-muted-foreground text-xs">%</span>
                <PiTrendUp className="h-4 w-4 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-light mb-1">0%</p>
                <p className="text-xs text-muted-foreground font-light">Avg Savings</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Empty State */}
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="font-light tracking-tighter text-lg">Vendor Directory</CardTitle>
          </CardHeader>
          <CardContent className="py-8">
            <div className="text-center">
              <PiBuilding className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">No vendors added yet</h3>
              <p className="text-muted-foreground mb-4">
                Add your first travel vendor to start managing partnerships and contracts.
              </p>
              <Button>
                <PiPlus className="h-4 w-4 mr-2" />
                Add Vendor
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
