'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    if (result?.error) {
      setError('Email atau password salah')
      setLoading(false)
    } else {
      router.push('/admin')
    }
  }

  return (
    <div className="min-h-screen bg-netflix-black flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-netflix-red">N</h1>
          <p className="text-netflix-light/50 text-sm mt-2">Admin Panel</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-netflix-dark rounded-lg p-8">
          <h2 className="text-xl font-bold mb-6">Sign In</h2>

          {error && (
            <div className="bg-red-900/30 border border-red-800 text-red-300 text-sm rounded p-3 mb-4">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
                className="w-full bg-netflix-gray border border-netflix-gray rounded p-3 text-sm text-white placeholder-netflix-light/30 focus:border-netflix-red focus:outline-none"
              />
            </div>
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                className="w-full bg-netflix-gray border border-netflix-gray rounded p-3 text-sm text-white placeholder-netflix-light/30 focus:border-netflix-red focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="netflix-btn w-full mt-6 disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}
