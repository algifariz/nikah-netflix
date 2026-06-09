'use client'

import { useState } from 'react'
import { m, AnimatePresence } from 'framer-motion'
import type { Wish } from '@/types'

interface Props {
  wishes: Wish[]
  setWishes: (wishes: Wish[]) => void
  guestName: string
}

export function WishesSection({ wishes, setWishes, guestName }: Props) {
  const [name, setName] = useState(guestName || '')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!name.trim()) {
      setError('Silakan masukkan nama Anda terlebih dahulu')
      return
    }

    if (!message.trim()) {
      setError('Silakan tulis ucapan & doa untuk kedua mempelai')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/wishes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guest_name: name.trim(), message: message.trim() }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Gagal mengirim ucapan')
        return
      }

      if (data && data.id) {
        setWishes([data, ...wishes])
      }
      setMessage('')
    } catch (error) {
      console.error('Wish error:', error)
      setError('Terjadi kesalahan. Silakan coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="netflix-section">
      <m.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="font-serif text-3xl sm:text-4xl font-bold text-center mb-3"
      >
        Wedding Wishes
      </m.h2>
      <m.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="text-center text-netflix-light/40 text-sm mb-8"
      >
        Ucapan &amp; doa untuk kedua mempelai
      </m.p>

      {/* Form */}
      <m.form
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        onSubmit={handleSubmit}
        className="max-w-md mx-auto mb-8"
      >
        <input aria-label="input"
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value)
            if (error) setError('')
          }}
          placeholder="Masukkan nama Anda..."
          className="w-full bg-netflix-dark border border-netflix-gray/30 rounded-xl p-4 text-sm text-white placeholder-netflix-light/30 focus:border-netflix-red focus:outline-none transition-colors mb-3"
        />

        <textarea aria-label="message"
          value={message}
          onChange={(e) => {
            setMessage(e.target.value)
            if (error) setError('')
          }}
          placeholder="Tulis ucapan & doa untuk kedua mempelai..."
          rows={3}
          className="w-full bg-netflix-dark border border-netflix-gray/30 rounded-xl p-4 text-sm text-white placeholder-netflix-light/30 resize-none focus:border-netflix-red focus:outline-none transition-colors"
        />

        {/* Error message */}
        {error && (
          <m.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red-400 text-xs mt-2 text-center"
          >
            {error}
          </m.p>
        )}

        <m.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={loading}
          className="netflix-btn w-full mt-3 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Mengirim...
            </span>
          ) : (
            'Kirim Ucapan'
          )}
        </m.button>
      </m.form>

      {/* Wishes list */}
      <div className="max-w-md mx-auto space-y-3 max-h-[400px] overflow-y-auto pr-1">
        <AnimatePresence>
          {wishes.length === 0 && (
            <p className="text-center text-netflix-light/30 text-sm py-8">
              Belum ada ucapan. Jadilah yang pertama!
            </p>
          )}
          {wishes.map((wish, i) => (
            <m.div
              key={wish.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
              className="bg-netflix-dark rounded-xl p-4 border border-netflix-gray/20 hover:border-netflix-gray/40 transition-colors"
            >
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-netflix-red to-red-800 flex items-center justify-center text-white text-xs font-bold shadow-md">
                  {wish.guest_name.charAt(0).toUpperCase()}
                </div>
                <span className="font-medium text-sm">{wish.guest_name}</span>
              </div>
              <p className="text-netflix-light/60 text-xs sm:text-sm leading-relaxed pl-[42px]">
                {wish.message}
              </p>
            </m.div>
          ))}
        </AnimatePresence>
      </div>
    </section>
  )
}
