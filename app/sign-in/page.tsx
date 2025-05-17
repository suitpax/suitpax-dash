"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { signIn } from "next-auth/react"
import { AtSign, Lock, ArrowRight } from "lucide-react"
import { SiGoogle, SiLinkedin } from "react-icons/si"

export default function SignIn() {
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError("Invalid email or password")
        setIsLoading(false)
      } else {
        // Redirigir al dashboard después de iniciar sesión
        window.location.href = "/dashboard"
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error)
      setError("An unexpected error occurred")
      setIsLoading(false)
    }
  }

  const handleProviderSignIn = (provider: string) => {
    setIsLoading(true)
    signIn(provider, { callbackUrl: "/dashboard" })
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
              priority
            />
          </div>

          {/* Título y subtítulo */}
          <div className="text-center">
            <h1 className="text-xl font-medium text-white">Welcome back</h1>
            <p className="mt-2 text-sm text-white/70">Sign in to your Suitpax account</p>
          </div>

          {/* Error message */}
          {error && (
            <div className="rounded-lg bg-white/5 border border-white/10 p-3 text-sm text-red-400">{error}</div>
          )}

          {/* Formulario */}
          <form onSubmit={handleSignIn} className="space-y-4">
            {/* Email */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                <AtSign className="h-4 w-4 text-white/50" />
              </div>
              <input
                type="email"
                placeholder="Work email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-white/20"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                <Lock className="h-4 w-4 text-white/50" />
              </div>
              <input
                type="password"
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-white/20"
              />
            </div>

            {/* Forgot Password */}
            <div className="flex justify-end">
              <Link href="/forgot-password" className="text-sm text-white/70 hover:text-white">
                Forgot password?
              </Link>
            </div>

            {/* Botón de Sign In */}
            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full items-center justify-center space-x-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg py-2 px-4 font-medium transition-colors"
            >
              {isLoading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Separador */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-black px-2 text-sm text-white/50">or continue with</span>
            </div>
          </div>

          {/* SSO Buttons */}
          <div className="grid grid-cols-2 gap-4">
            {/* Google */}
            <button
              onClick={() => handleProviderSignIn("google")}
              className="flex items-center justify-center space-x-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg py-2 px-4 transition-colors"
            >
              <SiGoogle className="h-4 w-4 text-white" />
              <span className="text-sm">Google</span>
            </button>

            {/* LinkedIn */}
            <button
              onClick={() => handleProviderSignIn("linkedin")}
              className="flex items-center justify-center space-x-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg py-2 px-4 transition-colors"
            >
              <SiLinkedin className="h-4 w-4 text-white" />
              <span className="text-sm">LinkedIn</span>
            </button>
          </div>

          {/* Sign Up Link */}
          <div className="text-center text-sm">
            <span className="text-white/70">Don't have an account?</span>{" "}
            <Link href="/sign-up" className="text-white hover:underline">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
