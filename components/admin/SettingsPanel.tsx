'use client'

import { useState, useEffect, useRef } from 'react'
import type { Settings, Event, GiftAccount, GalleryImage, LoveStory } from '@/types'

type Tab = 'mempelai' | 'acara' | 'lovestory' | 'gallery' | 'amplop' | 'media'

const inputClass = 'w-full bg-netflix-black border border-netflix-gray/30 rounded-lg p-3 text-sm text-white focus:border-netflix-red focus:outline-none transition'

export function SettingsPanel() {
  const [activeTab, setActiveTab] = useState<Tab>('mempelai')
  const [settings, setSettings] = useState<Settings | null>(null)
  const [events, setEvents] = useState<Event[]>([])
  const [giftAccounts, setGiftAccounts] = useState<GiftAccount[]>([])
  const [gallery, setGallery] = useState<GalleryImage[]>([])
  const [loveStories, setLoveStories] = useState<LoveStory[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  const galleryInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const [settingsRes, eventsRes, giftRes, galleryRes, loveRes] = await Promise.all([
          fetch('/api/settings'),
          fetch('/api/events'),
          fetch('/api/gift-accounts'),
          fetch('/api/gallery'),
          fetch('/api/love-stories'),
        ])
        const settingsData = await settingsRes.json()
        const eventsData = await eventsRes.json()
        const giftData = await giftRes.json()
        const galleryData = await galleryRes.json()
        const loveData = await loveRes.json()

        if (settingsRes.ok) setSettings(settingsData)
        if (eventsRes.ok) setEvents(eventsData)
        if (giftRes.ok) setGiftAccounts(giftData)
        if (galleryRes.ok) setGallery(galleryData)
        if (loveRes.ok) setLoveStories(loveData)
      } catch {
        setMessage('Error memuat data')
        setTimeout(() => setMessage(''), 5000)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  async function uploadFile(file: File): Promise<string | null> {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('folder', 'wedding')
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      const data = await res.json()
      if (res.ok && data.url) return data.url
      setMessage(data.error || 'Upload gagal')
      setTimeout(() => setMessage(''), 5000)
      return null
    } catch {
      setMessage('Upload gagal')
      setTimeout(() => setMessage(''), 5000)
      return null
    }
  }

  function handlePhotoUpload(callback: (url: string) => void) {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = async (e) => {
      const target = e.target as HTMLInputElement
      const file = target.files?.[0]
      if (!file) return
      setSaving(true)
      const url = await uploadFile(file)
      if (url) callback(url)
      setSaving(false)
    }
    input.click()
  }

  async function saveSettings() {
    if (!settings) return
    setSaving(true)
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })
      if (res.ok) {
        setMessage('Berhasil disimpan')
      } else {
        setMessage('Error menyimpan data')
      }
    } catch {
      setMessage('Error menyimpan data')
    } finally {
      setSaving(false)
      setTimeout(() => setMessage(''), 5000)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-white">Memuat...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {message && (
        <div
          className={`p-4 rounded-lg text-sm font-medium ${
            message.includes('gagal') || message.includes('Error')
              ? 'bg-red-500/20 text-red-400'
              : 'bg-green-500/20 text-green-400'
          }`}
        >
          {message}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {([
          ['mempelai', 'Mempelai'],
          ['acara', 'Acara'],
          ['lovestory', 'Love Story'],
          ['gallery', 'Gallery'],
          ['amplop', 'Amplop'],
          ['media', 'Media'],
        ] as [Tab, string][]).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              activeTab === key
                ? 'bg-netflix-red text-white'
                : 'bg-netflix-dark text-gray-400 hover:text-white'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {activeTab === 'mempelai' && settings && <MempelaiTab settings={settings} setSettings={setSettings} saving={saving} onSave={saveSettings} onPhotoUpload={handlePhotoUpload} />}
      {activeTab === 'acara' && <AcaraTab events={events} setEvents={setEvents} setMessage={setMessage} uploadFile={uploadFile} />}
      {activeTab === 'lovestory' && <LoveStoryTab loveStories={loveStories} setLoveStories={setLoveStories} setMessage={setMessage} uploadFile={uploadFile} />}
      {activeTab === 'gallery' && <GalleryTab gallery={gallery} setGallery={setGallery} setMessage={setMessage} uploadFile={uploadFile} galleryInputRef={galleryInputRef} />}
      {activeTab === 'amplop' && <AmplopTab giftAccounts={giftAccounts} setGiftAccounts={setGiftAccounts} setMessage={setMessage} />}
      {activeTab === 'media' && settings && <MediaTab settings={settings} setSettings={setSettings} saving={saving} onSave={saveSettings} />}
    </div>
  )
}


