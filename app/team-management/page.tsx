"use client"

import { useState } from "react"
import Layout from "@/components/ui/layout"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, UserPlus, Filter, MoreHorizontal, Users } from "lucide-react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Define types for team members and permissions
interface TeamMember {
  id: string
  name: string
  email: string
  role: string
  department: string
  avatar: string
  status: "active" | "invited" | "inactive"
  lastActive: string
  permissions: Permission[]
}

interface Permission {
  id: string
  name: string
  description: string
  enabled: boolean
}

interface Activity {
  id: string
  user: string
  userAvatar: string
  action: string
  target: string
  date: string
}

// Sample data for team members
const teamMembers: TeamMember[] = [
  {
    id: "1",
    name: "Genevieve McLean",
    email: "genevieve@acmecorp.com",
    role: "Admin",
    department: "Operations",
    avatar: "/images/team/genevieve-mclean.jpeg",
    status: "active",
    lastActive: "Just now",
    permissions: [
      { id: "p1", name: "View Dashboard", description: "Access to main dashboard", enabled: true },
      { id: "p2", name: "Manage Team", description: "Add, edit, remove team members", enabled: true },
      { id: "p3", name: "Approve Expenses", description: "Approve expense reports", enabled: true },
      { id: "p4", name: "Book Travel", description: "Book flights and accommodations", enabled: true },
      { id: "p5", name: "Access Reports", description: "View and export reports", enabled: true },
    ],
  },
  {
    id: "2",
    name: "Cohen Lozano",
    email: "cohen@acmecorp.com",
    role: "Travel Manager",
    department: "Operations",
    avatar: "/images/team/cohen-lozano.jpeg",
    status: "active",
    lastActive: "5 minutes ago",
    permissions: [
      { id: "p1", name: "View Dashboard", description: "Access to main dashboard", enabled: true },
      { id: "p2", name: "Manage Team", description: "Add, edit, remove team members", enabled: false },
      { id: "p3", name: "Approve Expenses", description: "Approve expense reports", enabled: true },
      { id: "p4", name: "Book Travel", description: "Book flights and accommodations", enabled: true },
      { id: "p5", name: "Access Reports", description: "View and export reports", enabled: true },
    ],
  },
  {
    id: "3",
    name: "Orlando Diggs",
    email: "orlando@acmecorp.com",
    role: "Finance Manager",
    department: "Finance",
    avatar: "/images/team/orlando-diggs.jpeg",
    status: "active",
    lastActive: "1 hour ago",
    permissions: [
      { id: "p1", name: "View Dashboard", description: "Access to main dashboard", enabled: true },
      { id: "p2", name: "Manage Team", description: "Add, edit, remove team members", enabled: false },
      { id: "p3", name: "Approve Expenses", description: "Approve expense reports", enabled: true },
      { id: "p4", name: "Book Travel", description: "Book flights and accommodations", enabled: false },
      { id: "p5", name: "Access Reports", description: "View and export reports", enabled: true },
    ],
  },
  {
    id: "4",
    name: "Ammar Foley",
    email: "ammar@acmecorp.com",
    role: "Team Member",
    department: "Sales",
    avatar: "/images/team/ammar-foley.jpeg",
    status: "active",
    lastActive: "3 hours ago",
    permissions: [
      { id: "p1", name: "View Dashboard", description: "Access to main dashboard", enabled: true },
      { id: "p2", name: "Manage Team", description: "Add, edit, remove team members", enabled: false },
      { id: "p3", name: "Approve Expenses", description: "Approve expense reports", enabled: false },
      { id: "p4", name: "Book Travel", description: "Book flights and accommodations", enabled: true },
      { id: "p5", name: "Access Reports", description: "View and export reports", enabled: false },
    ],
  },
  {
    id: "5",
    name: "Lyle Kauffman",
    email: "lyle@acmecorp.com",
    role: "Team Member",
    department: "Marketing",
    avatar: "/images/team/lyle-kauffman.jpeg",
    status: "invited",
    lastActive: "Never",
    permissions: [
      { id: "p1", name: "View Dashboard", description: "Access to main dashboard", enabled: true },
      { id: "p2", name: "Manage Team", description: "Add, edit, remove team members", enabled: false },
      { id: "p3", name: "Approve Expenses", description: "Approve expense reports", enabled: false },
      { id: "p4", name: "Book Travel", description: "Book flights and accommodations", enabled: true },
      { id: "p5", name: "Access Reports", description: "View and export reports", enabled: false },
    ],
  },
  {
    id: "6",
    name: "Isla Allison",
    email: "isla@acmecorp.com",
    role: "Team Member",
    department: "Engineering",
    avatar: "/images/team/isla-allison.jpeg",
    status: "inactive",
    lastActive: "2 weeks ago",
    permissions: [
      { id: "p1", name: "View Dashboard", description: "Access to main dashboard", enabled: true },
      { id: "p2", name: "Manage Team", description: "Add, edit, remove team members", enabled: false },
      { id: "p3", name: "Approve Expenses", description: "Approve expense reports", enabled: false },
      { id: "p4", name: "Book Travel", description: "Book flights and accommodations", enabled: true },
      { id: "p5", name: "Access Reports", description: "View and export reports", enabled: false },
    ],
  },
]

