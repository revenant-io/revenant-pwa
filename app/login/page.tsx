'use client'

import { useState, FormEvent } from 'react'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (!res.ok) {
        const json = await res.json().catch(() => ({ error: 'Login failed' }))
        setError(json.error || 'Login failed')
        return
      }

      // Hard navigation so the browser sends the freshly-set cookie in the
      // very first request (soft push can race on non-localhost).
      window.location.href = '/'
    } catch {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-12"
      style={{ background: 'var(--rv-cream-100)' }}
    >
      {/* Logo / wordmark */}
      <div className="mb-8 text-center">
        <h1
          className="text-4xl font-medium tracking-[-0.02em]"
          style={{
            fontFamily: "var(--font-fraunces), 'Iowan Old Style', Georgia, serif",
            color: 'var(--rv-cocoa-900)',
          }}
        >
          Revenant
        </h1>
        <p className="mt-2 text-sm" style={{ color: 'var(--rv-cocoa-500)' }}>
          Your personal finance companion
        </p>
      </div>

      {/* Card */}
      <div
        className="w-full max-w-sm rounded-2xl p-8 shadow-[0_4px_24px_rgba(42,27,14,0.10)]"
        style={{ background: 'var(--rv-cream-50)', border: '1px solid var(--rv-cream-300)' }}
      >
        <h2
          className="text-xl font-semibold mb-6"
          style={{ color: 'var(--rv-cocoa-900)' }}
        >
          Sign in
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium mb-1.5"
              style={{ color: 'var(--rv-cocoa-700)' }}
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-shadow duration-150"
              style={{
                background: 'var(--rv-cream-100)',
                border: '1px solid var(--rv-cream-300)',
                color: 'var(--rv-cocoa-900)',
              }}
              onFocus={(e) => {
                e.currentTarget.style.boxShadow = `0 0 0 2px var(--rv-terra-500)`
                e.currentTarget.style.borderColor = 'var(--rv-terra-500)'
              }}
              onBlur={(e) => {
                e.currentTarget.style.boxShadow = 'none'
                e.currentTarget.style.borderColor = 'var(--rv-cream-300)'
              }}
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-1.5"
              style={{ color: 'var(--rv-cocoa-700)' }}
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-shadow duration-150"
              style={{
                background: 'var(--rv-cream-100)',
                border: '1px solid var(--rv-cream-300)',
                color: 'var(--rv-cocoa-900)',
              }}
              onFocus={(e) => {
                e.currentTarget.style.boxShadow = `0 0 0 2px var(--rv-terra-500)`
                e.currentTarget.style.borderColor = 'var(--rv-terra-500)'
              }}
              onBlur={(e) => {
                e.currentTarget.style.boxShadow = 'none'
                e.currentTarget.style.borderColor = 'var(--rv-cream-300)'
              }}
            />
          </div>

          {/* Error */}
          {error && (
            <div
              className="rounded-xl px-4 py-3 text-sm"
              style={{
                background: 'var(--rv-danger-tint)',
                color: 'var(--rv-danger)',
                border: '1px solid var(--rv-danger)',
              }}
            >
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl py-3 text-sm font-semibold transition-opacity duration-150 mt-2"
            style={{
              background: 'var(--rv-terra-600)',
              color: 'var(--rv-cream-50)',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm" style={{ color: 'var(--rv-cocoa-500)' }}>
          Don&apos;t have an account?{' '}
          <Link
            href="/register"
            className="font-medium transition-colors duration-150"
            style={{ color: 'var(--rv-terra-600)' }}
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  )
}
