"use client"

import type React from "react"
import { useState } from "react"
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
    name: "",
    email: "",
    company: "",
    role: "",
    phone: "",
    location: "",
    dateJoined: "",
    preferredPayment: "",
    language: "",
    travelFrequency: "",
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
    <div className="max-w-5xl mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
        <h1 className="text-2xl font-medium tracking-tighter text-white">My Profile</h1>
        <div className="flex items-center space-x-2 mt-2 md:mt-0">
          <Badge className="bg-white/10 text-white hover:bg-white/20 transition-colors">Business Traveler</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="md:col-span-1">
          <div className="bg-black/30 backdrop-blur-sm rounded-xl border border-white/10 p-6 shadow-sm">
            <div className="flex flex-col items-center">
              <div className="relative mb-4 group">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-2 border-white/10 bg-white/5 flex items-center justify-center">
                  <User className="h-12 w-12 text-white/50" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <Camera className="h-6 w-6 text-white" />
                </div>
              </div>
              <h2 className="text-xl font-medium text-white mb-1">Add Your Name</h2>
              <p className="text-white/70 text-sm mb-4">Your Role</p>

              <div className="w-full space-y-3 mt-2">
                <div className="flex items-center text-white/70">
                  <Mail className="h-4 w-4 mr-2" />
                  <span className="text-sm">your.email@company.com</span>
                </div>
                <div className="flex items-center text-white/70">
                  <Building className="h-4 w-4 mr-2" />
                  <span className="text-sm">Your Company</span>
                </div>
                <div className="flex items-center text-white/70">
                  <Phone className="h-4 w-4 mr-2" />
                  <span className="text-sm">+1 (555) 000-0000</span>
                </div>
                <div className="flex items-center text-white/70">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span className="text-sm">Your Location</span>
                </div>
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
                      placeholder="Enter your full name"
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20 text-white placeholder:text-white/50"
                    />
                  ) : (
                    <div className="flex items-center">
                      <User className="h-4 w-4 text-white/50 mr-2" />
                      <p className="text-white/70">Not set</p>
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
                      placeholder="Enter your email"
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20 text-white placeholder:text-white/50"
                    />
                  ) : (
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 text-white/50 mr-2" />
                      <p className="text-white/70">Not set</p>
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
                      placeholder="Enter your company"
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20 text-white placeholder:text-white/50"
                    />
                  ) : (
                    <div className="flex items-center">
                      <Building className="h-4 w-4 text-white/50 mr-2" />
                      <p className="text-white/70">Not set</p>
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
                      placeholder="Enter your job title"
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20 text-white placeholder:text-white/50"
                    />
                  ) : (
                    <div className="flex items-center">
                      <Briefcase className="h-4 w-4 text-white/50 mr-2" />
                      <p className="text-white/70">Not set</p>
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
                      placeholder="Enter your phone number"
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20 text-white placeholder:text-white/50"
                    />
                  ) : (
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 text-white/50 mr-2" />
                      <p className="text-white/70">Not set</p>
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
                      placeholder="Enter your location"
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20 text-white placeholder:text-white/50"
                    />
                  ) : (
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 text-white/50 mr-2" />
                      <p className="text-white/70">Not set</p>
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
                        placeholder="e.g., Corporate Card"
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20 text-white placeholder:text-white/50"
                      />
                    ) : (
                      <div className="flex items-center">
                        <CreditCard className="h-4 w-4 text-white/50 mr-2" />
                        <p className="text-white/70">Not set</p>
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
                        placeholder="e.g., English, Spanish"
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20 text-white placeholder:text-white/50"
                      />
                    ) : (
                      <div className="flex items-center">
                        <Globe className="h-4 w-4 text-white/50 mr-2" />
                        <p className="text-white/70">Not set</p>
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
                        placeholder="e.g., Monthly"
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20 text-white placeholder:text-white/50"
                      />
                    ) : (
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 text-white/50 mr-2" />
                        <p className="text-white/70">Not set</p>
                      </div>
                    )}
                  </div>

                  <div>
                    <label htmlFor="dateJoined" className="block text-xs font-medium text-white/70 mb-1">
                      Member Since
                    </label>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-white/50 mr-2" />
                      <p className="text-white/70">January 2025</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
