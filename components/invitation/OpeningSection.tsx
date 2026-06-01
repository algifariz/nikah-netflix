'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import type { Settings } from '@/types'

interface Props {
  guestName: string
  settings: Settings | null
  onOpen: () => void
}

export function OpeningSection({ guestName, settings, onOpen }: Props) {
  return (
    <div className="fixed inset-0 z-50 bg-netflix-black flex items-center justify-center overflow-hidden">
      {/* Background image with parallax effect */}
      {settings?.hero_image && (
        <motion.div
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 10, ease: 'linear' }}
          className="absolute inset-0"
        >
          <Image
            src={settings.hero_image}
            alt="Background"
            fill
            className="object-cover opacity-20"
            priority
          />
        </motion.div>
      )}

      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-netflix-black via-netflix-black/80 to-netflix-black/40" />
      
      {/* Floating particles effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-netflix-red/30 rounded-full"
            initial={{ 
              x: `${Math.random() * 100}%`, 
              y: '100%',
              opacity: 0 
            }}
            animate={{ 
              y: '-10%',
              opacity: [0, 1, 0]
            }}
            transition={{ 
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: i * 0.8,
              ease: 'linear'
            }}
          />
        ))}
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 text-center px-6 w-full max-w-md"
      >
        {/* Netflix N logo */}
        <motion.div
          initial={{ scale: 0, rotateY: 180 }}
          animate={{ scale: 1, rotateY: 0 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="mb-6"
        >
          <span className="text-netflix-red text-7xl md:text-8xl font-black inline-block">N</span>
        </motion.div>

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-6"
        >
          <span className="netflix-badge text-xs sm:text-sm tracking-[0.2em]">WEDDING INVITATION</span>
        </motion.div>

        {/* Couple names */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="text-3xl sm:text-4xl md:text-5xl font-black mb-3 tracking-tight"
        >
          {settings?.groom_name || 'Ahmad'}
          <span className="text-netflix-red"> &amp; </span>
          {settings?.bride_name || 'Aisyah'}
        </motion.h1>

        {/* Hashtag */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="text-netflix-light/50 text-sm mb-8"
        >
          {settings?.hashtag || '#AhmadAisyah2024'}
        </motion.p>

        {/* Guest name card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.1 }}
          className="bg-netflix-dark/60 backdrop-blur-sm border border-netflix-gray/30 rounded-lg p-4 mb-8"
        >
          <p className="text-netflix-light/50 text-xs mb-1">Kepada Yth.</p>
          <p className="text-lg sm:text-xl font-bold">{guestName}</p>
        </motion.div>

        {/* Open button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onOpen}
          className="w-full sm:w-auto bg-white text-black font-bold text-base sm:text-lg px-8 sm:px-10 py-4 rounded-md flex items-center gap-3 mx-auto justify-center hover:bg-white/90 transition animate-pulse-glow"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
          Buka Undangan
        </motion.button>
      </motion.div>
    </div>
  )
}
