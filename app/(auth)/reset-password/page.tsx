// app/reset-password/page.tsx
"use client"
import { useSearchParams, useRouter } from "next/navigation"
import { useState } from "react"

export default function ResetPasswordPage() {
  const token = useSearchParams().get("token")
  const router = useRouter()

  const [password, setPassword]= useState('')
  const [loading, setLoading]= useState(false)


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ token, newPassword: password }),
      headers: { "Content-Type": "application/json" },
    })
    setLoading(false)
    if (res.ok) {
      alert("✅ Password reset successful. Redirecting to login...")
      setTimeout(() => router.push("/login"), 1000)
    } else {
      alert("❌ Invalid or expired token.")
    }
  }

  if (!token) return <p className="text-center mt-10 text-red-500">Invalid reset link</p>

  return (
   <div className="min-h-screen w-full flex flex-col items-center justify-center ">
      <h1 className="mb-20 text-4xl text-emerald-950">Reset Password</h1>
      <div className="bg-gray-800 w-[90%] max-w-sm  md:mx-auto p-6 rounded-xl space-y-4 shadow-2xl shadow-gray-800">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium"> New Password</label>
          <input
            className="mt-1 w-full border px-3 py-3 rounded-md outline-none"
            type="Email"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            required
          />
        </div>
      

        <button
          className="w-full cursor-pointer bg-green-600 text-white py-2 rounded-md hover:scale-105 duration-100"
          type="submit"
          disabled={loading}
        >
          {loading ? "Saving..." : "Reset Password"}
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
