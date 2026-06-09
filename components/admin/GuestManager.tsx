'use client'

import { useState, useEffect, useCallback, useReducer } from 'react'
import type { Guest } from '@/types'

interface GuestsResponse {
  guests: Guest[]
  total: number
  page: number
  limit: number
  totalPages: number
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

function categoryBadge(cat: string) {
  const colors: Record<string, string> = {
    VVIP: 'bg-yellow-600',
    VIP: 'bg-purple-600',
    REGULAR: 'bg-netflix-gray',
  }
  return `${colors[cat] || colors.REGULAR} text-white text-[10px] px-2 py-0.5 rounded font-bold`
}

interface GuestState {
  guests: Guest[]
  loading: boolean
  page: number
  totalPages: number
  totalGuests: number
  search: string
  filter: string
  showAdd: boolean
  form: { name: string; phone: string; category: string }
  saving: boolean
  copiedId: string | null
}

type GuestAction =
  | { type: 'SET_GUESTS'; guests: Guest[]; totalPages: number; totalGuests: number }
  | { type: 'SET_LOADING'; loading: boolean }
  | { type: 'SET_PAGE'; page: number }
  | { type: 'SET_SEARCH'; search: string }
  | { type: 'SET_FILTER'; filter: string }
  | { type: 'SET_SHOW_ADD'; showAdd: boolean }
  | { type: 'SET_FORM'; form: Partial<GuestState['form']> }
  | { type: 'SET_SAVING'; saving: boolean }
  | { type: 'SET_COPIED_ID'; copiedId: string | null }
  | { type: 'RESET_FORM' }

const initialState: GuestState = {
  guests: [],
  loading: true,
  page: 1,
  totalPages: 1,
  totalGuests: 0,
  search: '',
  filter: 'all',
  showAdd: false,
  form: { name: '', phone: '', category: 'REGULAR' },
  saving: false,
  copiedId: null,
}

function guestReducer(state: GuestState, action: GuestAction): GuestState {
  switch (action.type) {
    case 'SET_GUESTS':
      return { ...state, guests: action.guests, totalPages: action.totalPages, totalGuests: action.totalGuests }
    case 'SET_LOADING':
      return { ...state, loading: action.loading }
    case 'SET_PAGE':
      return { ...state, page: action.page }
    case 'SET_SEARCH':
      return { ...state, search: action.search, page: 1 }
    case 'SET_FILTER':
      return { ...state, filter: action.filter }
    case 'SET_SHOW_ADD':
      return { ...state, showAdd: action.showAdd }
    case 'SET_FORM':
      return { ...state, form: { ...state.form, ...action.form } }
    case 'SET_SAVING':
      return { ...state, saving: action.saving }
    case 'SET_COPIED_ID':
      return { ...state, copiedId: action.copiedId }
    case 'RESET_FORM':
      return { ...state, form: initialState.form, showAdd: false }
    default:
      return state
  }
}

const LIMIT = 15

function GuestSearchBar({ search, onSearch }: { search: string; onSearch: (v: string) => void }) {
  return (
    <div className="relative flex-1">
      <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-netflix-light/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <input aria-label="Search guests"
        type="text"
        value={search}
        onChange={(e) => onSearch(e.target.value)}
        placeholder="Cari tamu berdasarkan nama atau no. HP..."
        className="w-full bg-netflix-dark border border-netflix-gray/30 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-netflix-light/30 focus:border-netflix-red focus:outline-none transition"
      />
      {search && (
        <button type="button" aria-label="Clear search" onClick={() => onSearch('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-netflix-light/30 hover:text-white transition">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  )
}

const guestFilters = [
  { id: 'all', label: 'Semua' },
  { id: 'attending', label: 'Hadir' },
  { id: 'not_attending', label: 'Tidak Hadir' },
  { id: 'pending', label: 'Pending' },
]

function GuestFilterBar({ filter, onFilter }: { filter: string; onFilter: (f: string) => void }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {guestFilters.map(f => (
        <button type="button" key={f.id} onClick={() => onFilter(f.id)}
          className={`px-3 py-1.5 rounded text-xs whitespace-nowrap transition ${
            filter === f.id ? 'bg-netflix-red text-white' : 'bg-netflix-dark text-netflix-light/50 hover:text-white'
          }`}>
          {f.label}
        </button>
      ))}
    </div>
  )
}

function GuestCard({ guest, copiedId, onCopyInvitation, onCopyLink, onDelete }: {
  guest: Guest; copiedId: string | null;
  onCopyInvitation: (g: Guest) => void; onCopyLink: (g: Guest) => void; onDelete: (id: string) => void
}) {
  return (
    <div className="bg-netflix-dark rounded-lg p-4 border border-netflix-gray/20 hover:border-netflix-gray/40 transition">
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
              guest.rsvp_status === 'not_attending' ? 'text-red-400' : 'text-yellow-400'
            }>
              {guest.rsvp_status === 'attending' ? '✓ Hadir' :
               guest.rsvp_status === 'not_attending' ? '✗ Tidak Hadir' : '⏳ Pending'}
              {guest.rsvp_status === 'attending' && guest.number_of_guests > 1 && ` (${guest.number_of_guests} orang)`}
            </span>
            {guest.has_scanned && <span className="text-blue-400">📱 Scanned</span>}
          </div>
        </div>
        <div className="flex gap-1 flex-shrink-0">
          <button type="button" onClick={() => onCopyInvitation(guest)}
            className="text-[10px] sm:text-xs bg-netflix-red/10 text-netflix-red px-2 py-1 rounded hover:bg-netflix-red/20 transition"
            title="Copy pesan undangan lengkap">
            {copiedId === guest.id ? '✓ Tersalin' : 'Copy Pesan'}
          </button>
          <button type="button" onClick={() => onCopyLink(guest)}
            className="text-[10px] sm:text-xs bg-blue-500/10 text-blue-400 px-2 py-1 rounded hover:bg-blue-500/20 transition"
            title="Copy link saja">
            {copiedId === guest.id + '-link' ? '✓' : 'Link'}
          </button>
          <button type="button" onClick={() => onDelete(guest.id)}
            className="text-[10px] sm:text-xs bg-red-500/10 text-red-400 px-2 py-1 rounded hover:bg-red-500/20 transition">
            Hapus
          </button>
        </div>
      </div>
    </div>
  )
}

function GuestPagination({ page, totalPages, onGoToPage }: { page: number; totalPages: number; onGoToPage: (p: number) => void }) {
  if (totalPages <= 1) return null
  return (
    <div className="flex items-center justify-center gap-3 mt-6 pt-4 border-t border-netflix-gray/20">
      <button type="button" onClick={() => onGoToPage(page - 1)} disabled={page <= 1}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition ${page <= 1 ? 'bg-netflix-dark text-netflix-light/20 cursor-not-allowed' : 'bg-netflix-dark text-white hover:bg-netflix-gray/30'}`}>
        <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        Sebelumnya
      </button>
      <div className="flex items-center gap-1">
        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
          .reduce<(number | 'ellipsis')[]>((acc, p, idx, arr) => {
            if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push('ellipsis')
            acc.push(p)
            return acc
          }, [])
          .map((p, idx) => p === 'ellipsis' ? (
            <span key={`e-${idx}`} className="px-2 text-netflix-light/30 text-sm">...</span>
          ) : (
            <button type="button" key={p} onClick={() => onGoToPage(p)}
              className={`w-9 h-9 rounded-lg text-sm font-medium transition ${page === p ? 'bg-netflix-red text-white' : 'bg-netflix-dark text-netflix-light/50 hover:text-white hover:bg-netflix-gray/30'}`}>
              {p}
            </button>
          ))}
      </div>
      <button type="button" onClick={() => onGoToPage(page + 1)} disabled={page >= totalPages}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition ${page >= totalPages ? 'bg-netflix-dark text-netflix-light/20 cursor-not-allowed' : 'bg-netflix-dark text-white hover:bg-netflix-gray/30'}`}>
        Selanjutnya
        <svg className="w-4 h-4 inline ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
      </button>
    </div>
  )
}

export function GuestManager() {
  const [state, dispatch] = useReducer(guestReducer, initialState)

  const fetchGuests = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', loading: true })
    try {
      const params = new URLSearchParams()
      params.set('page', String(state.page))
      params.set('limit', String(LIMIT))
      if (state.search) params.set('search', state.search)
      const res = await fetch(`/api/guests?${params.toString()}`)
      const data: GuestsResponse = await res.json()
      dispatch({ type: 'SET_GUESTS', guests: data.guests || [], totalPages: data.totalPages || 1, totalGuests: data.total || 0 })
    } catch {
      dispatch({ type: 'SET_GUESTS', guests: [], totalPages: 1, totalGuests: 0 })
    } finally {
      dispatch({ type: 'SET_LOADING', loading: false })
    }
  }, [state.page, state.search])

  useEffect(() => { fetchGuests() }, [fetchGuests])

  async function addGuest(e: React.FormEvent) {
    e.preventDefault()
    dispatch({ type: 'SET_SAVING', saving: true })
    const res = await fetch('/api/guests', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(state.form) })
    if (res.ok) {
      dispatch({ type: 'RESET_FORM' })
      dispatch({ type: 'SET_PAGE', page: 1 })
      fetchGuests()
    }
    dispatch({ type: 'SET_SAVING', saving: false })
  }

