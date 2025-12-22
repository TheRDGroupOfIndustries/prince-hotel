"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/base/button"
import { Card } from "@/components/base/card"

export default function LoginPage() {
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ password }),
    })

    if (res.ok) {
      router.push("/admin/rooms")
      router.refresh() // Refresh to update middleware state
    } else {
      setError("Invalid Password")
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Admin Access</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="password"
            placeholder="Enter Admin Password"
            className="w-full p-2 border rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button type="submit" className="w-full">
            Login
          </Button>
        </form>
      </Card>
    </div>
  )
}