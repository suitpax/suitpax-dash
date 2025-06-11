"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Volume2, Play, Square } from "lucide-react"
import { useSpeech } from "@/hooks/use-speech"

export function SpeechExample() {
  const [text, setText] = useState("Hola, soy el asistente de viajes de Suitpax. ¿En qué puedo ayudarte hoy?")
  const [rate, setRate] = useState(1)
  const [pitch, setPitch] = useState(1)
  const [volume, setVolume] = useState(1)

  const { speak, stop, speaking, supported, voices, currentVoice, changeVoice } = useSpeech()

  const handleSpeak = () => {
    speak(text, { rate, pitch, volume })
  }

  if (!supported) {
    return (
      <Card className="card-rounded">
        <CardHeader>
          <CardTitle>Texto a Voz</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Tu navegador no soporta la API de síntesis de voz.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="card-rounded">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Volume2 className="mr-2 h-5 w-5" />
          Texto a Voz
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="speech-text">Texto a leer</Label>
          <Textarea
            id="speech-text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="input-rounded min-h-[100px]"
            placeholder="Escribe el texto que quieres que se lea..."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="speech-rate">Velocidad: {rate.toFixed(1)}</Label>
          <Slider
            id="speech-rate"
            min={0.5}
            max={2}
            step={0.1}
            value={[rate]}
            onValueChange={(value) => setRate(value[0])}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="speech-pitch">Tono: {pitch.toFixed(1)}</Label>
          <Slider
            id="speech-pitch"
            min={0.5}
            max={2}
            step={0.1}
            value={[pitch]}
            onValueChange={(value) => setPitch(value[0])}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="speech-volume">Volumen: {volume.toFixed(1)}</Label>
          <Slider
            id="speech-volume"
            min={0}
            max={1}
            step={0.1}
            value={[volume]}
            onValueChange={(value) => setVolume(value[0])}
          />
        </div>

        {voices.length > 0 && (
          <div className="space-y-2">
            <Label htmlFor="speech-voice">Voz</Label>
            <select
              id="speech-voice"
              className="w-full input-rounded p-2"
              value={currentVoice?.name || ""}
              onChange={(e) => {
                const selectedVoice = voices.find((v) => v.name === e.target.value)
                if (selectedVoice) changeVoice(selectedVoice)
              }}
            >
              {voices.map((voice) => (
                <option key={voice.name} value={voice.name}>
                  {voice.name} ({voice.lang})
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="flex space-x-2">
          <Button onClick={handleSpeak} disabled={speaking} className="btn-sm flex-1">
            <Play className="mr-2 h-4 w-4" />
            Reproducir
          </Button>
          <Button onClick={stop} disabled={!speaking} variant="outline" className="btn-sm flex-1">
            <Square className="mr-2 h-4 w-4" />
            Detener
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
