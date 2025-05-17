import type { NextAuthOptions } from "next-auth"
import Auth0Provider from "next-auth/providers/auth0"
import GoogleProvider from "next-auth/providers/google"
import LinkedInProvider from "next-auth/providers/linkedin"
import CredentialsProvider from "next-auth/providers/credentials"

export const authConfig: NextAuthOptions = {
  providers: [
    Auth0Provider({
      clientId: process.env.AUTH0_CLIENT_ID || "",
      clientSecret: process.env.AUTH0_CLIENT_SECRET || "",
      issuer: process.env.AUTH0_ISSUER_BASE_URL || "",
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    LinkedInProvider({
      clientId: process.env.LINKEDIN_CLIENT_ID || "",
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          // Aquí iría la lógica para autenticar al usuario con tu servicio de autenticación
          const response = await fetch(`${process.env.AUTH_SERVICE_URL}/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          })

          if (!response.ok) {
            return null
          }

          const user = await response.json()
          return user
        } catch (error) {
          console.error("Authentication error:", error)
          return null
        }
      },
    }),
  ],
  pages: {
    signIn: "/sign-in",
    signOut: "/",
    error: "/error",
    newUser: "/onboarding",
  },
  callbacks: {
    async jwt({ token, user, account }) {
      // Añadir información adicional al token si es necesario
      if (user) {
        token.id = user.id
        token.role = (user as any).role || "user"
      }

      // Si tienes un token de acceso, puedes guardarlo
      if (account?.access_token) {
        token.accessToken = account.access_token
      }

      return token
    },
    async session({ session, token }) {
      // Añadir información del token a la sesión
      if (token) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        session.accessToken = token.accessToken as string
      }

      return session
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60, // 1 hora (en segundos)
  },
  secret: process.env.AUTH0_SECRET,
}
