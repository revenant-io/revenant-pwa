'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect, useRef, useCallback, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

// ─── Types ──────────────────────────────────────────────────────────────────

type SplitType = 'equal' | 'percentage' | 'exact'

interface UserResult {
  id: string
  username: string
  first_name?: string
  last_name?: string
}

interface Participant {
  user: UserResult
  value: string // percentage or exact amount
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function FormLabel({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label
      htmlFor={htmlFor}
      className="block text-sm font-medium mb-1.5"
      style={{ color: 'var(--rv-cocoa-700)' }}
    >
      {children}
    </label>
  )
}

function inputStyle(focused = false): React.CSSProperties {
  return {
    background: 'var(--rv-cream-100)',
    border: `1px solid ${focused ? 'var(--rv-terra-500)' : 'var(--rv-cream-300)'}`,
    color: 'var(--rv-cocoa-900)',
    boxShadow: focused ? '0 0 0 2px var(--rv-terra-500)' : 'none',
    outline: 'none',
    transition: 'border-color 150ms, box-shadow 150ms',
  }
}

function TextInput({
  id,
  type = 'text',
  value,
  onChange,
  placeholder,
  required,
}: {
  id: string
  type?: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  required?: boolean
}) {
  const [focused, setFocused] = useState(false)
  return (
    <input
      id={id}
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      required={required}
      className="w-full rounded-xl px-4 py-3 text-sm"
      style={inputStyle(focused)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    />
  )
}

function SelectInput({
  id,
  value,
  onChange,
  children,
}: {
  id: string
  value: string
  onChange: (v: string) => void
  children: React.ReactNode
}) {
  const [focused, setFocused] = useState(false)
  return (
    <select
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-xl px-4 py-3 text-sm appearance-none"
      style={inputStyle(focused)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    >
      {children}
    </select>
  )
}

function TextareaInput({
  id,
  value,
  onChange,
  placeholder,
  rows = 3,
}: {
  id: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  rows?: number
}) {
  const [focused, setFocused] = useState(false)
  return (
    <textarea
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full rounded-xl px-4 py-3 text-sm resize-none"
      style={inputStyle(focused)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    />
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function NewExpensePage() {
  const router = useRouter()

  // Core fields
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [currency, setCurrency] = useState('CLP')
  const [category, setCategory] = useState('Food')
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0])
  const [isShared, setIsShared] = useState(false)

  // Shared fields
  const [splitType, setSplitType] = useState<SplitType>('equal')
  const [participants, setParticipants] = useState<Participant[]>([])

  // User search
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<UserResult[]>([])
  const [searchLoading, setSearchLoading] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const searchContainerRef = useRef<HTMLDivElement>(null)

  // Submission
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  // ── Close dropdown on outside click ────────────────────────────────────────
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  // ── Debounced user search ─────────────────────────────────────────────────
  const doSearch = useCallback(async (q: string) => {
    if (!q.trim()) {
      setSearchResults([])
      setShowDropdown(false)
      return
    }
    setSearchLoading(true)
    try {
      const res = await fetch(`/api/users/search?username=${encodeURIComponent(q)}`)
      if (res.ok) {
        const data = await res.json()
        const results: UserResult[] = Array.isArray(data) ? data : data.users ?? []
        setSearchResults(results)
        setShowDropdown(results.length > 0)
      }
    } catch {
      // ignore search errors
    } finally {
      setSearchLoading(false)
    }
  }, [])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      doSearch(searchQuery)
    }, 300)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [searchQuery, doSearch])

  // ── Participant management ────────────────────────────────────────────────
  function addParticipant(user: UserResult) {
    if (participants.find((p) => p.user.id === user.id)) return
    setParticipants((prev) => [...prev, { user, value: '' }])
    setSearchQuery('')
    setShowDropdown(false)
  }

  function removeParticipant(id: string) {
    setParticipants((prev) => prev.filter((p) => p.user.id !== id))
  }

  function updateParticipantValue(id: string, value: string) {
    setParticipants((prev) =>
      prev.map((p) => (p.user.id === id ? { ...p, value } : p))
    )
  }

  // ── Percentage sum ─────────────────────────────────────────────────────────
  const percentageSum =
    splitType === 'percentage'
      ? participants.reduce((sum, p) => {
          const v = parseFloat(p.value)
          return sum + (isNaN(v) ? 0 : v)
        }, 0)
      : 0

  // ── Submit ────────────────────────────────────────────────────────────────
  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      const payload: Record<string, unknown> = {
        title: title.trim(),
        description: description.trim() || undefined,
        amount: parseFloat(amount),
        currency,
        category,
        date,
        type: isShared ? 'shared' : 'personal',
      }

      if (isShared) {
        payload.split_type = splitType
        payload.participants = participants.map((p) => ({
          user_id: p.user.id,
          ...(splitType !== 'equal' && { value: parseFloat(p.value) || 0 }),
        }))
      }

      const res = await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const json = await res.json().catch(() => ({ error: 'Failed to create expense' }))
        setError(json.error || 'Failed to create expense')
        return
      }