// Sample data for activity
const recentActivity: Activity[] = [
  {
    id: "a1",
    user: "Genevieve McLean",
    userAvatar: "/images/team/genevieve-mclean.jpeg",
    action: "added",
    target: "Lyle Kauffman",
    date: "Today at 10:30 AM",
  },
  {
    id: "a2",
    user: "Cohen Lozano",
    userAvatar: "/images/team/cohen-lozano.jpeg",
    action: "updated permissions for",
    target: "Orlando Diggs",
    date: "Yesterday at 3:45 PM",
  },
  {
    id: "a3",
    user: "Genevieve McLean",
    userAvatar: "/images/team/genevieve-mclean.jpeg",
    action: "deactivated",
    target: "Isla Allison",
    date: "May 15, 2025",
  },
  {
    id: "a4",
    user: "Orlando Diggs",
    userAvatar: "/images/team/orlando-diggs.jpeg",
    action: "changed role for",
    target: "Ammar Foley",
    date: "May 12, 2025",
  },
]

// Available roles for the dropdown
const availableRoles = ["Admin", "Travel Manager", "Finance Manager", "Team Member", "Guest"]

// Available departments for the dropdown
const availableDepartments = [
  "Operations",
  "Finance",
  "Sales",
  "Marketing",
  "Engineering",
  "Human Resources",
  "Customer Support",
  "Executive",
]

