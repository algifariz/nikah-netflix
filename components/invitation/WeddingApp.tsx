'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useWeddingData } from '@/hooks/useWeddingData'
import { OpeningSection } from './OpeningSection'
import { HeroSection } from './HeroSection'
import { CoupleSection } from './CoupleSection'
import { CountdownSection } from './CountdownSection'
import { LoveStorySection } from './LoveStorySection'
import { EventSection } from './EventSection'
import { GallerySection } from './GallerySection'
import { RSVPSection } from './RSVPSection'
import { WishesSection } from './WishesSection'
import { GiftSection } from './GiftSection'
import { QRSection } from './QRSection'
import { FooterSection } from './FooterSection'
import { MusicPlayer } from './MusicPlayer'

interface Props {
  guestName: string
  code: string
  category: 'REGULAR' | 'VIP' | 'VVIP'
}

export function WeddingApp({ guestName, code, category }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showIntro, setShowIntro] = useState(false)
  const { settings, events, loveStories, gallery, wishes, setWishes, giftAccounts, loading } =
    useWeddingData()

  function handleOpen() {
    // Play intro sound (Netflix ta-dum) then show content
    const soundUrl = settings?.intro_sound_url || '/sounds/netflix-tadum.mp3'
    const audio = new Audio(soundUrl)
    audio.volume = 0.7
    audio.play().catch(() => {})
    
    setShowIntro(true)
    // Show Netflix intro animation for 3 seconds, then open
    setTimeout(() => {
      setShowIntro(false)
      setIsOpen(true)
      setIsPlaying(true)
    }, 3000)
  }

  if (loading) {
    return (
      <div className="min-h-[100svh] bg-netflix-black flex flex-col items-center justify-center gap-4" suppressHydrationWarning>
        <div className="text-netflix-red text-6xl font-black">N</div>
        <div className="w-10 h-10 border-4 border-netflix-red border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!isOpen && !showIntro) {
    return (
      <OpeningSection
        guestName={guestName}
        settings={settings}
        onOpen={handleOpen}
      />
    )
  }

  // Netflix intro animation (ta-dum screen) - plays after user clicks "Buka Undangan"
  if (showIntro) {
    return (
      <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center">
        <motion.div
          initial={{ scale: 0.3, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-center"
        >
          <span className="text-netflix-red text-8xl sm:text-9xl font-black inline-block">
            N
          </span>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-6"
        >
          <div className="w-8 h-8 border-4 border-netflix-red border-t-transparent rounded-full animate-spin" />
        </motion.div>
      </div>
    )
  }

  return (
    <main className="min-h-[100svh] bg-netflix-black overflow-x-hidden" suppressHydrationWarning>
      {/* Netflix-style top navigation */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="fixed top-0 left-0 right-0 z-40 bg-gradient-to-b from-netflix-black/95 via-netflix-black/60 to-transparent px-4 sm:px-6 md:px-8 py-3 sm:py-4"
      >
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <span className="text-netflix-red text-xl sm:text-2xl font-black">N</span>
          <span className="text-white/50 text-[10px] sm:text-xs truncate max-w-[200px]">
            {settings?.groom_name} &amp; {settings?.bride_name}
          </span>
        </div>
      </motion.nav>

      <MusicPlayer musicUrl={settings?.music_url} isPlaying={isPlaying} setIsPlaying={setIsPlaying} />
      
      <HeroSection settings={settings} />
      <CoupleSection settings={settings} />
      <CountdownSection weddingDate={settings?.wedding_date} />
      <LoveStorySection stories={loveStories} />
      <EventSection events={events} />
      <GallerySection images={gallery} />
      <RSVPSection code={code} guestName={guestName} />
      <WishesSection wishes={wishes} setWishes={setWishes} guestName={guestName} />
      <GiftSection giftAccounts={giftAccounts} />
      <QRSection code={code} category={category} guestName={guestName} />
      <FooterSection settings={settings} />
    </main>
  )
}
