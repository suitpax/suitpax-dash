"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  User,
  Building2,
  Save,
  Edit,
  Camera,
  Mail,
  Phone,
  CreditCard,
  ArrowRight,
  MapPin,
  Globe,
  Shield,
  Bell,
  Settings,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface UserProfile {
  firstName: string
  lastName: string
  email: string
  phone: string
  profileImage: string | null
  companyName: string
  companyLogo: string | null
  jobTitle: string
  department: string
  employeeId: string
  location: string
  timezone: string
  preferredAirlines: string[]
  seatPreference: string
  mealPreference: string
  hotelChain: string[]
  roomPreference: string
  travelBudgetLimit: string
  expenseCategories: string[]
  approvalRequired: boolean
  defaultCurrency: string
  emailNotifications: boolean
  smsNotifications: boolean
  pushNotifications: boolean
  currentPlan: string
  memberSince: string
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("personal")

  useEffect(() => {
    const savedProfile = localStorage.getItem("userProfile")
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile))
    } else {
      // Default profile for Alberto
      setProfile({
        firstName: "Alberto",
        lastName: "Suitpax",
        email: "alberto@suitpax.com",
        phone: "+1 (555) 123-4567",
        profileImage:
          "https://ferf1mheo22r9ira.public.blob.vercel-storage.com/avatar-01-n0x8HFv8EUetf9z6ht0wScJKoTHqf8.png",
        companyName: "Suitpax",
        companyLogo: null,
        jobTitle: "Founder & CEO",
        department: "Executive",
        employeeId: "SP001",
        location: "San Francisco, CA",
        timezone: "PST",
        preferredAirlines: ["American Airlines", "Delta"],
        seatPreference: "aisle",
        mealPreference: "regular",
        hotelChain: ["Marriott", "Hilton"],
        roomPreference: "king",
        travelBudgetLimit: "$10000",
        expenseCategories: ["meals", "transportation", "accommodation"],
        approvalRequired: false,
        defaultCurrency: "USD",
        emailNotifications: true,
        smsNotifications: false,
        pushNotifications: true,
        currentPlan: "Enterprise",
        memberSince: "2024",
      })
    }
  }, [])

  const updateProfile = (field: keyof UserProfile, value: any) => {
    if (!profile) return
    setProfile((prev) => (prev ? { ...prev, [field]: value } : null))
  }

  const handleImageUpload = (field: "profileImage" | "companyLogo", file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      updateProfile(field, e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const saveProfile = async () => {
    if (!profile) return

    setIsSaving(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    localStorage.setItem("userProfile", JSON.stringify(profile))
    setIsEditing(false)
    setIsSaving(false)
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white font-light">Loading profile...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white p-3">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-light tracking-tighter text-white mb-2">Profile Settings</h1>
            <p className="text-white/70 font-light">Manage your account and travel preferences</p>
          </div>
          <div className="flex items-center space-x-3">
            {isEditing ? (
              <>
                <Button
                  onClick={() => setIsEditing(false)}
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10 font-light"
                >
                  Cancel
                </Button>
                <Button
                  onClick={saveProfile}
                  disabled={isSaving}
                  className="bg-white text-black hover:bg-white/90 font-light"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)} className="bg-white text-black hover:bg-white/90 font-light">
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            )}
          </div>
        </div>

        {/* Profile Overview Card */}
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center space-y-6 md:space-y-0 md:space-x-8">
              <div className="relative">
                <div className="w-32 h-32 rounded-2xl bg-white/10 border-2 border-white/20 overflow-hidden">
                  {profile.profileImage ? (
                    <Image
                      src={profile.profileImage || "/placeholder.svg"}
                      alt="Profile"
                      width={128}
                      height={128}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User className="h-12 w-12 text-white/50" />
                    </div>
                  )}
                </div>
                {isEditing && (
                  <label className="absolute -bottom-2 -right-2 bg-white text-black p-3 rounded-full cursor-pointer hover:bg-white/90 transition-colors">
                    <Camera className="h-5 w-5" />
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => e.target.files?.[0] && handleImageUpload("profileImage", e.target.files[0])}
                    />
                  </label>
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-3xl font-light text-white">
                    {profile.firstName} {profile.lastName}
                  </h2>
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30 rounded-full font-light">
                    Active
                  </Badge>
                </div>

                <p className="text-white/70 text-lg font-light mb-3">
                  {profile.jobTitle} at {profile.companyName}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-white/60">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4" />
                    <span className="font-light">{profile.email}</span>
                  </div>
                  {profile.phone && (
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4" />
                      <span className="font-light">{profile.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4" />
                    <span className="font-light">{profile.location}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Globe className="h-4 w-4" />
                    <span className="font-light">{profile.timezone}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end space-y-3">
                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 rounded-full font-light">
                  {profile.currentPlan}
                </Badge>
                <div className="text-right">
                  <p className="text-white/50 text-xs font-light">Member since</p>
                  <p className="text-white/70 text-sm font-light">{profile.memberSince}</p>
                </div>
                <Link href="/plans">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-white/20 text-white hover:bg-white/10 font-light"
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    Manage Plan
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 bg-white/5 border border-white/10">
            <TabsTrigger
              value="personal"
              className="data-[state=active]:bg-white data-[state=active]:text-black font-light"
            >
              <User className="h-4 w-4 mr-2" />
              Personal
            </TabsTrigger>
            <TabsTrigger
              value="company"
              className="data-[state=active]:bg-white data-[state=active]:text-black font-light"
            >
              <Building2 className="h-4 w-4 mr-2" />
              Company
            </TabsTrigger>
            <TabsTrigger
              value="travel"
              className="data-[state=active]:bg-white data-[state=active]:text-black font-light"
            >
              <Globe className="h-4 w-4 mr-2" />
              Travel
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="data-[state=active]:bg-white data-[state=active]:text-black font-light"
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="space-y-6">
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white font-light tracking-tighter">Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-white font-light">First Name</Label>
                    <Input
                      value={profile.firstName}
                      onChange={(e) => updateProfile("firstName", e.target.value)}
                      disabled={!isEditing}
                      className="bg-white/5 border-white/10 text-white disabled:opacity-50 font-light"
                    />
                  </div>
                  <div>
                    <Label className="text-white font-light">Last Name</Label>
                    <Input
                      value={profile.lastName}
                      onChange={(e) => updateProfile("lastName", e.target.value)}
                      disabled={!isEditing}
                      className="bg-white/5 border-white/10 text-white disabled:opacity-50 font-light"
                    />
                  </div>
                  <div>
                    <Label className="text-white font-light">Email</Label>
                    <Input
                      value={profile.email}
                      onChange={(e) => updateProfile("email", e.target.value)}
                      disabled={!isEditing}
                      className="bg-white/5 border-white/10 text-white disabled:opacity-50 font-light"
                    />
                  </div>
                  <div>
                    <Label className="text-white font-light">Phone</Label>
                    <Input
                      value={profile.phone}
                      onChange={(e) => updateProfile("phone", e.target.value)}
                      disabled={!isEditing}
                      className="bg-white/5 border-white/10 text-white disabled:opacity-50 font-light"
                    />
                  </div>
                  <div>
                    <Label className="text-white font-light">Location</Label>
                    <Input
                      value={profile.location}
                      onChange={(e) => updateProfile("location", e.target.value)}
                      disabled={!isEditing}
                      className="bg-white/5 border-white/10 text-white disabled:opacity-50 font-light"
                    />
                  </div>
                  <div>
                    <Label className="text-white font-light">Timezone</Label>
                    <Select
                      value={profile.timezone}
                      onValueChange={(value) => updateProfile("timezone", value)}
                      disabled={!isEditing}
                    >
                      <SelectTrigger className="bg-white/5 border-white/10 text-white font-light">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PST">PST - Pacific Standard Time</SelectItem>
                        <SelectItem value="EST">EST - Eastern Standard Time</SelectItem>
                        <SelectItem value="CST">CST - Central Standard Time</SelectItem>
                        <SelectItem value="MST">MST - Mountain Standard Time</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="company" className="space-y-6">
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white font-light tracking-tighter">Company Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-white font-light">Company Name</Label>
                    <Input
                      value={profile.companyName}
                      onChange={(e) => updateProfile("companyName", e.target.value)}
                      disabled={!isEditing}
                      className="bg-white/5 border-white/10 text-white disabled:opacity-50 font-light"
                    />
                  </div>
                  <div>
                    <Label className="text-white font-light">Job Title</Label>
                    <Input
                      value={profile.jobTitle}
                      onChange={(e) => updateProfile("jobTitle", e.target.value)}
                      disabled={!isEditing}
                      className="bg-white/5 border-white/10 text-white disabled:opacity-50 font-light"
                    />
                  </div>
                  <div>
                    <Label className="text-white font-light">Department</Label>
                    <Input
                      value={profile.department}
                      onChange={(e) => updateProfile("department", e.target.value)}
                      disabled={!isEditing}
                      className="bg-white/5 border-white/10 text-white disabled:opacity-50 font-light"
                    />
                  </div>
                  <div>
                    <Label className="text-white font-light">Employee ID</Label>
                    <Input
                      value={profile.employeeId}
                      onChange={(e) => updateProfile("employeeId", e.target.value)}
                      disabled={!isEditing}
                      className="bg-white/5 border-white/10 text-white disabled:opacity-50 font-light"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="travel" className="space-y-6">
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white font-light tracking-tighter">Travel Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="text-white font-light mb-3 block">Preferred Airlines</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {[
                      "American Airlines",
                      "Delta",
                      "United",
                      "British Airways",
                      "Lufthansa",
                      "Air France",
                      "Emirates",
                      "Qatar Airways",
                    ].map((airline) => (
                      <Badge
                        key={airline}
                        onClick={() => {
                          if (!isEditing) return
                          const current = profile.preferredAirlines
                          const updated = current.includes(airline)
                            ? current.filter((a) => a !== airline)
                            : [...current, airline]
                          updateProfile("preferredAirlines", updated)
                        }}
                        className={`cursor-pointer text-center justify-center rounded-full font-light ${
                          profile.preferredAirlines.includes(airline)
                            ? "bg-white text-black"
                            : "bg-white/10 text-white hover:bg-white/20"
                        } ${!isEditing ? "cursor-default" : ""}`}
                      >
                        {airline}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-white font-light">Seat Preference</Label>
                    <Select
                      value={profile.seatPreference}
                      onValueChange={(value) => updateProfile("seatPreference", value)}
                      disabled={!isEditing}
                    >
                      <SelectTrigger className="bg-white/5 border-white/10 text-white font-light">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="window">Window</SelectItem>
                        <SelectItem value="aisle">Aisle</SelectItem>
                        <SelectItem value="middle">Middle</SelectItem>
                        <SelectItem value="no-preference">No Preference</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-white font-light">Meal Preference</Label>
                    <Select
                      value={profile.mealPreference}
                      onValueChange={(value) => updateProfile("mealPreference", value)}
                      disabled={!isEditing}
                    >
                      <SelectTrigger className="bg-white/5 border-white/10 text-white font-light">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="regular">Regular</SelectItem>
                        <SelectItem value="vegetarian">Vegetarian</SelectItem>
                        <SelectItem value="vegan">Vegan</SelectItem>
                        <SelectItem value="kosher">Kosher</SelectItem>
                        <SelectItem value="halal">Halal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white font-light tracking-tighter">
                  <Bell className="h-5 w-5 inline mr-2" />
                  Notification Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white font-light">Email Notifications</Label>
                    <p className="text-white/60 text-sm font-light">Receive updates via email</p>
                  </div>
                  <Switch
                    checked={profile.emailNotifications}
                    onCheckedChange={(checked) => updateProfile("emailNotifications", checked)}
                    disabled={!isEditing}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white font-light">SMS Notifications</Label>
                    <p className="text-white/60 text-sm font-light">Receive updates via SMS</p>
                  </div>
                  <Switch
                    checked={profile.smsNotifications}
                    onCheckedChange={(checked) => updateProfile("smsNotifications", checked)}
                    disabled={!isEditing}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white font-light">Push Notifications</Label>
                    <p className="text-white/60 text-sm font-light">Receive push notifications</p>
                  </div>
                  <Switch
                    checked={profile.pushNotifications}
                    onCheckedChange={(checked) => updateProfile("pushNotifications", checked)}
                    disabled={!isEditing}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white font-light tracking-tighter">
                  <Shield className="h-5 w-5 inline mr-2" />
                  Business Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-white font-light">Travel Budget Limit</Label>
                    <Input
                      value={profile.travelBudgetLimit}
                      onChange={(e) => updateProfile("travelBudgetLimit", e.target.value)}
                      disabled={!isEditing}
                      className="bg-white/5 border-white/10 text-white disabled:opacity-50 font-light"
                      placeholder="e.g., $5000"
                    />
                  </div>

                  <div>
                    <Label className="text-white font-light">Default Currency</Label>
                    <Select
                      value={profile.defaultCurrency}
                      onValueChange={(value) => updateProfile("defaultCurrency", value)}
                      disabled={!isEditing}
                    >
                      <SelectTrigger className="bg-white/5 border-white/10 text-white font-light">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD - US Dollar</SelectItem>
                        <SelectItem value="EUR">EUR - Euro</SelectItem>
                        <SelectItem value="GBP">GBP - British Pound</SelectItem>
                        <SelectItem value="JPY">JPY - Japanese Yen</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white font-light">Require Approval for Bookings</Label>
                    <p className="text-white/60 text-sm font-light">All travel bookings need manager approval</p>
                  </div>
                  <Switch
                    checked={profile.approvalRequired}
                    onCheckedChange={(checked) => updateProfile("approvalRequired", checked)}
                    disabled={!isEditing}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
