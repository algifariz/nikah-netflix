'use client'

import { useState, useEffect, useCallback } from 'react'
import type { Guest } from '@/types'

interface GuestsResponse {
  guests: Guest[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export function GuestManager() {
  const [guests, setGuests] = useState<Guest[]>([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({ name: '', phone: '', category: 'REGULAR' })
  const [saving, setSaving] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [filter, setFilter] = useState<string>('all')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalGuests, setTotalGuests] = useState(0)
  const limit = 15

  const fetchGuests = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.set('page', String(page))
      params.set('limit', String(limit))
      if (search) params.set('search', search)

      const res = await fetch(`/api/guests?${params.toString()}`)
      const data: GuestsResponse = await res.json()
      setGuests(data.guests || [])
      setTotalPages(data.totalPages || 1)
      setTotalGuests(data.total || 0)
    } catch {
      setGuests([])
    } finally {
      setLoading(false)
    }
  }, [page, search])

  useEffect(() => {
    fetchGuests()
  }, [fetchGuests])

  async function addGuest(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)

    const res = await fetch('/api/guests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    if (res.ok) {
      setForm({ name: '', phone: '', category: 'REGULAR' })
      setShowAdd(false)
      setPage(1)
      fetchGuests() // Refetch to show the new guest on page 1
    }
    setSaving(false)
  }

  async function deleteGuest(id: string) {
    if (!confirm('Hapus tamu ini?')) return
    await fetch(`/api/guests/${id}`, { method: 'DELETE' })
    // If current page becomes empty after deletion (and not on page 1), go back
    if (displayedGuests.length <= 1 && page > 1) {
      setPage(page - 1)
    } else {
      fetchGuests()
    }
  }

  function generateInvitationMessage(guest: Guest) {
    const baseUrl = window.location.origin
    const guestNameForUrl = encodeURIComponent(guest.name)
    const invitationLink = `${baseUrl}/invitation/${guest.invitation_code}?to=${guestNameForUrl}`

    return `Kepada Yth.
Bapak/Ibu/Saudara/i
${guest.name}

Assalamualaikum Warahmatullahi Wabarakatuh

Tanpa mengurangi rasa hormat, perkenankan kami mengundang Bapak/Ibu/Saudara/i, teman sekaligus sahabat, untuk menghadiri acara pernikahan kami.

Berikut link undangan kami, untuk info lengkap mengenai acara dapat dikunjungi melalui tautan di bawah ini:

👉 ${invitationLink}

(Catatan: Untuk tampilan maksimal, disarankan membuka link melalui browser Chrome atau Safari).

Merupakan suatu kebahagiaan dan kehormatan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu kepada kedua mempelai.

Wassalamualaikum Warahmatullahi Wabarakatuh

Terima Kasih`
  }

  function copyInvitation(guest: Guest) {
    const message = generateInvitationMessage(guest)
    navigator.clipboard.writeText(message)
    setCopiedId(guest.id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  function copyLinkOnly(guest: Guest) {
    const baseUrl = window.location.origin
    const link = `${baseUrl}/invitation/${guest.invitation_code}`
    navigator.clipboard.writeText(link)
    setCopiedId(guest.id + '-link')
    setTimeout(() => setCopiedId(null), 2000)
  }

  const categoryBadge = (cat: string) => {
    const colors: Record<string, string> = {
      VVIP: 'bg-yellow-600',
      VIP: 'bg-purple-600',
      REGULAR: 'bg-netflix-gray',
    }
    return `${colors[cat] || colors.REGULAR} text-white text-[10px] px-2 py-0.5 rounded font-bold`
  }

  // Apply RSVP filter client-side on the fetched page
  const displayedGuests = (filter === 'all'
    ? guests
    : guests.filter(g => g.rsvp_status === filter)
  ).sort((a, b) => a.name.localeCompare(b.name))

  function handleSearch(value: string) {
    setSearch(value)
    setPage(1) // Reset to page 1 on new search
  }

  function goToPage(newPage: number) {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage)
    }
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <h2 className="text-xl font-bold">Daftar Tamu ({totalGuests})</h2>
        <button onClick={() => setShowAdd(true)} className="netflix-btn text-sm">
          + Tambah Tamu
        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-netflix-light/30"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Cari tamu berdasarkan nama atau no. HP..."
            className="w-full bg-netflix-dark border border-netflix-gray/30 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-netflix-light/30 focus:border-netflix-red focus:outline-none transition"
          />
          {search && (
            <button
              onClick={() => handleSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-netflix-light/30 hover:text-white transition"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {[
            { id: 'all', label: 'Semua' },
            { id: 'attending', label: 'Hadir' },
            { id: 'not_attending', label: 'Tidak Hadir' },
            { id: 'pending', label: 'Pending' },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-3 py-1.5 rounded text-xs whitespace-nowrap transition ${
                filter === f.id
                  ? 'bg-netflix-red text-white'
                  : 'bg-netflix-dark text-netflix-light/50 hover:text-white'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Add Guest Form */}
      {showAdd && (
        <form onSubmit={addGuest} className="bg-netflix-dark rounded-xl p-5 mb-6 border border-netflix-gray/20">
          <h3 className="font-bold mb-4 text-sm">Tambah Tamu Baru</h3>
          <div className="grid sm:grid-cols-3 gap-3">
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Nama tamu"
              required
              className="bg-netflix-black border border-netflix-gray/30 rounded-lg p-3 text-sm text-white focus:border-netflix-red focus:outline-none"
            />
            <input
              type="text"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="No. HP (opsional)"
              className="bg-netflix-black border border-netflix-gray/30 rounded-lg p-3 text-sm text-white focus:border-netflix-red focus:outline-none"
            />
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="bg-netflix-black border border-netflix-gray/30 rounded-lg p-3 text-sm text-white focus:border-netflix-red focus:outline-none"
            >
              <option value="REGULAR">Regular</option>
              <option value="VIP">VIP</option>
              <option value="VVIP">VVIP</option>
            </select>
          </div>
          <div className="flex gap-2 mt-4">
            <button type="submit" disabled={saving} className="netflix-btn text-sm">
              {saving ? 'Menyimpan...' : 'Simpan'}
            </button>
            <button
              type="button"
              onClick={() => setShowAdd(false)}
              className="px-4 py-2 text-sm text-netflix-light/50 hover:text-white transition"
            >
              Batal
            </button>
          </div>
        </form>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-2 border-netflix-red border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {/* Guest List */}
          <div className="space-y-2">
            {displayedGuests.length === 0 && (
              <p className="text-center text-netflix-light/40 text-sm py-8">
                {search ? 'Tidak ada tamu yang cocok dengan pencarian.' : 'Tidak ada tamu.'}
              </p>
            )}
            {displayedGuests.map((guest) => (
              <div key={guest.id} className="bg-netflix-dark rounded-lg p-4 border border-netflix-gray/20 hover:border-netflix-gray/40 transition">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-sm truncate">{guest.name}</p>
                      <span className={categoryBadge(guest.category)}>{guest.category}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-netflix-light/40">
                      {guest.phone && <span>{guest.phone}</span>}
                      <span className={
                        guest.rsvp_status === 'attending' ? 'text-green-400' :
                        guest.rsvp_status === 'not_attending' ? 'text-red-400' :
                        'text-yellow-400'
                      }>
                        {guest.rsvp_status === 'attending' ? '✓ Hadir' :
                         guest.rsvp_status === 'not_attending' ? '✗ Tidak Hadir' : '⏳ Pending'}
                        {guest.rsvp_status === 'attending' && guest.number_of_guests > 1 && ` (${guest.number_of_guests} orang)`}
                      </span>
                      {guest.has_scanned && <span className="text-blue-400">📱 Scanned</span>}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-1 flex-shrink-0">
                    <button
                      onClick={() => copyInvitation(guest)}
                      className="text-[10px] sm:text-xs bg-netflix-red/10 text-netflix-red px-2 py-1 rounded hover:bg-netflix-red/20 transition"
                      title="Copy pesan undangan lengkap"
                    >
                      {copiedId === guest.id ? '✓ Tersalin' : 'Copy Pesan'}
                    </button>
                    <button
                      onClick={() => copyLinkOnly(guest)}
                      className="text-[10px] sm:text-xs bg-blue-500/10 text-blue-400 px-2 py-1 rounded hover:bg-blue-500/20 transition"
                      title="Copy link saja"
                    >
                      {copiedId === guest.id + '-link' ? '✓' : 'Link'}
                    </button>
                    <button
                      onClick={() => deleteGuest(guest.id)}
                      className="text-[10px] sm:text-xs bg-red-500/10 text-red-400 px-2 py-1 rounded hover:bg-red-500/20 transition"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 mt-6 pt-4 border-t border-netflix-gray/20">
              <button
                onClick={() => goToPage(page - 1)}
                disabled={page <= 1}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  page <= 1
                    ? 'bg-netflix-dark text-netflix-light/20 cursor-not-allowed'
                    : 'bg-netflix-dark text-white hover:bg-netflix-gray/30'
                }`}
              >
                <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Sebelumnya
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(p => {
                    // Show first, last, and pages around current
                    if (p === 1 || p === totalPages) return true
                    if (Math.abs(p - page) <= 1) return true
                    return false
                  })
                  .reduce<(number | 'ellipsis')[]>((acc, p, idx, arr) => {
                    // Add ellipsis between gaps
                    if (idx > 0 && p - (arr[idx - 1] as number) > 1) {
                      acc.push('ellipsis')
                    }
                    acc.push(p)
                    return acc
                  }, [])
                  .map((p, idx) =>
                    p === 'ellipsis' ? (
                      <span key={`ellipsis-${idx}`} className="px-2 text-netflix-light/30 text-sm">...</span>
                    ) : (
                      <button
                        key={p}
                        onClick={() => goToPage(p)}
                        className={`w-9 h-9 rounded-lg text-sm font-medium transition ${
                          page === p
                            ? 'bg-netflix-red text-white'
                            : 'bg-netflix-dark text-netflix-light/50 hover:text-white hover:bg-netflix-gray/30'
                        }`}
                      >
                        {p}
                      </button>
                    )
                  )}
              </div>

              <button
                onClick={() => goToPage(page + 1)}
                disabled={page >= totalPages}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  page >= totalPages
                    ? 'bg-netflix-dark text-netflix-light/20 cursor-not-allowed'
                    : 'bg-netflix-dark text-white hover:bg-netflix-gray/30'
                }`}
              >
                Selanjutnya
                <svg className="w-4 h-4 inline ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}

          {/* Info text */}
          {totalGuests > 0 && (
            <p className="text-center text-xs text-netflix-light/20 mt-3">
              Menampilkan halaman {page} dari {totalPages} (total {totalGuests} tamu)
            </p>
          )}
        </>
      )}
    </div>
  )
}
