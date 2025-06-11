"use client"

import { useState, useEffect, useCallback } from "react"

type SpeechOptions = {
  rate?: number
  pitch?: number
  volume?: number
  lang?: string
}

export function useSpeech(defaultOptions: SpeechOptions = {}) {
  const [speaking, setSpeaking] = useState(false)
  const [supported, setSupported] = useState(false)
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const [currentVoice, setCurrentVoice] = useState<SpeechSynthesisVoice | null>(null)

  useEffect(() => {
    // Verificar si el navegador soporta la API de síntesis de voz
    const isSupported = "speechSynthesis" in window
    setSupported(isSupported)

    if (isSupported) {
      // Obtener las voces disponibles
      const loadVoices = () => {
        const availableVoices = window.speechSynthesis.getVoices()
        setVoices(availableVoices)

        // Establecer una voz predeterminada (preferiblemente en español)
        const spanishVoice = availableVoices.find((voice) => voice.lang.includes("es"))
        const defaultVoice = spanishVoice || availableVoices[0]
        setCurrentVoice(defaultVoice || null)
      }

      // Chrome necesita este evento para cargar las voces
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = loadVoices
      }

      loadVoices()

      // Limpiar al desmontar
      return () => {
        window.speechSynthesis.cancel()
      }
    }
  }, [])

  const speak = useCallback(
    (text: string, options: SpeechOptions = {}) => {
      if (!supported) return false

      // Cancelar cualquier síntesis de voz en curso
      window.speechSynthesis.cancel()

      const utterance = new SpeechSynthesisUtterance(text)

      // Configurar opciones
      utterance.rate = options.rate || defaultOptions.rate || 1
      utterance.pitch = options.pitch || defaultOptions.pitch || 1
      utterance.volume = options.volume || defaultOptions.volume || 1
      utterance.lang = options.lang || defaultOptions.lang || "es-ES"

      if (currentVoice) {
        utterance.voice = currentVoice
      }

      // Eventos
      utterance.onstart = () => setSpeaking(true)
      utterance.onend = () => setSpeaking(false)
      utterance.onerror = () => setSpeaking(false)

      window.speechSynthesis.speak(utterance)
      return true
    },
    [supported, currentVoice, defaultOptions],
  )

  const stop = useCallback(() => {
    if (!supported) return false
    window.speechSynthesis.cancel()
    setSpeaking(false)
    return true
  }, [supported])

  const changeVoice = useCallback((voice: SpeechSynthesisVoice) => {
    setCurrentVoice(voice)
  }, [])

  return {
    speak,
    stop,
    speaking,
    supported,
    voices,
    currentVoice,
    changeVoice,
  }
}
