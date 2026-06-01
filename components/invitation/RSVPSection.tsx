'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

interface Props {
  code: string
  guestName: string
}

export function RSVPSection({ code, guestName }: Props) {
  const [status, setStatus] = useState<string>('')
  const [guests, setGuests] = useState(1)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  async function handleSubmit() {
    if (!status || code === 'preview') return
    setLoading(true)

    try {
      await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          rsvp_status: status,
          number_of_guests: guests,
        }),
      })
      setSubmitted(true)
    } catch (error) {
      console.error('RSVP error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <section className="netflix-section text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="bg-netflix-dark rounded-xl p-8 max-w-md mx-auto border border-netflix-gray/20"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="text-5xl mb-4"
          >
            🎉
          </motion.div>
          <h3 className="text-xl font-bold mb-2">Terima Kasih!</h3>
          <p className="text-netflix-light/60 text-sm">
            Konfirmasi kehadiran Anda telah kami terima.
          </p>
        </motion.div>
      </section>
    )
  }

  return (
    <section className="netflix-section">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="font-serif text-3xl sm:text-4xl font-bold text-center mb-3"
      >
        RSVP
      </motion.h2>
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="text-center text-netflix-light/40 text-sm mb-8"
      >
        Konfirmasi kehadiran Anda
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="bg-netflix-dark rounded-xl p-5 sm:p-6 md:p-8 max-w-md mx-auto border border-netflix-gray/20"
      >
        <p className="text-center text-netflix-light/70 mb-6 text-sm">
          Halo <span className="font-bold text-white">{guestName}</span>, mohon konfirmasi
          kehadiran Anda
        </p>

        {/* Attendance options */}
        <div className="space-y-3 mb-6">
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => setStatus('attending')}
            className={`w-full p-3 sm:p-4 rounded-lg border text-left text-sm transition-all duration-300 ${
              status === 'attending'
                ? 'border-netflix-red bg-netflix-red/10 text-white shadow-lg shadow-netflix-red/10'
                : 'border-netflix-gray/30 text-netflix-light/60 hover:border-netflix-light/30 hover:bg-netflix-dark'
            }`}
          >
            <span className="flex items-center gap-2">
              <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                status === 'attending' ? 'border-netflix-red bg-netflix-red' : 'border-netflix-gray'
              }`}>
                {status === 'attending' && (
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                  </svg>
                )}
              </span>
              Ya, saya akan hadir
            </span>
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => setStatus('not_attending')}
            className={`w-full p-3 sm:p-4 rounded-lg border text-left text-sm transition-all duration-300 ${
              status === 'not_attending'
                ? 'border-netflix-red bg-netflix-red/10 text-white shadow-lg shadow-netflix-red/10'
                : 'border-netflix-gray/30 text-netflix-light/60 hover:border-netflix-light/30 hover:bg-netflix-dark'
            }`}
          >
            <span className="flex items-center gap-2">
              <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                status === 'not_attending' ? 'border-netflix-red bg-netflix-red' : 'border-netflix-gray'
              }`}>
                {status === 'not_attending' && (
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                  </svg>
                )}
              </span>
              Maaf, saya tidak bisa hadir
            </span>
          </motion.button>
        </div>

        {/* Number of guests */}
        {status === 'attending' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
            className="mb-6"
          >
            <label className="text-sm text-netflix-light/60 block mb-2">Jumlah Tamu</label>
            <select
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
              className="w-full bg-netflix-black border border-netflix-gray/30 rounded-lg p-3 text-sm text-white focus:border-netflix-red focus:outline-none transition"
            >
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {n} orang
                </option>
              ))}
            </select>
          </motion.div>
        )}

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSubmit}
          disabled={!status || loading}
          className="netflix-btn w-full disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Mengirim...
            </span>
          ) : (
            'Konfirmasi Kehadiran'
          )}
        </motion.button>
      </motion.div>
    </section>
  )
}
