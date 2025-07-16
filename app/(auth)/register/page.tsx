"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { z } from "zod"

const registerSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

export default function RegisterPage() {
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    // 1️⃣ Validate with Zod
    const formData = { email, name, password }
    const result = registerSchema.safeParse(formData)

    if (!result.success) {
      alert(result.error.issues[0].message)           // ⚠️ show first validation error
      return
    }

    const { email: cleanEmail, name: cleanName, password: cleanPassword } = result.data

    // 2️⃣ Call the backend
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: cleanEmail, name: cleanName, password: cleanPassword }),
    })

    const data = await res.json()

    // 3️⃣ Error from backend
    if (!res.ok) {
      alert(data.error || "Something went wrong")     // ⚠️ backend error
      return
    }

    // 4️⃣ Success → alert + delayed redirect
    alert("✅ Verification link sent! Redirecting to login…")
    setTimeout(() => {
      router.push("/login")
    }, 3000)
  }

  return (
    <main className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleRegister}
        className="w-full bg-gray-800 max-w-sm space-y-4 mx-5 p-6 rounded-xl shadow-2xl shadow-gray-800"
      >
        <h2 className="text-xl font-semibold text-center text-white">Register</h2>

        <div>
          <label className="block text-sm font-medium text-white">Name</label>
          <input
            type="text"
            className="w-full mt-1 px-3 py-3 border rounded-md outline-none"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white">Email</label>
          <input
            type="email"
            className="w-full mt-1 px-3 py-3 border rounded-md outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white">Password</label>
          <input
            type="password"
            className="w-full mt-1 px-3 py-3 border rounded-md outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-pink-800 text-white py-2 rounded-md hover:scale-105 duration-100"
        >
          Register
        </button>

        <Link href="/login" className="underline text-sm block text-center text-white">
          Already have an account?
        </Link>
      </form>
    </main>
  )
}
