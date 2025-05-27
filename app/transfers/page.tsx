"use client"

import { useState } from "react"
import { Car } from "lucide-react"

const TransferPage = () => {
  const [transfers, setTransfers] = useState([
    { id: 1, car: "Toyota Camry", date: "2024-07-20", status: "Pending" },
    { id: 2, car: "Honda Civic", date: "2024-07-22", status: "Completed" },
  ])

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Transfers</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">ID</th>
              <th className="py-2 px-4 border-b">Car</th>
              <th className="py-2 px-4 border-b">Date</th>
              <th className="py-2 px-4 border-b">Status</th>
            </tr>
          </thead>
          <tbody>
            {transfers.map((transfer) => (
              <tr key={transfer.id}>
                <td className="py-2 px-4 border-b text-center">{transfer.id}</td>
                <td className="py-2 px-4 border-b text-center">
                  <Car className="inline-block mr-2 h-5 w-5" />
                  {transfer.car}
                </td>
                <td className="py-2 px-4 border-b text-center">{transfer.date}</td>
                <td className="py-2 px-4 border-b text-center">{transfer.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default TransferPage
