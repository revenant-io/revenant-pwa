'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'

interface UserInfo {
  id?: string
  email?: string
  first_name?: string
  last_name?: string
  username?: string
}

function readUserInfo(): UserInfo {
  if (typeof document === 'undefined') return {}
  try {
    const match = document.cookie.match(/(?:^|;\s*)user_info=([^;]*)/)
    if (!match) return {}
    return JSON.parse(decodeURIComponent(match[1]))
  } catch {
    return {}
  }
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserInfo>({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setUser(readUserInfo())
  }, [])

  async function handleLogout() {
    setLoading(true)
    await fetch('/api/auth/logout', { method: 'POST' })
    window.location.href = '/login'
  }

  const displayName =
    [user.first_name, user.last_name].filter(Boolean).join(' ') ||
    user.username ||
    user.email ||
    'User'

  const initials = displayName
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <div className="max-w-md mx-auto p-4 py-10">
      {/* Avatar + name */}
      <div className="flex flex-col items-center mb-10">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-semibold mb-4"
          style={{ background: 'var(--rv-terra-100)', color: 'var(--rv-terra-700)' }}
        >
          {initials || '?'}
        </div>
        <h2
          className="text-xl font-medium tracking-tight"
          style={{
            fontFamily: "var(--font-fraunces), 'Iowan Old Style', Georgia, serif",
            color: 'var(--rv-cocoa-900)',
          }}
        >
          {displayName}
        </h2>
        {user.email && (
          <p className="text-sm mt-1" style={{ color: 'var(--rv-cocoa-500)' }}>
            {user.email}
          </p>
        )}
        {user.username && (
          <p className="text-xs mt-0.5" style={{ color: 'var(--rv-cocoa-400)' }}>
            @{user.username}
          </p>
        )}
      </div>

      {/* Account info card */}
      <div
        className="rounded-2xl border divide-y divide-[#DCCFB5] mb-6"
        style={{
          background: 'var(--rv-cream-50)',
          borderColor: 'var(--rv-cream-300)',
        }}
      >
        {[
          { label: 'First name', value: user.first_name },
          { label: 'Last name',  value: user.last_name },
          { label: 'Username',   value: user.username ? `@${user.username}` : undefined },
          { label: 'Email',      value: user.email },
        ].map(({ label, value }) =>
          value ? (
            <div key={label} className="flex items-center justify-between px-5 py-3.5">
              <span className="text-sm" style={{ color: 'var(--rv-cocoa-500)' }}>{label}</span>
              <span className="text-sm font-medium" style={{ color: 'var(--rv-cocoa-900)' }}>{value}</span>
            </div>
          ) : null
        )}
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        disabled={loading}
        className="w-full rounded-xl py-3 text-sm font-semibold transition-opacity duration-150"
        style={{
          background: 'var(--rv-cream-200)',
          color: 'var(--rv-danger)',
          opacity: loading ? 0.6 : 1,
        }}
      >
        {loading ? 'Signing out…' : 'Sign out'}
      </button>
    </div>
  )
}
