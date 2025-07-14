"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import Link from "next/link"

export default function RegisterPage() {
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const res = await fetch("/api/register", {
      method: "POST",
      body: JSON.stringify({ email, name, password }),
      headers: {
        "Content-Type": "application/json",
      },
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error || "Something went wrong")
      return
    }

    // auto sign in after successful registration
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    })

    router.push("/")
  }

  return (
    <main className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleRegister} className="w-full bg-gray-800  max-w-sm space-y-4  p-6 rounded-xl shadow-2xl shadow-gray-800">
        <h2 className="text-xl font-semibold text-center">Register</h2>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <div>
          <label className="block text-sm font-medium">Name</label>
          <input
            type="text"
            className="w-full mt-1 px-3 py-3 border rounded-md outline-none"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            className="w-full mt-1 px-3 py-3 border rounded-md outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Password</label>
          <input
            type="password"
            className="w-full mt-1 px-3 py-3 border rounded-md outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="w-full bg-pink-800 text-white py-2 rounded-md hover:scale-105 duration-100">
          Register
        </button>
        <Link href='/login' className="underline">Already have a Account</Link>
      </form>
    </main>
  )
}
