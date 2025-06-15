"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  PiBuilding,
  PiPlus,
  PiStar,
  PiTrendUp,
  PiTrendDown,
  PiPhone,
  PiEnvelope,
  PiGlobe,
  PiFilter,
  PiDownload,
} from "react-icons/pi"

export default function VendorsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const vendors = [
    {
      id: "v1",
      name: "Lufthansa Group",
      category: "Airlines",
      rating: 4.8,
      totalBookings: 156,
      totalSpend: "$89,450",
      avgCost: "$574",
      savings: "+12%",
      trend: "up",
      contact: {
        phone: "+49 69 696 0",
        email: "corporate@lufthansa.com",
        website: "lufthansa.com",
      },
      status: "preferred",
      contractEnd: "2025-03-15",
    },
    {
      id: "v2",
      name: "Marriott International",
      category: "Hotels",
      rating: 4.6,
      totalBookings: 89,
      totalSpend: "$67,200",
      avgCost: "$755",
      savings: "-3%",
      trend: "down",
      contact: {
        phone: "+1 301 380 3000",
        email: "corporate@marriott.com",
        website: "marriott.com",
      },
      status: "active",
      contractEnd: "2024-12-31",
    },
    {
      id: "v3",
      name: "Enterprise Rent-A-Car",
      category: "Car Rental",
      rating: 4.4,
      totalBookings: 67,
      totalSpend: "$23,890",
      avgCost: "$356",
      savings: "+8%",
      trend: "up",
      contact: {
        phone: "+1 314 512 5000",
        email: "corporate@enterprise.com",
        website: "enterprise.com",
      },
      status: "preferred",
      contractEnd: "2025-06-30",
    },
    {
      id: "v4",
      name: "Uber for Business",
      category: "Ground Transport",
      rating: 4.2,
      totalBookings: 234,
      totalSpend: "$18,670",
      avgCost: "$80",
      savings: "+15%",
      trend: "up",
      contact: {
        phone: "+1 415 612 8582",
        email: "business@uber.com",
        website: "uber.com/business",
      },
      status: "active",
      contractEnd: "2025-01-15",
    },
    {
      id: "v5",
      name: "American Express GBT",
      category: "Travel Management",
      rating: 4.7,
      totalBookings: 45,
      totalSpend: "$156,780",
      avgCost: "$3,484",
      savings: "+22%",
      trend: "up",
      contact: {
        phone: "+1 212 640 2000",
        email: "corporate@amexgbt.com",
        website: "amexgbt.com",
      },
      status: "preferred",
      contractEnd: "2025-12-31",
    },
  ]

  const categories = ["all", "airlines", "hotels", "car rental", "ground transport", "travel management"]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "preferred":
        return <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 font-light">Preferred</Badge>
      case "active":
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30 font-light">Active</Badge>
      default:
        return <Badge className="bg-white/10 text-white/70 border-white/20 font-light">{status}</Badge>
    }
  }

  const filteredVendors = vendors.filter((vendor) => {
    const matchesSearch = vendor.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || vendor.category.toLowerCase() === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-black text-white p-3">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-light tracking-tighter text-white">Vendor Management</h1>
            <p className="text-white/70 text-sm font-light">Manage travel suppliers and partnerships</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="bg-transparent border-white/20 text-white/70 hover:bg-white/10 font-light"
            >
              <PiDownload className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button className="bg-white text-black hover:bg-white/90 font-light">
              <PiPlus className="h-4 w-4 mr-2" />
              Add Vendor
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <Card className="bg-white/5 border-white/10">
          <CardContent className="py-3">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Input
                  placeholder="Search vendors..."
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30 font-light"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <select
                  className="px-3 py-2 text-sm bg-white/5 border border-white/10 rounded-lg text-white font-light"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
                <Button
                  variant="outline"
                  className="bg-transparent border-white/20 text-white/70 hover:bg-white/10 font-light"
                >
                  <PiFilter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Vendor Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <PiBuilding className="h-5 w-5 text-white/50" />
                <PiTrendUp className="h-4 w-4 text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-light text-white mb-1">{vendors.length}</p>
                <p className="text-xs text-white/50 font-light">Active Vendors</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <PiStar className="h-5 w-5 text-white/50" />
                <span className="text-xs text-green-400 font-light">+0.2</span>
              </div>
              <div>
                <p className="text-2xl font-light text-white mb-1">4.5</p>
                <p className="text-xs text-white/50 font-light">Avg Rating</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/50 text-xs">$</span>
                <PiTrendUp className="h-4 w-4 text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-light text-white mb-1">$355K</p>
                <p className="text-xs text-white/50 font-light">Total Spend</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/50 text-xs">%</span>
                <PiTrendUp className="h-4 w-4 text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-light text-white mb-1">12.8%</p>
                <p className="text-xs text-white/50 font-light">Avg Savings</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Vendors List */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader className="py-3">
            <CardTitle className="text-white font-light tracking-tighter text-lg">Vendor Directory</CardTitle>
          </CardHeader>
          <CardContent className="py-2">
            <div className="space-y-4">
              {filteredVendors.map((vendor) => (
                <div
                  key={vendor.id}
                  className="p-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/8 transition-colors"
                >
                  <div className="flex flex-col lg:flex-row gap-4">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
                        <PiBuilding className="h-6 w-6 text-white/70" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-light text-white text-lg">{vendor.name}</h3>
                          {getStatusBadge(vendor.status)}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-white/70 mb-2">
                          <span className="font-light">{vendor.category}</span>
                          <div className="flex items-center gap-1">
                            <PiStar className="h-4 w-4 text-yellow-400" />
                            <span className="font-light">{vendor.rating}</span>
                          </div>
                          <span className="font-light">Contract ends: {vendor.contractEnd}</span>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-white/50">
                          <div className="flex items-center gap-1">
                            <PiPhone className="h-3 w-3" />
                            <span className="font-light">{vendor.contact.phone}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <PiEnvelope className="h-3 w-3" />
                            <span className="font-light">{vendor.contact.email}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <PiGlobe className="h-3 w-3" />
                            <span className="font-light">{vendor.contact.website}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                        <div>
                          <p className="text-lg font-light text-white">{vendor.totalBookings}</p>
                          <p className="text-xs text-white/50 font-light">Bookings</p>
                        </div>
                        <div>
                          <p className="text-lg font-light text-white">{vendor.totalSpend}</p>
                          <p className="text-xs text-white/50 font-light">Total Spend</p>
                        </div>
                        <div>
                          <p className="text-lg font-light text-white">{vendor.avgCost}</p>
                          <p className="text-xs text-white/50 font-light">Avg Cost</p>
                        </div>
                        <div>
                          <div className="flex items-center justify-center gap-1">
                            {vendor.trend === "up" ? (
                              <PiTrendUp className="h-4 w-4 text-green-400" />
                            ) : (
                              <PiTrendDown className="h-4 w-4 text-red-400" />
                            )}
                            <span
                              className={`text-lg font-light ${
                                vendor.trend === "up" ? "text-green-400" : "text-red-400"
                              }`}
                            >
                              {vendor.savings}
                            </span>
                          </div>
                          <p className="text-xs text-white/50 font-light">Savings</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
