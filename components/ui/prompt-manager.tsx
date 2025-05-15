"use client"

import { useState } from "react"
import { Plus, Edit, Trash, Save, X, Tag, FolderPlus } from "lucide-react"
import type { Prompt } from "@/lib/ai/prompt-service"

interface PromptManagerProps {
  prompts: Prompt[]
  categories: string[]
  onCreatePrompt: (prompt: Omit<Prompt, "id" | "createdAt" | "updatedAt">) => Promise<void>
  onUpdatePrompt: (id: string, prompt: Partial<Omit<Prompt, "id" | "createdAt" | "updatedAt">>) => Promise<void>
  onDeletePrompt: (id: string) => Promise<void>
  onSelectPrompt: (prompt: Prompt) => void
}

export default function PromptManager({
  prompts,
  categories,
  onCreatePrompt,
  onUpdatePrompt,
  onDeletePrompt,
  onSelectPrompt,
}: PromptManagerProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [isEditing, setIsEditing] = useState<string | null>(null)
  const [newCategory, setNewCategory] = useState("")
  const [isAddingCategory, setIsAddingCategory] = useState(false)

  // Estado para el formulario de prompt
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
    tags: [] as string[],
  })

  // Estado para el tag que se está añadiendo
  const [newTag, setNewTag] = useState("")

  // Filtrar prompts por categoría
  const filteredPrompts = selectedCategory ? prompts.filter((p) => p.category === selectedCategory) : prompts

  // Manejar la creación de un nuevo prompt
  const handleCreatePrompt = async () => {
    try {
      await onCreatePrompt({
        title: formData.title,
        content: formData.content,
        category: formData.category,
        tags: formData.tags,
      })

      // Resetear el formulario y salir del modo de creación
      setFormData({
        title: "",
        content: "",
        category: "",
        tags: [],
      })
      setIsCreating(false)
    } catch (error) {
      console.error("Error creating prompt:", error)
    }
  }

  // Manejar la actualización de un prompt
  const handleUpdatePrompt = async (id: string) => {
    try {
      await onUpdatePrompt(id, {
        title: formData.title,
        content: formData.content,
        category: formData.category,
        tags: formData.tags,
      })

      // Salir del modo de edición
      setIsEditing(null)
    } catch (error) {
      console.error(`Error updating prompt ${id}:`, error)
    }
  }

  // Iniciar la edición de un prompt
  const startEditing = (prompt: Prompt) => {
    setFormData({
      title: prompt.title,
      content: prompt.content,
      category: prompt.category,
      tags: prompt.tags,
    })
    setIsEditing(prompt.id)
  }

  // Cancelar la creación o edición
  const cancelForm = () => {
    setFormData({
      title: "",
      content: "",
      category: "",
      tags: [],
    })
    setIsCreating(false)
    setIsEditing(null)
  }

  // Añadir un tag al formulario
  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag.trim()],
      })
      setNewTag("")
    }
  }

  // Eliminar un tag del formulario
  const removeTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((t) => t !== tag),
    })
  }

  // Añadir una nueva categoría
  const addCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      // En una implementación real, aquí se guardaría la categoría en la base de datos
      setNewCategory("")
      setIsAddingCategory(false)
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <h2 className="font-medium">Gestor de Prompts</h2>
        <button
          onClick={() => setIsCreating(true)}
          className="p-1.5 rounded-lg bg-black text-white hover:bg-gray-800"
          aria-label="Crear prompt"
          disabled={isCreating || isEditing !== null}
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {/* Categories */}
      <div className="border-b border-gray-200 p-3">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-medium">Categorías</h3>
          <button
            onClick={() => setIsAddingCategory(true)}
            className="p-1 rounded-lg hover:bg-gray-100"
            aria-label="Añadir categoría"
          >
            <FolderPlus className="h-3.5 w-3.5 text-gray-500" />
          </button>
        </div>

        {isAddingCategory ? (
          <div className="flex items-center gap-2 mb-2">
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded-md"
              placeholder="Nueva categoría..."
            />
            <button
              onClick={addCategory}
              className="p-1 rounded-lg bg-black text-white hover:bg-gray-800"
              aria-label="Guardar categoría"
            >
              <Save className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setIsAddingCategory(false)}
              className="p-1 rounded-lg hover:bg-gray-100"
              aria-label="Cancelar"
            >
              <X className="h-3.5 w-3.5 text-gray-500" />
            </button>
          </div>
        ) : null}

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-2 py-1 text-xs rounded-lg ${
              selectedCategory === null ? "bg-black text-white" : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            Todos
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-2 py-1 text-xs rounded-lg ${
                selectedCategory === category ? "bg-black text-white" : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Form for creating/editing */}
      {(isCreating || isEditing !== null) && (
        <div className="border-b border-gray-200 p-3">
          <h3 className="text-xs font-medium mb-2">{isCreating ? "Crear nuevo prompt" : "Editar prompt"}</h3>
          <div className="space-y-3">
            <div>
              <label htmlFor="promptTitle" className="block text-xs text-gray-500 mb-1">
                Título
              </label>
              <input
                id="promptTitle"
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-2 py-1 text-xs border border-gray-300 rounded-md"
                placeholder="Título del prompt..."
              />
            </div>

            <div>
              <label htmlFor="promptCategory" className="block text-xs text-gray-500 mb-1">
                Categoría
              </label>
              <select
                id="promptCategory"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-2 py-1 text-xs border border-gray-300 rounded-md"
              >
                <option value="">Seleccionar categoría...</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="promptContent" className="block text-xs text-gray-500 mb-1">
                Contenido
              </label>
              <textarea
                id="promptContent"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={5}
                className="w-full px-2 py-1 text-xs border border-gray-300 rounded-md"
                placeholder="Contenido del prompt..."
              />
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1">Etiquetas</label>
              <div className="flex flex-wrap gap-1 mb-2">
                {formData.tags.map((tag) => (
                  <div key={tag} className="flex items-center bg-gray-100 px-2 py-0.5 rounded-lg text-xs">
                    <span>{tag}</span>
                    <button onClick={() => removeTag(tag)} className="ml-1 text-gray-500 hover:text-gray-700">
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded-md"
                  placeholder="Nueva etiqueta..."
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      addTag()
                    }
                  }}
                />
                <button onClick={addTag} className="p-1 rounded-lg hover:bg-gray-100" aria-label="Añadir etiqueta">
                  <Tag className="h-3.5 w-3.5 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button onClick={cancelForm} className="px-3 py-1 text-xs rounded-lg bg-gray-100 hover:bg-gray-200">
                Cancelar
              </button>
              <button
                onClick={() => (isCreating ? handleCreatePrompt() : handleUpdatePrompt(isEditing!))}
                className="px-3 py-1 text-xs rounded-lg bg-black text-white hover:bg-gray-800"
                disabled={!formData.title || !formData.content || !formData.category}
              >
                {isCreating ? "Crear" : "Actualizar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Prompts list */}
      <div className="max-h-96 overflow-y-auto p-3">
        {filteredPrompts.length === 0 ? (
          <p className="text-center text-xs text-gray-500 py-4">No hay prompts disponibles en esta categoría.</p>
        ) : (
          <div className="space-y-3">
            {filteredPrompts.map((prompt) => (
              <div key={prompt.id} className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-sm">{prompt.title}</h4>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => startEditing(prompt)}
                      className="p-1 rounded-lg hover:bg-gray-200"
                      aria-label="Editar prompt"
                      disabled={isCreating || isEditing !== null}
                    >
                      <Edit className="h-3.5 w-3.5 text-gray-500" />
                    </button>
                    <button
                      onClick={() => onDeletePrompt(prompt.id)}
                      className="p-1 rounded-lg hover:bg-gray-200"
                      aria-label="Eliminar prompt"
                      disabled={isCreating || isEditing !== null}
                    >
                      <Trash className="h-3.5 w-3.5 text-gray-500" />
                    </button>
                  </div>
                </div>
                <p className="text-xs text-gray-600 mb-2 line-clamp-2">{prompt.content}</p>
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {prompt.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="bg-gray-100 px-1.5 py-0.5 rounded text-[10px] text-gray-600">
                        {tag}
                      </span>
                    ))}
                    {prompt.tags.length > 3 && (
                      <span className="bg-gray-100 px-1.5 py-0.5 rounded text-[10px] text-gray-600">
                        +{prompt.tags.length - 3}
                      </span>
                    )}
                  </div>
                  <button onClick={() => onSelectPrompt(prompt)} className="text-xs text-black hover:underline">
                    Usar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
