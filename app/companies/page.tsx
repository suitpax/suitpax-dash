"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Search,
  Plus,
  Building,
  Users,
  MapPin,
  Phone,
  Mail,
  Globe,
  MoreHorizontal,
  Download,
  Upload,
} from "lucide-react"

interface Company {
  id: string
  name: string
  logo: string
  industry: string
  location: string
  employees: number
  revenue: string
  status: "active" | "inactive" | "pending"
  contact: {
    email: string
    phone: string
    website: string
  }
  lastActivity: string
  deals: number
  totalValue: string
}

export default function CompaniesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("all")

  const companies: Company[] = [
    {
      id: "1",
      name: "TechCorp Solutions",
      logo: "/images/team/ammar-foley.jpeg",
      industry: "Technology",
      location: "San Francisco, CA",
      employees: 250,
      revenue: "€2.5M",
      status: "active",
      contact: {
        email: "contact@techcorp.com",
        phone: "+1 (555) 123-4567",
        website: "techcorp.com",
      },
      lastActivity: "2 hours ago",
      deals: 5,
      totalValue: "€125,000",
    },
    {
      id: "2",
      name: "Global Dynamics",
      logo: "/images/team/aston-hood.jpeg",
      industry: "Manufacturing",
      location: "Munich, Germany",
      employees: 1200,
      revenue: "€15M",
      status: "active",
      contact: {
        email: "info@globaldynamics.de",
        phone: "+49 89 123456",
        website: "globaldynamics.de",
      },
      lastActivity: "1 day ago",
      deals: 12,
      totalValue: "€450,000",
    },
    {
      id: "3",
      name: "Innovate Labs",
      logo: "/images/team/cohen-lozano.jpeg",
      industry: "Research",
      location: "London, UK",
      employees: 85,
      revenue: "€800K",
      status: "pending",
      contact: {
        email: "hello@innovatelabs.co.uk",
        phone: "+44 20 7123 4567",
        website: "innovatelabs.co.uk",
      },
      lastActivity: "3 days ago",
      deals: 2,
      totalValue: "€35,000",
    },
    {
      id: "4",
      name: "Future Systems",
      logo: "/images/team/genevieve-mclean.jpeg",
      industry: "Software",
      location: "Barcelona, Spain",
      employees: 180,
      revenue: "€1.8M",
      status: "active",
      contact: {
        email: "contact@futuresystems.es",
        phone: "+34 93 123 4567",
        website: "futuresystems.es",
      },
      lastActivity: "5 hours ago",
      deals: 8,
      totalValue: "€280,000",
    },
    {
      id: "5",
      name: "Digital Ventures",
      logo: "/images/team/isla-allison.jpeg",
      industry: "Digital Marketing",
      location: "Amsterdam, NL",
      employees: 45,
      revenue: "€600K",
      status: "inactive",
      contact: {
        email: "info@digitalventures.nl",
        phone: "+31 20 123 4567",
        website: "digitalventures.nl",
      },
      lastActivity: "2 weeks ago",
      deals: 3,
      totalValue: "€75,000",
    },
  ]

  const filteredCompanies = companies.filter((company) => {
    const matchesSearch =
      company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.location.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesFilter = selectedFilter === "all" || company.status === selectedFilter

    return matchesSearch && matchesFilter
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-emerald-500/20 text-emerald-400"
      case "pending":
        return "bg-yellow-500/20 text-yellow-400"
      case "inactive":
        return "bg-red-500/20 text-red-400"
      default:
        return "bg-gray-500/20 text-gray-400"
    }
  }

  const stats = [
    { label: "Total Companies", value: companies.length.toString(), change: "+12%" },
    { label: "Active", value: companies.filter((c) => c.status === "active").length.toString(), change: "+8%" },
    { label: "Total Revenue", value: "€20.7M", change: "+15%" },
    { label: "Avg Deal Size", value: "€85K", change: "+5%" },
  ]

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Companies</h1>
              <p className="text-white/70">Manage your business relationships and partnerships</p>
            </div>
            <div className="flex gap-3">
              <Button className="bg-white/10 text-white hover:bg-white/20 border border-white/20">
                <Upload className="h-4 w-4 mr-2" />
                Import
              </Button>
              <Button className="bg-white/10 text-white hover:bg-white/20 border border-white/20">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button className="bg-white text-black hover:bg-white/90">
                <Plus className="h-4 w-4 mr-2" />
                Add Company
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {stats.map((stat, index) => (
            <Card key={index} className="bg-black/30 border-white/10">
              <CardContent className="p-6">
                <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-white/70 mb-1">{stat.label}</div>
                <div className="text-xs text-emerald-400">{stat.change}</div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Filters and Search */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
            <Input
              placeholder="Search companies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/50"
            />
          </div>
          <div className="flex gap-2">
            {["all", "active", "pending", "inactive"].map((filter) => (
              <Button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                variant={selectedFilter === filter ? "default" : "outline"}
                className={
                  selectedFilter === filter
                    ? "bg-white text-black"
                    : "bg-white/5 text-white border-white/20 hover:bg-white/10"
                }
                size="sm"
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Companies Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {filteredCompanies.map((company, index) => (
            <motion.div
              key={company.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="bg-black/30 border-white/10 hover:border-white/20 transition-colors cursor-pointer">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={company.logo || "/placeholder.svg"} />
                        <AvatarFallback className="bg-white/10 text-white">
                          {company.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-white text-lg">{company.name}</CardTitle>
                        <p className="text-white/70 text-sm">{company.industry}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(company.status)}>{company.status}</Badge>
                      <Button size="sm" variant="ghost" className="text-white/50 hover:text-white">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-white/50 mb-1">Location</div>
                      <div className="text-white flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {company.location}
                      </div>
                    </div>
                    <div>
                      <div className="text-white/50 mb-1">Employees</div>
                      <div className="text-white flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {company.employees}
                      </div>
                    </div>
                    <div>
                      <div className="text-white/50 mb-1">Revenue</div>
                      <div className="text-white font-medium">{company.revenue}</div>
                    </div>
                    <div>
                      <div className="text-white/50 mb-1">Deals</div>
                      <div className="text-white font-medium">{company.deals}</div>
                    </div>
                  </div>

                  <div className="space-y-2 pt-4 border-t border-white/10">
                    <div className="flex items-center gap-2 text-sm text-white/70">
                      <Mail className="h-3 w-3" />
                      {company.contact.email}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-white/70">
                      <Phone className="h-3 w-3" />
                      {company.contact.phone}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-white/70">
                      <Globe className="h-3 w-3" />
                      {company.contact.website}
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-white/10">
                    <div className="text-xs text-white/50">Last activity: {company.lastActivity}</div>
                    <div className="text-sm font-medium text-white">{company.totalValue}</div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {filteredCompanies.length === 0 && (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Building className="h-12 w-12 text-white/30 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No companies found</h3>
            <p className="text-white/70 mb-4">Try adjusting your search or filters</p>
            <Button className="bg-white text-black hover:bg-white/90">
              <Plus className="h-4 w-4 mr-2" />
              Add First Company
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  )
}
