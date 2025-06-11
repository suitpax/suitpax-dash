"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Settings, Smile, User } from "lucide-react"

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { useEffect, useState } from "react"

export function CommandMenu() {
  const [open, setOpen] = React.useState(false)
  const router = useRouter()
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [recentSearches, setRecentSearches] = useState<string[]>([])

  // Mock data for search results
  const mockData = {
    pages: [
      { id: 1, title: "Dashboard", path: "/" },
      { id: 2, title: "Business Travel", path: "/business-travel" },
      { id: 3, title: "Analytics", path: "/analytics" },
      { id: 4, title: "Tasks", path: "/tasks" },
      { id: 5, title: "Settings", path: "/settings" },
      { id: 6, title: "AI Agents", path: "/ai-agents" },
    ],
    trips: [
      { id: 1, title: "London Trip", date: "Jun 15-18, 2023", path: "/business-travel/london-trip" },
      { id: 2, title: "New York Conference", date: "Jul 22-25, 2023", path: "/business-travel/new-york-conference" },
      { id: 3, title: "Tokyo Business Meeting", date: "Aug 10-15, 2023", path: "/business-travel/tokyo-meeting" },
    ],
    expenses: [
      { id: 1, title: "Hotel Expenses", amount: "$1,240", path: "/expenses/hotel" },
      { id: 2, title: "Flight Tickets", amount: "$2,100", path: "/expenses/flights" },
      { id: 3, title: "Meal Expenses", amount: "$450", path: "/expenses/meals" },
    ],
    tasks: [
      { id: 1, title: "Prepare Travel Documents", dueDate: "Jun 10, 2023", path: "/tasks/1" },
      { id: 2, title: "Book Airport Transfer", dueDate: "Jun 14, 2023", path: "/tasks/2" },
      { id: 3, title: "Expense Report Submission", dueDate: "Jun 20, 2023", path: "/tasks/3" },
    ],
  }

  // Load recent searches from localStorage
  useEffect(() => {
    const savedSearches = localStorage.getItem("recentSearches")
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches))
    }
  }, [])

  // Save recent searches to localStorage
  const saveSearch = (query: string) => {
    if (query.trim() && !recentSearches.includes(query)) {
      const updatedSearches = [query, ...recentSearches.slice(0, 4)]
      setRecentSearches(updatedSearches)
      localStorage.setItem("recentSearches", JSON.stringify(updatedSearches))
    }
  }

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    const lowerQuery = query.toLowerCase()

    // Search in pages
    const pageResults = mockData.pages
      .filter((page) => page.title.toLowerCase().includes(lowerQuery))
      .map((page) => ({ ...page, type: "page" }))

    // Search in trips
    const tripResults = mockData.trips
      .filter((trip) => trip.title.toLowerCase().includes(lowerQuery) || trip.date.toLowerCase().includes(lowerQuery))
      .map((trip) => ({ ...trip, type: "trip" }))

    // Search in expenses
    const expenseResults = mockData.expenses
      .filter(
        (expense) =>
          expense.title.toLowerCase().includes(lowerQuery) || expense.amount.toLowerCase().includes(lowerQuery),
      )
      .map((expense) => ({ ...expense, type: "expense" }))

    // Search in tasks
    const taskResults = mockData.tasks
      .filter(
        (task) => task.title.toLowerCase().includes(lowerQuery) || task.dueDate.toLowerCase().includes(lowerQuery),
      )
      .map((task) => ({ ...task, type: "task" }))

    // Combine all results
    setSearchResults([...pageResults, ...tripResults, ...expenseResults, ...taskResults])
  }

  const navigateTo = (path: string, query?: string) => {
    if (query) {
      saveSearch(query)
    }
    setOpen(false)
    router.push(path)
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center rounded-xl border border-gray-200 px-3 py-1.5 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring bg-white text-gray-500 hover:bg-gray-100 h-9"
      >
        <span className="inline-flex">Search...</span>
        <kbd className="pointer-events-none ml-auto inline-flex h-5 select-none items-center gap-1 rounded border bg-gray-100 px-1.5 font-mono text-[10px] font-medium text-gray-600 opacity-100">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." onValueChange={handleSearch} />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>

          {searchResults.length > 0 ? (
            <>
              {/* Group results by type */}
              {searchResults.some((item) => item.type === "page") && (
                <CommandGroup heading="Pages">
                  {searchResults
                    .filter((item) => item.type === "page")
                    .map((item) => (
                      <CommandItem key={`page-${item.id}`} onSelect={() => navigateTo(item.path)}>
                        {item.title}
                      </CommandItem>
                    ))}
                </CommandGroup>
              )}

              {searchResults.some((item) => item.type === "trip") && (
                <CommandGroup heading="Business Trips">
                  {searchResults
                    .filter((item) => item.type === "trip")
                    .map((item) => (
                      <CommandItem key={`trip-${item.id}`} onSelect={() => navigateTo(item.path)}>
                        <span>{item.title}</span>
                        <span className="ml-2 text-xs text-gray-500">{item.date}</span>
                      </CommandItem>
                    ))}
                </CommandGroup>
              )}

              {searchResults.some((item) => item.type === "expense") && (
                <CommandGroup heading="Expenses">
                  {searchResults
                    .filter((item) => item.type === "expense")
                    .map((item) => (
                      <CommandItem key={`expense-${item.id}`} onSelect={() => navigateTo(item.path)}>
                        <span>{item.title}</span>
                        <span className="ml-2 text-xs text-gray-500">{item.amount}</span>
                      </CommandItem>
                    ))}
                </CommandGroup>
              )}

              {searchResults.some((item) => item.type === "task") && (
                <CommandGroup heading="Tasks">
                  {searchResults
                    .filter((item) => item.type === "task")
                    .map((item) => (
                      <CommandItem key={`task-${item.id}`} onSelect={() => navigateTo(item.path)}>
                        <span>{item.title}</span>
                        <span className="ml-2 text-xs text-gray-500">Due: {item.dueDate}</span>
                      </CommandItem>
                    ))}
                </CommandGroup>
              )}
            </>
          ) : (
            <>
              {recentSearches.length > 0 && (
                <CommandGroup heading="Recent Searches">
                  {recentSearches.map((search, index) => (
                    <CommandItem key={`recent-${index}`} onSelect={() => handleSearch(search)}>
                      <span>{search}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}

              <CommandGroup heading="Quick Links">
                <CommandItem onSelect={() => navigateTo("/")}>
                  <span>Dashboard</span>
                </CommandItem>
                <CommandItem onSelect={() => navigateTo("/business-travel")}>
                  <span>Business Travel</span>
                </CommandItem>
                <CommandItem onSelect={() => navigateTo("/analytics")}>
                  <span>Analytics</span>
                </CommandItem>
                <CommandItem onSelect={() => navigateTo("/tasks")}>
                  <span>Tasks</span>
                </CommandItem>
              </CommandGroup>

              <CommandSeparator />

              <CommandGroup heading="Tools">
                <CommandItem onSelect={() => navigateTo("/settings")}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </CommandItem>
                <CommandItem onSelect={() => navigateTo("/ai-agents")}>
                  <Smile className="mr-2 h-4 w-4" />
                  <span>AI Agents</span>
                </CommandItem>
                <CommandItem onSelect={() => navigateTo("/profile")}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </CommandItem>
              </CommandGroup>
            </>
          )}
        </CommandList>
      </CommandDialog>
    </>
  )
}
