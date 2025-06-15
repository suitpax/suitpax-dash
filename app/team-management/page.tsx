"use client"
import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Search, MapPin, UserPlus, Filter, Download } from "lucide-react"

interface TeamMember {
  id: string
  name: string
  email: string
  role: string
  department: string
  avatar: string
  status: "Active" | "Inactive" | "Pending"
  joinDate: string
  lastActive: string
  phone?: string
  location?: string
  travelBudget?: number
  totalTrips?: number
  permissions: string[]
}

const mockTeamMembers: TeamMember[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah.johnson@company.com",
    role: "Travel Manager",
    department: "Operations",
    avatar: "/images/team/genevieve-mclean.jpeg",
    status: "Active",
    joinDate: "2023-01-15",
    lastActive: "2024-01-15",
    phone: "+1 (555) 123-4567",
    location: "New York, NY",
    travelBudget: 15000,
    totalTrips: 24,
    permissions: ["manage_bookings", "approve_expenses", "view_reports"],
  },
  {
    id: "2",
    name: "Michael Chen",
    email: "michael.chen@company.com",
    role: "Senior Executive",
    department: "Sales",
    avatar: "/images/team/lyle-kauffman.jpeg",
    status: "Active",
    joinDate: "2022-08-20",
    lastActive: "2024-01-14",
    phone: "+1 (555) 234-5678",
    location: "San Francisco, CA",
    travelBudget: 25000,
    totalTrips: 42,
    permissions: ["book_travel", "submit_expenses"],
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    email: "emily.rodriguez@company.com",
    role: "Team Member",
    department: "Marketing",
    avatar: "/images/team/isla-allison.jpeg",
    status: "Active",
    joinDate: "2023-03-10",
    lastActive: "2024-01-13",
    phone: "+1 (555) 345-6789",
    location: "Chicago, IL",
    travelBudget: 8000,
    totalTrips: 12,
    permissions: ["book_travel", "submit_expenses"],
  },
  {
    id: "4",
    name: "David Park",
    email: "david.park@company.com",
    role: "Admin",
    department: "IT",
    avatar: "/images/team/orlando-diggs.jpeg",
    status: "Active",
    joinDate: "2021-11-05",
    lastActive: "2024-01-15",
    phone: "+1 (555) 456-7890",
    location: "Austin, TX",
    travelBudget: 12000,
    totalTrips: 18,
    permissions: ["manage_users", "system_admin", "view_reports"],
  },
  {
    id: "5",
    name: "Lisa Thompson",
    email: "lisa.thompson@company.com",
    role: "Team Member",
    department: "Finance",
    avatar: "/images/team/isobel-fuller.jpeg",
    status: "Pending",
    joinDate: "2024-01-10",
    lastActive: "Never",
    phone: "+1 (555) 567-8901",
    location: "Boston, MA",
    travelBudget: 10000,
    totalTrips: 0,
    permissions: ["book_travel", "submit_expenses"],
  },
]

const roles = ["Travel Manager", "Senior Executive", "Team Member", "Admin"]
const departments = ["Operations", "Sales", "Marketing", "IT", "Finance", "HR", "Legal"]
const statuses = ["Active", "Inactive", "Pending"]

