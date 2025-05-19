"use client"

import { useState } from "react"
import Image from "next/image"
import {
  BuildingOfficeIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  PlusIcon,
  ClockIcon,
  CalendarIcon,
  UserGroupIcon,
  BuildingLibraryIcon,
  UsersIcon,
  GlobeAltIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline"
import { Plane } from "lucide-react"
import { GlowBorder } from "@/components/ui/glow-border"
import Layout from "@/components/ui/layout"

// Types for our data
interface Membership {
  id: string
  name: string
  price: number
  billingCycle: "monthly" | "annual"
  features: string[]
  isPopular?: boolean
  teamSize?: string
  enterpriseFeatures?: boolean
}

interface VIPLounge {
  id: string
  name: string
  location: string
  airport: string
  terminal: string
  amenities: string[]
  accessStatus: "available" | "unavailable" | "limited"
  imageUrl: string
  partnerStatus?: "premium" | "standard" | "exclusive"
}

interface AccessHistory {
  id: string
  loungeName: string
  airport: string
  date: string
  duration: string
  cost: number
  teamMember?: string
  teamMemberRole?: string
  teamMemberAvatar?: string
}

// Sample data
const memberships: Membership[] = [
  {
    id: "startup",
    name: "Startup Team Access",
    price: 499,
    billingCycle: "monthly",
    features: [
      "Access to 600+ lounges worldwide",
      "Up to 10 team members",
      "20 visits per month (shared pool)",
      "Digital membership cards for all members",
      "Basic travel analytics dashboard",
      "Email support",
    ],
    teamSize: "1-10 employees",
  },
  {
    id: "business",
    name: "Business Team Access",
    price: 999,
    billingCycle: "monthly",
    features: [
      "Access to 1,300+ lounges worldwide",
      "Up to 50 team members",
      "Unlimited visits for key executives",
      "50 visits per month for team (shared pool)",
      "Priority access during peak hours",
      "Advanced travel analytics & reporting",
      "Dedicated account manager",
    ],
    isPopular: true,
    teamSize: "11-50 employees",
  },
  {
    id: "enterprise",
    name: "Enterprise Solution",
    price: 2499,
    billingCycle: "monthly",
    features: [
      "Access to 1,500+ premium lounges worldwide",
      "Unlimited team members",
      "Unlimited visits for all members",
      "VIP services (fast track security, meet & greet)",
      "Enterprise travel management platform",
      "Custom travel policy integration",
      "24/7 priority support with dedicated team",
    ],
    teamSize: "50+ employees",
    enterpriseFeatures: true,
  },
]

const vipLounges: VIPLounge[] = [
  {
    id: "lounge1",
    name: "Centurion Lounge",
    location: "Terminal 4, Concourse D",
    airport: "Madrid-Barajas Airport",
    terminal: "T4",
    amenities: ["Premium Buffet", "Open Bar", "Shower Suites", "High-Speed Wi-Fi", "Business Center", "Meeting Rooms"],
    accessStatus: "available",
    imageUrl: "/contemporary-airport-retreat.png",
    partnerStatus: "exclusive",
  },
  {
    id: "lounge2",
    name: "Star Alliance Lounge",
    location: "Terminal 1, Near Gate 10",
    airport: "Barcelona El Prat Airport",
    terminal: "T1",
    amenities: ["Hot Food", "Alcoholic Beverages", "Quiet Zone", "Newspapers", "TV", "Conference Facilities"],
    accessStatus: "limited",
    imageUrl: "/sophisticated-airport-retreat.png",
    partnerStatus: "premium",
  },
  {
    id: "lounge3",
    name: "Plaza Premium Lounge",
    location: "Terminal 2, Departures Level",
    airport: "London Heathrow",
    terminal: "T2",
    amenities: ["Buffet", "Bar Service", "Shower Facilities", "Relaxation Area", "Business Center", "Private Suites"],
    accessStatus: "available",
    imageUrl: "/upscale-airport-dining.png",
    partnerStatus: "standard",
  },
  {
    id: "lounge4",
    name: "Air France Lounge",
    location: "Terminal 2E, Hall L",
    airport: "Paris Charles de Gaulle",
    terminal: "T2E",
    amenities: ["French Cuisine", "Wine Selection", "Spa Services", "Quiet Areas", "Shower Suites", "Work Stations"],
    accessStatus: "unavailable",
    imageUrl: "/serene-airport-spa.png",
    partnerStatus: "premium",
  },
]

const accessHistory: AccessHistory[] = [
  {
    id: "access1",
    loungeName: "Centurion Lounge",
    airport: "Madrid-Barajas Airport",
    date: "April 15, 2025",
    duration: "2h 30m",
    cost: 0,
    teamMember: "Sofia Rodriguez",
    teamMemberRole: "Sales Director",
    teamMemberAvatar: "/images/team/isla-allison.jpeg",
  },
  {
    id: "access2",
    loungeName: "Star Alliance Lounge",
    airport: "Barcelona El Prat Airport",
    date: "March 22, 2025",
    duration: "1h 45m",
    cost: 0,
    teamMember: "David Chen",
    teamMemberRole: "Product Manager",
    teamMemberAvatar: "/images/team/cohen-lozano.jpeg",
  },
  {
    id: "access3",
    loungeName: "Plaza Premium Lounge",
    airport: "London Heathrow",
    date: "February 10, 2025",
    duration: "3h 15m",
    cost: 0,
    teamMember: "Emma Johnson",
    teamMemberRole: "CEO",
    teamMemberAvatar: "/images/team/genevieve-mclean.jpeg",
  },
  {
    id: "access4",
    loungeName: "Air France Lounge",
    airport: "Paris Charles de Gaulle",
    date: "January 28, 2025",
    duration: "2h 10m",
    cost: 0,
    teamMember: "Michael Brown",
    teamMemberRole: "CTO",
    teamMemberAvatar: "/images/team/orlando-diggs.jpeg",
  },
]

export default function AirportVIPLoungePage() {
  const [activeTab, setActiveTab] = useState<"memberships" | "lounges" | "history">("memberships")
  const [currentMembership, setCurrentMembership] = useState<string>("business")

  return (
    <Layout>
      <div className="container mx-auto">
        <div className="flex flex-col space-y-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-3xl font-medium tracking-tighter mb-2">Airport VIP Lounge Access</h1>
              <p className="text-gray-500">
                Streamline your team's travel experience with premium lounge access worldwide
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-3">
              <button className="inline-flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors">
                <UsersIcon className="h-4 w-4 mr-2" />
                Manage Team Access
              </button>
              <button className="inline-flex items-center px-4 py-2 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors">
                <PlusIcon className="h-4 w-4 mr-2" />
                Add New Membership
              </button>
            </div>
          </div>

          {/* Membership Status Card */}
          <GlowBorder>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex flex-col md:flex-row justify-between">
                <div className="flex items-center mb-4 md:mb-0">
                  <div className="bg-gray-200 p-3 rounded-xl mr-4">
                    <BuildingLibraryIcon className="h-8 w-8 text-gray-700" />
                  </div>
                  <div>
                    <h2 className="text-xl font-medium">Business Team Access</h2>
                    <p className="text-gray-500">Active until April 30, 2026</p>
                  </div>
                </div>
                <div className="flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-6">
                  <div className="flex flex-col items-center">
                    <span className="text-sm text-gray-500">Team Members</span>
                    <span className="text-xl font-medium">32/50</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-sm text-gray-500">Visits This Month</span>
                    <span className="text-xl font-medium">28/50</span>
                  </div>
                  <button className="inline-flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors">
                    Manage Membership
                    <ArrowRightIcon className="h-4 w-4 ml-2" />
                  </button>
                </div>
              </div>
            </div>
          </GlowBorder>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab("memberships")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "memberships"
                    ? "border-black text-black"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Membership Plans
              </button>
              <button
                onClick={() => setActiveTab("lounges")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "lounges"
                    ? "border-black text-black"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Available Lounges
              </button>
              <button
                onClick={() => setActiveTab("history")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "history"
                    ? "border-black text-black"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Team Access History
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="mt-4">
            {/* Membership Plans Tab */}
            {activeTab === "memberships" && (
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-xl p-6 mb-6">
                  <h3 className="text-lg font-medium mb-2">Choose the right plan for your business</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    All plans include access to our global network of premium airport lounges, digital membership cards,
                    and our travel management platform.
                  </p>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-700 mr-3">Billed Monthly</span>
                    <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full bg-gray-200">
                      <label
                        htmlFor="toggle"
                        className="absolute left-0 w-6 h-6 transition duration-100 ease-in-out transform bg-white rounded-full cursor-pointer"
                      ></label>
                      <input type="checkbox" id="toggle" name="toggle" className="w-0 h-0 opacity-0" />
                    </div>
                    <span className="text-sm text-gray-700 ml-3">Billed Annually (Save 15%)</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {memberships.map((membership) => (
                    <div
                      key={membership.id}
                      className={`relative bg-white rounded-xl p-6 border ${
                        membership.id === currentMembership ? "border-black" : "border-gray-200"
                      } hover:border-gray-300 transition-colors ${membership.isPopular ? "shadow-md" : ""}`}
                    >
                      {membership.isPopular && (
                        <span className="absolute top-4 right-4 bg-gray-200 text-xs font-medium px-2 py-1 rounded-full">
                          Most Popular
                        </span>
                      )}
                      <h3 className="text-xl font-medium mb-2">{membership.name}</h3>
                      <div className="text-sm text-gray-500 mb-3">{membership.teamSize}</div>
                      <div className="flex items-baseline mb-4">
                        <span className="text-3xl font-bold">${membership.price}</span>
                        <span className="text-gray-500 ml-1">
                          /{membership.billingCycle === "monthly" ? "month" : "year"}
                        </span>
                      </div>
                      <ul className="space-y-3 mb-6">
                        {membership.features.map((feature, index) => (
                          <li key={index} className="flex items-start">
                            <CheckCircleIcon className="h-5 w-5 text-gray-700 mr-2 flex-shrink-0" />
                            <span className="text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      {membership.enterpriseFeatures && (
                        <div className="bg-gray-50 p-3 rounded-lg mb-4">
                          <p className="text-xs text-gray-600">
                            Custom enterprise solutions available. Contact our sales team for a personalized quote.
                          </p>
                        </div>
                      )}
                      <button
                        className={`w-full py-2 rounded-xl ${
                          membership.id === currentMembership
                            ? "bg-black text-white"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        } transition-colors`}
                      >
                        {membership.id === currentMembership ? "Current Plan" : "Select Plan"}
                      </button>
                    </div>
                  ))}
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-6 mt-8">
                  <h3 className="text-lg font-medium mb-4">Enterprise Features</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex items-start">
                      <div className="bg-gray-100 p-2 rounded-lg mr-3">
                        <ShieldCheckIcon className="h-5 w-5 text-gray-700" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium mb-1">Dedicated Account Management</h4>
                        <p className="text-xs text-gray-600">Personal support from our enterprise team</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-gray-100 p-2 rounded-lg mr-3">
                        <GlobeAltIcon className="h-5 w-5 text-gray-700" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium mb-1">Global Coverage</h4>
                        <p className="text-xs text-gray-600">Access to exclusive VIP lounges worldwide</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-gray-100 p-2 rounded-lg mr-3">
                        <UsersIcon className="h-5 w-5 text-gray-700" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium mb-1">Team Management</h4>
                        <p className="text-xs text-gray-600">Advanced controls and permission settings</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Available Lounges Tab */}
            {activeTab === "lounges" && (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                  <h2 className="text-xl font-medium">Available VIP Lounges</h2>
                  <div className="mt-2 md:mt-0 flex items-center space-x-3">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search lounges by airport or city"
                        className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-gray-400 w-full md:w-64"
                      />
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    </div>
                    <select className="px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-gray-400">
                      <option value="all">All Regions</option>
                      <option value="europe">Europe</option>
                      <option value="namerica">North America</option>
                      <option value="asia">Asia Pacific</option>
                      <option value="meast">Middle East</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {vipLounges.map((lounge) => (
                    <div
                      key={lounge.id}
                      className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-md transition-shadow"
                    >
                      <div className="relative h-48 w-full">
                        <Image
                          src={lounge.imageUrl || "/placeholder.svg"}
                          alt={lounge.name}
                          fill
                          className="object-cover"
                        />
                        {lounge.partnerStatus && (
                          <div className="absolute top-4 left-4">
                            <span
                              className={`text-xs font-medium px-2 py-1 rounded-full ${
                                lounge.partnerStatus === "exclusive"
                                  ? "bg-black text-white"
                                  : lounge.partnerStatus === "premium"
                                    ? "bg-gray-800 text-white"
                                    : "bg-gray-200 text-gray-800"
                              }`}
                            >
                              {lounge.partnerStatus === "exclusive"
                                ? "Exclusive Partner"
                                : lounge.partnerStatus === "premium"
                                  ? "Premium Partner"
                                  : "Standard Partner"}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-xl font-medium">{lounge.name}</h3>
                          <span
                            className={`text-xs font-medium px-2 py-1 rounded-full ${
                              lounge.accessStatus === "available"
                                ? "bg-green-100 text-green-800"
                                : lounge.accessStatus === "limited"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                            }`}
                          >
                            {lounge.accessStatus === "available"
                              ? "Available Now"
                              : lounge.accessStatus === "limited"
                                ? "Limited Access"
                                : "Currently Unavailable"}
                          </span>
                        </div>
                        <div className="flex items-center text-gray-500 mb-4">
                          <BuildingOfficeIcon className="h-4 w-4 mr-1" />
                          <span className="text-sm">
                            {lounge.airport} • {lounge.terminal}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mb-4">{lounge.location}</p>
                        <div className="mb-4">
                          <h4 className="text-sm font-medium mb-2">Amenities</h4>
                          <div className="flex flex-wrap gap-2">
                            {lounge.amenities.map((amenity, index) => (
                              <span key={index} className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                                {amenity}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            className={`flex-1 py-2 rounded-xl ${
                              lounge.accessStatus === "available"
                                ? "bg-black text-white hover:bg-gray-800"
                                : "bg-gray-200 text-gray-500 cursor-not-allowed"
                            }`}
                            disabled={lounge.accessStatus !== "available"}
                          >
                            Reserve Access
                          </button>
                          <button className="px-3 py-2 rounded-xl border border-gray-200 hover:bg-gray-50">
                            Details
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-center mt-6">
                  <button className="px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 text-sm">
                    Load More Lounges
                  </button>
                </div>
              </div>
            )}

            {/* Access History Tab */}
            {activeTab === "history" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-medium">Team Lounge Access History</h2>
                  <div className="flex space-x-2">
                    <button className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm">
                      Last 3 Months
                    </button>
                    <button className="px-3 py-1.5 bg-white text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                      All Time
                    </button>
                    <button className="px-3 py-1.5 bg-white text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                      Export Data
                    </button>
                  </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-white p-4 rounded-xl border border-gray-200">
                    <div className="flex items-center mb-2">
                      <div className="bg-gray-100 p-2 rounded-lg mr-3">
                        <Plane className="h-5 w-5 text-gray-700" />
                      </div>
                      <span className="text-sm text-gray-500">Total Team Visits</span>
                    </div>
                    <p className="text-2xl font-medium">42</p>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-gray-200">
                    <div className="flex items-center mb-2">
                      <div className="bg-gray-100 p-2 rounded-lg mr-3">
                        <ClockIcon className="h-5 w-5 text-gray-700" />
                      </div>
                      <span className="text-sm text-gray-500">Avg. Duration</span>
                    </div>
                    <p className="text-2xl font-medium">2h 15m</p>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-gray-200">
                    <div className="flex items-center mb-2">
                      <div className="bg-gray-100 p-2 rounded-lg mr-3">
                        <CalendarIcon className="h-5 w-5 text-gray-700" />
                      </div>
                      <span className="text-sm text-gray-500">Last Visit</span>
                    </div>
                    <p className="text-2xl font-medium">Apr 15, 2025</p>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-gray-200">
                    <div className="flex items-center mb-2">
                      <div className="bg-gray-100 p-2 rounded-lg mr-3">
                        <UserGroupIcon className="h-5 w-5 text-gray-700" />
                      </div>
                      <span className="text-sm text-gray-500">Active Users</span>
                    </div>
                    <p className="text-2xl font-medium">18/32</p>
                  </div>
                </div>

                {/* Access History Table */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Team Member
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Lounge
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Airport
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Date
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Duration
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {accessHistory.map((access) => (
                        <tr key={access.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-8 w-8 rounded-full overflow-hidden mr-3">
                                <Image
                                  src={access.teamMemberAvatar || "/placeholder.svg"}
                                  alt={access.teamMember || "Team member"}
                                  width={32}
                                  height={32}
                                  className="object-cover"
                                />
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-900">{access.teamMember}</div>
                                <div className="text-xs text-gray-500">{access.teamMemberRole}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{access.loungeName}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{access.airport}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{access.date}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{access.duration}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                              Completed
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-between items-center mt-4">
                  <div className="text-sm text-gray-500">Showing 4 of 42 entries</div>
                  <div className="flex space-x-2">
                    <button className="px-3 py-1 border border-gray-200 rounded-md text-sm text-gray-500">
                      Previous
                    </button>
                    <button className="px-3 py-1 bg-gray-200 rounded-md text-sm">1</button>
                    <button className="px-3 py-1 border border-gray-200 rounded-md text-sm text-gray-500">2</button>
                    <button className="px-3 py-1 border border-gray-200 rounded-md text-sm text-gray-500">3</button>
                    <button className="px-3 py-1 border border-gray-200 rounded-md text-sm text-gray-500">Next</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}
