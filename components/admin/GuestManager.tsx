'use client'

import { useState, useEffect } from 'react'
import type { Guest } from '@/types'

export function GuestManager() {
  const [guests, setGuests] = useState<Guest[]>([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({ name: '', phone: '', category: 'REGULAR' })
  const [saving, setSaving] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [filter, setFilter] = useState<string>('all')

  useEffect(() => {
    fetchGuests()
  }, [])

  async function fetchGuests() {
    try {
      const res = await fetch('/api/guests')
      const data = await res.json()
      setGuests(Array.isArray(data) ? data : [])
    } catch {
      setGuests([])
    } finally {
      setLoading(false)
    }
  }

  async function addGuest(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)

    const res = await fetch('/api/guests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    if (res.ok) {
      const newGuest = await res.json()
      setGuests([newGuest, ...guests])
      setForm({ name: '', phone: '', category: 'REGULAR' })
      setShowAdd(false)
    }
    setSaving(false)
  }

  async function deleteGuest(id: string) {
    if (!confirm('Hapus tamu ini?')) return
    await fetch(`/api/guests/${id}`, { method: 'DELETE' })
    setGuests(guests.filter((g) => g.id !== id))
  }

  function generateInvitationMessage(guest: Guest) {
    const baseUrl = window.location.origin
    const guestNameForUrl = encodeURIComponent(guest.name)
    const invitationLink = `${baseUrl}/invitation/${guest.invitation_code}?to=${guestNameForUrl}`

    return `Kepada Yth.
Bapak/Ibu/Saudara/i
*${guest.name}*
______________

Tanpa mengurangi rasa hormat, perkenankan kami mengundang Bapak/Ibu/Saudara/i, teman sekaligus sahabat, untuk menghadiri acara pernikahan kami.

Berikut link undangan kami, untuk info lengkap dari acara, bisa kunjungi:

${invitationLink}

Hasil maksimal buka lewat browser chrome/safari.

Merupakan suatu kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan untuk hadir dan memberikan doa restu.

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

  const filteredGuests = (filter === 'all'
    ? guests
    : guests.filter(g => g.rsvp_status === filter)
  ).sort((a, b) => a.name.localeCompare(b.name))

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-8 h-8 border-2 border-netflix-red border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <h2 className="text-xl font-bold">Daftar Tamu ({guests.length})</h2>
        <button onClick={() => setShowAdd(true)} className="netflix-btn text-sm">
          + Tambah Tamu
        </button>
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
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

      {/* Guest List */}
      <div className="space-y-2">
        {filteredGuests.length === 0 && (
          <p className="text-center text-netflix-light/40 text-sm py-8">Tidak ada tamu.</p>
        )}
        {filteredGuests.map((guest) => (
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
    </div>
  )
}
