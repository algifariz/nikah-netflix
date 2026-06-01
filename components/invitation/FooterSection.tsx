'use client'

import { motion } from 'framer-motion'
import type { Settings } from '@/types'

interface Props {
  settings: Settings | null
}

export function FooterSection({ settings }: Props) {
  return (
    <footer className="py-12 sm:py-16 px-4 sm:px-6 text-center border-t border-netflix-gray/20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <p className="text-netflix-light/30 text-xs sm:text-sm mb-2">
          Merupakan suatu kehormatan dan kebahagiaan bagi kami
        </p>
        <p className="text-netflix-light/30 text-xs sm:text-sm mb-6">
          apabila Bapak/Ibu/Saudara/i berkenan hadir
        </p>

        <motion.h3
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-xl sm:text-2xl font-bold mb-2"
        >
          {settings?.groom_name || 'Ahmad'}
          <span className="text-netflix-red"> &amp; </span>
          {settings?.bride_name || 'Aisyah'}
        </motion.h3>

        <p className="text-netflix-light/30 text-xs mt-4">
          {settings?.hashtag || '#AhmadAisyah2024'}
        </p>

        <div className="mt-8 flex items-center justify-center gap-2">
          <span className="text-netflix-red text-xl font-black">N</span>
          <p className="text-netflix-light/20 text-[10px] sm:text-xs">
            Netflix Wedding Invitation
          </p>
        </div>
      </motion.div>
    </footer>
  )
}
