'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'

interface Expense {
  id: string
  title: string
  amount: number
  currency: string
  date: string
  category: string
  split_type?: string
  type?: string
}

const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  Food:          { bg: 'var(--rv-gold-100)',  text: 'var(--rv-gold-700)' },
  Transport:     { bg: 'var(--rv-sage-100)',  text: 'var(--rv-sage-700)' },
  Entertainment: { bg: 'var(--rv-terra-100)', text: 'var(--rv-terra-700)' },
  Health:        { bg: 'var(--rv-sage-100)',  text: 'var(--rv-sage-700)' },
  Home:          { bg: 'var(--rv-cream-200)', text: 'var(--rv-cocoa-700)' },
  Other:         { bg: 'var(--rv-cream-200)', text: 'var(--rv-cocoa-500)' },
}

function CategoryBadge({ category }: { category: string }) {
  const colors = CATEGORY_COLORS[category] ?? CATEGORY_COLORS['Other']
  return (
    <span
      className="inline-block text-xs font-medium px-2 py-0.5 rounded-full"
      style={{ background: colors.bg, color: colors.text }}
    >
      {category}
    </span>
  )
}

function SplitBadge({ splitType }: { splitType?: string }) {
  if (!splitType) return null
  const label =
    splitType === 'equal'      ? 'Equal split' :
    splitType === 'percentage' ? 'By %' :
    splitType === 'exact'      ? 'Exact' : splitType
  return (
    <span
      className="inline-block text-xs font-medium px-2 py-0.5 rounded-full"
      style={{ background: 'var(--rv-cream-200)', color: 'var(--rv-cocoa-700)' }}
    >
      {label}
    </span>
  )
}

function ExpenseCard({ expense }: { expense: Expense }) {
  const formattedDate = new Date(expense.date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  const formattedAmount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: expense.currency || 'USD',
  }).format(expense.amount)

  return (
    <div
      className="rounded-xl p-4 shadow-[0_2px_8px_rgba(42,27,14,0.07)] transition-shadow duration-150 hover:shadow-[0_4px_12px_rgba(42,27,14,0.12)]"
      style={{
        background: 'var(--rv-cream-50)',
        border: '1px solid var(--rv-cream-300)',
      }}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3
          className="font-medium text-sm leading-tight flex-1 min-w-0 truncate"
          style={{ color: 'var(--rv-cocoa-900)' }}
        >
          {expense.title}
        </h3>
        <span
          className="text-base font-semibold shrink-0"
          style={{ color: 'var(--rv-terra-600)' }}
        >
          {formattedAmount}
        </span>
      </div>
      <p className="text-xs mb-3" style={{ color: 'var(--rv-cocoa-500)' }}>
        {formattedDate}
      </p>
      <div className="flex items-center gap-2 flex-wrap">
        <CategoryBadge category={expense.category} />
        <SplitBadge splitType={expense.split_type} />
      </div>
    </div>
  )
}

function SkeletonCard() {
  return (
    <div
      className="rounded-xl p-4 animate-pulse"
      style={{
        background: 'var(--rv-cream-50)',
        border: '1px solid var(--rv-cream-300)',
      }}
    >
      <div className="flex justify-between mb-2">
        <div className="h-4 w-2/3 rounded-full" style={{ background: 'var(--rv-cream-300)' }} />
        <div className="h-4 w-16 rounded-full" style={{ background: 'var(--rv-cream-300)' }} />
      </div>
      <div className="h-3 w-24 rounded-full mb-3" style={{ background: 'var(--rv-cream-200)' }} />
      <div className="flex gap-2">
        <div className="h-5 w-16 rounded-full" style={{ background: 'var(--rv-cream-300)' }} />
      </div>
    </div>
  )
}

type Filter = 'all' | 'personal' | 'shared'

export default function ExpensesPage() {
  const [activeFilter, setActiveFilter] = useState<Filter>('all')
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchExpenses = useCallback(async (filter: Filter) => {
    try {
      const query = filter === 'all' ? '' : `?type=${filter}`
      const res = await fetch(`/api/expenses${query}`)
      if (!res.ok) {
        setError('Failed to load expenses.')
        return
      }
      const data = await res.json()
      setExpenses(Array.isArray(data) ? data : data.expenses ?? [])
    } catch {
      setError('An error occurred while fetching expenses.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    async function load() {
      if (cancelled) return
      setLoading(true)
      setError('')
      await fetchExpenses(activeFilter)
    }
    void load()
    return () => { cancelled = true }
  }, [activeFilter, fetchExpenses])

  return (
    <div className="max-w-2xl mx-auto p-4 py-6">
      {/* Header row */}
      <div className="flex items-center justify-between mb-6">
        <h1
          className="text-2xl font-medium tracking-tight"
          style={{
            fontFamily: "var(--font-fraunces), 'Iowan Old Style', Georgia, serif",
            color: 'var(--rv-cocoa-900)',
          }}
        >
          Expenses
        </h1>
        <Link
          href="/expenses/new"
          className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold transition-opacity duration-150 hover:opacity-90"
          style={{ background: 'var(--rv-terra-600)', color: 'var(--rv-cream-50)' }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
          </svg>
          New
        </Link>
      </div>

      {/* Filter pills */}
      <div className="flex gap-2 mb-6">
        {(['all', 'personal', 'shared'] as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className="px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-all duration-150"
            style={
              activeFilter === f
                ? { background: 'var(--rv-terra-600)', color: 'var(--rv-cream-50)' }
                : { background: 'var(--rv-cream-200)', color: 'var(--rv-cocoa-500)' }
            }
          >
            {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Content */}
      {error && (
        <div
          className="rounded-xl px-4 py-3 text-sm mb-4"
          style={{
            background: 'var(--rv-danger-tint)',
            color: 'var(--rv-danger)',
            border: '1px solid var(--rv-danger)',
          }}
        >
          {error}
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : expenses.length === 0 ? (
        <div className="text-center py-16">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: 'var(--rv-cream-200)' }}
          >
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
              <rect x="3" y="7" width="22" height="16" rx="3" stroke="var(--rv-cocoa-500)" strokeWidth="1.75" />
              <path d="M3 11h22" stroke="var(--rv-cocoa-500)" strokeWidth="1.75" />
              <path d="M8 16h4M8 19h2" stroke="var(--rv-cocoa-300)" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <p className="font-medium text-sm" style={{ color: 'var(--rv-cocoa-700)' }}>
            No {activeFilter === 'all' ? '' : activeFilter + ' '}expenses yet
          </p>
          <p className="text-xs mt-1" style={{ color: 'var(--rv-cocoa-500)' }}>
            Add your first expense to get started.
          </p>
          <Link
            href="/expenses/new"
            className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold mt-4 transition-opacity duration-150 hover:opacity-90"
            style={{ background: 'var(--rv-terra-600)', color: 'var(--rv-cream-50)' }}
          >
            Add expense
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {expenses.map((expense) => (
            <ExpenseCard key={expense.id} expense={expense} />
          ))}
        </div>
      )}
    </div>
  )
}