export default function TeamManagementPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(mockTeamMembers)
  const [filteredMembers, setFilteredMembers] = useState<TeamMember[]>(mockTeamMembers)
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRole, setSelectedRole] = useState("all")
  const [selectedDepartment, setSelectedDepartment] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [showInviteDialog, setShowInviteDialog] = useState(false)
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null)

  // New member form state
  const [newMember, setNewMember] = useState({
    name: "",
    email: "",
    role: "Team Member",
    department: "Operations",
    phone: "",
    location: "",
    travelBudget: 10000,
  })

  useEffect(() => {
    // Filter team members based on search and filters
    const filtered = teamMembers.filter((member) => {
      const matchesSearch =
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.department.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesRole = selectedRole === "all" || member.role === selectedRole
      const matchesDepartment = selectedDepartment === "all" || member.department === selectedDepartment
      const matchesStatus = selectedStatus === "all" || member.status === selectedStatus

      return matchesSearch && matchesRole && matchesDepartment && matchesStatus
    })

    setFilteredMembers(filtered)
  }, [teamMembers, searchTerm, selectedRole, selectedDepartment, selectedStatus])

  const handleInviteMember = async () => {
    setLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const member: TeamMember = {
      id: Date.now().toString(),
      ...newMember,
      avatar: "/images/team/scott-clayton.jpeg", // Default avatar
      status: "Pending",
      joinDate: new Date().toISOString().split("T")[0],
      lastActive: "Never",
      totalTrips: 0,
      permissions: ["book_travel", "submit_expenses"],
    }

    setTeamMembers((prev) => [...prev, member])
    setNewMember({
      name: "",
      email: "",
      role: "Team Member",
      department: "Operations",
      phone: "",
      location: "",
      travelBudget: 10000,
    })
    setShowInviteDialog(false)
    setLoading(false)
  }

  const handleRemoveMember = (id: string) => {
    setTeamMembers((prev) => prev.filter((member) => member.id !== id))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "Inactive":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      case "Pending":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      default:
        return "bg-white/10 text-white/70 border-white/20"
    }
  }

  return (
    <div className="min-h-screen bg-black p-3 text-white">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Header */}
        <header className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-sm">
          <h1 className="text-2xl font-light text-white tracking-tight">Team Management</h1>
        </header>

        {/* Search and Filters */}
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
                  <Input
                    placeholder="Search team members..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-11 bg-white/5 border-white/10 text-white placeholder:text-white/30 rounded-xl hover:bg-white/10 focus:ring-1 focus:ring-white/20"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger className="h-11 bg-white/5 border-white/10 text-white rounded-xl hover:bg-white/10 min-w-[120px]">
                    <Filter className="h-4 w-4 text-white/50 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    {roles.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                  <SelectTrigger className="h-11 bg-white/5 border-white/10 text-white rounded-xl hover:bg-white/10 min-w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="h-11 bg-white/5 border-white/10 text-white rounded-xl hover:bg-white/10 min-w-[120px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    {statuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white/5 p-3 rounded-lg border border-white/10">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-medium text-white">{filteredMembers.length} team members</h2>
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
              {teamMembers.filter((m) => m.status === "Active").length} Active
            </Badge>
          </div>
          <div className="flex gap-2">
            <Button className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl h-9 px-3 font-light">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
              <DialogTrigger asChild>
                <Button className="bg-white text-black hover:bg-white/90 rounded-xl h-9 px-3 font-light">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Invite Member
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-black border-white/10 text-white">
                <DialogHeader>
                  <DialogTitle className="text-white font-light">Invite Team Member</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name" className="text-white/70">
                        Full Name
                      </Label>
                      <Input
                        id="name"
                        value={newMember.name}
                        onChange={(e) => setNewMember((prev) => ({ ...prev, name: e.target.value }))}
                        className="bg-white/5 border-white/10 text-white"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-white/70">
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={newMember.email}
                        onChange={(e) => setNewMember((prev) => ({ ...prev, email: e.target.value }))}
                        className="bg-white/5 border-white/10 text-white"
                        placeholder="john@company.com"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="role" className="text-white/70">
                        Role
                      </Label>
                      <Select
                        value={newMember.role}
                        onValueChange={(value) => setNewMember((prev) => ({ ...prev, role: value }))}
                      >
                        <SelectTrigger className="bg-white/5 border-white/10 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {roles.map((role) => (
                            <SelectItem key={role} value={role}>
                              {role}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="department" className="text-white/70">
                        Department
                      </Label>
                      <Select
                        value={newMember.department}
                        onValueChange={(value) => setNewMember((prev) => ({ ...prev, department: value }))}
                      >
                        <SelectTrigger className="bg-white/5 border-white/10 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {departments.map((dept) => (
                            <SelectItem key={dept} value={dept}>
                              {dept}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone" className="text-white/70">
                        Phone (Optional)
                      </Label>
                      <Input
                        id="phone"
                        value={newMember.phone}
                        onChange={(e) => setNewMember((prev) => ({ ...prev, phone: e.target.value }))}
                        className="bg-white/5 border-white/10 text-white"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                    <div>
                      <Label htmlFor="location" className="text-white/70">
                        Location (Optional)
                      </Label>
                      <Input
                        id="location"
                        value={newMember.location}
                        onChange={(e) => setNewMember((prev) => ({ ...prev, location: e.target.value }))}
                        className="bg-white/5 border-white/10 text-white"
                        placeholder="New York, NY"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="budget" className="text-white/70">
                      Travel Budget ($)
                    </Label>
                    <Input
                      id="budget"
                      type="number"
                      value={newMember.travelBudget}
                      onChange={(e) => setNewMember((prev) => ({ ...prev, travelBudget: Number(e.target.value) }))}
                      className="bg-white/5 border-white/10 text-white"
                      placeholder="10000"
                    />
                  </div>
                  <Button
                    onClick={handleInviteMember}
                    disabled={loading || !newMember.name || !newMember.email}
                    className="w-full bg-white text-black hover:bg-white/90 rounded-xl"
                  >
                    {loading ? "Sending Invitation..." : "Send Invitation"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Team Members Grid */}
        <div className="grid grid-cols-1 gap-3">
          {filteredMembers.map((member, index) => (
            <Card
              key={member.id}
              className="bg-white/5 border-white/10 hover:bg-white/10 transition-all"
              style={{ animation: `fadeInUp 0.5s ${index * 0.05}s ease-out forwards`, opacity: 0 }}
            >
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="relative h-12 w-12 rounded-full overflow-hidden bg-white/10 flex-shrink-0">
                      <Image
                        src={member.avatar || "/placeholder.svg"}
                        alt={member.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                        <h3 className="text-lg font-medium text-white truncate">{member.name}</h3>
                        <Badge className={`text-xs w-fit ${getStatusColor(member.status)}`}>{member.status}</Badge>
                      </div>
                      <p className="text-sm text-white/70 truncate">{member.email}</p>
                      <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-white/50">
                        <span>
                          {member.role} • {member.department}
                        </span>
                        {member.location && (
                          <>
                            <span>•</span>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              <span className="truncate">{member.location}</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                    <div className="flex flex-col sm:flex-row gap-2 text-sm text-white/50 w-full sm:w-auto">
                      <span className="whitespace-nowrap">Joined {new Date(member.joinDate).toLocaleDateString()}</span>
                      <span className="hidden sm:inline">•</span>
                      <span className="whitespace-nowrap">Last active {member.lastActive}</span>
                      {member.totalTrips !== undefined && (
                        <>
                          <span className="hidden sm:inline">•</span>
                          <span className="whitespace-nowrap">{member.totalTrips} trips</span>
                        </>
                      )}
                      {member.travelBudget && (
                        <>
                          <span className="hidden sm:inline">•</span>
                          <span className="whitespace-nowrap">Budget: ${member.travelBudget.toLocaleString()}</span>
                        </>
                      )}
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedMember(member)}
                        className="bg-white/5 hover:bg-white/10 border-white/10 text-white rounded-lg h-8 px-3 text-xs flex-1 sm:flex-none"
                      >
                        View Details
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveMember(member.id)}
                        className="bg-red-500/10 hover:bg-red-500/20 border-red-500/20 text-red-400 rounded-lg h-8 px-3 text-xs flex-1 sm:flex-none"
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredMembers.length === 0 && (
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-8 text-center">
              <div className="text-white/50 mb-2">No team members found</div>
              <div className="text-sm text-white/30">Try adjusting your search or filters</div>
            </CardContent>
          </Card>
        )}

        {/* Member Details Dialog */}
        {selectedMember && (
          <Dialog open={!!selectedMember} onOpenChange={() => setSelectedMember(null)}>
            <DialogContent className="bg-black border-white/10 text-white max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-white font-light">Team Member Details</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="relative h-16 w-16 rounded-full overflow-hidden bg-white/10">
                    <Image
                      src={selectedMember.avatar || "/placeholder.svg"}
                      alt={selectedMember.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-medium text-white">{selectedMember.name}</h3>
                    <p className="text-white/70">{selectedMember.email}</p>
                    <Badge className={`mt-1 ${getStatusColor(selectedMember.status)}`}>{selectedMember.status}</Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-white/70 mb-2">Role & Department</h4>
                    <p className="text-white">{selectedMember.role}</p>
                    <p className="text-white/70">{selectedMember.department}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-white/70 mb-2">Contact</h4>
                    {selectedMember.phone && <p className="text-white">{selectedMember.phone}</p>}
                    {selectedMember.location && <p className="text-white/70">{selectedMember.location}</p>}
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-white/70 mb-2">Travel Stats</h4>
                    <p className="text-white">Total Trips: {selectedMember.totalTrips || 0}</p>
                    <p className="text-white/70">Budget: ${selectedMember.travelBudget?.toLocaleString() || "N/A"}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-white/70 mb-2">Account</h4>
                    <p className="text-white">Joined: {new Date(selectedMember.joinDate).toLocaleDateString()}</p>
                    <p className="text-white/70">Last Active: {selectedMember.lastActive}</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-white/70 mb-2">Permissions</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedMember.permissions.map((permission) => (
                      <Badge key={permission} className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                        {permission.replace("_", " ")}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}
