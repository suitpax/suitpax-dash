"use client"
import { useState } from "react"
import Layout from "@/components/ui/layout"

export default function TravelPolicyPage() {
  const [activeTab, setActiveTab] = useState("pending")

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-medium tracking-tighter text-black mb-6">Travel Policy Management</h1>

        {/* Empty state for travel policy */}
        <div className="bg-white rounded-xl border border-black p-6 shadow-sm mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h2 className="text-lg font-medium tracking-tighter text-black mb-1">Business Travel Approval</h2>
              <p className="text-sm text-gray-600">Manage and approve travel requests from your team</p>
            </div>
            <div className="flex mt-4 md:mt-0 space-x-2">
              <button
                onClick={() => setActiveTab("pending")}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg ${
                  activeTab === "pending" ? "bg-black text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Pending
              </button>
              <button
                onClick={() => setActiveTab("approved")}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg ${
                  activeTab === "approved" ? "bg-black text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Approved
              </button>
              <button
                onClick={() => setActiveTab("rejected")}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg ${
                  activeTab === "rejected" ? "bg-black text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Rejected
              </button>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="bg-gray-100 p-4 rounded-full mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-8 w-8 text-gray-500"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
            </div>
            <h3 className="text-lg font-medium text-black mb-2">No travel requests yet</h3>
            <p className="text-gray-600 max-w-md mb-6">
              {activeTab === "pending"
                ? "There are no pending travel requests to approve."
                : activeTab === "approved"
                  ? "No travel requests have been approved yet."
                  : "No travel requests have been rejected."}
            </p>
            <button className="px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
              Create Travel Request
            </button>
          </div>
        </div>

        {/* Empty state for company travel policies */}
        <div className="bg-white rounded-xl border border-black p-6 shadow-sm mb-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-medium tracking-tighter text-black">Company Travel Policies</h2>
            <button className="px-3 py-1.5 text-sm font-medium rounded-lg bg-black text-white hover:bg-gray-800">
              Create Policy
            </button>
          </div>

          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="bg-gray-100 p-4 rounded-full mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-8 w-8 text-gray-500"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="9" y1="3" x2="9" y2="21"></line>
              </svg>
            </div>
            <h3 className="text-lg font-medium text-black mb-2">No travel policies defined</h3>
            <p className="text-gray-600 max-w-md mb-6">
              Create your company's travel policies to help your team book compliant travel and streamline approvals.
            </p>
            <button className="px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
              Set Up Travel Policies
            </button>
          </div>
        </div>

        {/* Getting started with travel policies */}
        <div className="bg-white rounded-xl border border-black p-6 shadow-sm">
          <h2 className="text-lg font-medium tracking-tighter text-black mb-6">Getting Started with Travel Policies</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <div className="p-2 rounded-lg bg-gray-100 mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5 text-black"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10 9 9 9 8 9"></polyline>
                  </svg>
                </div>
                <h3 className="font-medium text-black">Define Travel Policies</h3>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Create guidelines for flights, accommodations, transportation, and expense limits.
              </p>
              <button className="text-sm font-medium text-black hover:underline flex items-center gap-1">
                Create policy
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <div className="p-2 rounded-lg bg-gray-100 mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5 text-black"
                  >
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                </div>
                <h3 className="font-medium text-black">Set Up Approval Workflow</h3>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Define who can approve travel requests and set up approval chains.
              </p>
              <button className="text-sm font-medium text-black hover:underline flex items-center gap-1">
                Configure workflow
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <div className="p-2 rounded-lg bg-gray-100 mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5 text-black"
                  >
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                </div>
                <h3 className="font-medium text-black">Create Travel Request Template</h3>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Design the form employees will use to request business travel.
              </p>
              <button className="text-sm font-medium text-black hover:underline flex items-center gap-1">
                Create template
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <div className="p-2 rounded-lg bg-gray-100 mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5 text-black"
                  >
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                  </svg>
                </div>
                <h3 className="font-medium text-black">Set Up Notifications</h3>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Configure email and in-app notifications for travel requests and approvals.
              </p>
              <button className="text-sm font-medium text-black hover:underline flex items-center gap-1">
                Configure notifications
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-100 rounded-lg">
            <div className="flex items-start">
              <div className="p-2 rounded-full bg-black mr-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4 text-white"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-black mb-1">Need help setting up your travel policies?</h3>
                <p className="text-sm text-gray-600">
                  Our AI assistant can help you create travel policies based on industry best practices.
                </p>
                <button className="mt-2 px-3 py-1.5 text-sm font-medium rounded-lg bg-black text-white hover:bg-gray-800">
                  Get AI Recommendations
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
