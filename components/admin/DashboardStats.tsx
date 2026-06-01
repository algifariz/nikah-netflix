'use client'

import { useState, useEffect } from 'react'
import type { DashboardStats as Stats } from '@/types'

export function DashboardStats() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/dashboard')
      .then((res) => res.json())
      .then((data) => {
        setStats(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-8 h-8 border-2 border-netflix-red border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!stats) return null

  const cards = [
    { label: 'Total Tamu', value: stats.totalGuests, color: 'text-white' },
    { label: 'Hadir', value: stats.attending, color: 'text-green-400' },
    { label: 'Tidak Hadir', value: stats.notAttending, color: 'text-red-400' },
    { label: 'Pending', value: stats.pending, color: 'text-yellow-400' },
    { label: 'Sudah Scan', value: stats.scanned, color: 'text-blue-400' },
    { label: 'Ucapan', value: stats.totalWishes, color: 'text-purple-400' },
    { label: 'VVIP', value: stats.vvipCount, color: 'text-yellow-300' },
    { label: 'VIP', value: stats.vipCount, color: 'text-purple-300' },
    { label: 'Regular', value: stats.regularCount, color: 'text-netflix-light' },
  ]

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">Dashboard</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <div key={card.label} className="bg-netflix-dark rounded-lg p-4">
            <p className="text-netflix-light/50 text-xs mb-1">{card.label}</p>
            <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
