"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PiUsers, PiDownload, PiFunnel, PiUserPlus } from "react-icons/pi"

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

// Empty initial state - users will add their own team members
const mockTeamMembers: TeamMember[] = []

const roles = ["Travel Manager", "Senior Executive", "Team Member", "Admin"]
const departmentsList = ["Operations", "Sales", "Marketing", "IT", "Finance", "HR", "Legal"]
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
  const [searchQuery, setSearchQuery] = useState("")
  const [departments, setSelectedDept] = useState("all")

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
    <div className="min-h-screen bg-background text-foreground p-3">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-light tracking-tighter">Team Management</h1>
            <p className="text-muted-foreground text-sm font-light">Manage your travel team and permissions</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="font-light">
              <PiDownload className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button className="font-light">
              <PiUserPlus className="h-4 w-4 mr-2" />
              Invite Member
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="py-3">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Input
                  placeholder="Search team members..."
                  className="font-light"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <select
                  className="px-3 py-2 text-sm bg-background border border-input rounded-lg font-light"
                  value={departments}
                  onChange={(e) => setSelectedDept(e.target.value)}
                >
                  {departmentsList.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept.charAt(0).toUpperCase() + dept.slice(1)}
                    </option>
                  ))}
                </select>
                <Button variant="outline" className="font-light">
                  <PiFunnel className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Team Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <PiUsers className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-2xl font-light mb-1">0</p>
                <p className="text-xs text-muted-foreground font-light">Total Members</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <PiUserPlus className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-2xl font-light mb-1">0</p>
                <p className="text-xs text-muted-foreground font-light">Active Travelers</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-muted-foreground text-xs">Dept</span>
              </div>
              <div>
                <p className="text-2xl font-light mb-1">0</p>
                <p className="text-xs text-muted-foreground font-light">Departments</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-muted-foreground text-xs">$</span>
              </div>
              <div>
                <p className="text-2xl font-light mb-1">$0</p>
                <p className="text-xs text-muted-foreground font-light">Avg Spend</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Empty State */}
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="font-light tracking-tighter text-lg">Team Members</CardTitle>
          </CardHeader>
          <CardContent className="py-8">
            <div className="text-center">
              <PiUsers className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">No team members yet</h3>
              <p className="text-muted-foreground mb-4">
                Invite your first team member to start managing travel together.
              </p>
              <Button>
                <PiUserPlus className="h-4 w-4 mr-2" />
                Invite Team Member
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Team Members Grid */}
        {/*{filteredMembers.length > 0 && (*/}
        {/*  <div className="space-y-3">*/}
        {/*    {filteredMembers.map((member, index) => (*/}
        {/*      <Card*/}
        {/*        key={member.id}*/}
        {/*        className="bg-white/5 border-white/10 hover:bg-white/10 transition-all"*/}
        {/*        style={{ animation: `fadeInUp 0.5s ${index * 0.05}s ease-out forwards`, opacity: 0 }}*/}
        {/*      >*/}
        {/*        <CardContent className="p-4">*/}
        {/*          <div className="flex flex-col lg:flex-row gap-4">*/}
        {/*            <div className="flex items-center gap-4 flex-1">*/}
        {/*              <div className="relative h-12 w-12 rounded-full overflow-hidden bg-white/10">*/}
        {/*                <Image*/}
        {/*                  src={member.avatar || "/placeholder.svg"}*/}
        {/*                  alt={member.name}*/}
        {/*                  fill*/}
        {/*                  className="object-cover"*/}
        {/*                />*/}
        {/*              </div>*/}
        {/*              <div className="flex-1">*/}
        {/*                <div className="flex items-center gap-2 mb-1">*/}
        {/*                  <h3 className="text-lg font-medium text-white">{member.name}</h3>*/}
        {/*                  <Badge className={`text-xs ${getStatusColor(member.status)}`}>{member.status}</Badge>*/}
        {/*                </div>*/}
        {/*                <p className="text-sm text-white/70">{member.email}</p>*/}
        {/*                <div className="flex items-center gap-4 mt-2 text-xs text-white/50">*/}
        {/*                  <span>*/}
        {/*                    {member.role} • {member.department}*/}
        {/*                  </span>*/}
        {/*                  {member.location && (*/}
        {/*                    <>*/}
        {/*                      <span>•</span>*/}
        {/*                      <div className="flex items-center gap-1">*/}
        {/*                        <MapPin className="h-3 w-3" />*/}
        {/*                        <span>{member.location}</span>*/}
        {/*                      </div>*/}
        {/*                    </>*/}
        {/*                  )}*/}
        {/*                </div>*/}
        {/*              </div>*/}
        {/*            </div>*/}
        {/*            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">*/}
        {/*              <div className="flex flex-col sm:flex-row gap-2 text-sm text-white/50">*/}
        {/*                <span>Joined {new Date(member.joinDate).toLocaleDateString()}</span>*/}
        {/*                <span className="hidden sm:inline">•</span>*/}
        {/*                <span>Last active {member.lastActive}</span>*/}
        {/*                {member.totalTrips !== undefined && (*/}
        {/*                  <>*/}
        {/*                    <span className="hidden sm:inline">•</span>*/}
        {/*                    <span>{member.totalTrips} trips</span>*/}
        {/*                  </>*/}
        {/*                )}*/}
        {/*                {member.travelBudget && (*/}
        {/*                  <>*/}
        {/*                    <span className="hidden sm:inline">•</span>*/}
        {/*                    <span>Budget: ${member.travelBudget.toLocaleString()}</span>*/}
        {/*                  </>*/}
        {/*                )}*/}
        {/*              </div>*/}
        {/*              <div className="flex gap-2">*/}
        {/*                <Button*/}
        {/*                  variant="outline"*/}
        {/*                  size="sm"*/}
        {/*                  onClick={() => setSelectedMember(member)}*/}
        {/*                  className="bg-white/5 hover:bg-white/10 border-white/10 text-white rounded-lg h-8 px-3 text-xs"*/}
        {/*                >*/}
        {/*                  View Details*/}
        {/*                </Button>*/}
        {/*                <Button*/}
        {/*                  variant="outline"*/}
        {/*                  size="sm"*/}
        {/*                  onClick={() => handleRemoveMember(member.id)}*/}
        {/*                  className="bg-red-500/10 hover:bg-red-500/20 border-red-500/20 text-red-400 rounded-lg h-8 px-3 text-xs"*/}
        {/*                >*/}
        {/*                  Remove*/}
        {/*                </Button>*/}
        {/*              </div>*/}
        {/*            </div>*/}
        {/*          </div>*/}
        {/*        </CardContent>*/}
        {/*      </Card>*/}
        {/*    ))}*/}
        {/*  </div>*/}
        {/*)}*/}

        {/* Member Details Dialog */}
        {/*{selectedMember && (*/}
        {/*  <Dialog open={!!selectedMember} onOpenChange={() => setSelectedMember(null)}>*/}
        {/*    <DialogContent className="bg-black border-white/10 text-white max-w-2xl">*/}
        {/*      <DialogHeader>*/}
        {/*        <DialogTitle className="text-white font-light">Team Member Details</DialogTitle>*/}
        {/*      </DialogHeader>*/}
        {/*      <div className="space-y-6">*/}
        {/*        <div className="flex items-center gap-4">*/}
        {/*          <div className="relative h-16 w-16 rounded-full overflow-hidden bg-white/10">*/}
        {/*            <Image*/}
        {/*              src={selectedMember.avatar || "/placeholder.svg"}*/}
        {/*              alt={selectedMember.name}*/}
        {/*              fill*/}
        {/*              className="object-cover"*/}
        {/*            />*/}
        {/*          </div>*/}
        {/*          <div>*/}
        {/*            <h3 className="text-xl font-medium text-white">{selectedMember.name}</h3>*/}
        {/*            <p className="text-white/70">{selectedMember.email}</p>*/}
        {/*            <Badge className={`mt-1 ${getStatusColor(selectedMember.status)}`}>{selectedMember.status}</Badge>*/}
        {/*          </div>*/}
        {/*        </div>*/}

        {/*        <div className="grid grid-cols-2 gap-6">*/}
        {/*          <div>*/}
        {/*            <h4 className="text-sm font-medium text-white/70 mb-2">Role & Department</h4>*/}
        {/*            <p className="text-white">{selectedMember.role}</p>*/}
        {/*            <p className="text-white/70">{selectedMember.department}</p>*/}
        {/*          </div>*/}
        {/*          <div>*/}
        {/*            <h4 className="text-sm font-medium text-white/70 mb-2">Contact</h4>*/}
        {/*            {selectedMember.phone && <p className="text-white">{selectedMember.phone}</p>}*/}
        {/*            {selectedMember.location && <p className="text-white/70">{selectedMember.location}</p>}*/}
        {/*          </div>*/}
        {/*          <div>*/}
        {/*            <h4 className="text-sm font-medium text-white/70 mb-2">Travel Stats</h4>*/}
        {/*            <p className="text-white">Total Trips: {selectedMember.totalTrips || 0}</p>*/}
        {/*            <p className="text-white/70">Budget: ${selectedMember.travelBudget?.toLocaleString() || "N/A"}</p>*/}
        {/*          </div>*/}
        {/*          <div>*/}
        {/*            <h4 className="text-sm font-medium text-white/70 mb-2">Account</h4>*/}
        {/*            <p className="text-white">Joined: {new Date(selectedMember.joinDate).toLocaleDateString()}</p>*/}
        {/*            <p className="text-white/70">Last Active: {selectedMember.lastActive}</p>*/}
        {/*          </div>*/}
        {/*        </div>*/}

        {/*        <div>*/}
        {/*          <h4 className="text-sm font-medium text-white/70 mb-2">Permissions</h4>*/}
        {/*          <div className="flex flex-wrap gap-2">*/}
        {/*            {selectedMember.permissions.map((permission) => (*/}
        {/*              <Badge key={permission} className="bg-blue-500/20 text-blue-400 border-blue-500/30">*/}
        {/*                {permission.replace("_", " ")}*/}
        {/*              </Badge>*/}
        {/*            ))}*/}
        {/*          </div>*/}
        {/*        </div>*/}
        {/*      </div>*/}
        {/*    </DialogContent>*/}
        {/*  </Dialog>*/}
        {/*)}*/}
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
