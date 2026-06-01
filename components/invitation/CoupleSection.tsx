'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import type { Settings } from '@/types'

interface Props {
  settings: Settings | null
}

export function CoupleSection({ settings }: Props) {
  return (
    <section className="netflix-section">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-2"
      >
        <span className="text-netflix-red text-xs font-bold tracking-[0.3em] uppercase">The Wedding Of</span>
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-10 md:mb-14"
      >
        Bride &amp; Groom
      </motion.h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-12 max-w-3xl mx-auto">
        {/* Groom */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          viewport={{ once: true }}
          className="text-center"
        >
          <motion.div
            whileHover={{ scale: 1.03 }}
            className="w-40 h-56 sm:w-48 sm:h-64 mx-auto mb-5 rounded-lg overflow-hidden bg-netflix-dark relative shadow-xl shadow-black/50"
          >
            {settings?.groom_photo ? (
              <Image
                src={settings.groom_photo}
                alt={settings.groom_name || 'Groom'}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-netflix-light/30">
                <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              </div>
            )}
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-xl sm:text-2xl font-bold mb-1">{settings?.groom_name || 'Ahmad'}</h3>
            <p className="text-netflix-light/70 text-xs sm:text-sm mb-2">
              {settings?.groom_full_name || 'Ahmad Fauzan bin H. Muhammad Rizal'}
            </p>
            <p className="text-netflix-light/40 text-xs">
              Putra dari Bapak {settings?.groom_father || '...'} &amp; Ibu{' '}
              {settings?.groom_mother || '...'}
            </p>
          </motion.div>
        </motion.div>

        {/* Bride */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          viewport={{ once: true }}
          className="text-center"
        >
          <motion.div
            whileHover={{ scale: 1.03 }}
            className="w-40 h-56 sm:w-48 sm:h-64 mx-auto mb-5 rounded-lg overflow-hidden bg-netflix-dark relative shadow-xl shadow-black/50"
          >
            {settings?.bride_photo ? (
              <Image
                src={settings.bride_photo}
                alt={settings.bride_name || 'Bride'}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-netflix-light/30">
                <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-xl sm:text-2xl font-bold mb-1">{settings?.bride_name || 'Aisyah'}</h3>
            <p className="text-netflix-light/70 text-xs sm:text-sm mb-2">
              {settings?.bride_full_name || 'Aisyah Putri binti H. Abdul Rahman'}
            </p>
            <p className="text-netflix-light/40 text-xs">
              Putri dari Bapak {settings?.bride_father || '...'} &amp; Ibu{' '}
              {settings?.bride_mother || '...'}
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
