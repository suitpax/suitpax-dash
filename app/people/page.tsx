"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Plus, User, Mail, Phone, MapPin, Building, MoreHorizontal, Download, Upload, Star } from "lucide-react"

interface Person {
  id: string
  name: string
  avatar: string
  email: string
  phone: string
  role: string
  company: string
  location: string
  status: "active" | "inactive" | "pending"
  lastContact: string
  deals: number
  totalValue: string
  tags: string[]
  rating: number
}

export default function PeoplePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("all")

  const people: Person[] = [
    {
      id: "1",
      name: "Sarah Johnson",
      avatar: "/images/team/genevieve-mclean.jpeg",
      email: "sarah.johnson@techcorp.com",
      phone: "+1 (555) 123-4567",
      role: "VP of Operations",
      company: "TechCorp Solutions",
      location: "San Francisco, CA",
      status: "active",
      lastContact: "2 hours ago",
      deals: 3,
      totalValue: "€85,000",
      tags: ["VIP", "Decision Maker"],
      rating: 5,
    },
    {
      id: "2",
      name: "Marcus Weber",
      avatar: "/images/team/aston-hood.jpeg",
      email: "m.weber@globaldynamics.de",
      phone: "+49 89 123456",
      role: "Travel Manager",
      company: "Global Dynamics",
      location: "Munich, Germany",
      status: "active",
      lastContact: "1 day ago",
      deals: 8,
      totalValue: "€320,000",
      tags: ["Key Contact", "Frequent Traveler"],
      rating: 4,
    },
    {
      id: "3",
      name: "Emma Thompson",
      avatar: "/images/team/isla-allison.jpeg",
      email: "emma.t@innovatelabs.co.uk",
      phone: "+44 20 7123 4567",
      role: "Research Director",
      company: "Innovate Labs",
      location: "London, UK",
      status: "pending",
      lastContact: "3 days ago",
      deals: 1,
      totalValue: "€25,000",
      tags: ["New Contact"],
      rating: 3,
    },
    {
      id: "4",
      name: "Carlos Rodriguez",
      avatar: "/images/team/cohen-lozano.jpeg",
      email: "carlos@futuresystems.es",
      phone: "+34 93 123 4567",
      role: "CEO",
      company: "Future Systems",
      location: "Barcelona, Spain",
      status: "active",
      lastContact: "5 hours ago",
      deals: 5,
      totalValue: "€180,000",
      tags: ["CEO", "High Value"],
      rating: 5,
    },
    {
      id: "5",
      name: "Lisa van Berg",
      avatar: "/images/team/isobel-fuller.jpeg",
      email: "lisa@digitalventures.nl",
      phone: "+31 20 123 4567",
      role: "Marketing Director",
      company: "Digital Ventures",
      location: "Amsterdam, NL",
      status: "inactive",
      lastContact: "2 weeks ago",
      deals: 2,
      totalValue: "€45,000",
      tags: ["Marketing"],
      rating: 3,
    },
    {
      id: "6",
      name: "James Mitchell",
      avatar: "/images/team/loki-bright.jpeg",
      email: "j.mitchell@techstart.com",
      phone: "+1 (555) 987-6543",
      role: "Founder",
      company: "TechStart Inc",
      location: "Austin, TX",
      status: "active",
      lastContact: "1 hour ago",
      deals: 4,
      totalValue: "€120,000",
      tags: ["Founder", "Startup"],
      rating: 4,
    },
  ]

  const filteredPeople = people.filter((person) => {
    const matchesSearch =
      person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.role.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesFilter = selectedFilter === "all" || person.status === selectedFilter

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

  const getTagColor = (tag: string) => {
    const colors = {
      VIP: "bg-purple-500/20 text-purple-400",
      "Decision Maker": "bg-blue-500/20 text-blue-400",
      "Key Contact": "bg-emerald-500/20 text-emerald-400",
      "Frequent Traveler": "bg-orange-500/20 text-orange-400",
      CEO: "bg-red-500/20 text-red-400",
      "High Value": "bg-yellow-500/20 text-yellow-400",
      Founder: "bg-pink-500/20 text-pink-400",
      Startup: "bg-cyan-500/20 text-cyan-400",
      Marketing: "bg-indigo-500/20 text-indigo-400",
      "New Contact": "bg-gray-500/20 text-gray-400",
    }
    return colors[tag as keyof typeof colors] || "bg-gray-500/20 text-gray-400"
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`h-3 w-3 ${i < rating ? "text-yellow-400 fill-current" : "text-white/20"}`} />
    ))
  }

  const stats = [
    { label: "Total Contacts", value: people.length.toString(), change: "+18%" },
    { label: "Active", value: people.filter((p) => p.status === "active").length.toString(), change: "+12%" },
    { label: "Avg Deal Value", value: "€95K", change: "+7%" },
    { label: "Response Rate", value: "87%", change: "+3%" },
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
              <h1 className="text-3xl font-bold tracking-tight text-white mb-2">People</h1>
              <p className="text-white/70">Manage your contacts and business relationships</p>
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
                Add Contact
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
              placeholder="Search people..."
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

        {/* People Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {filteredPeople.map((person, index) => (
            <motion.div
              key={person.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="bg-black/30 border-white/10 hover:border-white/20 transition-colors cursor-pointer">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={person.avatar || "/placeholder.svg"} />
                        <AvatarFallback className="bg-white/10 text-white">
                          {person.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-white text-lg">{person.name}</CardTitle>
                        <p className="text-white/70 text-sm">{person.role}</p>
                        <div className="flex items-center gap-1 mt-1">{renderStars(person.rating)}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(person.status)}>{person.status}</Badge>
                      <Button size="sm" variant="ghost" className="text-white/50 hover:text-white">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-white/70">
                      <Building className="h-3 w-3" />
                      {person.company}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-white/70">
                      <MapPin className="h-3 w-3" />
                      {person.location}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-white/70">
                      <Mail className="h-3 w-3" />
                      {person.email}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-white/70">
                      <Phone className="h-3 w-3" />
                      {person.phone}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {person.tags.map((tag, i) => (
                      <Badge key={i} className={`${getTagColor(tag)} text-xs`}>
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                    <div>
                      <div className="text-white/50 text-xs mb-1">Deals</div>
                      <div className="text-white font-medium">{person.deals}</div>
                    </div>
                    <div>
                      <div className="text-white/50 text-xs mb-1">Total Value</div>
                      <div className="text-white font-medium">{person.totalValue}</div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-white/10">
                    <div className="text-xs text-white/50">Last contact: {person.lastContact}</div>
                    <div className="flex gap-2">
                      <Button size="sm" className="bg-white/10 text-white hover:bg-white/20">
                        <Mail className="h-3 w-3" />
                      </Button>
                      <Button size="sm" className="bg-white/10 text-white hover:bg-white/20">
                        <Phone className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {filteredPeople.length === 0 && (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <User className="h-12 w-12 text-white/30 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No contacts found</h3>
            <p className="text-white/70 mb-4">Try adjusting your search or filters</p>
            <Button className="bg-white text-black hover:bg-white/90">
              <Plus className="h-4 w-4 mr-2" />
              Add First Contact
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  )
}
