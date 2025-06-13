"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export function ThemeToggle() {
  const [mounted, setMounted] = React.useState(false)
  const { theme, setTheme } = useTheme()

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-white/10 transition-colors">
        <div className="h-4 w-4 rounded-full bg-white/20 transition-transform" />
      </div>
    )
  }

  const isDark = theme === "dark"

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/20 focus:ring-offset-2 focus:ring-offset-black ${
        isDark ? "bg-white/20 hover:bg-white/30" : "bg-gray-300 hover:bg-gray-400"
      }`}
      aria-label="Toggle theme"
    >
      {/* Toggle Circle */}
      <span
        className={`inline-block h-4 w-4 transform rounded-full transition-all duration-300 ${
          isDark ? "translate-x-1 bg-white shadow-lg" : "translate-x-6 bg-white shadow-lg"
        }`}
      >
        {/* Icon inside circle */}
        <span className="flex h-full w-full items-center justify-center">
          {isDark ? <Moon className="h-2.5 w-2.5 text-gray-800" /> : <Sun className="h-2.5 w-2.5 text-yellow-600" />}
        </span>
      </span>

      {/* Background Icons */}
      <span className="absolute left-1 top-1">
        <Moon
          className={`h-3 w-3 transition-opacity duration-300 ${isDark ? "opacity-0" : "opacity-60 text-gray-600"}`}
        />
      </span>
      <span className="absolute right-1 top-1">
        <Sun
          className={`h-3 w-3 transition-opacity duration-300 ${isDark ? "opacity-60 text-white/60" : "opacity-0"}`}
        />
      </span>
    </button>
  )
}
