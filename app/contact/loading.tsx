import { Loader2 } from "lucide-react"

export default function ContactLoading() {
  return (
    <div className="min-h-screen bg-black p-6 flex items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-12 w-12 text-white animate-spin" />
        <p className="text-white/70 text-lg">Cargando formulario de contacto...</p>
      </div>
    </div>
  )
}
