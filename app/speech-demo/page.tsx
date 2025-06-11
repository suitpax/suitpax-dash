import { SpeechExample } from "@/components/speech-example"

export default function SpeechDemoPage() {
  return (
    <div className="container mx-auto py-6 px-4">
      <h1 className="text-3xl font-medium tracking-tighter mb-6">Demostración de Texto a Voz</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SpeechExample />
        <div className="space-y-4">
          <div className="card-rounded p-6 bg-white/50 backdrop-blur-sm">
            <h2 className="text-xl font-medium tracking-tighter mb-4">Sobre esta funcionalidad</h2>
            <p className="text-sm mb-3">
              Esta demostración utiliza la Web Speech API para convertir texto a voz directamente en el navegador.
            </p>
            <p className="text-sm mb-3">
              Puedes ajustar la velocidad, el tono y el volumen de la voz, así como seleccionar entre las diferentes
              voces disponibles en tu sistema.
            </p>
            <p className="text-sm">Esta funcionalidad es útil para:</p>
            <ul className="list-disc list-inside text-sm mt-2 space-y-1">
              <li>Mejorar la accesibilidad de la aplicación</li>
              <li>Proporcionar información auditiva a los usuarios</li>
              <li>Crear una experiencia más interactiva</li>
              <li>Asistir a usuarios con discapacidades visuales</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
