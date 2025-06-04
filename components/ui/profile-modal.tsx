"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  User,
  Mail,
  Phone,
  Building,
  MapPin,
  Calendar,
  Edit3,
  Save,
  X,
  Camera,
  Settings,
  Shield,
  Bell,
  CreditCard,
  LogOut,
  ChevronRight,
} from "lucide-react"

interface ProfileModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [profileData, setProfileData] = useState({
    firstName: "Alberto",
    lastName: "Zurano",
    email: "alberto@suitpax.com",
    phone: "+34 600 123 456",
    company: "Suitpax",
    role: "Travel Manager",
    location: "Madrid, Spain",
    bio: "Passionate about optimizing business travel experiences through technology and innovation.",
    avatar: "/images/ai-agent-avatar.jpeg",
    joinDate: "January 2024",
    plan: "Professional",
    status: "Active",
  })

  const handleSave = () => {
    setIsEditing(false)
    // Here you would typically save to your backend
  }

  const quickActions = [
    { icon: Settings, label: "Account Settings", href: "/settings" },
    { icon: Shield, label: "Security", href: "/settings?tab=security" },
    { icon: Bell, label: "Notifications", href: "/settings?tab=notifications" },
    { icon: CreditCard, label: "Billing", href: "/settings?tab=billing" },
  ]

  const stats = [
    { label: "Trips Booked", value: "47", change: "+12%" },
    { label: "Total Savings", value: "€2,340", change: "+8%" },
    { label: "Team Members", value: "12", change: "+3" },
    { label: "Active Policies", value: "5", change: "0" },
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden bg-black border-white/10 text-white">
        <DialogHeader className="border-b border-white/10 pb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold text-white">Profile</DialogTitle>
            <div className="flex items-center gap-2">
              {!isEditing ? (
                <Button
                  onClick={() => setIsEditing(true)}
                  size="sm"
                  className="bg-white/10 text-white hover:bg-white/20"
                >
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button
                    onClick={() => setIsEditing(false)}
                    size="sm"
                    variant="outline"
                    className="border-white/20 text-white/70 hover:text-white"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                  <Button onClick={handleSave} size="sm" className="bg-white text-black hover:bg-white/90">
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                </div>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-white/5 border border-white/10">
              <TabsTrigger value="overview" className="data-[state=active]:bg-white/10 data-[state=active]:text-white">
                Overview
              </TabsTrigger>
              <TabsTrigger value="details" className="data-[state=active]:bg-white/10 data-[state=active]:text-white">
                Details
              </TabsTrigger>
              <TabsTrigger value="activity" className="data-[state=active]:bg-white/10 data-[state=active]:text-white">
                Activity
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6 space-y-6">
              {/* Profile Header */}
              <div className="flex items-start gap-6">
                <div className="relative">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={profileData.avatar || "/placeholder.svg"} />
                    <AvatarFallback className="bg-white/10 text-white text-2xl">
                      {profileData.firstName[0]}
                      {profileData.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <button className="absolute -bottom-2 -right-2 bg-white/10 hover:bg-white/20 rounded-full p-2 border border-white/20">
                      <Camera className="h-4 w-4 text-white" />
                    </button>
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl font-bold text-white">
                      {profileData.firstName} {profileData.lastName}
                    </h2>
                    <Badge className="bg-emerald-500/20 text-emerald-400">{profileData.status}</Badge>
                  </div>
                  <p className="text-white/70 mb-1">
                    {profileData.role} at {profileData.company}
                  </p>
                  <p className="text-white/50 text-sm flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {profileData.location}
                  </p>
                  <p className="text-white/50 text-sm flex items-center gap-1 mt-1">
                    <Calendar className="h-4 w-4" />
                    Joined {profileData.joinDate}
                  </p>
                </div>

                <div className="text-right">
                  <Badge className="bg-purple-500/20 text-purple-400 mb-2">{profileData.plan} Plan</Badge>
                  <p className="text-white/50 text-sm">€89/month</p>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                  <Card key={index} className="bg-white/5 border-white/10">
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                      <div className="text-sm text-white/70 mb-1">{stat.label}</div>
                      <div className="text-xs text-emerald-400">{stat.change}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Quick Actions */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-3">
                  {quickActions.map((action, index) => (
                    <button
                      key={index}
                      className="flex items-center gap-3 p-4 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-colors"
                    >
                      <action.icon className="h-5 w-5 text-white/70" />
                      <span className="text-white font-medium">{action.label}</span>
                      <ChevronRight className="h-4 w-4 text-white/50 ml-auto" />
                    </button>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="details" className="mt-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-white">First Name</Label>
                  {isEditing ? (
                    <Input
                      value={profileData.firstName}
                      onChange={(e) => setProfileData((prev) => ({ ...prev, firstName: e.target.value }))}
                      className="bg-white/5 border-white/10 text-white mt-2"
                    />
                  ) : (
                    <div className="mt-2 p-3 bg-white/5 rounded-lg border border-white/10 text-white">
                      {profileData.firstName}
                    </div>
                  )}
                </div>

                <div>
                  <Label className="text-white">Last Name</Label>
                  {isEditing ? (
                    <Input
                      value={profileData.lastName}
                      onChange={(e) => setProfileData((prev) => ({ ...prev, lastName: e.target.value }))}
                      className="bg-white/5 border-white/10 text-white mt-2"
                    />
                  ) : (
                    <div className="mt-2 p-3 bg-white/5 rounded-lg border border-white/10 text-white">
                      {profileData.lastName}
                    </div>
                  )}
                </div>

                <div>
                  <Label className="text-white">Email</Label>
                  <div className="mt-2 p-3 bg-white/5 rounded-lg border border-white/10 text-white flex items-center gap-2">
                    <Mail className="h-4 w-4 text-white/50" />
                    {profileData.email}
                  </div>
                </div>

                <div>
                  <Label className="text-white">Phone</Label>
                  {isEditing ? (
                    <Input
                      value={profileData.phone}
                      onChange={(e) => setProfileData((prev) => ({ ...prev, phone: e.target.value }))}
                      className="bg-white/5 border-white/10 text-white mt-2"
                    />
                  ) : (
                    <div className="mt-2 p-3 bg-white/5 rounded-lg border border-white/10 text-white flex items-center gap-2">
                      <Phone className="h-4 w-4 text-white/50" />
                      {profileData.phone}
                    </div>
                  )}
                </div>

                <div>
                  <Label className="text-white">Company</Label>
                  {isEditing ? (
                    <Input
                      value={profileData.company}
                      onChange={(e) => setProfileData((prev) => ({ ...prev, company: e.target.value }))}
                      className="bg-white/5 border-white/10 text-white mt-2"
                    />
                  ) : (
                    <div className="mt-2 p-3 bg-white/5 rounded-lg border border-white/10 text-white flex items-center gap-2">
                      <Building className="h-4 w-4 text-white/50" />
                      {profileData.company}
                    </div>
                  )}
                </div>

                <div>
                  <Label className="text-white">Role</Label>
                  {isEditing ? (
                    <Input
                      value={profileData.role}
                      onChange={(e) => setProfileData((prev) => ({ ...prev, role: e.target.value }))}
                      className="bg-white/5 border-white/10 text-white mt-2"
                    />
                  ) : (
                    <div className="mt-2 p-3 bg-white/5 rounded-lg border border-white/10 text-white flex items-center gap-2">
                      <User className="h-4 w-4 text-white/50" />
                      {profileData.role}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <Label className="text-white">Bio</Label>
                {isEditing ? (
                  <Textarea
                    value={profileData.bio}
                    onChange={(e) => setProfileData((prev) => ({ ...prev, bio: e.target.value }))}
                    className="bg-white/5 border-white/10 text-white mt-2"
                    rows={4}
                  />
                ) : (
                  <div className="mt-2 p-3 bg-white/5 rounded-lg border border-white/10 text-white">
                    {profileData.bio}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="activity" className="mt-6 space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  {[
                    {
                      action: "Booked flight to London",
                      time: "2 hours ago",
                      details: "LHR - Business Class",
                      type: "flight",
                    },
                    {
                      action: "Updated travel policy",
                      time: "1 day ago",
                      details: "Modified expense limits",
                      type: "policy",
                    },
                    {
                      action: "Added team member",
                      time: "3 days ago",
                      details: "Maria Garcia joined",
                      type: "team",
                    },
                    {
                      action: "Generated expense report",
                      time: "1 week ago",
                      details: "Q4 2024 Summary",
                      type: "report",
                    },
                  ].map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-4 bg-white/5 rounded-lg border border-white/10"
                    >
                      <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-white font-medium">{activity.action}</p>
                        <p className="text-white/70 text-sm">{activity.details}</p>
                      </div>
                      <div className="text-white/50 text-sm">{activity.time}</div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Footer */}
        <div className="border-t border-white/10 pt-4 flex justify-between items-center">
          <Button variant="outline" className="border-red-500/50 text-red-400 hover:bg-red-500/10">
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>

          <div className="text-white/50 text-sm">Last updated: {new Date().toLocaleDateString()}</div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
