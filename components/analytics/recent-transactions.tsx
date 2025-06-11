import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bank, CreditCard, Wallet, Globe, CurrencyDollar, CheckCircle, LockSimple } from "@phosphor-icons/react"

const bankConnections = [
  {
    id: "1",
    name: "Banco Digital Connect",
    description: "Conecta tu cuenta bancaria para sincronizar gastos de viaje automáticamente",
    status: "recommended",
    feature: "Sincronización automática",
    icon: Bank,
  },
  {
    id: "2",
    name: "Tarjeta Corporativa",
    description: "Vincula tus tarjetas corporativas para seguimiento en tiempo real",
    status: "popular",
    feature: "Seguimiento en tiempo real",
    icon: CreditCard,
  },
  {
    id: "3",
    name: "Wallet Digital",
    description: "Conecta tu wallet digital para pagos internacionales sin comisiones",
    status: "new",
    feature: "Sin comisiones internacionales",
    icon: Wallet,
  },
  {
    id: "4",
    name: "Pagos Globales",
    description: "Habilita pagos en múltiples divisas para tus viajes internacionales",
    status: "secure",
    feature: "Múltiples divisas",
    icon: Globe,
  },
  {
    id: "5",
    name: "Presupuesto Empresarial",
    description: "Conecta con tu sistema de presupuesto empresarial para control de gastos",
    status: "enterprise",
    feature: "Control de presupuesto",
    icon: CurrencyDollar,
  },
]

// Función para obtener el color del badge según el estado
const getStatusColor = (status: string) => {
  switch (status) {
    case "recommended":
      return "bg-emerald-100 text-emerald-800"
    case "popular":
      return "bg-blue-100 text-blue-800"
    case "new":
      return "bg-purple-100 text-purple-800"
    case "secure":
      return "bg-amber-100 text-amber-800"
    case "enterprise":
      return "bg-gray-100 text-gray-800"
    default:
      return "bg-gray-200 text-gray-700"
  }
}

// Función para obtener el texto del badge según el estado
const getStatusText = (status: string) => {
  switch (status) {
    case "recommended":
      return "Recomendado"
    case "popular":
      return "Popular"
    case "new":
      return "Nuevo"
    case "secure":
      return "Seguro"
    case "enterprise":
      return "Empresarial"
    default:
      return status
  }
}

export function RecentTransactions() {
  return (
    <div className="space-y-4">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="text-lg font-medium tracking-tighter">Conecta Suitpax con tu Banco</CardTitle>
        <p className="text-sm text-gray-500">Sincroniza tus gastos de viaje automáticamente</p>
      </CardHeader>

      {bankConnections.map((connection) => (
        <Card key={connection.id} className="overflow-hidden transition-all duration-200 hover:shadow-md">
          <CardContent className="p-4">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100">
                <connection.icon className="h-5 w-5 text-gray-700" weight="duotone" />
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium leading-none">{connection.name}</p>
                  <span
                    className={`inline-flex items-center rounded-xl px-2.5 py-0.5 text-[10px] font-medium ${getStatusColor(connection.status)}`}
                  >
                    {getStatusText(connection.status)}
                  </span>
                </div>
                <p className="text-xs text-gray-500">{connection.description}</p>

                <div className="mt-2 flex items-center gap-2">
                  <Button variant="outline" size="sm" className="h-7 rounded-xl text-xs">
                    Conectar
                  </Button>
                  <Button variant="ghost" size="sm" className="h-7 rounded-xl text-xs">
                    Más info
                  </Button>
                </div>
              </div>

              <div className="ml-auto flex items-center text-right">
                <span className="flex items-center text-xs font-medium text-gray-500">
                  {connection.status === "recommended" ? (
                    <CheckCircle className="mr-1 h-3.5 w-3.5 text-emerald-500" weight="fill" />
                  ) : connection.status === "secure" ? (
                    <LockSimple className="mr-1 h-3.5 w-3.5 text-amber-500" weight="fill" />
                  ) : null}
                  {connection.feature}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      <Button className="mt-2 w-full rounded-xl text-sm" variant="outline">
        Ver todas las opciones de conexión
      </Button>
    </div>
  )
}
