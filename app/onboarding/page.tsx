"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { ArrowRight, Check, Upload, User, Building2 } from "lucide-react"

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    // Personal
    firstName: "",
    lastName: "",
    email: "",
    profileImage: null as string | null,

    // Company
    companyName: "",
    jobTitle: "",
    department: "",
    companyLogo: null as string | null,

    // Travel Preferences
    travelFrequency: "",
    preferredClass: "",
    budgetRange: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageUpload = (field: "profileImage" | "companyLogo", file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      setFormData((prev) => ({ ...prev, [field]: e.target?.result as string }))
    }
    reader.readAsDataURL(file)
  }

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1)
    } else {
      // Save to localStorage
      localStorage.setItem("userProfile", JSON.stringify(formData))
      localStorage.setItem("onboardingComplete", "true")
      router.push("/dashboard")
    }
  }

  const isStepValid = () => {
    switch (step) {
      case 1:
        return formData.firstName && formData.lastName && formData.email
      case 2:
        return formData.companyName && formData.jobTitle
      case 3:
        return formData.travelFrequency && formData.preferredClass
      default:
        return false
    }
  }

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="flex justify-center mb-6">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/suitpax-cloud-logo%20%281%29-EshCIztLhPkYutLWdYERhlFOsQAJgu.webp"
              alt="Suitpax Logo"
              width={180}
              height={60}
              className="h-12 w-auto"
            />
          </div>

          <div className="bg-black/30 backdrop-blur-sm rounded-xl border border-white/10 p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-xl font-medium tracking-tighter text-white">
                {step === 1 && "Personal Information"}
                {step === 2 && "Company Details"}
                {step === 3 && "Travel Preferences"}
              </h1>
              <div className="flex space-x-1">
                {[1, 2, 3].map((i) => (
                  <div key={i} className={`h-1.5 w-8 rounded-full ${i <= step ? "bg-white" : "bg-white/20"}`}></div>
                ))}
              </div>
            </div>

            {step === 1 && (
              <div className="space-y-4">
                <div className="flex justify-center mb-4">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-md bg-white/5 border-2 border-dashed border-white/30 flex items-center justify-center overflow-hidden">
                      {formData.profileImage ? (
                        <Image
                          src={formData.profileImage || "/placeholder.svg"}
                          alt="Profile"
                          width={80}
                          height={80}
                          className="object-cover rounded-full"
                        />
                      ) : (
                        <User className="h-8 w-8 text-white/50" />
                      )}
                    </div>
                    <label className="absolute -bottom-1 -right-1 bg-white text-black p-1.5 rounded-full cursor-pointer hover:bg-white/90">
                      <Upload className="h-3 w-3" />
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => e.target.files?.[0] && handleImageUpload("profileImage", e.target.files[0])}
                      />
                    </label>
                  </div>
                </div>

                <div>
                  <label htmlFor="firstName" className="block text-xs font-medium text-white/70 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20 text-white placeholder:text-white/30"
                    placeholder="Enter your first name"
                  />
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-xs font-medium text-white/70 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20 text-white placeholder:text-white/30"
                    placeholder="Enter your last name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-xs font-medium text-white/70 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20 text-white placeholder:text-white/30"
                    placeholder="your.email@company.com"
                  />
                </div>
                {/* AI Agent Quick Setup */}
                <div className="mt-6 pt-4 border-t border-white/10">
                  <div className="bg-white/5 rounded-lg border border-white/10 p-3">
                    <div className="flex items-center mb-2">
                      <div className="relative h-5 w-5 rounded-full overflow-hidden mr-2">
                        <Image src="/images/ai-agent-avatar.jpeg" alt="AI Assistant" fill className="object-cover" />
                      </div>
                      <span className="text-xs font-medium text-white">Suitpax AI</span>
                    </div>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault()
                        const input = e.currentTarget.querySelector("input") as HTMLInputElement
                        if (input?.value.trim()) {
                          // Here you would integrate with AI to auto-fill form
                          console.log("AI Setup:", input.value)
                          input.value = ""
                        }
                      }}
                    >
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Tell me about your role at Suitpax and travel needs..."
                          className="w-full pl-3 pr-8 py-2 text-xs bg-white/5 border border-white/10 rounded-full focus:outline-none focus:ring-1 focus:ring-white/20 text-white placeholder:text-white/30"
                        />
                        <button
                          type="submit"
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white"
                        >
                          <ArrowRight className="h-3 w-3" />
                        </button>
                      </div>
                    </form>
                    <p className="text-[10px] text-white/50 mt-2">
                      Example: "I'm Sarah, VP of Sales at Suitpax, travel weekly for client presentations, prefer
                      business class, budget up to $5000"
                    </p>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div className="flex justify-center mb-4">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-lg bg-white/5 border-2 border-dashed border-white/30 flex items-center justify-center overflow-hidden">
                      {formData.companyLogo ? (
                        <Image
                          src={formData.companyLogo || "/placeholder.svg"}
                          alt="Company Logo"
                          width={80}
                          height={80}
                          className="object-cover"
                        />
                      ) : (
                        <Building2 className="h-8 w-8 text-white/50" />
                      )}
                    </div>
                    <label className="absolute -bottom-1 -right-1 bg-white text-black p-1.5 rounded-full cursor-pointer hover:bg-white/90">
                      <Upload className="h-3 w-3" />
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => e.target.files?.[0] && handleImageUpload("companyLogo", e.target.files[0])}
                      />
                    </label>
                  </div>
                </div>

                <div>
                  <label htmlFor="companyName" className="block text-xs font-medium text-white/70 mb-1">
                    Company Name
                  </label>
                  <input
                    type="text"
                    id="companyName"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20 text-white placeholder:text-white/30"
                    placeholder="Enter your company name"
                  />
                </div>

                <div>
                  <label htmlFor="jobTitle" className="block text-xs font-medium text-white/70 mb-1">
                    Job Title
                  </label>
                  <input
                    type="text"
                    id="jobTitle"
                    name="jobTitle"
                    value={formData.jobTitle}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20 text-white placeholder:text-white/30"
                    placeholder="Enter your job title"
                  />
                </div>

                <div>
                  <label htmlFor="department" className="block text-xs font-medium text-white/70 mb-1">
                    Department
                  </label>
                  <select
                    id="department"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20 text-white appearance-none"
                  >
                    <option value="" className="bg-black text-white">
                      Select department
                    </option>
                    <option value="sales" className="bg-black text-white">
                      Sales
                    </option>
                    <option value="marketing" className="bg-black text-white">
                      Marketing
                    </option>
                    <option value="engineering" className="bg-black text-white">
                      Engineering
                    </option>
                    <option value="finance" className="bg-black text-white">
                      Finance
                    </option>
                    <option value="hr" className="bg-black text-white">
                      Human Resources
                    </option>
                  </select>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <div>
                  <label htmlFor="travelFrequency" className="block text-xs font-medium text-white/70 mb-1">
                    Travel Frequency
                  </label>
                  <select
                    id="travelFrequency"
                    name="travelFrequency"
                    value={formData.travelFrequency}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20 text-white appearance-none"
                  >
                    <option value="" className="bg-black text-white">
                      Select frequency
                    </option>
                    <option value="weekly" className="bg-black text-white">
                      Weekly
                    </option>
                    <option value="monthly" className="bg-black text-white">
                      Monthly
                    </option>
                    <option value="quarterly" className="bg-black text-white">
                      Quarterly
                    </option>
                    <option value="yearly" className="bg-black text-white">
                      A few times a year
                    </option>
                  </select>
                </div>

                <div>
                  <label htmlFor="preferredClass" className="block text-xs font-medium text-white/70 mb-1">
                    Preferred Class
                  </label>
                  <select
                    id="preferredClass"
                    name="preferredClass"
                    value={formData.preferredClass}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20 text-white appearance-none"
                  >
                    <option value="" className="bg-black text-white">
                      Select class
                    </option>
                    <option value="economy" className="bg-black text-white">
                      Economy
                    </option>
                    <option value="premium-economy" className="bg-black text-white">
                      Premium Economy
                    </option>
                    <option value="business" className="bg-black text-white">
                      Business
                    </option>
                    <option value="first" className="bg-black text-white">
                      First Class
                    </option>
                  </select>
                </div>

                <div>
                  <label htmlFor="budgetRange" className="block text-xs font-medium text-white/70 mb-1">
                    Budget Range (per trip)
                  </label>
                  <select
                    id="budgetRange"
                    name="budgetRange"
                    value={formData.budgetRange}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20 text-white appearance-none"
                  >
                    <option value="" className="bg-black text-white">
                      Select budget range
                    </option>
                    <option value="under-1000" className="bg-black text-white">
                      Under $1,000
                    </option>
                    <option value="1000-3000" className="bg-black text-white">
                      $1,000 - $3,000
                    </option>
                    <option value="3000-5000" className="bg-black text-white">
                      $3,000 - $5,000
                    </option>
                    <option value="over-5000" className="bg-black text-white">
                      Over $5,000
                    </option>
                  </select>
                </div>

                <div className="bg-white/5 rounded-lg p-4 mt-4">
                  <div className="flex items-center mb-2">
                    <Check className="w-4 h-4 text-emerald-400 mr-2" />
                    <span className="text-white text-sm font-medium">Setup Complete!</span>
                  </div>
                  <p className="text-white/70 text-xs">
                    Your profile is ready. You can update these preferences anytime in your settings.
                  </p>
                </div>
              </div>
            )}

            <div className="mt-6">
              <button
                onClick={handleNext}
                disabled={!isStepValid()}
                className="w-full flex items-center justify-center px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="text-sm">{step < 3 ? "Continue" : "Go to Dashboard"}</span>
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
