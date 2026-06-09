'use client'

import { m } from 'framer-motion'
import Image from 'next/image'
import type { Event } from '@/types'

interface Props {
  events: Event[]
}

function formatEventDate(dateStr: string) {
  // Handle date string like "2024-12-14" without timezone issues
  const parts = dateStr.split('-')
  if (parts.length === 3) {
    const months = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ]
    const day = parseInt(parts[2], 10)
    const monthIndex = parseInt(parts[1], 10) - 1
    const year = parts[0]
    return `${day} ${months[monthIndex]} ${year}`
  }
  return dateStr
}

function formatTime(time: string) {
  return time.slice(0, 5).replace(':', '.')
}

export function EventSection({ events }: Props) {
  if (events.length === 0) return null

  return (
    <section className="netflix-section" id="timeline-section">
      <m.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="font-serif text-3xl sm:text-4xl md:text-5xl text-center text-white mb-3"
      >
        Timeline &amp; Location
      </m.h2>
      <m.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="text-center text-netflix-light/40 text-sm mb-10"
      >
        Rangkaian acara pernikahan
      </m.p>

      <div className="max-w-lg mx-auto space-y-6 sm:space-y-8">
        {events.map((event, i) => (
          <m.div
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
              <m.div
                whileHover={{ scale: 1.05 }}
                className="flex-shrink-0 w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-lg overflow-hidden relative shadow-lg bg-netflix-gray/30"
              >
                {event.image_url ? (
                  <Image
                    src={event.image_url}
                    alt={event.title}
                    fill sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-netflix-light/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </m.div>

              {/* Event Details */}
              <div className="flex-1 min-w-0">
                {/* Badge */}
                <m.span
                  initial={{ scale: 0.8 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  className="inline-block bg-netflix-red text-white text-[10px] sm:text-xs font-bold px-2.5 sm:px-3 py-0.5 sm:py-1 rounded mb-2"
                >
                  {event.title}
                </m.span>

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
            <m.div
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
            </m.div>

            {/* Google Maps Link */}
            {event.map_url && (
              <m.a
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
              </m.a>
            )}
          </m.div>
        ))}
      </div>
    </section>
  )
}