// ==================== MEMPELAI TAB ====================

function MempelaiTab({
  settings,
  setSettings,
  saving,
  onSave,
  onPhotoUpload,
}: {
  settings: Settings
  setSettings: React.Dispatch<React.SetStateAction<Settings | null>>
  saving: boolean
  onSave: () => void
  onPhotoUpload: (callback: (url: string) => void) => void
}) {
  function update(field: keyof Settings, value: string) {
    setSettings((prev) => (prev ? { ...prev, [field]: value } : prev))
  }

  return (
    <div className="bg-netflix-dark rounded-xl p-6 space-y-6">
      <h3 className="text-lg font-semibold text-white">Data Mempelai</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-300">Mempelai Pria</h4>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Nama Panggilan</label>
            <input className={inputClass} value={settings.groom_name} onChange={(e) => update('groom_name', e.target.value)} />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Nama Lengkap</label>
            <input className={inputClass} value={settings.groom_full_name} onChange={(e) => update('groom_full_name', e.target.value)} />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Nama Ayah</label>
            <input className={inputClass} value={settings.groom_father} onChange={(e) => update('groom_father', e.target.value)} />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Nama Ibu</label>
            <input className={inputClass} value={settings.groom_mother} onChange={(e) => update('groom_mother', e.target.value)} />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Foto Mempelai Pria</label>
            {settings.groom_photo && (
              <img src={settings.groom_photo} alt="Groom" className="w-24 h-24 rounded-lg object-cover mb-2" />
            )}
            <button
              type="button"
              onClick={() => onPhotoUpload((url) => update('groom_photo', url))}
              className="bg-netflix-red text-white text-sm px-4 py-2 rounded-lg hover:bg-red-700 transition"
            >
              Upload Foto
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-300">Mempelai Wanita</h4>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Nama Panggilan</label>
            <input className={inputClass} value={settings.bride_name} onChange={(e) => update('bride_name', e.target.value)} />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Nama Lengkap</label>
            <input className={inputClass} value={settings.bride_full_name} onChange={(e) => update('bride_full_name', e.target.value)} />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Nama Ayah</label>
            <input className={inputClass} value={settings.bride_father} onChange={(e) => update('bride_father', e.target.value)} />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Nama Ibu</label>
            <input className={inputClass} value={settings.bride_mother} onChange={(e) => update('bride_mother', e.target.value)} />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Foto Mempelai Wanita</label>
            {settings.bride_photo && (
              <img src={settings.bride_photo} alt="Bride" className="w-24 h-24 rounded-lg object-cover mb-2" />
            )}
            <button
              type="button"
              onClick={() => onPhotoUpload((url) => update('bride_photo', url))}
              className="bg-netflix-red text-white text-sm px-4 py-2 rounded-lg hover:bg-red-700 transition"
            >
              Upload Foto
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs text-gray-400 mb-1">Hashtag</label>
          <input className={inputClass} value={settings.hashtag} onChange={(e) => update('hashtag', e.target.value)} />
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1">Tanggal Pernikahan</label>
          <input type="datetime-local" className={inputClass} value={settings.wedding_date ? settings.wedding_date.slice(0, 16) : ''} onChange={(e) => update('wedding_date', e.target.value)} />
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1">Teks Pembuka</label>
          <textarea className={inputClass} rows={4} value={settings.opening_text} onChange={(e) => update('opening_text', e.target.value)} />
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1">Hero Image</label>
          {settings.hero_image && (
            <img src={settings.hero_image} alt="Hero" className="w-full max-w-xs h-40 rounded-lg object-cover mb-2" />
          )}
          <button
            type="button"
            onClick={() => onPhotoUpload((url) => update('hero_image', url))}
            className="bg-netflix-red text-white text-sm px-4 py-2 rounded-lg hover:bg-red-700 transition"
          >
            Upload Hero Image
          </button>
        </div>
      </div>

      <button
        onClick={onSave}
        disabled={saving}
        className="bg-netflix-red text-white px-6 py-3 rounded-lg hover:bg-red-700 transition disabled:opacity-50"
      >
        {saving ? 'Menyimpan...' : 'Simpan'}
      </button>
    </div>
  )
}


