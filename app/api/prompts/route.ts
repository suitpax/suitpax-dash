import { type NextRequest, NextResponse } from "next/server"
import { promptManager } from "@/lib/ai/prompt-manager"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const category = searchParams.get("category")
    const id = searchParams.get("id")

    if (id) {
      const prompt = await promptManager.getPromptById(id)
      if (!prompt) {
        return NextResponse.json({ error: "Prompt no encontrado" }, { status: 404 })
      }
      return NextResponse.json(prompt)
    }

    if (category) {
      const prompts = await promptManager.getPromptsByCategory(category)
      return NextResponse.json(prompts)
    }

    const prompts = await promptManager.getAllPrompts()
    return NextResponse.json(prompts)
  } catch (error) {
    console.error("Error en la ruta de prompts:", error)
    return NextResponse.json({ error: "Error al obtener los prompts" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    if (!body.title || !body.content || !body.category) {
      return NextResponse.json({ error: "Se requieren los campos title, content y category" }, { status: 400 })
    }

    const newPrompt = await promptManager.createPrompt({
      title: body.title,
      content: body.content,
      category: body.category,
      tags: body.tags || [],
    })

    return NextResponse.json(newPrompt, { status: 201 })
  } catch (error) {
    console.error("Error al crear prompt:", error)
    return NextResponse.json({ error: "Error al crear el prompt" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()

    if (!body.id) {
      return NextResponse.json({ error: "Se requiere el ID del prompt" }, { status: 400 })
    }

    const updatedPrompt = await promptManager.updatePrompt(body.id, {
      title: body.title,
      content: body.content,
      category: body.category,
      tags: body.tags,
    })

    if (!updatedPrompt) {
      return NextResponse.json({ error: "Prompt no encontrado" }, { status: 404 })
    }

    return NextResponse.json(updatedPrompt)
  } catch (error) {
    console.error("Error al actualizar prompt:", error)
    return NextResponse.json({ error: "Error al actualizar el prompt" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Se requiere el ID del prompt" }, { status: 400 })
    }

    const success = await promptManager.deletePrompt(id)

    if (!success) {
      return NextResponse.json({ error: "Prompt no encontrado" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error al eliminar prompt:", error)
    return NextResponse.json({ error: "Error al eliminar el prompt" }, { status: 500 })
  }
}
