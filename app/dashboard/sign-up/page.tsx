"use client"

import type React from "react"
import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { PiEnvelope, PiLock, PiBuildings, PiArrowRight, PiEye, PiEyeSlash, PiUser, PiCheck } from "react-icons/pi"

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    company: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [acceptedTerms, setAcceptedTerms] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!acceptedTerms) return

    setIsLoading(true)

    // Simulación de registro
    setTimeout(() => {
      setIsLoading(false)
      window.location.href = "/dashboard"
    }, 2000)
  }

  const isFormValid =
    formData.firstName && formData.lastName && formData.email && formData.password && formData.company && acceptedTerms

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Panel izquierdo - Visual */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-white/5 to-white/10 items-center justify-center p-8">
        <div className="max-w-md text-center space-y-6">
          <div className="w-24 h-24 bg-white/10 rounded-2xl flex items-center justify-center mx-auto">
            <PiBuildings className="h-12 w-12 text-white/60" />
          </div>
          <div className="space-y-4">
            <h2 className="text-2xl font-light">Join Thousands of Companies</h2>
            <p className="text-white/60 leading-relaxed">
              Transform your business travel management with our comprehensive platform. Get started in minutes and
              experience the difference.
            </p>
          </div>
          <div className="space-y-3">
            {[
              "AI-powered travel recommendations",
              "Automated expense tracking",
              "Real-time booking management",
              "24/7 customer support",
            ].map((feature, index) => (
              <div key={index} className="flex items-center gap-3 text-sm text-white/70">
                <div className="w-5 h-5 bg-white/10 rounded-full flex items-center justify-center">
                  <PiCheck className="h-3 w-3 text-white/60" />
                </div>
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Panel derecho - Formulario */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="text-center">
            <Image
              src="/images/suitpax-cloud-logo.webp"
              alt="Suitpax Logo"
              width={160}
              height={40}
              className="h-10 w-auto mx-auto mb-8"
              priority
            />
            <div className="space-y-2">
              <h1 className="text-3xl font-light">Create your account</h1>
              <p className="text-white/60 text-sm">Start managing your business travel efficiently</p>
            </div>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nombre y Apellido */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="firstName" className="text-sm font-medium text-white/80">
                  First Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4">
                    <PiUser className="h-5 w-5 text-white/40" />
                  </div>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/20 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="lastName" className="text-sm font-medium text-white/80">
                  Last Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4">
                    <PiUser className="h-5 w-5 text-white/40" />
                  </div>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/20 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-white/80">
                Work Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4">
                  <PiEnvelope className="h-5 w-5 text-white/40" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john@company.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/20 transition-all"
                />
              </div>
            </div>

            {/* Company */}
            <div className="space-y-2">
              <label htmlFor="company" className="text-sm font-medium text-white/80">
                Company Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4">
                  <PiBuildings className="h-5 w-5 text-white/40" />
                </div>
                <input
                  id="company"
                  name="company"
                  type="text"
                  placeholder="Acme Inc."
                  value={formData.company}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/20 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-white/80">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4">
                  <PiLock className="h-5 w-5 text-white/40" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-12 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-white/40 hover:text-white/60 transition-colors"
                >
                  {showPassword ? <PiEyeSlash className="h-5 w-5" /> : <PiEye className="h-5 w-5" />}
                </button>
              </div>
              <p className="text-xs text-white/50">Must be at least 8 characters with numbers and symbols</p>
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start gap-3">
              <button
                type="button"
                onClick={() => setAcceptedTerms(!acceptedTerms)}
                className={`mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                  acceptedTerms ? "bg-white/20 border-white/30" : "border-white/20 hover:border-white/30"
                }`}
              >
                {acceptedTerms && <PiCheck className="h-3 w-3 text-white" />}
              </button>
              <div className="text-sm text-white/70 leading-relaxed">
                I agree to the{" "}
                <Link href="/terms" className="text-white hover:text-white/80 underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-white hover:text-white/80 underline">
                  Privacy Policy
                </Link>
              </div>
            </div>

            {/* Create Account Button */}
            <button
              type="submit"
              disabled={isLoading || !isFormValid}
              className="w-full bg-white/10 hover:bg-white/15 border border-white/10 hover:border-white/20 rounded-xl py-3 px-4 font-medium transition-all duration-200 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : (
                <>
                  <span>Create Account</span>
                  <PiArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-black px-4 text-sm text-white/50">or continue with</span>
            </div>
          </div>

          {/* SSO Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl py-3 px-4 transition-all duration-200 group">
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span className="text-sm font-medium">Google</span>
            </button>

            <button className="flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl py-3 px-4 transition-all duration-200 group">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="#0A66C2">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
              </svg>
              <span className="text-sm font-medium">LinkedIn</span>
            </button>
          </div>

          {/* Sign In Link */}
          <div className="text-center">
            <span className="text-white/60 text-sm">Already have an account? </span>
            <Link
              href="/dashboard/sign-in"
              className="text-white hover:text-white/80 font-medium text-sm transition-colors"
            >
              Sign in here
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
