"use client"

import { useState, useEffect } from "react"
import Layout from "@/components/ui/layout"
import AIChat from "@/components/ui/ai-chat"
import PromptManager from "@/components/ui/prompt-manager"
import DataExplorer from "@/components/ui/data-explorer"
import type { Message } from "@/lib/ai/anthropic-service"
import { type Prompt, promptService } from "@/lib/ai/prompt-service"
import { dataService } from "@/lib/ai/data-service"
import { aiService } from "@/lib/ai/ai-service"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AIStudioPage() {
  // Estado para los mensajes del chat
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hola, soy tu asistente de IA para viajes de negocios. ¿En qué puedo ayudarte hoy?",
      createdAt: new Date(),
    },
  ])

  // Estado para los prompts
  const [prompts, setPrompts] = useState<Prompt[]>([])
  const [promptCategories, setPromptCategories] = useState<string[]>([])

  // Estado para los datos de las tablas
  const [tables, setTables] = useState<Array<{ name: string; columns: Array<{ name: string; type: string }> }>>([])
  const [selectedTable, setSelectedTable] = useState<string | null>(null)
  const [tableData, setTableData] = useState<any[]>([])
  const [tableColumns, setTableColumns] = useState<Array<{ name: string; type: string }>>([])
  const [totalRecords, setTotalRecords] = useState(0)

  // Estado para el procesamiento de mensajes
  const [isProcessing, setIsProcessing] = useState(false)
  const [systemPrompt, setSystemPrompt] = useState(
    "Eres un asistente especializado en viajes de negocios. Ayuda a los usuarios a planificar viajes, encontrar vuelos y hoteles, gestionar gastos y navegar por las políticas de viaje.",
  )
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null)

  // Cargar datos iniciales
  useEffect(() => {
    loadInitialData()
  }, [])

  // Cargar datos cuando se selecciona una tabla
  useEffect(() => {
    if (selectedTable) {
      fetchTableData(selectedTable, 1, 10)
    }
  }, [selectedTable])

  // Cargar datos iniciales
  const loadInitialData = async () => {
    try {
      // Cargar información sobre las capacidades de la IA
      const capabilities = await aiService.getAICapabilities()

      // Establecer las tablas disponibles
      setTables(capabilities.availableTables)

      // Establecer las categorías de prompts
      setPromptCategories(capabilities.promptCategories)

      // Cargar todos los prompts
      const allPrompts = await promptService.getAllPrompts()
      setPrompts(allPrompts)
    } catch (error) {
      console.error("Error loading initial data:", error)
    }
  }

  // Enviar un mensaje al asistente
  const sendMessage = async (content: string) => {
    setIsProcessing(true)

    try {
      // Crear el mensaje del usuario
      const userMessage: Message = {
        id: Date.now().toString(),
        role: "user",
        content,
        createdAt: new Date(),
      }

      // Actualizar los mensajes con el mensaje del usuario
      const updatedMessages = [...messages, userMessage]
      setMessages(updatedMessages)

      // Preparar las opciones para la generación de respuesta
      const options = {
        messages: updatedMessages,
        systemPrompt,
        includeTableData: !!selectedTable,
        tableName: selectedTable || undefined,
        promptId: selectedPrompt?.id,
      }

      // Generar la respuesta
      const response = await aiService.generateResponse(options)

      // Crear el mensaje del asistente
      const assistantMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: response,
        createdAt: new Date(),
      }

      // Actualizar los mensajes con la respuesta del asistente
      setMessages([...updatedMessages, assistantMessage])
    } catch (error) {
      console.error("Error sending message:", error)

      // Añadir un mensaje de error
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: "Lo siento, ha ocurrido un error al procesar tu mensaje. Por favor, inténtalo de nuevo.",
        createdAt: new Date(),
      }

      setMessages([...messages, errorMessage])
    } finally {
      setIsProcessing(false)
      setSelectedPrompt(null) // Limpiar el prompt seleccionado después de usarlo
    }
  }

  // Crear un nuevo prompt
  const createPrompt = async (promptData: Omit<Prompt, "id" | "createdAt" | "updatedAt">) => {
    try {
      const newPrompt = await promptService.createPrompt(promptData)
      setPrompts([newPrompt, ...prompts])
      return newPrompt
    } catch (error) {
      console.error("Error creating prompt:", error)
      throw error
    }
  }

  // Actualizar un prompt existente
  const updatePrompt = async (id: string, promptData: Partial<Omit<Prompt, "id" | "createdAt" | "updatedAt">>) => {
    try {
      const updatedPrompt = await promptService.updatePrompt(id, promptData)
      setPrompts(prompts.map((p) => (p.id === id ? updatedPrompt : p)))
      return updatedPrompt
    } catch (error) {
      console.error(`Error updating prompt ${id}:`, error)
      throw error
    }
  }

  // Eliminar un prompt
  const deletePrompt = async (id: string) => {
    try {
      const success = await promptService.deletePrompt(id)
      if (success) {
        setPrompts(prompts.filter((p) => p.id !== id))
      }
      return success
    } catch (error) {
      console.error(`Error deleting prompt ${id}:`, error)
      throw error
    }
  }

  // Seleccionar un prompt para usar en el chat
  const selectPrompt = (prompt: Prompt) => {
    setSelectedPrompt(prompt)

    // Añadir un mensaje del sistema indicando que se ha seleccionado un prompt
    const systemMessage: Message = {
      id: Date.now().toString(),
      role: "system",
      content: `Has seleccionado el prompt "${prompt.title}". Este prompt se utilizará en tu próxima consulta.`,
      createdAt: new Date(),
    }

    setMessages([...messages, systemMessage])
  }

  // Cargar datos de una tabla
  const fetchTableData = async (
    tableName: string,
    page: number,
    pageSize: number,
    searchParams?: { column: string; term: string },
  ) => {
    try {
      // Obtener las columnas de la tabla
      const tableInfo = tables.find((t) => t.name === tableName)
      if (tableInfo) {
        setTableColumns(tableInfo.columns)
      }

      // Obtener los datos de la tabla
      let data
      if (searchParams && searchParams.column && searchParams.term) {
        data = await dataService.searchTableData(tableName, searchParams.column, searchParams.term, pageSize)
      } else {
        data = await dataService.getTableData(tableName, pageSize, (page - 1) * pageSize)
      }

      setTableData(data)

      // Obtener el total de registros (en una implementación real, esto vendría de la API)
      setTotalRecords(data.length)

      // Añadir un mensaje del sistema indicando que se han cargado datos
      const systemMessage: Message = {
        id: Date.now().toString(),
        role: "system",
        content: `Se han cargado datos de la tabla "${tableName}". Puedes hacer preguntas sobre estos datos.`,
        createdAt: new Date(),
      }

      setMessages([...messages, systemMessage])
    } catch (error) {
      console.error(`Error fetching data from table ${tableName}:`, error)
    }
  }

  // Exportar datos de una tabla
  const exportTableData = async () => {
    if (!selectedTable) return

    try {
      // En una implementación real, esto descargaría los datos como CSV o Excel
      alert(`Exportando datos de la tabla ${selectedTable}...`)
    } catch (error) {
      console.error(`Error exporting data from table ${selectedTable}:`, error)
    }
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-medium tracking-tighter text-black mb-6">AI Studio</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Panel principal de chat */}
          <div className="lg:col-span-2">
            <AIChat
              initialMessages={messages}
              onSendMessage={sendMessage}
              isProcessing={isProcessing}
              systemPrompt={systemPrompt}
              onSystemPromptChange={setSystemPrompt}
              availableTables={tables}
              onSelectTable={setSelectedTable}
            />
          </div>

          {/* Panel lateral con herramientas */}
          <div className="lg:col-span-1">
            <Tabs defaultValue="prompts" className="w-full">
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="prompts">Prompts</TabsTrigger>
                <TabsTrigger value="data">Datos</TabsTrigger>
              </TabsList>

              <TabsContent value="prompts" className="mt-0">
                <PromptManager
                  prompts={prompts}
                  categories={promptCategories}
                  onCreatePrompt={createPrompt}
                  onUpdatePrompt={updatePrompt}
                  onDeletePrompt={deletePrompt}
                  onSelectPrompt={selectPrompt}
                />
              </TabsContent>

              <TabsContent value="data" className="mt-0">
                {selectedTable ? (
                  <DataExplorer
                    tableName={selectedTable}
                    columns={tableColumns}
                    data={tableData}
                    totalCount={totalRecords}
                    onFetchData={fetchTableData}
                    onExportData={exportTableData}
                  />
                ) : (
                  <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 text-center">
                    <p className="text-gray-500 mb-4">Selecciona una tabla para explorar los datos</p>
                    <div className="grid grid-cols-2 gap-2">
                      {tables.map((table) => (
                        <button
                          key={table.name}
                          onClick={() => setSelectedTable(table.name)}
                          className="px-3 py-2 text-xs rounded-lg bg-gray-100 hover:bg-gray-200 text-left"
                        >
                          {table.name}
                          <span className="block text-[10px] text-gray-500">{table.columns.length} columnas</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </Layout>
  )
}
