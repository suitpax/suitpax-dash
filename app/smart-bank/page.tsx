"use client"

import { useState } from "react"
import Layout from "@/components/ui/layout"
import Image from "next/image"
import {
  CreditCardIcon,
  BanknotesIcon,
  ArrowPathIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  PlusCircleIcon,
  BuildingLibraryIcon,
  ShieldCheckIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  ClockIcon,
  TagIcon,
  ArrowRightIcon,
  CheckIcon,
} from "@heroicons/react/24/outline"

export default function SmartBankPage() {
  const [activeTab, setActiveTab] = useState("accounts")
  const [isConnecting, setIsConnecting] = useState(false)
  const [connectedBanks, setConnectedBanks] = useState<string[]>([])

  // Sample data
  const accounts = [
    {
      id: "acc1",
      name: "Business Checking",
      bank: "Chase",
      accountNumber: "****4567",
      balance: 12450.75,
      currency: "USD",
      type: "checking",
    },
    {
      id: "acc2",
      name: "Business Savings",
      bank: "Chase",
      accountNumber: "****8901",
      balance: 45000.0,
      currency: "USD",
      type: "savings",
    },
    {
      id: "acc3",
      name: "Corporate Card",
      bank: "American Express",
      accountNumber: "****3456",
      balance: -2340.5,
      currency: "USD",
      type: "credit",
      creditLimit: 10000,
    },
  ]

  const transactions = [
    {
      id: "tx1",
      date: "2024-04-28",
      description: "Hotel Marriott - New York",
      amount: -450.75,
      category: "Accommodation",
      account: "Corporate Card",
      status: "Completed",
    },
    {
      id: "tx2",
      date: "2024-04-27",
      description: "Uber - Airport Transfer",
      amount: -65.2,
      category: "Transportation",
      account: "Corporate Card",
      status: "Completed",
    },
    {
      id: "tx3",
      date: "2024-04-26",
      description: "Client Dinner - Morton's Steakhouse",
      amount: -120.5,
      category: "Meals",
      account: "Corporate Card",
      status: "Completed",
    },
    {
      id: "tx4",
      date: "2024-04-25",
      description: "Office Supplies - Staples",
      amount: -85.3,
      category: "Office Supplies",
      account: "Business Checking",
      status: "Completed",
    },
    {
      id: "tx5",
      date: "2024-04-24",
      description: "Client Payment - Acme Inc",
      amount: 5000.0,
      category: "Income",
      account: "Business Checking",
      status: "Completed",
    },
    {
      id: "tx6",
      date: "2024-04-23",
      description: "Software Subscription - Adobe",
      amount: -52.99,
      category: "Software",
      account: "Business Checking",
      status: "Completed",
    },
    {
      id: "tx7",
      date: "2024-04-22",
      description: "Flight - British Airways",
      amount: -750.0,
      category: "Travel",
      account: "Corporate Card",
      status: "Pending",
    },
  ]

  const banks = [
    { id: "chase", name: "Chase", logo: "/images/user-avatar.jpg", color: "bg-blue-100" },
    { id: "bofa", name: "Bank of America", logo: "/images/user-avatar.jpg", color: "bg-red-100" },
    { id: "wells", name: "Wells Fargo", logo: "/images/user-avatar.jpg", color: "bg-yellow-100" },
    { id: "citi", name: "Citibank", logo: "/images/user-avatar.jpg", color: "bg-blue-100" },
    { id: "amex", name: "American Express", logo: "/images/user-avatar.jpg", color: "bg-gray-100" },
    { id: "capital", name: "Capital One", logo: "/images/user-avatar.jpg", color: "bg-red-100" },
  ]

  const handleConnectBank = (bankId: string) => {
    setIsConnecting(true)

    // Simulate connection process
    setTimeout(() => {
      setConnectedBanks([...connectedBanks, bankId])
      setIsConnecting(false)
    }, 2000)
  }

  const formatCurrency = (amount: number, currency = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        {/* Header específico de Smart Bank */}
        <div className="bg-black/30 backdrop-blur-sm rounded-xl border border-white/10 p-4 sm:p-6 shadow-sm mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-medium tracking-tighter text-white">Smart Bank</h1>
              <p className="text-sm text-white/70 mt-1">Connect and manage your business banking accounts</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="inline-flex items-center gap-1 bg-white/5 px-2 py-1 rounded-full">
                <span className="text-xs font-medium text-white/70">Bank-level security</span>
                <span className="text-xs text-white/50">•</span>
                <span className="text-xs text-white/70">Encrypted</span>
              </div>
            </div>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-black p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-medium text-gray-700">Total Balance</h2>
              <BanknotesIcon className="h-5 w-5 text-gray-500" />
            </div>
            <p className="text-2xl font-medium text-black mb-1">$55,110.25</p>
            <div className="flex items-center text-xs text-emerald-600">
              <ArrowTrendingUpIcon className="h-3.5 w-3.5 mr-1" />
              <span>+$5,000.00 this month</span>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-black p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-medium text-gray-700">Total Expenses</h2>
              <CreditCardIcon className="h-5 w-5 text-gray-500" />
            </div>
            <p className="text-2xl font-medium text-black mb-1">$3,650.25</p>
            <div className="flex items-center text-xs text-red-600">
              <ArrowTrendingDownIcon className="h-3.5 w-3.5 mr-1" />
              <span>+$850.75 from last month</span>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-black p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-medium text-gray-700">Connected Accounts</h2>
              <BuildingLibraryIcon className="h-5 w-5 text-gray-500" />
            </div>
            <p className="text-2xl font-medium text-black mb-1">{accounts.length}</p>
            <div className="flex items-center text-xs text-gray-600">
              <span>Last synced 5 minutes ago</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl border border-black p-4 shadow-sm mb-6">
          <div className="flex border-b border-gray-200 mb-4">
            <button
              onClick={() => setActiveTab("accounts")}
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === "accounts" ? "text-black border-b-2 border-black" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Accounts
            </button>
            <button
              onClick={() => setActiveTab("transactions")}
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === "transactions"
                  ? "text-black border-b-2 border-black"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Transactions
            </button>
            <button
              onClick={() => setActiveTab("connect")}
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === "connect" ? "text-black border-b-2 border-black" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Connect Bank
            </button>
          </div>

          {/* Accounts Tab */}
          {activeTab === "accounts" && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-base font-medium text-black">Your Accounts</h2>
                <button className="flex items-center gap-1 px-3 py-1.5 bg-black text-white rounded-xl text-xs hover:bg-gray-800">
                  <PlusCircleIcon className="h-3.5 w-3.5" />
                  <span>Add Account</span>
                </button>
              </div>

              <div className="space-y-3">
                {accounts.map((account) => (
                  <div
                    key={account.id}
                    className="border border-gray-200 rounded-xl p-4 hover:border-black transition-colors"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            account.type === "credit" ? "bg-red-100" : "bg-blue-100"
                          }`}
                        >
                          {account.type === "credit" ? (
                            <CreditCardIcon className="h-5 w-5 text-red-600" />
                          ) : (
                            <BanknotesIcon className="h-5 w-5 text-blue-600" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium text-black">{account.name}</h3>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">{account.bank}</span>
                            <span className="text-xs text-gray-500">•</span>
                            <span className="text-xs text-gray-500">{account.accountNumber}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-medium ${account.balance < 0 ? "text-red-600" : "text-black"}`}>
                          {formatCurrency(account.balance)}
                        </p>
                        {account.type === "credit" && (
                          <p className="text-xs text-gray-500">Limit: {formatCurrency(account.creditLimit)}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Transactions Tab */}
          {activeTab === "transactions" && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-base font-medium text-black">Recent Transactions</h2>
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-xl text-xs hover:bg-gray-200">
                    <ArrowPathIcon className="h-3.5 w-3.5" />
                    <span>Sync</span>
                  </button>
                  <button className="flex items-center gap-1 px-3 py-1.5 bg-black text-white rounded-xl text-xs hover:bg-gray-800">
                    <ChartBarIcon className="h-3.5 w-3.5" />
                    <span>Reports</span>
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="border border-gray-200 rounded-xl p-4 hover:border-black transition-colors"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            transaction.amount < 0 ? "bg-red-100" : "bg-emerald-100"
                          }`}
                        >
                          {transaction.amount < 0 ? (
                            <ArrowTrendingDownIcon className="h-5 w-5 text-red-600" />
                          ) : (
                            <ArrowTrendingUpIcon className="h-5 w-5 text-emerald-600" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium text-black">{transaction.description}</h3>
                          <div className="flex items-center gap-2 mt-0.5">
                            <div className="flex items-center">
                              <ClockIcon className="h-3 w-3 text-gray-500 mr-1" />
                              <span className="text-xs text-gray-500">{formatDate(transaction.date)}</span>
                            </div>
                            <span className="text-xs text-gray-500">•</span>
                            <div className="flex items-center">
                              <TagIcon className="h-3 w-3 text-gray-500 mr-1" />
                              <span className="text-xs text-gray-500">{transaction.category}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-medium ${transaction.amount < 0 ? "text-red-600" : "text-emerald-600"}`}>
                          {transaction.amount < 0 ? "-" : "+"}
                          {formatCurrency(Math.abs(transaction.amount))}
                        </p>
                        <p className="text-xs text-gray-500">{transaction.account}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Connect Bank Tab */}
          {activeTab === "connect" && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-base font-medium text-black">Connect Your Bank</h2>
                <div className="flex items-center text-xs text-gray-500">
                  <ShieldCheckIcon className="h-4 w-4 mr-1 text-emerald-600" />
                  <span>Bank-level security</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {banks.map((bank) => (
                  <div
                    key={bank.id}
                    className="border border-gray-200 rounded-xl p-4 hover:border-black transition-colors"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 ${bank.color}`}>
                        <Image
                          src={bank.logo || "/placeholder.svg"}
                          alt={bank.name}
                          width={40}
                          height={40}
                          className="object-cover"
                        />
                      </div>
                      <h3 className="font-medium text-black">{bank.name}</h3>
                    </div>
                    {connectedBanks.includes(bank.id) ? (
                      <div className="flex items-center text-xs text-emerald-600">
                        <CheckIcon className="h-4 w-4 mr-1" />
                        <span>Connected</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleConnectBank(bank.id)}
                        disabled={isConnecting}
                        className="w-full flex items-center justify-center gap-1 px-3 py-1.5 bg-black text-white rounded-xl text-xs hover:bg-gray-800 disabled:opacity-50"
                      >
                        {isConnecting ? (
                          <>
                            <ArrowPathIcon className="h-3.5 w-3.5 animate-spin" />
                            <span>Connecting...</span>
                          </>
                        ) : (
                          <>
                            <PlusCircleIcon className="h-3.5 w-3.5" />
                            <span>Connect</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className="bg-gray-100 rounded-xl p-4">
                <h3 className="text-sm font-medium text-black mb-2">Why connect your bank?</h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckIcon className="h-4 w-4 text-emerald-600 mr-2 mt-0.5" />
                    <span className="text-sm text-gray-700">Automatically track and categorize expenses</span>
                  </li>
                  <li className="flex items-start">
                    <CheckIcon className="h-4 w-4 text-emerald-600 mr-2 mt-0.5" />
                    <span className="text-sm text-gray-700">Simplify expense reporting and reimbursements</span>
                  </li>
                  <li className="flex items-start">
                    <CheckIcon className="h-4 w-4 text-emerald-600 mr-2 mt-0.5" />
                    <span className="text-sm text-gray-700">Get insights into your business spending patterns</span>
                  </li>
                  <li className="flex items-start">
                    <CheckIcon className="h-4 w-4 text-emerald-600 mr-2 mt-0.5" />
                    <span className="text-sm text-gray-700">Reconcile transactions with your accounting software</span>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Features Section */}
        <div className="bg-white rounded-xl border border-black p-6 shadow-sm">
          <h2 className="text-lg font-medium tracking-tighter text-black mb-4">Smart Bank Features</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-gray-200 rounded-xl p-4">
              <div className="flex items-center mb-3">
                <div className="p-2 rounded-lg bg-blue-100 mr-3">
                  <CurrencyDollarIcon className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="font-medium text-black">Expense Tracking</h3>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Automatically categorize and track all your business expenses in real-time.
              </p>
              <button className="text-sm font-medium text-black hover:underline flex items-center gap-1">
                Learn more
                <ArrowRightIcon className="h-4 w-4" />
              </button>
            </div>

            <div className="border border-gray-200 rounded-xl p-4">
              <div className="flex items-center mb-3">
                <div className="p-2 rounded-lg bg-emerald-100 mr-3">
                  <ChartBarIcon className="h-5 w-5 text-emerald-600" />
                </div>
                <h3 className="font-medium text-black">Financial Insights</h3>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Get AI-powered insights and recommendations to optimize your business spending.
              </p>
              <button className="text-sm font-medium text-black hover:underline flex items-center gap-1">
                View insights
                <ArrowRightIcon className="h-4 w-4" />
              </button>
            </div>

            <div className="border border-gray-200 rounded-xl p-4">
              <div className="flex items-center mb-3">
                <div className="p-2 rounded-lg bg-purple-100 mr-3">
                  <CreditCardIcon className="h-5 w-5 text-purple-600" />
                </div>
                <h3 className="font-medium text-black">Virtual Cards</h3>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Create virtual cards for your team with custom spending limits and controls.
              </p>
              <button className="text-sm font-medium text-black hover:underline flex items-center gap-1">
                Create card
                <ArrowRightIcon className="h-4 w-4" />
              </button>
            </div>

            <div className="border border-gray-200 rounded-xl p-4">
              <div className="flex items-center mb-3">
                <div className="p-2 rounded-lg bg-amber-100 mr-3">
                  <ShieldCheckIcon className="h-5 w-5 text-amber-600" />
                </div>
                <h3 className="font-medium text-black">Fraud Protection</h3>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Advanced security features to protect your business accounts and transactions.
              </p>
              <button className="text-sm font-medium text-black hover:underline flex items-center gap-1">
                Security settings
                <ArrowRightIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
