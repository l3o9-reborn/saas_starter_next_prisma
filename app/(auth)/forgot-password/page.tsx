// app/forgot-password/page.tsx
"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function ForgotPasswordPage() {
  const [email, setEmail]=useState('')
  const [loading , setLoading]= useState(false)
  const router= useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
      headers: { "Content-Type": "application/json" },
    })
    setLoading(false)
    if (res.ok) alert("✅ Reset link sent to your email.")
    else alert("❌ Error sending reset link.")

  }

  return (

    <div className="min-h-screen w-full flex flex-col items-center justify-center ">
      <h1 className="mb-20 text-4xl text-emerald-950">Forgot Password</h1>
      <div className="bg-gray-800 w-[85%] max-w-sm  md:mx-auto p-6 rounded-xl space-y-4 shadow-2xl shadow-gray-800">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            className="mt-1 w-full border px-3 py-3 rounded-md outline-none"
            type="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            required
          />
        </div>
      

        <button
          className="w-full cursor-pointer bg-green-600 text-white py-2 rounded-md hover:scale-105 duration-100"
          type="submit"
          disabled={loading}
        >
          {loading ? "Sending Reset Link..." : "Send Reset Link"}
        </button>

      </form>
        <button
        onClick={router.back}
         className="w-full cursor-pointer bg-pink-600 text-white py-2 rounded-md hover:scale-105 duration-100">
          Go Back
        </button>
    </div>
    </div>

    
  )
}
