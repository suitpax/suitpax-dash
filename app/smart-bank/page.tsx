"use client"

import {
  CreditCardIcon,
  BanknotesIcon,
  ArrowUpRightIcon,
  ArrowDownLeftIcon,
  ShieldCheckIcon,
  BoltIcon,
  PlusIcon,
} from "@heroicons/react/24/outline"
import { useState } from "react"

const transactions = [
  {
    id: 1,
    date: "Yesterday",
    description: "Netflix Subscription",
    amount: -12.99,
    icon: <CreditCardIcon className="h-5 w-5 text-white/70" />,
  },
  {
    id: 2,
    date: "Yesterday",
    description: "Income from Freelance",
    amount: 150.0,
    icon: <BanknotesIcon className="h-5 w-5 text-white/70" />,
  },
  {
    id: 3,
    date: "2 days ago",
    description: "Grocery Shopping",
    amount: -65.23,
    icon: <BanknotesIcon className="h-5 w-5 text-white/70" />,
  },
  {
    id: 4,
    date: "3 days ago",
    description: "Online Purchase",
    amount: -25.0,
    icon: <CreditCardIcon className="h-5 w-5 text-white/70" />,
  },
]

const quickActions = [
  {
    id: 1,
    name: "Send Money",
    icon: <ArrowUpRightIcon className="h-5 w-5 text-white/70" />,
  },
  {
    id: 2,
    name: "Receive Money",
    icon: <ArrowDownLeftIcon className="h-5 w-5 text-white/70" />,
  },
  {
    id: 3,
    name: "Pay Bills",
    icon: <ShieldCheckIcon className="h-5 w-5 text-white/70" />,
  },
  {
    id: 4,
    name: "Instant Loan",
    icon: <BoltIcon className="h-5 w-5 text-white/70" />,
  },
]

export default function SmartBankPage() {
  const [balance, setBalance] = useState(2500.5)

  return (
    <div className="bg-black min-h-screen py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-light tracking-tight text-white sm:text-4xl">Smart Bank</h2>
          <p className="mt-2 text-white/70 font-light max-w-md mx-auto">Manage your finances with ease.</p>
        </div>

        <div className="mt-12 space-y-6">
          {/* Balance Card */}
          <div className="bg-white/5 border-white/10 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-light text-white">Current Balance</h3>
              <span className="inline-flex items-center rounded-full bg-white/10 px-2.5 py-0.5 text-sm font-light text-white/80">
                USD
              </span>
            </div>
            <p className="mt-4 text-4xl font-light text-white">${balance.toLocaleString()}</p>
          </div>

          {/* Quick Actions */}
          <div className="bg-white/5 border-white/10 rounded-lg shadow p-6">
            <h3 className="text-lg font-light text-white mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {quickActions.map((action) => (
                <button
                  key={action.id}
                  className="bg-white/10 hover:bg-white/15 border-white/10 rounded-lg py-3 px-4 text-sm font-light text-white flex flex-col items-center justify-center"
                >
                  {action.icon}
                  <span className="mt-2">{action.name}</span>
                </button>
              ))}
              <button className="bg-white/10 hover:bg-white/15 border-white/10 rounded-lg py-3 px-4 text-sm font-light text-white flex flex-col items-center justify-center">
                <PlusIcon className="h-5 w-5 text-white/70" />
                <span className="mt-2">More</span>
              </button>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-white/5 border-white/10 rounded-lg shadow p-6">
            <h3 className="text-lg font-light text-white mb-4">Recent Transactions</h3>
            <ul className="divide-y divide-white/10">
              {transactions.map((transaction) => (
                <li key={transaction.id} className="py-4 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-white/10">{transaction.icon}</div>
                    <div>
                      <p className="text-white font-light">{transaction.description}</p>
                      <p className="text-white/70 font-light text-sm">{transaction.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-light ${transaction.amount > 0 ? "text-green-500" : "text-red-500"}`}>
                      {transaction.amount > 0 ? "+" : "-"}${Math.abs(transaction.amount).toLocaleString()}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
