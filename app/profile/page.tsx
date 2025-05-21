"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import Layout from "@/components/ui/layout"
import { Badge } from "@/components/ui/badge"
import {
  User,
  Mail,
  Building,
  Phone,
  MapPin,
  Calendar,
  CreditCard,
  Globe,
  Save,
  Camera,
  Briefcase,
  Clock,
} from "lucide-react"

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    name: "Carlos Rodríguez",
    email: "carlos.rodriguez@empresa.com",
    company: "Empresa Internacional S.A.",
    role: "Senior Business Analyst",
    phone: "+34 612 345 678",
    location: "Madrid, Spain",
    dateJoined: "January 2022",
    preferredPayment: "Corporate Amex",
    language: "Spanish, English",
    travelFrequency: "Monthly",
    lastTrip: "New York, 2 weeks ago",
    upcomingTrip: "Paris, May 15-20, 2025",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProfileData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = () => {
    setIsEditing(false)
    // Here you would typically save the data to your backend
  }

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
          <h1 className="text-2xl font-medium tracking-tighter text-white">My Profile</h1>

          <div className="flex items-center space-x-2 mt-2 md:mt-0">
            <Badge className="bg-white/10 text-white hover:bg-white/20 transition-colors">Business Traveler</Badge>
            <Badge className="bg-emerald-900/30 text-emerald-400 hover:bg-emerald-900/40 transition-colors">
              Verified
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="md:col-span-1">
            <div className="bg-black/30 backdrop-blur-sm rounded-xl border border-white/10 p-6 shadow-sm">
              <div className="flex flex-col items-center">
                <div className="relative mb-4 group">
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-2 border-white/10">
                    <Image
                      src="/images/user-avatar.jpg"
                      alt="Profile"
                      width={128}
                      height={128}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <Camera className="h-6 w-6 text-white" />
                  </div>
                </div>
                <h2 className="text-xl font-medium text-white mb-1">{profileData.name}</h2>
                <p className="text-white/70 text-sm mb-4">{profileData.role}</p>

                <div className="w-full space-y-3 mt-2">
                  <div className="flex items-center text-white/70">
                    <Mail className="h-4 w-4 mr-2" />
                    <span className="text-sm">{profileData.email}</span>
                  </div>
                  <div className="flex items-center text-white/70">
                    <Building className="h-4 w-4 mr-2" />
                    <span className="text-sm">{profileData.company}</span>
                  </div>
                  <div className="flex items-center text-white/70">
                    <Phone className="h-4 w-4 mr-2" />
                    <span className="text-sm">{profileData.phone}</span>
                  </div>
                  <div className="flex items-center text-white/70">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span className="text-sm">{profileData.location}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Travel Stats */}
            <div className="bg-black/30 backdrop-blur-sm rounded-xl border border-white/10 p-6 shadow-sm mt-4">
              <h3 className="text-lg font-medium text-white mb-4">Travel Stats</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-white/70">
                    <Briefcase className="h-4 w-4 mr-2" />
                    <span className="text-sm">Travel Frequency</span>
                  </div>
                  <span className="text-sm text-white">{profileData.travelFrequency}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-white/70">
                    <Clock className="h-4 w-4 mr-2" />
                    <span className="text-sm">Last Trip</span>
                  </div>
                  <span className="text-sm text-white">{profileData.lastTrip}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-white/70">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span className="text-sm">Upcoming Trip</span>
                  </div>
                  <span className="text-sm text-white">{profileData.upcomingTrip}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="md:col-span-2">
            <div className="bg-black/30 backdrop-blur-sm rounded-xl border border-white/10 p-6 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium text-white">Profile Details</h3>
                <button
                  onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
                  className="flex items-center px-3 py-1.5 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
                >
                  {isEditing ? (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      <span className="text-xs">Save Changes</span>
                    </>
                  ) : (
                    <span className="text-xs">Edit Profile</span>
                  )}
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-xs font-medium text-white/70 mb-1">
                      Full Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={profileData.name}
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20 text-white"
                      />
                    ) : (
                      <div className="flex items-center">
                        <User className="h-4 w-4 text-white/50 mr-2" />
                        <p className="text-white">{profileData.name}</p>
                      </div>
                    )}
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-xs font-medium text-white/70 mb-1">
                      Email Address
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={profileData.email}
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20 text-white"
                      />
                    ) : (
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 text-white/50 mr-2" />
                        <p className="text-white">{profileData.email}</p>
                      </div>
                    )}
                  </div>

                  <div>
                    <label htmlFor="company" className="block text-xs font-medium text-white/70 mb-1">
                      Company
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        id="company"
                        name="company"
                        value={profileData.company}
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20 text-white"
                      />
                    ) : (
                      <div className="flex items-center">
                        <Building className="h-4 w-4 text-white/50 mr-2" />
                        <p className="text-white">{profileData.company}</p>
                      </div>
                    )}
                  </div>

                  <div>
                    <label htmlFor="role" className="block text-xs font-medium text-white/70 mb-1">
                      Job Title
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        id="role"
                        name="role"
                        value={profileData.role}
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20 text-white"
                      />
                    ) : (
                      <div className="flex items-center">
                        <Briefcase className="h-4 w-4 text-white/50 mr-2" />
                        <p className="text-white">{profileData.role}</p>
                      </div>
                    )}
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-xs font-medium text-white/70 mb-1">
                      Phone Number
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        id="phone"
                        name="phone"
                        value={profileData.phone}
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20 text-white"
                      />
                    ) : (
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 text-white/50 mr-2" />
                        <p className="text-white">{profileData.phone}</p>
                      </div>
                    )}
                  </div>

                  <div>
                    <label htmlFor="location" className="block text-xs font-medium text-white/70 mb-1">
                      Location
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        id="location"
                        name="location"
                        value={profileData.location}
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20 text-white"
                      />
                    ) : (
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 text-white/50 mr-2" />
                        <p className="text-white">{profileData.location}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="border-t border-white/10 pt-6">
                  <h4 className="text-md font-medium text-white mb-4">Travel Preferences</h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="preferredPayment" className="block text-xs font-medium text-white/70 mb-1">
                        Preferred Payment Method
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          id="preferredPayment"
                          name="preferredPayment"
                          value={profileData.preferredPayment}
                          onChange={handleChange}
                          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20 text-white"
                        />
                      ) : (
                        <div className="flex items-center">
                          <CreditCard className="h-4 w-4 text-white/50 mr-2" />
                          <p className="text-white">{profileData.preferredPayment}</p>
                        </div>
                      )}
                    </div>

                    <div>
                      <label htmlFor="language" className="block text-xs font-medium text-white/70 mb-1">
                        Languages
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          id="language"
                          name="language"
                          value={profileData.language}
                          onChange={handleChange}
                          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20 text-white"
                        />
                      ) : (
                        <div className="flex items-center">
                          <Globe className="h-4 w-4 text-white/50 mr-2" />
                          <p className="text-white">{profileData.language}</p>
                        </div>
                      )}
                    </div>

                    <div>
                      <label htmlFor="travelFrequency" className="block text-xs font-medium text-white/70 mb-1">
                        Travel Frequency
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          id="travelFrequency"
                          name="travelFrequency"
                          value={profileData.travelFrequency}
                          onChange={handleChange}
                          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20 text-white"
                        />
                      ) : (
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 text-white/50 mr-2" />
                          <p className="text-white">{profileData.travelFrequency}</p>
                        </div>
                      )}
                    </div>

                    <div>
                      <label htmlFor="dateJoined" className="block text-xs font-medium text-white/70 mb-1">
                        Member Since
                      </label>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-white/50 mr-2" />
                        <p className="text-white">{profileData.dateJoined}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Travel History */}
            <div className="bg-black/30 backdrop-blur-sm rounded-xl border border-white/10 p-6 shadow-sm mt-4">
              <h3 className="text-lg font-medium text-white mb-4">Recent Travel Activity</h3>

              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="min-w-8 h-8 bg-white/5 rounded-full flex items-center justify-center mr-3">
                    <MapPin className="h-4 w-4 text-white/70" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">New York Business Trip</p>
                    <p className="text-white/70 text-xs">April 10-15, 2025</p>
                    <div className="flex items-center mt-1">
                      <Badge className="bg-emerald-900/30 text-emerald-400 text-[10px]">Completed</Badge>
                    </div>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="min-w-8 h-8 bg-white/5 rounded-full flex items-center justify-center mr-3">
                    <MapPin className="h-4 w-4 text-white/70" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">Paris Conference</p>
                    <p className="text-white/70 text-xs">May 15-20, 2025</p>
                    <div className="flex items-center mt-1">
                      <Badge className="bg-blue-900/30 text-blue-400 text-[10px]">Upcoming</Badge>
                    </div>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="min-w-8 h-8 bg-white/5 rounded-full flex items-center justify-center mr-3">
                    <MapPin className="h-4 w-4 text-white/70" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">Berlin Client Meeting</p>
                    <p className="text-white/70 text-xs">June 5-8, 2025</p>
                    <div className="flex items-center mt-1">
                      <Badge className="bg-amber-900/30 text-amber-400 text-[10px]">Pending Approval</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
