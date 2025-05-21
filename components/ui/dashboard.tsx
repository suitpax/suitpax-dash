"use client"

import { useEffect } from "react"
import DashboardContent from "./dashboard-content"
import { Sidebar } from "./sidebar" // Cambiado de importación por defecto a nombrada
import TopNav from "./top-nav" // Esto está bien si TopNav es una exportación por defecto

export default function Dashboard() {
  // Añadir al inicio del componente Dashboard, justo después de la declaración de la función
  // para evitar el desplazamiento automático
  useEffect(() => {
    // Asegurar que la página se cargue desde arriba
    window.scrollTo(0, 0)
  }, [])
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="flex flex-col h-screen">
        <header className="h-14 border-b border-white/10">
          <TopNav />
        </header>
        <div className="flex flex-1 overflow-hidden">
          <aside className="hidden lg:block w-64 border-r border-white/10">
            <Sidebar />
          </aside>
          <main className="flex-1 overflow-y-auto p-3 sm:p-6">
            <div className="space-y-6">
              {/* Contenido del dashboard */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <DashboardContent />
                {/* Componentes del dashboard */}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
