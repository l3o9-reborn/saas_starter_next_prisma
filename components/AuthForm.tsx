"use client"
import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function AuthForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false
    })
    if (res?.ok) router.push("/")
  }

  return (
    <div className="bg-gray-800 w-full max-w-sm mx-auto p-6  rounded-xl space-y-4 shadow-2xl shadow-gray-800">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            className="mt-1 w-full border px-3 py-3 rounded-md outline-none"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Password</label>
          <input
            className="mt-1 w-full border px-3 py-3 rounded-md outline-none"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>
        <button className="w-full cursor-pointer bg-green-600 text-white py-2 rounded-md hover:scale-105 duration-100" type="submit">
          Sign&nbsp;In
        </button>
        <Link href='/register' className="underline">Create an Account</Link>
      </form>

      <hr />

      <button className="w-full  py-2 rounded-md cursor-pointer bg-red-400 hover:scale-105 duration-100" onClick={() => signIn("google")}>Google</button>
      <button className="w-full  py-2 rounded-md cursor-pointer bg-gray-900 hover:scale-105 duration-100" onClick={() => signIn("github")}>GitHub</button>
      <button className="w-full  py-2 rounded-md cursor-pointer bg-blue-400 hover:scale-105 duration-100" onClick={() => signIn("facebook")}>Facebook</button>
    </div>
  )
}