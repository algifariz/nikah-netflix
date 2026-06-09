'use client'

import { m } from 'framer-motion'
import Image from 'next/image'
import type { GalleryImage } from '@/types'

interface Props {
  images: GalleryImage[]
}

export function GallerySection({ images }: Props) {
  if (images.length === 0) return null

  return (
    <section className="netflix-section">
      <m.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2"
      >
        Our Gallery
      </m.h2>
      <m.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="text-netflix-light/40 text-sm mb-6"
      >
        Momen-momen indah kami
      </m.p>

      {/* Netflix-style horizontal scroll row */}
      <div className="netflix-row">
        {images.map((image, i) => (
          <m.div
            key={image.id}
            initial={{ opacity: 0, scale: 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.08, duration: 0.5 }}
            viewport={{ once: true }}
            className="flex-shrink-0 w-[160px] sm:w-[200px] md:w-[260px] h-[240px] sm:h-[300px] md:h-[380px] rounded-md overflow-hidden relative group cursor-pointer"
          >
            <Image
              src={image.image_url}
              alt={image.caption || `Gallery ${i + 1}`}
              fill sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Border glow on hover */}
            <div className="absolute inset-0 border-2 border-transparent group-hover:border-netflix-red/50 rounded-md transition-colors duration-300" />
            
            {/* Caption */}
            {image.caption && (
              <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                <p className="text-xs sm:text-sm text-white font-medium">{image.caption}</p>
              </div>
            )}

            {/* Number badge */}
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="bg-netflix-red/80 text-white text-[10px] font-bold w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center">
                {i + 1}
              </span>
            </div>
          </m.div>
        ))}
      </div>
    </section>
  )
}
