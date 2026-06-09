'use client'

import { m } from 'framer-motion'
import Image from 'next/image'
import type { Settings } from '@/types'
import { formatDate } from '@/lib/utils'

interface Props {
  settings: Settings | null
}

export function HeroSection({ settings }: Props) {
  return (
    <section className="relative h-[100svh] w-full overflow-hidden">
      {/* Fullscreen background image with zoom animation */}
      {settings?.hero_image ? (
        <m.div
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 8, ease: 'easeOut' }}
          className="absolute inset-0"
        >
          <Image
            src={settings.hero_image}
            alt="Wedding Hero"
            fill sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
            priority
          />
        </m.div>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a2e] to-[#16213e]" />
      )}

      {/* Gradient overlays - Netflix style */}
      <div className="absolute inset-0 bg-gradient-to-t from-netflix-black via-netflix-black/50 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-netflix-black/70 via-transparent to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-netflix-black to-transparent" />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-end pb-16 sm:pb-20 px-4 sm:px-6 md:px-16">
        <div className="max-w-2xl">
          {/* Netflix series badge */}
          <m.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="flex items-center gap-2 mb-3"
          >
            <span className="text-netflix-red font-black text-lg">N</span>
            <span className="text-white/70 text-xs sm:text-sm font-medium tracking-wider uppercase">S E R I E S</span>
          </m.div>

          {/* Title */}
          <m.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-3 leading-[1.1] tracking-tight"
          >
            {settings?.groom_name || 'Ahmad'}
            <span className="text-netflix-red"> &amp; </span>
            {settings?.bride_name || 'Aisyah'}
          </m.h1>

          {/* Match percentage & info - Netflix style */}
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="flex flex-wrap items-center gap-2 sm:gap-4 mb-4"
          >
            <span className="text-green-500 font-bold text-xs sm:text-sm">100% Match</span>
            <span className="text-white/50 text-xs sm:text-sm">
              {settings?.wedding_date ? formatDate(settings.wedding_date) : 'Coming Soon'}
            </span>
            <span className="border border-white/30 text-white/50 text-[10px] sm:text-xs px-1.5 py-0.5 rounded">
              HD
            </span>
          </m.div>

          {/* Description */}
          <m.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="text-white/60 text-sm sm:text-base md:text-lg max-w-xl leading-relaxed mb-6"
          >
            {settings?.opening_text ||
              'Dengan memohon rahmat dan ridho Allah SWT, kami bermaksud menyelenggarakan pernikahan kami'}
          </m.p>

          {/* Netflix action buttons */}
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.6 }}
            className="flex flex-wrap items-center gap-3"
          >
            <button type="button"
              onClick={() => {
                // Auto scroll through entire page slowly, stops if user scrolls manually
                const totalHeight = document.documentElement.scrollHeight - window.innerHeight
                const duration = 120000 // 2 minutes to scroll entire page
                const startTime = performance.now()
                const startY = window.scrollY
                let stopped = false

                function stopAutoScroll() {
                  stopped = true
                  window.removeEventListener('wheel', stopAutoScroll)
                  window.removeEventListener('touchmove', stopAutoScroll)
                }

                window.addEventListener('wheel', stopAutoScroll, { once: true, passive: true })
                window.addEventListener('touchmove', stopAutoScroll, { once: true, passive: true })

                function scrollStep(currentTime: number) {
                  if (stopped) return
                  const elapsed = currentTime - startTime
                  const progress = Math.min(elapsed / duration, 1)
                  const ease = progress < 0.5
                    ? 2 * progress * progress
                    : 1 - Math.pow(-2 * progress + 2, 2) / 2
                  window.scrollTo(0, startY + totalHeight * ease)
                  if (progress < 1) {
                    requestAnimationFrame(scrollStep)
                  }
                }
                requestAnimationFrame(scrollStep)
              }}
              className="flex items-center gap-2 bg-white text-black font-bold px-4 sm:px-6 py-2.5 sm:py-3 rounded text-sm sm:text-base hover:bg-white/80 transition active:scale-95"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              Play
            </button>
            <button type="button"
              onClick={() => {
                // Scroll to Timeline & Location section
                const el = document.getElementById('timeline-section')
                if (el) el.scrollIntoView({ behavior: 'smooth' })
              }}
              className="flex items-center gap-2 bg-white/20 text-white font-bold px-4 sm:px-6 py-2.5 sm:py-3 rounded text-sm sm:text-base hover:bg-white/30 transition backdrop-blur-sm active:scale-95"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              More Info
            </button>
          </m.div>

          {/* Hashtag */}
          <m.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3 }}
            className="text-white/30 text-xs sm:text-sm mt-4"
          >
            {settings?.hashtag || '#AhmadAisyah2024'}
          </m.p>
        </div>
      </div>
    </section>
  )
}
