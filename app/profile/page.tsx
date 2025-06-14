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
import { User, Building2, Upload, Save, Edit, Camera, Mail, Phone, CreditCard, ArrowRight } from "lucide-react"
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
      // Default profile
      setProfile({
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@company.com",
        phone: "+1 (555) 123-4567",
        profileImage: null,
        companyName: "Acme Corporation",
        companyLogo: null,
        jobTitle: "Senior Manager",
        department: "Sales",
        employeeId: "EMP001",
        preferredAirlines: ["American Airlines", "Delta"],
        seatPreference: "aisle",
        mealPreference: "regular",
        hotelChain: ["Marriott", "Hilton"],
        roomPreference: "king",
        travelBudgetLimit: "$5000",
        expenseCategories: ["meals", "transportation", "accommodation"],
        approvalRequired: true,
        defaultCurrency: "USD",
        emailNotifications: true,
        smsNotifications: false,
        pushNotifications: true,
        currentPlan: "Professional",
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
        <div className="text-white">Loading profile...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Profile Settings</h1>
            <p className="text-white/70">Manage your account and travel preferences</p>
          </div>
          <div className="flex items-center space-x-3">
            {isEditing ? (
              <>
                <Button
                  onClick={() => setIsEditing(false)}
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  Cancel
                </Button>
                <Button onClick={saveProfile} disabled={isSaving} className="bg-white text-black hover:bg-white/90">
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)} className="bg-white text-black hover:bg-white/90">
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            )}
          </div>
        </div>

        {/* Profile Overview Card */}
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-white/10 border-2 border-white/20 overflow-hidden">
                  {profile.profileImage ? (
                    <Image
                      src={profile.profileImage || "/placeholder.svg"}
                      alt="Profile"
                      width={96}
                      height={96}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User className="h-8 w-8 text-white/50" />
                    </div>
                  )}
                </div>
                {isEditing && (
                  <label className="absolute -bottom-2 -right-2 bg-white text-black p-2 rounded-full cursor-pointer hover:bg-white/90">
                    <Camera className="h-4 w-4" />
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
                <h2 className="text-2xl font-bold text-white">
                  {profile.firstName} {profile.lastName}
                </h2>
                <p className="text-white/70">
                  {profile.jobTitle} at {profile.companyName}
                </p>
                <div className="flex items-center space-x-4 mt-2 text-sm text-white/60">
                  <div className="flex items-center space-x-1">
                    <Mail className="h-4 w-4" />
                    <span>{profile.email}</span>
                  </div>
                  {profile.phone && (
                    <div className="flex items-center space-x-1">
                      <Phone className="h-4 w-4" />
                      <span>{profile.phone}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col items-end space-y-2">
                <div className="flex items-center space-x-2">
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30 rounded-full">Active</Badge>
                  <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 rounded-full">
                    {profile.currentPlan}
                  </Badge>
                </div>
                <Link href="/plans">
                  <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
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
          <TabsList className="grid w-full grid-cols-4 bg-white/5">
            <TabsTrigger value="personal" className="data-[state=active]:bg-white data-[state=active]:text-black">
              Personal
            </TabsTrigger>
            <TabsTrigger value="company" className="data-[state=active]:bg-white data-[state=active]:text-black">
              Company
            </TabsTrigger>
            <TabsTrigger value="travel" className="data-[state=active]:bg-white data-[state=active]:text-black">
              Travel
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-white data-[state=active]:text-black">
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="space-y-6">
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white">First Name</Label>
                    <Input
                      value={profile.firstName}
                      onChange={(e) => updateProfile("firstName", e.target.value)}
                      disabled={!isEditing}
                      className="bg-white/5 border-white/10 text-white disabled:opacity-50"
                    />
                  </div>
                  <div>
                    <Label className="text-white">Last Name</Label>
                    <Input
                      value={profile.lastName}
                      onChange={(e) => updateProfile("lastName", e.target.value)}
                      disabled={!isEditing}
                      className="bg-white/5 border-white/10 text-white disabled:opacity-50"
                    />
                  </div>
                  <div>
                    <Label className="text-white">Email</Label>
                    <Input
                      value={profile.email}
                      onChange={(e) => updateProfile("email", e.target.value)}
                      disabled={!isEditing}
                      className="bg-white/5 border-white/10 text-white disabled:opacity-50"
                    />
                  </div>
                  <div>
                    <Label className="text-white">Phone</Label>
                    <Input
                      value={profile.phone}
                      onChange={(e) => updateProfile("phone", e.target.value)}
                      disabled={!isEditing}
                      className="bg-white/5 border-white/10 text-white disabled:opacity-50"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="company" className="space-y-6">
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Company Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-center mb-6">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-lg bg-white/10 border-2 border-dashed border-white/30 flex items-center justify-center overflow-hidden">
                      {profile.companyLogo ? (
                        <Image
                          src={profile.companyLogo || "/placeholder.svg"}
                          alt="Company Logo"
                          width={96}
                          height={96}
                          className="object-cover"
                        />
                      ) : (
                        <Building2 className="h-8 w-8 text-white/50" />
                      )}
                    </div>
                    {isEditing && (
                      <label className="absolute -bottom-2 -right-2 bg-white text-black p-2 rounded-full cursor-pointer hover:bg-white/90">
                        <Upload className="h-4 w-4" />
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={(e) => e.target.files?.[0] && handleImageUpload("companyLogo", e.target.files[0])}
                        />
                      </label>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white">Company Name</Label>
                    <Input
                      value={profile.companyName}
                      onChange={(e) => updateProfile("companyName", e.target.value)}
                      disabled={!isEditing}
                      className="bg-white/5 border-white/10 text-white disabled:opacity-50"
                    />
                  </div>
                  <div>
                    <Label className="text-white">Job Title</Label>
                    <Input
                      value={profile.jobTitle}
                      onChange={(e) => updateProfile("jobTitle", e.target.value)}
                      disabled={!isEditing}
                      className="bg-white/5 border-white/10 text-white disabled:opacity-50"
                    />
                  </div>
                  <div>
                    <Label className="text-white">Department</Label>
                    <Input
                      value={profile.department}
                      onChange={(e) => updateProfile("department", e.target.value)}
                      disabled={!isEditing}
                      className="bg-white/5 border-white/10 text-white disabled:opacity-50"
                    />
                  </div>
                  <div>
                    <Label className="text-white">Employee ID</Label>
                    <Input
                      value={profile.employeeId}
                      onChange={(e) => updateProfile("employeeId", e.target.value)}
                      disabled={!isEditing}
                      className="bg-white/5 border-white/10 text-white disabled:opacity-50"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="travel" className="space-y-6">
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Travel Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="text-white">Preferred Airlines</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
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
                        className={`cursor-pointer text-center justify-center rounded-full ${
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white">Seat Preference</Label>
                    <Select
                      value={profile.seatPreference}
                      onValueChange={(value) => updateProfile("seatPreference", value)}
                      disabled={!isEditing}
                    >
                      <SelectTrigger className="bg-white/5 border-white/10 text-white">
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
                    <Label className="text-white">Meal Preference</Label>
                    <Select
                      value={profile.mealPreference}
                      onValueChange={(value) => updateProfile("mealPreference", value)}
                      disabled={!isEditing}
                    >
                      <SelectTrigger className="bg-white/5 border-white/10 text-white">
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
                <CardTitle className="text-white">Notification Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white">Email Notifications</Label>
                    <p className="text-white/60 text-sm">Receive updates via email</p>
                  </div>
                  <Switch
                    checked={profile.emailNotifications}
                    onCheckedChange={(checked) => updateProfile("emailNotifications", checked)}
                    disabled={!isEditing}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white">SMS Notifications</Label>
                    <p className="text-white/60 text-sm">Receive updates via SMS</p>
                  </div>
                  <Switch
                    checked={profile.smsNotifications}
                    onCheckedChange={(checked) => updateProfile("smsNotifications", checked)}
                    disabled={!isEditing}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white">Push Notifications</Label>
                    <p className="text-white/60 text-sm">Receive push notifications</p>
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
                <CardTitle className="text-white">Business Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white">Travel Budget Limit</Label>
                    <Input
                      value={profile.travelBudgetLimit}
                      onChange={(e) => updateProfile("travelBudgetLimit", e.target.value)}
                      disabled={!isEditing}
                      className="bg-white/5 border-white/10 text-white disabled:opacity-50"
                      placeholder="e.g., $5000"
                    />
                  </div>

                  <div>
                    <Label className="text-white">Default Currency</Label>
                    <Select
                      value={profile.defaultCurrency}
                      onValueChange={(value) => updateProfile("defaultCurrency", value)}
                      disabled={!isEditing}
                    >
                      <SelectTrigger className="bg-white/5 border-white/10 text-white">
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
                    <Label className="text-white">Require Approval for Bookings</Label>
                    <p className="text-white/60 text-sm">All travel bookings need manager approval</p>
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
