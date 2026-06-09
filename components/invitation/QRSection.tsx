'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { m } from 'framer-motion'

interface Props {
  code: string
  category: 'REGULAR' | 'VIP' | 'VVIP'
  guestName: string
}

const categoryConfig: Record<string, { gradient: string; label: string; icon: string }> = {
  VVIP: { gradient: 'from-yellow-500 to-yellow-700', label: 'VVIP PASS', icon: '👑' },
  VIP: { gradient: 'from-purple-500 to-purple-700', label: 'VIP PASS', icon: '⭐' },
  REGULAR: { gradient: 'from-netflix-red to-red-800', label: 'GUEST PASS', icon: '🎫' },
}

export function QRSection({ code, category, guestName }: Props) {
  const [qrImage, setQrImage] = useState('')

  useEffect(() => {
    if (code === 'preview') return

    async function generateQR() {
      try {
        const QRCode = (await import('qrcode')).default
        const data = JSON.stringify({ code, name: guestName, category })
        const url = await QRCode.toDataURL(data, {
          width: 250,
          margin: 2,
          color: { dark: '#E50914', light: '#141414' },
        })
        setQrImage(url)
      } catch (err) {
        console.error('QR generation error:', err)
      }
    }

    generateQR()
  }, [code, guestName, category])

  if (code === 'preview') return null

  const config = categoryConfig[category]

  return (
    <section className="netflix-section text-center">
      <m.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="font-serif text-3xl sm:text-4xl font-bold mb-3"
      >
        Your QR Pass
      </m.h2>
      <m.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="text-netflix-light/40 text-sm mb-8"
      >
        Tunjukkan QR ini saat hadir di acara
      </m.p>

      <m.div
        initial={{ opacity: 0, scale: 0.8, rotateY: 20 }}
        whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, type: 'spring' }}
        className="inline-block bg-netflix-dark rounded-2xl p-5 sm:p-6 md:p-8 border border-netflix-gray/20 shadow-2xl"
      >
        {/* Category badge */}
        <m.div
          initial={{ scale: 0.95 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, type: 'spring' }}
          className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold mb-5 bg-gradient-to-r ${config.gradient} text-white shadow-lg`}
        >
          <span>{config.icon}</span>
          <span>{config.label}</span>
        </m.div>

        {/* QR Code */}
        {qrImage ? (
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mb-4"
          >
            <Image src={qrImage} alt="QR Code" width={300} height={300} className="mx-auto rounded-lg w-[200px] h-[200px] sm:w-[250px] sm:h-[250px]" />
          </m.div>
        ) : (
          <div className="w-[200px] h-[200px] sm:w-[250px] sm:h-[250px] bg-netflix-gray/20 rounded-lg mx-auto mb-4 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-netflix-red border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        <p className="font-bold text-base sm:text-lg">{guestName}</p>
        <p className="text-netflix-light/40 text-xs mt-1">
          Code: {code}
        </p>
      </m.div>
    </section>
  )
}
