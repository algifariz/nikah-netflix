'use client'

import { useState, useEffect } from 'react'
import { m } from 'framer-motion'

interface Props {
  weddingDate?: string
}

export function CountdownSection({ weddingDate }: Props) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    if (!weddingDate) return

    const timer = setInterval(() => {
      const now = new Date().getTime()
      const target = new Date(weddingDate).getTime()
      const diff = target - now

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        clearInterval(timer)
        return
      }

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [weddingDate])

  const items = [
    { label: 'Hari', value: timeLeft.days },
    { label: 'Jam', value: timeLeft.hours },
    { label: 'Menit', value: timeLeft.minutes },
    { label: 'Detik', value: timeLeft.seconds },
  ]

  return (
    <section className="netflix-section text-center">
      <m.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold mb-3"
      >
        Counting Down
      </m.h2>
      <m.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
        className="text-netflix-light/40 text-sm mb-8"
      >
        Menuju hari bahagia
      </m.p>

      <div className="flex justify-center gap-2 sm:gap-4 md:gap-6">
        {items.map((item, i) => (
          <m.div
            key={item.label}
            initial={{ opacity: 0, y: 30, scale: 0.8 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, type: 'spring', stiffness: 200 }}
            className="bg-netflix-dark rounded-lg p-3 sm:p-4 md:p-6 min-w-[60px] sm:min-w-[80px] md:min-w-[100px] border border-netflix-gray/20 hover:border-netflix-red/30 transition-colors"
          >
            <m.div
              key={item.value}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
              className="text-2xl sm:text-3xl md:text-5xl font-black text-netflix-red tabular-nums"
            >
              {String(item.value).padStart(2, '0')}
            </m.div>
            <div className="text-[10px] sm:text-xs md:text-sm text-netflix-light/40 mt-1 sm:mt-2 uppercase tracking-wider">
              {item.label}
            </div>
          </m.div>
        ))}
      </div>
    </section>
  )
}
