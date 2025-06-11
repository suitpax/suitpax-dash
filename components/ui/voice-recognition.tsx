"use client"

import { useState, useEffect } from "react"
import { Mic, MicOff } from "lucide-react"

interface VoiceRecognitionProps {
  onTranscript: (text: string) => void
  buttonSize?: "sm" | "md" | "lg"
  className?: string
}

declare global {
  interface Window {
    SpeechRecognition: any
    webkitSpeechRecognition: any
  }
}

export default function VoiceRecognition({ onTranscript, buttonSize = "md", className = "" }: VoiceRecognitionProps) {
  const [isListening, setIsListening] = useState(false)
  const [recognition, setRecognition] = useState<any>(null)
  const [isSupported, setIsSupported] = useState(false)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

      if (SpeechRecognition) {
        setIsSupported(true)
        const recognitionInstance = new SpeechRecognition()

        recognitionInstance.continuous = false
        recognitionInstance.interimResults = false
        recognitionInstance.lang = "en-US"

        recognitionInstance.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript
          onTranscript(transcript)
          setIsListening(false)
        }

        recognitionInstance.onerror = (event: any) => {
          console.error("Speech recognition error:", event.error)
          setIsListening(false)
        }

        recognitionInstance.onend = () => {
          setIsListening(false)
        }

        setRecognition(recognitionInstance)
      }
    }
  }, [onTranscript])

  const toggleListening = () => {
    if (!recognition) return

    if (isListening) {
      recognition.stop()
      setIsListening(false)
    } else {
      recognition.start()
      setIsListening(true)
    }
  }

  if (!isSupported) {
    return null
  }

  const sizeClasses = {
    sm: "p-1.5",
    md: "p-2",
    lg: "p-3",
  }

  const iconSizes = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  }

  return (
    <button
      type="button"
      onClick={toggleListening}
      className={`rounded-lg transition-colors ${sizeClasses[buttonSize]} ${
        isListening
          ? "bg-red-500/20 text-red-400 hover:bg-red-500/30"
          : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white"
      } ${className}`}
      title={isListening ? "Stop recording" : "Start voice input"}
    >
      {isListening ? <MicOff className={iconSizes[buttonSize]} /> : <Mic className={iconSizes[buttonSize]} />}
    </button>
  )
}