// ==================== ACARA TAB ====================

function AcaraTab({
  events,
  setEvents,
  setMessage,
  uploadFile,
}: {
  events: Event[]
  setEvents: React.Dispatch<React.SetStateAction<Event[]>>
  setMessage: React.Dispatch<React.SetStateAction<string>>
  uploadFile: (file: File) => Promise<string | null>
}) {
  const [editing, setEditing] = useState<Event | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    title: '',
    date: '',
    time_start: '',
    time_end: '',
    timezone: 'WIB',
    location: '',
    address: '',
    map_url: '',
    image_url: '',
  })

  function resetForm() {
    setForm({ title: '', date: '', time_start: '', time_end: '', timezone: 'WIB', location: '', address: '', map_url: '', image_url: '' })
    setEditing(null)
    setShowForm(false)
  }

  function startEdit(event: Event) {
    setEditing(event)
    setShowForm(true)
    setForm({
      title: event.title,
      date: event.date,
      time_start: event.time_start?.slice(0, 5) || '',
      time_end: event.time_end?.slice(0, 5) || '',
      timezone: event.timezone || 'WIB',
      location: event.location,
      address: event.address,
      map_url: event.map_url || '',
      image_url: event.image_url || '',
    })
  }

  function handleImageUpload() {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = async (e) => {
      const target = e.target as HTMLInputElement
      const file = target.files?.[0]
      if (!file) return
      const url = await uploadFile(file)
      if (url) setForm((prev) => ({ ...prev, image_url: url }))
    }
    input.click()
  }

  async function handleSubmit() {
    if (!form.title || !form.date || !form.location) {
      setMessage('Error: Judul, tanggal, dan lokasi wajib diisi')
      setTimeout(() => setMessage(''), 5000)
      return
    }

    try {
      if (editing) {
        const res = await fetch(`/api/events/${editing.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        })
        if (res.ok) {
          const updated = await res.json()
          setEvents((prev) => prev.map((ev) => (ev.id === editing.id ? updated : ev)))
          setMessage('Acara berhasil diperbarui')
          resetForm()
        } else {
          setMessage('Error memperbarui acara')
        }
      } else {
        const res = await fetch('/api/events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        })
        if (res.ok) {
          const created = await res.json()
          setEvents((prev) => [...prev, created])
          setMessage('Acara berhasil ditambahkan')
          resetForm()
        } else {
          setMessage('Error menambahkan acara')
        }
      }
    } catch {
      setMessage('Error menyimpan acara')
    }
    setTimeout(() => setMessage(''), 5000)
  }

  async function handleDelete(id: string) {
    try {
      const res = await fetch(`/api/events/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setEvents((prev) => prev.filter((ev) => ev.id !== id))
        setMessage('Acara berhasil dihapus')
      } else {
        setMessage('Error menghapus acara')
      }
    } catch {
      setMessage('Error menghapus acara')
    }
    setTimeout(() => setMessage(''), 5000)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Daftar Acara</h3>
        {!showForm && (
          <button onClick={() => { resetForm(); setShowForm(true) }} className="bg-netflix-red text-white text-sm px-4 py-2 rounded-lg hover:bg-red-700 transition">
            + Tambah Acara
          </button>
        )}
      </div>

      {showForm && (
        <div className="bg-netflix-dark rounded-xl p-6 space-y-4">
          <h3 className="text-lg font-semibold text-white">{editing ? 'Edit Acara' : 'Tambah Acara'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Judul</label>
              <input className={inputClass} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Tanggal</label>
              <input type="date" className={inputClass} value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Waktu Mulai</label>
              <input type="time" className={inputClass} value={form.time_start} onChange={(e) => setForm({ ...form, time_start: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Waktu Selesai</label>
              <input type="time" className={inputClass} value={form.time_end} onChange={(e) => setForm({ ...form, time_end: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Zona Waktu</label>
              <select className={inputClass} value={form.timezone} onChange={(e) => setForm({ ...form, timezone: e.target.value })}>
                <option value="WIB">WIB</option>
                <option value="WITA">WITA</option>
                <option value="WIT">WIT</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Lokasi</label>
              <input className={inputClass} value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs text-gray-400 mb-1">Alamat</label>
              <input className={inputClass} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs text-gray-400 mb-1">URL Peta</label>
              <input className={inputClass} value={form.map_url} onChange={(e) => setForm({ ...form, map_url: e.target.value })} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs text-gray-400 mb-1">Gambar</label>
              {form.image_url && (
                <img src={form.image_url} alt="Event" className="w-32 h-20 rounded-lg object-cover mb-2" />
              )}
              <button type="button" onClick={handleImageUpload} className="bg-netflix-red text-white text-sm px-4 py-2 rounded-lg hover:bg-red-700 transition">
                Upload Gambar
              </button>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={handleSubmit} className="bg-netflix-red text-white px-6 py-2 rounded-lg hover:bg-red-700 transition">
              {editing ? 'Perbarui' : 'Tambah'}
            </button>
            <button onClick={resetForm} className="bg-gray-700 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition">
              Batal
            </button>
          </div>
        </div>
      )}

      {/* Event Cards */}
      <div className="space-y-4">
        {events.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-8">Belum ada acara</p>
        ) : (
          events.map((event) => (
            <div key={event.id} className="bg-netflix-dark rounded-xl p-4 border border-netflix-gray/20 hover:border-netflix-red/20 transition">
              <div className="flex gap-4">
                {event.image_url && (
                  <img src={event.image_url} alt={event.title} className="w-20 h-20 rounded-lg object-cover flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-netflix-red text-white text-[10px] font-bold px-2 py-0.5 rounded">{event.title}</span>
                    <span className="text-gray-500 text-xs">{event.timezone}</span>
                  </div>
                  <p className="text-white font-medium text-sm">{event.date} | {event.time_start?.slice(0,5)} - {event.time_end?.slice(0,5)}</p>
                  <p className="text-gray-400 text-xs mt-1 truncate">{event.location}{event.address ? ` - ${event.address}` : ''}</p>
                </div>
                <div className="flex flex-col gap-1 flex-shrink-0">
                  <button onClick={() => startEdit(event)} className="text-blue-400 text-xs hover:underline">Edit</button>
                  <button onClick={() => handleDelete(event.id)} className="text-red-400 text-xs hover:underline">Hapus</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}


// ==================== LOVE STORY TAB ====================

function LoveStoryTab({
  loveStories,
  setLoveStories,
  setMessage,
  uploadFile,
}: {
  loveStories: LoveStory[]
  setLoveStories: React.Dispatch<React.SetStateAction<LoveStory[]>>
  setMessage: React.Dispatch<React.SetStateAction<string>>
  uploadFile: (file: File) => Promise<string | null>
}) {
  const [editing, setEditing] = useState<LoveStory | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    title: '',
    date: '',
    description: '',
    image_url: '',
  })

  function resetForm() {
    setForm({ title: '', date: '', description: '', image_url: '' })
    setEditing(null)
    setShowForm(false)
  }

  function startEdit(story: LoveStory) {
    setEditing(story)
    setShowForm(true)
    setForm({
      title: story.title,
      date: story.date,
      description: story.description,
      image_url: story.image_url || '',
    })
  }

  function handleImageUpload() {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = async (e) => {
      const target = e.target as HTMLInputElement
      const file = target.files?.[0]
      if (!file) return
      const url = await uploadFile(file)
      if (url) setForm((prev) => ({ ...prev, image_url: url }))
    }
    input.click()
  }

  async function handleSubmit() {
    if (!form.title || !form.date || !form.description) {
      setMessage('Error: Judul, tanggal, dan deskripsi wajib diisi')
      setTimeout(() => setMessage(''), 5000)
      return
    }

    try {
      if (editing) {
        const res = await fetch(`/api/love-stories/${editing.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        })
        if (res.ok) {
          const updated = await res.json()
          setLoveStories((prev) => prev.map((s) => (s.id === editing.id ? updated : s)))
          setMessage('Love story berhasil diperbarui')
          resetForm()
        } else {
          setMessage('Error memperbarui love story')
        }
      } else {
        const res = await fetch('/api/love-stories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        })
        if (res.ok) {
          const created = await res.json()
          setLoveStories((prev) => [...prev, created])
          setMessage('Love story berhasil ditambahkan')
          resetForm()
        } else {
          setMessage('Error menambahkan love story')
        }
      }
    } catch {
      setMessage('Error menyimpan love story')
    }
    setTimeout(() => setMessage(''), 5000)
  }

  async function handleDelete(id: string) {
    try {
      const res = await fetch(`/api/love-stories/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setLoveStories((prev) => prev.filter((s) => s.id !== id))
        setMessage('Love story berhasil dihapus')
      } else {
        setMessage('Error menghapus love story')
      }
    } catch {
      setMessage('Error menghapus love story')
    }
    setTimeout(() => setMessage(''), 5000)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Love Story</h3>
        {!showForm && (
          <button onClick={() => { resetForm(); setShowForm(true) }} className="bg-netflix-red text-white text-sm px-4 py-2 rounded-lg hover:bg-red-700 transition">
            + Tambah Story
          </button>
        )}
      </div>

      {showForm && (
        <div className="bg-netflix-dark rounded-xl p-6 space-y-4">
          <h3 className="text-lg font-semibold text-white">{editing ? 'Edit Love Story' : 'Tambah Love Story'}</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Judul</label>
              <input className={inputClass} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Tanggal (contoh: Januari 2020)</label>
              <input className={inputClass} value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Deskripsi</label>
              <textarea className={inputClass} rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Gambar</label>
              {form.image_url && (
                <img src={form.image_url} alt="Love Story" className="w-32 h-20 rounded-lg object-cover mb-2" />
              )}
              <button type="button" onClick={handleImageUpload} className="bg-netflix-red text-white text-sm px-4 py-2 rounded-lg hover:bg-red-700 transition">
                Upload Gambar
              </button>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={handleSubmit} className="bg-netflix-red text-white px-6 py-2 rounded-lg hover:bg-red-700 transition">
              {editing ? 'Perbarui' : 'Tambah'}
            </button>
            <button onClick={resetForm} className="bg-gray-700 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition">
              Batal
            </button>
          </div>
        </div>
      )}

      {/* Love Story Cards */}
      <div className="space-y-4">
        {loveStories.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-8">Belum ada love story</p>
        ) : (
          loveStories.map((story, i) => (
            <div key={story.id} className="bg-netflix-dark rounded-xl p-4 border border-netflix-gray/20 hover:border-netflix-red/20 transition">
              <div className="flex gap-4">
                {story.image_url ? (
                  <img src={story.image_url} alt={story.title} className="w-20 h-20 rounded-lg object-cover flex-shrink-0" />
                ) : (
                  <div className="w-20 h-20 rounded-lg bg-netflix-gray/30 flex items-center justify-center flex-shrink-0">
                    <span className="text-netflix-red font-bold text-sm">EP {i + 1}</span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-netflix-red text-white text-[10px] font-bold px-2 py-0.5 rounded">EP {i + 1}</span>
                    <span className="text-netflix-red text-xs font-medium">{story.date}</span>
                  </div>
                  <p className="text-white font-medium text-sm">{story.title}</p>
                  <p className="text-gray-400 text-xs mt-1 line-clamp-2">{story.description}</p>
                </div>
                <div className="flex flex-col gap-1 flex-shrink-0">
                  <button onClick={() => startEdit(story)} className="text-blue-400 text-xs hover:underline">Edit</button>
                  <button onClick={() => handleDelete(story.id)} className="text-red-400 text-xs hover:underline">Hapus</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}


// ==================== GALLERY TAB ====================

function GalleryTab({
  gallery,
  setGallery,
  setMessage,
  uploadFile,
  galleryInputRef,
}: {
  gallery: GalleryImage[]
  setGallery: React.Dispatch<React.SetStateAction<GalleryImage[]>>
  setMessage: React.Dispatch<React.SetStateAction<string>>
  uploadFile: (file: File) => Promise<string | null>
  galleryInputRef: React.RefObject<HTMLInputElement | null>
}) {
  const [uploading, setUploading] = useState(false)

  async function handleGalleryUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    const uploaded: GalleryImage[] = []

    for (let i = 0; i < files.length; i++) {
      const url = await uploadFile(files[i])
      if (url) {
        try {
          const res = await fetch('/api/gallery', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ image_url: url }),
          })
          if (res.ok) {
            const created = await res.json()
            uploaded.push(created)
          }
        } catch {
          // continue with next file
        }
      }
    }

    if (uploaded.length > 0) {
      setGallery((prev) => [...prev, ...uploaded])
      setMessage(`${uploaded.length} foto berhasil diupload`)
    } else {
      setMessage('Upload gagal')
    }
    setUploading(false)
    setTimeout(() => setMessage(''), 5000)

    if (galleryInputRef.current) {
      galleryInputRef.current.value = ''
    }
  }

  async function handleDelete(id: string) {
    try {
      const res = await fetch(`/api/gallery?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        setGallery((prev) => prev.filter((img) => img.id !== id))
        setMessage('Foto berhasil dihapus')
      } else {
        setMessage('Error menghapus foto')
      }
    } catch {
      setMessage('Error menghapus foto')
    }
    setTimeout(() => setMessage(''), 5000)
  }

  return (
    <div className="space-y-6">
      <div className="bg-netflix-dark rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Upload Foto</h3>
        <input
          ref={galleryInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleGalleryUpload}
          className="hidden"
        />
        <button
          onClick={() => galleryInputRef.current?.click()}
          disabled={uploading}
          className="bg-netflix-red text-white px-6 py-3 rounded-lg hover:bg-red-700 transition disabled:opacity-50"
        >
          {uploading ? 'Mengupload...' : 'Pilih Foto'}
        </button>
      </div>

      <div className="bg-netflix-dark rounded-xl p-4">
        <h3 className="text-lg font-semibold text-white mb-4">Gallery ({gallery.length} foto)</h3>
        {gallery.length === 0 ? (
          <p className="text-gray-400 text-sm">Belum ada foto</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {gallery.map((img) => (
              <div key={img.id} className="relative group">
                <img src={img.image_url} alt="Gallery" className="w-full h-32 rounded-lg object-cover" />
                <button
                  onClick={() => handleDelete(img.id)}
                  className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition"
                >
                  Hapus
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}


// ==================== AMPLOP TAB ====================

function AmplopTab({
  giftAccounts,
  setGiftAccounts,
  setMessage,
}: {
  giftAccounts: GiftAccount[]
  setGiftAccounts: React.Dispatch<React.SetStateAction<GiftAccount[]>>
  setMessage: React.Dispatch<React.SetStateAction<string>>
}) {
  const [editing, setEditing] = useState<GiftAccount | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    type: 'bank' as 'bank' | 'ewallet',
    provider_name: '',
    account_number: '',
    account_holder: '',
  })

  function getProviderLogo(name: string, type: string) {
    const n = name.toLowerCase()
    // Return color and abbreviation for inline logo
    if (n.includes('bca')) return { color: 'bg-blue-800', text: 'BCA' }
    if (n.includes('bni')) return { color: 'bg-orange-600', text: 'BNI' }
    if (n.includes('bri')) return { color: 'bg-blue-700', text: 'BRI' }
    if (n.includes('mandiri')) return { color: 'bg-blue-900', text: 'MDR' }
    if (n.includes('bsi')) return { color: 'bg-teal-700', text: 'BSI' }
    if (n.includes('cimb')) return { color: 'bg-red-800', text: 'CIMB' }
    if (n.includes('dana')) return { color: 'bg-blue-500', text: 'DANA' }
    if (n.includes('gopay') || n.includes('go-pay')) return { color: 'bg-green-600', text: 'GP' }
    if (n.includes('ovo')) return { color: 'bg-purple-700', text: 'OVO' }
    if (n.includes('shopeepay') || n.includes('shopee')) return { color: 'bg-orange-500', text: 'SPay' }
    if (n.includes('linkaja') || n.includes('link aja')) return { color: 'bg-red-600', text: 'LA' }
    if (type === 'ewallet') return { color: 'bg-green-700', text: name.slice(0, 2).toUpperCase() }
    return { color: 'bg-gray-600', text: name.slice(0, 3).toUpperCase() }
  }

  function resetForm() {
    setForm({ type: 'bank', provider_name: '', account_number: '', account_holder: '' })
    setEditing(null)
    setShowForm(false)
  }

  function startEdit(account: GiftAccount) {
    setEditing(account)
    setShowForm(true)
    setForm({
      type: account.type,
      provider_name: account.provider_name,
      account_number: account.account_number,
      account_holder: account.account_holder,
    })
  }

  async function handleSubmit() {
    if (!form.provider_name || !form.account_number || !form.account_holder) {
      setMessage('Error: Semua field wajib diisi')
      setTimeout(() => setMessage(''), 5000)
      return
    }

    try {
      if (editing) {
        const res = await fetch(`/api/gift-accounts/${editing.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        })
        if (res.ok) {
          const updated = await res.json()
          setGiftAccounts((prev) => prev.map((a) => (a.id === editing.id ? updated : a)))
          setMessage('Rekening berhasil diperbarui')
          resetForm()
        } else {
          setMessage('Error memperbarui rekening')
        }
      } else {
        const res = await fetch('/api/gift-accounts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        })
        if (res.ok) {
          const created = await res.json()
          setGiftAccounts((prev) => [...prev, created])
          setMessage('Rekening berhasil ditambahkan')
          resetForm()
        } else {
          setMessage('Error menambahkan rekening')
        }
      }
    } catch {
      setMessage('Error menyimpan rekening')
    }
    setTimeout(() => setMessage(''), 5000)
  }

  async function handleDelete(id: string) {
    try {
      const res = await fetch(`/api/gift-accounts/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setGiftAccounts((prev) => prev.filter((a) => a.id !== id))
        setMessage('Rekening berhasil dihapus')
      } else {
        setMessage('Error menghapus rekening')
      }
    } catch {
      setMessage('Error menghapus rekening')
    }
    setTimeout(() => setMessage(''), 5000)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Amplop Digital</h3>
        {!showForm && (
          <button onClick={() => { resetForm(); setShowForm(true) }} className="bg-netflix-red text-white text-sm px-4 py-2 rounded-lg hover:bg-red-700 transition">
            + Tambah Rekening
          </button>
        )}
      </div>

      {showForm && (
        <div className="bg-netflix-dark rounded-xl p-6 space-y-4">
          <h4 className="text-md font-semibold text-white">{editing ? 'Edit Rekening' : 'Tambah Rekening Baru'}</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Tipe</label>
              <select className={inputClass} value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as 'bank' | 'ewallet' })}>
                <option value="bank">Bank</option>
                <option value="ewallet">E-Wallet</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Nama Provider</label>
              <input className={inputClass} placeholder="BCA, BNI, BSI, Dana, GoPay, dll" value={form.provider_name} onChange={(e) => setForm({ ...form, provider_name: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Nomor Rekening / Nomor HP</label>
              <input className={inputClass} value={form.account_number} onChange={(e) => setForm({ ...form, account_number: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Atas Nama</label>
              <input className={inputClass} value={form.account_holder} onChange={(e) => setForm({ ...form, account_holder: e.target.value })} />
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={handleSubmit} className="bg-netflix-red text-white px-6 py-2 rounded-lg hover:bg-red-700 transition">
              {editing ? 'Perbarui' : 'Tambah'}
            </button>
            <button onClick={resetForm} className="bg-gray-700 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition">
              Batal
            </button>
          </div>
        </div>
      )}

      {/* Rekening Cards */}
      <div className="space-y-4">
        {giftAccounts.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-8">Belum ada rekening</p>
        ) : (
          giftAccounts.map((account) => {
            const logo = getProviderLogo(account.provider_name, account.type)
            return (
              <div key={account.id} className="bg-netflix-dark rounded-xl p-4 border border-netflix-gray/20 hover:border-netflix-red/20 transition">
                <div className="flex gap-4 items-center">
                  {/* Logo */}
                  <div className={`w-12 h-12 rounded-lg ${logo.color} flex items-center justify-center flex-shrink-0`}>
                    <span className="text-white font-bold text-xs">{logo.text}</span>
                  </div>
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${account.type === 'bank' ? 'bg-blue-600' : 'bg-green-600'} text-white`}>
                        {account.type === 'bank' ? 'BANK' : 'E-WALLET'}
                      </span>
                      <span className="text-white font-medium text-sm">{account.provider_name}</span>
                    </div>
                    <p className="text-white font-mono text-sm">{account.account_number}</p>
                    <p className="text-gray-400 text-xs">a.n. {account.account_holder}</p>
                  </div>
                  {/* Actions */}
                  <div className="flex flex-col gap-1 flex-shrink-0">
                    <button onClick={() => startEdit(account)} className="text-blue-400 text-xs hover:underline">Edit</button>
                    <button onClick={() => handleDelete(account.id)} className="text-red-400 text-xs hover:underline">Hapus</button>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

// ==================== MEDIA TAB ====================

function MediaTab({
  settings,
  setSettings,
  saving,
  onSave,
}: {
  settings: Settings
  setSettings: React.Dispatch<React.SetStateAction<Settings | null>>
  saving: boolean
  onSave: () => void
}) {
  return (
    <div className="bg-netflix-dark rounded-xl p-6 space-y-4">
      <h3 className="text-lg font-semibold text-white">Media</h3>
      <div>
        <label className="block text-xs text-gray-400 mb-1">URL Musik Latar</label>
        <input
          className={inputClass}
          value={settings.music_url || ''}
          onChange={(e) => setSettings((prev) => (prev ? { ...prev, music_url: e.target.value } : prev))}
          placeholder="https://example.com/music.mp3"
        />
      </div>
      <button
        onClick={onSave}
        disabled={saving}
        className="bg-netflix-red text-white px-6 py-3 rounded-lg hover:bg-red-700 transition disabled:opacity-50"
      >
        {saving ? 'Menyimpan...' : 'Simpan'}
      </button>
    </div>
  )
}
