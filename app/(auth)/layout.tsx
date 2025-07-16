// app/auth/layout.tsx
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/authOptions" // your NextAuth config file
import { redirect } from "next/navigation"

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (session) {
    // user is authenticated, redirect to homepage
    redirect("/")
  }

  // user is NOT authenticated, show auth pages (login/register/etc)
  return (
    <div >
      {children}
    </div>
  )
}
