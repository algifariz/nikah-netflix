'use client'

import { useState, useEffect, useRef } from 'react'
import { Settings, Event, GiftAccount, GalleryImage } from '@/types'

type TabName = 'mempelai' | 'acara' | 'gallery' | 'amplop' | 'media'

const inputClass = 'w-full bg-netflix-black border border-netflix-gray/30 rounded-lg p-3 text-sm text-white focus:border-netflix-red focus:outline-none transition'

export function SettingsPanel() {
  const [activeTab, setActiveTab] = useState<TabName>('mempelai')
  const [settings, setSettings] = useState<Settings | null>(null)
  const [events, setEvents] = useState<Event[]>([])
  const [giftAccounts, setGiftAccounts] = useState<GiftAccount[]>([])
  const [gallery, setGallery] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  // Event form state
  const [eventForm, setEventForm] = useState<Partial<Event>>({})
  const [editingEventId, setEditingEventId] = useState<string | null>(null)
  const [showEventForm, setShowEventForm] = useState(false)

  // Gift account form state
  const [giftForm, setGiftForm] = useState<Partial<GiftAccount>>({ type: 'bank' })
  const [editingGiftId, setEditingGiftId] = useState<string | null>(null)
  const [showGiftForm, setShowGiftForm] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const galleryInputRef = useRef<HTMLInputElement>(null)

  const tabs: { key: TabName; label: string }[] = [
    { key: 'mempelai', label: 'Mempelai' },
    { key: 'acara', label: 'Acara' },
    { key: 'gallery', label: 'Gallery' },
    { key: 'amplop', label: 'Amplop' },
    { key: 'media', label: 'Media' },
  ]

  useEffect(() => {
    fetchAllData()
  }, [])

  async function fetchAllData() {
    setLoading(true)
    try {
      const [settingsRes, eventsRes, giftRes, galleryRes] = await Promise.all([
        fetch('/api/settings'),
        fetch('/api/events'),
        fetch('/api/gift-accounts'),
        fetch('/api/gallery'),
      ])
      if (settingsRes.ok) {
        const data = await settingsRes.json()
        setSettings(data)
      }
      if (eventsRes.ok) {
        const data = await eventsRes.json()
        setEvents(data)
      }
      if (giftRes.ok) {
        const data = await giftRes.json()
        setGiftAccounts(data)
      }
      if (galleryRes.ok) {
        const data = await galleryRes.json()
        setGallery(data)
      }
    } catch (err) {
      console.error('Failed to fetch data:', err)
    } finally {
      setLoading(false)
    }
  }

  async function uploadFile(file: File): Promise<string | null> {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('folder', 'wedding')
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      const data = await res.json()
      if (res.ok && data.url) {
        return data.url
      }
      // Show error to user
      setMessage(data.error || 'Upload gagal')
      setTimeout(() => setMessage(''), 5000)
      return null
    } catch (err) {
      setMessage('Upload gagal: network error')
      setTimeout(() => setMessage(''), 5000)
      return null
    }
  }

  async function handleSaveSettings() {
    if (!settings) return
    setSaving(true)
    setMessage('')
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })
      if (res.ok) {
        setMessage('Settings saved successfully!')
      } else {
        setMessage('Failed to save settings.')
      }
    } catch {
      setMessage('Error saving settings.')
    } finally {
      setSaving(false)
      setTimeout(() => setMessage(''), 3000)
    }
  }

  async function handlePhotoUpload(field: 'groom_photo' | 'bride_photo' | 'hero_image') {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file || !settings) return
      const url = await uploadFile(file)
      if (url) {
        setSettings({ ...settings, [field]: url })
      }
    }
    input.click()
  }

  // Event CRUD
  async function handleSaveEvent() {
    if (!eventForm.title) return
    try {
      if (editingEventId) {
        const res = await fetch(`/api/events/${editingEventId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(eventForm),
        })
        if (res.ok) {
          const updated = await res.json()
          setEvents(events.map((ev) => (ev.id === editingEventId ? updated : ev)))
        }
      } else {
        const res = await fetch('/api/events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...eventForm, order_index: events.length }),
        })
        if (res.ok) {
          const created = await res.json()
          setEvents([...events, created])
        }
      }
      resetEventForm()
    } catch (err) {
      console.error('Error saving event:', err)
    }
  }

  async function handleDeleteEvent(id: string) {
    if (!confirm('Delete this event?')) return
    try {
      const res = await fetch(`/api/events/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setEvents(events.filter((ev) => ev.id !== id))
      }
    } catch (err) {
      console.error('Error deleting event:', err)
    }
  }

  function resetEventForm() {
    setEventForm({})
    setEditingEventId(null)
    setShowEventForm(false)
  }

  function startEditEvent(event: Event) {
    setEventForm(event)
    setEditingEventId(event.id)
    setShowEventForm(true)
  }

  async function handleEventImageUpload() {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return
      const url = await uploadFile(file)
      if (url) {
        setEventForm({ ...eventForm, image_url: url })
      }
    }
    input.click()
  }

  // Gallery CRUD
  async function handleGalleryUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files) return
    for (let i = 0; i < files.length; i++) {
      const url = await uploadFile(files[i])
      if (url) {
        const res = await fetch('/api/gallery', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image_url: url, order_index: gallery.length + i }),
        })
        if (res.ok) {
          const created = await res.json()
          setGallery((prev) => [...prev, created])
        }
      }
    }
    if (galleryInputRef.current) {
      galleryInputRef.current.value = ''
    }
  }

  async function handleDeleteGalleryImage(id: string) {
    if (!confirm('Delete this image?')) return
    try {
      const res = await fetch(`/api/gallery?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        setGallery(gallery.filter((img) => img.id !== id))
      }
    } catch (err) {
      console.error('Error deleting image:', err)
    }
  }

  // Gift Account CRUD
  async function handleSaveGift() {
    if (!giftForm.provider_name || !giftForm.account_number || !giftForm.account_holder) return
    try {
      if (editingGiftId) {
        const res = await fetch(`/api/gift-accounts/${editingGiftId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(giftForm),
        })
        if (res.ok) {
          const updated = await res.json()
          setGiftAccounts(giftAccounts.map((g) => (g.id === editingGiftId ? updated : g)))
        }
      } else {
        const res = await fetch('/api/gift-accounts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...giftForm, order_index: giftAccounts.length }),
        })
        if (res.ok) {
          const created = await res.json()
          setGiftAccounts([...giftAccounts, created])
        }
      }
      resetGiftForm()
    } catch (err) {
      console.error('Error saving gift account:', err)
    }
  }

  async function handleDeleteGift(id: string) {
    if (!confirm('Delete this account?')) return
    try {
      const res = await fetch(`/api/gift-accounts/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setGiftAccounts(giftAccounts.filter((g) => g.id !== id))
      }
    } catch (err) {
      console.error('Error deleting gift account:', err)
    }
  }

  function resetGiftForm() {
    setGiftForm({ type: 'bank' })
    setEditingGiftId(null)
    setShowGiftForm(false)
  }

  function startEditGift(gift: GiftAccount) {
    setGiftForm(gift)
    setEditingGiftId(gift.id)
    setShowGiftForm(true)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-netflix-light">Loading settings...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-netflix-gray/20 pb-4">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              activeTab === tab.key
                ? 'bg-netflix-red text-white'
                : 'bg-netflix-dark text-netflix-light hover:bg-netflix-gray/20'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Message */}
      {message && (
        <div className={`bg-netflix-dark border rounded-lg p-3 text-sm ${message.includes('gagal') || message.includes('Error') || message.includes('Pastikan') ? 'border-red-500/30 text-red-400' : 'border-netflix-gray/30 text-green-400'}`}>
          {message}
        </div>
      )}

      {/* Mempelai Tab */}
      {activeTab === 'mempelai' && settings && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Groom */}
            <div className="bg-netflix-dark rounded-xl p-6 space-y-4">
              <h3 className="text-lg font-semibold text-white">Mempelai Pria</h3>
              <div>
                <label className="block text-sm text-netflix-light mb-1">Nama Panggilan</label>
                <input
                  type="text"
                  className={inputClass}
                  value={settings.groom_name}
                  onChange={(e) => setSettings({ ...settings, groom_name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm text-netflix-light mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  className={inputClass}
                  value={settings.groom_full_name}
                  onChange={(e) => setSettings({ ...settings, groom_full_name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm text-netflix-light mb-1">Ayah</label>
                <input
                  type="text"
                  className={inputClass}
                  value={settings.groom_father}
                  onChange={(e) => setSettings({ ...settings, groom_father: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm text-netflix-light mb-1">Ibu</label>
                <input
                  type="text"
                  className={inputClass}
                  value={settings.groom_mother}
                  onChange={(e) => setSettings({ ...settings, groom_mother: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm text-netflix-light mb-1">Foto</label>
                <div className="flex items-center gap-3">
                  {settings.groom_photo && (
                    <img src={settings.groom_photo} alt="Groom" className="w-16 h-16 rounded-full object-cover" />
                  )}
                  <button
                    onClick={() => handlePhotoUpload('groom_photo')}
                    className="px-4 py-2 bg-netflix-red text-white text-sm rounded-lg hover:bg-red-700 transition"
                  >
                    Upload Foto
                  </button>
                </div>
              </div>
            </div>

            {/* Bride */}
            <div className="bg-netflix-dark rounded-xl p-6 space-y-4">
              <h3 className="text-lg font-semibold text-white">Mempelai Wanita</h3>
              <div>
                <label className="block text-sm text-netflix-light mb-1">Nama Panggilan</label>
                <input
                  type="text"
                  className={inputClass}
                  value={settings.bride_name}
                  onChange={(e) => setSettings({ ...settings, bride_name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm text-netflix-light mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  className={inputClass}
                  value={settings.bride_full_name}
                  onChange={(e) => setSettings({ ...settings, bride_full_name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm text-netflix-light mb-1">Ayah</label>
                <input
                  type="text"
                  className={inputClass}
                  value={settings.bride_father}
                  onChange={(e) => setSettings({ ...settings, bride_father: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm text-netflix-light mb-1">Ibu</label>
                <input
                  type="text"
                  className={inputClass}
                  value={settings.bride_mother}
                  onChange={(e) => setSettings({ ...settings, bride_mother: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm text-netflix-light mb-1">Foto</label>
                <div className="flex items-center gap-3">
                  {settings.bride_photo && (
                    <img src={settings.bride_photo} alt="Bride" className="w-16 h-16 rounded-full object-cover" />
                  )}
                  <button
                    onClick={() => handlePhotoUpload('bride_photo')}
                    className="px-4 py-2 bg-netflix-red text-white text-sm rounded-lg hover:bg-red-700 transition"
                  >
                    Upload Foto
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* General Settings */}
          <div className="bg-netflix-dark rounded-xl p-6 space-y-4">
            <h3 className="text-lg font-semibold text-white">Informasi Umum</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-netflix-light mb-1">Hashtag</label>
                <input
                  type="text"
                  className={inputClass}
                  value={settings.hashtag}
                  onChange={(e) => setSettings({ ...settings, hashtag: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm text-netflix-light mb-1">Tanggal Pernikahan</label>
                <input
                  type="date"
                  className={inputClass}
                  value={settings.wedding_date}
                  onChange={(e) => setSettings({ ...settings, wedding_date: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-netflix-light mb-1">Opening Text</label>
              <textarea
                className={inputClass + ' min-h-[100px]'}
                value={settings.opening_text}
                onChange={(e) => setSettings({ ...settings, opening_text: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm text-netflix-light mb-1">Hero Image</label>
              <div className="flex items-center gap-3">
                {settings.hero_image && (
                  <img src={settings.hero_image} alt="Hero" className="w-24 h-16 rounded-lg object-cover" />
                )}
                <button
                  onClick={() => handlePhotoUpload('hero_image')}
                  className="px-4 py-2 bg-netflix-red text-white text-sm rounded-lg hover:bg-red-700 transition"
                >
                  Upload Hero Image
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={handleSaveSettings}
            disabled={saving}
            className="px-6 py-3 bg-netflix-red text-white font-medium rounded-lg hover:bg-red-700 transition disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Simpan Pengaturan'}
          </button>
        </div>
      )}

      {/* Acara Tab */}
      {activeTab === 'acara' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Daftar Acara</h3>
            <button
              onClick={() => {
                resetEventForm()
                setShowEventForm(true)
              }}
              className="px-4 py-2 bg-netflix-red text-white text-sm rounded-lg hover:bg-red-700 transition"
            >
              + Tambah Acara
            </button>
          </div>

          {showEventForm && (
            <div className="bg-netflix-dark rounded-xl p-6 space-y-4">
              <h4 className="text-md font-medium text-white">
                {editingEventId ? 'Edit Acara' : 'Tambah Acara Baru'}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-netflix-light mb-1">Judul</label>
                  <input
                    type="text"
                    className={inputClass}
                    value={eventForm.title || ''}
                    onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm text-netflix-light mb-1">Tanggal</label>
                  <input
                    type="date"
                    className={inputClass}
                    value={eventForm.date || ''}
                    onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm text-netflix-light mb-1">Waktu Mulai</label>
                  <input
                    type="time"
                    className={inputClass}
                    value={eventForm.time_start || ''}
                    onChange={(e) => setEventForm({ ...eventForm, time_start: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm text-netflix-light mb-1">Waktu Selesai</label>
                  <input
                    type="time"
                    className={inputClass}
                    value={eventForm.time_end || ''}
                    onChange={(e) => setEventForm({ ...eventForm, time_end: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm text-netflix-light mb-1">Timezone</label>
                  <input
                    type="text"
                    className={inputClass}
                    placeholder="WIB"
                    value={eventForm.timezone || ''}
                    onChange={(e) => setEventForm({ ...eventForm, timezone: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm text-netflix-light mb-1">Lokasi</label>
                  <input
                    type="text"
                    className={inputClass}
                    value={eventForm.location || ''}
                    onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm text-netflix-light mb-1">Alamat</label>
                  <input
                    type="text"
                    className={inputClass}
                    value={eventForm.address || ''}
                    onChange={(e) => setEventForm({ ...eventForm, address: e.target.value })}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm text-netflix-light mb-1">Map URL</label>
                  <input
                    type="text"
                    className={inputClass}
                    value={eventForm.map_url || ''}
                    onChange={(e) => setEventForm({ ...eventForm, map_url: e.target.value })}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm text-netflix-light mb-1">Gambar</label>
                  <div className="flex items-center gap-3">
                    {eventForm.image_url && (
                      <img src={eventForm.image_url} alt="Event" className="w-20 h-14 rounded-lg object-cover" />
                    )}
                    <button
                      onClick={handleEventImageUpload}
                      className="px-4 py-2 bg-netflix-red text-white text-sm rounded-lg hover:bg-red-700 transition"
                    >
                      Upload Gambar
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleSaveEvent}
                  className="px-4 py-2 bg-netflix-red text-white text-sm rounded-lg hover:bg-red-700 transition"
                >
                  {editingEventId ? 'Update' : 'Simpan'}
                </button>
                <button
                  onClick={resetEventForm}
                  className="px-4 py-2 bg-netflix-gray/20 text-netflix-light text-sm rounded-lg hover:bg-netflix-gray/30 transition"
                >
                  Batal
                </button>
              </div>
            </div>
          )}

          {/* Event List */}
          <div className="space-y-3">
            {events.map((event) => (
              <div key={event.id} className="bg-netflix-dark rounded-xl p-4 flex items-center justify-between">
                <div>
                  <h4 className="text-white font-medium">{event.title}</h4>
                  <p className="text-sm text-netflix-light">
                    {event.date} | {event.time_start} - {event.time_end} {event.timezone || ''}
                  </p>
                  <p className="text-sm text-netflix-light">{event.location}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => startEditEvent(event)}
                    className="px-3 py-1 bg-netflix-gray/20 text-netflix-light text-sm rounded-lg hover:bg-netflix-gray/30 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteEvent(event.id)}
                    className="px-3 py-1 bg-red-900/30 text-red-400 text-sm rounded-lg hover:bg-red-900/50 transition"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            ))}
            {events.length === 0 && (
              <p className="text-netflix-light text-sm text-center py-8">Belum ada acara.</p>
            )}
          </div>
        </div>
      )}

      {/* Gallery Tab */}
      {activeTab === 'gallery' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Gallery</h3>
            <label className="px-4 py-2 bg-netflix-red text-white text-sm rounded-lg hover:bg-red-700 transition cursor-pointer">
              + Upload Foto
              <input
                ref={galleryInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleGalleryUpload}
              />
            </label>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {gallery.map((img) => (
              <div key={img.id} className="relative group">
                <img
                  src={img.image_url}
                  alt={img.caption || 'Gallery'}
                  className="w-full h-40 object-cover rounded-lg"
                />
                <button
                  onClick={() => handleDeleteGalleryImage(img.id)}
                  className="absolute top-2 right-2 w-7 h-7 bg-red-600 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                >
                  X
                </button>
              </div>
            ))}
          </div>
          {gallery.length === 0 && (
            <p className="text-netflix-light text-sm text-center py-8">Belum ada foto di gallery.</p>
          )}
        </div>
      )}

      {/* Amplop Tab */}
      {activeTab === 'amplop' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Amplop Digital</h3>
            <button
              onClick={() => {
                resetGiftForm()
                setShowGiftForm(true)
              }}
              className="px-4 py-2 bg-netflix-red text-white text-sm rounded-lg hover:bg-red-700 transition"
            >
              + Tambah Rekening
            </button>
          </div>

          {showGiftForm && (
            <div className="bg-netflix-dark rounded-xl p-6 space-y-4">
              <h4 className="text-md font-medium text-white">
                {editingGiftId ? 'Edit Rekening' : 'Tambah Rekening Baru'}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-netflix-light mb-1">Tipe</label>
                  <select
                    className={inputClass}
                    value={giftForm.type || 'bank'}
                    onChange={(e) => setGiftForm({ ...giftForm, type: e.target.value as 'bank' | 'ewallet' })}
                  >
                    <option value="bank">Bank</option>
                    <option value="ewallet">E-Wallet</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-netflix-light mb-1">Nama Provider</label>
                  <input
                    type="text"
                    className={inputClass}
                    placeholder="BCA, Mandiri, GoPay, dll"
                    value={giftForm.provider_name || ''}
                    onChange={(e) => setGiftForm({ ...giftForm, provider_name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm text-netflix-light mb-1">Nomor Rekening</label>
                  <input
                    type="text"
                    className={inputClass}
                    value={giftForm.account_number || ''}
                    onChange={(e) => setGiftForm({ ...giftForm, account_number: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm text-netflix-light mb-1">Atas Nama</label>
                  <input
                    type="text"
                    className={inputClass}
                    value={giftForm.account_holder || ''}
                    onChange={(e) => setGiftForm({ ...giftForm, account_holder: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleSaveGift}
                  className="px-4 py-2 bg-netflix-red text-white text-sm rounded-lg hover:bg-red-700 transition"
                >
                  {editingGiftId ? 'Update' : 'Simpan'}
                </button>
                <button
                  onClick={resetGiftForm}
                  className="px-4 py-2 bg-netflix-gray/20 text-netflix-light text-sm rounded-lg hover:bg-netflix-gray/30 transition"
                >
                  Batal
                </button>
              </div>
            </div>
          )}

          {/* Gift Account List */}
          <div className="space-y-3">
            {giftAccounts.map((gift) => (
              <div key={gift.id} className="bg-netflix-dark rounded-xl p-4 flex items-center justify-between">
                <div>
                  <h4 className="text-white font-medium">{gift.provider_name}</h4>
                  <p className="text-sm text-netflix-light">
                    {gift.type === 'bank' ? 'Bank' : 'E-Wallet'} - {gift.account_number}
                  </p>
                  <p className="text-sm text-netflix-light">a.n. {gift.account_holder}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => startEditGift(gift)}
                    className="px-3 py-1 bg-netflix-gray/20 text-netflix-light text-sm rounded-lg hover:bg-netflix-gray/30 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteGift(gift.id)}
                    className="px-3 py-1 bg-red-900/30 text-red-400 text-sm rounded-lg hover:bg-red-900/50 transition"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            ))}
            {giftAccounts.length === 0 && (
              <p className="text-netflix-light text-sm text-center py-8">Belum ada rekening.</p>
            )}
          </div>
        </div>
      )}

      {/* Media Tab */}
      {activeTab === 'media' && settings && (
        <div className="space-y-4">
          <div className="bg-netflix-dark rounded-xl p-6 space-y-4">
            <h3 className="text-lg font-semibold text-white">Background Music</h3>
            <div>
              <label className="block text-sm text-netflix-light mb-1">Music URL</label>
              <input
                type="text"
                className={inputClass}
                placeholder="https://example.com/music.mp3"
                value={settings.music_url || ''}
                onChange={(e) => setSettings({ ...settings, music_url: e.target.value })}
              />
              <p className="text-xs text-netflix-light mt-1">
                Masukkan URL file musik (MP3) untuk background music undangan.
              </p>
            </div>
          </div>

          <button
            onClick={handleSaveSettings}
            disabled={saving}
            className="px-6 py-3 bg-netflix-red text-white font-medium rounded-lg hover:bg-red-700 transition disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Simpan Pengaturan'}
          </button>
        </div>
      )}
    </div>
  )
}
