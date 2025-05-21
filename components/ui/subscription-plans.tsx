"use client"

import { useState } from "react"
import { Check } from "lucide-react"
import { toast } from "sonner"

export function SubscriptionPlans() {
  const [isLoading, setIsLoading] = useState<string | null>(null)

  const plans = [
    {
      id: "starter",
      name: "Starter",
      price: "Free",
      description: "Para empresas que quieren probar la próxima generación de planificación de viajes con IA",
      features: [
        "1,000 tokens de IA/mes",
        "3 búsquedas de viajes con IA por mes",
        "Hasta 5 miembros del equipo",
        "Gestión de gastos con IA (complemento)",
        "Planificación de itinerario estándar",
        "Políticas de viaje personalizadas",
        "Soporte estándar 24/5",
      ],
      popular: false,
      action: "Comenzar",
    },
    {
      id: "pro",
      name: "Pro",
      price: "$89",
      description: "Para empresas en crecimiento que buscan optimizar su planificación de viajes al siguiente nivel",
      features: [
        "10,000 tokens de IA/mes",
        "30 búsquedas de viajes con IA por mes",
        "Hasta 20 miembros del equipo",
        "Gestión de gastos con IA",
        "Planificación avanzada de itinerarios",
        "Políticas de viaje personalizadas",
        "Soporte premium 24/5",
        "Inteligencia TRM básica",
        "Coordinación de viajes en equipo",
        "Integración básica con API bancaria",
      ],
      popular: true,
      action: "Suscribirse",
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: "Personalizado",
      description: "Para grandes empresas que buscan llevar su planificación de viajes al siguiente nivel",
      features: [
        "50,000 tokens de IA/mes",
        "50 búsquedas de viajes con IA por mes",
        "Hasta 50 miembros del equipo",
        "Gestión de viajes corporativos",
        "Planificación de viajes en equipo",
        "Inteligencia TRM avanzada",
        "Optimización de gastos de viaje",
        "Gestión de múltiples entidades",
        "Integración con sistemas existentes",
        "Coordinación de reuniones de equipo",
      ],
      popular: false,
      action: "Obtener presupuesto",
    },
  ]

  const handleSelectPlan = async (planId: string) => {
    try {
      setIsLoading(planId)

      if (planId === "enterprise") {
        window.location.href = "/contact?plan=enterprise"
        return
      }

      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ planName: planId }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Error al procesar la solicitud")
      }

      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error("No se recibió URL de checkout")
      }
    } catch (error: any) {
      console.error("Error al seleccionar plan:", error)
      toast.error(error.message || "Error al procesar la solicitud")
    } finally {
      setIsLoading(null)
    }
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-white mb-4">PRECIOS</h2>
        <p className="text-white/70 max-w-2xl mx-auto">
          Elige el plan que mejor se adapte a las necesidades de tu empresa
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`bg-black border ${
              plan.popular ? "border-white/20" : "border-white/10"
            } rounded-lg p-6 flex flex-col relative ${plan.popular ? "transform md:-translate-y-4" : ""}`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-0 right-0 flex justify-center">
                <span className="bg-white/10 text-white px-3 py-1 rounded-full text-sm font-medium">Más Popular</span>
              </div>
            )}

            <div className="mb-6">
              <h3 className="text-2xl font-bold text-white">{plan.name}</h3>
              <div className="mt-2">
                <span className="text-3xl font-bold text-white">{plan.price}</span>
                {plan.price !== "Free" && plan.price !== "Personalizado" && (
                  <span className="text-white/50 ml-1">/mes</span>
                )}
              </div>
              <p className="text-white/70 mt-3 text-sm">{plan.description}</p>
            </div>

            <div className="flex-grow">
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start">
                    <Check className="h-5 w-5 text-white/70 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-white/70 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => handleSelectPlan(plan.id)}
              disabled={isLoading === plan.id}
              className="w-full py-2 px-4 rounded-lg font-medium transition-colors bg-white/10 text-white hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading === plan.id ? "Procesando..." : plan.action}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
