import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { email, password, company } = await request.json()

    // Validación básica
    if (!email || !password || !company) {
      return NextResponse.json({ message: "Email, password and company name are required" }, { status: 400 })
    }

    // Aquí iría la lógica para registrar al usuario en tu servicio de autenticación
    // Por ejemplo, una llamada a tu API de autenticación

    const response = await fetch(`${process.env.AUTH_SERVICE_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
        company,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      return NextResponse.json({ message: errorData.message || "Registration failed" }, { status: response.status })
    }

    const userData = await response.json()

    return NextResponse.json({ message: "User registered successfully", user: userData }, { status: 201 })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ message: "An error occurred during registration" }, { status: 500 })
  }
}
