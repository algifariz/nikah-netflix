'use client'

import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'

interface Props {
  musicUrl?: string
  isPlaying: boolean
  setIsPlaying: (playing: boolean) => void
}

export function MusicPlayer({ musicUrl, isPlaying, setIsPlaying }: Props) {
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    if (!audioRef.current || !musicUrl) return

    if (isPlaying) {
      audioRef.current.play().catch(() => setIsPlaying(false))
    } else {
      audioRef.current.pause()
    }
  }, [isPlaying, musicUrl, setIsPlaying])

  if (!musicUrl) return null

  return (
    <>
      <audio ref={audioRef} src={musicUrl} loop />
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: 'spring' }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsPlaying(!isPlaying)}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-netflix-red flex items-center justify-center shadow-lg shadow-netflix-red/30"
        aria-label={isPlaying ? 'Pause music' : 'Play music'}
      >
        {isPlaying ? (
          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
          </svg>
        ) : (
          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </motion.button>
    </>
  )
}
