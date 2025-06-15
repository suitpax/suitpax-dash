import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"

async function ProfilePage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/profile")
  }

  return (
    <div>
      <h1>Profile Page</h1>
      <p>Welcome, {session?.user?.name}!</p>
    </div>
  )
}

export default ProfilePage
