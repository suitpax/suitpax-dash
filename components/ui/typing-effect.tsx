"use client"

import { useState, useEffect } from "react"

interface TypingEffectProps {
  text: string
  speed?: number
  className?: string
  onComplete?: () => void
}

export function TypingEffect({ text, speed = 30, className = "", onComplete }: TypingEffectProps) {
  const [displayedText, setDisplayedText] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showCursor, setShowCursor] = useState(true)

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText((prev) => prev + text[currentIndex])
        setCurrentIndex((prev) => prev + 1)
      }, speed)

      return () => clearTimeout(timer)
    } else {
      onComplete?.()
      // Hide cursor after typing is complete
      const cursorTimer = setTimeout(() => {
        setShowCursor(false)
      }, 1000)
      return () => clearTimeout(cursorTimer)
    }
  }, [currentIndex, text, speed, onComplete])

  useEffect(() => {
    // Cursor blinking effect
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev)
    }, 500)

    return () => clearInterval(cursorInterval)
  }, [])

  // Reset when text changes
  useEffect(() => {
    setDisplayedText("")
    setCurrentIndex(0)
    setShowCursor(true)
  }, [text])

  return (
    <span className={className}>
      {displayedText}
      {showCursor && currentIndex <= text.length && <span className="animate-pulse text-white/70">|</span>}
    </span>
  )
}