  async function deleteGuest(id: string) {
    if (!confirm('Hapus tamu ini?')) return
    await fetch(`/api/guests/${id}`, { method: 'DELETE' })
    if (displayedGuests.length <= 1 && state.page > 1) {
      dispatch({ type: 'SET_PAGE', page: state.page - 1 })
    } else {
      fetchGuests()
    }
  }

  function copyInvitation(guest: Guest) {
    navigator.clipboard.writeText(generateInvitationMessage(guest))
    dispatch({ type: 'SET_COPIED_ID', copiedId: guest.id })
    setTimeout(() => dispatch({ type: 'SET_COPIED_ID', copiedId: null }), 2000)
  }

  function copyLinkOnly(guest: Guest) {
    navigator.clipboard.writeText(`${window.location.origin}/invitation/${guest.invitation_code}`)
    dispatch({ type: 'SET_COPIED_ID', copiedId: guest.id + '-link' })
    setTimeout(() => dispatch({ type: 'SET_COPIED_ID', copiedId: null }), 2000)
  }

  const displayedGuests = (state.filter === 'all'
    ? state.guests
    : state.guests.filter(g => g.rsvp_status === state.filter)
  ).sort((a, b) => a.name.localeCompare(b.name))

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <h2 className="text-xl font-bold">Daftar Tamu ({state.totalGuests})</h2>
        <button type="button" onClick={() => dispatch({ type: 'SET_SHOW_ADD', showAdd: true })} className="netflix-btn text-sm">+ Tambah Tamu</button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <GuestSearchBar search={state.search} onSearch={(v) => { dispatch({ type: 'SET_SEARCH', search: v }) }} />
        <GuestFilterBar filter={state.filter} onFilter={(f) => dispatch({ type: 'SET_FILTER', filter: f })} />
      </div>

