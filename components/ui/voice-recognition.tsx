"use client"

import { useState, useEffect } from "react"
import { MicrophoneIcon, StopIcon } from "@heroicons/react/24/outline"

// Definir tipos para la API de reconocimiento de voz
interface SpeechRecognitionEvent extends Event {
  resultIndex: number
  results: SpeechRecognitionResultList
}

interface SpeechRecognitionResultList {
  [index: number]: SpeechRecognitionResult
  length: number
}

interface SpeechRecognitionResult {
  [index: number]: SpeechRecognitionAlternative
  isFinal: boolean
  length: number
}

interface SpeechRecognitionAlternative {
  transcript: string
  confidence: number
}

interface VoiceRecognitionProps {
  onTranscript: (text: string) => void
  buttonSize?: "sm" | "md" | "lg"
  className?: string
}

export default function VoiceRecognition({ onTranscript, buttonSize = "md", className = "" }: VoiceRecognitionProps) {
  const [isListening, setIsListening] = useState(false)
  const [isSupported, setIsSupported] = useState(true)

  // Tamaños de botón
  const sizes = {
    sm: "p-1.5 rounded-xl",
    md: "p-2 rounded-xl",
    lg: "p-3 rounded-xl",
  }

  const iconSizes = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  }

  useEffect(() => {
    // Verificar si el navegador soporta reconocimiento de voz
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      setIsSupported(false)
      console.warn("Speech recognition is not supported in this browser.")
    }
  }, [])

  const toggleListening = () => {
    if (!isSupported) return

    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
  }

  const startListening = () => {
    setIsListening(true)

    // Usar la API de reconocimiento de voz
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()

    recognition.lang = "en-US"
    recognition.continuous = true
    recognition.interimResults = true

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0])
        .map((result) => result.transcript)
        .join("")

      // Solo enviar el texto cuando sea un resultado final
      if (event.results[event.resultIndex].isFinal) {
        onTranscript(transcript + " ")
      }
    }

    recognition.onerror = (event) => {
      console.error("Speech recognition error", event)
      setIsListening(false)
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognition.start()

    // Guardar la instancia para poder detenerla después
    window.speechRecognitionInstance = recognition
  }

  const stopListening = () => {
    if (window.speechRecognitionInstance) {
      window.speechRecognitionInstance.stop()
    }
    setIsListening(false)
  }

  if (!isSupported) return null

  return (
    <button
      type="button"
      onClick={toggleListening}
      className={`${sizes[buttonSize]} ${
        isListening ? "bg-red-500 text-white hover:bg-red-600" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
      } transition-colors ${className}`}
      title={isListening ? "Stop recording" : "Start voice input"}
    >
      {isListening ? (
        <StopIcon className={iconSizes[buttonSize]} />
      ) : (
        <MicrophoneIcon className={iconSizes[buttonSize]} />
      )}
    </button>
  )
}

// Extender la interfaz Window para incluir la instancia de reconocimiento
declare global {
  interface Window {
    SpeechRecognition?: typeof SpeechRecognition
    webkitSpeechRecognition?: typeof SpeechRecognition
    speechRecognitionInstance?: any
  }
}
