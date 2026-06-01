'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import type { GiftAccount } from '@/types'

interface Props {
  giftAccounts: GiftAccount[]
}

function getCardStyle(name: string, type: string) {
  const n = name.toLowerCase()
  if (n.includes('bca')) return { bg: 'from-blue-900 to-blue-700', text: 'BCA', color: '#003d79' }
  if (n.includes('bni')) return { bg: 'from-orange-700 to-orange-500', text: 'BNI', color: '#f26522' }
  if (n.includes('bri')) return { bg: 'from-blue-800 to-blue-600', text: 'BRI', color: '#00529c' }
  if (n.includes('mandiri')) return { bg: 'from-blue-900 to-yellow-600', text: 'Mandiri', color: '#003876' }
  if (n.includes('bsi')) return { bg: 'from-teal-800 to-teal-600', text: 'BSI', color: '#00a99d' }
  if (n.includes('cimb')) return { bg: 'from-red-900 to-red-700', text: 'CIMB', color: '#7b0c10' }
  if (n.includes('dana')) return { bg: 'from-blue-600 to-cyan-500', text: 'DANA', color: '#108ee9' }
  if (n.includes('gopay')) return { bg: 'from-green-700 to-green-500', text: 'GoPay', color: '#00aa13' }
  if (n.includes('ovo')) return { bg: 'from-purple-800 to-purple-600', text: 'OVO', color: '#4c3494' }
  if (n.includes('shopee')) return { bg: 'from-orange-600 to-red-500', text: 'ShopeePay', color: '#ee4d2d' }
  if (n.includes('linkaja')) return { bg: 'from-red-700 to-red-500', text: 'LinkAja', color: '#e2231a' }
  if (type === 'ewallet') return { bg: 'from-green-800 to-green-600', text: name, color: '#22c55e' }
  return { bg: 'from-gray-800 to-gray-600', text: name, color: '#6b7280' }
}

export function GiftSection({ giftAccounts }: Props) {
  const [copied, setCopied] = useState('')

  function copyToClipboard(text: string, id: string) {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(''), 2000)
  }

  if (giftAccounts.length === 0) return null

  return (
    <section className="netflix-section">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="font-serif text-3xl sm:text-4xl font-bold text-center mb-3"
      >
        Amplop Digital
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="text-center text-netflix-light/40 text-xs sm:text-sm mb-8 max-w-md mx-auto leading-relaxed"
      >
        Doa restu Anda merupakan karunia yang sangat berarti bagi kami. Namun jika Anda ingin
        memberikan tanda kasih, kami menyediakan amplop digital.
      </motion.p>

      <div className="max-w-md mx-auto space-y-5">
        {giftAccounts.map((account, i) => {
          const style = getCardStyle(account.provider_name, account.type)
          return (
            <motion.div
              key={account.id}
              initial={{ opacity: 0, y: 30, rotateX: 10 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              whileHover={{ scale: 1.02, y: -4 }}
              className={`relative overflow-hidden rounded-2xl p-5 sm:p-6 bg-gradient-to-br ${style.bg} shadow-xl`}
            >
              {/* Card pattern overlay */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-white/20 -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-white/10 translate-y-1/2 -translate-x-1/2" />
              </div>

              {/* Card chip icon */}
              <div className="absolute top-4 right-4 sm:top-5 sm:right-5">
                {account.type === 'bank' ? (
                  <div className="w-10 h-7 rounded bg-yellow-400/80 border border-yellow-300/50 flex items-center justify-center">
                    <div className="w-6 h-4 border border-yellow-600/50 rounded-sm" />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Provider name / logo */}
              <div className="relative z-10 mb-4 sm:mb-5">
                <span className="text-white font-bold text-lg sm:text-xl tracking-wide">{style.text}</span>
              </div>

              {/* Account number */}
              <div className="relative z-10 mb-3">
                <p className="text-white/60 text-[10px] uppercase tracking-wider mb-1">
                  {account.type === 'bank' ? 'Nomor Rekening' : 'Nomor'}
                </p>
                <p className="text-white font-mono text-xl sm:text-2xl font-bold tracking-wider">
                  {account.account_number}
                </p>
              </div>

              {/* Account holder */}
              <div className="relative z-10 flex items-end justify-between">
                <div>
                  <p className="text-white/60 text-[10px] uppercase tracking-wider mb-0.5">Atas Nama</p>
                  <p className="text-white font-medium text-sm sm:text-base">{account.account_holder}</p>
                </div>

                {/* Copy button */}
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => copyToClipboard(account.account_number, account.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    copied === account.id
                      ? 'bg-green-500 text-white'
                      : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm'
                  }`}
                >
                  {copied === account.id ? 'Tersalin!' : 'Salin'}
                </motion.button>
              </div>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
