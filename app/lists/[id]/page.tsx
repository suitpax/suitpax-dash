"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  ClipboardDocumentListIcon,
  PlusIcon,
  CheckIcon,
  XMarkIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline"

interface ListItem {
  id: string
  text: string
  completed: boolean
  createdAt: Date
}

interface List {
  id: string
  name: string
  items: ListItem[]
  createdAt: Date
}

export default function ListDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [list, setList] = useState<List | null>(null)
  const [newItemText, setNewItemText] = useState("")
  const [editingItem, setEditingItem] = useState<string | null>(null)
  const [editText, setEditText] = useState("")

  useEffect(() => {
    // Simular carga de datos de la lista
    const mockList: List = {
      id: params.id as string,
      name: `Travel List ${params.id}`,
      items: [
        {
          id: "1",
          text: "Book flight tickets",
          completed: true,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
        },
        {
          id: "2",
          text: "Reserve hotel accommodation",
          completed: false,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12),
        },
        {
          id: "3",
          text: "Prepare travel documents",
          completed: false,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6),
        },
      ],
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
    }
    setList(mockList)
  }, [params.id])

  const addItem = () => {
    if (!newItemText.trim() || !list) return

    const newItem: ListItem = {
      id: Date.now().toString(),
      text: newItemText.trim(),
      completed: false,
      createdAt: new Date(),
    }

    setList({
      ...list,
      items: [...list.items, newItem],
    })
    setNewItemText("")
  }

  const toggleItem = (itemId: string) => {
    if (!list) return

    setList({
      ...list,
      items: list.items.map((item) => (item.id === itemId ? { ...item, completed: !item.completed } : item)),
    })
  }

  const deleteItem = (itemId: string) => {
    if (!list) return

    setList({
      ...list,
      items: list.items.filter((item) => item.id !== itemId),
    })
  }

  const startEditing = (item: ListItem) => {
    setEditingItem(item.id)
    setEditText(item.text)
  }

  const saveEdit = () => {
    if (!list || !editingItem || !editText.trim()) return

    setList({
      ...list,
      items: list.items.map((item) => (item.id === editingItem ? { ...item, text: editText.trim() } : item)),
    })
    setEditingItem(null)
    setEditText("")
  }

  const cancelEdit = () => {
    setEditingItem(null)
    setEditText("")
  }

  if (!list) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  const completedCount = list.items.filter((item) => item.completed).length
  const totalCount = list.items.length
  const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-white/10 rounded-lg text-white/70 hover:text-white"
              >
                ←
              </button>
              <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                <ClipboardDocumentListIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">{list.name}</h1>
                <p className="text-white/70">
                  {completedCount} of {totalCount} completed ({completionPercentage}%)
                </p>
              </div>
            </div>
            <Badge className="bg-white/10 text-white">
              {totalCount} item{totalCount !== 1 ? "s" : ""}
            </Badge>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-white/10 rounded-full h-2">
            <div
              className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Add new item */}
        <Card className="bg-black/30 border-white/10 mb-6">
          <CardContent className="p-4">
            <div className="flex gap-3">
              <input
                type="text"
                value={newItemText}
                onChange={(e) => setNewItemText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    addItem()
                  }
                }}
                placeholder="Add a new item..."
                className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/20"
              />
              <Button
                onClick={addItem}
                disabled={!newItemText.trim()}
                className="bg-white/10 text-white hover:bg-white/20 disabled:opacity-50"
              >
                <PlusIcon className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* List items */}
        <div className="space-y-3">
          {list.items.map((item) => (
            <Card
              key={item.id}
              className={`bg-black/30 border-white/10 transition-all ${item.completed ? "opacity-75" : ""}`}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleItem(item.id)}
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                      item.completed ? "bg-emerald-500 border-emerald-500" : "border-white/30 hover:border-white/50"
                    }`}
                  >
                    {item.completed && <CheckIcon className="h-3 w-3 text-white" />}
                  </button>

                  <div className="flex-1">
                    {editingItem === item.id ? (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              saveEdit()
                            } else if (e.key === "Escape") {
                              cancelEdit()
                            }
                          }}
                          className="flex-1 px-2 py-1 bg-white/10 border border-white/20 rounded text-white focus:outline-none focus:ring-1 focus:ring-white/30"
                          autoFocus
                        />
                        <button onClick={saveEdit} className="p-1 hover:bg-white/10 rounded text-emerald-400">
                          <CheckIcon className="h-4 w-4" />
                        </button>
                        <button onClick={cancelEdit} className="p-1 hover:bg-white/10 rounded text-red-400">
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <span className={`${item.completed ? "line-through text-white/50" : "text-white"}`}>
                          {item.text}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => startEditing(item)}
                            className="p-1 hover:bg-white/10 rounded text-white/50 hover:text-white"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => deleteItem(item.id)}
                            className="p-1 hover:bg-white/10 rounded text-white/50 hover:text-red-400"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {list.items.length === 0 && (
            <Card className="bg-black/30 border-white/10">
              <CardContent className="p-12 text-center">
                <ClipboardDocumentListIcon className="h-16 w-16 text-white/30 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-white mb-2">Empty list</h3>
                <p className="text-white/70">Add your first item to get started.</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* List stats */}
        {list.items.length > 0 && (
          <Card className="bg-black/30 border-white/10 mt-8">
            <CardHeader>
              <CardTitle className="text-white">List Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{totalCount}</div>
                  <div className="text-white/70 text-sm">Total Items</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-400">{completedCount}</div>
                  <div className="text-white/70 text-sm">Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-400">{totalCount - completedCount}</div>
                  <div className="text-white/70 text-sm">Remaining</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
