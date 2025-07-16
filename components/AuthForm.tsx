"use client"
import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function AuthForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl: "/",
      })

      /** ---------------------------
       * SUCCESS → go to callbackUrl
       * -------------------------- */
      if (res?.ok) {
        router.push("/")
        return
      }

      /** -------------------------------------------------------------
       * FAILURE → res.error === "CredentialsSignin" in EVERY scenario
       * ------------------------------------------------------------*/
      const probe = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      if (probe.ok) {
        // Account exists & is unverified
        alert("✅ Please verify your email. A new link was sent to your inbox.")
      } else if (probe.status === 404) {
        // No such user
        alert("❌ No account found for that email.")
      } else if (probe.status === 400) {
        // Email is already verified -> so the password was wrong
        alert("❌ Invalid email or password.")
      } else {
        // Anything else (rate-limit, server error…)
        const { error } = await probe.json().catch(() => ({}))
        alert(error || "❌ Something went wrong. Please try again.")
      }
    } catch {
      alert("❌ Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  /* … JSX unchanged … */

  return (
    <div className="bg-gray-800 w-full max-w-sm mx-5 md:mx-auto p-6 rounded-xl space-y-4 shadow-2xl shadow-gray-800">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            className="mt-1 w-full border px-3 py-3 rounded-md outline-none"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Password</label>
          <input
            className="mt-1 w-full border px-3 py-3 rounded-md outline-none"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            required
          />
        </div>

        <div className="flex justify-end mt-1">
          <Link
            href="/forgot-password"
            className="text-xs underline hover:text-blue-400"
          >
            Forgot&nbsp;password?
          </Link>
        </div>

        <button
          className="w-full cursor-pointer bg-green-600 text-white py-2 rounded-md hover:scale-105 duration-100"
          type="submit"
          disabled={loading}
        >
          {loading ? "Signing In..." : "Sign In"}
        </button>

        <Link href="/register" className="underline">
          Create an Account
        </Link>
      </form>

      <hr />

      <button
        className="w-full py-2 rounded-md cursor-pointer bg-red-400 hover:scale-105 duration-100"
        onClick={() => signIn("google",{ callbackUrl: "/" })}
        disabled={loading}
      >
        Google
      </button>
      <button
        className="w-full py-2 rounded-md cursor-pointer bg-gray-900 hover:scale-105 duration-100"
        onClick={() => signIn("github",{ callbackUrl: "/" })}
        disabled={loading}
      >
        GitHub
      </button>
      <button
        className="w-full py-2 rounded-md cursor-pointer bg-blue-400 hover:scale-105 duration-100"
        onClick={() => signIn("facebook",{ callbackUrl: "/" })}
        disabled={loading}
      >
        Facebook
      </button>
    </div>
  )
}