      router.push('/expenses')
    } catch {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="max-w-2xl mx-auto p-4 py-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/expenses"
          className="flex items-center justify-center w-9 h-9 rounded-xl transition-colors duration-150"
          style={{
            background: 'var(--rv-cream-200)',
            color: 'var(--rv-cocoa-700)',
          }}
          aria-label="Back"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
        <h1
          className="text-2xl font-medium tracking-tight"
          style={{
            fontFamily: "var(--font-fraunces), 'Iowan Old Style', Georgia, serif",
            color: 'var(--rv-cocoa-900)',
          }}
        >
          New Expense
        </h1>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Title */}
        <div>
          <FormLabel htmlFor="title">Title *</FormLabel>
          <TextInput
            id="title"
            value={title}
            onChange={setTitle}
            placeholder="e.g. Dinner with friends"
            required
          />
        </div>

        {/* Description */}
        <div>
          <FormLabel htmlFor="description">Description</FormLabel>
          <TextareaInput
            id="description"
            value={description}
            onChange={setDescription}
            placeholder="Optional notes…"
          />
        </div>

        {/* Amount + Currency row */}
        <div className="flex gap-3">
          <div className="flex-1">
            <FormLabel htmlFor="amount">Amount *</FormLabel>
            <TextInput
              id="amount"
              type="number"
              value={amount}
              onChange={setAmount}
              placeholder="0.00"
              required
            />
          </div>
          <div className="w-28">
            <FormLabel htmlFor="currency">Currency</FormLabel>
            <SelectInput id="currency" value={currency} onChange={setCurrency}>
              <option value="CLP">CLP — Chilean Peso</option>
              <option value="CLF">CLF — UF</option>
              <option value="USD">USD — US Dollar</option>
              <option value="EUR">EUR — Euro</option>
            </SelectInput>
          </div>
        </div>

        {/* Category */}
        <div>
          <FormLabel htmlFor="category">Category</FormLabel>
          <SelectInput id="category" value={category} onChange={setCategory}>
            <option>Food</option>
            <option>Transport</option>
            <option>Entertainment</option>
            <option>Health</option>
            <option>Home</option>
            <option>Other</option>
          </SelectInput>
        </div>

        {/* Date */}
        <div>
          <FormLabel htmlFor="date">Date *</FormLabel>
          <TextInput
            id="date"
            type="date"
            value={date}
            onChange={setDate}
            required
          />
        </div>

        {/* Personal / Shared toggle */}
        <div>
          <p className="block text-sm font-medium mb-2" style={{ color: 'var(--rv-cocoa-700)' }}>
            Expense type
          </p>
          <div
            className="inline-flex rounded-xl p-1 gap-1"
            style={{ background: 'var(--rv-cream-200)' }}
          >
            {[
              { label: 'Personal', value: false },
              { label: 'Shared',   value: true  },
            ].map(({ label, value }) => (
              <button
                key={label}
                type="button"
                onClick={() => setIsShared(value)}
                className="px-5 py-2 rounded-lg text-sm font-medium transition-all duration-150"
                style={
                  isShared === value
                    ? {
                        background: 'var(--rv-cream-50)',
                        color: 'var(--rv-terra-600)',
                        boxShadow: '0 1px 4px rgba(42,27,14,0.10)',
                      }
                    : { color: 'var(--rv-cocoa-500)' }
                }
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Shared section ─────────────────────────────────────────────── */}
        {isShared && (
          <div
            className="rounded-2xl p-4 space-y-4"
            style={{
              background: 'var(--rv-cream-50)',
              border: '1px solid var(--rv-cream-300)',
            }}
          >
            {/* Split type */}
            <div>
              <p className="text-sm font-medium mb-2" style={{ color: 'var(--rv-cocoa-700)' }}>
                Split type
              </p>
              <div className="flex gap-2 flex-wrap">
                {(['equal', 'percentage', 'exact'] as SplitType[]).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setSplitType(st)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all duration-150"
                    style={
                      splitType === st
                        ? {
                            background: 'var(--rv-terra-600)',
                            color: 'var(--rv-cream-50)',
                          }
                        : {
                            background: 'var(--rv-cream-200)',
                            color: 'var(--rv-cocoa-700)',
                          }
                    }
                  >
                    {st === 'equal' ? 'Equal' : st === 'percentage' ? 'Percentage' : 'Exact'}
                  </button>
                ))}
              </div>
            </div>

            {/* Participant search */}
            <div ref={searchContainerRef} className="relative">
              <FormLabel htmlFor="user-search">Add participants</FormLabel>
              <div className="relative">
                <input
                  id="user-search"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by username…"
                  autoComplete="off"
                  className="w-full rounded-xl px-4 py-3 text-sm"
                  style={{
                    background: 'var(--rv-cream-100)',
                    border: '1px solid var(--rv-cream-300)',
                    color: 'var(--rv-cocoa-900)',
                    outline: 'none',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.boxShadow = '0 0 0 2px var(--rv-terra-500)'
                    e.currentTarget.style.borderColor = 'var(--rv-terra-500)'
                    if (searchResults.length > 0) setShowDropdown(true)
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.boxShadow = 'none'
                    e.currentTarget.style.borderColor = 'var(--rv-cream-300)'
                  }}
                />
                {searchLoading && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs" style={{ color: 'var(--rv-cocoa-300)' }}>
                    Searching…
                  </span>
                )}
              </div>

              {/* Dropdown */}
              {showDropdown && searchResults.length > 0 && (
                <div
                  className="absolute top-full left-0 right-0 mt-1 rounded-xl overflow-hidden z-20 shadow-[0_4px_16px_rgba(42,27,14,0.14)]"
                  style={{
                    background: 'var(--rv-cream-50)',
                    border: '1px solid var(--rv-cream-300)',
                  }}
                >
                  {searchResults.map((user) => {
                    const alreadyAdded = participants.some((p) => p.user.id === user.id)
                    return (
                      <button
                        key={user.id}
                        type="button"
                        disabled={alreadyAdded}
                        onClick={() => addParticipant(user)}
                        className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors duration-150 disabled:opacity-40"
                        style={{ color: 'var(--rv-cocoa-900)' }}
                        onMouseEnter={(e) => {
                          if (!alreadyAdded) (e.currentTarget as HTMLButtonElement).style.background = 'var(--rv-cream-200)'
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLButtonElement).style.background = 'transparent'
                        }}
                      >
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold shrink-0"
                          style={{
                            background: 'var(--rv-terra-100)',
                            color: 'var(--rv-terra-700)',
                          }}
                        >
                          {user.username[0].toUpperCase()}
                        </div>
                        <div>
                          <div className="text-sm font-medium">{user.username}</div>
                          {(user.first_name || user.last_name) && (
                            <div className="text-xs" style={{ color: 'var(--rv-cocoa-500)' }}>
                              {[user.first_name, user.last_name].filter(Boolean).join(' ')}
                            </div>
                          )}
                        </div>
                        {alreadyAdded && (
                          <span className="ml-auto text-xs" style={{ color: 'var(--rv-cocoa-300)' }}>
                            Added
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Participant list */}
            {participants.length > 0 && (
              <div className="space-y-2">
                {participants.map((p) => (
                  <div
                    key={p.user.id}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5"
                    style={{
                      background: 'var(--rv-cream-100)',
                      border: '1px solid var(--rv-cream-200)',
                    }}
                  >
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold shrink-0"
                      style={{ background: 'var(--rv-terra-100)', color: 'var(--rv-terra-700)' }}
                    >
                      {p.user.username[0].toUpperCase()}
                    </div>
                    <span className="flex-1 text-sm font-medium" style={{ color: 'var(--rv-cocoa-900)' }}>
                      {p.user.username}
                    </span>

                    {/* Value input for percentage / exact */}
                    {splitType !== 'equal' && (
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          value={p.value}
                          onChange={(e) => updateParticipantValue(p.user.id, e.target.value)}
                          placeholder={splitType === 'percentage' ? '%' : '0.00'}
                          className="w-20 rounded-lg px-2 py-1.5 text-sm text-right"
                          style={{
                            background: 'var(--rv-cream-50)',
                            border: '1px solid var(--rv-cream-300)',
                            color: 'var(--rv-cocoa-900)',
                            outline: 'none',
                          }}
                          min="0"
                          step={splitType === 'percentage' ? '1' : '0.01'}
                        />
                        {splitType === 'percentage' && (
                          <span className="text-xs" style={{ color: 'var(--rv-cocoa-500)' }}>%</span>
                        )}
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => removeParticipant(p.user.id)}
                      className="w-6 h-6 flex items-center justify-center rounded-full transition-colors duration-150 shrink-0"
                      style={{ color: 'var(--rv-cocoa-300)' }}
                      aria-label={`Remove ${p.user.username}`}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.color = 'var(--rv-danger)'
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.color = 'var(--rv-cocoa-300)'
                      }}
                    >
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                        <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    </button>
                  </div>
                ))}

                {/* Percentage sum indicator */}
                {splitType === 'percentage' && (
                  <div
                    className="flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium"
                    style={{
                      background: percentageSum === 100 ? 'var(--rv-sage-100)' : percentageSum > 100 ? 'var(--rv-danger-tint)' : 'var(--rv-gold-100)',
                      color:      percentageSum === 100 ? 'var(--rv-sage-700)'  : percentageSum > 100 ? 'var(--rv-danger)'       : 'var(--rv-gold-700)',
                    }}
                  >
                    <span>Total percentage</span>
                    <span>{percentageSum}%{percentageSum !== 100 && ` (need ${100 - percentageSum > 0 ? '+' : ''}${100 - percentageSum}%)`}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

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
          disabled={submitting}
          className="w-full rounded-xl py-3.5 text-sm font-semibold transition-opacity duration-150"
          style={{
            background: 'var(--rv-terra-600)',
            color: 'var(--rv-cream-50)',
            opacity: submitting ? 0.7 : 1,
          }}
        >
          {submitting ? 'Adding expense…' : 'Add expense'}
        </button>
      </form>
    </div>
  )
}
