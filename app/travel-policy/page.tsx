"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { FileCheck, AlertCircle, Clock, CheckCircle, XCircle, Info } from "lucide-react"

export default function TravelPolicyPage() {
  const [activeTab, setActiveTab] = useState("pending")

  // Sample data for pending approvals
  const pendingApprovals = [
    {
      id: "TR-2023-001",
      employee: "John Smith",
      destination: "London, UK",
      dates: "Jun 15-18, 2023",
      purpose: "Client Meeting",
      cost: "$1,850",
      status: "pending",
      submitted: "May 28, 2023",
    },
    {
      id: "TR-2023-002",
      employee: "Sarah Johnson",
      destination: "Tokyo, Japan",
      dates: "Jul 10-15, 2023",
      purpose: "Conference",
      cost: "$3,200",
      status: "pending",
      submitted: "May 30, 2023",
    },
    {
      id: "TR-2023-003",
      employee: "Michael Brown",
      destination: "Paris, France",
      dates: "Jun 22-25, 2023",
      purpose: "Sales Presentation",
      cost: "$2,100",
      status: "pending",
      submitted: "Jun 1, 2023",
    },
  ]

  // Sample data for approved trips
  const approvedTrips = [
    {
      id: "TR-2023-004",
      employee: "Emily Davis",
      destination: "Berlin, Germany",
      dates: "Jun 5-8, 2023",
      purpose: "Product Launch",
      cost: "$1,950",
      status: "approved",
      approved: "May 25, 2023",
    },
    {
      id: "TR-2023-005",
      employee: "Robert Wilson",
      destination: "Singapore",
      dates: "Jun 12-16, 2023",
      purpose: "Regional Meeting",
      cost: "$2,800",
      status: "approved",
      approved: "May 27, 2023",
    },
  ]

  // Sample data for rejected trips
  const rejectedTrips = [
    {
      id: "TR-2023-006",
      employee: "Jennifer Lee",
      destination: "Sydney, Australia",
      dates: "Jul 1-10, 2023",
      purpose: "Training",
      cost: "$4,500",
      status: "rejected",
      reason: "Exceeds budget limit",
      rejected: "May 29, 2023",
    },
    {
      id: "TR-2023-007",
      employee: "David Martinez",
      destination: "Rome, Italy",
      dates: "Jun 18-22, 2023",
      purpose: "Conference",
      cost: "$2,300",
      status: "rejected",
      reason: "Insufficient business justification",
      rejected: "May 30, 2023",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-medium tracking-tighter">Travel Policy Management</h1>
        <Button className="bg-black text-white rounded-xl">
          <FileCheck className="mr-2 h-4 w-4" /> View Policy Document
        </Button>
      </div>

      <Card className="border border-black rounded-xl">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-xl font-medium tracking-tighter">Travel Request Approvals</CardTitle>
              <CardDescription>Review and manage business travel requests</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="bg-gray-100 text-black border-black">
                <Clock className="mr-2 h-3 w-3" /> {pendingApprovals.length} Pending
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="pending" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-gray-100 rounded-xl p-1">
              <TabsTrigger
                value="pending"
                className="rounded-lg data-[state=active]:bg-white data-[state=active]:border data-[state=active]:border-black"
              >
                <Clock className="mr-2 h-4 w-4" /> Pending ({pendingApprovals.length})
              </TabsTrigger>
              <TabsTrigger
                value="approved"
                className="rounded-lg data-[state=active]:bg-white data-[state=active]:border data-[state=active]:border-black"
              >
                <CheckCircle className="mr-2 h-4 w-4" /> Approved ({approvedTrips.length})
              </TabsTrigger>
              <TabsTrigger
                value="rejected"
                className="rounded-lg data-[state=active]:bg-white data-[state=active]:border data-[state=active]:border-black"
              >
                <XCircle className="mr-2 h-4 w-4" /> Rejected ({rejectedTrips.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pending" className="mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Request ID</TableHead>
                    <TableHead>Employee</TableHead>
                    <TableHead>Destination</TableHead>
                    <TableHead>Dates</TableHead>
                    <TableHead>Purpose</TableHead>
                    <TableHead>Est. Cost</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingApprovals.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">{request.id}</TableCell>
                      <TableCell>{request.employee}</TableCell>
                      <TableCell>{request.destination}</TableCell>
                      <TableCell>{request.dates}</TableCell>
                      <TableCell>{request.purpose}</TableCell>
                      <TableCell>{request.cost}</TableCell>
                      <TableCell>{request.submitted}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button size="sm" className="bg-black text-white rounded-lg h-8">
                            Approve
                          </Button>
                          <Button size="sm" variant="outline" className="border-black rounded-lg h-8">
                            Reject
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="approved" className="mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Request ID</TableHead>
                    <TableHead>Employee</TableHead>
                    <TableHead>Destination</TableHead>
                    <TableHead>Dates</TableHead>
                    <TableHead>Purpose</TableHead>
                    <TableHead>Est. Cost</TableHead>
                    <TableHead>Approved On</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {approvedTrips.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">{request.id}</TableCell>
                      <TableCell>{request.employee}</TableCell>
                      <TableCell>{request.destination}</TableCell>
                      <TableCell>{request.dates}</TableCell>
                      <TableCell>{request.purpose}</TableCell>
                      <TableCell>{request.cost}</TableCell>
                      <TableCell>{request.approved}</TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline" className="border-black rounded-lg h-8">
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="rejected" className="mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Request ID</TableHead>
                    <TableHead>Employee</TableHead>
                    <TableHead>Destination</TableHead>
                    <TableHead>Dates</TableHead>
                    <TableHead>Purpose</TableHead>
                    <TableHead>Est. Cost</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rejectedTrips.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">{request.id}</TableCell>
                      <TableCell>{request.employee}</TableCell>
                      <TableCell>{request.destination}</TableCell>
                      <TableCell>{request.dates}</TableCell>
                      <TableCell>{request.purpose}</TableCell>
                      <TableCell>{request.cost}</TableCell>
                      <TableCell>{request.reason}</TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline" className="border-black rounded-lg h-8">
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card className="border border-black rounded-xl">
        <CardHeader>
          <CardTitle className="text-xl font-medium tracking-tighter">Travel Policy Guidelines</CardTitle>
          <CardDescription>Key business travel policies and approval requirements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-black mt-0.5" />
                <div>
                  <h3 className="font-medium">Approval Requirements</h3>
                  <p className="text-sm">
                    All business travel requires manager approval at least 14 days before departure.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-black mt-0.5" />
                <div>
                  <h3 className="font-medium">Budget Limits</h3>
                  <p className="text-sm">
                    Domestic travel: $1,000 max per day. International travel: $1,500 max per day.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-black mt-0.5" />
                <div>
                  <h3 className="font-medium">Flight Class Policy</h3>
                  <p className="text-sm">
                    Economy class for flights under 6 hours. Business class allowed for flights over 6 hours.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-black mt-0.5" />
                <div>
                  <h3 className="font-medium">Hotel Accommodations</h3>
                  <p className="text-sm">
                    4-star hotels maximum. Room rate not to exceed $300 per night domestic, $400 international.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-black mt-0.5" />
                <div>
                  <h3 className="font-medium">Expense Reporting</h3>
                  <p className="text-sm">
                    All expenses must be submitted with receipts within 7 days of trip completion.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-black mt-0.5" />
                <div>
                  <h3 className="font-medium">Preferred Vendors</h3>
                  <p className="text-sm">
                    Use company-approved airlines, hotels, and car rental services when available.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t border-black pt-4 flex justify-between">
          <div className="flex items-center">
            <Info className="h-4 w-4 mr-2" />
            <span className="text-sm">Last updated: June 1, 2023</span>
          </div>
          <Button variant="outline" className="border-black rounded-xl">
            Download Full Policy
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
