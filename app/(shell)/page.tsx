'use client'

import { useEffect, useState } from 'react'

interface Expense {
  id: string
  title: string
  amount: number
  currency: string
  date: string
  split_type?: string
}

function formatCLP(amount: number) {
  return amount.toLocaleString('es-CL')
}

function monthLabel(date: Date) {
  return new Intl.DateTimeFormat('es-CL', { month: 'long', year: 'numeric' }).format(date)
}

export default function Home() {
  const [month, setMonth] = useState(() => new Date())
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/expenses')
      .then(r => r.json())
      .then(data => {
        setExpenses(Array.isArray(data) ? data : data.expenses ?? [])
      })
      .finally(() => setLoading(false))
  }, [])

  const now = new Date()
  const isCurrentMonth =
    month.getFullYear() === now.getFullYear() && month.getMonth() === now.getMonth()

  const prevMonth = () => setMonth(m => new Date(m.getFullYear(), m.getMonth() - 1, 1))
  const nextMonth = () => setMonth(m => new Date(m.getFullYear(), m.getMonth() + 1, 1))

  const monthExpenses = expenses.filter(e => {
    const d = new Date(e.date)
    return d.getFullYear() === month.getFullYear() && d.getMonth() === month.getMonth()
  })

  const totalMonthly = monthExpenses.reduce((s, e) => s + e.amount, 0)
  const totalShared = monthExpenses
    .filter(e => e.split_type !== 'personal')
    .reduce((s, e) => s + e.amount, 0)
  const totalPersonal = totalMonthly - totalShared

  return (
    <div className="max-w-2xl mx-auto p-4 py-10">
      {/* Welcome header */}
      <div className="mb-10">
        <h1
          className="text-3xl text-[#2A1B0E] font-medium tracking-tight mb-2"
          style={{ fontFamily: "var(--font-fraunces), 'Iowan Old Style', Georgia, serif" }}
        >
          Welcome to Revenant
        </h1>
        <p className="text-[#8A6F4F]">Here&apos;s your spending summary.</p>
      </div>

      {/* Monthly expense metric card */}
      <div className="bg-[#FBF7F0] border border-[#DCCFB5] rounded-xl shadow-[0_2px_4px_rgba(42,27,14,0.06)] mb-6 overflow-hidden">
        {/* Month navigator */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-[#DCCFB5]">
          <button
            onClick={prevMonth}
            className="w-7 h-7 flex items-center justify-center rounded-full text-[#8A6F4F] hover:bg-[#ECE3D2] transition-colors"
            aria-label="Previous month"
          >
            ‹
          </button>
          <span className="text-sm font-medium text-[#54422D] capitalize">
            {monthLabel(month)}
          </span>
          <button
            onClick={nextMonth}
            disabled={isCurrentMonth}
            className="w-7 h-7 flex items-center justify-center rounded-full text-[#8A6F4F] hover:bg-[#ECE3D2] transition-colors disabled:opacity-30 disabled:cursor-default"
            aria-label="Next month"
          >
            ›
          </button>
        </div>

        {/* Metrics */}
        {loading ? (
          <div className="grid grid-cols-2 divide-x divide-[#DCCFB5] animate-pulse">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="p-5 space-y-3">
                <div className="h-3 w-1/2 bg-[#DCCFB5] rounded-full" />
                <div className="h-6 w-3/4 bg-[#DCCFB5] rounded-full" />
                <div className="h-3 w-2/3 bg-[#ECE3D2] rounded-full" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 divide-x divide-[#DCCFB5]">
            {/* Total */}
            <div className="p-5">
              <p className="text-xs text-[#8A6F4F] uppercase tracking-wide mb-1">Total del mes</p>
              <p className="text-2xl font-semibold text-[#2A1B0E] leading-tight">
                $ {formatCLP(totalMonthly)}
              </p>
              <p className="text-xs text-[#B5A084] mt-1">CLP</p>
            </div>
            {/* Shared subtotal */}
            <div className="p-5">
              <p className="text-xs text-[#8A6F4F] uppercase tracking-wide mb-1">Compartido</p>
              <p className="text-2xl font-semibold text-[#A6553A] leading-tight">
                $ {formatCLP(totalShared)}
              </p>
              <p className="text-xs text-[#B5A084] mt-1">
                Personal: $ {formatCLP(totalPersonal)}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Skeleton main card */}
      <div className="bg-[#FBF7F0] border border-[#DCCFB5] rounded-xl p-5 mb-6 animate-pulse space-y-4 shadow-[0_2px_4px_rgba(42,27,14,0.06)]">
        <div className="h-4 w-1/3 bg-[#DCCFB5] rounded-full" />
        <div className="space-y-2">
          <div className="h-3 w-full bg-[#DCCFB5] rounded-full" />
          <div className="h-3 w-5/6 bg-[#DCCFB5] rounded-full" />
          <div className="h-3 w-2/3 bg-[#DCCFB5] rounded-full" />
        </div>
        <div className="h-8 w-28 bg-[#DCCFB5] rounded-full" />
      </div>

      {/* Skeleton list */}
      <div className="bg-[#FBF7F0] border border-[#DCCFB5] rounded-xl divide-y divide-[#DCCFB5] animate-pulse shadow-[0_2px_4px_rgba(42,27,14,0.06)]">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center gap-3 px-5 py-4">
            <div className="w-8 h-8 rounded-full bg-[#DCCFB5] shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-1/3 bg-[#DCCFB5] rounded-full" />
              <div className="h-2.5 w-2/3 bg-[#ECE3D2] rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