export default function TeamManagementPage() {
  const [members, setMembers] = useState<TeamMember[]>(teamMembers)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null)
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false)
  const [isEditMemberOpen, setIsEditMemberOpen] = useState(false)
  const [newMember, setNewMember] = useState({
    name: "",
    email: "",
    role: "Team Member",
    department: "Operations",
  })

  // Filter members based on search query
  const filteredMembers = members.filter(
    (member) =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.department.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Handle adding a new member
  const handleAddMember = () => {
    const newId = `${members.length + 1}`
    const memberToAdd: TeamMember = {
      id: newId,
      name: newMember.name,
      email: newMember.email,
      role: newMember.role,
      department: newMember.department,
      avatar: "/images/ai-agent-avatar.jpeg", // Default avatar
      status: "invited",
      lastActive: "Never",
      permissions: [
        { id: "p1", name: "View Dashboard", description: "Access to main dashboard", enabled: true },
        { id: "p2", name: "Manage Team", description: "Add, edit, remove team members", enabled: false },
        { id: "p3", name: "Approve Expenses", description: "Approve expense reports", enabled: false },
        { id: "p4", name: "Book Travel", description: "Book flights and accommodations", enabled: true },
        { id: "p5", name: "Access Reports", description: "View and export reports", enabled: false },
      ],
    }

    setMembers([...members, memberToAdd])
    setNewMember({
      name: "",
      email: "",
      role: "Team Member",
      department: "Operations",
    })
    setIsAddMemberOpen(false)
  }

  // Handle updating member permissions
  const handlePermissionChange = (memberId: string, permissionId: string, enabled: boolean) => {
    setMembers(
      members.map((member) => {
        if (member.id === memberId) {
          return {
            ...member,
            permissions: member.permissions.map((permission) => {
              if (permission.id === permissionId) {
                return { ...permission, enabled }
              }
              return permission
            }),
          }
        }
        return member
      }),
    )
  }

  // Handle updating member status
  const handleStatusChange = (memberId: string, status: "active" | "invited" | "inactive") => {
    setMembers(
      members.map((member) => {
        if (member.id === memberId) {
          return { ...member, status }
        }
        return member
      }),
    )
  }

  // Handle updating member details
  const handleUpdateMember = () => {
    if (!selectedMember) return

    setMembers(
      members.map((member) => {
        if (member.id === selectedMember.id) {
          return selectedMember
        }
        return member
      }),
    )
    setIsEditMemberOpen(false)
  }

  // Handle removing a member
  const handleRemoveMember = (memberId: string) => {
    setMembers(members.filter((member) => member.id !== memberId))
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        {/* Header específico de Team Management */}
        <div className="bg-black/30 backdrop-blur-sm rounded-xl border border-white/10 p-4 sm:p-6 shadow-sm mb-6">
          <div className="flexflex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-medium tracking-tighter text-white">Team Management</h1>
              <p className="text-sm text-white/70 mt-1">Manage team members, roles, and permissions</p>
            </div>
            <div className="flex items-center gap-2">
              <Dialog open={isAddMemberOpen} onOpenChange={setIsAddMemberOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-white/10 text-white hover:bg-white/5 whitespace-nowrap">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add Team Member
                  </Button>
                </DialogTrigger>
        
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Team Member</DialogTitle>
                  <DialogDescription>
                    Invite a new member to join your team. They will receive an email invitation.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      placeholder="Enter full name"
                      value={newMember.name}
                      onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter email address"
                      value={newMember.email}
                      onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <Select
                        value={newMember.role}
                        onValueChange={(value) => setNewMember({ ...newMember, role: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableRoles.map((role) => (
                            <SelectItem key={role} value={role}>
                              {role}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="department">Department</Label>
                      <Select
                        value={newMember.department}
                        onValueChange={(value) => setNewMember({ ...newMember, department: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableDepartments.map((dept) => (
                            <SelectItem key={dept} value={dept}>
                              {dept}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddMemberOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddMember} disabled={!newMember.name || !newMember.email}>
                    Send Invitation
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Tabs defaultValue="members" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="members">Team Members</TabsTrigger>
            <TabsTrigger value="activity">Activity Log</TabsTrigger>
          </TabsList>

          <TabsContent value="members">
            <div className="bg-white rounded-xl border border-black p-6 shadow-sm">
              <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
                <div className="relative w-full md:w-96">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                  <Input
                    placeholder="Search team members..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    Filter
                  </Button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Name</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Role</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Department</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Last Active</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMembers.map((member) => (
                      <tr key={member.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="relative h-10 w-10 rounded-full overflow-hidden">
                              <Image
                                src={member.avatar || "/placeholder.svg"}
                                alt={member.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <div className="font-medium">{member.name}</div>
                              <div className="text-sm text-gray-500">{member.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">{member.role}</td>
                        <td className="py-3 px-4">{member.department}</td>
                        <td className="py-3 px-4">
                          <Badge
                            className={`${
                              member.status === "active"
                                ? "bg-green-100 text-green-800"
                                : member.status === "invited"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {member.status === "active"
                              ? "Active"
                              : member.status === "invited"
                                ? "Invited"
                                : "Inactive"}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">{member.lastActive}</td>
                        <td className="py-3 px-4 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Actions</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedMember(member)
                                  setIsEditMemberOpen(true)
                                }}
                              >
                                Edit Details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedMember(member)
                                }}
                              >
                                Manage Permissions
                              </DropdownMenuItem>
                              {member.status !== "active" ? (
                                <DropdownMenuItem onClick={() => handleStatusChange(member.id, "active")}>
                                  Activate Account
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem onClick={() => handleStatusChange(member.id, "inactive")}>
                                  Deactivate Account
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600" onClick={() => handleRemoveMember(member.id)}>
                                Remove
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredMembers.length === 0 && (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No team members found</h3>
                  <p className="text-gray-500 mb-4">Try adjusting your search or filters</p>
                  <Button onClick={() => setIsAddMemberOpen(true)} className="bg-black text-white hover:bg-gray-800">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add Team Member
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="activity">
            <div className="bg-white rounded-xl border border-black p-6 shadow-sm">
              <h2 className="text-lg font-medium mb-4">Recent Activity</h2>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 pb-4 border-b border-gray-100">
                    <div className="relative h-10 w-10 rounded-full overflow-hidden flex-shrink-0">
                      <Image
                        src={activity.userAvatar || "/placeholder.svg"}
                        alt={activity.user}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">
                        <span className="font-medium">{activity.user}</span>{" "}
                        <span className="text-gray-600">{activity.action}</span>{" "}
                        <span className="font-medium">{activity.target}</span>
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{activity.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Edit Member Dialog */}
        <Dialog open={isEditMemberOpen} onOpenChange={setIsEditMemberOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Team Member</DialogTitle>
              <DialogDescription>Update team member details and role.</DialogDescription>
            </DialogHeader>
            {selectedMember && (
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Full Name</Label>
                  <Input
                    id="edit-name"
                    value={selectedMember.name}
                    onChange={(e) => setSelectedMember({ ...selectedMember, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-email">Email Address</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={selectedMember.email}
                    onChange={(e) => setSelectedMember({ ...selectedMember, email: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-role">Role</Label>
                    <Select
                      value={selectedMember.role}
                      onValueChange={(value) => setSelectedMember({ ...selectedMember, role: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableRoles.map((role) => (
                          <SelectItem key={role} value={role}>
                            {role}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-department">Department</Label>
                    <Select
                      value={selectedMember.department}
                      onValueChange={(value) => setSelectedMember({ ...selectedMember, department: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableDepartments.map((dept) => (
                          <SelectItem key={dept} value={dept}>
                            {dept}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditMemberOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateMember}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Permissions Dialog */}
        <Dialog open={!!selectedMember && !isEditMemberOpen} onOpenChange={() => setSelectedMember(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Manage Permissions</DialogTitle>
              <DialogDescription>
                {selectedMember?.name} - {selectedMember?.role}
              </DialogDescription>
            </DialogHeader>
            {selectedMember && (
              <div className="space-y-4 py-4">
                {selectedMember.permissions.map((permission) => (
                  <div key={permission.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">{permission.name}</p>
                      <p className="text-xs text-gray-500">{permission.description}</p>
                    </div>
                    <Switch
                      checked={permission.enabled}
                      onCheckedChange={(checked) => handlePermissionChange(selectedMember.id, permission.id, checked)}
                    />
                  </div>
                ))}
              </div>
            )}
            <DialogFooter>
              <Button onClick={() => setSelectedMember(null)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  )
}
