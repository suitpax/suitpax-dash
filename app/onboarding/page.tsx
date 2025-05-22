"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { ArrowRight, Check, ChevronLeft, ChevronRight } from "lucide-react"

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    role: "",
    teamSize: "",
    travelFrequency: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1)
    } else {
      router.push("/dashboard")
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-md">
          <div className="flex justify-center mb-8">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/suitpax-cloud-logo%20%281%29-EshCIztLhPkYutLWdYERhlFOsQAJgu.webp"
              alt="Suitpax Logo"
              width={180}
              height={60}
              className="h-12 w-auto"
            />
          </div>

          <div className="bg-black/30 backdrop-blur-sm rounded-xl border border-white/10 p-6 shadow-sm relative overflow-hidden">
            {/* Gradient border at top */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500/50 via-purple-500/50 to-pink-500/50"></div>

            <div className="flex justify-between items-center mb-8">
              <h1 className="text-xl font-medium tracking-tighter text-white">
                {step === 1 && "Welcome to Suitpax"}
                {step === 2 && "Your Travel Preferences"}
                {step === 3 && "Almost Done"}
              </h1>
              <div className="flex space-x-1.5">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`h-1.5 w-8 rounded-full transition-all duration-300 ${
                      i < step ? "bg-white" : i === step ? "bg-white/70" : "bg-white/20"
                    }`}
                  ></div>
                ))}
              </div>
            </div>

            {step === 1 && (
              <div className="space-y-4">
                <p className="text-white/70 text-sm mb-6">
                  Let's set up your account to streamline your business travel experience.
                </p>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-xs font-medium text-white/70 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20 text-white placeholder:text-white/30"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-xs font-medium text-white/70 mb-1">
                      Work Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20 text-white placeholder:text-white/30"
                      placeholder="your.name@company.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="company" className="block text-xs font-medium text-white/70 mb-1">
                      Company Name
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20 text-white placeholder:text-white/30"
                      placeholder="Enter your company name"
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <p className="text-white/70 text-sm mb-6">
                  Tell us about your travel habits so we can personalize your experience.
                </p>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="role" className="block text-xs font-medium text-white/70 mb-1">
                      Your Role
                    </label>
                    <select
                      id="role"
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20 text-white appearance-none"
                    >
                      <option value="" className="bg-black text-white">
                        Select your role
                      </option>
                      <option value="executive" className="bg-black text-white">
                        Executive
                      </option>
                      <option value="manager" className="bg-black text-white">
                        Manager
                      </option>
                      <option value="employee" className="bg-black text-white">
                        Employee
                      </option>
                      <option value="admin" className="bg-black text-white">
                        Travel Admin
                      </option>
                      <option value="other" className="bg-black text-white">
                        Other
                      </option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="teamSize" className="block text-xs font-medium text-white/70 mb-1">
                      Team Size
                    </label>
                    <select
                      id="teamSize"
                      name="teamSize"
                      value={formData.teamSize}
                      onChange={handleChange}
                      className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20 text-white appearance-none"
                    >
                      <option value="" className="bg-black text-white">
                        Select team size
                      </option>
                      <option value="1-10" className="bg-black text-white">
                        1-10 employees
                      </option>
                      <option value="11-50" className="bg-black text-white">
                        11-50 employees
                      </option>
                      <option value="51-200" className="bg-black text-white">
                        51-200 employees
                      </option>
                      <option value="201-500" className="bg-black text-white">
                        201-500 employees
                      </option>
                      <option value="501+" className="bg-black text-white">
                        501+ employees
                      </option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="travelFrequency" className="block text-xs font-medium text-white/70 mb-1">
                      Travel Frequency
                    </label>
                    <select
                      id="travelFrequency"
                      name="travelFrequency"
                      value={formData.travelFrequency}
                      onChange={handleChange}
                      className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20 text-white appearance-none"
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
                      <option value="rarely" className="bg-black text-white">
                        Rarely
                      </option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <div className="flex justify-center mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-400/20 to-emerald-500/20 rounded-full flex items-center justify-center">
                    <Check className="w-10 h-10 text-emerald-400" />
                  </div>
                </div>
                <h2 className="text-xl font-medium text-white text-center">Your account is ready!</h2>
                <p className="text-white/70 text-sm text-center mb-6">
                  You're all set to start using Suitpax for your business travel needs. Our AI assistant will help you
                  book flights, hotels, and manage your expenses.
                </p>
                <div className="bg-white/5 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-center border-b border-white/5 pb-2">
                    <span className="text-white/70 text-sm">Name</span>
                    <span className="text-white text-sm font-medium">{formData.name || "John Doe"}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-white/5 pb-2">
                    <span className="text-white/70 text-sm">Email</span>
                    <span className="text-white text-sm font-medium">{formData.email || "john.doe@company.com"}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/70 text-sm">Company</span>
                    <span className="text-white text-sm font-medium">{formData.company || "Acme Inc."}</span>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-8 flex justify-between">
              {step > 1 ? (
                <button
                  onClick={handleBack}
                  className="flex items-center justify-center px-4 py-2 rounded-lg bg-transparent border border-white/10 text-white hover:bg-white/5 transition-colors"
                >
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  <span className="text-sm">Back</span>
                </button>
              ) : (
                <div></div> // Placeholder para mantener el espacio
              )}

              <button
                onClick={handleNext}
                className="flex items-center justify-center px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/15 transition-colors"
              >
                <span className="text-sm">{step < 3 ? "Continue" : "Go to Dashboard"}</span>
                {step < 3 ? <ChevronRight className="ml-2 h-4 w-4" /> : <ArrowRight className="ml-2 h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-white/50 text-xs">
              By continuing, you agree to our{" "}
              <a href="#" className="text-white/70 hover:text-white underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-white/70 hover:text-white underline">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
