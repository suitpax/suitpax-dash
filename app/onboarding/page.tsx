"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { ArrowLeft, ArrowRight, Check, Building, User, Briefcase, Globe, CreditCard, Users } from "lucide-react"

// Define the steps of the onboarding process
const steps = [
  {
    id: "welcome",
    title: "Welcome to Suitpax",
    description: "Let's set up your business travel management platform",
    icon: <Globe className="h-6 w-6" />,
  },
  {
    id: "account",
    title: "Account Information",
    description: "Tell us about yourself",
    icon: <User className="h-6 w-6" />,
  },
  {
    id: "company",
    title: "Company Details",
    description: "Tell us about your company",
    icon: <Building className="h-6 w-6" />,
  },
  {
    id: "travel-preferences",
    title: "Travel Preferences",
    description: "Set your travel preferences",
    icon: <Briefcase className="h-6 w-6" />,
  },
  {
    id: "payment",
    title: "Payment Methods",
    description: "Add your payment methods",
    icon: <CreditCard className="h-6 w-6" />,
  },
  {
    id: "team",
    title: "Team Setup",
    description: "Invite your team members",
    icon: <Users className="h-6 w-6" />,
  },
  {
    id: "complete",
    title: "All Set!",
    description: "You're ready to start using Suitpax",
    icon: <Check className="h-6 w-6" />,
  },
]

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    // Account Information
    fullName: "",
    email: "",
    jobTitle: "",
    department: "",

    // Company Details
    companyName: "",
    companySize: "",
    industry: "",
    companyAddress: "",

    // Travel Preferences
    preferredAirlines: [] as string[],
    preferredHotels: [] as string[],
    seatPreference: "",
    mealPreference: "",

    // Payment Methods
    paymentMethod: "corporate-card",
    cardNumber: "",
    cardName: "",
    cardExpiry: "",
    cardCVC: "",
    billingAddress: "",

    // Team Setup
    inviteTeam: false,
    teamEmails: "",
  })

  const [progress, setProgress] = useState(0)
  const router = useRouter()

  // Calculate progress percentage
  useEffect(() => {
    const newProgress = Math.round((currentStep / (steps.length - 1)) * 100)
    setProgress(newProgress)
  }, [currentStep])

  // Auto-save form data to localStorage
  useEffect(() => {
    localStorage.setItem("onboardingData", JSON.stringify(formData))
  }, [formData])

  // Load saved data on initial load
  useEffect(() => {
    const savedData = localStorage.getItem("onboardingData")
    if (savedData) {
      setFormData(JSON.parse(savedData))
    }

    const savedStep = localStorage.getItem("onboardingStep")
    if (savedStep) {
      setCurrentStep(Number.parseInt(savedStep))
    }
  }, [])

  // Save current step to localStorage
  useEffect(() => {
    localStorage.setItem("onboardingStep", currentStep.toString())
  }, [currentStep])

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleNext = () => {
    // Validate current step
    if (currentStep === 1) {
      // Validate account information
      if (!formData.fullName || !formData.email) {
        toast.error("Please fill in all required fields")
        return
      }
    } else if (currentStep === 2) {
      // Validate company details
      if (!formData.companyName || !formData.industry) {
        toast.error("Please fill in all required fields")
        return
      }
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
      window.scrollTo(0, 0)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
      window.scrollTo(0, 0)
    }
  }

  const handleComplete = () => {
    // Save completion status
    localStorage.setItem("onboardingComplete", "true")

    // Show success message
    toast.success("Onboarding completed successfully!")

    // Redirect to dashboard
    router.push("/")
  }

  const handleSkip = () => {
    // Save minimal completion status
    localStorage.setItem("onboardingComplete", "true")

    // Show info message
    toast.info("You can complete your profile later in settings")

    // Redirect to dashboard
    router.push("/")
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Progress bar */}
      <div className="w-full max-w-3xl mb-8">
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium">
            Step {currentStep + 1} of {steps.length}
          </span>
          <span className="text-sm font-medium">{progress}% Complete</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            className="bg-black h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Step indicators */}
      <div className="w-full max-w-3xl mb-8 hidden md:block">
        <div className="flex justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  index < currentStep
                    ? "bg-black text-white"
                    : index === currentStep
                      ? "bg-white border-2 border-black text-black"
                      : "bg-gray-100 text-gray-400 border border-gray-200"
                }`}
              >
                {index < currentStep ? <Check className="h-5 w-5" /> : step.icon}
              </div>
              <span className={`text-xs mt-2 ${index === currentStep ? "font-medium" : "text-gray-500"}`}>
                {step.title}
              </span>
            </div>
          ))}
        </div>
        <div className="relative flex justify-between mt-4">
          <div className="absolute top-0 left-5 right-5 h-0.5 bg-gray-200" />
          {steps.map((_, index) => (
            <div key={`line-${index}`} className={`w-10 h-0.5 ${index < currentStep ? "bg-black" : "bg-gray-200"}`} />
          ))}
        </div>
      </div>

      {/* Content */}
      <Card className="w-full max-w-3xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {currentStep === 0 && (
              <>
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4">
                    <Image
                      src="/images/suitpax-logo.webp"
                      alt="Suitpax Logo"
                      width={120}
                      height={120}
                      className="mx-auto"
                    />
                  </div>
                  <CardTitle className="text-3xl font-bold tracking-tighter">Welcome to Suitpax</CardTitle>
                  <CardDescription className="text-lg">
                    The all-in-one platform for managing your business travel
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-center">
                  <p>
                    We'll guide you through setting up your account so you can start managing your business travel more
                    efficiently.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                    <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                      <Briefcase className="h-8 w-8 mb-2 mx-auto text-gray-700" />
                      <h3 className="font-medium mb-1">Streamlined Booking</h3>
                      <p className="text-sm text-gray-600">Book flights, hotels, and transportation in one place</p>
                    </div>
                    <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                      <CreditCard className="h-8 w-8 mb-2 mx-auto text-gray-700" />
                      <h3 className="font-medium mb-1">Expense Management</h3>
                      <p className="text-sm text-gray-600">Track and manage all your travel expenses easily</p>
                    </div>
                    <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                      <Users className="h-8 w-8 mb-2 mx-auto text-gray-700" />
                      <h3 className="font-medium mb-1">Team Collaboration</h3>
                      <p className="text-sm text-gray-600">Coordinate travel plans with your entire team</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={handleSkip} className="rounded-xl">
                    Skip for now
                  </Button>
                  <Button onClick={handleNext} className="bg-black text-white rounded-xl">
                    Get Started <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </>
            )}

            {currentStep === 1 && (
              <>
                <CardHeader>
                  <CardTitle>Account Information</CardTitle>
                  <CardDescription>Tell us about yourself so we can personalize your experience</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">
                      Full Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="fullName"
                      placeholder="John Doe"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange("fullName", e.target.value)}
                      className="rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">
                      Email Address <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john.doe@company.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="rounded-xl"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="jobTitle">Job Title</Label>
                      <Input
                        id="jobTitle"
                        placeholder="Travel Manager"
                        value={formData.jobTitle}
                        onChange={(e) => handleInputChange("jobTitle", e.target.value)}
                        className="rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="department">Department</Label>
                      <Select
                        value={formData.department}
                        onValueChange={(value) => handleInputChange("department", value)}
                      >
                        <SelectTrigger id="department" className="rounded-xl">
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="finance">Finance</SelectItem>
                          <SelectItem value="hr">Human Resources</SelectItem>
                          <SelectItem value="it">IT</SelectItem>
                          <SelectItem value="marketing">Marketing</SelectItem>
                          <SelectItem value="operations">Operations</SelectItem>
                          <SelectItem value="sales">Sales</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={handlePrevious} className="rounded-xl">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                  </Button>
                  <Button onClick={handleNext} className="bg-black text-white rounded-xl">
                    Continue <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </>
            )}

            {currentStep === 2 && (
              <>
                <CardHeader>
                  <CardTitle>Company Details</CardTitle>
                  <CardDescription>Tell us about your company to help us customize your experience</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">
                      Company Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="companyName"
                      placeholder="Acme Inc."
                      value={formData.companyName}
                      onChange={(e) => handleInputChange("companyName", e.target.value)}
                      className="rounded-xl"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="companySize">Company Size</Label>
                      <Select
                        value={formData.companySize}
                        onValueChange={(value) => handleInputChange("companySize", value)}
                      >
                        <SelectTrigger id="companySize" className="rounded-xl">
                          <SelectValue placeholder="Select company size" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1-10">1-10 employees</SelectItem>
                          <SelectItem value="11-50">11-50 employees</SelectItem>
                          <SelectItem value="51-200">51-200 employees</SelectItem>
                          <SelectItem value="201-500">201-500 employees</SelectItem>
                          <SelectItem value="501-1000">501-1000 employees</SelectItem>
                          <SelectItem value="1000+">1000+ employees</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="industry">
                        Industry <span className="text-red-500">*</span>
                      </Label>
                      <Select value={formData.industry} onValueChange={(value) => handleInputChange("industry", value)}>
                        <SelectTrigger id="industry" className="rounded-xl">
                          <SelectValue placeholder="Select industry" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="technology">Technology</SelectItem>
                          <SelectItem value="finance">Finance</SelectItem>
                          <SelectItem value="healthcare">Healthcare</SelectItem>
                          <SelectItem value="education">Education</SelectItem>
                          <SelectItem value="manufacturing">Manufacturing</SelectItem>
                          <SelectItem value="retail">Retail</SelectItem>
                          <SelectItem value="consulting">Consulting</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="companyAddress">Company Address</Label>
                    <Textarea
                      id="companyAddress"
                      placeholder="123 Business St, City, Country"
                      value={formData.companyAddress}
                      onChange={(e) => handleInputChange("companyAddress", e.target.value)}
                      className="rounded-xl"
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={handlePrevious} className="rounded-xl">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                  </Button>
                  <Button onClick={handleNext} className="bg-black text-white rounded-xl">
                    Continue <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </>
            )}

            {currentStep === 3 && (
              <>
                <CardHeader>
                  <CardTitle>Travel Preferences</CardTitle>
                  <CardDescription>Set your travel preferences to make booking easier</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Preferred Airlines</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {["American Airlines", "Delta", "United", "British Airways", "Lufthansa", "Emirates"].map(
                        (airline) => (
                          <div key={airline} className="flex items-center space-x-2">
                            <Checkbox
                              id={`airline-${airline}`}
                              checked={formData.preferredAirlines.includes(airline)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  handleInputChange("preferredAirlines", [...formData.preferredAirlines, airline])
                                } else {
                                  handleInputChange(
                                    "preferredAirlines",
                                    formData.preferredAirlines.filter((a) => a !== airline),
                                  )
                                }
                              }}
                            />
                            <label
                              htmlFor={`airline-${airline}`}
                              className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {airline}
                            </label>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Preferred Hotels</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {["Marriott", "Hilton", "Hyatt", "InterContinental", "Sheraton", "Westin"].map((hotel) => (
                        <div key={hotel} className="flex items-center space-x-2">
                          <Checkbox
                            id={`hotel-${hotel}`}
                            checked={formData.preferredHotels.includes(hotel)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                handleInputChange("preferredHotels", [...formData.preferredHotels, hotel])
                              } else {
                                handleInputChange(
                                  "preferredHotels",
                                  formData.preferredHotels.filter((h) => h !== hotel),
                                )
                              }
                            }}
                          />
                          <label
                            htmlFor={`hotel-${hotel}`}
                            className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {hotel}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="seatPreference">Seat Preference</Label>
                      <RadioGroup
                        value={formData.seatPreference}
                        onValueChange={(value) => handleInputChange("seatPreference", value)}
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="window" id="window" />
                          <Label htmlFor="window">Window</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="aisle" id="aisle" />
                          <Label htmlFor="aisle">Aisle</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="no-preference" id="no-preference" />
                          <Label htmlFor="no-preference">No Preference</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="mealPreference">Meal Preference</Label>
                      <Select
                        value={formData.mealPreference}
                        onValueChange={(value) => handleInputChange("mealPreference", value)}
                      >
                        <SelectTrigger id="mealPreference" className="rounded-xl">
                          <SelectValue placeholder="Select meal preference" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="regular">Regular</SelectItem>
                          <SelectItem value="vegetarian">Vegetarian</SelectItem>
                          <SelectItem value="vegan">Vegan</SelectItem>
                          <SelectItem value="kosher">Kosher</SelectItem>
                          <SelectItem value="halal">Halal</SelectItem>
                          <SelectItem value="gluten-free">Gluten-Free</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={handlePrevious} className="rounded-xl">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                  </Button>
                  <Button onClick={handleNext} className="bg-black text-white rounded-xl">
                    Continue <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </>
            )}

            {currentStep === 4 && (
              <>
                <CardHeader>
                  <CardTitle>Payment Methods</CardTitle>
                  <CardDescription>Add your payment methods for booking travel</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Payment Method</Label>
                    <RadioGroup
                      value={formData.paymentMethod}
                      onValueChange={(value) => handleInputChange("paymentMethod", value)}
                      className="grid grid-cols-1 md:grid-cols-2 gap-2"
                    >
                      <div className="flex items-center space-x-2 p-3 rounded-xl border border-gray-200 hover:bg-gray-50 cursor-pointer">
                        <RadioGroupItem value="corporate-card" id="corporate-card" />
                        <Label htmlFor="corporate-card" className="flex-1">
                          Corporate Card
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-3 rounded-xl border border-gray-200 hover:bg-gray-50 cursor-pointer">
                        <RadioGroupItem value="personal-card" id="personal-card" />
                        <Label htmlFor="personal-card" className="flex-1">
                          Personal Card
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-3 rounded-xl border border-gray-200 hover:bg-gray-50 cursor-pointer">
                        <RadioGroupItem value="invoice" id="invoice" />
                        <Label htmlFor="invoice" className="flex-1">
                          Invoice
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-3 rounded-xl border border-gray-200 hover:bg-gray-50 cursor-pointer">
                        <RadioGroupItem value="other" id="other" />
                        <Label htmlFor="other" className="flex-1">
                          Other
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {(formData.paymentMethod === "corporate-card" || formData.paymentMethod === "personal-card") && (
                    <div className="space-y-4 p-4 rounded-xl bg-gray-50 border border-gray-200">
                      <div className="space-y-2">
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input
                          id="cardNumber"
                          placeholder="•••• •••• •••• ••••"
                          value={formData.cardNumber}
                          onChange={(e) => handleInputChange("cardNumber", e.target.value)}
                          className="rounded-xl"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="cardName">Name on Card</Label>
                          <Input
                            id="cardName"
                            placeholder="John Doe"
                            value={formData.cardName}
                            onChange={(e) => handleInputChange("cardName", e.target.value)}
                            className="rounded-xl"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-2">
                            <Label htmlFor="cardExpiry">Expiry Date</Label>
                            <Input
                              id="cardExpiry"
                              placeholder="MM/YY"
                              value={formData.cardExpiry}
                              onChange={(e) => handleInputChange("cardExpiry", e.target.value)}
                              className="rounded-xl"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="cardCVC">CVC</Label>
                            <Input
                              id="cardCVC"
                              placeholder="•••"
                              value={formData.cardCVC}
                              onChange={(e) => handleInputChange("cardCVC", e.target.value)}
                              className="rounded-xl"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="billingAddress">Billing Address</Label>
                        <Textarea
                          id="billingAddress"
                          placeholder="123 Business St, City, Country"
                          value={formData.billingAddress}
                          onChange={(e) => handleInputChange("billingAddress", e.target.value)}
                          className="rounded-xl"
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={handlePrevious} className="rounded-xl">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                  </Button>
                  <Button onClick={handleNext} className="bg-black text-white rounded-xl">
                    Continue <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </>
            )}

            {currentStep === 5 && (
              <>
                <CardHeader>
                  <CardTitle>Team Setup</CardTitle>
                  <CardDescription>Invite your team members to join Suitpax</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="inviteTeam"
                      checked={formData.inviteTeam}
                      onCheckedChange={(checked) => handleInputChange("inviteTeam", checked)}
                    />
                    <Label htmlFor="inviteTeam">Invite team members now</Label>
                  </div>

                  {formData.inviteTeam && (
                    <div className="space-y-2">
                      <Label htmlFor="teamEmails">Team Member Emails</Label>
                      <Textarea
                        id="teamEmails"
                        placeholder="Enter email addresses separated by commas"
                        value={formData.teamEmails}
                        onChange={(e) => handleInputChange("teamEmails", e.target.value)}
                        className="rounded-xl"
                      />
                      <p className="text-xs text-gray-500">
                        Team members will receive an email invitation to join your Suitpax workspace.
                      </p>
                    </div>
                  )}

                  <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                    <h3 className="font-medium mb-2">Team Management Features</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center">
                        <Check className="h-4 w-4 mr-2 text-green-500" />
                        Assign travel booking permissions
                      </li>
                      <li className="flex items-center">
                        <Check className="h-4 w-4 mr-2 text-green-500" />
                        Set approval workflows for travel requests
                      </li>
                      <li className="flex items-center">
                        <Check className="h-4 w-4 mr-2 text-green-500" />
                        Share itineraries with team members
                      </li>
                      <li className="flex items-center">
                        <Check className="h-4 w-4 mr-2 text-green-500" />
                        Collaborate on travel planning
                      </li>
                    </ul>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={handlePrevious} className="rounded-xl">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                  </Button>
                  <Button onClick={handleNext} className="bg-black text-white rounded-xl">
                    Continue <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </>
            )}

            {currentStep === 6 && (
              <>
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                    <Check className="h-6 w-6 text-green-600" />
                  </div>
                  <CardTitle className="text-2xl">You're all set!</CardTitle>
                  <CardDescription>Your Suitpax account has been successfully configured</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-center">
                  <p>
                    Thank you for completing the onboarding process. You're now ready to start managing your business
                    travel with Suitpax.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                    <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                      <h3 className="font-medium mb-1">Book Travel</h3>
                      <p className="text-sm text-gray-600">Start booking flights, hotels, and transportation</p>
                    </div>
                    <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                      <h3 className="font-medium mb-1">Manage Expenses</h3>
                      <p className="text-sm text-gray-600">Track and manage your travel expenses</p>
                    </div>
                    <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                      <h3 className="font-medium mb-1">Invite Team</h3>
                      <p className="text-sm text-gray-600">Add more team members to your workspace</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={handlePrevious} className="rounded-xl">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                  </Button>
                  <Button onClick={handleComplete} className="bg-black text-white rounded-xl">
                    Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </Card>
    </div>
  )
}
