import { type NextRequest, NextResponse } from "next/server"
import { promptService } from "@/lib/ai/prompt-service"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const category = searchParams.get("category")
    const id = searchParams.get("id")

    if (id) {
      // Obtener un prompt específico por ID
      const prompt = await promptService.getPromptById(id)
      if (!prompt) {
        return NextResponse.json({ error: "Prompt no encontrado" }, { status: 404 })
      }
      return NextResponse.json(prompt)
    } else if (category) {
      // Obtener prompts por categoría
      const prompts = await promptService.getPromptsByCategory(category)
      return NextResponse.json(prompts)
    } else {
      // Obtener todos los prompts
      const prompts = await promptService.getAllPrompts()
      return NextResponse.json(prompts)
    }
  } catch (error) {
    console.error("Error in prompts API route:", error)
    return NextResponse.json({ error: "Error al obtener los prompts" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { title, content, category, tags } = body

    // Validar los datos de entrada
    if (!title || !content || !category) {
      return NextResponse.json({ error: "Se requieren título, contenido y categoría" }, { status: 400 })
    }

    // Crear el prompt
    const newPrompt = await promptService.createPrompt({
      title,
      content,
      category,
      tags: tags || [],
    })

    return NextResponse.json(newPrompt, { status: 201 })
  } catch (error) {
    console.error("Error in prompts API route:", error)
    return NextResponse.json({ error: "Error al crear el prompt" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const { id, title, content, category, tags } = body

    // Validar los datos de entrada
    if (!id) {
      return NextResponse.json({ error: "Se requiere un ID de prompt" }, { status: 400 })
    }

    // Actualizar el prompt
    const updatedPrompt = await promptService.updatePrompt(id, {
      title,
      content,
      category,
      tags,
    })

    return NextResponse.json(updatedPrompt)
  } catch (error) {
    console.error("Error in prompts API route:", error)
    return NextResponse.json({ error: "Error al actualizar el prompt" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")

    // Validar los datos de entrada
    if (!id) {
      return NextResponse.json({ error: "Se requiere un ID de prompt" }, { status: 400 })
    }

    // Eliminar el prompt
    const success = await promptService.deletePrompt(id)

    if (!success) {
      return NextResponse.json({ error: "Prompt no encontrado" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in prompts API route:", error)
    return NextResponse.json({ error: "Error al eliminar el prompt" }, { status: 500 })
  }
}
