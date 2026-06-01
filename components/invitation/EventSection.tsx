'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import type { Event } from '@/types'

interface Props {
  events: Event[]
}

function formatEventDate(dateStr: string) {
  const date = new Date(dateStr)
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ]
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`
}

function formatTime(time: string) {
  return time.slice(0, 5).replace(':', '.')
}

export function EventSection({ events }: Props) {
  if (events.length === 0) return null

  return (
    <section className="netflix-section">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="font-serif text-3xl sm:text-4xl md:text-5xl text-center text-white mb-3"
      >
        Timeline &amp; Location
      </motion.h2>
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="text-center text-netflix-light/40 text-sm mb-10"
      >
        Rangkaian acara pernikahan
      </motion.p>

      <div className="max-w-lg mx-auto space-y-6 sm:space-y-8">
        {events.map((event, i) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.2, duration: 0.6, ease: 'easeOut' }}
            viewport={{ once: true }}
            className="relative bg-netflix-dark/50 rounded-xl p-4 sm:p-5 border border-netflix-gray/20 hover:border-netflix-red/20 transition-colors"
          >
            {/* Event Card */}
            <div className="flex gap-3 sm:gap-4">
              {/* Event Image */}
              {event.image_url && (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="flex-shrink-0 w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-lg overflow-hidden relative shadow-lg"
                >
                  <Image
                    src={event.image_url}
                    alt={event.title}
                    fill
                    className="object-cover"
                  />
                </motion.div>
              )}

              {/* Event Details */}
              <div className="flex-1 min-w-0">
                {/* Badge */}
                <motion.span
                  initial={{ scale: 0.8 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  className="inline-block bg-netflix-red text-white text-[10px] sm:text-xs font-bold px-2.5 sm:px-3 py-0.5 sm:py-1 rounded mb-2"
                >
                  {event.title}
                </motion.span>

                {/* Date */}
                <h3 className="text-white font-bold text-base sm:text-lg mb-2">
                  {formatEventDate(event.date)}
                </h3>

                {/* Time & Timezone */}
                <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                  <span className="bg-neutral-800 text-white text-[10px] sm:text-xs px-2 sm:px-3 py-0.5 sm:py-1 rounded-full border border-neutral-600">
                    {formatTime(event.time_start)} s.d {formatTime(event.time_end)}
                  </span>
                  <span className="bg-neutral-800 text-white text-[10px] sm:text-xs px-2 sm:px-3 py-0.5 sm:py-1 rounded-full border border-neutral-600">
                    #{event.timezone || 'WITA'}
                  </span>
                </div>
              </div>
            </div>

            {/* Address */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="mt-3 sm:mt-4"
            >
              <p className="text-neutral-300 text-xs sm:text-sm leading-relaxed">
                Bertempat di {event.location}
                {event.address && ` - ${event.address}`}
              </p>
            </motion.div>

            {/* Google Maps Link */}
            {event.map_url && (
              <motion.a
                href={event.map_url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ x: 5 }}
                className="inline-flex items-center gap-1 mt-3 text-netflix-red font-semibold text-xs sm:text-sm hover:underline"
              >
                Buka Google Maps
                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </motion.a>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  )
}
