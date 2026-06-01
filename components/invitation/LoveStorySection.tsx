'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import type { LoveStory } from '@/types'

interface Props {
  stories: LoveStory[]
}

export function LoveStorySection({ stories }: Props) {
  if (stories.length === 0) return null

  return (
    <section className="netflix-section">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2"
      >
        Our Love Story
      </motion.h2>
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="text-netflix-light/40 text-sm mb-6"
      >
        Perjalanan cinta kami
      </motion.p>

      {/* Netflix-style horizontal scroll */}
      <div className="netflix-row">
        {stories.map((story, i) => (
          <motion.div
            key={story.id}
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.15, duration: 0.5 }}
            viewport={{ once: true }}
            className="flex-shrink-0 w-[240px] sm:w-[280px] md:w-[320px] netflix-card group cursor-pointer"
          >
            {/* Thumbnail */}
            <div className="relative h-[150px] sm:h-[180px] md:h-[200px] overflow-hidden">
              {story.image_url ? (
                <Image
                  src={story.image_url}
                  alt={story.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-netflix-dark to-netflix-gray flex items-center justify-center">
                  <span className="text-netflix-red text-3xl sm:text-4xl font-bold">EP {i + 1}</span>
                </div>
              )}
              
              {/* Play icon overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-black ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </motion.div>

              {/* Episode badge */}
              <div className="absolute top-2 left-2">
                <span className="bg-netflix-red text-white text-[10px] font-bold px-2 py-0.5 rounded">
                  EP {i + 1}
                </span>
              </div>

              {/* Bottom gradient */}
              <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-netflix-dark to-transparent" />
            </div>

            {/* Content */}
            <div className="p-3 sm:p-4">
              <span className="text-netflix-red text-[10px] sm:text-xs font-bold">{story.date}</span>
              <h3 className="text-sm sm:text-base font-bold mt-1 mb-1.5 text-white">{story.title}</h3>
              <p className="text-netflix-light/50 text-[11px] sm:text-xs leading-relaxed line-clamp-3">
                {story.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