      {state.showAdd && (
        <form onSubmit={addGuest} className="bg-netflix-dark rounded-xl p-5 mb-6 border border-netflix-gray/20">
          <h3 className="font-bold mb-4 text-sm">Tambah Tamu Baru</h3>
          <div className="grid sm:grid-cols-3 gap-3">
            <input aria-label="Guest name" type="text" value={state.form.name} onChange={(e) => dispatch({ type: 'SET_FORM', form: { name: e.target.value } })} placeholder="Nama tamu" required className="bg-netflix-black border border-netflix-gray/30 rounded-lg p-3 text-sm text-white focus:border-netflix-red focus:outline-none" />
            <input aria-label="Guest phone" type="text" value={state.form.phone} onChange={(e) => dispatch({ type: 'SET_FORM', form: { phone: e.target.value } })} placeholder="No. HP (opsional)" className="bg-netflix-black border border-netflix-gray/30 rounded-lg p-3 text-sm text-white focus:border-netflix-red focus:outline-none" />
            <select aria-label="Category" value={state.form.category} onChange={(e) => dispatch({ type: 'SET_FORM', form: { category: e.target.value } })} className="bg-netflix-black border border-netflix-gray/30 rounded-lg p-3 text-sm text-white focus:border-netflix-red focus:outline-none">
              <option value="REGULAR">Regular</option><option value="VIP">VIP</option><option value="VVIP">VVIP</option>
            </select>
          </div>
          <div className="flex gap-2 mt-4">
            <button type="submit" disabled={state.saving} className="netflix-btn text-sm">{state.saving ? 'Menyimpan...' : 'Simpan'}</button>
            <button type="button" onClick={() => dispatch({ type: 'SET_SHOW_ADD', showAdd: false })} className="px-4 py-2 text-sm text-netflix-light/50 hover:text-white transition">Batal</button>
          </div>
        </form>
      )}

      {state.loading ? (
        <div className="flex justify-center py-12"><div className="w-8 h-8 border-2 border-netflix-red border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <>
          <div className="space-y-2">
            {displayedGuests.length === 0 && <p className="text-center text-netflix-light/40 text-sm py-8">{state.search ? 'Tidak ada tamu yang cocok dengan pencarian.' : 'Tidak ada tamu.'}</p>}
            {displayedGuests.map((guest) => (
              <GuestCard key={guest.id} guest={guest} copiedId={state.copiedId} onCopyInvitation={copyInvitation} onCopyLink={copyLinkOnly} onDelete={deleteGuest} />
            ))}
          </div>
          <GuestPagination page={state.page} totalPages={state.totalPages} onGoToPage={(p) => dispatch({ type: 'SET_PAGE', page: p })} />
          {state.totalGuests > 0 && <p className="text-center text-xs text-netflix-light/20 mt-3">Menampilkan halaman {state.page} dari {state.totalPages} (total {state.totalGuests} tamu)</p>}
        </>
      )}
    </div>
  )
}
