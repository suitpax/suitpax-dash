"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { AtSign, Building2, Lock, ArrowRight } from "lucide-react"
import { SiGoogle, SiLinkedin } from "react-icons/si"

export default function SignUp() {
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [company, setCompany] = useState("")
  const [error, setError] = useState("")

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Redirigir a Auth0 para registro
      window.location.href = `/api/auth/login?screen_hint=signup`
    } catch (error) {
      console.error("Error al registrarse:", error)
      setError("An unexpected error occurred")
      setIsLoading(false)
    }
  }

  const handleProviderSignUp = (provider: string) => {
    setIsLoading(true)
    // Redirigir a Auth0 con el proveedor específico y pantalla de registro
    window.location.href = `/api/auth/login?connection=${provider}&screen_hint=signup`
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-black text-white">
      <div className="flex min-h-screen items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md space-y-6">
          {/* Logo */}
          <div className="flex justify-center">
            <Image
              src="/images/suitpax-cloud-logo.webp"
              alt="Suitpax Logo"
              width={120}
              height={30}
              className="h-7 w-auto"
            />
          </div>

          <div className="space-y-2 text-center">
            <h1 className="text-xl font-medium text-white">Create your account</h1>
            <p className="text-sm text-white/70">Start managing your business travel efficiently</p>
          </div>

          {/* Error message */}
          {error && (
            <div className="rounded-lg bg-white/5 border border-white/10 p-3 text-sm text-red-400">{error}</div>
          )}

          {/* Sign Up Form */}
          <form onSubmit={handleSignUp} className="space-y-4">
            {/* Work Email */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-sm font-medium text-white">
                Work Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <AtSign className="h-4 w-4 text-white/50" />
                </div>
                <input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-white/5 py-2 pl-10 pr-4 text-white placeholder:text-white/30 focus:border-white/20 focus:outline-none focus:ring-1 focus:ring-white/20"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label htmlFor="password" className="text-sm font-medium text-white">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <Lock className="h-4 w-4 text-white/50" />
                </div>
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-white/5 py-2 pl-10 pr-4 text-white placeholder:text-white/30 focus:border-white/20 focus:outline-none focus:ring-1 focus:ring-white/20"
                  required
                />
              </div>
              <p className="text-xs text-white/50">Must be at least 8 characters</p>
            </div>

            {/* Company Name */}
            <div className="space-y-1.5">
              <label htmlFor="company" className="text-sm font-medium text-white">
                Company Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <Building2 className="h-4 w-4 text-white/50" />
                </div>
                <input
                  id="company"
                  type="text"
                  placeholder="Acme Inc."
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-white/5 py-2 pl-10 pr-4 text-white placeholder:text-white/30 focus:border-white/20 focus:outline-none focus:ring-1 focus:ring-white/20"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 py-2 px-4 text-sm font-medium text-white transition-colors"
            >
              {isLoading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-white/10"></div>
            <span className="mx-4 flex-shrink text-xs text-white/50">OR CONTINUE WITH</span>
            <div className="flex-grow border-t border-white/10"></div>
          </div>

          {/* SSO Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleProviderSignUp("google-oauth2")}
              className="flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 py-2 px-4 text-sm font-medium text-white hover:bg-white/10"
            >
              <SiGoogle className="h-4 w-4 text-white" />
              Google
            </button>
            <button
              type="button"
              onClick={() => handleProviderSignUp("linkedin")}
              className="flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 py-2 px-4 text-sm font-medium text-white hover:bg-white/10"
            >
              <SiLinkedin className="h-4 w-4 text-white" />
              LinkedIn
            </button>
          </div>

          {/* Sign In Link */}
          <div className="text-center text-sm text-white/70">
            Already have an account?{" "}
            <Link href="/sign-in" className="font-medium text-white hover:underline">
              Sign in
            </Link>
          </div>

          {/* Terms */}
          <div className="text-center text-xs text-white/50">
            By signing up, you agree to our{" "}
            <Link href="/terms" className="text-white/70 hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-white/70 hover:underline">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
