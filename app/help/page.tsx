"use client"

import { useState } from "react"
import Layout from "@/components/ui/layout"
import { Search, MessageCircle, Book, Video, Phone, Mail, ChevronRight, HelpCircle } from "lucide-react"

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const faqCategories = [
    { id: "all", name: "All Topics", count: 24 },
    { id: "booking", name: "Booking", count: 8 },
    { id: "expenses", name: "Expenses", count: 6 },
    { id: "account", name: "Account", count: 5 },
    { id: "policies", name: "Policies", count: 5 },
  ]

  const faqs = [
    {
      id: 1,
      category: "booking",
      question: "How do I book a flight for my team?",
      answer:
        "You can book flights for your team by going to the Flights page and selecting multiple passengers. As an admin, you can book on behalf of team members.",
    },
    {
      id: 2,
      category: "expenses",
      question: "How do I submit an expense report?",
      answer:
        "Go to the Expenses page, click 'New Expense', fill in the details, and upload your receipt. Your manager will be notified for approval.",
    },
    {
      id: 3,
      category: "account",
      question: "How do I change my company information?",
      answer: "Navigate to Settings > Company Profile to update your company information, logo, and travel policies.",
    },
    {
      id: 4,
      category: "policies",
      question: "What are the travel policy limits?",
      answer:
        "Travel policy limits vary by company. Check your Settings > Travel Policy page for specific limits and guidelines.",
    },
    {
      id: 5,
      category: "booking",
      question: "Can I cancel or modify my booking?",
      answer:
        "Yes, you can cancel or modify bookings from your Dashboard or the specific booking page, subject to airline/hotel policies.",
    },
  ]

  const filteredFaqs = selectedCategory === "all" ? faqs : faqs.filter((faq) => faq.category === selectedCategory)

  const searchedFaqs = searchQuery
    ? filteredFaqs.filter(
        (faq) =>
          faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          faq.answer.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : filteredFaqs

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        <h1 className="text-md font-medium text-black mb-6">Help & Support</h1>

        {/* Search */}
        <div className="bg-white rounded-xl border border-black p-6 shadow-sm mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search for help articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:border-black transition-colors cursor-pointer">
            <div className="flex items-center mb-3">
              <MessageCircle className="h-6 w-6 text-blue-600 mr-3" />
              <h3 className="font-medium text-black">Live Chat</h3>
            </div>
            <p className="text-sm text-gray-600">Get instant help from our support team</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:border-black transition-colors cursor-pointer">
            <div className="flex items-center mb-3">
              <Book className="h-6 w-6 text-green-600 mr-3" />
              <h3 className="font-medium text-black">User Guide</h3>
            </div>
            <p className="text-sm text-gray-600">Comprehensive documentation and tutorials</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:border-black transition-colors cursor-pointer">
            <div className="flex items-center mb-3">
              <Video className="h-6 w-6 text-purple-600 mr-3" />
              <h3 className="font-medium text-black">Video Tutorials</h3>
            </div>
            <p className="text-sm text-gray-600">Step-by-step video guides</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:border-black transition-colors cursor-pointer">
            <div className="flex items-center mb-3">
              <Phone className="h-6 w-6 text-orange-600 mr-3" />
              <h3 className="font-medium text-black">Phone Support</h3>
            </div>
            <p className="text-sm text-gray-600">Call us for urgent assistance</p>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-xl border border-black p-6 shadow-sm">
          <h2 className="text-lg font-medium text-black mb-4">Frequently Asked Questions</h2>

          {/* FAQ Categories */}
          <div className="flex flex-wrap gap-2 mb-6">
            {faqCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                  selectedCategory === category.id
                    ? "bg-black text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category.name} ({category.count})
              </button>
            ))}
          </div>

          {/* FAQ List */}
          <div className="space-y-4">
            {searchedFaqs.length > 0 ? (
              searchedFaqs.map((faq) => (
                <div key={faq.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-black mb-2 flex items-center">
                        <HelpCircle className="h-4 w-4 mr-2 text-gray-500" />
                        {faq.question}
                      </h3>
                      <p className="text-sm text-gray-600 ml-6">{faq.answer}</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <HelpCircle className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-black mb-2">No results found</h3>
                <p className="text-gray-600">Try adjusting your search or browse our categories above.</p>
              </div>
            )}
          </div>
        </div>

        {/* Contact Support */}
        <div className="bg-white rounded-xl border border-black p-6 shadow-sm mt-6">
          <h2 className="text-lg font-medium text-black mb-4">Still need help?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center p-4 bg-gray-50 rounded-lg">
              <Mail className="h-8 w-8 text-blue-600 mr-4" />
              <div>
                <h3 className="font-medium text-black">Email Support</h3>
                <p className="text-sm text-gray-600">support@suitpax.com</p>
                <p className="text-xs text-gray-500">Response within 24 hours</p>
              </div>
            </div>

            <div className="flex items-center p-4 bg-gray-50 rounded-lg">
              <Phone className="h-8 w-8 text-green-600 mr-4" />
              <div>
                <h3 className="font-medium text-black">Phone Support</h3>
                <p className="text-sm text-gray-600">+1 (555) 123-4567</p>
                <p className="text-xs text-gray-500">Mon-Fri, 9AM-6PM EST</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
