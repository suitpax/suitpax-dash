"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { useUserConfig, type AccountType } from "@/lib/contexts/user-config-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User, Building2, Upload, Check, ArrowRight, ArrowLeft, Briefcase, Crown, Plane } from "lucide-react"

interface SetupStep {
  id: number
  title: string
  description: string
  icon: React.ComponentType<any>
}

const setupSteps: SetupStep[] = [
  {
    id: 1,
    title: "Account Type",
    description: "Choose how you'll use Suitpax",
    icon: User,
  },
  {
    id: 2,
    title: "Personal Info",
    description: "Tell us about yourself",
    icon: User,
  },
  {
    id: 3,
    title: "Company Details",
    description: "Your organization information",
    icon: Building2,
  },
  {
    id: 4,
    title: "Travel Preferences",
    description: "Customize your travel experience",
    icon: Plane,
  },
]

export function UserSetupWizard() {
  const { userConfig, updateUserConfig, switchAccountType, completeSetup } = useUserConfig()
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    accountType: "personal" as AccountType,
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    avatar: null as string | null,
    company: {
      name: "",
      domain: "",
      industry: "",
      size: "",
      logo: null as string | null,
    },
    travelPreferences: {
      preferredAirlines: [] as string[],
      seatPreference: "",
      mealPreference: "",
      budgetRange: "",
    },
  })

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleCompanyChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      company: {
        ...prev.company,
        [field]: value,
      },
    }))
  }

  const handleImageUpload = (field: "avatar" | "companyLogo", file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      if (field === "avatar") {
        handleInputChange("avatar", result)
      } else {
        handleCompanyChange("logo", result)
      }
    }
    reader.readAsDataURL(file)
  }

  const nextStep = () => {
    if (currentStep < getMaxSteps()) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const getMaxSteps = () => {
    return formData.accountType === "personal" ? 3 : 4
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.accountType !== ""
      case 2:
        return formData.firstName && formData.lastName && formData.email
      case 3:
        if (formData.accountType === "personal") {
          return formData.travelPreferences.seatPreference !== ""
        }
        return formData.company.name && formData.company.domain
      case 4:
        return formData.travelPreferences.seatPreference !== ""
      default:
        return false
    }
  }

  const handleComplete = async () => {
    setIsLoading(true)
    try {
      // Update user config with all form data
      await updateUserConfig({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        avatar: formData.avatar || undefined,
        accountType: formData.accountType,
        company:
          formData.accountType !== "personal"
            ? {
                id: `company_${Date.now()}`,
                name: formData.company.name,
                domain: formData.company.domain,
                industry: formData.company.industry,
                size: formData.company.size,
                logo: formData.company.logo || undefined,
              }
            : undefined,
        travelProfile: {
          frequentFlyerNumbers: {},
          preferredAirlines: formData.travelPreferences.preferredAirlines,
          seatPreference: formData.travelPreferences.seatPreference,
          mealPreference: formData.travelPreferences.mealPreference,
          hotelChains: [],
          roomPreference: "",
          budgetLimits: {
            flight: Number.parseInt(formData.travelPreferences.budgetRange) || 1000,
            hotel: 300,
            daily: 150,
          },
        },
      })

      await completeSetup()
      router.push("/dashboard")
    } catch (error) {
      console.error("Setup failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!userConfig) return null

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Progress Header */}
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-6">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/suitpax-cloud-logo%20%281%29-EshCIztLhPkYutLWdYERhlFOsQAJgu.webp"
              alt="Suitpax Logo"
              width={180}
              height={60}
              className="h-12 w-auto"
            />
          </div>

          <h1 className="text-2xl font-bold text-white mb-2">Welcome to Suitpax</h1>
          <p className="text-white/70 mb-6">Let's set up your account in a few simple steps</p>

          <div className="flex justify-center space-x-2 mb-2">
            {Array.from({ length: getMaxSteps() }, (_, i) => (
              <div
                key={i + 1}
                className={`h-2 w-8 rounded-full transition-colors ${
                  i + 1 <= currentStep ? "bg-white" : "bg-white/20"
                }`}
              />
            ))}
          </div>
          <p className="text-white/50 text-sm">
            Step {currentStep} of {getMaxSteps()}
          </p>
        </div>

        {/* Step Content */}
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              {React.createElement(setupSteps[currentStep - 1]?.icon || User, {
                className: "h-12 w-12 text-white/70",
              })}
            </div>
            <CardTitle className="text-white text-xl">{setupSteps[currentStep - 1]?.title}</CardTitle>
            <p className="text-white/60 text-sm">{setupSteps[currentStep - 1]?.description}</p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Step 1: Account Type */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    onClick={() => handleInputChange("accountType", "personal")}
                    className={`p-6 rounded-xl border-2 transition-all text-left ${
                      formData.accountType === "personal"
                        ? "border-white bg-white/10"
                        : "border-white/20 hover:border-white/40"
                    }`}
                  >
                    <User className="h-8 w-8 text-blue-400 mb-3" />
                    <h3 className="text-white font-medium mb-2">Personal</h3>
                    <p className="text-white/60 text-sm">For individual travelers</p>
                    <Badge className="mt-2 bg-blue-500/20 text-blue-400 border-blue-500/30">Free</Badge>
                  </button>

                  <button
                    onClick={() => handleInputChange("accountType", "business")}
                    className={`p-6 rounded-xl border-2 transition-all text-left ${
                      formData.accountType === "business"
                        ? "border-white bg-white/10"
                        : "border-white/20 hover:border-white/40"
                    }`}
                  >
                    <Briefcase className="h-8 w-8 text-emerald-400 mb-3" />
                    <h3 className="text-white font-medium mb-2">Business</h3>
                    <p className="text-white/60 text-sm">For small teams</p>
                    <Badge className="mt-2 bg-emerald-500/20 text-emerald-400 border-emerald-500/30">Pro</Badge>
                  </button>

                  <button
                    onClick={() => handleInputChange("accountType", "enterprise")}
                    className={`p-6 rounded-xl border-2 transition-all text-left ${
                      formData.accountType === "enterprise"
                        ? "border-white bg-white/10"
                        : "border-white/20 hover:border-white/40"
                    }`}
                  >
                    <Crown className="h-8 w-8 text-amber-400 mb-3" />
                    <h3 className="text-white font-medium mb-2">Enterprise</h3>
                    <p className="text-white/60 text-sm">For large organizations</p>
                    <Badge className="mt-2 bg-amber-500/20 text-amber-400 border-amber-500/30">Enterprise</Badge>
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Personal Info */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="flex justify-center">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-white/10 border-2 border-dashed border-white/30 flex items-center justify-center overflow-hidden">
                      {formData.avatar ? (
                        <Image
                          src={formData.avatar || "/placeholder.svg"}
                          alt="Profile"
                          width={96}
                          height={96}
                          className="object-cover rounded-full"
                        />
                      ) : (
                        <User className="h-8 w-8 text-white/50" />
                      )}
                    </div>
                    <label className="absolute -bottom-2 -right-2 bg-white text-black p-2 rounded-full cursor-pointer hover:bg-white/90">
                      <Upload className="h-4 w-4" />
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => e.target.files?.[0] && handleImageUpload("avatar", e.target.files[0])}
                      />
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white">First Name</Label>
                    <Input
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      className="bg-white/5 border-white/10 text-white"
                      placeholder="Enter your first name"
                    />
                  </div>
                  <div>
                    <Label className="text-white">Last Name</Label>
                    <Input
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      className="bg-white/5 border-white/10 text-white"
                      placeholder="Enter your last name"
                    />
                  </div>
                  <div>
                    <Label className="text-white">Email</Label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="bg-white/5 border-white/10 text-white"
                      placeholder="your.email@company.com"
                    />
                  </div>
                  <div>
                    <Label className="text-white">Phone (Optional)</Label>
                    <Input
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      className="bg-white/5 border-white/10 text-white"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Company Details (Business/Enterprise) or Travel Preferences (Personal) */}
            {currentStep === 3 && formData.accountType !== "personal" && (
              <div className="space-y-6">
                <div className="flex justify-center">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-lg bg-white/10 border-2 border-dashed border-white/30 flex items-center justify-center overflow-hidden">
                      {formData.company.logo ? (
                        <Image
                          src={formData.company.logo || "/placeholder.svg"}
                          alt="Company Logo"
                          width={96}
                          height={96}
                          className="object-cover"
                        />
                      ) : (
                        <Building2 className="h-8 w-8 text-white/50" />
                      )}
                    </div>
                    <label className="absolute -bottom-2 -right-2 bg-white text-black p-2 rounded-full cursor-pointer hover:bg-white/90">
                      <Upload className="h-4 w-4" />
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => e.target.files?.[0] && handleImageUpload("companyLogo", e.target.files[0])}
                      />
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white">Company Name</Label>
                    <Input
                      value={formData.company.name}
                      onChange={(e) => handleCompanyChange("name", e.target.value)}
                      className="bg-white/5 border-white/10 text-white"
                      placeholder="Acme Corporation"
                    />
                  </div>
                  <div>
                    <Label className="text-white">Company Domain</Label>
                    <Input
                      value={formData.company.domain}
                      onChange={(e) => handleCompanyChange("domain", e.target.value)}
                      className="bg-white/5 border-white/10 text-white"
                      placeholder="acme.com"
                    />
                  </div>
                  <div>
                    <Label className="text-white">Industry</Label>
                    <Select
                      value={formData.company.industry}
                      onValueChange={(value) => handleCompanyChange("industry", value)}
                    >
                      <SelectTrigger className="bg-white/5 border-white/10 text-white">
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="technology">Technology</SelectItem>
                        <SelectItem value="finance">Finance</SelectItem>
                        <SelectItem value="healthcare">Healthcare</SelectItem>
                        <SelectItem value="consulting">Consulting</SelectItem>
                        <SelectItem value="manufacturing">Manufacturing</SelectItem>
                        <SelectItem value="retail">Retail</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-white">Company Size</Label>
                    <Select value={formData.company.size} onValueChange={(value) => handleCompanyChange("size", value)}>
                      <SelectTrigger className="bg-white/5 border-white/10 text-white">
                        <SelectValue placeholder="Select size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-10">1-10 employees</SelectItem>
                        <SelectItem value="11-50">11-50 employees</SelectItem>
                        <SelectItem value="51-200">51-200 employees</SelectItem>
                        <SelectItem value="201-1000">201-1000 employees</SelectItem>
                        <SelectItem value="1000+">1000+ employees</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            {/* Travel Preferences */}
            {((currentStep === 3 && formData.accountType === "personal") || currentStep === 4) && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white">Seat Preference</Label>
                    <Select
                      value={formData.travelPreferences.seatPreference}
                      onValueChange={(value) =>
                        setFormData((prev) => ({
                          ...prev,
                          travelPreferences: { ...prev.travelPreferences, seatPreference: value },
                        }))
                      }
                    >
                      <SelectTrigger className="bg-white/5 border-white/10 text-white">
                        <SelectValue placeholder="Select preference" />
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
                      value={formData.travelPreferences.mealPreference}
                      onValueChange={(value) =>
                        setFormData((prev) => ({
                          ...prev,
                          travelPreferences: { ...prev.travelPreferences, mealPreference: value },
                        }))
                      }
                    >
                      <SelectTrigger className="bg-white/5 border-white/10 text-white">
                        <SelectValue placeholder="Select preference" />
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

                <div>
                  <Label className="text-white">Budget Range (per trip)</Label>
                  <Select
                    value={formData.travelPreferences.budgetRange}
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        travelPreferences: { ...prev.travelPreferences, budgetRange: value },
                      }))
                    }
                  >
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue placeholder="Select budget range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="500">Under $500</SelectItem>
                      <SelectItem value="1000">$500 - $1,000</SelectItem>
                      <SelectItem value="2500">$1,000 - $2,500</SelectItem>
                      <SelectItem value="5000">$2,500 - $5,000</SelectItem>
                      <SelectItem value="10000">$5,000+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

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
                          const current = formData.travelPreferences.preferredAirlines
                          const updated = current.includes(airline)
                            ? current.filter((a) => a !== airline)
                            : [...current, airline]
                          setFormData((prev) => ({
                            ...prev,
                            travelPreferences: { ...prev.travelPreferences, preferredAirlines: updated },
                          }))
                        }}
                        className={`cursor-pointer text-center justify-center rounded-full text-xs ${
                          formData.travelPreferences.preferredAirlines.includes(airline)
                            ? "bg-white text-black"
                            : "bg-white/10 text-white hover:bg-white/20"
                        }`}
                      >
                        {airline}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Button
            onClick={prevStep}
            disabled={currentStep === 1}
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          {currentStep < getMaxSteps() ? (
            <Button onClick={nextStep} disabled={!isStepValid()} className="bg-white text-black hover:bg-white/90">
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleComplete}
              disabled={!isStepValid() || isLoading}
              className="bg-white text-black hover:bg-white/90"
            >
              {isLoading ? "Setting up..." : "Complete Setup"}
              <Check className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
