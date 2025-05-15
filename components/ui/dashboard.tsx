"use client"

import DashboardContent from "./dashboard-content"
import Layout from "./layout"
import { useEffect } from "react"

export default function Dashboard() {
  // Añadir al inicio del componente Dashboard, justo después de la declaración de la función
  // para evitar el desplazamiento automático
  useEffect(() => {
    // Asegurar que la página se cargue desde arriba
    window.scrollTo(0, 0)
  }, [])
  return (
    <Layout>
      <DashboardContent />
    </Layout>
  )
}
