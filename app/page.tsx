import { getServerSession } from "next-auth"
import {authOptions} from "@/lib/authOptions"
import Link from "next/link"

export default async function Home() {
  const session = await getServerSession(authOptions)

  return (
    <main className="p-10 text-center space-y-6">
      {session ? (
        <>
          <h1 className="text-2xl">Welcome, {session.user?.email}</h1>
          <Link href="/api/auth/signout?callbackUrl=/">Sign out</Link>
        </>
      ) : (
        <>
          <h1 className="text-2xl">You are not signed in</h1>
          <Link href="/login">Go to Login</Link>
        </>
      )}
    </main>
  )
}