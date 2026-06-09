'use client'

import { useRef, useEffect, useEffectEvent } from 'react'
import { m } from 'framer-motion'

interface Props {
  musicUrl?: string
  isPlaying: boolean
  setIsPlaying: (playing: boolean) => void
}

export function MusicPlayer({ musicUrl, isPlaying, setIsPlaying }: Props) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const hasTriedPlay = useRef(false)

  const onTryPlay = useEffectEvent(() => {
    if (!audioRef.current || !musicUrl) return
    audioRef.current.play().then(() => {
      hasTriedPlay.current = true
    }).catch(() => {
      setIsPlaying(false)
    })
  })

  useEffect(() => {
    if (!audioRef.current || !musicUrl) return
    if (isPlaying) {
      onTryPlay()
    } else {
      audioRef.current.pause()
    }
  }, [isPlaying, musicUrl])

  useEffect(() => {
    function handleInteraction() {
      if (isPlaying && audioRef.current && audioRef.current.paused && musicUrl) {
        onTryPlay()
      }
    }
    document.addEventListener('click', handleInteraction, { once: true })
    document.addEventListener('touchstart', handleInteraction, { once: true, passive: true })
    return () => {
      document.removeEventListener('click', handleInteraction)
      document.removeEventListener('touchstart', handleInteraction)
    }
  }, [isPlaying, musicUrl])

  if (!musicUrl) return null

  return (
    <>
      <audio ref={audioRef} src={musicUrl} loop preload="auto" aria-label="Background music">
        <track kind="captions" />
      </audio>
      <m.button
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, type: 'spring' }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsPlaying(!isPlaying)}
        className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shadow-lg transition-colors ${
          isPlaying
            ? 'bg-netflix-red shadow-netflix-red/30'
            : 'bg-white/20 backdrop-blur-sm shadow-black/30'
        }`}
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
        {isPlaying && (
          <span className="absolute -top-0.5 -right-0.5 w-3 h-3">
            <span className="absolute inline-flex h-full w-full rounded-full bg-netflix-red opacity-75 animate-ping" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-netflix-red" />
          </span>
        )}
      </m.button>
    </>
  )
}
